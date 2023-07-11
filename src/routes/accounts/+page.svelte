<script>
	import { Plus, User, CheckCircle, Trash2, Ban } from 'lucide-svelte';

	export let data;

	const missingSelected = data.accounts.every(account => !account.selected);
</script>

<svelte:head>
	<title>Accounts</title>
</svelte:head>

<div class='flex justify-between mb-6'>
	<h2 class='h2'>Accounts</h2>
	<a href='/accounts/new' class='btn variant-filled-primary text-white'>
		<span><Plus size={20} /></span>
		<span>New Account</span>
	</a>
</div>

{#if missingSelected}
	<div class='alert variant-ghost-error mb-6'>
		<div>
			<Ban size={20} />
		</div>
		<div class='alert-message'>
			<p>You must have at least one selected account!</p>
		</div>
	</div>
{/if}

<div class='card w-full p-5'>
	<ul class='list'>
		{#each data.accounts as account}
			<li class='pb-3 last:pb-0'>
				<span class='badge variant-filled'>
					<User size={20} />
				</span>
				<div class='flex gap-2 w-full'>
					<div>
						{account.battleTag}
					</div>
					{#if account.selected}
						<span class='badge variant-filled-primary'>Selected</span>
					{/if}
				</div>
				<form method='post' class='flex gap-2'>
					<input type='hidden' name='accountId' value={account.id}>
					<button
						type='submit'
						formaction='?/select'
						title='Select account'
						class='btn-icon variant-soft-secondary'
					>
						<CheckCircle size={20} />
					</button>
					<button
						type='submit'
						formaction='?/delete'
						title='Delete account'
						class='btn-icon variant-soft-error'
					>
						<Trash2 size={20} />
					</button>
				</form>
			</li>
		{/each}

	</ul>
</div>
