"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowRight, UserCog, Star, CheckCircle, ArrowLeft } from "lucide-react"

export default function Onboarding() {
  const [selectedRole, setSelectedRole] = useState<"creator" | "fan" | null>(null)

  const roles = [
    {
      id: "creator",
      title: "Creator",
      description: "Build campaigns and earn rewards from your loyal fans",
      features: ["Create campaigns", "Manage rewards", "Track analytics", "Grow your community"],
      icon: <UserCog size={36} />,
    },
    {
      id: "fan",
      title: "Fan",
      description: "Support creators and earn exclusive rewards",
      features: ["Earn points", "Unlock rewards", "Support creators", "Join communities"],
      icon: <Star size={36} />,
    },
  ]

  return (
    <main className="min-h-screen bg-background py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Choose Your Role</h1>
          <p className="text-lg text-muted-foreground">Select how you want to use FansOnly</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {roles.map((role) => (
            <motion.button
              key={role.id}
              onClick={() => setSelectedRole(role.id as "creator" | "fan")}
              whileHover={{ y: -4 }}
              className={`p-8 rounded-2xl border-4 transition-all text-left ${
                selectedRole === role.id
                  ? "border-primary bg-card shadow-xl"
                  : "border-border bg-card hover:border-primary hover:shadow-md"
              }`}
            >
              <div className="text-4xl mb-4">{role.icon}</div>
              <h2 className="text-2xl font-bold text-foreground mb-2">{role.title}</h2>
              <p className="text-muted-foreground mb-6">{role.description}</p>
              <ul className="space-y-2 mb-6">
                {role.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-foreground">
                    <CheckCircle size={16} className="text-primary" />
                    {feature}
                  </li>
                ))}
              </ul>
              <div className="flex items-center gap-2 text-primary font-semibold">
                {selectedRole === role.id ? (
                  <>
                    <CheckCircle size={16} /> Selected
                  </>
                ) : (
                  <>
                    Select <ArrowRight size={16} />
                  </>
                )}
              </div>
            </motion.button>
          ))}
        </div>

        {selectedRole && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-4 justify-center"
          >
            <Link
              href={`/dashboard/${selectedRole}`}
              className="px-8 py-3 bg-primary flex items-center gap-2 group text-primary-foreground ease-in-out translate-all duration-300
 rounded-full font-semibold hover:bg-primary-dark transition-all hover:shadow-lg hover:scale-105 active:scale-95"
            >
              Continue to Dashboard <ArrowRight size={16}  className="group-hover:translate-x-3 ease-in-out translate-all duration-300
"/>
            </Link>
            <button
              onClick={() => setSelectedRole(null)}
              className="px-8 py-3 bg-card text-foreground ease-in-out translate-all duration-300
 flex items-center group gap-2  border border-border rounded-full font-semibold hover:bg-secondary transition-all"
            >
              <ArrowLeft size={16} className="group-hover:-translate-x-2 ease-in-out translate-all duration-300
"/> Back
            </button>
          </motion.div>
        )}
      </div>
    </main>
  )
}
