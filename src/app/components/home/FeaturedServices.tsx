
import Link from "next/link";

import type { Service, ApiResponse } from "@/types/service";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

async function getFeaturedServices(): Promise<Service[]> {
  try {
    if (!API_URL) {
      throw new Error("API URL is not configured.");
    }

    const response = await fetch(`${API_URL}/api/featured-services`, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch featured services.");
    }

    const result: ApiResponse<Service[]> = await response.json();

    return result.success ? result.data : [];
  } catch (error) {
    console.error("Featured services error:", error);
    return [];
  }
}

export default async function FeaturedServices() {
  const services = await getFeaturedServices();

  return (
    <section className="bg-background py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Section Heading */}
        <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-primary">
              Our Services
            </p>

            <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
              Featured Services
            </h2>

            <p className="mt-3 max-w-xl text-sm leading-6 text-muted sm:text-base">
              Explore our latest repair services from trusted technicians.
              Find the right service for your needs.
            </p>
          </div>

          <Link
            href="/services"
            className="w-fit rounded-xl border border-primary px-5 py-3 text-sm font-semibold text-primary transition hover:bg-primary hover:text-white"
          >
            View All Services
          </Link>
        </div>

        {/* Service Cards */}
        {services.length === 0 ? (
          <div className="rounded-2xl border border-border bg-surface px-5 py-16 text-center">
            <h3 className="text-lg font-semibold text-foreground">
              No featured services available
            </h3>

            <p className="mt-2 text-sm text-muted">
              Please check back later for available repair services.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <article
                key={service._id}
                className="flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                {/* Service Image */}
                <div className="relative h-52 shrink-0 overflow-hidden bg-accent">
                  {service.image ? (
                    <img
                      src={service.image}
                      alt={service.title}
                      className="h-full w-full object-cover transition duration-500 hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-5xl">
                      🔧
                    </div>
                  )}

                  <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold text-primary shadow-sm">
                    {service.category}
                  </span>
                </div>

                {/* Service Information */}
                <div className="flex flex-1 flex-col p-5">
                  <div className="flex-1">
                    <h3 className="line-clamp-1 text-lg font-bold text-foreground">
                      {service.title}
                    </h3>

                    <p className="mt-3 text-sm text-muted">
                      Service Mode
                    </p>

                    <p className="mt-1 text-sm font-medium text-foreground">
                      {service.serviceMode}
                    </p>

                    <div className="mt-4">
                      <p className="text-xs text-muted">
                        Starting Price
                      </p>

                      <p className="mt-1 text-2xl font-bold text-primary">
                        ৳{service.basePrice.toLocaleString("en-BD")}
                      </p>
                    </div>

                    <div className="mt-4 border-t border-border pt-4">
                      <p className="text-xs text-muted">
                        Provided by
                      </p>

                      <p className="mt-1 truncate text-sm font-semibold text-foreground">
                        {service.technicianName}
                      </p>
                    </div>
                  </div>

                  {/* Details Button */}
                  <Link
                    href={`/services/${service._id}`}
                    className="mt-5 block w-full rounded-xl bg-primary px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-primary-hover"
                  >
                    View Details
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
