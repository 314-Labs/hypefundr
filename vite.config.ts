import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';
import { viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig({
	plugins: [
		sveltekit(),
		// copy tinymce files to output so that we can self host scriptSrc
		// see src/routes/campaigns/create/+page.svelte
		viteStaticCopy({
			targets: [
				{
					src: 'node_modules/tinymce/*',
					dest: 'tinymce'
				}
			]
		})
	],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	}
});
