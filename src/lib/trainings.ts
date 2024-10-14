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
		?.map((result) => {
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
		})
		.sort((a, b) => {
			const dateA = extractDate(a);
			const dateB = extractDate(b);
			if (!dateA) {
				return 1;
			} else if (!dateB) {
				return -1;
			} else {
				if (dateB.year - dateA.year !== 0) return dateB.year - dateA.year;
				if (dateB.month - dateA.month !== 0) return dateB.month - dateA.month;
				return dateB.day - dateA.day;
			}
		});
}

function extractDate(entry: { name: string }): IDate | undefined {
	const dateString = entry.name.match(/[0-9]{1,4}\/[0-9]{1,2}\/[0-9]{1,4}/)?.[0];
	if (!dateString) {
		return undefined;
	}
	if (dateString.match(/^[0-9]{4}/)) {
		// Assume YYYY/MM/DD
		return {
			day: +dateString.slice(-2),
			month: +dateString.slice(5, 7),
			year: +dateString.slice(0, 4)
		};
	} else if (dateString.match(/[0-9]{4}$/)) {
		// Assume DD/MM/YYYY
		return {
			day: +dateString.slice(0, 2),
			month: +dateString.slice(3, 5),
			year: +dateString.slice(-4)
		};
	} else {
		// Assume DD/MM/YY
		return {
			day: +dateString.slice(0, 2),
			month: +dateString.slice(3, 5),
			year: 2000 + +dateString.slice(-2)
		};
	}
}
