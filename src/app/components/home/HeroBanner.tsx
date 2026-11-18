
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
} from "lucide-react";

export default function HeroBanner() {
  return (
    <section className="relative overflow-hidden bg-background px-4 py-12 sm:px-6 lg:px-8 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-[2rem] bg-[#e8f5d5] dark:bg-[#1b302b]">
          {/* Background decorations */}
          <div className="absolute -right-20 -top-28 h-80 w-80 rounded-full bg-[#b9e769]/30 blur-3xl" />
          <div className="absolute -bottom-32 left-1/3 h-80 w-80 rounded-full bg-[#167d68]/10 blur-3xl" />

          <div className="relative grid items-center gap-10 px-6 py-12 sm:px-10 md:grid-cols-2 md:px-14 lg:px-16 lg:py-16">
            {/* Left content */}
            <div className="max-w-xl">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-surface/70 px-4 py-2 text-sm font-medium text-primary">
                <ShieldCheck size={17} />
                Your Trusted Repair Partner
              </div>

              <h1 className="text-4xl font-extrabold leading-[1.15] tracking-tight text-[#18352e] dark:text-foreground sm:text-5xl lg:text-6xl">
                Broken Device?
                <span className="mt-2 block text-primary">
                  Let&apos;s Get It Fixed!
                </span>
              </h1>

              <p className="mt-6 max-w-lg text-base leading-8 text-[#526b60] dark:text-muted sm:text-lg">
                Don&apos;t let a broken device slow you down. Find verified
                technicians and get your devices repaired quickly,
                safely, and affordably.
              </p>

              {/* CTA */}
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link
                  href="/services"
                  className="group inline-flex items-center gap-3 rounded-xl bg-primary px-7 py-4 font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all duration-300 hover:-translate-y-1 hover:bg-primary-hover hover:shadow-xl"
                >
                  Explore Services
                  <ArrowRight
                    size={19}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </Link>

                <div className="flex items-center gap-2 text-sm font-medium text-[#526b60] dark:text-muted">
                  <ShieldCheck size={19} className="text-primary" />
                  Reliable & Trusted
                </div>
              </div>

              {/* Trust points */}
              <div className="mt-10 grid grid-cols-2 gap-4 border-t border-primary/15 pt-7 sm:grid-cols-3">
                <div className="flex items-center gap-2">
                  <BadgeCheck size={21} className="shrink-0 text-primary" />
                  <span className="text-xs font-semibold text-[#526b60] dark:text-muted sm:text-sm">
                    Verified Experts
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Clock3 size={21} className="shrink-0 text-primary" />
                  <span className="text-xs font-semibold text-[#526b60] dark:text-muted sm:text-sm">
                    Quick Service
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <ShieldCheck size={21} className="shrink-0 text-primary" />
                  <span className="text-xs font-semibold text-[#526b60] dark:text-muted sm:text-sm">
                    Trusted Repairs
                  </span>
                </div>
              </div>
            </div>

            {/* Right illustration */}
            <div className="relative mx-auto w-full max-w-md">
              <div className="absolute inset-8 rounded-full bg-[#b9e769]/40 blur-3xl" />

              <div className="relative rounded-[2rem] border border-white/60 bg-white/60 p-5 shadow-2xl shadow-[#18352e]/10 backdrop-blur-sm dark:border-white/10 dark:bg-white/5 sm:p-8">
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-[#18352e] dark:text-foreground">
                      Expert Device Care
                    </p>
                    <p className="mt-1 text-xs text-[#71827a] dark:text-muted">
                      Everything fixed in one place
                    </p>
                  </div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Wrench size={21} />
                  </div>
                </div>

                {/* Main device illustration */}
                <div className="relative flex min-h-[270px] items-center justify-center overflow-hidden rounded-2xl bg-[#edf5e9] dark:bg-[#223a33]">
                  <div className="absolute h-48 w-48 rounded-full border border-primary/15" />
                  <div className="absolute h-64 w-64 rounded-full border border-primary/10" />

                  {/* Smartphone */}
                  <div className="relative z-10 flex h-52 w-28 rotate-[-10deg] flex-col items-center rounded-[1.8rem] border-[5px] border-[#18352e] bg-white p-2 shadow-xl dark:border-[#8da69a]">
                    <div className="h-2 w-10 rounded-full bg-[#18352e]" />
                    <div className="mt-5 flex h-28 w-full items-center justify-center rounded-xl bg-[#e8f5d5]">
                      <Smartphone size={48} className="text-primary" />
                    </div>
                    <div className="mt-3 h-2 w-12 rounded-full bg-[#b9e769]" />
                    <div className="mt-2 h-1.5 w-8 rounded-full bg-[#dfe8df]" />
                  </div>

                  {/* Floating tool icon */}
                  <div className="absolute right-5 top-9 flex h-14 w-14 rotate-12 items-center justify-center rounded-2xl bg-primary text-white shadow-lg">
                    <Wrench size={27} />
                  </div>

                  <div className="absolute bottom-8 left-5 flex h-12 w-12 -rotate-12 items-center justify-center rounded-xl bg-[#b9e769] text-[#18352e] shadow-lg">
                    <Laptop size={24} />
                  </div>

                  <div className="absolute bottom-8 right-8 flex h-11 w-11 items-center justify-center rounded-xl bg-white text-primary shadow-lg dark:bg-[#1b302b]">
                    <Tablet size={23} />
                  </div>
                </div>

                {/* Repair status */}
                <div className="mt-5 flex items-center gap-3 rounded-xl bg-white p-4 shadow-sm dark:bg-[#223a33]">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#e8f5d5] text-primary dark:bg-primary/15">
                    <CheckCircle2 size={24} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-[#18352e] dark:text-foreground">
                      Your Device, Our Priority
                    </p>
                    <p className="mt-1 text-xs text-[#71827a] dark:text-muted">
                      Professional repair solutions
                    </p>
                  </div>
                  <BadgeCheck className="text-primary" size={22} />
                </div>
              </div>

              {/* Floating label */}
              <div className="absolute -left-4 top-1/3 hidden items-center gap-2 rounded-xl bg-white px-4 py-3 shadow-xl dark:bg-[#223a33] sm:flex">
                <ShieldCheck className="text-primary" size={20} />
                <span className="text-xs font-bold text-[#18352e] dark:text-foreground">
                  Trusted Technicians
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
