"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import {
  Compass,
  Headphones,
  CalendarDays,
  User,
  LogOut,
  Sparkles,
  Menu,
  X,
  Award,
} from "lucide-react";
import { AuthModal } from "@/components/auth/AuthModal";

function NavbarInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string; isGuest?: boolean } | null>(null);
  const [badgeCount, setBadgeCount] = useState(3);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dynamicDest, setDynamicDest] = useState("kyoto");

  const isExplorePage = pathname.startsWith("/explore/");
  const currentTab = searchParams.get("tab") || "discover";

  useEffect(() => {
    const timer = setTimeout(() => {
      if (isExplorePage) {
        const parts = pathname.split("/");
        if (parts[2]) {
          const dest = decodeURIComponent(parts[2].split("?")[0]);
          setDynamicDest(dest);
          localStorage.setItem("wanderlore_last_dest", dest);
        }
      } else {
        const saved = localStorage.getItem("wanderlore_last_dest");
        if (saved) setDynamicDest(saved);
      }

      const storedUser = localStorage.getItem("wanderlore_user");
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch {
          setUser(null);
        }
      } else {
        setUser(null);
      }

      const storedBadges = localStorage.getItem("wanderlore_badges");
      if (storedBadges) {
        try {
          const parsed = JSON.parse(storedBadges);
          setBadgeCount(Array.isArray(parsed) ? parsed.length : 3);
        } catch {}
      }
    }, 0);
    return () => clearTimeout(timer);
  }, [pathname, isExplorePage]);

  const handleSignOut = () => {
    localStorage.removeItem("wanderlore_user");
    setUser(null);
    window.location.reload();
  };

  const navLinks = [
    { name: "Discover", href: `/explore/${dynamicDest}?tab=discover`, tabId: "discover", icon: Compass },
    { name: "Time-Traveler", href: `/explore/${dynamicDest}?tab=storyteller`, tabId: "storyteller", icon: Headphones },
    { name: "Itineraries", href: `/explore/${dynamicDest}?tab=itinerary`, tabId: "itinerary", icon: CalendarDays },
    { name: "Local Events", href: `/explore/${dynamicDest}?tab=events`, tabId: "events", icon: Sparkles },
    { name: "Passport", href: "/passport", tabId: "passport", icon: Award, badge: badgeCount },
  ];

  const checkIsActive = (link: typeof navLinks[0]) => {
    if (link.tabId === "passport") {
      return pathname.startsWith("/passport");
    }
    if (isExplorePage) {
      return currentTab === link.tabId;
    }
    return false;
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full glass-nav transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group focus:outline-none">
            <div className="flex items-center justify-center w-11 h-11 rounded-2xl bg-gradient-to-br from-[#E07A5F] via-[#C65D42] to-[#D4AF37] text-white shadow-lg group-hover:scale-105 transition-transform duration-200">
              <Compass className="w-6 h-6 animate-spin-slow" />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-white via-[#F4F1DE] to-[#D4AF37] bg-clip-text text-transparent">
                WanderLore
              </span>
              <span className="text-xs font-semibold px-1.5 py-0.5 ml-1.5 rounded bg-[#E07A5F]/20 text-[#E07A5F] border border-[#E07A5F]/40">
                AI
              </span>
              <p className="text-[10px] text-[#9496A1] font-medium tracking-wide">
                GenAI Cultural Heritage Platform
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 bg-[#181B26]/80 p-1.5 rounded-2xl border border-[#2A2E3D]">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = checkIsActive(link);
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 relative ${
                    isActive
                      ? "bg-[#E07A5F] text-white shadow-md"
                      : "text-[#9496A1] hover:text-[#F4F1DE] hover:bg-[#2A2E3D]/50"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.name}</span>
                  {link.badge !== undefined && (
                    <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 text-[11px] font-extrabold text-[#0F1117] bg-[#D4AF37] rounded-full shadow">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Section */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3 pl-2 border-l border-[#2A2E3D]">
                <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-2xl bg-[#181B26] border border-[#2A2E3D]">
                  <img
                    src={user.image || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80"}
                    alt={user.name}
                    className="w-8 h-8 rounded-full object-cover border border-[#D4AF37]"
                  />
                  <div className="text-left">
                    <p className="text-xs font-bold text-white leading-tight">{user.name}</p>
                    <p className="text-[10px] text-[#2A9D8F] font-semibold">✨ Level 3 Explorer</p>
                  </div>
                </div>
                <button
                  onClick={handleSignOut}
                  title="Sign Out"
                  className="p-2 rounded-xl bg-[#181B26] border border-[#2A2E3D] text-[#9496A1] hover:text-red-400 hover:border-red-400/40 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsAuthOpen(true)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B89628] text-[#0F1117] font-extrabold text-sm shadow-lg hover:brightness-110 transition-all duration-200"
              >
                <User className="w-4 h-4" />
                <span>Sign In / Join</span>
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl bg-[#181B26] border border-[#2A2E3D] text-white focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#181B26] border-b border-[#2A2E3D] px-4 pt-3 pb-6 space-y-2 animate-in slide-in-from-top-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = checkIsActive(link);
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-200 ${
                    isActive
                      ? "bg-[#E07A5F] text-white shadow-md"
                      : "bg-[#0F1117]/60 text-white hover:bg-[#2A2E3D]/50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-5 h-5 text-[#E07A5F]" />
                    <span>{link.name}</span>
                  </div>
                  {link.badge !== undefined && (
                    <span className="px-2 py-0.5 text-xs font-bold text-[#0F1117] bg-[#D4AF37] rounded-full">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}

            <div className="pt-4 border-t border-[#2A2E3D]">
              {user ? (
                <div className="flex items-center justify-between px-2">
                  <div className="flex items-center gap-3">
                    <img src={user.image} alt={user.name} className="w-10 h-10 rounded-full border border-[#D4AF37]" />
                    <div>
                      <p className="text-sm font-bold text-white">{user.name}</p>
                      <p className="text-xs text-[#2A9D8F]">✨ Level 3 Explorer</p>
                    </div>
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="px-3 py-1.5 rounded-lg bg-red-500/20 text-red-300 text-xs font-bold"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setIsAuthOpen(true);
                  }}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B89628] text-[#0F1117] font-extrabold text-sm shadow-md"
                >
                  Sign In / Join
                </button>
              )}
            </div>
          </div>
        )}
      </header>

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onSuccessGuest={(guestUser) => setUser(guestUser)}
      />
    </>
  );
}

export function Navbar() {
  return (
    <Suspense fallback={<header className="sticky top-0 z-40 w-full glass-nav h-20" />}>
      <NavbarInner />
    </Suspense>
  );
}
