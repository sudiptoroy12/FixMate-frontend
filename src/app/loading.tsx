
import Link from "next/link";
import { Wrench, Menu, Search, Bell, UserRound } from "lucide-react";

function Skeleton({
  className = "",
}: {
  className?: string;
}) {
  return (
    <div
      className={`animate-pulse rounded-lg bg-gray-200 dark:bg-gray-800 ${className}`}
    />
  );
}

export default function Loading() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#F8FAF8] dark:bg-[#0B1220]">
      {/* Navbar Skeleton */}
      <header className="sticky top-0 z-30 border-b border-gray-200 bg-white/90 backdrop-blur-xl dark:border-gray-800 dark:bg-gray-950/90">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-lime-500/10">
              <Wrench className="h-5 w-5 text-lime-600" />
            </div>

            <div>
              <p className="text-xl font-extrabold tracking-tight text-gray-900 dark:text-white">
                Fix<span className="text-lime-600">Mate</span>
              </p>
              <Skeleton className="mt-1 h-2 w-24" />
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-8 lg:flex">
            <Skeleton className="h-4 w-14" />
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-16" />
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <div className="hidden h-9 w-9 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 sm:flex">
              <Bell className="h-4 w-4 text-gray-400" />
            </div>

            <div className="hidden h-9 w-9 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 sm:flex">
              <UserRound className="h-4 w-4 text-gray-400" />
            </div>

            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800 lg:hidden">
              <Menu className="h-5 w-5 text-gray-400" />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

        {/* Hero Section */}
        <section className="relative mb-12 overflow-hidden rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-10 lg:p-14">
          <div className="relative z-10 grid items-center gap-10 lg:grid-cols-2">

            {/* Hero Text */}
            <div>
              <Skeleton className="h-8 w-48 rounded-full" />

              <Skeleton className="mt-7 h-10 w-full max-w-md" />
              <Skeleton className="mt-3 h-10 w-4/5 max-w-sm" />

              <Skeleton className="mt-6 h-4 w-full max-w-md" />
              <Skeleton className="mt-3 h-4 w-4/5 max-w-sm" />

              {/* Search Bar */}
              <div className="mt-8 flex max-w-lg items-center gap-3 rounded-2xl border border-gray-200 p-2 dark:border-gray-700">
                <Search className="ml-2 h-5 w-5 text-gray-400" />
                <Skeleton className="h-5 flex-1" />
                <Skeleton className="h-11 w-24 rounded-xl" />
              </div>

              {/* Hero Stats */}
              <div className="mt-8 flex flex-wrap gap-8">
                <div>
                  <Skeleton className="h-7 w-16" />
                  <Skeleton className="mt-2 h-3 w-24" />
                </div>
                <div>
                  <Skeleton className="h-7 w-16" />
                  <Skeleton className="mt-2 h-3 w-24" />
                </div>
                <div>
                  <Skeleton className="h-7 w-16" />
                  <Skeleton className="mt-2 h-3 w-24" />
                </div>
              </div>
            </div>

            {/* Hero Image */}
            <div className="relative">
              <Skeleton className="aspect-[4/3] w-full rounded-3xl" />
              <div className="absolute -bottom-4 -left-4 hidden rounded-2xl border border-gray-200 bg-white p-4 shadow-lg dark:border-gray-700 dark:bg-gray-800 sm:block">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="mt-2 h-3 w-20" />
              </div>
            </div>
          </div>
        </section>

        {/* Category Section */}
        <section className="mb-12">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <Skeleton className="h-7 w-48" />
              <Skeleton className="mt-2 h-4 w-64 max-w-full" />
            </div>
            <Skeleton className="h-9 w-24 rounded-lg" />
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="rounded-2xl border border-gray-200 bg-white p-5 text-center dark:border-gray-800 dark:bg-gray-900"
              >
                <Skeleton className="mx-auto h-14 w-14 rounded-2xl" />
                <Skeleton className="mx-auto mt-4 h-4 w-24 max-w-full" />
                <Skeleton className="mx-auto mt-2 h-3 w-16" />
              </div>
            ))}
          </div>
        </section>

        {/* Services Section */}
        <section className="mb-12">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <Skeleton className="h-7 w-52" />
              <Skeleton className="mt-2 h-4 w-64 max-w-full" />
            </div>
            <Skeleton className="h-9 w-28 rounded-lg" />
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <article
                key={index}
                className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900"
              >
                {/* Service Image */}
                <Skeleton className="aspect-[16/10] w-full rounded-none" />

                <div className="p-5">
                  <div className="flex items-center justify-between gap-3">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-6 w-16 rounded-full" />
                  </div>

                  <Skeleton className="mt-4 h-3 w-full" />
                  <Skeleton className="mt-2 h-3 w-4/5" />

                  <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-4 dark:border-gray-800">
                    <div>
                      <Skeleton className="h-3 w-16" />
                      <Skeleton className="mt-2 h-5 w-20" />
                    </div>

                    <Skeleton className="h-10 w-28 rounded-xl" />
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Bottom CTA Skeleton */}
        <section className="mb-10 rounded-3xl border border-gray-200 bg-white p-8 dark:border-gray-800 dark:bg-gray-900 sm:p-10">
          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
            <div className="w-full">
              <Skeleton className="h-7 w-64 max-w-full" />
              <Skeleton className="mt-3 h-4 w-full max-w-md" />
            </div>
            <Skeleton className="h-12 w-36 shrink-0 rounded-xl" />
          </div>
        </section>
      </div>

      {/* Footer Skeleton */}
      <footer className="border-t border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-3 lg:px-8">
          <div>
            <Skeleton className="h-6 w-28" />
            <Skeleton className="mt-4 h-3 w-full max-w-xs" />
            <Skeleton className="mt-2 h-3 w-4/5" />
          </div>

          <div>
            <Skeleton className="h-5 w-24" />
            <div className="mt-4 space-y-3">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-3 w-28" />
              <Skeleton className="h-3 w-20" />
            </div>
          </div>

          <div>
            <Skeleton className="h-5 w-28" />
            <Skeleton className="mt-4 h-3 w-full max-w-xs" />
            <Skeleton className="mt-3 h-10 w-full max-w-xs rounded-xl" />
          </div>
        </div>

        <div className="border-t border-gray-200 py-5 text-center dark:border-gray-800">
          <Skeleton className="mx-auto h-3 w-48" />
        </div>
      </footer>
    </main>
  );
}
