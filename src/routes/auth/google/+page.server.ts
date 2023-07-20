import { redirect } from '@sveltejs/kit';
import { randomBytes } from 'crypto';

import { getGoogleOAuthClient } from '$lib/google.server';

import type { PageServerLoad } from './$types';

export const load = (async (event) => {
	const state = randomBytes(32).toString('hex');

	event.cookies.set('state', state, {
		secure: true,
		sameSite: 'lax',
		path: '/auth/google',
		httpOnly: true
	});

	const redirectUri = new URL(event.url);
	redirectUri.pathname = '/auth/google/callback';

	const client = getGoogleOAuthClient(event);

	const url = client.generateAuthUrl({
		scope: ['openid', 'email'],
		state
	});

	throw redirect(303, url);
}) satisfies PageServerLoad;
