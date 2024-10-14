import type { PageData } from '../routes/$types';
import notion from '$lib/notion-client';
import type { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints';
import { getBlock, getTime } from '$lib/exercise';

export async function formatTraining(training: PageData, trainingId: string): Promise<string> {
	try {
		const exercises = await retrieveExercises(training, trainingId);
		let formattedTraining = '';
		let currentBlock: string | undefined;
		for (const exercise of exercises) {
			if (formattedTraining) {
				formattedTraining += '\n';
			}

			const nextBlock = getBlock(exercise);
			if (nextBlock && nextBlock !== currentBlock) {
				formattedTraining += `**${nextBlock.toUpperCase()}\n\n`;
			}
			currentBlock = nextBlock;

			const time = getTime(exercise);
			if (time) {
				formattedTraining += `**${time}**\n`;
			}
		}
		return 'toto';
	} catch (err) {
		console.error(err);
		return '';
	}
}

async function retrieveExercises(
	training: PageData,
	trainingId: string
): Promise<PageObjectResponse[]> {
	const page = training.results?.find((page) => page.id === trainingId);
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
