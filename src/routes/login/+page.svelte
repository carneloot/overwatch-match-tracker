<script lang='ts'>
	import type { ActionData } from './$types';

	export let form: ActionData;
</script>

<svelte:head>
	<title>Login: Overwatch Match Tracker</title>
</svelte:head>

<div class='flex h-full w-full flex-col items-center justify-center'>
	<form method='post' class='flex flex-col items-center justify-center rounded-lg bg-neutral-100 p-8 drop-shadow-xl w-[400px]'>
		<h1 class='my-2 text-center text-3xl font-medium'>Login</h1>
		<label class='mb-3 w-full label'>
			<span>E-mail or username</span>
			<input
				class='input'
				class:input-error={!!form?.errors.username}
				value={form?.data?.username ?? ''}
				type='text'
				name='username'
				placeholder='johndoe@email.com'
			/>
			{#if form?.errors.username}
				<span class='text-error-500'>{form.errors.username[0]}</span>
			{/if}
		</label>
		<label class='mb-5 w-full label'>
			<span>Password</span>
			<input
				class='input'
				class:input-error={!!form?.errors.password}
				type='password'
				name='password'
				placeholder='Password'
			/>
			{#if form?.errors.password}
				<span class='text-error-500'>{form.errors.password[0]}</span>
			{/if}
		</label>
		{#if form?.errors.general}
			<span class='text-error-500 mb-3'>{form.errors.general[0]}</span>
		{/if}
		<button
			class='btn variant-filled'
			type='submit'
		>
			Login
		</button>
	</form>
	<p class='mt-5'>
		Don't have an account?{' '}<a href='/register' class='anchor'>Sign up!</a>
	</p>
</div>
