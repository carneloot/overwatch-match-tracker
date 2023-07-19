<script lang="ts">
	import { superForm } from 'sveltekit-superforms/client';

	import GoogleLoginButton from '$lib/components/GoogleLoginButton.svelte';

	export let data;

	const { form, constraints, errors } = superForm(data.form);
</script>

<svelte:head>
	<title>Login</title>
</svelte:head>

<div class="grid h-full place-items-center">
	<form method="post" class="card flex flex-col justify-center gap-3 px-10 py-8 sm:w-[400px]">
		<h2 class="h2 mb-5">Login</h2>
		<GoogleLoginButton />
		<hr />
		<!-- Temporary before using flash messages -->
		{#if $errors.email}
			<div class="variant-soft-error alert">
				{$errors.email}
			</div>
		{/if}
		<label class="label">
			<span>Email address</span>
			<input
				type="email"
				name="email"
				class="input w-full"
				aria-invalid={$errors.email ? 'true' : 'false'}
				placeholder="john@doe.com"
				bind:value={$form.email}
				{...$constraints.email}
			/>
		</label>
		<button type="submit" class="btn variant-ghost">Login with email</button>
	</form>
</div>

<style lang="postcss">
	.label > span {
		@apply block;
	}
</style>
