import type { ListBlockChildrenResponse } from '@notionhq/client/build/src/api-endpoints';
import { parseDefaultExerciseTemplate } from './exercise-formats/default-template-exercise-format';
import type { Exercise } from './exercise-formats/exercise';

export async function formatTraining(trainingContent: ListBlockChildrenResponse): Promise<string> {
	try {
		const exercises = await parseExercises(trainingContent);
		return format(exercises);
	} catch (err) {
		console.error(err);
		return '';
	}
}

async function parseExercises(trainingContent: ListBlockChildrenResponse): Promise<Exercise[]> {
	try {
		return parseDefaultExerciseTemplate(trainingContent);
	} catch {
		throw new Error('Unrecognized exercises format');
	}
}

async function format(exercises: Exercise[]) {
	const sortedExercises = exercises.sort(sortByTime);

	let formattedTraining = '';
	let currentBlock: string | undefined;
	for (const exercise of sortedExercises) {
		if (formattedTraining) {
			formattedTraining += '\n';
		}

		const nextBlock = exercise.getBlock();
		const time = exercise.getTime();
		const title = await exercise.getTitle();
		const instructions = exercise.getInstructions();

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
}

function sortByTime(a: Exercise, b: Exercise) {
	const timeA = a.getTime();
	const timeB = b.getTime();
	return timeA.localeCompare(timeB);
}
