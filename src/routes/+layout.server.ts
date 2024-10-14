import { EXERCISES_DB_ID } from '$env/static/private';
import notion from '$lib/notion-client';
import { formatResultsForSelect } from '$lib/trainings';

export async function load() {
	const trainingsPromise = notion.databases.query({
		database_id: EXERCISES_DB_ID,
		filter: {
			property: 'Type',
			select: {
				equals: 'Entraînement'
			}
		}
	});
	const trainingsForSelectPromise = (async () => {
		const trainingsResponse = await trainingsPromise;
		return formatResultsForSelect(trainingsResponse.results);
	})();
	return {
		trainingsPromise,
		trainingsForSelectPromise
	};
}
