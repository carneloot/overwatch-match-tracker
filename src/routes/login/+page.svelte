<script lang="ts">
	import { superForm } from 'sveltekit-superforms/client';

	import { dev } from '$app/environment';

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
			<button type="submit" class="btn bg-white text-neutral-800">
				<span><GoogleIcon /></span>
				<span>Continue with Google</span>
			</button>
		</form>
		{#if dev}
			<hr />
			<form method="post" class="flex flex-col justify-center gap-2">
				<!-- Temporary before using flash messages -->
				{#if $errors.email}
					<div class="alert variant-soft-error">
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
				<label class="absolute left-[-999999999999px]">
					<span>Password</span>
					<input type="password" name="password" autocomplete="off" />
				</label>
				<button type="submit" class="variant-ghost btn">Login with email</button>
			</form>
		{/if}
	</div>
</div>

<style lang="postcss">
	.label > span {
		@apply block;
	}
</style>
