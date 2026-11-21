
import Link from "next/link";
import {
  ArrowLeft,
  ArrowUpRight,
  Wrench,
  Hammer,
  Sparkles,
  Settings,
  House,
  Drill,
  Construction,
} from "lucide-react";

export default function NotFound() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-5 py-16 text-foreground">
      {/* Background Decorations */}
      <div className="pointer-events-none absolute -right-40 top-10 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -left-40 bottom-0 h-80 w-80 rounded-full bg-lime-500/10 blur-3xl" />

      <div className="relative mx-auto w-full max-w-6xl">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">

          {/* Repair Illustration */}
          <div className="relative order-1 mx-auto w-full max-w-md">
            <div className="absolute inset-5 rounded-[3rem] bg-primary/10 blur-2xl" />

            <div className="relative overflow-hidden rounded-[2.5rem] border border-border bg-surface p-6 shadow-[0_25px_80px_rgba(0,0,0,0.08)] sm:p-10">

              {/* Illustration Header */}
              <div className="mb-8 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                    <Wrench size={21} />
                  </div>

                  <span className="text-lg font-extrabold tracking-tight text-foreground">
                    Fix<span className="text-primary">Mate</span>
                  </span>
                </div>

                <span className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-primary">
                  Lost your way?
                </span>
              </div>

              {/* Repair Scene */}
              <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-3xl bg-muted/60">

                {/* Background Circles */}
                <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full border-[20px] border-primary/10" />

                <div className="absolute -bottom-12 -left-8 h-36 w-36 rounded-full bg-lime-500/10" />

                <div className="absolute left-[12%] top-[15%] h-3 w-3 rounded-full bg-primary/50" />
                <div className="absolute right-[18%] bottom-[25%] h-4 w-4 rounded-full bg-lime-500/50" />

                {/* Floating Tools */}
                <div className="absolute left-[15%] top-[22%] rotate-[-25deg] rounded-2xl bg-primary/10 p-3 text-primary">
                  <Hammer size={30} />
                </div>

                <div className="absolute right-[14%] top-[23%] rotate-12 rounded-2xl bg-lime-500/10 p-3 text-lime-600 dark:text-lime-400">
                  <Settings size={28} />
                </div>

                <div className="absolute bottom-[22%] right-[15%] rotate-[-20deg] text-primary/50">
                  <Drill size={27} />
                </div>

                {/* Main Toolbox */}
                <div className="relative z-10 animate-[float_4s_ease-in-out_infinite]">

                  {/* Toolbox Handle */}
                  <div className="mx-auto h-8 w-24 rounded-t-2xl border-[5px] border-b-0 border-foreground/70 bg-transparent" />

                  {/* Toolbox Body */}
                  <div className="relative flex h-32 w-48 items-center justify-center rounded-2xl border-4 border-foreground/70 bg-primary shadow-2xl sm:h-36 sm:w-56">

                    {/* Toolbox Top */}
                    <div className="absolute -top-1 left-0 h-3 w-full bg-primary/70" />

                    {/* Toolbox Lock */}
                    <div className="absolute -top-2 left-1/2 h-7 w-9 -translate-x-1/2 rounded-lg border-2 border-foreground/70 bg-lime-400 shadow-sm" />

                    {/* Toolbox Front */}
                    <div className="mt-5 flex h-20 w-36 items-center justify-center rounded-xl border-2 border-primary-foreground/30 bg-black/10">
                      <Wrench
                        size={57}
                        strokeWidth={2.5}
                        className="rotate-[-35deg] text-primary-foreground"
                      />
                    </div>

                    {/* Toolbox Side Details */}
                    <div className="absolute bottom-3 left-3 h-2 w-2 rounded-full bg-lime-300" />
                    <div className="absolute bottom-3 right-3 h-2 w-2 rounded-full bg-lime-300" />
                  </div>
                </div>

                {/* Floating Sparkles */}
                <Sparkles
                  size={25}
                  className="absolute right-[13%] top-[13%] animate-pulse text-lime-500"
                />

                <Sparkles
                  size={18}
                  className="absolute bottom-[18%] left-[20%] text-primary"
                />

                <Construction
                  size={24}
                  className="absolute left-[9%] bottom-[27%] rotate-12 text-lime-600/70 dark:text-lime-400/70"
                />

                {/* 404 Badge */}
                <div className="absolute bottom-5 left-5 rounded-xl border border-primary/20 bg-surface/95 px-4 py-2 shadow-lg backdrop-blur">
                  <span className="text-sm font-black tracking-widest text-primary">
                    404
                  </span>
                </div>
              </div>

              {/* Illustration Footer */}
              <div className="mt-6 flex items-center justify-between">
                <p className="text-xs font-medium text-muted-foreground">
                  Your trusted home repair partner.
                </p>

                <Sparkles size={17} className="text-primary" />
              </div>
            </div>
          </div>

          {/* Error Content */}
          <div className="order-2 text-center lg:text-left">

            {/* Label */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-primary">
              <Wrench size={14} />
              Page Not Found
            </div>

            {/* 404 Heading */}
            <h1 className="text-7xl font-extrabold tracking-[-0.07em] text-foreground sm:text-8xl lg:text-[110px]">
              404<span className="text-primary">.</span>
            </h1>

            <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Oops! Something
              <span className="block text-primary">
                needs fixing.
              </span>
            </h2>

            {/* Description */}
            <p className="mx-auto mt-6 max-w-md text-base leading-8 text-muted-foreground lg:mx-0">
              Looks like this page is broken or missing! The page you&apos;re
              looking for may have been moved, deleted, or never existed.
              Don&apos;t worry, FixMate is here to help you get back on track.
            </p>

            {/* Home Button */}
            <div className="mt-9 flex flex-col items-center gap-4 sm:flex-row sm:justify-center lg:justify-start">

              <Link
                href="/"
                className="group inline-flex w-full items-center justify-center gap-3 rounded-full bg-primary px-8 py-4 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/30 sm:w-auto"
              >
                <ArrowLeft
                  size={17}
                  className="transition-transform duration-300 group-hover:-translate-x-1"
                />

                Back to Home

                <ArrowUpRight
                  size={16}
                  className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
                />
              </Link>

              <Link
                href="/services"
                className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-border bg-surface px-8 py-4 text-sm font-semibold text-foreground transition-all duration-300 hover:-translate-y-1 hover:border-primary hover:text-primary sm:w-auto"
              >
                <House size={17} />
                Explore Services
              </Link>
            </div>

            {/* Footer Text */}
            <p className="mt-8 text-xs font-semibold tracking-[0.15em] text-muted-foreground">
              FIXMATE · YOUR HOME, OUR RESPONSIBILITY
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
