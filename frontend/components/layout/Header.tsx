"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Sparkles, Moon, Sun, Shield, Menu, X } from "lucide-react";
import { SearchModal } from "../search/SearchModal";

export const Header: React.FC = () => {
  const pathname = usePathname();
  const [isDark, setIsDark] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Check dark mode preference
    const stored = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (stored === "dark" || (!stored && prefersDark)) {
      setIsDark(true);
      document.documentElement.classList.add("dark");
    } else {
      setIsDark(false);
      document.documentElement.classList.remove("dark");
    }

    // Keyboard shortcut for Search (Cmd+K / Ctrl+K)
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const toggleDarkMode = () => {
    if (isDark) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setIsDark(false);
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setIsDark(true);
    }
  };

  const navLinks = [
    { label: "Explore", href: "/explore" },
    { label: "Events", href: "/events" },
    { label: "Notices", href: "/notices" },
    { label: "Projects", href: "/projects" },
    { label: "Pulse", href: "/pulse" },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md transition-colors">
        <div className="wiki-container flex items-center justify-between h-14">
          {/* Logo */}
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-sm tracking-tight shadow-sm group-hover:bg-blue-700 transition-colors">
                AP
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-sm tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                  SRM AP Wiki
                  <span className="text-[10px] px-1.5 py-0.2 bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded font-semibold uppercase tracking-wider">
                    Beta
                  </span>
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-normal hidden sm:inline leading-none">
                  University Knowledge Base
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center space-x-1 text-sm font-medium text-slate-600 dark:text-slate-300">
              {navLinks.map((link) => {
                const isActive = pathname.startsWith(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-3 py-1.5 rounded-md transition-colors ${
                      isActive
                        ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 font-semibold"
                        : "hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/60"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right Section: Search Trigger, Ask AI, Theme Toggle */}
          <div className="flex items-center gap-2">
            {/* Search Input Trigger */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-lg transition-colors w-32 sm:w-48 lg:w-56"
              aria-label="Search SRM AP Wiki"
            >
              <Search className="w-3.5 h-3.5" />
              <span className="truncate">Search Wiki...</span>
              <kbd className="hidden lg:inline-block ml-auto text-[10px] bg-white dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-700 rounded px-1.5 py-0.5 font-mono">
                ⌘K
              </kbd>
            </button>

            {/* Ask AI Button */}
            <Link
              href="/ai"
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all shadow-sm ${
                pathname === "/ai"
                  ? "bg-blue-600 text-white shadow-blue-500/20"
                  : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Ask AI</span>
            </Link>

            {/* Theme Toggle Button */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Toggle Dark Mode"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Mobile Menu Hamburger (for secondary links) */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label="Open Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu for secondary links */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 py-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-md"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/documents"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-md"
            >
              Documents & Regulations
            </Link>
            <Link
              href="/organizations"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-md"
            >
              Clubs & Labs
            </Link>
            <Link
              href="/submit"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-md font-semibold"
            >
              + Submit Information
            </Link>
          </div>
        )}
      </header>

      {/* Global Command Palette / Search Dialog */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
};
