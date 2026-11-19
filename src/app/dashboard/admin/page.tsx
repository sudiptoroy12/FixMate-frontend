
"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Users,
  UserRound,
  Wrench,
  CalendarCheck,
  Wallet,
  Clock,
  CheckCircle2,
  XCircle,
  ArrowUpRight,
  RefreshCw,
  AlertCircle,
  ClipboardList,
} from "lucide-react";
import { getTokenFromClient } from "@/lib/(getToken)/getTokenFromClient";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface Overview {
  totalUsers: number;
  totalTechnicians: number;
  totalCustomers: number;
  totalServices: number;
  pendingServices: number;
  approvedServices: number;
  rejectedServices: number;
  totalBookings: number;
  pendingBookings: number;
  completedBookings: number;
  totalTransactions: number;
}

interface Booking {
  _id: string;
  customerName: string;
  customerEmail: string;
  technicianName: string;
  serviceTitle: string;
  deviceName: string;
  preferredDate: string;
  preferredTime: string;
  status: string;
  createdAt: string;
}

interface Service {
  _id: string;
  title: string;
  category: string;
  technicianName: string;
  technicianEmail: string;
  basePrice: number;
  approvalStatus: string;
  createdAt: string;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

function formatDate(date?: string) {
  if (!date) return "N/A";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) return "N/A";

  return parsedDate.toLocaleDateString("en-BD", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function StatusBadge({ status }: { status: string }) {
  const normalized = status?.toLowerCase();

  const styles: Record<string, string> = {
    pending: "bg-amber-500/10 text-amber-600",
    accepted: "bg-blue-500/10 text-blue-600",
    approved: "bg-emerald-500/10 text-emerald-600",
    completed: "bg-emerald-500/10 text-emerald-600",
    rejected: "bg-red-500/10 text-red-600",
    "in-progress": "bg-sky-500/10 text-sky-600",
  };

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize ${
        styles[normalized] || "bg-surface-secondary text-muted"
      }`}
    >
      {normalized?.replace("-", " ") || "Unknown"}
    </span>
  );
}

function StatCard({
  title,
  value,
  description,
  icon: Icon,
  href,
  accent = "primary",
}: {
  title: string;
  value: number | string;
  description: string;
  icon: React.ElementType;
  href: string;
  accent?: "primary" | "warning" | "success" | "danger";
}) {
  const accentStyles = {
    primary: "bg-primary/10 text-primary",
    warning: "bg-amber-500/10 text-amber-600",
    success: "bg-emerald-500/10 text-emerald-600",
    danger: "bg-red-500/10 text-red-600",
  };

  return (
    <Link
      href={href}
      className="group rounded-2xl border border-border bg-surface p-5 transition hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="flex items-start justify-between">
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-xl ${accentStyles[accent]}`}
        >
          <Icon size={23} />
        </div>

        <ArrowUpRight
          size={19}
          className="text-muted transition group-hover:text-primary"
        />
      </div>

      <div className="mt-5">
        <p className="text-sm font-medium text-muted">{title}</p>
        <h3 className="mt-1 text-3xl font-bold text-foreground">
          {value.toLocaleString()}
        </h3>
        <p className="mt-2 text-xs text-muted">{description}</p>
      </div>
    </Link>
  );
}

