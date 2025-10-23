"use client"

import { DashboardLayout } from "@/app/components/dashboard-layout"
import { ArrowUpRight, ArrowDownLeft } from "lucide-react"

export default function FanHistory() {
  return (
    <DashboardLayout role="fan">
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Transaction History</h1>
          <p className="text-muted">View all your coin transactions and reward claims.</p>
        </div>

        {/* History Table */}
        <div className="card-base overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Type</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Description</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Amount</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Date</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    type: "Earned",
                    desc: "Engagement reward from Creator One",
                    amount: "+150",
                    date: "Dec 15, 2024",
                    status: "Completed",
                  },
                  {
                    type: "Claimed",
                    desc: "Exclusive Content Pack",
                    amount: "-500",
                    date: "Dec 14, 2024",
                    status: "Completed",
                  },
                  {
                    type: "Earned",
                    desc: "Milestone bonus",
                    amount: "+250",
                    date: "Dec 12, 2024",
                    status: "Completed",
                  },
                  {
                    type: "Earned",
                    desc: "Campaign participation",
                    amount: "+100",
                    date: "Dec 10, 2024",
                    status: "Completed",
                  },
                  {
                    type: "Claimed",
                    desc: "VIP Access Pass",
                    amount: "-1000",
                    date: "Dec 8, 2024",
                    status: "Completed",
                  },
                  {
                    type: "Earned",
                    desc: "Referral bonus",
                    amount: "+300",
                    date: "Dec 5, 2024",
                    status: "Completed",
                  },
                ].map((transaction, idx) => (
                  <tr key={idx} className="border-b border-border hover:bg-secondary transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {transaction.type === "Earned" ? (
                          <ArrowDownLeft size={18} className="text-primary" />
                        ) : (
                          <ArrowUpRight size={18} className="text-accent" />
                        )}
                        <span className="font-semibold text-foreground">{transaction.type}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-foreground">{transaction.desc}</td>
                    <td
                      className={`px-6 py-4 font-bold ${transaction.type === "Earned" ? "text-primary" : "text-accent"}`}
                    >
                      {transaction.amount}
                    </td>
                    <td className="px-6 py-4 text-muted">{transaction.date}</td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 rounded-full text-sm font-semibold bg-primary/10 text-primary">
                        {transaction.status}
                      </span>
                    </td>
                  </tr>
                )))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
