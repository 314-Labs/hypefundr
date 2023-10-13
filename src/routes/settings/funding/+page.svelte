<script lang="ts">
	import currency from 'currency.js';
	const items = [
		{ name: '100 Credits', price: '$1.40', price_id: 'price_1NwEQdDXQA52AQNZKD2991Lf' },
		{ name: '500 Credits', price: '$7.00', price_id: 'price_1NwERHDXQA52AQNZbop4obEy' },
		{ name: '1500 Credits', price: '$19.95', price_id: 'price_1NwERbDXQA52AQNZEAKnoFzv' }
	];
	export let data;
</script>

<div class="border-b border-gray-200 pb-5">
	<div class="-ml-2 -mt-2 flex flex-wrap items-baseline">
		<h1 class="ml-2 mt-2 font-semibold text-5xl text-gray-900">
			{data.user.billing_account.balance}
		</h1>
		<p class="ml-2 mt-1 truncate text-sm text-gray-500">Hypebits in your balance</p>
	</div>
</div>

<main class="space-y-16 sm:space-y-20 mt-16">
	<div>
		<h2 class="text-base font-semibold leading-7 text-gray-900">Withdraw Hypebits</h2>
		<p class="mt-1 text-sm leading-6 text-gray-500">
			Hypebits are withdrawn at the rate of 1 Hypebit = 1 cent
		</p>

		<div class="flex border-t border-gray-100 pt-6">
			<form method="POST" action="?/withdraw">
				<button
					type="submit"
					class="text-sm font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
					>{data.user.stripe_connected_account
						? 'Withdraw Hypebits'
						: 'Create Stripe Account to Withdraw Hypebits'}</button
				>
			</form>
		</div>
	</div>

	<div>
		<h2 class="text-base font-semibold leading-7 text-gray-900">Purchase Hypebits</h2>

		<ul class="mt-6 divide-y divide-gray-100 border-t border-gray-200 text-sm leading-6">
			{#each items as item (item.price_id)}
				<li class="flex justify-between gap-x-6 py-6">
					<div class="min-w-0 flex-auto">
						<p class="text-sm font-semibold leading-6 text-gray-900">{item.name}</p>
						<p class="mt-1 truncate text-xs leading-5 text-gray-500">{item.price}</p>
					</div>

					<form method="POST" action="?/purchase" class="flex align-middle">
						<input type="hidden" name="price_id" value={item.price_id} />
						<button type="submit" class="font-semibold text-indigo-600 hover:text-indigo-500"
							>Purchase</button
						>
					</form>
				</li>
			{/each}
		</ul>
	</div>

	<div>
		<h2 class="text-base font-semibold leading-7 text-gray-900">Purchase History</h2>

		<table
			class="mt-6 border-t border-gray-200 text-sm leading-6 min-w-full divide-y divide-gray-300"
		>
			<thead>
				<tr>
					<th
						scope="col"
						class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-3"
						>Hypebits</th
					>
					<th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
						>Price</th
					>
					<th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Time</th
					>
				</tr>
			</thead>
			<tbody class="bg-white">
				{#each data.creditPurchases as purchase}
					<tr class="even:bg-gray-50">
						<td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-3"
							>{purchase.num_credits}</td
						>
						<td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500"
							>${currency(purchase.fiat_paid, { fromCents: true }).toString()}</td
						>
						<td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{purchase.created_at}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</main>
