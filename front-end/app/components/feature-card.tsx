import type { ReactNode } from "react"

interface FeatureCardProps {
  icon: ReactNode
  title: string
  description: string
}

export function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="card-base">
      <div className="mb-4 text-primary">{icon}</div>
      <h3 className="font-bold text-lg mb-2 text-foreground">{title}</h3>
      <p className="text-muted text-sm">{description}</p>
    </div>
  )
}
