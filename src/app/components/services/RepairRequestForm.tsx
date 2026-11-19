
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

import { authClient } from "@/lib/auth-client";
import { createRepairRequest } from "@/lib/services-api";

interface RepairRequestFormProps {
  serviceId: string;
  serviceTitle: string;
}

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

      router.push("/profile");
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

  if (isPending) {
    return (
      <div className="animate-pulse space-y-4 rounded-2xl border border-gray-200 p-6 dark:border-gray-700">
        <div className="h-6 w-1/2 rounded bg-gray-200 dark:bg-gray-700" />
        <div className="h-12 rounded bg-gray-200 dark:bg-gray-700" />
        <div className="h-12 rounded bg-gray-200 dark:bg-gray-700" />
        <div className="h-28 rounded bg-gray-200 dark:bg-gray-700" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="rounded-2xl border border-gray-200 p-6 text-center dark:border-gray-700">
        <h2 className="text-xl font-semibold">Sign in required</h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Please sign in to request this repair service.
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
          className="mt-5 rounded-lg bg-[#167d68] px-6 py-3 font-medium text-white transition hover:bg-[#126653]"
        >
          Sign in
        </button>
      </div>
    );
  }

  if (user.role !== "customer") {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 dark:border-amber-900 dark:bg-amber-950/30">
        <h2 className="text-lg font-semibold text-amber-800 dark:text-amber-300">
          Customer access only
        </h2>
        <p className="mt-2 text-sm text-amber-700 dark:text-amber-400">
          Only customer accounts can submit repair requests.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900"
    >
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Request Repair
        </h2>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Submit your repair request for {serviceTitle}.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium">
            Customer Name
          </label>
          <input
            type="text"
            value={user.name ?? ""}
            readOnly
            className="w-full rounded-lg border border-gray-200 bg-gray-100 px-4 py-3 text-gray-600 outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Email Address
          </label>
          <input
            type="email"
            value={user.email ?? ""}
            readOnly
            className="w-full rounded-lg border border-gray-200 bg-gray-100 px-4 py-3 text-gray-600 outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
          />
        </div>
      </div>

      <div>
        <label htmlFor="customerPhone" className="mb-2 block text-sm font-medium">
          Phone Number
        </label>
        <input
          id="customerPhone"
          type="tel"
          value={customerPhone}
          onChange={(e) => setCustomerPhone(e.target.value)}
          placeholder="Enter your phone number"
          required
          className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-3 outline-none transition focus:border-[#167d68] focus:ring-2 focus:ring-[#167d68]/20 dark:border-gray-700"
        />
      </div>

      <div>
        <label htmlFor="address" className="mb-2 block text-sm font-medium">
          Repair Address
        </label>
        <textarea
          id="address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Enter your full repair address"
          rows={3}
          required
          className="w-full resize-none rounded-lg border border-gray-300 bg-transparent px-4 py-3 outline-none transition focus:border-[#167d68] focus:ring-2 focus:ring-[#167d68]/20 dark:border-gray-700"
        />
      </div>

      <div>
        <label htmlFor="preferredDate" className="mb-2 block text-sm font-medium">
          Preferred Repair Date
        </label>
        <input
          id="preferredDate"
          type="date"
          min={today}
          value={preferredDate}
          onChange={(e) => setPreferredDate(e.target.value)}
          required
          className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-3 outline-none transition focus:border-[#167d68] focus:ring-2 focus:ring-[#167d68]/20 dark:border-gray-700"
        />
      </div>

      <div>
        <label
          htmlFor="problemDescription"
          className="mb-2 block text-sm font-medium"
        >
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
          className="w-full resize-none rounded-lg border border-gray-300 bg-transparent px-4 py-3 outline-none transition focus:border-[#167d68] focus:ring-2 focus:ring-[#167d68]/20 dark:border-gray-700"
        />
        <p className="mt-1 text-right text-xs text-gray-500">
          {problemDescription.trim().length} / 20 minimum characters
        </p>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-lg bg-[#167d68] px-6 py-3.5 font-semibold text-white transition hover:bg-[#126653] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "Submitting Request..." : "Submit Repair Request"}
      </button>
    </form>
  );
}
