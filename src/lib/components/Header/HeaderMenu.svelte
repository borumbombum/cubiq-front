<script lang="ts">
	import {
		Book,
		Cable,
		ChevronDown,
		FileClock,
		Headset,
		HeartPlus,
		PenLine,
		Zap
	} from '@lucide/svelte';
	import { getLocale, localizeHref } from '$paraglide/runtime';
	import { getProductsFromLab, getProducts } from '$lib/data/products.data';
	import { m } from '$paraglide/messages';
	import { AppConfig } from '$lib/configs';
	import type { ProductData } from '$types/products.types';
	import { Tween } from 'svelte/motion';
	import { cubicIn, cubicOut } from 'svelte/easing';
	import { onMount } from 'svelte';

	const locale = $state(getLocale());
	const PRODUCTS = getProductsFromLab(locale);
	let productsForLang = $state(
		PRODUCTS.filter((prod: ProductData) => prod.isMain && !prod.hideFromNav)
	);

	const API_PRODUCTS = getProducts(locale);
	let apisForLang = $state(API_PRODUCTS.filter((prod: ProductData) => prod.isMain).slice(0, 3));

	function getHref(url: string | undefined): string {
		if (!url) return '/';
		if (url.startsWith('http')) return url;
		return localizeHref(url, { locale: locale });
	}
</script>

<div class="fw-header-fs z-50 hidden items-center justify-center gap-10 md:flex">
	<div class="dropdown Xdropdown-hover relative">
		<div class="cursor-fw flex items-center uppercase" tabindex="0" role="button">
			<!-- <Zap
				fill="#fff"
				class="animate__animated animate__jello animate__repeat-3 animate__delay-1s mr-[5px] h-4"
			/> -->
			{m.menuProducts()}
			<span><ChevronDown class="ml-1 h-5" /></span>
		</div>
		<!-- Main menu -->
		<ul
			class="menu dropdown-content bg-base-100 rounded-box z-1 mt-4 w-[540px] px-5 py-3 shadow-md"
		>
			{#each productsForLang as drawer, i}
				<li class="w-full">
					<a
						href={getHref(drawer.url)}
						target={drawer.url?.startsWith('http') ? '_blank' : undefined}
						rel={drawer.url?.startsWith('http') ? 'noopener noreferrer' : undefined}
						class={[
							'flex w-full items-center justify-start gap-2 py-3 text-left align-middle text-sm',
							i + 1 == productsForLang.length ? '' : 'border-b border-b-gray-700'
						]}
					>
						<!-- {i} - {productsForLang.length} -->
						<div
							class="flex max-w-full min-w-0 justify-center self-center overflow-hidden text-left align-middle"
						>
							{#if drawer.logoSquare}
								<img
									src={drawer.logoSquare}
									alt={`${drawer.name} logo`}
									class="mr-1 aspect-square w-7 max-w-7 object-cover antialiased"
								/>
							{:else if drawer.logo}
								<img
									src={drawer.logo}
									alt={`${drawer.name} logo`}
									class="relative -left-[1px] mr-1 w-5 max-w-5 antialiased"
								/>
							{:else if drawer.icon}
								<drawer.icon class="mr-2 h-4 w-4 self-center" />
							{/if}

							<div
								class={[
									'self-center text-[16px] tracking-wider',
									drawer.isBold ? 'font-bold' : 'font-semibold'
								]}
								class:ml-2={!!drawer.logoSquare}
							>
								{drawer.name}
							</div>
							{#if drawer.slogan}
								<div class="text-secondary ml-1 min-w-0 flex-1 truncate text-[16px]">
									— {drawer.slogan}
								</div>
							{/if}
						</div>
					</a>
				</li>
			{/each}
		</ul>
	</div>

	<!-- APIs dropdown -->
	<!-- <div class="dropdown relative">
		<div class="cursor-fw flex items-center uppercase" tabindex="0" role="button">
			{m.menuAPIs()}
			<span><ChevronDown class="ml-1 h-5" /></span>
		</div>
		<ul
			class="menu dropdown-content bg-base-100 rounded-box z-1 mt-4 w-[400px] px-5 py-3 shadow-md"
		>
			{#each apisForLang as api, i}
				<li class="w-full">
					<a
						href={getHref(api.url)}
						target={api.url?.startsWith('http') ? '_blank' : undefined}
						rel={api.url?.startsWith('http') ? 'noopener noreferrer' : undefined}
						class={[
							'flex w-full items-center justify-start gap-2 py-3 text-left align-middle text-sm',
							i + 1 == apisForLang.length ? '' : 'border-b border-b-gray-700'
						]}
					>
						{#if api.icon}
							<api.icon class="mr-2 h-4 w-4 self-center" />
						{/if}
						<div
							class={[
								'self-center text-[16px] tracking-wider',
								api.isBold ? 'font-bold' : 'font-semibold'
							]}
						>
							{api.name}
						</div>
						{#if api.slogan}
							<div class="text-secondary ml-1 min-w-0 flex-1 truncate text-[16px]">
								— {api.slogan}
							</div>
						{/if}
					</a>
				</li>
			{/each}
			<li class="w-full border-t border-gray-700">
				<a
					href={getHref('/docs')}
					class="flex w-full items-center justify-start gap-2 py-3 text-left align-middle text-sm"
				>
					<Cable class="mr-2 h-4 w-4 self-center" />
					<div class="self-center text-[16px] font-bold tracking-wider">
						{m.menuAllAPIs()}
					</div>
				</a>
			</li>
		</ul>
	</div> -->

	<div class="dropdown relative">
		<div class="cursor-fw flex items-center uppercase" tabindex="0" role="button">
			{m.menuHelp()}
			<span><ChevronDown class="ml-1 h-5" /></span>
		</div>
		<ul class="menu dropdown-content bg-base-100 rounded-box z-1 mt-4 w-fit px-5 py-3 shadow-md">
			<!-- <li>
				<a
					href={localizeHref('/soon')}
					class={[
						'flex py-3 align-middle text-[16px] tracking-wider',
						'border-b border-b-gray-700'
					]}
				>
					<Headset class="h-4" />
					{m.help()}
				</a>
			</li> -->
			<li>
				<a
					href={localizeHref(AppConfig.cubiq.docs)}
					class={[
						'flex py-3 align-middle text-[16px] tracking-wider',
						'border-b border-b-gray-700'
					]}
				>
					<Book class="h-4" />
					{m.documentation()}
				</a>
			</li>
			<li>
				<a
					href={AppConfig.status}
					rel="nofollow noopener"
					target="_blank"
					class={[
						'flex py-3 align-middle text-[16px] tracking-wider',
						'border-b border-b-gray-700'
					]}
				>
					<HeartPlus class="h-4" />
					{m.apiStatus()}
				</a>
			</li>
			<li>
				<a
					href={localizeHref('/blog')}
					class={['flex py-3 align-middle text-[16px] tracking-wider']}
				>
					<PenLine class="h-4" />
					Blog
				</a>
			</li>
		</ul>
	</div>

	<!-- <a class="uppercase" href={localizeHref('/soon')}>{m.menuPrices()}</a> -->
	<!-- <a class="uppercase" href={localizeHref('/blog')}>Blog</a> -->
	<!-- <a class="uppercase" href={localizeHref('/blog')}>Blog</a> -->

	<a class="uppercase" href={localizeHref('/changelog')}>Roadmap</a>
</div>
