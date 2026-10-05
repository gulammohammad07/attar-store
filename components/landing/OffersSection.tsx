import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import type { StorefrontAnnouncement } from "@/lib/services/storefront-data";

/**
 * Homepage "Offers & New Launches" section — driven entirely by the
 * announcements the store manages from the admin panel. Renders nothing
 * while there are no active announcements.
 */
export default function OffersSection({
  announcements,
}: {
  announcements: StorefrontAnnouncement[];
}) {
  if (announcements.length === 0) return null;

  return (
    <section className="bg-[#0f2838] py-14 sm:py-16">
      <div className="mx-auto max-w-7xl px-6">
        <div>
          <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-gold">
            <Sparkles size={14} /> Fresh from the house
          </p>
          <h2 className="mt-2 font-display text-3xl font-semibold text-[#F8FCFE] sm:text-4xl">
            Offers &amp; New Launches
          </h2>
          <p className="mt-2 max-w-xl text-sm text-[#F8FCFE]/60">
            Limited-time deals, sales and brand-new launches — straight from
            Danish Perfumes.
          </p>
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-[repeat(auto-fit,minmax(280px,1fr))]">
          {announcements.map((announcement) => {
            const href = announcement.linkUrl?.trim() || "/shop";
            return (
              <Link
                key={announcement.id}
                href={href}
                className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/[0.08] bg-[#112d3d] p-6 transition-all duration-300 hover:border-gold/40 hover:shadow-[0_18px_40px_-18px_rgba(0,0,0,0.5)]"
              >
                {announcement.badge && (
                  <span className="mb-4 inline-flex w-fit items-center rounded-full bg-gold/15 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-gold">
                    {announcement.badge}
                  </span>
                )}

                {announcement.imageUrl && (
                  <div className="relative mb-4 aspect-[16/9] w-full overflow-hidden rounded-xl bg-[#0a1b26]">
                    <Image
                      src={announcement.imageUrl}
                      alt={announcement.title}
                      fill
                      sizes="(max-width: 640px) 100vw, 400px"
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                  </div>
                )}

                <h3 className="font-display text-xl font-semibold text-[#F8FCFE]">
                  {announcement.title}
                </h3>
                {announcement.description && (
                  <p className="mt-2 line-clamp-3 text-sm text-[#F8FCFE]/60">
                    {announcement.description}
                  </p>
                )}

                <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.14em] text-gold">
                  Explore
                  <ArrowRight
                    size={13}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
