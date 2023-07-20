<script lang="ts">
	import { superForm } from 'sveltekit-superforms/client';

	export let data;

	const { form, errors, constraints, capture, restore } = superForm(data.form);

	export const snapshot = { capture, restore };
</script>

<svelte:head>
	<title>New Account</title>
</svelte:head>

<h2 class="h2 mb-5">New Account</h2>
<form method="POST" class="card w-full p-6">
	<div class="mb-3">
		<label class="label mb-3">
			<span>Battle Tag</span>
			<input
				type="text"
				name="battleTag"
				class="input"
				aria-invalid={$errors.battleTag ? 'true' : undefined}
				bind:value={$form.battleTag}
				{...$constraints.battleTag}
			/>
		</label>
		<label class="flex flex-row items-center gap-2">
			<input
				type="checkbox"
				name="selected"
				class="checkbox"
				aria-invalid={$errors.selected ? 'true' : undefined}
				bind:value={$form.selected}
				{...$constraints.selected}
			/>
			<span>Selected by default</span>
		</label>
	</div>
	<div class="flex flex-row justify-end">
		<button type="submit" class="btn variant-filled-primary">Create</button>
	</div>
</form>
