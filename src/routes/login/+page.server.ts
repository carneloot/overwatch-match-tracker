import { fail, redirect } from '@sveltejs/kit';

import { z } from 'zod';

import type { Actions, PageServerLoad } from './$types';
import * as constants from '$lib/constants';
import { createAuthJWT } from '$lib/jwt';
import { validateUser } from '$lib/user.server';

export const load = (({ cookies }) => {
	const token = cookies.get(constants.cookies.authToken);

	if (token) {
		throw redirect(301, '/');
	}
}) satisfies PageServerLoad;

const LoginSchema = z.object({
	username: z
		.string({ required_error: 'Field is required' })
		.nonempty('Field is required')
		.max(64, 'Field must be less than 64 characters'),
	password: z
		.string({ required_error: 'Password is required' })
		.min(6, 'Password must be at least 6 characters')
		.max(64, 'Password must be less than 64 characters')
		.trim()
});

export const actions = {
	default: async (event) => {
		const formData = Object.fromEntries(await event.request.formData());
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

		const user = await validateUser(data);

		if (!user) {
			return fail(401, {
				data: rest,
				errors: {
					general: [ 'Invalid credentials' ]
				}
			});
		}

		const token = await createAuthJWT({ id: user.id });

		event.cookies.set(constants.cookies.authToken, token, {
			path: '/'
		});

		const redirectTo = event.url.searchParams.get('redirectTo');
		if (redirectTo) {
			throw redirect(302, `/${redirectTo.slice(1)}`);
		}

		throw redirect(302, '/');
	}
} satisfies Actions;
