import client from '$lib/edgedb';
import e from '$db';
import { t } from '$lib/trpc/t';
import { z } from 'zod';
import { Game } from '$db/modules/default';
import { TRPCError } from '@trpc/server';
import { auth } from '../middleware/auth';
import { insertCreditTransaction } from '$lib/credits';

export const campaigns = t.router({
	list: t.procedure.query(() =>
		e
			.select(e.Campaign, (campaign) => ({
				id: true,
				title: true,
				tagline: true,
				slug: true,
				game: {
					id: true,
					title: true,
					poster_image: true
				}
			}))
			.run(client)
	),
	getBySlug: t.procedure.input(z.string()).query(({ input }) =>
		e
			.select(e.Campaign, (campaign) => ({
				id: true,
				title: true,
				tagline: true,
				description: true,
				goal: true,
				closed: true,
				participants: {
					id: true,
					name: true,
					image: true
				},
				game: {
					id: true,
					title: true,
					poster_image: true
				},
				billing_account: {
					balance: true
				},
				upvote_count: true,
				filter_single: e.op(campaign.slug, '=', input)
			}))
			.run(client)
	),
	createCampaign: t.procedure
		.use(auth)
		.input(
			z.object({
				title: z.string(),
				tagline: z.string().optional(),
				userIds: z.array(z.string()),
				description: z.string(),
				gameId: z.string()
			})
		)
		.mutation(({ input, ctx }) => {
			if (!ctx.session?.user) {
				throw new TRPCError({ code: 'UNAUTHORIZED' });
			}
			const slug = input.title.trim().toLowerCase().replaceAll(' ', '-');
			const query = e.params(
				{
					participantIds: e.array(e.uuid)
				},
				(params) =>
					e.insert(e.Campaign, {
						title: input.title,
						tagline: input.tagline,
						description: input.description,
						slug,
						game: e.select(e.Game, (game) => ({
							filter_single: {
								id: input.gameId
							}
						})),
						creator: e.select(e.User, (user) => ({
							filter_single: {
								id: ctx.session!.user.id
							}
						})),
						participants: e.select(e.User, (user) => ({
							filter: e.op(user.id, 'in', e.array_unpack(params.participantIds))
						}))
					})
			);
			return query.run(client, { participantIds: input.userIds });
		}),
	pledge: t.procedure
		.use(auth)
		.input(z.object({
			campaignId: z.string(),
			numCredits: z.number()
		})).mutation(async ({ input: { campaignId, numCredits }, ctx: { session } }) => {

			const campaignQuery = e.select(e.Campaign, campaign => ({ filter_single: { id: campaignId } }));
			const userQuery = e.select(e.User, user => ({ filter_single: { id: session!.user.id } }))

			await client.transaction(async tx => {

				const updateCampaignBalance = e.update(e.BillingAccount, ba => ({
					set: {
						balance: e.op(ba.balance, '+', numCredits)
					},
					filter_single: { id: campaignQuery.billing_account.id }
				}));

				const updateUserBalance = e.update(e.BillingAccount, ba => ({
					set: {
						balance: e.op(ba.balance, '-', numCredits)
					},
					filter_single: { id: userQuery.billing_account.id }
				}));

				const campaignPosting = e.insert(e.Posting, {
					amount: numCredits,
					account: campaignQuery.billing_account
				});

				const userPosting = e.insert(e.Posting, {
					amount: -numCredits,
					account: userQuery.billing_account
				});

				const creditTransaction = e.insert(e.CreditTransaction, {
					notes: "Campaign pledge",
					postings: e.set(campaignPosting, userPosting)
				});

				const insertPledge = e.insert(e.Pledge, {
					campaign: campaignQuery,
					user: userQuery,
					credit_transaction: creditTransaction,
					num_credits: numCredits
				})
				await updateCampaignBalance.run(tx);
				await updateUserBalance.run(tx);
				await insertPledge.run(tx);
			})

		}),

	upvote: t.procedure.use(auth).input(z.string()).mutation(({ input, ctx }) => {
		return e
			.insert(e.UserUpvote, {
				campaign: e.select(e.Campaign, (campaign) => ({
					filter_single: {
						id: input
					}
				})),
				user: e.select(e.User, (user) => ({
					filter_single: {
						id: ctx.session!.user.id
					}
				}))
			})
			.run(client)
	}),

	removeUpvote: t.procedure.use(auth).input(z.string()).mutation(({ input, ctx }) =>
		e.delete(e.UserUpvote, (row) => ({
			filter_single: e.op(e.op(row.campaign.id, '=', e.uuid(input)), 'and', e.op(row.user.id, '=', e.uuid(ctx.session!.user.id)))
		})).run(client)),

	closeAndDistribute: t.procedure.use(auth).input(z.string()).mutation(async ({ input, ctx }) => {
		client.transaction(async tx => {

			/**
			 * steps:
			 * 1. close campaign
			 * 2. calculate payouts and insert postings + transaction for payouts and the withdrawal of all campaign credits
			 * 3. update account balances
			 * 4. insert Payout rows
			 */
			const campaign = await e.select(e.Campaign, c => ({
				id: true,
				filter_single: { id: input },
				billing_account: {
					id: true,
					balance: true
				},
				participants: {
					id: true,
					billing_account: {
						id: true,
						balance: true
					}
				}
			})).run(tx);

			if (!campaign) throw new TRPCError({ code: 'NOT_FOUND' });

			// Step 1: close campaign
			await e.update(e.Campaign, c => ({
				set: {
					closed: true
				},
				filter_single: {
					id: input
				}
			})).run(tx);



			// step 2: calculate payouts and insert postings + transaction for payouts and the withdrawal of all campaign credits
			// calculate the split between the different participants
			const payouts: number[] = Array(campaign.participants.length).fill(Math.floor(campaign.billing_account.balance / campaign.participants.length));
			for (let i = 0; i < campaign.billing_account.balance % campaign.participants.length; i++) {
				payouts[i]++;
			}

			const amountAccountTuples = payouts.map((x, i) => ({ amount: x, accountId: campaign.participants[i].billing_account.id }));
			const amountUserTuples = payouts.map((x, i) => ({ amount: x, userId: campaign.participants[i].id }));


			// add the posting where we withdraw all credits from the campaing account
			amountAccountTuples.push({ amount: -campaign.billing_account.balance, accountId: campaign.billing_account.id });

			const insertedTransacId = await insertCreditTransaction(amountAccountTuples, tx);

			// step 4: insert Payout rows

			const insertPayoutRows = e.params({ userAmounts: e.array(e.tuple({ amount: e.int64, userId: e.uuid })) }, (params) => {
				return e.for(e.array_unpack(params.userAmounts), (item) => {
					return e.insert(e.Payout, {
						user: e.select(e.User, u => ({ filter_single: { id: item.userId } })),
						num_credits: item.amount,
						campaign: e.select(e.Campaign, c => ({ filter_single: { id: campaign.id } })),
						credit_transaction: e.select(e.CreditTransaction, ct => ({ filter_single: { id: insertedTransacId } }))
					});
				});
			});

			await insertPayoutRows.run(tx, { userAmounts: amountUserTuples });
		});
	})
})
