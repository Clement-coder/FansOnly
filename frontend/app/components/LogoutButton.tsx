// app/components/LogoutButton.tsx
"use client";

import React from "react";
import { usePrivy } from "@privy-io/react-auth";
import { useDisconnect } from "wagmi";

export function LogoutButton() {
  const { logout } = usePrivy();
  const { disconnect } = useDisconnect();

  const handleLogout = async () => {
    // Attempt to disconnect via wagmi (shim for injected)  
    disconnect();
    await logout();
  };

  return <button className="px-6 py-2 bg-primary text-primary-foreground  rounded-full font-medium hover:bg-primary-dark transition-all hover:shadow-md hover:scale-105 active:scale-95 flex items-center gap-2"  onClick={handleLogout}>Logout</button>;
}
