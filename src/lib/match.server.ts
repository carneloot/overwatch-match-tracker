import { z } from 'zod';
import { v4 as uuid } from 'uuid';
import { and, desc, eq, sql } from 'drizzle-orm';

import { db } from '$lib/database/db';
import { accountsMatchesTable, accountsTable, heroesMatchesTable, matchesTable } from '$lib/database/schema';

import { allMapSlugs, type OverwatchMapSlug } from '$lib/data/maps';
import { allHeroSlugs, type OverwatchHeroSlug } from '$lib/data/heroes';
import { currentSeason, type OverwatchSeasonSlug } from '$lib/data/seasons';
import { jsonParse } from '$lib/utils';

const OVERWATCH_MAPS: [ OverwatchMapSlug, ...OverwatchMapSlug[] ] = [
	allMapSlugs[0],
	...allMapSlugs.slice(1)
];

const OVERWATCH_HEROES: [ OverwatchHeroSlug, ...OverwatchHeroSlug[] ] = [
	allHeroSlugs[0],
	...allHeroSlugs.slice(1)
];

export const newMatchSchema = z.object({
	accountId: z.string().uuid(),
	map: z.enum(OVERWATCH_MAPS),
	modality: z.string(),
	heroes: z
		.enum(OVERWATCH_HEROES, { required_error: '' })
		.array()
		.min(1)
		.max(3, 'You can only choose up to three heroes.'),
	accounts: z.string().array(),
	result: z.enum([ 'win', 'lose', 'draw' ]),
	time: z
		.coerce.date({
			required_error: 'Please select a date and time',
			invalid_type_error: 'That\'s not a date!'
		})
});
export type NewMatch = z.infer<typeof newMatchSchema>;

export async function createNewMatch(newMatch: NewMatch) {
	const newId = uuid();

	await db
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

	await db
		.insert(accountsMatchesTable)
		.values(newMatch.accounts.map(accountId => ({ id: uuid(), matchId: newId, accountId })))
		.run();

	await db
		.insert(heroesMatchesTable)
		.values(newMatch.heroes.map(hero => ({ id: uuid(), matchId: newId, hero })))
		.run();
}

type GetMatchesForDisplay = {
	accountId: string;
	season: OverwatchSeasonSlug;
	limit: number;
	skip: number;
}

type CountMatchesForDisplay = {
	accountId: string;
	season: OverwatchSeasonSlug;
}

export async function getMatchesForDisplay({ accountId, season, limit, skip }: GetMatchesForDisplay) {
	// @formatter:off
	const matches = await db
		.select({
			id: matchesTable.id,
			modality: matchesTable.modality,
			time: matchesTable.time,
			result: matchesTable.result,
			map: matchesTable.map,
			heroes: sql<string>`json_group_array(distinct(${heroesMatchesTable.hero}))`,
			accounts: sql<string>`json_group_array(distinct(${accountsTable.battleTag}))`
		})
		.from(matchesTable)
		.innerJoin(heroesMatchesTable, eq(heroesMatchesTable.matchId, matchesTable.id))
		.innerJoin(accountsMatchesTable, eq(accountsMatchesTable.matchId, matchesTable.id))
		.innerJoin(accountsTable, eq(accountsMatchesTable.accountId, accountsTable.id))
		.where(
			and(
				eq(matchesTable.season, season),
				eq(matchesTable.accountId, accountId)
			)
		)
		.limit(limit)
		.offset(skip)
		.orderBy(desc(matchesTable.time))
		.groupBy(matchesTable.id)
		.all();
	// @formatter:on

	return matches.map(match => ({
		...match,
		heroes: jsonParse<OverwatchHeroSlug[]>(match.heroes),
		accounts: jsonParse<string[]>(match.accounts)
	}));
}

export async function countMatchesForDisplay({ accountId, season }: CountMatchesForDisplay) {
	// @formatter:off
	const [ { count } ] = await db
		.select({
			count: sql<number>`count(${matchesTable.id})`,
		})
		.from(matchesTable)
		.where(
			and(
				eq(matchesTable.season, season),
				eq(matchesTable.accountId, accountId)
			)
		)
		.all();
	// @formatter:on

	return count;
}
