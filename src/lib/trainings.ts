import type {
	DatabaseObjectResponse,
	PageObjectResponse,
	PartialDatabaseObjectResponse,
	PartialPageObjectResponse
} from '@notionhq/client/build/src/api-endpoints';

type IDate = { day: number; month: number; year: number };

export function formatResultsForSelect(
	results: (
		| PageObjectResponse
		| PartialPageObjectResponse
		| PartialDatabaseObjectResponse
		| DatabaseObjectResponse
	)[]
) {
	return results
		.sort((a, b) => {
			const dateA = getDate(a);
			const dateB = getDate(b);
			if (isNaN(dateA) && isNaN(dateB)) {
				return 0;
			} else if (isNaN(dateA)) {
				return 1;
			} else if (isNaN(dateB)) {
				return -1;
			} else {
				return dateB - dateA;
			}
		})
		.map((result) => {
			if ('properties' in result) {
				const titleEntry = Object.entries(result.properties).find(
					([_, value]) => value.type === 'title'
				);
				if (titleEntry) {
					const nameValue = Array.isArray(titleEntry[1].title) ? titleEntry[1].title[0] : undefined;
					if (nameValue?.type === 'text') {
						return {
							name: nameValue.text.content,
							id: result.id
						};
					}
				}
			}
			return {
				name: 'Unknown',
				id: result.id
			};
		});
}

const getDate = (
	page:
		| PageObjectResponse
		| PartialPageObjectResponse
		| PartialDatabaseObjectResponse
		| DatabaseObjectResponse
) => {
	let date: string | undefined = undefined;
	if ('properties' in page && 'Date' in page.properties && page.properties.Date.type === 'date') {
		date = page.properties.Date.date?.start;
	}
	// Remove "-" and convert to number. Example: "2021-10-01" => 20211001. This
	// way we can compare dates as numbers.
	const withoutHyphen = date?.replaceAll('-', '');
	const dateAsNumber = Number(withoutHyphen);
	return dateAsNumber;
};
