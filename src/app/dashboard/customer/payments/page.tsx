
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  Search,
  RefreshCw,
  CreditCard,
  Wallet,
  Clock,
  CheckCircle2,
  XCircle,
  Receipt,
  CalendarDays,
  Hash,
  X,
  Eye,
  AlertCircle,
  ArrowUpRight,
} from "lucide-react";

import { getTokenFromClient } from "@/lib/(getToken)/getTokenFromClient";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface Payment {
  _id: string;
  amount?: number;
  totalAmount?: number;
  currency?: string;
  status?: string;
  paymentStatus?: string;
  paymentMethod?: string;
  method?: string;
  transactionId?: string;
  transactionID?: string;
  paymentIntentId?: string;
  stripeSessionId?: string;
  serviceName?: string;
  serviceTitle?: string;
  bookingId?: string;
  serviceRequestId?: string;
  customerEmail?: string;
  createdAt?: string;
  updatedAt?: string;
  paidAt?: string;
}

interface ApiResponse {
  success: boolean;
  message?: string;
  payments?: Payment[];
  data?: Payment[] | { payments?: Payment[] };
}
// ------------------------------------
// Payment status helper
// ------------------------------------
function getPaymentStatus(payment: Payment) {
  const status = (
    payment.paymentStatus ||
    payment.status ||
    "pending"
  ).toLowerCase();

  if (
    ["paid", "success", "successful", "completed"].includes(status)
  ) {
    return "success";
  }

  if (
    ["failed", "cancelled", "canceled", "rejected"].includes(status)
  ) {
    return "failed";
  }

  return "pending";
}

