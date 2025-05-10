// app/page.tsx
import React from "react";

export default function Home() {
  return (
    <div
      className="
        magicpattern
        w-screen h-screen
        grid grid-rows-[20px_1fr_20px]
        items-center justify-items-center
        p-0
        font-[family-name:var(--font-geist-sans)]
      "
    >
      {/* Top spacer */}
      <div />

      {/* Middle row: big circular Start button */}
      <main className="row-start-2 flex items-center justify-center w-full">
        <button
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
      </main>

      {/* Bottom spacer */}
      <div />
    </div>
  );
}