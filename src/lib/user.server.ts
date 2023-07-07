import { LibsqlError } from '@libsql/client';

import { v4 as uuid } from 'uuid';
import bcrypt from 'bcrypt';

import { db } from '$lib/db';
import { type User, users } from '$lib/schema';
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
			.insert(users)
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
		.from(users)
		.where(or(
			eq(users.email, data.username),
			eq(users.username, data.username)
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
