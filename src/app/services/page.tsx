
"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import {
  useSearchParams,
  useRouter,
  usePathname,
} from "next/navigation";

import { Wrench, RefreshCw, Search, Sparkles } from "lucide-react";

import { getAllServices } from "@/lib/services-api";
import type { Service } from "@/types/service";

import ServiceFilters from "../components/services/ServiceFilters";
import ServiceCard from "../components/services/ServiceCard";
import Navbar from "../components/shared/navbar/Navbar";

const categories = [
  "All Categories",
  "Smartphone",
  "Laptop & PC",
  "AC",
  "Refrigerator",
  "TV",
  "Washing Machine",
  "Electrical",
];

const validSortOptions = ["newest", "price-asc", "price-desc"];

type SortOption = "newest" | "price-asc" | "price-desc";

function ServiceSkeleton() {
  return (
    <div className="animate-pulse overflow-hidden rounded-3xl border border-[#167d68]/10 bg-white shadow-sm dark:border-white/10 dark:bg-[#1b302b]">
      <div className="h-52 bg-[#e8f5d5] dark:bg-[#223a33]" />

      <div className="space-y-4 p-5">
        <div className="h-5 w-3/4 rounded-lg bg-[#e8f5d5] dark:bg-[#223a33]" />
        <div className="h-4 w-full rounded-lg bg-[#e8f5d5] dark:bg-[#223a33]" />
        <div className="h-4 w-2/3 rounded-lg bg-[#e8f5d5] dark:bg-[#223a33]" />

        <div className="flex justify-between border-t border-[#167d68]/10 pt-4 dark:border-white/10">
          <div className="h-8 w-20 rounded-lg bg-[#e8f5d5] dark:bg-[#223a33]" />
          <div className="h-10 w-28 rounded-lg bg-[#e8f5d5] dark:bg-[#223a33]" />
        </div>
      </div>
    </div>
  );
}

function ServicesPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Read all filters from URL
  const queryString = searchParams.toString();

  const queryCategory = searchParams.get("category") || "";
  const search = searchParams.get("search") || "";
  const serviceMode = searchParams.get("serviceMode") || "";
  const querySort = searchParams.get("sort") || "newest";

  const category = categories.includes(queryCategory)
    ? queryCategory
    : "All Categories";

  const sort: SortOption = validSortOptions.includes(querySort)
    ? (querySort as SortOption)
    : "newest";

  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Update URL query parameters
  const updateFilters = (key: string, value: string) => {
    const params = new URLSearchParams(queryString);

    if (!value || value === "All Categories") {
      params.delete(key);
    } else {
      params.set(key, value);
    }

    const newQuery = params.toString();

    router.replace(
      newQuery ? `${pathname}?${newQuery}` : pathname,
      { scroll: false }
    );
  };

  // Fetch services using current URL filters
  const fetchServices = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const params = new URLSearchParams(queryString);

      const data = await getAllServices({
        search: params.get("search") || "",
        category: params.get("category") || "",
        serviceMode: params.get("serviceMode") || "",
        sort: validSortOptions.includes(params.get("sort") || "")
          ? (params.get("sort") as SortOption)
          : "newest",
      });

      setServices(data);
    } catch (err) {
      console.error("Fetch services error:", err);
      setError("Unable to load services. Please try again.");
      setServices([]);
    } finally {
      setLoading(false);
    }
  }, [queryString]);

  // Fetch whenever URL filters change
  useEffect(() => {
    let ignore = false;

    const loadServices = async () => {
      try {
        setError("");
        setLoading(true);

        const params = new URLSearchParams(queryString);

        const data = await getAllServices({
          search: params.get("search") || "",
          category: params.get("category") || "",
          serviceMode: params.get("serviceMode") || "",
          sort: validSortOptions.includes(params.get("sort") || "")
            ? (params.get("sort") as SortOption)
            : "newest",
        });

        if (!ignore) {
          setServices(data);
        }
      } catch (err) {
        console.error("Fetch services error:", err);

        if (!ignore) {
          setError("Unable to load services. Please try again.");
          setServices([]);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    loadServices();

    return () => {
      ignore = true;
    };
  }, [queryString]);

  // Clear all filters
  const clearFilters = () => {
    router.replace(pathname, { scroll: false });
  };

  return (
    <>
      <Navbar />

      <main className="relative min-h-screen overflow-hidden bg-background py-20 sm:py-24">

        {/* Background decoration - same as Featured Services */}
        <div className="pointer-events-none absolute -left-40 top-20 h-80 w-80 rounded-full bg-[#b9e769]/10 blur-3xl" />

        <div className="pointer-events-none absolute -right-40 bottom-10 h-80 w-80 rounded-full bg-[#167d68]/10 blur-3xl" />

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          {/* Page Header */}
          <div className="mb-12 text-center">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#167d68]/15 bg-[#e8f5d5]/70 px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#167d68] dark:border-[#65d4a6]/20 dark:bg-[#167d68]/10 dark:text-[#65d4a6]">
              <Sparkles size={15} />
              Professional Repair Services
            </div>

            <h1 className="text-3xl font-black tracking-tight text-[#18352e] dark:text-white sm:text-4xl lg:text-5xl">
              Find the Right
              <span className="mt-2 block bg-gradient-to-r from-[#167d68] to-[#73a928] bg-clip-text text-transparent dark:from-[#65d4a6] dark:to-[#b9e769]">
                Repair Service
              </span>
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-[#71827a] dark:text-gray-400 sm:text-base">
              Explore professional repair services from experienced
              technicians. Get reliable solutions for all your devices
              without the hassle.
            </p>
          </div>

          {/* Search and Filters */}
          <div className="rounded-3xl border border-[#167d68]/10 bg-white/80 p-4 shadow-sm backdrop-blur-sm dark:border-white/10 dark:bg-[#1b302b]/80 sm:p-6">
            <ServiceFilters
              search={search}
              setSearch={(value) => updateFilters("search", value)}
              category={category}
              setCategory={(value) => updateFilters("category", value)}
              serviceMode={serviceMode}
              setServiceMode={(value) =>
                updateFilters("serviceMode", value)
              }
              sort={sort}
              setSort={(value) => updateFilters("sort", value)}
            />
          </div>

          {/* Results Header */}
          <div className="mb-7 mt-10 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-extrabold text-[#18352e] dark:text-white sm:text-2xl">
                {category === "All Categories"
                  ? "Available Services"
                  : `${category} Repair Services`}
              </h2>

              {!loading && !error && (
                <p className="mt-1.5 text-sm text-[#71827a] dark:text-gray-400">
                  {services.length} services found
                </p>
              )}
            </div>

            <button
              onClick={fetchServices}
              disabled={loading}
              className="group inline-flex items-center gap-2 rounded-xl border border-[#167d68]/20 bg-white px-4 py-2.5 text-sm font-bold text-[#167d68] shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-[#167d68] hover:bg-[#167d68] hover:text-white hover:shadow-lg hover:shadow-[#167d68]/15 disabled:cursor-not-allowed disabled:opacity-50 dark:border-[#65d4a6]/20 dark:bg-[#223a33] dark:text-[#65d4a6] dark:hover:bg-[#167d68] dark:hover:text-white"
            >
              <RefreshCw
                size={16}
                className={loading ? "animate-spin" : "transition-transform group-hover:rotate-180"}
              />
              Refresh
            </button>
          </div>

          {/* Loading */}
          {loading && (
            <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, index) => (
                <ServiceSkeleton key={index} />
              ))}
            </div>
          )}

          {/* Error */}
          {!loading && error && (
            <div className="rounded-3xl border border-red-200 bg-red-50/90 p-10 text-center shadow-sm dark:border-red-900 dark:bg-red-950/20">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400">
                <Wrench size={28} />
              </div>

              <p className="mt-5 font-bold text-red-700 dark:text-red-400">
                {error}
              </p>

              <button
                onClick={fetchServices}
                className="mt-5 rounded-xl bg-[#167d68] px-6 py-3 font-bold text-white shadow-md shadow-[#167d68]/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#126653]"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Service Cards */}
          {!loading && !error && services.length > 0 && (
            <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {services.map((service) => (
                <ServiceCard
                  key={service._id}
                  service={service}
                />
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && services.length === 0 && (
            <div className="rounded-3xl border border-dashed border-[#167d68]/25 bg-[#e8f5d5]/30 px-5 py-16 text-center dark:border-[#65d4a6]/20 dark:bg-[#223a33]/40">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#167d68]/10 text-[#167d68] dark:bg-[#65d4a6]/10 dark:text-[#65d4a6]">
                <Search size={30} />
              </div>

              <h3 className="mt-5 text-xl font-extrabold text-[#18352e] dark:text-white">
                No Services Found
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-7 text-[#71827a] dark:text-gray-400">
                We couldn&apos;t find any services matching your filters.
                Try changing your search keyword or filters.
              </p>

              <button
                onClick={clearFilters}
                className="mt-6 rounded-xl bg-[#167d68] px-6 py-3 text-sm font-bold text-white shadow-md shadow-[#167d68]/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#126653] hover:shadow-lg"
              >
                Clear Filters
              </button>
            </div>
          )}

        </div>
      </main>
    </>
  );
}

export default function ServicesPage() {
  return (
    <Suspense
      fallback={
        <>
          <Navbar />

          <main className="relative min-h-screen overflow-hidden bg-background py-20 sm:py-24">

            {/* Background decoration */}
            <div className="pointer-events-none absolute -left-40 top-20 h-80 w-80 rounded-full bg-[#b9e769]/10 blur-3xl" />

            <div className="pointer-events-none absolute -right-40 bottom-10 h-80 w-80 rounded-full bg-[#167d68]/10 blur-3xl" />

            <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="mb-12 text-center">
                <div className="mx-auto mb-5 h-6 w-48 animate-pulse rounded-full bg-[#e8f5d5] dark:bg-[#223a33]" />
                <div className="mx-auto h-12 w-80 max-w-full animate-pulse rounded-xl bg-[#e8f5d5] dark:bg-[#223a33]" />
                <div className="mx-auto mt-5 h-5 w-96 max-w-full animate-pulse rounded-lg bg-[#e8f5d5] dark:bg-[#223a33]" />
              </div>

              <div className="mb-8 h-32 animate-pulse rounded-3xl border border-[#167d68]/10 bg-white/80 dark:border-white/10 dark:bg-[#1b302b]/80" />

              <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {Array.from({ length: 8 }).map((_, index) => (
                  <ServiceSkeleton key={index} />
                ))}
              </div>
            </div>
          </main>
        </>
      }
    >
      <ServicesPageContent />
    </Suspense>
  );
}
