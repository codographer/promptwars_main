import { google } from "@ai-sdk/google";
import { generateObject, streamText } from "ai";
import { z } from "zod";
import {
  DiscoverResponse,
  StorytellerResponse,
  LocalEvent,
  ItineraryResponse,
  PersonaId,
} from "@/lib/types";
import {
  MOCK_DISCOVER_DATA,
  MOCK_STORYTELLER_DATA,
  MOCK_EVENTS_DATA,
  MOCK_ITINERARY_DATA,
} from "./mock-data";
import { ItineraryInput } from "@/lib/validations";

const HAS_API_KEY = Boolean(
  process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GEMINI_API_KEY
);

/**
 * Helper to normalize destination names for mock lookups
 */
function getMockDestinationKey(destination: string): string {
  const clean = destination.toLowerCase().trim();
  if (clean.includes("kyoto") || clean.includes("japan")) return "kyoto";
  if (clean.includes("oaxaca") || clean.includes("mexico")) return "oaxaca";
  if (clean.includes("istanbul") || clean.includes("turkey")) return "kyoto"; // fallback rich data
  if (clean.includes("cusco") || clean.includes("peru")) return "oaxaca";
  return "kyoto"; // Default flagship mock destination
}

/**
 * Generates rich destination cultural discovery data
 */
export async function generateDiscovery(
  destination: string
): Promise<DiscoverResponse> {
  const mockKey = getMockDestinationKey(destination);
  const fallback = MOCK_DISCOVER_DATA[mockKey] || MOCK_DISCOVER_DATA["kyoto"];

  if (!HAS_API_KEY) {
    // If destination is custom and we are in demo mode, customize the mock title slightly for realism
    if (mockKey === "kyoto" && !destination.toLowerCase().includes("kyoto")) {
      return {
        ...fallback,
        destination: destination.charAt(0).toUpperCase() + destination.slice(1),
        tagline: `Curated Cultural & Heritage Guide for ${destination}`,
      };
    }
    return fallback;
  }

  try {
    const { object } = await generateObject({
      model: google("gemini-1.5-flash"),
      schema: z.object({
        destination: z.string(),
        country: z.string(),
        tagline: z.string(),
        description: z.string(),
        heroImage: z.string().default("https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80"),
        landmarks: z.array(
          z.object({
            id: z.string(),
            name: z.string(),
            category: z.enum(["heritage", "sacred", "architecture", "museum"]),
            description: z.string(),
            historicalSignificance: z.string(),
            bestTimeToVisit: z.string(),
            image: z.string().default("https://images.unsplash.com/photo-1478436127897-769e1b3f0f36?auto=format&fit=crop&w=800&q=80"),
            tags: z.array(z.string()),
          })
        ),
        hiddenGems: z.array(
          z.object({
            id: z.string(),
            name: z.string(),
            location: z.string(),
            secretTip: z.string(),
            culturalRelevance: z.string(),
            image: z.string().default("https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80"),
            category: z.enum(["gastronomy", "artisan", "folklore", "nature"]),
          })
        ),
        etiquette: z.array(
          z.object({
            category: z.enum(["dress_code", "tipping", "greeting", "sacred_sites"]),
            title: z.string(),
            description: z.string(),
            doList: z.array(z.string()),
            dontList: z.array(z.string()),
          })
        ),
        heritage: z.array(
          z.object({
            title: z.string(),
            endangeredStatus: z.enum(["Stable", "Vulnerable", "Critical"]),
            preservationEffort: z.string(),
            howToSupport: z.string(),
            indigenousCommunity: z.string(),
          })
        ),
      }),
      prompt: `You are an expert cultural anthropologist and travel guide. Generate a comprehensive cultural heritage guide for "${destination}". Focus on authentic cultural experiences, historical accuracy, local etiquette, indigenous communities, and off-the-beaten-path hidden gems. Avoid generic tourist clichés. Provide realistic high-resolution unsplash image URLs if possible or default landscape images.`,
    });

    return object as DiscoverResponse;
  } catch (error) {
    console.warn("Gemini API error during discover, using fallback:", error);
    return fallback;
  }
}

/**
 * Generates immersive storytelling for the Time-Traveler Guide
 */
