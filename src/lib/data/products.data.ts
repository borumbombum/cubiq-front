// src/lib/data/products.data.ts
import { BrainCircuit, Cable, Key, Store, Truck, Zap } from '@lucide/svelte';
import { LabProduct, Product } from '$lib/type/products.types';
import { localizeHref } from '$paraglide/runtime';
import { m } from '$paraglide/messages';

export const getApiBrandPairs = (locale?: 'pt' | 'en' | 'es') => [
	{
		id: Product.MARKET,
		api: {
			name: m.productMarketName({}, { locale }),
			details: m.productMarketDetails({}, { locale }),
			icon: Store,
			url: localizeHref('/docs', { locale }),
			underDevelopment: false
		},
		brand: {
			name: LabProduct.LNBEER,
			logo: '/products/malthaus-logo.png',
			logoSquare: '/products/taptapgo-logo-round.png',
			url: 'https://www.malthaus.uy',
			newWindow: true
		}
	},
	{
		id: Product.SHIP,
		api: {
			name: m.productShippingName({}, { locale }),
			details: m.productShippingDetails({}, { locale }),
			icon: Truck,
			url: localizeHref('/docs', { locale }),
			underDevelopment: true
		},
		brand: {
			name: LabProduct.ENVIQS,
			logo: '/products/enviqs-logo-2.png',
			logoSquare: '/products/enviqs-logo-2.png',
			url: 'https://www.enviqs.com',
			newWindow: true
		}
	},
	{
		id: Product.PAY,
		api: {
			name: Product.PAY,
			details: m.productPayDetails({}, { locale }),
			icon: Zap,
			url: localizeHref('/docs', { locale }),
			underDevelopment: true,
			unavailable: false
		},
		brand: {
			name: LabProduct.BQPAY,
			logo: '/products/bqpay-logo.png',
			logoSquare: '/products/bqpay-logo-round.png',
			url: localizeHref('/blog/bqpay-prelaunch'),
			newWindow: false
		}
	},

	{
		id: Product.APIS,
		api: {
			name: m.productAPIsName({}, { locale }),
			details: m.productAPIDetails({}, { locale }),
			icon: Cable,
			url: 'https://api.cubiq.lat/docs',
			underDevelopment: false
		}
	}
];

// AI and Auth are kept here in case /docs or another section still needs them
// as standalone ProductData entries elsewhere in the app.
export const getProducts = (locale?: 'pt' | 'en' | 'es') => [
	{
		id: Product.AI,
		name: Product.AI,
		isMain: true,
		slogan: m.productAISlogan({}, { locale }),
		details: m.productAIDetails({}, { locale }),
		icon: BrainCircuit,
		isBold: true,
		primary: false,
		underDevelopment: false,
		url: 'https://api.cubiq.lat/docs#/AI'
	},
	{
		id: Product.AUTH,
		name: Product.AUTH,
		isMain: true,
		slogan: m.productAuthSlogan({}, { locale }),
		details: m.productAuthDetails({}, { locale }),
		icon: Key,
		isBold: true,
		primary: false,
		underDevelopment: false,
		url: 'https://api.cubiq.lat/docs#/Users'
	}
];

export const getProductsFromLab = (locale?: 'pt' | 'en' | 'es') => [
	{
		id: LabProduct.LNBEER,
		name: LabProduct.LNBEER,
		logo: '/products/malthaus-logo.png',
		logoSquare: '/products/taptapgo-logo-round.png',
		isMain: true,
		slogan: m.productLnBeerSlogan({}, { locale }),
		sloganSimple: '',
		details: m.productLnBeerDetails({}, { locale }),
		isBold: true,
		primary: true,
		underDevelopment: true,
		url: 'https://www.malthaus.uy/es/apps',
		newWindow: true
	},
	{
		id: LabProduct.ENVIQS,
		name: LabProduct.ENVIQS,
		logo: '/products/enviqs-logo.png',
		logoSquare: '/products/enviqs-logo-rounded.png',
		isMain: true,
		slogan: m.productEnviqsSlogan({}, { locale }),
		sloganSimple: '',
		details: m.productEnviqsDetails({}, { locale }),
		isBold: true,
		primary: true,
		underDevelopment: false,
		url: 'https://www.enviqs.com',
		newWindow: true
	},
	{
		id: LabProduct.BQPAY,
		name: LabProduct.BQPAY,
		logo: '/products/bqpay-logo.png',
		logoSquare: '/products/bqpay-logo-round.png',
		isMain: true,
		slogan: m.productBqPaySlogan({}, { locale }),
		sloganSimple: '',
		details: m.productBqPayDetails({}, { locale }),
		isBold: true,
		primary: true,
		underDevelopment: true,
		url: localizeHref('/blog/bqpay-prelaunch'),
		newWindow: false
	},

	{
		id: LabProduct.BETIZEN,
		name: LabProduct.BETIZEN,
		logo: '/products/betizen-logo.png',
		logoSquare: '/products/betizen-logo-round.png',
		isMain: true,
		hideFromNav: true,
		slogan: m.productBetizenSlogan({}, { locale }),
		sloganSimple: '',
		details: m.productBetizenDetails({}, { locale }),
		isBold: true,
		primary: true,
		underDevelopment: false,
		url: 'https://www.betizen.org',
		newWindow: true
	}
];
