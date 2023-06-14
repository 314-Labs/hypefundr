<script lang="ts">
	import { getGameCover } from '$lib/util';
	import { supabase } from '@supabase/auth-ui-shared';
	import type { PageData } from './$types';
	import { Button, Modal, Toast } from 'flowbite-svelte';
	import GlowingPanel from './GlowingPanel.svelte';
	import type { PostgrestError } from '@supabase/supabase-js';
	export let data: PageData;
	let defaultModal = false;
	let pledgeInputVal: number = 0;
	let show = false;
	const pledgeMoney = async () => {
		const { error } = await data.supabase.from('pledges').insert({
			amount: pledgeInputVal,
			user_id: data.session!.user.id,
			campaign_id: data.campaign!.id
		});
		if (error) {
			console.log(error);
		}
		show = true;
	};

	const toggleLike = async () => {
		let error: PostgrestError | null;
		if (data.hasLiked) {
			error = (
				await data.supabase
					.from('campaign_likes')
					.delete()
					.eq('campaign_id', data.campaign!.id)
					.eq('user_id', data.session!.user.id)
			).error;
		} else {
			error = (
				await data.supabase.from('campaign_likes').insert({
					campaign_id: data.campaign!.id,
					user_id: data.session!.user.id
				})
			).error;
		}
		if (!error) {
			data.hasLiked = !data.hasLiked;
		}
	};

	const unlikeCampaign = async () => {};
</script>

<Toast color="green" class="fixed right-5 top-5" bind:open={show}>
	<svelte:fragment slot="icon">
		<svg
			aria-hidden="true"
			class="w-5 h-5"
			fill="currentColor"
			viewBox="0 0 20 20"
			xmlns="http://www.w3.org/2000/svg"
			><path
				fill-rule="evenodd"
				d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
				clip-rule="evenodd"
			/></svg
		>
		<span class="sr-only">Check icon</span>
	</svelte:fragment>
	Pledge succeeded.
</Toast>

<div class="bg-gradient-to-r from-indigo-700 via-purple-700 to-pink-700">
	<div class="max-w-lg py-16 text-center mx-auto">
		<h1 class="text-3xl font-semibold text-white lg:text-4xl">
			{data.campaign?.title}
		</h1>
		{#if data.campaign?.tagline}
			<p class="mt-6 text-slate-300 italic">
				{data.campaign?.tagline}
			</p>
		{/if}
	</div>
</div>
<div
	class="container mx-auto flex md:flex-row-reverse py-10 px-1 flex-col lg:px-20 lg:py-24 lg:max-w-7xl gap-8"
>
	<div class="md:w-72 flex-grow md:flex-none space-y-4">
		<div>
			<img
				src={getGameCover(data.supabase, data.campaign.game_id)}
				alt="Eight shirts arranged on table in black, olive, grey, blue, white, red, mustard, and green."
				class="w-full object-cover object-center rounded-sm"
			/>
			<h3 class="text-gray-300 text-xl mt-2 font-semibold">
				{data.campaign.games.title}
			</h3>
			<p class="text-gray-500">Survival</p>
		</div>

		<hr class="w-full border-t border-gray-300" />
		<GlowingPanel pledged={data.pledgeAmount} goal={data.campaign?.goal} />
		<div>
			<Button
				on:click={() => (defaultModal = true)}
				btnClass="w-full px-6 py-2 font-medium tracking-wide  capitalize transition-colors duration-300 transform bg-gray-100 text-slate-900 rounded-sm hover:bg-gray-300 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-80"
				>Pledge</Button
			>
			<Button
				on:click={toggleLike}
				btnClass="w-full px-6 py-2 font-medium tracking-wide  capitalize transition-colors duration-300 transform text-slate-100 border-slate-100 border-2 rounded-sm hover:bg-gray-800 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-80 mt-4"
				>{#if data.hasLiked} Unlike {:else} Like {/if}</Button
			>
		</div>
	</div>
	<div class="flex-grow text-slate-400">
		<div class="flex flex-wrap w-full">
			<div class="lg:w-1/2 w-full mb-6 lg:mb-0">
				<h2 class="sm:text-3xl text-2xl font-medium title-font mb-2 text-gray-200">Participants</h2>
				<div class="h-1 w-20 bg-indigo-500 rounded" />
			</div>
		</div>
		<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 mt-4">
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
					<a href="#" class="focus:outline-none">
						<span class="absolute inset-0" aria-hidden="true" />
						<p class="text-sm font-medium text-gray-300">Leslie Alexander</p>
						<p class="truncate text-sm text-gray-500">Co-Founder / CEO</p>
					</a>
				</div>
			</div>
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
					<a href="#" class="focus:outline-none">
						<span class="absolute inset-0" aria-hidden="true" />
						<p class="text-sm font-medium text-gray-300">Leslie Alexander</p>
						<p class="truncate text-sm text-gray-500">Co-Founder / CEO</p>
					</a>
				</div>
			</div>
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
					<a href="#" class="focus:outline-none">
						<span class="absolute inset-0" aria-hidden="true" />
						<p class="text-sm font-medium text-gray-300">Leslie Alexander</p>
						<p class="truncate text-sm text-gray-500">Co-Founder / CEO</p>
					</a>
				</div>
			</div>
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
					<a href="#" class="focus:outline-none">
						<span class="absolute inset-0" aria-hidden="true" />
						<p class="text-sm font-medium text-gray-300">Leslie Alexander</p>
					</a>
				</div>
			</div>
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
					<a href="#" class="focus:outline-none">
						<span class="absolute inset-0" aria-hidden="true" />
						<p class="text-sm font-medium text-gray-300">Leslie Alexander</p>
						<p class="truncate text-sm text-gray-500">Co-Founder / CEO</p>
					</a>
				</div>
			</div>
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
					<a href="#" class="focus:outline-none">
						<span class="absolute inset-0" aria-hidden="true" />
						<p class="text-sm font-medium text-gray-300">Leslie Alexander</p>
						<p class="truncate text-sm text-gray-500">Co-Founder / CEO</p>
					</a>
				</div>
			</div>
		</div>

		<div class="flex flex-wrap w-full mt-8">
			<div class="lg:w-1/2 w-full mb-6 lg:mb-0">
				<h2 class="sm:text-3xl text-2xl font-medium title-font mb-2 text-gray-200">Details</h2>
				<div class="h-1 w-20 bg-indigo-500 rounded" />
			</div>
		</div>
		<div class="mt-4">{@html data.campaign?.description}</div>
	</div>
</div>

<Modal title="Pledge le monaaay" bind:open={defaultModal} autoclose>
	<div class="flex items-center justify-center pb-6">
		<form>
			<div
				class="flex flex-col p-1.5 overflow-hidden border rounded-lg dark:border-gray-600 lg:flex-row dark:focus-within:border-blue-300 focus-within:ring focus-within:ring-opacity-40 focus-within:border-blue-400 focus-within:ring-blue-300"
			>
				<input
					class="outline-none bg-white disabled:bg-gray-200 focus:outline-none p-2 w-full"
					name="amount"
					placeholder="ze money"
					aria-label="ze money"
					autocomplete="off"
					bind:value={pledgeInputVal}
				/>
				<button
					on:click={pledgeMoney}
					class="px-4 py-3 text-sm font-medium tracking-wider text-gray-100 uppercase transition-colors duration-300 transform bg-gray-700 rounded-md hover:bg-gray-600 focus:bg-gray-600 focus:outline-none"
					>Pledge</button
				>
			</div>
		</form>
	</div>
</Modal>
