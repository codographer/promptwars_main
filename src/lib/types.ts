export type PersonaId = "historian" | "artisan" | "bard" | "anthropologist";

export interface Persona {
  id: PersonaId;
  name: string;
  title: string;
  avatar: string;
  tone: string;
  timePeriod: string;
  description: string;
}

export interface Landmark {
  id: string;
  name: string;
  category: "heritage" | "sacred" | "architecture" | "museum";
  description: string;
  historicalSignificance: string;
  bestTimeToVisit: string;
  image: string;
  tags: string[];
}

export interface HiddenGem {
  id: string;
  name: string;
  location: string;
  secretTip: string;
  culturalRelevance: string;
  image: string;
  category: "gastronomy" | "artisan" | "folklore" | "nature";
}

export interface CulturalEtiquette {
  category: "dress_code" | "tipping" | "greeting" | "sacred_sites";
  title: string;
  description: string;
  doList: string[];
  dontList: string[];
}

export interface HeritagePromotion {
  title: string;
  endangeredStatus: "Stable" | "Vulnerable" | "Critical";
  preservationEffort: string;
  howToSupport: string;
  indigenousCommunity: string;
}

export interface DiscoverResponse {
  destination: string;
  country: string;
  tagline: string;
  description: string;
  heroImage: string;
  landmarks: Landmark[];
  hiddenGems: HiddenGem[];
  etiquette: CulturalEtiquette[];
  heritage: HeritagePromotion[];
}

export interface StorytellerResponse {
  title: string;
  personaName: string;
  timePeriod: string;
  storyContent: string;
  audioScript: string;
  historicalFact: string;
  culturalProverb: {
    original?: string;
    translation: string;
    meaning: string;
  };
  tags: string[];
}

export interface LocalEvent {
  id: string;
  title: string;
  dateRange: string;
  category: "festival" | "music_dance" | "workshop" | "ritual";
  description: string;
  location: string;
  authenticityScore: number;
  ticketInfo: string;
  image: string;
}

export interface ItineraryRequest {
  destination: string;
  days: number;
  budget: "budget" | "moderate" | "luxury";
  interests: string[];
  accessibilityNeeds?: string;
}

export interface Activity {
  time: string;
  title: string;
  description: string;
  culturalSignificance: string;
  accessibilityNote?: string;
}

export interface ItineraryDay {
  dayNumber: number;
  theme: string;
  morningActivity: Activity;
  afternoonActivity: Activity;
  eveningActivity: Activity;
  culinaryRecommendation: {
    dishName: string;
    description: string;
    whereToFind: string;
  };
  localInteractionTip: string;
}

export interface ItineraryResponse {
  title: string;
  destination: string;
  totalDays: number;
  days: ItineraryDay[];
  sustainabilitySummary: string;
}

export interface CulturalBadge {
  id: string;
  title: string;
  description: string;
  iconName: string;
  category: "storyteller" | "explorer" | "artisan_supporter" | "etiquette_master";
  unlockedAt?: string;
}

export interface SavedItem {
  id: string;
  type: "landmark" | "hidden_gem" | "itinerary";
  title: string;
  subtitle: string;
  image?: string;
  savedAt: string;
  data?: Record<string, unknown>;
}
