import { error, redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load =  (async ({parent}) => {
    
    const {supabase, session} = await parent();
    const { data: campaigns } = await supabase.from('campaigns').select('*,  games (title)');

    return {campaigns};
}) satisfies PageLoad;