import { index, integer, sqliteTable, text, uniqueIndex } from 'drizzle-orm/sqlite-core';
import type { InferModel } from 'drizzle-orm';

export type MapType = 'hybrid' | 'control' | 'push' | 'escort' | 'deathmatch';
export type MatchResult = 'win' | 'lose' | 'draw';
export type HeroRole = 'damage' | 'tank' | 'support';
export type UserRole = 'user' | 'admin';
export type SkillTier = 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond' | 'master' | 'grandmaster' | 'top500';

export const usersTable = sqliteTable(
	'users',
	{
		id: text('id').primaryKey(),
		username: text('username').notNull(),
		role: text('role').$type<UserRole>().notNull().default('user'),
		email: text('email').notNull(),
		hash: text('hash').notNull(),
		salt: text('salt').notNull()
	},
	(users) => ({
		usernameIdx: uniqueIndex('usernameIdx').on(users.username),
		emailIdx: uniqueIndex('emailIdx').on(users.email)
	})
);

export type User = Omit<InferModel<typeof usersTable, 'select'>, 'hash' | 'salt'>;

export const accountsTable = sqliteTable(
	'accounts',
	{
		id: text('id').primaryKey(),
		userId: text('user_id').references(() => usersTable.id).notNull(),
		battleTag: text('battle_tag'),
		selected: integer('selected', { mode: 'boolean' }).default(false)
	}
);

export const mapsTable = sqliteTable(
	'maps',
	{
		id: text('id').primaryKey(),
		type: text('type').$type<MapType>().notNull(),
		name: text('name').notNull(),
		slug: text('slug').notNull(),
		picturePath: text('picture_path'),
		enabled: integer('enabled', { mode: 'boolean' }).notNull().default(true)
	},
	self => ({
		slugIdx: uniqueIndex('slugIdx').on(self.slug)
	})
);

export const heroesTable = sqliteTable(
	'heroes',
	{
		id: text('id').primaryKey(),
		role: text('role').$type<HeroRole>().notNull(),
		name: text('name').notNull(),
		enabled: integer('enabled', { mode: 'boolean' }).default(true)
	}
);

export const seasonsTable = sqliteTable(
	'seasons',
	{
		id: text('id').primaryKey(),
		name: text('name').notNull(),
		startTime: integer('start_time', { mode: 'timestamp' }).notNull(),
		finishTime: integer('finish_time', { mode: 'timestamp' }).notNull()
	},
	self => ({
		startTimeIdx: index('startTimeIdx').on(self.startTime),
		finishTimeIdx: index('finishTimeIdx').on(self.finishTime)
	})
);

export const rankUpdatesTable = sqliteTable(
	'rank_updates',
	{
		id: text('id').primaryKey(),
		accountId: text('account_id').references(() => accountsTable.id).notNull(),
		seasonId: text('season_id').references(() => seasonsTable.id).notNull(),
		time: integer('time', { mode: 'timestamp' }).notNull(),
		initial: integer('initial', { mode: 'boolean' }),
		tier: text('tier').$type<SkillTier>().notNull(),
		division: integer('division').notNull(),
		percentage: integer('percentage')
	}
);

export const modalitiesTable = sqliteTable(
	'modalities',
	{
		id: text('id').primaryKey(),
		name: text('name').notNull(),
		roleSpecific: integer('role_specific', { mode: 'boolean' }).notNull().default(false)
	}
);

export const matchesTable = sqliteTable(
	'matches',
	{
		id: text('id').primaryKey(),
		accountId: text('account_id').references(() => accountsTable.id).notNull(),
		mapId: text('map_id').references(() => mapsTable.id).notNull(),
		seasonId: text('season_id').references(() => seasonsTable.id).notNull(),
		modalityId: text('modality_id').references(() => modalitiesTable.id).notNull(),
		rankUpdateId: text('rank_update_id').references(() => rankUpdatesTable.id),
		result: text('result').$type<MatchResult>().notNull(),
		time: integer('time', { mode: 'timestamp' }).notNull()
	},
	self => ({
		accountIdIdx: index('accountIdIdx').on(self.accountId)
	})
);

export const accountsMatchesTable = sqliteTable(
	'accounts_matches',
	{
		id: text('id').primaryKey(),
		matchId: text('match_id').references(() => matchesTable.id).notNull(),
		accountId: text('account_id').references(() => accountsTable.id).notNull()
	},
	self => ({
		matchIdIdx: index('accMtchMatchIdIdx').on(self.matchId)
	})
);

export const heroesMatchesTable = sqliteTable(
	'heroes_matches',
	{
		id: text('id').primaryKey(),
		matchId: text('match_id').references(() => matchesTable.id).notNull(),
		heroId: text('hero_id').references(() => heroesTable.id).notNull()
	},
	self => ({
		matchIdIdx: index('heroMtchMatchIdIdx').on(self.matchId)
	})
);
