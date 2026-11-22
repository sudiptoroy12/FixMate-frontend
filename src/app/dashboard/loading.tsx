

import {
  LayoutDashboard,
  Wrench,
  Bell,
  Search,
  Menu,
} from "lucide-react";
import LoadingSkeleton from "../components/ui/LodingSkeleton";

export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-[#F8FAF8] dark:bg-[#0B1220]">
      {/* Dashboard Header */}
      <header className="sticky top-0 z-20 border-b border-gray-200 bg-white/90 backdrop-blur-xl dark:border-gray-800 dark:bg-gray-950/90">
        <div className="mx-auto flex h-16 max-w-[1600px] items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-lime-500/10">
              <Wrench className="h-5 w-5 text-lime-600" />
            </div>
            <div>
              <LoadingSkeleton className="h-5 w-24" />
              <LoadingSkeleton className="mt-1 h-3 w-16" />
            </div>
          </div>

          <div className="hidden items-center gap-6 md:flex">
            <LoadingSkeleton className="h-4 w-20" />
            <LoadingSkeleton className="h-4 w-20" />
            <LoadingSkeleton className="h-4 w-20" />
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden h-9 w-9 rounded-full bg-gray-100 dark:bg-gray-800 sm:block" />
            <div className="h-9 w-9 rounded-full bg-gray-100 dark:bg-gray-800" />
            <Menu className="h-5 w-5 text-gray-400 md:hidden" />
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-[1600px]">
        {/* Sidebar */}
        <aside className="hidden min-h-[calc(100vh-64px)] w-64 shrink-0 border-r border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-950 lg:block">
          <LoadingSkeleton className="mb-8 h-10 w-full" />

          <div className="space-y-3">
            {Array.from({ length: 7 }).map((_, index) => (
              <LoadingSkeleton
                key={index}
                className={`h-11 w-full ${
                  index === 0 ? "bg-lime-100 dark:bg-lime-950/40" : ""
                }`}
              />
            ))}
          </div>

          <div className="mt-12 rounded-2xl border border-gray-100 p-4 dark:border-gray-800">
            <LoadingSkeleton className="h-4 w-24" />
            <LoadingSkeleton className="mt-3 h-3 w-full" />
            <LoadingSkeleton className="mt-2 h-3 w-3/4" />
            <LoadingSkeleton className="mt-5 h-9 w-full" />
          </div>
        </aside>

        {/* Main Content */}
        <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">
          {/* Page Heading */}
          <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <LoadingSkeleton className="h-8 w-52 sm:w-64" />
              <LoadingSkeleton className="mt-3 h-4 w-64 max-w-full" />
            </div>

            <LoadingSkeleton className="h-11 w-36 rounded-xl" />
          </div>

          {/* Statistics Cards */}
          <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900"
              >
                <div className="flex items-center justify-between">
                  <LoadingSkeleton className="h-4 w-24" />
                  <LoadingSkeleton className="h-11 w-11 rounded-xl" />
                </div>
                <LoadingSkeleton className="mt-5 h-8 w-28" />
                <LoadingSkeleton className="mt-3 h-3 w-32" />
              </div>
            ))}
          </div>

          {/* Main Dashboard Sections */}
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
            {/* Recent Activity */}
            <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 xl:col-span-2">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <LoadingSkeleton className="h-5 w-36" />
                  <LoadingSkeleton className="mt-2 h-3 w-48" />
                </div>
                <LoadingSkeleton className="h-9 w-24 rounded-lg" />
              </div>

              <div className="space-y-5">
                {Array.from({ length: 5 }).map((_, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 border-b border-gray-100 pb-5 last:border-0 dark:border-gray-800"
                  >
                    <LoadingSkeleton className="h-12 w-12 shrink-0 rounded-xl" />
                    <div className="min-w-0 flex-1">
                      <LoadingSkeleton className="h-4 w-36 max-w-full" />
                      <LoadingSkeleton className="mt-2 h-3 w-52 max-w-full" />
                    </div>
                    <LoadingSkeleton className="hidden h-7 w-20 rounded-full sm:block" />
                  </div>
                ))}
              </div>
            </section>

            {/* Side Panel */}
            <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
              <LoadingSkeleton className="h-5 w-36" />
              <LoadingSkeleton className="mt-6 h-40 w-full rounded-xl" />

              <div className="mt-6 space-y-4">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <LoadingSkeleton className="h-9 w-9 rounded-lg" />
                    <div className="flex-1">
                      <LoadingSkeleton className="h-3 w-28" />
                      <LoadingSkeleton className="mt-2 h-3 w-20" />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Bottom Table */}
          <section className="mt-6 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <div className="mb-6 flex items-center justify-between">
              <LoadingSkeleton className="h-5 w-40" />
              <LoadingSkeleton className="h-9 w-28 rounded-lg" />
            </div>

            <div className="space-y-5">
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4"
                >
                  <LoadingSkeleton className="h-10 w-10 rounded-full" />
                  <LoadingSkeleton className="h-4 flex-1" />
                  <LoadingSkeleton className="hidden h-4 w-24 sm:block" />
                  <LoadingSkeleton className="h-7 w-20 rounded-full" />
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
