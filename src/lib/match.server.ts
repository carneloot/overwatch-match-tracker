import { z } from 'zod';
import { v4 as uuid } from 'uuid';
import { and, desc, eq, sql } from 'drizzle-orm';

import { db } from '$lib/database/db';
import {
	accountsMatchesTable,
	accountsTable,
	heroesMatchesTable,
	heroesTable,
	mapsTable,
	matchesTable,
	modalitiesTable
} from '$lib/database/schema';

export const newMatchSchema = z.object({
	accountId: z.string().uuid(),
	mapId: z.string().uuid(),
	seasonId: z.string().uuid(),
	modalityId: z.string().uuid(),
	heroes: z.string({ required_error: '' }).uuid().array().min(1).max(3, 'You can only choose up to three heroes.'),
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
			modalityId: newMatch.modalityId,
			accountId: newMatch.accountId,
			mapId: newMatch.mapId,
			time: newMatch.time,
			seasonId: newMatch.seasonId,
			result: newMatch.result
		})
		.run();

	await db
		.insert(accountsMatchesTable)
		.values(newMatch.accounts.map(accountId => ({ id: uuid(), matchId: newId, accountId })))
		.run();

	await db
		.insert(heroesMatchesTable)
		.values(newMatch.heroes.map(heroId => ({ id: uuid(), matchId: newId, heroId })))
		.run();
}

type GetMatchesForDisplay = {
	accountId: string;
	seasonId: string;
	limit: number;
	skip: number;
}

type CountMatchesForDisplay = {
	accountId: string;
	seasonId: string;
}

export async function getMatchesForDisplay({ accountId, seasonId, limit, skip }: GetMatchesForDisplay) {
	// @formatter:off
	const matches = await db
		.select({
			id: matchesTable.id,
			modality: modalitiesTable.name,
			time: matchesTable.time,
			result: matchesTable.result,
			map: mapsTable.name,
			role: heroesTable.role,
			heroes: sql<string>`json_group_array(distinct(${heroesTable.name}))`,
			accounts: sql<string>`json_group_array(distinct(${accountsTable.battleTag}))`
		})
		.from(matchesTable)
		.innerJoin(modalitiesTable, eq(modalitiesTable.id, matchesTable.modalityId))
		.innerJoin(mapsTable, eq(mapsTable.id, matchesTable.mapId))
		.innerJoin(heroesMatchesTable, eq(heroesMatchesTable.matchId, matchesTable.id))
		.innerJoin(heroesTable, eq(heroesMatchesTable.heroId, heroesTable.id))
		.innerJoin(accountsMatchesTable, eq(accountsMatchesTable.matchId, matchesTable.id))
		.innerJoin(accountsTable, eq(accountsMatchesTable.accountId, accountsTable.id))
		.where(
			and(
				eq(matchesTable.seasonId, seasonId),
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
		heroes: JSON.parse(match.heroes) as string[],
		accounts: JSON.parse(match.accounts) as string[]
	}));
}

export async function countMatchesForDisplay({ accountId, seasonId }: CountMatchesForDisplay) {
	// @formatter:off
	const [ { count } ] = await db
		.select({
			count: sql<number>`count(${matchesTable.id})`,
		})
		.from(matchesTable)
		.where(
			and(
				eq(matchesTable.seasonId, seasonId),
				eq(matchesTable.accountId, accountId)
			)
		)
		.all();
	// @formatter:on

	return count;
}
