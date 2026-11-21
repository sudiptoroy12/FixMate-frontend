
"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Search,
  RefreshCw,
  CheckCircle2,
  XCircle,
  Clock,
  Trash2,
  Eye,
  Wrench,
  MapPin,
  CalendarDays,
  UserRound,
  X,
  AlertCircle,
  Image as ImageIcon,
  Filter,
} from "lucide-react";

import { getTokenFromClient } from "@/lib/(getToken)/getTokenFromClient";

interface Service {
  _id: string;
  title: string;
  category: string;
  description: string;
  image: string;
  basePrice: number;
  currency: string;
  estimatedDuration: string;
  serviceMode: string;
  serviceArea: string;
  technicianName: string;
  technicianEmail: string;
  approvalStatus: "pending" | "approved" | "rejected";
  isAvailable: boolean;
  createdAt: string;
  reviewedAt?: string;
}

type FilterStatus = "all" | "pending" | "approved" | "rejected";

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");

const filters: { label: string; value: FilterStatus }[] = [
  { label: "All Services", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Approved", value: "approved" },
  { label: "Rejected", value: "rejected" },
];

const statusStyles: Record<Service["approvalStatus"], string> = {
  pending: "bg-amber-500/10 text-amber-600",
  approved: "bg-emerald-500/10 text-emerald-600",
  rejected: "bg-red-500/10 text-red-600",
};

const formatPrice = (price: number, currency: string) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency || "USD",
  }).format(price || 0);
};

