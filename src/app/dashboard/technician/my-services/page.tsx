
"use client";

import { useCallback, useEffect, useState } from "react";
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
} from "lucide-react";
import { toast } from "react-toastify";
import { getTokenFromClient } from "@/lib/(getToken)/getTokenFromClient";


interface Service {
  _id: string;
  title: string;
  category: string;
  description: string;
  image: string;
  basePrice: number;
  estimatedDuration: string;
  serviceMode: string;
  serviceArea: string;
  approvalStatus: "pending" | "approved" | "rejected";
  isAvailable: boolean;
  createdAt: string;
}

const statusStyles = {
  pending: "bg-amber-100 text-amber-700",
  approved: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
};

export default function MyServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

const fetchServices = useCallback(async (showLoading = true) => {
  if (showLoading) {
    setLoading(true);
  }

  try {
    const token = await getTokenFromClient();

    if (!token) {
      throw new Error("Please sign in to view your services.");
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    if (!apiUrl) {
      throw new Error("Backend API URL is not configured.");
    }

    const response = await fetch(
      `${apiUrl.replace(/\/$/, "")}/api/services/my-services`,
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
        result.message || "Failed to load your services."
      );
    }

    setServices(result.data);
    setError("");
  } catch (err) {
    const message =
      err instanceof Error
        ? err.message
        : "Something went wrong.";

    setError(message);
    toast.error(message);
  } finally {
    setLoading(false);
  }
}, []);
const handleRefresh = () => {
  void fetchServices(true);
};
useEffect(() => {
  let cancelled = false;

  const loadServices = async () => {
    try {
      const token = await getTokenFromClient();

      if (!token) {
        throw new Error("Please sign in to view your services.");
      }

      const apiUrl = process.env.NEXT_PUBLIC_API_URL;

      if (!apiUrl) {
        throw new Error("Backend API URL is not configured.");
      }

      const response = await fetch(
        `${apiUrl.replace(/\/$/, "")}/api/services/my-services`,
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
        throw new Error(result.message || "Failed to load your services.");
      }

      if (!cancelled) {
        setServices(result.data);
        setError("");
      }
    } catch (err) {
      if (!cancelled) {
        const message =
          err instanceof Error ? err.message : "Something went wrong.";

        setError(message);
        toast.error(message);
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

  const pendingCount = services.filter(
    (service) => service.approvalStatus === "pending"
  ).length;

  const approvedCount = services.filter(
    (service) => service.approvalStatus === "approved"
  ).length;

  const rejectedCount = services.filter(
    (service) => service.approvalStatus === "rejected"
  ).length;

  return (
    <div className="mx-auto max-w-7xl space-y-6">

      {/* Heading */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-2xl font-bold text-foreground">
            My Services
          </h2>
          <p className="mt-1 text-sm text-muted">
            Manage and track all the repair services you have published.
          </p>
        </div>

        <div className="flex gap-3">
          <button onClick={handleRefresh}>
  <RefreshCw size={16} />
  Refresh
</button>

          <Link
            href="/dashboard/technician/add-service"
            className="flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground transition hover:bg-primary-hover"
          >
            <Plus size={18} />
            Add Service
          </Link>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-border bg-surface p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-muted">
              Total Services
            </p>
            <Wrench className="text-primary" size={21} />
          </div>
          <p className="mt-3 text-3xl font-bold text-foreground">
            {services.length}
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-surface p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-muted">
              Approved
            </p>
            <CheckCircle2 className="text-green-600" size={21} />
          </div>
          <p className="mt-3 text-3xl font-bold text-foreground">
            {approvedCount}
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-surface p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-muted">
              Pending Review
            </p>
            <Clock className="text-amber-500" size={21} />
          </div>
          <p className="mt-3 text-3xl font-bold text-foreground">
            {pendingCount}
          </p>
        </div>
      </div>

      {/* Services */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-foreground">
            Published Services
          </h3>
          <p className="text-sm text-muted">
            {services.length} services
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex min-h-64 flex-col items-center justify-center rounded-2xl border border-border bg-surface">
            <Loader2
              size={32}
              className="animate-spin text-primary"
            />
            <p className="mt-3 text-sm text-muted">
              Loading your services...
            </p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="flex min-h-64 flex-col items-center justify-center rounded-2xl border border-border bg-surface p-6 text-center">
            <AlertCircle size={36} className="text-red-500" />
            <h3 className="mt-3 font-semibold text-foreground">
              Unable to load services
            </h3>
            <p className="mt-1 text-sm text-muted">{error}</p>
            <button
              onClick={handleRefresh}
              className="mt-4 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-hover"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && services.length === 0 && (
          <div className="flex min-h-72 flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-surface p-6 text-center">
            <div className="rounded-2xl bg-primary/10 p-4 text-primary">
              <Package size={32} />
            </div>
            <h3 className="mt-4 text-lg font-bold text-foreground">
              No Services Yet
            </h3>
            <p className="mt-2 max-w-sm text-sm text-muted">
              You haven&apos;t published any repair services yet.
              Add your first service to get started.
            </p>
            <Link
              href="/dashboard/technician/add-service"
              className="mt-5 flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary-hover"
            >
              <Plus size={17} />
              Add Your First Service
            </Link>
          </div>
        )}

        {/* Service List */}
        {!loading && !error && services.length > 0 && (
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            {services.map((service) => (
              <div
                key={service._id}
                className="overflow-hidden rounded-2xl border border-border bg-surface shadow-sm transition hover:shadow-md"
              >
                <div className="flex flex-col sm:flex-row">
                  {/* Image */}
                  <div className="h-52 w-full shrink-0 bg-background sm:h-auto sm:w-40">
                    <img
                      src={service.image}
                      alt={service.title}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex min-w-0 flex-1 flex-col p-5">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                        {service.category}
                      </span>

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                          statusStyles[service.approvalStatus] ??
                          "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {service.approvalStatus}
                      </span>
                    </div>

                    <h4 className="mt-3 text-lg font-bold text-foreground">
                      {service.title}
                    </h4>

                    <p className="mt-1 line-clamp-2 text-sm text-muted">
                      {service.description}
                    </p>

                    <div className="mt-4 space-y-2 text-sm text-muted">
                      <p className="flex items-center gap-2">
                        <Clock size={15} />
                        {service.estimatedDuration}
                      </p>

                      <p className="flex items-center gap-2">
                        <MapPin size={15} />
                        {service.serviceArea}
                      </p>
                    </div>

                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
                      <p className="text-lg font-bold text-primary">
                        ${service.basePrice.toFixed(2)}
                        <span className="ml-1 text-xs font-normal text-muted">
                          starting
                        </span>
                      </p>

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          service.isAvailable
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {service.isAvailable
                          ? "Available"
                          : "Unavailable"}
                      </span>
                    </div>

                    <p className="mt-3 text-xs text-muted">
                      {service.serviceMode}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
