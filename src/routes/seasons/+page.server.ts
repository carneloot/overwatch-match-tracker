import { fail, redirect } from '@sveltejs/kit';

import type { Actions, PageServerLoad } from './$types';

import { eq, sql } from 'drizzle-orm';
import { groupBy } from 'typedash';
import { z } from 'zod';

import { seasons } from '$lib/data/seasons';
import { getSession, requireUser } from '$lib/session.server';
import { rankUpdatesTable } from '$lib/database/schema';
import { db } from '$lib/database/db';

type GetRankUpdates = {
	accountId: string;
};
const getRankUpdates = async ({ accountId }: GetRankUpdates) => {
	const rankUpdates = await db
		.select({
			id: rankUpdatesTable.id,
			tier: rankUpdatesTable.tier,
			role: rankUpdatesTable.role,
			season: rankUpdatesTable.season,
			modality: rankUpdatesTable.modality,
			division: rankUpdatesTable.division,
			percentage: rankUpdatesTable.percentage,
			time: sql<Date>`max(${rankUpdatesTable.time})`
		})
		.from(rankUpdatesTable)
		.groupBy(rankUpdatesTable.season, rankUpdatesTable.modality, rankUpdatesTable.role)
		.orderBy(rankUpdatesTable.modality, rankUpdatesTable.role)
		.where(eq(rankUpdatesTable.accountId, accountId))
		.all();

	return groupBy(rankUpdates, (item) => item.season);
};

export const load = (async (event) => {
	await requireUser(event);

	const { getActiveSeason, getActiveAccount } = await getSession(event);

	const activeAccount = getActiveAccount();

	if (!activeAccount) {
		throw redirect(301, '/accounts');
	}

	return {
		rankUpdates: getRankUpdates({ accountId: activeAccount.id }),
		activeSeason: getActiveSeason()
	};
}) satisfies PageServerLoad;

const actionSchema = z.object({
	slug: z.string()
});

export const actions = {
	select: async (event) => {
		await requireUser(event);

		const formData = Object.fromEntries(await event.request.formData());
		const parseResult = actionSchema.safeParse(formData);
		if (!parseResult.success) {
			return fail(400, { errors: parseResult.error.flatten() });
		}

		const { data } = parseResult;

		const { setActiveSeason, sendCookie } = await getSession(event);

		setActiveSeason(seasons[data.slug]);

		await sendCookie(event);
	}
} satisfies Actions;
