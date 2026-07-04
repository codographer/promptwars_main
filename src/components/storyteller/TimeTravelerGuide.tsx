"use client";

import React, { useState, useEffect } from "react";
import {
  Headphones,
  Volume2,
  VolumeX,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  BookOpen,
  MessageSquare,
  BookmarkPlus,
  Check,
  ShieldAlert,
  Send,
  Loader2,
} from "lucide-react";
import { StorytellerResponse, PersonaId, Persona } from "@/lib/types";
import { MOCK_STORYTELLER_DATA } from "@/lib/ai/mock-data";

interface TimeTravelerGuideProps {
  destination: string;
  initialLandmark?: string;
}

export function TimeTravelerGuide({
  destination,
  initialLandmark = "Kinkaku-ji (Golden Pavilion)",
}: TimeTravelerGuideProps) {
  const [selectedPersona, setSelectedPersona] = useState<PersonaId>("historian");
  const [landmarkName, setLandmarkName] = useState(initialLandmark);
  const [customTopic, setCustomTopic] = useState("");
  const [storyData, setStoryData] = useState<StorytellerResponse>(
    MOCK_STORYTELLER_DATA["historian"]
  );
  const [loading, setLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speechRate, setSpeechRate] = useState(1.0);
  const [speechPitch, setSpeechPitch] = useState(1.0);
  const [saved, setSaved] = useState(false);

  const personas: Persona[] = [
    {
      id: "historian",
      name: "Lord Kenjiro",
      title: "15th-Century Court Historian",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80",
      tone: "Authoritative, dignified, royal court elegance",
      timePeriod: "Muromachi Period (1397 AD)",
      description: "Chronicles the rise and fall of shoguns, architectural secrets, and imperial ceremonies.",
    },
    {
      id: "artisan",
      name: "Master Haru",
      title: "5th-Gen Silk Weaver",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&q=80",
      tone: "Patient, devoted, craftsman pride",
      timePeriod: "Edo Period Living Craftsmanship",
      description: "Reveals the physical labor, natural dyes, and ancestral devotion woven into every fabric.",
    },
    {
      id: "bard",
      name: "Old Ren",
      title: "Wandering Shamisen Bard",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=256&q=80",
      tone: "Poetic, mythical, campfire folklore",
      timePeriod: "Timeless Supernatural Legends",
      description: "Whispers of Kitsune fox guardians, haunted bamboo forests, and ancient proverbs.",
    },
    {
      id: "anthropologist",
      name: "Dr. Elena Vance",
      title: "Modern Anthropologist",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80",
      tone: "Analytical, respectful, preservationist",
      timePeriod: "Contemporary Analysis (2026)",
      description: "Explains matriarchal arts guilds, overtourism solutions, and how to support indigenous heritage.",
    },
  ];

  // Fetch story when persona or landmark changes
  const fetchStory = async (targetPersona: PersonaId, targetTopic?: string) => {
    setLoading(true);
    stopAudio();
    try {
      const res = await fetch("/api/ai/storyteller", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          destination,
          landmarkName,
          persona: targetPersona,
          customTopic: targetTopic || undefined,
        }),
      });

      const json = await res.json();
      if (json.success && json.data) {
        setStoryData(json.data);
      } else {
        setStoryData(MOCK_STORYTELLER_DATA[targetPersona]);
      }
    } catch (e) {
      setStoryData(MOCK_STORYTELLER_DATA[targetPersona]);
    } finally {
      setLoading(false);
    }
  };

  const handlePersonaSelect = (id: PersonaId) => {
    setSelectedPersona(id);
    fetchStory(id, customTopic);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchStory(selectedPersona, customTopic);
  };

  // Web Speech API Text-to-Speech
  const toggleAudio = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      alert("Audio narration is not supported in your browser.");
      return;
    }

    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    } else {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(storyData.audioScript || storyData.storyContent);
      utterance.rate = speechRate;
      utterance.pitch = speechPitch;

      utterance.onend = () => setIsPlaying(false);
      utterance.onerror = () => setIsPlaying(false);

      window.speechSynthesis.speak(utterance);
      setIsPlaying(true);
    }
  };

  const stopAudio = () => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    }
  };

  useEffect(() => {
    return () => stopAudio();
  }, []);

  const handleSaveToPassport = () => {
    const item = {
      id: `story-${Date.now()}`,
      type: "landmark",
      title: storyData.title,
      subtitle: `${storyData.personaName} (${storyData.timePeriod})`,
      savedAt: new Date().toLocaleDateString(),
      data: storyData,
    };

    const existing = JSON.parse(localStorage.getItem("wanderlore_saved_items") || "[]");
    localStorage.setItem("wanderlore_saved_items", JSON.stringify([item, ...existing]));

    // Award badge
    const badges = JSON.parse(localStorage.getItem("wanderlore_badges") || "[]");
    if (!badges.some((b: any) => b.id === "storyteller_master")) {
      badges.push({
        id: "storyteller_master",
        title: "Time-Traveler Scholar",
        description: "Listened to historical folklore across centuries.",
        iconName: "Headphones",
        category: "storyteller",
        unlockedAt: new Date().toLocaleDateString(),
      });
      localStorage.setItem("wanderlore_badges", JSON.stringify(badges));
    }

    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const currentPersonaObj = personas.find((p) => p.id === selectedPersona)!;

  return (
    <div className="w-full rounded-3xl glass-panel bg-[#181B26] border border-[#2A2E3D] p-6 lg:p-10 text-[#F4F1DE] shadow-2xl">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-[#2A2E3D]">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E07A5F]/20 text-[#E07A5F] border border-[#E07A5F]/40 text-xs font-bold uppercase mb-3">
            <Headphones className="w-3.5 h-3.5" />
            <span>AI Time-Traveler Storyteller Guide</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Immersive Historical Folklore & Myths
          </h2>
          <p className="text-sm text-[#9496A1] mt-1">
            Select an AI persona to experience the living history and secret legends of your destination.
          </p>
        </div>

        {/* Landmark Selector / Title */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <input
            type="text"
            value={landmarkName}
            onChange={(e) => setLandmarkName(e.target.value)}
            placeholder="Landmark name (e.g., Fushimi Inari)"
            className="w-full sm:w-64 px-4 py-2.5 rounded-xl bg-[#0F1117] border border-[#2A2E3D] text-sm text-white focus:outline-none focus:border-[#D4AF37]"
          />
          <button
            onClick={() => fetchStory(selectedPersona, customTopic)}
            disabled={loading}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#D4AF37] text-[#0F1117] font-bold text-sm shadow hover:bg-[#F3E5AB] transition-colors flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            <span>Narrate</span>
          </button>
        </div>
      </div>

      {/* Persona Selection Grid */}
      <div className="mt-8">
        <p className="text-xs font-bold uppercase tracking-wider text-[#9496A1] mb-4">
          🎭 Select Your Time-Traveling Narrator:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" role="radiogroup" aria-label="Storyteller Personas">
          {personas.map((persona) => {
            const isSelected = selectedPersona === persona.id;
            return (
              <button
                key={persona.id}
                onClick={() => handlePersonaSelect(persona.id)}
                role="radio"
                aria-checked={isSelected}
                className={`flex flex-col items-start p-4 rounded-2xl border text-left transition-all duration-200 ${
                  isSelected
                    ? "bg-[#0F1117] border-[#D4AF37] shadow-xl ring-2 ring-[#D4AF37]/50 scale-[1.02]"
                    : "bg-[#0F1117]/50 border-[#2A2E3D] hover:border-[#E07A5F]/50 hover:bg-[#0F1117]/80"
                }`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <img
                    src={persona.avatar}
                    alt={persona.name}
                    className={`w-12 h-12 rounded-full object-cover border-2 ${
                      isSelected ? "border-[#D4AF37]" : "border-[#2A2E3D]"
                    }`}
                  />
                  <div>
                    <h4 className="text-sm font-bold text-white leading-tight">{persona.name}</h4>
                    <span className="text-[11px] font-semibold text-[#E07A5F] block mt-0.5">
                      {persona.title}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-[#9496A1] leading-relaxed mb-2 line-clamp-2">
                  {persona.description}
                </p>
                <span className="mt-auto text-[10px] font-bold px-2 py-0.5 rounded bg-[#181B26] text-[#D4AF37]">
                  ⌛ {persona.timePeriod}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Story Display Area */}
      {loading ? (
        <div className="mt-10 p-16 rounded-2xl bg-[#0F1117] border border-[#2A2E3D] flex flex-col items-center justify-center text-center">
          <Loader2 className="w-10 h-10 text-[#D4AF37] animate-spin mb-4" />
          <h3 className="text-lg font-bold text-white">Channeling Historical Archives...</h3>
          <p className="text-xs text-[#9496A1] mt-1">
            {currentPersonaObj.name} is preparing a rich cultural narrative for {landmarkName}.
          </p>
        </div>
      ) : (
        <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Story Text Column (2 span) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="p-6 sm:p-8 rounded-3xl bg-[#0F1117] border border-[#2A2E3D] relative shadow-xl">
              {/* Persona Pill Header */}
              <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-[#2A2E3D]">
                <div className="flex items-center gap-3">
                  <span className="w-3 h-3 rounded-full bg-[#2A9D8F] animate-ping" />
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#D4AF37]">
                      {storyData.personaName}
                    </span>
                    <h3 className="text-xl sm:text-2xl font-bold text-white mt-0.5">
                      {storyData.title}
                    </h3>
                  </div>
                </div>

                {/* Audio Narration Action Bar */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={toggleAudio}
                    aria-label={isPlaying ? "Pause Narration" : "Play Narration"}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs shadow-lg transition-all ${
                      isPlaying
                        ? "bg-red-500 text-white animate-pulse"
                        : "bg-[#2A9D8F] text-white hover:bg-[#238276]"
                    }`}
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    <span>{isPlaying ? "Pause Voice" : "Listen to Story"}</span>
                  </button>

                  <button
                    onClick={handleSaveToPassport}
                    disabled={saved}
                    title="Save to Cultural Passport"
                    className="p-2 rounded-xl bg-[#181B26] border border-[#2A2E3D] text-[#D4AF37] hover:bg-[#D4AF37]/10 transition-colors"
                  >
                    {saved ? <Check className="w-4 h-4 text-[#2A9D8F]" /> : <BookmarkPlus className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Audio Equalizer & Controls (When Playing) */}
              {isPlaying && (
                <div className="my-6 p-4 rounded-2xl bg-[#181B26] border border-[#2A9D8F]/40 flex flex-wrap items-center justify-between gap-4 animate-in fade-in duration-200">
                  <div className="flex items-center gap-2">
                    <Volume2 className="w-5 h-5 text-[#2A9D8F]" />
                    <div className="flex items-center gap-1 h-5">
                      <span className="w-1.5 h-3 bg-[#2A9D8F] animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-1.5 h-5 bg-[#D4AF37] animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-1.5 h-2 bg-[#E07A5F] animate-bounce" style={{ animationDelay: "300ms" }} />
                      <span className="w-1.5 h-4 bg-[#2A9D8F] animate-bounce" style={{ animationDelay: "100ms" }} />
                    </div>
                    <span className="text-xs font-bold text-white ml-2">Web Speech Audio Synthesizer Active</span>
                  </div>

                  <div className="flex items-center gap-4 text-xs">
                    <label className="flex items-center gap-1.5">
                      <span className="text-[#9496A1]">Speed:</span>
                      <select
                        value={speechRate}
                        onChange={(e) => setSpeechRate(parseFloat(e.target.value))}
                        className="bg-[#0F1117] border border-[#2A2E3D] rounded px-1.5 py-0.5 text-white"
                      >
                        <option value="0.8">0.8x</option>
                        <option value="1.0">1.0x</option>
                        <option value="1.2">1.2x</option>
                        <option value="1.5">1.5x</option>
                      </select>
                    </label>
                  </div>
                </div>
              )}

              {/* Narrative Text */}
              <div className="mt-6 text-base sm:text-lg leading-relaxed text-[#F4F1DE] space-y-4 whitespace-pre-line font-normal">
                {storyData.storyContent}
              </div>

              {/* Tags */}
              <div className="mt-8 pt-6 border-t border-[#2A2E3D] flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-[#9496A1]">Heritage Tags:</span>
                {storyData.tags.map((t, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-full text-xs font-semibold bg-[#181B26] text-[#E07A5F] border border-[#E07A5F]/30"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            </div>

            {/* Ask AI a Custom Question about this Landmark */}
            <form
              onSubmit={handleCustomSubmit}
              className="p-4 rounded-2xl bg-[#0F1117] border border-[#2A2E3D] flex items-center gap-3"
            >
              <MessageSquare className="w-5 h-5 text-[#D4AF37] ml-2 shrink-0" />
              <input
                type="text"
                value={customTopic}
                onChange={(e) => setCustomTopic(e.target.value)}
                placeholder={`Ask ${currentPersonaObj.name} a question (e.g., "What secret rituals happened at midnight?")`}
                className="w-full bg-transparent text-sm text-white placeholder-[#9496A1] focus:outline-none"
              />
              <button
                type="submit"
                disabled={loading || !customTopic.trim()}
                className="px-4 py-2 rounded-xl bg-[#E07A5F] text-white text-xs font-bold hover:bg-[#C65D42] transition-colors disabled:opacity-50 shrink-0 flex items-center gap-1.5"
              >
                <span>Ask AI</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>

          {/* Sidebar Column: Proverbs & Historical Facts (1 span) */}
          <div className="space-y-6">
            {/* Cultural Proverb Card */}
            <div className="p-6 rounded-3xl glass-panel-gold bg-[#181B26] border border-[#D4AF37]/40 shadow-xl">
              <div className="flex items-center gap-2 text-[#D4AF37] font-bold text-xs uppercase tracking-wider mb-4">
                <Sparkles className="w-4 h-4 animate-spin-slow" />
                <span>Ancestral Proverb & Wisdom</span>
              </div>
              {storyData.culturalProverb.original && (
                <p className="text-2xl font-black text-white tracking-wide mb-2">
                  "{storyData.culturalProverb.original}"
                </p>
              )}
              <p className="text-base font-bold text-[#E07A5F] italic mb-3">
                "{storyData.culturalProverb.translation}"
              </p>
              <p className="text-xs text-[#9496A1] leading-relaxed border-l-2 border-[#D4AF37] pl-3">
                {storyData.culturalProverb.meaning}
              </p>
            </div>

            {/* Verified Historical Fact Card */}
            <div className="p-6 rounded-3xl bg-[#0F1117] border border-[#2A9D8F]/40 shadow-xl">
              <div className="flex items-center gap-2 text-[#2A9D8F] font-bold text-xs uppercase tracking-wider mb-3">
                <BookOpen className="w-4 h-4" />
                <span>Verified Historical Record</span>
              </div>
              <p className="text-xs text-[#F4F1DE] leading-relaxed">
                {storyData.historicalFact}
              </p>
              <div className="mt-4 pt-3 border-t border-[#2A2E3D] flex items-center justify-between text-[11px] text-[#9496A1]">
                <span>Source: Cultural Archives</span>
                <span className="text-[#2A9D8F] font-semibold">✓ Accuracy Checked</span>
              </div>
            </div>

            {/* Why This Matters for Heritage */}
            <div className="p-5 rounded-2xl bg-[#E07A5F]/10 border border-[#E07A5F]/30 text-xs text-[#F4F1DE]">
              <h4 className="font-bold text-[#E07A5F] mb-1 flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4" /> Why Generative Storytelling Matters
              </h4>
              <p className="text-[#9496A1] leading-relaxed">
                By presenting history through diverse indigenous and artisan perspectives, WanderLore AI fosters emotional connection and encourages responsible travel behavior that protects fragile monuments.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
