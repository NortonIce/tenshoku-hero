import Link from 'next/link';
import {
  ClipboardDocumentListIcon,
  DocumentTextIcon,
  TrophyIcon,
} from '@heroicons/react/24/outline';

export default function Navbar() {
  return (
    <nav className="h-screen p-2 bg-transparent flex items-center">
      <div className="flex flex-col space-y-6">
        <Link href="/applications" className="flex flex-col items-center group">
          <div className="w-16 h-16 rounded-xl bg-white/5 backdrop-blur-sm group-hover:bg-white/10 transition border border-gray-200/20 flex items-center justify-center mb-2">
            <ClipboardDocumentListIcon className="w-8 h-8 text-gray-700" />
          </div>
          <span className="text-sm font-medium text-gray-700">Applications</span>
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
  );
} 