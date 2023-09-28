<script lang="ts">
	import { RadioGroup, RadioItem } from '@skeletonlabs/skeleton';

	import { cn } from '../utils';

	import type { SkillTier } from '$lib/database/schema';

	export let name: string;

	export let skillTier: SkillTier | undefined = undefined;

	export let value = 3;

	export let isTop500 = false;

	$: if (!isTop500) {
		value = Math.min(value, 5);
	}

	let active: string | undefined = undefined;
	let hover: string | undefined = undefined;

	$: if (skillTier) {
		switch (skillTier) {
			case 'bronze':
				active = 'variant-filled-bronze';
				hover = 'hover:variant-soft-bronze';
				break;
			case 'silver':
				active = 'variant-filled-silver';
				hover = 'hover:variant-soft-silver';
				break;
			case 'gold':
				active = 'variant-filled-gold';
				hover = 'hover:variant-soft-gold';
				break;
			case 'platinum':
				active = 'variant-filled-platinum';
				hover = 'hover:variant-soft-platinum';
				break;
			case 'diamond':
				active = 'variant-filled-diamond';
				hover = 'hover:variant-soft-diamond';
				break;
			case 'master':
				active = 'variant-filled-master';
				hover = 'hover:variant-soft-master';
				break;
			case 'grandmaster':
				active = 'variant-filled-grandmaster';
				hover = 'hover:variant-soft-grandmaster';
				break;
			case 'top500':
				active = 'variant-filled-top500';
				hover = 'hover:variant-soft-top500';
				break;
		}
	}
</script>

{#if isTop500}
	<input
		class="input !mt-2 !rounded-container-token"
		type="number"
		bind:value
		{name}
		min={1}
		max={500}
	/>
{:else}
	<RadioGroup
		rounded="rounded-container-token"
		display="inline-grid grid-cols-5"
		class={cn('w-full', $$props.class)}
	>
		<RadioItem bind:group={value} {name} {active} {hover} value={5}>5</RadioItem>
		<RadioItem bind:group={value} {name} {active} {hover} value={4}>4</RadioItem>
		<RadioItem bind:group={value} {name} {active} {hover} value={3}>3</RadioItem>
		<RadioItem bind:group={value} {name} {active} {hover} value={2}>2</RadioItem>
		<RadioItem bind:group={value} {name} {active} {hover} value={1}>1</RadioItem>
	</RadioGroup>
{/if}
