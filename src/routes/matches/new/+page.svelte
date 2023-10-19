<script lang="ts">
	import { RadioGroup, RadioItem, SlideToggle } from '@skeletonlabs/skeleton';
	import { Clock9 } from 'lucide-svelte';

	import { superForm } from 'sveltekit-superforms/client';

	import SkillDivisionPicker from '$lib/components/SkillDivisionPicker.svelte';
	import SkillTierPicker from '$lib/components/SkillTierPicker.svelte';
	import DateTimeInput from '$lib/components/DateTimeInput.svelte';

	import { heroesByRole } from '$lib/data/heroes';
	import { mapsByType } from '$lib/data/maps';
	import { matchResult } from '$lib/prettify';
	import { heroRole, mapType } from '$lib/prettify';

	export let data;

	const { form, errors, enhance, constraints } = superForm(data.form);

	let showAverageRank = false;

	$: if (!showAverageRank) {
		$form.averageDivision = undefined;
		$form.averageTier = undefined;
	}
</script>

<svelte:head>
	<title>New Match</title>
</svelte:head>

<h2 class="h2 mb-5">New Match</h2>

<form method="POST" class="card w-full p-6" use:enhance>
	<section class="mb-3 grid gap-3 lg:grid-cols-2">
		<label class="label">
			<span>Modality</span>
			<select
				name="modality"
				class="select"
				bind:value={$form.modality}
				{...$constraints.modality}
			>
				{#each Object.entries(data.activeSeason.modalities) as [slug, name]}
					<option value={slug}>{name}</option>
				{/each}
			</select>
		</label>

		<label class="label">
			<span>Map</span>
			<select name="map" class="select" bind:value={$form.map} {...$constraints.map}>
				{#each mapsByType as type}
					<optgroup label={mapType[type.name]}>
						{#each type.values as map}
							<option value={map.slug}>{map.name}</option>
						{/each}
					</optgroup>
				{/each}
			</select>
		</label>

		<label class="label">
			<span>Heroes</span>
			<select
				name="heroes"
				multiple
				class="select"
				bind:value={$form.heroes}
				{...$constraints.heroes}
			>
				{#each heroesByRole as role}
					<optgroup label={heroRole[role.name]}>
						{#each role.values as hero}
							<option value={hero.slug} class="!pl-4">{hero.name}</option>
						{/each}
					</optgroup>
				{/each}
			</select>
			{#if $errors.heroes}
				<small class="text-error-500">{$errors.heroes?._errors?.[0] ?? ''}</small>
			{/if}
		</label>

		<label class="label">
			<span>Accounts</span>
			<select
				name="accounts"
				multiple
				class="select"
				bind:value={$form.accounts}
				{...$constraints.accounts}
			>
				<option value="none">Solo Queue</option>
				{#each data.availableAccounts as account}
					<option value={account.id}>{account.battleTag}</option>
				{/each}
			</select>
		</label>

		<!-- svelte-ignore a11y-label-has-associated-control -->
		<label class="label">
			<span>Time</span>
			<div
				class="input-group input-group-divider !mt-2 grid-cols-[1fr_auto] !rounded-container-token"
			>
				<DateTimeInput
					className="!mt-0"
					name="time"
					bind:value={$form.time}
					{...$constraints.time}
				/>
				<button
					type="button"
					title="Use current time"
					on:click={() => ($form.time = new Date())}
				>
					<Clock9 size={20} />
				</button>
			</div>
		</label>

		<!-- svelte-ignore a11y-label-has-associated-control -->
		<label class="label">
			<span>Result</span>
			<RadioGroup
				rounded="rounded-container-token"
				class="w-full"
				display="inline-grid grid-cols-3"
			>
				<RadioItem
					active="variant-filled-success"
					hover="hover:variant-soft-success"
					bind:group={$form.result}
					name="result"
					value="win"
				>
					{matchResult['win']}
				</RadioItem>
				<RadioItem
					active="variant-filled-warning"
					hover="hover:variant-soft-warning"
					bind:group={$form.result}
					name="result"
					value="draw"
				>
					{matchResult['draw']}
				</RadioItem>
				<RadioItem
					active="variant-filled-error"
					hover="hover:variant-soft-error"
					bind:group={$form.result}
					name="result"
					value="lose"
				>
					{matchResult['lose']}
				</RadioItem>
			</RadioGroup>
		</label>
	</section>

	<section class="mb-3 flex flex-col">
		<div class="mb-3 flex items-center justify-between">
			<h3 class="text-2xl">Average Rank</h3>
			<SlideToggle name="averageRankToggle" size="sm" bind:checked={showAverageRank}>
				Show average rank
			</SlideToggle>
		</div>
		{#if showAverageRank}
			<div class="grid gap-3 lg:grid-cols-2">
				<!-- svelte-ignore a11y-label-has-associated-control -->
				<label class="label">
					<span>Average Skill Tier</span>
					<SkillTierPicker bind:value={$form.averageTier} name="averageTier" />
				</label>

				<!-- svelte-ignore a11y-label-has-associated-control -->
				<label class="label">
					<span>Average Division</span>
					<SkillDivisionPicker
						name="averageDivision"
						bind:value={$form.averageDivision}
						isTop500={$form.averageTier === 'top500'}
						skillTier={$form.averageTier}
					/>
				</label>
			</div>
		{/if}
	</section>

	<div class="flex flex-row justify-end">
		<input type="hidden" name="accountId" bind:value={$form.accountId} />
		<input type="hidden" name="season" bind:value={$form.season} />
		<button type="submit" class="variant-filled-primary btn">Create</button>
	</div>
</form>

<style lang="postcss">
	.label > span {
		@apply block;
	}
</style>
