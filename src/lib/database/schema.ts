import { index, integer, sqliteTable, text, uniqueIndex } from 'drizzle-orm/sqlite-core';
import type { InferModel } from 'drizzle-orm';
import { z } from 'zod';

import type { HeroRole, OverwatchHeroSlug } from '$lib/data/heroes';
import type { OverwatchMapSlug } from '$lib/data/maps';
import type { OverwatchSeasonSlug } from '$lib/data/seasons';

export type UserRole = 'user' | 'admin';

export const MatchResult = z.enum(['win', 'lose', 'draw']);
export type MatchResult = z.infer<typeof MatchResult>;

export const SeasonalUpdate = z.enum(['start', 'end']);
export type SeasonalUpdate = z.infer<typeof SeasonalUpdate>;

export const SkillTier = z.enum([
	'bronze',
	'silver',
	'gold',
	'platinum',
	'diamond',
	'master',
	'grandmaster',
	'top500'
]);
export type SkillTier = z.infer<typeof SkillTier>;

export const usersTable = sqliteTable(
	'users',
	{
		id: text('id').primaryKey(),
		email: text('email').notNull()
	},
	(users) => ({
		emailIdx: uniqueIndex('emailIdx').on(users.email)
	})
);

export type User = InferModel<typeof usersTable, 'select'>;

export const sessionsTable = sqliteTable(
	'sessions',
	{
		id: text('id').primaryKey(),
		userId: text('user_id')
			.references(() => usersTable.id)
			.notNull(),
		expires: integer('expires', { mode: 'timestamp' }).notNull()
	},
	(self) => ({
		userIdIdx: index('sessionUserIdIdx').on(self.userId)
	})
);

export const accountsTable = sqliteTable(
	'accounts',
	{
		id: text('id').primaryKey(),
		userId: text('user_id')
			.references(() => usersTable.id)
			.notNull(),
		battleTag: text('battle_tag'),
		selected: integer('selected', { mode: 'boolean' }).default(false)
	},
	(self) => ({
		userIdIdx: index('userIdIdx').on(self.userId)
	})
);

export const rankUpdatesTable = sqliteTable(
	'rank_updates',
	{
		id: text('id').primaryKey(),
		accountId: text('account_id')
			.references(() => accountsTable.id, { onDelete: 'cascade' })
			.notNull(),
		matchId: text('match_id').references(() => matchesTable.id, { onDelete: 'cascade' }),
		seasonalUpdate: text('seasonal_update').$type<SeasonalUpdate>(),
		season: text('season').notNull().$type<OverwatchSeasonSlug>(),
		modality: text('modality').notNull(),
		role: text('role').$type<HeroRole>(),
		time: integer('time', { mode: 'timestamp' }).notNull(),
		tier: text('tier').notNull().$type<SkillTier>(),
		division: integer('division').notNull(),
		percentage: integer('percentage')
	},
	(self) => ({
		accountIdIdx: index('rankUpdateAccountIdIdx').on(self.accountId),
		matchIdIdx: index('rankUpdateMatchIdIdx').on(self.matchId)
	})
);

export type RankUpdate = InferModel<typeof rankUpdatesTable, 'select'>;

export const matchesTable = sqliteTable(
	'matches',
	{
		id: text('id').primaryKey(),
		accountId: text('account_id')
			.references(() => accountsTable.id, { onDelete: 'cascade' })
			.notNull(),
		map: text('map').notNull().$type<OverwatchMapSlug>(),
		season: text('season').notNull().$type<OverwatchSeasonSlug>(),
		modality: text('modality').notNull(),
		result: text('result').$type<MatchResult>().notNull(),
		time: integer('time', { mode: 'timestamp' }).notNull(),
		averageTier: text('average_tier').$type<SkillTier>(),
		averageDivision: integer('average_division')
	},
	(self) => ({
		accountIdIdx: index('accountIdIdx').on(self.accountId),
		seasonIdx: index('seasonIdx').on(self.season)
	})
);

export const accountsMatchesTable = sqliteTable(
	'accounts_matches',
	{
		id: text('id').primaryKey(),
		matchId: text('match_id')
			.references(() => matchesTable.id, { onDelete: 'cascade' })
			.notNull(),
		accountId: text('account_id')
			.references(() => accountsTable.id, { onDelete: 'cascade' })
			.notNull()
	},
	(self) => ({
		matchIdIdx: index('accMtchMatchIdIdx').on(self.matchId),
		accountIdIdx: index('accMtchAccountIdIdx').on(self.accountId)
	})
);

export const heroesMatchesTable = sqliteTable(
	'heroes_matches',
	{
		id: text('id').primaryKey(),
		matchId: text('match_id')
			.references(() => matchesTable.id, { onDelete: 'cascade' })
			.notNull(),
		hero: text('hero').notNull().$type<OverwatchHeroSlug>()
	},
	(self) => ({
		matchIdIdx: index('heroMtchMatchIdIdx').on(self.matchId)
	})
);
