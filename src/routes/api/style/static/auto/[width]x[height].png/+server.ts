import type { RequestHandler } from './$types';
import type { RenderOptions } from '@maplibre/maplibre-gl-native';
import { renderMap } from '$lib/server/renderMap';
import type { StyleSpecification } from 'maplibre-gl';

export const GET: RequestHandler = async ({ params, url }) => {
	const id = Number(params.id);
	const width = Number(params.width);
	const height = Number(params.height);
	const ratio = 1;

	const styleUrl = url.searchParams.get('url');

	if (!styleUrl) {
		return new Response(JSON.stringify({ message: `url query param is required.` }), {
			status: 400
		});
	}

	const res = await fetch(styleUrl);
	const style: StyleSpecification = await res.json();

	const center: [number, number] = (style.center as [number, number]) ?? [0, 0];
	const zoom = style.zoom ?? 0;
	const bearing = style.bearing ?? 0;
	const pitch = style.pitch ?? 0;

	const mapOptions: RenderOptions = {
		zoom: zoom,
		width: width,
		height: height,
		center: center,
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
