"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, m as motion, useMotionValue, useSpring } from "framer-motion";
import { ChevronLeft, ChevronRight, Eye, Heart, ShoppingBag, Star } from "lucide-react";
import type { Product } from "@/lib/data/products";
import { useWishlist } from "@/lib/store/wishlist-context";
import { useCart } from "@/lib/store/cart-context";
import { cn, formatPrice } from "@/lib/utils";
import QuickViewModal from "@/components/product/QuickViewModal";
import { toast } from "sonner";

export default function ProductCard({
  product,
  className,
  loading = "lazy",
}: {
  product: Product;
  className?: string;
  loading?: "lazy" | "eager";
}) {
  const { isWishlisted, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [quickViewOpen, setQuickViewOpen] = useState(false);
  const [imgIndex, setImgIndex] = useState(0);

  const images = product.gallery.length ? product.gallery : [product.image];
  const hasMultiple = images.length > 1;

  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setImgIndex((i) => (i - 1 + images.length) % images.length);
  };

  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setImgIndex((i) => (i + 1) % images.length);
  };

  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotateX = useSpring(my, { stiffness: 200, damping: 18 });
  const rotateY = useSpring(mx, { stiffness: 200, damping: 18 });

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mx.set(x * 10);
    my.set(-y * 10);
  };

  const reset = () => {
    mx.set(0);
    my.set(0);
  };

  const wished = isWishlisted(product.id);
  const price = product.salePrice ?? product.price;
  const discount = product.salePrice
    ? Math.round(((product.price - product.salePrice) / product.price) * 100)
    : 0;

  return (
    <>
      <motion.div
        ref={ref}
        onMouseMove={handleMove}
        onMouseLeave={reset}
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d", perspective: 800 }}
        className={cn("group relative", className)}
      >
        <div className="relative overflow-hidden rounded-3xl bg-white shadow-sm transition-shadow duration-500 group-hover:shadow-2xl">
          {/* Badge */}
          {product.badge && (
            <span
              className={cn(
                "absolute left-4 top-4 z-10 rounded-full px-3 py-1 text-[10px] font-bold tracking-[0.14em] uppercase",
                product.badge === "Sale"
                  ? "bg-red-600 text-white"
                  : product.badge === "Limited Edition"
                    ? "bg-[#174A63] text-gold"
                    : "bg-gold text-white",
              )}
            >
              {product.badge}
            </span>
          )}

          {discount > 0 && product.badge !== "Sale" && (
            <span className="absolute right-4 top-4 z-10 rounded-full bg-white/90 px-3 py-1 text-[10px] font-bold text-red-600 backdrop-blur">
              -{discount}%
            </span>
          )}

          {/* Actions */}
          <div className="absolute right-4 top-14 z-10 flex flex-col gap-2">
            <button
              type="button"
              onClick={() => toggleWishlist(product)}
              aria-label="Add to wishlist"
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow backdrop-blur transition-all hover:scale-110",
                wished ? "text-red-500" : "text-[#174A63]/50 hover:text-red-500",
              )}
            >
              <Heart size={16} fill={wished ? "currentColor" : "none"} />
            </button>

            <button
              type="button"
              onClick={() => setQuickViewOpen(true)}
              aria-label="Quick view"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow backdrop-blur transition-all hover:scale-110"
            >
              <Eye size={16} className="text-[#174A63]/50" />
            </button>
          </div>

          {/* Image */}
          <div className="relative h-72 w-full overflow-hidden bg-[#EFF8FC]">
            <Link
              href={`/product/${product.slug}`}
              className="block h-full w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <AnimatePresence initial={false}>
                <motion.div
                  key={imgIndex}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="absolute inset-0"
                >
                  <Image
                    src={images[imgIndex]}
                    alt={product.name}
                    fill
                    loading={loading}
                    sizes="(max-width: 768px) 100vw, 300px"
                    className="object-contain p-8 transition-transform duration-700 ease-out group-hover:scale-110"
                  />
                </motion.div>
              </AnimatePresence>
            </Link>

            {hasMultiple && (
              <>
                <button
                  type="button"
                  onClick={prevImage}
                  aria-label="Previous image"
                  className="absolute left-2 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[#174A63]/70 shadow-md backdrop-blur transition-all hover:scale-110 hover:text-[#174A63]"
                >
                  <ChevronLeft size={16} />
                </button>

                <button
                  type="button"
                  onClick={nextImage}
                  aria-label="Next image"
                  className="absolute right-2 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[#174A63]/70 shadow-md backdrop-blur transition-all hover:scale-110 hover:text-[#174A63]"
                >
                  <ChevronRight size={16} />
                </button>

                <div className="absolute inset-x-0 bottom-2 z-10 flex items-center justify-center gap-1.5">
                  {images.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setImgIndex(i);
                      }}
                      aria-label={`View image ${i + 1}`}
                      className={cn(
                        "h-1.5 rounded-full transition-all duration-300",
                        i === imgIndex
                          ? "w-4 bg-gold"
                          : "w-1.5 bg-white/80 hover:bg-gold/70",
                      )}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Info */}
          <div className="p-5">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-semibold tracking-[0.18em] text-gold uppercase">
                {product.brand}
              </p>
              <div className="flex items-center gap-1 text-xs">
                <Star size={12} className="fill-gold text-gold" />
                <span className="font-medium text-[#174A63]">
                  {product.rating}
                </span>
                <span className="text-[#174A63]/40">
                  ({product.reviewCount})
                </span>
              </div>
            </div>

            <Link href={`/product/${product.slug}`} className="mt-1 block">
              <h3 className="font-display text-xl font-semibold text-[#174A63] transition-colors group-hover:text-gold">
                {product.name}
              </h3>
            </Link>

            <p className="mt-1 text-xs text-[#174A63]/45">
              {product.volume} • {product.category}
            </p>

            <div className="mt-3 flex items-center gap-2">
              <span className="text-lg font-semibold text-[#174A63]">
                {formatPrice(price)}
              </span>
              {product.salePrice && (
                <span className="text-sm text-[#174A63]/35 line-through">
                  {formatPrice(product.price)}
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={() => {
                addToCart(product);
                toast.success(`${product.name} added to bag`);
              }}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-[#174A63] py-3 text-sm font-medium text-white transition-all hover:bg-gold"
            >
              <ShoppingBag size={16} />
              Add to Bag
            </button>
          </div>
        </div>
      </motion.div>

      <QuickViewModal
        key={`${product.id}-${quickViewOpen}`}
        product={product}
        open={quickViewOpen}
        onClose={() => setQuickViewOpen(false)}
      />
    </>
  );
}
