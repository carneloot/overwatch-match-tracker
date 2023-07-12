import { eq } from 'drizzle-orm';

import { db } from '$lib/database/db';
import { heroesTable } from '$lib/database/schema';

export function getEnabledHeroes() {
	return db
		.select()
		.from(heroesTable)
		.where(eq(heroesTable.enabled, true))
		.orderBy(heroesTable.role, heroesTable.name)
		.all();
}
