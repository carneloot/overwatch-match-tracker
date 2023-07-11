import { LibsqlError } from '@libsql/client';

import { v4 as uuid } from 'uuid';
import bcrypt from 'bcrypt';

import { db } from '$lib/database/db';
import { type User, usersTable } from '$lib/database/schema';
import { eq, or } from 'drizzle-orm';


type InsertUser = {
	email: string;
	username: string;
	password: string;
};

type ValidateUser = {
	username: string;
	password: string;
}

export async function createUser(data: InsertUser) {
	const salt = bcrypt.genSaltSync(10);
	const hash = bcrypt.hashSync(data.password, salt);

	try {
		const { rows } = await db
			.insert(usersTable)
			.values({
				id: uuid(),
				email: data.email,
				username: data.username,
				hash,
				salt
			})
			.returning()
			.run();
		const user = rows[0] as unknown as User;
		return {
			success: true as const,
			data: user
		};

	} catch (err: unknown) {
		if (!(err instanceof LibsqlError)) {
			throw err;
		}

		if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
			const field = err.message.match(/users.(\w+)/)?.[1] as 'username' | 'email';

			if (field === 'username') {
				return {
					success: false as const,
					errors: {
						username: [ 'Username is already in use' ]
					}
				};
			}

			return {
				success: false as const,
				errors: {
					email: [ 'Email is already in use' ]
				}
			};
		}

		return {
			success: false as const,
			errors: {}
		};
	}
}

export async function validateUser(data: ValidateUser) {
	const [ user ] = await db
		.select()
		.from(usersTable)
		.where(or(
			eq(usersTable.email, data.username),
			eq(usersTable.username, data.username)
		))
		.all();

	if (!user) {
		return null;
	}

	const hash = bcrypt.hashSync(data.password, user.salt);

	if (hash !== user.hash) {
		return null;
	}

	return user;
}

export async function getUserById(id: string) {
	const [ user ] = await db
		.select({
			id: usersTable.id,
			username: usersTable.username,
			email: usersTable.email,
			role: usersTable.role
		})
		.from(usersTable)
		.where(eq(usersTable.id, id))
		.all();
	return user;
}
