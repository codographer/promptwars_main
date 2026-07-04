"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Sparkles, Compass, MapPin, ArrowRight, Award } from "lucide-react";

export function HeroSection() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/explore/${encodeURIComponent(searchTerm.trim().toLowerCase())}`);
    }
  };

  const featuredDestinations = [
    { name: "Kyoto, Japan", slug: "kyoto", tag: "Zen & Silk Weaving", color: "from-[#E07A5F] to-[#C65D42]" },
    { name: "Oaxaca, Mexico", slug: "oaxaca", tag: "Zapotec Alebrijes", color: "from-[#D4AF37] to-[#B89628]" },
    { name: "Istanbul, Turkey", slug: "istanbul", tag: "Ottoman Crafts", color: "from-[#2A9D8F] to-[#264653]" },
    { name: "Cusco, Peru", slug: "cusco", tag: "Inca Stonework", color: "from-[#E07A5F] to-[#D4AF37]" },
  ];

  return (
    <div className="relative overflow-hidden pt-12 pb-24 lg:pt-20 lg:pb-32">
      {/* Background Ambient Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-gradient-to-tr from-[#E07A5F]/20 via-[#D4AF37]/15 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-[#2A9D8F]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#181B26] border border-[#D4AF37]/40 shadow-lg mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
          <Sparkles className="w-4 h-4 text-[#D4AF37] animate-pulse" />
          <span className="text-xs font-bold uppercase tracking-wider text-[#F4F1DE]">
            Powered by Google Gemini Generative AI
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#2A9D8F]" />
          <span className="text-xs font-medium text-[#2A9D8F]">Live Engine</span>
        </div>

        {/* Title */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-none mb-6">
          Discover Destinations Through the{" "}
          <span className="bg-gradient-to-r from-[#E07A5F] via-[#F2A692] to-[#D4AF37] bg-clip-text text-transparent">
            Soul of Local Culture
          </span>
        </h1>

        {/* Subtitle */}
        <p className="max-w-3xl mx-auto text-base sm:text-xl text-[#9496A1] leading-relaxed mb-10">
          Step beyond generic tourist checklists. Our AI uncovers off-the-beaten-path hidden gems, narrates time-traveling historical folklore, suggests sustainable artisan workshops, and builds personalized itineraries that protect heritage.
        </p>

        {/* Search Bar Form */}
        <form
          onSubmit={handleSearch}
          className="max-w-2xl mx-auto relative flex items-center p-2 rounded-2xl glass-panel-gold bg-[#181B26]/90 border border-[#D4AF37]/40 shadow-2xl focus-within:ring-2 focus-within:ring-[#D4AF37] transition-all duration-300"
        >
          <div className="pl-4 text-[#9496A1]">
            <Search className="w-6 h-6" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Where to? Ask a question or theme (e.g., 'Samurai culture in Japan' or 'Lucknow food')..."
            aria-label="Destination Search"
            className="w-full bg-transparent pl-3 pr-4 py-3 text-white text-base sm:text-lg placeholder-[#9496A1]/60 focus:outline-none font-medium"
          />
          <button
            type="submit"
            aria-label="Search Destination"
            className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#E07A5F] to-[#C65D42] text-white font-bold text-sm shadow-lg hover:brightness-110 active:scale-95 transition-all duration-150"
          >
            <span>Explore</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Featured Destination Chips */}
        <div className="mt-8">
          <p className="text-xs font-bold uppercase tracking-wider text-[#9496A1] mb-4">
            ✨ Or explore curated Cultural Heritage Hubs:
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {featuredDestinations.map((dest) => (
              <button
                key={dest.slug}
                onClick={() => router.push(`/explore/${dest.slug}`)}
                className="group flex items-center gap-2.5 px-4 py-2 rounded-xl bg-[#181B26] border border-[#2A2E3D] hover:border-[#D4AF37] shadow-md hover:shadow-xl transition-all duration-200"
              >
                <MapPin className="w-4 h-4 text-[#E07A5F] group-hover:scale-110 transition-transform" />
                <span className="text-sm font-bold text-white group-hover:text-[#F3E5AB]">
                  {dest.name}
                </span>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-[#0F1117] text-[#9496A1]">
                  {dest.tag}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Key Feature Highlights Cards */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <div className="p-6 rounded-2xl bg-[#181B26]/60 border border-[#2A2E3D] text-left hover:border-[#E07A5F]/40 transition-all">
            <div className="w-10 h-10 rounded-xl bg-[#E07A5F]/20 text-[#E07A5F] flex items-center justify-center mb-4">
              <Compass className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white mb-1.5">Uncover Secret Hidden Gems</h3>
            <p className="text-xs text-[#9496A1] leading-relaxed">
              Find secret teahouses, family artisan workshops, and indigenous markets known only to local community elders.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#181B26]/60 border border-[#2A2E3D] text-left hover:border-[#D4AF37]/40 transition-all">
            <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/20 text-[#D4AF37] flex items-center justify-center mb-4">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white mb-1.5">Time-Traveler Audio Guides</h3>
            <p className="text-xs text-[#9496A1] leading-relaxed">
              Listen to rich historical folklore and myths narrated by AI personas like a 16th-century court historian or local bard.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#181B26]/60 border border-[#2A2E3D] text-left hover:border-[#2A9D8F]/40 transition-all">
            <div className="w-10 h-10 rounded-xl bg-[#2A9D8F]/20 text-[#2A9D8F] flex items-center justify-center mb-4">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white mb-1.5">Ethical Heritage Protection</h3>
            <p className="text-xs text-[#9496A1] leading-relaxed">
              Learn respectful cultural etiquette, tipping rules, and how your visit directly supports endangered craft guilds.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
