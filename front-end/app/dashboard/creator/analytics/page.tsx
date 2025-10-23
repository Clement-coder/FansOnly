"use client";

import { useState } from "react";
import { Sidebar } from "@/app/components/sidebar";

export default function CreatorAnalyticsPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar role="creator" isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <h1 className="text-3xl font-bold mb-8">Creator Analytics</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Placeholder for analytics cards */}
            <div className="bg-card p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Total Subscribers</h2>
              <p className="text-3xl font-bold">1,234</p>
            </div>
            <div className="bg-card p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Monthly Revenue</h2>
              <p className="text-3xl font-bold">$5,678.90</p>
            </div>
            <div className="bg-card p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Engagement Rate</h2>
              <p className="text-3xl font-bold">12.3%</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
