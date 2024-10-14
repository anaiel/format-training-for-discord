import notion from '$lib/notion-client';
import type {
	PageObjectResponse,
	QueryDatabaseResponse
} from '@notionhq/client/build/src/api-endpoints';
import { getBlock, getTime, getTitle, getInstructions } from '$lib/exercise';

export async function formatTraining(
	trainings: QueryDatabaseResponse,
	trainingId: string
): Promise<string> {
	try {
		const exercises = (await retrieveExercises(trainings, trainingId)).sort(sortByTime);
		let formattedTraining = '';
		let currentBlock: string | undefined;
		for (const exercise of exercises) {
			if (formattedTraining) {
				formattedTraining += '\n';
			}

			const nextBlock = getBlock(exercise);
			const time = getTime(exercise);
			const title = await getTitle(exercise);
			const instructions = getInstructions(exercise);

			let exerciseText = `**${time}** : ${title ?? ''}\n`;
			if (instructions) {
				exerciseText += `${instructions}\n`;
			}
			if (nextBlock && nextBlock !== currentBlock) {
				exerciseText = `**${nextBlock.toUpperCase()}**\n\n${exerciseText}`;
			}

			formattedTraining += exerciseText;
			currentBlock = nextBlock;
		}
		return formattedTraining;
	} catch (err) {
		console.error(err);
		return '';
	}
}

async function retrieveExercises(
	trainings: QueryDatabaseResponse,
	trainingId: string
): Promise<PageObjectResponse[]> {
	const page = trainings.results?.find((page) => page.id === trainingId);
	if (!page) throw new Error('Training not found');
	const pageResult = await notion.blocks.children.list({ block_id: page.id });
	if (!pageResult) throw new Error('Page not found');
	const childDatabase = pageResult.results.find(
		(block) => 'type' in block && block.type === 'child_database'
	);
	if (!childDatabase) throw new Error('Child database not found');
	const childDatabaseResponse = await notion.databases.query({ database_id: childDatabase.id });
	return childDatabaseResponse.results as PageObjectResponse[];
}

function sortByTime(a: PageObjectResponse, b: PageObjectResponse) {
	const timeA = getTime(a);
	const timeB = getTime(b);
	return timeA.localeCompare(timeB);
}
