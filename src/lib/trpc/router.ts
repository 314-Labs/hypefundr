import type { Context } from '$lib/trpc/context';
import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server';
import { games } from '$lib/trpc/routes/games';
import { users } from '$lib/trpc/routes/users';
import { t } from '$lib/trpc/t';
import { campaigns } from './routes/campaigns';

export const router = t.router({
	games,
	users,
	campaigns
});

export type Router = typeof router;

// 👇 type helpers 💡
export type RouterInputs = inferRouterInputs<Router>;
export type RouterOutputs = inferRouterOutputs<Router>;
