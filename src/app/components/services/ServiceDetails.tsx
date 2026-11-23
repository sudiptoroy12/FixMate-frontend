
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Clock,
  MapPin,
  ShieldCheck,
  Wrench,
  Sparkles,
  CheckCircle2,
  Zap,
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
    <main className="relative min-h-screen overflow-hidden bg-background py-10 text-foreground">

      {/* Background Decorations */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="animate-background-glow absolute -right-32 top-20 h-80 w-80 rounded-full bg-secondary/30 blur-[100px]" />
        <div className="animate-background-glow absolute -left-32 top-[500px] h-72 w-72 rounded-full bg-primary/15 blur-[100px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Back Button */}
        <Link
          href="/services"
          className="group mb-8 inline-flex items-center gap-2 rounded-full border border-border bg-surface px-5 py-2.5 text-sm font-semibold text-muted transition-all duration-300 hover:-translate-x-1 hover:border-primary hover:text-primary"
        >
          <ArrowLeft
            size={17}
            className="transition-transform duration-300 group-hover:-translate-x-1"
          />
          Back to Services
        </Link>

        {/* Page Heading */}
        <div className="mb-9 max-w-2xl">
          <span className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-accent px-4 py-2 text-sm font-semibold text-primary">
            <Sparkles size={15} />
            Professional Repair Service
          </span>

          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
            Service <span className="text-primary">Details</span>
          </h1>

          <p className="mt-3 leading-7 text-muted">
            Explore the service details, meet your technician, and
            request professional repair assistance.
          </p>
        </div>

        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-3">

          {/* Main Content */}
          <div className="space-y-7 lg:col-span-2">

            {/* Service Image */}
            <div className="group relative isolate">

              <div className="animate-green-glow absolute -inset-1 -z-10 rounded-[2rem] bg-gradient-to-r from-primary/30 via-secondary/50 to-primary/30 opacity-70 blur-lg" />

              <div className="relative h-[280px] overflow-hidden rounded-[1.75rem] border border-border bg-surface-secondary sm:h-[430px]">

                {service.image ? (
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    unoptimized
                    priority
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <Wrench size={70} className="animate-tool-float text-primary/50" />
                  </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/10" />

                <span className="absolute left-5 top-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-primary/95 px-5 py-2.5 text-sm font-bold text-white shadow-xl backdrop-blur-md">
                  <Wrench size={16} />
                  {service.category}
                </span>

                <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-3">
                  <div>
                    <p className="mb-1 text-sm font-medium text-white/80">
                      FixMate Professional Service
                    </p>
                    <h2 className="text-xl font-bold text-white sm:text-2xl">
                      Quality Repair. Trusted Experts.
                    </h2>
                  </div>

                  <div className="animate-tool-float hidden h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/30 bg-white/20 text-white backdrop-blur-md sm:flex">
                    <Zap size={24} />
                  </div>
                </div>
              </div>
            </div>

            {/* Service Description */}
            <section className="group rounded-3xl border border-border bg-surface p-6 shadow-[var(--card-shadow)] transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 sm:p-8">

              <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <span className="inline-flex items-center gap-2 rounded-full bg-success/10 px-4 py-2 text-sm font-semibold text-success">
                  <CheckCircle2 size={16} />
                  Available
                </span>

                <span className="rounded-full bg-surface-secondary px-4 py-2 text-xs font-medium text-muted">
                  ID: {service._id.slice(-8)}
                </span>
              </div>

              <h2 className="mb-4 text-2xl font-extrabold tracking-tight sm:text-3xl">
                {service.title}
              </h2>

              <p className="leading-8 text-muted">
                {service.description}
              </p>

              <div className="my-8 h-px bg-border" />

              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-primary">
                  <Wrench size={20} />
                </div>
                <div>
                  <h3 className="font-bold">Service Information</h3>
                  <p className="text-xs text-muted">
                    Everything you need to know
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                {[
                  {
                    icon: Clock,
                    label: "Estimated Duration",
                    value: service.estimatedDuration,
                  },
                  {
                    icon: Wrench,
                    label: "Service Mode",
                    value: service.serviceMode,
                  },
                  {
                    icon: MapPin,
                    label: "Service Area",
                    value: service.serviceArea,
                  },
                  {
                    icon: BadgeCheck,
                    label: "Service Category",
                    value: service.category,
                  },
                ].map((item) => {
                  const Icon = item.icon;

                  return (
                    <div
                      key={item.label}
                      className="group/item flex items-start gap-4 rounded-2xl border border-border bg-surface-secondary/60 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:bg-accent/50"
                    >
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-all duration-300 group-hover/item:scale-110 group-hover/item:bg-primary group-hover/item:text-white">
                        <Icon size={21} />
                      </div>

                      <div className="min-w-0">
                        <p className="mb-1 text-xs font-medium text-muted">
                          {item.label}
                        </p>
                        <p className="break-words font-bold">
                          {item.value}
                        </p>
                      </div>
                    </div>
                  );
                })}

              </div>
            </section>

            {/* Technician Information */}
            <section className="rounded-3xl border border-border bg-surface p-6 shadow-[var(--card-shadow)] transition-all duration-300 hover:border-primary/40 sm:p-8">

              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent text-primary">
                  <BadgeCheck size={22} />
                </div>

                <div>
                  <h2 className="text-xl font-extrabold">
                    About the Technician
                  </h2>
                  <p className="text-sm text-muted">
                    Meet your service professional
                  </p>
                </div>
              </div>

              {technician ? (
                <div className="flex flex-col gap-5 rounded-2xl border border-border bg-surface-secondary/50 p-5 sm:flex-row sm:items-center">

                  <div className="relative mx-auto h-28 w-28 shrink-0 rounded-full bg-gradient-to-br from-primary via-secondary to-primary p-1 sm:mx-0">
                    <div className="relative h-full w-full overflow-hidden rounded-full border-4 border-surface bg-surface">

                      {technician.image ? (
                        <Image
                          src={technician.image}
                          alt={technician.name}
                          fill
                          unoptimized
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-3xl font-extrabold text-primary">
                          {technician.name?.charAt(0).toUpperCase() || "T"}
                        </div>
                      )}

                    </div>

                    <span className="absolute bottom-1 right-0 flex h-7 w-7 items-center justify-center rounded-full border-2 border-surface bg-success text-white">
                      <CheckCircle2 size={15} />
                    </span>
                  </div>

                  <div className="min-w-0 flex-1 text-center sm:text-left">

                    <div className="mb-2 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                      <h3 className="text-xl font-extrabold">
                        {technician.name}
                      </h3>

                      <BadgeCheck size={19} className="text-primary" />
                    </div>

                    {technician.area && (
                      <p className="mb-3 flex items-center justify-center gap-2 text-sm text-muted sm:justify-start">
                        <MapPin size={16} className="text-primary" />
                        {technician.area}
                      </p>
                    )}

                    <p className="text-sm leading-7 text-muted">
                      {technician.bio ||
                        "This technician has not added a profile description yet."}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="rounded-2xl bg-surface-secondary p-5 text-sm text-muted">
                  Technician profile information is currently unavailable.
                </p>
              )}
            </section>

          </div>

          {/* Booking Sidebar */}
          <aside className="lg:sticky lg:top-24">

            <div className="relative overflow-hidden rounded-3xl border border-border bg-surface p-6 shadow-[var(--card-shadow)] sm:p-7">

              {/* Sidebar Glow */}
              <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-secondary/30 blur-[70px]" />

              <div className="relative">

                <span className="inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-xs font-bold text-primary">
                  <Sparkles size={14} />
                  Professional Service
                </span>

                <p className="mt-6 text-sm font-medium text-muted">
                  Starting Price
                </p>

                <h2 className="my-2 text-4xl font-extrabold tracking-tight text-primary">
                  ${service.basePrice}
                </h2>

                <p className="text-xs leading-6 text-muted">
                  Final cost may vary depending on the repair requirements.
                </p>

                <div className="my-7 h-px bg-border" />

                <h3 className="mb-5 font-bold">
                  What&apos;s Included
                </h3>

                <div className="space-y-5">

                  <div className="flex items-center gap-3 text-sm">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-primary">
                      <Clock size={19} />
                    </span>
                    <div>
                      <p className="text-xs text-muted">Duration</p>
                      <p className="font-semibold">
                        {service.estimatedDuration}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-sm">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-primary">
                      <MapPin size={19} />
                    </span>
                    <div>
                      <p className="text-xs text-muted">Service Area</p>
                      <p className="font-semibold">
                        {service.serviceArea}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-sm">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-primary">
                      <ShieldCheck size={19} />
                    </span>
                    <div>
                      <p className="text-xs text-muted">Service Status</p>
                      <p className="font-semibold">
                        Admin-approved service
                      </p>
                    </div>
                  </div>

                </div>

                <Link
                  href={`/services/${service._id}/request`}
                  className="group animate-button-glow mt-8 flex w-full items-center justify-center gap-3 rounded-xl bg-primary px-5 py-4 font-bold text-primary-foreground shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-primary-hover"
                >
                  Request Repair
                  <ArrowRight
                    size={19}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </Link>

                <p className="mt-5 text-center text-xs leading-6 text-muted">
                  Submit your repair request and the technician will review it.
                </p>

                <div className="mt-6 flex items-center justify-center gap-2 border-t border-border pt-5 text-xs font-medium text-muted">
                  <ShieldCheck size={15} className="text-success" />
                  Trusted service by FixMate
                </div>

              </div>
            </div>

          </aside>

        </div>
      </div>
    </main>
  );
}
