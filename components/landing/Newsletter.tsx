"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Send } from "lucide-react";
import { toast } from "sonner";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitted(true);
    toast.success("Welcome to the inner circle");
  };

  return (
    <section className="relative overflow-hidden bg-charcoal py-24 text-[#f0ebe2]">
      <div className="absolute -left-32 top-0 h-[300px] w-[300px] rounded-full bg-gold/15 blur-[120px]" />
      <div className="absolute -right-32 bottom-0 h-[300px] w-[300px] rounded-full bg-[#8a6b3d]/20 blur-[120px]" />

      <div className="relative mx-auto max-w-3xl px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-gold/40 bg-gold/10">
            <Mail size={22} className="text-gold" />
          </div>

          <h2 className="mt-6 font-display text-4xl font-medium sm:text-5xl">
            Join the <span className="gold-gradient-text italic">Inner Circle</span>
          </h2>

          <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-[#f0ebe2]/60">
            Early access to limited drops, private sales and fragrance notes
            from the atelier. One elegant email a week.
          </p>

          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mx-auto mt-8 max-w-md rounded-2xl border border-gold/30 bg-gold/10 p-6"
            >
              <p className="font-display text-xl">Welcome, connoisseur. ✦</p>
              <p className="mt-2 text-sm text-[#f0ebe2]/60">
                Your first private drop is on its way.
              </p>
            </motion.div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row"
            >
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                className="flex-1 rounded-full border border-white/15 bg-white/5 px-6 py-3.5 text-sm text-[#f0ebe2] placeholder:text-[#f0ebe2]/40 focus:border-gold focus:outline-none"
              />
              <button
                type="submit"
                className="flex items-center justify-center gap-2 rounded-full bg-gold px-7 py-3.5 text-sm font-semibold text-white transition-transform hover:scale-105"
              >
                Subscribe
                <Send size={15} />
              </button>
            </form>
          )}

          <p className="mt-4 text-[11px] tracking-wide text-[#f0ebe2]/35">
            No spam. Unsubscribe anytime.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
