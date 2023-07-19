import { error, redirect } from '@sveltejs/kit';
import { router } from '$lib/trpc/router';
import { createContext } from '$lib/trpc/context';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	const campaigns = await router.createCaller(await createContext(event)).campaigns.list();
	return { campaigns }
};
