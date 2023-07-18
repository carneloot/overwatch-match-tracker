import { SESSION_SECRET } from '$env/static/private';
import { createCookieSessionStorage } from '$lib/session-storage/sessions';
import type { RequestEvent } from '@sveltejs/kit';

type SessionData = {
	accounts?: string[];
	modality?: string;
};

const sessionStorage = createCookieSessionStorage<SessionData>({
	name: 'OWMT_new_match',
	secrets: [SESSION_SECRET],
	cookie: {
		secure: true,
		sameSite: 'lax',
		path: '/matches/new',
		httpOnly: true,
		maxAge: 60 * 60 * 24 // 1 day
	}
});

async function getNewMatchValues(event: RequestEvent) {
	const { data } = await sessionStorage.getSession(event);
	return data;
}

async function setNewMatchValues(event: RequestEvent, data: SessionData) {
	const session = await sessionStorage.getSession(event);
	Object.entries(data).forEach(([key, value]) => {
		session.set(key as keyof SessionData, value);
	});

	const { name, value, options } = await sessionStorage.commitSession(session);
	event.cookies.set(name, value, options);
}

async function destroyNewMatchValues(event: RequestEvent) {
	const session = await sessionStorage.getSession(event);
	const { name, options } = await sessionStorage.destroySession(session);
	event.cookies.delete(name, options);
}

export { getNewMatchValues, setNewMatchValues, destroyNewMatchValues };
