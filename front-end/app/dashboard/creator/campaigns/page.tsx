"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "@/app/components/sidebar"
import { CreateCampaignModal } from "@/app/components/create-campaign-modal"
import { DeleteCampaignModal } from "@/app/components/delete-campaign-modal"
import { Plus, Edit2, Trash2 } from "lucide-react"

export default function CreatorCampaigns() {
  const [campaigns, setCampaigns] = useState<any[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [campaignToDelete, setCampaignToDelete] = useState<any>(null)
  const [campaignToEdit, setCampaignToEdit] = useState<any>(null)
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    const storedCampaigns = localStorage.getItem("campaigns")
    if (storedCampaigns) {
      setCampaigns(JSON.parse(storedCampaigns))
    }
  }, [])

  const handleCreateCampaign = (campaign: any) => {
    const newCampaign = { ...campaign, fans: 0, coins: 0, status: "Active" }
    const updatedCampaigns = [...campaigns, newCampaign]
    setCampaigns(updatedCampaigns)
    localStorage.setItem("campaigns", JSON.stringify(updatedCampaigns))
    setIsModalOpen(false)
  }

  const openDeleteModal = (campaign: any) => {
    setCampaignToDelete(campaign)
    setIsDeleteModalOpen(true)
  }

  const handleDeleteCampaign = () => {
    if (campaignToDelete) {
      const updatedCampaigns = campaigns.filter(c => c.name !== campaignToDelete.name)
      setCampaigns(updatedCampaigns)
      localStorage.setItem("campaigns", JSON.stringify(updatedCampaigns))
      setIsDeleteModalOpen(false)
      setCampaignToDelete(null)
    }
  }

  const openEditModal = (campaign: any) => {
    setCampaignToEdit(campaign)
    setIsModalOpen(true)
  }

  const handleEditCampaign = (editedCampaign: any) => {
    const updatedCampaigns = campaigns.map(c => c.name === campaignToEdit.name ? { ...c, ...editedCampaign } : c)
    setCampaigns(updatedCampaigns)
    localStorage.setItem("campaigns", JSON.stringify(updatedCampaigns))
    setIsModalOpen(false)
    setCampaignToEdit(null)
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar role="creator" isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Campaigns</h1>
              <p className="text-muted">Manage and create your loyalty campaigns.</p>
            </div>
            <button className="btn-primary flex items-center gap-2" onClick={() => setIsModalOpen(true)}>
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
                  {campaigns.map((campaign, idx) => (
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
                        <button className="p-2 hover:bg-secondary rounded-lg transition-colors text-foreground" onClick={() => openEditModal(campaign)}>
                          <Edit2 size={18} />
                        </button>
                        <button className="p-2 hover:bg-secondary rounded-lg transition-colors text-foreground" onClick={() => openDeleteModal(campaign)}>
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
      <CreateCampaignModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setCampaignToEdit(null)
        }}
        onCreateCampaign={handleCreateCampaign}
        onEditCampaign={handleEditCampaign}
        campaign={campaignToEdit}
      />
      <DeleteCampaignModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteCampaign}
      />
    </div>
  )
}
