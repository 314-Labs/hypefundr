<script lang="ts">
	import { getGameCover } from '$lib/util.js';

	export let data;
	$: ({ session } = data);
</script>

<section class="text-gray-600 body-font">
	<div class="container py-24 mx-auto">
		<div class="flex flex-wrap w-full mb-20">
			<div class="lg:w-1/2 w-full mb-6 lg:mb-0">
				<h1 class="sm:text-3xl text-2xl font-medium title-font mb-2 text-gray-900">
					Active campaigns
				</h1>
				<div class="h-1 w-20 bg-indigo-500 rounded" />
			</div>
		</div>
		<div class="flex flex-wrap -m-4">
			{#each data.campaigns as campaign}
				<div class="xl:w-1/4 md:w-1/2 p-4">
					<a class="bg-gray-100 p-6 rounded-lg block" href={`/campaigns/${campaign.slug}`}>
						<img
							class="h-40 rounded w-full object-cover object-center mb-6"
							src={getGameCover(campaign.game.id)}
							alt="content"
						/>
						<h3 class="tracking-widest text-indigo-500 text-xs font-medium title-font">
							{campaign.game.title}
						</h3>
						<h2 class="text-lg text-gray-900 font-medium title-font mb-4">{campaign.title}</h2>
						<p class="leading-relaxed text-base">
							{campaign.tagline}
						</p>
					</a>
				</div>
			{/each}
		</div>
	</div>
</section>
