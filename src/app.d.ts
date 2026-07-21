// See https://svelte.dev/docs/kit/types#app.d.ts

// for information about these interfaces
/// <reference types="cloudflare-turnstile" />
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			session?: string;
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			user?: any;
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
