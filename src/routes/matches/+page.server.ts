import { redirect } from '@sveltejs/kit';
import { and, desc, eq, sql } from 'drizzle-orm';

import type { PageServerLoad } from './$types';

import { getSelectedAccountByUser } from '$lib/account.server';
import { heroes, type OverwatchHeroSlug } from '$lib/data/heroes';
import { maps } from '$lib/data/maps';
import { currentSeason, seasons, type OverwatchSeasonSlug } from '$lib/data/seasons';
import { db } from '$lib/database/db';
import { accountsMatchesTable, accountsTable, heroesMatchesTable, matchesTable, rankUpdatesTable } from '$lib/database/schema';
import { handleLoginRedirect, jsonParse } from '$lib/utils';

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

async function getMatches({ accountId, season, limit, skip }: GetMatchesForDisplay) {
	const matches = await db
		.select({
			id: matchesTable.id,
			modality: matchesTable.modality,
			time: matchesTable.time,
			result: matchesTable.result,
			map: matchesTable.map,
			heroes: sql<string>`json_group_array(distinct(${heroesMatchesTable.hero}))`,
			accounts: sql<string>`json_group_array(distinct(${accountsTable.battleTag}))`,
			rankUpdate: rankUpdatesTable,
		})
		.from(matchesTable)
		.innerJoin(heroesMatchesTable, eq(heroesMatchesTable.matchId, matchesTable.id))
		.leftJoin(accountsMatchesTable, eq(accountsMatchesTable.matchId, matchesTable.id))
		.leftJoin(accountsTable, eq(accountsMatchesTable.accountId, accountsTable.id))
		.leftJoin(rankUpdatesTable, eq(rankUpdatesTable.matchId, matchesTable.id))
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

	return matches.map(match => ({
		...match,
		modality: seasons[season].modalities[match.modality],
		map: maps[match.map].name,
		heroes: jsonParse<OverwatchHeroSlug[]>(match.heroes).map(slug => heroes[slug].name),
		accounts: jsonParse<string[]>(match.accounts).filter(Boolean)
	}));
}

async function countMatches({ accountId, season }: CountMatchesForDisplay) {
	const [{ count }] = await db
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

	return count;
}


export const load = (async (event) => {
	if (!event.locals.user) {
		throw redirect(301, handleLoginRedirect(event));
	}

	const selectedAccount = await getSelectedAccountByUser(event.locals.user.id);

	const limit = Number(event.url.searchParams.get('limit') ?? 10);
	const skip = Number(event.url.searchParams.get('skip') ?? 0);

	return {
		matches: getMatches({
			accountId: selectedAccount.id,
			season: currentSeason.slug,
			limit,
			skip
		}),
		total: countMatches({
			accountId: selectedAccount.id,
			season: currentSeason.slug
		})
	};
}) satisfies PageServerLoad;
