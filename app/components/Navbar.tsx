"use client";

import { useState } from "react";
import Image from "next/image";
import { Heart, Search, ShoppingCart, User, ChevronDown } from "lucide-react";

export default function Navbar() {
  const [showMegaMenu, setShowMegaMenu] = useState(false);

  const [previewImage, setPreviewImage] = useState("/images/products/oud.png");

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      {/* Top Header */}
      <div className="max-w-7xl mx-auto px-6">
        <div className="h-20 flex items-center justify-between gap-6">
          {/* Logo */}
          <div>
            <h1 className="text-2xl font-bold text-gray-900">MD Perfumes</h1>
          </div>

          {/* Search */}
          <div className="hidden md:flex flex-1 max-w-xl relative">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              placeholder="Search attars, perfumes..."
              className="w-full border border-gray-300 rounded-full py-3 pl-11 pr-4 outline-none focus:border-amber-500"
            />
          </div>

          {/* Icons */}
          <div className="flex items-center gap-5 text-gray-700">
            <Heart className="cursor-pointer hover:text-amber-600" />
            <ShoppingCart className="cursor-pointer hover:text-amber-600" />
            <User className="cursor-pointer hover:text-amber-600" />
          </div>
        </div>
      </div>

      {/* Menu */}
      <div className="border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <nav className="h-14 flex items-center gap-8 text-sm font-medium text-gray-700">
            {/* Attars Mega Menu */}
            <div
              className="relative"
              onMouseEnter={() => setShowMegaMenu(true)}
              onMouseLeave={() => setShowMegaMenu(false)}
            >
              <div className="flex items-center gap-1 cursor-pointer hover:text-amber-600 transition">
                Attars
                <ChevronDown size={16} />
              </div>

              {showMegaMenu && (
                <div className="absolute top-full left-0 mt-4 w-[750px] bg-white shadow-2xl rounded-3xl p-8 z-50 border border-gray-100">
                  <div className="grid grid-cols-2 gap-8">
                    {/* Categories */}
                    <div>
                      <h3 className="font-bold text-lg mb-5 text-gray-900">
                        Featured Collections
                      </h3>

                      <ul className="space-y-4 text-gray-600">
                        <li
                          onMouseEnter={() =>
                            setPreviewImage("/images/products/oud.png")
                          }
                          className="cursor-pointer hover:text-amber-600 transition"
                        >
                          Oud Collection
                        </li>

                        <li
                          onMouseEnter={() =>
                            setPreviewImage("/images/products/hawas.png")
                          }
                          className="cursor-pointer hover:text-amber-600 transition"
                        >
                          Hawas
                        </li>

                        <li
                          onMouseEnter={() =>
                            setPreviewImage("/images/products/rasasi.png")
                          }
                          className="cursor-pointer hover:text-amber-600 transition"
                        >
                          Rasasi
                        </li>

                        <li
                          onMouseEnter={() =>
                            setPreviewImage("/images/products/aurum.png")
                          }
                          className="cursor-pointer hover:text-amber-600 transition"
                        >
                          Aurum
                        </li>
                      </ul>
                    </div>

                    {/* Preview Image */}
                    <div className="relative h-[280px] bg-[#faf8f4] rounded-2xl overflow-hidden">
                      <Image
                        src={previewImage}
                        alt="Collection Preview"
                        fill
                        sizes="400px"
                        className="object-contain p-6 transition-all duration-500"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Other Menus */}
            <div className="flex items-center gap-1 cursor-pointer hover:text-amber-600 transition">
              Perfumes
              <ChevronDown size={16} />
            </div>

            <div className="flex items-center gap-1 cursor-pointer hover:text-amber-600 transition">
              Gift Sets
              <ChevronDown size={16} />
            </div>

            <a href="#" className="hover:text-amber-600 transition">
              New Arrivals
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
}
