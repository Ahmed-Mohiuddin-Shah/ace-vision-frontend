"use client";

import Link from "next/link";
import "./globals.css";
import { useEffect } from "react";
import { apiURL } from "@/constants";

export const metadata = {
  title: "AceVision",
  description: "AI-powered sports analysis tool",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Somewhere in a component or hook
  useEffect(() => {
    console.log("Backend URL:", process.env.NEXT_PUBLIC_BACKEND_URL);
    console.log("Backend URL apiURL:", apiURL);
  }, []);

  return (
    <html lang="en">
      <body className="bg-gray-100 min-h-screen flex flex-col">
        {/* Navbar */}
        <nav className="bg-white shadow-md">
          <div className="max-w-5xl mx-auto px-4">
            <div className="flex space-x-6 h-14 items-center">
              <Link href="/" className="font-bold text-lg text-blue-600">
                AceVision
              </Link>
              <div className="flex space-x-4">
                <Link
                  href="/"
                  className="hover:text-blue-600 transition-colors"
                >
                  Home
                </Link>
                <Link
                  href="/player-info"
                  className="hover:text-blue-600 transition-colors"
                >
                  Player Info
                </Link>
                <Link
                  href="/upload"
                  className="hover:text-blue-600 transition-colors"
                >
                  Upload Video
                </Link>
                <Link
                  href="/results"
                  className="hover:text-blue-600 transition-colors"
                >
                  Results
                </Link>
              </div>
            </div>
          </div>
        </nav>

        {/* Page Content */}
        <main className="flex-1 max-w-5xl mx-auto w-full p-6">{children}</main>

        {/* Footer */}
        <footer className="bg-white shadow-inner text-center py-4 text-sm text-gray-500">
          © {new Date().getFullYear()} AceVision – NUST FYP
        </footer>
      </body>
    </html>
  );
}
