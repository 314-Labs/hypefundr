<script lang="ts">
	import Autocomplete from './autocomplete.svelte';
	export let data;
	import ComboBox from '$lib/components/ComboBox/ComboBox.svelte';
	import { getGameCover } from '$lib/util';
	import Editor from '@tinymce/tinymce-svelte';
	let gameId: number | undefined = undefined;
	let gameModeComboBox: ComboBox<Awaited<ReturnType<typeof fetchGameModes>>[number]>;
	let descriptionText: string = '';
	const fetchGames = async (title: string) => {
		gameModeComboBox.clear();
		const { data: gameResult, error } = await data.supabase
			.from('games')
			.select('id, title')
			.ilike('title', `%${title}%`)
			.limit(10);

		if (error) {
			console.error('Error searching games:', error);
			return [];
		} else {
			return gameResult.map((game) => ({
				id: game.id,
				text: game.title,
				cover: getGameCover(data.supabase, game.id),
				disabled: false
			}));
		}
	};

	const fetchGameModes = async (modeName: string) => {
		if (gameId == undefined) return [];
		const { data: modeResult, error } = await data.supabase
			.from('game_modes')
			.select('id, mode')
			.ilike('mode', `%${modeName}%`)
			.eq('game_id', gameId)
			.limit(10);

		if (error) {
			console.error('Error searching game modes:', error);
			return [];
		} else {
			return modeResult.map((gameMode) => ({
				id: gameMode.id,
				text: gameMode.mode,
				disabled: false
			}));
		}
	};

	const fetchUsers = async (username: string) => {
		const { data: modeResult, error } = await data.supabase
			.from('profiles')
			.select('id, username')
			.ilike('username', `%${username}%`)
			.limit(10);

		if (error) {
			console.error('Error searching game modes:', error);
			return [];
		} else {
			return modeResult.map((user) => ({
				id: user.id,
				text: user.username!,
				disabled: false
			}));
		}
	};
</script>

<section class="">
	<div class="py-8 px-4 mx-auto lg:max-w-7xl lg:py-16">
		<h2 class="mb-4 text-xl font-bold text-gray-900 text-white">Create a new campaign</h2>
		<form method="post">
			<div class="grid gap-4 sm:grid-cols-2 sm:gap-6">
				<div class="sm:col-span-2">
					<label for="title" class="block mb-2 text-sm font-medium">Campaign Title</label>
					<input
						type="text"
						name="title"
						id="title"
						class="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
						placeholder="Type campaign name"
						required
					/>
				</div>
				<div class="sm:col-span-2">
					<label for="name" class="block mb-2 text-sm font-medium">Add Users</label>

					<div
						class="relative flex items-center space-x-3 rounded-sm bg-gray-800 px-6 py-5 shadow-sm focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:border-gray-400"
					>
						<div class="flex-shrink-0">
							<img
								class="h-10 w-10 rounded-full"
								src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
								alt=""
							/>
						</div>
						<div class="min-w-0 flex-1">
							<div class="focus:outline-none">
								<p class="text-sm font-medium text-gray-300">Leslie Alexander</p>
							</div>
						</div>
						<a href="/asdfszdf" target="_blank" class="ml-auto text-sm text-blue-400">Profile</a>
						<button
							type="button"
							class="rounded-full bg-indigo-600 p-1 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
						>
							<svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
								<path
									d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z"
								/>
							</svg>
						</button>
					</div>

					<ComboBox
						class="mt-4"
						titleText="Users"
						name="user-select"
						placeholder="Select Campaign Users"
						optionsFetcher={fetchUsers}
						let:item
					/>
				</div>
				<div class="w-full">
					<label for="game-select" class="block mb-2 text-sm font-medium">Game</label>
					<ComboBox
						titleText="Game"
						placeholder="Select Game"
						name="game-select"
						trueName="gameId"
						optionsFetcher={fetchGames}
						let:item
						bind:selectedId={gameId}
					>
						<div class="flex items-center px-2 py-1">
							<img src={item.cover} class="w-10 mr-2" alt="{item.text} cover" />
							{item.text}
						</div>
					</ComboBox>
				</div>

				<div class="w-full">
					<label for="gameMode" class="block mb-2 text-sm font-medium">Game Mode</label>

					<ComboBox
						placeholder="Select Game Mode"
						name="gameMode"
						trueName="gameModeId"
						optionsFetcher={fetchGameModes}
						let:item
						bind:this={gameModeComboBox}
						disabled={gameId == undefined}
					/>
				</div>

				<div class="sm:col-span-2">
					<label for="tagline" class="block mb-2 text-sm font-medium">Tagline (optional)</label>

					<textarea
						name="tagline"
						id="tagline"
						class="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
					/>
				</div>
				<div class="sm:col-span-2">
					<label for="description" class="block mb-2 text-sm font-medium">Description</label>
					<!-- works in conjunction with vite.config.ts -->
					<Editor
						scriptSrc="/tinymce/tinymce.min.js"
						conf={{ promotion: false, skin: 'oxide-dark', content_css: 'dark' }}
						id="description"
						bind:value={descriptionText}
					/>
					<input type="hidden" bind:value={descriptionText} name="description" />
				</div>
			</div>
			<button
				type="submit"
				class=" px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-white bg-primary-700 focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-primary-800 w-full"
			>
				Create Campaign
			</button>
		</form>
	</div>
</section>
