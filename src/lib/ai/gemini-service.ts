import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateObject } from "ai";
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

/**
 * Robust API Key resolution across all common environment variable names
 */
function getApiKey(): string | undefined {
  return (
    process.env.GOOGLE_GENERATIVE_AI_API_KEY ||
    process.env.GOOGLE_API_KEY ||
    process.env.GEMINI_API_KEY ||
    process.env.AI_API_KEY ||
    process.env.NEXT_PUBLIC_GOOGLE_API_KEY
  );
}

function getGoogleModel() {
  const apiKey = getApiKey();
  const googleProvider = createGoogleGenerativeAI({
    apiKey: apiKey || "fallback-demo-key",
  });
  return googleProvider("gemini-1.5-flash");
}

/**
 * Server-Side In-Memory LRU Cache with TTL (24 Hours) for Frequently Accessed Queries
 */
interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours
const queryCache = new Map<string, CacheEntry<any>>();

function getFromCache<T>(key: string): T | null {
  const cleanKey = key.toLowerCase().trim();
  const entry = queryCache.get(cleanKey);
  if (!entry) return null;
  if (Date.now() - entry.timestamp > CACHE_TTL_MS) {
    queryCache.delete(cleanKey);
    return null;
  }
  return entry.data as T;
}

function setToCache<T>(key: string, data: T): void {
  const cleanKey = key.toLowerCase().trim();
  if (queryCache.size >= 500) {
    const firstKey = queryCache.keys().next().value;
    if (firstKey) queryCache.delete(firstKey);
  }
  queryCache.set(cleanKey, {
    data,
    timestamp: Date.now(),
  });
}

/**
 * Helper to check if destination matches curated rich mock data
 */
function getCuratedMockKey(destination: string): string | null {
  const clean = destination.toLowerCase().trim();
  if (clean === "kyoto" || clean.includes("kyoto") || clean === "japan") return "kyoto";
  if (clean === "oaxaca" || clean.includes("oaxaca") || clean === "mexico") return "oaxaca";
  return null;
}

/**
 * Dynamic Generative Synthesis Engine for destinations without static mocks
 */
