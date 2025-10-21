"use client"

import { motion } from "framer-motion"
import CreatorCard from "../../components/CreatorCard"
import { Zap, Gift, TrendingUp } from "lucide-react"

export default function FanDashboard() {
  const joinedCreators = [
    { name: "Alex Chen", category: "Music Producer", followers: 45000, campaigns: 8 },
    { name: "Sarah Dev", category: "Tech Educator", followers: 32000, campaigns: 5 },
  ]

  const stats = [
    { label: "Points Earned", value: "2,450", icon: Zap, color: "text-yellow-600" },
    { label: "Rewards Available", value: "8", icon: Gift, color: "text-pink-600" },
    { label: "Creators Followed", value: "12", icon: TrendingUp, color: "text-green-600" },
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
          className="mb-12"
        >
          <h1 className="text-4xl font-bold text-foreground mb-2">Fan Dashboard</h1>
          <p className="text-muted-foreground">Support your favorite creators and earn rewards</p>
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

        {/* Joined Creators */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h2 className="text-2xl font-bold text-foreground mb-6">Creators You Follow</h2>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {joinedCreators.map((creator, i) => (
              <motion.div key={i} variants={itemVariants}>
                <CreatorCard {...creator} />
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </main>
  )
}
