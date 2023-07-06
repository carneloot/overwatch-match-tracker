import type { Config } from 'drizzle-kit';
import 'dotenv/config';

export default {
	out: './migrations',
	schema: './src/lib/server/schema.ts',
	driver: 'libsql',
	dbCredentials: {
		url: process.env.DATABASE_URL
	}
} satisfies Config;
