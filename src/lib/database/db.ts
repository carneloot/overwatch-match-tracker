import { createClient } from '@libsql/client';
import { DATABASE_URL, DATABASE_AUTH_TOKEN } from '$env/static/private';
import { drizzle } from 'drizzle-orm/libsql';

const client = createClient({
	url: DATABASE_URL,
	authToken: DATABASE_AUTH_TOKEN
});

export const db = drizzle(client);
