"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import { useWishlist } from "@/lib/store/wishlist-context";
import ProductCard from "@/components/product/ProductCard";

export default function WishlistPage() {
  const { items } = useWishlist();

  return (
    <div className="min-h-screen bg-[#F8FCFE] py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="text-center">
          <p className="text-[11px] font-semibold tracking-[0.3em] text-gold uppercase">
            Saved for Later
          </p>
          <h1 className="mt-3 font-display text-5xl font-medium text-[#174A63]">
            Your Wishlist
          </h1>
        </div>

        {items.length === 0 ? (
          <div className="mt-16 flex flex-col items-center gap-6 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#174A63]/5">
              <Heart size={32} className="text-[#174A63]/30" />
            </div>
            <p className="font-display text-2xl text-[#174A63]">
              Nothing saved yet
            </p>
            <p className="max-w-sm text-sm text-[#174A63]/50">
              Tap the heart on any fragrance to build your personal collection
              here.
            </p>
            <Link
              href="/shop"
              className="rounded-full bg-[#174A63] px-8 py-4 text-sm font-semibold text-white transition-colors hover:bg-gold"
            >
              Explore Attars
            </Link>
          </div>
        ) : (
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {items.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
