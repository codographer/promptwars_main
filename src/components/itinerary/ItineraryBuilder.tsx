"use client";

import React, { useState, useEffect } from "react";
import {
  Calendar,
  Sparkles,
  DollarSign,
  Heart,
  Check,
  BookmarkPlus,
  Loader2,
  Download,
  Utensils,
  Sun,
  Sunset,
  Moon,
  Info,
  ShieldCheck,
} from "lucide-react";
import { ItineraryResponse, ItineraryDay } from "@/lib/types";

interface ItineraryBuilderProps {
  destination: string;
}

export function ItineraryBuilder({ destination }: ItineraryBuilderProps) {
  const [days, setDays] = useState(3);
  const [budget, setBudget] = useState<"budget" | "moderate" | "luxury">("moderate");
  const [interests, setInterests] = useState<string[]>([
    "Gastronomy & Culinary Arts",
    "Sacred Sites & Temples",
    "Traditional Handcrafts & Textiles",
  ]);
  const [accessibilityNeeds, setAccessibilityNeeds] = useState("");
  const [itinerary, setItinerary] = useState<ItineraryResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const interestOptions = [
    "Gastronomy & Culinary Arts",
    "Sacred Sites & Temples",
    "Traditional Handcrafts & Textiles",
    "Historical Folklore & Myths",
    "Zen Gardens & Nature",
    "Indigenous Community Interaction",
  ];

  const toggleInterest = (interest: string) => {
    setInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest]
    );
  };

  const fetchItinerary = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/ai/itinerary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          destination,
          days,
          budget,
          interests,
          accessibilityNeeds: accessibilityNeeds.trim() || undefined,
        }),
      });

      const json = await res.json();
      if (json.success && json.data) {
        setItinerary(json.data);
      } else {
        setItinerary(null);
      }
    } catch (e) {
      setItinerary(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItinerary();
  }, [destination]);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (interests.length === 0) {
      alert("Please select at least one cultural interest.");
      return;
    }
    fetchItinerary();
  };

  const handleSaveItinerary = () => {
    if (!itinerary) return;
    const item = {
      id: `itinerary-${Date.now()}`,
      type: "itinerary" as any,
      title: itinerary.title,
      subtitle: `${itinerary.totalDays} Days • ${destination}`,
      savedAt: new Date().toLocaleDateString(),
      data: itinerary,
    };

    const existing = JSON.parse(localStorage.getItem("wanderlore_saved_items") || "[]");
    localStorage.setItem("wanderlore_saved_items", JSON.stringify([item, ...existing]));

    // Award badge
    const badges = JSON.parse(localStorage.getItem("wanderlore_badges") || "[]");
    if (!badges.some((b: any) => b.id === "itinerary_master")) {
      badges.push({
        id: "itinerary_master",
        title: "Master Cultural Planner",
        description: "Created a sustainable, authentic multi-day heritage itinerary.",
        iconName: "Calendar",
        category: "explorer",
        unlockedAt: new Date().toLocaleDateString(),
      });
      localStorage.setItem("wanderlore_badges", JSON.stringify(badges));
    }

    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleExportText = () => {
    if (!itinerary) return;
    let content = `# ${itinerary.title}\n\n`;
    content += `**Destination:** ${itinerary.destination} | **Duration:** ${itinerary.totalDays} Days\n`;
    content += `**Sustainability Summary:** ${itinerary.sustainabilitySummary}\n\n---\n\n`;

    itinerary.days.forEach((d) => {
      content += `## Day ${d.dayNumber}: ${d.theme}\n\n`;
      content += `### Morning (${d.morningActivity.time}): ${d.morningActivity.title}\n${d.morningActivity.description}\n*Significance: ${d.morningActivity.culturalSignificance}*\n\n`;
      content += `### Afternoon (${d.afternoonActivity.time}): ${d.afternoonActivity.title}\n${d.afternoonActivity.description}\n*Significance: ${d.afternoonActivity.culturalSignificance}*\n\n`;
      content += `### Evening (${d.eveningActivity.time}): ${d.eveningActivity.title}\n${d.eveningActivity.description}\n*Significance: ${d.eveningActivity.culturalSignificance}*\n\n`;
      content += `**🍽️ Culinary Recommendation:** ${d.culinaryRecommendation.dishName} - ${d.culinaryRecommendation.description} (${d.culinaryRecommendation.whereToFind})\n\n`;
      content += `**💡 Local Etiquette Tip:** ${d.localInteractionTip}\n\n---\n\n`;
    });

    const blob = new Blob([content], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${destination.toLowerCase()}_itinerary.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="w-full rounded-3xl glass-panel bg-[#181B26] border border-[#2A2E3D] p-6 lg:p-10 text-[#F4F1DE] shadow-2xl">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-[#2A2E3D]">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E07A5F]/20 text-[#E07A5F] border border-[#E07A5F]/40 text-xs font-bold uppercase mb-3">
            <Calendar className="w-3.5 h-3.5" />
            <span>AI Cultural Itinerary Architect</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Design Your Custom Journey in {destination}
          </h2>
          <p className="text-sm text-[#9496A1] mt-1">
            Build sustainable, multi-day routes centered around authentic guild interactions and living traditions.
          </p>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Col: Builder Controls (1 span) */}
        <form onSubmit={handleGenerate} className="space-y-6 lg:border-r lg:border-[#2A2E3D] lg:pr-8">
          {/* Duration Selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#9496A1] mb-2">
              Duration (Days): <span className="text-white font-extrabold">{days} Days</span>
            </label>
            <input
              type="range"
              min="1"
              max="7"
              value={days}
              onChange={(e) => setDays(Number(e.target.value))}
              className="w-full accent-[#E07A5F] bg-[#0F1117] h-2 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-[#9496A1] mt-1 font-semibold">
              <span>1 Day (Highlight)</span>
              <span>3 Days (Standard)</span>
              <span>7 Days (Deep Dive)</span>
            </div>
          </div>

          {/* Budget Selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#9496A1] mb-2">
              Travel Budget Level
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(["budget", "moderate", "luxury"] as const).map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setBudget(lvl)}
                  className={`py-2 px-3 rounded-xl text-xs font-bold capitalize transition-all border ${
                    budget === lvl
                      ? "bg-[#D4AF37] text-[#0F1117] border-[#D4AF37] shadow-md scale-105"
                      : "bg-[#0F1117] text-[#9496A1] border-[#2A2E3D] hover:text-white"
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          {/* Cultural Interests Checkboxes */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#9496A1] mb-2">
              Cultural Focus Areas
            </label>
            <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
              {interestOptions.map((option) => {
                const isSelected = interests.includes(option);
                return (
                  <div
                    key={option}
                    onClick={() => toggleInterest(option)}
                    className={`flex items-center justify-between p-3 rounded-xl border text-xs font-bold cursor-pointer transition-all ${
                      isSelected
                        ? "bg-[#E07A5F]/15 border-[#E07A5F] text-white"
                        : "bg-[#0F1117] border-[#2A2E3D] text-[#9496A1] hover:border-[#9496A1]"
                    }`}
                  >
                    <span>{option}</span>
                    <div
                      className={`w-4 h-4 rounded flex items-center justify-center border transition-colors ${
                        isSelected
                          ? "bg-[#E07A5F] border-[#E07A5F] text-white"
                          : "border-[#2A2E3D] bg-[#181B26]"
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Accessibility Needs */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#9496A1] mb-1">
              Accessibility Requirements (Optional)
            </label>
            <input
              type="text"
              value={accessibilityNeeds}
              onChange={(e) => setAccessibilityNeeds(e.target.value)}
              placeholder="e.g., Step-free access, wheelchair paths"
              className="w-full px-3 py-2 rounded-xl bg-[#181B26] border border-[#2A2E3D] text-xs text-white placeholder-[#9496A1]/60 focus:outline-none focus:border-[#D4AF37]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#E07A5F] to-[#C65D42] text-white font-extrabold text-sm shadow-lg hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
            <span>{loading ? "Designing Itinerary..." : "Generate AI Itinerary"}</span>
          </button>
        </form>

        {/* Right Col: Itinerary Results Display (2 span) */}
        <div className="lg:col-span-2 space-y-6">
          {loading ? (
            <div className="p-20 rounded-3xl bg-[#0F1117] border border-[#2A2E3D] flex flex-col items-center justify-center text-center">
              <Loader2 className="w-12 h-12 text-[#E07A5F] animate-spin mb-4" />
              <h3 className="text-xl font-bold text-white">Consulting Master Travel Anthropologists...</h3>
              <p className="text-xs text-[#9496A1] mt-1">
                Optimizing routes for cultural immersion and seasonal authenticity in {destination}.
              </p>
            </div>
          ) : !itinerary ? (
            <div className="p-16 rounded-3xl bg-[#0F1117] border border-[#2A2E3D] text-center flex flex-col items-center justify-center">
              <Sparkles className="w-10 h-10 text-[#D4AF37] mb-3 opacity-60" />
              <h3 className="text-lg font-bold text-white">No Custom Itinerary Generated Yet</h3>
              <p className="text-xs text-[#9496A1] max-w-md mt-1">
                Select your preferred duration, budget, and cultural interests on the left, then click Generate AI Itinerary to craft a personalized journey for {destination}.
              </p>
            </div>
          ) : (
            <div className="space-y-6 animate-in fade-in duration-300">
              {/* Itinerary Title & Actions Header */}
              <div className="p-6 rounded-3xl bg-[#0F1117] border border-[#2A2E3D] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-extrabold text-[#D4AF37] uppercase tracking-wider block">
                    ✨ Custom AI Heritage Schedule
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold text-white mt-1">
                    {itinerary.title}
                  </h3>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={handleExportText}
                    title="Export as Markdown"
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#181B26] border border-[#2A2E3D] text-[#F4F1DE] hover:bg-[#2A2E3D] text-xs font-bold transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Export</span>
                  </button>

                  <button
                    onClick={handleSaveItinerary}
                    disabled={saved}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#D4AF37] text-[#0F1117] font-extrabold text-xs shadow hover:bg-[#F3E5AB] transition-colors disabled:opacity-50"
                  >
                    {saved ? <Check className="w-4 h-4" /> : <BookmarkPlus className="w-4 h-4" />}
                    <span>{saved ? "Saved to Passport" : "Save Itinerary"}</span>
                  </button>
                </div>
              </div>

              {/* Sustainability Summary Banner */}
              <div className="p-5 rounded-2xl bg-[#2A9D8F]/10 border border-[#2A9D8F]/30 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-[#2A9D8F] shrink-0 mt-0.5" />
                <div className="text-left">
                  <h4 className="text-xs font-extrabold text-[#2A9D8F] uppercase tracking-wider">
                    Sustainable Cultural Tourism Impact
                  </h4>
                  <p className="text-xs text-[#F4F1DE] mt-1 leading-relaxed">
                    {itinerary.sustainabilitySummary}
                  </p>
                </div>
              </div>

              {/* Days Timeline Accordions/Cards */}
              <div className="space-y-6">
                {itinerary.days.map((day: ItineraryDay) => (
                  <div
                    key={day.dayNumber}
                    className="rounded-3xl bg-[#0F1117] border border-[#2A2E3D] overflow-hidden text-left shadow-xl"
                  >
                    {/* Day Header */}
                    <div className="px-6 py-4 bg-[#181B26] border-b border-[#2A2E3D] flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 rounded-xl bg-[#E07A5F] text-white flex items-center justify-center font-extrabold text-sm shadow">
                          {day.dayNumber}
                        </span>
                        <h4 className="text-base font-extrabold text-white">
                          Day {day.dayNumber}: {day.theme}
                        </h4>
                      </div>
                    </div>

                    {/* Day Schedule Grid (Morning / Afternoon / Evening) */}
                    <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                      {/* Morning */}
                      <div className="space-y-2 border-l-2 border-[#D4AF37] pl-4">
                        <div className="flex items-center gap-1.5 text-xs font-extrabold text-[#D4AF37]">
                          <Sun className="w-4 h-4" />
                          <span>Morning ({day.morningActivity.time})</span>
                        </div>
                        <h5 className="text-sm font-bold text-white">
                          {day.morningActivity.title}
                        </h5>
                        <p className="text-xs text-[#9496A1] leading-relaxed">
                          {day.morningActivity.description}
                        </p>
                        <div className="pt-2">
                          <span className="text-[10px] font-bold text-[#E07A5F] uppercase block">
                            Why this matters:
                          </span>
                          <p className="text-[11px] text-[#F4F1DE]/80 leading-snug mt-0.5">
                            {day.morningActivity.culturalSignificance}
                          </p>
                        </div>
                      </div>

                      {/* Afternoon */}
                      <div className="space-y-2 border-l-2 border-[#E07A5F] pl-4">
                        <div className="flex items-center gap-1.5 text-xs font-extrabold text-[#E07A5F]">
                          <Sunset className="w-4 h-4" />
                          <span>Afternoon ({day.afternoonActivity.time})</span>
                        </div>
                        <h5 className="text-sm font-bold text-white">
                          {day.afternoonActivity.title}
                        </h5>
                        <p className="text-xs text-[#9496A1] leading-relaxed">
                          {day.afternoonActivity.description}
                        </p>
                        <div className="pt-2">
                          <span className="text-[10px] font-bold text-[#E07A5F] uppercase block">
                            Why this matters:
                          </span>
                          <p className="text-[11px] text-[#F4F1DE]/80 leading-snug mt-0.5">
                            {day.afternoonActivity.culturalSignificance}
                          </p>
                        </div>
                      </div>

                      {/* Evening */}
                      <div className="space-y-2 border-l-2 border-[#3D5A80] pl-4">
                        <div className="flex items-center gap-1.5 text-xs font-extrabold text-[#98C1D9]">
                          <Moon className="w-4 h-4 text-[#98C1D9]" />
                          <span>Evening ({day.eveningActivity.time})</span>
                        </div>
                        <h5 className="text-sm font-bold text-white">
                          {day.eveningActivity.title}
                        </h5>
                        <p className="text-xs text-[#9496A1] leading-relaxed">
                          {day.eveningActivity.description}
                        </p>
                        <div className="pt-2">
                          <span className="text-[10px] font-bold text-[#E07A5F] uppercase block">
                            Why this matters:
                          </span>
                          <p className="text-[11px] text-[#F4F1DE]/80 leading-snug mt-0.5">
                            {day.eveningActivity.culturalSignificance}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Day Footer: Culinary & Etiquette Tip */}
                    <div className="px-6 py-4 bg-[#181B26]/60 border-t border-[#2A2E3D] grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div className="flex items-start gap-2.5">
                        <Utensils className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold text-white block">
                            Culinary Highlight: {day.culinaryRecommendation.dishName}
                          </span>
                          <p className="text-[#9496A1] text-[11px] mt-0.5">
                            {day.culinaryRecommendation.description} (Find at:{" "}
                            <strong className="text-[#F4F1DE]">{day.culinaryRecommendation.whereToFind}</strong>)
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2.5">
                        <Info className="w-4 h-4 text-[#2A9D8F] shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold text-white block">Local Etiquette Tip</span>
                          <p className="text-[#9496A1] text-[11px] mt-0.5">
                            {day.localInteractionTip}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
