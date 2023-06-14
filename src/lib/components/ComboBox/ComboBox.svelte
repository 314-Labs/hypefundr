<script lang="ts">
	/**
	 * @typedef {any} ComboBoxItemId
	 * @event {{ selectedId: ComboBoxItemId; selectedItem: ComboBoxItem }} select
	 * @slot {{ item: ComboBoxItem; index: number }}
	 */

	type T = $$Generic<{ id: any; text: string; disabled: bool }>;

	type GameId = number;

	let items: Array<T> = [];

	export let selectedId: number | undefined = undefined;
	$: selectedId = selectedIndex > -1 ? items[selectedIndex].id : undefined;
	/** Specify the selected combobox value */
	export let value = '';

	/** Set to `true` to disable the combobox */
	export let disabled = false;

	/** Specify the placeholder text */
	export let placeholder = '';

	/** Specify the helper text */
	export let helperText = '';

	/** Specify the invalid state text */
	export let invalidText = '';

	/** Set to `true` to indicate an invalid state */
	export let invalid = false;

	/** Set to `true` to indicate an warning state */
	export let warn = false;

	/** Specify the warning state text */
	export let warnText = '';

	/** Set to `true` to enable the light variant */
	export let light = false;

	/** Set to `true` to open the combobox menu dropdown */
	export let open = false;

	export let optionsFetcher: (inputVal: string) => Promise<Array<T>>;

	/** Set an id for the list box component */
	export let id = 'ccs-' + Math.random().toString(36);

	/**
	 * Specify a name attribute for the input
	 */
	export let name: string | undefined = undefined;

	export let trueName: string | undefined = undefined;

	/** Obtain a reference to the input HTML element */
	export let ref: HTMLInputElement | undefined = undefined;

	import { createEventDispatcher, afterUpdate, tick } from 'svelte';
	import Checkmark from '../icons/Checkmark.svelte';
	import WarningFilled from '../icons/WarningFilled.svelte';
	import WarningAltFilled from '../icons/WarningAltFilled.svelte';
	import ListBox from './ListBox/ListBox.svelte';
	import ListBoxField from './ListBox/ListBoxField.svelte';
	import ListBoxMenu from './ListBox/ListBoxMenu.svelte';
	import ListBoxMenuIcon from './ListBox/ListBoxMenuIcon.svelte';
	import ListBoxMenuItem from './ListBox/ListBoxMenuItem.svelte';
	import ListBoxSelection from './ListBox/ListBoxSelection.svelte';

	const dispatch = createEventDispatcher();

	let selectedIndex = -1;
	let highlightedIndex = -1;

	function change(dir: 1 | -1) {
		let index = highlightedIndex + dir;
		if (items.length === 0) return;
		if (index < 0) {
			index = items.length - 1;
		} else if (index >= items.length) {
			index = 0;
		}
		let disabled = items[index].disabled;

		while (disabled) {
			index = index + dir;

			if (index < 0) {
				index = items.length - 1;
			} else if (index >= items.length) {
				index = 0;
			}

			disabled = items[index].disabled;
		}

		highlightedIndex = index;
	}

	/**
	 * Clear the combo box programmatically
	 * @type {(options?: { focus?: boolean; }) => void}
	 */
	export function clear(options = {}) {
		highlightedIndex = -1;
		selectedIndex = -1;
		open = false;
		value = '';
		if (options?.focus !== false) ref?.focus();
	}

	afterUpdate(() => {
		if (open) {
			ref.focus();
		} else {
			highlightedIndex = -1;
			if (selectedIndex == -1) {
				value = '';
				highlightedIndex = -1;
			} else {
				value = items[selectedIndex].text;
			}
		}
	});

	$: ariaLabel = $$props['aria-label'] || 'Choose an item';
	$: menuId = `menu-${id}`;
	$: comboId = `combo-${id}`;
	$: highlightedId = items[highlightedIndex] ? items[highlightedIndex].id : 0;
</script>

<svelte:window
	on:click={({ target }) => {
		if (open && ref && !ref.contains(target)) {
			open = false;
		}
	}}
/>

