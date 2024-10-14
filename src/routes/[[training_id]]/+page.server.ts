import { formatTraining } from '$lib/format';
import { redirect } from '@sveltejs/kit';

export async function load({ params, parent }) {
	const trainingId = params.training_id;
	const { trainingsData, formattedTrainings } = await parent();
	if (!trainingId) {
		const value = await formattedTrainings;
		redirect(307, `/${value[0].id}`);
	}
	const formattedTraining = (async () => {
		const value = await trainingsData;
		return await formatTraining(value, trainingId);
	})();
	return {
		formattedTraining
	};
}
