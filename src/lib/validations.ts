import { z } from "zod";

export const discoverSchema = z.object({
  destination: z
    .string()
    .min(2, "Destination name must be at least 2 characters")
    .max(100, "Destination name is too long")
    .trim(),
});

export const storytellerSchema = z.object({
  destination: z.string().min(2).max(100).trim(),
  landmarkName: z.string().min(2).max(150).trim(),
  persona: z.enum(["historian", "artisan", "bard", "anthropologist"]),
  customTopic: z.string().max(300).optional(),
});

export const itinerarySchema = z.object({
  destination: z.string().min(2, "Destination is required").max(100).trim(),
  days: z
    .number({ message: "Number of days is required" })
    .min(1, "At least 1 day is required")
    .max(14, "Maximum itinerary length is 14 days"),
  budget: z.enum(["budget", "moderate", "luxury"], {
    message: "Please select a budget level",
  }),
  interests: z
    .array(z.string())
    .min(1, "Select at least one cultural interest"),
  accessibilityNeeds: z.string().max(300).optional(),
});

export const eventsSchema = z.object({
  destination: z.string().min(2).max(100).trim(),
  category: z
    .enum(["all", "festival", "music_dance", "workshop", "ritual"])
    .optional()
    .default("all"),
});

export type DiscoverInput = z.infer<typeof discoverSchema>;
export type StorytellerInput = z.infer<typeof storytellerSchema>;
export type ItineraryInput = z.infer<typeof itinerarySchema>;
export type EventsInput = z.infer<typeof eventsSchema>;
