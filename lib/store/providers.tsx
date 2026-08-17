"use client";

import type { ReactNode } from "react";
import { LazyMotion, MotionConfig } from "framer-motion";
import { CartProvider } from "@/lib/store/cart-context";
import { WishlistProvider } from "@/lib/store/wishlist-context";
import { AuthProvider } from "@/lib/store/auth-context";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <LazyMotion
        features={() =>
          import("@/lib/store/motion-features").then((module) => module.default)
        }
        strict
      >
        <AuthProvider>
          <WishlistProvider>
            <CartProvider>{children}</CartProvider>
          </WishlistProvider>
        </AuthProvider>
      </LazyMotion>
    </MotionConfig>
  );
}
