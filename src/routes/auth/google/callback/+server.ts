import type { RequestHandler } from '@sveltejs/kit';
import { json, redirect } from '@sveltejs/kit';

import { getGoogleOAuthClient } from '$lib/google.server';
import { upsertUser } from '$lib/user';
import { getSession } from '$lib/session.server';

export const GET = (async (event) => {
	const receivedState = event.url.searchParams.get('state');
	const storedState = event.cookies.get('state') ?? null;

	event.cookies.delete('state');

	if (receivedState !== storedState) {
		throw redirect(303, '/login'); // MESSAGE: unexpected error during login
	}

	const code = event.url.searchParams.get('code');
	if (!code) {
		throw redirect(303, '/login'); // MESSAGE: unexpected error during login
	}

	const client = getGoogleOAuthClient(event);

	const { tokens } = await client.getToken(code);

	if (!tokens.id_token) {
		throw redirect(303, '/login'); // MESSAGE: unexpected error during login
	}

	const info = await client.verifyIdToken({
		idToken: tokens.id_token
	});

	const payload = info.getPayload();

	if (!payload) {
		throw redirect(303, '/login'); // MESSAGE: unexpected error during login
	}

	const email = payload?.email;

	if (!email) {
		throw redirect(303, '/login');
	}

	const user = await upsertUser(email);

	const session = await getSession(event);
	await session.signIn(user);
	await session.sendCookie(event);

	throw redirect(303, '/');
}) satisfies RequestHandler;
