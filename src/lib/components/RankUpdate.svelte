<script lang="ts">
	import type { RankUpdate } from '../database/schema';
	import { heroRole, skillTier } from '$lib/prettify';
	import { cn } from '../utils';
	import { seasons } from '../data/seasons';

	export let rankUpdate: RankUpdate;

	export let showRole = false;
	export let showPercentage = false;

	const classes = cn('btn btn-sm', {
		'variant-filled-bronze': rankUpdate.tier === 'bronze',
		'variant-filled-silver': rankUpdate.tier === 'silver',
		'variant-filled-gold': rankUpdate.tier === 'gold',
		'variant-filled-platinum': rankUpdate.tier === 'platinum',
		'variant-filled-diamond': rankUpdate.tier === 'diamond',
		'variant-filled-master': rankUpdate.tier === 'master',
		'variant-filled-grandmaster': rankUpdate.tier === 'grandmaster',
		'variant-filled-top500': rankUpdate.tier === 'top500'
	});
</script>

<div class="flex cursor-pointer items-center gap-1">
	{#if showRole}
		{#if rankUpdate.role}
			{heroRole[rankUpdate.role] + ':'}
		{:else}
			{seasons[rankUpdate.season].modalities[rankUpdate.modality] + ':'}
		{/if}
	{/if}
	<div class={classes}>
		{`${skillTier[rankUpdate.tier]} ${rankUpdate.division}`}
		{#if showPercentage}
			| {rankUpdate.percentage}%
		{/if}
	</div>
</div>

<style>
	.variant-filled-bronze {
		--tw-bg-opacity: 1;
		background-color: rgb(var(--color-bronze-500) / var(--tw-bg-opacity));
		color: rgb(var(--on-bronze));
	}
	.variant-filled-silver {
		--tw-bg-opacity: 1;
		background-color: rgb(var(--color-silver-500) / var(--tw-bg-opacity));
		color: rgb(var(--on-silver));
	}
	.variant-filled-gold {
		--tw-bg-opacity: 1;
		background-color: rgb(var(--color-gold-500) / var(--tw-bg-opacity));
		color: rgb(var(--on-gold));
	}
	.variant-filled-platinum {
		--tw-bg-opacity: 1;
		background-color: rgb(var(--color-platinum-500) / var(--tw-bg-opacity));
		color: rgb(var(--on-platinum));
	}
	.variant-filled-diamond {
		--tw-bg-opacity: 1;
		background-color: rgb(var(--color-diamond-500) / var(--tw-bg-opacity));
		color: rgb(var(--on-diamond));
	}
	.variant-filled-master {
		--tw-bg-opacity: 1;
		background-color: rgb(var(--color-master-500) / var(--tw-bg-opacity));
		color: rgb(var(--on-master));
	}
	.variant-filled-grandmaster {
		--tw-bg-opacity: 1;
		background-color: rgb(var(--color-grandmaster-500) / var(--tw-bg-opacity));
		color: rgb(var(--on-grandmaster));
	}
	.variant-filled-top500 {
		--tw-bg-opacity: 1;
		background-color: rgb(var(--color-top500-500) / var(--tw-bg-opacity));
		color: rgb(var(--on-top500));
	}
</style>
