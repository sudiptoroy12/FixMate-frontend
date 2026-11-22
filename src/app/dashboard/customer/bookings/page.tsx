
"use client";

import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import {
  Search,
  RefreshCw,
  CalendarDays,
  MapPin,
  Phone,
  Wrench,
  UserRound,
  X,
  ClipboardList,
  AlertCircle,
  Eye,
  CreditCard,
  Ban,
  Clock,
  CheckCircle2,
} from "lucide-react";

import { getTokenFromClient } from "@/lib/(getToken)/getTokenFromClient";
import Link from "next/link";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

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

type PaymentStatus = "unpaid" | "paid";

interface Booking {
  _id: string;
  serviceId: string;
  serviceTitle: string;

  // Support the actual backend field
  serviceCategory?: string;
  category?: string;

  servicePrice: number;
  currency?: "USD";
  serviceImage?: string;
  technicianName: string;
  technicianEmail: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  problemDescription: string;
  address: string;
  preferredDate: string;
  status: BookingStatus;
  finalAmount?: number;
  paymentStatus: PaymentStatus;
  createdAt: string;
  updatedAt?: string;
}

// ========================================
// STATUS STYLES
// ========================================
const getBookingCategory = (booking: Booking) =>
  booking.serviceCategory || booking.category || "Not provided";

const statusStyles: Record<BookingStatus, string> = {
  requested: "bg-warning/10 text-warning",
  accepted: "bg-primary/10 text-primary",
  rejected: "bg-danger/10 text-danger",
  "in-progress": "bg-accent text-primary",
  completed: "bg-success/10 text-success",
  cancelled: "bg-surface-secondary text-muted",
};

const statusLabels: Record<BookingStatus, string> = {
  requested: "Requested",
  accepted: "Accepted",
  rejected: "Rejected",
  "in-progress": "In Progress",
  completed: "Completed",
  cancelled: "Cancelled",
};

// ========================================
// FORMAT HELPERS
// ========================================

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

// USD currency formatter
const formatMoney = (amount?: number) => {
  if (
    amount === undefined ||
    amount === null ||
    !Number.isFinite(Number(amount))
  ) {
    return "Not set yet";
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(amount));
};

// Validate USD amounts
const isValidUsdAmount = (amount?: number) => {
  if (
    amount === undefined ||
    amount === null ||
    !Number.isFinite(Number(amount)) ||
    Number(amount) < 1 ||
    Math.round(Number(amount) * 100) / 100 !== Number(amount)
  ) {
    return false;
  }

  return true;
};

// ========================================
// MAIN CUSTOMER BOOKINGS PAGE
// ========================================

