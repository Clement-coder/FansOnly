"use client"

import { motion } from "framer-motion"
import RewardCard from "../../../components/RewardCard"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function FanRewards() {
  const rewards = [
    {
      title: "Exclusive Content",
      description: "Access to behind-the-scenes videos",
      points: 500,
      claimed: false,
    },
    {
      title: "Meet & Greet",
      description: "Virtual meet and greet session",
      points: 1000,
      claimed: false,
    },
    {
      title: "Merchandise Pack",
      description: "Limited edition merchandise bundle",
      points: 750,
      claimed: true,
    },
    {
      title: "Early Access",
      description: "Early access to new releases",
      points: 300,
      claimed: false,
    },
    {
      title: "Custom Shoutout",
      description: "Personalized shoutout from creator",
      points: 600,
      claimed: false,
    },
    {
      title: "VIP Pass",
      description: "VIP pass to exclusive events",
      points: 1200,
      claimed: false,
    },
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
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <Link
            href="/dashboard/fan"
            className="flex items-center gap-2 text-primary hover:text-primary-dark transition-colors mb-8 font-medium"
          >
            <ArrowLeft size={20} /> Back to Dashboard
          </Link>

          <h1 className="text-4xl font-bold text-foreground mb-2">Available Rewards</h1>
          <p className="text-muted-foreground mb-8">Redeem your points for exclusive rewards</p>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {rewards.map((reward, i) => (
              <motion.div key={i} variants={itemVariants}>
                <RewardCard {...reward} />
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </main>
  )
}
