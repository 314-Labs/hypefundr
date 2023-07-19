import { SvelteKitAuth } from '@auth/sveltekit';
import { TWITCH_CLIENT_ID, TWITCH_CLIENT_SECRET } from '$env/static/private';
import { EdgeDBAdapter } from '$lib/authjs-edgedb-adapter';
import Twitch from '@auth/core/providers/twitch';
import GitHub from '@auth/core/providers/github';
import { client } from '$lib/edgedb';
import { sequence } from '@sveltejs/kit/hooks';
import { createTRPCHandle } from 'trpc-sveltekit';
import { router } from '$lib/trpc/router';
import { createContext } from '$lib/trpc/context';

export const handle = sequence(
	SvelteKitAuth({
		adapter: EdgeDBAdapter(client),
		providers: [Twitch({ clientId: TWITCH_CLIENT_ID, clientSecret: TWITCH_CLIENT_SECRET })]
	}),
	createTRPCHandle({ router, createContext })
);
