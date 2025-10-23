import type { ReactNode } from "react"

interface StatCardProps {
  label: string
  value: string | number
  icon: ReactNode
  trend?: string
}

export function StatCard({ label, value, icon, trend }: StatCardProps) {
  return (
    <div className="card-base p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-muted text-sm mb-1 uppercase tracking-wider">{label}</p>
          <p className="text-3xl font-bold text-foreground">{value}</p>
        </div>
        <div className="p-3 rounded-full bg-primary/10 text-primary flex items-center justify-center">{icon}</div>
      </div>
      {trend && <p className="text-sm text-muted font-medium">{trend}</p>}
    </div>
  )
}
