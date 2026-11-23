
import { Suspense } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

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
        <div className="h-8 w-1/2 rounded bg-surface-secondary" />
        <div className="h-96 rounded-2xl bg-surface-secondary" />
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
    <main className="min-h-screen bg-background px-4 py-12">
      <div className="mx-auto max-w-3xl">

        {/* Back to Service Button */}
        <Link
          href={`/services/${service._id}`}
          className="group mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-surface px-5 py-2.5 text-sm font-semibold text-foreground shadow-sm transition-all duration-300 hover:-translate-x-1 hover:border-primary hover:text-primary hover:shadow-md"
        >
          <ArrowLeft
            size={17}
            className="transition-transform duration-300 group-hover:-translate-x-1"
          />
          Back
        </Link>

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
