"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import Sidebar from "./Sidebar";

export default function AdminShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex items-start min-h-screen bg-[#f8fcfe]">
      <Sidebar isOpen={sidebarOpen} onOpenChange={setSidebarOpen} />

      <div className="flex flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b border-[#174a63]/10 bg-white px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="rounded-lg p-2 text-[#174a63] hover:bg-[#174a63]/10 lg:hidden"
            >
              <Menu size={22} />
            </button>

            <h2 className="text-xl font-bold text-[#174a63] sm:text-2xl">
              Admin Panel
            </h2>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
