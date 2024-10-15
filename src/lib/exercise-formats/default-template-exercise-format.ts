import type {
	ListBlockChildrenResponse,
	PageObjectResponse
} from '@notionhq/client/build/src/api-endpoints';
import notion from '$lib/notion-client';
import type { Exercise } from './exercise';

export async function parseDefaultExerciseTemplate(
	trainingContent: ListBlockChildrenResponse
): Promise<Exercise[]> {
	const childDatabase = trainingContent.results.find(
		(block) => 'type' in block && block.type === 'child_database'
	);
	if (childDatabase) {
		const childDatabaseResponse = await notion.databases.query({ database_id: childDatabase.id });
		if (
			childDatabaseResponse.results.some((exercise) =>
				hasExpectedDefaultExerciseTemplateProperties(exercise as PageObjectResponse)
			)
		) {
			return childDatabaseResponse.results.map(
				(exercise) => new DefaultTemplateExercise(exercise as PageObjectResponse)
			);
		}
	}
	throw new Error('Content does not match template');
}

function hasExpectedDefaultExerciseTemplateProperties(exercise: PageObjectResponse) {
	return (
		'properties' in exercise &&
		Object.keys(exercise.properties).some((property) =>
			['Bloc', 'Consignes', 'Durée', 'Exercice'].includes(property)
		)
	);
}

class DefaultTemplateExercise implements Exercise {
	#exercise: PageObjectResponse;

	constructor(exercise: PageObjectResponse) {
		this.#exercise = exercise;
	}

	getBlock(): string {
		const blockObject = this.#exercise.properties['Bloc'];
		if (blockObject && blockObject.type === 'title' && blockObject.title.length > 0) {
			const title = blockObject.title[0];
			if (title.type === 'text') {
				return title.text.content;
			}
		}
		return '';
	}

	getTime(): string {
		const timeObject = this.#exercise.properties['Durée'];
		if (timeObject && timeObject.type === 'rich_text' && timeObject.rich_text.length > 0) {
			return timeObject.rich_text[0].plain_text;
		}
		return '';
	}

	async getTitle(): Promise<string> {
		const exerciseObject = this.#exercise.properties['Exercice'];
		if (
			exerciseObject &&
			exerciseObject.type === 'relation' &&
			exerciseObject.relation.length > 0
		) {
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

	getInstructions(): string {
		const instructionsObject = this.#exercise.properties['Consignes'];
		if (
			instructionsObject &&
			instructionsObject.type === 'rich_text' &&
			instructionsObject.rich_text.length > 0
		) {
			return instructionsObject.rich_text.map(({ plain_text }) => plain_text).join('');
		}
		return '';
	}
}
