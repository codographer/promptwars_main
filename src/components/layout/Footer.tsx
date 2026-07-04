import React from "react";
import Link from "next/link";
import { Compass, Heart, ShieldCheck, Sparkles, Globe2, Leaf } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full bg-[#0F1117] border-t border-[#2A2E3D] pt-16 pb-12 text-[#9496A1]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-[#2A2E3D]">
          {/* Brand Col */}
          <div className="space-y-4 md:col-span-1">
            <Link href="/" className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-2xl bg-gradient-to-br from-[#E07A5F] to-[#D4AF37] text-white shadow-md">
                <Compass className="w-5 h-5" />
              </div>
              <span className="text-xl font-extrabold tracking-tight text-white">
                WanderLore AI
              </span>
            </Link>
            <p className="text-xs leading-relaxed text-[#9496A1]">
              Empowering global travelers to discover authentic cultural destinations, uncover hidden gems, and engage with local heritage through Generative AI storytelling.
            </p>
            <div className="flex items-center gap-2 text-xs font-semibold text-[#2A9D8F] bg-[#2A9D8F]/10 px-3 py-1.5 rounded-full w-fit border border-[#2A9D8F]/30">
              <Leaf className="w-3.5 h-3.5" />
              <span>100% Sustainable & Ethical Tourism</span>
            </div>
          </div>

          {/* Explore Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#D4AF37]">Cultural Hubs</h4>
            <ul className="space-y-2 text-xs font-medium">
              <li><Link href="/explore/kyoto" className="hover:text-white transition-colors">Kyoto, Japan</Link></li>
              <li><Link href="/explore/oaxaca" className="hover:text-white transition-colors">Oaxaca, Mexico</Link></li>
              <li><Link href="/explore/istanbul" className="hover:text-white transition-colors">Istanbul, Turkey</Link></li>
              <li><Link href="/explore/cusco" className="hover:text-white transition-colors">Cusco, Peru</Link></li>
              <li><Link href="/explore/cairo" className="hover:text-white transition-colors">Cairo, Egypt</Link></li>
            </ul>
          </div>

          {/* AI Features */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#E07A5F]">AI Experiences</h4>
            <ul className="space-y-2 text-xs font-medium">
              <li><Link href="/explore/kyoto?tab=storyteller" className="hover:text-white transition-colors">Time-Traveler Storyteller</Link></li>
              <li><Link href="/explore/kyoto?tab=itinerary" className="hover:text-white transition-colors">Custom Itinerary Builder</Link></li>
              <li><Link href="/explore/kyoto?tab=events" className="hover:text-white transition-colors">Local Events & Workshops</Link></li>
              <li><Link href="/explore/kyoto?tab=gems" className="hover:text-white transition-colors">Secret Hidden Gems</Link></li>
              <li><Link href="/passport" className="hover:text-white transition-colors">Cultural Passport Badges</Link></li>
            </ul>
          </div>

          {/* Compliance & Security */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Trust & Quality</h4>
            <div className="space-y-2.5 text-xs text-[#9496A1]">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#2A9D8F]" />
                <span>NextAuth OAuth & Zod Validation</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe2 className="w-4 h-4 text-[#D4AF37]" />
                <span>Google Gemini AI via Vercel AI SDK</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#E07A5F]" />
                <span>WCAG 2.1 AA Accessibility Compliant</span>
              </div>
            </div>
            <p className="text-[11px] text-[#9496A1]/70 pt-2">
              Built with Next.js 15 App Router, TypeScript, and Tailwind CSS.
            </p>
          </div>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#9496A1]/80 gap-4">
          <p>© 2026 WanderLore AI. All rights reserved. Dedicated to global cultural preservation.</p>
          <div className="flex items-center gap-1.5 text-white font-medium">
            <span>Made with</span>
            <Heart className="w-3.5 h-3.5 text-[#E07A5F] fill-current animate-pulse" />
            <span>for authentic cultural exploration</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
