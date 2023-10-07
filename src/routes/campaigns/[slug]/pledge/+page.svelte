<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { loadStripe, type Stripe } from '@stripe/stripe-js';
	import { PUBLIC_STRIPE_PUBLISHABLE_KEY } from '$env/static/public';
	import { Elements, PaymentElement, LinkAuthenticationElement, Address } from 'svelte-stripe';
	import { trpc } from '$lib/trpc/client';
	import type { PageData } from './$types';
	import { page } from '$app/stores';
	export let data: PageData;
	let stripe: null | Stripe = null;
	let clientSecret: string | null = null;
	let error = null;
	let elements;
	let processing = false;

	onMount(async () => {
		stripe = await loadStripe(PUBLIC_STRIPE_PUBLISHABLE_KEY);

		// create payment intent server side
		clientSecret = await trpc().campaigns.createPaymentIntent.mutate({
			amount: data.amount,
			campaignId: data.campaign.id
		});
	});

	async function submit() {
		// avoid processing duplicates
		if (processing) return;

		processing = true;

		// confirm payment with stripe
		const result = await stripe!.confirmPayment({
			elements,
			redirect: 'if_required'
		});

		// log results, for debugging
		console.log({ result });

		if (result.error) {
			// payment failed, notify user
			error = result.error;
			processing = false;
		} else {
			// payment succeeded, redirect to "thank you" page

			alert('done');
		}
	}
</script>

<div class="container mx-auto mt-64">
	{#if error}
		<p class="error">{error.message} Please try again.</p>
	{/if}

	{#if stripe && clientSecret}
		<Elements
			{stripe}
			{clientSecret}
			theme="flat"
			labels="floating"
			variables={{ colorPrimary: '#7c4dff' }}
			rules={{ '.Input': { border: 'solid 1px #0002' } }}
			bind:elements
		>
			<form on:submit|preventDefault={submit}>
				<LinkAuthenticationElement />
				<PaymentElement />
				<button disabled={processing}>
					{#if processing}
						Processing...
					{:else}
						Pay
					{/if}
				</button>
			</form>
		</Elements>
	{:else}
		Loading...
	{/if}

	<style>
		.error {
			color: tomato;
			margin: 2rem 0 0;
		}

		form {
			display: flex;
			flex-direction: column;
			gap: 10px;
			margin: 2rem 0;
		}

		button {
			padding: 1rem;
			border-radius: 5px;
			border: solid 1px #ccc;
			color: white;
			background: var(--link-color);
			font-size: 1.2rem;
			margin: 1rem 0;
		}
	</style>
</div>
