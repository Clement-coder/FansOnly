"use client"

import { useState } from "react"
import { Menu } from "lucide-react"
import { Sidebar } from "./sidebar" // Assuming sidebar.tsx is in the same directory

interface DashboardLayoutProps {
  children: React.ReactNode
  role: "creator" | "fan" // Pass the role to the layout
}

export function DashboardLayout({ children, role }: DashboardLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar for larger screens, hidden by default on small screens */}
      <div className={`fixed inset-y-0 left-0 z-50 transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0`}>
        <Sidebar role={role} isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      </div>

      {/* Overlay for small screens when sidebar is open */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black opacity-50 lg:hidden"
          onClick={toggleSidebar}
        ></div>
      )}

      <main className="flex-1 overflow-auto">
        {/* Menu icon for small screens */}
        <div className="lg:hidden p-4">
          <Menu size={24} onClick={toggleSidebar} className="cursor-pointer text-foreground" />
        </div>
        {children}
      </main>
    </div>
  )
}