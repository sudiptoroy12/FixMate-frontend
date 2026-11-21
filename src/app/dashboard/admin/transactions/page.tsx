
"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Search,
  RefreshCw,
  DollarSign,
  CreditCard,
  CheckCircle2,
  Clock,
  Eye,
  X,
  Receipt,
  CalendarDays,
  UserRound,
  Wrench,
  Hash,
  AlertCircle,
  ArrowUpRight,
  Wallet,
} from "lucide-react";

import { getTokenFromClient } from "@/lib/(getToken)/getTokenFromClient";

const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");

type Payment = {
  _id: string;
  bookingId: string;
  serviceTitle: string;
  customerName: string;
  customerEmail: string;
  technicianName: string;
  technicianEmail: string;
  amount: number;
  currency: string;
  transactionId: string;
  stripeSessionId?: string;
  paymentStatus: "paid" | "unpaid" | "failed" | string;
  paymentMethod: string;
  paidAt?: string;
  createdAt: string;
};

type FilterType = "all" | "paid" | "unpaid" | "failed";

export default function AdminTransactionsPage() {
  const [transactions, setTransactions] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterType>("all");
  const [selectedTransaction, setSelectedTransaction] =
    useState<Payment | null>(null);

  const fetchTransactions = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const token = await getTokenFromClient();

      if (!token) {
        throw new Error("Authentication token not found. Please sign in again.");
      }

      const response = await fetch(`${API_URL}/api/admin/transactions`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Failed to fetch transactions."
        );
      }

      const data = Array.isArray(result.data) ? result.data : [];

      setTransactions(data);

      if (isRefresh) {
        setSuccess("Transactions refreshed successfully.");
        setTimeout(() => setSuccess(""), 3000);
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while loading transactions."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const loadTransactions = async () => {
      try {
        const token = await getTokenFromClient();

        if (!token) {
          throw new Error("Authentication token not found. Please sign in again.");
        }

        const response = await fetch(`${API_URL}/api/admin/transactions`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          cache: "no-store",
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(
            result.message || "Failed to fetch transactions."
          );
        }

        if (isMounted) {
          setTransactions(
            Array.isArray(result.data) ? result.data : []
          );
        }
      } catch (err) {
        if (isMounted) {
          setError(
            err instanceof Error
              ? err.message
              : "Something went wrong while loading transactions."
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadTransactions();

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredTransactions = useMemo(() => {
    return transactions.filter((transaction) => {
      const searchValue = search.toLowerCase();

      const matchesSearch =
        transaction.transactionId?.toLowerCase().includes(searchValue) ||
        transaction.bookingId?.toLowerCase().includes(searchValue) ||
        transaction.customerName?.toLowerCase().includes(searchValue) ||
        transaction.customerEmail?.toLowerCase().includes(searchValue) ||
        transaction.technicianName?.toLowerCase().includes(searchValue) ||
        transaction.serviceTitle?.toLowerCase().includes(searchValue);

      const matchesFilter =
        filter === "all" || transaction.paymentStatus === filter;

      return matchesSearch && matchesFilter;
    });
  }, [transactions, search, filter]);

  const totalRevenue = transactions
    .filter((transaction) => transaction.paymentStatus === "paid")
    .reduce((total, transaction) => total + Number(transaction.amount || 0), 0);

  const paidTransactions = transactions.filter(
    (transaction) => transaction.paymentStatus === "paid"
  ).length;

  const pendingTransactions = transactions.filter(
    (transaction) => transaction.paymentStatus === "unpaid"
  ).length;

  const failedTransactions = transactions.filter(
    (transaction) => transaction.paymentStatus === "failed"
  ).length;

  const formatCurrency = (amount: number, currency = "USD") => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency.toUpperCase(),
    }).format(Number(amount || 0));
  };

  const formatDate = (date?: string) => {
    if (!date) return "N/A";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) return "N/A";

    return parsedDate.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Receipt size={24} />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Transactions Management
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Monitor payments, revenue, and transaction history.
            </p>
          </div>
        </div>

        <button
          onClick={() => fetchTransactions(true)}
          disabled={refreshing}
          className="flex items-center justify-center gap-2 rounded-xl border border-border bg-surface px-4 py-2.5 text-sm font-medium text-foreground transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-60"
        >
          <RefreshCw
            size={16}
            className={refreshing ? "animate-spin" : ""}
          />
          Refresh
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-600">
          <AlertCircle size={18} />
          {error}
        </div>
      )}

      {/* Success Message */}
      {success && (
        <div className="flex items-center gap-2 rounded-xl border border-green-500/20 bg-green-500/10 p-4 text-sm text-green-600">
          <CheckCircle2 size={18} />
          {success}
        </div>
      )}

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Revenue"
          value={formatCurrency(totalRevenue)}
          description="From successful payments"
          icon={<DollarSign size={21} />}
          color="green"
          loading={loading}
        />

        <StatCard
          title="Total Transactions"
          value={transactions.length}
          description="All recorded transactions"
          icon={<CreditCard size={21} />}
          color="blue"
          loading={loading}
        />

        <StatCard
          title="Successful Payments"
          value={paidTransactions}
          description="Completed payments"
          icon={<CheckCircle2 size={21} />}
          color="green"
          loading={loading}
        />

        <StatCard
          title="Pending / Failed"
          value={pendingTransactions + failedTransactions}
          description={`${pendingTransactions} pending · ${failedTransactions} failed`}
          icon={<Clock size={21} />}
          color="orange"
          loading={loading}
        />
      </div>

      {/* Transactions Table */}
      <div className="overflow-hidden rounded-2xl border border-border bg-surface">
        {/* Search and Filters */}
        <div className="flex flex-col gap-4 border-b border-border p-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              All Transactions
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {filteredTransactions.length} transactions found
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative">
              <Search
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search transactions..."
                className="w-full rounded-xl border border-border bg-background py-2.5 pl-10 pr-4 text-sm text-foreground outline-none transition focus:border-primary sm:w-64"
              />
            </div>

            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as FilterType)}
              className="rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none focus:border-primary"
            >
              <option value="all">All Payments</option>
              <option value="paid">Paid</option>
              <option value="unpaid">Unpaid</option>
              <option value="failed">Failed</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1050px] text-left">
            <thead className="bg-muted/40">
              <tr className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <th className="px-5 py-4">Transaction</th>
                <th className="px-5 py-4">Customer</th>
                <th className="px-5 py-4">Service</th>
                <th className="px-5 py-4">Amount</th>
                <th className="px-5 py-4">Method</th>
                <th className="px-5 py-4">Date</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4 text-right">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-border">
              {loading ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <tr key={index}>
                    {Array.from({ length: 8 }).map((_, cell) => (
                      <td key={cell} className="px-5 py-5">
                        <div className="h-4 w-24 animate-pulse rounded bg-muted" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-5 py-16 text-center">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-muted text-muted-foreground">
                      <Receipt size={25} />
                    </div>

                    <h3 className="mt-4 font-semibold text-foreground">
                      No transactions found
                    </h3>

                    <p className="mt-1 text-sm text-muted-foreground">
                      {search || filter !== "all"
                        ? "Try changing your search or filter."
                        : "There are no transactions available yet."}
                    </p>
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((transaction) => (
                  <tr
                    key={transaction._id}
                    className="transition hover:bg-muted/30"
                  >
                    <td className="px-5 py-4">
                      <p className="font-semibold text-foreground">
                        {transaction.transactionId || "N/A"}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Booking: {transaction.bookingId || "N/A"}
                      </p>
                    </td>

                    <td className="px-5 py-4">
                      <p className="font-medium text-foreground">
                        {transaction.customerName || "N/A"}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {transaction.customerEmail || "N/A"}
                      </p>
                    </td>

                    <td className="px-5 py-4">
                      <p className="max-w-[180px] truncate font-medium text-foreground">
                        {transaction.serviceTitle || "N/A"}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        By {transaction.technicianName || "N/A"}
                      </p>
                    </td>

                    <td className="px-5 py-4">
                      <p className="font-bold text-foreground">
                        {formatCurrency(
                          transaction.amount,
                          transaction.currency
                        )}
                      </p>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2 text-sm text-foreground">
                        <CreditCard size={15} className="text-muted-foreground" />
                        {transaction.paymentMethod || "N/A"}
                      </div>
                    </td>

                    <td className="px-5 py-4 text-sm text-muted-foreground">
                      {formatDate(
                        transaction.paidAt || transaction.createdAt
                      )}
                    </td>

                    <td className="px-5 py-4">
                      <StatusBadge status={transaction.paymentStatus} />
                    </td>

                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={() => setSelectedTransaction(transaction)}
                        title="View transaction details"
                        className="inline-flex items-center justify-center rounded-lg border border-border p-2 text-muted-foreground transition hover:border-primary hover:bg-primary/10 hover:text-primary"
                      >
                        <Eye size={17} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        {!loading && transactions.length > 0 && (
          <div className="flex flex-col justify-between gap-2 border-t border-border px-5 py-4 text-sm text-muted-foreground sm:flex-row">
            <span>
              Showing {filteredTransactions.length} of {transactions.length} transactions
            </span>
            <span>
              Total successful revenue:{" "}
              <strong className="text-foreground">
                {formatCurrency(totalRevenue)}
              </strong>
            </span>
          </div>
        )}
      </div>

      {/* Transaction Details Modal */}
      {selectedTransaction && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4 backdrop-blur-sm"
          onClick={() => setSelectedTransaction(null)}
        >
          <div
            className="my-auto w-full max-w-2xl overflow-hidden rounded-2xl border border-border bg-surface shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-border p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Receipt size={22} />
                </div>

                <div>
                  <h2 className="font-bold text-foreground">
                    Transaction Details
                  </h2>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Complete payment information
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedTransaction(null)}
                className="rounded-lg p-2 text-muted-foreground transition hover:bg-muted hover:text-foreground"
              >
                <X size={20} />
              </button>
            </div>

            <div className="max-h-[75vh] space-y-6 overflow-y-auto p-5">
              {/* Amount */}
              <div className="rounded-xl border border-primary/20 bg-primary/5 p-5 text-center">
                <p className="text-sm text-muted-foreground">
                  Transaction Amount
                </p>

                <h3 className="mt-2 text-3xl font-bold text-primary">
                  {formatCurrency(
                    selectedTransaction.amount,
                    selectedTransaction.currency
                  )}
                </h3>

                <div className="mt-3 flex justify-center">
                  <StatusBadge status={selectedTransaction.paymentStatus} />
                </div>
              </div>

              {/* Transaction Information */}
              <div>
                <h3 className="mb-3 flex items-center gap-2 font-semibold text-foreground">
                  <Hash size={17} className="text-primary" />
                  Payment Information
                </h3>

                <div className="grid gap-4 rounded-xl border border-border p-4 sm:grid-cols-2">
                  <DetailItem
                    label="Transaction ID"
                    value={selectedTransaction.transactionId}
                  />
                  <DetailItem
                    label="Booking ID"
                    value={selectedTransaction.bookingId}
                  />
                  <DetailItem
                    label="Payment Method"
                    value={selectedTransaction.paymentMethod}
                  />
                  <DetailItem
                    label="Payment Status"
                    value={selectedTransaction.paymentStatus}
                  />
                  <DetailItem
                    label="Currency"
                    value={selectedTransaction.currency?.toUpperCase()}
                  />
                  <DetailItem
                    label="Payment Date"
                    value={formatDate(
                      selectedTransaction.paidAt ||
                        selectedTransaction.createdAt
                    )}
                  />
                  {selectedTransaction.stripeSessionId && (
                    <div className="sm:col-span-2">
                      <DetailItem
                        label="Stripe Session ID"
                        value={selectedTransaction.stripeSessionId}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Service Information */}
              <div>
                <h3 className="mb-3 flex items-center gap-2 font-semibold text-foreground">
                  <Wrench size={17} className="text-primary" />
                  Service Information
                </h3>

                <div className="rounded-xl border border-border p-4">
                  <DetailItem
                    label="Service Name"
                    value={selectedTransaction.serviceTitle}
                  />
                </div>
              </div>

              {/* Customer and Technician */}
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <h3 className="mb-3 flex items-center gap-2 font-semibold text-foreground">
                    <UserRound size={17} className="text-primary" />
                    Customer
                  </h3>

                  <div className="space-y-3 rounded-xl border border-border p-4">
                    <DetailItem
                      label="Name"
                      value={selectedTransaction.customerName}
                    />
                    <DetailItem
                      label="Email"
                      value={selectedTransaction.customerEmail}
                    />
                  </div>
                </div>

                <div>
                  <h3 className="mb-3 flex items-center gap-2 font-semibold text-foreground">
                    <UserRound size={17} className="text-primary" />
                    Technician
                  </h3>

                  <div className="space-y-3 rounded-xl border border-border p-4">
                    <DetailItem
                      label="Name"
                      value={selectedTransaction.technicianName}
                    />
                    <DetailItem
                      label="Email"
                      value={selectedTransaction.technicianEmail}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end border-t border-border p-5">
              <button
                onClick={() => setSelectedTransaction(null)}
                className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
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

/* ----------------------------------
   Statistics Card
---------------------------------- */

function StatCard({
  title,
  value,
  description,
  icon,
  color,
  loading,
}: {
  title: string;
  value: string | number;
  description: string;
  icon: React.ReactNode;
  color: "green" | "blue" | "orange";
  loading: boolean;
}) {
  const colors = {
    green: "bg-green-500/10 text-green-600",
    blue: "bg-blue-500/10 text-blue-600",
    orange: "bg-orange-500/10 text-orange-600",
  };

  return (
    <div className="rounded-2xl border border-border bg-surface p-5 transition hover:shadow-md">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          {loading ? (
            <div className="mt-2 h-8 w-28 animate-pulse rounded bg-muted" />
          ) : (
            <h3 className="mt-2 text-2xl font-bold text-foreground">
              {value}
            </h3>
          )}
        </div>

        <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${colors[color]}`}>
          {icon}
        </div>
      </div>

      <p className="mt-3 text-xs text-muted-foreground">{description}</p>
    </div>
  );
}

/* ----------------------------------
   Status Badge
---------------------------------- */

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    paid: "bg-green-500/10 text-green-600",
    unpaid: "bg-amber-500/10 text-amber-600",
    failed: "bg-red-500/10 text-red-600",
    refunded: "bg-purple-500/10 text-purple-600",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold capitalize ${
        styles[status?.toLowerCase()] ||
        "bg-muted text-muted-foreground"
      }`}
    >
      {status || "Unknown"}
    </span>
  );
}

/* ----------------------------------
   Detail Item
---------------------------------- */

function DetailItem({
  label,
  value,
}: {
  label: string;
  value?: string | number;
}) {
  return (
    <div className="min-w-0">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 break-all text-sm font-medium text-foreground">
        {value || "N/A"}
      </p>
    </div>
  );
}
