// app/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from './components/Navbar';

export default function Home() {
  const [showStartButton] = useState(true);
  const router = useRouter();

  function start() {
    router.push('/applications');
  }

  if (!showStartButton) {
    return (
      <div className="flex min-h-screen">
        <Navbar />
        <main className="flex-1">
          <div className="p-8">
            <h1 className="text-3xl font-bold text-gray-900">Welcome to Tenshoku Hero</h1>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="h-screen w-full flex items-center justify-center">
      <button
        onClick={start}
        className="
          w-40 h-40 rounded-full
          bg-blue-600 text-white text-2xl font-semibold
          hover:bg-blue-700
          focus:ring-4 focus:ring-blue-300
          transition
        "
      >
        Start
      </button>
    </div>
  );
}