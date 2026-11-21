
import {
  Wrench,
  Hammer,
  Settings,
  Sparkles,
} from "lucide-react";

export default function Loading() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-5 py-12 text-foreground">

      {/* Background Decorations */}
      <div className="pointer-events-none absolute -right-40 top-10 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -left-40 bottom-0 h-80 w-80 rounded-full bg-lime-500/10 blur-3xl" />

      <div className="relative w-full max-w-2xl">

        {/* Main Loading Card */}
        <div className="overflow-hidden rounded-[2rem] border border-border bg-surface p-7 shadow-xl shadow-black/5 sm:p-12">

          {/* Logo */}
          <div className="mb-12 flex items-center justify-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
              <Wrench size={25} />
            </div>

            <h1 className="text-2xl font-extrabold tracking-tight text-foreground">
              Fix<span className="text-primary">Mate</span>
            </h1>
          </div>

          {/* Animated Illustration */}
          <div className="relative mx-auto flex h-48 w-48 items-center justify-center">

            {/* Outer Circle */}
            <div className="absolute inset-0 animate-[spin_12s_linear_infinite] rounded-full border-2 border-dashed border-primary/20" />

            {/* Middle Circle */}
            <div className="absolute inset-5 rounded-full border border-lime-500/30" />

            {/* Glow */}
            <div className="absolute inset-8 rounded-full bg-primary/10 blur-2xl" />

            {/* Main Tool */}
            <div className="relative z-10 flex h-28 w-28 animate-pulse items-center justify-center rounded-[2rem] bg-primary text-primary-foreground shadow-2xl shadow-primary/25">
              <Wrench
                size={55}
                strokeWidth={1.8}
                className="animate-[spin_3s_ease-in-out_infinite]"
              />
            </div>

            {/* Floating Tools */}
            <div className="absolute left-0 top-8 animate-bounce rounded-xl border border-border bg-background p-3 text-primary shadow-lg">
              <Hammer size={22} />
            </div>

            <div className="absolute bottom-8 right-0 animate-pulse rounded-xl border border-border bg-background p-3 text-lime-600 shadow-lg dark:text-lime-400">
              <Settings size={22} />
            </div>

            {/* Sparkles */}
            <Sparkles
              size={20}
              className="absolute right-5 top-2 animate-pulse text-primary"
            />

            <Sparkles
              size={16}
              className="absolute bottom-3 left-8 animate-pulse text-lime-500"
            />
          </div>

          {/* Loading Text */}
          <div className="mt-10 text-center">
            <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Getting things ready
              <span className="text-primary">...</span>
            </h2>

            <p className="mx-auto mt-3 max-w-sm text-sm leading-7 text-muted-foreground">
              We&apos;re preparing everything for you. Please wait a moment while
              FixMate gets things in order.
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mx-auto mt-9 max-w-sm">
            <div className="mb-3 flex items-center justify-between text-xs font-semibold">
              <span className="text-muted-foreground">
                Loading your experience
              </span>

              <span className="text-primary">
                Please wait
              </span>
            </div>

            <div className="h-2 overflow-hidden rounded-full bg-muted">
              <div className="h-full w-1/2 animate-[loading_1.5s_ease-in-out_infinite] rounded-full bg-primary" />
            </div>
          </div>

          {/* Skeleton Elements */}
          <div className="mt-10 grid grid-cols-3 gap-3">
            <div className="h-16 animate-pulse rounded-xl bg-muted" />
            <div className="h-16 animate-pulse rounded-xl bg-muted" />
            <div className="h-16 animate-pulse rounded-xl bg-muted" />
          </div>

          {/* Footer */}
          <div className="mt-10 border-t border-border pt-6 text-center">
            <p className="text-xs font-medium tracking-wide text-muted-foreground">
              FIXMATE · YOUR HOME, OUR RESPONSIBILITY
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
