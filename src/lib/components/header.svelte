<script lang='ts'>
	import { page } from '$app/stores';
	import type { User } from '$lib/database/schema';

	export let user: User | null = null;

	const links = [
		{ name: 'Matches', href: '/matches' }
	];
</script>

<header class='flex w-full justify-between py-5'>
	<h1 class='text-3xl text-medium'>
		<a href='/'>
			Ovewatch Match Tracker
		</a>
	</h1>

	<nav>
		<ul class='flex flex-row items-center gap-3'>
			{#each links as link}
				<li
					class='grid place-items-center'
					class:text-primary-800={$page.route.id?.startsWith(link.href) ?? false}
				>
					<a href={link.href} class='px-5 py-3'>{link.name}</a>
				</li>
			{/each}
			{#if user !== null}
				<li class='grid place-items-center'>
					<a href='/logout' class='btn variant-glass-error'>Log out</a>
				</li>
			{:else}
				<li class='grid place-items-center'>
					<a href='/login' class='btn variant-filled-primary'>Login</a>
				</li>
				<li class='grid place-items-center'>
					<a href='/register' class='btn variant-ringed-primary'>Register</a>
				</li>
			{/if}
		</ul>
	</nav>
</header>
