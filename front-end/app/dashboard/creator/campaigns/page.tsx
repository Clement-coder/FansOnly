"use client"

import { Sidebar } from "@/app/components/sidebar"
import { Plus, Edit2, Trash2 } from "lucide-react"

export default function CreatorCampaigns() {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar role="creator" />

      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Campaigns</h1>
              <p className="text-muted">Manage and create your loyalty campaigns.</p>
            </div>
            <button className="btn-primary flex items-center gap-2">
              <Plus size={20} />
              New Campaign
            </button>
          </div>

          {/* Campaigns Table */}
          <div className="card-base overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Campaign Name</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Fans</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Coins</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { name: "Summer Fan Challenge", fans: 456, coins: 15000, status: "Active" },
                    { name: "Exclusive Content Access", fans: 234, coins: 12000, status: "Active" },
                    { name: "Birthday Celebration", fans: 89, coins: 5000, status: "Ending Soon" },
                    { name: "Q1 Engagement Boost", fans: 567, coins: 25000, status: "Completed" },
                  ].map((campaign, idx) => (
                    <tr key={idx} className="border-b border-border hover:bg-secondary transition-colors">
                      <td className="px-6 py-4 font-semibold text-foreground">{campaign.name}</td>
                      <td className="px-6 py-4 text-foreground">{campaign.fans}</td>
                      <td className="px-6 py-4 text-primary font-semibold">{campaign.coins.toLocaleString()}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-semibold ${
                            campaign.status === "Active"
                              ? "bg-primary/10 text-primary"
                              : campaign.status === "Ending Soon"
                                ? "bg-accent/10 text-accent"
                                : "bg-muted/10 text-muted"
                          }`}
                        >
                          {campaign.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 flex items-center gap-2">
                        <button className="p-2 hover:bg-secondary rounded-lg transition-colors text-foreground">
                          <Edit2 size={18} />
                        </button>
                        <button className="p-2 hover:bg-secondary rounded-lg transition-colors text-foreground">
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
