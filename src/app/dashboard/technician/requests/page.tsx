
"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import { toast } from "react-toastify";

import {
  Search,
  ClipboardList,
  Clock,
  CheckCircle,
  Eye,
  RefreshCw,
  MapPin,
  CalendarDays,
  Loader2,
  X,
  Phone,
  Mail,
  CreditCard,
} from "lucide-react";

import { getTokenFromClient } from "@/lib/(getToken)/getTokenFromClient";

interface ServiceRequest {
  _id: string;
  serviceId: string;
  serviceTitle: string;
  serviceCategory: string;
  servicePrice: number;
  serviceImage?: string;

  customerName: string;
  customerEmail: string;
  customerPhone: string;

  problemDescription: string;
  address: string;
  preferredDate: string;

  status:
    | "requested"
    | "accepted"
    | "rejected"
    | "in-progress"
    | "completed";

  paymentStatus: "unpaid" | "paid";
  finalAmount?: number;

  createdAt: string;
  updatedAt: string;
}

type FilterStatus = "all" | ServiceRequest["status"];

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const statusStyles: Record<ServiceRequest["status"], string> = {
  requested: "bg-amber-100 text-amber-700",
  accepted: "bg-blue-100 text-blue-700",
  rejected: "bg-red-100 text-red-700",
  "in-progress": "bg-purple-100 text-purple-700",
  completed: "bg-green-100 text-green-700",
};

const paymentStyles: Record<ServiceRequest["paymentStatus"], string> = {
  unpaid: "bg-amber-100 text-amber-700",
  paid: "bg-green-100 text-green-700",
};

export default function TechnicianRequestsPage() {
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterStatus>("all");
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [selectedRequest, setSelectedRequest] =
    useState<ServiceRequest | null>(null);
    const [finalAmount, setFinalAmount] = useState("");

  // Fetch technician requests
 const fetchRequests = useCallback(async () => {
  try {
    if (!API_URL) {
      throw new Error("API URL is not configured.");
    }

    const token = await getTokenFromClient();

    const response = await fetch(
      `${API_URL}/api/service-requests/technician`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      }
    );

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(
        result.message || "Failed to fetch service requests."
      );
    }

    setRequests(result.data || []);
  } catch (error) {
    console.error("Fetch requests error:", error);

    toast.error(
      error instanceof Error
        ? error.message
        : "Something went wrong!"
    );
  } finally {
    setLoading(false);
  }
}, []);

