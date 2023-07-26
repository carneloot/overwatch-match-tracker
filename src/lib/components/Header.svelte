<script lang="ts">
	import { LightSwitch } from '@skeletonlabs/skeleton';

	import { page } from '$app/stores';

	import { cn } from '$lib/utils';

	const links = [
		{ name: 'Matches', href: '/matches' },
		{ name: 'Accounts', href: '/accounts' }
	];
</script>

<header
	class="flex w-full items-center justify-between bg-surface-100 px-7 py-5 dark:bg-surface-800"
>
	<h1 class="text-medium text-3xl">
		<a href="/">Overwatch Match Tracker</a>
	</h1>

	<div class="flex flex-row items-center gap-3">
		<nav>
			<ul class="flex flex-row items-center gap-3">
				{#each links as link}
					<li
						class={cn(
							'grid place-items-center',
							$page.route.id?.startsWith(link.href) &&
								'text-primary-700 dark:text-primary-500'
						)}
					>
						<a href={link.href} class="px-3 py-3">{link.name}</a>
					</li>
				{/each}
			</ul>
		</nav>

		<LightSwitch />

		{#if $page.data.user}
			<a href="/logout" class="btn variant-glass-error">Log out</a>
		{:else}
			<a href="/login" class="btn variant-filled-primary">Login</a>
		{/if}
	</div>
</header>
