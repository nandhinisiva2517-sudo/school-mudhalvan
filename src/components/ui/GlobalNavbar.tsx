"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function GlobalNavbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session } = useSession();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-black/5 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          <div className="flex items-center space-x-2 md:space-x-4">
            <Link 
              href="/"
              className={`inline-flex items-center gap-1.5 text-sm font-semibold transition-colors py-2 px-2 sm:px-3 rounded-lg hover:bg-black/5 ${
                pathname === '/' ? 'text-spark-primary bg-spark-primary/5' : 'text-spark-ink-muted hover:text-spark-ink'
              }`}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline points="9 22 9 12 15 12 15 22"></polyline>
              </svg>
              <span className="hidden sm:inline">Home</span>
            </Link>
          </div>

          <div className="flex items-center space-x-2 md:space-x-4">
            {session?.user && (
              <>
                <Link 
                  href="/dashboard"
                  className={`inline-flex items-center gap-1.5 text-sm font-semibold transition-colors py-2 px-2 sm:px-3 rounded-lg hover:bg-black/5 ${
                    pathname.includes('/dashboard') || pathname.includes('/staff') || pathname.includes('/student') 
                      ? 'text-spark-primary bg-spark-primary/5' 
                      : 'text-spark-ink-muted hover:text-spark-ink'
                  }`}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="7" height="9"></rect>
                    <rect x="14" y="3" width="7" height="5"></rect>
                    <rect x="14" y="12" width="7" height="9"></rect>
                    <rect x="3" y="16" width="7" height="5"></rect>
                  </svg>
                  <span className="hidden sm:inline">Dashboard</span>
                </Link>

                <div className="relative" ref={dropdownRef}>
                  <button 
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className={`inline-flex items-center gap-1.5 text-sm font-semibold transition-colors py-2 px-2 sm:px-3 rounded-lg hover:bg-black/5 ${
                      isProfileOpen ? 'text-spark-primary bg-spark-primary/5' : 'text-spark-ink-muted hover:text-spark-ink'
                    }`}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                    <span className="hidden sm:inline">Profile</span>
                  </button>

                  <AnimatePresence>
                    {isProfileOpen && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-black/5 overflow-hidden z-50"
                      >
                        <div className="px-4 py-3 border-b border-black/5 bg-spark-bg/50">
                          <p className="text-sm font-semibold text-spark-ink truncate">
                            {session.user.name || "User"}
                          </p>
                          <p className="text-xs text-spark-ink-muted truncate mt-0.5">
                            {session.user.email}
                          </p>
                          <div className="mt-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-spark-primary/10 text-spark-primary uppercase tracking-wider">
                            {(session.user as any).role || "USER"}
                          </div>
                        </div>
                        
                        <div className="p-2">
                          <button
                            onClick={() => {
                              setIsProfileOpen(false);
                              signOut({ callbackUrl: "/login" });
                            }}
                            className="w-full text-left flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                              <polyline points="16 17 21 12 16 7"></polyline>
                              <line x1="21" y1="12" x2="9" y2="12"></line>
                            </svg>
                            Sign out
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
}
