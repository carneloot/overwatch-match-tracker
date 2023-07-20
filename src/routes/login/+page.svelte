<script lang="ts">
	import { superForm } from 'sveltekit-superforms/client';

	import GoogleIcon from './GoogleIcon.svelte';

	export let data;

	const { form, constraints, errors } = superForm(data.form);
</script>

<svelte:head>
	<title>Login</title>
</svelte:head>

<div class="grid h-full place-items-center">
	<div class="card flex flex-col justify-center gap-3 px-10 py-8 sm:w-[400px]">
		<h2 class="h2 mb-5">Login</h2>
		<form action="/auth/google" class="contents">
			<button type="submit" class="btn bg-white dark">
				<span><GoogleIcon /></span>
				<span>Continue with Google</span>
			</button>
		</form>
		<hr />
		<!-- Temporary before using flash messages -->
		<form method="post" class="contents">
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
</div>

<style lang="postcss">
	.label > span {
		@apply block;
	}
</style>
