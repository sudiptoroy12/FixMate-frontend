
"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Search,
  RefreshCw,
  CalendarDays,
  Clock,
  MapPin,
  Phone,
  Wrench,
  UserRound,
  X,
  ClipboardList,
  AlertCircle,
  Eye,
} from "lucide-react";

import { getTokenFromClient } from "@/lib/(getToken)/getTokenFromClient";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface Booking {
  _id: string;
  serviceId: string;
  serviceName?: string;
  serviceTitle?: string;
  technicianName?: string;
  technicianEmail?: string;
  customerName?: string;
  customerEmail?: string;
  deviceName: string;
  problemDescription: string;
  customerPhone: string;
  address: string;
  preferredDate: string;
  preferredTime: string;
  status:
    | "pending"
    | "accepted"
    | "rejected"
    | "in-progress"
    | "completed";
  createdAt: string;
  updatedAt?: string;
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
  if (!date) return "Not specified";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) return date;

  return parsedDate.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

export default function CustomerBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedBooking, setSelectedBooking] =
    useState<Booking | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  // Fetch customer bookings
  useEffect(() => {
    let ignore = false;

    const loadBookings = async () => {
      try {
        setError("");

        if (!API_URL) {
          throw new Error("API URL is not configured.");
        }

        const token = await getTokenFromClient();

        const response = await fetch(
          `${API_URL}/api/service-requests/customer`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            cache: "no-store",
          }
        );

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(
            result.message || "Failed to load your bookings."
          );
        }

        if (!ignore) {
          setBookings(result.data || []);
        }
      } catch (err) {
        if (!ignore) {
          setError(
            err instanceof Error
              ? err.message
              : "Something went wrong."
          );
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    loadBookings();

    return () => {
      ignore = true;
    };
  }, [refreshKey]);

  // Refresh bookings
  const handleRefresh = () => {
    setLoading(true);
    setRefreshKey((previous) => previous + 1);
  };

  // Search and filter bookings
  const filteredBookings = useMemo(() => {
    return bookings.filter((booking) => {
      const searchValue = search.toLowerCase();

      const matchesSearch = [
        booking.serviceName,
        booking.serviceTitle,
        booking.deviceName,
        booking.technicianName,
        booking._id,
      ].some((value) =>
        value?.toLowerCase().includes(searchValue)
      );

      const matchesStatus =
        statusFilter === "all" ||
        booking.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [bookings, search, statusFilter]);

  // Statistics
  const stats = [
    {
      label: "Total Bookings",
      value: bookings.length,
      icon: ClipboardList,
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      label: "Pending",
      value: bookings.filter((b) => b.status === "pending").length,
      icon: Clock,
      color: "text-warning",
      bg: "bg-warning/10",
    },
    {
      label: "In Progress",
      value: bookings.filter((b) => b.status === "in-progress").length,
      icon: Wrench,
      color: "text-primary",
      bg: "bg-accent",
    },
    {
      label: "Completed",
      value: bookings.filter((b) => b.status === "completed").length,
      icon: CalendarDays,
      color: "text-success",
      bg: "bg-success/10",
    },
  ];

  return (
    <div className="space-y-7 text-foreground">
      {/* Page Heading */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            My Bookings
          </h2>

          <p className="mt-1 text-sm text-muted">
            Track and manage all your repair service bookings.
          </p>
        </div>

        <button
          onClick={handleRefresh}
          disabled={loading}
          className="flex items-center justify-center gap-2 rounded-xl border border-border bg-surface px-4 py-2.5 text-sm font-semibold text-foreground transition hover:bg-surface-hover disabled:cursor-not-allowed disabled:opacity-50"
        >
          <RefreshCw
            size={17}
            className={loading ? "animate-spin" : ""}
          />
          Refresh
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.label}
              className="rounded-2xl border border-border bg-surface p-5 shadow-card transition hover:-translate-y-0.5"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted">
                    {stat.label}
                  </p>

                  <h3 className="mt-2 text-3xl font-bold">
                    {stat.value}
                  </h3>
                </div>

                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.bg} ${stat.color}`}
                >
                  <Icon size={23} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Search and Filter */}
      <div className="rounded-2xl border border-border bg-surface p-4 shadow-card sm:p-5">
        <div className="flex flex-col gap-3 md:flex-row">
          <div className="relative flex-1">
            <Search
              size={19}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
            />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by service, device, technician..."
              className="w-full rounded-xl border border-input bg-surface px-4 py-3 pl-11 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/20"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-input bg-surface px-4 py-3 text-sm text-foreground outline-none transition focus:border-ring md:w-48"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="accepted">Accepted</option>
            <option value="rejected">Rejected</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      {/* Booking History */}
      <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-card">
        <div className="flex items-center justify-between border-b border-border px-5 py-5">
          <div>
            <h3 className="font-bold">
              Booking History
            </h3>

            <p className="mt-1 text-xs text-muted">
              {filteredBookings.length} booking(s) found
            </p>
          </div>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="space-y-4 p-5">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="animate-pulse rounded-xl border border-border p-5"
              >
                <div className="h-4 w-1/3 rounded bg-surface-secondary" />
                <div className="mt-4 h-3 w-2/3 rounded bg-surface-secondary" />
                <div className="mt-3 h-3 w-1/2 rounded bg-surface-secondary" />
              </div>
            ))}
          </div>
        ) : error ? (
          /* Error State */
          <div className="flex flex-col items-center px-5 py-14 text-center">
            <AlertCircle size={40} className="text-danger" />

            <h3 className="mt-4 font-semibold">
              Unable to load bookings
            </h3>

            <p className="mt-2 max-w-md text-sm text-muted">
              {error}
            </p>

            <button
              onClick={handleRefresh}
              className="mt-5 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary-hover"
            >
              Try Again
            </button>
          </div>
        ) : filteredBookings.length === 0 ? (
          /* Empty State */
          <div className="flex flex-col items-center px-5 py-16 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent text-primary">
              <ClipboardList size={30} />
            </div>

            <h3 className="mt-5 text-lg font-bold">
              {bookings.length === 0
                ? "No bookings yet"
                : "No matching bookings"}
            </h3>

            <p className="mt-2 max-w-sm text-sm text-muted">
              {bookings.length === 0
                ? "You haven't booked any repair services yet. Explore our services to get started."
                : "Try changing your search or status filter."}
            </p>

            {bookings.length === 0 && (
              <a
                href="/services"
                className="mt-5 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground transition hover:bg-primary-hover"
              >
                Browse Services
              </a>
            )}
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full text-left">
                <thead className="bg-surface-secondary text-xs uppercase tracking-wider text-muted">
                  <tr>
                    <th className="px-6 py-4 font-semibold">
                      Service
                    </th>
                    <th className="px-6 py-4 font-semibold">
                      Device
                    </th>
                    <th className="px-6 py-4 font-semibold">
                      Technician
                    </th>
                    <th className="px-6 py-4 font-semibold">
                      Date
                    </th>
                    <th className="px-6 py-4 font-semibold">
                      Status
                    </th>
                    <th className="px-6 py-4 font-semibold">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-border">
                  {filteredBookings.map((booking) => (
                    <tr
                      key={booking._id}
                      className="transition hover:bg-surface-hover"
                    >
                      <td className="px-6 py-5">
                        <p className="font-semibold">
                          {booking.serviceName ||
                            booking.serviceTitle ||
                            "Repair Service"}
                        </p>

                        <p className="mt-1 text-xs text-muted">
                          #{booking._id.slice(-8)}
                        </p>
                      </td>

                      <td className="px-6 py-5 text-sm text-muted">
                        {booking.deviceName}
                      </td>

                      <td className="px-6 py-5 text-sm text-muted">
                        {booking.technicianName || "Not assigned"}
                      </td>

                      <td className="px-6 py-5 text-sm text-muted">
                        {formatDate(booking.preferredDate)}
                      </td>

                      <td className="px-6 py-5">
                        <span
                          className={`rounded-full px-3 py-1.5 text-xs font-semibold ${statusStyles[booking.status] || "bg-surface-secondary text-muted"}`}
                        >
                          {statusLabels[booking.status] || booking.status}
                        </span>
                      </td>

                      <td className="px-6 py-5">
                        <button
                          onClick={() => setSelectedBooking(booking)}
                          className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition hover:text-primary-hover"
                        >
                          <Eye size={16} />
                          Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="space-y-4 p-4 md:hidden">
              {filteredBookings.map((booking) => (
                <div
                  key={booking._id}
                  className="rounded-xl border border-border bg-surface p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h4 className="font-bold">
                        {booking.serviceName ||
                          booking.serviceTitle ||
                          "Repair Service"}
                      </h4>

                      <p className="mt-1 text-xs text-muted">
                        #{booking._id.slice(-8)}
                      </p>
                    </div>

                    <span
                      className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyles[booking.status] || "bg-surface-secondary text-muted"}`}
                    >
                      {statusLabels[booking.status] || booking.status}
                    </span>
                  </div>

                  <div className="mt-4 space-y-3 text-sm text-muted">
                    <p className="flex items-center gap-2">
                      <Wrench size={16} />
                      {booking.deviceName}
                    </p>

                    <p className="flex items-center gap-2">
                      <UserRound size={16} />
                      {booking.technicianName || "Not assigned"}
                    </p>

                    <p className="flex items-center gap-2">
                      <CalendarDays size={16} />
                      {formatDate(booking.preferredDate)}
                    </p>
                  </div>

                  <button
                    onClick={() => setSelectedBooking(booking)}
                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg border border-primary/30 py-2.5 text-sm font-semibold text-primary transition hover:bg-primary/10"
                  >
                    <Eye size={16} />
                    View Details
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Booking Details Modal */}
      {selectedBooking && (
        <div
          onClick={() => setSelectedBooking(null)}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl border border-border bg-surface shadow-card"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-border p-5">
              <div>
                <h3 className="text-lg font-bold">
                  Booking Details
                </h3>

                <p className="mt-1 text-xs text-muted">
                  Booking ID: #{selectedBooking._id}
                </p>
              </div>

              <button
                onClick={() => setSelectedBooking(null)}
                className="rounded-full p-2 text-muted transition hover:bg-surface-hover"
                aria-label="Close details"
              >
                <X size={21} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="space-y-5 p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h4 className="font-bold">
                  {selectedBooking.serviceName ||
                    selectedBooking.serviceTitle ||
                    "Repair Service"}
                </h4>

                <span
                  className={`rounded-full px-3 py-1.5 text-xs font-semibold ${statusStyles[selectedBooking.status] || "bg-surface-secondary text-muted"}`}
                >
                  {statusLabels[selectedBooking.status] ||
                    selectedBooking.status}
                </span>
              </div>

              {/* Problem Description */}
              <div className="rounded-xl bg-surface-secondary p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted">
                  Problem Description
                </p>

                <p className="mt-2 text-sm leading-6 text-foreground">
                  {selectedBooking.problemDescription}
                </p>
              </div>

              {/* Booking Information */}
              <div className="grid gap-5 sm:grid-cols-2">
                <DetailItem
                  icon={<Wrench size={18} />}
                  label="Device"
                  value={selectedBooking.deviceName}
                />

                <DetailItem
                  icon={<UserRound size={18} />}
                  label="Technician"
                  value={selectedBooking.technicianName || "Not assigned"}
                />

                <DetailItem
                  icon={<CalendarDays size={18} />}
                  label="Preferred Date"
                  value={formatDate(selectedBooking.preferredDate)}
                />

                <DetailItem
                  icon={<Clock size={18} />}
                  label="Preferred Time"
                  value={selectedBooking.preferredTime}
                />

                <DetailItem
                  icon={<Phone size={18} />}
                  label="Contact Number"
                  value={selectedBooking.customerPhone}
                />

                <DetailItem
                  icon={<MapPin size={18} />}
                  label="Address"
                  value={selectedBooking.address}
                />
              </div>

              {/* Created Date */}
              <div className="border-t border-border pt-4">
                <p className="text-xs text-muted">
                  Booking created: {formatDate(selectedBooking.createdAt)}
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="border-t border-border p-5">
              <button
                onClick={() => setSelectedBooking(null)}
                className="w-full rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary-hover"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Reusable detail item
function DetailItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value?: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 text-primary">
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-xs text-muted">
          {label}
        </p>

        <p className="mt-1 break-words text-sm font-medium text-foreground">
          {value || "Not provided"}
        </p>
      </div>
    </div>
  );
}
