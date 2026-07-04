"use client";

import React, { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { DestinationExplorer } from "@/components/discover/DestinationExplorer";
import { TimeTravelerGuide } from "@/components/storyteller/TimeTravelerGuide";
import { LocalEventsCalendar } from "@/components/events/LocalEventsCalendar";
import { ItineraryBuilder } from "@/components/itinerary/ItineraryBuilder";
import { DiscoverResponse } from "@/lib/types";
import { Compass, Headphones, Calendar, Sparkles, MapPin, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface DestinationDashboardClientProps {
  data: DiscoverResponse;
  destination: string;
}

export function DestinationDashboardClient({
  data,
  destination,
}: DestinationDashboardClientProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const tabParam = searchParams.get("tab") || "discover";
  const [activeTab, setActiveTab] = useState<string>(tabParam);
  const [storyLandmark, setStoryLandmark] = useState<string>(
    data.landmarks[0]?.name || "Cultural Landmark"
  );

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    router.push(`/explore/${destination}?tab=${tab}`, { scroll: false });
  };

  const handleSelectLandmarkForStory = (landmarkName: string) => {
    setStoryLandmark(landmarkName);
    handleTabChange("storyteller");
    window.scrollTo({ top: 300, behavior: "smooth" });
  };

  const tabs = [
    { id: "discover", label: "Overview & Gems", icon: Compass },
    { id: "storyteller", label: "Time-Traveler AI", icon: Headphones },
    { id: "itinerary", label: "Custom Itineraries", icon: Calendar },
    { id: "events", label: "Local Events", icon: Sparkles },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Back Link & Breadcrumb */}
      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2 text-xs font-bold text-[#9496A1] hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Destinations</span>
        </Link>

        <div className="flex items-center gap-2 text-xs text-[#D4AF37] font-semibold bg-[#181B26] px-3 py-1.5 rounded-full border border-[#2A2E3D]">
          <MapPin className="w-3.5 h-3.5" />
          <span>Live AI Cultural Engine Active</span>
        </div>
      </div>

      {/* Main Tab Navigation Bar */}
      <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 p-2 rounded-2xl glass-panel-gold bg-[#181B26] border border-[#D4AF37]/30 shadow-xl" role="tablist">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isSelected = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              role="tab"
              aria-selected={isSelected}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-extrabold transition-all duration-200 ${
                isSelected
                  ? "bg-gradient-to-r from-[#E07A5F] to-[#C65D42] text-white shadow-lg scale-105"
                  : "text-[#9496A1] hover:text-white hover:bg-[#0F1117]/60"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Render Active View */}
      <div className="animate-in fade-in duration-300">
        {activeTab === "discover" && (
          <DestinationExplorer
            data={data}
            onSelectLandmarkForStory={handleSelectLandmarkForStory}
          />
        )}

        {activeTab === "storyteller" && (
          <TimeTravelerGuide
            destination={data.destination}
            initialLandmark={storyLandmark}
          />
        )}

        {activeTab === "itinerary" && (
          <ItineraryBuilder destination={data.destination} />
        )}

        {activeTab === "events" && (
          <LocalEventsCalendar destination={data.destination} />
        )}
      </div>
    </div>
  );
}
