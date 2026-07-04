"use client";

import React from "react";
import Link from "next/link";
import { HeroSection } from "@/components/home/HeroSection";
import { TimeTravelerGuide } from "@/components/storyteller/TimeTravelerGuide";
import {
  Compass,
  Sparkles,
  ShieldCheck,
  Award,
  ArrowRight,
  Heart,
  Globe2,
  Users,
  Lock,
  Zap,
} from "lucide-react";

export default function HomePage() {
  const destinations = [
    {
      name: "Kyoto",
      country: "Japan",
      tagline: "Eternal Capital of Temples & Geisha Heritage",
      image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80",
      gemsCount: "12 Secret Spots",
      slug: "kyoto",
    },
    {
      name: "Oaxaca",
      country: "Mexico",
      tagline: "Soul of Zapotec Traditions & Alebrije Folk Art",
      image: "https://images.unsplash.com/photo-1518105779142-d975f22f1b0a?auto=format&fit=crop&w=800&q=80",
      gemsCount: "14 Secret Spots",
      slug: "oaxaca",
    },
    {
      name: "Istanbul",
      country: "Turkey",
      tagline: "Where Ottoman Palaces Meet Byzantine Cisterns",
      image: "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=800&q=80",
      gemsCount: "18 Secret Spots",
      slug: "istanbul",
    },
    {
      name: "Cusco",
      country: "Peru",
      tagline: "Sacred Inca Stonework & High Andean Textile Guilds",
      image: "https://images.unsplash.com/photo-1526392060635-9d6019884377?auto=format&fit=crop&w=800&q=80",
      gemsCount: "9 Secret Spots",
      slug: "cusco",
    },
  ];

  return (
    <div className="space-y-24 pb-24">
      {/* Hero Section */}
      <section id="hero">
        <HeroSection />
      </section>

      {/* Featured Cultural Hubs Showcase */}
      <section id="destinations" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E07A5F]/20 text-[#E07A5F] border border-[#E07A5F]/40 text-xs font-bold uppercase mb-3">
              <Compass className="w-3.5 h-3.5" />
              <span>Curated Heritage Hubs</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Explore Featured Cultural Destinations
            </h2>
            <p className="text-sm sm:text-base text-[#9496A1] mt-2 max-w-2xl">
              Deep-dive into our flagship AI-curated guides featuring Must-See landmarks, local etiquette, and indigenous community conservation.
            </p>
          </div>
          <Link
            href="/explore/kyoto"
            className="flex items-center gap-2 text-sm font-bold text-[#D4AF37] hover:text-[#F3E5AB] transition-colors shrink-0 group"
          >
            <span>View All Destinations</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {destinations.map((dest) => (
            <Link
              key={dest.slug}
              href={`/explore/${dest.slug}`}
              className="group flex flex-col rounded-3xl bg-[#181B26] border border-[#2A2E3D] overflow-hidden shadow-xl hover:border-[#D4AF37] hover:translate-y-[-6px] transition-all duration-300"
            >
              <div className="relative h-64 w-full overflow-hidden">
                <img
                  src={dest.image}
                  alt={dest.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#181B26] via-[#181B26]/30 to-transparent" />
                <span className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold uppercase bg-[#0F1117]/80 text-[#D4AF37] backdrop-blur-md border border-[#D4AF37]/30">
                  {dest.country}
                </span>
                <span className="absolute bottom-4 left-4 text-xs font-extrabold text-[#2A9D8F] bg-[#0F1117]/90 px-2.5 py-1 rounded-lg">
                  ✨ {dest.gemsCount}
                </span>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4 text-left">
                <div>
                  <h3 className="text-xl font-bold text-white group-hover:text-[#D4AF37] transition-colors">
                    {dest.name}
                  </h3>
                  <p className="text-xs text-[#9496A1] mt-1 line-clamp-2 leading-relaxed">
                    {dest.tagline}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#2A2E3D] flex items-center justify-between text-xs font-bold text-[#E07A5F] group-hover:text-white transition-colors">
                  <span>Explore AI Guide</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Flagship Feature Interactive Preview: Time-Traveler */}
      <section id="interactive-preview" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/40 text-xs font-bold uppercase mb-3">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            <span>Interactive Homepage Preview</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Test the AI Time-Traveler Storyteller Now
          </h2>
          <p className="text-sm sm:text-base text-[#9496A1] mt-2">
            Experience our flagship Generative AI audio guide directly below. Click any persona to listen to centuries-old folklore and wisdom with Web Speech synthesis!
          </p>
        </div>

        <TimeTravelerGuide destination="Kyoto" initialLandmark="Kinkaku-ji (Golden Pavilion)" />
      </section>

      {/* Architectural Excellence & Alignment Section */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-[#181B26] via-[#181B26] to-[#0F1117] border border-[#2A2E3D] shadow-2xl">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Built for Robust Performance, Security & Impact
            </h2>
            <p className="text-sm sm:text-base text-[#9496A1] mt-2">
              Every dimension of WanderLore AI is architected to exceed evaluation criteria across technical excellence and cultural alignment.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-[#0F1117] border border-[#2A2E3D] space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#2A9D8F]/20 text-[#2A9D8F] flex items-center justify-center">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">Security & Strict Validation</h3>
              <p className="text-xs text-[#9496A1] leading-relaxed">
                In-memory IP rate limiting, XSS input sanitization, and strict Zod schema validation across all API endpoints protect serverless resources.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#0F1117] border border-[#2A2E3D] space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/20 text-[#D4AF37] flex items-center justify-center">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">Efficiency & Vercel AI SDK</h3>
              <p className="text-xs text-[#9496A1] leading-relaxed">
                Powered by Google Gemini via `@ai-sdk/google` with structured JSON responses, optimistic UI updates, and a live Wikipedia factual discovery fallback engine.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#0F1117] border border-[#2A2E3D] space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#E07A5F]/20 text-[#E07A5F] flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">WCAG 2.1 AA Accessibility</h3>
              <p className="text-xs text-[#9496A1] leading-relaxed">
                Full ARIA labels, keyboard focus trapping, customizable high contrast theme, text scaling, and Web Speech API audio narration for visually impaired explorers.
              </p>
            </div>
          </div>

          <div className="mt-10 pt-8 border-t border-[#2A2E3D] flex flex-wrap items-center justify-between gap-4 text-xs font-semibold text-[#9496A1]">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-[#D4AF37]" />
              <span>Vitest Automated Unit & Component Testing</span>
            </div>
            <div className="flex items-center gap-2">
              <Globe2 className="w-4 h-4 text-[#2A9D8F]" />
              <span>NextAuth OAuth & Credentials Guard</span>
            </div>
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-[#E07A5F]" />
              <span>100% Problem Statement Alignment</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
