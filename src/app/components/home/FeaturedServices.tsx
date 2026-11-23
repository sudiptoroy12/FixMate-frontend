
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Clock3,
  MapPin,
  Wrench,
  Sparkles,
} from "lucide-react";

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
    <section className="relative overflow-hidden bg-background py-20 sm:py-24">
      {/* Background decoration */}
      <div className="pointer-events-none absolute -left-40 top-20 h-80 w-80 rounded-full bg-[#b9e769]/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-40 bottom-10 h-80 w-80 rounded-full bg-[#167d68]/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="mb-12 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div className="max-w-2xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#167d68]/15 bg-[#e8f5d5]/70 px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#167d68] dark:border-[#65d4a6]/20 dark:bg-[#167d68]/10 dark:text-[#65d4a6]">
              <Sparkles size={15} />
              Our Services
            </div>

            <h2 className="text-3xl font-black tracking-tight text-[#18352e] dark:text-white sm:text-4xl lg:text-5xl">
              Quality Repairs,
              <span className="mt-2 block bg-gradient-to-r from-[#167d68] to-[#73a928] bg-clip-text text-transparent dark:from-[#65d4a6] dark:to-[#b9e769]">
                Just a Click Away.
              </span>
            </h2>

            <p className="mt-5 max-w-xl text-sm leading-7 text-[#71827a] dark:text-gray-400 sm:text-base">
              Discover professional repair services from trusted technicians.
              Get reliable solutions for your devices without the hassle.
            </p>
          </div>

          <Link
            href="/services"
            className="group inline-flex w-fit items-center gap-3 rounded-xl border border-[#167d68]/25 bg-white px-5 py-3.5 text-sm font-bold text-[#167d68] shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#167d68] hover:bg-[#167d68] hover:text-white hover:shadow-lg hover:shadow-[#167d68]/20 dark:border-[#65d4a6]/20 dark:bg-[#223a33] dark:text-[#65d4a6] dark:hover:bg-[#167d68] dark:hover:text-white"
          >
            View All Services
            <ArrowRight
              size={18}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>
        </div>

        {/* Service Cards */}
        {services.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-[#167d68]/25 bg-[#e8f5d5]/30 px-5 py-20 text-center dark:border-[#65d4a6]/20 dark:bg-[#223a33]/40">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#167d68]/10 text-[#167d68] dark:bg-[#65d4a6]/10 dark:text-[#65d4a6]">
              <Wrench size={30} />
            </div>

            <h3 className="mt-5 text-xl font-bold text-[#18352e] dark:text-white">
              No Featured Services Yet
            </h3>

            <p className="mt-2 text-sm text-[#71827a] dark:text-gray-400">
              Please check back later for available repair services.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 items-stretch gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service, index) => (
              <article
                key={service._id}
                className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-[#167d68]/10 bg-white shadow-sm transition-all duration-500 hover:-translate-y-2 hover:border-[#167d68]/30 hover:shadow-2xl hover:shadow-[#167d68]/10 dark:border-white/10 dark:bg-[#1b302b] dark:hover:border-[#65d4a6]/30"
              >
                {/* Top accent */}
                <div className="absolute left-0 right-0 top-0 z-10 h-1 origin-left scale-x-0 bg-gradient-to-r from-[#167d68] to-[#b9e769] transition-transform duration-500 group-hover:scale-x-100" />

                {/* Service Image */}
                <div className="relative h-56 shrink-0 overflow-hidden bg-[#e8f5d5] dark:bg-[#223a33]">
                  {service.image ? (
                    <img
                      src={service.image}
                      alt={service.title}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-gradient-to-br from-[#e8f5d5] to-[#d9edcc] text-[#167d68] dark:from-[#223a33] dark:to-[#1b302b] dark:text-[#65d4a6]">
                      <Wrench size={58} strokeWidth={1.2} />
                    </div>
                  )}

                  {/* Image overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#18352e]/55 via-transparent to-transparent opacity-70 transition-opacity duration-300 group-hover:opacity-90" />

                  {/* Category */}
                  <span className="absolute left-4 top-4 rounded-full border border-white/60 bg-white/90 px-3.5 py-1.5 text-xs font-bold text-[#167d68] shadow-lg backdrop-blur-md dark:border-white/10 dark:bg-[#1b302b]/90 dark:text-[#65d4a6]">
                    {service.category}
                  </span>

                  {/* Featured label */}
                  <span className="absolute right-4 top-4 flex items-center gap-1.5 rounded-full bg-[#b9e769] px-3 py-1.5 text-[11px] font-extrabold text-[#18352e] shadow-lg">
                    <Sparkles size={12} />
                    FEATURED
                  </span>

                  {/* Image bottom text */}
                  <div className="absolute bottom-4 left-5 right-5">
                    <p className="flex items-center gap-1.5 text-xs font-semibold text-white/90">
                      <BadgeCheck size={15} />
                      Professional Repair Service
                    </p>
                  </div>
                </div>

                {/* Service Information */}
                <div className="flex flex-1 flex-col p-5 sm:p-6">
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="line-clamp-2 text-xl font-extrabold leading-snug text-[#18352e] transition-colors duration-300 group-hover:text-[#167d68] dark:text-white dark:group-hover:text-[#65d4a6]">
                        {service.title}
                      </h3>

                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#e8f5d5] text-[#167d68] transition-all duration-300 group-hover:rotate-12 group-hover:bg-[#167d68] group-hover:text-white dark:bg-[#167d68]/15 dark:text-[#65d4a6]">
                        <Wrench size={19} />
                      </div>
                    </div>

                    {/* Service Mode */}
                    <div className="mt-5 flex items-center gap-3 rounded-xl bg-[#f5f9f1] p-3.5 dark:bg-white/5">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#167d68]/10 text-[#167d68] dark:bg-[#65d4a6]/10 dark:text-[#65d4a6]">
                        <MapPin size={18} />
                      </div>

                      <div className="min-w-0">
                        <p className="text-[11px] font-medium text-[#71827a] dark:text-gray-400">
                          Service Mode
                        </p>
                        <p className="mt-0.5 truncate text-sm font-bold text-[#18352e] dark:text-white">
                          {service.serviceMode}
                        </p>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="mt-5 flex items-end justify-between gap-3">
                      <div>
                        <p className="text-xs font-medium text-[#71827a] dark:text-gray-400">
                          Starting Price
                        </p>
                        <p className="mt-1 text-3xl font-black tracking-tight text-[#167d68] dark:text-[#65d4a6]">
                          ${service.basePrice.toLocaleString("en-BD")}
                        </p>
                      </div>

                      <span className="mb-1 rounded-lg bg-[#e8f5d5] px-2.5 py-1.5 text-[10px] font-bold text-[#167d68] dark:bg-[#167d68]/15 dark:text-[#65d4a6]">
                        BASE PRICE
                      </span>
                    </div>

                    {/* Technician */}
                    <div className="mt-5 flex items-center gap-3 border-t border-[#167d68]/10 pt-4 dark:border-white/10">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#167d68] to-[#73a928] text-white shadow-md shadow-[#167d68]/20">
                        <BadgeCheck size={20} />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="text-[11px] text-[#71827a] dark:text-gray-400">
                          Provided by
                        </p>
                        <p className="mt-0.5 truncate text-sm font-bold text-[#18352e] dark:text-white">
                          {service.technicianName}
                        </p>
                      </div>

                      <div className="flex items-center gap-1 text-[11px] font-semibold text-[#167d68] dark:text-[#65d4a6]">
                        <Clock3 size={13} />
                        Expert
                      </div>
                    </div>
                  </div>

                  {/* Details Button */}
                  <Link
                    href={`/services/${service._id}`}
                    className="group/link mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#167d68] px-4 py-3.5 text-sm font-bold text-white shadow-md shadow-[#167d68]/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#126653] hover:shadow-lg hover:shadow-[#167d68]/30 active:scale-[0.98]"
                  >
                    View Service Details
                    <ArrowRight
                      size={17}
                      className="transition-transform duration-300 group-hover/link:translate-x-1"
                    />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Bottom CTA */}
        {services.length > 0 && (
          <div className="mt-12 text-center">
            <p className="text-sm text-[#71827a] dark:text-gray-400">
              Looking for something else?
            </p>
            <Link
              href="/services"
              className="mt-2 inline-flex items-center gap-2 text-sm font-bold text-[#167d68] transition-colors hover:text-[#73a928] dark:text-[#65d4a6] dark:hover:text-[#b9e769]"
            >
              Explore all available services
              <ArrowRight size={16} />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
