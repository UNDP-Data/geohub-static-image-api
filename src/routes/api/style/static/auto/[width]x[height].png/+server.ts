import type { RequestHandler } from './$types';
import type { StyleSpecification } from 'maplibre-gl';
import { renderMapAuto } from '$lib/server/renderMapAuto';
import { error } from '@sveltejs/kit';
import { validateStyle } from '$lib/server/validateStyle';

export const GET: RequestHandler = async ({ params, url }) => {
	const width = Number(params.width);
	const height = Number(params.height);
	const ratio = 1;

	const styleUrl = url.searchParams.get('url');

	if (!styleUrl) {
		throw error(400, { message: `url query param is required.` });
	}

	const res = await fetch(styleUrl);
	const style: StyleSpecification = await res.json();

	const errors = validateStyle(style);
	if (errors.length) {
		throw error(400, { message: errors.join(', ') });
	}

	const image = await renderMapAuto(width, height, ratio, style, url);
	return new Response(image, {
		headers: {
			'Content-type': 'image/png'
		}
	});
};

export const POST: RequestHandler = async ({ params, url, request }) => {
	const width = Number(params.width);
	const height = Number(params.height);
	const ratio = 1;

	const style: StyleSpecification = await request.json();

	const errors = validateStyle(style);
	if (errors.length) {
		throw error(400, { message: errors.join(', ') });
	}

	const image = await renderMapAuto(width, height, ratio, style, url);
	return new Response(image, {
		headers: {
			'Content-type': 'image/png'
		}
	});
};
