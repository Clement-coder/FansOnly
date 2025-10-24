'use client'

import { useState, useEffect } from "react"
import Link from "next/link"
import { StatCard } from "@/app/components/stat-card"
import { Coins, Users, TrendingUp, Zap, CalendarDays, Tag, AlignLeft, CircleDollarSign, Activity, Mail, Briefcase, Wallet, User } from "lucide-react"
import { useAccount, useReadContract } from "wagmi"
import { DashboardLayout } from "@/app/components/dashboard-layout"
import { CreateCampaignModal } from "@/app/components/create-campaign-modal"
import { userRegistery } from "@/app/abi/userRegistry"
import { contract } from "@/app/lib/config"

export default function CreatorDashboard() {
  const [userProfile, setUserProfile] = useState<any>(null)
  const [campaigns, setCampaigns] = useState<any[]>([]) // Initialize campaigns as an empty array
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCampaign, setEditingCampaign] = useState<any>(null) // New state for editing campaign
  const { address: walletAddress, isConnected } = useAccount()

const { data: userData } = useReadContract({
  abi: userRegistery,
  address: contract.userRegistry as `0x${string}`,
  functionName: "users",
  args: [walletAddress!],
  query: {
    enabled: !!walletAddress, // ✅ Only this
  },
});


  const handleSaveCampaign = (campaign: any) => {
    let updatedCampaigns;
    if (editingCampaign) {
      // Editing existing campaign
      updatedCampaigns = campaigns.map((c) =>
        c.name === editingCampaign.name ? { ...campaign, fans: c.fans, coins: c.coins, status: c.status } : c
      );
    } else {
      // Creating new campaign
      const newCampaign = { ...campaign, fans: 0, coins: 0, status: "Active", startDate: new Date().toISOString().split('T')[0], endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] };
      updatedCampaigns = [...campaigns, newCampaign];
    }
    setCampaigns(updatedCampaigns);
    localStorage.setItem("campaigns", JSON.stringify(updatedCampaigns));
    setIsModalOpen(false);
    setEditingCampaign(null); // Clear editing campaign after save
  }

  const handleEditCampaignClick = (campaign: any) => {
    setEditingCampaign(campaign);
    setIsModalOpen(true);
  }

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedProfile = localStorage.getItem("userProfile")
      if (storedProfile) {
        setUserProfile(JSON.parse(storedProfile))
      }
      const storedCampaigns = localStorage.getItem("campaigns");
      if (storedCampaigns) {
        const parsedCampaigns = JSON.parse(storedCampaigns).map((campaign: any) => ({
          ...campaign,
          startDate: campaign.startDate || new Date().toISOString().split('T')[0],
          endDate: campaign.endDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        }));
        setCampaigns(parsedCampaigns);
      }
    }
  }, [])

  return (
    <DashboardLayout role="creator">
      <div className="p-8">
        <div className="mb-8 grid grid-cols-1 md:grid-cols-2 items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center">
              Welcome back, {userProfile?.name || "Creator"}! <span className="ml-2 text-4xl animate-wave">👋</span>
            </h1>
            <p className="text-muted">Here's your campaign performance overview.</p>
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
                <p className="font-semibold text-foreground capitalize">{userData ? (userData as any)[0] === 1 ? 'Creator' : 'Fan' : 'N/A'}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <CalendarDays size={16} className="text-muted" />
              <div>
                <p className="text-muted">Registered On:</p>
                <p className="font-semibold text-foreground">{userData ? new Date(Number((userData as any)[2]) * 1000).toLocaleDateString() : 'N/A'}</p>
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
                    <div className="flex items-center">
                      <Tag size={16} className="mr-1 text-muted" />
                      <p className="font-semibold text-foreground">{campaign.name}</p>
                    </div>
                    <div className="flex items-center text-sm text-muted">
                      <AlignLeft size={16} className="mr-1" />
                      <p>{campaign.description}</p>
                    </div>
                    <div className="flex items-center text-sm text-muted mt-2">
                      <CalendarDays size={16} className="mr-1" />
                      <span>{campaign.startDate} - {campaign.endDate}</span>
                    </div>
                    <div className="flex items-center text-sm text-muted mt-2">
                      <Users size={16} className="mr-1" />
                      <p>{campaign.fans} fans participating</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center justify-end">
                      <CircleDollarSign size={16} className="mr-1 text-primary" />
                      <p className="font-bold text-primary">{campaign.coins.toLocaleString()} coins</p>
                    </div>
                    <div className="flex items-center justify-end mt-1">
                      <Activity size={16} className={`mr-1 ${campaign.status === "Active" ? "text-primary" : "text-accent"}`} />
                      <p
                        className={`text-sm font-semibold ${campaign.status === "Active" ? "text-primary" : "text-accent"}`}
                      >
                        {campaign.status}
                      </p>
                    </div>
                    <button
                      className="text-sm text-blue-500 hover:underline mt-2"
                      onClick={() => handleEditCampaignClick(campaign)}
                    >
                      Edit
                    </button>
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
          <button className="btn-primary w-full" onClick={() => { setEditingCampaign(null); setIsModalOpen(true); }}>
            Create New Campaign
          </button>
                </div>
              </div>
              <CreateCampaignModal
                isOpen={isModalOpen}
                onClose={() => { setIsModalOpen(false); setEditingCampaign(null); }}
                onCreateCampaign={handleSaveCampaign}
                onEditCampaign={handleSaveCampaign}
                campaign={editingCampaign}
              />
            </DashboardLayout>
          )
        }