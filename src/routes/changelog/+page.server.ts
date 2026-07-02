import apiClient from '$lib/api';
import { CUBIQ_API_APP_TOKEN } from '$env/static/private';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async () => {
	const now = new Date();
	let year = now.getFullYear();
	let month = now.getMonth() + 1;
	let commits: unknown[] = [];
	let startDate = '';
	let endDate = '';
	let attempts = 0;
	const MAX_BACKTRACK = 12;
	let fetchError: string | null = null;

	while (commits.length === 0 && attempts < MAX_BACKTRACK) {
		const monthStr = String(month).padStart(2, '0');
		startDate = `${year}-${monthStr}-01`;
		const lastDay = new Date(year, month, 0).getDate();
		endDate =
			attempts === 0
				? `${year}-${monthStr}-${String(now.getDate()).padStart(2, '0')}`
				: `${year}-${monthStr}-${lastDay}`;

		try {
			const result = await apiClient.get(
				`/reports/github/commits?startDate=${startDate}&endDate=${endDate}`,
				{ Authorization: `Bearer ${CUBIQ_API_APP_TOKEN}` }
			);
			commits = result.data?.data || [];
		} catch (e) {
			console.error(`Changelog: Failed to fetch ${startDate}..${endDate}:`, e);
			if (!fetchError) fetchError = 'Failed to load commits';
		}

		if (commits.length === 0) {
			month--;
			if (month < 1) {
				month = 12;
				year--;
			}
			attempts++;
		}
	}

	return {
		commits,
		currentStartDate: startDate,
		currentEndDate: endDate,
		...(fetchError ? { error: fetchError } : {})
	};
};

export const actions: Actions = {
	loadMore: async ({ request }) => {
		const formData = await request.formData();
		const startDate = formData.get('startDate') as string;
		const endDate = formData.get('endDate') as string;
		const refresh = formData.get('refresh') === 'true';

		const params = new URLSearchParams({ startDate, endDate });
		if (refresh) params.set('refresh', 'true');

		try {
			const result = await apiClient.get(`/reports/github/commits?${params}`, {
				Authorization: `Bearer ${CUBIQ_API_APP_TOKEN}`
			});

			return { success: true, commits: result.data?.data || [] };
		} catch (e) {
			console.error('Changelog: Failed to load more commits:', e);
			return { success: false, commits: [], error: 'Failed to load more commits' };
		}
	}
};
