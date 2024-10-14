import type { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints';
import notion from '$lib/notion-client';

export function getBlock(exercise: PageObjectResponse): string {
	const blockObject = exercise.properties['Bloc'];
	if (blockObject && blockObject.type === 'title' && blockObject.title.length > 0) {
		const title = blockObject.title[0];
		if (title.type === 'text') {
			return title.text.content;
		}
	}
	return '';
}

export function getTime(exercise: PageObjectResponse): string {
	const timeObject = exercise.properties['Durée'];
	if (timeObject && timeObject.type === 'rich_text' && timeObject.rich_text.length > 0) {
		return timeObject.rich_text[0].plain_text;
	}
	return '';
}

export async function getTitle(exercise: PageObjectResponse): Promise<string> {
	const exerciseObject = exercise.properties['Exercice'];
	if (exerciseObject && exerciseObject.type === 'relation' && exerciseObject.relation.length > 0) {
		const pageId = exerciseObject.relation[0].id;
		const page = await notion.pages.retrieve({ page_id: pageId });
		if ('properties' in page) {
			const titleObject = page.properties['Nom'];
			if (
				titleObject.type === 'title' &&
				Array.isArray(titleObject.title) &&
				titleObject.title.length > 0
			) {
				return titleObject.title[0].plain_text;
			}
		}
	}
	return '';
}

export function getInstructions(exercise: PageObjectResponse): string {
	const instructionsObject = exercise.properties['Consignes'];
	if (
		instructionsObject &&
		instructionsObject.type === 'rich_text' &&
		instructionsObject.rich_text.length > 0
	) {
		return instructionsObject.rich_text.map(({ plain_text }) => plain_text).join('');
	}
	return '';
}
