"use client"

import { useState, useEffect } from "react"
import { FileText, BookText, CircleDollarSign, Calendar } from "lucide-react"

export function CreateCampaignModal({ isOpen, onClose, onCreateCampaign, onEditCampaign, campaign }: { isOpen: boolean, onClose: () => void, onCreateCampaign: (campaign: any) => void, onEditCampaign: (campaign: any) => void, campaign: any }) {
  const [campaignName, setCampaignName] = useState("")
  const [campaignDescription, setCampaignDescription] = useState("")
  const [campaignGoal, setCampaignGoal] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [errors, setErrors] = useState<any>({})

  const isEditMode = campaign != null

  useEffect(() => {
    if (isEditMode) {
      setCampaignName(campaign.name)
      setCampaignDescription(campaign.description)
      setCampaignGoal(campaign.goal)
      setStartDate(campaign.startDate)
      setEndDate(campaign.endDate)
    } else {
      setCampaignName("")
      setCampaignDescription("")
      setCampaignGoal("")
      setStartDate("")
      setEndDate("")
    }
  }, [campaign, isEditMode])

  const validateForm = () => {
    const newErrors: any = {}
    if (!campaignName) newErrors.campaignName = "Campaign name is required"
    if (!campaignDescription) newErrors.campaignDescription = "Campaign description is required"
    if (!campaignGoal) newErrors.campaignGoal = "Campaign goal is required"
    if (!startDate) newErrors.startDate = "Start date is required"
    if (!endDate) newErrors.endDate = "End date is required"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (validateForm()) {
      const campaignData = {
        name: campaignName,
        description: campaignDescription,
        goal: campaignGoal,
        startDate,
        endDate,
      }
      if (isEditMode) {
        onEditCampaign(campaignData)
      } else {
        onCreateCampaign(campaignData)
      }
    }
  }

  if (!isOpen) {
    return null
  }

  return (
    <div className="fixed inset-0 bg-black/20 bg-opacity-50 backdrop-blur-sm flex items-center justify-center">
      <div className="bg-card rounded-2xl p-8 shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-foreground mb-6">{isEditMode ? "Edit Campaign" : "Create New Campaign"}</h2>
        <div className="grid grid-cols-1 gap-6">
          <div>
            <div className="relative">
              <FileText size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
              <input
                type="text"
                placeholder="Campaign Name"
                className={`w-full pl-10 pr-4 py-3 bg-input border rounded-lg focus:ring-primary focus:border-primary ${errors.campaignName ? 'border-red-500 animate-shake' : 'border-border'}`}
                value={campaignName}
                onChange={(e) => setCampaignName(e.target.value)}
              />
            </div>
            {errors.campaignName && <p className="text-red-500 text-sm mt-1">{errors.campaignName}</p>}
          </div>
          <div>
            <div className="relative">
              <BookText size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
              <textarea
                placeholder="Campaign Description"
                className={`w-full pl-10 pr-4 py-3 bg-input border rounded-lg focus:ring-primary focus:border-primary h-24 resize-none ${errors.campaignDescription ? 'border-red-500 animate-shake' : 'border-border'}`}
                value={campaignDescription}
                onChange={(e) => setCampaignDescription(e.target.value)}
              />
            </div>
            {errors.campaignDescription && <p className="text-red-500 text-sm mt-1">{errors.campaignDescription}</p>}
          </div>
          <div>
            <div className="relative">
              <CircleDollarSign size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
              <input
                type="number"
                placeholder="Campaign Goal (in ETH)"
                className={`w-full pl-10 pr-4 py-3 bg-input border rounded-lg focus:ring-primary focus:border-primary ${errors.campaignGoal ? 'border-red-500 animate-shake' : 'border-border'}`}
                value={campaignGoal}
                onChange={(e) => setCampaignGoal(e.target.value)}
              />
            </div>
            {errors.campaignGoal && <p className="text-red-500 text-sm mt-1">{errors.campaignGoal}</p>}
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <div className="relative">
                <Calendar size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                <input
                  type="date"
                  placeholder="Start Date"
                  className={`w-full pl-10 pr-4 py-3 bg-input border rounded-lg focus:ring-primary focus:border-primary ${errors.startDate ? 'border-red-500 animate-shake' : 'border-border'}`}
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              {errors.startDate && <p className="text-red-500 text-sm mt-1">{errors.startDate}</p>}
            </div>
            <div>
              <div className="relative">
                <Calendar size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                <input
                  type="date"
                  placeholder="End Date"
                  className={`w-full pl-10 pr-4 py-3 bg-input border rounded-lg focus:ring-primary focus:border-primary ${errors.endDate ? 'border-red-500 animate-shake' : 'border-border'}`}
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
              {errors.endDate && <p className="text-red-500 text-sm mt-1">{errors.endDate}</p>}
            </div>
          </div>
        </div>
        <div className="flex justify-end mt-8">
          <button className="btn-secondary mr-4" onClick={onClose}>
            Cancel
          </button>
          <button className="btn-primary" onClick={handleSubmit}>
            {isEditMode ? "Save Changes" : "Create Campaign"}
          </button>
        </div>
      </div>
    </div>
  )
}