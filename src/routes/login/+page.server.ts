import { fail, redirect } from '@sveltejs/kit';

import bcrypt from 'bcrypt';
import { z } from 'zod';

import type { Actions, PageServerLoad } from './$types';
import * as constants from '$lib/server/constants';
import { db } from '$lib/server/db';
import { users } from '$lib/server/schema';
import { eq } from 'drizzle-orm';
import { createAuthJWT } from '$lib/server/jwt';

export const load = (({ cookies }) => {
	const token = cookies.get(constants.authTokenCookie);

	if (token) {
		throw redirect(301, '/');
	}
}) satisfies PageServerLoad;

const LoginSchema = z.object({
	email: z
		.string({ required_error: 'Email is required' })
		.nonempty('Email is required')
		.max(64, 'Email must be less than 64 characters')
		.email('Email must be a valid email address'),
	password: z
		.string({ required_error: 'Password is required' })
		.min(6, 'Password must be at least 6 characters')
		.max(64, 'Password must be less than 64 characters')
		.trim()
});

export const actions = {
	default: async ({ request, cookies }) => {
		const formData = Object.fromEntries(await request.formData());
		const parseResult = LoginSchema.safeParse(formData);
		const { password, ...rest } = formData;
		if (!parseResult.success) {
			const { fieldErrors: errors } = parseResult.error.flatten();
			return fail(422, {
				data: rest,
				errors
			});
		}
		const { data } = parseResult;

		const [ userByEmail ] = await db
			.select()
			.from(users)
			.where(eq(users.email, data.email))
			.all();

		if (!userByEmail) {
			return fail(401, {
				data: rest,
				errors: {
					general: [ 'Invalid credentials' ]
				}
			});
		}

		const hash = bcrypt.hashSync(data.password, userByEmail.salt);

		if (hash !== userByEmail.hash) {
			return fail(401, {
				data: rest,
				errors: {
					general: [ 'Invalid credentials' ]
				}
			});
		}

		const token = await createAuthJWT({
			id: userByEmail.id,
			username: userByEmail.username,
			email: userByEmail.email
		});

		cookies.set(constants.authTokenCookie, token, {
			path: '/'
		});

		throw redirect(301, '/');
	}
} satisfies Actions;
