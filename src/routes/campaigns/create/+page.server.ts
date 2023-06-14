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

        if (isNaN(gameId) || isNaN(gameModeId)) {
            throw new Error('Invalid gameId or gameModeId provided, they must be valid numbers.');
        }
        
        const userIds = form.getAll("userIds").map(value => parseInt(value as string));

        // Additional validation could be performed on userIds if necessary
        
        const slug = title.toLowerCase().replaceAll(" ", "-");
        
        const {data, error } = await supabase.from("campaigns").insert({title, description, game_id: gameId, game_mode: gameModeId, creator: session?.user.id, tagline: tagline, slug: slug}).select('id');
        if(error != null) throw error;

    }
} satisfies Actions;

export const ssr = false;