<script lang="ts">
	import Header from '$lib/components/Header/Header.svelte';
	import Meta from '$lib/components/Meta.svelte';
	import { m } from '$paraglide/messages';
	import { enhance } from '$app/forms';

	interface Commit {
		sha: string;
		repo: string;
		date: string;
		message?: string;
		authorName?: string;
		authorAvatar?: string;
	}

	let { data, form } = $props();

	let commits = $state<Commit[]>(data.commits ?? []);
	let loading = $state(false);
	let currentStartDate = $state(data.currentStartDate ?? '');
	let currentEndDate = $state(data.currentEndDate ?? '');
	let error = $state<string | null>(data.error ?? null);
	let loadMoreRef: HTMLElement | null = $state(null);
	let hasMore = $state(true);
	let mounted = $state(false);

	let monthStats = $derived.by(() => {
		const stats = new Map<string, { agent: number; human: number }>();
		for (const commit of commits) {
			const key = getMonthKey(commit.date);
			if (!stats.has(key)) stats.set(key, { agent: 0, human: 0 });
			const s = stats.get(key)!;
			if (commit.message?.startsWith('AGENT:')) {
				s.agent++;
			} else {
				s.human++;
			}
		}
		return stats;
	});

	$effect(() => {
		if (form?.success === true && form?.commits) {
			const newCommits = form.commits as Commit[];

			// Filter duplicates by SHA
			const existingShas = new Set(commits.map((c) => c.sha));
			const uniqueCommits = newCommits.filter((c) => !existingShas.has(c.sha));

			if (uniqueCommits.length !== newCommits.length) {
				console.warn(
					`Changelog: Filtered out ${newCommits.length - uniqueCommits.length} duplicate commits`
				);
			}

			if (uniqueCommits.length === 0) {
				hasMore = false;
			} else {
				commits = [...commits, ...uniqueCommits];
				if (uniqueCommits.length < 10) {
					hasMore = false;
				}
			}
		} else if (form?.success === false && form?.error) {
			error = form.error as string;
		}
		loading = false;
	});

	function getMonthKey(dateStr: string): string {
		const date = new Date(dateStr);
		return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
	}

	function formatMonthHeader(monthKey: string): string {
		const [year, month] = monthKey.split('-');
		const date = new Date(parseInt(year), parseInt(month) - 1);
		return date.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
	}

	function formatDate(dateStr: string): string {
		return new Date(dateStr).toLocaleDateString(undefined, {
			year: 'numeric',
			month: 'short',
			day: 'numeric'
		});
	}

	function getPreviousMonth(startDate: string): { start: string; end: string } {
		const [yearStr, monthStr] = startDate.split('-');
		const year = parseInt(yearStr, 10);
		const month = parseInt(monthStr, 10);

		let prevMonth = month - 1;
		let prevYear = year;

		if (prevMonth < 1) {
			prevMonth = 12;
			prevYear = year - 1;
		}

		const lastDay = new Date(prevYear, prevMonth, 0).getDate();

		return {
			start: `${prevYear}-${String(prevMonth).padStart(2, '0')}-01`,
			end: `${prevYear}-${String(prevMonth).padStart(2, '0')}-${lastDay}`
		};
	}

	function updateDateRange() {
		const newRange = getPreviousMonth(currentStartDate);
		currentStartDate = newRange.start;
		currentEndDate = newRange.end;
	}

	function triggerLoadMore() {
		if (loading || !hasMore) return;

		const newRange = getPreviousMonth(currentStartDate);

		console.log(
			`Changelog: Fetching previous month - from ${currentStartDate} to ${newRange.start}`
		);

		// Update form inputs directly before submission
		const startInput = document.getElementById('start-date-input') as HTMLInputElement;
		const endInput = document.getElementById('end-date-input') as HTMLInputElement;
		const refreshInput = document.getElementById('refresh-input') as HTMLInputElement;

		if (startInput) startInput.value = newRange.start;
		if (endInput) endInput.value = newRange.end;
		if (refreshInput) refreshInput.value = 'false';

		console.log(`Changelog: Form values - startDate: ${newRange.start}, endDate: ${newRange.end}`);

		loading = true;
		currentStartDate = newRange.start;
		currentEndDate = newRange.end;

		const formEl = document.getElementById('load-more-form') as HTMLFormElement;
		formEl?.requestSubmit();
	}

	$effect(() => {
		if (!loadMoreRef) return;

		mounted = true;

		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting && hasMore && !loading && mounted) {
					triggerLoadMore();
				}
			},
			{ rootMargin: '100px' }
		);

		observer.observe(loadMoreRef);

		return () => observer.disconnect();
	});
