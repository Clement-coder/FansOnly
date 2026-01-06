"use client";

import { Wallet } from "lucide-react";

export function ConnectWalletButton() {
  const handleClick = () => {
    alert("Wallet connection temporarily disabled");
  };

  return (
    <button 
      className="btn-primary flex items-center gap-2" 
      onClick={handleClick}
    >
      <Wallet /> Connect Wallet
    </button>
  );
}