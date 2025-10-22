"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Zap, BarChart3, Settings, LogOut, X, Compass } from "lucide-react"
import { ConnectWalletButton } from "./connectWalletButton"

interface SidebarProps {
  role: "creator" | "fan"
  isSidebarOpen: boolean
  toggleSidebar: () => void
}

export function Sidebar({ role, isSidebarOpen, toggleSidebar }: SidebarProps) {
  const pathname = usePathname()

  const creatorLinks = [
    { href: "/dashboard/creator", label: "Overview", icon: LayoutDashboard },
    { href: "/dashboard/creator/campaigns", label: "Campaigns", icon: Zap },
    { href: "/dashboard/creator/discover", label: "Discover", icon: Compass },
    { href: "/dashboard/creator/analytics", label: "Analytics", icon: BarChart3 },
    { href: "/dashboard/creator/settings", label: "Settings", icon: Settings },
  ]

  const fanLinks = [
    { href: "/dashboard/fan", label: "Overview", icon: LayoutDashboard },
    { href: "/dashboard/fan/rewards", label: "Rewards", icon: Zap },
    { href: "/dashboard/fan/discover", label: "Discover", icon: Compass },
    { href: "/dashboard/fan/history", label: "History", icon: BarChart3 },
    { href: "/dashboard/fan/settings", label: "Settings", icon: Settings },
  ]

  const links = role === "creator" ? creatorLinks : fanLinks

  return (
    <>
      {/* Backdrop for small screens when sidebar is open */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={toggleSidebar}
        ></div>
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-card border-r border-border h-screen flex flex-col transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:static`}
      >
        <div className="p-6 border-b border-border flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <img src="/FansOnly.png" alt="FansOnly Logo" className="h-12 w-auto" />
          </Link>
          <button onClick={toggleSidebar} className="lg:hidden text-muted hover:text-foreground">
            <X size={24} />
          </button>
        </div>

      <nav className="flex-1 p-4 space-y-2">
        {links.map((link) => {
          const Icon = link.icon
          const isActive = pathname === link.href
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-r-lg transition-all duration-200 ease-in-out border-l-4 ${isActive ? "bg-primary text-primary-foreground border-primary" : "text-foreground hover:bg-secondary hover:border-primary/50 border-transparent"}`}
              onClick={toggleSidebar} // Close sidebar on link click on small screens
            >
              <Icon size={20} />
              <span className="font-medium">{link.label}</span>
            </Link>
          )
        })}
      </nav>

      <div className="mt-auto p-4 border-t border-border">
        <ConnectWalletButton />
        <button className="flex items-center gap-3 px-4 py-3 rounded-lg text-foreground hover:bg-secondary transition-all duration-200 ease-in-out w-full mt-2">
          <LogOut size={20} />
          <span className="font-medium">Logout</span>
        </button>
      </div>
      </aside>
      </>
    )
  }
