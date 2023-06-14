<script lang="ts">
	import { enhance } from '$app/forms';
	import type { SupabaseClient } from '@supabase/supabase-js';
	import Avatar from './Avatar.svelte';
	export let data;
	$: ({ supabase, session } = data);
</script>

<Avatar {supabase} {session} />
