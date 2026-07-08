export const AppConfig = {
	apiUrl: import.meta.env.DEV ? 'http://127.0.0.1:8085' : 'https://api.cubiq.lat',
	calendar: 'https://calendar.app.google/PFL1kPtd8VYFaXzc6',
	status: 'https://stats.uptimerobot.com/pPaLEt4eBM',
	care: {
		deviceRefreshIntervalSeconds: 30,
		preditiveSoftwareReleasesLink:
			'https://github.com/cubiq-lat/cubiq-care-monitor/releases/latest/'
	},
	toast: {
		duration: 2500
	},
	cubiq: {
		founded: '2025-11-20',
		socials: {
			whatsapp: {
				es: 'https://wa.me/59892284428',
				pt: 'https://wa.me/5511966090456',
				en: 'https://wa.me/5511966090456'
			},
			phones: {
				es: '+598 92 284 428',
				pt: '+55 11 96609-0456',
				en: '+55 11 96609-0456'
			},
			telegram: 'https://t.me/cubiq_lat',
			email: 'nicolas@cubiq.lat',
			github: 'https://github.com/minimo-io',
			huggingface: 'https://huggingface.co/cubiqlabs',
			npm: 'https://npmjs.com',
			linkedin: 'https://www.linkedin.com/in/nicolas-erramuspe/',
			nostr:
				'https://yakihonne.com/profile/nprofile1qqsz94fayf7uh4f0ewqgk0n6dehzl5anuzax796d87gshr56utyec0cmzu69t'
		},
		docs: '/docs'
	},

	dashboards: {
		care: {
			base: '/dashboard/care',
			alerts: '/dashboard/care/alerts',
			services: '/dashboard/care/services',
			device: '/dashboard/care/device/',
			actions: {
				addAgent: '/dashboard/care/add-agent',
				addDevice: '/dashboard/care/add-device'
			}
		},
		notes: {
			base: '/dashboard/notes'
		}
	}
};
