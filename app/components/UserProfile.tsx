'use client';

import { useSession } from 'next-auth/react';
import Image from 'next/image';

export default function UserProfile() {
    const { data: session } = useSession();

    return (
        <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">
                {session?.user?.name || 'Guest'}
            </span>
            {session?.user?.image ? (
                <Image
                    src={session.user.image}
                    alt="Profile"
                    width={40}
                    height={40}
                    className="rounded-full"
                />
            ) : (
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                    <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                </div>
            )}
        </div>
    );
} 