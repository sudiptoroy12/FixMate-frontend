
import Link from "next/link";
import {
  ArrowRight,
  ShieldCheck,
  Clock3,
  BadgeCheck,
  Wrench,
  Smartphone,
  Laptop,
  Tablet,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

export default function HeroBanner() {
  return (
    <section className="relative overflow-hidden bg-background px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="group relative isolate overflow-hidden rounded-[2rem] border border-[#d7e9c8] bg-gradient-to-br from-[#f0f9e7] via-[#e8f5d5] to-[#dcefc7] shadow-xl shadow-[#18352e]/5 dark:border-[#315347] dark:from-[#1b302b] dark:via-[#203c33] dark:to-[#18352e]">

          {/* Background glowing circles */}
          <div className="pointer-events-none absolute -right-24 -top-32 h-96 w-96 rounded-full bg-[#b9e769]/40 blur-3xl animate-background-glow" />

          <div className="pointer-events-none absolute -bottom-36 left-1/3 h-96 w-96 rounded-full bg-[#167d68]/20 blur-3xl animate-background-glow" />

          <div className="pointer-events-none absolute -left-20 top-1/2 h-64 w-64 rounded-full bg-[#b9e769]/20 blur-3xl animate-background-glow" />

          {/* Decorative dots */}
          <div className="pointer-events-none absolute right-10 top-10 hidden grid-cols-5 gap-3 opacity-30 sm:grid">
            {Array.from({ length: 25 }).map((_, i) => (
              <span
                key={i}
                className="h-1.5 w-1.5 rounded-full bg-[#167d68]"
              />
            ))}
          </div>

          <div className="relative grid items-center gap-12 px-6 py-12 sm:px-10 md:grid-cols-2 md:px-12 lg:gap-16 lg:px-16 lg:py-20">

            {/* LEFT CONTENT */}
            <div className="max-w-xl">

              {/* Badge */}
              <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#167d68]/20 bg-white/70 px-4 py-2 text-xs font-bold tracking-wide text-[#167d68] shadow-sm backdrop-blur-md animate-text-move dark:border-[#8bd3a5]/20 dark:bg-white/5 dark:text-[#a5e6b8] sm:text-sm">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#167d68] opacity-50" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#167d68]" />
                </span>
                <ShieldCheck size={16} />
                Your Trusted Repair Partner
                <Sparkles size={15} />
              </div>

              {/* Heading */}
              <h1 className="text-4xl font-black leading-[1.13] tracking-tight text-[#18352e] dark:text-white sm:text-5xl lg:text-[4.25rem]">
                Broken Device?

                <span className="mt-3 block bg-gradient-to-r from-[#167d68] to-[#73a928] bg-clip-text text-transparent animate-text-glow dark:from-[#65d4a6] dark:to-[#b9e769]">
                  Let&apos;s Get It Fixed!
                </span>
              </h1>

              {/* Description */}
              <p className="mt-6 max-w-lg text-base leading-8 text-[#526b60] dark:text-gray-300 sm:text-lg">
                Don&apos;t let a broken device slow you down. Find verified
                technicians and get your devices repaired quickly,
                safely, and affordably.
              </p>

              {/* CTA */}
              <div className="mt-9 flex flex-wrap items-center gap-4">

                <Link
                  href="/services"
                  className="group/btn inline-flex items-center gap-3 rounded-xl bg-[#167d68] px-7 py-4 text-sm font-bold text-white shadow-lg shadow-[#167d68]/25 transition-all duration-300 hover:-translate-y-1 hover:bg-[#126653] hover:shadow-xl hover:shadow-[#167d68]/30 active:scale-95 animate-button-glow sm:text-base"
                >
                  Explore Services

                  <ArrowRight
                    size={19}
                    className="transition-transform duration-300 group-hover/btn:translate-x-1.5"
                  />
                </Link>

                <div className="flex items-center gap-2 rounded-xl border border-[#167d68]/10 bg-white/50 px-4 py-3 text-sm font-semibold text-[#526b60] backdrop-blur-sm dark:border-white/10 dark:bg-white/5 dark:text-gray-300">
                  <ShieldCheck
                    size={19}
                    className="text-[#167d68] dark:text-[#65d4a6]"
                  />
                  Reliable & Trusted
                </div>
              </div>

              {/* Trust points */}
              <div className="mt-11 grid grid-cols-2 gap-x-4 gap-y-5 border-t border-[#167d68]/15 pt-7 sm:grid-cols-3">

                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#167d68]/10 text-[#167d68] dark:bg-[#65d4a6]/10 dark:text-[#65d4a6]">
                    <BadgeCheck size={20} />
                  </div>

                  <span className="text-xs font-bold text-[#526b60] dark:text-gray-300 sm:text-sm">
                    Verified Experts
                  </span>
                </div>

                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#167d68]/10 text-[#167d68] dark:bg-[#65d4a6]/10 dark:text-[#65d4a6]">
                    <Clock3 size={20} />
                  </div>

                  <span className="text-xs font-bold text-[#526b60] dark:text-gray-300 sm:text-sm">
                    Quick Service
                  </span>
                </div>

                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#167d68]/10 text-[#167d68] dark:bg-[#65d4a6]/10 dark:text-[#65d4a6]">
                    <ShieldCheck size={20} />
                  </div>

                  <span className="text-xs font-bold text-[#526b60] dark:text-gray-300 sm:text-sm">
                    Trusted Repairs
                  </span>
                </div>
              </div>
            </div>

            {/* RIGHT ILLUSTRATION */}
            <div className="relative mx-auto w-full max-w-md">

              {/* Outer glowing circle */}
              <div className="absolute inset-8 rounded-full bg-[#b9e769]/50 blur-3xl animate-background-glow" />

              {/* Main illustration card */}
              <div className="relative rounded-[2rem] border border-white/70 bg-white/65 p-5 shadow-2xl shadow-[#18352e]/10 backdrop-blur-xl transition-shadow duration-500 hover:shadow-[#167d68]/20 dark:border-white/10 dark:bg-white/5 sm:p-7">

                {/* Card header */}
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-[#167d68]" />

                      <p className="text-sm font-extrabold text-[#18352e] dark:text-white">
                        Expert Device Care
                      </p>
                    </div>

                    <p className="mt-1.5 text-xs text-[#71827a] dark:text-gray-400">
                      Everything fixed in one place
                    </p>
                  </div>

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#167d68]/10 text-[#167d68] animate-green-glow dark:bg-[#65d4a6]/10 dark:text-[#65d4a6]">
                    <Wrench size={22} />
                  </div>
                </div>

                {/* Device illustration */}
                <div className="relative flex min-h-[270px] items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-[#e8f5d5] to-[#d9edcc] dark:from-[#223a33] dark:to-[#1b302b]">

                  {/* Rotating rings */}
                  <div className="absolute h-48 w-48 rounded-full border border-[#167d68]/20 animate-rotate-glow" />

                  <div className="absolute h-64 w-64 rounded-full border border-dashed border-[#167d68]/20 animate-rotate-glow" />

                  <div className="absolute h-80 w-80 rounded-full border border-[#167d68]/10" />

                  {/* Center glow */}
                  <div className="absolute h-40 w-40 rounded-full bg-[#b9e769]/50 blur-2xl animate-background-glow" />

                  {/* Smartphone */}
                  <div className="relative z-10 flex h-52 w-28 flex-col items-center rounded-[1.8rem] border-[5px] border-[#18352e] bg-white p-2 shadow-2xl animate-phone-move animate-green-glow dark:border-[#8da69a]">

                    <div className="h-2 w-10 rounded-full bg-[#18352e]" />

                    <div className="mt-5 flex h-28 w-full items-center justify-center rounded-xl bg-gradient-to-br from-[#e8f5d5] to-[#cce9ae]">
                      <Smartphone
                        size={48}
                        className="text-[#167d68]"
                        strokeWidth={1.7}
                      />
                    </div>

                    <div className="mt-3 h-2 w-12 rounded-full bg-[#b9e769]" />
                    <div className="mt-2 h-1.5 w-8 rounded-full bg-[#dfe8df]" />
                  </div>

                  {/* Floating wrench */}
                  <div className="absolute right-5 top-9 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#167d68] text-white shadow-xl shadow-[#167d68]/30 animate-tool-float">
                    <Wrench size={27} />
                  </div>

                  {/* Floating laptop */}
                  <div className="absolute bottom-8 left-5 flex h-12 w-12 items-center justify-center rounded-xl bg-[#b9e769] text-[#18352e] shadow-lg animate-tool-float-delayed">
                    <Laptop size={24} />
                  </div>

                  {/* Floating tablet */}
                  <div className="absolute bottom-8 right-8 flex h-11 w-11 items-center justify-center rounded-xl bg-white text-[#167d68] shadow-lg animate-soft-pulse dark:bg-[#1b302b]">
                    <Tablet size={23} />
                  </div>
                </div>

                {/* Repair status */}
                <div className="mt-5 flex items-center gap-3 rounded-xl border border-[#167d68]/5 bg-white p-4 shadow-sm dark:border-white/5 dark:bg-[#223a33]">

                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#e8f5d5] text-[#167d68] dark:bg-[#167d68]/20 dark:text-[#65d4a6]">
                    <CheckCircle2 size={24} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-extrabold text-[#18352e] dark:text-white">
                      Your Device, Our Priority
                    </p>

                    <p className="mt-1 text-xs text-[#71827a] dark:text-gray-400">
                      Professional repair solutions
                    </p>
                  </div>

                  <BadgeCheck
                    className="shrink-0 text-[#167d68] dark:text-[#65d4a6]"
                    size={23}
                  />
                </div>
              </div>

              {/* Floating trust badge */}
              <div className="absolute -left-5 top-1/3 hidden items-center gap-2.5 rounded-xl border border-[#167d68]/10 bg-white px-4 py-3 shadow-xl animate-text-move dark:border-white/10 dark:bg-[#223a33] sm:flex">

                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#167d68]/10 text-[#167d68] dark:bg-[#65d4a6]/10 dark:text-[#65d4a6]">
                  <ShieldCheck size={20} />
                </div>

                <div>
                  <p className="text-xs font-extrabold text-[#18352e] dark:text-white">
                    Trusted Technicians
                  </p>

                  <p className="mt-0.5 text-[10px] text-gray-500 dark:text-gray-400">
                    Professional service
                  </p>
                </div>
              </div>

              {/* Floating quality badge */}
              <div className="absolute -bottom-5 -right-2 hidden items-center gap-2 rounded-xl border border-[#167d68]/10 bg-white px-4 py-3 shadow-xl animate-tool-float-delayed dark:border-white/10 dark:bg-[#223a33] sm:flex">
                <Sparkles size={19} className="text-[#167d68] dark:text-[#65d4a6]" />

                <span className="text-xs font-bold text-[#18352e] dark:text-white">
                  Quality Repairs
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
