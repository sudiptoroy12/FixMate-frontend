"use client";

import { authClient } from "@/lib/auth-client";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import {
  Eye,
  EyeOff,
  Wrench,
  ArrowLeft,
  Loader2,
} from "lucide-react";

const SignInPage = () => {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;
    const formData = new FormData(form);

    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");

    setLoading(true);
    setErrorMessage("");

    try {
      const { data, error } = await authClient.signIn.email({
        email,
        password,
      });

      if (error) {
        const message = "Invalid email address or password.";
        setErrorMessage(message);
        toast.error(message);
        return;
      }

      if (data) {
        form.reset();
        toast.success("Welcome back to FixMate!");

        const role = (
          data.user as typeof data.user & { role?: string }
        ).role?.toLowerCase();

        if (role === "admin") {
          router.push("/dashboard/admin");
        } else if (role === "technician") {
          router.push("/dashboard/technician");
        } else {
          router.push("/dashboard/customer");
        }
      }
    } catch {
      const message = "Something went wrong while signing in.";
      setErrorMessage(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const { error } = await authClient.signIn.social({
        provider: "google",
        callbackURL: "/",
      });

      if (error) {
        toast.error(error.message || "Google sign-in failed.");
      }
    } catch {
      toast.error("Something went wrong with Google sign-in.");
    }
  };

  const handleGithubLogin = async () => {
    try {
      const { error } = await authClient.signIn.social({
        provider: "github",
        callbackURL: "/",
      });

      if (error) {
        toast.error(error.message || "GitHub sign-in failed.");
      }
    } catch {
      toast.error("Something went wrong with GitHub sign-in.");
    }
  };

  const inputClass =
    "h-12 w-full rounded-xl border border-border bg-surface px-4 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/15";

  const labelClass =
    "mb-2 block text-sm font-semibold text-foreground";

  const socialButtonClass =
    "flex h-12 items-center justify-center gap-2 rounded-xl border border-border bg-surface text-sm font-semibold text-foreground transition hover:border-primary/50 hover:bg-accent focus:outline-none focus:ring-2 focus:ring-primary/20";

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4 py-10 text-foreground transition-colors duration-300">

      {/* Decorative background */}
      <div className="pointer-events-none absolute -left-32 top-10 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-24 h-96 w-96 rounded-full bg-secondary/10 blur-3xl" />

      <div className="relative w-full max-w-md">

        {/* FixMate branding */}
        <div className="mb-8 text-center">
          <button
            type="button"
            onClick={() => router.push("/")}
            className="mb-6 inline-flex items-center justify-center gap-3"
            aria-label="FixMate home"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
              <Wrench size={25} />
            </span>

            <span className="text-2xl font-bold tracking-tight text-foreground">
              Fix<span className="text-primary">Mate</span>
            </span>
          </button>

          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Welcome back
          </h1>

          <p className="mt-2 text-sm leading-6 text-muted">
            Sign in to book trusted technicians and manage your repair services.
          </p>
        </div>

        {/* Sign-in card */}
        <div className="rounded-2xl border border-border bg-surface p-6 shadow-xl shadow-black/5 transition-colors duration-300 sm:p-8">

          <form onSubmit={onSubmit} className="space-y-5">

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

            {/* Password */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <label htmlFor="password" className="text-sm font-semibold text-foreground">
                  Password
                </label>
              </div>

              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  placeholder="Enter your password"
                  className={`${inputClass} pr-12`}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted transition hover:text-primary"
                >
                  {showPassword ? (
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
                className="rounded-xl border border-danger/20 bg-danger/10 px-4 py-3 text-sm text-danger"
              >
                {errorMessage}
              </div>
            )}

            {/* Sign-in button */}
            <button
              type="submit"
              disabled={loading}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary font-semibold text-primary-foreground shadow-md shadow-primary/15 transition duration-200 hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-surface disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading && <Loader2 size={18} className="animate-spin" />}
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-4">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs font-medium tracking-wider text-muted-foreground">
              OR CONTINUE WITH
            </span>
            <div className="h-px flex-1 bg-border" />
          </div>

          {/* Social sign-in */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={handleGoogleLogin}
              className={socialButtonClass}
            >
              <span className="text-base font-bold">G</span>
              Google
            </button>

            <button
              type="button"
              onClick={handleGithubLogin}
              className={socialButtonClass}
            >
              <svg
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.57.1.78-.25.78-.55v-2.13c-3.2.7-3.87-1.54-3.87-1.54-.52-1.33-1.28-1.69-1.28-1.69-1.05-.72.08-.71.08-.71 1.16.08 1.77 1.19 1.77 1.19 1.03 1.76 2.7 1.25 3.36.96.1-.75.4-1.25.73-1.54-2.55-.29-5.23-1.28-5.23-5.69 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.47.11-3.06 0 0 .97-.31 3.17 1.18a10.98 10.98 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.77-.11 3.06.74.81 1.19 1.84 1.19 3.1 0 4.42-2.69 5.39-5.25 5.68.41.36.78 1.08.78 2.18v3.24c0 .3.21.66.79.55A11.51 11.51 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
              </svg>
              GitHub
            </button>
          </div>

          {/* Sign-up link */}
          <p className="mt-7 text-center text-sm text-muted">
            Don&apos;t have an account?{" "}
            <button
              type="button"
              onClick={() => router.push("/signup")}
              className="font-semibold text-primary transition hover:text-primary-hover"
            >
              Create an account
            </button>
          </p>
        </div>

        {/* Back to home */}
        <button
          type="button"
          onClick={() => router.push("/")}
          className="mx-auto mt-6 flex items-center gap-2 text-sm text-muted transition hover:text-primary"
        >
          <ArrowLeft size={16} />
          Back to FixMate
        </button>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          Your trusted partner for reliable repair services.
        </p>
      </div>
    </main>
  );
};

export default SignInPage;