<script lang="ts">
	import { onMount } from 'svelte';
	import { PUBLIC_TURNSTILE_SITEKEY } from '$env/static/public';
	import { AppConfig } from '$lib/configs';
	import { m } from '$paraglide/messages';
	import { getLocale } from '$paraglide/runtime';
	import { page } from '$app/state';
	import { modalState } from '$stores/Modal.state.svelte';
	import { FwToast } from '$stores/Toast.state.svelte';
	import { MessageCircle, Send, Loader2 } from '@lucide/svelte';

	const locale = getLocale();

	let formOpenTime = Date.now();
	let isSubmitting = $state(false);
	let turnstileToken = $state<string | null>(null);
	let turnstileContainer = $state<HTMLDivElement>();

	onMount(() => {
		const widgetId = turnstile.render(turnstileContainer!, {
			sitekey: PUBLIC_TURNSTILE_SITEKEY,
			callback: (token: string) => {
				turnstileToken = token;
			},
			'expired-callback': () => {
				turnstileToken = null;
			}
		});

		return () => {
			if (widgetId) turnstile.remove(widgetId);
		};
	});

	let formData = $state({
		name: '',
		email: '',
		interest: '',
		message: ''
	});

	async function handleSubmit(e: Event) {
		e.preventDefault();
		isSubmitting = true;

		try {
			const res = await fetch('/api/contact', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					...formData,
					turnstileToken,
					timestamp: formOpenTime,
					locale: getLocale(),
					pagePath: page.url.pathname === '/' ? m.contactFormHomepage() : page.url.pathname
				})
			});

			const result = await res.json();

			if (res.ok && result.success) {
				FwToast.launch(m.contactFormSuccess(), 'success', 'top');
				modalState.close();
			} else {
				FwToast.launch(result.message || 'Failed to send message', 'error', 'top');
			}
		} catch {
			FwToast.launch('Failed to send message', 'error', 'top');
		} finally {
			isSubmitting = false;
		}
	}
</script>

<div class="p-6 md:p-8">
	<!-- Title -->
	<h2 class="font-pixel mb-6 text-xl font-bold">{m.contactFormTitle()}</h2>

	<div class="flex flex-col md:flex-row">
		<!-- Form Section -->
		<div class="flex-1 md:pr-8">
			<form onsubmit={handleSubmit}>
				<!-- Name -->
				<div class="form-control mb-4">
					<label class="label" for="contact-name">
						<span class="label-text">{m.contactFormName()}</span>
					</label>
					<input
						type="text"
						id="contact-name"
						name="name"
						bind:value={formData.name}
						class="input input-bordered w-full"
						placeholder={m.contactFormNamePlaceholder()}
						required
					/>
				</div>

				<!-- Email -->
				<div class="form-control mb-4">
					<label class="label" for="contact-email">
						<span class="label-text">{m.contactFormEmail()}</span>
					</label>
					<input
						type="email"
						id="contact-email"
						name="email"
						bind:value={formData.email}
						class="input input-bordered w-full"
						placeholder={m.contactFormEmailPlaceholder()}
						required
					/>
				</div>

				<!-- Interest -->
				<div class="form-control mb-4">
					<label class="label" for="contact-interest">
						<span class="label-text">{m.contactFormInterest()}</span>
					</label>
					<select
						id="contact-interest"
						name="interest"
						bind:value={formData.interest}
						class="select select-bordered w-full"
						required
					>
						<option value="" disabled>{m.contactFormInterestPlaceholder()}</option>
						<option value="software">{m.contactFormInterestSoftware()}</option>
						<option value="baas">{m.contactFormInterestBaaS()}</option>
						<option value="payments">{m.contactFormInterestPayments()}</option>
						<option value="partnerships">{m.contactFormInterestPartnerships()}</option>
						<option value="inquiry">{m.contactFormInterestInquiry()}</option>
					</select>
				</div>

				<!-- Message -->
				<div class="form-control mb-6">
					<label class="label" for="contact-message">
						<span class="label-text">{m.contactFormMessage()}</span>
					</label>
					<textarea
						id="contact-message"
						name="message"
						bind:value={formData.message}
						class="textarea textarea-bordered w-full"
						placeholder={m.contactFormMessagePlaceholder()}
						rows="4"
						required
					>
					</textarea>
				</div>

				<!-- Turnstile -->
				<div class="mb-6" bind:this={turnstileContainer}></div>

				<!-- Submit -->
				<button
					type="submit"
					class="btn btn-primary w-full"
					disabled={isSubmitting || !turnstileToken}
				>
					{#if isSubmitting}
						<Loader2 class="mr-2 h-4 w-4 animate-spin" />
					{:else}
						<Send class="mr-2 h-4 w-4" />
					{/if}
					{m.contactFormSend()}
				</button>
			</form>
		</div>

		<!-- Contact Links Section -->
		<div
			class="border-base-300 mt-6 hidden pt-6 md:mt-0 md:inline-block md:border-l md:pt-0 md:pl-8"
		>
			<div class="space-y-4">
				<!-- WhatsApp -->
				<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
				<a href={AppConfig.cubiq.socials.whatsapp[locale]} target="_blank" rel="nofollow noreferrer" class="btn btn-sm bg-base-100 border-base-300 text-base-content hover:border-base-content w-full justify-start transition-opacity hover:opacity-80">
					<img src="/whatsapp.png" alt="WhatsApp" class="mr-2 h-4 w-4" />
					{m.contactFormWhatsapp()}
				</a>

				<!-- Telegram -->
				<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
				<a href={AppConfig.cubiq.socials.telegram} target="_blank" rel="nofollow noreferrer" class="btn btn-sm bg-base-100 border-base-300 text-base-content hover:border-base-content w-full justify-start transition-opacity hover:opacity-80">
					<MessageCircle class="mr-2 h-4 w-4" />
					{m.contactFormTelegram()}
				</a>
			</div>
		</div>
	</div>
</div>
