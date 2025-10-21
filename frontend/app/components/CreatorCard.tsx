"use client"

import { motion } from "framer-motion"
import { Heart, Users } from "lucide-react"

interface CreatorCardProps {
  name: string
  category: string
  followers: number
  campaigns: number
}

export default function CreatorCard({ name, category, followers, campaigns }: CreatorCardProps) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="bg-card rounded-2xl border border-border p-6 hover:shadow-lg transition-all cursor-pointer"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold text-lg">
          {name.charAt(0)}
        </div>
        <Heart size={20} className="text-muted-foreground hover:text-primary transition-colors" />
      </div>
      <h3 className="font-bold text-lg text-foreground mb-1">{name}</h3>
      <p className="text-sm text-muted-foreground mb-4">{category}</p>
      <div className="flex gap-4 text-sm">
        <div className="flex items-center gap-1 text-foreground">
          <Users size={16} className="text-primary" />
          <span>{followers.toLocaleString()} followers</span>
        </div>
        <div className="text-muted-foreground">{campaigns} campaigns</div>
      </div>
    </motion.div>
  )
}
