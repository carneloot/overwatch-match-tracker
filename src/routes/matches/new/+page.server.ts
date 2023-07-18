import { fail, redirect } from '@sveltejs/kit';

import { superValidate } from 'sveltekit-superforms/server';
import { v4 as uuid } from 'uuid';
import { z } from 'zod';

import type { Actions, PageServerLoad } from './$types';

import * as constants from '$lib/constants';

import { MatchResult, matchesTable, accountsMatchesTable, heroesMatchesTable, SkillTier } from '$lib/database/schema';
import { getAccountsByUser, getSelectedAccountByUser } from '$lib/account.server';
import { handleLoginRedirect } from '$lib/utils';
import { OverwatchHeroEnum } from '$lib/data/heroes';
import { OverwatchMapEnum } from '$lib/data/maps';
import { currentSeason } from '$lib/data/seasons';
import { db } from '$lib/database/db';

const newMatchSchema = z.object({
	accountId: z.string().uuid(),
	map: OverwatchMapEnum,
	modality: z.string(),
	heroes: OverwatchHeroEnum
		.array()
		.min(1)
		.max(3, 'You can only choose up to three heroes.'),
	accounts: z.string().array().transform(acc => acc.filter(value => value !== 'none')),
	result: MatchResult,
	averageTier: SkillTier.optional(),
	averageDivision: z.number().int().min(1).max(500).optional(),
	time: z
		.coerce.date({
			required_error: 'Please select a date and time',
			invalid_type_error: 'That\'s not a date!'
		})
});
type NewMatch = z.infer<typeof newMatchSchema>;

async function createNewMatch(newMatch: NewMatch) {
	const newId = uuid();

	await db.transaction(async tx => {
		await tx
			.insert(matchesTable)
			.values({
				id: newId,
				modality: newMatch.modality,
				accountId: newMatch.accountId,
				map: newMatch.map,
				time: newMatch.time,
				season: currentSeason.slug,
				result: newMatch.result,
				averageTier: newMatch.averageTier,
				averageDivision: newMatch.averageDivision
			})
			.run();

		if (newMatch.accounts.length) {
			await tx
				.insert(accountsMatchesTable)
				.values(newMatch.accounts.map(accountId => ({ id: uuid(), matchId: newId, accountId })))
				.run();
		}

		await tx
			.insert(heroesMatchesTable)
			.values(newMatch.heroes.map(hero => ({ id: uuid(), matchId: newId, hero })))
			.run();

	});

}


export const load = (async (event) => {
	if (!event.locals.user) {
		throw redirect(302, handleLoginRedirect(event));
	}

	const currentTime = new Date();

	const userAccount = await getSelectedAccountByUser(event.locals.user.id);

	const keepValuesCookie = JSON.parse(event.cookies.get(constants.cookies.matchKeepValue) ?? 'null') as Pick<NewMatch, 'accounts' | 'modality'> | null;

	const initialValues = {
		time: currentTime,
		accountId: userAccount.id,
		accounts: [],
		result: 'win',
		...(keepValuesCookie ?? {})
	} satisfies Partial<NewMatch>;

	const form = await superValidate(initialValues, newMatchSchema, { errors: false });

	const availableAccounts = getAccountsByUser(event.locals.user.id);

	return {
		form,
		availableAccounts
	};
}) satisfies PageServerLoad;

export const actions = {
	default: async (event) => {
		const form = await superValidate(event, newMatchSchema);

		if (!form.valid) {
			return fail(400, { form });
		}

		await createNewMatch(form.data);

		// region Keep Values Cookie
		const keepValuesCookie = {
			accounts: form.data.accounts.length
				? form.data.accounts
				: ['none'],
			modality: form.data.modality
		};

		event.cookies.set(constants.cookies.matchKeepValue, JSON.stringify(keepValuesCookie), {
			path: '/matches/new'
		});
		// endregion

		throw redirect(301, '/matches');
	}
} satisfies Actions;
