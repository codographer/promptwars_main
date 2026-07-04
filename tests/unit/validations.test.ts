import { describe, it, expect } from "vitest";
import {
  discoverSchema,
  storytellerSchema,
  itinerarySchema,
  eventsSchema,
} from "@/lib/validations";
import { checkRateLimit, sanitizeInput } from "@/lib/security";

describe("Zod Validation Schemas", () => {
  it("should validate a correct discover request", () => {
    const input = { destination: "Kyoto" };
    const result = discoverSchema.safeParse(input);
    expect(result.success).toBe(true);
  });

  it("should reject too short destination names", () => {
    const input = { destination: "K" };
    const result = discoverSchema.safeParse(input);
    expect(result.success).toBe(false);
  });

  it("should validate a storyteller request with persona", () => {
    const input = {
      destination: "Kyoto",
      landmarkName: "Fushimi Inari",
      persona: "historian",
    };
    const result = storytellerSchema.safeParse(input);
    expect(result.success).toBe(true);
  });

  it("should reject invalid persona in storyteller request", () => {
    const input = {
      destination: "Kyoto",
      landmarkName: "Fushimi Inari",
      persona: "wizard",
    };
    const result = storytellerSchema.safeParse(input);
    expect(result.success).toBe(false);
  });

  it("should validate itinerary parameters", () => {
    const input = {
      destination: "Oaxaca",
      days: 3,
      budget: "moderate",
      interests: ["Gastronomy & Culinary Arts"],
    };
    const result = itinerarySchema.safeParse(input);
    expect(result.success).toBe(true);
  });

  it("should reject itinerary with 0 days or > 14 days", () => {
    const input = {
      destination: "Oaxaca",
      days: 15,
      budget: "moderate",
      interests: ["Gastronomy"],
    };
    const result = itinerarySchema.safeParse(input);
    expect(result.success).toBe(false);
  });
});

describe("Security & Rate Limiting", () => {
  it("should sanitize XSS HTML tags from input string", () => {
    const dirty = '<script>alert("xss")</script> Kyoto & Oaxaca';
    const clean = sanitizeInput(dirty);
    expect(clean).not.toContain("<script>");
    expect(clean).toContain("&lt;script&gt;");
  });

  it("should allow requests under the rate limit", () => {
    const ip = "test-ip-1";
    const res1 = checkRateLimit(ip, 5, 10000);
    expect(res1.success).toBe(true);
    expect(res1.remaining).toBe(4);
  });

  it("should block requests exceeding rate limit", () => {
    const ip = "test-ip-blocked";
    for (let i = 0; i < 3; i++) {
      checkRateLimit(ip, 3, 10000);
    }
    const blocked = checkRateLimit(ip, 3, 10000);
    expect(blocked.success).toBe(false);
    expect(blocked.remaining).toBe(0);
  });
});
