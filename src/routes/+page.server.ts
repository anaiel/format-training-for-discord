import { EXERCISES_DB_ID, NOTION_API_KEY } from '$env/static/private';
import { Client } from '@notionhq/client';
import type { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints';

const notion = new Client({
	auth: NOTION_API_KEY
});

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
		console.log(JSON.stringify(trainingsResponse));
		return {
			status: 200,
			...trainingsResponse
		};
	} catch (err) {
		console.error(err);
		return { status: 400 };
	}
}
