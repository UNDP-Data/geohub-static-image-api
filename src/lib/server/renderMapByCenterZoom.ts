import type { RenderOptions } from '@maplibre/maplibre-gl-native';
import { renderMap } from '$lib/server/renderMap';
import type { StyleSpecification } from 'maplibre-gl';

export const renderMapByCenterZoom = async (
	lon: number,
	lat: number,
	zoom: number,
	bearing: number,
	pitch: number,
	width: number,
	height: number,
	ratio: number,
	style: StyleSpecification,
	url: URL
) => {
	const mapOptions: RenderOptions = {
		zoom: zoom,
		width: width,
		height: height,
		center: [lon, lat],
		bearing: bearing,
		pitch: pitch
	};

	const image = await renderMap(url, style, mapOptions, width, height, ratio);

	return image;
};
