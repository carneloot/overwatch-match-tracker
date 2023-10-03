import { fail } from '@sveltejs/kit';

import { eq, inArray, sql } from 'drizzle-orm';
import { z } from 'zod';

import type { Actions, PageServerLoad } from './$types';

import { db } from '$lib/database/db';
import { accountsTable, rankUpdatesTable } from '$lib/database/schema';
import { jsonParse } from '$lib/utils';
import { getSession, requireUser } from '$lib/session.server';

async function getRankUpdates(rankUpdateIds: string[]) {
	if (!rankUpdateIds.length) {
		return [];
	}

	return db
		.select()
		.from(rankUpdatesTable)
		.where(inArray(rankUpdatesTable.id, rankUpdateIds))
		.all();
}

async function getAccountsByUser(userId: string) {
	const rankUpdates = db
		.select({
			id: rankUpdatesTable.id,
			accountId: rankUpdatesTable.accountId,
			time: sql<Date>`max(${rankUpdatesTable.time})`
		})
		.from(rankUpdatesTable)
		.groupBy(rankUpdatesTable.accountId, rankUpdatesTable.modality, rankUpdatesTable.role)
		.orderBy(rankUpdatesTable.modality, rankUpdatesTable.role)
		.as('rankUpdates');

	const accounts = await db
		.select({
			id: accountsTable.id,
			battleTag: accountsTable.battleTag,
			rankUpdates: sql<string | null>`json_group_array(${rankUpdates.id})`
		})
		.from(accountsTable)
		.leftJoin(rankUpdates, eq(rankUpdates.accountId, accountsTable.id))
		.where(eq(accountsTable.userId, userId))
		.groupBy(accountsTable.id)
		.all();

	return Promise.all(
		accounts.map(async (account) => {
			const rankUpdateIds = jsonParse<string[]>(account.rankUpdates ?? '[]').filter(Boolean);
			const rankUpdates = await getRankUpdates(rankUpdateIds);

			rankUpdates.sort((a, b) => {
				if (!a.role) {
					return -1;
				}

				if (!b.role) {
					return 1;
				}

				return a.role.localeCompare(b.role);
			});

			return {
				...account,
				rankUpdates
			};
		})
	);
}

export const load = (async (event) => {
	const user = await requireUser(event);

	const { getActiveAccount } = await getSession(event);

	return {
		accounts: getAccountsByUser(user.id),
		selectedAccountId: getActiveAccount()?.id
	};
}) satisfies PageServerLoad;

const actionSchema = z.object({
	id: z.string().uuid(),
	battleTag: z.string()
});

async function deleteAccount(accountId: string) {
	await db.delete(accountsTable).where(eq(accountsTable.id, accountId)).run();
}

export const actions = {
	delete: async (event) => {
		await requireUser(event);

		const formData = Object.fromEntries(await event.request.formData());
		const parseResult = actionSchema.safeParse(formData);
		if (!parseResult.success) {
			return fail(400, { errors: parseResult.error.flatten() });
		}

		const { data } = parseResult;

		await deleteAccount(data.id);
	},
	select: async (event) => {
		await requireUser(event);

		const formData = Object.fromEntries(await event.request.formData());
		const parseResult = actionSchema.safeParse(formData);
		if (!parseResult.success) {
			return fail(400, { errors: parseResult.error.flatten() });
		}

		const { data } = parseResult;

		const { setActiveAccount, sendCookie } = await getSession(event);

		setActiveAccount(data);

		await sendCookie(event);
	}
} satisfies Actions;
