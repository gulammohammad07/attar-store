"use client";

import { useState, useEffect } from "react";
import { Menu, ExternalLink } from "lucide-react";
import Link from "next/link";
import Sidebar from "./Sidebar";

export default function AdminShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [sidebarOpen]);

  return (
    <div className="flex min-h-screen bg-[#f5f5f0]">
      <Sidebar isOpen={sidebarOpen} onOpenChange={setSidebarOpen} />

      <div className="flex flex-1 flex-col min-w-0">
        <header className="flex h-14 sm:h-16 items-center justify-between border-b border-[#e5e5e0] bg-white px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="rounded-lg p-2 text-[#111111] hover:bg-black/5 lg:hidden"
            >
              <Menu size={22} />
            </button>

            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-[#111111]">
              Admin Panel
            </h2>
          </div>

          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full border border-[#e5e5e0] bg-white px-4 py-2 text-xs sm:text-sm font-semibold tracking-wide text-[#111111] shadow-sm transition-colors hover:bg-[#f5f5f0]"
          >
            <ExternalLink size={14} />
            VIEW STORE
          </Link>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
