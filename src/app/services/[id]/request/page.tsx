
import { Suspense } from "react";
import { notFound } from "next/navigation";

import { getServiceById } from "@/lib/services-api";
import RepairRequestForm from "@/app/components/services/RepairRequestForm";


interface RequestPageProps {
  params: Promise<{
    id: string;
  }>;
}

function RequestPageSkeleton() {
  return (
    <main className="mx-auto max-w-7xl animate-pulse px-4 py-12">
      <div className="mx-auto max-w-3xl space-y-5">
        <div className="h-8 w-1/2 rounded bg-gray-200 dark:bg-gray-700" />
        <div className="h-96 rounded-2xl bg-gray-200 dark:bg-gray-700" />
      </div>
    </main>
  );
}

async function RequestPageContent({ params }: RequestPageProps) {
  const { id } = await params;

  let service;

  try {
    service = await getServiceById(id);
  } catch (error) {
    if (error instanceof Error && error.message === "SERVICE_NOT_FOUND") {
      notFound();
    }

    throw error;
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-12 dark:bg-gray-950">
      <div className="mx-auto max-w-3xl">
        <RepairRequestForm
          serviceId={service._id}
          serviceTitle={service.title}
        />
      </div>
    </main>
  );
}

export default function RequestPage({ params }: RequestPageProps) {
  return (
    <Suspense fallback={<RequestPageSkeleton />}>
      <RequestPageContent params={params} />
    </Suspense>
  );
}
