import { redirect } from '@sveltejs/kit';

import type { PageServerLoad } from './$types';
import { handleLoginRedirect } from '$lib/utils';

export const load = (async (event) => {
	if (!event.locals.user) {
		throw redirect(301, handleLoginRedirect(event));
	}

}) satisfies PageServerLoad;
