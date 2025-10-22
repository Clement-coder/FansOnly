"use client";

import React from "react";
import { motion } from "framer-motion";
import { Users, DollarSign, Rocket } from "lucide-react";
import Link from "next/link";
import { CampaignCard } from "../../components/CampaignCard"; // Assuming this component will be created

export default function CreatorDashboardPage() {
  const stats = [
    { label: "Total Fans", value: "12,345", icon: <Users size={20} /> },
    { label: "Coin Balance", value: "50,000 FANX", icon: <DollarSign size={20} /> },
    { label: "Active Campaigns", value: "3", icon: <Rocket size={20} /> },
  ];

  const campaigns = [
    { id: "1", title: "Summer Exclusive Content", description: "Access behind-the-scenes content and early releases.", progress: 75 },
    { id: "2", title: "Community Q&A Session", description: "Join a live Q&A with me and other top fans.", progress: 50 },
    { id: "3", title: "Limited Edition Merch Drop", description: "Get your hands on exclusive, signed merchandise.", progress: 25 },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto"
      >
        <h1 className="text-4xl font-bold text-foreground mb-8">Creator Dashboard</h1>

        {/* Stats Header */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
        >
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              variants={itemVariants}
              className="p-6 bg-card rounded-2xl shadow-lg border border-border flex items-center gap-4"
            >
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white">
                {stat.icon}
              </div>
              <div>
                <p className="text-muted-foreground text-sm">{stat.label}</p>
                <h2 className="text-2xl font-bold text-foreground">{stat.value}</h2>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Campaigns Section */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-foreground">My Campaigns</h2>
          <Link
            href="/dashboard/creator/campaigns/new"
            className="px-6 py-2 bg-primary text-primary-foreground rounded-full font-semibold hover:bg-primary-dark transition-all hover:shadow-lg hover:scale-105 active:scale-95 flex items-center gap-2"
          >
            <Rocket size={20} /> Create Campaign
          </Link>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {campaigns.map((campaign, i) => (
            <motion.div key={campaign.id} variants={itemVariants}>
              <CampaignCard {...campaign} />
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}
