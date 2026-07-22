<script lang="ts">
	import { m } from '$paraglide/messages';

	interface Commit {
		sha: string;
		repo: string;
		date: string;
		message?: string;
	}

	let { commits = [], monthKey = '' }: { commits: Commit[]; monthKey: string } = $props();

	const daysInMonth = $derived.by(() => {
		const [yearStr, monthStr] = monthKey.split('-');
		return new Date(parseInt(yearStr, 10), parseInt(monthStr, 10), 0).getDate();
	});

	const data = $derived.by(() => {
		const days = Array.from({ length: daysInMonth }, (_, i) => ({
			day: i + 1,
			agent: 0,
			human: 0
		}));

		for (const commit of commits) {
			const d = new Date(commit.date).getDate();
			const entry = days[d - 1];
			if (!entry) continue;
			if (commit.message?.startsWith('AGENT:')) {
				entry.agent++;
			} else {
				entry.human++;
			}
		}

		return days;
	});

	const maxVal = $derived.by(() => {
		const max = Math.max(1, ...data.map((d) => d.agent + d.human));
		if (max <= 5) return 5;
		if (max <= 10) return 10;
		if (max <= 20) return 20;
		return Math.ceil(max / 10) * 10;
	});

	const pad = { top: 12, right: 10, bottom: 22, left: 28 };
	const w = 800;
	const h = 130;
	const chartW = w - pad.left - pad.right;
	const chartH = h - pad.top - pad.bottom;

	const gap = $derived(chartW / data.length);
	const barW = $derived(Math.max(2, Math.min(14, gap * 0.6)));

	function barY(val: number) {
		return pad.top + chartH - (val / maxVal) * chartH;
	}
	function barHeight(val: number) {
		return (val / maxVal) * chartH;
	}

	function segPath(cx: number, yTop: number, height: number, roundTop: boolean) {
		if (height <= 0) return '';
		const x = cx - barW / 2;
		const r = roundTop ? Math.min(3, barW / 2, height) : 0;
		if (r <= 0) {
			return `M${x},${yTop} h${barW} v${height} h${-barW} Z`;
		}
		return `M${x},${yTop + height} L${x},${yTop + r} Q${x},${yTop} ${x + r},${yTop} L${x + barW - r},${yTop} Q${x + barW},${yTop} ${x + barW},${yTop + r} L${x + barW},${yTop + height} Z`;
	}

	const ticks = $derived.by(() => {
		const step = maxVal / 4;
		return [0, step, step * 2, step * 3, maxVal].map((v) => Math.round(v));
	});

	// --- Tooltip state ---
	let activeDay = $state<number | null>(null);
	let tooltipX = $state(0);
	let tooltipY = $state(0);
	let svgEl: SVGSVGElement | null = $state(null);

	const activeEntry = $derived(data.find((d) => d.day === activeDay) ?? null);

	function formatTooltipDate(day: number): string {
		const [yearStr, monthStr] = monthKey.split('-');
		const date = new Date(parseInt(yearStr, 10), parseInt(monthStr, 10) - 1, day);
		return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
	}

	function showTooltip(day: number, clientX: number, clientY: number) {
		if (!svgEl) return;
		const rect = svgEl.getBoundingClientRect();
		activeDay = day;
		tooltipX = clientX - rect.left;
		tooltipY = clientY - rect.top;
	}

	function hideTooltip() {
		activeDay = null;
	}

	function handlePointerEnter(day: number, e: PointerEvent) {
		if (e.pointerType === 'touch') return; // let click handle touch
		showTooltip(day, e.clientX, e.clientY);
	}

	function handlePointerMove(day: number, e: PointerEvent) {
		if (e.pointerType === 'touch') return;
		if (activeDay === day) {
			showTooltip(day, e.clientX, e.clientY);
		}
	}

	function handleClick(day: number, e: MouseEvent) {
		// Toggle on tap; also works fine for mouse clicks
		if (activeDay === day) {
			activeDay = null;
		} else {
			showTooltip(day, e.clientX, e.clientY);
		}
	}
	function handleKeydown(day: number, e: KeyboardEvent) {
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			if (activeDay === day) {
				activeDay = null;
			} else {
				// no pointer coords available from keyboard, so center tooltip over the bar
				activeDay = day;
				const index = data.findIndex((d) => d.day === day);
				tooltipX = pad.left + index * gap + gap / 2;
				tooltipY = pad.top;
			}
		} else if (e.key === 'Escape') {
			activeDay = null;
		}
	}
