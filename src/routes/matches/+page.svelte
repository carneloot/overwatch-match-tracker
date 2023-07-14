<script lang="ts">
	import { Plus } from 'lucide-svelte';

	import Img from '@zerodevx/svelte-img';
	import { Paginator } from '@skeletonlabs/skeleton';
	import type { PaginatorProps } from '@skeletonlabs/skeleton/dist/components/Paginator/Paginator.svelte';

	import { formatDistanceToNowStrict } from 'date-fns';

	import { page } from '$app/stores';
	import { goto } from '$app/navigation';

	import { matchResult, skillTier } from '$lib/prettify';
	import { maps } from '$lib/data/maps';
	import { seasons } from '$lib/data/seasons';
	import { cn } from '$lib/utils';
	import { heroes } from '../../lib/data/heroes.js';

	export let data;

	let paginatorSettings = {
		size: data.total,
		limit: Number($page.url.searchParams.get('limit') ?? 10),
		offset: Number($page.url.searchParams.get('skip') ?? 0),
		amounts: []
	} satisfies PaginatorProps['settings'];

	function onPageChange(e: CustomEvent): void {
		const newPage = e.detail as number;
		const searchParams = $page.url.searchParams;
		const skip = newPage * paginatorSettings.limit;
		if (skip > 0) {
			searchParams.set('skip', skip.toString());
		} else {
			searchParams.delete('skip');
		}
		goto(`${$page.url.pathname}?${searchParams}`, { invalidateAll: true });
	}
</script>

<svelte:head>
	<title>Matches</title>
</svelte:head>

<div class="mb-6 flex justify-between">
	<h2 class="h2">Matches</h2>
	<a href="/matches/new" class="btn variant-filled-primary text-white">
		<span><Plus size={20} /></span>
		<span>New Match</span>
	</a>
</div>

<div class="mb-6">
	{#each data.matches as match}
		{@const map = maps[match.map]}
		{@const modality = seasons[match.season].modalities[match.modality]}
		<div
			class="mb-4 grid h-20 w-full grid-cols-[2fr_1fr_0.7fr_1fr_1fr_1fr_auto] gap-5 overflow-hidden rounded-lg bg-surface-100 uppercase"
		>
			<!-- Map -->
			<div
				class={cn('relative h-full overflow-hidden border-l-4', {
					'border-success-500': match.result === 'win',
					'border-warning-500': match.result === 'draw',
					'border-error-500': match.result === 'lose'
				})}
			>
				<div
					class="absolute left-0 top-0 flex h-full w-full items-center bg-black/30 pl-6 font-sans text-xl font-bold tracking-wider text-white"
				>
					{map.name}
				</div>
				<Img
					class="h-full w-full object-cover"
					src={map.image}
					alt={`Image of ${map.name}`}
				/>
			</div>

			<!-- Modality -->
			<div class="flex flex-col justify-center text-lg font-medium">
				{modality}
			</div>

			<!-- Time -->
			<div class="flex flex-col items-end justify-center text-right">
				{formatDistanceToNowStrict(match.time, { addSuffix: true })}
			</div>

			<!-- Heroes -->
			<div class="flex flex-col items-end justify-center text-right">
				{match.heroes.map((slug) => heroes[slug].name).join(', ')}
			</div>

			<!-- Group -->
			<div class="flex flex-col items-end justify-center text-right">
				{#if match.accounts.length}
					{match.accounts.join(', ')}
				{:else}
					Solo queue
				{/if}
			</div>

			<!-- Match Result -->
			<div
				class="group relative flex flex-row items-center justify-center overflow-hidden text-center"
			>
				<div
					class={cn(
						'absolute z-10 w-full cursor-pointer rounded-lg px-4 py-2 transition-transform group-hover:translate-x-[-95%]',
						{
							'bg-success-500': match.result === 'win',
							'bg-warning-500': match.result === 'draw',
							'bg-error-500': match.result === 'lose'
						}
					)}
				>
					{matchResult[match.result]}
				</div>
				<a
					href={match.rankUpdate ? '' : `/rank-updates/new?matchId=${match.id}`}
					class={cn(
						'absolute flex w-full translate-x-[100%] items-center justify-center gap-2 rounded-lg px-4 py-2 transition-transform',
						'group-hover:translate-x-0',
						{
							'bg-secondary-300': !match.rankUpdate,
							'bg-bronze': match.rankUpdate?.tier === 'bronze',
							'bg-silver': match.rankUpdate?.tier === 'silver',
							'bg-gold': match.rankUpdate?.tier === 'gold',
							'bg-platinum': match.rankUpdate?.tier === 'platinum',
							'bg-diamond': match.rankUpdate?.tier === 'diamond',
							'bg-master': match.rankUpdate?.tier === 'master',
							'bg-grandmaster': match.rankUpdate?.tier === 'grandmaster',
							'bg-top500': match.rankUpdate?.tier === 'top500'
						}
					)}
				>
					{#if match.rankUpdate}
						{`${skillTier[match.rankUpdate.tier]} ${match.rankUpdate.division}`}
					{:else}
						<Plus size={20} />New rank
					{/if}
				</a>
			</div>
		</div>
	{/each}
</div>

<Paginator
	bind:settings={paginatorSettings}
	on:page={onPageChange}
	showNumerals
	maxNumerals={2}
	justify="justify-center"
/>
