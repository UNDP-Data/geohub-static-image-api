import type { RenderOptions } from '@maplibre/maplibre-gl-native';
import { renderMap } from '$lib/server/renderMap';
import geoViewport from '@mapbox/geo-viewport';
import type { StyleSpecification } from 'maplibre-gl';

export const renderMapByBBOX = async (
	bbox: string,
	width: number,
	height: number,
	ratio: number,
	style: StyleSpecification,
	url: URL
) => {
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

	return image;
};
