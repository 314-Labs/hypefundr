import type { PageServerLoad } from "./$types";
import e from "$db";
import client from "$lib/edgedb";

export const load: PageServerLoad = async ({ locals: { getSession } }) => {

    const session = await getSession();
    let payouts = session ? await e.select(e.Payout, p => ({
        filter: e.op(p.user.id, '=', e.uuid(session.user.id)),
        campaign: {
            title: true
        },
        num_credits: true,
        created_at: true
    })).run(client) : [];

    return { payouts };
};