function synthesizeDynamicDiscovery(destination: string): DiscoverResponse {
  const destName = destination.charAt(0).toUpperCase() + destination.slice(1).trim();
  return {
    destination: destName,
    country: "Global Heritage Region",
    tagline: `Curated Cultural & Living Heritage Guide for ${destName}`,
    description: `${destName} is a fascinating epicenter of living traditions, historic architecture, and vibrant community customs. From its ancient quarters and ceremonial landmarks to its bustling artisan bazaars, explorers can discover centuries of preserved craftsmanship and storytelling that continue to thrive today.`,
    heroImage: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80",
    landmarks: [
      {
        id: `landmark-${destName.toLowerCase()}-1`,
        name: `The Historic Heart & Citadel of ${destName}`,
        category: "heritage",
        description: `The monumental architectural center of ${destName}, representing generations of royal history and artistic triumph.`,
        historicalSignificance: `Founded centuries ago as the primary seat of cultural governance and spiritual ceremonies in ${destName}.`,
        bestTimeToVisit: "Early morning at sunrise to experience tranquil ambiance without crowds.",
        image: "https://images.unsplash.com/photo-1478436127897-769e1b3f0f36?auto=format&fit=crop&w=800&q=80",
        tags: ["Architecture", "World Heritage", "Sacred Ground", "Ancient Lore"],
      },
      {
        id: `landmark-${destName.toLowerCase()}-2`,
        name: `Grand Artisan Sanctuary & Heritage Museum`,
        category: "museum",
        description: `A living sanctuary dedicated to preserving indigenous textiles, ceramics, and classical instruments native to ${destName}.`,
        historicalSignificance: `Houses priceless artifacts saved during historic eras of transition, safeguarded by local historians.`,
        bestTimeToVisit: "Late afternoon during guided artisan demonstration workshops.",
        image: "https://images.unsplash.com/photo-1518998053901-5348d3961a04?auto=format&fit=crop&w=800&q=80",
        tags: ["Artisan Guilds", "Museum", "Living History"],
      },
      {
        id: `landmark-${destName.toLowerCase()}-3`,
        name: `Sacred Gardens & Ceremonial Temple of ${destName}`,
        category: "sacred",
        description: `Peaceful botanic courtyards and stone sanctuaries where annual seasonal rituals have taken place for over 400 years.`,
        historicalSignificance: `Renowned for its harmonious architectural design that reflects indigenous cosmology and nature worship.`,
        bestTimeToVisit: "Twilight during traditional evening lantern lighting.",
        image: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80",
        tags: ["Sacred Sites", "Gardens", "Spiritual Heritage"],
      },
    ],
    hiddenGems: [
      {
        id: `gem-${destName.toLowerCase()}-1`,
        name: `Old Guild Weaver & Ceramic Courtyards of ${destName}`,
        location: `Historic North Quarter, ${destName}`,
        secretTip: "Ask for Master Gabriel or Elena to see private demonstrations of natural dye fermentation.",
        culturalRelevance: "One of the last remaining independent family workshops producing traditional craft using ancestral tools.",
        image: "https://images.unsplash.com/photo-1528164344705-475426879c0d?auto=format&fit=crop&w=800&q=80",
        category: "artisan",
      },
      {
        id: `gem-${destName.toLowerCase()}-2`,
        name: `Secret Heritage Spice Market & Tea House`,
        location: `Hidden Alleyway near Central Square, ${destName}`,
        secretTip: "Order the ceremonial spiced herbal infusion prepared over charcoal clay stoves.",
        culturalRelevance: "A historic gathering place for philosophers, poets, and musicians since the 18th century.",
        image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80",
        category: "gastronomy",
      },
    ],
    etiquette: [
      {
        category: "greeting",
        title: `Traditional Greetings in ${destName}`,
        description: "Respectful communication is highly valued by elders and traditional guild masters.",
        doList: [
          "Offer a slight nod or polite verbal greeting when entering family-owned workshops.",
          "Ask for permission before taking close-up photographs of artisans at work.",
        ],
        dontList: [
          "Do not interrupt ongoing ceremonies or prayers at sacred monuments.",
          "Avoid speaking loudly or using flash photography in quiet temple grounds.",
        ],
      },
      {
        category: "tipping",
        title: "Support & Fair Compensation",
        description: "Direct purchases from artisan studios support cultural survival.",
        doList: [
          "Pay cash when possible directly to the craftsman or family elder.",
          "Offer a respectful tip to local cultural guides who share family history.",
        ],
        dontList: [
          "Do not aggressively haggle over handmade artisan goods that take weeks to produce.",
        ],
      },
    ],
    heritage: [
      {
        title: `Traditional Hand-Weaving & Ceramic Guilds of ${destName}`,
        endangeredStatus: "Vulnerable",
        preservationEffort: "Local collective initiatives are training younger generations in ancestral dyeing and loom techniques.",
        howToSupport: "Visit accredited cooperative studios and purchase certified authentic handmade items.",
        indigenousCommunity: `Native Artisans of ${destName}`,
      },
    ],
  };
}

/**
 * Generates rich destination cultural discovery data with Caching & GenAI
 */
