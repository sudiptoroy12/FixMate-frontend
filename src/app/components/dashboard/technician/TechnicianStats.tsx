
import {
  Wrench,
  Clock,
  CheckCircle,
  CheckCheck,
} from "lucide-react";

const stats = [
  {
    title: "Total Services",
    value: "12",
    icon: Wrench,
    color: "bg-blue-500/10 text-blue-500",
  },
  {
    title: "Pending Requests",
    value: "05",
    icon: Clock,
    color: "bg-amber-500/10 text-amber-500",
  },
  {
    title: "Accepted Requests",
    value: "18",
    icon: CheckCircle,
    color: "bg-emerald-500/10 text-emerald-500",
  },
  {
    title: "Completed Jobs",
    value: "32",
    icon: CheckCheck,
    color: "bg-purple-500/10 text-purple-500",
  },
];

export default function TechnicianStats() {
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

                <h3 className="mt-3 text-3xl font-bold text-foreground">
                  {stat.value}
                </h3>
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
