'use client';

import { usePathname } from 'next/navigation';
import UserProfile from './UserProfile';

export default function TopBar() {
    const pathname = usePathname();

    const getPageTitle = () => {
        const path = pathname.split('/')[1];
        if (!path) return 'Home';
        return path.charAt(0).toUpperCase() + path.slice(1);
    };

    return (
        <div className="right-0 left-0 h-16 p-3 bg-white/80 backdrop-blur-sm border-b border-gray-200 z-10">
            <div className="h-full px-4 flex items-center justify-between">
                <h1 className="text-xl font-semibold text-gray-900">
                    {getPageTitle()}
                </h1>
                <UserProfile />
            </div>
        </div>
    );
} 