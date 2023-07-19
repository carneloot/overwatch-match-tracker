import { db } from '$lib/database/db';
import { usersTable } from '$lib/database/schema';
import { eq } from 'drizzle-orm';
import { v4 as uuid } from 'uuid';

async function upsertUser(email: string) {
	let user = await db
		.select({ id: usersTable.id })
		.from(usersTable)
		.where(eq(usersTable.email, email))
		.get();

	if (!user) {
		user = await db
			.insert(usersTable)
			.values({
				id: uuid(),
				email
			})
			.returning({ id: usersTable.id })
			.get();
	}

	return user;
}

export { upsertUser };
