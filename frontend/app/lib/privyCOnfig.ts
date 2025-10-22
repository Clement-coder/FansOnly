// app/lib/privyConfig.ts
import type { PrivyConfig } from "@privy-io/react-auth";

export const privyConfig: PrivyConfig = {
  appearance: {
    walletList: ["injected", "walletconnect"],
    showWalletLoginFirst: true,
  },
  embedded: {
    ethereum: {
      createOnLogin: "all-users",
    },
  },
  // optionally set supportedChains, defaultChain etc
};
