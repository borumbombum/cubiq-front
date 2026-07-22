<script lang="ts">
	import { page } from '$app/state';
	import HeaderButtons from './HeaderButtons.svelte';
	import HeaderContent from './HeaderContent.svelte';
	import HeaderDecorations from './HeaderDecorations.svelte';
	import HeaderDots from './HeaderDots.svelte';
	import HeaderLogo from './HeaderLogo.svelte';
	import { fade } from 'svelte/transition';
	import { deLocalizeUrl } from '$paraglide/runtime';
	import HeaderMenu from './HeaderMenu.svelte';
	import { onMount, type Snippet } from 'svelte';
	import { Tween } from 'svelte/motion';
	import { cubicIn, cubicOut } from 'svelte/easing';

	// let currentPath = $derived(page.url.pathname);
	const delocalizedPath = deLocalizeUrl(page.url).pathname;

	interface Props {
		background?: 'base' | 'space' | 'rocket' | 'astronaut' | 'commerce' | 'construction' | 'stars';
		opacity?: '0' | '40';

		titleRight: string;
		titleLeft: string;
		heroContent: string;
		slidedTitle?: boolean;
		buttons?: boolean;

		noMobileBorderBottom?: boolean;
		hideCube?: boolean;

		children?: Snippet;
	}

	let {
		background = 'space',
		opacity = '40',
		titleLeft,
		titleRight,
		heroContent,
		noMobileBorderBottom = false,
		hideCube = false,
		slidedTitle = true,
		buttons = true,
		children
	}: Props = $props();

	// Create the Tween instance with initial value and default options
	const rotation = new Tween(0, {
		duration: 500,
		easing: cubicOut
	});

	let spinning = $state(false);

	async function spin() {
		if (spinning) return;
		spinning = true;

		// Reset rotation to 0 instantly
		await rotation.set(0, { duration: 0 });

		// Phase 1: Acceleration
		const accelerationDegrees = 360 * 2; // Spin twice while accelerating
		const accelerationDuration = 500;
		await rotation.set(accelerationDegrees, { duration: accelerationDuration, easing: cubicIn });

		// Phase 2: Deceleration
		const decelerationDegrees = accelerationDegrees + 360 * 1.5; // Add 1.5 more spins
		const decelerationDuration = 800;
		await rotation.set(decelerationDegrees, { duration: decelerationDuration, easing: cubicOut });

		spinning = false;
	}

	onMount(() => {
		spin(); // Spin on page load

		const intervalId = setInterval(() => {
			spin();
		}, 8000); // Spin every 10 seconds

		return () => {
			clearInterval(intervalId);
		};
	});
</script>

<header
	in:fade={{ duration: 150 }}
	class={[
		'border-base-200 relative px-(--cubiq-app-margin) md:border-b-0 md:px-0',
		noMobileBorderBottom ? '' : 'border-b '
	]}
>
	<!-- Bg image -->
	<div
		class={[
			'absolute inset-0 z-0 h-full bg-cover bg-center',
			opacity == '0' && 'opacity-none',
			opacity == '40' && 'opacity-40',

			background == 'base' && 'fw-bg-base',
			background == 'space' && 'fw-bg-space',
			background == 'stars' && 'fw-bg-stars',
			background == 'astronaut' && 'fw-bg-astronaut',
			background == 'construction' && 'fw-bg-construction',
			background == 'commerce' && 'fw-bg-bagity',
			background == 'rocket' && 'fw-bg-rocket scale-x-[-1] bg-right md:scale-x-100 md:bg-center'
		]}
	></div>

	<!-- Actual hero -->
	<div class="max-w-fw container mx-auto pt-5 pb-1">
		<nav class="sticky top-0 z-200 flex items-center justify-between">
			<!-- Logos -->
			<HeaderLogo />

			<!-- Menus -->
			<HeaderMenu />

			<!-- Buttons -->
			<HeaderButtons />
		</nav>

		<HeaderContent
			{slidedTitle}
			{titleLeft}
			{titleRight}
			{heroContent}
			{buttons}
			buttonsSnippet={children}
		/>
	</div>
	<!-- Navigation Dots -->
	<HeaderDots />

	<!-- Decorations -->
	<HeaderDecorations />

	<!-- Decoration cube -->
	{#if hideCube === false}
		<div class="max-w-fw relative mx-auto hidden md:block">
			<div
				style="transform: rotate({rotation.current}deg);"
				class="absolute right-0 bottom-[-7px] z-50 h-[15px] w-[15px] bg-[url('/bgs/square.svg')] bg-contain bg-no-repeat"
			></div>
		</div>
	{/if}
</header>