<div class="relative {$$restProps.class}">
	<ListBox
		id={comboId}
		aria-label={ariaLabel}
		{disabled}
		{invalid}
		{invalidText}
		{open}
		{light}
		{warn}
		{warnText}
	>
		<ListBoxField
			role="button"
			class="relative"
			aria-expanded={open}
			on:click={async () => {
				if (disabled) return;
				open = true;
				await tick();
				ref.focus();
			}}
			{id}
			{disabled}
		>
			<input type="hidden" name={trueName} value={selectedId} />
			<input
				bind:this={ref}
				bind:value
				tabindex="0"
				autocomplete="off"
				aria-autocomplete="list"
				aria-expanded={open}
				aria-activedescendant={highlightedId.toString()}
				aria-labelledby={comboId}
				aria-disabled={disabled}
				aria-controls={open ? menuId : undefined}
				aria-owns={open ? menuId : undefined}
				{disabled}
				{placeholder}
				{id}
				{name}
				{...$$restProps}
				class="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6 px-2"
				on:input={async (e) => {
					selectedIndex = -1;
					if (!open && e.target.value.length > 0) {
						open = true;
					}

					if (!value.length) {
						clear();
						open = true;
					}

					items = await optionsFetcher(value);
				}}
				on:keydown
				on:keydown|stopPropagation={(e) => {
					const { key } = e;
					if (['Enter', 'ArrowDown', 'ArrowUp'].includes(key)) {
						e.preventDefault();
					}
					if (key == 'Enter') {
						open = !open;
						if (highlightedIndex > -1) {
							open = false;

							if (!items[highlightedIndex].disabled) {
								value = items[highlightedIndex].text;
								selectedIndex = highlightedIndex;
							}
							highlightedIndex = -1;
						} else {
							// searching typed value in text list with lowercase
							const matchedIndex = items.findIndex(
								(game) => game.text.toLowerCase() == value?.toLowerCase() && !game.disabled
							);
							if (matchedIndex != -1) {
								// typed value has matched or fallback to first enabled item
								open = false;
								selectedIndex = matchedIndex;
								value = items[selectedIndex].text;
							}
						}
					} else if (key == 'Tab') {
						open = false;
					} else if (key == 'ArrowDown') {
						change(1);
					} else if (key == 'ArrowUp') {
						change(-1);
					} else if (key == 'Escape') {
						open = false;
					}
				}}
				on:keyup
				on:focus
				on:blur
				on:blur={({ relatedTarget }) => {
					if (!open || !relatedTarget) return;
					if (
						relatedTarget &&
						!['INPUT', 'SELECT', 'TEXTAREA'].includes(relatedTarget.tagName) &&
						relatedTarget.getAttribute('role') !== 'button' &&
						relatedTarget.getAttribute('role') !== 'searchbox'
					) {
						ref.focus();
					}
				}}
				on:paste
			/>
			{#if invalid}
				<WarningFilled class="bx--list-box__invalid-icon" />
			{/if}
			{#if !invalid && warn}
				<WarningAltFilled class="bx--list-box__invalid-icon bx--list-box__invalid-icon--warning" />
			{/if}
			{#if value}
				<ListBoxSelection
					class="z-10 h-full top-0 leading-snug font-normal absolute text-center text-slate-300 absolute bg-transparent rounded text-base items-center justify-center w-8 right-6 pr-3 py-3"
					on:clear
					on:clear={clear}
					{disabled}
					{open}
				/>
			{/if}
			<ListBoxMenuIcon
				class="z-10 h-full top-0 leading-snug font-normal absolute text-center text-slate-300 absolute bg-transparent rounded text-base items-center justify-center w-8 right-0 pr-3 py-3"
				on:click={(e) => {
					if (disabled) return;
					e.stopPropagation();
					open = !open;
				}}
				{open}
			/>
		</ListBoxField>
		{#if open && items.length >= 1}
			<ListBoxMenu
				aria-label={ariaLabel}
				{id}
				on:scroll
				class="absolute top-full w-full bg-white/5 border  overflow-y-auto max-h-48 z-20"
			>
				{#each items as item, i (item.id)}
					<ListBoxMenuItem
						id={item.id}
						active={selectedId === item.id}
						highlighted={highlightedIndex === i}
						disabled={item.disabled}
						on:click={(e) => {
							if (item.disabled) {
								e.stopPropagation();
								return;
							}
							selectedIndex = i;
							open = false;
						}}
						on:mouseenter={() => {
							if (item.disabled) return;
							highlightedIndex = i;
						}}
					>
						<slot {item} index={i}>
							<div class="py-3 px-2">{item.text}</div>
						</slot>
						{#if selectedIndex != -1 && items[selectedIndex].id == item.id}
							<div class="absolute top-0 right-3 h-full flex items-center">
								<Checkmark />
							</div>
						{/if}
					</ListBoxMenuItem>
				{/each}
			</ListBoxMenu>
		{/if}
	</ListBox>
	{#if !invalid && helperText && !warn}
		<div class:bx--form__helper-text={true} class:bx--form__helper-text--disabled={disabled}>
			{helperText}
		</div>
	{/if}
</div>
