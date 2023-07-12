import type { Handle } from '@sveltejs/kit';

import { verifyJwt } from '$lib/jwt';
import { getUserById } from '$lib/user.server';
import * as constants from '$lib/constants';

export const handle = (async ({ event, resolve }) => {
	const token = event.cookies.get(constants.cookies.authToken);

	if (token) {
		const { id: userId } = await verifyJwt(token);
		event.locals.user = await getUserById(userId);
	}

	return resolve(event);
}) satisfies Handle;
