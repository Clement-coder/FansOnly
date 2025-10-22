"use client"

import Link from "next/link"
import { Wallet } from "lucide-react"
import { useState } from "react"
import { ConnectWalletButton } from "./connectWalletButton"

export function Header() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-background border-b border-border">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-lg">F</span>
          </div>
          <span className="font-bold text-lg text-foreground hidden sm:inline">FansOnly</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link href="/" className="text-foreground hover:text-primary transition-colors">
            Home
          </Link>
          <Link href="#features" className="text-foreground hover:text-primary transition-colors">
            Features
          </Link>
          <Link href="#creators" className="text-foreground hover:text-primary transition-colors">
            Creators
          </Link>
          <Link href="#fans" className="text-foreground hover:text-primary transition-colors">
            Fans
          </Link>
          <Link href="#about" className="text-foreground hover:text-primary transition-colors">
            About
          </Link>
        </div>

<div  className=" hidden lg:block">
    <ConnectWalletButton/>
</div>

        <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </nav>

      {isOpen && (
        <div className="md:hidden border-t border-border bg-background">
          <div className="px-4 py-4 space-y-4">
            <Link href="/" className="block text-foreground hover:text-primary">
              Home
            </Link>
            <Link href="#features" className="block text-foreground hover:text-primary">
              Features
            </Link>
            <Link href="#creators" className="block text-foreground hover:text-primary">
              Creators
            </Link>
            <Link href="#fans" className="block text-foreground hover:text-primary">
              Fans
            </Link>
            <Link href="#about" className="block text-foreground hover:text-primary">
              About
            </Link>
            <Link href="/onboarding" className="btn-primary flex items-center justify-center gap-2 w-full">
              <Wallet size={18} />
              Connect Wallet
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
