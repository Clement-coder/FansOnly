import { http, createConfig } from 'wagmi'
import { base, baseSepolia, optimism } from 'wagmi/chains'
import { injected, metaMask, safe, walletConnect } from 'wagmi/connectors'

const projectId = 'cmh0g14h503wcky0d49f33uxy'

export const config = createConfig({
  chains: [baseSepolia, base],
  connectors: [
    injected(),
    walletConnect({ projectId }),
    metaMask(),
    safe(),
  ],
  transports: {
    [base.id]: http(),
    [baseSepolia.id]: http()
  },
})