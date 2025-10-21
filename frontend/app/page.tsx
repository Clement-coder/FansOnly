"use client"

import Hero from "./components/Hero"
import CreatorCard from "./components/CreatorCard"
import { motion } from "framer-motion"
import { Users, Sparkles, Gem, Rocket, Handshake, BarChart, ShieldCheck, Smartphone } from "lucide-react"

export default function Home() {
  const creators = [
    { name: "Alex Chen", category: "Music Producer", followers: 45000, campaigns: 8 },
    { name: "Sarah Dev", category: "Tech Educator", followers: 32000, campaigns: 5 },
    { name: "Mike Art", category: "Digital Artist", followers: 28000, campaigns: 6 },
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
    <main>
      <Hero />

      {/* Featured Creators Section */}
      <section id="features" className="py-20 px-4 bg-background">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4 flex items-center justify-center gap-3">
              <Users size={40} /> Featured Creators
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Join thousands of creators building meaningful connections with their audience
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {creators.map((creator, i) => (
              <motion.div key={i} variants={itemVariants}>
                <CreatorCard {...creator} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-card border-t border-border">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4 flex items-center justify-center gap-3">
              <Sparkles size={40} /> Why Choose FansOnly?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything you need to build and manage your fan community
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {[
              { title: "Decentralized Rewards", desc: "Transparent, blockchain-based reward system" },
              { title: "Easy Campaigns", desc: "Create and manage loyalty campaigns in minutes" },
              { title: "Fan Engagement", desc: "Build deeper connections with your audience" },
              { title: "Analytics", desc: "Track performance and optimize your strategy" },
              { title: "Secure Transactions", desc: "Enterprise-grade security for all transactions" },
              { title: "Multi-Platform", desc: "Seamless experience across all devices" },
            ].map((feature, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                className="p-6 bg-background rounded-2xl border border-border hover:shadow-lg transition-all"
              >
                <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center text-white mb-4">
                  {(() => {
                    switch (feature.title) {
                      case "Decentralized Rewards":
                        return <Gem size={24} />
                      case "Easy Campaigns":
                        return <Rocket size={24} />
                      case "Fan Engagement":
                        return <Handshake size={24} />
                      case "Analytics":
                        return <BarChart size={24} />
                      case "Secure Transactions":
                        return <ShieldCheck size={24} />
                      case "Multi-Platform":
                        return <Smartphone size={24} />
                      default:
                        return <span className="text-xl font-bold">{i + 1}</span>
                    }
                  })()}
                </div>
                <h3 className="font-bold text-lg text-foreground mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="contact" className="py-20 px-4 bg-primary text-primary-foreground">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Transform Your Fan Community?</h2>
          <p className="text-lg mb-8 opacity-90">Start building loyalty today with FansOnly</p>
          <a
            href="/onboarding"
            className="inline-flex items-center gap-2 px-8 py-3 bg-primary-foreground text-primary rounded-full font-semibold hover:shadow-lg transition-all hover:scale-105 active:scale-95"
          >
            <Rocket size={20} />
            Get Started Now
          </a>
        </motion.div>
      </section>
    </main>
  )
}