"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "@/app/components/sidebar"
import { StatCard } from "@/app/components/stat-card"
import { TrendingUp, Users, Zap, BarChart3 } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function CreatorAnalytics() {
  const [campaigns, setCampaigns] = useState<any[]>([])

  useEffect(() => {
    const storedCampaigns = localStorage.getItem("campaigns")
    if (storedCampaigns) {
      setCampaigns(JSON.parse(storedCampaigns))
    }
  }, [])

  const totalCampaigns = campaigns.length
  const totalFans = campaigns.reduce((acc, campaign) => acc + campaign.fans, 0)
  const totalCoins = campaigns.reduce((acc, campaign) => acc + campaign.coins, 0)

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
            <StatCard label="Total Campaigns" value={totalCampaigns.toString()} icon={<TrendingUp size={32} />} trend="" />
            <StatCard label="Total Fans" value={totalFans.toString()} icon={<Users size={32} />} trend="" />
            <StatCard label="Total Coins Distributed" value={totalCoins.toLocaleString()} icon={<Zap size={32} />} trend="" />
            <StatCard label="Avg. Engagement Rate" value="N/A" icon={<BarChart3 size={32} />} trend="" />
          </div>

          {/* Charts Placeholder */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="card-base">
              <h3 className="text-lg font-bold text-foreground mb-6">Fans per Campaign</h3>
              <div className="h-64 bg-secondary rounded-lg">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={campaigns}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="fans" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
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
