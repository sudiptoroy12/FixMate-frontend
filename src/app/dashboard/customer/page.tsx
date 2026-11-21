
"use client";

import { useEffect, useMemo, useState } from "react";
import type { ElementType } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  CreditCard,
  RefreshCw,
  Wrench,
  ClipboardList,
  AlertCircle,
  Plus,
  TrendingUp,
} from "lucide-react";

import { getTokenFromClient } from "@/lib/(getToken)/getTokenFromClient";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface Booking {
  _id: string;
  serviceName?: string;
  serviceTitle?: string;
  technicianName?: string;
  deviceName: string;
  problemDescription: string;
  preferredDate: string;
  preferredTime: string;
  status:
    | "pending"
    | "accepted"
    | "rejected"
    | "in-progress"
    | "completed";
  createdAt: string;
}

interface Payment {
  _id: string;
  amount?: number;
  totalAmount?: number;
  currency?: string;
  status?: string;
  paymentStatus?: string;
  createdAt?: string;
}

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T | {
    bookings?: Booking[];
    payments?: Payment[];
  };
}

const statusStyles: Record<string, string> = {
  pending: "bg-warning/10 text-warning",
  accepted: "bg-primary/10 text-primary",
  rejected: "bg-danger/10 text-danger",
  "in-progress": "bg-accent text-primary",
  completed: "bg-success/10 text-success",
};

const statusLabels: Record<string, string> = {
  pending: "Pending",
  accepted: "Accepted",
  rejected: "Rejected",
  "in-progress": "In Progress",
  completed: "Completed",
};

const formatDate = (date?: string) => {
  if (!date) return "Date unavailable";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Date unavailable";
  }

  return parsedDate.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

// Only accept payments explicitly recorded in USD.
// This prevents old BDT payments from being displayed as USD.
const isUsdPayment = (payment: Payment) =>
  payment.currency?.toUpperCase() === "USD";

const getPaymentAmount = (payment: Payment) => {
  const amount = Number(payment.amount ?? payment.totalAmount ?? 0);

  return Number.isFinite(amount) && amount >= 0 ? amount : 0;
};

const isSuccessfulPayment = (payment: Payment) => {
  const status = (
    payment.status ||
    payment.paymentStatus ||
    ""
  ).toLowerCase();

  return ["success", "successful", "paid", "completed"].includes(status);
};

const formatMoney = (amount: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);

