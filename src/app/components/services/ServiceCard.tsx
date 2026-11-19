
import Image from "next/image";
import Link from "next/link";
import { Clock, MapPin, Wrench, ArrowRight } from "lucide-react";
import type { Service } from "@/types/service";

interface Props {
  service: Service;
}

export default function ServiceCard({ service }: Props) {
  return (
    <div className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-gray-800 dark:bg-gray-900">

      {/* Service Image */}
      <div className="relative h-52 overflow-hidden bg-gray-100">
        <Image
          src={service.image}
          alt={service.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />

        <span className="absolute left-3 top-3 rounded-full bg-white px-3 py-1 text-xs font-semibold text-[#167d68] shadow-sm">
          {service.category}
        </span>

        <span className="absolute right-3 top-3 rounded-full bg-[#167d68] px-3 py-1 text-xs font-medium text-white">
          {service.serviceMode}
        </span>
      </div>

      {/* Content */}
      <div className="p-5">

        <h2 className="line-clamp-1 text-lg font-bold text-gray-900 dark:text-white">
          {service.title}
        </h2>

        <div className="mt-3 space-y-2 text-sm text-gray-500 dark:text-gray-400">

          <div className="flex items-center gap-2">
            <MapPin size={16} className="text-[#167d68]" />
            <span className="line-clamp-1">
              {service.serviceArea}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Clock size={16} className="text-[#167d68]" />
            <span>{service.estimatedDuration}</span>
          </div>

          <div className="flex items-center gap-2">
            <Wrench size={16} className="text-[#167d68]" />
            <span className="line-clamp-1">
              {service.technicianName}
            </span>
          </div>

        </div>

        {/* Price and Button */}
        <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-4 dark:border-gray-800">

          <div>
            <p className="text-xs text-gray-500">
              Starting from
            </p>

            <p className="text-xl font-bold text-[#167d68]">
              ${service.basePrice}
            </p>
          </div>

          <Link
            href={`/services/${service._id}`}
            className="flex items-center gap-2 rounded-xl bg-[#167d68] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#126653]"
          >
            View Details
            <ArrowRight size={16} />
          </Link>

        </div>
      </div>
    </div>
  );
}
