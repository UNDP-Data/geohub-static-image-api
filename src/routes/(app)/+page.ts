import type { PageLoad } from './$types';

export const load: PageLoad = async () => {
	const title = 'GeoHub Static Image API';
	const content = 'GeoHub Static Image API';

	return {
		title,
		content
	};
};
