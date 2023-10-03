<script lang="ts">
	import type { FooterItem } from '@undp-data/svelte-undp-design';
	import { Footer, Header, type HeaderLink } from '@undp-data/svelte-undp-design';

	let headerHeight: number;

	let links: HeaderLink[] = [
		{
			id: 'header-link-home',
			title: 'Home',
			href: '/'
		},
		{
			id: 'header-link-geohub',
			title: 'API Spec',
			href: '/api'
		}
	];

	let footerItems: {
		[key: string]: FooterItem[];
	} = {
		'Static Image API': [
			{
				title: 'Home',
				url: '/'
			},
			{
				title: 'API Spec',
				url: '/api'
			}
		]
	};
</script>

<Header
	region="UNDP's one stop shop for spatial data and analytics"
	siteTitle="GeoHub Static Image API"
	url="/"
	logoUrl="/assets/undp-images/undp-logo-blue.svg"
	bind:height={headerHeight}
	isPositionFixed={true}
	bind:links
/>

<div class="p-4" style="margin-top: {headerHeight}px">
	<slot />
</div>

<Footer logoUrl="/assets/undp-images/undp-logo-white.svg" bind:footerItems />

<style global lang="scss">
	@import '@undp-data/undp-bulma/bulma.scss';

	:global(.country-header) {
		z-index: 99;
	}
</style>