export default function AdminDashboardPage() {
  const [overview, setOverview] = useState<Overview | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let ignore = false;

    const loadDashboard = async () => {
      try {
        if (!API_URL) {
          throw new Error("API URL is not configured.");
        }

        const token = await getTokenFromClient();

        const headers = {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        };

        const [overviewResponse, bookingsResponse, servicesResponse] =
          await Promise.all([
            fetch(`${API_URL}/api/admin/overview`, {
              headers,
              cache: "no-store",
            }),
            fetch(`${API_URL}/api/admin/bookings`, {
              headers,
              cache: "no-store",
            }),
            fetch(`${API_URL}/api/admin/services`, {
              headers,
              cache: "no-store",
            }),
          ]);

        const [overviewResult, bookingsResult, servicesResult] =
          await Promise.all([
            overviewResponse.json() as Promise<ApiResponse<Overview>>,
            bookingsResponse.json() as Promise<ApiResponse<Booking[]>>,
            servicesResponse.json() as Promise<ApiResponse<Service[]>>,
          ]);

        if (!overviewResponse.ok || !overviewResult.success) {
          throw new Error(
            overviewResult.message || "Failed to load dashboard overview."
          );
        }

        if (!bookingsResponse.ok || !bookingsResult.success) {
          throw new Error(
            bookingsResult.message || "Failed to load bookings."
          );
        }

        if (!servicesResponse.ok || !servicesResult.success) {
          throw new Error(
            servicesResult.message || "Failed to load services."
          );
        }

        if (!ignore) {
          setOverview(overviewResult.data);
          setBookings(bookingsResult.data || []);
          setServices(servicesResult.data || []);
          setError("");
        }
      } catch (err) {
        if (!ignore) {
          setError(
            err instanceof Error
              ? err.message
              : "Something went wrong while loading the dashboard."
          );
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    void loadDashboard();

    return () => {
      ignore = true;
    };
  }, [refreshKey]);

  const recentBookings = useMemo(
    () => bookings.slice(0, 5),
    [bookings]
  );

  const pendingServiceList = useMemo(
    () =>
      services
        .filter((service) => service.approvalStatus === "pending")
        .slice(0, 5),
    [services]
  );

  const serviceStats = [
    {
      label: "Approved",
      value: overview?.approvedServices || 0,
      color: "bg-emerald-500",
    },
    {
      label: "Pending",
      value: overview?.pendingServices || 0,
      color: "bg-amber-500",
    },
    {
      label: "Rejected",
      value: overview?.rejectedServices || 0,
      color: "bg-red-500",
    },
  ];

  const bookingStats = [
    {
      label: "Pending",
      value: overview?.pendingBookings || 0,
      color: "bg-amber-500",
    },
    {
      label: "Completed",
      value: overview?.completedBookings || 0,
      color: "bg-emerald-500",
    },
    {
      label: "Other",
      value: Math.max(
        0,
        (overview?.totalBookings || 0) -
          (overview?.pendingBookings || 0) -
          (overview?.completedBookings || 0)
      ),
      color: "bg-blue-500",
    },
  ];

  const handleRefresh = () => {
    setLoading(true);
    setError("");
    setRefreshKey((previous) => previous + 1);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-24 animate-pulse rounded-2xl bg-surface-secondary" />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="h-40 animate-pulse rounded-2xl bg-surface-secondary"
            />
          ))}
        </div>
        <div className="grid gap-6 xl:grid-cols-2">
          <div className="h-72 animate-pulse rounded-2xl bg-surface-secondary" />
          <div className="h-72 animate-pulse rounded-2xl bg-surface-secondary" />
        </div>
      </div>
    );
  }

  if (error && !overview) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center rounded-2xl border border-border bg-surface p-8 text-center">
        <AlertCircle size={42} className="text-danger" />
        <h2 className="mt-4 text-xl font-bold text-foreground">
          Unable to load dashboard
        </h2>
        <p className="mt-2 max-w-md text-sm text-muted">{error}</p>
        <button
          onClick={handleRefresh}
          className="mt-6 flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary-hover"
        >
          <RefreshCw size={17} />
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-7">
      {/* Welcome section */}
      <section className="flex flex-col justify-between gap-4 rounded-2xl bg-[#102b25] p-6 text-white sm:flex-row sm:items-center sm:p-8">
        <div>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-[#b9e769]/15 px-3 py-1.5 text-xs font-semibold text-[#b9e769]">
            <span className="h-2 w-2 rounded-full bg-[#b9e769]" />
            ADMIN CONTROL CENTER
          </div>

          <h1 className="text-2xl font-bold sm:text-3xl">
            Welcome to FixMate Admin!
          </h1>

          <p className="mt-2 max-w-xl text-sm leading-6 text-white/65">
            Monitor your platform, manage services, track bookings, and keep
            everything running smoothly.
          </p>
        </div>

        <button
          onClick={handleRefresh}
          className="flex w-fit items-center gap-2 rounded-xl bg-[#b9e769] px-5 py-3 text-sm font-bold text-[#102b25] transition hover:bg-[#a8d957]"
        >
          <RefreshCw size={17} />
          Refresh Data
        </button>
      </section>

      {error && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4 text-sm text-danger">
          {error}
        </div>
      )}

      {/* Main statistics */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-foreground">
              Platform Overview
            </h2>
            <p className="mt-1 text-sm text-muted">
              A summary of your platform activity.
            </p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Total Users"
            value={overview?.totalUsers || 0}
            description="All registered accounts"
            icon={Users}
            href="/dashboard/admin/users"
          />

          <StatCard
            title="Customers"
            value={overview?.totalCustomers || 0}
            description="Registered customers"
            icon={UserRound}
            href="/dashboard/admin/users"
            accent="success"
          />

          <StatCard
            title="Technicians"
            value={overview?.totalTechnicians || 0}
            description="Registered technicians"
            icon={Wrench}
            href="/dashboard/admin/users"
            accent="warning"
          />

          <StatCard
            title="Total Services"
            value={overview?.totalServices || 0}
            description="Services submitted by technicians"
            icon={ClipboardList}
            href="/dashboard/admin/services"
          />

          <StatCard
            title="Total Bookings"
            value={overview?.totalBookings || 0}
            description="All customer service requests"
            icon={CalendarCheck}
            href="/dashboard/admin/bookings"
            accent="success"
          />

          <StatCard
            title="Pending Bookings"
            value={overview?.pendingBookings || 0}
            description="Bookings waiting for action"
            icon={Clock}
            href="/dashboard/admin/bookings"
            accent="warning"
          />

          <StatCard
            title="Completed Bookings"
            value={overview?.completedBookings || 0}
            description="Successfully completed jobs"
            icon={CheckCircle2}
            href="/dashboard/admin/bookings"
            accent="success"
          />

          <StatCard
            title="Transactions"
            value={overview?.totalTransactions || 0}
            description="Recorded payment documents"
            icon={Wallet}
            href="/dashboard/admin/transactions"
            accent="primary"
          />
        </div>
      </section>

      {/* Service and booking statistics */}
      <section className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-2xl border border-border bg-surface p-5 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-bold text-foreground">
                Service Approvals
              </h2>
              <p className="mt-1 text-xs text-muted">
                Current service approval status
              </p>
            </div>

            <div className="rounded-xl bg-primary/10 p-3 text-primary">
              <Wrench size={21} />
            </div>
          </div>

          <div className="mt-7 space-y-5">
            {serviceStats.map((item) => {
              const total = overview?.totalServices || 0;
              const percentage =
                total > 0 ? (item.value / total) * 100 : 0;

              return (
                <div key={item.label}>
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="font-medium text-foreground">
                      {item.label}
                    </span>
                    <span className="font-semibold text-foreground">
                      {item.value}
                    </span>
                  </div>

                  <div className="h-2.5 overflow-hidden rounded-full bg-surface-secondary">
                    <div
                      className={`h-full rounded-full ${item.color}`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <Link
            href="/dashboard/admin/services"
            className="mt-7 flex items-center justify-center gap-2 rounded-xl border border-border py-3 text-sm font-semibold text-foreground transition hover:bg-surface-hover"
          >
            Manage Services
            <ArrowUpRight size={17} />
          </Link>
        </div>

        <div className="rounded-2xl border border-border bg-surface p-5 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-bold text-foreground">
                Booking Overview
              </h2>
              <p className="mt-1 text-xs text-muted">
                Current booking status
              </p>
            </div>

            <div className="rounded-xl bg-primary/10 p-3 text-primary">
              <CalendarCheck size={21} />
            </div>
          </div>

          <div className="mt-7 space-y-5">
            {bookingStats.map((item) => {
              const total = overview?.totalBookings || 0;
              const percentage =
                total > 0 ? (item.value / total) * 100 : 0;

              return (
                <div key={item.label}>
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="font-medium text-foreground">
                      {item.label}
                    </span>
                    <span className="font-semibold text-foreground">
                      {item.value}
                    </span>
                  </div>

                  <div className="h-2.5 overflow-hidden rounded-full bg-surface-secondary">
                    <div
                      className={`h-full rounded-full ${item.color}`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <Link
            href="/dashboard/admin/bookings"
            className="mt-7 flex items-center justify-center gap-2 rounded-xl border border-border py-3 text-sm font-semibold text-foreground transition hover:bg-surface-hover"
          >
            Manage Bookings
            <ArrowUpRight size={17} />
          </Link>
        </div>
      </section>

      {/* Recent bookings */}
      <section className="overflow-hidden rounded-2xl border border-border bg-surface">
        <div className="flex flex-col justify-between gap-3 border-b border-border p-5 sm:flex-row sm:items-center sm:px-6">
          <div>
            <h2 className="font-bold text-foreground">Recent Bookings</h2>
            <p className="mt-1 text-xs text-muted">
              Latest customer service requests
            </p>
          </div>

          <Link
            href="/dashboard/admin/bookings"
            className="flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
          >
            View All <ArrowUpRight size={16} />
          </Link>
        </div>

        {recentBookings.length === 0 ? (
          <div className="p-10 text-center text-sm text-muted">
            No bookings found yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-left">
              <thead className="bg-surface-secondary text-xs uppercase text-muted">
                <tr>
                  <th className="px-6 py-4 font-semibold">Customer</th>
                  <th className="px-6 py-4 font-semibold">Service</th>
                  <th className="px-6 py-4 font-semibold">Technician</th>
                  <th className="px-6 py-4 font-semibold">Date</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-border">
                {recentBookings.map((booking) => (
                  <tr key={booking._id} className="hover:bg-surface-hover">
                    <td className="px-6 py-4">
                      <p className="text-sm font-semibold text-foreground">
                        {booking.customerName || "Unknown"}
                      </p>
                      <p className="mt-1 text-xs text-muted">
                        {booking.customerEmail}
                      </p>
                    </td>

                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-foreground">
                        {booking.serviceTitle || "Service"}
                      </p>
                      <p className="mt-1 text-xs text-muted">
                        {booking.deviceName}
                      </p>
                    </td>

                    <td className="px-6 py-4 text-sm text-foreground">
                      {booking.technicianName || "N/A"}
                    </td>

                    <td className="px-6 py-4 text-sm text-muted">
                      {formatDate(booking.createdAt)}
                    </td>

                    <td className="px-6 py-4">
                      <StatusBadge status={booking.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Pending service approvals */}
      <section className="overflow-hidden rounded-2xl border border-border bg-surface">
        <div className="flex items-center justify-between border-b border-border p-5 sm:px-6">
          <div>
            <h2 className="font-bold text-foreground">
              Pending Service Approvals
            </h2>
            <p className="mt-1 text-xs text-muted">
              Services waiting for administrator review
            </p>
          </div>

          <Link
            href="/dashboard/admin/services"
            className="flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
          >
            View All <ArrowUpRight size={16} />
          </Link>
        </div>

        {pendingServiceList.length === 0 ? (
          <div className="p-10 text-center">
            <CheckCircle2
              size={32}
              className="mx-auto text-emerald-500"
            />
            <p className="mt-3 text-sm font-medium text-foreground">
              All caught up!
            </p>
            <p className="mt-1 text-xs text-muted">
              There are no pending services to review.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {pendingServiceList.map((service) => (
              <div
                key={service._id}
                className="flex flex-col justify-between gap-3 p-5 sm:flex-row sm:items-center sm:px-6"
              >
                <div>
                  <h3 className="font-semibold text-foreground">
                    {service.title}
                  </h3>
                  <p className="mt-1 text-xs text-muted">
                    {service.category} · {service.technicianName}
                  </p>
                  <p className="mt-1 text-xs text-muted">
                    Submitted {formatDate(service.createdAt)}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <StatusBadge status={service.approvalStatus} />

                  <Link
                    href="/dashboard/admin/services"
                    className="rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground transition hover:bg-primary-hover"
                  >
                    Review
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
