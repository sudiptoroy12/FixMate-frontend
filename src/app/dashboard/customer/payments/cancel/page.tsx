
import Link from "next/link";
import {
  XCircle,
  ArrowLeft,
  CreditCard,
  ShieldCheck,
} from "lucide-react";

export default function PaymentCancelPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-lg rounded-3xl border border-border bg-surface p-7 text-center shadow-card sm:p-10">

        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-warning/10 text-warning">
          <XCircle size={44} />
        </div>

        <p className="mt-6 text-sm font-semibold uppercase tracking-wider text-warning">
          Payment Cancelled
        </p>

        <h1 className="mt-2 text-3xl font-bold">
          No Payment Was Completed
        </h1>

        <p className="mt-4 text-sm leading-7 text-muted">
          You cancelled the Stripe checkout process. Don&apos;t worry,
          your booking is still available and no successful payment
          has been recorded by this cancellation.
        </p>

        <div className="mt-7 rounded-2xl border border-border bg-surface-secondary p-5 text-left">
          <div className="flex items-start gap-3">
            <CreditCard size={20} className="mt-0.5 text-primary" />

            <div>
              <h3 className="text-sm font-semibold">
                Want to try again?
              </h3>

              <p className="mt-1 text-xs leading-5 text-muted">
                You can return to your bookings and complete the
                payment whenever you&apos;re ready.
              </p>
            </div>
          </div>

          <div className="mt-4 flex items-start gap-3">
            <ShieldCheck size={20} className="mt-0.5 text-success" />

            <div>
              <h3 className="text-sm font-semibold">
                Your booking is safe
              </h3>

              <p className="mt-1 text-xs leading-5 text-muted">
                Cancelling checkout does not automatically cancel
                your completed repair booking.
              </p>
            </div>
          </div>
        </div>

        <Link
          href="/dashboard/customer/bookings"
          className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-bold text-primary-foreground transition hover:bg-primary-hover"
        >
          <ArrowLeft size={17} />
          Back to My Bookings
        </Link>

        <p className="mt-5 text-xs text-muted">
          FixMate – Your Home, Our Responsibility.
        </p>
      </div>
    </main>
  );
}
