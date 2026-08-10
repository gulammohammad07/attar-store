"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { m as motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";

type AuthShellProps = {
  children: ReactNode;
  title: string;
  subtitle: string;
  eyebrow?: string;
};

export function AuthShell({ children, title, subtitle, eyebrow }: AuthShellProps) {
  return (
    <div className="grid min-h-screen bg-cream lg:grid-cols-[1.05fr_1fr]">
      {/* Brand panel (desktop) */}
      <div className="relative hidden overflow-hidden bg-charcoal lg:block">
        <div className="absolute inset-0 bg-gradient-to-br from-charcoal via-[#0F2838] to-[#174A63]" />
        <div className="absolute -top-40 -right-40 h-[34rem] w-[34rem] rounded-full bg-gold/15 blur-3xl" />
        <div className="absolute bottom-[-10rem] left-[-8rem] h-[26rem] w-[26rem] rounded-full bg-gold/10 blur-3xl" />
        <div className="noise absolute inset-0 opacity-40" />

        <div className="relative z-10 flex h-full flex-col justify-between p-12 xl:p-16">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[#F8FCFE]/70 transition-colors hover:text-gold-light"
          >
            <ArrowLeft size={16} />
            <span className="text-xs font-medium tracking-[0.18em] uppercase">
              Back to the boutique
            </span>
          </Link>

          <div>
            <span className="font-display text-2xl font-semibold tracking-[0.18em] text-[#F8FCFE]">
              MD<span className="text-gold"> PERFUMES</span>
            </span>
            <h2 className="mt-10 max-w-md font-display text-5xl leading-[1.05] font-medium text-[#F8FCFE] xl:text-6xl">
              The art of <span className="gold-gradient-text">oriental fragrance</span>
            </h2>
            <p className="mt-6 max-w-sm text-[15px] leading-relaxed text-[#F8FCFE]/55">
              Sign in to track your orders, manage your wishlist and unlock
              member-only offers across our curated collection of luxury attars
              and ouds.
            </p>

            <ul className="mt-12 space-y-4">
              {[
                "Order tracking & purchase history",
                "Faster checkout & saved details",
                "Early access to new arrivals",
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-3 text-sm text-[#F8FCFE]/75"
                >
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gold/15">
                    <span className="h-1.5 w-1.5 rounded-full bg-gold" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <p className="text-xs tracking-[0.2em] text-[#F8FCFE]/30 uppercase">
            Hand-crafted · Limited editions · Worldwide shipping
          </p>
        </div>
      </div>

      {/* Form panel */}
      <div className="relative flex min-h-screen items-center justify-center px-4 py-14 sm:px-8">
        <div className="noise pointer-events-none absolute inset-0 opacity-[0.35]" />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 w-full max-w-md"
        >
          {/* Mobile brand */}
          <div className="mb-8 flex items-center justify-between lg:hidden">
            <Link
              href="/"
              className="font-display text-xl font-semibold tracking-[0.18em] text-ink"
            >
              MD<span className="text-gold"> PERFUMES</span>
            </Link>
            <Link
              href="/"
              className="text-xs font-medium tracking-[0.14em] text-ink/50 uppercase transition-colors hover:text-gold"
            >
              Shop
            </Link>
          </div>

          <div className="overflow-hidden rounded-3xl border border-ink/8 bg-white shadow-[0_30px_80px_-30px_rgb(28_23_18/0.35)]">
            <div className="h-1.5 w-full bg-gradient-to-r from-gold via-gold-light to-gold" />

            <div className="p-7 sm:p-10">
              {eyebrow ? (
                <p className="text-[11px] font-semibold tracking-[0.24em] text-gold uppercase">
                  {eyebrow}
                </p>
              ) : null}

              <h1 className="mt-3 font-display text-4xl font-medium text-ink">
                {title}
              </h1>
              <p className="mt-2 text-sm leading-relaxed text-ink/45">
                {subtitle}
              </p>

              <div className="mt-8">{children}</div>
            </div>
          </div>

          <p className="mt-6 text-center text-xs leading-relaxed text-ink/40">
            By continuing, you agree to MD Perfumes&apos; terms of service and
            privacy policy.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
