import { describe, it, expect } from "vitest";
import { generateDiscovery, generateStory, generateItinerary, generateLocalEvents } from "@/lib/ai/gemini-service";

// These tests make real network calls to Gemini/Wikipedia APIs.
// Allow 30s per test for reliable CI/CD execution.
const TEST_TIMEOUT = 30_000;

describe("Live Factual Discovery & Storytelling Integrity (Zero Mock Data)", () => {
  it("should dynamically generate discovery data for Kyoto without static mock files", async () => {
    const disc = await generateDiscovery("Kyoto");
    expect(disc).toBeDefined();
    expect(disc.destination).toBe("Kyoto");
    expect(disc.landmarks.length).toBeGreaterThan(0);
    expect(disc.hiddenGems.length).toBeGreaterThan(0);
    expect(disc.heroImage).toBeTruthy();
  }, TEST_TIMEOUT);

  it("should dynamically generate discovery data for any arbitrary city like Lucknow", async () => {
    const disc = await generateDiscovery("Lucknow");
    expect(disc).toBeDefined();
    expect(disc.destination).toBe("Lucknow");
    expect(disc.landmarks.length).toBeGreaterThan(0);
  }, TEST_TIMEOUT);

  it("should dynamically generate storytelling for all personas without mock fallbacks", async () => {
    const personas = ["historian", "artisan", "bard", "anthropologist"] as const;
    for (const p of personas) {
      const story = await generateStory("Kyoto", "Kinkaku-ji", p);
      expect(story).toBeDefined();
      expect(story.storyContent).toBeTruthy();
      expect(story.culturalProverb.translation).toBeTruthy();
    }
  }, TEST_TIMEOUT);

  it("should generate dynamic itineraries and local events", async () => {
    const itin = await generateItinerary({ destination: "Kyoto", days: 3, budget: "moderate", interests: ["history"] });
    expect(itin.totalDays).toBe(3);
    expect(itin.days.length).toBe(3);

    const events = await generateLocalEvents("Kyoto");
    expect(events.length).toBeGreaterThan(0);
  }, TEST_TIMEOUT);
});
