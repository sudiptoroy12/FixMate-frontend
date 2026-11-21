
"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Search,
  RefreshCw,
  CheckCircle2,
  XCircle,
  Clock,
  Eye,
  CalendarDays,
  UserRound,
  X,
  AlertCircle,
  Filter,
  ClipboardList,
  CreditCard,
  MapPin,
  Wrench,
  Phone,
  Mail,
  Image as ImageIcon,
  ArrowRight,
  Ban,
  PlayCircle,
} from "lucide-react";

import { getTokenFromClient } from "@/lib/(getToken)/getTokenFromClient";

// ========================================
// TYPES
// ========================================

type BookingStatus =
  | "requested"
  | "accepted"
  | "rejected"
  | "in-progress"
  | "completed"
  | "cancelled";

type PaymentStatus = "paid" | "unpaid";

interface Booking {
  _id: string;
  serviceId: string;

  serviceTitle: string;
  serviceCategory: string;
  servicePrice: number;
  serviceImage?: string;
  currency: string;

  finalAmount?: number;

  technicianName: string;
  technicianEmail: string;

  customerName: string;
  customerEmail: string;
  customerPhone: string;

  problemDescription: string;
  address: string;
  preferredDate: string;

  status: BookingStatus;
  paymentStatus: PaymentStatus;

  createdAt: string;
  updatedAt?: string;
  paidAt?: string;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

type StatusFilter = "all" | BookingStatus;
type PaymentFilter = "all" | PaymentStatus;

const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");

// ========================================
// FILTERS AND STATUS CONFIGURATION
// ========================================

const statusFilters: {
  label: string;
  value: StatusFilter;
}[] = [
  { label: "All Bookings", value: "all" },
  { label: "Requested", value: "requested" },
  { label: "Accepted", value: "accepted" },
  { label: "In Progress", value: "in-progress" },
  { label: "Completed", value: "completed" },
  { label: "Rejected", value: "rejected" },
  { label: "Cancelled", value: "cancelled" },
];

const paymentFilters: {
  label: string;
  value: PaymentFilter;
}[] = [
  { label: "All Payments", value: "all" },
  { label: "Paid", value: "paid" },
  { label: "Unpaid", value: "unpaid" },
];

const statusStyles: Record<BookingStatus, string> = {
  requested: "bg-amber-500/10 text-amber-600",
  accepted: "bg-blue-500/10 text-blue-600",
  rejected: "bg-red-500/10 text-red-600",
  "in-progress": "bg-violet-500/10 text-violet-600",
  completed: "bg-emerald-500/10 text-emerald-600",
  cancelled: "bg-gray-500/10 text-gray-500",
};

const allowedTransitions: Record<BookingStatus, BookingStatus[]> = {
  requested: ["accepted", "rejected", "cancelled"],
  accepted: ["in-progress", "cancelled"],
  "in-progress": ["completed", "cancelled"],
  completed: [],
  rejected: [],
  cancelled: [],
};

// ========================================
// HELPERS
// ========================================

const formatPrice = (price: number | undefined, currency: string) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency || "USD",
  }).format(price || 0);
};

const formatDate = (date?: string) => {
  if (!date) return "N/A";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "N/A";
  }

  return parsedDate.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const formatDateTime = (date?: string) => {
  if (!date) return "N/A";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "N/A";
  }

  return parsedDate.toLocaleString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
};

const formatStatus = (status: string) => {
  return status.replaceAll("-", " ");
};

