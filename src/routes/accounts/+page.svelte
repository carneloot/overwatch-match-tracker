<script>
	import { Plus, Ban } from 'lucide-svelte';
	import { enhance } from '$app/forms';

	import RankUpdate from '$lib/components/RankUpdate.svelte';

	export let data;

	const noAccounts = !data.accounts.length;
	$: missingSelected = !data.selectedAccountId;
</script>

<svelte:head>
	<title>Accounts</title>
</svelte:head>

<div class="mb-6 flex justify-between">
	<h2 class="h2">Accounts</h2>
	<a href="/accounts/new" class="variant-filled-primary btn text-white">
		<span><Plus size={20} /></span>
		<span>New Account</span>
	</a>
</div>

{#if missingSelected}
	<div class="alert variant-ghost-error mb-6">
		<div>
			<Ban size={20} />
		</div>
		<div class="alert-message">
			<p>You must have at least one selected account!</p>
		</div>
	</div>
{/if}

{#if noAccounts}
	<p class="mb-6 text-center text-lg">Create at least one account to use the platform!</p>
{/if}

<div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
	{#each data.accounts as account}
		{@const isSelected = account.id === data.selectedAccountId}
		<div class="card card-hover grid grid-rows-[auto_1fr_auto] overflow-hidden">
			<header class="card-header flex gap-2">
				<span>{account.battleTag}</span>
				{#if isSelected}
					<span class="variant-filled-success badge">Selected</span>
				{/if}
			</header>

			<div class="m-2 rounded-lg bg-surface-200 p-2 dark:bg-surface-700">
				<span class="h4 mb-2">Ranks</span>
				{#if !account.rankUpdates.length}
					<p class="py-2">No ranks found ☹️</p>
				{:else}
					<div class="grid grid-cols-2 place-content-end gap-1">
						{#each account.rankUpdates as rankUpdate}
							<RankUpdate {rankUpdate} showRole />
						{/each}
					</div>
				{/if}
			</div>

			<form method="post" use:enhance class="card-footer flex w-full justify-end gap-2">
				<input type="hidden" name="id" value={account.id} />
				<input type="hidden" name="battleTag" value={account.battleTag} />
				<button
					type="submit"
					formaction="?/delete"
					class="variant-soft-error btn btn-sm"
					disabled={isSelected}
					title={isSelected ? 'Account is already selected' : undefined}
				>
					Delete
				</button>

				<button
					type="submit"
					formaction="?/select"
					class="variant-soft-secondary btn btn-sm"
					disabled={isSelected}
					title={isSelected ? 'Account is already selected' : undefined}
				>
					Select
				</button>
			</form>
		</div>
	{/each}
</div>
