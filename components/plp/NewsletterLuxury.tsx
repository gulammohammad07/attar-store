"use client";

import { useState } from "react";
import { m as motion } from "framer-motion";
import { Send, Sparkles } from "lucide-react";
import { toast } from "sonner";

export default function NewsletterLuxury() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitted(true);
    toast.success("Welcome to the inner circle");
  };

  return (
    <section className="bg-[#E3F2F9] px-6 pb-28">
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7 }}
        className="relative mx-auto max-w-5xl overflow-hidden rounded-[2.5rem] border border-gold/25 bg-[#EDF7FB] shadow-[0_40px_90px_-40px_rgba(23,74,99,0.35)]"
      >
        {/* Marble texture */}
        <div
          aria-hidden
          className="absolute inset-0 opacity-70"
          style={{
            background:
              "radial-gradient(ellipse 90% 60% at 20% 0%, rgba(255,255,255,0.9), transparent 60%), radial-gradient(ellipse 70% 50% at 85% 15%, rgba(220,201,160,0.28), transparent 65%), radial-gradient(ellipse 60% 55% at 60% 110%, rgba(201,169,110,0.18), transparent 60%), repeating-linear-gradient(100deg, rgba(220,201,160,0.05) 0 3px, transparent 3px 12px), repeating-linear-gradient(12deg, rgba(255,255,255,0.25) 0 2px, transparent 2px 9px)",
          }}
        />
        <div className="absolute -left-20 -top-20 h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(224,199,149,0.4),transparent_70%)]" />
        <div className="absolute -bottom-24 -right-16 h-64 w-64 rounded-full bg-[radial-gradient(circle,rgba(220,201,160,0.35),transparent_70%)]" />

        {/* Floating gold specks */}
        {[
          { top: "18%", left: "10%", delay: 0, size: 5 },
          { top: "70%", left: "16%", delay: 1.4, size: 4 },
          { top: "26%", left: "86%", delay: 0.8, size: 5 },
          { top: "64%", left: "80%", delay: 2.1, size: 4 },
        ].map((dot, i) => (
          <motion.span
            key={i}
            className="pointer-events-none absolute rounded-full"
            style={{
              top: dot.top,
              left: dot.left,
              width: dot.size,
              height: dot.size,
              background:
                "radial-gradient(circle, rgba(201,169,110,0.9), rgba(201,169,110,0))",
            }}
            animate={{ y: [0, -22, 0], opacity: [0.25, 0.8, 0.25] }}
            transition={{
              duration: 7,
              delay: dot.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}

        <div className="relative px-6 py-16 text-center sm:px-16 sm:py-20">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-gold/40 bg-white/70 shadow-[0_0_36px_rgba(201,169,110,0.35)] backdrop-blur-md">
            <Sparkles size={20} className="text-gold" />
          </div>

          <p className="mt-7 text-[11px] font-semibold tracking-[0.34em] text-gold uppercase">
            The Inner Circle
          </p>
          <h2 className="mt-4 font-display text-4xl font-medium text-[#174A63] sm:text-6xl">
            Elegance,{" "}
            <span className="gold-gradient-text animate-shine italic motion-reduce:animate-none">
              delivered
            </span>
          </h2>
          <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-[#174A63]/55">
            Early access to limited drops and private notes from the atelier.
            One elegant letter, weekly.
          </p>

          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mx-auto mt-10 max-w-md rounded-2xl border border-gold/30 bg-white/70 p-8 shadow-lg backdrop-blur-md"
            >
              <p className="font-display text-2xl font-medium text-[#174A63]">
                Welcome, connoisseur. ✦
              </p>
              <p className="mt-2 text-sm text-[#174A63]/55">
                Your first private drop is on its way.
              </p>
            </motion.div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="mx-auto mt-10 flex max-w-md flex-col gap-3 sm:flex-row"
            >
              <div className="relative flex-1">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  className="w-full rounded-full border border-gold/30 bg-white/70 px-6 py-4 text-sm text-[#174A63] placeholder:text-[#174A63]/35 shadow-[inset_0_1px_3px_rgba(23,74,99,0.06)] backdrop-blur-md transition-all focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/25"
                />
              </div>
              <button
                type="submit"
                className="group flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#A18758] via-gold to-[#E0C795] px-8 py-4 text-sm font-semibold text-white shadow-[0_10px_36px_-12px_rgba(201,169,110,0.8)] transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_12px_44px_-8px_rgba(201,169,110,0.9)]"
              >
                Join
                <Send
                  size={14}
                  className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </button>
            </form>
          )}

          <p className="mt-6 text-[11px] tracking-wide text-[#174A63]/35">
            No noise. Unsubscribe anytime.
          </p>
        </div>
      </motion.div>
    </section>
  );
}