// ------------------------------------
// Status badge component
// ------------------------------------
function StatusBadge({ payment }: { payment: Payment }) {
  const status = getPaymentStatus(payment);

  if (status === "success") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700 dark:bg-green-500/10 dark:text-green-400">
        <CheckCircle2 size={14} />
        Paid
      </span>
    );
  }

  if (status === "failed") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700 dark:bg-red-500/10 dark:text-red-400">
        <XCircle size={14} />
        Failed
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400">
      <Clock size={14} />
      Pending
    </span>
  );
}
export default function CustomerPaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [selectedPayment, setSelectedPayment] =
    useState<Payment | null>(null);

  const [refreshKey, setRefreshKey] = useState(0);

  // Stripe verification states
  const verifiedSessionRef = useRef<string | null>(null);
  const [verificationLoading, setVerificationLoading] = useState(false);
  const [verificationMessage, setVerificationMessage] = useState("");
  const [verificationError, setVerificationError] = useState("");

  // ------------------------------------
  // Fetch customer payment history
  // ------------------------------------
  useEffect(() => {
    let isMounted = true;

    const fetchPayments = async () => {
      try {
        setLoading(true);
        setError("");

        if (!API_URL) {
          throw new Error("API URL is not configured.");
        }

        const token = await getTokenFromClient();

        const response = await fetch(
          `${API_URL}/api/payments/customer`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            cache: "no-store",
          }
        );

        const result: ApiResponse = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(
            result.message || "Unable to load payment history."
          );
        }

        const paymentData = Array.isArray(result.payments)
          ? result.payments
          : Array.isArray(result.data)
            ? result.data
            : result.data?.payments || [];

        if (isMounted) {
          setPayments(paymentData);
        }
      } catch (err) {
        if (isMounted) {
          setError(
            err instanceof Error
              ? err.message
              : "Something went wrong."
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchPayments();

    return () => {
      isMounted = false;
    };
  }, [refreshKey]);

  // ------------------------------------
  // Verify Stripe Checkout payment
  // ------------------------------------
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    const payment = params.get("payment");
    const sessionId = params.get("session_id");

    if (payment !== "success" || !sessionId) return;

    if (verifiedSessionRef.current === sessionId) return;

    verifiedSessionRef.current = sessionId;

    const verifyPayment = async () => {
      try {
        setVerificationLoading(true);
        setVerificationMessage("");
        setVerificationError("");

        if (!API_URL) {
          throw new Error("API URL is not configured.");
        }

        const token = await getTokenFromClient();

        const response = await fetch(
          `${API_URL}/api/payments/verify-session`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ sessionId }),
          }
        );

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(
            result.message || "Payment verification failed."
          );
        }

        setVerificationMessage(
          "Your payment was successful and has been verified!"
        );

        // Refresh payment history
        setRefreshKey((previous) => previous + 1);

        // Remove payment query parameters from URL
        window.history.replaceState(
          {},
          "",
          window.location.pathname
        );
      } catch (err) {
        setVerificationError(
          err instanceof Error
            ? err.message
            : "Unable to verify payment."
        );

        verifiedSessionRef.current = null;
      } finally {
        setVerificationLoading(false);
      }
    };

    verifyPayment();
  }, []);

  // ------------------------------------
  // Payment helper functions
  // ------------------------------------
  const getPaymentStatus = (payment: Payment) => {
    const status = (
      payment.paymentStatus ||
      payment.status ||
      "pending"
    ).toLowerCase();

    if (
      ["paid", "success", "successful", "completed"].includes(status)
    ) {
      return "success";
    }

    if (
      ["failed", "cancelled", "canceled", "rejected"].includes(status)
    ) {
      return "failed";
    }

    return "pending";
  };

  const getAmount = (payment: Payment) => {
    return Number(payment.amount ?? payment.totalAmount ?? 0);
  };

  const formatAmount = (payment: Payment) => {
    const amount = getAmount(payment);
    const currency = (payment.currency || "BDT").toUpperCase();

    try {
      return new Intl.NumberFormat("en-BD", {
        style: "currency",
        currency,
        maximumFractionDigits: 2,
      }).format(amount);
    } catch {
      return `${currency} ${amount.toFixed(2)}`;
    }
  };

  const getTransactionId = (payment: Payment) => {
    return (
      payment.transactionId ||
      payment.transactionID ||
      payment.paymentIntentId ||
      payment.stripeSessionId ||
      payment._id
    );
  };

  const getPaymentMethod = (payment: Payment) => {
    return payment.paymentMethod || payment.method || "Card";
  };

  const getServiceName = (payment: Payment) => {
    return (
      payment.serviceName ||
      payment.serviceTitle ||
      "Repair Service"
    );
  };

  const formatDate = (date?: string) => {
    if (!date) return "Not available";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "Not available";
    }

    return parsedDate.toLocaleString("en-BD", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // ------------------------------------
  // Payment statistics
  // ------------------------------------
  const stats = useMemo(() => {
    const successfulPayments = payments.filter(
      (payment) => getPaymentStatus(payment) === "success"
    );

    const pendingPayments = payments.filter(
      (payment) => getPaymentStatus(payment) === "pending"
    );

    const totalPaid = successfulPayments.reduce(
      (total, payment) => total + getAmount(payment),
      0
    );

    return {
      totalPaid,
      transactions: payments.length,
      successful: successfulPayments.length,
      pending: pendingPayments.length,
    };
  }, [payments]);

  // ------------------------------------
  // Search and filter payments
  // ------------------------------------
  const filteredPayments = useMemo(() => {
    return payments.filter((payment) => {
      const searchValue = search.toLowerCase();

      const matchesSearch =
        getServiceName(payment).toLowerCase().includes(searchValue) ||
        getTransactionId(payment).toLowerCase().includes(searchValue) ||
        (payment.bookingId || payment.serviceRequestId || "")
          .toLowerCase()
          .includes(searchValue);

      const matchesStatus =
        statusFilter === "all" ||
        getPaymentStatus(payment) === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [payments, search, statusFilter]);

 

  return (
    <div className="space-y-8 pb-10">
      {/* Page heading */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="mb-2 text-sm font-medium text-primary">
            Customer Dashboard
          </p>

          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Payment History
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            Manage and track all your repair service payments.
          </p>
        </div>

        <button
          onClick={() => setRefreshKey((previous) => previous + 1)}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
        >
          <RefreshCw
            size={16}
            className={loading ? "animate-spin" : ""}
          />
          Refresh
        </button>
      </div>

      {/* Stripe verification messages */}
      {verificationLoading && (
        <div className="flex items-center gap-3 rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-700 dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-300">
          <RefreshCw size={19} className="animate-spin" />
          Verifying your Stripe payment...
        </div>
      )}

      {verificationMessage && (
        <div className="flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700 dark:border-green-500/20 dark:bg-green-500/10 dark:text-green-400">
          <CheckCircle2 size={20} />
          <span>{verificationMessage}</span>
        </div>
      )}

      {verificationError && (
        <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400">
          <AlertCircle size={20} />
          <div className="flex-1">
            <p className="font-semibold">Payment verification failed</p>
            <p className="mt-1">{verificationError}</p>
          </div>
        </div>
      )}

      {/* General error */}
      {error && (
        <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400">
          <AlertCircle size={20} />
          <span>{error}</span>
          <button
            onClick={() => setRefreshKey((previous) => previous + 1)}
            className="ml-auto font-semibold underline"
          >
            Try again
          </button>
        </div>
      )}

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border bg-card p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">
                Total Paid
              </p>
              <h2 className="mt-2 text-2xl font-bold">
                {stats.totalPaid.toLocaleString("en-BD", {
                  style: "currency",
                  currency: "BDT",
                  maximumFractionDigits: 2,
                })}
              </h2>
            </div>
            <div className="rounded-xl bg-green-100 p-3 text-green-700 dark:bg-green-500/10 dark:text-green-400">
              <Wallet size={22} />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border bg-card p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">
                Transactions
              </p>
              <h2 className="mt-2 text-2xl font-bold">
                {stats.transactions}
              </h2>
            </div>
            <div className="rounded-xl bg-blue-100 p-3 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400">
              <Receipt size={22} />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border bg-card p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">
                Successful Payments
              </p>
              <h2 className="mt-2 text-2xl font-bold">
                {stats.successful}
              </h2>
            </div>
            <div className="rounded-xl bg-green-100 p-3 text-green-700 dark:bg-green-500/10 dark:text-green-400">
              <CheckCircle2 size={22} />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border bg-card p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">
                Pending Payments
              </p>
              <h2 className="mt-2 text-2xl font-bold">
                {stats.pending}
              </h2>
            </div>
            <div className="rounded-xl bg-yellow-100 p-3 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400">
              <Clock size={22} />
            </div>
          </div>
        </div>
      </div>

      {/* Payment history */}
      <div className="overflow-hidden rounded-2xl border bg-card">
        <div className="border-b p-5">
          <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
            <div>
              <h2 className="text-lg font-semibold">
                All Transactions
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                View your payment records and transaction details.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              {/* Search */}
              <div className="relative">
                <Search
                  size={17}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
                <input
                  type="text"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search payments..."
                  className="w-full rounded-xl border bg-background py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-primary sm:w-64"
                />
              </div>

              {/* Status filter */}
              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                className="rounded-xl border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary"
              >
                <option value="all">All Payments</option>
                <option value="success">Paid</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="space-y-4 p-5">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-16 animate-pulse rounded-xl bg-muted"
              />
            ))}
          </div>
        ) : filteredPayments.length === 0 ? (
          /* Empty state */
          <div className="flex flex-col items-center justify-center px-5 py-16 text-center">
            <div className="mb-4 rounded-2xl bg-muted p-5">
              <CreditCard
                size={35}
                className="text-muted-foreground"
              />
            </div>

            <h3 className="text-lg font-semibold">
              {payments.length === 0
                ? "No payments yet"
                : "No payments found"}
            </h3>

            <p className="mt-2 max-w-sm text-sm text-muted-foreground">
              {payments.length === 0
                ? "Your completed repair service payments will appear here."
                : "Try changing your search or status filter."}
            </p>

            {payments.length === 0 && (
              <Link
                href="/dashboard/customer/bookings"
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
              >
                View My Bookings
                <ArrowUpRight size={16} />
              </Link>
            )}
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full text-left text-sm">
                <thead className="bg-muted/50 text-muted-foreground">
                  <tr>
                    <th className="px-5 py-4 font-medium">
                      Service
                    </th>
                    <th className="px-5 py-4 font-medium">
                      Transaction ID
                    </th>
                    <th className="px-5 py-4 font-medium">
                      Amount
                    </th>
                    <th className="px-5 py-4 font-medium">
                      Payment Date
                    </th>
                    <th className="px-5 py-4 font-medium">
                      Status
                    </th>
                    <th className="px-5 py-4 text-right font-medium">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y">
                  {filteredPayments.map((payment) => (
                    <tr
                      key={payment._id}
                      className="transition hover:bg-muted/30"
                    >
                      <td className="px-5 py-4">
                        <p className="font-semibold">
                          {getServiceName(payment)}
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          Booking:{" "}
                          {payment.bookingId ||
                            payment.serviceRequestId ||
                            "N/A"}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <span className="font-mono text-xs text-muted-foreground">
                          {getTransactionId(payment).slice(0, 18)}
                          ...
                        </span>
                      </td>

                      <td className="px-5 py-4 font-semibold">
                        {formatAmount(payment)}
                      </td>

                      <td className="px-5 py-4 text-muted-foreground">
                        {formatDate(payment.paidAt || payment.createdAt)}
                      </td>

                      <td className="px-5 py-4">
                        <StatusBadge payment={payment} />
                      </td>

                      <td className="px-5 py-4 text-right">
                        <button
                          onClick={() => setSelectedPayment(payment)}
                          className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-semibold transition hover:bg-muted"
                        >
                          <Eye size={15} />
                          Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile payment cards */}
            <div className="divide-y md:hidden">
              {filteredPayments.map((payment) => (
                <div key={payment._id} className="space-y-4 p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="rounded-xl bg-primary/10 p-3 text-primary">
                        <CreditCard size={20} />
                      </div>

                      <div>
                        <h3 className="font-semibold">
                          {getServiceName(payment)}
                        </h3>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {formatDate(payment.paidAt || payment.createdAt)}
                        </p>
                      </div>
                    </div>

                    <StatusBadge payment={payment} />
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Amount
                    </span>
                    <span className="text-lg font-bold">
                      {formatAmount(payment)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <span className="text-xs text-muted-foreground">
                      Transaction ID
                    </span>
                    <span className="max-w-[180px] truncate font-mono text-xs">
                      {getTransactionId(payment)}
                    </span>
                  </div>

                  <button
                    onClick={() => setSelectedPayment(payment)}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border py-2.5 text-sm font-semibold transition hover:bg-muted"
                  >
                    <Eye size={16} />
                    View Payment Details
                  </button>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Results count */}
        {!loading && filteredPayments.length > 0 && (
          <div className="border-t px-5 py-4 text-xs text-muted-foreground">
            Showing {filteredPayments.length} of {payments.length} transactions
          </div>
        )}
      </div>

      {/* Payment details modal */}
      {selectedPayment && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
          onClick={() => setSelectedPayment(null)}
        >
          <div
            className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border bg-card shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b p-5">
              <div>
                <h2 className="text-lg font-bold">
                  Payment Details
                </h2>
                <p className="mt-1 text-xs text-muted-foreground">
                  Transaction information
                </p>
              </div>

              <button
                onClick={() => setSelectedPayment(null)}
                className="rounded-lg p-2 transition hover:bg-muted"
                aria-label="Close payment details"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-5 p-5">
              <div className="rounded-2xl bg-primary/5 p-5 text-center">
                <p className="text-sm text-muted-foreground">
                  Payment Amount
                </p>

                <h3 className="mt-2 text-3xl font-bold">
                  {formatAmount(selectedPayment)}
                </h3>

                <div className="mt-3 flex justify-center">
                  <StatusBadge payment={selectedPayment} />
                </div>
              </div>

              <div className="space-y-4">
                <PaymentDetailItem
                  icon={<Receipt size={17} />}
                  label="Service"
                  value={getServiceName(selectedPayment)}
                />

                <PaymentDetailItem
                  icon={<Hash size={17} />}
                  label="Transaction ID"
                  value={getTransactionId(selectedPayment)}
                />

                <PaymentDetailItem
                  icon={<Hash size={17} />}
                  label="Booking ID"
                  value={
                    selectedPayment.bookingId ||
                    selectedPayment.serviceRequestId ||
                    "N/A"
                  }
                />

                <PaymentDetailItem
                  icon={<CreditCard size={17} />}
                  label="Payment Method"
                  value={getPaymentMethod(selectedPayment)}
                />

                <PaymentDetailItem
                  icon={<CalendarDays size={17} />}
                  label="Payment Date"
                  value={formatDate(
                    selectedPayment.paidAt ||
                      selectedPayment.createdAt
                  )}
                />

                <PaymentDetailItem
                  icon={<Clock size={17} />}
                  label="Last Updated"
                  value={formatDate(selectedPayment.updatedAt)}
                />
              </div>
            </div>

            <div className="border-t p-5">
              <button
                onClick={() => setSelectedPayment(null)}
                className="w-full rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
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

// ------------------------------------
// Reusable payment detail item
// ------------------------------------
function PaymentDetailItem({
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
      <div className="mt-0.5 rounded-lg bg-muted p-2 text-muted-foreground">
        {icon}
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="mt-1 break-all text-sm font-medium">{value}</p>
      </div>
    </div>
  );
}