export async function generateStory(
  destination: string,
  landmarkName: string,
  persona: PersonaId,
  customTopic?: string
): Promise<StorytellerResponse> {
  const fallback = MOCK_STORYTELLER_DATA[persona] || MOCK_STORYTELLER_DATA["historian"];

  if (!HAS_API_KEY) {
    return {
      ...fallback,
      title: `The Story of ${landmarkName} (${fallback.timePeriod})`,
    };
  }

  try {
    const { object } = await generateObject({
      model: google("gemini-1.5-flash"),
      schema: z.object({
        title: z.string(),
        personaName: z.string(),
        timePeriod: z.string(),
        storyContent: z.string(),
        audioScript: z.string(),
        historicalFact: z.string(),
        culturalProverb: z.object({
          original: z.string().optional(),
          translation: z.string(),
          meaning: z.string(),
        }),
        tags: z.array(z.string()),
      }),
      prompt: `You are acting as a "${persona}" narrating the immersive history and folklore of "${landmarkName}" in "${destination}". ${customTopic ? `Focus specifically on: ${customTopic}` : ""}.
      
      Persona Guidelines:
      - If 'historian': Use dignified, authoritative language from the royal court or historical eras.
      - If 'artisan': Focus on craftsmanship, patience, materials, tools, and generational devotion.
      - If 'bard': Use poetic, mythical storytelling, campfire folklore, and supernatural legends.
      - If 'anthropologist': Use analytical, respectful insights on cultural preservation, indigenous customs, and modern tourism impacts.
      
      Ensure historical authenticity, sensory details, and deep respect for cultural heritage.`,
    });

    return object as StorytellerResponse;
  } catch (error) {
    console.warn("Gemini API error during storytelling, using fallback:", error);
    return {
      ...fallback,
      title: `The Story of ${landmarkName}`,
    };
  }
}

/**
 * Generates a custom multi-day itinerary
 */
export async function generateItinerary(
  input: ItineraryInput
): Promise<ItineraryResponse> {
  if (!HAS_API_KEY) {
    return {
      ...MOCK_ITINERARY_DATA,
      title: `${input.days}-Day ${input.destination} Cultural Immersion & Heritage Journey`,
      destination: input.destination,
      totalDays: input.days,
    };
  }

  try {
    const { object } = await generateObject({
      model: google("gemini-1.5-flash"),
      schema: z.object({
        title: z.string(),
        destination: z.string(),
        totalDays: z.number(),
        days: z.array(
          z.object({
            dayNumber: z.number(),
            theme: z.string(),
            morningActivity: z.object({
              time: z.string(),
              title: z.string(),
              description: z.string(),
              culturalSignificance: z.string(),
              accessibilityNote: z.string().optional(),
            }),
            afternoonActivity: z.object({
              time: z.string(),
              title: z.string(),
              description: z.string(),
              culturalSignificance: z.string(),
              accessibilityNote: z.string().optional(),
            }),
            eveningActivity: z.object({
              time: z.string(),
              title: z.string(),
              description: z.string(),
              culturalSignificance: z.string(),
              accessibilityNote: z.string().optional(),
            }),
            culinaryRecommendation: z.object({
              dishName: z.string(),
              description: z.string(),
              whereToFind: z.string(),
            }),
            localInteractionTip: z.string(),
          })
        ),
        sustainabilitySummary: z.string(),
      }),
      prompt: `Create a custom ${input.days}-day cultural itinerary for "${input.destination}".
      Budget Level: ${input.budget}.
      Cultural Interests: ${input.interests.join(", ")}.
      ${input.accessibilityNeeds ? `Accessibility Requirements: ${input.accessibilityNeeds}. Ensure all activities and transport respect these needs.` : ""}
      
      Focus on authentic local engagement, supporting indigenous artisans, seasonal gastronomy, and sustainable tourism practices. Avoid crowded tourist traps during peak hours.`,
    });

    return object as ItineraryResponse;
  } catch (error) {
    console.warn("Gemini API error during itinerary generation, using fallback:", error);
    return {
      ...MOCK_ITINERARY_DATA,
      title: `${input.days}-Day ${input.destination} Cultural Immersion & Heritage Journey`,
      destination: input.destination,
      totalDays: input.days,
    };
  }
}

/**
 * Generates local events and cultural workshops
 */
export async function generateLocalEvents(
  destination: string,
  category: string = "all"
): Promise<LocalEvent[]> {
  const filteredMock = category === "all" 
    ? MOCK_EVENTS_DATA 
    : MOCK_EVENTS_DATA.filter((e) => e.category === category);

  if (!HAS_API_KEY) {
    return filteredMock;
  }

  try {
    const { object } = await generateObject({
      model: google("gemini-1.5-flash"),
      schema: z.object({
        events: z.array(
          z.object({
            id: z.string(),
            title: z.string(),
            dateRange: z.string(),
            category: z.enum(["festival", "music_dance", "workshop", "ritual"]),
            description: z.string(),
            location: z.string(),
            authenticityScore: z.number().min(80).max(100),
            ticketInfo: z.string(),
            image: z.string().default("https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80"),
          })
        ),
      }),
      prompt: `List 4 authentic seasonal cultural events, traditional festivals, artisan workshops, or community gatherings in or near "${destination}". Category filter: ${category}. Ensure high cultural authenticity scores and real local traditions.`,
    });

    return object.events as LocalEvent[];
  } catch (error) {
    console.warn("Gemini API error during events generation, using fallback:", error);
    return filteredMock;
  }
}
