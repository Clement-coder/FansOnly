"use client"

import { motion } from "framer-motion"
import { Calendar } from "lucide-react"

export interface CampaignCardProps {
  title: string
  description: string
  progress: number
  target: number
  daysLeft: number
  status: "active" | "completed" | "draft"
}

export default function CampaignCard({ title, description, progress, target, daysLeft, status }: CampaignCardProps) {
  const progressPercent = (progress / target) * 100

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="bg-card rounded-2xl border border-border p-6 hover:shadow-lg transition-all"
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-bold text-lg text-foreground mb-1">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${
            status === "active"
              ? "bg-green-100 text-green-700"
              : status === "completed"
                ? "bg-blue-100 text-blue-700"
                : "bg-gray-100 text-gray-700"
          }`}
        >
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      </div>

      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-foreground">
            ${progress.toLocaleString()} / ${target.toLocaleString()}
          </span>
          <span className="text-sm text-muted-foreground">{Math.round(progressPercent)}%</span>
        </div>
        <div className="w-full bg-secondary rounded-full h-2">
          <div
            className="bg-primary rounded-full h-2 transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Calendar size={16} />
        <span>{daysLeft} days left</span>
      </div>
    </motion.div>
  )
}
