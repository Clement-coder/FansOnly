"use client"

import { motion } from "framer-motion"
import CampaignCard, { CampaignCardProps } from "../../components/CampaignCard"
import { Plus, TrendingUp, Users, DollarSign } from "lucide-react"
import Link from "next/link"

export default function CreatorDashboard() {
  const campaigns: CampaignCardProps[] = [
    {
      title: "Summer Music Festival",
      description: "Exclusive access to my new album release party",
      progress: 7500,
      target: 10000,
      daysLeft: 12,
      status: "active",
    },
    {
      title: "VIP Backstage Passes",
      description: "Get a chance to meet me backstage after the show",
      progress: 25000,
      target: 25000,
      daysLeft: 0,
      status: "completed",
    },
    {
      title: "New Album Pre-Release",
      description: "Early access to my new album before anyone else",
      progress: 0,
      target: 5000,
      daysLeft: 30,
      status: "draft",
    },
  ]

  const stats = [
    { label: "Total Revenue", value: "$45,231", icon: DollarSign, color: "text-green-600" },
    { label: "Followers", value: "45,000", icon: Users, color: "text-blue-600" },
    { label: "Engagement Rate", value: "12.5%", icon: TrendingUp, color: "text-pink-600" },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  }

  return (
    <main className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12"
        >
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">Creator Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, Alex!</p>
          </div>
          <Link
            href="/dashboard/creator/campaigns"
            className="mt-4 md:mt-0 px-6 py-3 bg-primary text-primary-foreground rounded-full font-semibold hover:bg-primary-dark transition-all hover:shadow-lg hover:scale-105 active:scale-95 flex items-center gap-2"
          >
            <Plus size={20} /> Create Campaign
          </Link>
        </motion.div>

        {/* Stats */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
        >
          {stats.map((stat, i) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={i}
                variants={itemVariants}
                className="bg-card rounded-2xl border border-border p-6 hover:shadow-lg transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-muted-foreground text-sm mb-1">{stat.label}</p>
                    <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                  </div>
                  <Icon size={24} className={stat.color} />
                </div>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Campaigns */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h2 className="text-2xl font-bold text-foreground mb-6">Your Campaigns</h2>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {campaigns.map((campaign, i) => (
              <motion.div key={i} variants={itemVariants}>
                <CampaignCard {...campaign} />
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </main>
  )
}