"use client";

import React, { useState } from "react";
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
import { MOCK_ITINERARY_DATA } from "@/lib/ai/mock-data";

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
  const [itinerary, setItinerary] = useState<ItineraryResponse>(MOCK_ITINERARY_DATA);
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

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (interests.length === 0) {
      alert("Please select at least one cultural interest.");
      return;
    }

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
        setItinerary({
          ...MOCK_ITINERARY_DATA,
          title: `${days}-Day ${destination} Cultural Immersion Itinerary`,
          totalDays: days,
        });
      }
    } catch (e) {
      setItinerary({
        ...MOCK_ITINERARY_DATA,
        title: `${days}-Day ${destination} Cultural Immersion Itinerary`,
        totalDays: days,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveItinerary = () => {
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
            <span>AI Authentic Itinerary Architect</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Design Your Custom Cultural Immersion
          </h2>
          <p className="text-sm text-[#9496A1] mt-1">
            Tailor your trip by budget, pace, accessibility, and cultural interests while promoting sustainable heritage protection.
          </p>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Col: Customization Form (1 span) */}
        <form onSubmit={handleGenerate} className="space-y-6 p-6 rounded-3xl bg-[#0F1117] border border-[#2A2E3D] h-fit">
          <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-[#2A2E3D] pb-3">
            <Sparkles className="w-4 h-4 text-[#D4AF37]" />
            <span>Trip Preferences</span>
          </h3>

          {/* Days */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#9496A1] mb-2">
              Duration: {days} Days
            </label>
            <input
              type="range"
              min="1"
              max="7"
              value={days}
              onChange={(e) => setDays(parseInt(e.target.value))}
              className="w-full accent-[#E07A5F] bg-[#181B26] h-2 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-[#9496A1] mt-1 font-semibold">
              <span>1 Day (Express)</span>
              <span>3 Days (Standard)</span>
              <span>7 Days (Deep Dive)</span>
            </div>
          </div>

          {/* Budget */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#9496A1] mb-2">
              Budget Level
            </label>
            <div className="grid grid-cols-3 gap-2" role="radiogroup">
              {(["budget", "moderate", "luxury"] as const).map((b) => (
                <button
                  key={b}
                  type="button"
                  onClick={() => setBudget(b)}
                  role="radio"
                  aria-checked={budget === b}
                  className={`py-2 text-xs font-bold capitalize rounded-xl border transition-all ${
                    budget === b
                      ? "bg-[#D4AF37] text-[#0F1117] border-[#D4AF37] shadow-md"
                      : "bg-[#181B26] text-[#9496A1] border-[#2A2E3D] hover:text-white"
                  }`}
                >
                  {b}
                </button>
              ))}
            </div>
          </div>

          {/* Cultural Interests Checkboxes */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#9496A1] mb-2">
              Cultural Focus (Select 1+)
            </label>
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {interestOptions.map((option) => {
                const checked = interests.includes(option);
                return (
                  <label
                    key={option}
                    className={`flex items-center gap-2.5 p-2.5 rounded-xl border cursor-pointer text-xs font-medium transition-all ${
                      checked
                        ? "bg-[#E07A5F]/10 border-[#E07A5F] text-white"
                        : "bg-[#181B26]/50 border-[#2A2E3D] text-[#9496A1] hover:bg-[#181B26]"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleInterest(option)}
                      className="rounded accent-[#E07A5F] w-4 h-4"
                    />
                    <span>{option}</span>
                  </label>
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

              {/* Sustainability Callout */}
              <div className="p-4 rounded-2xl bg-[#2A9D8F]/15 border border-[#2A9D8F]/40 flex items-start gap-3 text-xs text-[#F4F1DE]">
                <ShieldCheck className="w-5 h-5 text-[#2A9D8F] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#2A9D8F] block mb-0.5">Ethical & Sustainable Travel Impact:</strong>
                  <p className="text-[#9496A1] leading-relaxed">{itinerary.sustainabilitySummary}</p>
                </div>
              </div>

              {/* Day Cards */}
              <div className="space-y-6">
                {itinerary.days.slice(0, days).map((day) => (
                  <div
                    key={day.dayNumber}
                    className="p-6 sm:p-8 rounded-3xl bg-[#0F1117] border border-[#2A2E3D] space-y-6 shadow-xl text-left"
                  >
                    <div className="flex items-center justify-between pb-4 border-b border-[#2A2E3D]">
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 rounded-full bg-[#E07A5F] text-white font-extrabold text-sm flex items-center justify-center shadow">
                          {day.dayNumber}
                        </span>
                        <h4 className="text-lg sm:text-xl font-bold text-white">{day.theme}</h4>
                      </div>
                    </div>

                    {/* Timeline */}
                    <div className="space-y-5">
                      {/* Morning */}
                      <div className="flex items-start gap-4">
                        <div className="w-8 h-8 rounded-xl bg-[#D4AF37]/20 text-[#D4AF37] flex items-center justify-center shrink-0 mt-1">
                          <Sun className="w-4 h-4" />
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-[#D4AF37]">{day.morningActivity.time}</span>
                            <span className="text-sm font-extrabold text-white">{day.morningActivity.title}</span>
                          </div>
                          <p className="text-xs text-[#9496A1] leading-relaxed">{day.morningActivity.description}</p>
                          <p className="text-[11px] text-[#2A9D8F] font-semibold italic pt-0.5">
                            ✨ Significance: {day.morningActivity.culturalSignificance}
                          </p>
                        </div>
                      </div>

                      {/* Afternoon */}
                      <div className="flex items-start gap-4 pt-4 border-t border-[#2A2E3D]/50">
                        <div className="w-8 h-8 rounded-xl bg-[#E07A5F]/20 text-[#E07A5F] flex items-center justify-center shrink-0 mt-1">
                          <Sunset className="w-4 h-4" />
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-[#E07A5F]">{day.afternoonActivity.time}</span>
                            <span className="text-sm font-extrabold text-white">{day.afternoonActivity.title}</span>
                          </div>
                          <p className="text-xs text-[#9496A1] leading-relaxed">{day.afternoonActivity.description}</p>
                          <p className="text-[11px] text-[#2A9D8F] font-semibold italic pt-0.5">
                            ✨ Significance: {day.afternoonActivity.culturalSignificance}
                          </p>
                        </div>
                      </div>

                      {/* Evening */}
                      <div className="flex items-start gap-4 pt-4 border-t border-[#2A2E3D]/50">
                        <div className="w-8 h-8 rounded-xl bg-[#264653]/40 text-[#2A9D8F] flex items-center justify-center shrink-0 mt-1">
                          <Moon className="w-4 h-4" />
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-[#2A9D8F]">{day.eveningActivity.time}</span>
                            <span className="text-sm font-extrabold text-white">{day.eveningActivity.title}</span>
                          </div>
                          <p className="text-xs text-[#9496A1] leading-relaxed">{day.eveningActivity.description}</p>
                          <p className="text-[11px] text-[#2A9D8F] font-semibold italic pt-0.5">
                            ✨ Significance: {day.eveningActivity.culturalSignificance}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Culinary & Interaction Tip Footer */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-5 border-t border-[#2A2E3D]">
                      <div className="p-3.5 rounded-2xl bg-[#181B26] border border-[#2A2E3D] text-xs space-y-1">
                        <span className="font-bold text-[#D4AF37] flex items-center gap-1.5">
                          <Utensils className="w-3.5 h-3.5" /> 🍽️ Daily Gastronomy
                        </span>
                        <p className="font-extrabold text-white">{day.culinaryRecommendation.dishName}</p>
                        <p className="text-[11px] text-[#9496A1] line-clamp-2">{day.culinaryRecommendation.description}</p>
                        <p className="text-[10px] text-[#2A9D8F] font-semibold pt-0.5">📍 Where to find: {day.culinaryRecommendation.whereToFind}</p>
                      </div>

                      <div className="p-3.5 rounded-2xl bg-[#181B26] border border-[#2A2E3D] text-xs space-y-1">
                        <span className="font-bold text-[#E07A5F] flex items-center gap-1.5">
                          <Info className="w-3.5 h-3.5" /> 💡 Local Interaction Tip
                        </span>
                        <p className="text-[11px] text-[#9496A1] leading-relaxed italic">{day.localInteractionTip}</p>
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
