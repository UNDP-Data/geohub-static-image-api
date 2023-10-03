import type { RequestHandler } from './$types';
import type { RenderOptions } from '@maplibre/maplibre-gl-native';
import { renderMap } from '$lib/server/renderMap';
import type { StyleSpecification } from 'maplibre-gl';

export const GET: RequestHandler = async ({ params, url }) => {
	const lon = Number(params.lon);
	const lat = Number(params.lat);
	const zoom = Number(params.zoom);
	const bearing = Number(params.bearing);
	const pitch = Number(params.pitch);
	const width = Number(params.width);
	const height = Number(params.height);
	const ratio = 2;

	const styleUrl = url.searchParams.get('url');

	if (!styleUrl) {
		return new Response(JSON.stringify({ message: `url query param is required.` }), {
			status: 400
		});
	}

	const res = await fetch(styleUrl);
	const style: StyleSpecification = await res.json();

	if (!style) {
		return new Response(undefined, {
			status: 404
		});
	}

	const mapOptions: RenderOptions = {
		zoom: zoom,
		width: width,
		height: height,
		center: [lon, lat],
		bearing: bearing,
		pitch: pitch
	};

	const image = await renderMap(url, style, mapOptions, width, height, ratio);

	return new Response(image, {
		headers: {
			'Content-type': 'image/png'
		}
	});
};
