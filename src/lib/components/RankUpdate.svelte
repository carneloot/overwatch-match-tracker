<script lang="ts">
	import type { RankUpdate } from '$lib/database/schema';
	import { heroRole, skillTier } from '$lib/prettify';
	import { seasons } from '$lib/data/seasons';
	import { cn } from '$lib/utils';

	export let rankUpdate: RankUpdate;

	export let showRole = false;
	export let showPercentage = false;

	const classes = cn('btn btn-sm cursor-pointer', {
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

<div class="flex flex-col gap-1 whitespace-nowrap">
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
