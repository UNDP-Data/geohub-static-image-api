import type { RequestHandler } from './$types';
import type { RenderOptions } from '@maplibre/maplibre-gl-native';
import { renderMap } from '$lib/server/renderMap';
import geoViewport from '@mapbox/geo-viewport';
import type { StyleSpecification } from 'maplibre-gl';

export const GET: RequestHandler = async ({ params, url }) => {
	const bbox = params.bbox;
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

	const bounds: geoViewport.BoundingBox = bbox
		.split(',')
		.map((c) => Number(c)) as geoViewport.BoundingBox;
	const viewport = geoViewport.viewport(
		bounds,
		[width, height],
		undefined,
		undefined,
		undefined,
		true
	);
	const zoom = Math.max(viewport.zoom - 1, 0);
	const center = viewport.center;

	const mapOptions: RenderOptions = {
		zoom: zoom,
		width: width,
		height: height,
		center: center
	};

	const image = await renderMap(url, style, mapOptions, width, height, ratio);

	return new Response(image, {
		headers: {
			'Content-type': 'image/png'
		}
	});
};
