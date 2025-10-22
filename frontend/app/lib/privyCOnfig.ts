// app/lib/privyConfig.ts

export const privyConfig = {
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
