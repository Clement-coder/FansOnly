"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Header } from "../components/header"
import { Footer } from "../components/footer"
import { Wallet, User, CheckCircle2 } from "lucide-react"

export default function OnboardingPage() {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    role: "fan",
  })
  const [isConnected, setIsConnected] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleWalletConnect = () => {
    setIsConnected(true)
    setStep(2)
  }

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setStep(3)
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Progress Indicator */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-8">
            <div className="flex flex-col items-center">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all ${
                  step >= 1 ? "bg-primary text-primary-foreground" : "bg-secondary text-muted"
                }`}
              >
                {step > 1 ? <CheckCircle2 size={24} /> : "1"}
              </div>
              <span className="text-sm mt-2 text-muted">Connect Wallet</span>
            </div>

            <div className={`flex-1 h-1 mx-4 ${step >= 2 ? "bg-primary" : "bg-secondary"}`}></div>

            <div className="flex flex-col items-center">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all ${
                  step >= 2 ? "bg-primary text-primary-foreground" : "bg-secondary text-muted"
                }`}
              >
                {step > 2 ? <CheckCircle2 size={24} /> : "2"}
              </div>
              <span className="text-sm mt-2 text-muted">Profile Setup</span>
            </div>

            <div className={`flex-1 h-1 mx-4 ${step >= 3 ? "bg-primary" : "bg-secondary"}`}></div>

            <div className="flex flex-col items-center">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all ${
                  step >= 3 ? "bg-primary text-primary-foreground" : "bg-secondary text-muted"
                }`}
              >
                3
              </div>
              <span className="text-sm mt-2 text-muted">Complete</span>
            </div>
          </div>
        </div>

        {/* Step 1: Wallet Connection */}
        {step === 1 && (
          <div className="card-base max-w-md mx-auto animate-fade-in">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Wallet size={32} className="text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-2">Connect Your Wallet</h2>
              <p className="text-muted">Link your Web3 wallet to get started on FansOnly.</p>
            </div>

            <div className="space-y-4">
              <button
                onClick={handleWalletConnect}
                className="btn-primary w-full flex items-center justify-center gap-2"
              >
                <Wallet size={20} />
                Connect MetaMask
              </button>
              <button className="btn-secondary w-full">Connect WalletConnect</button>
              <button className="btn-secondary w-full">Connect Coinbase Wallet</button>
            </div>

            <p className="text-xs text-muted text-center mt-6">
              By connecting, you agree to our Terms of Service and Privacy Policy.
            </p>
          </div>
        )}

        {/* Step 2: Profile Setup */}
        {step === 2 && (
          <div className="card-base max-w-md mx-auto animate-fade-in">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <User size={32} className="text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-2">Set Up Your Profile</h2>
              <p className="text-muted">Tell us a bit about yourself.</p>
            </div>

            <form onSubmit={handleProfileSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-foreground mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="John Doe"
                  className="w-full px-4 py-3 rounded-lg border border-border bg-input text-foreground placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                  required
                />
              </div>

              <div>
                <label htmlFor="username" className="block text-sm font-semibold text-foreground mb-2">
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  placeholder="@johndoe"
                  className="w-full px-4 py-3 rounded-lg border border-border bg-input text-foreground placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                  required
                />
              </div>

              <div>
                <label htmlFor="role" className="block text-sm font-semibold text-foreground mb-2">
                  I am a...
                </label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg border border-border bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                >
                  <option value="fan">Fan</option>
                  <option value="creator">Creator</option>
                  <option value="both">Both</option>
                </select>
              </div>

              <button type="submit" className="btn-primary w-full">
                Continue
              </button>
            </form>

            <button
              onClick={() => setStep(1)}
              className="w-full mt-4 text-muted hover:text-foreground transition-colors text-sm"
            >
              Back
            </button>
          </div>
        )}

        {/* Step 3: Completion */}
        {step === 3 && (
          <div className="card-base max-w-md mx-auto animate-fade-in text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 size={32} className="text-primary" />
            </div>

            <h2 className="text-2xl font-bold text-foreground mb-2">Welcome to FansOnly!</h2>
            <p className="text-muted mb-8">
              Your profile is all set. You're ready to start your journey in the new era of fan engagement.
            </p>

            <div className="bg-secondary rounded-lg p-4 mb-8 text-left">
              <p className="text-sm text-muted mb-2">Profile Summary</p>
              <div className="space-y-2">
                <p className="text-foreground font-semibold">{formData.name}</p>
                <p className="text-muted text-sm">{formData.username}</p>
                <p className="text-muted text-sm capitalize">Role: {formData.role}</p>
              </div>
            </div>

            <div className="space-y-3">
              <Link
                href={formData.role === "creator" ? "/dashboard/creator" : "/dashboard/fan"}
                className="btn-primary w-full block text-center"
              >
                Go to Dashboard
              </Link>
              <Link href="/" className="btn-secondary w-full block text-center">
                Back to Home
              </Link>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
