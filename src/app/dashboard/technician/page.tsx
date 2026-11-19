
"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";

import TechnicianStats from "@/app/components/dashboard/technician/TechnicianStats";
import RecentRequests from "@/app/components/dashboard/technician/RecentRequests";
import { getTokenFromClient } from "@/lib/(getToken)/getTokenFromClient";

interface TechnicianService {
  _id: string;
  title: string;
  approvalStatus: "pending" | "approved" | "rejected";
  isAvailable: boolean;
}

export interface ServiceRequest {
  _id: string;
  serviceId: string;
  serviceTitle: string;
  serviceCategory: string;
  servicePrice: number;

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
  createdAt: string;
  updatedAt: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function TechnicianDashboardPage() {
  const [services, setServices] = useState<TechnicianService[]>([]);
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);

 const fetchDashboardData = useCallback(async () => {
  try {
    if (!API_URL) {
      throw new Error("API URL is not configured.");
    }

    const token = await getTokenFromClient();

    const headers = {
      Authorization: `Bearer ${token}`,
    };

    const [servicesResponse, requestsResponse] = await Promise.all([
      fetch(`${API_URL}/api/services/my-services`, {
        method: "GET",
        headers,
        cache: "no-store",
      }),

      fetch(`${API_URL}/api/service-requests/technician`, {
        method: "GET",
        headers,
        cache: "no-store",
      }),
    ]);

    const [servicesResult, requestsResult] = await Promise.all([
      servicesResponse.json(),
      requestsResponse.json(),
    ]);

    if (!servicesResponse.ok || !servicesResult.success) {
      throw new Error(
        servicesResult.message || "Failed to fetch your services."
      );
    }

    if (!requestsResponse.ok || !requestsResult.success) {
      throw new Error(
        requestsResult.message || "Failed to fetch service requests."
      );
    }

    setServices(servicesResult.data || []);
    setRequests(requestsResult.data || []);
  } catch (error) {
    console.error("Technician dashboard error:", error);

    toast.error(
      error instanceof Error
        ? error.message
        : "Failed to load dashboard data."
    );
  } finally {
    setLoading(false);
  }
}, []);

useEffect(() => {
  const timer = setTimeout(() => {
    fetchDashboardData();
  }, 0);

  return () => clearTimeout(timer);
}, [fetchDashboardData]);

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="mb-1 text-sm font-medium text-primary">
            Technician Panel
          </p>

          <h2 className="text-2xl font-bold text-foreground">
            Welcome back, Technician! 👋
          </h2>

          <p className="mt-2 text-sm text-muted">
            Here&apos;s what&apos;s happening with your repair services today.
          </p>
        </div>

        <button
  onClick={() => {
    setLoading(true);
    fetchDashboardData();
  }}
  disabled={loading}
  className="rounded-xl border border-border bg-surface px-4 py-2.5 text-sm font-semibold text-foreground transition hover:bg-accent disabled:cursor-not-allowed disabled:opacity-50"
>
  {loading ? "Refreshing..." : "Refresh Dashboard"}
</button>
      </div>

      {/* Statistics */}
      <TechnicianStats
        totalServices={services.length}
        requestedRequests={
          requests.filter((request) => request.status === "requested").length
        }
        acceptedRequests={
          requests.filter((request) => request.status === "accepted").length
        }
        completedJobs={
          requests.filter((request) => request.status === "completed").length
        }
        loading={loading}
      />

      {/* Recent Requests */}
      <div className="grid grid-cols-1 gap-6">
        <RecentRequests
          requests={requests}
          loading={loading}
        />
      </div>
    </div>
  );
}
