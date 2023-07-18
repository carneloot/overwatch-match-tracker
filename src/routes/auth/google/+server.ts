import type { RequestEvent, RequestHandler } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';

import { OAuth2Client } from 'google-auth-library';

import { PUBLIC_GOOGLE_CLIENT_ID } from '$env/static/public';

import { getSession } from '$lib/session.server';
import { upsertUser } from '$lib/user';

type GoogleAuthData = {
	clientId: string;
	client_id: string;
	credential: string;
	select_by: string;
	g_csrf_token: string;
};

const client = new OAuth2Client();

function validateCSRF(qs: GoogleAuthData, event: RequestEvent) {
	const bodyCSRF = qs.g_csrf_token;
	if (!bodyCSRF) {
		throw redirect(303, '/login');
	}
	const cookieCSRF = event.cookies.get('g_csrf_token');
	if (!cookieCSRF) {
		throw redirect(303, '/login');
	}
	if (bodyCSRF !== cookieCSRF) {
		throw redirect(303, '/login');
	}
	event.cookies.delete('g_csrf_token', { path: '/' });
}

export const POST = (async (event) => {
	const stringifiedData = await event.request.text();
	const qs = Object.fromEntries(new URLSearchParams(stringifiedData)) as GoogleAuthData;

	validateCSRF(qs, event);

	const ticket = await client.verifyIdToken({
		idToken: qs.credential,
		audience: PUBLIC_GOOGLE_CLIENT_ID
	});

	const payload = ticket.getPayload();
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
