'use client';
import './globals.css';
import type { ReactNode } from 'react';
import { usePathname } from 'next/navigation';

export default function RootLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isPlansPage = pathname === '/plans';

  return (
    <html lang="en">
      <body className="bg-[#181A20] min-h-screen text-gray-100">
        <nav className="w-full flex items-center justify-between p-4 bg-[#23262F] border-b border-[#353945]">
          <div>
            {isPlansPage && (
              <a href="/" className="flex items-center text-[#00FFB0] hover:underline font-semibold text-lg">
                <span className="mr-2">←</span> Volver
              </a>
            )}
          </div>
          <a href="/plans" className="text-[#00FFB0] hover:underline font-semibold text-lg">Planes & Precios</a>
        </nav>
        {children}
      </body>
    </html>
  );
} 