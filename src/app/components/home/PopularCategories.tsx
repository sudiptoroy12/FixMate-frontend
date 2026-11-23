
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
  Sparkles,
  CheckCircle2,
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
    <section className="relative overflow-hidden bg-background py-20 sm:py-24">
      {/* Background decoration */}
      <div className="pointer-events-none absolute -left-40 top-20 h-80 w-80 rounded-full bg-[#b9e769]/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-40 bottom-10 h-80 w-80 rounded-full bg-[#167d68]/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="mb-12 max-w-2xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#167d68]/15 bg-[#e8f5d5]/70 px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#167d68] dark:border-[#65d4a6]/20 dark:bg-[#167d68]/10 dark:text-[#65d4a6]">
            <Sparkles size={15} />
            Explore FixMate
          </div>

          <h2 className="text-3xl font-black tracking-tight text-[#18352e] dark:text-white sm:text-4xl lg:text-5xl">
            Find Repairs for
            <span className="mt-2 block bg-gradient-to-r from-[#167d68] to-[#73a928] bg-clip-text text-transparent dark:from-[#65d4a6] dark:to-[#b9e769]">
              Every Device.
            </span>
          </h2>

          <p className="mt-5 max-w-xl text-sm leading-7 text-[#71827a] dark:text-gray-400 sm:text-base">
            From smartphones to home appliances, discover the right repair
            service for your everyday needs.
          </p>
        </div>

        <div className="grid items-stretch gap-8 lg:grid-cols-3">
          {/* Categories */}
          <div className="lg:col-span-2">
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-lg font-extrabold text-[#18352e] dark:text-white">
                Browse Categories
              </h3>

              <span className="rounded-full bg-[#e8f5d5] px-3 py-1.5 text-xs font-bold text-[#167d68] dark:bg-[#167d68]/15 dark:text-[#65d4a6]">
                {categories.length} Categories
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {categories.map((category, index) => {
                const Icon = category.icon;

                return (
                  <Link
                    key={category.name}
                    href={`/services?category=${encodeURIComponent(category.name)}`}
                    className="group relative flex min-h-[190px] flex-col overflow-hidden rounded-2xl border border-[#167d68]/10 bg-white p-5 shadow-sm transition-all duration-500 hover:-translate-y-2 hover:border-[#167d68]/30 hover:shadow-xl hover:shadow-[#167d68]/10 dark:border-white/10 dark:bg-[#1b302b] dark:hover:border-[#65d4a6]/30"
                  >
                    {/* Hover accent */}
                    <div className="absolute left-0 top-0 h-1 w-full origin-left scale-x-0 bg-gradient-to-r from-[#167d68] to-[#b9e769] transition-transform duration-500 group-hover:scale-x-100" />

                    {/* Decorative glow */}
                    <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-[#b9e769]/0 blur-2xl transition-all duration-500 group-hover:bg-[#b9e769]/30" />

                    <div className="relative flex items-center justify-between">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#e8f5d5] text-[#167d68] transition-all duration-500 group-hover:rotate-6 group-hover:scale-110 group-hover:bg-[#167d68] group-hover:text-white dark:bg-[#167d68]/15 dark:text-[#65d4a6] dark:group-hover:bg-[#167d68] dark:group-hover:text-white">
                        <Icon size={25} strokeWidth={1.8} />
                      </div>

                      <span className="text-xs font-bold text-[#167d68]/40 transition-colors group-hover:text-[#167d68] dark:text-[#65d4a6]/40 dark:group-hover:text-[#65d4a6]">
                        0{index + 1}
                      </span>
                    </div>

                    <div className="relative mt-5 flex-1">
                      <h4 className="text-base font-extrabold text-[#18352e] transition-colors duration-300 group-hover:text-[#167d68] dark:text-white dark:group-hover:text-[#65d4a6]">
                        {category.name}
                      </h4>

                      <p className="mt-1.5 text-xs leading-5 text-[#71827a] dark:text-gray-400">
                        {category.description}
                      </p>
                    </div>

                    <div className="relative mt-4 flex items-center gap-1.5 text-xs font-bold text-[#167d68] dark:text-[#65d4a6]">
                      Explore Services
                      <ArrowUpRight
                        size={15}
                        className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
                      />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Why Choose FixMate */}
          <div className="group relative flex flex-col overflow-hidden rounded-3xl border border-[#315347] bg-gradient-to-br from-[#18352e] via-[#123b30] to-[#102b25] p-6 text-white shadow-xl shadow-[#18352e]/15 sm:p-8">
            {/* Background glow */}
            <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#b9e769]/15 blur-3xl transition-opacity duration-500 group-hover:bg-[#b9e769]/25" />

            <div className="relative">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#b9e769]/20 bg-[#b9e769]/10 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-[#b9e769]">
                <Sparkles size={14} />
                Why Choose Us
              </div>

              <h3 className="mt-5 text-2xl font-black leading-tight sm:text-3xl">
                Repair Services
                <span className="block text-[#b9e769]">
                  You Can Trust.
                </span>
              </h3>

              <p className="mt-4 text-sm leading-7 text-white/65">
                FixMate makes it easier to find repair services, connect with
                technicians, and manage your requests from one place.
              </p>
            </div>

            {/* Reasons */}
            <div className="relative mt-9 flex-1 space-y-7">
              {reasons.map((reason, index) => {
                const Icon = reason.icon;

                return (
                  <div key={reason.title} className="group/reason flex gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#b9e769]/15 bg-[#b9e769]/10 text-[#b9e769] transition-all duration-300 group-hover/reason:rotate-6 group-hover/reason:bg-[#b9e769] group-hover/reason:text-[#18352e]">
                      <Icon size={21} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-white">
                          {reason.title}
                        </h4>

                        <CheckCircle2
                          size={14}
                          className="shrink-0 text-[#b9e769]"
                        />
                      </div>

                      <p className="mt-1.5 text-xs leading-6 text-white/60">
                        {reason.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* CTA */}
            <Link
              href="/services"
              className="relative mt-10 flex w-full items-center justify-center gap-2 rounded-xl bg-[#b9e769] px-5 py-3.5 text-sm font-extrabold text-[#18352e] shadow-lg shadow-black/10 transition-all duration-300 hover:-translate-y-1 hover:bg-[#c9f17c] hover:shadow-xl active:scale-[0.98]"
            >
              Explore All Services
              <ArrowUpRight
                size={18}
                className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
              />
            </Link>

            <p className="relative mt-4 text-center text-[11px] font-medium text-white/40">
              Your repair journey starts here.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
