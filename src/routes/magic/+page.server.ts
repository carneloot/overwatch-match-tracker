import { redirect } from '@sveltejs/kit';

import type { PageServerLoad } from './$types';

import { getSessionFromMagicLink } from '$lib/session.server';

export const load = (async (event) => {
	const session = await getSessionFromMagicLink(event).catch(() => null);

	if (!session) {
		throw redirect(301, '/login');
	}

	await session.sendCookie(event);

	throw redirect(301, '/');
}) satisfies PageServerLoad;
