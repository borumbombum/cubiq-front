<script lang="ts">
	import { m } from '$paraglide/messages';
	import { modalState } from '$stores/Modal.state.svelte';
	import ContactForm from '$lib/components/Modal/ContactForm.svelte';
	import { onMount } from 'svelte';

	let isExpanded = $state(false);
	let sectionElement: HTMLElement;

	onMount(() => {
		function handler() {
			modalState.open({ component: ContactForm, size: 'lg', closeOnBackdrop: true, closeOnEscape: true });
		}
		window.addEventListener('open:contact', handler);
		return () => window.removeEventListener('open:contact', handler);
	});

	function toggleExpanded() {
		if (isExpanded) {
			// Scroll to the start of the section when collapsing
			sectionElement?.scrollIntoView({
				behavior: 'smooth',
				block: 'start'
				// block: 'nearest'
			});
		}
		isExpanded = !isExpanded;
	}
</script>

<div class="relative">
	<section
		bind:this={sectionElement}
		class="fw-home-about z-10 mx-(--cubiq-app-margin) mb-12 max-w-full pt-2 md:mx-auto md:max-w-[60%] md:pt-10"
	>
		<div class="relative">
			<div
				class="space-y-0 transition-all duration-500 {isExpanded
					? ''
					: 'max-h-[29rem] overflow-hidden md:max-h-[29rem]'}"
			>
				{@html m.aboutText()}
			</div>

			<!-- Gradient overlay when collapsed -->
			{#if !isExpanded}
				<div
					class="pointer-events-none absolute right-0 bottom-0 left-0 h-32 bg-gradient-to-t from-black via-black/70 to-transparent"
				></div>
			{/if}
		</div>

		<!-- Read all button -->
		<div
			class={['relative -top-2 mt-0 flex justify-center md:top-0 md:mt-3', isExpanded && 'mt-10']}
		>
			<button
				onclick={toggleExpanded}
				class="bg-primary/10 hover:bg-primary/20 border-primary/30 text-primary flex items-center gap-2 rounded-full border px-5 py-2 transition-all duration-300"
			>
				<span class="!font-sans !text-base tracking-wider uppercase md:!text-lg"
					>{isExpanded ? m.readLess() : m.readMore()}</span
				>
			</button>
		</div>
	</section>
</div>

<style>
	.fw-home-about :global(a) {
		text-decoration: underline !important;
	}
</style>
