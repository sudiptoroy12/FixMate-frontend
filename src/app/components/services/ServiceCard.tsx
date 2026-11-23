
import Image from "next/image";
import Link from "next/link";
import {
  Clock,
  MapPin,
  Wrench,
  ArrowRight,
  Sparkles,
} from "lucide-react";

import type { Service } from "@/types/service";

interface Props {
  service: Service;
}

export default function ServiceCard({ service }: Props) {
  return (
    <article className="group relative h-full">

      {/* Animated Card Glow */}
      <div className="absolute -inset-0.5 rounded-3xl bg-gradient-to-br from-primary/30 via-secondary/30 to-primary/20 opacity-0 blur-md transition-all duration-500 group-hover:opacity-100" />

      {/* Card */}
      <div className="relative flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-surface shadow-[var(--card-shadow)] transition-all duration-500 group-hover:-translate-y-2 group-hover:border-primary/40">

        {/* Service Image */}
        <div className="relative h-52 overflow-hidden bg-surface-secondary sm:h-56">

          <Image
            src={service.image}
            alt={service.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          />

          {/* Image Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/10 opacity-70 transition-opacity duration-500 group-hover:opacity-90" />

          {/* Category */}
          <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full border border-white/30 bg-white/95 px-3.5 py-2 text-xs font-bold text-primary shadow-lg backdrop-blur-md transition-all duration-300 group-hover:-translate-y-1">
            <Sparkles size={13} />
            {service.category}
          </span>

          {/* Service Mode */}
          <span className="absolute right-4 top-4 rounded-full border border-white/20 bg-primary/95 px-3.5 py-2 text-xs font-semibold text-white shadow-lg backdrop-blur-md">
            {service.serviceMode}
          </span>

          {/* Floating Icon */}
          <div className="absolute bottom-4 right-4 flex h-11 w-11 items-center justify-center rounded-xl border border-white/30 bg-white/20 text-white opacity-0 shadow-lg backdrop-blur-md transition-all duration-500 group-hover:animate-tool-float group-hover:opacity-100">
            <Wrench size={21} />
          </div>

        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col p-5 sm:p-6">

          {/* Title */}
          <h2 className="line-clamp-1 text-lg font-extrabold tracking-tight text-foreground transition-colors duration-300 group-hover:text-primary">
            {service.title}
          </h2>

          <div className="my-4 h-px bg-border" />

          {/* Service Information */}
          <div className="space-y-3.5 text-sm text-muted">

            <div className="flex items-center gap-3 transition-transform duration-300 group-hover:translate-x-1">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-accent text-primary">
                <MapPin size={17} />
              </span>

              <span className="line-clamp-1">
                {service.serviceArea}
              </span>
            </div>

            <div className="flex items-center gap-3 transition-transform duration-300 group-hover:translate-x-1">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-accent text-primary">
                <Clock size={17} />
              </span>

              <span>{service.estimatedDuration}</span>
            </div>

            <div className="flex items-center gap-3 transition-transform duration-300 group-hover:translate-x-1">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-accent text-primary">
                <Wrench size={17} />
              </span>

              <span className="line-clamp-1">
                {service.technicianName}
              </span>
            </div>

          </div>

          {/* Price and Button */}
          <div className="mt-auto pt-6">

            <div className="mb-4 h-px bg-border" />

            <div className="flex items-center justify-between gap-3">

              {/* Price */}
              <div>
                <p className="mb-1 text-xs font-medium text-muted">
                  Starting from
                </p>

                <p className="text-2xl font-extrabold tracking-tight text-primary">
                  ${service.basePrice}
                </p>
              </div>

              {/* Details Button */}
              <Link
                href={`/services/${service._id}`}
                className="group/button inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-bold text-primary-foreground shadow-md shadow-primary/15 transition-all duration-300 hover:-translate-y-1 hover:bg-primary-hover hover:shadow-lg hover:shadow-primary/25 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20"
              >
                View Details

                <ArrowRight
                  size={17}
                  className="transition-transform duration-300 group-hover/button:translate-x-1"
                />
              </Link>

            </div>

          </div>

        </div>
      </div>
    </article>
  );
}
