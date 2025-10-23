'use client'

import { useState, useEffect } from "react"
import Link from "next/link"
import { StatCard } from "@/app/components/stat-card"
import { Coins, Award, TrendingUp, Zap, User, Mail, Briefcase, Wallet, Target, Gift, CalendarDays, Tag } from "lucide-react"
import { useAccount, useReadContract } from "wagmi"
import { DashboardLayout } from "@/app/components/dashboard-layout"
import { userRegistery } from "@/abi/userRegistry"
import { contract } from "@/app/lib/config"

export default function FanDashboard() {
  const [userProfile, setUserProfile] = useState<any>(null)
  const [milestones, setMilestones] = useState<any[]>([]) // Initialize milestones as an empty array
  const [rewards, setRewards] = useState<any[]>([]) // Initialize rewards as an empty array
  const { address: walletAddress, isConnected } = useAccount()

  const { data: userData } = useReadContract({
    abi: userRegistery,
    address: contract.userRegistry as `0x${string}`,
    functionName: 'users',
    args: [walletAddress!],
    enabled: !!walletAddress,
  })

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
        <div className="mb-8 grid grid-cols-1 md:grid-cols-2 items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center">
              Welcome back, {userProfile?.name || "Fan"}! <span className="ml-2 text-4xl animate-wave">👋</span>
            </h1>
            <p className="text-muted">Track your rewards and engagement progress.</p>
          </div>
        </div>

        {/* User Information Summary */}
        <div className="card-base mb-8 p-6">
          <h2 className="text-xl font-bold text-foreground mb-4">Your Profile</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <User size={16} className="text-muted" />
              <div>
                <p className="text-muted">Name:</p>
                <p className="font-semibold text-foreground">{userProfile?.name || "N/A"}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <User size={16} className="text-muted" />
              <div>
                <p className="text-muted">Username:</p>
                <p className="font-semibold text-foreground">{userProfile?.username || "N/A"}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Mail size={16} className="text-muted" />
              <div>
                <p className="text-muted">Email:</p>
                <p className="font-semibold text-foreground">{userProfile?.email || "N/A"}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Briefcase size={16} className="text-muted" />
              <div>
                <p className="text-muted">Role:</p>
                <p className="font-semibold text-foreground capitalize">{userData ? (userData as any)[0] === 0 ? 'Fan' : 'Creator' : 'N/A'}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <CalendarDays size={16} className="text-muted" />
              <div>
                <p className="text-muted">Registered On:</p>
                <p className="font-semibold text-foreground">{userData ? new Date(Number((userData as any)[2]) * 1000).toLocaleDateString() : 'N/A'}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Tag size={16} className="text-muted" />
              <div>
                <p className="text-muted">Profile URI:</p>
                <p className="font-semibold text-foreground">{userData ? (userData as any)[3] : 'N/A'}</p>
              </div>
            </div>
            <div className="md:col-span-2 flex items-center gap-2">
              <Wallet size={16} className="text-muted" />
              <div>
                <p className="text-muted">Wallet Address:</p>
                <p className="font-semibold text-foreground break-all">{walletAddress || "Not Connected"}</p>
              </div>
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
                                            <div key={idx} className="flex items-center gap-3">
                                              <Target size={20} className="text-primary" />
                                              <div>
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
                                            </div>
                                          ))}
                                        </div>
                                      )}
                                    </div>
                                    <div class="card-base">
                    <h3 className="text-lg font-bold text-foreground mb-6">Available Rewards</h3>
                    {rewards.length === 0 ? (
                      <div className="text-center text-muted py-8">
                        <p>No rewards available yet. Keep engaging to unlock exciting rewards!</p>
                      </div>
                    ) : (
                    <div className="space-y-3">
                      {rewards.map((reward, idx) => (
                        <div
                          key={idx}
                          className={`p-4 rounded-lg border transition-all ${
                            reward.available
                              ? "bg-secondary border-border hover:border-primary"
                              : "bg-muted/10 border-border opacity-50"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Gift size={20} className="text-primary" />
                              <div>
                                <p className="font-semibold text-foreground">{reward.name}</p>
                                <p className="text-sm text-muted">{reward.coins} coins</p>
                              </div>
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
                    )}
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
                          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-primary-foreground">
                            <User size={24} />
                          </div>
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
    </DashboardLayout>
  )
}
