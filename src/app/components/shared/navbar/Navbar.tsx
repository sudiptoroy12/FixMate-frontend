
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Wrench,
  Menu,
  X,
  ChevronDown,
  LayoutDashboard,
  UserRound,
  LogOut,
  Settings,
  Home,
  Info,
  Smartphone,
} from "lucide-react";

import { authClient } from "@/lib/auth-client";
import ThemeToggle from "../../theme/ThemeToggle";

const navLinks = [
  { label: "Home", href: "/", icon: Home },
  { label: "Services", href: "/services", icon: Smartphone },
  { label: "About", href: "/about", icon: Info },
];

const dashboardRoutes: Record<string, string> = {
  customer: "/dashboard/customer",
  technician: "/dashboard/technician",
  admin: "/dashboard/admin",
};

const Navbar = () => {
  const pathname = usePathname();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const { data: session, isPending } = authClient.useSession();

  const user = session?.user;

  const role =
    (user as typeof user & { role?: string })?.role?.toLowerCase() ||
    "customer";

  const dashboardLink =
    dashboardRoutes[role] || "/dashboard/customer";

  const userName = user?.name || "User";
  const userImage = user?.image;

  const closeMenus = () => {
    setMobileMenuOpen(false);
    setProfileMenuOpen(false);
  };

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const getNavClass = (active: boolean) =>
    `flex items-center gap-2.5 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-200 ${
      active
        ? "bg-accent text-primary"
        : "text-muted hover:bg-surface-secondary hover:text-primary"
    }`;

  const handleSignOut = async () => {
    try {
      await authClient.signOut();
      closeMenus();
    } catch (error) {
      console.error("Sign out failed:", error);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/90 shadow-sm backdrop-blur-xl">
      <div className="mx-auto flex min-h-[76px] max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">

        {/* Logo */}
        <Link
          href="/"
          onClick={closeMenus}
          aria-label="FixMate home"
          className="group flex shrink-0 items-center gap-3"
        >
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/20 transition duration-300 group-hover:-rotate-6 group-hover:scale-105">
            <Wrench size={23} strokeWidth={2.4} />
          </span>

          <span className="text-[23px] font-extrabold tracking-tight text-foreground">
            Fix<span className="text-primary">Mate</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav
          aria-label="Main navigation"
          className="hidden items-center gap-1 md:flex"
        >
          {navLinks.map((link) => {
            const active = isActive(link.href);
            const Icon = link.icon;

            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={closeMenus}
                aria-current={active ? "page" : undefined}
                className={getNavClass(active)}
              >
                <Icon size={17} strokeWidth={2} />
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden shrink-0 items-center gap-3 md:flex">
          <ThemeToggle />

          {!isPending && !user && (
            <>
              <Link
                href="/signin"
                className="rounded-xl px-4 py-2.5 text-sm font-semibold text-foreground transition hover:bg-surface-secondary"
              >
                Sign In
              </Link>

              <Link
                href="/signup"
                className="rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/15 transition hover:-translate-y-0.5 hover:bg-primary-hover"
              >
                Get Started
              </Link>
            </>
          )}

          {!isPending && user && (
            <div className="relative">
              {/* Profile Button */}
              <button
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                aria-expanded={profileMenuOpen}
                aria-haspopup="menu"
                className="flex items-center gap-2.5 rounded-2xl border border-border bg-surface p-1.5 pr-3 transition hover:border-primary/40 hover:bg-surface-secondary"
              >
                {userImage ? (
                  <img
                    src={userImage}
                    alt={userName}
                    className="h-9 w-9 rounded-xl object-cover"
                  />
                ) : (
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent text-primary">
                    <UserRound size={19} />
                  </span>
                )}

                <span className="max-w-28 truncate text-sm font-semibold text-foreground">
                  {userName}
                </span>

                <ChevronDown
                  size={16}
                  className={`text-muted transition-transform ${
                    profileMenuOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Profile Dropdown */}
              {profileMenuOpen && (
                <div
                  role="menu"
                  className="absolute right-0 top-full mt-3 w-64 overflow-hidden rounded-2xl border border-border bg-surface shadow-2xl shadow-black/10"
                >
                  <div className="border-b border-border bg-surface-secondary/60 p-4">
                    <p className="truncate font-bold text-foreground">
                      {userName}
                    </p>

                    <span className="mt-2 inline-flex rounded-full bg-accent px-3 py-1 text-xs font-bold capitalize text-primary">
                      {role}
                    </span>
                  </div>

                  <div className="space-y-1 p-2">
                    <Link
                      href={dashboardLink}
                      onClick={closeMenus}
                      role="menuitem"
                      className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-foreground transition hover:bg-accent hover:text-primary"
                    >
                      <LayoutDashboard size={18} />
                      Dashboard
                    </Link>

                    <Link
                      href="/profile"
                      onClick={closeMenus}
                      role="menuitem"
                      className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-foreground transition hover:bg-accent hover:text-primary"
                    >
                      <Settings size={18} />
                      Update Profile
                    </Link>

                    <button
                      onClick={handleSignOut}
                      role="menuitem"
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-danger transition hover:bg-danger/10"
                    >
                      <LogOut size={18} />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile Actions */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-surface text-foreground transition hover:bg-surface-secondary"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="border-t border-border bg-background px-4 py-5 shadow-lg md:hidden sm:px-6">
          <nav className="flex flex-col gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={closeMenus}
                  aria-current={active ? "page" : undefined}
                  className={getNavClass(active)}
                >
                  <Icon size={18} />
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="mt-4 border-t border-border pt-4">
            {!isPending && !user && (
              <div className="flex flex-col gap-2">
                <Link
                  href="/signin"
                  onClick={closeMenus}
                  className="rounded-xl border border-border px-4 py-3 text-center text-sm font-semibold text-foreground transition hover:bg-surface-secondary"
                >
                  Sign In
                </Link>

                <Link
                  href="/signup"
                  onClick={closeMenus}
                  className="rounded-xl bg-primary px-4 py-3 text-center text-sm font-bold text-primary-foreground transition hover:bg-primary-hover"
                >
                  Get Started
                </Link>
              </div>
            )}

            {!isPending && user && (
              <div className="space-y-2">
                {/* Mobile User Information */}
                <div className="mb-3 flex items-center gap-3 rounded-2xl border border-border bg-surface-secondary p-3">
                  {userImage ? (
                    <img
                      src={userImage}
                      alt={userName}
                      className="h-11 w-11 rounded-xl object-cover"
                    />
                  ) : (
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent text-primary">
                      <UserRound size={21} />
                    </span>
                  )}

                  <div className="min-w-0">
                    <p className="truncate font-bold text-foreground">
                      {userName}
                    </p>
                    <span className="text-xs font-semibold capitalize text-primary">
                      {role}
                    </span>
                  </div>
                </div>

                <Link
                  href={dashboardLink}
                  onClick={closeMenus}
                  className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-foreground transition hover:bg-accent hover:text-primary"
                >
                  <LayoutDashboard size={19} />
                  Dashboard
                </Link>

                <Link
                  href="/profile"
                  onClick={closeMenus}
                  className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-foreground transition hover:bg-accent hover:text-primary"
                >
                  <Settings size={19} />
                  Update Profile
                </Link>

                <button
                  onClick={handleSignOut}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-danger transition hover:bg-danger/10"
                >
                  <LogOut size={19} />
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
