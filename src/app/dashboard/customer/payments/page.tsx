
"use client";

import { useEffect, useMemo, useState } from "react";
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
  serviceName?: string;
  serviceTitle?: string;
  bookingId?: string;
  serviceRequestId?: string;
  customerEmail?: string;
  createdAt?: string;
  updatedAt?: string;
}

type PaymentStatus = "all" | "success" | "pending" | "failed";

const getPaymentStatus = (payment: Payment): string => {
  const status = (
    payment.paymentStatus || payment.status || "pending"
  ).toLowerCase();

  if (["success", "successful", "paid", "completed"].includes(status)) {
    return "success";
  }

  if (["failed", "cancelled", "canceled", "rejected"].includes(status)) {
    return "failed";
  }

  return "pending";
};

const statusStyles: Record<string, string> = {
  success: "bg-success/10 text-success",
  pending: "bg-warning/10 text-warning",
  failed: "bg-danger/10 text-danger",
};

const statusLabels: Record<string, string> = {
  success: "Successful",
  pending: "Pending",
  failed: "Failed",
};

const formatDate = (date?: string) => {
  if (!date) return "Not available";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) return date;

  return parsedDate.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const formatTime = (date?: string) => {
  if (!date) return "Not available";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) return "";

  return parsedDate.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getAmount = (payment: Payment) =>
  Number(payment.amount ?? payment.totalAmount ?? 0);

const formatAmount = (payment: Payment) => {
  const amount = getAmount(payment);
  const currency = payment.currency || "BDT";

  return new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(amount);
};

const getTransactionId = (payment: Payment) =>
  payment.transactionId ||
  payment.transactionID ||
  payment.paymentIntentId ||
  payment._id;

const getPaymentMethod = (payment: Payment) =>
  payment.paymentMethod || payment.method || "Not specified";

const getServiceName = (payment: Payment) =>
  payment.serviceName || payment.serviceTitle || "Repair Service";

