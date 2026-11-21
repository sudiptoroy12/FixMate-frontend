"use client";

import { authClient } from "@/lib/auth-client";
import Image from "next/image";
import Link from "next/link";
import { useState, type FormEvent } from "react";
import { toast } from "react-toastify";
import {
  ArrowLeft,
  Camera,
  CheckCircle2,
  ChevronRight,
  CircleUserRound,
  Edit3,
  Mail,
  ShieldCheck,
  UserRound,
  Wrench,
   Phone,
    MapPin,
  X,
  Upload,
  BriefcaseBusiness,
} from "lucide-react";

const ProfilePage = () => {
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  const [show, setShow] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // FixMate design tokens
  const pageBackground = "min-h-screen bg-background text-foreground";

  const card = "rounded-3xl border border-border bg-surface shadow-sm";

  const heading = "font-bold text-foreground";

  const mutedText = "text-muted";

  const detailCard =
    "rounded-2xl border border-border bg-surface-secondary p-5";

  const inputClass =
    "w-full rounded-xl border border-input bg-surface px-4 py-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-4 focus:ring-primary/15";

  const primaryButton =
    "inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60";

  const handleUpdateProfile = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const name = String(formData.get("name") ?? "").trim();
    const phone = String(formData.get("phone") ?? "").trim();
    const area = String(formData.get("area") ?? "").trim();
    const bio = String(formData.get("bio") ?? "").trim();

    const imageFile = formData.get("image") as File | null;
    const removeImage = formData.get("removeImage") === "on";

    if (!name) {
      toast.error("Please enter your name.");
      return;
    }

    if (phone && !/^[0-9+\-\s()]{7,20}$/.test(phone)) {
      toast.error("Please enter a valid phone number.");
      return;
    }

    if (imageFile && imageFile.size > 0) {
      const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

      if (!allowedTypes.includes(imageFile.type)) {
        toast.error("Only JPG, PNG and WEBP images are allowed.");
        return;
      }

      if (imageFile.size > 5 * 1024 * 1024) {
        toast.error("Image must be smaller than 5MB.");
        return;
      }
    }

    setIsUpdating(true);

    try {
      let imageUrl = user?.image || "";

      // Upload new profile photo
      if (imageFile && imageFile.size > 0) {
        const uploadData = new FormData();
        uploadData.append("image", imageFile);

        const uploadResponse = await fetch("/api/upload", {
          method: "POST",
          body: uploadData,
        });

        const uploadResult = await uploadResponse.json();

        if (
          !uploadResponse.ok ||
          !uploadResult.success ||
          !uploadResult.imageUrl
        ) {
          throw new Error(uploadResult.error || "Image upload failed.");
        }

        imageUrl = uploadResult.imageUrl;
      }

      // Remove existing photo
      if (removeImage) {
        imageUrl = "";
      }

      // Update Better Auth user information
      const { error } = await authClient.updateUser({
        name,
        image: imageUrl,
        phone,
        area,
        bio,
      });

      if (error) {
        throw new Error(error.message || "Unable to update your profile.");
      }

      await authClient.getSession();

      toast.success("Profile updated successfully.");
      setShow(false);
    } catch (error) {
      console.error("Profile update failed:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setIsUpdating(false);
    }
  };

  // Loading state
  if (isPending) {
    return (
      <main className={`${pageBackground} px-4 py-10 sm:px-6`}>
        <div className="mx-auto max-w-5xl animate-pulse space-y-6">
          <div className="h-5 w-40 rounded bg-surface-secondary" />
          <div className="h-52 rounded-3xl bg-surface" />
          <div className="h-72 rounded-3xl bg-surface" />
        </div>
      </main>
    );
  }

  // Not signed in
  if (!user) {
    return (
      <main
        className={`flex min-h-[70vh] items-center justify-center px-4 py-12 ${pageBackground}`}
      >
        <section className={`${card} w-full max-w-md p-8 text-center`}>
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-accent text-primary">
            <CircleUserRound size={32} />
          </div>

          <h1 className={`mt-5 text-2xl ${heading}`}>
            Sign in to your account
          </h1>

          <p className={`mt-2 text-sm leading-6 ${mutedText}`}>
            Sign in to view and manage your FixMate profile.
          </p>

          <Link href="/signin" className={`${primaryButton} mt-6 w-full`}>
            Sign In
          </Link>

          <Link
            href="/"
            className={`mt-4 inline-flex items-center gap-2 text-sm font-medium transition hover:text-primary ${mutedText}`}
          >
            <ArrowLeft size={16} />
            Back to home
          </Link>
        </section>
      </main>
    );
  }

  const initial = user.name?.trim().charAt(0).toUpperCase() || "U";

  const role = user.role || "customer";

  const roleLabel =
    role === "technician"
      ? "Technician"
      : role === "admin"
        ? "Admin"
        : "Customer";

  const dashboardPath =
    role === "technician"
      ? "/dashboard/technician"
      : role === "admin"
        ? "/dashboard/admin"
        : "/dashboard/customer";

  return (
    <main
      className={`relative min-h-screen overflow-hidden px-4 py-10 sm:px-6 lg:px-8 ${pageBackground}`}
    >
      {/* Background Effects */}
      <div className="pointer-events-none absolute -right-40 top-10 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />

      <div className="pointer-events-none absolute -left-40 bottom-0 h-80 w-80 rounded-full bg-secondary/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          className="mb-7 flex items-center gap-2 text-sm"
        >
          <Link
            href="/"
            className={`${mutedText} font-medium transition hover:text-primary`}
          >
            Home
          </Link>

          <ChevronRight size={15} className="text-muted-foreground" />

          <span className="font-semibold text-primary">My Profile</span>
        </nav>

        {/* Page Heading */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm font-semibold tracking-wide text-primary">
            <ShieldCheck size={18} />
            <span>YOUR FIXMATE ACCOUNT</span>
          </div>

          <h1 className={`mt-3 text-3xl tracking-tight sm:text-4xl ${heading}`}>
            My Profile
          </h1>

          <p
            className={`mt-3 max-w-2xl text-sm leading-6 sm:text-base ${mutedText}`}
          >
            Manage your personal information and keep your account details up to
            date.
          </p>
        </div>

        {/* Profile Banner */}
        <section className={`${card} overflow-hidden`}>
          <div className="relative h-28 overflow-hidden bg-gradient-to-r from-[#101f1c] via-primary to-[#5ad6ad] sm:h-36">
            <div className="pointer-events-none absolute -right-10 -top-24 h-64 w-64 rounded-full border border-white/15" />

            <div className="pointer-events-none absolute -right-4 -top-16 h-48 w-48 rounded-full border border-white/15" />

            <div className="pointer-events-none absolute -bottom-20 left-1/3 h-48 w-48 rounded-full bg-secondary/20 blur-2xl" />

            <div className="relative flex h-full items-start justify-end p-5">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/30 bg-black/10 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm">
                <ShieldCheck size={15} />
                FixMate Account
              </span>
            </div>
          </div>

          <div className="px-5 pb-6 sm:px-8 sm:pb-8">
            <div className="-mt-12 flex flex-col gap-5 sm:-mt-14 sm:flex-row sm:items-end sm:justify-between">
              <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-end">
                {/* Avatar */}
                <div className="z-10 flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-3xl border-4 border-surface bg-accent text-3xl font-bold text-primary shadow-sm sm:h-28 sm:w-28">
                  {user.image ? (
                    <Image
                      src={user.image}
                      alt={user.name || "Profile photo"}
                      width={112}
                      height={112}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    initial
                  )}
                </div>

                {/* User Details */}
                <div className="z-10 min-w-0 pb-1">
                  <h2
                    className={`break-words text-2xl sm:text-3xl ${heading} text-white`}
                  >
                    {user.name || "FixMate User"}
                  </h2>

                  <p
                    className={`mt-1 break-all text-sm ${mutedText} text-black`}
                  >
                    {user.email}
                  </p>

                  <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-primary">
                    {role === "technician" ? (
                      <Wrench size={14} />
                    ) : (
                      <UserRound size={14} />
                    )}
                    {roleLabel}
                  </span>
                </div>
              </div>

              {/* Edit Button */}
              <button
                type="button"
                onClick={() => setShow((previous) => !previous)}
                aria-expanded={show}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-surface px-4 py-3 text-sm font-semibold text-foreground transition hover:border-primary hover:bg-surface-hover hover:text-primary"
              >
                {show ? <X size={17} /> : <Edit3 size={17} />}
                {show ? "Cancel Editing" : "Edit Profile"}
              </button>
            </div>
          </div>
        </section>

        {/* Personal Information */}
        <section className={`${card} mt-7 p-5 sm:p-8`}>
          <div className="flex items-start gap-3 border-b border-border pb-5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent text-primary">
              <UserRound size={22} />
            </div>

            <div>
              <h2 className={`text-lg ${heading}`}>Personal Information</h2>

              <p className={`mt-1 text-sm ${mutedText}`}>
                Your basic FixMate account details.
              </p>
            </div>
          </div>

          {!show ? (
            <div className="grid gap-5 pt-6 sm:grid-cols-2">
              <div className={detailCard}>
                <div
                  className={`flex items-center gap-2 text-sm font-medium ${mutedText}`}
                >
                  <UserRound size={17} />
                  Full Name
                </div>

                <p className={`mt-3 break-words font-semibold ${heading}`}>
                  {user.name || "Not provided"}
                </p>
              </div>

              <div className={detailCard}>
                <div
                  className={`flex items-center gap-2 text-sm font-medium ${mutedText}`}
                >
                  <Mail size={17} />
                  Email Address
                </div>

                <p className={`mt-3 break-all font-semibold ${heading}`}>
                  {user.email}
                </p>
              </div>

              <div className={detailCard}>
                <div
                  className={`flex items-center gap-2 text-sm font-medium ${mutedText}`}
                >
                  <BriefcaseBusiness size={17} />
                  Account Role
                </div>

                <p className={`mt-3 font-semibold ${heading}`}>{roleLabel}</p>
              </div>

              <div className={detailCard}>
                <div
                  className={`flex items-center gap-2 text-sm font-medium ${mutedText}`}
                >
                  <Camera size={17} />
                  Profile Photo
                </div>

                <p className="mt-3 break-all text-sm font-medium text-primary">
                  {user.image
                    ? "Profile photo added"
                    : "No profile photo added"}
                </p>
              </div>

{/* Phone Number */}
<div className={detailCard}>
  <div className={`flex items-center gap-2 text-sm font-medium ${mutedText}`}>
    <Phone size={17} />
    Phone Number
  </div>

  <p className={`mt-3 break-words font-semibold ${heading}`}>
    {user.phone || "Not provided"}
  </p>
</div>

{/* Area */}
<div className={detailCard}>
  <div className={`flex items-center gap-2 text-sm font-medium ${mutedText}`}>
    <MapPin size={17} />
    Area / Location
  </div>

  <p className={`mt-3 break-words font-semibold ${heading}`}>
    {user.area || "Not provided"}
  </p>
</div>

{/* Bio */}
<div className={detailCard}>
  <div className={`flex items-center gap-2 text-sm font-medium ${mutedText}`}>
    <UserRound size={17} />
    About Me
  </div>

  <p className={`mt-3 break-words text-sm font-medium ${heading}`}>
    {user.bio || "No bio added yet."}
  </p>
</div>

            </div>
          ) : (
            <form onSubmit={handleUpdateProfile} className="space-y-6 pt-6">
              {/* Name */}
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-semibold text-foreground"
                >
                  Full Name
                </label>

                <input
                  id="name"
                  name="name"
                  type="text"
                  defaultValue={user.name || ""}
                  placeholder="Enter your full name"
                  autoComplete="name"
                  required
                  maxLength={100}
                  className={inputClass}
                />
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-semibold text-foreground"
                >
                  Email Address
                </label>

                <input
                  id="email"
                  type="email"
                  value={user.email}
                  readOnly
                  className="w-full cursor-not-allowed rounded-xl border border-border bg-surface-secondary px-4 py-3 text-sm text-muted outline-none"
                />

                <p className={`mt-2 text-xs ${mutedText}`}>
                  Email changes are not available in this form.
                </p>
              </div>

              {/* Phone Number */}
              <div>
                <label
                  htmlFor="phone"
                  className="mb-2 block text-sm font-semibold text-foreground"
                >
                  Phone Number
                </label>

                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  defaultValue={user.phone || ""}
                  placeholder="Enter your phone number"
                  autoComplete="tel"
                  maxLength={20}
                  className={inputClass}
                />
              </div>

              {/* Area */}
              <div>
                <label
                  htmlFor="area"
                  className="mb-2 block text-sm font-semibold text-foreground"
                >
                  Area / Location
                </label>

                <input
                  id="area"
                  name="area"
                  type="text"
                  defaultValue={user.area || ""}
                  placeholder="e.g. Mirpur, Dhaka"
                  maxLength={150}
                  className={inputClass}
                />
              </div>

              {/* Bio */}
              <div>
                <label
                  htmlFor="bio"
                  className="mb-2 block text-sm font-semibold text-foreground"
                >
                  About Me
                </label>

                <textarea
                  id="bio"
                  name="bio"
                  rows={4}
                  defaultValue={user.bio || ""}
                  placeholder="Tell us a little about yourself..."
                  maxLength={500}
                  className={`${inputClass} resize-none`}
                />

                <p className={`mt-2 text-xs ${mutedText}`}>
                  Maximum 500 characters.
                </p>
              </div>

              {/* Profile Image Upload */}
              <div>
                <label
                  htmlFor="image"
                  className="mb-2 block text-sm font-semibold text-foreground"
                >
                  Profile Photo
                </label>

                <div className="rounded-2xl border border-dashed border-primary/40 bg-surface-secondary p-5">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                    <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-border bg-surface">
                      {user.image ? (
                        <Image
                          src={user.image}
                          alt="Current profile photo"
                          width={80}
                          height={80}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <CircleUserRound size={38} className="text-primary" />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <label
                        htmlFor="image"
                        className={`${primaryButton} cursor-pointer px-4 py-2.5`}
                      >
                        <Upload size={16} />
                        Choose New Photo
                      </label>

                      <input
                        id="image"
                        name="image"
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        className="sr-only"
                      />

                      <p className={`mt-2 text-xs leading-5 ${mutedText}`}>
                        JPG, PNG or WEBP. Maximum file size: 5MB.
                      </p>
                    </div>
                  </div>
                </div>

                {user.image && (
                  <label className="mt-4 flex cursor-pointer items-center gap-2 text-sm text-muted">
                    <input
                      type="checkbox"
                      name="removeImage"
                      className="h-4 w-4 accent-primary"
                    />
                    Remove my current profile photo
                  </label>
                )}
              </div>

              {/* Form Actions */}
              <div className="flex flex-col-reverse gap-3 border-t border-border pt-5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setShow(false)}
                  disabled={isUpdating}
                  className="rounded-xl border border-border px-5 py-3 text-sm font-semibold text-foreground transition hover:bg-surface-hover disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isUpdating}
                  className={primaryButton}
                >
                  {isUpdating ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-current/40 border-t-current" />
                      Saving Changes...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 size={17} />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </section>

        {/* Account Navigation */}
        <section className={`${card} mt-7 p-5 sm:p-6`}>
          <h2 className={`text-lg ${heading}`}>Your FixMate Account</h2>

          <p className={`mt-1 text-sm ${mutedText}`}>
            Continue managing your account and services.
          </p>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <Link
              href={dashboardPath}
              className="group flex items-center justify-between rounded-2xl border border-border p-4 transition hover:border-primary hover:bg-surface-hover"
            >
              <span className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-primary">
                  <BriefcaseBusiness size={21} />
                </span>

                <span>
                  <span className={`block text-sm font-semibold ${heading}`}>
                    Dashboard
                  </span>

                  <span className={`mt-1 block text-xs ${mutedText}`}>
                    Manage your account
                  </span>
                </span>
              </span>

              <ChevronRight
                size={18}
                className="text-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-primary"
              />
            </Link>
          </div>
        </section>

        {/* Footer */}
        <p className={`mt-6 text-center text-xs leading-5 ${mutedText}`}>
          FixMate — Reliable help, whenever you need it.
        </p>
      </div>
    </main>
  );
};

export default ProfilePage;
