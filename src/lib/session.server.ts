import type { RequestEvent } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';

import { eq } from 'drizzle-orm';
import { v4 as uuid } from 'uuid';

import * as constants from '$lib/constants';

import { sessionsTable, type User, usersTable } from '$lib/database/schema';
import { createCookieSessionStorage } from '$lib/session-storage/sessions';
import { validateMagicLink } from '$lib/magic-link.server';
import { SESSION_SECRET } from '$env/static/private';
import { db } from '$lib/database/db';
import { upsertUser } from '$lib/user';

const sessionIdKey = '__session_id__' as const;

type SessionData = {
	[sessionIdKey]: string | undefined;
};

const sessionStorage = createCookieSessionStorage<SessionData>({
	secrets: [SESSION_SECRET],
	name: 'OWMT_root_session',
	cookie: {
		secure: true,
		sameSite: 'lax',
		path: '/',
		maxAge: constants.auth.sessionExpirationTime / 1000,
		httpOnly: true
	}
});

async function getUserFromSessionId(sessionId: string) {
	const { session, user } = db
		.select({
			session: sessionsTable,
			user: usersTable
		})
		.from(sessionsTable)
		.innerJoin(usersTable, eq(sessionsTable.userId, usersTable.id))
		.where(eq(sessionsTable.id, sessionId))
		.get();

	if (!session) {
		throw new Error('No session found');
	}

	if (Date.now() > session.expires.getTime()) {
		db.delete(sessionsTable).where(eq(sessionsTable.id, sessionId)).run();
		throw new Error('Session expired. Please request a new magic link.');
	}

	return user;
}

function createSession(userId: string) {
	return db
		.insert(sessionsTable)
		.values({
			id: uuid(),
			userId,
			expires: new Date(Date.now() + constants.auth.sessionExpirationTime)
		})
		.returning({ id: sessionsTable.id })
		.get();
}

async function deleteSession(sessionId: string) {
	db.delete(sessionsTable).where(eq(sessionsTable.id, sessionId)).run();
}

async function getSession(event: RequestEvent) {
	const session = await sessionStorage.getSession(event);
	const initialValue = await sessionStorage.commitSession(session);

	const getSessionId = () => session.get(sessionIdKey) as string | undefined;
	const unsetSessionId = () => session.unset(sessionIdKey);

	const commit = async () => {
		const currentValue = await sessionStorage.commitSession(session);
		return currentValue.value === initialValue.value ? null : currentValue;
	};

	return {
		session,
		getSessionId,
		unsetSessionId,
		commit,

		getUser: async () => {
			const sessionId = getSessionId();
			if (!sessionId) return null;

			return getUserFromSessionId(sessionId).catch((error: unknown) => {
				unsetSessionId();
				console.error(`Failed while trying to get user from session id:`, error);
				return null;
			});
		},

		signIn: async (user: Pick<User, 'id'>) => {
			const userSession = await createSession(user.id);
			session.set(sessionIdKey, userSession.id);
		},

		signOut: async () => {
			const sessionId = getSessionId();
			if (!sessionId) return;

			unsetSessionId();
			await deleteSession(sessionId);
		},

		sendCookie: async (event: RequestEvent) => {
			if (!getSessionId()) {
				// Logged out
				const { name, options } = await sessionStorage.destroySession(session);
				event.cookies.delete(name, options);
				return;
			}

			const commited = await commit();
			if (commited) {
				const { name, value, options } = commited;
				event.cookies.set(name, value, options);
			}
		}
	};
}

async function getSessionFromMagicLink(event: RequestEvent) {
	const email = await validateMagicLink(event.request.url);

	const user = await upsertUser(email);

	const session = await getSession(event);
	await session.signIn(user);

	return session;
}

async function getUser(event: RequestEvent) {
	const { session, getUser } = await getSession(event);
	const token = session.get(sessionIdKey);
	if (!token) return null;

	return getUser();
}

async function requireUser(event: RequestEvent) {
	const user = event.locals.user;
	if (!user) {
		const session = await getSession(event);
		await session.signOut();
		await session.sendCookie(event);
		throw redirect(303, '/login');
	}

	return user;
}

export { getSession, getSessionFromMagicLink, requireUser, getUser };
