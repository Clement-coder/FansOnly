"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { StatCard } from "@/app/components/stat-card"
import { Coins, Users, TrendingUp, Zap } from "lucide-react"
import { useAccount } from "wagmi"
import { DashboardLayout } from "@/app/components/dashboard-layout"
import { CreateCampaignModal } from "@/app/components/create-campaign-modal"

export default function CreatorDashboard() {
  const [userProfile, setUserProfile] = useState<any>(null)
  const [campaigns, setCampaigns] = useState<any[]>([]) // Initialize campaigns as an empty array
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { address: walletAddress, isConnected } = useAccount()

  const handleCreateCampaign = (campaign: any) => {
    console.log("New campaign created:", campaign)
    const newCampaign = { ...campaign, fans: 0, coins: 0, status: "Active" };
    const updatedCampaigns = [...campaigns, newCampaign];
    setCampaigns(updatedCampaigns);
    localStorage.setItem("campaigns", JSON.stringify(updatedCampaigns));
    setIsModalOpen(false)
  }

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedProfile = localStorage.getItem("userProfile")
      if (storedProfile) {
        setUserProfile(JSON.parse(storedProfile))
      }
      const storedCampaigns = localStorage.getItem("campaigns");
      if (storedCampaigns) {
        setCampaigns(JSON.parse(storedCampaigns));
      }
    }
  }, [])

  return (
    <DashboardLayout role="creator">
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Welcome back, {userProfile?.name || "Creator"}!
          </h1>
          <p className="text-muted">Here's your campaign performance overview.</p>
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
                            <p className="font-semibold text-foreground capitalize">{"creator"}</p>
                          </div>            <div className="md:col-span-2">
              <p className="text-muted">Wallet Address:</p>
              <p className="font-semibold text-foreground break-all">{walletAddress || "Not Connected"}</p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            label="Total Coins Distributed"
            value={campaigns.reduce((acc, campaign) => acc + campaign.coins, 0).toLocaleString()}
            icon={<Coins size={32} />}
            trend="No engagement yet"
          />
          <StatCard label="Active Fans" value={campaigns.reduce((acc, campaign) => acc + campaign.fans, 0).toString()} icon={<Users size={32} />} trend="No engagement yet" />
          <StatCard label="Engagement Rate" value="0%" icon={<TrendingUp size={32} />} trend="No engagement yet" />
          <StatCard label="Active Campaigns" value={campaigns.length.toString()} icon={<Zap size={32} />} trend={`${campaigns.length} campaigns running`} />
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

          {campaigns.length === 0 ? (
            <div className="text-center text-muted py-8">
              <p>No campaigns created yet. Start your first campaign to engage with your fans!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {campaigns.map((campaign, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-4 bg-secondary rounded-lg border border-border hover:border-primary transition-colors"
                >
                  <div>
                    <p className="font-semibold text-foreground">{campaign.name}</p>
                    <p className="text-sm text-muted">{campaign.description}</p>
                    <p className="text-sm text-muted mt-2">{campaign.fans} fans participating</p>
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
          )}
        </div>

        {/* Create Campaign Button */}
        <div className="card-base">
          <h3 className="text-lg font-bold text-foreground mb-4">Create New Campaign</h3>
          <p className="text-muted mb-6">Launch a new loyalty campaign to engage your fans.</p>
          <button className="btn-primary w-full" onClick={() => setIsModalOpen(true)}>
            Create New Campaign
          </button>
                </div>
              </div>
              <CreateCampaignModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onCreateCampaign={handleCreateCampaign}
              />
            </DashboardLayout>
          )
        }
        