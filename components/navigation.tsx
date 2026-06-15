"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { signOut } from "next-auth/react";
import { 
  LayoutDashboard, 
  User, 
  Sun, 
  Moon, 
  LogOut, 
  Activity,
  BarChart3,
  FolderGit
} from "lucide-react";
import { FaGithub } from "react-icons/fa6";

interface NavigationProps {
  isAuthenticated?: boolean;
}

export function Navigation({ isAuthenticated = false }: NavigationProps) {
  const pathname = usePathname();
  const [theme, setTheme] = useState<"light" | "dark">("light");

  // Initialize theme from document class
  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark");
    const timer = setTimeout(() => {
      setTheme(isDark ? "dark" : "light");
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const toggleTheme = () => {
    if (theme === "light") {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setTheme("dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setTheme("light");
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (error) {
      console.error("Failed to log out activity", error);
    }
    await signOut({ callbackUrl: "/" });
  };

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
      <header className="fixed top-0 left-0 right-0 z-50 h-16 backdrop-blur-md bg-background/70 border-b border-border/40 transition-all duration-300">
        <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <Activity className="w-4 h-4 text-white animate-pulse" />
            </div>
            <span className="font-bold text-xl bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent tracking-tight">
              DevPulse
            </span>
          </Link>

          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-lg border border-border/50 bg-card/50 text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-all hover:scale-105 active:scale-95"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <Link
              href="/login"
              className="px-4 py-2 text-sm font-semibold bg-primary text-primary-foreground rounded-lg hover:shadow-lg hover:shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2"
            >
              <FaGithub className="w-4 h-4" />
              Sign In
            </Link>
          </div>
        </div>
      </header>
    );
  }

  return (
    <>
      {/* Authenticated Desktop Sidebar */}
      <aside className="hidden md:flex flex-col fixed top-0 bottom-0 left-0 w-20 border-r border-border/40 bg-card/60 backdrop-blur-lg z-40 transition-all duration-300 overflow-visible">
        {/* Brand */}
        <div className="h-16 border-b border-border/40 flex items-center justify-center">
          <Link href="/" className="flex items-center justify-center">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center shadow-md shadow-indigo-500/20 hover:scale-110 transition-transform">
              <Activity className="w-4 h-4 text-white" />
            </div>
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-3 py-6 space-y-4 flex flex-col items-center">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.href);
            return (
              <div key={link.href} className="relative flex justify-start pl-4 w-full">
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-0 hover:gap-3 w-12 hover:w-44 h-12 px-3.5 rounded-full transition-all duration-300 group ${
                    active
                      ? "bg-primary text-primary-foreground shadow-md shadow-primary/15"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/75 border border-transparent hover:border-border/40"
                  }`}
                >
                  <Icon className={`w-5 h-5 flex-shrink-0 transition-transform group-hover:scale-110 ${
                    active ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground"
                  }`} />
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-250 whitespace-nowrap text-xs font-bold uppercase tracking-wider select-none overflow-hidden">
                    {link.label}
                  </span>
                </Link>
              </div>
            );
          })}
        </nav>

        {/* Bottom Panel */}
        <div className="p-3 border-t border-border/40 space-y-4 flex flex-col items-center">
          {/* Theme Toggle Button */}
          <div className="relative flex justify-start pl-4 w-full">
            <button
              onClick={toggleTheme}
              className="flex items-center gap-0 hover:gap-3 w-12 hover:w-44 h-12 px-3.5 rounded-full text-muted-foreground hover:text-foreground hover:bg-secondary/75 border border-transparent hover:border-border/40 transition-all duration-300 group cursor-pointer"
            >
              {theme === "dark" ? (
                <>
                  <Sun className="w-5 h-5 flex-shrink-0 text-amber-500 group-hover:rotate-45 transition-transform" />
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-250 whitespace-nowrap text-xs font-bold uppercase tracking-wider select-none overflow-hidden">
                    Light Mode
                  </span>
                </>
              ) : (
                <>
                  <Moon className="w-5 h-5 flex-shrink-0 text-indigo-500 group-hover:-rotate-12 transition-transform" />
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-250 whitespace-nowrap text-xs font-bold uppercase tracking-wider select-none overflow-hidden">
                    Dark Mode
                  </span>
                </>
              )}
            </button>
          </div>

          {/* Logout Button */}
          <div className="relative flex justify-start pl-4 w-full">
            <button
              onClick={handleLogout}
              className="flex items-center gap-0 hover:gap-3 w-12 hover:w-44 h-12 px-3.5 rounded-full text-red-600 dark:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all duration-300 group cursor-pointer"
            >
              <LogOut className="w-5 h-5 flex-shrink-0 group-hover:translate-x-0.5 transition-transform" />
              <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-250 whitespace-nowrap text-xs font-bold uppercase tracking-wider select-none overflow-hidden">
                Logout
              </span>
            </button>
          </div>
        </div>
      </aside>

      {/* Authenticated Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 border-t border-border/40 bg-card/85 backdrop-blur-md z-40 px-3 flex items-center justify-around transition-colors duration-300">
        {navLinks.map((link) => {
          const Icon = link.icon;
          const active = isActive(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex flex-col items-center gap-1 p-2 transition-colors duration-200 ${
                active ? "text-primary" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-medium">{link.label}</span>
            </Link>
          );
        })}

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="flex flex-col items-center gap-1 p-2 text-muted-foreground hover:text-foreground"
          aria-label="Toggle theme"
        >
          {theme === "dark" ? <Sun className="w-5 h-5 text-amber-500" /> : <Moon className="w-5 h-5 text-indigo-500" />}
          <span className="text-[10px] font-medium">Theme</span>
        </button>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="flex flex-col items-center gap-1 p-2 text-red-600 dark:text-red-400"
          aria-label="Logout"
        >
          <LogOut className="w-5 h-5" />
          <span className="text-[10px] font-medium">Logout</span>
        </button>
      </div>
    </>
  );
}
