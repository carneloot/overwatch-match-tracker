<script lang='ts'>
	export let form;
</script>

<svelte:head>
	<title>Register</title>
</svelte:head>

<div class='flex h-full w-full flex-col items-center justify-center'>
	<form method='post' class='flex flex-col items-center justify-center rounded-lg bg-neutral-100 p-10 drop-shadow-xl w-[450px]'>
		<h1 class='my-2 text-center text-3xl font-medium'>Register</h1>

		<label class='mb-3 label w-full'>
			<span>Username</span>
			<input
				class='input'
				class:input-error={!!form?.errors.username}
				value={form?.data?.username ?? ''}
				type='text'
				name='username'
				placeholder='johndoe'
			/>
			{#if form?.errors.username}
				<span class='text-error-500'>{form.errors.username[0]}</span>
			{/if}
		</label>
		<label class='mb-3 label w-full'>
			<span>E-mail</span>
			<input
				class='input'
				class:input-error={!!form?.errors.email}
				value={form?.data?.email ?? ''}
				type='email'
				name='email'
				placeholder='johndoe@email.com'
			/>
			{#if form?.errors.email}
				<span class='text-error-500'>{form.errors.email[0]}</span>
			{/if}
		</label>
		<div class='flex w-full space-x-3'>
			<label class='mb-3 label w-full'>
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
			<label class='mb-5 label w-full'>
				<span>Confirm password</span>
				<input
					class='input'
					class:input-error={!!form?.errors.passwordConfirm}
					type='password'
					name='passwordConfirm'
					placeholder='Confirm password'
				/>
				{#if form?.errors.passwordConfirm}
					<span class='text-error-500'>{form.errors.passwordConfirm[0]}</span>
				{/if}
			</label>
		</div>
		<button
			class='btn variant-filled'
			type='submit'
		>
			Register
		</button>
	</form>
	<p class='mt-5'>
		Already have an account?{' '}<a href='/login' class='anchor'>Login!</a>
	</p>
</div>
