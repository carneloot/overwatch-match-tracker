<script lang='ts'>
	import { superForm } from 'sveltekit-superforms/client';

	import { dateToDatetimeLocal } from '$lib/utils';
	import { heroesByRole } from '$lib/data/heroes';
	import { mapsByType } from '$lib/data/maps';
	import { currentSeason } from '$lib/data/seasons';
	import { matchResult } from '$lib/prettify';
	import { heroRole, mapType } from '$lib/prettify.js';

	export let data;

	const { form, errors, enhance, constraints } = superForm(data.form);
</script>

<svelte:head>
	<title>New Match</title>
</svelte:head>

<h2 class='h2 mb-5'>New Match</h2>

<form method='POST' class='w-full p-6 card' use:enhance>

	<div class='mb-3 grid sm:grid-cols-2 gap-3'>
		<label class='label'>
			<span>Modality</span>
			<select name='modality' class='select' bind:value={$form.modality} {...$constraints.modality}>
				{#each Object.entries(currentSeason.modalities) as [ slug, name ]}
					<option value={slug}>{name}</option>
				{/each}
			</select>
		</label>

		<label class='label'>
			<span>Map</span>
			<select name='map' class='select' bind:value={$form.map} {...$constraints.map}>
				{#each mapsByType as type}
					<optgroup label={mapType[type.name]}>
						{#each type.values as map}
							<option value={map.slug}>{map.name}</option>
						{/each}
					</optgroup>
				{/each}
			</select>
		</label>

		<label class='label'>
			<span>Heroes</span>
			<select name='heroes' multiple class='select' bind:value={$form.heroes} {...$constraints.heroes}>
				{#each heroesByRole as role}
					<optgroup label={heroRole[role.name]}>
						{#each role.values as hero}
							<option value={hero.slug}>{hero.name}</option>
						{/each}
					</optgroup>
				{/each}
			</select>
			{#if $errors.heroes}
				<small class='text-error-500'>{$errors.heroes?._errors?.[0] ?? ''}</small>
			{/if}
		</label>

		<label class='label'>
			<span>Accounts</span>
			<select name='accounts' multiple class='select' bind:value={$form.accounts} {...$constraints.accounts}>
				<option value='none'>Solo Queue</option>
				{#each data.availableAccounts as account}
					{#if account.id !== $form?.accountId}
						<option value={account.id}>{account.battleTag}</option>
					{/if}
				{/each}
			</select>
		</label>

		<label class='label'>
			<span>Result</span>
			<select
				name='result'
				class='select'
				bind:value={$form.result}
				{...$constraints.result}
			>
				<option value='win' class='text-success-700'>{matchResult['win']}</option>
				<option value='draw' class='text-warning-700'>{matchResult['draw']}</option>
				<option value='lose' class='text-error-700'>{matchResult['lose']}</option>
			</select>
		</label>

		<label class='label'>
			<span>Time</span>
			<input
				type='datetime-local'
				class='input'
				name='time'
				value={dateToDatetimeLocal($form.time)}
				{...$constraints.time}
			>
		</label>
	</div>
	<div class='flex flex-row justify-end'>
		<input type='hidden' name='accountId' bind:value={$form.accountId}>
		<button type='submit' class='btn variant-filled-primary'>Create</button>
	</div>
</form>
