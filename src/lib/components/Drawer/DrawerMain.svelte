<script lang="ts">
	import {
		Cable,
		ChevronRight,
		Headset,
		Globe,
		FlaskConical,
		Book,
		HeartPlus,
		FileClock,
		PenLine,
		User
	} from '@lucide/svelte';
	import { openSubmenu } from '$stores/DrawerState.state.svelte';
	import { localizeHref, getLocale } from '$paraglide/runtime';
	import { modalState } from '$lib/stores/Modal.state.svelte';
	import ContactForm from '$lib/components/Modal/ContactForm.svelte';
	import { getLocaleName } from '$utils';
	import { m } from '$paraglide/messages';
	import { AppConfig } from '$lib/configs';
	import type { ProductData } from '$types/products.types';
	import { getProductsFromLab, getProducts } from '$lib/data/products.data';
	import { page } from '$app/state';

	let user = $derived(page.data.user);

	const locale = $state(getLocale());
	const PRODUCTS = getProductsFromLab(locale);
	const drawerProductsForLang = $state(
		PRODUCTS.filter((prod: ProductData) => prod.isMain && !prod.hideFromNav)
	);

	const API_PRODUCTS = getProducts(locale);
	const drawerApisForLang = $state(
		API_PRODUCTS.filter((prod: ProductData) => prod.isMain).slice(0, 3)
	);

	function openContactModal() {
		modalState.open({
			component: ContactForm,
			size: 'lg',
			closeOnBackdrop: true,
			closeOnEscape: true
		});
	}

	function getHref(url: string | undefined): string {
		if (!url) return '/';
		if (url.startsWith('http')) return url;
		return localizeHref(url, { locale: locale });
	}
</script>

<div
	class="border-base-300 flex flex-1 flex-col overflow-x-hidden overflow-y-auto border-t px-0 text-xs"
