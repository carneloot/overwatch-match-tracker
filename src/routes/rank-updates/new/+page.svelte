<script lang="ts">
	import { superForm } from 'sveltekit-superforms/client';

	import { heroRole, seasonalUpdate, skillTier } from '$lib/prettify';
	import { currentSeason } from '$lib/data/seasons';
	import { dateToDatetimeLocal } from '$lib/utils';
	import { SkillTier } from '$lib/database/schema';

	export let data;

	const { form, errors, constraints } = superForm(data.form);

	$: hasPercentage = !(
		$form.tier === 'top500' ||
		($form.tier === 'grandmaster' && $form.division === 1)
	);
</script>

<svelte:head>
	<title>New Rank Update</title>
</svelte:head>

<h2 class="h2 mb-5">New Rank Update</h2>

<form method="POST" class="card w-full p-6">
	<div class="mb-3 grid gap-3 sm:grid-cols-2">
		{#if !$form.matchId}
			<label class="label">
				<span>Modality</span>
				<select
					name="modality"
					class="select"
					aria-invalid={$errors.modality ? true : undefined}
					bind:value={$form.modality}
					{...$constraints.modality}
				>
					{#each Object.entries(currentSeason.modalities) as [slug, name]}
						<option value={slug}>{name}</option>
					{/each}
				</select>
			</label>

			<label class="label">
				<span>Seasonal Update</span>
				<select
					class="select"
					name="seasonalUpdate"
					aria-invalid={$errors.seasonalUpdate ? true : undefined}
					bind:value={$form.seasonalUpdate}
					{...$constraints.seasonalUpdate}
				>
					<option value="start">{seasonalUpdate['start']}</option>
					<option value="end">{seasonalUpdate['end']}</option>
				</select>
			</label>

			<label class="label">
				<span>Time</span>
				<input
					type="datetime-local"
					class="input"
					name="time"
					value={dateToDatetimeLocal($form.time)}
					{...$constraints.time}
				/>
			</label>

			{#if $form.modality === 'role-queue'}
				<label class="label">
					<span>Role</span>
					<select
						class="select"
						name="role"
						bind:value={$form.role}
						{...$constraints.role}
					>
						<option value="damage">{heroRole['damage']}</option>
						<option value="support">{heroRole['support']}</option>
						<option value="tank">{heroRole['tank']}</option>
					</select>
				</label>
			{/if}
		{/if}

		<label class="label">
			<span>Skill Tier</span>
			<select class="select" name="tier" bind:value={$form.tier} {...$constraints.tier}>
				{#each SkillTier.options as tier}
					<option value={tier}>{skillTier[tier]}</option>
				{/each}
			</select>
		</label>

		<label class="label">
			<span>{$form.tier === 'top500' ? 'Position' : 'Division'}</span>
			<input
				type="number"
				class="input"
				name="division"
				aria-invalid={$errors.division ? true : undefined}
				bind:value={$form.division}
				{...$constraints.division}
				max={$form.tier === 'top500' ? 500 : 5}
			/>
		</label>

		{#if hasPercentage}
			<label class="label">
				<span>Percentage</span>
				<input
					type="number"
					class="input"
					name="percentage"
					aria-invalid={$errors.percentage ? true : undefined}
					bind:value={$form.percentage}
					{...$constraints.percentage}
				/>
			</label>
		{/if}
	</div>

	<div class="flex flex-row justify-end">
		<input type="hidden" name="accountId" bind:value={$form.accountId} />
		{#if $form.matchId}
			<input type="hidden" name="matchId" bind:value={$form.matchId} />
			<input type="hidden" name="time" value={$form.time.toISOString()} />
			<input type="hidden" name="modality" bind:value={$form.modality} />
			<input type="hidden" name="role" bind:value={$form.role} />
		{/if}
		<button type="submit" class="btn variant-filled-primary">Create</button>
	</div>
</form>
