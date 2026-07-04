import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { ItineraryBuilder } from "@/components/itinerary/ItineraryBuilder";
import { ItineraryResponse } from "@/lib/types";

const mockItinerary: ItineraryResponse = {
  title: "Kyoto Heritage Immersion Journey",
  destination: "Kyoto",
  totalDays: 2,
  sustainabilitySummary:
    "This itinerary prioritizes local artisan workshops, reducing carbon footprint and supporting cultural preservation.",
  days: [
    {
      dayNumber: 1,
      theme: "Sacred Shrines & Matcha Ceremony",
      morningActivity: {
        time: "07:00",
        title: "Fushimi Inari Dawn Walk",
        description: "Walk the 10,000 vermilion torii gates at sunrise before crowds arrive",
        culturalSignificance: "The fox deity Inari is central to Japanese rice culture and business prosperity",
      },
      afternoonActivity: {
        time: "13:00",
        title: "Uji Matcha Tasting",
        description: "Visit a 300-year-old tea house and learn about the tea ceremony",
        culturalSignificance: "Tea ceremony (chado) embodies the wabi-sabi philosophy of impermanence",
      },
      eveningActivity: {
        time: "19:00",
        title: "Gion Lantern Walk",
        description: "Explore the historic geisha entertainment district in the evening glow",
        culturalSignificance: "Gion represents Japan's intangible cultural heritage of geiko arts",
      },
      culinaryRecommendation: {
        dishName: "Kaiseki Dinner",
        description: "Multi-course seasonal Kyoto cuisine",
        whereToFind: "Kikunoi Restaurant in Higashiyama",
      },
      localInteractionTip: "Bow gently when entering any temple; avoid photography inside sacred halls",
    },
    {
      dayNumber: 2,
      theme: "Artisan Crafts & Hidden Alleys",
      morningActivity: {
        time: "09:00",
        title: "Nishijin Textile Workshop",
        description: "Learn traditional loom weaving with a 5th-generation weaver",
        culturalSignificance: "Nishijin weaving has been designated an Intangible Cultural Heritage",
      },
      afternoonActivity: {
        time: "14:00",
        title: "Philosopher's Path Stroll",
        description: "Walk the stone path along the canal lined with 500 cherry trees",
        culturalSignificance: "Named after philosopher Nishida Kitaro who meditated here daily",
      },
      eveningActivity: {
        time: "18:30",
        title: "Pontocho Dining Experience",
        description: "Enjoy authentic Kyoto cuisine in a narrow historic alley",
        culturalSignificance: "Pontocho has preserved its traditional machiya architecture since the Edo period",
      },
      culinaryRecommendation: {
        dishName: "Yudofu",
        description: "Delicate tofu hot pot, a Kyoto specialty",
        whereToFind: "Junsei restaurant near Nanzen-ji",
      },
      localInteractionTip: "Ask shop owners permission before photographing their wares",
    },
  ],
};

beforeEach(() => {
  localStorage.clear();
  vi.restoreAllMocks();
});

describe("ItineraryBuilder – Empty State", () => {
  it("renders itinerary builder heading", () => {
    render(<ItineraryBuilder destination="Kyoto" />);
    expect(screen.getByText(/design your custom journey in kyoto/i)).toBeTruthy();
  });

  it("shows empty prompt before itinerary is generated", () => {
    render(<ItineraryBuilder destination="Kyoto" />);
    expect(screen.getByText(/no custom itinerary generated yet/i)).toBeTruthy();
  });

  it("renders duration slider with proper ARIA attributes", () => {
    render(<ItineraryBuilder destination="Kyoto" />);
    const slider = screen.getByRole("slider");
    expect(slider).toBeTruthy();
    expect(slider.getAttribute("aria-valuemin")).toBe("1");
    expect(slider.getAttribute("aria-valuemax")).toBe("7");
  });

  it("renders Generate AI Itinerary submit button", () => {
    render(<ItineraryBuilder destination="Kyoto" />);
    expect(screen.getByRole("button", { name: /generate ai itinerary/i })).toBeTruthy();
  });
});

