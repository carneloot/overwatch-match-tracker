import { fail, redirect } from '@sveltejs/kit';

import { superValidate } from 'sveltekit-superforms/server';
import { v4 as uuid } from 'uuid';
import { eq } from 'drizzle-orm';
import { z } from 'zod';

import type { Actions, PageServerLoad } from './$types';

import {
	MatchResult,
	matchesTable,
	accountsMatchesTable,
	heroesMatchesTable,
	SkillTier,
	accountsTable
} from '$lib/database/schema';
import { getNewMatchValues, setNewMatchValues } from '$lib/sessions/new-match.session';
import { getSession, requireUser } from '$lib/session.server';
import { OverwatchHeroEnum } from '$lib/data/heroes';
import { OverwatchMapEnum } from '$lib/data/maps';
import { db } from '$lib/database/db';

const newMatchSchema = z.object({
	accountId: z.string().uuid(),
	map: OverwatchMapEnum,
	modality: z.string(),
	heroes: OverwatchHeroEnum.array().min(1).max(3, 'You can only choose up to three heroes.'),
	accounts: z
		.string()
		.array()
		.transform((acc) => acc.filter((value) => value !== 'none')),
	result: MatchResult,
	averageTier: SkillTier.optional(),
	averageDivision: z.number().int().min(1).max(500).optional(),
	time: z.coerce.date(),
	season: z.string()
});
type NewMatch = z.infer<typeof newMatchSchema>;

async function createNewMatch(newMatch: NewMatch) {
	const newId = uuid();

	await db.transaction(async (tx) => {
		await tx
			.insert(matchesTable)
			.values({
				id: newId,
				modality: newMatch.modality,
				accountId: newMatch.accountId,
				map: newMatch.map,
				time: newMatch.time,
				season: newMatch.season,
				result: newMatch.result,
				averageTier: newMatch.averageTier,
				averageDivision: newMatch.averageDivision
			})
			.run();

		if (newMatch.accounts.length) {
			await tx
				.insert(accountsMatchesTable)
				.values(
					newMatch.accounts.map((accountId) => ({
						id: uuid(),
						matchId: newId,
						accountId
					}))
				)
				.run();
		}

		await tx
			.insert(heroesMatchesTable)
			.values(newMatch.heroes.map((hero) => ({ id: uuid(), matchId: newId, hero })))
			.run();
	});
}

function getAccountsByUser(userId: string) {
	return db
		.select()
		.from(accountsTable)
		.where(eq(accountsTable.userId, userId))
		.orderBy(accountsTable.battleTag)
		.all();
}

export const load = (async (event) => {
	const user = await requireUser(event);

	const { getActiveAccount, getActiveSeason } = await getSession(event);

	const storedData = await getNewMatchValues(event);
	const activeSeason = getActiveSeason();
	const activeAccount = getActiveAccount();

	if (!activeAccount) {
		throw redirect(301, '/matches');
	}

	const initialValues = {
		time: new Date(),
		accountId: activeAccount.id,
		result: 'win',
		season: activeSeason.slug,
		...storedData
	} satisfies Partial<NewMatch>;

	const form = await superValidate(initialValues, newMatchSchema, { errors: false });

	const availableAccounts = getAccountsByUser(user.id).then((accounts) =>
		accounts.filter((account) => account.id !== activeAccount.id)
	);

	return {
		form,
		availableAccounts,
		activeSeason
	};
}) satisfies PageServerLoad;

export const actions = {
	default: async (event) => {
		await requireUser(event);

		const form = await superValidate(event, newMatchSchema);

		if (!form.valid) {
			return fail(400, { form });
		}

		await createNewMatch(form.data);

		await setNewMatchValues(event, {
			accounts: form.data.accounts.length ? form.data.accounts : ['none'],
			modality: form.data.modality
		});

		throw redirect(301, '/matches');
	}
} satisfies Actions;
