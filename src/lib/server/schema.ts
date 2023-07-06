import { sqliteTable, text, uniqueIndex } from 'drizzle-orm/sqlite-core';
import type { InferModel } from 'drizzle-orm';

export const users = sqliteTable(
	'users',
	{
		id: text('id').primaryKey(),
		username: text('username').notNull(),
		email: text('email').notNull(),
		hash: text('hash').notNull(),
		salt: text('salt').notNull()
	},
	(users) => ({
		usernameIdx: uniqueIndex('usernameIdx').on(users.username),
		emailIdx: uniqueIndex('emailIdx').on(users.email)
	})
);

export type User = InferModel<typeof users, 'select'>;
