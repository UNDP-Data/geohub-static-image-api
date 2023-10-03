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
			title: 'GeoHub',
			href: 'https://geohub.data.undp.org'
		},
		{
			id: 'header-link-geohub',
			title: 'GeoHub dev',
			href: 'https://dev.undpgeohub.org'
		}
	];

	let footerItems: {
		[key: string]: FooterItem[];
	} = {
		GeoHub: [
			{
				title: 'GeoHub',
				url: 'https://geohub.data.undp.org'
			},
			{
				title: 'GeoHub dev',
				url: 'https://dev.undpgeohub.org'
			}
		],
		APIs: [
			{
				title: 'Static Image API',
				url: '/'
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
	isPositionFixed={false}
	bind:links
/>

<div class="p-4">
	<slot />
</div>

<Footer logoUrl="/assets/undp-images/undp-logo-white.svg" bind:footerItems />

<style global lang="scss">
	@import '@undp-data/undp-bulma/bulma.scss';
</style>
