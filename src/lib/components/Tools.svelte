<script lang="ts">
	import { AppConfig } from '$lib/configs';
	import { getLocale } from '$paraglide/runtime';
	import { modalState } from '$stores/Modal.state.svelte';
	import ContactForm from '$lib/components/Modal/ContactForm.svelte';
	import { CircleQuestionMark, X } from '@lucide/svelte';
	import { onMount } from 'svelte';

	let scrollY = $state(0);
	let showButton = $derived(scrollY >= 0);

	let dropdownButton: HTMLDivElement | undefined = $state();
	let dropdownContainer: HTMLDivElement | undefined = $state();
	let isMenuOpen = $state(false);
	let mobileMenu: HTMLUListElement | undefined = $state();

	const menuWidth = $state('12rem'); // w-64 : w-52

	onMount(() => {
		const updateScrollY = () => (scrollY = window.scrollY);
		window.addEventListener('scroll', updateScrollY);

		// Monitor focus changes to detect dropdown state
		// if (dropdownButton) {
		// 	dropdownButton.addEventListener('focus', () => {
		// 		isMenuOpen = true;
		// 	});

		// 	dropdownButton.addEventListener('blur', () => {
		// 		setTimeout(() => {
		// 			if (!dropdownContainer?.contains(document.activeElement)) {
		// 				isMenuOpen = false;
		// 			}
		// 		}, 100);
		// 	});
		// }

		// Close when clicking a menu item
		if (dropdownContainer) {
			dropdownContainer.addEventListener('click', (e) => {
				if ((e.target as HTMLElement).tagName === 'A') {
					isMenuOpen = false;
					dropdownButton?.blur();
				}
			});
		}

		return () => {
			window.removeEventListener('scroll', updateScrollY);
		};
	});

	function openContactModal() {
		isMenuOpen = false;
		dropdownButton?.blur();
		modalState.open({
			component: ContactForm,
			props: {}
		});
	}
</script>

<svelte:window bind:scrollY />

{#if showButton}
	<!-- Menu -->
	<div
		bind:this={dropdownContainer}
		class="hover:bg-primary-700 active:bg-primary-800 fixed right-[26px] bottom-4 z-50 flex h-12 w-12 items-center justify-center rounded-full border-none bg-transparent text-white shadow-lg transition-all duration-300 ease-in-out hover:shadow-xl active:translate-y-0 sm:bottom-4 sm:h-10 sm:w-10 md:right-8 md:bottom-8 md:h-12 md:w-12"
	>
		<div bind:this={dropdownButton} tabindex="0" role="button" class="btn btn-circle z-50">
			{#if isMenuOpen}
				<X
					class="animate__animated animate__rotateIn animate__faster h-5 w-5"
					onclick={() => {
						isMenuOpen = false;
					}}
				/>
			{:else}
				<CircleQuestionMark class="h-5" onclick={() => (isMenuOpen = true)} />
			{/if}
		</div>
		<ul
			bind:this={mobileMenu}
			tabindex="-1"
			style="width: {menuWidth}; transition: width 300ms cubic-bezier(0.33, 1, 0.68, 1); {isMenuOpen
				? 'display: flex;'
				: 'display: none;'}"
			class="menu-sm menu rounded-box border-accent absolute right-0 bottom-full z-50 mb-3 w-[100px]! flex-col! gap-2 rounded-lg border bg-black py-3 font-sans tracking-wider! shadow-xl"
		>
			<li>
				<button onclick={openContactModal}>Email</button>
			</li>
			<li>
				<a
					target="_blank"
					rel="nofollow noreferrer"
					href={AppConfig.cubiq.socials.whatsapp[getLocale()]}>Whatsapp</a
				>
			</li>
			<li>
				<a target="_blank" rel="nofollow noreferrer" href={AppConfig.cubiq.socials.telegram}
					>Telegram</a
				>
			</li>

			<li class="hidden">
				<a target="_blank" rel="nofollow noreferrer" href={AppConfig.cubiq.socials.nostr}>Nostr</a>
			</li>
		</ul>
	</div>
{/if}
