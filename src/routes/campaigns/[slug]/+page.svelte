<script lang="ts">
	import type { PageData } from './$types';
	import GlowingPanel from './GlowingPanel.svelte';
	import { trpc } from '$lib/trpc/client';
	import { goto } from '$app/navigation';
	import { createDialog } from 'svelte-headlessui';
	import Transition from 'svelte-transition';

	const successDialog = createDialog({ label: 'Payment Success' });
	const pledgeDialog = createDialog({ label: 'Pledge Your Credits' });
	export let data: PageData;
	$: campaign = data.campaign;
	let pledgeInputVal = '';

	const toggleLike = async () => {
		if (!data.likedCampaign) {
			await trpc().campaigns.upvote.mutate(campaign.id);
			campaign.upvote_count++;
		} else {
			await trpc().campaigns.removeUpvote.mutate(campaign.id);
			campaign.upvote_count--;
		}
		data.likedCampaign = !data.likedCampaign;
	};

	const distributeFunds = async () => {
		await trpc().campaigns.closeAndDistribute.mutate(campaign.id);
	};

	const pledge = async (inputVal: string) => {
		const numCredits = parseInt(inputVal);
		if (!numCredits || numCredits < 1) return;
		await trpc().campaigns.pledge.mutate({ campaignId: campaign.id, numCredits });
		data.campaign.billing_account.balance += numCredits;
	};
</script>

