"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Zap, BarChart3, Settings, LogOut } from "lucide-react"

interface SidebarProps {
  role: "creator" | "fan"
}

export function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname()

  const creatorLinks = [
    { href: "/dashboard/creator", label: "Overview", icon: LayoutDashboard },
    { href: "/dashboard/creator/campaigns", label: "Campaigns", icon: Zap },
    { href: "/dashboard/creator/analytics", label: "Analytics", icon: BarChart3 },
    { href: "/dashboard/creator/settings", label: "Settings", icon: Settings },
  ]

  const fanLinks = [
    { href: "/dashboard/fan", label: "Overview", icon: LayoutDashboard },
    { href: "/dashboard/fan/rewards", label: "Rewards", icon: Zap },
    { href: "/dashboard/fan/history", label: "History", icon: BarChart3 },
    { href: "/dashboard/fan/settings", label: "Settings", icon: Settings },
  ]

  const links = role === "creator" ? creatorLinks : fanLinks

  return (
    <aside className="w-64 bg-card border-r border-border h-screen sticky top-0 flex flex-col">
      <div className="p-6 border-b border-border">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-bold">F</span>
          </div>
          <span className="font-bold text-foreground">FansOnly</span>
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {links.map((link) => {
          const Icon = link.icon
          const isActive = pathname === link.href
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                isActive ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-secondary"
              }`}
            >
              <Icon size={20} />
              <span className="font-medium">{link.label}</span>
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-border">
        <button className="flex items-center gap-3 w-full px-4 py-3 text-muted hover:text-foreground transition-colors rounded-lg hover:bg-secondary">
          <LogOut size={20} />
          <span className="font-medium">Disconnect</span>
        </button>
      </div>
    </aside>
  )
}
