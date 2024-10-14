import { formatTraining } from '$lib/format';
import { redirect } from '@sveltejs/kit';

export async function load({ params, parent }) {
	const trainingId = params.training_id;
	const { trainingsPromise, trainingsForSelectPromise } = await parent();
	if (!trainingId) {
		const trainingsForSelect = await trainingsForSelectPromise;
		redirect(307, `/${trainingsForSelect[0].id}`);
	}
	return {
		formattedTrainingPromise: trainingsPromise.then((trainings) => {
			return formatTraining(trainings, trainingId);
		})
	};
}
