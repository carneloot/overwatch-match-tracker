<script lang='ts'>
	import { superForm } from 'sveltekit-superforms/client';

	import { dateToDatetimeLocal } from '$lib/utils';

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
			<select name='modalityId' class='select' bind:value={$form.modalityId} {...$constraints.modalityId}>
				{#each data.availableModalities as modality}
					<option value={modality.id}>{modality.name}</option>
				{/each}
			</select>
		</label>

		<label class='label'>
			<span>Map</span>
			<select name='mapId' class='select' bind:value={$form.mapId} {...$constraints.mapId}>
				{#each data.availableMaps as modality}
					<optgroup label={modality.name}>
						{#each modality.values as map}
							<option value={map.id}>{map.name}</option>
						{/each}
					</optgroup>
				{/each}
			</select>
		</label>

		<label class='label'>
			<span>Heroes</span>
			<select name='heroes' multiple class='select' bind:value={$form.heroes} {...$constraints.heroes}>
				{#each data.availableHeroes as role}
					<optgroup label={role.name}>
						{#each role.values as hero}
							<option value={hero.id}>{hero.name}</option>
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
				<option value='win' class='text-success-700'>Win</option>
				<option value='draw' class='text-warning-700'>Draw</option>
				<option value='lose' class='text-error-700'>Lose</option>
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
		<input type='hidden' name='seasonId' bind:value={$form.seasonId}>
		<input type='hidden' name='accountId' bind:value={$form.accountId}>
		<button type='submit' class='btn variant-filled-primary'>Create</button>
	</div>
</form>
