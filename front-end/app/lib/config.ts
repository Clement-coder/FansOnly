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

export const contract = {
  network: "base-sepolia",
  factory: "0xd867ffc06Db28aC941530292e8eA10138958cd7B",
  userRegistry: "0x1595C7674De5149b3fA266D8de9174CA9b161163",
  campaignManager: "0x85f7E37BF37067e73bf89aCD6d2473f07773BCCC",
  accessControl: "0xF0f7Cb5d9f7f1BA44cca7EA95C830FacA634be8f",
  redemptionManager: "0xBf8ff62663346A576ea5c7cC353ffb35Edc985bD",
  oracleAddress: "0x52826587cBB706d2c2D6a02CBdaeed1A93f421DB",
  pointsOracle: "0xd867ffc06Db28aC941530292e8eA10138958cd7B"
} 