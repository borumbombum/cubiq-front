# Lessons Learned

## Cloudflare Turnstile Integration (2026-07-21)

- **SvelteKit env conventions**: Public-facing env vars need `PUBLIC_` prefix (`$env/static/private` for server-only, `$env/static/public` for client-exposed).
- **Turnstile widget rendering**: Use `onMount` + `window.turnstile.render()` for dynamic rendering in Svelte 5. Avoid static `cf-turnstile` class approach — manual rendering gives explicit control over the token lifecycle (expired/closed callbacks).
- **Server-side verification**: POST to `https://challenges.cloudflare.com/turnstile/v0/siteverify` with `application/x-www-form-urlencoded` (not JSON). Include `remoteip` for additional security.
- **Token state management**: Store the Turnstile token in Svelte `$state`. Clear it on `expired-callback` so the submit button disables when the token expires.
- **Widget cleanup**: Remove the widget instance on component destroy using `turnstile.remove(widgetId)` to prevent memory leaks.
- **Pre-existing type errors**: The codebase has pre-existing TypeScript errors (mostly missing `icon` and `unavailable` properties on `LabProduct` types). These are unrelated to new work.
- **Verify Cloudflare dashboard config first**: Error 110200 ("Domain not authorized") means the hostname is not in the widget's allowed list. Always check the Turnstile site settings in the Cloudflare dashboard before debugging code. Hostname changes may take time to propagate across Cloudflare's edge.
