<script lang="ts">
	import { enhance } from '$app/forms';
	import { seasonsArray } from '$lib/data/seasons';
	import RankUpdate from '$lib/components/RankUpdate.svelte';

	export let data;
</script>

<svelte:head>
	<title>Seasons</title>
</svelte:head>

<div class="mb-6 flex justify-between">
	<h2 class="h2">Seasons</h2>
</div>

<div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
	{#each seasonsArray as season}
		{@const isSelected = season.slug === data.activeSeason.slug}
		<div class="card card-hover flex flex-col overflow-hidden">
			<header class="card-header flex gap-2">
				<span>{season.name}</span>
				{#if isSelected}
					<span class="variant-filled-success badge">Selected</span>
				{/if}
			</header>

			<div class="m-2 flex-1 rounded-lg bg-surface-200 p-2 dark:bg-surface-700">
				<span class="h4 mb-2">Ranks</span>
				{#if !data.rankUpdates[season.slug] || data.rankUpdates[season.slug]?.length === 0}
					<p class="py-2">No ranks found ☹️</p>
				{:else}
					<div class="grid grid-cols-2 place-content-end gap-2">
						{#each data.rankUpdates[season.slug] as rankUpdate}
							<RankUpdate {rankUpdate} showRole />
						{/each}
					</div>
				{/if}
			</div>

			<form method="post" use:enhance class="card-footer flex w-full justify-end gap-2">
				<input type="hidden" name="slug" value={season.slug} />
				<button
					type="submit"
					formaction="?/select"
					class="variant-soft-secondary btn btn-sm"
					disabled={isSelected}
					title={isSelected ? 'Season is already active' : undefined}
				>
					Select
				</button>
			</form>
		</div>
	{/each}
</div>