</script>

<div class="relative">
	<svg
		bind:this={svgEl}
		viewBox="0 0 {w} {h}"
		class="h-auto w-full"
		role="img"
		aria-label="Commits per day"
		onpointerleave={hideTooltip}
	>
		{#each ticks as tick (tick)}
			<line
				x1={pad.left}
				y1={barY(tick)}
				x2={w - pad.right}
				y2={barY(tick)}
				stroke="currentColor"
				class="text-base-content/10"
				stroke-width="1"
			/>
			<text
				x={pad.left - 6}
				y={barY(tick) + 3}
				text-anchor="end"
				fill="currentColor"
				class="text-base-content/40"
				font-size="9"
			>
				{tick}
			</text>
		{/each}

		{#each data as d, i (d.day)}
			{@const cx = pad.left + i * gap + gap / 2}
			{@const humanH = barHeight(d.human)}
			{@const agentH = barHeight(d.agent)}
			{@const humanY = barY(d.human)}
			{@const agentY = humanY - agentH}
			{@const total = d.human + d.agent}
			<g
				class="cursor-pointer transition-opacity"
				class:opacity-80={activeDay === d.day}
				onpointerenter={(e) => handlePointerEnter(d.day, e)}
				onpointermove={(e) => handlePointerMove(d.day, e)}
				onclick={(e) => handleClick(d.day, e)}
				role="button"
				tabindex="0"
				onkeydown={(e) => handleKeydown(d.day, e)}
			>
				<!-- invisible wider hit area so small bars/empty days are still tappable -->
				<rect x={cx - gap / 2} y={pad.top} width={gap} height={chartH} fill="transparent" />
				{#if d.human > 0}
					<path
						d={segPath(cx, humanY, humanH, d.agent === 0)}
						fill="currentColor"
						class="text-base-content/40"
					/>
				{/if}
				{#if d.agent > 0}
					<path d={segPath(cx, agentY, agentH, true)} fill="currentColor" class="text-[#F44018]" />
				{/if}
				{#if total === 0}
					<circle
						{cx}
						cy={barY(0) - 1.5}
						r="1.5"
						fill="currentColor"
						class="text-base-content/15"
					/>
				{/if}
			</g>
		{/each}

		{#each data as d, i (d.day)}
			{#if d.day === 1 || d.day % 5 === 0 || d.day === data.length}
				<text
					x={pad.left + i * gap + gap / 2}
					y={h - 6}
					text-anchor="middle"
					fill="currentColor"
					class="text-base-content/40"
					font-size="9"
				>
					{d.day}
				</text>
			{/if}
		{/each}
	</svg>

	{#if activeEntry}
		<div
			class="bg-base-100 border-base-content/10 pointer-events-none absolute z-10 rounded-md border px-2.5 py-1.5 text-xs shadow-lg"
			style="left: {tooltipX}px; top: {tooltipY}px; transform: translate(-50%, calc(-100% - 8px));"
		>
			<div class="font-mono font-semibold">{formatTooltipDate(activeEntry.day)}</div>
			<div class="mt-1 flex items-center gap-1.5">
				<span class="text-base-content/40 inline-block h-2 w-2 rounded-sm bg-current"></span>
				<span class="text-base-content/70">{m.human()}: {activeEntry.human}</span>
			</div>
			<div class="mt-0.5 flex items-center gap-1.5">
				<span class="inline-block h-2 w-2 rounded-sm bg-[#F44018]"></span>
				<span class="text-base-content/70">{m.agent()}: {activeEntry.agent}</span>
			</div>
		</div>
	{/if}
</div>
