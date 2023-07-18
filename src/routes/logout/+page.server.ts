import { redirect } from '@sveltejs/kit';

import type { PageServerLoad } from './$types';
import { getSession } from '$lib/session.server';
import { destroyNewMatchValues } from '$lib/sessions/new-match.session';

export const load = (async (event) => {
	const session = await getSession(event);

	await session.signOut();
	await session.sendCookie(event);
	await destroyNewMatchValues(event);

	throw redirect(301, '/login');
}) satisfies PageServerLoad;
