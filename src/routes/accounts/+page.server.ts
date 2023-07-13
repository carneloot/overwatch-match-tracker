import { fail, redirect } from '@sveltejs/kit';

import { desc, eq, sql } from 'drizzle-orm';
import { z } from 'zod';

import type { Actions, PageServerLoad } from './$types';

import { deleteAccount, selectAccount } from '$lib/account.server';
import { db } from '$lib/database/db';
import { accountsTable, rankUpdatesTable } from '$lib/database/schema';
import { handleLoginRedirect, jsonParse } from '$lib/utils';

async function getRankUpdate(rankUpdateId: string) {
	const [rankUpdate] = await db
		.select()
		.from(rankUpdatesTable)
		.where(eq(rankUpdatesTable.id, rankUpdateId))
		.all();

	return rankUpdate;
}

async function getAccountsByUser(userId: string) {
	const rankUpdates = db
		.select({ id: rankUpdatesTable.id, accountId: rankUpdatesTable.accountId })
		.from(rankUpdatesTable)
		.groupBy(rankUpdatesTable.accountId, rankUpdatesTable.role, rankUpdatesTable.modality)
		.orderBy(desc(rankUpdatesTable.time), rankUpdatesTable.role, rankUpdatesTable.modality)
		.as('rankUpdates');

	const accounts = await db
		.select({
			id: accountsTable.id,
			battleTag: accountsTable.battleTag,
			selected: accountsTable.selected,
			rankUpdates: sql<string | null>`json_group_array(${rankUpdates.id})`,
		})
		.from(accountsTable)
		.leftJoin(rankUpdates, eq(rankUpdates.accountId, accountsTable.id))
		.where(
			eq(accountsTable.userId, userId)
		)
		.groupBy(accountsTable.id)
		.all();

	return Promise.all(accounts.map(async account => {
		const rankUpdates = await Promise.all(jsonParse<string[]>(account.rankUpdates ?? '[]').filter(Boolean).map(getRankUpdate))

		rankUpdates.sort((a, b) => {
			if (!a.role) {
				return -1;
			}

			if (!b.role) {
				return 1;
			}

			return a.role.localeCompare(b.role)
		});

		return {
			...account,
			rankUpdates,
		};
	}));
}

export const load = (async (event) => {
	if (!event.locals.user) {
		throw redirect(302, handleLoginRedirect(event));
	}

	return {
		accounts: getAccountsByUser(event.locals.user.id)
	};

}) satisfies PageServerLoad;

const actionSchema = z.object({
	accountId: z.string().uuid()
});

export const actions = {
	delete: async (event) => {
		if (!event.locals.user) {
			throw redirect(302, handleLoginRedirect(event));
		}

		const formData = Object.fromEntries(await event.request.formData());
		const parseResult = actionSchema.safeParse(formData);
		if (!parseResult.success) {
			return fail(400, { errors: parseResult.error.flatten() });
		}

		const { data } = parseResult;

		await deleteAccount(data.accountId);
	},
	select: async (event) => {
		if (!event.locals.user) {
			throw redirect(302, handleLoginRedirect(event));
		}

		const formData = Object.fromEntries(await event.request.formData());
		const parseResult = actionSchema.safeParse(formData);
		if (!parseResult.success) {
			return fail(400, { errors: parseResult.error.flatten() });
		}

		const { data } = parseResult;

		await selectAccount({
			userId: event.locals.user.id,
			accountId: data.accountId
		});
	}
} satisfies Actions;
