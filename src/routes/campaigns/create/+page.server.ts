import type { Actions } from './$types';

export const actions = {
    default: async ({request, locals: { supabase, getSession } }) => {
        const session = await getSession();
        if(session == undefined) throw new Error("Must be logged in");
        const form = await request.formData();
        const title = (form.get("title") as string).trim();
        const tagline = (form.get("tagline") as string).trim();
        const description = (form.get("description") as string).trim();

        const gameIdString = form.get("gameId") as string;
        const gameModeIdString = form.get("gameModeId") as string;

        const gameId = parseInt(gameIdString as string);
        const gameModeId = parseInt(gameModeIdString as string);

        if (isNaN(gameId)) {
            throw new Error('Invalid gameId ');
        }
        
        const userIds = form.getAll("userIds").map(value => value as string);

        
        const slug = title.toLowerCase().replaceAll(" ", "-");
        
        const {data, error } = await supabase.from("campaigns").insert({title, description, game_id: gameId, game_mode: gameModeId, creator: session?.user.id, tagline: tagline, slug: slug}).select('id').single();
        if(!data) {
            throw new Error("Failed to insert campaign row");
        }
        for(let i = 0; i < userIds.length; i++) {
            // this is a no no. Transactions should be used. But this is also a proof of concept so it doesn't matter.
            await supabase.from("campaign_participants").insert({campaign_id: data.id, user_id: userIds[i]});
        }
        if(error != null) throw error;
    }
} satisfies Actions;

export const ssr = false;