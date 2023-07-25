<script lang="ts">
	import { RadioGroup, RadioItem } from '@skeletonlabs/skeleton';
	import type { SkillTier } from '../database/schema';
	import { skillTier } from '../prettify';
	import { cn } from '../utils';

	export let name: string;

	export let value: SkillTier = 'bronze';
</script>

<RadioGroup
	rounded="rounded-container-token"
	display="inline-grid grid-cols-2 sm:grid-cols-4"
	class={cn('w-full', $$props.class)}
>
	<RadioItem
		bind:group={value}
		{name}
		value="bronze"
		active="variant-filled-bronze"
		hover="hover:variant-soft-bronze"
	>
		{skillTier['bronze']}
	</RadioItem>
	<RadioItem
		bind:group={value}
		{name}
		value="silver"
		active="variant-filled-silver"
		hover="hover:variant-soft-silver"
	>
		{skillTier['silver']}
	</RadioItem>
	<RadioItem
		bind:group={value}
		{name}
		value="gold"
		active="variant-filled-gold"
		hover="hover:variant-soft-gold"
	>
		{skillTier['gold']}
	</RadioItem>
	<RadioItem
		bind:group={value}
		{name}
		value="platinum"
		active="variant-filled-platinum"
		hover="hover:variant-soft-platinum"
	>
		{skillTier['platinum']}
	</RadioItem>
	<RadioItem
		bind:group={value}
		{name}
		value="diamond"
		active="variant-filled-diamond"
		hover="hover:variant-soft-diamond"
	>
		{skillTier['diamond']}
	</RadioItem>
	<RadioItem
		bind:group={value}
		{name}
		value="master"
		active="variant-filled-master"
		hover="hover:variant-soft-master"
	>
		{skillTier['master']}
	</RadioItem>
	<RadioItem
		bind:group={value}
		{name}
		value="grandmaster"
		active="variant-filled-grandmaster"
		hover="hover:variant-soft-grandmaster"
	>
		{skillTier['grandmaster']}
	</RadioItem>
	<RadioItem
		bind:group={value}
		{name}
		value="top500"
		active="variant-filled-top500"
		hover="hover:variant-soft-top500"
	>
		{skillTier['top500']}
	</RadioItem>
</RadioGroup>
