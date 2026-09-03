"use client";

import Link from "next/link";
import { getImageProps } from "next/image";
import { ArrowRight } from "lucide-react";
import { useState } from "react";

type HeroBanner = {
  title: string | null;
  subtitle: string | null;
  description: string | null;
  desktopImageUrl: string;
  tabletImageUrl: string | null;
  mobileImageUrl: string | null;
};

export default function Hero({ banner }: { banner?: HeroBanner }) {
  const [imgError, setImgError] = useState(false);

  const fallbackImage =
    banner?.desktopImageUrl ??
    banner?.tabletImageUrl ??
    banner?.mobileImageUrl ??
    "";

  const showImage = Boolean(fallbackImage) && !imgError;

  /**
   * Art direction WITH optimisation. Each breakpoint gets its own uploaded
   * asset, but every variant is routed through Next's image optimiser
   * (AVIF/WebP + width variants) via getImageProps. Putting a raw <source>
   * next to a <next/image> instead makes the browser serve the unoptimised
   * original on mobile *and* discard the preloaded desktop file — two
   * downloads, neither of them fast.
   */
  const shared = {
    alt: banner?.title
      ? `${banner.title} — Danish Perfumes`
      : "Danish Perfumes attar collection",
    sizes: "100vw",
    quality: 75,
    priority: true,
    // This image is the LCP candidate; make sure the browser starts it at
    // high priority even when the markup is parsed late in the body.
    loading: "eager" as const,
    fetchPriority: "high" as const,
  };

  const desktop = showImage
    ? getImageProps({ ...shared, src: fallbackImage, width: 1920, height: 1080 })
    : null;

  const tablet =
    showImage && banner?.tabletImageUrl
      ? getImageProps({
          ...shared,
          src: banner.tabletImageUrl,
          width: 1024,
          height: 1366,
        })
      : null;

  const mobile =
    showImage && banner?.mobileImageUrl
      ? getImageProps({
          ...shared,
          src: banner.mobileImageUrl,
          width: 828,
          height: 1472,
        })
      : null;

  // Mutually exclusive media queries, reused for both <source> and the
  // preload hints so the browser only ever fetches one hero image.
  const variants = [
    mobile ? { media: "(max-width: 767px)", srcSet: mobile.props.srcSet } : null,
    tablet
      ? {
          media: "(min-width: 768px) and (max-width: 1023px)",
          srcSet: tablet.props.srcSet,
        }
      : null,
  ].filter((v): v is { media: string; srcSet: string } => Boolean(v?.srcSet));

  const desktopMedia = tablet
    ? "(min-width: 1024px)"
    : mobile
      ? "(min-width: 768px)"
      : undefined;

  return (
    <section className="relative flex min-h-[100svh] items-center overflow-hidden bg-[#0a1b26]">
      {desktop ? (
        <>
          {variants.map((v) => (
            <link
              key={v.media}
              rel="preload"
              as="image"
              imageSrcSet={v.srcSet}
              imageSizes="100vw"
              media={v.media}
            />
          ))}
          {desktop.props.srcSet && (
            <link
              rel="preload"
              as="image"
              imageSrcSet={desktop.props.srcSet}
              imageSizes="100vw"
              media={desktopMedia}
            />
          )}

          <div className="absolute inset-0">
            <picture>
              {variants.map((v) => (
                <source
                  key={v.media}
                  media={v.media}
                  srcSet={v.srcSet}
                  sizes="100vw"
                />
              ))}
              {/* eslint-disable-next-line jsx-a11y/alt-text */}
              <img
                {...desktop.props}
                className="absolute inset-0 h-full w-full object-cover"
                onError={() => setImgError(true)}
              />
            </picture>

            {/* Scrim so the white headline stays legible over any banner the
                admin uploads, however light it happens to be. */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a1b26]/90 via-[#0a1b26]/65 to-[#0a1b26]/45" />
          </div>
        </>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a1b26] via-[#123246] to-[#174A63]" />
      )}

      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/4 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(201,169,110,0.18),transparent_70%)]" />
        <div className="absolute left-1/4 bottom-1/4 h-[400px] w-[400px] rounded-full bg-[radial-gradient(circle,rgba(142,201,232,0.12),transparent_70%)]" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 py-28 text-center lg:py-32">
        {/* CSS animation, not framer-motion, on purpose. The <h1> here is the
            LCP element on mobile; a JS-driven initial={{ opacity: 0 }} keeps it
            unpaintable until the motion bundle hydrates, which cost us over a
            second of LCP on a throttled connection. */}
        <div className="animate-rise-in">
          {banner?.subtitle && (
            <p className="text-[11px] font-semibold tracking-[0.4em] text-gold uppercase">
              {banner.subtitle}
            </p>
          )}

          {banner?.title && (
            <h1 className="mt-8 font-display text-[3.2rem] font-medium leading-[0.98] tracking-tight text-[#fff] sm:text-7xl lg:text-[7.5rem]">
              {banner.title}
            </h1>
          )}

          {banner?.description && (
            <p className="mx-auto mt-8 max-w-xl text-base leading-relaxed text-[#dceff7]/90 sm:text-lg">
              {banner.description}
            </p>
          )}

          <div className="mt-12 flex flex-col items-center justify-center gap-5">
            {/* /shop pulls a heavy route chunk — don't let the viewport
                prefetch it inside the LCP/load window. */}
            <Link
              href="/shop"
              prefetch={false}
              className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-gradient-to-r from-[#c9a96e] via-[#e2cc9c] to-[#c9a96e] px-10 py-4.5 text-sm font-semibold tracking-[0.15em] text-[#0a1b26] shadow-[0_0_60px_rgba(201,169,110,0.35)] transition-all duration-700 hover:shadow-[0_0_80px_rgba(201,169,110,0.5)] hover:scale-[1.04]"
            >
              <span className="relative z-10 flex items-center gap-2.5">
                Explore Collection
                <ArrowRight
                  size={16}
                  className="transition-transform duration-500 group-hover:translate-x-1.5"
                />
              </span>
              <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />
            </Link>

            <Link
              href="/shop"
              prefetch={false}
              className="inline-flex min-h-12 items-center gap-2 rounded-full border border-[#174A63]/20 bg-[#fff] px-7 py-3.5 text-[11px] font-semibold tracking-[0.25em] text-[#174A63] uppercase transition-colors duration-500 hover:border-gold/60 hover:text-[#0a1b26]"
            >
              View All Fragrances
            </Link>
          </div>
        </div>
      </div>

      <div className="animate-fade-in-slow absolute bottom-10 left-1/2 -translate-x-1/2">
        <div className="flex h-10 w-6 items-start justify-center rounded-full border border-[#e0ecf2]">
          <div className="animate-scroll-hint mt-2 h-2 w-1 rounded-full bg-gold" />
        </div>
      </div>
    </section>
  );
}
