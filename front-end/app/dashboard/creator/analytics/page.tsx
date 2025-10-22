"use client"

import { Sidebar } from "@/app/components/sidebar"
import { StatCard } from "@/app/components/stat-card"
import { TrendingUp, Users, Zap, BarChart3 } from "lucide-react"

export default function CreatorAnalytics() {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar role="creator" />

      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Analytics</h1>
            <p className="text-muted">Track your campaign performance and fan engagement.</p>
          </div>

          {/* Analytics Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard label="Total Engagement" value="12,456" icon={<TrendingUp size={32} />} trend="+23% this month" />
            <StatCard label="New Fans" value="234" icon={<Users size={32} />} trend="+15% this month" />
            <StatCard label="Coins Claimed" value="8,900" icon={<Zap size={32} />} trend="+18% this month" />
            <StatCard label="Avg. Engagement Rate" value="72%" icon={<BarChart3 size={32} />} trend="+8% this month" />
          </div>

          {/* Charts Placeholder */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="card-base">
              <h3 className="text-lg font-bold text-foreground mb-6">Engagement Over Time</h3>
              <div className="h-64 bg-secondary rounded-lg flex items-center justify-center">
                <p className="text-muted">Chart visualization would go here</p>
              </div>
            </div>

            <div className="card-base">
              <h3 className="text-lg font-bold text-foreground mb-6">Fan Demographics</h3>
              <div className="h-64 bg-secondary rounded-lg flex items-center justify-center">
                <p className="text-muted">Chart visualization would go here</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