export default function CustomerPaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState<PaymentStatus>("all");
  const [selectedPayment, setSelectedPayment] =
    useState<Payment | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  // Fetch customer payment history
  useEffect(() => {
    let ignore = false;

    const loadPayments = async () => {
      try {
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
              "Content-Type": "application/json",
            },
            cache: "no-store",
          }
        );

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(
            result.message || "Failed to load payment history."
          );
        }

        if (!ignore) {
          setPayments(
            Array.isArray(result.data) ? result.data : []
          );
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

    loadPayments();

    return () => {
      ignore = true;
    };
  }, [refreshKey]);

  // Refresh payment history
  const handleRefresh = () => {
    setLoading(true);
    setRefreshKey((previous) => previous + 1);
  };

  // Payment statistics
  const stats = useMemo(() => {
    const successful = payments.filter(
      (payment) => getPaymentStatus(payment) === "success"
    );

    const pending = payments.filter(
      (payment) => getPaymentStatus(payment) === "pending"
    );

    const failed = payments.filter(
      (payment) => getPaymentStatus(payment) === "failed"
    );

    const totalPaid = successful.reduce(
      (total, payment) => total + getAmount(payment),
      0
    );

    return {
      totalPayments: payments.length,
      successful: successful.length,
      pending: pending.length,
      failed: failed.length,
      totalPaid,
    };
  }, [payments]);

  // Search and filter
  const filteredPayments = useMemo(() => {
    return payments.filter((payment) => {
      const searchValue = search.toLowerCase();

      const matchesSearch = [
        getServiceName(payment),
        getTransactionId(payment),
        getPaymentMethod(payment),
        payment.bookingId,
        payment.serviceRequestId,
      ].some((value) =>
        value?.toLowerCase().includes(searchValue)
      );

      const paymentStatus = getPaymentStatus(payment);

      const matchesStatus =
        statusFilter === "all" ||
        paymentStatus === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [payments, search, statusFilter]);

  return (
    <div className="space-y-7 text-foreground">

      {/* Page Heading */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            My Payments
          </h2>

          <p className="mt-1 text-sm text-muted">
            View your payment history and track transaction details.
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

      {/* Payment Statistics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

        {/* Total Paid */}
        <div className="rounded-2xl border border-border bg-surface p-5 shadow-card transition hover:-translate-y-0.5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted">
                Total Paid
              </p>

              <h3 className="mt-2 text-2xl font-bold">
                {loading
                  ? "..."
                  : new Intl.NumberFormat("en-BD", {
                      style: "currency",
                      currency: "BDT",
                      maximumFractionDigits: 0,
                    }).format(stats.totalPaid)}
              </h3>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Wallet size={23} />
            </div>
          </div>
        </div>

        {/* Total Payments */}
        <div className="rounded-2xl border border-border bg-surface p-5 shadow-card transition hover:-translate-y-0.5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted">
                Total Transactions
              </p>

              <h3 className="mt-2 text-3xl font-bold">
                {loading ? "..." : stats.totalPayments}
              </h3>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent text-primary">
              <Receipt size={23} />
            </div>
          </div>
        </div>

        {/* Successful */}
        <div className="rounded-2xl border border-border bg-surface p-5 shadow-card transition hover:-translate-y-0.5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted">
                Successful
              </p>

              <h3 className="mt-2 text-3xl font-bold">
                {loading ? "..." : stats.successful}
              </h3>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-success/10 text-success">
              <CheckCircle2 size={23} />
            </div>
          </div>
        </div>

        {/* Pending */}
        <div className="rounded-2xl border border-border bg-surface p-5 shadow-card transition hover:-translate-y-0.5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted">
                Pending
              </p>

              <h3 className="mt-2 text-3xl font-bold">
                {loading ? "..." : stats.pending}
              </h3>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-warning/10 text-warning">
              <Clock size={23} />
            </div>
          </div>
        </div>
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
              placeholder="Search transaction, service, payment method..."
              className="w-full rounded-xl border border-input bg-surface px-4 py-3 pl-11 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/20"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value as PaymentStatus)
            }
            className="rounded-xl border border-input bg-surface px-4 py-3 text-sm text-foreground outline-none transition focus:border-ring md:w-48"
          >
            <option value="all">All Payments</option>
            <option value="success">Successful</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </select>
        </div>
      </div>

      {/* Payment History */}
      <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-card">

        <div className="flex items-center justify-between border-b border-border px-5 py-5">
          <div>
            <h3 className="font-bold">
              Payment History
            </h3>

            <p className="mt-1 text-xs text-muted">
              {filteredPayments.length} transaction(s) found
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
              Unable to load payments
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

        ) : filteredPayments.length === 0 ? (

          /* Empty State */
          <div className="flex flex-col items-center px-5 py-16 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent text-primary">
              <CreditCard size={30} />
            </div>

            <h3 className="mt-5 text-lg font-bold">
              {payments.length === 0
                ? "No payment history yet"
                : "No matching transactions"}
            </h3>

            <p className="mt-2 max-w-sm text-sm text-muted">
              {payments.length === 0
                ? "Your completed and pending payment transactions will appear here."
                : "Try changing your search or payment status filter."}
            </p>

            {payments.length === 0 && (
              <Link
                href="/services"
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground transition hover:bg-primary-hover"
              >
                Browse Services
                <ArrowUpRight size={17} />
              </Link>
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
                      Transaction
                    </th>

                    <th className="px-6 py-4 font-semibold">
                      Service
                    </th>

                    <th className="px-6 py-4 font-semibold">
                      Amount
                    </th>

                    <th className="px-6 py-4 font-semibold">
                      Payment Method
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
                  {filteredPayments.map((payment) => {
                    const status = getPaymentStatus(payment);

                    return (
                      <tr
                        key={payment._id}
                        className="transition hover:bg-surface-hover"
                      >
                        <td className="px-6 py-5">
                          <p className="font-semibold">
                            #{getTransactionId(payment).slice(-8)}
                          </p>

                          <p className="mt-1 text-xs text-muted">
                            Transaction ID
                          </p>
                        </td>

                        <td className="px-6 py-5">
                          <p className="text-sm font-medium">
                            {getServiceName(payment)}
                          </p>
                        </td>

                        <td className="px-6 py-5 text-sm font-bold">
                          {formatAmount(payment)}
                        </td>

                        <td className="px-6 py-5 text-sm text-muted">
                          {getPaymentMethod(payment)}
                        </td>

                        <td className="px-6 py-5 text-sm text-muted">
                          {formatDate(payment.createdAt)}
                        </td>

                        <td className="px-6 py-5">
                          <span
                            className={`rounded-full px-3 py-1.5 text-xs font-semibold ${statusStyles[status]}`}
                          >
                            {statusLabels[status]}
                          </span>
                        </td>

                        <td className="px-6 py-5">
                          <button
                            onClick={() =>
                              setSelectedPayment(payment)
                            }
                            className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition hover:text-primary-hover"
                          >
                            <Eye size={16} />
                            Details
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="space-y-4 p-4 md:hidden">
              {filteredPayments.map((payment) => {
                const status = getPaymentStatus(payment);

                return (
                  <div
                    key={payment._id}
                    className="rounded-xl border border-border bg-surface p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent text-primary">
                          <CreditCard size={21} />
                        </div>

                        <div className="min-w-0">
                          <h4 className="truncate font-bold">
                            {getServiceName(payment)}
                          </h4>

                          <p className="mt-1 text-xs text-muted">
                            #{getTransactionId(payment).slice(-8)}
                          </p>
                        </div>
                      </div>

                      <span
                        className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyles[status]}`}
                      >
                        {statusLabels[status]}
                      </span>
                    </div>

                    <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
                      <div>
                        <p className="text-xs text-muted">
                          Amount
                        </p>

                        <p className="mt-1 text-lg font-bold">
                          {formatAmount(payment)}
                        </p>
                      </div>

                      <button
                        onClick={() =>
                          setSelectedPayment(payment)
                        }
                        className="inline-flex items-center gap-1.5 rounded-lg border border-primary/30 px-3 py-2 text-sm font-semibold text-primary transition hover:bg-primary/10"
                      >
                        <Eye size={16} />
                        Details
                      </button>
                    </div>

                    <p className="mt-3 flex items-center gap-2 text-xs text-muted">
                      <CalendarDays size={14} />
                      {formatDate(payment.createdAt)}
                    </p>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* Payment Details Modal */}
      {selectedPayment && (
        <div
          onClick={() => setSelectedPayment(null)}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-border bg-surface shadow-card"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-border p-5">
              <div>
                <h3 className="text-lg font-bold">
                  Payment Details
                </h3>

                <p className="mt-1 text-xs text-muted">
                  Transaction information
                </p>
              </div>

              <button
                onClick={() => setSelectedPayment(null)}
                className="rounded-full p-2 text-muted transition hover:bg-surface-hover"
                aria-label="Close payment details"
              >
                <X size={21} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="space-y-5 p-5">

              {/* Amount */}
              <div className="rounded-xl bg-surface-secondary p-5 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Wallet size={24} />
                </div>

                <p className="mt-3 text-sm text-muted">
                  Payment Amount
                </p>

                <h2 className="mt-1 text-3xl font-bold">
                  {formatAmount(selectedPayment)}
                </h2>

                <span
                  className={`mt-3 inline-flex rounded-full px-3 py-1.5 text-xs font-semibold ${statusStyles[getPaymentStatus(selectedPayment)]}`}
                >
                  {statusLabels[getPaymentStatus(selectedPayment)]}
                </span>
              </div>

              {/* Details */}
              <div className="space-y-4">

                <PaymentDetailItem
                  icon={<Hash size={18} />}
                  label="Transaction ID"
                  value={getTransactionId(selectedPayment)}
                />

                <PaymentDetailItem
                  icon={<Receipt size={18} />}
                  label="Service"
                  value={getServiceName(selectedPayment)}
                />

                <PaymentDetailItem
                  icon={<CreditCard size={18} />}
                  label="Payment Method"
                  value={getPaymentMethod(selectedPayment)}
                />

                <PaymentDetailItem
                  icon={<CalendarDays size={18} />}
                  label="Payment Date"
                  value={formatDate(selectedPayment.createdAt)}
                />

                <PaymentDetailItem
                  icon={<Clock size={18} />}
                  label="Payment Time"
                  value={formatTime(selectedPayment.createdAt)}
                />

                {selectedPayment.bookingId && (
                  <PaymentDetailItem
                    icon={<Receipt size={18} />}
                    label="Booking ID"
                    value={selectedPayment.bookingId}
                  />
                )}

                {selectedPayment.serviceRequestId && (
                  <PaymentDetailItem
                    icon={<Receipt size={18} />}
                    label="Service Request ID"
                    value={selectedPayment.serviceRequestId}
                  />
                )}
              </div>

              {/* Payment Status Message */}
              <div className="rounded-xl border border-border bg-surface-secondary p-4">
                <div className="flex items-start gap-3">
                  {getPaymentStatus(selectedPayment) === "success" ? (
                    <CheckCircle2
                      size={20}
                      className="shrink-0 text-success"
                    />
                  ) : getPaymentStatus(selectedPayment) === "failed" ? (
                    <XCircle
                      size={20}
                      className="shrink-0 text-danger"
                    />
                  ) : (
                    <Clock
                      size={20}
                      className="shrink-0 text-warning"
                    />
                  )}

                  <p className="text-sm leading-6 text-muted">
                    {getPaymentStatus(selectedPayment) === "success"
                      ? "This payment has been marked as successful."
                      : getPaymentStatus(selectedPayment) === "failed"
                        ? "This payment has been marked as failed."
                        : "This payment is currently pending confirmation."}
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="border-t border-border p-5">
              <button
                onClick={() => setSelectedPayment(null)}
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

// Reusable payment detail item
function PaymentDetailItem({
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

      <div className="min-w-0 flex-1">
        <p className="text-xs text-muted">
          {label}
        </p>

        <p className="mt-1 break-all text-sm font-medium text-foreground">
          {value || "Not available"}
        </p>
      </div>
    </div>
  );
}
