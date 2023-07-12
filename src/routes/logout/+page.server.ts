import { redirect } from '@sveltejs/kit';

import type { PageServerLoad } from './$types';
import * as constants from '$lib/constants';

export const load = (async ({ cookies }) => {
	cookies.delete(constants.cookies.authToken);
	cookies.delete(constants.cookies.matchKeepValue, {
		path: '/matches/new'
	});
	throw redirect(301, '/login');
}) satisfies PageServerLoad;
