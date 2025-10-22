import type { ReactNode } from "react"

interface StatCardProps {
  label: string
  value: string | number
  icon: ReactNode
  trend?: string
}

export function StatCard({ label, value, icon, trend }: StatCardProps) {
  return (
    <div className="card-base">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-muted text-sm mb-1">{label}</p>
          <p className="text-3xl font-bold text-foreground">{value}</p>
        </div>
        <div className="text-primary">{icon}</div>
      </div>
      {trend && <p className="text-sm text-primary font-semibold">{trend}</p>}
    </div>
  )
}
