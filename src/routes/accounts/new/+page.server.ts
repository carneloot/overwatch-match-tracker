import { fail, redirect } from '@sveltejs/kit';

import { superValidate } from 'sveltekit-superforms/server';
import { v4 as uuid } from 'uuid';
import { z } from 'zod';

import type { Actions, PageServerLoad } from './$types';
import { handleLoginRedirect } from '$lib/utils';
import { createNewAccount } from '$lib/account.server';

const newAccountSchema = z.object({
	battleTag: z.string(),
	selected: z.boolean().nullable().default(false)
});

export const load = (async (event) => {
	if (!event.locals.user) {
		throw redirect(302, handleLoginRedirect(event));
	}

	const form = await superValidate(event, newAccountSchema);

	return {
		form
	};
}) satisfies PageServerLoad;

export const actions = {
	default: async (event) => {
		if (!event.locals.user) {
			throw redirect(302, handleLoginRedirect(event));
		}

		const form = await superValidate(event, newAccountSchema);

		if (!form.valid) {
			return fail(400, { form });
		}

		await createNewAccount({
			...form.data,
			id: uuid(),
			userId: event.locals.user.id
		});

		throw redirect(301, '/accounts');
	}
} satisfies Actions;
