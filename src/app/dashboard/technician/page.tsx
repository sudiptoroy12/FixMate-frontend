
"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { DollarSign, CreditCard } from "lucide-react";

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

interface Earnings {
  totalEarnings: number;
  totalPayments: number;
  currency: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const formatUSD = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

export default function TechnicianDashboardPage() {
  const [services, setServices] = useState<TechnicianService[]>([]);
  const [requests, setRequests] = useState<ServiceRequest[]>([]);

  const [earnings, setEarnings] = useState<Earnings>({
    totalEarnings: 0,
    totalPayments: 0,
    currency: "USD",
  });

  const [loading, setLoading] = useState(true);

  const fetchDashboardData = useCallback(async () => {
    try {
      if (!API_URL) {
        throw new Error("API URL is not configured.");
      }

      const token = await getTokenFromClient();

      if (!token) {
        throw new Error("Please sign in to view your dashboard.");
      }

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      // Fetch all dashboard data simultaneously
      const [
        servicesResponse,
        requestsResponse,
        earningsResponse,
      ] = await Promise.all([
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

        fetch(`${API_URL}/api/payments/technician`, {
          method: "GET",
          headers,
          cache: "no-store",
        }),
      ]);

      const [
        servicesResult,
        requestsResult,
        earningsResult,
      ] = await Promise.all([
        servicesResponse.json(),
        requestsResponse.json(),
        earningsResponse.json(),
      ]);

      // Validate services response
      if (!servicesResponse.ok || !servicesResult.success) {
        throw new Error(
          servicesResult.message || "Failed to fetch your services."
        );
      }

      // Validate requests response
      if (!requestsResponse.ok || !requestsResult.success) {
        throw new Error(
          requestsResult.message ||
            "Failed to fetch service requests."
        );
      }

      // Validate earnings response
      if (!earningsResponse.ok || !earningsResult.success) {
        throw new Error(
          earningsResult.message ||
            "Failed to fetch technician earnings."
        );
      }

      setServices(servicesResult.data || []);
      setRequests(requestsResult.data || []);

      setEarnings({
        totalEarnings: Number(
          earningsResult.data?.totalEarnings
        ) || 0,

        totalPayments: Number(
          earningsResult.data?.totalPayments
        ) || 0,

        currency: earningsResult.data?.currency || "USD",
      });
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
          requests.filter(
            (request) => request.status === "requested"
          ).length
        }
        acceptedRequests={
          requests.filter(
            (request) => request.status === "accepted"
          ).length
        }
        completedJobs={
          requests.filter(
            (request) => request.status === "completed"
          ).length
        }
        loading={loading}
      />

      {/* Total Earnings */}
      <section className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/10">
              <DollarSign
                size={28}
                className="text-emerald-600"
              />
            </div>

            <div>
              <p className="text-sm font-medium text-muted">
                Total Earnings
              </p>

              {loading ? (
                <div className="mt-2 h-8 w-36 animate-pulse rounded-lg bg-surface-secondary" />
              ) : (
                <h3 className="mt-1 text-3xl font-bold text-foreground">
                  {formatUSD(earnings.totalEarnings)}
                </h3>
              )}

              <p className="mt-1 text-xs text-muted">
                Successful payments received in USD
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-xl bg-surface-secondary px-4 py-3">
            <CreditCard size={18} className="text-primary" />

            <div>
              <p className="text-xs text-muted">
                Successful Payments
              </p>

              <p className="text-lg font-bold text-foreground">
                {loading ? "..." : earnings.totalPayments}
              </p>
            </div>
          </div>
        </div>
      </section>

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
