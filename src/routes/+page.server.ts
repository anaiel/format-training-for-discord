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
		return {
			status: 200,
			trainings: trainingsResponse.results
				.map((result) => {
					const nameProperty = (result as PageObjectResponse).properties.Name;
					if (nameProperty.type === 'title') {
						const nameValue = nameProperty.title[0];
						if (nameValue.type === 'text') {
							return {
								name: nameValue.text.content,
								id: result.id
							};
						}
					}
					return {
						name: 'Unknown',
						id: result.id
					};
				})
				.sort((a, b) => {
					const dateA = extractDate(a);
					const dateB = extractDate(b);
					if (!dateA) {
						return 1;
					} else if (!dateB) {
						return -1;
					} else {
						return dateHash(dateA).localeCompare(dateHash(dateB));
					}
				})
		};
	} catch (err) {
		console.error(err);
		return { status: 400 };
	}
}

type Date = { day: number; month: number; year: number };

function extractDate(entry: { name: string }): Date | undefined {
	const dateString = entry.name.match(/[0-9]{1,4}\/[0-9]{1,2}\/[0-9]{1,4}/)?.[0];
	if (!dateString) {
		return undefined;
	}
	if (dateString.match(/^[0-9]{4}/)) {
		// Assume YYYY/MM/DD
		return {
			day: +dateString.slice(-2),
			month: +dateString.slice(5, 7),
			year: +dateString.slice(0, 4)
		};
	} else if (dateString.match(/[0-9]{5}$/)) {
		// Assume DD/MM/YYYY
		return {
			day: +dateString.slice(0, 2),
			month: +dateString.slice(3, 5),
			year: +dateString.slice(-4)
		};
	} else {
		// Assume DD/MM/YY
		return {
			day: +dateString.slice(0, 2),
			month: +dateString.slice(3, 5),
			year: 2000 + +dateString.slice(-2)
		};
	}
}

function dateHash({ day, month, year }: Date): string {
	return `${year}/${month}/${day}`;
}
