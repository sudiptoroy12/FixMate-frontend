
"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import {
  useSearchParams,
  useRouter,
  usePathname,
} from "next/navigation";

import { Wrench, RefreshCw, Search } from "lucide-react";

import { getAllServices } from "@/lib/services-api";
import type { Service } from "@/types/service";

import ServiceFilters from "../components/services/ServiceFilters";
import ServiceCard from "../components/services/ServiceCard";

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

function ServiceSkeleton() {
  return (
    <div className="animate-pulse overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
      <div className="h-52 bg-gray-200 dark:bg-gray-800" />

      <div className="space-y-4 p-5">
        <div className="h-5 w-3/4 rounded bg-gray-200 dark:bg-gray-800" />
        <div className="h-4 w-full rounded bg-gray-200 dark:bg-gray-800" />
        <div className="h-4 w-2/3 rounded bg-gray-200 dark:bg-gray-800" />

        <div className="flex justify-between border-t border-gray-100 pt-4 dark:border-gray-800">
          <div className="h-8 w-20 rounded bg-gray-200 dark:bg-gray-800" />
          <div className="h-10 w-28 rounded bg-gray-200 dark:bg-gray-800" />
        </div>
      </div>
    </div>
  );
}

function ServicesPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Get selected category from URL
  const queryCategory = searchParams.get("category");

  const category =
    queryCategory && categories.includes(queryCategory)
      ? queryCategory
      : "All Categories";

  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");

  // Update category in URL
  const handleCategoryChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value === "All Categories") {
      params.delete("category");
    } else {
      params.set("category", value);
    }

    const queryString = params.toString();

    router.replace(
      queryString ? `${pathname}?${queryString}` : pathname,
      { scroll: false }
    );
  };

  // Fetch services
  const fetchServices = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getAllServices();

      setServices(
        data.filter(
          (service) =>
            service.approvalStatus === "approved" &&
            service.isAvailable === true
        )
      );
    } catch (err) {
      console.error("Fetch services error:", err);
      setError("Unable to load services. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Initial services loading
  useEffect(() => {
    let ignore = false;

    const loadServices = async () => {
      try {
        const data = await getAllServices();

        if (!ignore) {
          setServices(
            data.filter(
              (service) =>
                service.approvalStatus === "approved" &&
                service.isAvailable === true
            )
          );
        }
      } catch (err) {
        console.error("Fetch services error:", err);

        if (!ignore) {
          setError("Unable to load services. Please try again.");
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
  }, []);

  // Search, category filtering and sorting
  const filteredServices = useMemo(() => {
    let result = [...services];

    // Search
    if (search.trim()) {
      const keyword = search.toLowerCase();

      result = result.filter(
        (service) =>
          service.title.toLowerCase().includes(keyword) ||
          service.category.toLowerCase().includes(keyword) ||
          service.technicianName.toLowerCase().includes(keyword) ||
          service.serviceArea.toLowerCase().includes(keyword)
      );
    }

    // Category filter
    if (category !== "All Categories") {
      result = result.filter(
        (service) => service.category === category
      );
    }

    // Sorting
    switch (sort) {
      case "price-low":
        result.sort((a, b) => a.basePrice - b.basePrice);
        break;

      case "price-high":
        result.sort((a, b) => b.basePrice - a.basePrice);
        break;

      case "name":
        result.sort((a, b) =>
          a.title.localeCompare(b.title)
        );
        break;

      default:
        result.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() -
            new Date(a.createdAt).getTime()
        );
    }

    return result;
  }, [services, search, category, sort]);

  // Clear all filters
  const clearFilters = () => {
    setSearch("");
    setSort("newest");
    handleCategoryChange("All Categories");
  };

  return (
    <main className="min-h-screen bg-gray-50 py-12 dark:bg-gray-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-10 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#167d68]/10 px-4 py-2 text-sm font-semibold text-[#167d68]">
            <Wrench size={17} />
            Professional Repair Services
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl lg:text-5xl">
            Find the Right
            <span className="text-[#167d68]"> Repair Service</span>
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-gray-600 dark:text-gray-400">
            Explore professional repair services from experienced
            technicians. Get reliable solutions for all your devices.
          </p>
        </div>

        {/* Search and Filters */}
        <ServiceFilters
          search={search}
          setSearch={setSearch}
          category={category}
          setCategory={handleCategoryChange}
          sort={sort}
          setSort={setSort}
        />

        {/* Results Header */}
        <div className="mb-6 mt-8 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              {category === "All Categories"
                ? "Available Services"
                : `${category} Repair Services`}
            </h2>

            {!loading && (
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {filteredServices.length} services found
              </p>
            )}
          </div>

          <button
            onClick={fetchServices}
            disabled={loading}
            className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-600 transition hover:border-[#167d68] hover:text-[#167d68] disabled:opacity-50 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300"
          >
            <RefreshCw
              size={16}
              className={loading ? "animate-spin" : ""}
            />
            Refresh
          </button>
        </div>

        {/* Loading */}
        {loading && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <ServiceSkeleton key={index} />
            ))}
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-10 text-center dark:border-red-900 dark:bg-red-950/20">
            <p className="font-semibold text-red-600 dark:text-red-400">
              {error}
            </p>

            <button
              onClick={fetchServices}
              className="mt-5 rounded-xl bg-[#167d68] px-6 py-3 font-semibold text-white hover:bg-[#126653]"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Service Cards */}
        {!loading && !error && filteredServices.length > 0 && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredServices.map((service) => (
              <ServiceCard
                key={service._id}
                service={service}
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredServices.length === 0 && (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-5 py-16 text-center dark:border-gray-700 dark:bg-gray-900">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#167d68]/10">
              <Search size={30} className="text-[#167d68]" />
            </div>

            <h3 className="mt-5 text-xl font-bold text-gray-900 dark:text-white">
              No Services Found
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm text-gray-500 dark:text-gray-400">
              We couldn&apos;t find any services matching your search.
              Try changing your search keyword or category.
            </p>

            <button
              onClick={clearFilters}
              className="mt-6 rounded-xl bg-[#167d68] px-6 py-3 font-semibold text-white transition hover:bg-[#126653]"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </main>
  );
}

// Suspense boundary for useSearchParams()
export default function ServicesPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-gray-50 py-12 dark:bg-gray-950">
          <div className="mx-auto max-w-7xl px-4">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, index) => (
                <ServiceSkeleton key={index} />
              ))}
            </div>
          </div>
        </main>
      }
    >
      <ServicesPageContent />
    </Suspense>
  );
}
