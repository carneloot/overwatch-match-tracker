<script lang="ts">
	import { RadioGroup, RadioItem } from '@skeletonlabs/skeleton';

	import { superForm } from 'sveltekit-superforms/client';

	import SkillTierPicker from '$lib/components/SkillTierPicker.svelte';
	import SkillDivisionPicker from '$lib/components/SkillDivisionPicker.svelte';

	import { heroRole, seasonalUpdate } from '$lib/prettify';

	export let data;

	const { form, errors, constraints } = superForm(data.form);

	$: hasPercentage =
		$form.matchId &&
		!($form.tier === 'top500' || ($form.tier === 'grandmaster' && $form.division === 1));

	$: if ($form.modality !== 'role-queue') {
		$form.role = undefined;
	}
</script>

<svelte:head>
	<title>New Rank Update</title>
</svelte:head>

<h2 class="h2 mb-5">New Rank Update</h2>

<form method="POST" class="card w-full p-6">
	<div class="mb-3 grid gap-3 lg:grid-cols-2">
		{#if !$form.matchId}
			<label class="label">
				<span>Modality</span>
				<select
					name="modality"
					class="select !mt-2"
					aria-invalid={$errors.modality ? true : undefined}
					bind:value={$form.modality}
					{...$constraints.modality}
				>
					{#each Object.entries(data.activeSeason.modalities) as [slug, name]}
						<option value={slug}>{name}</option>
					{/each}
				</select>
			</label>

			<!-- svelte-ignore a11y-label-has-associated-control -->
			<label class="label">
				<span>Seasonal Update</span>
				<RadioGroup
					rounded="rounded-container-token"
					class="w-full"
					display="inline-grid grid-cols-2"
				>
					<RadioItem
						bind:group={$form.seasonalUpdate}
						name="seasonalUpdate"
						value="start"
					>
						{seasonalUpdate['start']}
					</RadioItem>
					<RadioItem bind:group={$form.seasonalUpdate} name="seasonalUpdate" value="end">
						{seasonalUpdate['end']}
					</RadioItem>
				</RadioGroup>
			</label>

			{#if $form.modality === 'role-queue'}
				<!-- svelte-ignore a11y-label-has-associated-control -->
				<label class="label">
					<span>Role</span>
					<RadioGroup
						rounded="rounded-container-token"
						class="w-full"
						display="inline-grid grid-cols-3"
					>
						<RadioItem bind:group={$form.role} name="role" value="tank">
							{heroRole['tank']}
						</RadioItem>
						<RadioItem bind:group={$form.role} name="role" value="damage">
							{heroRole['damage']}
						</RadioItem>
						<RadioItem bind:group={$form.role} name="role" value="support">
							{heroRole['support']}
						</RadioItem>
					</RadioGroup>
				</label>
			{/if}
		{/if}

		<!-- svelte-ignore a11y-label-has-associated-control -->
		<label class="label">
			<span>Skill Tier</span>
			<SkillTierPicker bind:value={$form.tier} name="tier" />
		</label>

		<!-- svelte-ignore a11y-label-has-associated-control -->
		<label class="label">
			<span>{$form.tier === 'top500' ? 'Position' : 'Division'}</span>
			<SkillDivisionPicker
				name="division"
				bind:value={$form.division}
				isTop500={$form.tier === 'top500'}
				skillTier={$form.tier}
			/>
		</label>

		{#if hasPercentage}
			<label class="label">
				<span>Percentage</span>
				<div
					class="input-group input-group-divider grid-cols-[1fr_auto] !rounded-container-token"
				>
					<input
						type="number"
						name="percentage"
						aria-invalid={$errors.percentage ? true : undefined}
						bind:value={$form.percentage}
						{...$constraints.percentage}
					/>
					<div class="input-group-shim">%</div>
				</div>
			</label>
		{/if}
	</div>

	<div class="flex flex-row justify-end">
		<input type="hidden" name="accountId" bind:value={$form.accountId} />
		<input type="hidden" name="season" bind:value={$form.season} />
		{#if $form.matchId}
			<input type="hidden" name="matchId" bind:value={$form.matchId} />
			<input type="hidden" name="time" value={$form.time.toISOString()} />
			<input type="hidden" name="modality" bind:value={$form.modality} />
			<input type="hidden" name="role" bind:value={$form.role} />
		{:else}
			<!-- stop if propagation -->
			{#if $form.seasonalUpdate === 'start'}
				<input
					type="hidden"
					name="time"
					value={data.activeSeason.startTime.toISOString()}
				/>
			{:else}
				<input type="hidden" name="time" value={data.activeSeason.endTime.toISOString()} />
			{/if}
		{/if}
		<button type="submit" class="variant-filled-primary btn">Create</button>
	</div>
</form>

<style lang="postcss">
	.label > span {
		@apply block;
	}
</style>
