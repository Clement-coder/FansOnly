"use client";

import React from "react";
import { motion } from "framer-motion";
import { Rocket, TrendingUp } from "lucide-react";

interface CampaignCardProps {
  id: string;
  title: string;
  description: string;
  progress: number; // Percentage
}

export function CampaignCard({ id, title, description, progress }: CampaignCardProps) {
  return (
    <motion.div
      className="p-6 bg-card rounded-2xl shadow-lg border border-border cursor-pointer"
      whileHover={{ scale: 1.02, boxShadow: "0 0 15px rgba(139, 92, 246, 0.5)" }} // Glow shadow
      transition={{ duration: 0.2 }}
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white">
          <Rocket size={20} />
        </div>
        <h3 className="text-xl font-bold text-foreground">{title}</h3>
      </div>
      <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{description}</p>

      {/* Progress Bar */}
      <div className="w-full bg-secondary rounded-full h-2.5 mb-2">
        <motion.div
          className="bg-primary h-2.5 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        ></motion.div>
      </div>
      <p className="text-right text-xs text-muted-foreground">{progress}% Complete</p>
    </motion.div>
  );
}