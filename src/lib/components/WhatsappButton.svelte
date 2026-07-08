<script lang="ts">
	import { getLocale } from '$paraglide/runtime';
	import { AppConfig } from '$lib/configs';

	const locale = $derived(getLocale());
	const wa = $derived(AppConfig.cubiq.socials.whatsapp[locale]);
	const phone = $derived(AppConfig.cubiq.socials.phones[locale]);
</script>

<a href={wa} target="_blank" rel="nofollow noopener">
	<div
		class="font-roboto text-grey-medium-dark border-grey-lighter shine-effect flex scale-105 items-center rounded-md border px-[7px] py-[3px] text-xs font-[11px] antialiased"
	>
		<img src="/whatsapp.png" alt="whatsapp" class="mr-1 h-4 self-center" />
		{phone}
	</div>
</a>
