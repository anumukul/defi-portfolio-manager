import { http, createConfig } from 'wagmi'
import { mainnet, polygon, bsc, arbitrum } from 'wagmi/chains'

export const config = createConfig({
  chains: [mainnet, polygon, bsc, arbitrum],
  transports: {
    [mainnet.id]: http(),
    [polygon.id]: http(),
    [bsc.id]: http(),
    [arbitrum.id]: http(),
  },
})

export const SUPPORTED_CHAINS = [
  { id: 1, name: 'Ethereum', symbol: 'ETH' },
  { id: 137, name: 'Polygon', symbol: 'MATIC' },
  { id: 56, name: 'BSC', symbol: 'BNB' },
  { id: 42161, name: 'Arbitrum', symbol: 'ETH' },
]