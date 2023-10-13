import client from '$lib/edgedb';
import e from '$db';
import { t } from '$lib/trpc/t';
import { z } from 'zod';
export const games = t.router({
	list: t.procedure.input(z.string()).query(({ input }) =>
		e
			.select(e.Game, (game) => ({
				id: true,
				title: true,
				poster_image: true,
				filter: e.op(game.title, 'ilike', `%${input}%`),
				limit: 10
			}))
			.run(client)
	)
});
