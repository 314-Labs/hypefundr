import { client } from '$lib/edgedb';
import e from '$db';
import { t } from '$lib/trpc/t';
import { z } from 'zod';
import { Game } from '$db/modules/default';

const getPledgedAmount = (campaignId: string) =>
	e
		.select(
			e.sum(
				e.select(e.Pledge, (pledge) => ({
					filter: e.op(pledge.campaign.id, '=', e.uuid(campaignId))
				})).amount
			)
		)
		.run(client);

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
					title: true
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
					title: true
				},
				filter_single: e.op(campaign.slug, '=', input)
			}))
			.run(client)
	),
	createCampaign: t.procedure
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
						creator: e.select(e.auth.User, (user) => ({
							filter_single: {
								email: ctx.session!.user!.email!
							}
						})),
						participants: e.select(e.auth.User, (user) => ({
							filter: e.op(user.id, 'in', e.array_unpack(params.participantIds))
						}))
					})
			);
			return query.run(client, { participantIds: input.userIds });
		}),

	getPledgedAmount: t.procedure.input(z.string()).query(({ input }) => getPledgedAmount(input)),
	pledge: t.procedure
		.input(
			z.object({
				amount: z.string(),
				campaignId: z.string()
			})
		)
		.mutation(async ({ input, ctx }) => {
			await e
				.insert(e.Pledge, {
					amount: e.decimal(input.amount),
					user: e.select(e.auth.User, (user) => ({
						filter_single: {
							email: ctx.session!.user!.email!
						}
					})),
					campaign: e.select(e.Campaign, (user) => ({
						filter_single: {
							id: input.campaignId
						}
					}))
				})
				.run(client);
			return getPledgedAmount(input.campaignId);
		}),
	likeCampaign: t.procedure.input(z.string()).mutation(({ input, ctx }) =>
		e
			.insert(e.UserLike, {
				campaign: e.select(e.Campaign, (campaign) => ({
					filter_single: {
						id: input
					}
				})),
				user: e.select(e.auth.User, (user) => ({
					filter_single: {
						email: ctx.session?.user!.email!
					}
				}))
			})
			.run(client)
	),
	cancelLikeCampaign: t.procedure.input(z.string()).mutation(({ input, ctx }) =>
			e.delete(e.UserLike,(row) => ({
				filter_single: e.op(e.op(row.campaign.id, '=', e.uuid(input)), 'and', e.op(row.user.email, '=', ctx.session!.user!.email!))
			})).run(client))
});
