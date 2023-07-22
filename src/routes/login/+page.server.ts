import { fail, redirect } from '@sveltejs/kit';

import { setError, superValidate } from 'sveltekit-superforms/server';
import { eq } from 'drizzle-orm';
import { z } from 'zod';

import type { Actions, PageServerLoad } from './$types';

import { verifyEmail } from '$lib/email.server';
import { db } from '$lib/database/db';
import { usersTable } from '$lib/database/schema';
import { getDomainUrl } from '$lib/utils';
import { getMagicLink, sendMagicLink } from '$lib/magic-link.server';
import { dev } from '$app/environment';

const LoginSchema = z.object({
	email: z.string().nonempty().max(64).email(),
	password: z.string().length(0)
});

async function isEmailVerified(
	email: string
): Promise<{ verified: true } | { verified: false; message: string }> {
	const verifierResult = await verifyEmail(email);
	if (verifierResult.status) {
		return { verified: true };
	}

	const userExists = Boolean(
		await db
			.select({ id: usersTable.id })
			.from(usersTable)
			.where(eq(usersTable.email, email))
			.get()
	);

	if (userExists) {
		return { verified: true };
	}

	return { verified: false, message: verifierResult.error.message };
}

export const load = (async (event) => {
	if (event.locals.user) {
		throw redirect(301, '/');
	}

	const form = await superValidate(event, LoginSchema);

	return { form };
}) satisfies PageServerLoad;

export const actions = {
	default: async (event) => {
		const form = await superValidate(event, LoginSchema);

		if (!form.valid) {
			return fail(400, { form });
		}

		const { email } = form.data;

		try {
			const verifiedStatus = await isEmailVerified(email);

			if (!verifiedStatus.verified) {
				return setError(
					form,
					'email',
					`Error trying to verify the email: "${verifiedStatus.message}"`
				);
			}
		} catch (error: unknown) {
			console.error('Error verifying the email', error);
		}

		const domainUrl = getDomainUrl(event);
		if (dev) {
			const magicLink = getMagicLink({ email, domainUrl });
			throw redirect(303, magicLink);
		}

		await sendMagicLink({ email, domainUrl });

		return { form };
	}
} satisfies Actions;
