import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load = (() => {
	throw redirect(301, '/matches');
}) satisfies PageServerLoad;