useEffect(() => {
  const timer = setTimeout(() => {
    fetchRequests();
  }, 0);

  return () => clearTimeout(timer);
}, [fetchRequests]);

  // Update request status
 const handleStatusUpdate = async (
  id: string,
  status: ServiceRequest["status"],
  amount?: number
) => {
  try {
    if (!API_URL) {
      throw new Error("API URL is not configured.");
    }

    if (status === "completed" && (!amount || amount <= 0)) {
      toast.error("Please enter a valid final amount.");
      return;
    }

    setUpdatingId(id);

    const token = await getTokenFromClient();

    const response = await fetch(
      `${API_URL}/api/service-requests/${id}/status`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          status,
          ...(status === "completed" && { finalAmount: amount }),
        }),
      }
    );

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(
        result.message || "Failed to update request."
      );
    }

    toast.success(
      result.message || "Request updated successfully!"
    );

    setRequests((previous) =>
      previous.map((request) =>
        request._id === id
          ? {
              ...request,
              status,
              ...(status === "completed" && {
                finalAmount: amount,
                paymentStatus: "unpaid" as const,
              }),
            }
          : request
      )
    );

    setSelectedRequest((previous) =>
      previous?._id === id
        ? {
            ...previous,
            status,
            ...(status === "completed" && {
              finalAmount: amount,
              paymentStatus: "unpaid" as const,
            }),
          }
        : previous
    );

    if (status === "completed") {
      setFinalAmount("");
    }
  } catch (error) {
    console.error("Update request error:", error);

    toast.error(
      error instanceof Error
        ? error.message
        : "Something went wrong!"
    );
  } finally {
    setUpdatingId(null);
  }
};

  // Search and filter
  const filteredRequests = useMemo(() => {
    return requests.filter((request) => {
      const searchTerm = search.toLowerCase();

      const matchesSearch =
        request.customerName.toLowerCase().includes(searchTerm) ||
        request.customerEmail.toLowerCase().includes(searchTerm) ||
        request.serviceTitle.toLowerCase().includes(searchTerm);

      const matchesFilter =
        filter === "all" || request.status === filter;

      return matchesSearch && matchesFilter;
    });
  }, [requests, search, filter]);

  // Dashboard statistics
  const stats = [
    {
      title: "Total Requests",
      value: requests.length,
      icon: ClipboardList,
      color: "bg-blue-50 text-blue-600",
    },
    {
      title: "Requested",
      value: requests.filter((r) => r.status === "requested").length,
      icon: Clock,
      color: "bg-amber-50 text-amber-600",
    },
    {
      title: "Accepted",
      value: requests.filter((r) => r.status === "accepted").length,
      icon: CheckCircle,
      color: "bg-green-50 text-green-600",
    },
    {
      title: "Completed",
      value: requests.filter((r) => r.status === "completed").length,
      icon: CheckCircle,
      color: "bg-purple-50 text-purple-600",
    },
  ];

  const formatStatus = (status: string) =>
    status.replace("-", " ").replace(/\b\w/g, (char) =>
      char.toUpperCase()
    );

  const formatDate = (date: string) => {
    if (!date) return "Not specified";

    const parsedDate = new Date(`${date}T00:00:00`);

    if (Number.isNaN(parsedDate.getTime())) {
      return date;
    }

    return parsedDate.toLocaleDateString("en-BD", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const renderActions = (request: ServiceRequest, modal = false) => {
    const isUpdating = updatingId === request._id;

    const buttonClass =
      "rounded-lg px-3 py-2 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-50";

    return (
      <>
        {request.status === "requested" && (
          <>
            <button
              disabled={isUpdating}
              onClick={() =>
                handleStatusUpdate(request._id, "accepted")
              }
              className={`${buttonClass} bg-[#102b25] text-[#b9e769]`}
            >
              {isUpdating ? "Updating..." : modal ? "Accept Request" : "Accept"}
            </button>

            <button
              disabled={isUpdating}
              onClick={() =>
                handleStatusUpdate(request._id, "rejected")
              }
              className={`${buttonClass} bg-red-50 text-red-600 hover:bg-red-100`}
            >
              Reject
            </button>
          </>
        )}

        {request.status === "accepted" && (
          <button
            disabled={isUpdating}
            onClick={() =>
              handleStatusUpdate(request._id, "in-progress")
            }
            className={`${buttonClass} bg-purple-600 text-white`}
          >
            {isUpdating ? "Updating..." : "Start Job"}
          </button>
        )}

       {request.status === "in-progress" && (
  <button
    disabled={isUpdating}
    onClick={() => {
      if (modal) {
        const amount = Number(finalAmount);
        handleStatusUpdate(request._id, "completed", amount);
      } else {
        setFinalAmount("");
        setSelectedRequest(request);
      }
    }}
    className={`${buttonClass} bg-green-600 text-white`}
  >
    {isUpdating
      ? "Updating..."
      : modal
        ? "Mark as Completed"
        : "Complete"}
  </button>
)}
      </>
    );
  };

  return (
    <div className="mx-auto max-w-7xl space-y-7">

      {/* Page Heading */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="mb-1 text-sm font-medium text-[#5c9635]">
            Technician Panel
          </p>

          <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
            Service Requests
          </h1>

          <p className="mt-2 text-sm text-muted">
            Manage customer repair requests and job status.
          </p>
        </div>

        <button
  onClick={() => {
    setLoading(true);
    fetchRequests();
  }}
  disabled={loading}
  className="flex items-center justify-center gap-2 rounded-xl border border-border bg-surface px-4 py-2.5 text-sm font-semibold text-foreground transition hover:bg-accent disabled:opacity-50"
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
              key={stat.title}
              className="rounded-2xl border border-border bg-surface p-5 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted">{stat.title}</p>

                  <h2 className="mt-2 text-3xl font-bold text-foreground">
                    {stat.value}
                  </h2>
                </div>

                <div className={`rounded-xl p-3 ${stat.color}`}>
                  <Icon size={23} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Requests Section */}
      <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">

        {/* Search and Filter */}
        <div className="space-y-4 border-b border-border p-5">
          <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
            <div>
              <h2 className="text-lg font-bold text-foreground">
                Customer Requests
              </h2>

              <p className="mt-1 text-sm text-muted">
                Review and manage your incoming service requests.
              </p>
            </div>

            <div className="relative w-full lg:max-w-sm">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
              />

              <input
                type="text"
                placeholder="Search customer or service..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-border bg-background py-3 pl-10 pr-4 text-sm text-foreground outline-none transition focus:border-[#82b944] focus:ring-2 focus:ring-[#82b944]/20"
              />
            </div>
          </div>

          {/* Status Filters */}
          <div className="flex flex-wrap gap-2">
            {(
              [
                "all",
                "requested",
                "accepted",
                "in-progress",
                "completed",
                "rejected",
              ] as FilterStatus[]
            ).map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`rounded-lg px-4 py-2 text-xs font-semibold transition ${
                  filter === status
                    ? "bg-[#102b25] text-[#b9e769]"
                    : "bg-background text-muted hover:bg-accent"
                }`}
              >
                {status === "all"
                  ? "All Requests"
                  : formatStatus(status)}
              </button>
            ))}
          </div>
        </div>

        {/* Request List */}
        {loading ? (
          <div className="flex min-h-64 items-center justify-center">
            <Loader2
              className="animate-spin text-[#5c9635]"
              size={32}
            />
          </div>
        ) : filteredRequests.length === 0 ? (
          <div className="flex min-h-72 flex-col items-center justify-center px-5 text-center">
            <div className="rounded-2xl bg-[#b9e769]/20 p-5">
              <ClipboardList size={35} className="text-[#5c9635]" />
            </div>

            <h3 className="mt-4 text-lg font-bold text-foreground">
              No service requests found
            </h3>

            <p className="mt-2 max-w-sm text-sm text-muted">
              {search || filter !== "all"
                ? "Try changing your search or filter."
                : "You don't have any customer requests yet."}
            </p>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden overflow-x-auto lg:block">
              <table className="w-full text-left">
                <thead className="bg-background text-xs uppercase text-muted">
                  <tr>
                    <th className="px-5 py-4">Customer</th>
                    <th className="px-5 py-4">Service</th>
                    <th className="px-5 py-4">Date</th>
                    <th className="px-5 py-4">Status</th>
                    <th className="px-5 py-4">Payment</th>
                    <th className="px-5 py-4 text-right">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-border">
                  {filteredRequests.map((request) => (
                    <tr
                      key={request._id}
                      className="transition hover:bg-accent/40"
                    >
                      <td className="px-5 py-5">
                        <p className="font-semibold text-foreground">
                          {request.customerName}
                        </p>

                        <p className="mt-1 text-xs text-muted">
                          {request.customerEmail}
                        </p>
                      </td>

                      <td className="px-5 py-5">
                        <p className="font-medium text-foreground">
                          {request.serviceTitle}
                        </p>

                        <p className="mt-1 text-xs text-muted">
                          {request.serviceCategory}
                        </p>
                      </td>

                      <td className="px-5 py-5 text-sm text-foreground">
                        {formatDate(request.preferredDate)}
                      </td>

                      <td className="px-5 py-5">
                        <span
                          className={`rounded-full px-3 py-1.5 text-xs font-semibold ${statusStyles[request.status]}`}
                        >
                          {formatStatus(request.status)}
                        </span>
                      </td>

                      <td className="px-5 py-5">
                        <span
                          className={`rounded-full px-3 py-1.5 text-xs font-semibold ${paymentStyles[request.paymentStatus]}`}
                        >
                          {formatStatus(request.paymentStatus)}
                        </span>
                      </td>

                      <td className="px-5 py-5">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => setSelectedRequest(request)}
                            title="View details"
                            className="rounded-lg border border-border p-2 text-foreground hover:bg-accent"
                          >
                            <Eye size={17} />
                          </button>

                          {renderActions(request)}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Request Cards */}
            <div className="grid gap-4 p-4 lg:hidden">
              {filteredRequests.map((request) => (
                <div
                  key={request._id}
                  className="rounded-xl border border-border p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-bold text-foreground">
                        {request.serviceTitle}
                      </h3>

                      <p className="mt-1 text-xs text-muted">
                        {request.customerName}
                      </p>
                    </div>

                    <span
                      className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[request.status]}`}
                    >
                      {formatStatus(request.status)}
                    </span>
                  </div>

                  <div className="mt-4 space-y-2 text-sm text-muted">
                    <p className="flex items-center gap-2">
                      <CalendarDays size={15} />
                      {formatDate(request.preferredDate)}
                    </p>

                    <p className="flex items-center gap-2">
                      <MapPin size={15} />
                      {request.address}
                    </p>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <button
                      onClick={() => setSelectedRequest(request)}
                      className="flex items-center gap-1 rounded-lg border border-border px-3 py-2 text-xs font-semibold text-foreground"
                    >
                      <Eye size={15} />
                      View Details
                    </button>

                    {renderActions(request)}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Request Details Modal */}
      {selectedRequest && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4"
          onClick={() => setSelectedRequest(null)}
        >
          <div
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-surface p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-foreground">
                  Request Details
                </h2>

                <p className="mt-1 text-sm text-muted">
                  Review customer and repair information.
                </p>
              </div>

              <button
                onClick={() => setSelectedRequest(null)}
                className="rounded-lg p-2 text-muted hover:bg-accent"
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            </div>

            <div className="mt-6 space-y-5">

              {/* Service Information */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="font-bold text-foreground">
                    {selectedRequest.serviceTitle}
                  </h3>

                  <p className="text-sm text-muted">
                    {selectedRequest.serviceCategory}
                  </p>
                </div>

                <span
                  className={`rounded-full px-3 py-1.5 text-xs font-semibold ${statusStyles[selectedRequest.status]}`}
                >
                  {formatStatus(selectedRequest.status)}
                </span>
              </div>

              {/* Information Cards */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl bg-background p-4">
                  <p className="text-xs text-muted">Customer Name</p>

                  <p className="mt-1 font-semibold text-foreground">
                    {selectedRequest.customerName}
                  </p>
                </div>

                <div className="rounded-xl bg-background p-4">
                  <p className="text-xs text-muted">Phone Number</p>

                  <p className="mt-1 flex items-center gap-2 font-semibold text-foreground">
                    <Phone size={15} />
                    {selectedRequest.customerPhone}
                  </p>
                </div>

                <div className="rounded-xl bg-background p-4">
                  <p className="text-xs text-muted">Service Price</p>

                  <p className="mt-1 font-semibold text-foreground">
                    ৳{selectedRequest.servicePrice}
                  </p>
                </div>

                <div className="rounded-xl bg-background p-4">
                  <p className="text-xs text-muted">Preferred Date</p>

                  <p className="mt-1 font-semibold text-foreground">
                    {formatDate(selectedRequest.preferredDate)}
                  </p>
                </div>

                <div className="rounded-xl bg-background p-4">
                  <p className="text-xs text-muted">Request Status</p>

                  <p className="mt-1 font-semibold text-foreground">
                    {formatStatus(selectedRequest.status)}
                  </p>
                </div>

                <div className="rounded-xl bg-background p-4">
                  <p className="text-xs text-muted">Payment Status</p>

                  <p className="mt-1 flex items-center gap-2 font-semibold text-foreground">
                    <CreditCard size={15} />
                    {formatStatus(selectedRequest.paymentStatus)}
                  </p>
                </div>
              </div>

              {/* Customer Email */}
              <div>
                <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  <Mail size={16} />
                  Customer Email
                </p>

                <p className="mt-1 text-sm text-muted">
                  {selectedRequest.customerEmail}
                </p>
              </div>

              {/* Address */}
              <div>
                <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  <MapPin size={16} />
                  Service Address
                </p>

                <p className="mt-1 text-sm text-muted">
                  {selectedRequest.address}
                </p>
              </div>

              {/* Problem Description */}
              <div>
                <p className="text-sm font-semibold text-foreground">
                  Problem Description
                </p>

                <p className="mt-2 rounded-xl bg-background p-4 text-sm leading-7 text-muted">
                  {selectedRequest.problemDescription}
                </p>
              </div>

             {/* Final Amount Input */}
{selectedRequest.status === "in-progress" && (
  <div className="rounded-xl border border-green-200 bg-green-50 p-4">
    <label
      htmlFor="finalAmount"
      className="mb-2 block text-sm font-semibold text-green-900"
    >
      Final Repair Amount (৳)
    </label>

    <input
      id="finalAmount"
      type="number"
      min="1"
      step="0.01"
      placeholder="Enter final repair amount"
      value={finalAmount}
      onChange={(e) => setFinalAmount(e.target.value)}
      className="w-full rounded-lg border border-green-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20"
    />

    <p className="mt-2 text-xs text-green-800">
      Enter the total amount the customer needs to pay.
    </p>
  </div>
)}

{/* Final Amount Display */}
{selectedRequest.status === "completed" &&
  selectedRequest.finalAmount !== undefined && (
    <div className="rounded-xl bg-background p-4">
      <p className="text-xs text-muted">Final Repair Amount</p>
      <p className="mt-1 text-xl font-bold text-green-600">
        ৳{selectedRequest.finalAmount}
      </p>
    </div>
  )}

{/* Modal Actions */}
<div className="flex flex-wrap gap-3 border-t border-border pt-5">
  {renderActions(selectedRequest, true)}
</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
