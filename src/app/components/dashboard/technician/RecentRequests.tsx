
import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";

const requests = [
  {
    id: 1,
    customer: "Rahim Ahmed",
    service: "Mobile Screen Replacement",
    date: "Nov 18, 2026",
    status: "Pending",
  },
  {
    id: 2,
    customer: "Karim Hasan",
    service: "Laptop Repair",
    date: "Nov 17, 2026",
    status: "Accepted",
  },
  {
    id: 3,
    customer: "Sakib Hossain",
    service: "Computer Troubleshooting",
    date: "Nov 16, 2026",
    status: "Completed",
  },
];

const statusStyles: Record<string, string> = {
  Pending: "bg-amber-500/10 text-amber-600",
  Accepted: "bg-blue-500/10 text-blue-600",
  Completed: "bg-emerald-500/10 text-emerald-600",
};

export default function RecentRequests() {
  return (
    <section className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
      <div className="mb-6 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-foreground">
            Recent Requests
          </h2>
          <p className="mt-1 text-sm text-muted">
            Latest customer service requests
          </p>
        </div>

        <Link
          href="/dashboard/technician/requests"
          className="flex shrink-0 items-center gap-1 text-sm font-semibold text-primary hover:underline"
        >
          View All <ArrowRight size={16} />
        </Link>
      </div>

      <div className="space-y-4">
        {requests.map((request) => (
          <div
            key={request.id}
            className="flex flex-col gap-3 border-b border-border pb-4 last:border-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <h3 className="font-semibold text-foreground">
                {request.service}
              </h3>

              <p className="mt-1 text-sm text-muted">
                Customer: {request.customer}
              </p>

              <p className="mt-1 flex items-center gap-1 text-xs text-muted">
                <Clock size={13} />
                {request.date}
              </p>
            </div>

            <span
              className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${
                statusStyles[request.status]
              }`}
            >
              {request.status}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
