
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Wrench,
  Menu,
  X,
  Home,
  Info,
  Smartphone,
} from "lucide-react";

import ThemeToggle from "../../theme/ThemeToggle";
import UserInfo from "./UserInfo";

const quickLinks = [
  {
    label: "Home",
    href: "/",
    icon: Home,
  },
  {
    label: "Services",
    href: "/services",
    icon: Smartphone,
  },
  {
    label: "About",
    href: "/#about",
    icon: Info,
  },
];

const Navbar = () => {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile menu after navigation
  const closeMenu = () => {
    setMobileMenuOpen(false);
  };

  // Check active navigation link
  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }

    if (href === "/#about") {
      return false;
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  };

  // Navigation link styles
  const navLinkClass = (active: boolean) =>
    `group relative flex items-center gap-2.5 rounded-xl px-4 py-2.5 text-sm font-bold transition-all duration-300 ${
      active
        ? "bg-[#b9e769] text-[#18352e] shadow-md shadow-[#b9e769]/10"
        : "text-white/75 hover:bg-white/10 hover:text-[#b9e769]"
    }`;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#b9e769]/15 bg-[#102b25]/95 text-white shadow-lg shadow-[#18352e]/10 backdrop-blur-xl">

      {/* Subtle bottom accent */}
      <div className="absolute bottom-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-[#b9e769]/40 to-transparent" />

      <div className="relative mx-auto flex min-h-[76px] max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">

        {/* Logo */}
        <Link
          href="/"
          onClick={closeMenu}
          aria-label="FixMate home"
          className="group flex shrink-0 items-center gap-3"
        >
          <span className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-[#b9e769] text-[#102b25] shadow-lg shadow-[#b9e769]/10 transition-all duration-300 group-hover:-rotate-6 group-hover:scale-110 group-hover:shadow-[#b9e769]/30">
            <Wrench size={23} strokeWidth={2.4} />
          </span>

          <span className="text-[23px] font-extrabold tracking-tight text-white">
            Fix<span className="text-[#b9e769]">Mate</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav
          aria-label="Main navigation"
          className="hidden items-center gap-1 rounded-2xl border border-white/5 bg-white/[0.03] p-1 md:flex"
        >
          {quickLinks.map((link) => {
            const active = isActive(link.href);
            const Icon = link.icon;

            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={closeMenu}
                aria-current={active ? "page" : undefined}
                className={navLinkClass(active)}
              >
                <Icon
                  size={17}
                  strokeWidth={2}
                  className="transition-transform duration-300 group-hover:scale-110"
                />
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden shrink-0 items-center gap-3 md:flex">

          {/* Theme Toggle */}
          <div className="rounded-xl border border-white/10 bg-white/5 p-1 transition-colors duration-300 hover:border-[#b9e769]/30 hover:bg-white/10">
            <ThemeToggle />
          </div>

          {/* User Info */}
          <UserInfo />

        </div>

        {/* Mobile Actions */}
        <div className="flex items-center gap-2 md:hidden">

          {/* Theme Toggle */}
          <div className="rounded-xl border border-white/10 bg-white/5 p-1">
            <ThemeToggle />
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white transition-all duration-300 hover:border-[#b9e769]/30 hover:bg-white/10 hover:text-[#b9e769] active:scale-95"
          >
            {mobileMenuOpen ? (
              <X size={22} />
            ) : (
              <Menu size={22} />
            )}
          </button>

        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="border-t border-[#b9e769]/10 bg-[#102b25] px-4 py-5 shadow-xl md:hidden sm:px-6">

          {/* Mobile Links */}
          <nav
            aria-label="Mobile navigation"
            className="flex flex-col gap-2"
          >
            {quickLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={closeMenu}
                  aria-current={active ? "page" : undefined}
                  className={navLinkClass(active)}
                >
                  <Icon size={18} />
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Mobile User Information */}
          <div className="mt-5 border-t border-white/10 pt-5">
            <UserInfo />
          </div>

        </div>
      )}
    </header>
  );
};

export default Navbar;
