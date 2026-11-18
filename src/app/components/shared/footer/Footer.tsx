
import Link from "next/link";
import {
  Wrench,
  ArrowUpRight,
  MapPin,
  Mail,
  Phone,
  Heart,
} from "lucide-react";

const quickLinks = [
  { name: "Home", href: "/" },
  { name: "Services", href: "/services" },
  { name: "About Us", href: "/about" },
  { name: "Contact", href: "/contact" },
];

const categories = [
  { name: "Mobile Repair", href: "/services?category=mobile" },
  { name: "Laptop Repair", href: "/services?category=laptop" },
  { name: "Computer Repair", href: "/services?category=computer" },
  { name: "Tablet Repair", href: "/services?category=tablet" },
];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-[#102b25] text-white">
      {/* Decorative background */}
      <div className="pointer-events-none absolute -right-32 -top-32 h-80 w-80 rounded-full bg-primary/20 blur-[100px]" />
      <div className="pointer-events-none absolute -bottom-40 left-0 h-80 w-80 rounded-full bg-[#b9e769]/10 blur-[100px]" />

      <div className="relative mx-auto max-w-7xl px-5 pt-16 sm:px-8 lg:px-10">
        {/* Main footer */}
        <div className="grid grid-cols-1 gap-12 pb-14 sm:grid-cols-2 lg:grid-cols-4 lg:gap-10">

          {/* Brand section */}
          <div className="lg:col-span-1">
            <Link href="/" className="group inline-flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#b9e769] text-[#102b25] transition-transform duration-300 group-hover:rotate-[-8deg]">
                <Wrench size={25} strokeWidth={2.5} />
              </div>

              <span className="text-2xl font-extrabold tracking-tight">
                Fix<span className="text-[#b9e769]">Mate</span>
              </span>
            </Link>

            <p className="mt-6 max-w-xs text-sm leading-7 text-gray-300">
              Your trusted partner for hassle-free device repairs. Connect
              with skilled technicians and get your devices back to life.
            </p>

            {/* Social links */}
            <div className="mt-7 flex items-center gap-3">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-gray-300 transition-all hover:border-[#b9e769] hover:bg-[#b9e769] hover:text-[#102b25]"
              >
                <svg
                  viewBox="0 0 24 24"
                  width="18"
                  height="18"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M13.5 21v-8.2h2.8l.4-3.2h-3.2V7.5c0-.9.3-1.6 1.6-1.6h1.7V3.1c-.3 0-1.4-.1-2.6-.1-2.6 0-4.4 1.6-4.4 4.5v2.1H7v3.2h2.8V21h3.7Z" />
                </svg>
              </a>

              {/* New X logo */}
              <a
                href="https://x.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-gray-300 transition-all hover:border-[#b9e769] hover:bg-[#b9e769] hover:text-[#102b25]"
              >
                <svg
                  viewBox="0 0 24 24"
                  width="18"
                  height="18"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M18.9 2H22l-6.78 7.75L23.2 22h-6.25l-4.9-7.4L5.58 22H2.44l7.25-8.29L1.8 2h6.4l4.43 6.77L18.9 2Zm-1.1 18h1.73L7.27 3.89H5.42L17.8 20Z" />
                </svg>
              </a>

              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-gray-300 transition-all hover:border-[#b9e769] hover:bg-[#b9e769] hover:text-[#102b25]"
              >
                <svg
                  viewBox="0 0 24 24"
                  width="18"
                  height="18"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <rect x="3" y="3" width="18" height="18" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r=".5" fill="currentColor" />
                </svg>
              </a>

              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-gray-300 transition-all hover:border-[#b9e769] hover:bg-[#b9e769] hover:text-[#102b25]"
              >
                <svg
                  viewBox="0 0 24 24"
                  width="18"
                  height="18"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14ZM8.34 18V9.7H5.57V18h2.77ZM6.96 8.57a1.61 1.61 0 1 0 0-3.22 1.61 1.61 0 0 0 0 3.22ZM18.43 18v-4.55c0-2.44-1.3-3.58-3.03-3.58a2.61 2.61 0 0 0-2.35 1.3V9.7h-2.77V18h2.77v-4.1c0-1.08.2-2.12 1.54-2.12 1.32 0 1.34 1.23 1.34 2.19V18h2.5Z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="mb-6 text-lg font-bold text-white">
              Quick Links
            </h3>

            <ul className="space-y-4">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="group inline-flex items-center gap-2 text-sm text-gray-300 transition-colors hover:text-[#b9e769]"
                  >
                    <ArrowUpRight
                      size={15}
                      className="text-[#b9e769] opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100"
                    />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="mb-6 text-lg font-bold text-white">
              Popular Categories
            </h3>

            <ul className="space-y-4">
              {categories.map((category) => (
                <li key={category.name}>
                  <Link
                    href={category.href}
                    className="group inline-flex items-center gap-2 text-sm text-gray-300 transition-colors hover:text-[#b9e769]"
                  >
                    <ArrowUpRight
                      size={15}
                      className="text-[#b9e769] opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100"
                    />
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-6 text-lg font-bold text-white">
              Get In Touch
            </h3>

            <ul className="space-y-5">
              <li className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-[#b9e769]">
                  <Mail size={18} />
                </div>
                <div>
                  <p className="text-xs text-gray-400">Email us</p>
                  <a
                    href="mailto:support@fixmate.com"
                    className="mt-1 block break-all text-sm text-gray-200 transition-colors hover:text-[#b9e769]"
                  >
                    support@fixmate.com
                  </a>
                </div>
              </li>

              <li className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-[#b9e769]">
                  <Phone size={18} />
                </div>
                <div>
                  <p className="text-xs text-gray-400">Call us</p>
                  <a
                    href="tel:+8801XXXXXXXXX"
                    className="mt-1 block text-sm text-gray-200 transition-colors hover:text-[#b9e769]"
                  >
                    +880 1XXXXXXXXX
                  </a>
                </div>
              </li>

              <li className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-[#b9e769]">
                  <MapPin size={18} />
                </div>
                <div>
                  <p className="text-xs text-gray-400">Our location</p>
                  <p className="mt-1 text-sm leading-6 text-gray-200">
                    Bangladesh
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright section */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-white/10 py-6 text-center sm:flex-row sm:text-left">
          <p className="text-sm text-gray-400">
            © 2026 FixMate. All rights reserved.
          </p>

          <p className="flex items-center gap-1.5 text-sm text-gray-400">
            Made with
            <Heart size={15} className="fill-[#b9e769] text-[#b9e769]" />
            for better repairs.
          </p>
        </div>
      </div>
    </footer>
  );
}
