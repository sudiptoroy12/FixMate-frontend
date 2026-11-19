
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  CalendarDays,
  Clock,
  MapPin,
  ShieldCheck,
  Wrench,
} from "lucide-react";

import type { Service } from "@/types/service";

interface ServiceDetailsProps {
  service: Service;
}

export default function ServiceDetails({
  service,
}: ServiceDetailsProps) {
  const technician = service.technician;

  return (
    <main className="min-h-screen bg-gray-50 py-10 dark:bg-gray-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Back Button */}
        <Link
          href="/services"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-gray-600 transition hover:text-[#167d68] dark:text-gray-300"
        >
          <ArrowLeft size={18} />
          Back to Services
        </Link>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">

          {/* Main Service Information */}
          <div className="space-y-6 lg:col-span-2">

            {/* Service Image */}
            <div className="relative h-[280px] overflow-hidden rounded-2xl bg-gray-200 sm:h-[420px] dark:bg-gray-800">
              {service.image ? (
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  unoptimized
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <Wrench size={64} className="text-gray-400" />
                </div>
              )}

              <span className="absolute left-4 top-4 rounded-full bg-[#167d68] px-4 py-2 text-sm font-semibold text-white">
                {service.category}
              </span>
            </div>

            {/* Title and Description */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">

              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400">
                  Available
                </span>

                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Service ID: {service._id.slice(-8)}
                </span>
              </div>

              <h1 className="mb-4 text-2xl font-bold text-gray-900 sm:text-3xl dark:text-white">
                {service.title}
              </h1>

              <p className="leading-7 text-gray-600 dark:text-gray-300">
                {service.description}
              </p>

              <div className="my-6 border-t border-gray-200 dark:border-gray-800" />

              <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                Service Information
              </h2>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

                <div className="flex items-start gap-3">
                  <Clock className="mt-1 text-[#167d68]" size={21} />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Estimated Duration
                    </p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {service.estimatedDuration}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Wrench className="mt-1 text-[#167d68]" size={21} />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Service Mode
                    </p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {service.serviceMode}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="mt-1 text-[#167d68]" size={21} />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Service Area
                    </p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {service.serviceArea}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <BadgeCheck className="mt-1 text-[#167d68]" size={21} />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Service Category
                    </p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {service.category}
                    </p>
                  </div>
                </div>

              </div>
            </div>

            {/* Technician Information */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">

              <h2 className="mb-5 text-xl font-bold text-gray-900 dark:text-white">
                About the Technician
              </h2>

              {technician ? (
                <div className="flex flex-col gap-5 sm:flex-row">

                  <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                    {technician.image ? (
                      <Image
                        src={technician.image}
                        alt={technician.name}
                        fill
                        unoptimized
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-3xl font-bold text-[#167d68]">
                        {technician.name?.charAt(0).toUpperCase() || "T"}
                      </div>
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                        {technician.name}
                      </h3>
                      <BadgeCheck
                        size={19}
                        className="text-[#167d68]"
                      />
                    </div>

                    {technician.area && (
                      <p className="mb-3 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                        <MapPin size={16} />
                        {technician.area}
                      </p>
                    )}

                    <p className="text-sm leading-6 text-gray-600 dark:text-gray-300">
                      {technician.bio ||
                        "This technician has not added a profile description yet."}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Technician profile information is currently unavailable.
                </p>
              )}
            </div>
          </div>

          {/* Booking Sidebar */}
          <aside className="h-fit rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">

            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Starting Price
            </p>

            <h2 className="my-2 text-3xl font-bold text-[#167d68]">
              ${service.basePrice}
            </h2>

            <p className="text-xs text-gray-500 dark:text-gray-400">
              Final cost may vary depending on the repair.
            </p>

            <div className="my-6 border-t border-gray-200 dark:border-gray-800" />

            <div className="space-y-4">

              <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                <Clock size={19} className="text-[#167d68]" />
                {service.estimatedDuration}
              </div>

              <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                <MapPin size={19} className="text-[#167d68]" />
                {service.serviceArea}
              </div>

              <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                <ShieldCheck size={19} className="text-[#167d68]" />
                Admin-approved service
              </div>

            </div>

            <div className="mt-7">
              <Link
                href={`/services/${service._id}/request`}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#167d68] px-5 py-3.5 font-semibold text-white transition hover:bg-[#126653]"
              >
                Request Repair
                <ArrowRight size={19} />
              </Link>
            </div>

            <p className="mt-4 text-center text-xs leading-5 text-gray-500 dark:text-gray-400">
              Submit your repair request and the technician will review it.
            </p>

          </aside>
        </div>
      </div>
    </main>
  );
}