<div class="bg-gradient-to-r from-indigo-700 via-purple-700 to-pink-700">
	<div class="max-w-lg py-16 text-center mx-auto">
		<h1 class="text-3xl font-semibold text-white lg:text-4xl">
			{campaign.title}
		</h1>
		{#if data.campaign?.tagline}
			<p class="mt-6 text-slate-300 italic">
				{campaign.tagline}
			</p>
		{/if}
	</div>
</div>
{#if campaign.closed}
	<div class=" bg-blue-800 px-6 py-2.5 text-center">
		<p class="tex-sm leading-6 text-white/80">This campaign has already ended.</p>
	</div>
{/if}
<div
	class="container mx-auto flex md:flex-row-reverse py-10 px-1 flex-col lg:px-20 lg:py-24 lg:max-w-7xl gap-8"
>
	<div class="md:w-72 flex-grow md:flex-none space-y-4">
		<div>
			<img
				src={data.campaign.game.poster_image}
				alt="Game cover art"
				class="w-full object-cover object-center rounded-sm"
			/>
			<h3 class="text-xl mt-2 font-semibold">
				{data.campaign.game.title}
			</h3>
			<p>Survival</p>
		</div>

		<hr class="w-full border-t border-gray-300" />
		{#if !campaign.closed}
			<GlowingPanel pledged={campaign.billing_account.balance} goal={campaign.goal} />
		{/if}
		<div class="space-y-4">
			{#if (!campaign.closed && campaign.goal != null && campaign.goal <= data.campaign.billing_account.balance) || (data.campaign.goal == null && campaign.billing_account.balance > 0)}
				<button
					on:click={distributeFunds}
					class="w-full px-6 py-2 font-medium tracking-wide capitalize transition-colors duration-300 transform text-white bg-purple-700 rounded-sm hover:bg-purple-800 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-80"
					>End Campaign and Distribute Funds</button
				>
			{/if}
			{#if !data.campaign.closed}
				<button
					type="button"
					class="w-full px-6 py-2 font-medium tracking-wide capitalize transition-colors duration-300 transform bg-gray-100 text-slate-900 rounded-sm hover:bg-gray-300 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-80"
					on:click={pledgeDialog.open}>Pledge</button
				>
			{/if}
			<button
				on:click={toggleLike}
				class="w-full px-6 py-2 font-medium tracking-wide capitalize transition-colors duration-300 transform text-gray-900 hover:text-gray-200 border-slate-100 border-2 rounded-sm hover:bg-gray-800 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-80"
				>{#if data.likedCampaign} Upvoted {:else} Upvote {/if}</button
			>
		</div>

		<span>Upvote count: {data.campaign.upvote_count}</span>
	</div>
	<div class="flex-grow text-slate-400">
		{#if campaign.participants}
			<div class="flex flex-wrap w-full">
				<div class="lg:w-1/2 w-full mb-6 lg:mb-0">
					<h2 class="sm:text-3xl text-2xl font-medium title-font mb-2 text-gray-900">
						Participants
					</h2>
					<div class="h-1 w-20 bg-indigo-500 rounded" />
				</div>
			</div>
			<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 mt-4">
				{#each campaign.participants as participant}
					<div
						class="relative flex items-center space-x-3 rounded-sm bg-gray-800 px-6 py-5 shadow-sm focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:border-gray-400"
					>
						<div class="flex-shrink-0">
							<img
								class="h-10 w-10 rounded-full"
								src={participant.image}
								alt={`${participant.name} avatar`}
							/>
						</div>
						<div class="min-w-0 flex-1">
							<a href="#" class="focus:outline-none">
								<span class="absolute inset-0" aria-hidden="true" />
								<p class="text-sm font-medium">{participant.name}</p>
							</a>
						</div>
					</div>
				{/each}
			</div>
		{/if}

		{#if data.campaign.closed}
			<div class="flex flex-wrap w-full mt-8">
				<div class="lg:w-1/2 w-full mb-6 lg:mb-0">
					<h2 class="sm:text-3xl text-2xl font-medium title-font mb-2 text-gray-900">Payouts</h2>
					<div class="h-1 w-20 bg-indigo-500 rounded" />
				</div>
			</div>
			<div class="mt-4">
				<table class="min-w-full divide-y divide-gray-300">
					<thead>
						<tr>
							<th
								scope="col"
								class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
								>Name</th
							>
							<th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
								>Amount</th
							>
						</tr>
					</thead>
					<tbody class="divide-y divide-gray-200">
						{#each data.payouts as payout}
							<tr>
								<td
									class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0"
									>{payout.user.name}</td
								>
								<td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500"
									>{payout.num_credits}</td
								>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{/if}
		<div class="flex flex-wrap w-full mt-8">
			<div class="lg:w-1/2 w-full mb-6 lg:mb-0">
				<h2 class="sm:text-3xl text-2xl font-medium title-font mb-2 text-gray-900">Details</h2>
				<div class="h-1 w-20 bg-indigo-500 rounded" />
			</div>
		</div>
		<div class="mt-4">{@html data.campaign?.description}</div>
	</div>
</div>

<div class="relative z-10">
	<Transition show={$successDialog.expanded}>
		<Transition
			enter="ease-out duration-300"
			enterFrom="opacity-0"
			enterTo="opacity-100"
			leave="ease-in duration-200"
			leaveFrom="opacity-100"
			leaveTo="opacity-0"
		>
			<div class="fixed inset-0 bg-black bg-opacity-25" on:click={successDialog.close} />
		</Transition>

		<div class="fixed inset-0 overflow-y-auto">
			<div class="flex min-h-full items-center justify-center p-4 text-center">
				<Transition
					enter="ease-out duration-300"
					enterFrom="opacity-0 scale-95"
					enterTo="opacity-100 scale-100"
					leave="ease-in duration-200"
					leaveFrom="opacity-100 scale-100"
					leaveTo="opacity-0 scale-95"
				>
					<div
						class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all"
						use:successDialog.modal
					>
						<h3 class="text-lg font-medium leading-6 text-gray-900">Payment successful</h3>
						<div class="mt-2">
							<p class="text-sm text-gray-500">
								Your payment has been successfully submitted. We’ve sent you an email with all of
								the details of your order.
							</p>
						</div>

						<div class="mt-4">
							<button
								type="button"
								class="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
								on:click={successDialog.close}
							>
								Got it, thanks!
							</button>
						</div>
					</div>
				</Transition>
			</div>
		</div>
	</Transition>
</div>

<div class="relative z-10">
	<Transition show={$pledgeDialog.expanded}>
		<Transition
			enter="ease-out duration-300"
			enterFrom="opacity-0"
			enterTo="opacity-100"
			leave="ease-in duration-200"
			leaveFrom="opacity-100"
			leaveTo="opacity-0"
		>
			<div class="fixed inset-0 bg-black bg-opacity-25" on:click={pledgeDialog.close} />
		</Transition>

		<div class="fixed inset-0 overflow-y-auto">
			<div class="flex min-h-full items-center justify-center p-4 text-center">
				<Transition
					enter="ease-out duration-300"
					enterFrom="opacity-0 scale-95"
					enterTo="opacity-100 scale-100"
					leave="ease-in duration-200"
					leaveFrom="opacity-100 scale-100"
					leaveTo="opacity-0 scale-95"
				>
					<div
						class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all"
						use:pledgeDialog.modal
					>
						<h3 class="text-lg font-medium leading-6 text-gray-900">Pledge credits</h3>
						<div class="mt-2">
							<input
								bind:value={pledgeInputVal}
								class="block w-full rounded-md border-0 text-black px-2 py-1.5 shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
							/>
						</div>

						<div class="mt-4">
							<button
								type="button"
								class="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
								on:click={() => {
									pledgeDialog.close();
									pledge(pledgeInputVal);
								}}
							>
								Pledge
							</button>
						</div>
					</div>
				</Transition>
			</div>
		</div>
	</Transition>
</div>
