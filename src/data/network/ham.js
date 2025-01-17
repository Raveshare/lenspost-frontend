import { defineChain } from '@reown/appkit/networks'

export const ham = defineChain({
	id: 5112,
	name: 'Ham',
	nativeCurrency: {
		decimals: 18,
		name: 'Ether',
		symbol: 'ETH',
	},
	rpcUrls: {
		default: {
			http: ['https://ham.calderachain.xyz/http'],
		},
		public: {
			http: ['https://ham.calderachain.xyz/http'],
		},
	},
	blockExplorers: {
		default: { name: 'Explorer', url: 'https://ham.calderaexplorer.xyz' },
	},
})
