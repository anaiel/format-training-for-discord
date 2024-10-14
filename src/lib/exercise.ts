import type {
	DatabaseObjectResponse,
	PageObjectResponse
} from '@notionhq/client/build/src/api-endpoints';

export function getBlock(exercise: PageObjectResponse): string {
	const blockObject = exercise.properties['Bloc'];
	if (blockObject && blockObject.type === 'title') {
		const title = blockObject.title[0];
		if (title.type === 'text') {
			return title.text.content;
		}
	}
	return '';
}

export function getTime(exercise: PageObjectResponse): string {
	const timeObject = exercise.properties['Durée'];
	if (timeObject && timeObject.type === 'rich_text') {
		return timeObject.rich_text[0].plain_text;
	}
	return '';
}
