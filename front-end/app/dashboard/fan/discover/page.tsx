import { DashboardLayout } from "@/app/components/dashboard-layout";

export default function FanDiscoverPage() {
  return (
    <DashboardLayout role="fan">
      <div className="p-8">
        <h1 className="text-3xl font-bold text-foreground mb-4">Discover Creators & Campaigns</h1>
        <p className="text-muted">Find new creators to support and exciting campaigns to join.</p>
        {/* Content for discovering creators and campaigns will go here */}
      </div>
    </DashboardLayout>
  );
}
