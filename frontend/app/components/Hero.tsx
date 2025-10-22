"use client"

import { LoginButton } from "./LoginButton";
import { motion } from "framer-motion"
import { ArrowRight, Zap } from "lucide-react"
import Link from "next/link"

export default function Hero() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" as const },
    },
  }

  return (
    <section className="min-h-screen bg-gradient-to-b from-background to-secondary flex items-center justify-center px-4 py-20">
      <motion.div
        className="max-w-4xl mx-auto text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          variants={itemVariants}
          className="mb-6 inline-flex items-center gap-2 px-4 py-2 bg-card rounded-full border border-border"
        >
          <Zap size={16} className="text-primary" />
          <span className="text-sm font-medium text-foreground">Welcome to the future of loyalty</span>
        </motion.div>

        <motion.h1
          variants={itemVariants}
          className="text-5xl md:text-7xl font-bold text-foreground mb-6 leading-tight"
        >
          Connect with Your <span className="text-primary">Fans</span> Like Never Before
        </motion.h1>

        <motion.p variants={itemVariants} className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Build lasting loyalty through decentralized rewards. Creators earn, fans engage, and everyone wins.
        </motion.p>

        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <LoginButton />
          <Link
            href="#features"
            className="px-8 py-3 bg-card text-foreground border border-border rounded-full font-semibold hover:bg-secondary transition-all hover:shadow-md"
          >
            Learn More
          </Link>
        </motion.div>

        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
          {[
            { label: "10K+", desc: "Active Creators" },
            { label: "50K+", desc: "Engaged Fans" },
            { label: "$2M+", desc: "Rewards Distributed" },
          ].map((stat, i) => (
            <div key={i} className="p-6 bg-card rounded-2xl border border-border hover:shadow-md transition-all">
              <div className="text-3xl font-bold text-primary mb-2">{stat.label}</div>
              <div className="text-muted-foreground text-sm">{stat.desc}</div>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  )
}
