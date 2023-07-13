<script lang='ts'>
	import { Plus } from 'lucide-svelte';

	import { Paginator } from '@skeletonlabs/skeleton';
	import type { PaginatorProps } from '@skeletonlabs/skeleton/dist/components/Paginator/Paginator.svelte';

	import { page } from '$app/stores';
	import { goto } from '$app/navigation';

	import { matchResult } from '$lib/prettify.js';
	import RankUpdate from '$lib/components/RankUpdate.svelte';

	export let data;

	// TODO: locale
	const formatter = new Intl.DateTimeFormat('en-US', { dateStyle: 'short', timeStyle: 'short' });

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

<div class='mb-6 flex justify-between'>
	<h2 class='h2'>Matches</h2>
	<a href='/matches/new' class='btn variant-filled-primary text-white'>
		<span><Plus size={20} /></span>
		<span>New Match</span>
	</a>
</div>

<table class='mb-4 table w-full'>
	<thead>
	<tr>
		<th>Result</th>
		<th>Modality</th>
		<th>Map</th>
		<th>Heroes</th>
		<th>Group</th>
		<th>Time</th>
		<th>Rank Update</th>
	</tr>
	</thead>

	<tbody>
	{#if data.total === 0}
		<tr>
			<td colspan='8' class='text-center'>
				There are no matches for the current account.
				<br />Add matches clicking on the "New Match" button.
			</td>
		</tr>
	{/if}
	{#each data.matches as match}
		<tr>
			<td class='!align-middle'>
				<span
					class='badge w-6/12'
					class:variant-filled-success={match.result === 'win'}
					class:variant-filled-warning={match.result === 'draw'}
					class:variant-filled-error={match.result === 'lose'}
				>{matchResult[match.result]}</span
				>
			</td>
			<td class='!align-middle'>{match.modality}</td>
			<td class='!align-middle'>{match.map}</td>
			<td class='!align-middle'>{match.heroes?.join(', ') ?? ''}</td>
			<td class='!align-middle'>
				{#if match.accounts.length}
					{match.accounts.join(', ')}
				{:else}
					Solo queue
				{/if}
			</td>
			<td class='!align-middle'>{formatter.format(match.time)}</td>
			<td>
				{#if match.rankUpdate}
					<RankUpdate rankUpdate={match.rankUpdate} />
				{:else}
					<a
						href={`/rank-updates/new?matchId=${match.id}`}
						title='Create Rank Update'
						class='btn btn-sm variant-ghost-primary'
					>
						<span><Plus size={20} /></span>
						<span>Create</span>
					</a>
				{/if}
			</td>
		</tr>
	{/each}
	</tbody>
</table>

<Paginator
	bind:settings={paginatorSettings}
	on:page={onPageChange}
	showNumerals
	maxNumerals={2}
	justify='justify-center'
/>
