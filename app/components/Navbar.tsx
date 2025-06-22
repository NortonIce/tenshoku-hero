import Link from "next/link";
import {
  ClipboardDocumentListIcon,
  DocumentTextIcon,
  TrophyIcon,
  ChartPieIcon,
} from "@heroicons/react/24/outline";

export default function Navbar() {
  return (
    <>
      {/* Desktop/Tablet Navbar */}
      <nav className="h-screen p-2 bg-transparent flex items-center hidden sm:flex">
        <div className="flex flex-col space-y-6">
          <Link href="/stats" className="flex flex-col items-center group">
            <div className="w-16 h-16 rounded-xl bg-white/5 backdrop-blur-sm group-hover:bg-white/10 transition border border-gray-200/20 flex items-center justify-center mb-2">
              <ChartPieIcon className="w-8 h-8 text-gray-700" />
            </div>
            <span className="text-sm font-medium text-gray-700">Stats</span>
          </Link>
          <Link
            href="/applications"
            className="flex flex-col items-center group"
          >
            <div className="w-16 h-16 rounded-xl bg-white/5 backdrop-blur-sm group-hover:bg-white/10 transition border border-gray-200/20 flex items-center justify-center mb-2">
              <ClipboardDocumentListIcon className="w-8 h-8 text-gray-700" />
            </div>
            <span className="text-sm font-medium text-gray-700">
              Applications
            </span>
          </Link>

          <Link href="/resumes" className="flex flex-col items-center group">
            <div className="w-16 h-16 rounded-xl bg-white/5 backdrop-blur-sm group-hover:bg-white/10 transition border border-gray-200/20 flex items-center justify-center mb-2">
              <DocumentTextIcon className="w-8 h-8 text-gray-700" />
            </div>
            <span className="text-sm font-medium text-gray-700">Resumes</span>
          </Link>

          <Link href="/quests" className="flex flex-col items-center group">
            <div className="w-16 h-16 rounded-xl bg-white/5 backdrop-blur-sm group-hover:bg-white/10 transition border border-gray-200/20 flex items-center justify-center mb-2">
              <TrophyIcon className="w-8 h-8 text-gray-700" />
            </div>
            <span className="text-sm font-medium text-gray-700">Quests</span>
          </Link>
        </div>
      </nav>

      {/* Mobile Burger Button and Navbar (CSS only, no JS) */}
      <input type="checkbox" id="mobile-nav-toggle" className="peer hidden" />
      <label
        htmlFor="mobile-nav-toggle"
        className="sm:hidden fixed bottom-6 right-6 z-50 bg-white/80 backdrop-blur-md border border-gray-200/40 shadow-lg rounded-full w-16 h-16 flex items-center justify-center cursor-pointer transition-opacity peer-checked:opacity-0 peer-checked:pointer-events-none"
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
      </label>
      {/* Mobile Navbar Drawer/Modal with auto-hide on link click */}
      <div className="sm:hidden fixed inset-0 z-40 bg-black/40 flex justify-center items-end opacity-0 pointer-events-none transition-opacity peer-checked:opacity-100 peer-checked:pointer-events-auto">
        <div className="w-full max-w-xs bg-white rounded-t-2xl p-6 pb-12 flex flex-col space-y-6 shadow-2xl relative">
          <label
            htmlFor="mobile-nav-toggle"
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
          </label>
          {/* Links with auto-close on click using <label> hack */}
          <label htmlFor="mobile-nav-toggle">
            <Link
              href="/stats"
              className="flex flex-col items-center group cursor-pointer"
            >
              <div className="w-16 h-16 rounded-xl bg-white/5 backdrop-blur-sm group-hover:bg-white/10 transition border border-gray-200/20 flex items-center justify-center mb-2">
                <ChartPieIcon className="w-8 h-8 text-gray-700" />
              </div>
              <span className="text-sm font-medium text-gray-700">Stats</span>
            </Link>
          </label>
          <label htmlFor="mobile-nav-toggle">
            <Link
              href="/applications"
              className="flex flex-col items-center group cursor-pointer"
            >
              <div className="w-16 h-16 rounded-xl bg-white/5 backdrop-blur-sm group-hover:bg-white/10 transition border border-gray-200/20 flex items-center justify-center mb-2">
                <ClipboardDocumentListIcon className="w-8 h-8 text-gray-700" />
              </div>
              <span className="text-sm font-medium text-gray-700">
                Applications
              </span>
            </Link>
          </label>
          <label htmlFor="mobile-nav-toggle">
            <Link
              href="/resumes"
              className="flex flex-col items-center group cursor-pointer"
            >
              <div className="w-16 h-16 rounded-xl bg-white/5 backdrop-blur-sm group-hover:bg-white/10 transition border border-gray-200/20 flex items-center justify-center mb-2">
                <DocumentTextIcon className="w-8 h-8 text-gray-700" />
              </div>
              <span className="text-sm font-medium text-gray-700">Resumes</span>
            </Link>
          </label>
          <label htmlFor="mobile-nav-toggle">
            <Link
              href="/quests"
              className="flex flex-col items-center group cursor-pointer"
            >
              <div className="w-16 h-16 rounded-xl bg-white/5 backdrop-blur-sm group-hover:bg-white/10 transition border border-gray-200/20 flex items-center justify-center mb-2">
                <TrophyIcon className="w-8 h-8 text-gray-700" />
              </div>
              <span className="text-sm font-medium text-gray-700">Quests</span>
            </Link>
          </label>
        </div>
      </div>
    </>
  );
}
