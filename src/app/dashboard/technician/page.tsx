import RecentRequests from "@/app/components/dashboard/technician/RecentRequests";
import TechnicianStats from "@/app/components/dashboard/technician/TechnicianStats";




export default function TechnicianDashboardPage() {
  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <h2 className="text-2xl font-bold text-foreground">
          Welcome back, Technician! 👋
        </h2>

        <p className="mt-2 text-sm text-muted">
          Here&apos;s what&apos;s happening with your repair services today.
        </p>
      </div>

      {/* Statistics */}
      <TechnicianStats />

      {/* Recent Requests */}
      <div className="grid grid-cols-1 gap-6">
        <RecentRequests />
      </div>
    </div>
  );
}
