<script lang="ts">
	import type { SupabaseClient } from '@supabase/supabase-js';
	import { onMount } from 'svelte';
	import type { Database } from '$lib/database.types';

	export let supabase: SupabaseClient<Database>;

	let isListOpen = false;

	let search = '';
	interface GameItem {
		id: number;
		cover: string;
		title: string;
	}
	let games: Array<GameItem> = [];
	let selectedGame = null;

	const getGameCover = (id: number) =>
		supabase.storage.from('games').getPublicUrl(`images/${id}/cover.jpg`).data.publicUrl;

	const searchGames = async () => {
		if (search.length === 0) {
			games = [];
			return;
		}

		const { data, error } = await supabase
			.from('games')
			.select('id, title')
			.ilike('title', `%${search}%`)
			.limit(10);

		if (error) {
			console.error('Error searching games:', error);
			games = [];
		} else if (data) {
			games = data.map((game) => ({ ...game, cover: getGameCover(game.id) }));
		}
	};

	$: searchGames(), search;

	const selectGame = (game: GameItem) => {
		selectedGame = game;
		search = game.title;
		games = [];
	};
</script>

<div class="relative">
	<input class="border p-2 rounded w-full" on:click={searchGames} />

	<div
		hidden={!isListOpen}
		class="absolute top-full mt-1 w-full bg-white border border-gray-300 rounded overflow-y-auto max-h-48"
	>
		{#each games as game (game.id)}
			<div
				class="flex items-center px-2 py-1 hover:bg-gray-200 cursor-pointer"
				on:click={() => selectGame(game)}
			>
				<img src={game.cover} alt={game.title} class="w-10 mr-2" />
				<span>{game.title}</span>
			</div>
		{/each}
	</div>
</div>
