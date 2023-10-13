import type { Actions, PageServerLoad } from './$types';
import stripe from '$lib/stripe';
import { error, redirect } from '@sveltejs/kit';
import { PUBLIC_ORIGIN } from '$env/static/public';
import e from '$db';
import client from '$lib/edgedb';
import { insertCreditTransaction } from '$lib/credits';


export const load: PageServerLoad = async ({ locals: { getSession } }) => {
	const session = await getSession();
	if (!session) throw error(403);

	const user = await e.select(e.User, user => ({
		filter_single: { id: session.user.id },
		billing_account: {
			balance: true
		},
		stripe_connected_account: true
	})).run(client);

	if (!user) throw error(500, "Please sign out and in again");

	const creditPurchases = await e.select(e.CreditPurchase, c => ({
		filter: e.op(c.user.id, '=', e.uuid(session.user.id)),
		created_at: true,
		num_credits: true,
		fiat_paid: true
	})).run(client);

	const creditWithdrawals = await e.select(e.CreditWithdrawal, c => ({
		filter: e.op(c.user.id, '=', e.uuid(session.user.id)),
		created_at: true,
		num_credits: true,
		fiat_earned: true
	})).run(client);

	return { user, creditPurchases, creditWithdrawals };
};

export const actions = {
	purchase: async ({ request, locals: { getSession } }) => {
		const session = await getSession();
		if (!session) throw error(403);

		const data = await request.formData();
		const price_id = data.get('price_id')!.toString();
		const stripeSession = await stripe.checkout.sessions.create({
			line_items: [
				{
					price: price_id,
					quantity: 1,
				},
			],
			mode: 'payment',
			success_url: `${PUBLIC_ORIGIN}/settings/funding`,
			cancel_url: `${PUBLIC_ORIGIN}/settings/funding`,
			metadata: {
				user_id: session.user.id
			}
		});
		throw redirect(303, stripeSession.url!);
	},
	// TODO: make this idempotent
	withdraw: async ({ request, locals: { getSession } }) => {
		const session = await getSession();
		if (!session) throw error(403);
		const user = await e.select(e.User, u => ({
			filter_single: { id: session.user.id },
			stripe_connected_account: true,
			billing_account: {
				id: true,
				balance: true
			}
		})).run(client);

		const withdrawSinkAccount = await e.select(e.BillingAccount, ba => ({
			filter_single: e.op(ba.special_account_type, '=', e.SpecialAccount.StripeConnect),
			id: true
		})).run(client);

		if (!user) throw error(500, "can't find user");

		if (user.stripe_connected_account) {
			await stripe.transfers.create({
				amount: user.billing_account.balance, // 1 credit to 1 cent
				currency: "usd",
				destination: user.stripe_connected_account
			});

			// stripe connected account exists, convert credits to usd and send it to user's account
			await client.transaction(async tx => {
				const postings = [
					{
						accountId: withdrawSinkAccount!.id,
						amount: user.billing_account.balance
					},
					{
						accountId: user.billing_account.id,
						amount: -user.billing_account.balance
					}
				]
				await insertCreditTransaction(postings, tx, "Credit withdrawal");
			});

		}
		else {
			// create stripe connected account for user and redirect them there for onboarding
			const account = await stripe.accounts.create({
				type: 'express',
			});
			await e.update(e.User, u => ({
				set: {
					stripe_connected_account: account.id
				},
				filter_single: {
					id: e.uuid(session.user.id)
				}
			})).run(client);

			const accountLink = await stripe.accountLinks.create({
				account: account.id,
				refresh_url: `${PUBLIC_ORIGIN}/stripe/connected-account-refresh`,
				return_url: `${PUBLIC_ORIGIN}/settings/billing`,
				type: 'account_onboarding',
			});
			throw redirect(303, accountLink.url);
		}
	}
} satisfies Actions;