"use client"

import Link from "next/link"
import SmoothLink from "./SmoothLink"
import { Menu, X, Home, LayoutDashboard, Info, Mail, Rocket, Sparkles } from "lucide-react"
import { useState } from "react"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 bg-card border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 font-bold text-xl text-primary hover:text-primary-dark transition-colors"
          >
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white text-sm font-bold">
              <Sparkles size={20} />
            </div>
            FansOnly
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2 text-foreground hover:text-primary transition-colors text-sm font-medium">
              <Home size={16} />
              Home
            </Link>
            <Link
              href="/dashboard/creator"
              className="flex items-center gap-2 text-foreground hover:text-primary transition-colors text-sm font-medium"
            >
              <LayoutDashboard size={16} />
              Dashboard
            </Link>
            <SmoothLink href="#features" className="flex items-center gap-2 text-foreground hover:text-primary transition-colors text-sm font-medium">
              <Info size={16} />
              About
            </SmoothLink>
            <SmoothLink href="#contact" className="flex items-center gap-2 text-foreground hover:text-primary transition-colors text-sm font-medium">
              <Mail size={16} />
              Contact
            </SmoothLink>
          </div>

          {/* CTA Button */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              href="/onboarding"
              className="px-6 py-2 bg-primary text-primary-foreground rounded-full font-medium hover:bg-primary-dark transition-all hover:shadow-md hover:scale-105 active:scale-95 flex items-center gap-2"
            >
              <Rocket size={16} />
              Get Started
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 hover:bg-secondary rounded-lg transition-colors"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-3 border-t border-border pt-4">
            <Link href="/" className="flex items-center gap-2 block text-foreground hover:text-primary transition-colors text-sm font-medium">
              <Home size={16} />
              Home
            </Link>
            <Link
              href="/dashboard/creator"
              className="flex items-center gap-2 block text-foreground hover:text-primary transition-colors text-sm font-medium"
            >
              <LayoutDashboard size={16} />
              Dashboard
            </Link>
            <SmoothLink
              href="#features"
              className="flex items-center gap-2 block text-foreground hover:text-primary transition-colors text-sm font-medium"
            >
              <Info size={16} />
              About
            </SmoothLink>
            <SmoothLink
              href="#contact"
              className="flex items-center gap-2 block text-foreground hover:text-primary transition-colors text-sm font-medium"
            >
              <Mail size={16} />
              Contact
            </SmoothLink>
            <Link
              href="/onboarding"
              className="flex items-center gap-2 block w-full px-6 py-2 bg-primary text-primary-foreground rounded-full font-medium text-center hover:bg-primary-dark transition-all"
            >
              <Rocket size={16} />
              Get Started
            </Link>
          </div>
        )}
      </div>
    </nav>
  )
}
