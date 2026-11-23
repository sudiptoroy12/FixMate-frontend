
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

import {
  UserRound,
  Mail,
  Phone,
  MapPin,
  CalendarDays,
  Wrench,
  ShieldCheck,
  ArrowRight,
  LoaderCircle,
  Sparkles,
  FileText,
  LockKeyhole,
} from "lucide-react";

import { authClient } from "@/lib/auth-client";
import { createRepairRequest } from "@/lib/services-api";

interface RepairRequestFormProps {
  serviceId: string;
  serviceTitle: string;
}

const inputClass =
  "w-full rounded-xl border border-border bg-surface-secondary/60 px-4 py-3.5 text-sm text-foreground outline-none transition-all duration-300 placeholder:text-muted-foreground hover:border-primary/50 focus:border-primary focus:bg-surface focus:ring-4 focus:ring-primary/10";

export default function RepairRequestForm({
  serviceId,
  serviceTitle,
}: RepairRequestFormProps) {
  const router = useRouter();

  const { data: session, isPending } = authClient.useSession();

  const [customerPhone, setCustomerPhone] = useState("");
  const [address, setAddress] = useState("");
  const [preferredDate, setPreferredDate] = useState("");
  const [problemDescription, setProblemDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const today = new Date().toLocaleDateString("en-CA");

  const user = session?.user as
    | {
        name?: string;
        email?: string;
        role?: string;
      }
    | undefined;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!user) {
      toast.error("Please sign in to submit a repair request.");
      router.push("/signin");
      return;
    }

    if (user.role !== "customer") {
      toast.error("Only customers can submit repair requests.");
      return;
    }

    if (problemDescription.trim().length < 20) {
      toast.error("Problem description must be at least 20 characters.");
      return;
    }

    if (preferredDate < today) {
      toast.error("Please select today or a future date.");
      return;
    }

    try {
      setIsSubmitting(true);

      await createRepairRequest({
        serviceId,
        customerPhone: customerPhone.trim(),
        address: address.trim(),
        preferredDate,
        problemDescription: problemDescription.trim(),
      });

      toast.success("Repair request submitted successfully!");

      router.push("/dashboard/customer/bookings");
      router.refresh();
    } catch (error) {
      console.error("Repair request error:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to submit repair request."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Loading State
  if (isPending) {
    return (
      <div className="relative overflow-hidden rounded-3xl border border-border bg-surface p-7 shadow-[var(--card-shadow)]">
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-1/2 rounded-lg bg-surface-secondary" />
          <div className="h-4 w-3/4 rounded bg-surface-secondary" />
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="h-14 rounded-xl bg-surface-secondary" />
            <div className="h-14 rounded-xl bg-surface-secondary" />
          </div>
          <div className="h-14 rounded-xl bg-surface-secondary" />
          <div className="h-24 rounded-xl bg-surface-secondary" />
          <div className="h-14 rounded-xl bg-surface-secondary" />
          <div className="h-32 rounded-xl bg-surface-secondary" />
          <div className="h-14 rounded-xl bg-surface-secondary" />
        </div>
      </div>
    );
  }

  // Sign In Required
  if (!user) {
    return (
      <div className="relative overflow-hidden rounded-3xl border border-border bg-surface p-8 text-center shadow-[var(--card-shadow)] sm:p-12">

        <div className="animate-background-glow absolute -right-16 -top-16 h-48 w-48 rounded-full bg-secondary/30 blur-[70px]" />

        <div className="relative mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-accent text-primary">
          <LockKeyhole size={34} />
        </div>

        <h2 className="relative mt-6 text-2xl font-extrabold">
          Sign In Required
        </h2>

        <p className="relative mx-auto mt-3 max-w-md leading-7 text-muted">
          Please sign in to your FixMate customer account before
          requesting {serviceTitle}.
        </p>

        <button
          type="button"
          onClick={() =>
            router.push(
              `/signin?callbackURL=${encodeURIComponent(
                `/services/${serviceId}/request`
              )}`
            )
          }
          className="group animate-button-glow relative mt-7 inline-flex items-center justify-center gap-3 rounded-xl bg-primary px-8 py-3.5 font-bold text-primary-foreground transition-all duration-300 hover:-translate-y-1 hover:bg-primary-hover"
        >
          Sign In to Continue
          <ArrowRight
            size={18}
            className="transition-transform duration-300 group-hover:translate-x-1"
          />
        </button>

      </div>
    );
  }

  // Customer Only
  if (user.role !== "customer") {
    return (
      <div className="rounded-3xl border border-warning/30 bg-warning/10 p-8">
        <div className="flex items-center gap-3">
          <ShieldCheck className="text-warning" size={28} />

          <h2 className="text-xl font-extrabold text-foreground">
            Customer Access Only
          </h2>
        </div>

        <p className="mt-3 leading-7 text-muted">
          Only customer accounts can submit repair requests.
          Please use a customer account to continue.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="relative overflow-hidden rounded-3xl border border-border bg-surface p-5 shadow-[var(--card-shadow)] sm:p-8 lg:p-10"
    >

      {/* Decorative Background */}
      <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-secondary/20 blur-[90px]" />
      <div className="pointer-events-none absolute -bottom-32 -left-24 h-72 w-72 rounded-full bg-primary/10 blur-[90px]" />

      <div className="relative">

        {/* Header */}
        <div className="mb-8">

          <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-xs font-bold text-primary">
            <Sparkles size={14} />
            FixMate Repair Booking
          </span>

          <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
            Request <span className="text-primary">Repair</span>
          </h2>

          <p className="mt-3 leading-7 text-muted">
            Fill out the form below to request{" "}
            <span className="font-semibold text-primary">
              {serviceTitle}
            </span>
            . Our technician will review your request.
          </p>

        </div>

        {/* Customer Information */}
        <div className="mb-8 rounded-2xl border border-border bg-surface-secondary/50 p-5">

          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-primary">
              <UserRound size={20} />
            </div>

            <div>
              <h3 className="font-bold">Customer Information</h3>
              <p className="text-xs text-muted">
                Your account information
              </p>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">

            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-semibold">
                <UserRound size={15} className="text-primary" />
                Customer Name
              </label>

              <input
                type="text"
                value={user.name ?? ""}
                readOnly
                className="w-full rounded-xl border border-border bg-surface px-4 py-3.5 text-sm text-muted outline-none"
              />
            </div>

            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-semibold">
                <Mail size={15} className="text-primary" />
                Email Address
              </label>

              <input
                type="email"
                value={user.email ?? ""}
                readOnly
                className="w-full rounded-xl border border-border bg-surface px-4 py-3.5 text-sm text-muted outline-none"
              />
            </div>

          </div>

        </div>

        {/* Repair Details */}
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-primary">
            <Wrench size={20} />
          </div>

          <div>
            <h3 className="font-bold">Repair Details</h3>
            <p className="text-xs text-muted">
              Tell us about your repair requirements
            </p>
          </div>
        </div>

        <div className="space-y-6">

          {/* Phone */}
          <div>
            <label
              htmlFor="customerPhone"
              className="mb-2 flex items-center gap-2 text-sm font-semibold"
            >
              <Phone size={16} className="text-primary" />
              Phone Number
            </label>

            <input
              id="customerPhone"
              type="tel"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              placeholder="Enter your phone number"
              autoComplete="tel"
              required
              className={inputClass}
            />
          </div>

          {/* Address */}
          <div>
            <label
              htmlFor="address"
              className="mb-2 flex items-center gap-2 text-sm font-semibold"
            >
              <MapPin size={16} className="text-primary" />
              Repair Address
            </label>

            <textarea
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter your full repair address..."
              rows={3}
              autoComplete="street-address"
              required
              className={`${inputClass} resize-none`}
            />
          </div>

          {/* Preferred Date */}
          <div>
            <label
              htmlFor="preferredDate"
              className="mb-2 flex items-center gap-2 text-sm font-semibold"
            >
              <CalendarDays size={16} className="text-primary" />
              Preferred Repair Date
            </label>

            <input
              id="preferredDate"
              type="date"
              min={today}
              value={preferredDate}
              onChange={(e) => setPreferredDate(e.target.value)}
              required
              className={inputClass}
            />
          </div>

          {/* Problem Description */}
          <div>
            <label
              htmlFor="problemDescription"
              className="mb-2 flex items-center gap-2 text-sm font-semibold"
            >
              <FileText size={16} className="text-primary" />
              Describe Your Problem
            </label>

            <textarea
              id="problemDescription"
              value={problemDescription}
              onChange={(e) => setProblemDescription(e.target.value)}
              placeholder="Describe your device problem in detail..."
              rows={5}
              minLength={20}
              required
              className={`${inputClass} resize-none`}
            />

            <div className="mt-2 flex items-center justify-between text-xs">
              <span className="text-muted">
                Minimum 20 characters required
              </span>

              <span
                className={
                  problemDescription.trim().length >= 20
                    ? "font-semibold text-success"
                    : "text-muted"
                }
              >
                {problemDescription.trim().length} / 20
              </span>
            </div>
          </div>

        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="group animate-button-glow mt-8 flex w-full items-center justify-center gap-3 rounded-xl bg-primary px-6 py-4 font-bold text-primary-foreground transition-all duration-300 hover:-translate-y-1 hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
        >
          {isSubmitting ? (
            <>
              <LoaderCircle size={20} className="animate-spin" />
              Submitting Request...
            </>
          ) : (
            <>
              Submit Repair Request
              <ArrowRight
                size={19}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </>
          )}
        </button>

        <div className="mt-5 flex items-center justify-center gap-2 text-center text-xs text-muted">
          <ShieldCheck size={16} className="shrink-0 text-success" />
          Your repair request will be reviewed by the technician.
        </div>

      </div>
    </form>
  );
}
