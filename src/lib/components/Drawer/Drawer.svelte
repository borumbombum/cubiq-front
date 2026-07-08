<!-- src/lib/components/ui/Drawer.svelte -->
<script lang="ts">
	import { slide, fly } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';

	import { drawerState, goBackToMainMenu } from '$stores/DrawerState.state.svelte';
	import { CircleArrowLeft } from '@lucide/svelte';

	import DrawerMain from './DrawerMain.svelte';
	import DrawerAccount from './DrawerAccount.svelte';
	import DrawerLanguages from './DrawerLanguages.svelte';
	import DrawerUser from './dashboard/DrawerUser.svelte';

	// Effect to add/remove no-scroll class when drawer state changes
	$effect(() => {
		if (drawerState.active) {
			window.scrollTo(0, 0);
			// Add no-scroll class to body and html when drawer is active
			document.body.classList.add('no-scroll');
			document.documentElement.classList.add('no-scroll');
		} else {
			// Remove no-scroll class when drawer is inactive
			document.body.classList.remove('no-scroll');
			document.documentElement.classList.remove('no-scroll');
		}

		// Clean up effect when component is destroyed
		return () => {
			document.body.classList.remove('no-scroll');
			document.documentElement.classList.remove('no-scroll');
		};
	});
</script>

{#if drawerState.active}
	<div
		class="fixed inset-y-0 left-0 z-100 mt-[85px] w-screen bg-black md:w-64"
		transition:slide={{ duration: 300, easing: quintOut }}
	>
		<div class="flex h-full flex-col justify-start overflow-hidden">
			{#if drawerState.currentSubmenu}
				<div class="flex flex-col px-0 text-xs">
					<div class="border-base-300 flex items-center border-t border-b px-[30px]">
						<button onclick={goBackToMainMenu} class="text-blue mr-3 flex items-center gap-2">
							<CircleArrowLeft class="h-4 w-4 pt-[1px]" />
							<h2 class="font-pixel my-5 text-base font-extrabold uppercase">
								{drawerState.currentName}
							</h2>
						</button>
					</div>
				</div>
			{/if}

			{#if !drawerState.currentSubmenu}
				<DrawerMain />
			{:else if drawerState.currentSubmenu === 'account'}
				<div
					in:fly={{ x: 300, duration: 300, easing: quintOut }}
					out:fly={{ x: -300, duration: 300, easing: quintOut }}
					class="overflow-y-auto"
				>
					<DrawerAccount />
				</div>
			{:else if drawerState.currentSubmenu === 'fw_menu_languages'}
				<div in:fly={{ x: 300, duration: 300, easing: quintOut }} class="overflow-y-auto">
					<DrawerLanguages />
				</div>
			{:else if drawerState.currentSubmenu === 'fw_menu_dashboard_user'}
				<div in:fly={{ x: 300, duration: 300, easing: quintOut }} class="overflow-y-auto">
					<DrawerUser />
				</div>
			{/if}
		</div>
	</div>
{/if}
