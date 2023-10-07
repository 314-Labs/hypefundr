import client from '$lib/edgedb';
import e from '$db';
import { t } from '$lib/trpc/t';
import { z } from 'zod';
export const users = t.router({
	list: t.procedure.input(z.string()).query(({ input }) =>
		e
			.select(e.User, (user) => ({
				id: true,
				name: true,
				image: true,
				filter: e.op(user.name, 'ilike', `%${input}%`),
				limit: 10
			}))
			.run(client)
	)
});