export default function CustomerBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [selectedBooking, setSelectedBooking] =
    useState<Booking | null>(null);

  const [cancelingId, setCancelingId] = useState<string | null>(null);
  const [payingId, setPayingId] = useState<string | null>(null);

  const [refreshKey, setRefreshKey] = useState(0);

  // ========================================
  // FETCH CUSTOMER BOOKINGS
  // ========================================

  useEffect(() => {
    let ignore = false;

    const loadBookings = async () => {
      try {
        setError("");

        if (!API_URL) {
          throw new Error("API URL is not configured.");
        }

        const token = await getTokenFromClient();

        if (!token) {
          throw new Error("Please sign in to view your bookings.");
        }

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

  // ========================================
  // REFRESH BOOKINGS
  // ========================================

  const handleRefresh = () => {
    setLoading(true);
    setRefreshKey((previous) => previous + 1);
  };

  // ========================================
  // CANCEL BOOKING
  // ========================================

  const handleCancelBooking = async (booking: Booking) => {
    if (booking.status !== "requested") {
      setActionError("Only requested bookings can be cancelled.");
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to cancel this repair request?"
    );

    if (!confirmed) return;

    try {
      setCancelingId(booking._id);
      setActionError("");

      if (!API_URL) {
        throw new Error("API URL is not configured.");
      }

      const token = await getTokenFromClient();

      if (!token) {
        throw new Error("Please sign in again.");
      }

      const response = await fetch(
        `${API_URL}/api/service-requests/${booking._id}/cancel`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Failed to cancel this request."
        );
      }

      const updatedBooking: Booking = {
        ...booking,
        status: "cancelled",
        updatedAt: new Date().toISOString(),
      };

      setBookings((previous) =>
        previous.map((item) =>
          item._id === booking._id ? updatedBooking : item
        )
      );

      setSelectedBooking((previous) =>
        previous?._id === booking._id ? updatedBooking : previous
      );
    } catch (err) {
      setActionError(
        err instanceof Error
          ? err.message
          : "Something went wrong while cancelling."
      );
    } finally {
      setCancelingId(null);
    }
  };

  // ========================================
  // STRIPE PAYMENT
  // ========================================

  const handlePayment = async (booking: Booking) => {
    if (payingId) return;
    if (booking.status !== "completed") {
      setActionError("Only completed bookings can be paid.");
      return;
    }

    if (booking.paymentStatus === "paid") {
      setActionError("This booking has already been paid.");
      return;
    }

    if (!isValidUsdAmount(booking.finalAmount)) {
      setActionError(
        "The final repair amount must be at least $1.00 USD with a maximum of 2 decimal places."
      );
      return;
    }

    try {
      setPayingId(booking._id);
      setActionError("");

      if (!API_URL) {
        throw new Error("API URL is not configured.");
      }

      const token = await getTokenFromClient();

      if (!token) {
        throw new Error("Please sign in again.");
      }

      const response = await fetch(
        `${API_URL}/api/payments/create-checkout-session`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            bookingId: booking._id,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Unable to create payment session."
        );
      }

      if (!result.url) {
        throw new Error("Stripe Checkout URL was not returned.");
      }

      // Redirect to Stripe Checkout
      window.location.assign(result.url);
    } catch (err) {
      setActionError(
        err instanceof Error
          ? err.message
          : "Something went wrong while processing payment."
      );

      setPayingId(null);
    }
  };

  // ========================================
  // SEARCH AND FILTER BOOKINGS
  // ========================================

  const filteredBookings = useMemo(() => {
    return bookings.filter((booking) => {
      const searchValue = search.toLowerCase();

      const matchesSearch = [
        booking.serviceTitle,
        booking.category,
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

  // ========================================
  // STATISTICS
  // ========================================

  const stats = [
    {
      label: "Total Bookings",
      value: bookings.length,
      icon: ClipboardList,
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      label: "Requested",
      value: bookings.filter((b) => b.status === "requested").length,
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
      icon: CheckCircle2,
      color: "text-success",
      bg: "bg-success/10",
    },
  ];

  // ========================================
  // RENDER
  // ========================================

  return (
    <div className="space-y-7 text-foreground">
      {/* PAGE HEADING */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            My Bookings
          </h2>

          <p className="mt-1 text-sm text-muted">
            Track and manage all your repair service requests.
          </p>
        </div>

        <button
          onClick={handleRefresh}
          disabled={loading}
          className="flex items-center justify-center gap-2 rounded-xl border border-border bg-surface px-4 py-2.5 text-sm font-semibold transition hover:bg-surface-hover disabled:cursor-not-allowed disabled:opacity-50"
        >
          <RefreshCw
            size={17}
            className={loading ? "animate-spin" : ""}
          />
          Refresh
        </button>
      </div>

      {/* ACTION ERROR */}
      {actionError && (
        <div className="flex items-start gap-3 rounded-xl border border-danger/20 bg-danger/5 p-4 text-sm text-danger">
          <AlertCircle size={18} className="mt-0.5 shrink-0" />

          <p className="flex-1">{actionError}</p>

          <button
            onClick={() => setActionError("")}
            aria-label="Dismiss error"
          >
            <X size={17} />
          </button>
        </div>
      )}

      {/* STATISTICS */}
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
                  <p className="text-sm text-muted">{stat.label}</p>

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

      {/* SEARCH AND FILTER */}
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
              placeholder="Search by service, category, technician, or ID..."
              className="w-full rounded-xl border border-input bg-surface px-4 py-3 pl-11 text-sm outline-none transition placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/20"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-input bg-surface px-4 py-3 text-sm outline-none transition focus:border-ring md:w-48"
          >
            <option value="all">All Status</option>
            <option value="requested">Requested</option>
            <option value="accepted">Accepted</option>
            <option value="rejected">Rejected</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* BOOKING HISTORY */}
      <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-card">
        <div className="flex items-center justify-between border-b border-border px-5 py-5">
          <div>
            <h3 className="font-bold">Booking History</h3>

            <p className="mt-1 text-xs text-muted">
              {filteredBookings.length} booking(s) found
            </p>
          </div>
        </div>

        {/* LOADING */}
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
          /* ERROR STATE */
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
          /* EMPTY STATE */
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
                ? "You haven't requested any repair services yet. Explore our services to get started."
                : "Try changing your search or status filter."}
            </p>

            {bookings.length === 0 && (
              <Link
                href="/services"
                className="mt-5 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground transition hover:bg-primary-hover"
              >
                Browse Services
              </Link>
            )}
          </div>
        ) : (
          <>
            {/* DESKTOP TABLE */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full text-left">
                <thead className="bg-surface-secondary text-xs uppercase tracking-wider text-muted">
                  <tr>
                    <th className="px-6 py-4 font-semibold">
                      Service
                    </th>
                    <th className="px-6 py-4 font-semibold">
                      Category
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
                          {booking.serviceTitle || "Repair Service"}
                        </p>

                        <p className="mt-1 text-xs text-muted">
                          #{booking._id.slice(-8)}
                        </p>
                      </td>

                      <td className="px-6 py-5 text-sm text-muted">
                        {getBookingCategory(booking)}
                      </td>

                      <td className="px-6 py-5 text-sm text-muted">
                        {booking.technicianName || "Not assigned"}
                      </td>

                      <td className="px-6 py-5 text-sm text-muted">
                        {formatDate(booking.preferredDate)}
                      </td>

                      <td className="px-6 py-5">
                        <span
                          className={`rounded-full px-3 py-1.5 text-xs font-semibold ${statusStyles[booking.status]}`}
                        >
                          {statusLabels[booking.status]}
                        </span>
                      </td>

                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => {
                              setActionError("");
                              setSelectedBooking(booking);
                            }}
                            className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition hover:text-primary-hover"
                          >
                            <Eye size={16} />
                            Details
                          </button>

                          {booking.status === "completed" &&
                            booking.paymentStatus === "unpaid" && (
                              <button
                                onClick={() => handlePayment(booking)}
                                disabled={payingId !== null}
                                className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                {payingId === booking._id ? (
                                  <>
                                    <RefreshCw
                                      size={14}
                                      className="animate-spin"
                                    />
                                    Processing...
                                  </>
                                ) : (
                                  <>
                                    <CreditCard size={14} />
                                    Pay Now
                                  </>
                                )}
                              </button>
                            )}

                          {booking.status === "completed" &&
                            booking.paymentStatus === "paid" && (
                              <span className="inline-flex items-center gap-1 text-xs font-semibold text-success">
                                <CheckCircle2 size={14} />
                                Paid
                              </span>
                            )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* MOBILE CARDS */}
            <div className="space-y-4 p-4 md:hidden">
              {filteredBookings.map((booking) => (
                <div
                  key={booking._id}
                  className="rounded-xl border border-border bg-surface p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h4 className="font-bold">
                        {booking.serviceTitle || "Repair Service"}
                      </h4>

                      <p className="mt-1 text-xs text-muted">
                        #{booking._id.slice(-8)}
                      </p>
                    </div>

                    <span
                      className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyles[booking.status]}`}
                    >
                      {statusLabels[booking.status]}
                    </span>
                  </div>

                  <div className="mt-4 space-y-3 text-sm text-muted">
                    <p className="flex items-center gap-2">
                      <Wrench size={16} />
                      {booking.category || "Category not provided"}
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

                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={() => {
                        setActionError("");
                        setSelectedBooking(booking);
                      }}
                      className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-primary/30 py-2.5 text-sm font-semibold text-primary transition hover:bg-primary/10"
                    >
                      <Eye size={16} />
                      Details
                    </button>

                    {booking.status === "completed" &&
                      booking.paymentStatus === "unpaid" && (
                        <button
                          onClick={() => handlePayment(booking)}
                         disabled={payingId !== null}
  
                          className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary-hover disabled:opacity-50"
                        >
                          {payingId === booking._id ? (
                            <RefreshCw
                              size={16}
                              className="animate-spin"
                            />
                          ) : (
                            <CreditCard size={16} />
                          )}

                          {payingId === booking._id
                            ? "Processing..."
                            : "Pay Now"}
                        </button>
                      )}

                    {booking.status === "completed" &&
                      booking.paymentStatus === "paid" && (
                        <span className="flex flex-1 items-center justify-center gap-1 rounded-lg bg-success/10 py-2.5 text-sm font-semibold text-success">
                          <CheckCircle2 size={16} />
                          Paid
                        </span>
                      )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* ========================================
          BOOKING DETAILS MODAL
      ======================================== */}

      {selectedBooking && (
        <div
          onClick={() => setSelectedBooking(null)}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl border border-border bg-surface shadow-card"
          >
            {/* MODAL HEADER */}
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

            {/* MODAL CONTENT */}
            <div className="space-y-5 p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h4 className="font-bold">
                  {selectedBooking.serviceTitle || "Repair Service"}
                </h4>

                <span
                  className={`rounded-full px-3 py-1.5 text-xs font-semibold ${statusStyles[selectedBooking.status]}`}
                >
                  {statusLabels[selectedBooking.status]}
                </span>
              </div>

              {/* PROBLEM DESCRIPTION */}
              <div className="rounded-xl bg-surface-secondary p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted">
                  Problem Description
                </p>

                <p className="mt-2 text-sm leading-6">
                  {selectedBooking.problemDescription || "Not provided"}
                </p>
              </div>

              {/* BOOKING INFORMATION */}
              <div className="grid gap-5 sm:grid-cols-2">
                <DetailItem
                  icon={<Wrench size={18} />}
                  label="Category"
                  value={selectedBooking.category}
                />

                <DetailItem
                  icon={<CreditCard size={18} />}
                  label="Service Price"
                  value={formatMoney(selectedBooking.servicePrice)}
                />

                <DetailItem
                  icon={<UserRound size={18} />}
                  label="Technician"
                  value={selectedBooking.technicianName}
                />

                <DetailItem
                  icon={<CalendarDays size={18} />}
                  label="Preferred Date"
                  value={formatDate(selectedBooking.preferredDate)}
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

              {/* PAYMENT INFORMATION */}
              {selectedBooking.status === "completed" && (
                <div className="rounded-xl border border-border p-4">
                  <h4 className="font-semibold">
                    Payment Information
                  </h4>

                  <div className="mt-3 flex items-center justify-between gap-3">
                    <span className="text-sm text-muted">
                      Final Repair Amount
                    </span>

                    <span className="font-bold">
                      {formatMoney(selectedBooking.finalAmount)}
                    </span>
                  </div>

                  <div className="mt-3 flex items-center justify-between gap-3">
                    <span className="text-sm text-muted">
                      Payment Status
                    </span>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        selectedBooking.paymentStatus === "paid"
                          ? "bg-success/10 text-success"
                          : "bg-warning/10 text-warning"
                      }`}
                    >
                      {selectedBooking.paymentStatus === "paid"
                        ? "Paid"
                        : "Unpaid"}
                    </span>
                  </div>

                  {/* PAY NOW BUTTON */}
                  {selectedBooking.paymentStatus === "unpaid" && (
                    <div className="mt-4">
                      <p className="mb-3 text-xs text-muted">
                        Your repair is complete. Please complete your
                        payment to finish the booking.
                      </p>

                      <button
                        onClick={() => handlePayment(selectedBooking)}
                        disabled={
                          payingId === selectedBooking._id ||
                          !isValidUsdAmount(selectedBooking.finalAmount)
                        }
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-bold text-primary-foreground transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {payingId === selectedBooking._id ? (
                          <>
                            <RefreshCw
                              size={17}
                              className="animate-spin"
                            />
                            Redirecting to Stripe...
                          </>
                        ) : (
                          <>
                            <CreditCard size={17} />
                            Pay Now{" "}
                            {formatMoney(selectedBooking.finalAmount)}
                          </>
                        )}
                      </button>
                    </div>
                  )}

                  {/* PAID MESSAGE */}
                  {selectedBooking.paymentStatus === "paid" && (
                    <div className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-success/10 py-3 text-sm font-semibold text-success">
                      <CheckCircle2 size={18} />
                      Payment Completed
                    </div>
                  )}
                </div>
              )}

              {/* CREATED DATE */}
              <div className="border-t border-border pt-4">
                <p className="text-xs text-muted">
                  Booking created: {formatDate(selectedBooking.createdAt)}
                </p>
              </div>
            </div>

            {/* MODAL FOOTER */}
            <div className="space-y-3 border-t border-border p-5">
              {/* CANCEL REQUEST */}
              {selectedBooking.status === "requested" && (
                <button
                  onClick={() => handleCancelBooking(selectedBooking)}
                  disabled={cancelingId === selectedBooking._id}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-danger/30 bg-danger/5 py-3 text-sm font-semibold text-danger transition hover:bg-danger/10 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {cancelingId === selectedBooking._id ? (
                    <>
                      <RefreshCw
                        size={17}
                        className="animate-spin"
                      />
                      Cancelling...
                    </>
                  ) : (
                    <>
                      <Ban size={17} />
                      Cancel Request
                    </>
                  )}
                </button>
              )}

              {/* CANCELLED MESSAGE */}
              {selectedBooking.status === "cancelled" && (
                <div className="flex items-center justify-center gap-2 rounded-xl bg-surface-secondary py-3 text-sm font-medium text-muted">
                  <Ban size={17} />
                  This request has been cancelled.
                </div>
              )}

              {/* CLOSE */}
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

// ========================================
// REUSABLE DETAIL ITEM
// ========================================

function DetailItem({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value?: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 text-primary">{icon}</div>

      <div className="min-w-0">
        <p className="text-xs text-muted">{label}</p>

        <p className="mt-1 break-words text-sm font-medium">
          {value || "Not provided"}
        </p>
      </div>
    </div>
  );
}
