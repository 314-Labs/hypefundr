<script lang="ts">
    import "../app.css";
    import { invalidate } from '$app/navigation';
	import { onMount } from 'svelte';
	import { Navbar, NavBrand, NavLi, NavUl, NavHamburger, Avatar, Dropdown, DropdownItem, DropdownHeader, DropdownDivider } from 'flowbite-svelte'
	import { page } from '$app/stores';
	export let data;

	$: ({ supabase, session } = data);

	onMount(() => {
		const { data } = supabase.auth.onAuthStateChange((event, _session) => {
			if (_session?.expires_at !== session?.expires_at) {
				invalidate('supabase:auth');
			}
		});

		return () => data.subscription.unsubscribe();
	});

	
</script>

{#if $page.url.pathname != "/login"}
  <Navbar let:hidden let:toggle>
	<NavBrand href="/">
	  <img src="https://flowbite.com/docs/images/logo.svg" class="mr-3 h-6 sm:h-9" alt="Flowbite Logo"/>
	  <span class="self-center whitespace-nowrap text-xl font-semibold dark:text-white">Flowbite</span>
	</NavBrand>
	<div class="flex items-center md:order-2">
	  <Avatar id="avatar-menu" src="/images/profile-picture-3.webp" />
	  <NavHamburger on:click={toggle} class1="w-full md:flex md:w-auto md:order-1"/>
	</div>
	<Dropdown placement="bottom" triggeredBy="#avatar-menu">
	  <DropdownHeader>
	  <span class="block text-sm"> Bonnie Green </span>
	  <span class="block truncate text-sm font-medium"> name@flowbite.com </span>
	  </DropdownHeader>
	  <DropdownItem>Dashboard</DropdownItem>
	  <DropdownItem>Settings</DropdownItem>
	  <DropdownItem>Earnings</DropdownItem>
	  <DropdownDivider />
	  <DropdownItem>Sign out</DropdownItem>
	</Dropdown>
	<NavUl {hidden}>
	  <NavLi href="/" active={true}>Home</NavLi>
	  <NavLi href="/about">About</NavLi>
	  <NavLi href="/services">Services</NavLi>
	  <NavLi href="/pricing">Pricing</NavLi>
	  <NavLi href="/contact">Contact</NavLi>
	</NavUl>
  </Navbar>
{/if}

	<slot />