import { formatTraining } from '$lib/format';

export async function load({ params, parent }) {
	const trainingId = params.training_id;
	const { trainingsData } = await parent();
	return {
		formattedTraining: await formatTraining(trainingsData, trainingId)
	};
}
