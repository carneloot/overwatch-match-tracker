<script lang="ts">
	import { RadioGroup, RadioItem } from '@skeletonlabs/skeleton';
	import { cn } from '../utils';

	export let name: string;

	export let value = 3;

	export let isTop500 = false;

	$: if (!isTop500) {
		value = Math.min(value, 5);
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
		<RadioItem bind:group={value} {name} value={5}>5</RadioItem>
		<RadioItem bind:group={value} {name} value={4}>4</RadioItem>
		<RadioItem bind:group={value} {name} value={3}>3</RadioItem>
		<RadioItem bind:group={value} {name} value={2}>2</RadioItem>
		<RadioItem bind:group={value} {name} value={1}>1</RadioItem>
	</RadioGroup>
{/if}
