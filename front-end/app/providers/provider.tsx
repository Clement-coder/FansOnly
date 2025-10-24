"use client";

import React, { useEffect, useState } from 'react';
import { ThemeProvider } from 'next-themes';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PrivyProvider } from "@privy-io/react-auth";
import { createConfig, WagmiProvider } from "@privy-io/wagmi";
import { http } from "viem";
import { mainnet, sepolia, base, baseSepolia } from "viem/chains";

const queryClient = new QueryClient();

const wagmiConfig = createConfig({
  chains: [mainnet, sepolia, base, baseSepolia],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
    [base.id]: http(),
    [baseSepolia.id]: http(),
  },
});

export function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID || ''}
      config={{
        supportedChains: [mainnet, sepolia, base, baseSepolia],
        // Further Privy config if needed
      }}
    >
      <QueryClientProvider client={queryClient}>
        <WagmiProvider config={wagmiConfig}>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
            {children}
          </ThemeProvider>
        </WagmiProvider>
      </QueryClientProvider>
    </PrivyProvider>
  );
}