"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { 
  LayoutDashboard, 
  User, 
  LogOut, 
  Activity,
  BarChart3,
  FolderGit
} from "lucide-react";
import { FaGithub } from "react-icons/fa6";
import { LogoutDialog } from "@/components/logout-dialog";

interface NavigationProps {
  isAuthenticated?: boolean;
}

export function Navigation({ isAuthenticated = false }: NavigationProps) {
  const pathname = usePathname();
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  const isActive = (path: string) => pathname === path;

  const navLinks = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/repos", label: "Repositories", icon: FolderGit },
    { href: "/analytics", label: "Analytics", icon: BarChart3 },
    { href: "/github/profile", label: "Profile", icon: User },
  ];

  // Render unauthenticated top header
  if (!isAuthenticated) {
    return (
      <header className="fixed top-0 left-0 right-0 z-50 h-16 backdrop-blur-md bg-background/80 border-b border-border/50 transition-all duration-300">
        <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group" aria-label="DevPulse home">
            <div className="w-8 h-8 rounded-md bg-primary/95 flex items-center justify-center shadow-sm shadow-primary/15 group-hover:scale-105 transition-transform">
              <Activity className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-mono text-lg font-bold tracking-tight text-foreground">
              DevPulse
            </span>
          </Link>

          <div className="flex items-center gap-4">
            <nav className="hidden sm:flex items-center gap-4 text-xs font-mono">
              <Link href="/#capabilities" className="text-muted-foreground hover:text-foreground transition-colors">
                Capabilities
              </Link>
              <Link href="/#architecture" className="text-muted-foreground hover:text-foreground transition-colors">
                Architecture
              </Link>
              <Link href="/terms" className="text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap">
                <span className="hidden md:inline">Terms of Service</span>
                <span className="md:hidden">Terms</span>
              </Link>
              <Link href="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">
                Privacy
              </Link>
            </nav>

            <div className="flex items-center gap-2.5">
              <Link
                href="/login"
                className="inline-flex items-center gap-2 rounded-md border border-primary/30 bg-primary px-3.5 py-1.5 text-xs font-mono font-bold uppercase tracking-wider text-primary-foreground shadow-sm shadow-primary/10 transition-transform hover:-translate-y-0.5 hover:bg-primary/90"
              >
                <FaGithub className="w-3.5 h-3.5" />
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <>
      <aside className="hidden md:flex flex-col fixed top-0 bottom-0 left-0 w-20 border-r border-border/50 bg-card/80 backdrop-blur-md z-40 transition-all duration-300">
        <div className="h-16 border-b border-border/50 flex items-center justify-center">
          <Link href="/dashboard" className="flex items-center justify-center" aria-label="DevPulse dashboard">
            <div className="w-8 h-8 rounded-md bg-primary/95 flex items-center justify-center shadow-sm shadow-primary/15 transition-transform hover:scale-105">
              <Activity className="w-4 h-4 text-primary-foreground" />
            </div>
          </Link>
        </div>

        <nav className="flex-1 px-3 py-6 space-y-3 flex flex-col items-center">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.href);
            return (
              <div key={link.href} className="relative flex justify-start pl-3 w-full">
                <Link
                  href={link.href}
                  aria-label={link.label}
                  title={link.label}
                  className={`group relative flex h-11 w-11 items-center justify-center rounded-md border transition-all duration-200 ${
                    active
                      ? "border-primary/30 bg-primary text-primary-foreground shadow-sm shadow-primary/10"
                      : "border-transparent bg-transparent text-muted-foreground hover:border-border/50 hover:bg-secondary/70 hover:text-foreground"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="pointer-events-none absolute left-[calc(100%+0.75rem)] top-1/2 -translate-y-1/2 rounded-sm border border-border bg-card px-2 py-1 text-[10px] font-bold uppercase tracking-[0.08em] text-muted-foreground opacity-0 shadow-sm transition-opacity duration-200 group-hover:opacity-100">
                    {link.label}
                  </span>
                </Link>
              </div>
            );
          })}
        </nav>

        <div className="p-3 border-t border-border/50 space-y-3 flex flex-col items-center">
          <div className="relative flex justify-start pl-3 w-full">
            <button
              onClick={() => setShowLogoutDialog(true)}
              aria-label="Logout"
              title="Logout"
              className="flex h-11 w-11 items-center justify-center rounded-md border border-transparent bg-transparent text-red-400 transition-all duration-200 hover:border-red-500/25 hover:bg-red-500/5 cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 border-t border-border/50 bg-card/85 backdrop-blur-md z-40 px-3 flex items-center justify-around">
        {navLinks.map((link) => {
          const Icon = link.icon;
          const active = isActive(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              aria-label={link.label}
              className={`flex flex-col items-center gap-1 p-2 transition-colors duration-200 ${
                active ? "text-primary" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-medium">{link.label}</span>
            </Link>
          );
        })}

        <button
          onClick={() => setShowLogoutDialog(true)}
          aria-label="Logout"
          className="flex flex-col items-center gap-1 p-2 text-red-400 cursor-pointer"
        >
          <LogOut className="w-5 h-5" />
          <span className="text-[10px] font-medium">Logout</span>
        </button>
      </div>

      <LogoutDialog
        open={showLogoutDialog}
        onOpenChange={setShowLogoutDialog}
        callbackUrl="/login"
      />
    </>
  );
}
