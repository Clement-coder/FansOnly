"use client"

import { Sidebar } from "@/app/components/sidebar"

export default function FanSettings() {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar role="fan" />

      <main className="flex-1 overflow-auto">
        <div className="p-8 max-w-2xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Settings</h1>
            <p className="text-muted">Manage your account and notification preferences.</p>
          </div>

          {/* Settings Sections */}
          <div className="space-y-6">
            <div className="card-base">
              <h3 className="text-lg font-bold text-foreground mb-4">Account Settings</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">Display Name</label>
                  <input
                    type="text"
                    defaultValue="Fan Name"
                    className="w-full px-4 py-2 rounded-lg border border-border bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">Email</label>
                  <input
                    type="email"
                    defaultValue="fan@example.com"
                    className="w-full px-4 py-2 rounded-lg border border-border bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
            </div>

            <div className="card-base">
              <h3 className="text-lg font-bold text-foreground mb-4">Notification Preferences</h3>
              <div className="space-y-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" defaultChecked className="w-4 h-4 rounded" />
                  <span className="text-foreground">Notify me of new rewards</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" defaultChecked className="w-4 h-4 rounded" />
                  <span className="text-foreground">Notify me of creator updates</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 rounded" />
                  <span className="text-foreground">Notify me of milestone achievements</span>
                </label>
              </div>
            </div>

            <div className="card-base">
              <h3 className="text-lg font-bold text-foreground mb-4">Privacy Settings</h3>
              <div className="space-y-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" defaultChecked className="w-4 h-4 rounded" />
                  <span className="text-foreground">Make my profile public</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" defaultChecked className="w-4 h-4 rounded" />
                  <span className="text-foreground">Show my engagement score</span>
                </label>
              </div>
            </div>

            <div className="card-base">
              <h3 className="text-lg font-bold text-foreground mb-4">Danger Zone</h3>
              <button className="px-6 py-2 bg-red-500/10 text-red-600 hover:bg-red-500/20 rounded-lg font-semibold transition-colors">
                Delete Account
              </button>
            </div>

            <button className="btn-primary">Save Changes</button>
          </div>
        </div>
      </main>
    </div>
  )
}
