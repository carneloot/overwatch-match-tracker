<script lang="ts">
	import { superForm } from 'sveltekit-superforms/client';

	import { PUBLIC_HCAPTCHA_SITE_KEY } from '$env/static/public';

	import GoogleIcon from './GoogleIcon.svelte';

	export let data;

	const { form, constraints, errors } = superForm(data.form);
</script>

<svelte:head>
	<title>Login</title>
	<script src="https://js.hcaptcha.com/1/api.js"></script>
</svelte:head>

<div class="grid h-full place-items-center">
	<div class="card flex flex-col justify-center gap-3 px-10 py-8 sm:w-[400px]">
		<h2 class="h2 mb-5">Login</h2>
		<form action="/auth/google" class="contents">
			<button type="submit" class="dark btn bg-white">
				<span><GoogleIcon /></span>
				<span>Continue with Google</span>
			</button>
		</form>
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
			<div class="h-captcha flex justify-center" data-sitekey={PUBLIC_HCAPTCHA_SITE_KEY} />
			<button type="submit" class="btn variant-ghost">Login with email</button>
		</form>
	</div>
</div>

<style lang="postcss">
	.label > span {
		@apply block;
	}
</style>
