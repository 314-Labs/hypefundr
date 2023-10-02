import type { Actions } from './$types';
import stripe from '$lib/stripe';
import { redirect } from '@sveltejs/kit';
import { PUBLIC_HOSTNAME } from '$env/static/public';
export const actions = {
	default: async ({ request, locals: { getSession } }) => {
		const session = await getSession();
		if (!session) throw (403);

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
			success_url: `${PUBLIC_HOSTNAME}/success`,
			cancel_url: `${PUBLIC_HOSTNAME}/cancel`,
			metadata: {
				user_id: session.user.id
			}
		});
		throw redirect(303, stripeSession.url!);
	},
} satisfies Actions;