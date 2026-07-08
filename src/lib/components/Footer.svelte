<!-- Footer -->
<script lang="ts">
	import { Bot, Circle } from '@lucide/svelte';
	import { getCurrentYear } from '$utils';
	import { AppConfig } from '$lib';
	import SystemStatus from './SystemStatus.svelte';
	import { localizeHref, getLocale } from '$paraglide/runtime';
	import { m } from '$paraglide/messages';
	import { getProductsFromLab } from '$lib/data/products.data';
	import type { ProductData } from '$types/products.types';
	import { modalState } from '$stores/Modal.state.svelte';
	import ContactForm from '$lib/components/Modal/ContactForm.svelte';

	// Footer year
	let currentYear = getCurrentYear();
	const date = new Date(AppConfig.cubiq.founded);
	const foundationYear = date.getFullYear();
	const finalYear = `${currentYear != foundationYear ? `${foundationYear} - ${currentYear}` : currentYear}`;

	const locale = getLocale();
	const LAB_PRODUCTS = getProductsFromLab(locale);
	const labProductsForLang = LAB_PRODUCTS.filter((prod: ProductData) => prod.isMain && !prod.hideFromNav).slice(0, 4);

	function openContactModal() {
		modalState.open({
			component: ContactForm,
			size: 'lg',
			closeOnBackdrop: true,
			closeOnEscape: true
		});
	}
</script>

<footer
	class="fw-border-t-divider md:fw-border-t-divider-dot fw-border-t-divider-dot-center relative bg-white px-(--cubiq-app-margin) pt-5 pb-10 pl-12 md:pt-18 md:pl-0"
>
	<div class="max-w-fw container mx-auto flex flex-col">
		<div class="flex flex-col justify-between md:flex-row">
			<!-- Items -->
			<div class="mb-5 grid grid-cols-2 gap-10 text-[18px] md:grid-cols-4 md:gap-20">
				<div>
					<h3 class="font-pixel text-base-100 mb-4 text-xl">{m.menuProducts()}</h3>
					<ul class="space-y-2">
						{#each labProductsForLang as product}
							<li>
								<a
									href={product.url}
									target={product.newWindow ? '_blank' : undefined}
									rel={product.newWindow ? 'nofollow noopener' : undefined}
									class="text-secondary"
								>
									{product.name}
								</a>
							</li>
						{/each}
					</ul>
				</div>

				<div class="order-last md:order-none">
					<h3 class="font-pixel text-base-100 mb-4 text-xl">Developers</h3>
					<ul class="space-y-2">
						<!-- <li><a href="/" class="text-secondary">ViiVPay</a></li> -->
						<li>
							<a href={localizeHref(AppConfig.cubiq.docs)} target="_blank" class="text-secondary"
								>{m.documentation()}</a
							>
						</li>
						<li>
							<a
								href={AppConfig.status}
								class="text-secondary"
								target="_blank"
								rel="nofollow noopener">Status</a
							>
						</li>
						<li>
							<a href={localizeHref('/blog')} class="text-secondary">Blog</a>
						</li>
					</ul>
				</div>

				<div>
					<h3 class="font-pixel text-base-100 mb-4 text-xl">Cubiq</h3>
					<ul class="space-y-2">
						<li><a href={localizeHref('/#more')} class="text-secondary">{m.aboutUs()}</a></li>
						<li><a href={localizeHref('/lab')} class="text-secondary">Laboratório</a></li>
						<li>
							<button onclick={openContactModal} class="text-secondary cursor-pointer">
								{m.contactFormContactUs()}
							</button>
						</li>
					</ul>
				</div>

				<div>
					<h3 class="font-pixel text-base-100 mb-4 text-xl">{m.social()}</h3>
					<ul class="space-y-2">
						<li>
							<a
								href={AppConfig.cubiq.socials.linkedin}
								rel="nofollow noopener"
								target="_blank"
								class="text-secondary">LinkedIn</a
							>
						</li>
						<li>
							<a
								href={AppConfig.cubiq.socials.github}
								rel="nofollow noopener"
								target="_blank"
								class="text-secondary"
							>
								Github
							</a>
						</li>
						<li>
							<a
								href={AppConfig.cubiq.socials.huggingface}
								rel="nofollow noopener"
								target="_blank"
								class="text-secondary">HuggingFace</a
							>
						</li>
					</ul>
				</div>
			</div>
			<!-- Logo / Status -->
			<div
				class="order-first mb-10 flex flex-col items-start justify-center md:order-none md:mb-0 md:items-end"
			>
				<div class="hidden md:block">
					<a href={localizeHref('/')}>
						<img
							src="/logos/cubiq-logo-complete.svg"
							class="w-[200px]"
							width="180"
							alt="footer-logo"
						/>
					</a>
				</div>
			</div>
		</div>

		<!-- Copyright/Left -->
		<div
			class="mt-5 flex flex-col items-start border-black md:flex-col md:items-start md:justify-start"
		>
			<div class="block md:hidden">
				<a href={localizeHref('/')}>
					<img
						src="/logos/cubiq-logo-complete.svg"
						class="w-[130px] md:w-[150px]"
						width="180"
						alt="footer-logo"
					/>
				</a>
			</div>
			<div class="relative -left-2">
				<SystemStatus />
			</div>
			<div class="text-secondary mt-0 mb-4 flex items-center text-sm md:mb-0">
				<!-- ©  -->
				<span class="font-pixel text-primary mr-2">//</span>
				<div>
					{finalYear}, Cubiq. <span class="ml-1">v{process.env.PACKAGE_VERSION}</span>
				</div>
			</div>
		</div>
	</div>
</footer>
