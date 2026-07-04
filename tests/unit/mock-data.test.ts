import { describe, it, expect } from "vitest";
import {
  MOCK_DISCOVER_DATA,
  MOCK_STORYTELLER_DATA,
  MOCK_EVENTS_DATA,
  MOCK_ITINERARY_DATA,
} from "@/lib/ai/mock-data";

describe("Cultural Mock Data Integrity", () => {
  it("should contain comprehensive cultural dimensions for Kyoto", () => {
    const kyoto = MOCK_DISCOVER_DATA["kyoto"];
    expect(kyoto).toBeDefined();
    expect(kyoto.landmarks.length).toBeGreaterThan(0);
    expect(kyoto.hiddenGems.length).toBeGreaterThan(0);
    expect(kyoto.etiquette.length).toBeGreaterThan(0);
    expect(kyoto.heritage.length).toBeGreaterThan(0);
  });

  it("should contain comprehensive cultural dimensions for Oaxaca", () => {
    const oaxaca = MOCK_DISCOVER_DATA["oaxaca"];
    expect(oaxaca).toBeDefined();
    expect(oaxaca.landmarks.length).toBeGreaterThan(0);
    expect(oaxaca.hiddenGems.length).toBeGreaterThan(0);
  });

  it("should have all 4 required storytelling personas", () => {
    const personas = ["historian", "artisan", "bard", "anthropologist"] as const;
    personas.forEach((p) => {
      const story = MOCK_STORYTELLER_DATA[p];
      expect(story).toBeDefined();
      expect(story.storyContent).toBeTruthy();
      expect(story.culturalProverb.translation).toBeTruthy();
    });
  });

  it("should include high authenticity scores in local events", () => {
    expect(MOCK_EVENTS_DATA.length).toBeGreaterThan(0);
    MOCK_EVENTS_DATA.forEach((ev) => {
      expect(ev.authenticityScore).toBeGreaterThanOrEqual(90);
      expect(ev.location).toBeTruthy();
    });
  });

  it("should provide a multi-day itinerary with culinary recommendations", () => {
    expect(MOCK_ITINERARY_DATA.days.length).toBeGreaterThan(0);
    MOCK_ITINERARY_DATA.days.forEach((day) => {
      expect(day.culinaryRecommendation.dishName).toBeTruthy();
      expect(day.localInteractionTip).toBeTruthy();
    });
  });
});
