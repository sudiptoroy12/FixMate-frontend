
"use client";

import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { toast } from "react-toastify";

import {
  Eye,
  EyeOff,
  Check,
  Circle,
  Wrench,
  UserRound,
  ShieldCheck,
  ImagePlus,
  X,

  Loader2,
} from "lucide-react";

import { SignupSkeleton } from "../../components/SignupSkeleton";

type UserRole = "customer" | "technician";
type SocialProvider = "google" | "github";

const SignUpPage = () => {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] =
    useState<SocialProvider | null>(null);

  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("customer");

  // Profile image states
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  // Password validation
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasMinLength = password.length >= 6;

  const passwordIsValid =
    hasUppercase && hasLowercase && hasMinLength;

  // Handle image selection
  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      toast.error("Only JPG, PNG and WEBP images are allowed.");
      e.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be smaller than 5MB.");
      e.target.value = "";
      return;
    }

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  // Remove selected image
  const removeImage = () => {
    setImage(null);
    setPreview(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Clean up preview URL
  useEffect(() => {
    if (!preview) return;

    return () => {
      URL.revokeObjectURL(preview);
    };
  }, [preview]);

  // Password requirement styles
  const passwordRuleClass = (isValid: boolean) =>
    `flex items-center gap-2 text-xs transition-colors ${
      isValid ? "text-success" : "text-muted"
    }`;

  const inputClass =
    "h-12 w-full rounded-xl border border-input bg-surface px-4 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20";

  const visibilityButtonClass =
    "absolute right-3 top-1/2 -translate-y-1/2 text-muted transition hover:text-primary";

  const labelClass =
    "mb-2 block text-sm font-medium text-foreground";

  const roleCardClass = (selected: boolean) =>
    `flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition ${
      selected
        ? "border-primary bg-accent ring-2 ring-primary/15"
        : "border-border bg-surface hover:border-primary/50"
    }`;

  const socialButtonClass =
    "flex h-12 items-center justify-center gap-2 rounded-xl border border-border bg-surface text-sm font-semibold text-foreground transition hover:border-primary/50 hover:bg-accent focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60";

  // Google and GitHub signup
  const handleSocialSignup = async (
    provider: SocialProvider
  ) => {
    setSocialLoading(provider);

    try {
      const { error } = await authClient.signIn.social({
        provider,
        callbackURL: "/",
      });

      if (error) {
        toast.error(
          error.message || `${provider} signup failed.`
        );
        setSocialLoading(null);
      }
    } catch {
      toast.error(
        `Something went wrong with ${provider} signup.`
      );
      setSocialLoading(null);
    }
  };

  // Email signup handler
  const onSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    const form = e.currentTarget;
    const formData = new FormData(form);

    const name = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();

    const confirmPassword = String(
      formData.get("confirmPassword") ?? ""
    );

    setErrorMessage("");

    // Required field validation
    if (!name || !email || !password || !confirmPassword) {
      const message = "Please fill in all required fields.";
      setErrorMessage(message);
      toast.error(message);
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      const message = "Please enter a valid email address.";
      setErrorMessage(message);
      toast.error(message);
      return;
    }

    // Password validation
    if (!passwordIsValid) {
      const message = "Please meet all password requirements.";
      setErrorMessage(message);
      toast.error(message);
      return;
    }

    // Confirm password validation
    if (password !== confirmPassword) {
      const message = "Passwords do not match.";
      setErrorMessage(message);
      toast.error(message);
      return;
    }

    const selectedRole: UserRole =
      role === "technician" ? "technician" : "customer";

    const dashboardPath =
      selectedRole === "technician"
        ? "/dashboard/technician"
        : "/dashboard/customer";

    setLoading(true);

    try {
      let imageUrl: string | undefined;

      // STEP 1: Upload image to ImgBB
      if (image) {
        const uploadFormData = new FormData();
        uploadFormData.append("image", image);

        const uploadResponse = await fetch("/api/upload", {
          method: "POST",
          body: uploadFormData,
        });

        const uploadResult = await uploadResponse.json();

        if (
          !uploadResponse.ok ||
          !uploadResult.success ||
          !uploadResult.imageUrl
        ) {
          throw new Error(
            uploadResult.error || "Image upload failed."
          );
        }

        imageUrl = uploadResult.imageUrl;
      }

      // STEP 2: Register user with Better Auth
      const { data, error } = await authClient.signUp.email({
        name,
        email,
        password,
        image: imageUrl,
        role: selectedRole,
        callbackURL: dashboardPath,
      });

      if (error) {
        const message =
          error.message || "Unable to create your account.";

        setErrorMessage(message);
        toast.error(message);
        return;
      }

      if (data) {
        form.reset();

        setPassword("");
        setRole("customer");
        setImage(null);
        setPreview(null);

        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }

        toast.success(
          "Your FixMate account has been created!"
        );

        router.push(dashboardPath);
        router.refresh();
      }
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Something went wrong while creating your account.";

      setErrorMessage(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4 py-10 text-foreground transition-colors duration-300">

      {/* Decorative background */}
      <div className="pointer-events-none absolute -left-32 top-10 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />

      <div className="pointer-events-none absolute -bottom-32 -right-24 h-96 w-96 rounded-full bg-secondary/15 blur-3xl" />

      <div className="relative w-full max-w-md">

        {/* FixMate branding */}
        <div className="mb-7 text-center">
          <Link
            href="/"
            className="mb-5 inline-flex items-center justify-center gap-2"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
              <Wrench size={25} />
            </span>

            <span className="text-2xl font-bold tracking-tight text-foreground">
              Fix<span className="text-primary">Mate</span>
            </span>
          </Link>

          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Create your account
          </h1>

          <p className="mt-2 text-sm leading-6 text-muted">
            Join FixMate and get reliable repair services whenever you need them.
          </p>
        </div>

        {/* Signup card */}
        <div className="rounded-2xl border border-border bg-surface p-6 shadow-xl shadow-black/5 sm:p-7">

          {loading ? (
            <SignupSkeleton />
          ) : (
            <>
              <form onSubmit={onSubmit} className="space-y-5">

                {/* Full name */}
                <div>
                  <label htmlFor="name" className={labelClass}>
                    Full name
                  </label>

                  <input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    required
                    placeholder="Enter your full name"
                    className={inputClass}
                  />
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className={labelClass}>
                    Email address
                  </label>

                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    placeholder="you@example.com"
                    className={inputClass}
                  />
                </div>

                {/* Profile picture upload */}
                <div>
                  <label className={labelClass}>
                    Profile picture
                    <span className="ml-1 font-normal text-muted">
                      (Optional)
                    </span>
                  </label>

                  <div className="flex items-center gap-4">

                    {/* Image preview */}
                    <div className="relative flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-dashed border-border bg-surface-secondary">
                      {preview ? (
                        <img
                          src={preview}
                          alt="Profile preview"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <UserRound
                          size={32}
                          className="text-muted"
                        />
                      )}

                      {preview && (
                        <button
                          type="button"
                          onClick={removeImage}
                          aria-label="Remove profile picture"
                          className="absolute right-0 top-0 flex h-6 w-6 items-center justify-center rounded-full bg-danger text-white shadow"
                        >
                          <X size={14} />
                        </button>
                      )}
                    </div>

                    {/* Upload button */}
                    <div className="min-w-0 flex-1">
                      <label
                        htmlFor="profileImage"
                        className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-border bg-surface px-4 py-3 text-sm font-medium text-foreground transition hover:border-primary hover:bg-accent"
                      >
                        <ImagePlus size={18} className="text-primary" />
                        {preview ? "Change photo" : "Upload photo"}
                      </label>

                      <input
                        ref={fileInputRef}
                        id="profileImage"
                        name="profileImage"
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={handleImageChange}
                        className="hidden"
                      />

                      <p className="mt-2 text-xs text-muted">
                        JPG, PNG or WEBP. Maximum 5MB.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Role selection */}
                <div>
                  <label className={labelClass}>
                    Select your account type
                  </label>

                  <div className="grid grid-cols-2 gap-3">

                    {/* Customer */}
                    <label className={roleCardClass(role === "customer")}>
                      <input
                        type="radio"
                        name="role"
                        value="customer"
                        checked={role === "customer"}
                        onChange={() => setRole("customer")}
                        className="sr-only"
                      />

                      <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent text-primary">
                        <UserRound size={19} />
                      </span>

                      <span>
                        <span className="block text-sm font-semibold text-foreground">
                          Customer
                        </span>
                        <span className="mt-1 block text-xs leading-5 text-muted">
                          Book repair services
                        </span>
                      </span>
                    </label>

                    {/* Technician */}
                    <label className={roleCardClass(role === "technician")}>
                      <input
                        type="radio"
                        name="role"
                        value="technician"
                        checked={role === "technician"}
                        onChange={() => setRole("technician")}
                        className="sr-only"
                      />

                      <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent text-primary">
                        <Wrench size={19} />
                      </span>

                      <span>
                        <span className="block text-sm font-semibold text-foreground">
                          Technician
                        </span>
                        <span className="mt-1 block text-xs leading-5 text-muted">
                          Provide repair services
                        </span>
                      </span>
                    </label>

                  </div>
                </div>

                {/* Password */}
                <div>
                  <label htmlFor="password" className={labelClass}>
                    Password
                  </label>

                  <div className="relative">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      required
                      minLength={6}
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setErrorMessage("");
                      }}
                      placeholder="Create a strong password"
                      aria-describedby="password-requirements"
                      className={`${inputClass} pr-12`}
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                      className={visibilityButtonClass}
                    >
                      {showPassword ? (
                        <EyeOff size={19} />
                      ) : (
                        <Eye size={19} />
                      )}
                    </button>
                  </div>

                  {/* Password requirements */}
                  <div
                    id="password-requirements"
                    className="mt-3 rounded-xl border border-border bg-surface-secondary p-3"
                  >
                    <p className="mb-2 text-xs font-semibold text-foreground">
                      Your password must contain:
                    </p>

                    <ul className="space-y-2">
                      <li className={passwordRuleClass(hasUppercase)}>
                        {hasUppercase ? (
                          <Check size={15} />
                        ) : (
                          <Circle size={13} />
                        )}
                        At least one uppercase letter (A–Z)
                      </li>

                      <li className={passwordRuleClass(hasLowercase)}>
                        {hasLowercase ? (
                          <Check size={15} />
                        ) : (
                          <Circle size={13} />
                        )}
                        At least one lowercase letter (a–z)
                      </li>

                      <li className={passwordRuleClass(hasMinLength)}>
                        {hasMinLength ? (
                          <Check size={15} />
                        ) : (
                          <Circle size={13} />
                        )}
                        At least 6 characters
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Confirm password */}
                <div>
                  <label htmlFor="confirmPassword" className={labelClass}>
                    Confirm password
                  </label>

                  <div className="relative">
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      autoComplete="new-password"
                      required
                      minLength={6}
                      placeholder="Re-enter your password"
                      className={`${inputClass} pr-12`}
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword((prev) => !prev)
                      }
                      aria-label={
                        showConfirmPassword
                          ? "Hide confirm password"
                          : "Show confirm password"
                      }
                      className={visibilityButtonClass}
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={19} />
                      ) : (
                        <Eye size={19} />
                      )}
                    </button>
                  </div>
                </div>

                {/* Error message */}
                {errorMessage && (
                  <div
                    role="alert"
                    className="rounded-xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger"
                  >
                    {errorMessage}
                  </div>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading || socialLoading !== null}
                  className="h-12 w-full rounded-xl bg-primary font-semibold text-primary-foreground shadow-md shadow-primary/15 transition duration-200 hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-surface disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Create account
                </button>
              </form>

              {/* Divider */}
              <div className="my-6 flex items-center gap-4">
                <div className="h-px flex-1 bg-border" />

                <span className="text-xs font-medium tracking-wider text-muted-foreground">
                  OR SIGN UP WITH
                </span>

                <div className="h-px flex-1 bg-border" />
              </div>

              {/* Social signup */}
              <div className="grid grid-cols-2 gap-3">
                {/* Google */}
                <button
                  type="button"
                  onClick={() => handleSocialSignup("google")}
                  disabled={loading || socialLoading !== null}
                  className={socialButtonClass}
                >
                  {socialLoading === "google" ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <span className="text-base font-bold">G</span>
                  )}

                  Google
                </button>

                {/* GitHub */}
                <button
                  type="button"
                  onClick={() => handleSocialSignup("github")}
                  disabled={loading || socialLoading !== null}
                  className={socialButtonClass}
                >
                  {socialLoading === "github" ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <span className="text-base font-bold">   <svg
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.57.1.78-.25.78-.55v-2.13c-3.2.7-3.87-1.54-3.87-1.54-.52-1.33-1.28-1.69-1.28-1.69-1.05-.72.08-.71.08-.71 1.16.08 1.77 1.19 1.77 1.19 1.03 1.76 2.7 1.25 3.36.96.1-.75.4-1.25.73-1.54-2.55-.29-5.23-1.28-5.23-5.69 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.47.11-3.06 0 0 .97-.31 3.17 1.18a10.98 10.98 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.77-.11 3.06.74.81 1.19 1.84 1.19 3.1 0 4.42-2.69 5.39-5.25 5.68.41.36.78 1.08.78 2.18v3.24c0 .3.21.66.79.55A11.51 11.51 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
              </svg></span>
                  )}

                  GitHub
                </button>
              </div>

              {/* Social signup note */}
              <p className="mt-3 text-center text-xs leading-5 text-muted">
                Social signup creates an account with the default customer role.
              </p>
            </>
          )}

          {/* Sign in link */}
          <p className="mt-6 text-center text-sm text-muted">
            Already have an account?{" "}
            <Link
              href="/signin"
              className="font-semibold text-primary transition hover:text-primary-hover"
            >
              Sign in
            </Link>
          </p>
        </div>

        {/* Back to home */}
        <Link
          href="/"
          className="mx-auto mt-5 block text-center text-sm text-muted transition hover:text-primary"
        >
          &larr; Back to FixMate
        </Link>

        <p className="mt-6 text-center text-xs text-muted">
          <ShieldCheck className="mr-1 inline-block" size={13} />
          Your repair journey starts here.
        </p>
      </div>
    </main>
  );
};

export default SignUpPage;
