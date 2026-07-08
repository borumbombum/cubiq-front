// src/lib/type/products.types.ts
import { type Icon as IconType } from '@lucide/svelte';

export enum Product {
	CARE = 'CARE',
	STORE = 'STORE',
	APIS = 'APIS',
	NOTES = 'NOTES',
	AI = 'AI',
	PAY = 'PAY',
	AUTH = 'AUTH',
	MARKET = 'MARKET', // new
	SHIP = 'SHIP' // new
}

export enum LabProduct {
	BETIZEN = 'BETIZEN',
	LNBEER = 'MALTHAUS',
	BIBLIO = 'BIBLIO',
	BQPAY = 'BQPAY',
	ENVIQS = 'ENVIQS' // new - shipping brand
}

// new: one card = one API + (optionally) the brand it powers
export interface ApiBrandPair {
	id: string;
	api: {
		name: string;
		icon: typeof IconType;
		details: string;
		url?: string;
		unavailable?: boolean;
		underDevelopment?: boolean;
	};
	brand?: {
		name: string;
		logo?: string; // omit if you don't have an asset yet, name renders as text
		logoSquare?: string;
		url?: string;
		newWindow?: boolean;
	};
}

export type ProductsList = ProductData[];

// export enum Product {
// 	CARE = 'CARE',

// 	STORE = 'STORE',
// 	APIS = 'APIS',
// 	NOTES = 'NOTES',

// 	AI = 'AI',
// 	PAY = 'PAY',
// 	AUTH = 'AUTH'
// }

// export enum LabProduct {
// 	BETIZEN = 'BETIZEN',
// 	LNBEER = 'MALTHAUS',
// 	BIBLIO = 'BIBLIO',
// 	BQPAY = 'BQPAY'
// }

export interface ProductData {
	id: string;
	isMain: boolean;
	name: string;
	slogan?: string;
	sloganSimple?: string;
	icon?: typeof IconType;
	details: string;
	// subMenu: boolean;
	url?: string;
	isBold?: boolean;
	primary: boolean;
	logo?: string;
	logoSquare?: string;
	underDevelopment?: boolean;
	online?: boolean;
	unavailable?: boolean;
	newWindow?: boolean;
	hideFromNav?: boolean;
}
