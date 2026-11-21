
import Link from "next/link";

import {
  ArrowRight,
  Clock,
  ClipboardList,
} from "lucide-react";

import type { ServiceRequest } from "@/app/dashboard/technician/page";

interface RecentRequestsProps {
  requests: ServiceRequest[];
  loading: boolean;
}

const statusStyles: Record<ServiceRequest["status"], string> = {
  requested: "bg-amber-500/10 text-amber-600",
  accepted: "bg-blue-500/10 text-blue-600",
  rejected: "bg-red-500/10 text-red-600",
  "in-progress": "bg-purple-500/10 text-purple-600",
  completed: "bg-emerald-500/10 text-emerald-600",
};

const formatStatus = (status: string) =>
  status.replace("-", " ").replace(/\b\w/g, (char) =>
    char.toUpperCase()
  );

const formatDate = (date?: string) => {
  if (!date) return "Date not available";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Date not available";
  }

  return parsedDate.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

export default function RecentRequests({
  requests,
  loading,
}: RecentRequestsProps) {
  const recentRequests = [...requests]
    .sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime() || 0;
      const dateB = new Date(b.createdAt).getTime() || 0;

      return dateB - dateA;
    })
    .slice(0, 5);

  return (
    <section className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
      {/* Header */}
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
          className="flex shrink-0 items-center gap-1 text-sm font-semibold text-primary transition hover:gap-2 hover:underline"
        >
          View All
          <ArrowRight size={16} />
        </Link>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="animate-pulse space-y-3 border-b border-border pb-4 last:border-0"
            >
              <div className="h-4 w-1/3 rounded bg-surface-secondary" />
              <div className="h-3 w-1/2 rounded bg-surface-secondary" />
              <div className="h-3 w-1/4 rounded bg-surface-secondary" />
            </div>
          ))}
        </div>
      ) : recentRequests.length === 0 ? (
        /* Empty State */
        <div className="flex min-h-48 flex-col items-center justify-center text-center">
          <div className="rounded-2xl bg-primary/10 p-4">
            <ClipboardList size={30} className="text-primary" />
          </div>

          <h3 className="mt-4 font-semibold text-foreground">
            No requests yet
          </h3>

          <p className="mt-2 text-sm text-muted">
            Customer repair requests will appear here when customers book
            your services.
          </p>

          <Link
            href="/dashboard/technician/requests"
            className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
          >
            Manage Requests
            <ArrowRight size={16} />
          </Link>
        </div>
      ) : (
        /* Request List */
        <div className="space-y-4">
          {recentRequests.map((request) => (
            <div
              key={request._id}
              className="flex flex-col gap-3 border-b border-border pb-4 last:border-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0">
                <h3 className="font-semibold text-foreground">
                  {request.serviceTitle || "Repair Service"}
                </h3>

                <p className="mt-1 text-sm text-muted">
                  Customer: {request.customerName || "Unknown customer"}
                </p>

                <p className="mt-1 flex items-center gap-1 text-xs text-muted">
                  <Clock size={13} />
                  Preferred date: {formatDate(request.preferredDate)}
                </p>
              </div>

              <span
                className={`w-fit shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${
                  statusStyles[request.status] ??
                  "bg-surface-secondary text-muted"
                }`}
              >
                {formatStatus(request.status)}
              </span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
