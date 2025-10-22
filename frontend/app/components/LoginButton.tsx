// app/components/LoginButton.tsx
"use client";

import React, { useEffect } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { Wallet } from "lucide-react";
import { useRouter } from "next/navigation";
import { useDisconnect } from "wagmi";

export function LoginButton() {
  const { login, logout, ready, authenticated, user } = usePrivy();
  const router = useRouter();
  const { disconnect } = useDisconnect();

  console.log("LoginButton State:", { ready, authenticated, user });

  const handleLogout = async () => {
    disconnect();
    await logout();
  };

  if (!ready) {
    return null; // Or a loading spinner
  }

  if (authenticated && user && user.wallet) {
    const formattedAddress = `${user.wallet.address.slice(0, 6)}...${user.wallet.address.slice(-4)}`;
    return (
      <div className="flex items-center gap-2">
        <span className="text-primary-foreground text-sm font-medium">{formattedAddress}</span>
        <button
          className="px-4 py-2 bg-red-500 text-white rounded-full font-medium hover:bg-red-600 transition-all hover:shadow-md hover:scale-105 active:scale-95"
          onClick={handleLogout}
        >
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <button
      className="px-6 py-2 bg-primary text-primary-foreground  rounded-full font-medium hover:bg-primary-dark transition-all hover:shadow-md hover:scale-105 active:scale-95 flex items-center gap-2"
      onClick={() => {
        if (!authenticated) {
          login();
        }
      }}
    >
      <Wallet /> Login / Connect Wallet
    </button>
  );
}
