<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';
	import Transition from 'svelte-transition';

	import { page } from '$app/stores';
	import Incomplete from '$lib/components/icons/Incomplete.svelte';
	let showDropdown = false;
</script>

{#if $page.url.pathname != '/login'}
	<nav class="bg-gray-800">
		<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
			<div class="flex h-16 justify-between">
				<div class="flex">
					<div class="-ml-2 mr-2 flex items-center md:hidden">
						<!-- Mobile menu button -->
						<button
							type="button"
							class="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
							aria-controls="mobile-menu"
							aria-expanded="false"
						>
							<span class="sr-only">Open main menu</span>
							<!--
				Icon when menu is closed.
  
				Menu open: "hidden", Menu closed: "block"
			  -->
							<svg
								class="block h-6 w-6"
								fill="none"
								viewBox="0 0 24 24"
								stroke-width="1.5"
								stroke="currentColor"
								aria-hidden="true"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
								/>
							</svg>
							<!--
				Icon when menu is open.
  
				Menu open: "block", Menu closed: "hidden"
			  -->
							<svg
								class="hidden h-6 w-6"
								fill="none"
								viewBox="0 0 24 24"
								stroke-width="1.5"
								stroke="currentColor"
								aria-hidden="true"
							>
								<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
							</svg>
						</button>
					</div>
					<div class="flex flex-shrink-0 items-center">
						<img class="block h-8 w-auto" src="/logo.png" alt="Your Company" />
					</div>
					<div class="hidden md:ml-6 md:flex md:items-center md:space-x-4">
						<!-- Current: "bg-gray-900 text-white", Default: "text-gray-300 hover:bg-gray-700 hover:text-white" -->
						<a
							href="/dashboard"
							class="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium"
							class:bg-gray-900={$page.url.pathname == '/dashboard'}
							class:text-white={$page.url.pathname == '/dashboard'}
							aria-current="page">Dashboard</a
						>
						<a
							href="/discovery"
							class="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium"
							class:bg-gray-900={$page.url.pathname == '/discovery'}
							class:text-white={$page.url.pathname == '/discovery'}>Discovery</a
						>
					</div>
				</div>
				<div class="flex items-center">
					<div class="flex-shrink-0">
						{#if $page.data.session}
							<a
								class="relative inline-flex items-center gap-x-1.5 rounded-md bg-indigo-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
								href="/campaigns/create"
							>
								<svg
									class="-ml-0.5 h-5 w-5"
									viewBox="0 0 20 20"
									fill="currentColor"
									aria-hidden="true"
								>
									<path
										d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z"
									/>
								</svg>
								New Campaign
							</a>
						{:else}
							<a
								class="relative inline-flex items-center gap-x-1.5 rounded-md bg-indigo-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
								href="/auth/signin"
							>
								Log In
							</a>
						{/if}
					</div>
					<div class="hidden md:ml-4 md:flex md:flex-shrink-0 md:items-center">
						<!-- Profile dropdown -->
						{#if $page.data.session}
							<div class="relative ml-3">
								<div>
									<button
										type="button"
										class="flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
										id="user-menu-button"
										aria-expanded="false"
										aria-haspopup="true"
										on:click={() => (showDropdown = !showDropdown)}
									>
										<span class="sr-only">Open user menu</span>
										<img
											class="h-8 w-8 rounded-full"
											src={$page.data.session.user.image}
											alt="User avatar"
										/>
									</button>
								</div>
								<!--
				Dropdown menu, show/hide based on menu state.
  
				Entering: "transition ease-out duration-200"
				  From: "transform opacity-0 scale-95"
				  To: "transform opacity-100 scale-100"
				Leaving: "transition ease-in duration-75"
				  From: "transform opacity-100 scale-100"
				  To: "transform opacity-0 scale-95"
			  -->
								<Transition
									show={showDropdown}
									enter="transition ease-out duration-200"
									enterFrom="transform opacity-0 scale-95"
									enterTo="transform opacity-100 scale-100"
									leave="transition ease-in duration-75"
									leaveFrom="transform opacity-100 scale-100"
									leaveTo="transform opacity-0 scale-95"
								>
									<div
										class="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
										role="menu"
										aria-orientation="vertical"
										aria-labelledby="user-menu-button"
										tabindex="-1"
									>
										<!-- Active: "bg-gray-100", Not Active: "" -->

										<a
											href="/settings/profile"
											class="block px-4 py-2 text-sm text-gray-700"
											role="menuitem"
											tabindex="-1"
											id="user-menu-item-1">Settings</a
										>
										<a
											href="/auth/signout"
											class="block px-4 py-2 text-sm text-gray-700"
											role="menuitem"
											tabindex="-1"
											id="user-menu-item-2">Sign out</a
										>
									</div>
								</Transition>
							</div>
						{/if}
					</div>
				</div>
			</div>
		</div>

		<!-- Mobile menu, show/hide based on menu state. -->
		<div class="md:hidden" id="mobile-menu">
			<div class="space-y-1 px-2 pb-3 pt-2 sm:px-3">
				<!-- Current: "bg-gray-900 text-white", Default: "text-gray-300 hover:bg-gray-700 hover:text-white" -->
				<a
					href="/dashboard"
					class="bg-gray-300 text-white block rounded-md px-3 py-2 text-base font-medium"
					class:bg-gray-900={$page.url.pathname == '/dashboard'}
					aria-current="page">Dashboard</a
				>
				<a
					href="/discovery"
					class="text-gray-300 hover:bg-gray-700 hover:text-white block rounded-md px-3 py-2 text-base font-medium"
					>Discovery</a
				>
			</div>
			<div class="border-t border-gray-700 pb-3 pt-4">
				<div class="flex items-center px-5 sm:px-6">
					<div class="flex-shrink-0">
						<img
							class="h-10 w-10 rounded-full"
							src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
							alt=""
						/>
					</div>
					<div class="ml-3">
						<div class="text-base font-medium text-white">Tom Cook</div>
						<div class="text-sm font-medium text-gray-400">tom@example.com</div>
					</div>
					<button
						type="button"
						class="ml-auto flex-shrink-0 rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
					>
						<span class="sr-only">View notifications</span>
						<svg
							class="h-6 w-6"
							fill="none"
							viewBox="0 0 24 24"
							stroke-width="1.5"
							stroke="currentColor"
							aria-hidden="true"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
							/>
						</svg>
					</button>
				</div>
				<div class="mt-3 space-y-1 px-2 sm:px-3">
					<a
						href="/settings/profile"
						class="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white"
						>Settings</a
					>
					<a
						href="/auth/signout"
						class="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white"
						>Sign out</a
					>
				</div>
			</div>
		</div>
	</nav>
{/if}

<slot />
