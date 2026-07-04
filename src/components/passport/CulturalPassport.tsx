"use client";

import React, { useState, useEffect } from "react";
import {
  Award,
  Bookmark,
  Trash2,
  Sparkles,
  CheckCircle2,
  Compass,
  Calendar,
  Headphones,
  MapPin,
  Share2,
} from "lucide-react";
import confetti from "canvas-confetti";

export function CulturalPassport() {
  const [badges, setBadges] = useState<any[]>([]);
  const [savedItems, setSavedItems] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);

  const defaultBadges = [
    {
      id: "starter_explorer",
      title: "Global Cultural Explorer",
      description: "Initialized your WanderLore AI Cultural Passport.",
      icon: Compass,
      category: "explorer",
      unlockedAt: "2026-07-04",
    },
    {
      id: "storyteller_master",
      title: "Time-Traveler Scholar",
      description: "Listened to historical folklore across centuries.",
      icon: Headphones,
      category: "storyteller",
      unlockedAt: "2026-07-04",
    },
    {
      id: "itinerary_master",
      title: "Master Cultural Planner",
      description: "Created a sustainable, authentic multi-day heritage itinerary.",
      icon: Calendar,
      category: "explorer",
      unlockedAt: "2026-07-04",
    },
  ];

  useEffect(() => {
    const storedUser = localStorage.getItem("wanderlore_user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {}
    } else {
      setUser({
        name: "Elena Vance",
        email: "elena.vance@anthropologist.org",
        image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80",
      });
    }

    const storedBadges = localStorage.getItem("wanderlore_badges");
    if (storedBadges) {
      try {
        setBadges(JSON.parse(storedBadges));
      } catch (e) {
        setBadges(defaultBadges);
      }
    } else {
      setBadges(defaultBadges);
      localStorage.setItem("wanderlore_badges", JSON.stringify(defaultBadges));
    }

    const storedItems = localStorage.getItem("wanderlore_saved_items");
    if (storedItems) {
      try {
        setSavedItems(JSON.parse(storedItems));
      } catch (e) {}
    } else {
      // Starter saved item
      const starter = [
        {
          id: "starter-1",
          type: "landmark",
          title: "Fushimi Inari Taisha",
          subtitle: "Kyoto, Japan",
          savedAt: "2026-07-04",
        },
        {
          id: "starter-2",
          type: "hidden_gem",
          title: "San Martín Tilcajete Alebrije Workshops",
          subtitle: "Oaxaca, Mexico",
          savedAt: "2026-07-04",
        },
      ];
      setSavedItems(starter);
      localStorage.setItem("wanderlore_saved_items", JSON.stringify(starter));
    }
  }, []);

  const handleRemoveItem = (id: string) => {
    const updated = savedItems.filter((i) => i.id !== id);
    setSavedItems(updated);
    localStorage.setItem("wanderlore_saved_items", JSON.stringify(updated));
  };

  const handleCelebrate = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#E07A5F", "#D4AF37", "#2A9D8F", "#F4F1DE"],
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Passport Profile Banner */}
      <div className="relative overflow-hidden rounded-3xl glass-panel-gold bg-[#181B26] border border-[#D4AF37]/40 p-8 sm:p-12 shadow-2xl">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-gradient-to-br from-[#D4AF37]/20 to-[#E07A5F]/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <img
              src={user?.image || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80"}
              alt={user?.name || "Explorer"}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl object-cover border-2 border-[#D4AF37] shadow-xl"
            />
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] text-xs font-bold uppercase mb-2">
                <Award className="w-3.5 h-3.5" />
                <span>Official AI Cultural Passport</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                {user?.name || "Elena Vance"}
              </h1>
              <p className="text-xs sm:text-sm text-[#9496A1] mt-1 flex items-center gap-2">
                <span>📧 {user?.email || "explorer@wanderlore.ai"}</span>
                <span>•</span>
                <span className="text-[#2A9D8F] font-semibold">✨ Level 3 Heritage Ambassador</span>
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
            <button
              onClick={handleCelebrate}
              className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#D4AF37] to-[#B89628] text-[#0F1117] font-black text-sm shadow-xl hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 animate-spin-slow" />
              <span>Claim Ambassador Award</span>
            </button>
          </div>
        </div>
      </div>

      {/* Badges Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-[#2A2E3D] pb-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
              <Award className="w-6 h-6 text-[#D4AF37]" />
              <span>Earned Cultural Stamps & Badges ({badges.length})</span>
            </h2>
            <p className="text-xs text-[#9496A1] mt-0.5">
              Unlock stamps by engaging with storytelling personas, saving ethical workshops, and designing itineraries.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {badges.map((b, idx) => (
            <div
              key={idx}
              className="p-6 rounded-3xl bg-[#181B26] border border-[#D4AF37]/30 shadow-xl flex items-start gap-4 relative overflow-hidden group hover:border-[#D4AF37] transition-all"
            >
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#D4AF37]/20 to-[#E07A5F]/20 text-[#D4AF37] flex items-center justify-center shrink-0 border border-[#D4AF37]/40 group-hover:scale-110 transition-transform">
                <Award className="w-7 h-7 animate-pulse" />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#2A9D8F]">
                  ✓ Unlocked {b.unlockedAt || "Today"}
                </span>
                <h3 className="text-base font-bold text-white">{b.title}</h3>
                <p className="text-xs text-[#9496A1] leading-relaxed">{b.description}</p>
              </div>
            </div>
          ))}

          {/* Locked Mystery Badge Placeholder */}
          <div className="p-6 rounded-3xl bg-[#0F1117]/60 border border-dashed border-[#2A2E3D] flex items-center gap-4 text-left opacity-60">
            <div className="w-14 h-14 rounded-2xl bg-[#181B26] text-[#9496A1] flex items-center justify-center shrink-0 border border-[#2A2E3D]">
              <span className="text-xl font-bold">🔒</span>
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#9496A1]">
                Locked Stamp
              </span>
              <h3 className="text-base font-bold text-white">Silk Road Archivist</h3>
              <p className="text-xs text-[#9496A1]">Explore 5 off-the-beaten-path hidden gems in Istanbul or Cairo.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bookmarked Hidden Gems & Itineraries */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-[#2A2E3D] pb-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
              <Bookmark className="w-6 h-6 text-[#E07A5F]" />
              <span>Saved Heritage Bookmarks ({savedItems.length})</span>
            </h2>
            <p className="text-xs text-[#9496A1] mt-0.5">
              Your bookmarked must-see landmarks, secret hidden gems, and custom cultural itineraries.
            </p>
          </div>
        </div>

        {savedItems.length === 0 ? (
          <div className="p-16 rounded-3xl bg-[#181B26] border border-[#2A2E3D] text-center space-y-3">
            <Bookmark className="w-12 h-12 text-[#9496A1] mx-auto opacity-40" />
            <h3 className="text-lg font-bold text-white">Your Passport Journal is Empty</h3>
            <p className="text-xs text-[#9496A1]">
              Browse destinations or listen to AI stories to save bookmarks here!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedItems.map((item) => (
              <div
                key={item.id}
                className="flex flex-col justify-between p-6 rounded-3xl bg-[#181B26] border border-[#2A2E3D] shadow-xl hover:border-[#E07A5F]/40 transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase bg-[#0F1117] text-[#E07A5F] border border-[#2A2E3D]">
                      📌 {item.type.replace("_", " ")}
                    </span>
                    <span className="text-[10px] text-[#9496A1]">Saved {item.savedAt}</span>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-1">{item.title}</h3>
                  <p className="text-xs text-[#D4AF37] font-semibold flex items-center gap-1 mb-4">
                    <MapPin className="w-3.5 h-3.5" /> {item.subtitle}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#2A2E3D] flex items-center justify-between">
                  <span className="text-[11px] text-[#2A9D8F] font-medium flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Synced to Local Storage
                  </span>
                  <button
                    onClick={() => handleRemoveItem(item.id)}
                    title="Remove Bookmark"
                    className="p-2 rounded-xl bg-[#0F1117] text-[#9496A1] hover:text-red-400 hover:bg-red-500/10 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
