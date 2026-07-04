"use client";

import React, { useState, useCallback } from "react";
import Image from "next/image";
import {
  Compass,
  MapPin,
  Sparkles,
  ShieldCheck,
  Heart,
  BookmarkPlus,
  Check,
  Info,
  Headphones,
  AlertTriangle,
  Users,
} from "lucide-react";
import { DiscoverResponse } from "@/lib/types";

interface DestinationExplorerProps {
  data: DiscoverResponse;
  onSelectLandmarkForStory?: (landmarkName: string) => void;
}

export function DestinationExplorer({
  data,
  onSelectLandmarkForStory,
}: DestinationExplorerProps) {
  const [activeTab, setActiveTab] = useState<"landmarks" | "gems" | "etiquette" | "heritage">("landmarks");
  const [savedItems, setSavedItems] = useState<Record<string, boolean>>({});

  const handleSave = useCallback((id: string, title: string, type: "landmark" | "hidden_gem") => {
    const item = {
      id: `${type}-${id}-${Math.random().toString(36).slice(2, 9)}`,
      type,
      title,
      subtitle: data.destination,
      savedAt: new Date().toLocaleDateString(),
    };

    const existing = JSON.parse(localStorage.getItem("wanderlore_saved_items") || "[]");
    localStorage.setItem("wanderlore_saved_items", JSON.stringify([item, ...existing]));

    setSavedItems((prev) => ({ ...prev, [id]: true }));
    setTimeout(() => {
      setSavedItems((prev) => ({ ...prev, [id]: false }));
    }, 3000);
  }, [data.destination]);

  return (
    <div className="space-y-8">
      {/* Destination Header Banner */}
      <div className="relative overflow-hidden rounded-3xl glass-panel bg-[#181B26] border border-[#2A2E3D] p-8 sm:p-12 shadow-2xl text-left">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-gradient-to-br from-[#E07A5F]/20 to-[#D4AF37]/20 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/40 text-xs font-bold uppercase mb-4">
            <MapPin className="w-3.5 h-3.5" />
            <span>{data.destination}, {data.country}</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight mb-4">
            {data.tagline}
          </h1>
          <p className="text-base sm:text-lg text-[#9496A1] leading-relaxed">
            {data.description}
          </p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-[#2A2E3D] pb-3" role="tablist" aria-label="Destination Categories">
        <button
          onClick={() => setActiveTab("landmarks")}
          role="tab"
          aria-selected={activeTab === "landmarks"}
          className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-bold transition-all ${
            activeTab === "landmarks"
              ? "bg-[#E07A5F] text-white shadow-lg scale-105"
              : "bg-[#181B26] text-[#9496A1] hover:text-white hover:bg-[#2A2E3D]"
          }`}
        >
          <Compass className="w-4 h-4" />
          <span>Must-See Landmarks ({data.landmarks.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("gems")}
          role="tab"
          aria-selected={activeTab === "gems"}
          className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-bold transition-all ${
            activeTab === "gems"
              ? "bg-[#D4AF37] text-[#0F1117] shadow-lg scale-105"
              : "bg-[#181B26] text-[#9496A1] hover:text-white hover:bg-[#2A2E3D]"
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Secret Hidden Gems ({data.hiddenGems.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("etiquette")}
          role="tab"
          aria-selected={activeTab === "etiquette"}
          className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-bold transition-all ${
            activeTab === "etiquette"
              ? "bg-[#2A9D8F] text-white shadow-lg scale-105"
              : "bg-[#181B26] text-[#9496A1] hover:text-white hover:bg-[#2A2E3D]"
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Local Etiquette &amp; Do&apos;s</span>
        </button>

        <button
          onClick={() => setActiveTab("heritage")}
          role="tab"
          aria-selected={activeTab === "heritage"}
          className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-bold transition-all ${
            activeTab === "heritage"
              ? "bg-[#264653] text-white shadow-lg scale-105"
              : "bg-[#181B26] text-[#9496A1] hover:text-white hover:bg-[#2A2E3D]"
          }`}
        >
          <Heart className="w-4 h-4 text-[#E07A5F]" />
          <span>Heritage Protection</span>
        </button>
      </div>

      {/* Tab Content 1: Must-See Landmarks */}
      {activeTab === "landmarks" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-300">
          {data.landmarks.map((landmark) => (
            <div
              key={landmark.id}
              className="group flex flex-col rounded-3xl bg-[#181B26] border border-[#2A2E3D] overflow-hidden shadow-xl hover:border-[#E07A5F]/50 transition-all duration-300"
            >
              <div className="relative h-56 w-full overflow-hidden">
                <Image
                  unoptimized
                  src={landmark.image}
                  alt={landmark.name}
                  width={600}
                  height={400}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#181B26] via-transparent to-transparent" />
                <span className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold uppercase bg-[#0F1117]/80 text-[#D4AF37] backdrop-blur-md border border-[#D4AF37]/30">
                  {landmark.category}
                </span>
                <button
                  onClick={() => handleSave(landmark.id, landmark.name, "landmark")}
                  title={`Save ${landmark.name} to Passport`}
                  aria-label={`Save ${landmark.name} to Passport`}
                  className="absolute top-4 right-4 p-2.5 rounded-full bg-[#0F1117]/80 text-white hover:bg-[#E07A5F] transition-colors"
                >
                  {savedItems[landmark.id] ? <Check className="w-4 h-4 text-[#2A9D8F]" /> : <BookmarkPlus className="w-4 h-4" />}
                </button>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4 text-left">
                <div>
                  <h3 className="text-xl font-bold text-white group-hover:text-[#E07A5F] transition-colors">
                    {landmark.name}
                  </h3>
                  <p className="text-xs text-[#9496A1] mt-2 leading-relaxed">
                    {landmark.description}
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#0F1117] border border-[#2A2E3D] text-xs space-y-1.5">
                  <div className="flex items-start gap-1.5 text-[#D4AF37]">
                    <Info className="w-4 h-4 shrink-0 mt-0.5" />
                    <span><strong>Historical Significance:</strong> {landmark.historicalSignificance}</span>
                  </div>
                  <p className="text-[#2A9D8F] font-semibold pt-1">
                    🕒 <strong>Best Time:</strong> {landmark.bestTimeToVisit}
                  </p>
                </div>

                <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-[#2A2E3D]">
                  <div className="flex flex-wrap gap-1.5">
                    {landmark.tags.map((t, idx) => (
                      <span key={idx} className="text-[10px] px-2 py-0.5 rounded bg-[#0F1117] text-[#9496A1]">
                        #{t}
                      </span>
                    ))}
                  </div>

                  {onSelectLandmarkForStory && (
                    <button
                      onClick={() => onSelectLandmarkForStory(landmark.name)}
                      aria-label={`Hear AI Story about ${landmark.name}`}
                      className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#E07A5F]/20 text-[#E07A5F] hover:bg-[#E07A5F] hover:text-white text-xs font-bold transition-all"
                    >
                      <Headphones className="w-3.5 h-3.5" />
                      <span>Hear AI Story</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab Content 2: Secret Hidden Gems */}
      {activeTab === "gems" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in duration-300">
          {data.hiddenGems.map((gem) => (
            <div
              key={gem.id}
              className="flex flex-col rounded-3xl glass-panel-gold bg-[#181B26] border border-[#D4AF37]/30 p-6 text-left shadow-xl hover:translate-y-[-4px] transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase bg-[#D4AF37] text-[#0F1117]">
                  ✨ {gem.category}
                </span>
                <button
                  onClick={() => handleSave(gem.id, gem.name, "hidden_gem")}
                  aria-label={`Save ${gem.name} to Passport`}
                  title={`Save ${gem.name} to Passport`}
                  className="p-1.5 rounded-lg bg-[#0F1117] text-[#9496A1] hover:text-white"
                >
                  {savedItems[gem.id] ? <Check className="w-4 h-4 text-[#2A9D8F]" /> : <BookmarkPlus className="w-4 h-4" />}
                </button>
              </div>

              <h3 className="text-lg font-bold text-white mb-1">{gem.name}</h3>
              <p className="text-xs text-[#E07A5F] font-semibold mb-3 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" /> {gem.location}
              </p>

              <div className="p-3.5 rounded-2xl bg-[#0F1117]/80 border border-[#2A2E3D] text-xs text-[#F4F1DE] space-y-2 mb-4">
                <p className="flex items-start gap-1.5">
                  <Sparkles className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                  <span><strong>Secret Local Tip:</strong> {gem.secretTip}</span>
                </p>
                <p className="text-[#9496A1] pt-1 border-t border-[#2A2E3D]">
                  <strong>Cultural Relevance:</strong> {gem.culturalRelevance}
                </p>
              </div>

              {onSelectLandmarkForStory && (
                <button
                  onClick={() => onSelectLandmarkForStory(gem.name)}
                  className="mt-auto w-full py-2 rounded-xl bg-[#0F1117] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#0F1117] text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                >
                  <Headphones className="w-3.5 h-3.5" />
                  <span>Hear Secret Story</span>
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Tab Content 3: Local Etiquette & Traditions */}
      {activeTab === "etiquette" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in duration-300">
          {data.etiquette.map((rule, idx) => (
            <div
              key={idx}
              className="p-6 rounded-3xl bg-[#181B26] border border-[#2A9D8F]/40 shadow-xl text-left space-y-4"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2A9D8F]/20 text-[#2A9D8F] text-xs font-bold uppercase">
                <ShieldCheck className="w-4 h-4" />
                <span>{rule.category.replace("_", " ")}</span>
              </div>
              <h3 className="text-lg font-bold text-white">{rule.title}</h3>
              <p className="text-xs text-[#9496A1] leading-relaxed">{rule.description}</p>

              <div className="space-y-3 pt-2 border-t border-[#2A2E3D]">
                <div>
                  <span className="text-xs font-bold text-[#2A9D8F] block mb-1.5">✅ What to Do:</span>
                  <ul className="space-y-1.5 text-xs text-[#F4F1DE]">
                    {rule.doList.map((d, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-[#2A9D8F] font-bold">•</span>
                        <span>{d}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-2">
                  <span className="text-xs font-bold text-[#E07A5F] block mb-1.5">❌ What to Avoid:</span>
                  <ul className="space-y-1.5 text-xs text-[#9496A1]">
                    {rule.dontList.map((d, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-[#E07A5F] font-bold">•</span>
                        <span>{d}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab Content 4: Heritage Protection */}
      {activeTab === "heritage" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-300">
          {data.heritage.map((item, idx) => (
            <div
              key={idx}
              className="p-8 rounded-3xl bg-gradient-to-br from-[#181B26] to-[#0F1117] border border-[#E07A5F]/40 shadow-xl text-left space-y-5"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold uppercase text-[#E07A5F]">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Endangered Heritage Report</span>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-extrabold ${
                    item.endangeredStatus === "Critical"
                      ? "bg-red-500/20 text-red-400 border border-red-500/40"
                      : "bg-yellow-500/20 text-yellow-400 border border-yellow-500/40"
                  }`}
                >
                  Status: {item.endangeredStatus}
                </span>
              </div>

              <h3 className="text-xl font-bold text-white">{item.title}</h3>

              <div className="p-4 rounded-2xl bg-[#0F1117] border border-[#2A2E3D] text-xs space-y-2">
                <div className="flex items-start gap-2 text-[#F4F1DE]">
                  <Users className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                  <span><strong>Indigenous Community / Guild:</strong> {item.indigenousCommunity}</span>
                </div>
                <p className="text-[#9496A1] pt-1 border-t border-[#2A2E3D]">
                  <strong>Preservation Effort:</strong> {item.preservationEffort}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#2A9D8F]/10 border border-[#2A9D8F]/30 text-xs text-[#F4F1DE]">
                <span className="font-bold text-[#2A9D8F] block mb-1">🌱 How Your Visit Directly Supports Them:</span>
                <p className="text-[#9496A1] leading-relaxed">{item.howToSupport}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
