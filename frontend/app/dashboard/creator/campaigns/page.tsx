"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function CreateCampaign() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    target: "",
    duration: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Campaign created:", formData)
  }

  return (
    <main className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <Link
            href="/dashboard/creator"
            className="flex items-center gap-2 text-primary hover:text-primary-dark transition-colors mb-8 font-medium"
          >
            <ArrowLeft size={20} /> Back to Dashboard
          </Link>

          <h1 className="text-4xl font-bold text-foreground mb-2">Create New Campaign</h1>
          <p className="text-muted-foreground mb-8">Set up a new loyalty campaign for your fans</p>

          <form onSubmit={handleSubmit} className="bg-card rounded-2xl border border-border p-8 space-y-6">
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">Campaign Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g., Summer Music Festival"
                className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe your campaign and what fans will get..."
                rows={4}
                className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all resize-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Target Amount ($)</label>
                <input
                  type="number"
                  name="target"
                  value={formData.target}
                  onChange={handleChange}
                  placeholder="10000"
                  className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Duration (days)</label>
                <select
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                >
                  <option value="">Select duration</option>
                  <option value="7">7 days</option>
                  <option value="14">14 days</option>
                  <option value="30">30 days</option>
                  <option value="60">60 days</option>
                </select>
              </div>
            </div>

            <div className="flex gap-4 pt-6">
              <button
                type="submit"
                className="flex-1 px-6 py-3 bg-primary text-primary-foreground rounded-full font-semibold hover:bg-primary-dark transition-all hover:shadow-lg hover:scale-105 active:scale-95"
              >
                Create Campaign
              </button>
              <Link
                href="/dashboard/creator"
                className="flex-1 px-6 py-3 bg-card text-foreground border border-border rounded-full font-semibold hover:bg-secondary transition-all text-center"
              >
                Cancel
              </Link>
            </div>
          </form>
        </motion.div>
      </div>
    </main>
  )
}
