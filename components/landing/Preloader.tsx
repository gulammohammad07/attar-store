"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Preloader() {
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let value = 0;
    const id = setInterval(() => {
      value += 14 + Math.random() * 16;
      if (value >= 100) {
        value = 100;
        clearInterval(id);
        window.setTimeout(() => setDone(true), 500);
      }
      setProgress(Math.floor(value));
    }, 150);
    return () => clearInterval(id);
  }, []);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          exit={{ y: "-100%" }}
          transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#0a0908]"
        >
          <div className="noise absolute inset-0 opacity-40" />

          <motion.div
            initial={{ opacity: 0, scale: 0.85, filter: "blur(10px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <span className="gold-gradient-text font-display text-7xl font-semibold tracking-[0.18em]">
              MD
            </span>
            <motion.span
              animate={{ x: ["-110%", "220%"] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-y-0 w-1/2 bg-gradient-to-r from-transparent via-white/25 to-transparent"
            />
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-4 text-[10px] font-semibold tracking-[0.55em] text-[#f0ebe2]/45 uppercase"
          >
            Perfumes
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-2 text-[9px] tracking-[0.35em] text-gold/70 uppercase"
          >
            The Art of Oriental Fragrance
          </motion.p>

          <div className="relative mt-10 h-px w-56 overflow-hidden rounded-full bg-white/10">
            <motion.div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#8a6b3d] via-gold to-gold-light"
              style={{ width: `${progress}%` }}
            />
          </div>

          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4 font-mono text-xs tracking-[0.3em] text-gold"
          >
            {progress}%
          </motion.span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
