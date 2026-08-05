"use client";

import type { ReactNode } from "react";
import { MotionConfig } from "framer-motion";
import { CartProvider } from "@/lib/store/cart-context";
import { WishlistProvider } from "@/lib/store/wishlist-context";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <WishlistProvider>
        <CartProvider>{children}</CartProvider>
      </WishlistProvider>
    </MotionConfig>
  );
}
