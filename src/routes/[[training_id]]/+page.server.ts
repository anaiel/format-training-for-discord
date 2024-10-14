import { formatTraining } from '$lib/format';
import notion from '$lib/notion-client';
import type {
	ListBlockChildrenResponse,
	QueryDatabaseResponse
} from '@notionhq/client/build/src/api-endpoints.js';
import { redirect } from '@sveltejs/kit';

export async function load({ params, parent }) {
	const trainingId = params.training_id;
	const { trainingsPromise, trainingsForSelectPromise } = await parent();
	if (!trainingId) {
		const trainingsForSelect = await trainingsForSelectPromise;
		redirect(307, `/${trainingsForSelect[0].id}`);
	}
	return {
		formattedTrainingPromise: trainingsPromise.then(async (trainings) => {
			const trainingContent = await retrieveExercises(trainings, trainingId);
			return formatTraining(trainingContent);
		})
	};
}

async function retrieveExercises(
	trainings: QueryDatabaseResponse,
	trainingId: string
): Promise<ListBlockChildrenResponse> {
	const page = trainings.results?.find((page) => page.id === trainingId);
	if (!page) throw new Error('Training not found');
	const pageResult = await notion.blocks.children.list({ block_id: page.id });
	if (!pageResult) throw new Error('Page not found');
	return pageResult;
}
