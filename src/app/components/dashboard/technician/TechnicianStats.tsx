
import {
  Wrench,
  Clock,
  CheckCircle,
  CheckCheck,
} from "lucide-react";

interface TechnicianStatsProps {
  totalServices: number;
  requestedRequests: number;
  acceptedRequests: number;
  completedJobs: number;
  loading: boolean;
}

export default function TechnicianStats({
  totalServices,
  requestedRequests,
  acceptedRequests,
  completedJobs,
  loading,
}: TechnicianStatsProps) {
  const stats = [
    {
      title: "Total Services",
      value: totalServices,
      icon: Wrench,
      color: "bg-blue-500/10 text-blue-500",
    },
    {
      title: "Requested Requests",
      value: requestedRequests,
      icon: Clock,
      color: "bg-amber-500/10 text-amber-500",
    },
    {
      title: "Accepted Requests",
      value: acceptedRequests,
      icon: CheckCircle,
      color: "bg-emerald-500/10 text-emerald-500",
    },
    {
      title: "Completed Jobs",
      value: completedJobs,
      icon: CheckCheck,
      color: "bg-purple-500/10 text-purple-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <div
            key={stat.title}
            className="rounded-2xl border border-border bg-surface p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted">
                  {stat.title}
                </p>

                {loading ? (
                  <div className="mt-3 h-9 w-16 animate-pulse rounded-lg bg-accent" />
                ) : (
                  <h3 className="mt-3 text-3xl font-bold text-foreground">
                    {stat.value}
                  </h3>
                )}
              </div>

              <div className={`rounded-xl p-3 ${stat.color}`}>
                <Icon size={24} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
