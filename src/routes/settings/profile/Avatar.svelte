<script lang="ts">
	import type { Session, SupabaseClient } from '@supabase/supabase-js';
	import { onMount } from 'svelte';
	import type { Database } from '$lib/database.types';
	import { page } from '$app/stores';
	import type { ChangeEventHandler } from 'svelte/elements';
	import { getAvatar } from '$lib/util';

	export let supabase: SupabaseClient<Database>;
	export let session: Session;
	let file;

	const handleFileChange = async (event: Event) => {
		file = event.target!.files[0];
		// implement the upload logic to Supabase Storage
		const { data, error } = await supabase.storage
			.from('avatars')
			.upload(`${session.user.id}/avatar`, file); // use the actual user id here
	};

	const handleAvatarClick = () => {
		document.getElementById('fileUpload').click();
	};
</script>

<div class="relative w-16 h-16">
	<img
		src={getAvatar(supabase, session.user.id)}
		alt="User Avatar"
		class="rounded-full w-full h-full object-cover"
		on:click={handleAvatarClick}
	/>
	<input
		type="file"
		id="fileUpload"
		class="absolute opacity-0 cursor-pointer"
		on:change={handleFileChange}
		accept="image/*"
	/>
</div>
