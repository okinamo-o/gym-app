"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useState } from "react";

const links = [
  { href: "/", label: "Discovery" },
  { href: "/library", label: "Open Library" },
  { href: "/workout-builder", label: "Builder" },
  { href: "/ai", label: "Intelligence" },
];

export function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed top-0 inset-x-0 z-50 flex items-center justify-center p-4">
      {/* Desktop Nav */}
      <nav className="hidden md:flex items-center gap-2 p-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-xl shadow-lg">
        <Link href="/" className="pl-4 pr-6 font-heading font-bold text-lg text-white">
          LYFTA<span className="text-primary">.</span>
        </Link>
        <div className="flex items-center gap-1">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative px-4 py-2 text-sm font-medium rounded-full transition-colors",
                  isActive ? "text-white" : "text-white/60 hover:text-white"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="header-active-tab"
                    className="absolute inset-0 rounded-full bg-white/10 border border-white/20"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{link.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Mobile Nav */}
      <nav className="md:hidden flex items-center justify-between w-full px-2 py-1 rounded-full border border-white/10 bg-white/5 backdrop-blur-xl shadow-lg">
        <Link href="/" className="pl-3 font-heading font-bold text-lg text-white">
          LYFTA<span className="text-primary">.</span>
        </Link>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="w-10 h-10 flex items-center justify-center rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          aria-label="Toggle navigation menu"
        >
          {mobileOpen ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
          )}
        </button>
      </nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="md:hidden fixed top-[72px] inset-x-4 z-50 rounded-2xl border border-white/10 bg-background/95 backdrop-blur-2xl shadow-2xl p-4"
          >
            <div className="flex flex-col gap-1">
              {links.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "px-4 py-3 rounded-xl text-base font-medium transition-colors",
                      isActive
                        ? "bg-white/10 text-white border border-white/20"
                        : "text-white/60 hover:text-white hover:bg-white/5"
                    )}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
