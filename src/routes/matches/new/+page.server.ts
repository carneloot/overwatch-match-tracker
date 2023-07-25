import { fail, redirect } from '@sveltejs/kit';

import { superValidate } from 'sveltekit-superforms/server';
import { v4 as uuid } from 'uuid';
import { z } from 'zod';
import { format, parse } from 'date-fns';

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
import { currentSeason } from '$lib/data/seasons';
import { db } from '$lib/database/db';
import { eq } from 'drizzle-orm';
import { DATETIME_LOCAL_FORMAT, DATETIME_LOCAL_REGEX } from '$lib/utils';

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
	time: z.string().regex(DATETIME_LOCAL_REGEX)
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
				time: parse(newMatch.time, DATETIME_LOCAL_FORMAT, new Date()),
				season: currentSeason.slug,
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

	const currentTime = format(new Date(), DATETIME_LOCAL_FORMAT);

	const { getActiveAccountId } = await getSession(event);

	const storedData = await getNewMatchValues(event);

	const initialValues = {
		time: currentTime,
		accountId: getActiveAccountId(),
		result: 'win',
		...storedData
	} satisfies Partial<NewMatch>;

	const form = await superValidate(initialValues, newMatchSchema, { errors: false });

	const availableAccounts = getAccountsByUser(user.id);

	return {
		form,
		availableAccounts
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
