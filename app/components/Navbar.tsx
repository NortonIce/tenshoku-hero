"use client";
import Link from "next/link";
import { useState, useEffect, type ElementType } from "react";
import { usePathname } from "next/navigation";
import {
  ClipboardDocumentListIcon,
  DocumentTextIcon,
  ChartPieIcon,
  HomeIcon,
  MapIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import UserProfile from "./UserProfile";

type NavItem = {
  href: string;
  label: string;
  icon: ElementType;
};

const NAV_ITEMS: NavItem[] = [
  { href: "/home", label: "Home", icon: HomeIcon },
  { href: "/applications", label: "Applications", icon: ClipboardDocumentListIcon },
  { href: "/resumes", label: "Resumes", icon: DocumentTextIcon },
  { href: "/tasks", label: "Tasks", icon: ChartPieIcon },
  { href: "/roadmap", label: "Roadmap", icon: MapIcon },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <>
      {/* Top bar */}
      <header className="h-16 shrink-0 bg-white/80 backdrop-blur-sm border-b border-gray-200/60 z-30">
        <div className="h-full px-4 sm:px-6 lg:px-10 2xl:px-16 flex items-center justify-between gap-4">

          {/* Left: Logo */}
          <Link
            href="/home"
            className="text-xl font-bold text-gray-900 tracking-tight shrink-0 select-none"
          >
            転職
          </Link>

          {/* Center: Desktop nav links */}
          <nav className="hidden sm:flex items-center gap-1">
            {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
              const isActive = pathname === href || pathname.startsWith(href + "/");
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-150 ${
                    isActive
                      ? "bg-gray-900 text-white"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right: UserProfile + mobile hamburger */}
          <div className="flex items-center gap-2 shrink-0">
            <UserProfile />
            <button
              onClick={() => setMobileOpen(true)}
              className="sm:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
              aria-label="Open navigation menu"
            >
              <Bars3Icon className="w-6 h-6" />
            </button>
          </div>

        </div>
      </header>

      {/* Mobile bottom sheet */}
      {mobileOpen && (
        <div
          className="sm:hidden fixed inset-0 z-50 bg-black/40"
          onClick={() => setMobileOpen(false)}
        >
          <div
            className="absolute bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md rounded-t-2xl px-6 pt-4 pb-10 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative flex justify-center mb-4">
              <div className="w-10 h-1 rounded-full bg-gray-300" />
              <button
                onClick={() => setMobileOpen(false)}
                className="absolute right-0 top-1/2 -translate-y-1/2 p-1 text-gray-500 hover:text-gray-700 cursor-pointer"
                aria-label="Close menu"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
                const isActive = pathname === href || pathname.startsWith(href + "/");
                return (
                  <Link
                    key={href}
                    href={href}
                    className={`flex flex-col items-center gap-1.5 p-3 rounded-xl text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-gray-900 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    <Icon className="w-6 h-6" />
                    <span className="text-xs">{label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