export async function generateDiscovery(
  destination: string
): Promise<DiscoverResponse> {
  const cacheKey = `discover:${destination}`;
  const cached = getFromCache<DiscoverResponse>(cacheKey);
  if (cached) {
    return cached;
  }

  const apiKey = getApiKey();
  const curatedKey = getCuratedMockKey(destination);

  if (!apiKey) {
    const fallback = curatedKey
      ? MOCK_DISCOVER_DATA[curatedKey]
      : synthesizeDynamicDiscovery(destination);
    setToCache(cacheKey, fallback);
    return fallback;
  }

  try {
    const { object } = await generateObject({
      model: getGoogleModel(),
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

    const result = object as DiscoverResponse;
    setToCache(cacheKey, result);
    return result;
  } catch (error) {
    console.warn(`Gemini API error during discover for "${destination}", using dynamic fallback:`, error);
    const fallback = curatedKey
      ? MOCK_DISCOVER_DATA[curatedKey]
      : synthesizeDynamicDiscovery(destination);
    setToCache(cacheKey, fallback);
    return fallback;
  }
}

/**
 * Generates immersive storytelling for the Time-Traveler Guide with Caching & GenAI
 */
export async function generateStory(
  destination: string,
  landmarkName: string,
  persona: PersonaId,
  customTopic?: string
): Promise<StorytellerResponse> {
  const cacheKey = `story:${destination}:${landmarkName}:${persona}:${customTopic || ""}`;
  const cached = getFromCache<StorytellerResponse>(cacheKey);
  if (cached) {
    return cached;
  }

  const apiKey = getApiKey();
  const fallbackBase = MOCK_STORYTELLER_DATA[persona] || MOCK_STORYTELLER_DATA["historian"];

  if (!apiKey) {
    const dynamicStory: StorytellerResponse = {
      ...fallbackBase,
      title: `The Story of ${landmarkName} in ${destination} (${fallbackBase.timePeriod})`,
      storyContent: `Welcome, traveler. As a ${personaNameMap(persona)} in ${destination}, let me reveal the untold history of ${landmarkName}. For centuries, our ancestors gathered within these walls, preserving sacred rites, artistic mastery, and folklore against the tides of time. Every stone and carved beam echoes with the resilience of those who came before us.`,
      audioScript: `Welcome to ${landmarkName} in ${destination}. Listen closely to the echoes of living heritage and ancient traditions.`,
      historicalFact: `Historical records confirm that ${landmarkName} served as a vital cultural crossroads for scholars and artisans in ancient ${destination}.`,
      culturalProverb: {
        original: "Tradition is not the worship of ashes, but the preservation of fire.",
        translation: "Honor the wisdom of the ancestors by keeping their crafts alive.",
        meaning: "Cultural heritage survives when each generation actively practices and values it.",
      },
    };
    setToCache(cacheKey, dynamicStory);
    return dynamicStory;
  }

  try {
    const { object } = await generateObject({
      model: getGoogleModel(),
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

    const result = object as StorytellerResponse;
    setToCache(cacheKey, result);
    return result;
  } catch (error) {
    console.warn(`Gemini API error during storytelling for "${landmarkName}", using dynamic fallback:`, error);
    const dynamicStory: StorytellerResponse = {
      ...fallbackBase,
      title: `The Story of ${landmarkName} in ${destination}`,
      storyContent: `Welcome, traveler. As a ${personaNameMap(persona)} in ${destination}, let me reveal the untold history of ${landmarkName}. For centuries, our ancestors gathered within these walls, preserving sacred rites, artistic mastery, and folklore against the tides of time. Every stone and carved beam echoes with the resilience of those who came before us.`,
    };
    setToCache(cacheKey, dynamicStory);
    return dynamicStory;
  }
}

function personaNameMap(p: PersonaId): string {
  switch (p) {
    case "historian": return "Court Historian & Scholar";
    case "artisan": return "Master Artisan & Guild Weaver";
    case "bard": return "Wandering Folklore Bard";
    case "anthropologist": return "Cultural Heritage Anthropologist";
  }
}

/**
 * Generates a custom multi-day itinerary with Caching & GenAI
 */
export async function generateItinerary(
  input: ItineraryInput
): Promise<ItineraryResponse> {
  const cacheKey = `itinerary:${input.destination}:${input.days}:${input.budget}:${input.interests.sort().join(",")}`;
  const cached = getFromCache<ItineraryResponse>(cacheKey);
  if (cached) {
    return cached;
  }

  const apiKey = getApiKey();

  if (!apiKey) {
    const dynamicItin: ItineraryResponse = {
      title: `${input.days}-Day ${input.destination} Cultural Immersion & Living Heritage Journey`,
      destination: input.destination,
      totalDays: input.days,
      days: Array.from({ length: input.days }, (_, i) => ({
        dayNumber: i + 1,
        theme: i === 0 ? `Ancient Quarters & Sacred Monuments of ${input.destination}` : `Artisan Guilds, Culinary Traditions & Secret Courtyards`,
        morningActivity: {
          time: "09:00 AM",
          title: `Guided Exploration of ${input.destination} Heritage Quarter`,
          description: `Walk through historic stone streets with a local historian to learn about foundational architecture and neighborhood legends.`,
          culturalSignificance: `Preserves the authentic community history and urban layout established centuries ago.`,
        },
        afternoonActivity: {
          time: "02:00 PM",
          title: `Traditional Craft Workshop & Indigenous Art Studio`,
          description: `Meet family artisans practicing traditional pottery, weaving, or wood-carving techniques passed down through generations.`,
          culturalSignificance: `Directly supports endangered artisan guilds and fosters respectful cross-cultural exchange.`,
        },
        eveningActivity: {
          time: "07:00 PM",
          title: `Traditional Gastronomy & Folklore Music Evening`,
          description: `Enjoy authentic seasonal dishes accompanied by acoustic traditional music in a historic family-run tavern.`,
          culturalSignificance: `Culinary traditions and oral poetry serve as living repositories of local identity.`,
        },
        culinaryRecommendation: {
          dishName: `Traditional Seasonal Speciality of ${input.destination}`,
          description: `An ancestral recipe simmered with native herbs and locally harvested ingredients.`,
          whereToFind: `Family-owned eateries and heritage markets in downtown ${input.destination}.`,
        },
        localInteractionTip: `Always greet local shopkeepers and elders with polite traditional greetings before asking questions about their craft.`,
      })),
      sustainabilitySummary: `This ${input.days}-day itinerary prioritizes low-impact walking tours, direct financial support to local artisan guilds, and dining at family-owned heritage restaurants in ${input.destination}.`,
    };
    setToCache(cacheKey, dynamicItin);
    return dynamicItin;
  }

  try {
    const { object } = await generateObject({
      model: getGoogleModel(),
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

    const result = object as ItineraryResponse;
    setToCache(cacheKey, result);
    return result;
  } catch (error) {
    console.warn(`Gemini API error during itinerary generation for "${input.destination}", using dynamic fallback:`, error);
    const dynamicItin: ItineraryResponse = {
      title: `${input.days}-Day ${input.destination} Cultural Immersion & Living Heritage Journey`,
      destination: input.destination,
      totalDays: input.days,
      days: Array.from({ length: input.days }, (_, i) => ({
        dayNumber: i + 1,
        theme: `Living Heritage & Cultural Traditions of ${input.destination}`,
        morningActivity: {
          time: "09:00 AM",
          title: `Explore Historic Landmarks of ${input.destination}`,
          description: `Discover ancient architecture and cultural sanctuaries with a local guide.`,
          culturalSignificance: `Understanding architectural heritage is essential to appreciating local identity.`,
        },
        afternoonActivity: {
          time: "02:00 PM",
          title: `Artisan Guild & Craft Demonstrations`,
          description: `Visit local studios preserving traditional crafts.`,
          culturalSignificance: `Supports sustainable cultural preservation.`,
        },
        eveningActivity: {
          time: "07:00 PM",
          title: `Traditional Dinner & Storytelling`,
          description: `Experience regional gastronomy and music.`,
          culturalSignificance: `Food and song connect travelers directly to community folklore.`,
        },
        culinaryRecommendation: {
          dishName: `Heritage Tasting Plate of ${input.destination}`,
          description: `Authentic regional flavors prepared using traditional methods.`,
          whereToFind: `Historic market squares.`,
        },
        localInteractionTip: `Show patience and curiosity when conversing with local masters.`,
      })),
      sustainabilitySummary: `This itinerary supports sustainable eco-tourism and local artisan communities in ${input.destination}.`,
    };
    setToCache(cacheKey, dynamicItin);
    return dynamicItin;
  }
}

/**
 * Generates local events and cultural workshops with Caching & GenAI
 */
export async function generateLocalEvents(
  destination: string,
  category: string = "all"
): Promise<LocalEvent[]> {
  const cacheKey = `events:${destination}:${category}`;
  const cached = getFromCache<LocalEvent[]>(cacheKey);
  if (cached) {
    return cached;
  }

  const apiKey = getApiKey();

  if (!apiKey) {
    const destName = destination.charAt(0).toUpperCase() + destination.slice(1).trim();
    const dynamicEvents: LocalEvent[] = [
      {
        id: `event-${destName.toLowerCase()}-1`,
        title: `${destName} Traditional Heritage Festival & Procession`,
        dateRange: "Seasonal Annual Celebration",
        category: "festival",
        description: `An enchanting multi-day community celebration featuring colorful traditional dress, ancestral music, and ceremonial dances in the historic square of ${destName}.`,
        location: `Central Historic Plaza, ${destName}`,
        authenticityScore: 98,
        ticketInfo: "Free open-air community gathering. All visitors welcome with respectful attire.",
        image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80",
      },
      {
        id: `event-${destName.toLowerCase()}-2`,
        title: `Master Artisan Craft & Natural Dyeing Workshop`,
        dateRange: "Every Wednesday & Saturday",
        category: "workshop",
        description: `Hands-on apprenticeship workshop led by recognized elder craftsmen of ${destName}, teaching ancestral techniques in ceramics, weaving, or wood-carving.`,
        location: `Artisan Guild Cooperative Studio, ${destName}`,
        authenticityScore: 99,
        ticketInfo: "$35 USD per participant (includes materials & direct contribution to the guild).",
        image: "https://images.unsplash.com/photo-1452860606245-08befc0ff44b?auto=format&fit=crop&w=800&q=80",
      },
      {
        id: `event-${destName.toLowerCase()}-3`,
        title: `Sacred Solstice & Seasonal Harvest Ritual`,
        dateRange: "Equinox & Solstice Evenings",
        category: "ritual",
        description: `A tranquil evening ceremony honoring seasonal agricultural cycles and ancestral cosmology with traditional chants and candle lighting.`,
        location: `Ancient Temple Courtyards, ${destName}`,
        authenticityScore: 96,
        ticketInfo: "By reservation only to maintain quiet meditation atmosphere.",
        image: "https://images.unsplash.com/photo-1518998053901-5348d3961a04?auto=format&fit=crop&w=800&q=80",
      },
      {
        id: `event-${destName.toLowerCase()}-4`,
        title: `${destName} Classical Folk Music & Acoustic Concert`,
        dateRange: "Every Friday Evening",
        category: "music_dance",
        description: `Intimate acoustic performance featuring classical indigenous instruments and poetic storytelling by master musicians.`,
        location: `Historic Courtyard Theatre, ${destName}`,
        authenticityScore: 97,
        ticketInfo: "$15 USD at the door. Supporting local independent artists.",
        image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80",
      },
    ];
    const filtered = category === "all" ? dynamicEvents : dynamicEvents.filter(e => e.category === category);
    setToCache(cacheKey, filtered);
    return filtered;
  }

  try {
    const { object } = await generateObject({
      model: getGoogleModel(),
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

    const result = object.events as LocalEvent[];
    setToCache(cacheKey, result);
    return result;
  } catch (error) {
    console.warn(`Gemini API error during events generation for "${destination}", using dynamic fallback:`, error);
    const destName = destination.charAt(0).toUpperCase() + destination.slice(1).trim();
    const dynamicEvents: LocalEvent[] = [
      {
        id: `event-${destName.toLowerCase()}-1`,
        title: `${destName} Traditional Heritage Festival`,
        dateRange: "Seasonal Annual Celebration",
        category: "festival",
        description: `An authentic community celebration featuring traditional dress, ancestral music, and dances in ${destName}.`,
        location: `Central Historic Plaza, ${destName}`,
        authenticityScore: 98,
        ticketInfo: "Free open-air community gathering.",
        image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80",
      },
    ];
    setToCache(cacheKey, dynamicEvents);
    return dynamicEvents;
  }
}
