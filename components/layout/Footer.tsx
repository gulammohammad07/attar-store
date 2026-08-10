import Link from "next/link";
import { ShieldCheck, Truck, BadgeCheck } from "lucide-react";
import {
  InstagramIcon,
  FacebookIcon,
  XIcon,
  YoutubeIcon,
} from "@/components/layout/SocialIcons";

const columns = [
  {
    title: "Shop",
    links: [
      { label: "All Attars", href: "/shop" },
      { label: "Oud Collection", href: "/shop?category=oud" },
      { label: "Musk", href: "/shop?category=musk" },
      { label: "Rose", href: "/shop?category=rose" },
      { label: "Amber", href: "/shop?category=amber" },
      { label: "Gift Sets", href: "/shop?category=gourmand" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Our Story", href: "/#story" },
      { label: "Craftsmanship", href: "/#craft" },
      { label: "Journal", href: "/#journal" },
      { label: "Sustainability", href: "/#story" },
      { label: "Careers", href: "/#story" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Contact Us", href: "/account" },
      { label: "Shipping & Delivery", href: "/account" },
      { label: "Returns & Exchanges", href: "/account" },
      { label: "Track Order", href: "/account" },
      { label: "FAQs", href: "/account" },
    ],
  },
];

const trustBadges = [
  { icon: Truck, label: "Free Shipping", sub: "On orders over ₹1,500" },
  { icon: ShieldCheck, label: "Secure Payment", sub: "256-bit encrypted" },
  { icon: BadgeCheck, label: "Authentic", sub: "100% genuine attars" },
];

export default function Footer() {
  return (
    <footer className="bg-charcoal text-[#F8FCFE]">
      {/* Trust badges */}
      <div className="border-b border-white/10">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-6 py-10 sm:grid-cols-3">
          {trustBadges.map((badge) => (
            <div key={badge.label} className="flex items-center gap-4">
              <badge.icon size={26} className="shrink-0 text-gold" />
              <div>
                <p className="font-medium">{badge.label}</p>
                <p className="text-xs text-[#F8FCFE]/50">{badge.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main footer */}
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-12 lg:grid-cols-12">
          {/* Brand */}
          <div className="lg:col-span-5">
            <p className="font-display text-3xl font-semibold tracking-[0.18em]">
              DANISH<span className="text-gold"> PERFUMES</span>
            </p>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-[#F8FCFE]/60">
              A curated house of rare ouds, attars and oriental fragrances.
              Every blend is hand-poured in small batches and aged with
              patience — because true luxury cannot be rushed.
            </p>

            <div className="mt-8 flex gap-4">
              {[
                { icon: InstagramIcon, label: "Instagram" },
                { icon: FacebookIcon, label: "Facebook" },
                { icon: XIcon, label: "X (Twitter)" },
                { icon: YoutubeIcon, label: "YouTube" },
              ].map((social) => (
                <a
                  key={social.label}
                  href="#"
                  aria-label={social.label}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-[#F8FCFE]/70 transition-all hover:border-gold hover:bg-gold hover:text-white"
                >
                  <social.icon size={17} />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {columns.map((column) => (
            <div key={column.title} className="lg:col-span-2">
              <h4 className="mb-5 text-xs font-semibold tracking-[0.22em] text-gold uppercase">
                {column.title}
              </h4>
              <ul className="space-y-3">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      prefetch={link.href === "/account" ? false : undefined}
                      className="text-sm text-[#F8FCFE]/70 transition-colors hover:text-gold-light"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Newsletter */}
          <div className="lg:col-span-1" />
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-6 text-xs text-[#F8FCFE]/40 sm:flex-row">
          <p>© {new Date().getFullYear()} Danish Perfumes. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-gold-light">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-gold-light">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
