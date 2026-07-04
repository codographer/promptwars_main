"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  CalendarDays,
  MapPin,
  Award,
  Ticket,
  BookmarkPlus,
  Check,
  Filter,
  Loader2,
} from "lucide-react";
import Image from "next/image";
import { LocalEvent, SavedItem } from "@/lib/types";

interface LocalEventsCalendarProps {
  destination: string;
  initialEvents?: LocalEvent[];
}

export function LocalEventsCalendar({
  destination,
  initialEvents,
}: LocalEventsCalendarProps) {
  const [events, setEvents] = useState<LocalEvent[]>(initialEvents || []);
  const [activeCategory, setActiveCategory] = useState("all");
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState<Record<string, boolean>>({});

  const fetchEvents = useCallback(async (category: string) => {
    setLoading(true);
    try {
      const res = await fetch("/api/ai/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ destination, category }),
      });

      const json = await res.json();
      if (json.success && json.data) {
        setEvents(json.data);
      } else {
        setEvents([]);
      }
    } catch {
      setEvents([]);
    } finally {
      setLoading(false);
    }
  }, [destination]);

  useEffect(() => {
    if (!initialEvents || initialEvents.length === 0) {
      const timer = setTimeout(() => {
        fetchEvents("all");
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [destination, initialEvents, fetchEvents]);

  const handleFilter = (category: string) => {
    setActiveCategory(category);
    fetchEvents(category);
  };

  const handleSaveEvent = useCallback((event: LocalEvent) => {
    const item: SavedItem = {
      id: `event-${event.id}-${Math.random().toString(36).slice(2, 9)}`,
      type: "landmark",
      title: event.title,
      subtitle: `${event.dateRange} • ${event.location}`,
      savedAt: new Date().toLocaleDateString(),
      data: event as unknown as Record<string, unknown>,
    };

    const existing = JSON.parse(localStorage.getItem("wanderlore_saved_items") || "[]");
    localStorage.setItem("wanderlore_saved_items", JSON.stringify([item, ...existing]));

    setSaved((prev) => ({ ...prev, [event.id]: true }));
    setTimeout(() => {
      setSaved((prev) => ({ ...prev, [event.id]: false }));
    }, 3000);
  }, []);

  const categories = [
    { id: "all", label: "All Gatherings" },
    { id: "festival", label: "🏮 Traditional Festivals" },
    { id: "music_dance", label: "🥁 Music & Folk Dance" },
    { id: "workshop", label: "🍶 Artisan Workshops" },
    { id: "ritual", label: "🙏 Sacred Rituals" },
  ];

  return (
    <div className="w-full rounded-3xl glass-panel bg-[#181B26] border border-[#2A2E3D] p-6 lg:p-10 text-[#F4F1DE] shadow-2xl">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-[#2A2E3D]">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/40 text-xs font-bold uppercase mb-3">
            <CalendarDays className="w-3.5 h-3.5" />
            <span>Seasonal Cultural Calendar</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Live Events & Authentic Workshops in {destination}
          </h2>
          <p className="text-sm text-[#9496A1] mt-1">
            Connect directly with local communities through seasonal festivals, craft apprenticeships, and ceremonies.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Event Categories">
          <Filter className="w-4 h-4 text-[#9496A1] mr-1 hidden sm:block" />
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleFilter(cat.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeCategory === cat.id
                  ? "bg-[#D4AF37] text-[#0F1117] shadow-md scale-105"
                  : "bg-[#0F1117] text-[#9496A1] hover:text-white border border-[#2A2E3D]"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Events Grid */}
      {loading ? (
        <div className="mt-10 p-16 rounded-2xl bg-[#0F1117] border border-[#2A2E3D] flex flex-col items-center justify-center text-center">
          <Loader2 className="w-10 h-10 text-[#D4AF37] animate-spin mb-4" />
          <h3 className="text-lg font-bold text-white">Curating Seasonal Cultural Schedule...</h3>
          <p className="text-xs text-[#9496A1] mt-1">Searching regional festival archives and artisan schedules.</p>
        </div>
      ) : events.length === 0 ? (
        <div className="mt-10 p-12 rounded-2xl bg-[#0F1117] border border-[#2A2E3D] text-center">
          <p className="text-sm text-[#9496A1]">No events found matching this category for the current season.</p>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-300">
          {events.map((event) => (
            <div
              key={event.id}
              className="flex flex-col justify-between rounded-3xl bg-[#0F1117] border border-[#2A2E3D] p-6 text-left shadow-xl hover:border-[#D4AF37]/50 transition-all duration-300 group"
            >
              <div>
                {event.image && (
                  <div className="relative h-44 w-full rounded-2xl overflow-hidden mb-4 border border-[#2A2E3D]">
                    <Image unoptimized src={event.image} alt={event.title} width={600} height={400} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0F1117] via-transparent to-transparent" />
                  </div>
                )}
                <div className="flex items-center justify-between gap-3 mb-4">
                  <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase bg-[#2A9D8F]/20 text-[#2A9D8F] border border-[#2A9D8F]/40">
                    🕒 {event.dateRange}
                  </span>
                  <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] text-[11px] font-extrabold">
                    <Award className="w-3.5 h-3.5" />
                    <span>{event.authenticityScore}% Authentic</span>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-white group-hover:text-[#D4AF37] transition-colors mb-2">
                  {event.title}
                </h3>
                <p className="text-xs text-[#E07A5F] font-semibold mb-3 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 shrink-0" /> {event.location}
                </p>
                <p className="text-xs text-[#9496A1] leading-relaxed mb-6">
                  {event.description}
                </p>
              </div>

              <div className="pt-4 border-t border-[#2A2E3D] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-[11px] text-[#F4F1DE] bg-[#181B26] px-3 py-2 rounded-xl border border-[#2A2E3D]">
                  <Ticket className="w-4 h-4 text-[#D4AF37] shrink-0" />
                  <span><strong>Access:</strong> {event.ticketInfo}</span>
                </div>

                <button
                  onClick={() => handleSaveEvent(event)}
                  className="w-full sm:w-auto px-4 py-2 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B89628] text-[#0F1117] font-bold text-xs shadow hover:brightness-110 transition-all flex items-center justify-center gap-1.5 shrink-0"
                >
                  {saved[event.id] ? <Check className="w-4 h-4 text-[#0F1117]" /> : <BookmarkPlus className="w-4 h-4" />}
                  <span>{saved[event.id] ? "Saved to Passport" : "Bookmark Event"}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
