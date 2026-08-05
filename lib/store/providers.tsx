"use client";

import type { ReactNode } from "react";
import { MotionConfig } from "framer-motion";
import { CartProvider } from "@/lib/store/cart-context";
import { WishlistProvider } from "@/lib/store/wishlist-context";
import { AuthProvider } from "@/lib/store/auth-context";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <AuthProvider>
        <WishlistProvider>
          <CartProvider>{children}</CartProvider>
        </WishlistProvider>
      </AuthProvider>
    </MotionConfig>
  );
}
