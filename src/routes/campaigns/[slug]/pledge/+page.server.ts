import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { router } from '$lib/trpc/router';
import { createContext } from '$lib/trpc/context';

export const load: PageServerLoad = async (event) => {
    const { url, params } = event;
    const { slug } = params;
    const amount = url.searchParams.get('amount');
    if (amount == null) {

        const parts = url.pathname.split('/');
        if (parts[parts.length - 1] === '') {
            parts.pop();   // Remove the trailing empty part if exists
        }
        parts.pop();   // Remove last element
        const result = parts.join('/');
        throw redirect(302, parts.join('/'));
    }
    const caller = router.createCaller(await createContext(event));
    const campaign = await caller.campaigns.getBySlug(slug);
    if (!campaign) throw error(404);
    return {
        amount,
        campaign
    };
};