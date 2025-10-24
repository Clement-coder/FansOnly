"use client"

import Link from "next/link"
import { Header } from "../components/header"
import { Footer } from "../components/footer"
import { FeatureCard } from "../components/feature-card"
import { Zap, Users, TrendingUp, Lock, Award, BarChart3 } from "lucide-react"


export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="animate-slide-in">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
              The New Era of Fan Engagement
            </h1>
            <p className="text-lg text-muted mb-8 leading-relaxed">
              Empower creators and reward fans with a decentralized loyalty platform built on blockchain technology.
            </p>
            <Link href="/onboarding" className="btn-primary inline-flex items-center gap-2">
              Connect Wallet
              <span>→</span>
            </Link>
          </div>

          <div className="flex items-center justify-center">
            <div className="w-full h-64 md:h-80 bg-gradient-to-br from-primary/10 to-accent/10 rounded-3xl flex items-center justify-center border border-border">
              <div className="text-center">
                <Zap size={64} className="text-primary mx-auto mb-4" />
                <p className="text-foreground font-semibold">Blockchain Powered</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="bg-secondary py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-12 text-center">How It Works</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-2xl">
                1
              </div>
              <h3 className="font-bold text-lg mb-2 text-foreground">Connect Wallet</h3>
              <p className="text-muted">Link your Web3 wallet to get started on the platform.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-2xl">
                2
              </div>
              <h3 className="font-bold text-lg mb-2 text-foreground">Create or Join</h3>
              <p className="text-muted">Creators launch campaigns, fans join to earn rewards.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-2xl">
                3
              </div>
              <h3 className="font-bold text-lg mb-2 text-foreground">Earn & Redeem</h3>
              <p className="text-muted">Accumulate coins and redeem exclusive rewards.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-12 text-center">Core Features</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <FeatureCard
            icon={<Award size={32} />}
            title="Create Campaigns"
            description="Launch loyalty campaigns with custom rewards and engagement goals."
          />
          <FeatureCard
            icon={<Users size={32} />}
            title="Reward Fans"
            description="Distribute tokens and exclusive perks to your most engaged community."
          />
          <FeatureCard
            icon={<TrendingUp size={32} />}
            title="Track Engagement"
            description="Real-time analytics on fan activity, rewards claimed, and campaign performance."
          />
          <FeatureCard
            icon={<Lock size={32} />}
            title="Unlock Access"
            description="Gate exclusive content and experiences behind loyalty tiers."
          />
        </div>
      </section>

      {/* For Creators */}
      <section id="creators" className="bg-secondary py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">For Creators</h2>
              <p className="text-lg text-muted mb-6">
                Build deeper relationships with your audience through tokenized loyalty programs.
              </p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <BarChart3 size={24} className="text-primary shrink-0 mt-1" />
                  <span className="text-foreground">Advanced analytics and insights</span>
                </li>
                <li className="flex items-start gap-3">
                  <Award size={24} className="text-primary shrink-0 mt-1" />
                  <span className="text-foreground">Customizable reward structures</span>
                </li>
                <li className="flex items-start gap-3">
                  <Users size={24} className="text-primary flex-shrink-0 mt-1" />
                  <span className="text-foreground">Direct fan engagement tools</span>
                </li>
              </ul>
              <Link href="/onboarding" className="btn-primary inline-flex">
                Start Creating
              </Link>
            </div>

            <div className="bg-card rounded-3xl p-8 border border-border shadow-sm">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted">Total Coins</span>
                  <span className="font-bold text-2xl text-primary">50,000</span>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div className="h-full w-3/4 bg-primary rounded-full"></div>
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-border">
                  <span className="text-muted">Active Fans</span>
                  <span className="font-bold text-xl text-foreground">1,234</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* For Fans */}
      <section id="fans" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="bg-card rounded-3xl p-8 border border-border shadow-sm order-2 md:order-1">
            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-muted text-sm">Coins Earned</span>
                  <span className="font-bold text-primary">2,450</span>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div className="h-full w-2/3 bg-primary rounded-full"></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-muted text-sm">Next Milestone</span>
                  <span className="font-bold text-primary">5,000</span>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div className="h-full w-1/2 bg-accent rounded-full"></div>
                </div>
              </div>
              <button className="btn-primary w-full">Claim Rewards</button>
            </div>
          </div>

          <div className="order-1 md:order-2">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">For Fans</h2>
            <p className="text-lg text-muted mb-6">
              Earn rewards by engaging with your favorite creators and unlock exclusive perks.
            </p>
            <ul className="space-y-4 mb-8">
              <li className="flex items-start gap-3">
                <Zap size={24} className="text-primary flex-shrink-0 mt-1" />
                <span className="text-foreground">Earn coins through engagement</span>
              </li>
              <li className="flex items-start gap-3">
                <Award size={24} className="text-primary flex-shrink-0 mt-1" />
                <span className="text-foreground">Unlock exclusive content and perks</span>
              </li>
              <li className="flex items-start gap-3">
                <TrendingUp size={24} className="text-primary flex-shrink-0 mt-1" />
                <span className="text-foreground">Trade and transfer rewards</span>
              </li>
            </ul>
            <Link href="/onboarding" className="btn-primary inline-flex">
              Join Now
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary text-primary-foreground py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Join the New Era of Fan Engagement</h2>
          <p className="text-lg mb-8 text-primary-foreground/90">
            Connect your wallet and start building meaningful relationships with your community today.
          </p>
          <Link
            href="/onboarding"
            className="inline-flex items-center gap-2 bg-primary-foreground text-primary hover:bg-secondary hover:text-foreground font-semibold px-8 py-4 rounded-xl transition-all duration-300"
          >
            Connect Wallet
            <span>→</span>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  )
}
