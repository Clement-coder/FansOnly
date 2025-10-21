"use client"

import { motion } from "framer-motion"
import { Gift, Lock } from "lucide-react"

interface RewardCardProps {
  title: string
  description: string
  points: number
  claimed: boolean
  icon?: string
}

export default function RewardCard({ title, description, points, claimed }: RewardCardProps) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className={`rounded-2xl border p-6 transition-all ${
        claimed ? "bg-secondary border-border opacity-60" : "bg-card border-border hover:shadow-lg cursor-pointer"
      }`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center text-white">
          <Gift size={24} />
        </div>
        {claimed && <Lock size={20} className="text-muted-foreground" />}
      </div>
      <h3 className="font-bold text-lg text-foreground mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground mb-4">{description}</p>
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-primary">{points} points</span>
        <button
          disabled={claimed}
          className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
            claimed
              ? "bg-secondary text-muted-foreground cursor-not-allowed"
              : "bg-primary text-primary-foreground hover:bg-primary-dark hover:scale-105 active:scale-95"
          }`}
        >
          {claimed ? "Claimed" : "Claim"}
        </button>
      </div>
    </motion.div>
  )
}
