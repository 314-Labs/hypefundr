import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { router } from '$lib/trpc/router';
import { createContext } from '$lib/trpc/context';
import e from '$db';
import { client } from '$lib/edgedb';

export const load: PageServerLoad = async (event) => {
    const { pledgeId } = event.params;

    const pledge = await e.select(e.TentativePledge, (p) => ({
        filter_single: { id: pledgeId },
        amount: true,
        created_at: true,
        campaign: {
            id: true,
            title: true
        }
    })).run(client);
    if (!pledge) throw error(404);
    return {
        pledge,
    };
};