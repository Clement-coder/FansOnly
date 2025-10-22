"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { StatCard } from "@/app/components/stat-card"
import { Coins, Award, TrendingUp, Zap } from "lucide-react"
import { useAccount } from "wagmi"
import { DashboardLayout } from "@/app/components/dashboard-layout"

export default function FanDashboard() {
  const [userProfile, setUserProfile] = useState<any>(null)
  const [milestones, setMilestones] = useState<any[]>([]) // Initialize milestones as an empty array
  const [rewards, setRewards] = useState<any[]>([]) // Initialize rewards as an empty array
  const { address: walletAddress, isConnected } = useAccount()

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedProfile = localStorage.getItem("userProfile")
      if (storedProfile) {
        setUserProfile(JSON.parse(storedProfile))
      }
    }
  }, [])

  return (
    <DashboardLayout role="fan">
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Welcome back, {userProfile?.name || "Fan"}!
          </h1>
          <p className="text-muted">Track your rewards and engagement progress.</p>
        </div>

        {/* User Information Summary */}
        <div className="card-base mb-8 p-6">
          <h2 className="text-xl font-bold text-foreground mb-4">Your Profile</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted">Name:</p>
              <p className="font-semibold text-foreground">{userProfile?.name || "N/A"}</p>
            </div>
            <div>
              <p className="text-muted">Username:</p>
              <p className="font-semibold text-foreground">{userProfile?.username || "N/A"}</p>
            </div>
            <div>
              <p className="text-muted">Email:</p>
              <p className="font-semibold text-foreground">{userProfile?.email || "N/A"}</p>
            </div>
                          <div>
                            <p className="text-muted">Role:</p>
                            <p className="font-semibold text-foreground capitalize">{"fan"}</p>
                          </div>            <div className="md:col-span-2">
              <p className="text-muted">Wallet Address:</p>
              <p className="font-semibold text-foreground break-all">{walletAddress || "Not Connected"}</p>
            </div>
          </div>
        </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <StatCard label="Total Coins" value="0" icon={<Coins size={32} />} trend="No coins yet" />
                  <StatCard label="Rewards Claimed" value="0" icon={<Award size={32} />} trend="No rewards yet" />
                  <StatCard label="Engagement Score" value="0/10" icon={<TrendingUp size={32} />} trend="No engagement yet" />
                  <StatCard label="Active Campaigns" value="0" icon={<Zap size={32} />} trend="No campaigns yet" />
                </div>
        
                {/* Progress Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                                    <div className="card-base">
                                      <h3 className="text-lg font-bold text-foreground mb-6">Milestone Progress</h3>
                                      {milestones.length === 0 ? (
                                        <div className="text-center text-muted py-8">
                                          <p>No milestones achieved yet. Engage with creators to earn rewards!</p>
                                        </div>
                                      ) : (
                                        <div className="space-y-6">
                                          {milestones.map((milestone, idx) => (
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
                                      )}
                                    </div>
                                    <div class="card-base">
                    <h3 className="text-lg font-bold text-foreground mb-6">Available Rewards</h3>
                    {[] && ( // Replace [] with actual rewards array when available
                      <div className="text-center text-muted py-8">
                        <p>No rewards available yet. Keep engaging to unlock exciting rewards!</p>
                      </div>
                    )}
                    {/* Original reward list (commented out or removed if no rewards) */}
                    {/*
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
                    */}
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
        
                  {[] && ( // Replace [] with actual creators array when available
                    <div className="text-center text-muted py-8">
                      <p>You are not following any creators yet. Explore and find your favorites!</p>
                    </div>
                  )}
                  {/* Original following creators list (commented out or removed if no creators) */}
                  {/*
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
                  */}
                </div>
      </div>
    </DashboardLayout>
  )
}