>
	<!-- Language -->
	<button
		onclick={() => openSubmenu('fw_menu_languages', m.languages())}
		class="border-base-300 font-roboto text-grey-dark shine-effect flex w-full justify-between border-b px-[30px] py-3 text-left align-middle text-sm"
	>
		<div class="flex justify-center self-center text-left align-middle">
			<Globe class="mr-2 h-4 w-4 self-center" />
			<div class="self-center font-semibold">{m.languages()}</div>
			<div class="text-secondary ml-1 flex items-center gap-1">
				<span>—</span>
				<img src="/flags/{locale}.png" alt="flag-{locale}" class="aspect-1 h-[16px]" />
				<span class="capitalize">{getLocaleName(locale)}</span>
			</div>
		</div>
		<div class="text-grey-medium flex flex-row self-center align-middle">
			<ChevronRight class="aspect-1 text-grey-dark w-4" />
		</div>
	</button>

	<!-- User -->
	{#if user && user.email}
		<button
			onclick={() => openSubmenu('fw_menu_dashboard_user', m.user())}
			class="border-base-300 font-roboto text-grey-dark shine-effect flex w-full justify-between border-b px-[30px] py-3 text-left align-middle text-sm"
		>
			<div class="flex justify-center self-center text-left align-middle">
				<User class="mr-2 h-4 w-4 self-center" />
				<div class="self-center font-semibold">{m.user()}</div>
				<div class="text-secondary ml-1 flex items-center gap-1">
					<span>—</span>
					<!-- <img src="/flags/{locale}.png" alt="flag-{locale}" class="aspect-1 h-[16px]" /> -->
					<span class="capitalize">
						{#if user}
							<span class="px-1 font-sans text-sm tracking-wide lowercase">
								{user.email}
							</span>
						{/if}
					</span>
				</div>
			</div>
			<div class="text-grey-medium flex flex-row self-center align-middle">
				<ChevronRight class="aspect-1 text-grey-dark w-4" />
			</div>
		</button>
	{/if}

	<h2 class="font-pixel my-4 px-[30px] text-base font-extrabold tracking-wider uppercase">
		{m.menuProducts()}
	</h2>
	<!-- Item with submenu -->
	<!-- <h2 class="my-5 px-[30px] text-base font-extrabold uppercase">PRODUTOS</h2> -->
	{#each drawerProductsForLang as drawer, i}
		<a
			href={getHref(drawer.url)}
			target={drawer.url?.startsWith('http') ? '_blank' : undefined}
			rel={drawer.url?.startsWith('http') ? 'noopener noreferrer' : undefined}
			class={[
				'border-base-300 font-roboto text-grey-dark shine-effect flex justify-between border-b px-[30px] py-3 text-left align-middle text-sm',
				i == 0 ? 'border-t' : ''
			]}
		>
			<div class="flex min-w-0 flex-1 items-center">
				{#if drawer.logoSquare}
					<img
						src={drawer.logoSquare}
						alt={`${drawer.name} logo`}
						class="mr-1 aspect-square w-6 max-w-6 flex-shrink-0 object-cover"
					/>
				{:else if drawer.logo}
					<img
						src={drawer.logo}
						alt={`${drawer.name} logo`}
						class="relative -left-[1px] mr-1 w-6 max-w-5 flex-shrink-0"
					/>
				{:else if drawer.icon}
					<drawer.icon class="mr-2 h-4 w-4 flex-shrink-0 self-center" />
				{/if}
				<div
					class={[
						'font-pixel flex-shrink-0 self-center tracking-[0.06em]',
						drawer.isBold ? 'font-bold' : 'font-semibold'
					]}
					class:ml-2={!!drawer.logoSquare}
				>
					{drawer.name}
				</div>
				{#if drawer.slogan}
					<div class="text-secondary ml-1 min-w-0 flex-1 truncate">
						— {drawer.slogan}
					</div>
				{/if}
			</div>
		</a>
	{/each}

	<!-- Fixed Extra Menu -->
	<!-- <h2 class="font-pixel my-4 px-[30px] text-base font-extrabold tracking-wider uppercase">
		{m.developers()}
	</h2>
	<a
		href={localizeHref('/soon')}
		class="border-base-300 font-roboto text-grey-dark shine-effect flex w-full justify-between border-t border-b px-[30px] py-3 text-left align-middle text-sm"
	>
		<div class="flex justify-center self-center text-left align-middle">
			<FileCode class="mr-2 h-4 w-4 self-center" />
			<span class="self-center font-semibold">{m.documentation()}</span>
		</div>
		<div class="text-grey-medium flex flex-row self-center align-middle">
		</div>
	</a>

	<a
		href={localizeHref('/status')}
		class="border-base-300 font-roboto text-grey-dark shine-effect flex w-full justify-between border-b px-[30px] py-3 text-left align-middle text-sm"
	>
		<div class="flex justify-center self-center text-left align-middle">
			<Rss class="mr-2 h-4 w-4 self-center" />
			<span class="self-center font-semibold">API Status / Roadmap</span>
		</div>
		<div class="text-grey-medium flex flex-row self-center align-middle">
		</div>
	</a> -->

	<!-- API Section
	<h2 class="font-pixel my-4 px-[30px] text-base font-extrabold tracking-wider uppercase">
		{m.menuAPIs()}
	</h2>
	{#each drawerApisForLang as api, i}
		<a
			href={getHref(api.url)}
			target={api.url?.startsWith('http') ? '_blank' : undefined}
			rel={api.url?.startsWith('http') ? 'noopener noreferrer' : undefined}
			class={[
				'border-base-300 font-roboto text-grey-dark shine-effect flex justify-between border-b px-[30px] py-3 text-left align-middle text-sm',
				i == 0 ? 'border-t' : ''
			]}
		>
			<div class="flex min-w-0 flex-1 items-center">
				{#if api.icon}
					<api.icon class="mr-2 h-4 w-4 flex-shrink-0 self-center" />
				{/if}
				<div
					class={[
						'font-pixel flex-shrink-0 self-center tracking-[0.06em]',
						api.isBold ? 'font-bold' : 'font-semibold'
					]}
				>
					{api.name}
				</div>
				{#if api.slogan}
					<div class="text-secondary ml-1 min-w-0 flex-1 truncate">
						— {api.slogan}
					</div>
				{/if}
			</div>
		</a>
	{/each}
	<a
		href={localizeHref('/docs')}
		class="border-base-300 font-roboto text-grey-dark shine-effect flex justify-between border-b px-[30px] py-3 text-left align-middle text-sm"
	>
		<div class="flex min-w-0 flex-1 items-center">
			<Cable class="mr-2 h-4 w-4 flex-shrink-0 self-center" />
			<div class="font-pixel flex-shrink-0 self-center font-bold tracking-[0.06em]">
				{m.menuAllAPIs()}
			</div>
		</div>
	</a>
	-->

	<!-- Fixed Extra Menu -->
	<h2 class="font-pixel my-4 px-[30px] text-base font-extrabold tracking-wider uppercase">
		{m.resources()}
	</h2>

	<!-- Help desk -->
	<!-- <a
		href={localizeHref('/help')}
		class="border-base-300 font-roboto text-grey-dark shine-effect flex justify-between border-t border-b px-[30px] py-3 text-left align-middle text-sm"
	>
		<div class="flex justify-center self-center text-left align-middle">
			<Headset class="text-sun mr-2 h-4 w-4 self-center" />
			<span class="self-center font-semibold">{m.help()}</span>
		</div>
	</a> -->

	<!-- Docs -->
	<a
		href={localizeHref(AppConfig.cubiq.docs)}
		class="border-base-300 font-roboto text-grey-dark shine-effect flex justify-between border-t border-b px-[30px] py-3 text-left align-middle text-sm"
	>
		<div class="flex justify-center self-center text-left align-middle">
			<Book class="text-sun mr-2 h-4 w-4 self-center" />
			<span class="self-center font-semibold">{m.documentation()}</span>
		</div>
	</a>

	<!-- API Status -->
	<a
		href={AppConfig.status}
		class="border-base-300 font-roboto text-grey-dark shine-effect flex justify-between border-t border-b px-[30px] py-3 text-left align-middle text-sm"
	>
		<div class="flex justify-center self-center text-left align-middle">
			<HeartPlus class="text-sun mr-2 h-4 w-4 self-center" />
			<span class="self-center font-semibold">{m.apiStatus()}</span>
		</div>
	</a>

	<!-- Blog -->
	<a
		href={localizeHref('/blog')}
		class="border-base-300 font-roboto text-grey-dark shine-effect flex justify-between border-t border-b px-[30px] py-3 text-left align-middle text-sm"
	>
		<div class="flex justify-center self-center text-left align-middle">
			<PenLine class="text-sun mr-2 h-4 w-4 self-center" />
			<span class="self-center font-semibold">Blog</span>
		</div>
	</a>

	<!-- Changelog -->
	<a
		href={localizeHref('/changelog')}
		class="border-base-300 font-roboto text-grey-dark shine-effect flex justify-between border-t border-b px-[30px] py-3 text-left align-middle text-sm"
	>
		<div class="flex justify-center self-center text-left align-middle">
			<FileClock class="text-sun mr-2 h-4 w-4 self-center" />
			<span class="self-center font-semibold">Changelog</span>
		</div>
	</a>

	<h2 class="font-pixel my-4 px-[30px] text-base font-extrabold tracking-wider uppercase">
		{m.others()}
	</h2>

	<!-- Lab -->
	<!-- <a
		href={localizeHref('/lab')}
		class="border-base-300 font-roboto text-grey-dark shine-effect flex justify-between border-t border-b px-[30px] py-3 text-left align-middle text-sm"
	>
		<div class="flex justify-center self-center text-left align-middle">
			<FlaskConical class="mr-2 h-4 w-4 self-center" />
			<span class="self-center font-semibold">{m.menuLab()}</span>
		</div>
		<div class="text-grey-medium flex flex-row self-center align-middle">
		</div>
	</a> -->

	<!-- Contact -->
	<div
		class="border-base-300 font-roboto text-grey-dark shine-effect flex justify-between border-t border-b px-[30px] py-3 text-left align-middle text-sm"
	>
		<div class="flex justify-center self-center text-left align-middle">
			<Headset class="mr-2 h-4 w-4 self-center" />
			<span class="self-center font-semibold">{m.contact()}</span>
		</div>
		<div class="text-grey-medium flex flex-row self-center align-middle">
			<button
				onclick={openContactModal}
				class="font-roboto text-grey-medium-dark border-grey-lighter shine-effect flex scale-105 items-center rounded-md border px-[7px] py-[3px] text-xs font-[11px] antialiased"
			>
				{m.getInTouch()}
			</button>
		</div>
	</div>
</div>