describe("ItineraryBuilder – Itinerary Display (mocked API)", () => {
  beforeEach(() => {
    global.fetch = vi.fn().mockResolvedValue({
      json: async () => ({ success: true, data: mockItinerary }),
    });
  });

  it("displays itinerary title after generation", async () => {
    render(<ItineraryBuilder destination="Kyoto" />);
    const generateBtn = screen.getByRole("button", { name: /generate ai itinerary/i });
    fireEvent.click(generateBtn);

    await waitFor(() => {
      expect(screen.getByText("Kyoto Heritage Immersion Journey")).toBeTruthy();
    });
  });

  it("shows sustainability summary banner", async () => {
    render(<ItineraryBuilder destination="Kyoto" />);
    fireEvent.click(screen.getByRole("button", { name: /generate ai itinerary/i }));
    await waitFor(() => {
      expect(screen.getByText(/prioritizes local artisan workshops/i)).toBeTruthy();
    });
  });

  it("renders day 1 and day 2 schedule", async () => {
    render(<ItineraryBuilder destination="Kyoto" />);
    fireEvent.click(screen.getByRole("button", { name: /generate ai itinerary/i }));
    await waitFor(() => {
      expect(screen.getByText(/Sacred Shrines.*Matcha/i)).toBeTruthy();
      expect(screen.getByText(/Artisan Crafts.*Hidden Alleys/i)).toBeTruthy();
    });
  });

  it("displays morning, afternoon, evening activities for a day", async () => {
    render(<ItineraryBuilder destination="Kyoto" />);
    fireEvent.click(screen.getByRole("button", { name: /generate ai itinerary/i }));
    await waitFor(() => {
      expect(screen.getByText("Fushimi Inari Dawn Walk")).toBeTruthy();
      expect(screen.getByText("Uji Matcha Tasting")).toBeTruthy();
      expect(screen.getByText("Gion Lantern Walk")).toBeTruthy();
    });
  });

  it("Save Itinerary button has accessible aria-label", async () => {
    render(<ItineraryBuilder destination="Kyoto" />);
    fireEvent.click(screen.getByRole("button", { name: /generate ai itinerary/i }));
    await waitFor(() => {
      const saveBtn = screen.getByRole("button", {
        name: /save this itinerary to cultural passport/i,
      });
      expect(saveBtn).toBeTruthy();
    });
  });

  it("Export button has accessible aria-label", async () => {
    render(<ItineraryBuilder destination="Kyoto" />);
    fireEvent.click(screen.getByRole("button", { name: /generate ai itinerary/i }));
    await waitFor(() => {
      const exportBtn = screen.getByRole("button", { name: /export itinerary as markdown/i });
      expect(exportBtn).toBeTruthy();
    });
  });

  it("saves itinerary to localStorage on save click", async () => {
    render(<ItineraryBuilder destination="Kyoto" />);
    fireEvent.click(screen.getByRole("button", { name: /generate ai itinerary/i }));
    await waitFor(() => screen.getByText("Kyoto Heritage Immersion Journey"));

    const saveBtn = screen.getByRole("button", {
      name: /save this itinerary to cultural passport/i,
    });
    fireEvent.click(saveBtn);
    const saved = JSON.parse(localStorage.getItem("wanderlore_saved_items") ?? "[]");
    expect(saved.length).toBeGreaterThan(0);
    expect(saved[0].title).toBe("Kyoto Heritage Immersion Journey");
  });
});

describe("ItineraryBuilder – Loading State Accessibility", () => {
  it("shows accessible loading region while fetching", async () => {
    let resolvePromise: () => void;
    global.fetch = vi.fn().mockReturnValue(
      new Promise((res) => {
        resolvePromise = () => res({ json: async () => ({ success: true, data: mockItinerary }) });
      })
    );

    render(<ItineraryBuilder destination="Kyoto" />);
    fireEvent.click(screen.getByRole("button", { name: /generate ai itinerary/i }));

    await waitFor(() => {
      const statusEl = document.querySelector('[role="status"]');
      expect(statusEl).toBeTruthy();
    });

    resolvePromise!();
  });
});
