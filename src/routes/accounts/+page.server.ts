import { fail, redirect } from '@sveltejs/kit';

import { z } from 'zod';

import type { Actions, PageServerLoad } from './$types';
import { handleLoginRedirect } from '$lib/utils';
import { deleteAccount, getAccountsByUser, selectAccount } from '$lib/account.server';

export const load = (async (event) => {
	if (!event.locals.user) {
		throw redirect(302, handleLoginRedirect(event));
	}

	return {
		accounts: getAccountsByUser(event.locals.user.id)
	};

}) satisfies PageServerLoad;

const actionSchema = z.object({
	accountId: z.string().uuid()
});

export const actions = {
	delete: async (event) => {
		if (!event.locals.user) {
			throw redirect(302, handleLoginRedirect(event));
		}

		const formData = Object.fromEntries(await event.request.formData());
		const parseResult = actionSchema.safeParse(formData);
		if (!parseResult.success) {
			return fail(400, { errors: parseResult.error.flatten() });
		}

		const { data } = parseResult;

		await deleteAccount(data.accountId);
	},
	select: async (event) => {
		if (!event.locals.user) {
			throw redirect(302, handleLoginRedirect(event));
		}

		const formData = Object.fromEntries(await event.request.formData());
		const parseResult = actionSchema.safeParse(formData);
		if (!parseResult.success) {
			return fail(400, { errors: parseResult.error.flatten() });
		}

		const { data } = parseResult;

		await selectAccount({
			userId: event.locals.user.id,
			accountId: data.accountId
		});
	}
} satisfies Actions;
