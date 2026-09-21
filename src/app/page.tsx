"use client";

import { useState } from "react";
import { Demo } from "@/components/blocks/demo";

export default function Home() {
  const [isSecure, setIsSecure] = useState(true);

  return (
    <main className="min-h-screen relative bg-background dark text-foreground">
      <div className="absolute top-4 right-4 z-50">
        <button
          onClick={() => setIsSecure(!isSecure)}
          className={`px-4 py-2 text-white rounded-md text-sm font-medium border transition-colors cursor-pointer ${
            isSecure 
              ? "bg-green-600 border-green-700 hover:bg-green-700" 
              : "bg-red-600 border-red-700 hover:bg-red-700"
          }`}
        >
          {isSecure ? "Secure Mode" : "Vulnerable Mode"}
        </button>
      </div>
      <Demo isSecure={isSecure} />
    </main>
  );
}
