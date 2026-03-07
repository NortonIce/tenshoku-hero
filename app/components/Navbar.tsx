"use client";
import Link from "next/link";
import { useState, type ElementType } from "react";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import {
  ClipboardDocumentListIcon,
  DocumentTextIcon,
  ChartPieIcon,
  HomeIcon,
} from "@heroicons/react/24/outline";

type NavbarItem = {
  href: string;
  label: string;
  icon: ElementType;
  showOn: Array<"desktop" | "mobile">;
};

const NAV_ITEMS: NavbarItem[] = [
  { href: "/home", label: "Home", icon: HomeIcon, showOn: ["desktop"] },
  {
    href: "/applications",
    label: "Applications",
    icon: ClipboardDocumentListIcon,
    showOn: ["desktop", "mobile"],
  },
  {
    href: "/resumes",
    label: "Resumes",
    icon: DocumentTextIcon,
    showOn: ["desktop", "mobile"],
  },
  {
    href: "/tasks",
    label: "Tasks",
    icon: ChartPieIcon,
    showOn: ["desktop", "mobile"],
  },
  { href: "/home", label: "Home", icon: ChartPieIcon, showOn: ["mobile"] },
];

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // Close mobile menu when pathname changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const handleMenuItemClick = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Desktop/Tablet Navbar */}
      <nav className="h-screen p-2 bg-transparent flex items-center hidden sm:flex">
        <div className="flex flex-col space-y-6">
          {NAV_ITEMS.filter((item) => item.showOn.includes("desktop")).map(
            ({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className="flex flex-col items-center group"
              >
                <div className="w-16 h-16 rounded-xl bg-white/5 backdrop-blur-sm group-hover:bg-white/10 transition border border-gray-200/20 flex items-center justify-center mb-2">
                  <Icon className="w-8 h-8 text-gray-700" />
                </div>
                <span className="text-sm font-medium text-gray-700">
                  {label}
                </span>
              </Link>
            ),
          )}
        </div>
      </nav>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(true)}
        className={`sm:hidden fixed bottom-6 right-6 z-50 bg-white/80 backdrop-blur-md border border-gray-200/40 shadow-lg rounded-full w-16 h-16 flex items-center justify-center cursor-pointer transition-opacity ${
          isMobileMenuOpen ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
        aria-label="Open menu"
      >
        <svg
          className="w-8 h-8 text-gray-700"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="sm:hidden fixed inset-0 z-40 bg-black/40 flex justify-center items-end">
          <div className="w-full max-w-xs bg-white rounded-t-2xl p-6 pb-12 flex flex-col space-y-6 shadow-2xl relative">
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 cursor-pointer"
              aria-label="Close menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            {NAV_ITEMS.filter((item) => item.showOn.includes("mobile")).map(
              ({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={handleMenuItemClick}
                  className="flex flex-col items-center group cursor-pointer"
                >
                  <div className="w-16 h-16 rounded-xl bg-white/5 backdrop-blur-sm group-hover:bg-white/10 transition border border-gray-200/20 flex items-center justify-center mb-2">
                    <Icon className="w-8 h-8 text-gray-700" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    {label}
                  </span>
                </Link>
              ),
            )}
          </div>
        </div>
      )}
    </>
  );
}
