import { error, redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load =  (async ({params: {slug}, parent}) => {
    if(slug != slug.toLowerCase()) return redirect(301, `/campaigns/${slug.toLowerCase()}`);
    
    const {supabase, session} = await parent();
    const { data: campaign } = await supabase.from('campaigns').select('*, games (title)').eq('slug', slug).single();
    if(!campaign) {
        throw error(404, {
            message: 'Campaign not found'
        });
    }
    const { data: pledgeQueryRes} = await supabase.rpc('get_pledge_total', { campaign_id: campaign.id }) ?? 0;
    const pledgeAmount = pledgeQueryRes  ?? 0;
    let hasLiked = false;
    if(session){
        const { count: likeCount} = await supabase.from('campaign_likes').select('*', { count: 'exact', head: true }).eq('campaign_id', campaign.id).eq('user_id', session.user.id);
        hasLiked = likeCount == 1;
    }
    const { data: participants, error: fuck } = await supabase.from('campaign_participants').select('*, profiles (username)').eq('campaign_id', campaign.id);
    return {campaign, pledgeAmount, hasLiked, participants};
}) satisfies PageLoad;