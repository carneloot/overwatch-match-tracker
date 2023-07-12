<script lang='ts'>
	import { Plus } from 'lucide-svelte';

	import { page } from '$app/stores';
	import { goto } from '$app/navigation';

	import { Paginator } from '@skeletonlabs/skeleton';
	import type { PaginatorProps } from '@skeletonlabs/skeleton/dist/components/Paginator/Paginator.svelte';

	export let data;

	// TODO: locale
	const formatter = new Intl.DateTimeFormat('en-US', { dateStyle: 'short', timeStyle: 'short' });

	let paginatorSettings = {
		size: data.total,
		limit: $page.url.searchParams.get('limit') ?? 10,
		offset: $page.url.searchParams.get('skip') ?? 0,
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

<div class='flex justify-between mb-6'>
	<h2 class='h2'>Matches</h2>
	<a href='/matches/new' class='btn variant-filled-primary text-white'>
		<span><Plus size={20} /></span>
		<span>New Match</span>
	</a>
</div>

<table class='table table-interactive w-full mb-4'>
	<thead>
	<tr>
		<th>Result</th>
		<th>Modality</th>
		<th>Map</th>
		<th>Heroes</th>
		<th>Group</th>
		<th>Time</th>
		<th>Update</th>
	</tr>
	</thead>

	<tbody>
	{#if data.total === 0}
		<tr>
			<td colspan='8' class='text-center'>
				There are no matches for the current account.
				<br>Add matches clicking on the "New Match" button.
			</td>
		</tr>
	{/if}
	{#each data.matches as match}
		<tr>
			<td>
				<span
					class='badge'
					class:variant-filled-success={match.result === 'win'}
					class:variant-filled-warning={match.result === 'draw'}
					class:variant-filled-error={match.result === 'lose'}
				>{match.result}</span>
			</td>
			<td>{match.modality}</td>
			<td>{match.map}</td>
			<td>{match.heroes?.join(', ') ?? ''}</td>
			<td>{match.accounts?.join(', ') ?? ''}</td>
			<td>{formatter.format(match.time)}</td>
			<td>TODO</td>
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
