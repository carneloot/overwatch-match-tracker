import type { RequestEvent } from '@sveltejs/kit';

import type { CookieSerializeOptions } from 'cookie';

import { decodeCookieValue, encodeCookieValue } from '$lib/session-storage/cookies';
import { sign, unsign } from '$lib/session-storage/crypto';

type CreateCookieSessionStorageOptions = {
	secrets: string[];
	name: string;
	cookie: CookieSerializeOptions;
};

type SessionData = Record<string, unknown>;

interface Session<Data = SessionData> {
	readonly id: string;
	readonly data: Data;

	has(name: keyof Data & string): boolean;

	get<Key extends keyof Data & string>(name: Key): Key extends keyof Data ? Data[Key] : undefined;

	set<Key extends keyof Data & string>(name: Key, value: Data[Key]): void;

	unset(name: keyof Data & string): void;
}

export const isSession = (object: unknown): object is Session => {
	return (
		object != null &&
		typeof object === 'object' &&
		'id' in object &&
		typeof object.id === 'string' &&
		'data' in object &&
		typeof object.data !== 'undefined' &&
		'has' in object &&
		typeof object.has === 'function' &&
		'get' in object &&
		typeof object.get === 'function' &&
		'set' in object &&
		typeof object.set === 'function' &&
		'unset' in object &&
		typeof object.unset === 'function'
	);
};

type CreateSessionFunction = <Data = SessionData>(initialData?: Data, id?: string) => Session<Data>;

const createSession: CreateSessionFunction = <Data = SessionData>(
	initialData: Partial<Data> = {},
	id = ''
) => {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const map = new Map(Object.entries(initialData)) as Map<keyof Data & string, any>;

	return {
		get id() {
			return id;
		},

		get data() {
			return Object.fromEntries(map) as Data;
		},

		has(name) {
			return map.has(name);
		},

		get(name) {
			return map.get(name);
		},

		set(name, value) {
			map.set(name, value);
		},

		unset(name) {
			map.delete(name);
		}
	} satisfies Session<Data>;
};

type CookieSessionInfo = {
	name: string;
	value: string;
	options: CookieSerializeOptions;
};

interface SessionStorage<Data = SessionData> {
	getSession: (event: RequestEvent) => Promise<Session<Data>>;
	commitSession: (session: Session<Data>) => Promise<CookieSessionInfo>;
	destroySession: (session: Session<Data>) => Promise<CookieSessionInfo>;
}

export function createCookieSessionStorage<Data = SessionData>(
	outerOptions: CreateCookieSessionStorageOptions
) {
	return {
		async getSession(event) {
			const cookieString = event.cookies.get(outerOptions.name);
			const data = cookieString
				? ((await decodeCookieValue(unsign, cookieString, outerOptions.secrets)) as Data)
				: undefined;

			return createSession(data);
		},
		async commitSession(session) {
			const value = await encodeCookieValue(sign, session.data, outerOptions.secrets);
			return {
				name: outerOptions.name,
				options: outerOptions.cookie,
				value
			};
		},
		async destroySession() {
			return {
				name: outerOptions.name,
				options: {
					...outerOptions.cookie,
					expires: new Date(0)
				},
				value: ''
			};
		}
	} as SessionStorage<Data>;
}
