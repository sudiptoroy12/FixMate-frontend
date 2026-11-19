
import { Suspense } from "react";
import { notFound } from "next/navigation";

import type { ApiResponse, Service } from "@/types/service";
import ServiceDetails from "@/app/components/services/ServiceDetails";

interface ServicePageProps {
  params: Promise<{
    id: string;
  }>;
}

function ServiceDetailsSkeleton() {
  return (
    <main className="mx-auto min-h-screen max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="h-8 w-32 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700" />
          <div className="aspect-video animate-pulse rounded-2xl bg-gray-200 dark:bg-gray-700" />
          <div className="h-8 w-2/3 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700" />
          <div className="h-4 w-full animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
          <div className="h-4 w-5/6 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
          <div className="h-40 animate-pulse rounded-2xl bg-gray-200 dark:bg-gray-700" />
        </div>

        <div className="h-80 animate-pulse rounded-2xl bg-gray-200 dark:bg-gray-700" />
      </div>
    </main>
  );
}

async function ServiceDetailsContent({ params }: ServicePageProps) {
  const { id } = await params;

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  if (!API_URL) {
    throw new Error("API URL is not configured.");
  }

  let service: Service;

  try {
    const response = await fetch(
      `${API_URL}/api/services/${id}`,
      {
        method: "GET",
        cache: "no-store",
      }
    );

    if (response.status === 404 || response.status === 400) {
      notFound();
    }

    if (!response.ok) {
      throw new Error("Failed to retrieve service details.");
    }

    const result: ApiResponse<Service> = await response.json();

    if (!result.success || !result.data) {
      notFound();
    }

    service = result.data;
  } catch (error) {
    if (error && typeof error === "object" && "digest" in error) {
      throw error;
    }

    console.error("Service details error:", error);
    throw new Error("Unable to load service details.");
  }

  return <ServiceDetails service={service} />;
}

export default function ServicePage({ params }: ServicePageProps) {
  return (
    <Suspense fallback={<ServiceDetailsSkeleton />}>
      <ServiceDetailsContent params={params} />
    </Suspense>
  );
}
