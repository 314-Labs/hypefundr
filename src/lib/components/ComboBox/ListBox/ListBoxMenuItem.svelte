<script>
	/** Set to `true` to enable the active state */
	export let active = false;

	/** Set to `true` to enable the highlighted state */
	export let highlighted = false;

	/** Set to `true` to disable the menu item */
	export let disabled = false;

	let ref = null;

	$: isTruncated = ref?.offsetWidth < ref?.scrollWidth;
	$: title = isTruncated ? ref?.innerText : undefined;
	$: if (highlighted && ref && !ref.matches(':hover')) {
		// Scroll highlighted item into view if using keyboard navigation
		ref.scrollIntoView({ block: 'nearest' });
	}
</script>

<div
	role="option"
	tabindex="-1"
	class="bg-gray-700 cursor-pointer"
	class:bg-gray-600={active}
	class:bg-gray-400={highlighted || active}
	aria-selected={active}
	disabled={disabled ? true : undefined}
	{...$$restProps}
	on:click
	on:mouseenter
	on:mouseleave
>
	<div bind:this={ref} {title} class="relative">
		<slot />
	</div>
</div>
