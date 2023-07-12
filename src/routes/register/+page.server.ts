import { fail, redirect } from '@sveltejs/kit';

import { z } from 'zod';

import type { Actions, PageServerLoad } from './$types';
import { createAuthJWT } from '$lib/jwt';
import * as constants from '$lib/constants';
import { createUser } from '$lib/user.server';
import { verifyEmail } from '$lib/email.server';

export const load = (({ cookies }) => {
	const token = cookies.get(constants.cookies.authToken);

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

		const emailVerified = await verifyEmail(data.email);
		if (!emailVerified.status) {
			return fail(422, {
				data: rest,
				errors: {
					email: [ 'Your email could not be verified' ]
				}
			});
		}

		const result = await createUser(data);

		if (!result.success) {
			return fail(422, {
				data: rest,
				errors: result.errors
			});
		}

		const newUser = result.data;

		const token = await createAuthJWT({ id: newUser.id });

		cookies.set(constants.cookies.authToken, token, { path: '/' });

		throw redirect(302, '/');
	}
} satisfies Actions;
