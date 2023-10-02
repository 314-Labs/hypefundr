<script lang="ts">
	import type currency from 'currency.js';
	export let pledged: number;
	export let goal: number | null;
	let percentage = Math.min(goal != undefined ? Math.round((pledged / goal) * 100) : 100, 100);
</script>

<div
	class="overflow-hidden h-20 mb-4 text-xs flex rounded-sm bg-emerald-200 bg-opacity-40 relative {$$restProps.class} hover:bg-opacity-50 transition-all"
>
	<div class="w-2 h-full bg-emerald-500 top-0 bottom-0 rounded-md absolute" />
	<div
		style="width:{percentage}%"
		class="shadow-none whitespace-nowrap text-white bg-emerald-500 bg-opacity-40 hover:bg-opacity-50"
	>
		<div class="ml-2 p-2 flex flex-col justify-center h-full">
			<span class="text-2xl font-bold">{pledged}</span>
			<span class="opacity-80">
				pledged {#if goal != undefined} of {goal} goal {/if}</span
			>
		</div>
	</div>
</div>
