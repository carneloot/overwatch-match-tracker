import { z } from 'zod';
import { v4 as uuid } from 'uuid';

import { db } from '$lib/database/db';
import { accountsMatchesTable, heroesMatchesTable, matchesTable, MatchResult } from '$lib/database/schema';

import { OverwatchMapEnum } from '$lib/data/maps';
import { OverwatchHeroEnum } from '$lib/data/heroes';
import { currentSeason } from '$lib/data/seasons';

export const newMatchSchema = z.object({
	accountId: z.string().uuid(),
	map: OverwatchMapEnum,
	modality: z.string(),
	heroes: OverwatchHeroEnum
		.array()
		.min(1)
		.max(3, 'You can only choose up to three heroes.'),
	accounts: z.string().array().transform(acc => acc.filter(value => value !== 'none')),
	result: MatchResult,
	time: z
		.coerce.date({
			required_error: 'Please select a date and time',
			invalid_type_error: 'That\'s not a date!'
		})
});
export type NewMatch = z.infer<typeof newMatchSchema>;

export async function createNewMatch(newMatch: NewMatch) {
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
				result: newMatch.result
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
