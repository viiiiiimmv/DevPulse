"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function Footer() {
  const pathname = usePathname();

  // Do not render footer on the welcome (home) page or the login page
  if (pathname === "/" || pathname === "/login") {
    return null;
  }

  return (
    <footer className="w-full border-t border-white/[0.06] pt-6 pb-6 text-xs font-mono text-slate-500">
      <div className="w-full max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-400">DevPulse</span>
          <span>•</span>
          <span>Real-time Git Intelligence</span>
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
          <Link href="/terms" className="hover:text-slate-300 transition-colors">
            Terms
          </Link>
          <Link href="/privacy" className="hover:text-slate-300 transition-colors">
            Privacy
          </Link>
          <Link href="/data-minimisation" className="hover:text-slate-300 transition-colors">
            Data Minimisation
          </Link>
        </div>
      </div>
    </footer>
  );
}
