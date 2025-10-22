import { DashboardLayout } from "@/app/components/dashboard-layout";

export default function CreatorDiscoverPage() {
  return (
    <DashboardLayout role="creator">
      <div className="p-8">
        <h1 className="text-3xl font-bold text-foreground mb-4">Discover Campaigns</h1>
        <p className="text-muted">Explore new campaigns from other creators.</p>
        {/* Content for discovering campaigns will go here */}
      </div>
    </DashboardLayout>
  );
}
