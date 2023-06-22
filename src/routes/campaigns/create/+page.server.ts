import type { Actions } from './$types';
import { router } from '$lib/trpc/router';
import { createContext } from '$lib/trpc/context';

export const actions = {
	default: async (event) => {
		const session = await event.locals.getSession();
		if (session == undefined) throw new Error('Must be logged in');
		const form = await event.request.formData();
		const title = (form.get('title') as string).trim();
		const tagline = (form.get('tagline') as string).trim();
		const description = (form.get('description') as string).trim();

		const gameId = form.get('gameId') as string;
		const gameModeId = form.get('gameModeId') as string;

		const userIds = form.getAll('userIds').map((value) => value as string);

		await router.createCaller(await createContext(event)).campaigns.createCampaign({
			title,
			tagline,
			description,
			userIds,
			gameId
		});
	}
} satisfies Actions;

export const ssr = false;
