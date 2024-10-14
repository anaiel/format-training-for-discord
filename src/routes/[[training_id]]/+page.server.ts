import { formatTraining } from '$lib/format';
import { redirect } from '@sveltejs/kit';

export async function load({ params, parent }) {
	const trainingId = params.training_id;
	const { trainingsData, formattedTrainings } = await parent();
	if (!trainingId && formattedTrainings) {
		redirect(307, `/${formattedTrainings[0].id}`);
	}
	return {
		formattedTraining: trainingId ? await formatTraining(trainingsData, trainingId) : ''
	};
}
