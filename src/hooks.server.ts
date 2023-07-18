import type { Handle } from '@sveltejs/kit';
import { getUser } from '$lib/session.server';

export const handle = (async ({ event, resolve }) => {
	const user = await getUser(event);

	if (user) {
		event.locals.user = user;
	}

	return resolve(event);
}) satisfies Handle;
