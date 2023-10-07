import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { router } from '$lib/trpc/router';
import { createContext } from '$lib/trpc/context';
import e from '$db';
import client from '$lib/edgedb';
export const load: PageServerLoad = async (event) => {
	const {
		params: { slug },
		locals: { getSession }
	} = event;

	if (slug != slug.toLowerCase()) throw redirect(301, `/campaigns/${slug.toLowerCase()}`);
	const caller = router.createCaller(await createContext(event));

	const campaign = await caller.campaigns.getBySlug(slug);

	if (!campaign) {
		throw error(404);
	}

	const session = await getSession();
	let likedCampaign = false;

	if (session) {
		const likeRowCount = await e
			.select(
				e.count(
					e.select(e.UserUpvote, (row) => ({
						filter_single: e.op(
							e.op(row.campaign.id, '=', e.uuid(campaign.id)),
							'and',
							e.op(row.user.id, '=', e.uuid(session.user.id))
						)
					}))
				)
			)
			.run(client);
		likedCampaign = likeRowCount == 1;
		console.log(session);
	}
	return { campaign, likedCampaign, slug };
};
