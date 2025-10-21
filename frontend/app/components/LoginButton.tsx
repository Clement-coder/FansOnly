// app/components/LoginButton.tsx
"use client";

import React from "react";
import { usePrivy } from "@privy-io/react-auth";
import { Wallet } from "lucide-react";

import { LogoutButton } from "./LogoutButton";

export function LoginButton() {
  const { login, isAuthenticated, user } = usePrivy();

  if (isAuthenticated) {
    return <LogoutButton />;
  }

  return <button               className="px-6 py-2 bg-primary text-primary-foreground  rounded-full font-medium hover:bg-primary-dark transition-all hover:shadow-md hover:scale-105 active:scale-95 flex items-center gap-2"
  onClick={() => login()}> <Wallet/> Login / Connect Wallet</button>;
}
