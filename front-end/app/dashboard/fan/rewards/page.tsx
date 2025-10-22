"use client"

import { Sidebar } from "@/app/components/sidebar"
import { Gift, Lock } from "lucide-react"

export default function FanRewards() {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar role="fan" />

      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Rewards</h1>
            <p className="text-muted">Browse and claim available rewards from creators you follow.</p>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-4 mb-8 border-b border-border">
            <button className="px-4 py-3 font-semibold text-primary border-b-2 border-primary">All Rewards</button>
            <button className="px-4 py-3 font-semibold text-muted hover:text-foreground transition-colors">
              Available
            </button>
            <button className="px-4 py-3 font-semibold text-muted hover:text-foreground transition-colors">
              Claimed
            </button>
          </div>

          {/* Rewards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: "Exclusive Content Pack", creator: "Creator One", coins: 500, available: true },
              { name: "VIP Access Pass", creator: "Creator Two", coins: 1000, available: true },
              { name: "Merchandise Bundle", creator: "Creator Three", coins: 2000, available: false },
              { name: "Early Access", creator: "Creator One", coins: 750, available: true },
              { name: "Private Q&A Session", creator: "Creator Two", coins: 1500, available: false },
              { name: "Signed Poster", creator: "Creator Three", coins: 300, available: true },
            ].map((reward, idx) => (
              <div key={idx} className="card-base">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    {reward.available ? (
                      <Gift size={24} className="text-primary" />
                    ) : (
                      <Lock size={24} className="text-muted" />
                    )}
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      reward.available ? "bg-primary/10 text-primary" : "bg-muted/10 text-muted"
                    }`}
                  >
                    {reward.available ? "Available" : "Locked"}
                  </span>
                </div>

                <h3 className="font-bold text-foreground mb-1">{reward.name}</h3>
                <p className="text-sm text-muted mb-4">{reward.creator}</p>

                <div className="flex items-center justify-between">
                  <span className="font-bold text-primary">{reward.coins} coins</span>
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
      </main>
    </div>
  )
}
