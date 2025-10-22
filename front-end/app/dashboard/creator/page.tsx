"use client"

import Link from "next/link"
import { Sidebar } from "@/app/components/sidebar"
import { StatCard } from "@/app/components/stat-card"
import { Coins, Users, TrendingUp, Zap } from "lucide-react"

export default function CreatorDashboard() {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar role="creator" />

      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Welcome back, Creator!</h1>
            <p className="text-muted">Here's your campaign performance overview.</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              label="Total Coins Distributed"
              value="50,000"
              icon={<Coins size={32} />}
              trend="+12% from last month"
            />
            <StatCard label="Active Fans" value="1,234" icon={<Users size={32} />} trend="+8% from last month" />
            <StatCard label="Engagement Rate" value="68%" icon={<TrendingUp size={32} />} trend="+5% from last month" />
            <StatCard label="Active Campaigns" value="3" icon={<Zap size={32} />} trend="2 ending soon" />
          </div>

          {/* Recent Campaigns */}
          <div className="card-base mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-foreground">Recent Campaigns</h2>
              <Link
                href="/dashboard/creator/campaigns"
                className="text-primary hover:text-accent transition-colors text-sm font-semibold"
              >
                View All →
              </Link>
            </div>

            <div className="space-y-4">
              {[
                { name: "Summer Fan Challenge", fans: 456, coins: 15000, status: "Active" },
                { name: "Exclusive Content Access", fans: 234, coins: 12000, status: "Active" },
                { name: "Birthday Celebration", fans: 89, coins: 5000, status: "Ending Soon" },
              ].map((campaign, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-4 bg-secondary rounded-lg border border-border hover:border-primary transition-colors"
                >
                  <div>
                    <p className="font-semibold text-foreground">{campaign.name}</p>
                    <p className="text-sm text-muted">{campaign.fans} fans participating</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-primary">{campaign.coins.toLocaleString()} coins</p>
                    <p
                      className={`text-sm font-semibold ${campaign.status === "Active" ? "text-primary" : "text-accent"}`}
                    >
                      {campaign.status}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card-base">
              <h3 className="text-lg font-bold text-foreground mb-4">Create New Campaign</h3>
              <p className="text-muted mb-6">Launch a new loyalty campaign to engage your fans.</p>
              <button className="btn-primary w-full">Start Campaign</button>
            </div>

            <div className="card-base">
              <h3 className="text-lg font-bold text-foreground mb-4">View Detailed Analytics</h3>
              <p className="text-muted mb-6">Get insights into fan behavior and engagement patterns.</p>
              <button className="btn-secondary w-full">View Analytics</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
