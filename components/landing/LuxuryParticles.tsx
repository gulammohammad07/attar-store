"use client";

import { motion } from "framer-motion";

const particles = [
  { top: "15%", left: "10%", size: 6, delay: 0, duration: 9 },
  { top: "25%", left: "85%", size: 4, delay: 1.2, duration: 11 },
  { top: "55%", left: "8%", size: 5, delay: 2.4, duration: 10 },
  { top: "70%", left: "78%", size: 7, delay: 0.6, duration: 12 },
  { top: "40%", left: "55%", size: 3, delay: 1.8, duration: 8 },
  { top: "80%", left: "35%", size: 5, delay: 3, duration: 13 },
  { top: "12%", left: "45%", size: 4, delay: 2.1, duration: 9 },
  { top: "88%", left: "92%", size: 6, delay: 1.5, duration: 10 },
  { top: "60%", left: "20%", size: 3, delay: 3.4, duration: 11 },
  { top: "30%", left: "70%", size: 5, delay: 0.9, duration: 12 },
];

export default function LuxuryParticles() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {particles.map((p, i) => (
        <motion.span
          key={i}
          className="absolute rounded-full"
          style={{
            top: p.top,
            left: p.left,
            width: p.size,
            height: p.size,
            background:
              "radial-gradient(circle, rgba(212,185,138,0.9) 0%, rgba(212,185,138,0) 70%)",
            filter: "blur(0.5px)",
          }}
          animate={{
            y: [0, -40, 0],
            opacity: [0.2, 0.8, 0.2],
            scale: [1, 1.4, 1],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
