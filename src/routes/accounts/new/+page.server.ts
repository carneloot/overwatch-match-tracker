import { fail, redirect } from '@sveltejs/kit';

import { superValidate } from 'sveltekit-superforms/server';
import { and, eq, type InferModel } from 'drizzle-orm';
import { v4 as uuid } from 'uuid';
import { z } from 'zod';

import { getSession, requireUser } from '$lib/session.server';
import { accountsTable } from '$lib/database/schema';
import { db } from '$lib/database/db';

import type { Actions, PageServerLoad } from './$types';

const newAccountSchema = z.object({
	battleTag: z.string(),
	selected: z.boolean().nullable().default(false)
});
type NewAccount = InferModel<typeof accountsTable, 'insert'>;

export const load = (async (event) => {
	await requireUser(event);

	const form = await superValidate(event, newAccountSchema);

	return {
		form
	};
}) satisfies PageServerLoad;

async function createNewAccount(account: NewAccount) {
	if (account.selected) {
		// Remove selected from previous selected account
		await db
			.update(accountsTable)
			.set({ selected: false })
			.where(and(eq(accountsTable.userId, account.userId), eq(accountsTable.selected, true)))
			.run();
	}

	return db.insert(accountsTable).values(account).run();
}

export const actions = {
	default: async (event) => {
		const user = await requireUser(event);

		const form = await superValidate(event, newAccountSchema);

		if (!form.valid) {
			return fail(400, { form });
		}

		const newAccountId = uuid();

		await createNewAccount({
			...form.data,
			id: newAccountId,
			userId: user.id
		});

		if (form.data.selected) {
			const { setActiveAccountId, sendCookie } = await getSession(event);
			setActiveAccountId(newAccountId);
			await sendCookie(event);
		}

		throw redirect(301, '/accounts');
	}
} satisfies Actions;
