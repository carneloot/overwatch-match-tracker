import { db } from '$lib/database/db';
import { modalitiesTable } from '$lib/database/schema';

export async function getModalities() {
	return db
		.select()
		.from(modalitiesTable)
		.all();
}
