"use client";

import { useCallback, useEffect, useState } from "react";
import type { FormEvent } from "react";
import Link from "next/link";
import {
  Plus,
  RefreshCw,
  Wrench,
  Clock,
  MapPin,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Package,
  Pencil,
  Trash2,
  X,
  Eye,
  EyeOff,
  Power,
  Image as ImageIcon,
} from "lucide-react";
import { toast } from "react-toastify";

import { getTokenFromClient } from "@/lib/(getToken)/getTokenFromClient";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

type ApprovalStatus = "pending" | "approved" | "rejected";

interface Service {
  _id: string;
  title: string;
  category: string;
  description: string;
  image: string;
  basePrice: number;
  currency?: string;
  estimatedDuration: string;
  serviceMode: string;
  serviceArea: string;
  approvalStatus: ApprovalStatus;
  isAvailable: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface ServiceFormData {
  title: string;
  category: string;
  description: string;
  image: string;
  basePrice: string;
  estimatedDuration: string;
  serviceMode: string;
  serviceArea: string;
}

const categories = [
  "Smartphone",
  "Laptop & PC",
  "AC",
  "Refrigerator",
  "TV",
  "Washing Machine",
  "Electrical",
];

const serviceModes = ["Home Visit", "Shop Drop-off"];

const emptyForm: ServiceFormData = {
  title: "",
  category: "Smartphone",
  description: "",
  image: "",
  basePrice: "",
  estimatedDuration: "",
  serviceMode: "Home Visit",
  serviceArea: "",
};

const formatUSD = (amount: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);

const approvalStyles: Record<
  ApprovalStatus,
  { label: string; className: string }
> = {
  pending: {
    label: "Pending",
    className: "bg-amber-500/10 text-amber-600",
  },
  approved: {
    label: "Approved",
    className: "bg-emerald-500/10 text-emerald-600",
  },
  rejected: {
    label: "Rejected",
    className: "bg-red-500/10 text-red-600",
  },
};

export default function MyServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const [editingService, setEditingService] = useState<Service | null>(null);
  const [formData, setFormData] = useState<ServiceFormData>(emptyForm);
  const [saving, setSaving] = useState(false);

  const [deletingService, setDeletingService] = useState<Service | null>(null);
  const [deleting, setDeleting] = useState(false);

  const [togglingId, setTogglingId] = useState<string | null>(null);

  const getApiBase = () => {
    if (!API_URL) {
      throw new Error("API URL is not configured.");
    }

    return API_URL.replace(/\/+$/, "");
  };

  const getAuthHeaders = async () => {
    const token = await getTokenFromClient();

    if (!token) {
      throw new Error("Your session has expired. Please sign in again.");
    }

    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  };