// ========================================
// MAIN PAGE
// ========================================

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] =
    useState<StatusFilter>("all");

  const [paymentFilter, setPaymentFilter] =
    useState<PaymentFilter>("all");

  const [actionLoading, setActionLoading] = useState<string | null>(
    null
  );

  const [selectedBooking, setSelectedBooking] =
    useState<Booking | null>(null);

  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // ========================================
  // FETCH BOOKINGS
  // ========================================

  const fetchBookings = async (isRefresh = false) => {
    if (!API_URL) {
      setError("API URL is not configured.");
      setLoading(false);
      setRefreshing(false);
      return;
    }

    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const token = await getTokenFromClient();

      if (!token) {
        throw new Error(
          "Your session has expired. Please sign in again."
        );
      }

      const response = await fetch(
        `${API_URL}/api/admin/bookings`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          cache: "no-store",
        }
      );

      const result: ApiResponse<Booking[]> = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Failed to retrieve bookings."
        );
      }

      setBookings(Array.isArray(result.data) ? result.data : []);
    } catch (err) {
      console.error("Fetch admin bookings error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while fetching bookings."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Initial loading
  useEffect(() => {
    let isMounted = true;

    const loadBookings = async () => {
      if (!API_URL) {
        if (isMounted) {
          setError("API URL is not configured.");
          setLoading(false);
        }
        return;
      }

      try {
        const token = await getTokenFromClient();

        if (!token) {
          throw new Error(
            "Your session has expired. Please sign in again."
          );
        }

        const response = await fetch(
          `${API_URL}/api/admin/bookings`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            cache: "no-store",
          }
        );

        const result: ApiResponse<Booking[]> =
          await response.json();

        if (!response.ok || !result.success) {
          throw new Error(
            result.message || "Failed to retrieve bookings."
          );
        }

        if (isMounted) {
          setBookings(
            Array.isArray(result.data) ? result.data : []
          );
        }
      } catch (err) {
        console.error("Fetch admin bookings error:", err);

        if (isMounted) {
          setError(
            err instanceof Error
              ? err.message
              : "Something went wrong while fetching bookings."
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadBookings();

    return () => {
      isMounted = false;
    };
  }, []);

  // ========================================
  // FILTER BOOKINGS
  // ========================================

  const filteredBookings = useMemo(() => {
    return bookings.filter((booking) => {
      const matchesStatus =
        activeFilter === "all" ||
        booking.status === activeFilter;

      const matchesPayment =
        paymentFilter === "all" ||
        booking.paymentStatus === paymentFilter;

      const searchText = search.toLowerCase().trim();

      const matchesSearch =
        !searchText ||
        booking.serviceTitle?.toLowerCase().includes(searchText) ||
        booking.serviceCategory?.toLowerCase().includes(searchText) ||
        booking.customerName?.toLowerCase().includes(searchText) ||
        booking.customerEmail?.toLowerCase().includes(searchText) ||
        booking.technicianName?.toLowerCase().includes(searchText) ||
        booking.technicianEmail?.toLowerCase().includes(searchText) ||
        booking.customerPhone?.toLowerCase().includes(searchText) ||
        booking._id?.toLowerCase().includes(searchText);

      return (
        matchesStatus &&
        matchesPayment &&
        matchesSearch
      );
    });
  }, [bookings, activeFilter, paymentFilter, search]);

  // ========================================
  // BOOKING STATISTICS
  // ========================================

  const stats = useMemo(() => {
    return {
      total: bookings.length,

      requested: bookings.filter(
        (booking) => booking.status === "requested"
      ).length,

      accepted: bookings.filter(
        (booking) => booking.status === "accepted"
      ).length,

      inProgress: bookings.filter(
        (booking) => booking.status === "in-progress"
      ).length,

      completed: bookings.filter(
        (booking) => booking.status === "completed"
      ).length,

      cancelled: bookings.filter(
        (booking) => booking.status === "cancelled"
      ).length,

      paid: bookings.filter(
        (booking) => booking.paymentStatus === "paid"
      ).length,

      unpaid: bookings.filter(
        (booking) => booking.paymentStatus === "unpaid"
      ).length,
    };
  }, [bookings]);

  // ========================================
  // UPDATE BOOKING STATUS
  // ========================================

  const handleStatusUpdate = async (
    booking: Booking,
    newStatus: BookingStatus
  ) => {
    if (!API_URL) {
      setError("API URL is not configured.");
      return;
    }

    const allowedStatuses = allowedTransitions[booking.status];

    if (!allowedStatuses.includes(newStatus)) {
      setError(
        `Cannot change booking from ${booking.status} to ${newStatus}.`
      );
      return;
    }

    // Do not allow changes to paid bookings.
    if (booking.paymentStatus === "paid") {
      setError("Paid bookings cannot be modified.");
      return;
    }

    let finalAmount: number | undefined;

    // Ask for final repair amount when completing a booking.
    if (newStatus === "completed") {
      const amountInput = window.prompt(
        "Enter the final repair amount in USD (minimum $1.00):",
        booking.finalAmount?.toString() || ""
      );

      if (amountInput === null) return;

      const amount = Number(amountInput);

      if (
        !Number.isFinite(amount) ||
        amount < 1 ||
        Math.round(amount * 100) / 100 !== amount
      ) {
        setError(
          "Final repair amount must be at least $1.00 USD with a maximum of 2 decimal places."
        );
        return;
      }

      finalAmount = amount;
    }

    const confirmed = window.confirm(
      `Are you sure you want to change this booking from "${formatStatus(
        booking.status
      )}" to "${formatStatus(newStatus)}"?`
    );

    if (!confirmed) return;

    try {
      setActionLoading(booking._id);
      setError("");
      setSuccessMessage("");

      const token = await getTokenFromClient();

      if (!token) {
        throw new Error(
          "Your session has expired. Please sign in again."
        );
      }

      const response = await fetch(
        `${API_URL}/api/admin/bookings/${booking._id}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            status: newStatus,
            ...(finalAmount !== undefined && { finalAmount }),
          }),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Unable to update booking status."
        );
      }

      const updatedBooking: Booking = {
        ...booking,
        status: newStatus,
        updatedAt: new Date().toISOString(),
        ...(newStatus === "completed" && {
          finalAmount,
          paymentStatus: "unpaid",
        }),
      };

      setBookings((previous) =>
        previous.map((item) =>
          item._id === booking._id ? updatedBooking : item
        )
      );

      if (selectedBooking?._id === booking._id) {
        setSelectedBooking(updatedBooking);
      }

      setSuccessMessage(
        `Booking ${formatStatus(newStatus)} successfully.`
      );
    } catch (err) {
      console.error("Update booking status error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to update booking status."
      );
    } finally {
      setActionLoading(null);
    }
  };

  // ========================================
  // RESET FILTERS
  // ========================================

  const clearFilters = () => {
    setSearch("");
    setActiveFilter("all");
    setPaymentFilter("all");
  };

  // ========================================
  // RENDER
  // ========================================

  return (
    <div className="space-y-6 pb-10">
      {/* Page Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-2">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <ClipboardList size={22} />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Bookings Management
            </h1>

            <p className="mt-1 text-sm text-muted">
              Monitor and manage all customer repair bookings.
            </p>
          </div>
        </div>

        <button
          onClick={() => fetchBookings(true)}
          disabled={refreshing}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-surface px-4 py-2.5 text-sm font-medium text-foreground transition hover:bg-surface-secondary disabled:cursor-not-allowed disabled:opacity-60"
        >
          <RefreshCw
            size={16}
            className={refreshing ? "animate-spin" : ""}
          />
          Refresh
        </button>
      </div>

      {/* Feedback Messages */}
      {error && (
        <div className="flex items-start gap-3 rounded-xl border border-red-500/20 bg-red-500/5 p-4 text-sm text-red-600">
          <AlertCircle size={19} className="mt-0.5 shrink-0" />

          <p className="flex-1">{error}</p>

          <button
            onClick={() => setError("")}
            className="shrink-0"
            aria-label="Dismiss error"
          >
            <X size={17} />
          </button>
        </div>
      )}

      {successMessage && (
        <div className="flex items-center gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 text-sm text-emerald-600">
          <CheckCircle2 size={19} />

          <p className="flex-1">{successMessage}</p>

          <button
            onClick={() => setSuccessMessage("")}
            aria-label="Dismiss success message"
          >
            <X size={17} />
          </button>
        </div>
      )}

      {/* Statistics */}
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <StatCard
          title="Total Bookings"
          value={stats.total}
          icon={<ClipboardList size={21} />}
          color="text-primary"
          bg="bg-primary/10"
        />

        <StatCard
          title="Requested"
          value={stats.requested}
          icon={<Clock size={21} />}
          color="text-amber-600"
          bg="bg-amber-500/10"
        />

        <StatCard
          title="Accepted"
          value={stats.accepted}
          icon={<CheckCircle2 size={21} />}
          color="text-blue-600"
          bg="bg-blue-500/10"
        />

        <StatCard
          title="In Progress"
          value={stats.inProgress}
          icon={<PlayCircle size={21} />}
          color="text-violet-600"
          bg="bg-violet-500/10"
        />

        <StatCard
          title="Completed"
          value={stats.completed}
          icon={<CheckCircle2 size={21} />}
          color="text-emerald-600"
          bg="bg-emerald-500/10"
        />

        <StatCard
          title="Cancelled"
          value={stats.cancelled}
          icon={<Ban size={21} />}
          color="text-gray-500"
          bg="bg-gray-500/10"
        />

        <StatCard
          title="Paid"
          value={stats.paid}
          icon={<CreditCard size={21} />}
          color="text-emerald-600"
          bg="bg-emerald-500/10"
        />

        <StatCard
          title="Unpaid"
          value={stats.unpaid}
          icon={<Clock size={21} />}
          color="text-amber-600"
          bg="bg-amber-500/10"
        />
      </div>

      {/* Main Content */}
      <div className="overflow-hidden rounded-2xl border border-border bg-surface">
        {/* Search and Filters */}
        <div className="space-y-4 border-b border-border p-4 sm:p-5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-foreground">
                All Bookings
              </h2>

              <p className="mt-1 text-sm text-muted">
                {filteredBookings.length} of {bookings.length} bookings
              </p>
            </div>

            <div className="relative w-full lg:max-w-sm">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
              />

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search customer, technician, service..."
                className="w-full rounded-xl border border-border bg-surface-secondary py-2.5 pl-10 pr-4 text-sm text-foreground outline-none transition placeholder:text-muted focus:border-primary"
              />
            </div>
          </div>

          {/* Booking Status Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <Filter size={16} className="mr-1 text-muted" />

            {statusFilters.map((filter) => {
              const isActive = activeFilter === filter.value;

              const count =
                filter.value === "all"
                  ? stats.total
                  : bookings.filter(
                      (booking) => booking.status === filter.value
                    ).length;

              return (
                <button
                  key={filter.value}
                  onClick={() => setActiveFilter(filter.value)}
                  className={`rounded-lg px-3 py-2 text-sm font-medium capitalize transition ${
                    isActive
                      ? "bg-primary text-white"
                      : "bg-surface-secondary text-muted hover:text-foreground"
                  }`}
                >
                  {filter.label}

                  <span className="ml-2 text-xs opacity-75">
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Payment Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <CreditCard size={16} className="mr-1 text-muted" />

            {paymentFilters.map((filter) => {
              const isActive = paymentFilter === filter.value;

              const count =
                filter.value === "all"
                  ? stats.total
                  : filter.value === "paid"
                    ? stats.paid
                    : stats.unpaid;

              return (
                <button
                  key={filter.value}
                  onClick={() => setPaymentFilter(filter.value)}
                  className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                    isActive
                      ? "bg-primary text-white"
                      : "bg-surface-secondary text-muted hover:text-foreground"
                  }`}
                >
                  {filter.label}

                  <span className="ml-2 text-xs opacity-75">
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="space-y-4 p-5">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="h-20 animate-pulse rounded-xl bg-surface-secondary"
              />
            ))}
          </div>
        ) : filteredBookings.length === 0 ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center px-5 py-16 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-surface-secondary text-muted">
              <ClipboardList size={28} />
            </div>

            <h3 className="text-lg font-semibold text-foreground">
              No bookings found
            </h3>

            <p className="mt-2 max-w-sm text-sm text-muted">
              {search ||
              activeFilter !== "all" ||
              paymentFilter !== "all"
                ? "Try changing your search keywords or filters."
                : "There are currently no bookings available."}
            </p>

            {(search ||
              activeFilter !== "all" ||
              paymentFilter !== "all") && (
              <button
                onClick={clearFilters}
                className="mt-4 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-primary-hover"
              >
                Clear filters
              </button>
            )}
          </div>
        ) : (
          /* Bookings Table */
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1050px] text-left">
              <thead>
                <tr className="border-b border-border bg-surface-secondary/60 text-xs uppercase tracking-wider text-muted">
                  <th className="px-5 py-4 font-semibold">
                    Service
                  </th>

                  <th className="px-5 py-4 font-semibold">
                    Customer
                  </th>

                  <th className="px-5 py-4 font-semibold">
                    Technician
                  </th>

                  <th className="px-5 py-4 font-semibold">
                    Amount
                  </th>

                  <th className="px-5 py-4 font-semibold">
                    Booking Status
                  </th>

                  <th className="px-5 py-4 font-semibold">
                    Payment
                  </th>

                  <th className="px-5 py-4 font-semibold">
                    Created
                  </th>

                  <th className="px-5 py-4 text-right font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-border">
                {filteredBookings.map((booking) => (
                  <tr
                    key={booking._id}
                    className="transition hover:bg-surface-secondary/40"
                  >
                    {/* Service */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <BookingImage booking={booking} />

                        <div className="min-w-0">
                          <p className="max-w-[170px] truncate text-sm font-semibold text-foreground">
                            {booking.serviceTitle}
                          </p>

                          <p className="mt-1 text-xs text-muted">
                            {booking.serviceCategory}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Customer */}
                    <td className="px-5 py-4">
                      <p className="text-sm font-medium text-foreground">
                        {booking.customerName}
                      </p>

                      <p className="mt-1 max-w-[160px] truncate text-xs text-muted">
                        {booking.customerEmail}
                      </p>
                    </td>

                    {/* Technician */}
                    <td className="px-5 py-4">
                      <p className="text-sm font-medium text-foreground">
                        {booking.technicianName}
                      </p>

                      <p className="mt-1 max-w-[160px] truncate text-xs text-muted">
                        {booking.technicianEmail}
                      </p>
                    </td>

                    {/* Amount */}
                    <td className="px-5 py-4">
                      <p className="text-sm font-semibold text-foreground">
                        {formatPrice(
                          booking.finalAmount ?? booking.servicePrice,
                          booking.currency
                        )}
                      </p>

                      <p className="mt-1 text-xs text-muted">
                        {booking.finalAmount !== undefined
                          ? "Final amount"
                          : "Service price"}
                      </p>
                    </td>

                    {/* Booking Status */}
                    <td className="px-5 py-4">
                      <StatusBadge status={booking.status} />
                    </td>

                    {/* Payment */}
                    <td className="px-5 py-4">
                      <PaymentBadge
                        status={booking.paymentStatus}
                      />
                    </td>

                    {/* Created */}
                    <td className="px-5 py-4 text-sm text-muted">
                      {formatDate(booking.createdAt)}
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end">
                        <ActionButton
                          title="View booking details"
                          onClick={() =>
                            setSelectedBooking(booking)
                          }
                        >
                          <Eye size={16} />
                        </ActionButton>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Footer */}
        {!loading && filteredBookings.length > 0 && (
          <div className="border-t border-border px-5 py-4">
            <p className="text-xs text-muted">
              Showing {filteredBookings.length} booking
              {filteredBookings.length !== 1 ? "s" : ""}
            </p>
          </div>
        )}
      </div>

      {/* ========================================
          BOOKING DETAILS MODAL
      ======================================== */}

      {selectedBooking && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
          onClick={() => setSelectedBooking(null)}
        >
          <div
            className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-border bg-surface shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-surface p-5">
              <div>
                <h2 className="text-lg font-bold text-foreground">
                  Booking Details
                </h2>

                <p className="mt-1 text-xs text-muted">
                  Booking ID: {selectedBooking._id}
                </p>
              </div>

              <button
                onClick={() => setSelectedBooking(null)}
                className="rounded-lg p-2 text-muted transition hover:bg-surface-secondary hover:text-foreground"
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-5 p-5">
              {/* Service Image */}
              <div className="overflow-hidden rounded-xl bg-surface-secondary">
                <BookingImage
                  booking={selectedBooking}
                  large
                />
              </div>

              {/* Title and Status */}
              <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                <div>
                  <h3 className="text-xl font-bold text-foreground">
                    {selectedBooking.serviceTitle}
                  </h3>

                  <p className="mt-1 text-sm text-muted">
                    {selectedBooking.serviceCategory}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <StatusBadge status={selectedBooking.status} />

                  <PaymentBadge
                    status={selectedBooking.paymentStatus}
                  />
                </div>
              </div>

              {/* Price Information */}
              <div className="grid grid-cols-1 gap-4 rounded-xl border border-border bg-surface-secondary p-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs text-muted">
                    Original Service Price
                  </p>

                  <p className="mt-1 text-lg font-bold text-foreground">
                    {formatPrice(
                      selectedBooking.servicePrice,
                      selectedBooking.currency
                    )}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-muted">
                    Final Repair Amount
                  </p>

                  <p className="mt-1 text-lg font-bold text-primary">
                    {selectedBooking.finalAmount !== undefined
                      ? formatPrice(
                          selectedBooking.finalAmount,
                          selectedBooking.currency
                        )
                      : "Not set yet"}
                  </p>
                </div>
              </div>

              {/* Customer Information */}
              <div className="rounded-xl border border-border p-4">
                <div className="mb-3 flex items-center gap-2">
                  <UserRound
                    size={18}
                    className="text-primary"
                  />

                  <h4 className="text-sm font-semibold text-foreground">
                    Customer Information
                  </h4>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <DetailItem
                    icon={<UserRound size={17} />}
                    label="Customer Name"
                    value={selectedBooking.customerName}
                  />

                  <DetailItem
                    icon={<Mail size={17} />}
                    label="Email"
                    value={selectedBooking.customerEmail}
                  />

                  <DetailItem
                    icon={<Phone size={17} />}
                    label="Phone Number"
                    value={selectedBooking.customerPhone}
                  />

                  <DetailItem
                    icon={<MapPin size={17} />}
                    label="Address"
                    value={selectedBooking.address}
                  />
                </div>
              </div>

              {/* Technician Information */}
              <div className="rounded-xl border border-border p-4">
                <div className="mb-3 flex items-center gap-2">
                  <Wrench size={18} className="text-primary" />

                  <h4 className="text-sm font-semibold text-foreground">
                    Technician Information
                  </h4>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <DetailItem
                    icon={<UserRound size={17} />}
                    label="Technician Name"
                    value={selectedBooking.technicianName}
                  />

                  <DetailItem
                    icon={<Mail size={17} />}
                    label="Technician Email"
                    value={selectedBooking.technicianEmail}
                  />
                </div>
              </div>

              {/* Problem Description */}
              <div>
                <h4 className="mb-2 text-sm font-semibold text-foreground">
                  Problem Description
                </h4>

                <p className="whitespace-pre-wrap rounded-xl border border-border bg-surface-secondary p-4 text-sm leading-6 text-muted">
                  {selectedBooking.problemDescription || "N/A"}
                </p>
              </div>

              {/* Booking Information */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <DetailItem
                  icon={<CalendarDays size={17} />}
                  label="Preferred Date"
                  value={formatDate(
                    selectedBooking.preferredDate
                  )}
                />

                <DetailItem
                  icon={<CalendarDays size={17} />}
                  label="Booking Created"
                  value={formatDateTime(
                    selectedBooking.createdAt
                  )}
                />

                <DetailItem
                  icon={<Clock size={17} />}
                  label="Last Updated"
                  value={formatDateTime(
                    selectedBooking.updatedAt
                  )}
                />

                <DetailItem
                  icon={<CreditCard size={17} />}
                  label="Payment Date"
                  value={formatDateTime(
                    selectedBooking.paidAt
                  )}
                />
              </div>

              {/* Admin Status Actions */}
              <div className="border-t border-border pt-5">
                <div className="mb-3">
                  <h4 className="text-sm font-semibold text-foreground">
                    Manage Booking Status
                  </h4>

                  <p className="mt-1 text-xs text-muted">
                    Choose an available action for this booking.
                  </p>
                </div>

                {selectedBooking.paymentStatus === "paid" ? (
                  <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 text-sm text-emerald-600">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 size={18} />

                      <span className="font-semibold">
                        Payment completed
                      </span>
                    </div>

                    <p className="mt-1 text-xs">
                      This booking is already paid. Status changes
                      are disabled to protect the payment record.
                    </p>
                  </div>
                ) : allowedTransitions[selectedBooking.status]
                    .length === 0 ? (
                  <div className="rounded-xl border border-border bg-surface-secondary p-4 text-sm text-muted">
                    This booking has reached its final status.
                    No further status changes are available.
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {allowedTransitions[selectedBooking.status].map(
                      (nextStatus) => {
                        const isLoading =
                          actionLoading === selectedBooking._id;

                        const isDangerous = [
                          "rejected",
                          "cancelled",
                        ].includes(nextStatus);

                        return (
                          <button
                            key={nextStatus}
                            type="button"
                            onClick={() =>
                              handleStatusUpdate(
                                selectedBooking,
                                nextStatus
                              )
                            }
                            disabled={isLoading}
                            className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${
                              isDangerous
                                ? "border border-red-500/20 text-red-600 hover:bg-red-500/10"
                                : "bg-primary text-white hover:bg-primary-hover"
                            }`}
                          >
                            {isLoading ? (
                              <RefreshCw
                                size={16}
                                className="animate-spin"
                              />
                            ) : nextStatus === "accepted" ? (
                              <CheckCircle2 size={16} />
                            ) : nextStatus === "rejected" ? (
                              <XCircle size={16} />
                            ) : nextStatus === "in-progress" ? (
                              <PlayCircle size={16} />
                            ) : nextStatus === "completed" ? (
                              <CheckCircle2 size={16} />
                            ) : (
                              <Ban size={16} />
                            )}

                            <span className="capitalize">
                              {formatStatus(nextStatus)}
                            </span>

                            <ArrowRight size={14} />
                          </button>
                        );
                      }
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ========================================
// REUSABLE COMPONENTS
// ========================================

function StatCard({
  title,
  value,
  icon,
  color,
  bg,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  bg: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-4 sm:p-5">
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-medium text-muted sm:text-sm">
          {title}
        </p>

        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${bg} ${color}`}
        >
          {icon}
        </div>
      </div>

      <p className="mt-3 text-2xl font-bold tabular-nums text-foreground sm:text-3xl">
        {value}
      </p>
    </div>
  );
}

function StatusBadge({
  status,
}: {
  status: BookingStatus;
}) {
  const icons: Record<BookingStatus, React.ReactNode> = {
    requested: <Clock size={13} />,
    accepted: <CheckCircle2 size={13} />,
    rejected: <XCircle size={13} />,
    "in-progress": <PlayCircle size={13} />,
    completed: <CheckCircle2 size={13} />,
    cancelled: <Ban size={13} />,
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-semibold capitalize ${
        statusStyles[status] ||
        "bg-gray-500/10 text-gray-500"
      }`}
    >
      {icons[status]}
      {formatStatus(status)}
    </span>
  );
}

function PaymentBadge({
  status,
}: {
  status: PaymentStatus;
}) {
  const isPaid = status === "paid";

  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-semibold capitalize ${
        isPaid
          ? "bg-emerald-500/10 text-emerald-600"
          : "bg-amber-500/10 text-amber-600"
      }`}
    >
      {isPaid ? (
        <CheckCircle2 size={13} />
      ) : (
        <Clock size={13} />
      )}

      {status || "unpaid"}
    </span>
  );
}

function BookingImage({
  booking,
  large = false,
}: {
  booking: Booking;
  large?: boolean;
}) {
  const [imageError, setImageError] = useState(false);

  if (!booking.serviceImage || imageError) {
    return (
      <div
        className={`flex shrink-0 items-center justify-center rounded-xl bg-surface-secondary text-muted ${
          large ? "h-48 w-full" : "h-14 w-14"
        }`}
      >
        <ImageIcon size={large ? 36 : 22} />
      </div>
    );
  }

  return (
    <img
      src={booking.serviceImage}
      alt={booking.serviceTitle || "Service"}
      onError={() => setImageError(true)}
      className={
        large
          ? "h-48 w-full object-cover"
          : "h-14 w-14 shrink-0 rounded-xl border border-border object-cover"
      }
    />
  );
}

function ActionButton({
  children,
  title,
  onClick,
}: {
  children: React.ReactNode;
  title: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      onClick={onClick}
      className="flex h-9 w-9 items-center justify-center rounded-lg bg-surface-secondary text-muted transition hover:text-foreground"
    >
      {children}
    </button>
  );
}

function DetailItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 text-primary">{icon}</div>

      <div className="min-w-0">
        <p className="text-xs text-muted">{label}</p>

        <p className="mt-1 break-words text-sm font-medium text-foreground">
          {value || "N/A"}
        </p>
      </div>
    </div>
  );
}
