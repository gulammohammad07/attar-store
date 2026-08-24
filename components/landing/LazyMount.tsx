"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

type LazyMountProps = {
  children: ReactNode;
  fallback: ReactNode;
  className?: string;
};

export default function LazyMount({
  children,
  fallback,
  className,
}: LazyMountProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (typeof IntersectionObserver === "undefined") {
      let raf = 0;
      raf = requestAnimationFrame(() => setShow(true));
      return () => cancelAnimationFrame(raf);
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setShow(true);
            io.disconnect();
            break;
          }
        }
      },
      { rootMargin: "900px 0px" },
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className={className}>
      {show ? children : fallback}
    </div>
  );
}
