import { redirect } from '@sveltejs/kit';

import type { PageServerLoad } from './$types';
import * as constants from '$lib/constants';

export const load = (async ({ cookies }) => {
	cookies.delete(constants.authTokenCookie);
	throw redirect(301, '/');
}) satisfies PageServerLoad;
