import { fail, redirect } from '@sveltejs/kit';
import { LibsqlError } from '@libsql/client';

import bcrypt from 'bcrypt';
import { z } from 'zod';
import { v4 as uuid } from 'uuid';

import type { Actions, PageServerLoad } from './$types';
import { db } from '$lib/db';
import { type User, users } from '$lib/schema';
import { createAuthJWT } from '$lib/jwt';
import * as constants from '$lib/constants';

export const load = (({ cookies }) => {
	const token = cookies.get(constants.authTokenCookie);

	if (token) {
		throw redirect(301, '/');
	}
}) satisfies PageServerLoad;

const RegisterSchema = z.object({
	username: z
		.string({ required_error: 'Username is required' })
		.nonempty('Username is required')
		.max(64, 'Username must be less than 64 characters')
		.toLowerCase()
		.trim(),
	email: z
		.string({ required_error: 'Email is required' })
		.nonempty('Email is required')
		.max(64, 'Email must be less than 64 characters')
		.email('Email must be a valid email address'),
	password: z
		.string({ required_error: 'Password is required' })
		.min(6, 'Password must be at least 6 characters')
		.max(64, 'Password must be less than 64 characters')
		.trim(),
	passwordConfirm: z
		.string({ required_error: 'Password is required' })
		.min(6, 'Password must be at least 6 characters')
		.max(64, 'Password must be less than 64 characters')
		.trim()
})
	.superRefine(({ password, passwordConfirm }, ctx) => {
		if (passwordConfirm !== password) {
			ctx.addIssue({
				code: 'custom',
				message: 'Password and confirmation must match',
				path: [ 'passwordConfirm' ]
			});
		}
	});

export const actions = {
	default: async ({ request, cookies }) => {
		const formData = Object.fromEntries(await request.formData());
		const parseResult = RegisterSchema.safeParse(formData);
		const { password, passwordConfirm, ...rest } = formData;
		if (!parseResult.success) {
			const { fieldErrors: errors } = parseResult.error.flatten();
			return fail(422, {
				data: rest,
				errors
			});
		}
		const { data } = parseResult;

		const salt = bcrypt.genSaltSync(10);
		const hash = bcrypt.hashSync(data.password, salt);

		const result = await db
			.insert(users)
			.values({
				id: uuid(),
				email: data.email,
				username: data.username,
				hash,
				salt
			})
			.returning()
			.run()
			.then(({ rows }) => ({
				success: true as const,
				data: rows[0] as unknown as User
			}))
			.catch((err: unknown) => {
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
			});

		if (!result.success) {
			return fail(422, {
				data: rest,
				errors: result.errors
			});
		}

		const newUser = result.data;

		const token = await createAuthJWT({
			id: newUser.id,
			username: newUser.username,
			email: newUser.email
		});

		cookies.set(constants.authTokenCookie, token, {
			path: '/'
		});

		throw redirect(301, '/');
	}
} satisfies Actions;
