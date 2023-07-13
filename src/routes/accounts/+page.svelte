<script>
	import { Plus, User, CheckCircle, Trash2, Ban } from 'lucide-svelte';
	import RankUpdate from '$lib/components/RankUpdate.svelte';

	export let data;

	const missingSelected = data.accounts.every((account) => !account.selected);
</script>

<svelte:head>
	<title>Accounts</title>
</svelte:head>

<div class="mb-6 flex justify-between">
	<h2 class="h2">Accounts</h2>
	<a href="/accounts/new" class="btn variant-filled-primary text-white">
		<span><Plus size={20} /></span>
		<span>New Account</span>
	</a>
</div>

{#if missingSelected}
	<div class="variant-ghost-error alert mb-6">
		<div>
			<Ban size={20} />
		</div>
		<div class="alert-message">
			<p>You must have at least one selected account!</p>
		</div>
	</div>
{/if}

<div class="card w-full p-5">
	<ul class="list">
		{#each data.accounts as account}
			<li class="pb-3 last:pb-0">
				<span class="badge variant-filled">
					<User size={20} />
				</span>
				<div class="grid h-full w-full grid-cols-[auto_1fr] gap-5">
					<div class="flex items-center gap-2">
						<div>
							{account.battleTag}
						</div>
						{#if account.selected}
							<span class="badge variant-filled-primary">Selected</span>
						{/if}
					</div>
					<div class="flex gap-3">
						{#each account.rankUpdates as prom}
							{#await prom then rankUpdate}
								{#if rankUpdate}
									<RankUpdate {rankUpdate} showRole />
								{/if}
							{/await}
						{/each}
					</div>
				</div>
				<form method="post" class="flex gap-2">
					<input type="hidden" name="accountId" value={account.id} />
					<button
						type="submit"
						formaction="?/select"
						title="Select account"
						class="btn-icon variant-soft-secondary"
					>
						<CheckCircle size={20} />
					</button>
					<button
						type="submit"
						formaction="?/delete"
						title="Delete account"
						class="btn-icon variant-soft-error"
					>
						<Trash2 size={20} />
					</button>
				</form>
			</li>
		{/each}
	</ul>
</div>
