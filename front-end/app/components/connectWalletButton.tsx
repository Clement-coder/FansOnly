"use client";

import { usePrivy, useWallets } from "@privy-io/react-auth";
import { Wallet } from "lucide-react";

export function ConnectWalletButton() {
  const { login, logout, ready, authenticated, user } = usePrivy();
  const { wallets } = useWallets();

  if (!ready) return <button disabled>Loading...</button>;

  if (!authenticated) {
    return <button className="btn-primary flex items-center gap-2"  onClick={login}> <Wallet/> Connect Wallet</button>;
  }

  const wallet = wallets[0];
  return (
    <div className="flex mb-2 bg-gray-300 rounded-2xl mx-2 py-2 px-2 items-center gap-2">
      <span>{user?.email ?? wallet?.address?.slice(0, 6) + "..."}</span>
      <button className="bg-red-500 py-2 px-3 rounded-xl cursor-pointer " onClick={logout}>Disconnect</button>
    </div>
  );
}
