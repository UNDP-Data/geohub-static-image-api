import type { PageLoad } from './$types';

export const load: PageLoad = async () => {
	const title = 'Playground | Static API';
	const content = 'GeoHub Static API Playground';

	return {
		title,
		content
	};
};

export const csr = true;
export const ssr = false;
