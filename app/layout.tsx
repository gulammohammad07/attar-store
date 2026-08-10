import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/lib/store/providers";
import { Toaster } from "@/components/ui/sonner";
import { InlineScript } from "@/components/layout/InlineScript";

const EXTENSION_HYDRATION_FIX = `
(function () {
  var STRIP_ATTRS = ["fdprocessedid"];
  var FORM_TAGS = { FORM: true, INPUT: true, SELECT: true, TEXTAREA: true, BUTTON: true };

  function isExtensionNode(node) {
    if (!node || node.nodeType !== 1) return false;
    var attrs = node.attributes;
    for (var i = 0; i < attrs.length; i++) {
      if (attrs[i].name.indexOf("data-v-") === 0) return true;
    }
    return false;
  }

  function cleanNode(node) {
    if (!node || node.nodeType !== 1) return;
    for (var i = 0; i < STRIP_ATTRS.length; i++) {
      if (node.hasAttribute(STRIP_ATTRS[i])) {
        node.removeAttribute(STRIP_ATTRS[i]);
      }
    }
    if (FORM_TAGS[node.nodeName] && node.style && node.style.position === "relative") {
      node.style.removeProperty("position");
    }
    if (isExtensionNode(node) && node.parentNode) {
      node.parentNode.removeChild(node);
    }
  }

  function cleanTree(root) {
    if (!root) return;
    cleanNode(root);
    if (root.querySelectorAll) {
      var nodes = root.querySelectorAll("*");
      for (var i = 0; i < nodes.length; i++) cleanNode(nodes[i]);
    }
  }

  var observer = new MutationObserver(function (mutations) {
    for (var i = 0; i < mutations.length; i++) {
      var mutation = mutations[i];
      if (mutation.type === "attributes") {
        cleanNode(mutation.target);
      } else if (mutation.type === "childList") {
        for (var j = 0; j < mutation.addedNodes.length; j++) {
          cleanTree(mutation.addedNodes[j]);
        }
      }
    }
  });

  if (document.documentElement) {
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: STRIP_ATTRS,
      childList: true,
      subtree: true,
    });
    cleanTree(document.documentElement);
  }

  function onReady() {
    cleanTree(document.body || document.documentElement);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", onReady);
  } else {
    onReady();
  }
})();
`;

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Danish Perfumes — Luxury Attars & Fragrances",
    template: "%s | Danish Perfumes",
  },
  description:
    "Hand-curated luxury attars, ouds and perfumes. Discover the art of oriental fragrance with Danish Perfumes.",
  keywords: [
    "attar",
    "oud",
    "perfume",
    "luxury fragrance",
    "musk",
    "Danish Perfumes",
  ],
  openGraph: {
    title: "Danish Perfumes — Luxury Attars & Fragrances",
    description:
      "Hand-curated luxury attars, ouds and perfumes. Discover the art of oriental fragrance.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${cormorant.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#F8FCFE] text-[#174A63]">
        <Providers>
          <main className="flex-1">{children}</main>
          <Toaster richColors position="bottom-right" />
        </Providers>
        <InlineScript html={EXTENSION_HYDRATION_FIX} />
      </body>
    </html>
  );
}
