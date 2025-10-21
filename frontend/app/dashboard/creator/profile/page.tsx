"use client"

import type React from "react"

import { motion } from "framer-motion"
import { ArrowLeft, Mail, Globe } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function CreatorProfile() {
  const [profile, setProfile] = useState({
    name: "Alex Chen",
    email: "alex@example.com",
    bio: "Music producer and content creator",
    website: "https://alexchen.com",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setProfile((prev) => ({ ...prev, [name]: value }))
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

          <h1 className="text-4xl font-bold text-foreground mb-2">Profile Settings</h1>
          <p className="text-muted-foreground mb-8">Manage your creator profile</p>

          <div className="bg-card rounded-2xl border border-border p-8 space-y-6">
            <div className="flex items-center gap-6 pb-6 border-b border-border">
              <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center text-white text-3xl font-bold">
                {profile.name.charAt(0)}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground">{profile.name}</h2>
                <p className="text-muted-foreground">Creator Profile</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">Full Name</label>
              <input
                type="text"
                name="name"
                value={profile.name}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                <Mail size={16} /> Email
              </label>
              <input
                type="email"
                name="email"
                value={profile.email}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">Bio</label>
              <textarea
                name="bio"
                value={profile.bio}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                <Globe size={16} /> Website
              </label>
              <input
                type="url"
                name="website"
                value={profile.website}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
              />
            </div>

            <div className="flex gap-4 pt-6">
              <button className="flex-1 px-6 py-3 bg-primary text-primary-foreground rounded-full font-semibold hover:bg-primary-dark transition-all hover:shadow-lg hover:scale-105 active:scale-95">
                Save Changes
              </button>
              <Link
                href="/dashboard/creator"
                className="flex-1 px-6 py-3 bg-card text-foreground border border-border rounded-full font-semibold hover:bg-secondary transition-all text-center"
              >
                Cancel
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  )
}
