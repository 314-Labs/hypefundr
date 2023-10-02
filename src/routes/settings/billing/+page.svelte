<script lang="ts">
	const items = [
		{ name: '100 Credits', price: '$1.40', price_id: 'price_1NwEQdDXQA52AQNZKD2991Lf' },
		{ name: '500 Credits', price: '$7.00', price_id: 'price_1NwERHDXQA52AQNZbop4obEy' },
		{ name: '1500 Credits', price: '$19.95', price_id: 'price_1NwERbDXQA52AQNZEAKnoFzv' }
	];
</script>

<ul class="divide-y divide-gray-100">
	{#each items as item (item.price_id)}
		<li class="flex justify-between gap-x-6 py-5">
			<div class="flex min-w-0 gap-x-4">
				<div class="min-w-0 flex-auto">
					<p class="text-sm font-semibold leading-6 text-gray-900">{item.name}</p>
					<p class="mt-1 truncate text-xs leading-5 text-gray-500">{item.price}</p>
				</div>
			</div>
			<div class="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
				<form method="POST">
					<input type="hidden" name="price_id" value={item.price_id} />
					<button class="" type="submit">Purchase</button>
				</form>
			</div>
		</li>
	{/each}
</ul>
