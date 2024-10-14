import { EXERCISES_DB_ID } from '$env/static/private';
import notion from '$lib/notion-client';

export async function load() {
	try {
		const trainingsResponse = await notion.databases.query({
			database_id: EXERCISES_DB_ID,
			filter: {
				property: 'Type',
				select: {
					equals: 'Entraînement'
				}
			}
		});
		return {
			status: 200,
			...trainingsResponse
		};
	} catch (err) {
		console.error(err);
		return { status: 400 };
	}
}
