import type {
	ListBlockChildrenResponse,
	PageObjectResponse
} from '@notionhq/client/build/src/api-endpoints';
import notion from './notion-client';
import {
	defaultExerciseTemplateFormatter,
	hasExpectedDefaultExerciseTemplateProperties
} from './exercise-formats/default-template-exercise-format';

export async function formatTraining(trainingContent: ListBlockChildrenResponse): Promise<string> {
	try {
		return findFormatterAndFormat(trainingContent);
	} catch (err) {
		console.error(err);
		return '';
	}
}

async function findFormatterAndFormat(trainingContent: ListBlockChildrenResponse): Promise<string> {
	const childDatabase = trainingContent.results.find(
		(block) => 'type' in block && block.type === 'child_database'
	);
	if (childDatabase) {
		const childDatabaseResponse = await notion.databases.query({ database_id: childDatabase.id });
		if (
			childDatabaseResponse.results.some((exercise) =>
				hasExpectedDefaultExerciseTemplateProperties(exercise as PageObjectResponse)
			)
		)
			return defaultExerciseTemplateFormatter(
				childDatabaseResponse.results as PageObjectResponse[]
			);
	}
	throw new Error('Formatter not found for given format');
}
