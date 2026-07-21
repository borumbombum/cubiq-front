import { json } from '@sveltejs/kit';
import { CUBIQ_API_APP_TOKEN, TURNSTILE_SECRET_KEY } from '$env/static/private';
import { m } from '$paraglide/messages';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, getClientAddress }) => {
	const { name, email, interest, message, timestamp, locale, pagePath, turnstileToken } =
		await request.json();
	const ip = getClientAddress();

	// Time check - reject if submitted too fast (< 3 seconds)
	if (Date.now() - timestamp < 3000) {
		return json({ success: false, message: 'Submission too fast' }, { status: 400 });
	}

	// Verify Turnstile token
	const turnstileRes = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
		method: 'POST',
		headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
		body: new URLSearchParams({
			secret: TURNSTILE_SECRET_KEY,
			response: turnstileToken,
			remoteip: ip
		})
	});
	const turnstileResult = await turnstileRes.json();

	if (!turnstileResult.success) {
		return json({ success: false, message: 'Verification failed' }, { status: 400 });
	}

	const localeLabels: Record<string, string> = {
		pt: 'Português',
		en: 'English',
		es: 'Español'
	};

	const displayPath = pagePath === '/' ? m.contactFormHomepage() : pagePath;

	const subject = `[Formulário de Contato] ${interest} - ${name}`;
	const text = `Nome: ${name}\nEmail: ${email}\nInteresse: ${interest}\nIdioma: ${locale}\nIP: ${ip}\n\n${message}\n\nEnviado desde: ${displayPath}`;

	const html = `
<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e5e5;">
  <div style="background: #fff; padding: 24px; text-align: center; border-bottom: 1px solid #e5e5e5;">
    <img src="https://www.cubiq.lat/logos/cubiq-logo-black.png" alt="Cubiq" style="height: 40px; width: auto;">
  </div>
  <div style="padding: 32px; background: #fafafa;">
    <h2 style="color: #1a1a1a; margin: 0 0 24px 0; font-size: 20px; font-weight: 600;">Nova Mensagem do Formulário de Contato</h2>
    <table style="width: 100%; border-collapse: collapse; background: #fff; border-radius: 8px; overflow: hidden; border: 1px solid #e5e5e5;">
      <tr style="border-bottom: 1px solid #e5e5e5;">
        <td style="padding: 12px 16px; font-weight: 600; color: #666; width: 120px; background: #f5f5f5;">Nome</td>
        <td style="padding: 12px 16px; color: #1a1a1a;">${name}</td>
      </tr>
      <tr style="border-bottom: 1px solid #e5e5e5;">
        <td style="padding: 12px 16px; font-weight: 600; color: #666; background: #f5f5f5;">Email</td>
        <td style="padding: 12px 16px;"><a href="mailto:${email}" style="color: #0066cc;">${email}</a></td>
      </tr>
      <tr style="border-bottom: 1px solid #e5e5e5;">
        <td style="padding: 12px 16px; font-weight: 600; color: #666; background: #f5f5f5;">Interesse</td>
        <td style="padding: 12px 16px; color: #1a1a1a;">${interest}</td>
      </tr>
      <tr style="border-bottom: 1px solid #e5e5e5;">
        <td style="padding: 12px 16px; font-weight: 600; color: #666; background: #f5f5f5;">Idioma</td>
        <td style="padding: 12px 16px; color: #1a1a1a;">${localeLabels[locale] || locale}</td>
      </tr>
      <tr>
        <td style="padding: 12px 16px; font-weight: 600; color: #666; background: #f5f5f5;">IP</td>
        <td style="padding: 12px 16px; color: #666; font-family: monospace; font-size: 13px;">${ip}</td>
      </tr>
    </table>
    <div style="margin-top: 24px; padding: 20px; background: #fff; border-radius: 8px; border: 1px solid #e5e5e5;">
      <p style="margin: 0 0 8px 0; font-weight: 600; color: #666; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">Mensagem</p>
      <p style="margin: 0; color: #1a1a1a; line-height: 1.6; white-space: pre-wrap;">${message}</p>
    </div>
  </div>
  <div style="background: #1a1a1a; color: #999; padding: 16px 24px; text-align: center; font-size: 12px;">
    <span>Enviado desde: </span>
    <span style="color: #fff;">${displayPath}</span>
  </div>
</div>`;

	// Send to both recipients in parallel
	const recipients = ['nicolas@cubiq.lat', 'bruno@cubiq.lat'];

	const results = await Promise.all(
		recipients.map((to) =>
			fetch('https://api.cubiq.lat/notifications/email', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${CUBIQ_API_APP_TOKEN}`
				},
				body: JSON.stringify({ to, subject, html, text })
			})
		)
	);

	const allSuccess = results.every((r) => r.ok);

	if (!allSuccess) {
		return json({ success: false, message: 'Failed to send one or more emails' }, { status: 500 });
	}

	return json({ success: true });
};