const formatDate = (date: string) => {
  if (!date) return "N/A";

  return new Date(date).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterStatus>("all");
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(
    null
  );
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Fetch all services
  const fetchServices = async (isRefresh = false) => {
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
        throw new Error("Your session has expired. Please sign in again.");
      }

      const response = await fetch(`${API_URL}/api/admin/services`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      });

      const result: ApiResponse<Service[]> = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to retrieve services.");
      }

      setServices(Array.isArray(result.data) ? result.data : []);
    } catch (err) {
      console.error("Fetch admin services error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while fetching services."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
  let isMounted = true;

  const loadServices = async () => {
    if (!API_URL) {
      if (isMounted) {
        setError("API URL is not configured.");
        setLoading(false);
      }
      return;
    }

    try {
      setError("");

      const token = await getTokenFromClient();

      if (!token) {
        throw new Error("Your session has expired. Please sign in again.");
      }

      const response = await fetch(`${API_URL}/api/admin/services`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      });

      const result: ApiResponse<Service[]> = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to retrieve services.");
      }

      if (isMounted) {
        setServices(Array.isArray(result.data) ? result.data : []);
      }
    } catch (err) {
      console.error("Fetch admin services error:", err);

      if (isMounted) {
        setError(
          err instanceof Error
            ? err.message
            : "Something went wrong while fetching services."
        );
      }
    } finally {
      if (isMounted) {
        setLoading(false);
      }
    }
  };

  loadServices();

  return () => {
    isMounted = false;
  };
}, []);

  // Filter services
  const filteredServices = useMemo(() => {
    return services.filter((service) => {
      const matchesFilter =
        activeFilter === "all" ||
        service.approvalStatus === activeFilter;

      const searchText = search.toLowerCase().trim();

      const matchesSearch =
        !searchText ||
        service.title?.toLowerCase().includes(searchText) ||
        service.category?.toLowerCase().includes(searchText) ||
        service.technicianName?.toLowerCase().includes(searchText) ||
        service.technicianEmail?.toLowerCase().includes(searchText) ||
        service.serviceArea?.toLowerCase().includes(searchText);

      return matchesFilter && matchesSearch;
    });
  }, [services, activeFilter, search]);

  // Service statistics
  const stats = useMemo(() => {
    return {
      total: services.length,
      pending: services.filter(
        (service) => service.approvalStatus === "pending"
      ).length,
      approved: services.filter(
        (service) => service.approvalStatus === "approved"
      ).length,
      rejected: services.filter(
        (service) => service.approvalStatus === "rejected"
      ).length,
    };
  }, [services]);

  // Approve or reject service
  const handleApproval = async (
    service: Service,
    approvalStatus: "approved" | "rejected"
  ) => {
    const actionText = approvalStatus === "approved" ? "approve" : "reject";

    const confirmed = window.confirm(
      `Are you sure you want to ${actionText} "${service.title}"?`
    );

    if (!confirmed) return;

    try {
      setActionLoading(service._id);
      setError("");
      setSuccessMessage("");

      const token = await getTokenFromClient();

      if (!token) {
        throw new Error("Your session has expired. Please sign in again.");
      }

      const response = await fetch(
        `${API_URL}/api/admin/services/${service._id}/approval`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ approvalStatus }),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Unable to update service.");
      }

      setServices((previous) =>
        previous.map((item) =>
          item._id === service._id
            ? { ...item, approvalStatus }
            : item
        )
      );

      if (selectedService?._id === service._id) {
        setSelectedService((previous) =>
          previous ? { ...previous, approvalStatus } : null
        );
      }

      setSuccessMessage(
        `Service ${approvalStatus} successfully.`
      );
    } catch (err) {
      console.error("Service approval error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to update service approval."
      );
    } finally {
      setActionLoading(null);
    }
  };

  // Delete service
  const handleDelete = async (service: Service) => {
    const confirmed = window.confirm(
      `Are you sure you want to permanently delete "${service.title}"? This action cannot be undone.`
    );

    if (!confirmed) return;

    try {
      setActionLoading(service._id);
      setError("");
      setSuccessMessage("");

      const token = await getTokenFromClient();

      if (!token) {
        throw new Error("Your session has expired. Please sign in again.");
      }

      const response = await fetch(
        `${API_URL}/api/admin/services/${service._id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to delete service.");
      }

      setServices((previous) =>
        previous.filter((item) => item._id !== service._id)
      );

      if (selectedService?._id === service._id) {
        setSelectedService(null);
      }

      setSuccessMessage("Service deleted successfully.");
    } catch (err) {
      console.error("Delete service error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to delete service."
      );
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="space-y-6 pb-10">
      {/* Page Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Wrench size={22} />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-foreground">
                Services Management
              </h1>
              <p className="mt-1 text-sm text-muted">
                Manage, review and approve technician services.
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() => fetchServices(true)}
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
          title="Total Services"
          value={stats.total}
          icon={<Wrench size={21} />}
          color="text-primary"
          bg="bg-primary/10"
        />

        <StatCard
          title="Pending Review"
          value={stats.pending}
          icon={<Clock size={21} />}
          color="text-amber-600"
          bg="bg-amber-500/10"
        />

        <StatCard
          title="Approved"
          value={stats.approved}
          icon={<CheckCircle2 size={21} />}
          color="text-emerald-600"
          bg="bg-emerald-500/10"
        />

        <StatCard
          title="Rejected"
          value={stats.rejected}
          icon={<XCircle size={21} />}
          color="text-red-600"
          bg="bg-red-500/10"
        />
      </div>

      {/* Main Content */}
      <div className="overflow-hidden rounded-2xl border border-border bg-surface">
        {/* Search and Filters */}
        <div className="space-y-4 border-b border-border p-4 sm:p-5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-foreground">
                All Services
              </h2>
              <p className="mt-1 text-sm text-muted">
                {filteredServices.length} of {services.length} services
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
                placeholder="Search title, technician, category..."
                className="w-full rounded-xl border border-border bg-surface-secondary py-2.5 pl-10 pr-4 text-sm text-foreground outline-none transition placeholder:text-muted focus:border-primary"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Filter size={16} className="mr-1 text-muted" />

            {filters.map((filter) => {
              const isActive = activeFilter === filter.value;

              return (
                <button
                  key={filter.value}
                  onClick={() => setActiveFilter(filter.value)}
                  className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                    isActive
                      ? "bg-primary text-white"
                      : "bg-surface-secondary text-muted hover:text-foreground"
                  }`}
                >
                  {filter.label}
                  <span className="ml-2 text-xs opacity-75">
                    {filter.value === "all"
                      ? stats.total
                      : stats[filter.value]}
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
        ) : filteredServices.length === 0 ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center px-5 py-16 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-surface-secondary text-muted">
              <Wrench size={28} />
            </div>

            <h3 className="text-lg font-semibold text-foreground">
              No services found
            </h3>

            <p className="mt-2 max-w-sm text-sm text-muted">
              {search
                ? "Try changing your search keywords or filters."
                : "There are currently no services in this category."}
            </p>

            {(search || activeFilter !== "all") && (
              <button
                onClick={() => {
                  setSearch("");
                  setActiveFilter("all");
                }}
                className="mt-4 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-primary-hover"
              >
                Clear filters
              </button>
            )}
          </div>
        ) : (
          /* Services Table */
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left">
              <thead>
                <tr className="border-b border-border bg-surface-secondary/60 text-xs uppercase tracking-wider text-muted">
                  <th className="px-5 py-4 font-semibold">Service</th>
                  <th className="px-5 py-4 font-semibold">Technician</th>
                  <th className="px-5 py-4 font-semibold">Price</th>
                  <th className="px-5 py-4 font-semibold">Status</th>
                  <th className="px-5 py-4 font-semibold">Created</th>
                  <th className="px-5 py-4 text-right font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-border">
                {filteredServices.map((service) => (
                  <tr
                    key={service._id}
                    className="transition hover:bg-surface-secondary/40"
                  >
                    {/* Service */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <ServiceImage service={service} />

                        <div className="min-w-0">
                          <p className="max-w-[220px] truncate text-sm font-semibold text-foreground">
                            {service.title}
                          </p>

                          <p className="mt-1 text-xs text-muted">
                            {service.category}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Technician */}
                    <td className="px-5 py-4">
                      <p className="text-sm font-medium text-foreground">
                        {service.technicianName}
                      </p>

                      <p className="mt-1 max-w-[180px] truncate text-xs text-muted">
                        {service.technicianEmail}
                      </p>
                    </td>

                    {/* Price */}
                    <td className="px-5 py-4">
                      <p className="text-sm font-semibold text-foreground">
                        {formatPrice(
                          service.basePrice,
                          service.currency
                        )}
                      </p>
                      <p className="mt-1 text-xs text-muted">
                        {service.estimatedDuration}
                      </p>
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4">
                      <StatusBadge status={service.approvalStatus} />
                    </td>

                    {/* Created */}
                    <td className="px-5 py-4 text-sm text-muted">
                      {formatDate(service.createdAt)}
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <ActionButton
                          title="View details"
                          onClick={() => setSelectedService(service)}
                        >
                          <Eye size={16} />
                        </ActionButton>

                        {service.approvalStatus === "pending" && (
                          <>
                            <ActionButton
                              title="Approve service"
                              color="green"
                              disabled={actionLoading === service._id}
                              onClick={() =>
                                handleApproval(service, "approved")
                              }
                            >
                              {actionLoading === service._id ? (
                                <RefreshCw
                                  size={16}
                                  className="animate-spin"
                                />
                              ) : (
                                <CheckCircle2 size={16} />
                              )}
                            </ActionButton>

                            <ActionButton
                              title="Reject service"
                              color="red"
                              disabled={actionLoading === service._id}
                              onClick={() =>
                                handleApproval(service, "rejected")
                              }
                            >
                              <XCircle size={16} />
                            </ActionButton>
                          </>
                        )}

                        <ActionButton
                          title="Delete service"
                          color="red"
                          disabled={actionLoading === service._id}
                          onClick={() => handleDelete(service)}
                        >
                          <Trash2 size={16} />
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
        {!loading && filteredServices.length > 0 && (
          <div className="border-t border-border px-5 py-4">
            <p className="text-xs text-muted">
              Showing {filteredServices.length} service
              {filteredServices.length !== 1 ? "s" : ""}
            </p>
          </div>
        )}
      </div>

      {/* Service Details Modal */}
      {selectedService && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
          onClick={() => setSelectedService(null)}
        >
          <div
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-border bg-surface shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-surface p-5">
              <div>
                <h2 className="text-lg font-bold text-foreground">
                  Service Details
                </h2>
                <p className="mt-1 text-xs text-muted">
                  Review the submitted service information.
                </p>
              </div>

              <button
                onClick={() => setSelectedService(null)}
                className="rounded-lg p-2 text-muted transition hover:bg-surface-secondary hover:text-foreground"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-5 p-5">
              {/* Image */}
              <div className="overflow-hidden rounded-xl bg-surface-secondary">
                <ServiceImage
                  service={selectedService}
                  large
                />
              </div>

              {/* Title and Status */}
              <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                <div>
                  <h3 className="text-xl font-bold text-foreground">
                    {selectedService.title}
                  </h3>
                  <p className="mt-1 text-sm text-muted">
                    {selectedService.category}
                  </p>
                </div>

                <StatusBadge
                  status={selectedService.approvalStatus}
                />
              </div>

              {/* Description */}
              <div>
                <h4 className="mb-2 text-sm font-semibold text-foreground">
                  Description
                </h4>
                <p className="whitespace-pre-wrap text-sm leading-6 text-muted">
                  {selectedService.description}
                </p>
              </div>

              {/* Service Information */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <DetailItem
                  icon={<Wrench size={17} />}
                  label="Base Price"
                  value={formatPrice(
                    selectedService.basePrice,
                    selectedService.currency
                  )}
                />

                <DetailItem
                  icon={<Clock size={17} />}
                  label="Estimated Duration"
                  value={selectedService.estimatedDuration}
                />

                <DetailItem
                  icon={<MapPin size={17} />}
                  label="Service Mode"
                  value={selectedService.serviceMode}
                />

                <DetailItem
                  icon={<MapPin size={17} />}
                  label="Service Area"
                  value={selectedService.serviceArea}
                />

                <DetailItem
                  icon={<CalendarDays size={17} />}
                  label="Created At"
                  value={formatDate(selectedService.createdAt)}
                />

                <DetailItem
                  icon={<CheckCircle2 size={17} />}
                  label="Availability"
                  value={
                    selectedService.isAvailable
                      ? "Available"
                      : "Unavailable"
                  }
                />
              </div>

              {/* Technician */}
              <div className="rounded-xl border border-border bg-surface-secondary p-4">
                <div className="mb-3 flex items-center gap-2">
                  <UserRound size={18} className="text-primary" />
                  <h4 className="text-sm font-semibold text-foreground">
                    Technician Information
                  </h4>
                </div>

                <p className="text-sm font-medium text-foreground">
                  {selectedService.technicianName}
                </p>

                <p className="mt-1 break-all text-xs text-muted">
                  {selectedService.technicianEmail}
                </p>
              </div>

              {/* Modal Actions */}
              <div className="flex flex-col-reverse gap-3 border-t border-border pt-5 sm:flex-row sm:justify-between">
                <button
                  onClick={() => handleDelete(selectedService)}
                  disabled={actionLoading === selectedService._id}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-500/20 px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-500/10 disabled:opacity-50"
                >
                  <Trash2 size={16} />
                  Delete Service
                </button>

                {selectedService.approvalStatus === "pending" && (
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <button
                      onClick={() =>
                        handleApproval(selectedService, "rejected")
                      }
                      disabled={actionLoading === selectedService._id}
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-500/20 px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-500/10 disabled:opacity-50"
                    >
                      <XCircle size={16} />
                      Reject
                    </button>

                    <button
                      onClick={() =>
                        handleApproval(selectedService, "approved")
                      }
                      disabled={actionLoading === selectedService._id}
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-hover disabled:opacity-50"
                    >
                      {actionLoading === selectedService._id ? (
                        <RefreshCw size={16} className="animate-spin" />
                      ) : (
                        <CheckCircle2 size={16} />
                      )}
                      Approve Service
                    </button>
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
  status: Service["approvalStatus"];
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-semibold capitalize ${statusStyles[status]}`}
    >
      {status === "pending" && <Clock size={13} />}
      {status === "approved" && <CheckCircle2 size={13} />}
      {status === "rejected" && <XCircle size={13} />}
      {status}
    </span>
  );
}

function ServiceImage({
  service,
  large = false,
}: {
  service: Service;
  large?: boolean;
}) {
  const [imageError, setImageError] = useState(false);

  if (!service.image || imageError) {
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
      src={service.image}
      alt={service.title}
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
  color = "default",
  disabled = false,
  onClick,
}: {
  children: React.ReactNode;
  title: string;
  color?: "default" | "green" | "red";
  disabled?: boolean;
  onClick: () => void;
}) {
  const colors = {
    default:
      "bg-surface-secondary text-muted hover:text-foreground",
    green:
      "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20",
    red: "bg-red-500/10 text-red-600 hover:bg-red-500/20",
  };

  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      onClick={onClick}
      disabled={disabled}
      className={`flex h-9 w-9 items-center justify-center rounded-lg transition disabled:cursor-not-allowed disabled:opacity-40 ${colors[color]}`}
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
