import { redirect } from '@sveltejs/kit';

import type { PageServerLoad } from './$types';
import * as constants from '$lib/constants';
import { getSession } from '$lib/session.server';

export const load = (async (event) => {
	const session = await getSession(event);

	await session.signOut();
	await session.sendCookie(event);

	event.cookies.delete(constants.cookies.matchKeepValue, {
		path: '/matches/new'
	});

	throw redirect(301, '/login');
}) satisfies PageServerLoad;