</script>

<Meta title="Changelog" description="" />

<Header
	titleLeft={m.the()}
	titleRight="Roadmap"
	background="rocket"
	heroContent={m.heroContentChangelog()}
	buttons={false}
/>

<form
	method="POST"
	action="?/loadMore"
	id="load-more-form"
	class="hidden"
	use:enhance={() => {
		return async ({ result }) => {
			if (result.type === 'success' && result.data) {
				const actionData = result.data as {
					success: boolean;
					commits?: Commit[];
					error?: string;
				};

				if (actionData.success && Array.isArray(actionData.commits)) {
					const newCommits = actionData.commits;

					// Filter duplicates by SHA
					const existingShas = new Set(commits.map((c) => c.sha));
					const uniqueCommits = newCommits.filter((c) => !existingShas.has(c.sha));

					if (uniqueCommits.length !== newCommits.length) {
						console.warn(
							`Changelog: Filtered out ${newCommits.length - uniqueCommits.length} duplicate commits`
						);
					}

					if (uniqueCommits.length === 0) {
						hasMore = false;
					} else {
						commits = [...commits, ...uniqueCommits];
						if (uniqueCommits.length < 10) {
							hasMore = false;
						}
					}
				} else if (!actionData.success && actionData.error) {
					error = actionData.error;
				}
			} else if (result.type === 'failure' && result.data) {
				const failureData = result.data as { error?: string };
				error = failureData.error || 'Failed to load more';
			}
			loading = false;
		};
	}}
>
	<input type="hidden" name="startDate" id="start-date-input" value={currentStartDate} />
	<input type="hidden" name="endDate" id="end-date-input" value={currentEndDate} />
	<input type="hidden" name="refresh" id="refresh-input" value="false" />
</form>

<div class="max-w-fw mx-(--cubiq-app-margin) my-20 md:mx-auto">
	{#if error}
		<div class="flex min-h-[400px] items-center justify-center">
			<div class="text-center">
				<div class="font-pixel text-error text-2xl font-black">{m.changelogError()}</div>
				<p class="mt-4 text-lg">{error}</p>
			</div>
		</div>
	{:else if commits.length === 0}
		<div class="flex min-h-[400px] items-center justify-center">
			<div class="text-center">
				<div class="font-pixel text-2xl font-black">{m.changelogNoCommits()}</div>
			</div>
		</div>
	{:else}
		<div class="space-y-4">
			{#each commits as commit, i (commit.sha)}
				{@const monthKey = getMonthKey(commit.date)}
				{@const prevMonthKey = i > 0 ? getMonthKey(commits[i - 1].date) : null}
				{#if prevMonthKey !== monthKey}
					<h2 class="font-pixel text-base-content/60 mt-8 mb-4 text-lg font-black">
						{formatMonthHeader(monthKey)}
					</h2>
					{@const stat = monthStats.get(monthKey)}
					{#if stat}
						<p class="text-base-content/40 mb-3 font-mono text-xs">
							{m.changelogCommitStats({ human: stat.human, agent: stat.agent })}
						</p>
					{/if}
				{/if}
				<div class="border-base-content/20 border-l-2 py-2 pl-4">
					<div class="text-base-content/50 font-mono text-xs">{commit.sha.slice(0, 7)}</div>
					<div class="text-base-content/70 mt-1 font-mono text-xs">
						{commit.message || 'No message'}
					</div>
					<div class="text-base-content/40 mt-1 font-mono text-xs">
						<span>{commit.repo}</span>
						<span class="mx-2">•</span>
						<span>{formatDate(commit.date)}</span>
					</div>
				</div>
			{/each}
		</div>

		{#if hasMore}
			<div bind:this={loadMoreRef} class="py-8 text-center">
				{#if loading}
					<span class="loading loading-spinner loading-sm"></span>
				{:else}
					<span class="text-base-content/50 font-mono text-xs">{m.changelogLoadMore()}</span>
				{/if}
			</div>
		{:else}
			<div class="py-8 text-center">
				<span class="text-base-content/40 font-mono text-xs">{m.changelogNoMore()}</span>
			</div>
		{/if}
	{/if}
</div>
