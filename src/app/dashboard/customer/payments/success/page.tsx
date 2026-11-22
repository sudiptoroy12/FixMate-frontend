
"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  CreditCard,
  Receipt,
  CalendarDays,
  ArrowRight,
} from "lucide-react";

import { getTokenFromClient } from "@/lib/(getToken)/getTokenFromClient";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface PaymentData {
  bookingId: string;
  serviceTitle: string;
  amount: number;
  currency: string;
  transactionId: string;
  paidAt: string;
}

export default function PaymentSuccessPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [payment, setPayment] = useState<PaymentData | null>(null);

  const hasVerified = useRef(false);

  useEffect(() => {
    if (hasVerified.current) return;

    hasVerified.current = true;

    const verifyPayment = async () => {
      try {
        setLoading(true);
        setError("");

        if (!API_URL) {
          throw new Error("API URL is not configured.");
        }

        const params = new URLSearchParams(window.location.search);
        const sessionId = params.get("session_id");

        if (!sessionId) {
          throw new Error("Stripe payment session ID was not found.");
        }

        const token = await getTokenFromClient();

        if (!token) {
          throw new Error("Please sign in to verify your payment.");
        }

        const response = await fetch(
          `${API_URL}/api/payments/verify-session`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ sessionId }),
          }
        );

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(
            result.message || "Unable to verify your payment."
          );
        }

        if (!result.data) {
          throw new Error(
            "Payment was verified, but payment details were not returned."
          );
        }

        setPayment(result.data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Something went wrong while verifying your payment."
        );
      } finally {
        setLoading(false);
      }
    };

    void verifyPayment();
  }, []);

  const formatMoney = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency || "USD",
    }).format(amount);
  };

  const formatDate = (date: string) => {
    if (!date) return "Not available";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return date;
    }

    return parsedDate.toLocaleString("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-xl rounded-3xl border border-border bg-surface p-6 shadow-card sm:p-9">

        {/* LOADING STATE */}
        {loading && (
          <div className="flex flex-col items-center py-12 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-primary">
              <RefreshCw size={38} className="animate-spin" />
            </div>

            <h1 className="mt-6 text-2xl font-bold">
              Verifying Your Payment
            </h1>

            <p className="mt-3 max-w-sm text-sm leading-6 text-muted">
              Please wait while we confirm your payment with Stripe.
              Do not close this page.
            </p>
          </div>
        )}

        {/* ERROR STATE */}
        {!loading && error && (
          <div className="flex flex-col items-center py-8 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-danger/10 text-danger">
              <AlertCircle size={40} />
            </div>

            <h1 className="mt-6 text-2xl font-bold">
              Payment Verification Failed
            </h1>

            <p className="mt-3 max-w-sm text-sm leading-6 text-muted">
              {error}
            </p>

            <p className="mt-3 text-xs text-muted">
              If your card was charged, please check your payment
              history or contact our support team before trying again.
            </p>

            <Link
              href="/dashboard/customer/bookings"
              className="mt-7 inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground transition hover:bg-primary-hover"
            >
              Back to My Bookings
              <ArrowRight size={17} />
            </Link>
          </div>
        )}

        {/* SUCCESS STATE */}
        {!loading && !error && payment && (
          <>
            <div className="flex flex-col items-center text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-success/10 text-success">
                <CheckCircle2 size={46} />
              </div>

              <p className="mt-6 text-sm font-semibold uppercase tracking-wider text-success">
                Payment Successful
              </p>

              <h1 className="mt-2 text-3xl font-bold">
                Thank You!
              </h1>

              <p className="mt-3 max-w-sm text-sm leading-6 text-muted">
                Your payment has been successfully verified.
                Your repair service payment is complete.
              </p>
            </div>

            {/* PAYMENT AMOUNT */}
            <div className="mt-8 rounded-2xl bg-success/5 p-6 text-center">
              <p className="text-sm font-medium text-muted">
                Amount Paid
              </p>

              <h2 className="mt-2 text-4xl font-extrabold text-success">
                {formatMoney(payment.amount, payment.currency)}
              </h2>

              <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-success/10 px-3 py-1.5 text-xs font-semibold text-success">
                <CheckCircle2 size={14} />
                Payment Confirmed
              </div>
            </div>

            {/* PAYMENT DETAILS */}
            <div className="mt-7">
              <h3 className="font-bold">
                Transaction Details
              </h3>

              <div className="mt-4 space-y-4 rounded-2xl border border-border p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-2 text-sm text-muted">
                    <Receipt size={17} />
                    Service
                  </div>

                  <span className="max-w-[60%] text-right text-sm font-semibold">
                    {payment.serviceTitle || "Repair Service"}
                  </span>
                </div>

                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-2 text-sm text-muted">
                    <CreditCard size={17} />
                    Transaction ID
                  </div>

                  <span className="max-w-[60%] break-all text-right text-xs font-semibold">
                    {payment.transactionId}
                  </span>
                </div>

                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-2 text-sm text-muted">
                    <CalendarDays size={17} />
                    Payment Date
                  </div>

                  <span className="text-right text-xs font-semibold">
                    {formatDate(payment.paidAt)}
                  </span>
                </div>

                <div className="flex items-start justify-between gap-4 border-t border-border pt-4">
                  <span className="text-sm text-muted">
                    Booking ID
                  </span>

                  <span className="max-w-[60%] break-all text-right text-xs font-semibold">
                    {payment.bookingId}
                  </span>
                </div>
              </div>
            </div>

            {/* ACTIONS */}
            <div className="mt-8 space-y-3">
              <Link
                href="/dashboard/customer/bookings"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-bold text-primary-foreground transition hover:bg-primary-hover"
              >
                Back to My Bookings
                <ArrowRight size={17} />
              </Link>

              <p className="text-center text-xs text-muted">
                Thank you for choosing FixMate!
              </p>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