function StatCard({
  title,
  value,
  description,
  icon: Icon,
  iconStyle,
}: {
  title: string;
  value: string | number;
  description: string;
  icon: ElementType;
  iconStyle: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-muted">{title}</p>

          <h3 className="mt-3 text-2xl font-bold text-foreground sm:text-3xl">
            {value}
          </h3>

          <p className="mt-2 text-xs text-muted">{description}</p>
        </div>

        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${iconStyle}`}
        >
          <Icon size={23} />
        </div>
      </div>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="animate-pulse space-y-7">
      <div className="h-28 rounded-2xl bg-surface-secondary" />

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="h-36 rounded-2xl bg-surface-secondary"
          />
        ))}
      </div>

      <div className="h-72 rounded-2xl bg-surface-secondary" />
    </div>
  );
}

export default function CustomerDashboardPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  // Load customer bookings and payment history.
  useEffect(() => {
    let ignore = false;

    const loadDashboard = async () => {
      await Promise.resolve();

      try {
        if (!API_URL) {
          throw new Error("API URL is not configured.");
        }

        const token = await getTokenFromClient();

        if (!token) {
          throw new Error("Please sign in to view your dashboard.");
        }

        const headers = {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        };

        const [bookingResponse, paymentResponse] = await Promise.all([
          fetch(`${API_URL}/api/service-requests/customer`, {
            method: "GET",
            headers,
            cache: "no-store",
          }),

          fetch(`${API_URL}/api/payments/customer`, {
            method: "GET",
            headers,
            cache: "no-store",
          }),
        ]);

        const bookingResult: ApiResponse<Booking[]> =
          await bookingResponse.json();

        const paymentResult: ApiResponse<Payment[]> =
          await paymentResponse.json();

        if (!bookingResponse.ok || !bookingResult.success) {
          throw new Error(
            bookingResult.message || "Unable to load your bookings."
          );
        }

        if (!paymentResponse.ok || !paymentResult.success) {
          throw new Error(
            paymentResult.message || "Unable to load your payments."
          );
        }

        const bookingData = bookingResult.data;
        const paymentData = paymentResult.data;

        const bookingList = Array.isArray(bookingData)
          ? bookingData
          : bookingData?.bookings ?? [];

        const paymentList = Array.isArray(paymentData)
          ? paymentData
          : paymentData?.payments ?? [];

        if (!ignore) {
          setBookings(bookingList);
          setPayments(paymentList);
          setError("");
        }
      } catch (err) {
        if (!ignore) {
          setError(
            err instanceof Error
              ? err.message
              : "Something went wrong while loading your dashboard."
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

  // Calculate dashboard statistics.
  const stats = useMemo(() => {
    const pending = bookings.filter(
      (booking) => booking.status === "pending"
    ).length;

    const completed = bookings.filter(
      (booking) => booking.status === "completed"
    ).length;

    // Only successful USD payments are included.
    const totalPaid = payments
      .filter(
        (payment) =>
          isSuccessfulPayment(payment) && isUsdPayment(payment)
      )
      .reduce(
        (total, payment) => total + getPaymentAmount(payment),
        0
      );

    return {
      totalBookings: bookings.length,
      pending,
      completed,
      totalPaid,
    };
  }, [bookings, payments]);

  // Get the five most recent bookings.
  const recentBookings = useMemo(
    () =>
      [...bookings]
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() -
            new Date(a.createdAt).getTime()
        )
        .slice(0, 5),
    [bookings]
  );

  const handleRefresh = () => {
    setLoading(true);
    setError("");
    setRefreshKey((previous) => previous + 1);
  };

  if (loading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <section className="relative overflow-hidden rounded-2xl bg-primary p-6 text-primary-foreground shadow-sm sm:p-8">
        <div className="relative z-10 flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-medium">
              <span className="h-2 w-2 rounded-full bg-secondary" />
              Customer Dashboard
            </div>

            <h1 className="text-2xl font-bold sm:text-3xl">
              Welcome to FixMate!
            </h1>

            <p className="mt-2 max-w-xl text-sm leading-6 opacity-85 sm:text-base">
              Manage your repair bookings, track service progress, and keep
              an eye on your payment history — all in one place.
            </p>

            <Link
              href="/services"
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-secondary px-5 py-3 text-sm font-semibold text-[#18352e] transition hover:brightness-95"
            >
              <Plus size={18} />
              Book a Service
              <ArrowRight size={17} />
            </Link>
          </div>

          <div className="hidden h-32 w-32 shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/10 sm:flex">
            <Wrench size={64} className="text-secondary" />
          </div>
        </div>

        <div className="absolute -right-12 -top-20 h-64 w-64 rounded-full border border-white/10" />
        <div className="absolute -bottom-24 right-28 h-48 w-48 rounded-full border border-white/10" />
      </section>

      {/* Error Message */}
      {error && (
        <div className="flex flex-col gap-3 rounded-xl border border-danger/30 bg-danger/10 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <AlertCircle className="shrink-0 text-danger" size={20} />
            <p className="text-sm text-danger">{error}</p>
          </div>

          <button
            onClick={handleRefresh}
            className="inline-flex items-center gap-2 text-sm font-semibold text-danger"
          >
            <RefreshCw size={15} />
            Try again
          </button>
        </div>
      )}

      {/* Statistics */}
      <section>
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-foreground">
              Overview
            </h2>

            <p className="mt-1 text-sm text-muted">
              Your repair activity at a glance.
            </p>
          </div>

          <button
            onClick={handleRefresh}
            title="Refresh dashboard"
            aria-label="Refresh dashboard"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-surface text-muted transition hover:bg-surface-hover hover:text-primary"
          >
            <RefreshCw size={17} />
          </button>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Total Bookings"
            value={stats.totalBookings}
            description="All your repair requests"
            icon={ClipboardList}
            iconStyle="bg-primary/10 text-primary"
          />

          <StatCard
            title="Pending Bookings"
            value={stats.pending}
            description="Waiting for technician response"
            icon={Clock3}
            iconStyle="bg-warning/10 text-warning"
          />

          <StatCard
            title="Completed Jobs"
            value={stats.completed}
            description="Successfully completed repairs"
            icon={CheckCircle2}
            iconStyle="bg-success/10 text-success"
          />

          <StatCard
            title="Total Payments"
            value={formatMoney(stats.totalPaid)}
            description="Your successful USD payments"
            icon={CreditCard}
            iconStyle="bg-accent text-primary"
          />
        </div>
      </section>

      {/* Recent Bookings */}
      <section className="overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
        <div className="flex flex-col gap-3 border-b border-border p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div>
            <h2 className="text-lg font-bold text-foreground">
              Recent Bookings
            </h2>

            <p className="mt-1 text-sm text-muted">
              Keep track of your latest repair requests.
            </p>
          </div>

          <Link
            href="/dashboard/customer/bookings"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary transition hover:gap-3"
          >
            View All Bookings
            <ArrowRight size={17} />
          </Link>
        </div>

        {recentBookings.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-5 py-14 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-surface-secondary text-muted">
              <CalendarDays size={30} />
            </div>

            <h3 className="mt-4 font-semibold text-foreground">
              No bookings yet
            </h3>

            <p className="mt-2 max-w-sm text-sm text-muted">
              You haven&apos;t booked any repair services yet. Find a service
              and let our verified technicians help you.
            </p>

            <Link
              href="/services"
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary-hover"
            >
              Explore Services
              <ArrowRight size={17} />
            </Link>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-surface-secondary text-xs font-semibold uppercase tracking-wider text-muted">
                    <th className="px-6 py-4">Service</th>
                    <th className="px-6 py-4">Device</th>
                    <th className="px-6 py-4">Technician</th>
                    <th className="px-6 py-4">Booking Date</th>
                    <th className="px-6 py-4">Status</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-border">
                  {recentBookings.map((booking) => (
                    <tr
                      key={booking._id}
                      className="transition hover:bg-surface-hover"
                    >
                      <td className="px-6 py-4">
                        <p className="font-semibold text-foreground">
                          {booking.serviceName ||
                            booking.serviceTitle ||
                            "Repair Service"}
                        </p>

                        <p className="mt-1 text-xs text-muted">
                          #{booking._id.slice(-8)}
                        </p>
                      </td>

                      <td className="px-6 py-4 text-sm text-muted">
                        {booking.deviceName}
                      </td>

                      <td className="px-6 py-4 text-sm text-muted">
                        {booking.technicianName || "Not assigned"}
                      </td>

                      <td className="px-6 py-4 text-sm text-muted">
                        {formatDate(booking.createdAt)}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex rounded-full px-3 py-1.5 text-xs font-semibold ${
                            statusStyles[booking.status] ||
                            "bg-surface-secondary text-muted"
                          }`}
                        >
                          {statusLabels[booking.status] || booking.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="divide-y divide-border md:hidden">
              {recentBookings.map((booking) => (
                <div key={booking._id} className="space-y-3 p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-semibold text-foreground">
                        {booking.serviceName ||
                          booking.serviceTitle ||
                          "Repair Service"}
                      </h3>

                      <p className="mt-1 text-xs text-muted">
                        #{booking._id.slice(-8)}
                      </p>
                    </div>

                    <span
                      className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold ${
                        statusStyles[booking.status] ||
                        "bg-surface-secondary text-muted"
                      }`}
                    >
                      {statusLabels[booking.status] || booking.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-xs text-muted">Device</p>
                      <p className="mt-1 font-medium text-foreground">
                        {booking.deviceName}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-muted">Technician</p>
                      <p className="mt-1 font-medium text-foreground">
                        {booking.technicianName || "Not assigned"}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-muted">Booking Date</p>
                      <p className="mt-1 font-medium text-foreground">
                        {formatDate(booking.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </section>

      {/* Quick Actions */}
      <section>
        <div className="mb-5">
          <h2 className="text-lg font-bold text-foreground">
            Quick Actions
          </h2>

          <p className="mt-1 text-sm text-muted">
            Quickly access the things you need.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <Link
            href="/services"
            className="group flex items-center gap-4 rounded-2xl border border-border bg-surface p-5 transition hover:border-primary/40 hover:shadow-md"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Wrench size={23} />
            </div>

            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-foreground">
                Browse Services
              </h3>

              <p className="mt-1 text-xs text-muted">
                Find the right repair service.
              </p>
            </div>

            <ArrowRight
              size={18}
              className="text-muted transition group-hover:translate-x-1 group-hover:text-primary"
            />
          </Link>

          <Link
            href="/dashboard/customer/bookings"
            className="group flex items-center gap-4 rounded-2xl border border-border bg-surface p-5 transition hover:border-primary/40 hover:shadow-md"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-warning/10 text-warning">
              <CalendarDays size={23} />
            </div>

            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-foreground">
                My Bookings
              </h3>

              <p className="mt-1 text-xs text-muted">
                Check your repair progress.
              </p>
            </div>

            <ArrowRight
              size={18}
              className="text-muted transition group-hover:translate-x-1 group-hover:text-primary"
            />
          </Link>

          <Link
            href="/dashboard/customer/payments"
            className="group flex items-center gap-4 rounded-2xl border border-border bg-surface p-5 transition hover:border-primary/40 hover:shadow-md"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-success/10 text-success">
              <CreditCard size={23} />
            </div>

            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-foreground">
                Payment History
              </h3>

              <p className="mt-1 text-xs text-muted">
                Review your transactions.
              </p>
            </div>

            <ArrowRight
              size={18}
              className="text-muted transition group-hover:translate-x-1 group-hover:text-primary"
            />
          </Link>
        </div>
      </section>

      {/* Helpful Footer */}
      <div className="flex flex-col gap-3 rounded-2xl border border-border bg-surface-secondary p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <TrendingUp size={20} />
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground">
              Need a repair?
            </h3>

            <p className="mt-1 text-xs text-muted">
              Get help from a verified FixMate technician.
            </p>
          </div>
        </div>

        <Link
          href="/services"
          className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
        >
          Find a technician
          <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
}
