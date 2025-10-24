'use client'

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { Header } from "../../components/header"
import { Footer } from "../../components/footer"
import { Wallet, User, CheckCircle2, Briefcase, Mail, ChevronDown } from "lucide-react"
import { ConnectWalletButton } from "../../components/connectWalletButton"
import { useAccount } from "wagmi"
import { useRouter } from "next/navigation"
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi"
import { userRegistery } from '../../abi/userRegistry'
import { contract } from '../../lib/config'
import { motion } from 'framer-motion'

export default function OnboardingPage() {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    role: "fan",
    profileURI: "",
  })
  const [validationErrors, setValidationErrors] = useState<any>({})
  const { isConnected, address } = useAccount()
  const router = useRouter()
  const { data: hash, writeContract, isPending, error } = useWriteContract()

  const { isLoading: isConfirming, isSuccess: isConfirmed } = 
    useWaitForTransactionReceipt({
      hash,
    })

  useEffect(() => {
    if (isConnected) {
      setStep(2)
    }
  }, [isConnected])

  useEffect(() => {
    if (isConfirmed) {
      let finalFormData = { ...formData };
      if (formData.role === "creator") {
        finalFormData = { ...formData, role: "both" };
        setFormData(finalFormData);
      }
      localStorage.setItem("userProfile", JSON.stringify(finalFormData));
      setStep(3);
    }
  }, [isConfirmed]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors: any = {}
    if (!formData.name) newErrors.name = "Full name is required"
    if (!formData.username) newErrors.username = "Username is required"
    if (!formData.email) newErrors.email = "Email is required"
    setValidationErrors(newErrors)

    if (Object.keys(newErrors).length > 0) {
      return
    }

    // Simulate uploading to IPFS
    const profileData = { name: formData.name, username: formData.username, email: formData.email };
    const blob = new Blob([JSON.stringify(profileData)], { type: 'application/json' });
    const profileURI = ""; // Temporary: Replace with actual IPFS hash after upload
    
    const finalFormData = { ...formData, profileURI };
    setFormData(finalFormData);

    writeContract({
      abi: userRegistery,
      address: contract.userRegistry as `0x${string}`,
      functionName: 'registerUser', 
      args: [formData.role === 'fan' ? 0 : 1, profileURI ],
    })
  }

  const slideAnimation = {
    initial: { opacity: 0, x: 100 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -100 },
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        {/* Progress Indicator */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-8">
            <div className="flex flex-col items-center text-center">
              <div
                className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center font-bold text-base sm:text-lg transition-all ${
                  step >= 1 ? "bg-primary text-primary-foreground" : "bg-secondary text-muted"
                }`}
              >
                {step > 1 ? <CheckCircle2 size={20} className="sm:size-24" /> : "1"}
              </div>
              <span className="text-xs sm:text-sm mt-2 text-muted">Connect Wallet</span>
            </div>

            <div className={`flex-1 h-1 mx-2 sm:mx-4 ${step >= 2 ? "bg-primary" : "bg-secondary"}`}></div>

            <div className="flex flex-col items-center text-center">
              <div
                className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center font-bold text-base sm:text-lg transition-all ${
                  step >= 2 ? "bg-primary text-primary-foreground" : "bg-secondary text-muted"
                }`}
              >
                {step > 2 ? <CheckCircle2 size={20} className="sm:size-24" /> : "2"}
              </div>
              <span className="text-xs sm:text-sm mt-2 text-muted">Profile Setup</span>
            </div>

            <div className={`flex-1 h-1 mx-2 sm:mx-4 ${step >= 3 ? "bg-primary" : "bg-secondary"}`}></div>

            <div className="flex flex-col items-center text-center">
              <div
                className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center font-bold text-base sm:text-lg transition-all ${
                  step >= 3 ? "bg-primary text-primary-foreground" : "bg-secondary text-muted"
                }`}
              >
                3
              </div>
              <span className="text-xs sm:text-sm mt-2 text-muted">Complete</span>
            </div>
          </div>
        </div>

        {step === 1 && (
          <motion.div
            key="step1"
            initial="initial"
            animate="animate"
            exit="exit"
            variants={slideAnimation}
            className="card-base max-w-md mx-auto animate-fade-in p-4 sm:p-8"
          >
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Wallet size={32} className="text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-2">Connect Your Wallet</h2>
              <p className="text-muted">Link your Web3 wallet to get started on FansOnly.</p>
            </div>

            <div className="justify-center flex flex-col items-center">
              <div></div>
              <ConnectWalletButton />
            </div>

            <p className="text-xs text-muted text-center mt-6">
              By connecting, you agree to our Terms of Service and Privacy Policy.
            </p>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            initial="initial"
            animate="animate"
            exit="exit"
            variants={slideAnimation}
            className="card-base max-w-md mx-auto animate-fade-in p-4 sm:p-8"
          >
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
                <div className="relative">
                  <User size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="John Doe"
                    className={`w-full pl-10 pr-4 py-3 rounded-lg border bg-input text-foreground placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary transition-all ${validationErrors.name ? "border-red-500 animate-shake" : "border-border"}`}
                  />
                </div>
                {validationErrors.name && <p className="text-red-500 text-sm mt-1">{validationErrors.name}</p>}
              </div>

              <div>
                <label htmlFor="username" className="block text-sm font-semibold text-foreground mb-2">
                  Username
                </label>
                <div className="relative">
                  <User size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    placeholder="@johndoe"
                    className={`w-full pl-10 pr-4 py-3 rounded-lg border bg-input text-foreground placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary transition-all ${validationErrors.username ? "border-red-500 animate-shake" : "border-border"}`}
                  />
                </div>
                {validationErrors.username && <p className="text-red-500 text-sm mt-1">{validationErrors.username}</p>}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-foreground mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="you@example.com"
                    className={`w-full pl-10 pr-4 py-3 rounded-lg border bg-input text-foreground placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary transition-all ${validationErrors.email ? "border-red-500 animate-shake" : "border-border"}`}
                  />
                </div>
                {validationErrors.email && <p className="text-red-500 text-sm mt-1">{validationErrors.email}</p>}
              </div>

              <div className="relative">
                <label htmlFor="role" className="block text-sm font-semibold text-foreground mb-2">
                  I am a...
                </label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg border border-border bg-input text-foreground appearance-none pr-8 leading-tight focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                >
                  <option value="fan">Fan</option>
                  <option value="creator">Creator</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-muted-foreground">
                  <ChevronDown className="fill-current h-4 w-4" />
                </div>
              </div>

              <button type="submit" className="btn-primary w-full" disabled={isPending || isConfirming}>
                {isPending ? 'Confirming...' : (isConfirming ? 'Waiting for confirmation...' : 'Continue')}
              </button>
            </form>

            {hash && <div className="mt-4 text-center">Transaction Hash: {hash}</div>}
            {isConfirming && <div className="mt-4 text-center">Waiting for confirmation...</div>}
            {isConfirmed && <div className="mt-4 text-center">Transaction confirmed!</div>}
            {error && <div className="mt-4 text-center text-red-500">Error: {error.message}</div>}

            <button
              onClick={() => setStep(1)}
              className="w-full mt-4 text-muted hover:text-foreground transition-colors text-sm"
            >
              Back
            </button>
          </motion.div>
        )}

        {/* Step 3: Completion */}
        {step === 3 && (
          <motion.div
            key="step3"
            initial="initial"
            animate="animate"
            exit="exit"
            variants={slideAnimation}
            className="card-base max-w-md mx-auto animate-fade-in text-center p-4 sm:p-8"
          >
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 size={32} className="text-primary" />
            </div>

            <h2 className="text-2xl font-bold text-foreground mb-2">
              Welcome{formData.name ? `, ${formData.name}` : ""}!
            </h2>
            <p className="text-muted mb-8">
              Your profile is all set. You're ready to start your journey in the new era of fan engagement.
            </p>

            {formData.role === "fan" && (
              <div className="bg-green-100 text-green-800 p-4 rounded-lg mb-8">
                <h3 className="font-semibold mb-2">Fan Zone</h3>
                <p>Explore exclusive content, subscribe to your favorite creators, and earn rewards!</p>
                {/* Placeholder for more fan-specific info */}
              </div>
            )}

            {formData.role === "both" && (
              <div className="bg-purple-100 text-purple-800 p-4 rounded-lg mb-8">
                <h3 className="font-semibold mb-2">Creator & Fan Hub</h3>
                <p>As a creator, you can now set up your campaigns, manage subscriptions, and track your earnings. You also have access to all fan privileges!</p>
              </div>
            )}

            <div className="bg-secondary rounded-lg p-6 mb-8 text-left shadow-inner">
              <p className="text-lg font-bold text-foreground mb-4">Profile Summary</p>
              <div className="space-y-3">
                <div className="flex items-center">
                  <User size={20} className="text-primary mr-3" />
                  <div>
                    <p className="text-muted text-sm">Full Name</p>
                    <p className="text-foreground font-semibold">{formData.name}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <User size={20} className="text-primary mr-3" /> {/* Consider a more specific icon for username if available */}
                  <div>
                    <p className="text-muted text-sm">Username</p>
                    <p className="text-foreground font-semibold">{formData.username}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Mail size={20}/>
                  <div>
                    <p className="text-muted text-sm">Email</p>
                    <p className="text-foreground font-semibold">{formData.email}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Briefcase size={20} className="text-primary mr-3" />
                  <div>
                    <p className="text-muted text-sm">Role</p>
                    <p className="text-foreground font-semibold capitalize">{formData.role}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Link
                href={formData.role === "both" ? "/dashboard/creator" : "/dashboard/fan"}
                className="btn-primary w-full block text-center"
              >
                Go to Dashboard
              </Link>
              <Link href="/" className="btn-secondary w-full block text-center">
                Back to Home
              </Link>
            </div>
          </motion.div>
        )}
      </main>

      <Footer />
    </div>
  )
}
