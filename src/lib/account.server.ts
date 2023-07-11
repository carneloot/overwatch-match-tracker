import { and, eq, type InferModel } from 'drizzle-orm';

import { db } from '$lib/database/db';
import { accountsTable } from '$lib/database/schema';

export async function getDefaultAccountByUser(userId: string) {
	const [ account ] = await db
		.select()
		.from(accountsTable)
		.where(
			and(
				eq(accountsTable.userId, userId),
				eq(accountsTable.selected, true)
			)
		)
		.all();

	return account;
}

export function getAccountsByUser(userId: string) {
	return db
		.select()
		.from(accountsTable)
		.where(
			eq(accountsTable.userId, userId)
		)
		.all();
}

type NewAccount = InferModel<typeof accountsTable, 'insert'>;

export async function createNewAccount(account: NewAccount) {
	if (account.selected) {
		// Remove selected from previous selected account
		await db
			.update(accountsTable)
			.set({ selected: false })
			.where(
				and(
					eq(accountsTable.userId, account.userId),
					eq(accountsTable.selected, true)
				)
			)
			.run();
	}

	return db
		.insert(accountsTable)
		.values(account)
		.run();
}

export async function deleteAccount(accountId: string) {
	await db
		.delete(accountsTable)
		.where(eq(accountsTable.id, accountId))
		.run();
}

type SelectAccount = {
	accountId: string;
	userId: string;
}

export async function selectAccount({ accountId, userId }: SelectAccount) {
	await db
		.update(accountsTable)
		.set({ selected: false })
		.where(
			and(
				eq(accountsTable.userId, userId),
				eq(accountsTable.selected, true)
			)
		)
		.run();

	await db
		.update(accountsTable)
		.set({ selected: true })
		.where(
			and(
				eq(accountsTable.userId, userId),
				eq(accountsTable.id, accountId)
			)
		)
		.run();
}