  const fetchServices = useCallback(
    async (showRefresh = false) => {
      try {
        if (showRefresh) {
          setRefreshing(true);
        }

        setError("");

        const headers = await getAuthHeaders();

        const response = await fetch(
          `${getApiBase()}/api/services/my-services`,
          {
            method: "GET",
            headers,
            cache: "no-store",
          }
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || "Failed to load services.");
        }

        const serviceList = Array.isArray(result)
          ? result
          : Array.isArray(result.data)
            ? result.data
            : Array.isArray(result.services)
              ? result.services
              : Array.isArray(result.data?.services)
                ? result.data.services
                : [];

        setServices(serviceList);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Something went wrong.";

        setError(message);

        if (showRefresh) {
          toast.error(message);
        }
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    []
  );

  useEffect(() => {
    let cancelled = false;

    const loadServices = async () => {
      try {
        const headers = await getAuthHeaders();

        const response = await fetch(
          `${getApiBase()}/api/services/my-services`,
          {
            method: "GET",
            headers,
            cache: "no-store",
          }
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || "Failed to load services.");
        }

        const serviceList = Array.isArray(result)
          ? result
          : Array.isArray(result.data)
            ? result.data
            : Array.isArray(result.services)
              ? result.services
              : Array.isArray(result.data?.services)
                ? result.data.services
                : [];

        if (!cancelled) {
          setServices(serviceList);
          setError("");
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Something went wrong."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void loadServices();

    return () => {
      cancelled = true;
    };
  }, []);

  const totalServices = services.length;
  const approvedServices = services.filter(
    (service) => service.approvalStatus === "approved"
  ).length;
  const pendingServices = services.filter(
    (service) => service.approvalStatus === "pending"
  ).length;
  const rejectedServices = services.filter(
    (service) => service.approvalStatus === "rejected"
  ).length;

  const openEditModal = (service: Service) => {
    setEditingService(service);

    setFormData({
      title: service.title || "",
      category: service.category || "Smartphone",
      description: service.description || "",
      image: service.image || "",
      basePrice: String(service.basePrice ?? ""),
      estimatedDuration: service.estimatedDuration || "",
      serviceMode: service.serviceMode || "Home Visit",
      serviceArea: service.serviceArea || "",
    });
  };

  const closeEditModal = () => {
    if (saving) return;

    setEditingService(null);
    setFormData(emptyForm);
  };

  const handleFormChange = (
    field: keyof ServiceFormData,
    value: string
  ) => {
    setFormData((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const handleUpdateService = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!editingService) return;

    const price = Number(formData.basePrice);

    if (
      !Number.isFinite(price) ||
      price < 1 ||
      Math.round(price * 100) / 100 !== price
    ) {
      toast.error(
        "Service price must be at least $1.00 USD with a maximum of 2 decimal places."
      );
      return;
    }

    const requiredFields = [
      formData.title,
      formData.category,
      formData.description,
      formData.image,
      formData.estimatedDuration,
      formData.serviceMode,
      formData.serviceArea,
    ];

    if (requiredFields.some((field) => !field.trim())) {
      toast.error("Please fill in all required fields.");
      return;
    }

    if (!categories.includes(formData.category)) {
      toast.error("Please select a valid service category.");
      return;
    }

    if (!serviceModes.includes(formData.serviceMode)) {
      toast.error("Please select a valid service mode.");
      return;
    }

    try {
      setSaving(true);

      const headers = await getAuthHeaders();

      const response = await fetch(
        `${getApiBase()}/api/services/${editingService._id}`,
        {
          method: "PATCH",
          headers,
          body: JSON.stringify({
            title: formData.title.trim(),
            category: formData.category,
            description: formData.description.trim(),
            image: formData.image.trim(),
            basePrice: price,
            estimatedDuration: formData.estimatedDuration.trim(),
            serviceMode: formData.serviceMode,
            serviceArea: formData.serviceArea.trim(),
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to update service.");
      }

      toast.success(
        "Service updated successfully! It is now pending admin approval."
      );

      setEditingService(null);
      setFormData(emptyForm);

      await fetchServices();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to update service."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteService = async () => {
    if (!deletingService) return;

    try {
      setDeleting(true);

      const headers = await getAuthHeaders();

      const response = await fetch(
        `${getApiBase()}/api/services/${deletingService._id}`,
        {
          method: "DELETE",
          headers,
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to delete service.");
      }

      toast.success("Service deleted successfully.");

      setServices((previous) =>
        previous.filter((service) => service._id !== deletingService._id)
      );

      setDeletingService(null);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to delete service."
      );
    } finally {
      setDeleting(false);
    }
  };

  const handleToggleAvailability = async (service: Service) => {
    try {
      setTogglingId(service._id);

      const headers = await getAuthHeaders();

      const newAvailability = !service.isAvailable;

      const response = await fetch(
        `${getApiBase()}/api/services/${service._id}/availability`,
        {
          method: "PATCH",
          headers,
          body: JSON.stringify({
            isAvailable: newAvailability,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Failed to update service availability."
        );
      }

      setServices((previous) =>
        previous.map((item) =>
          item._id === service._id
            ? {
                ...item,
                isAvailable:
                  typeof result.data?.isAvailable === "boolean"
                    ? result.data.isAvailable
                    : newAvailability,
              }
            : item
        )
      );

      toast.success(
        newAvailability
          ? "Service is now available."
          : "Service is now unavailable."
      );
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : "Failed to update availability."
      );
    } finally {
      setTogglingId(null);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 animate-pulse rounded-lg bg-surface" />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="h-28 animate-pulse rounded-2xl border border-border bg-surface"
            />
          ))}
        </div>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-80 animate-pulse rounded-2xl border border-border bg-surface"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-7">
      {/* Page heading */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
            My Services
          </h1>
          <p className="mt-1 text-sm text-muted">
            Manage, update, and monitor all your services.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => void fetchServices(true)}
            disabled={refreshing}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-border px-4 py-2.5 text-sm font-semibold text-foreground transition hover:bg-surface disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RefreshCw
              size={16}
              className={refreshing ? "animate-spin" : ""}
            />
            Refresh
          </button>

          <Link
            href="/dashboard/technician/add-service"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-hover"
          >
            <Plus size={17} />
            Add New Service
          </Link>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          title="Total Services"
          value={totalServices}
          icon={<Package size={21} />}
          iconClass="bg-primary/10 text-primary"
        />

        <SummaryCard
          title="Approved"
          value={approvedServices}
          icon={<CheckCircle2 size={21} />}
          iconClass="bg-emerald-500/10 text-emerald-600"
        />

        <SummaryCard
          title="Pending"
          value={pendingServices}
          icon={<Clock size={21} />}
          iconClass="bg-amber-500/10 text-amber-600"
        />

        <SummaryCard
          title="Rejected"
          value={rejectedServices}
          icon={<AlertCircle size={21} />}
          iconClass="bg-red-500/10 text-red-600"
        />
      </div>

      {/* Error state */}
      {error && (
        <div className="flex flex-col gap-3 rounded-2xl border border-red-500/20 bg-red-500/5 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-0.5 shrink-0 text-red-500" size={20} />
            <div>
              <p className="font-semibold text-foreground">
                Unable to load your services
              </p>
              <p className="mt-1 text-sm text-muted">{error}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => void fetchServices(true)}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-hover"
          >
            Try again
          </button>
        </div>
      )}

      {/* Empty state */}
      {!error && services.length === 0 && (
        <div className="rounded-2xl border border-dashed border-border bg-surface/50 px-5 py-14 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Wrench size={30} />
          </div>

          <h2 className="mt-5 text-xl font-bold text-foreground">
            No services yet
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted">
            You haven&apos;t added any services yet. Create your first service
            and start receiving customer requests.
          </p>

          <Link
            href="/dashboard/technician/add-service"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary-hover"
          >
            <Plus size={17} />
            Create Your First Service
          </Link>
        </div>
      )}

      {/* Service cards */}
      {services.length > 0 && (
        <>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-foreground">
                All Services
              </h2>
              <p className="mt-1 text-sm text-muted">
                {services.length} {services.length === 1 ? "service" : "services"}{" "}
                found
              </p>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {services.map((service) => {
              const approval =
                approvalStyles[service.approvalStatus] ??
                approvalStyles.pending;

              const isToggling = togglingId === service._id;

              return (
                <article
                  key={service._id}
                  className="overflow-hidden rounded-2xl border border-border bg-surface transition hover:shadow-md"
                >
                  {/* Image */}
                  <div className="relative h-48 bg-background">
                    {service.image ? (
                      <img
                        src={service.image}
                        alt={service.title}
                        className="h-full w-full object-cover"
                        onError={(event) => {
                          event.currentTarget.style.display = "none";
                        }}
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-muted">
                        <ImageIcon size={40} />
                      </div>
                    )}

                    <div className="absolute left-3 top-3">
                      <span
                        className={`rounded-full px-3 py-1.5 text-xs font-bold ${approval.className}`}
                      >
                        {approval.label}
                      </span>
                    </div>

                    <div className="absolute right-3 top-3">
                      <span
                        className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                          service.isAvailable
                            ? "bg-emerald-500 text-white"
                            : "bg-gray-700 text-white"
                        }`}
                      >
                        {service.isAvailable ? "Available" : "Unavailable"}
                      </span>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="space-y-4 p-5">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                        {service.category}
                      </p>

                      <h3 className="mt-1 line-clamp-1 text-lg font-bold text-foreground">
                        {service.title}
                      </h3>

                      <p className="mt-2 line-clamp-2 min-h-10 text-sm leading-5 text-muted">
                        {service.description}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 border-y border-border py-4">
                      <div>
                        <p className="text-xs text-muted">Service Price</p>
                        <p className="mt-1 font-bold text-foreground">
                          {formatUSD(Number(service.basePrice) || 0)}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-muted">Duration</p>
                        <p className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-foreground">
                          <Clock size={14} className="text-primary" />
                          {service.estimatedDuration || "Not specified"}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-muted">Service Area</p>
                        <p className="mt-1 flex items-center gap-1.5 text-sm font-medium text-foreground">
                          <MapPin
                            size={14}
                            className="shrink-0 text-primary"
                          />
                          <span className="truncate">
                            {service.serviceArea || "Not specified"}
                          </span>
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-muted">Service Mode</p>
                        <p className="mt-1 text-sm font-medium text-foreground">
                          {service.serviceMode || "Not specified"}
                        </p>
                      </div>
                    </div>

                    {/* Availability toggle */}
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-foreground">
                          Service Availability
                        </p>
                        <p className="mt-0.5 text-xs text-muted">
                          {service.isAvailable
                            ? "Customers can see this service."
                            : "Hidden from public service pages."}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => void handleToggleAvailability(service)}
                        disabled={isToggling}
                        aria-label={
                          service.isAvailable
                            ? "Make service unavailable"
                            : "Make service available"
                        }
                        className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition disabled:cursor-not-allowed disabled:opacity-60 ${
                          service.isAvailable
                            ? "bg-primary"
                            : "bg-gray-400"
                        }`}
                      >
                        {isToggling ? (
                          <Loader2
                            size={15}
                            className="absolute left-1/2 -translate-x-1/2 animate-spin text-white"
                          />
                        ) : (
                          <span
                            className={`h-5 w-5 rounded-full bg-white shadow transition ${
                              service.isAvailable
                                ? "translate-x-6"
                                : "translate-x-1"
                            }`}
                          />
                        )}
                      </button>
                    </div>

                    {/* Actions */}
                    <div className="grid grid-cols-2 gap-3 pt-1">
                      <button
                        type="button"
                        onClick={() => openEditModal(service)}
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-border px-3 py-2.5 text-sm font-semibold text-foreground transition hover:bg-background"
                      >
                        <Pencil size={15} />
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() => setDeletingService(service)}
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-500/20 px-3 py-2.5 text-sm font-semibold text-red-500 transition hover:bg-red-500/10"
                      >
                        <Trash2 size={15} />
                        Delete
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </>
      )}

      {/* Edit modal */}
      {editingService && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/60 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeEditModal();
            }
          }}
        >
          <div className="my-auto w-full max-w-2xl overflow-hidden rounded-2xl border border-border bg-surface shadow-2xl">
            <div className="flex items-center justify-between border-b border-border px-5 py-4 sm:px-6">
              <div>
                <h2 className="text-xl font-bold text-foreground">
                  Edit Service
                </h2>
                <p className="mt-1 text-sm text-muted">
                  Update your service information.
                </p>
              </div>

              <button
                type="button"
                onClick={closeEditModal}
                disabled={saving}
                className="rounded-lg p-2 text-muted transition hover:bg-background hover:text-foreground disabled:opacity-50"
                aria-label="Close edit modal"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleUpdateService}>
              <div className="max-h-[70vh] space-y-5 overflow-y-auto p-5 sm:p-6">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-foreground">
                    Service Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(event) =>
                      handleFormChange("title", event.target.value)
                    }
                    required
                    maxLength={100}
                    placeholder="e.g. Smartphone Display Repair"
                    className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition placeholder:text-muted focus:border-primary"
                  />
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-foreground">
                      Category *
                    </label>
                    <select
                      value={formData.category}
                      onChange={(event) =>
                        handleFormChange("category", event.target.value)
                      }
                      required
                      className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none focus:border-primary"
                    >
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-foreground">
                      Base Price (USD) *
                    </label>
                    <input
                      type="number"
                      min="1"
                      step="0.01"
                      value={formData.basePrice}
                      onChange={(event) =>
                        handleFormChange("basePrice", event.target.value)
                      }
                      required
                      placeholder="e.g. 25.00"
                      className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none focus:border-primary"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-foreground">
                    Description *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(event) =>
                      handleFormChange("description", event.target.value)
                    }
                    required
                    rows={4}
                    maxLength={1500}
                    placeholder="Describe your service..."
                    className="w-full resize-y rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition placeholder:text-muted focus:border-primary"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-foreground">
                    Image URL *
                  </label>
                  <input
                    type="url"
                    value={formData.image}
                    onChange={(event) =>
                      handleFormChange("image", event.target.value)
                    }
                    required
                    placeholder="https://example.com/service-image.jpg"
                    className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none focus:border-primary"
                  />
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-foreground">
                      Estimated Duration *
                    </label>
                    <input
                      type="text"
                      value={formData.estimatedDuration}
                      onChange={(event) =>
                        handleFormChange(
                          "estimatedDuration",
                          event.target.value
                        )
                      }
                      required
                      placeholder="e.g. 2 hours"
                      className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none focus:border-primary"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-foreground">
                      Service Mode *
                    </label>
                    <select
                      value={formData.serviceMode}
                      onChange={(event) =>
                        handleFormChange("serviceMode", event.target.value)
                      }
                      required
                      className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none focus:border-primary"
                    >
                      {serviceModes.map((mode) => (
                        <option key={mode} value={mode}>
                          {mode}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-foreground">
                    Service Area *
                  </label>
                  <input
                    type="text"
                    value={formData.serviceArea}
                    onChange={(event) =>
                      handleFormChange("serviceArea", event.target.value)
                    }
                    required
                    placeholder="e.g. Dhaka, Mirpur"
                    className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none focus:border-primary"
                  />
                </div>

                <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
                  <p className="text-sm font-semibold text-amber-600">
                    Admin approval required
                  </p>
                  <p className="mt-1 text-xs leading-5 text-muted">
                    After updating this service, its approval status will
                    automatically change to Pending. The service will need
                    admin approval again before appearing publicly.
                  </p>
                </div>
              </div>

              <div className="flex flex-col-reverse gap-3 border-t border-border px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
                <button
                  type="button"
                  onClick={closeEditModal}
                  disabled={saving}
                  className="rounded-xl border border-border px-5 py-3 text-sm font-semibold text-foreground transition hover:bg-background disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving ? (
                    <>
                      <Loader2 size={17} className="animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 size={17} />
                      Update Service
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete confirmation modal */}
      {deletingService && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-md rounded-2xl border border-border bg-surface p-6 shadow-2xl">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-500/10 text-red-500">
              <Trash2 size={25} />
            </div>

            <div className="mt-4 text-center">
              <h2 className="text-xl font-bold text-foreground">
                Delete Service?
              </h2>

              <p className="mt-2 text-sm leading-6 text-muted">
                Are you sure you want to delete{" "}
                <span className="font-semibold text-foreground">
                  {deletingService.title}
                </span>
                ? This action cannot be undone.
              </p>
            </div>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => setDeletingService(null)}
                disabled={deleting}
                className="flex-1 rounded-xl border border-border px-4 py-3 text-sm font-semibold text-foreground transition hover:bg-background disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={() => void handleDeleteService()}
                disabled={deleting}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-red-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {deleting ? (
                  <>
                    <Loader2 size={17} className="animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 size={17} />
                    Yes, Delete
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

interface SummaryCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  iconClass: string;
}

function SummaryCard({
  title,
  value,
  icon,
  iconClass,
}: SummaryCardProps) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-muted">{title}</p>
          <p className="mt-2 text-3xl font-bold text-foreground">{value}</p>
        </div>

        <div
          className={`flex h-12 w-12 items-center justify-center rounded-xl ${iconClass}`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}
