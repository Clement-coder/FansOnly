"use client"

import Link from "next/link"
import { Sidebar } from "@/app/components/sidebar"
import { StatCard } from "@/app/components/stat-card"
import { Coins, Award, TrendingUp, Zap } from "lucide-react"

export default function FanDashboard() {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar role="fan" />

      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Welcome back, Fan!</h1>
            <p className="text-muted">Track your rewards and engagement progress.</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard label="Total Coins" value="2,450" icon={<Coins size={32} />} trend="+340 this month" />
            <StatCard label="Rewards Claimed" value="12" icon={<Award size={32} />} trend="3 available now" />
            <StatCard label="Engagement Score" value="8.5/10" icon={<TrendingUp size={32} />} trend="+1.2 this month" />
            <StatCard label="Active Campaigns" value="5" icon={<Zap size={32} />} trend="2 ending soon" />
          </div>

          {/* Progress Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="card-base">
              <h3 className="text-lg font-bold text-foreground mb-6">Milestone Progress</h3>
              <div className="space-y-6">
                {[
                  { name: "Bronze Member", current: 2450, target: 5000, icon: "🥉" },
                  { name: "Silver Member", current: 0, target: 10000, icon: "🥈" },
                  { name: "Gold Member", current: 0, target: 25000, icon: "🥇" },
                ].map((milestone, idx) => (
                  <div key={idx}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-foreground">{milestone.name}</span>
                      <span className="text-sm text-muted">
                        {milestone.current} / {milestone.target}
                      </span>
                    </div>
                    <div className="h-3 bg-secondary rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all"
                        style={{ width: `${(milestone.current / milestone.target) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card-base">
              <h3 className="text-lg font-bold text-foreground mb-6">Available Rewards</h3>
              <div className="space-y-3">
                {[
                  { name: "Exclusive Content Pack", coins: 500, available: true },
                  { name: "VIP Access Pass", coins: 1000, available: true },
                  { name: "Merchandise Bundle", coins: 2000, available: false },
                ].map((reward, idx) => (
                  <div
                    key={idx}
                    className={`p-4 rounded-lg border transition-all ${
                      reward.available
                        ? "bg-secondary border-border hover:border-primary"
                        : "bg-muted/10 border-border opacity-50"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-foreground">{reward.name}</p>
                        <p className="text-sm text-muted">{reward.coins} coins</p>
                      </div>
                      <button
                        disabled={!reward.available}
                        className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                          reward.available
                            ? "bg-primary text-primary-foreground hover:bg-accent"
                            : "bg-muted text-muted-foreground cursor-not-allowed"
                        }`}
                      >
                        {reward.available ? "Claim" : "Locked"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Following Creators */}
          <div className="card-base">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-foreground">Following Creators</h2>
              <Link
                href="/dashboard/fan/rewards"
                className="text-primary hover:text-accent transition-colors text-sm font-semibold"
              >
                View All →
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { name: "Creator One", followers: "12.5K", coins: 450 },
                { name: "Creator Two", followers: "8.2K", coins: 320 },
                { name: "Creator Three", followers: "5.1K", coins: 180 },
              ].map((creator, idx) => (
                <div
                  key={idx}
                  className="p-4 bg-secondary rounded-lg border border-border hover:border-primary transition-colors"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 bg-primary rounded-full"></div>
                    <button className="text-muted hover:text-foreground transition-colors">✕</button>
                  </div>
                  <p className="font-semibold text-foreground mb-1">{creator.name}</p>
                  <p className="text-sm text-muted mb-3">{creator.followers} followers</p>
                  <p className="text-primary font-semibold">{creator.coins} coins earned</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
