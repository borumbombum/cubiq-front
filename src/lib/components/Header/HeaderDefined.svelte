<!-- HeaderDefined: A Header with a defined border bottom -->
<script lang="ts">
	import HeaderLogo from '$lib/components/Header/HeaderLogo.svelte';
	import { fade } from 'svelte/transition';
	import HeaderLoginButtons from './HeaderLoginButtons.svelte';
	import HeaderButtons from './HeaderButtons.svelte';

	let {
		headerButtons = 'institutional',
		mobileBorderB = false
	}: { headerButtons?: 'institutional' | 'login'; mobileBorderB?: boolean } = $props();
</script>

<header
	in:fade={{ duration: 150 }}
	class={[
		'border-primary-content border-b-base-200 relative px-(--cubiq-app-margin) pb-4 md:border-b md:px-0',
		mobileBorderB && 'border-b'
	]}
>
	<!-- Actual hero -->
	<div class="max-w-fw container mx-auto pt-5 pb-1">
		<nav class="Xz-20 relative z-200 flex items-center justify-between">
			<!-- Logos -->
			<HeaderLogo />

			<!-- Menus -->
			{#if headerButtons == 'institutional'}
				<HeaderButtons showToolsShortcuts={false} />
			{:else if headerButtons == 'login'}
				<HeaderLoginButtons />
			{/if}
		</nav>
	</div>
	<!-- Decorations -->
	<!-- <HeaderDecorations /> -->
</header>
