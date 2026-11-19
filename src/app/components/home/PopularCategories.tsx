
import Link from "next/link";

import {
  Smartphone,
  Laptop,
  Wind,
  Refrigerator,
  Tv,
  WashingMachine,
  Zap,
  ShieldCheck,
  BadgeCheck,
  ClipboardCheck,
  Wallet,
  ArrowUpRight,
} from "lucide-react";

const categories = [
  {
    name: "Smartphone",
    description: "Mobile repair services",
    icon: Smartphone,
  },
  {
    name: "Laptop & PC",
    description: "Computer repair services",
    icon: Laptop,
  },
  {
    name: "AC",
    description: "AC servicing and repair",
    icon: Wind,
  },
  {
    name: "Refrigerator",
    description: "Fridge repair services",
    icon: Refrigerator,
  },
  {
    name: "TV",
    description: "Television repair",
    icon: Tv,
  },
  {
    name: "Washing Machine",
    description: "Washing machine repair",
    icon: WashingMachine,
  },
  {
    name: "Electrical",
    description: "Electrical repair services",
    icon: Zap,
  },
];

const reasons = [
  {
    title: "Approved Service Listings",
    description:
      "Explore services that have passed the platform's approval process.",
    icon: ShieldCheck,
  },
  {
    title: "Trusted Technicians",
    description:
      "Find technicians offering services through the FixMate platform.",
    icon: BadgeCheck,
  },
  {
    title: "Easy Request Management",
    description:
      "Submit a repair request and follow its progress from your dashboard.",
    icon: ClipboardCheck,
  },
  {
    title: "Pay After Completion",
    description:
      "Complete your repair service first, then pay for the service.",
    icon: Wallet,
  },
];

export default function PopularCategories() {
  return (
    <section className="bg-background py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Section Heading */}
        <div className="mb-12 max-w-2xl">
          <p className="text-sm font-bold uppercase tracking-wider text-primary">
            Explore FixMate
          </p>

          <h2 className="mt-3 text-3xl font-bold text-foreground sm:text-4xl">
            Popular Categories
          </h2>

          <p className="mt-4 text-sm leading-7 text-muted sm:text-base">
            From smartphones to home appliances, find the right
            repair service for all your needs.
          </p>
        </div>

        <div className="grid gap-10 lg:grid-cols-3">

          {/* Categories */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {categories.map((category) => {
                const Icon = category.icon;

                return (
                  <Link
                    key={category.name}
                    href={`/services?category=${encodeURIComponent(category.name)}`}
                    className="group rounded-2xl border border-border bg-surface p-5 transition duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-lg"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition group-hover:bg-primary group-hover:text-white">
                      <Icon size={24} />
                    </div>

                    <h3 className="mt-5 font-bold text-foreground">
                      {category.name}
                    </h3>

                    <p className="mt-2 text-xs leading-5 text-muted">
                      {category.description}
                    </p>

                    <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-primary">
                      Explore Services
                      <ArrowUpRight
                        size={15}
                        className="transition group-hover:translate-x-1 group-hover:-translate-y-1"
                      />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Why Choose FixMate */}
          <div className="rounded-3xl bg-[#102b25] p-6 text-white sm:p-8">
            <p className="text-sm font-bold uppercase tracking-wider text-[#b9e769]">
              Why Choose Us
            </p>

            <h3 className="mt-3 text-2xl font-bold leading-snug">
              Repair Services You Can Rely On
            </h3>

            <p className="mt-3 text-sm leading-6 text-white/70">
              FixMate makes it easier to find repair services,
              connect with technicians, and manage your requests.
            </p>

            <div className="mt-8 space-y-7">
              {reasons.map((reason) => {
                const Icon = reason.icon;

                return (
                  <div key={reason.title} className="flex gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#b9e769]/15 text-[#b9e769]">
                      <Icon size={22} />
                    </div>

                    <div>
                      <h4 className="font-semibold text-white">
                        {reason.title}
                      </h4>

                      <p className="mt-1 text-xs leading-6 text-white/65">
                        {reason.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <Link
              href="/services"
              className="mt-9 flex w-full items-center justify-center gap-2 rounded-xl bg-[#b9e769] px-5 py-3 text-sm font-bold text-[#102b25] transition hover:bg-[#a9d85d]"
            >
              Explore All Services
              <ArrowUpRight size={17} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
