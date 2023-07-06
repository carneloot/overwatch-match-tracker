import { redirect } from '@sveltejs/kit';

import type { PageServerLoad } from './$types';
import * as constants from '$lib/server/constants';

export const load = (async ({ cookies }) => {
	const token = cookies.get(constants.authTokenCookie);

	if (!token) {
		throw redirect(301, '/login');
	}

}) satisfies PageServerLoad;
