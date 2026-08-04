"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Package, User as UserIcon } from "lucide-react";

export default function AccountPage() {
  const [mode, setMode] = useState<"login" | "signup">("login");

  return (
    <div className="flex min-h-[80vh] items-center justify-center bg-[#F7F3EC] px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="rounded-3xl border border-[#1c1712]/10 bg-white p-8 shadow-xl sm:p-10">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#1c1712]">
            <UserIcon size={22} className="text-gold" />
          </div>

          <h1 className="mt-6 text-center font-display text-3xl font-medium text-[#1c1712]">
            {mode === "login" ? "Welcome Back" : "Create Account"}
          </h1>
          <p className="mt-2 text-center text-sm text-[#1c1712]/45">
            {mode === "login"
              ? "Sign in to track orders and manage your wishlist."
              : "Join the inner circle of fragrance connoisseurs."}
          </p>

          {/* Mode switch */}
          <div className="mt-6 flex rounded-full bg-[#F7F3EC] p-1">
            {(["login", "signup"] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMode(m)}
                className={`flex-1 rounded-full py-2.5 text-sm font-medium transition-all ${
                  mode === m
                    ? "bg-[#1c1712] text-white shadow"
                    : "text-[#1c1712]/60"
                }`}
              >
                {m === "login" ? "Sign In" : "Sign Up"}
              </button>
            ))}
          </div>

          <form
            className="mt-8 space-y-4"
            onSubmit={(e) => e.preventDefault()}
          >
            {mode === "signup" && (
              <input
                required
                type="text"
                placeholder="Full name"
                className="w-full rounded-xl border border-[#1c1712]/15 px-4 py-3 text-sm focus:border-gold focus:outline-none"
              />
            )}
            <input
              required
              type="email"
              placeholder="Email"
              className="w-full rounded-xl border border-[#1c1712]/15 px-4 py-3 text-sm focus:border-gold focus:outline-none"
            />
            <input
              required
              type="password"
              placeholder="Password"
              className="w-full rounded-xl border border-[#1c1712]/15 px-4 py-3 text-sm focus:border-gold focus:outline-none"
            />

            <button
              type="submit"
              className="w-full rounded-full bg-[#1c1712] py-3.5 text-sm font-semibold text-white transition-colors hover:bg-gold"
            >
              {mode === "login" ? "Sign In" : "Create Account"}
            </button>
          </form>

          <p className="mt-6 text-center text-xs leading-relaxed text-[#1c1712]/45">
            Authentication will be enabled in the next milestone. In the
            meantime, explore{" "}
            <Link href="/shop" className="text-gold hover:underline">
              the collection
            </Link>
            .
          </p>
        </div>

        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-[#1c1712]/45">
          <Package size={14} className="text-gold" />
          Order tracking will appear here after your first purchase.
        </div>
      </motion.div>
    </div>
  );
}
