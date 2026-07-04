import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { DestinationExplorer } from "@/components/discover/DestinationExplorer";
import { DiscoverResponse } from "@/lib/types";

const mockDiscoverData: DiscoverResponse = {
  destination: "Kyoto",
  country: "Japan",
  tagline: "Ancient Capital of Living Traditions",
  description: "A city where centuries-old traditions breathe in every temple gate and tea house.",
  heroImage: "https://example.com/kyoto.jpg",
  landmarks: [
    {
      id: "l1",
      name: "Fushimi Inari Taisha",
      category: "sacred",
      description: "Iconic shrine with thousands of torii gates",
      historicalSignificance: "Dedicated to Inari, god of rice and business",
      bestTimeToVisit: "Dawn or dusk to avoid crowds",
      image: "https://example.com/fushimi.jpg",
      tags: ["shrine", "torii", "pilgrimage"],
    },
  ],
  hiddenGems: [
    {
      id: "g1",
      name: "Pontocho Alley",
      location: "Central Kyoto",
      secretTip: "Visit after 9pm for local izakaya atmosphere",
      culturalRelevance: "Historic geisha entertainment district",
      image: "https://example.com/pontocho.jpg",
      category: "gastronomy",
    },
  ],
  etiquette: [
    {
      category: "sacred_sites",
      title: "Temple Etiquette",
      description: "Respect sacred spaces",
      doList: ["Remove shoes", "Stay quiet"],
      dontList: ["Don't photograph monks"],
    },
  ],
  heritage: [
    {
      title: "Nishijin Weaving",
      endangeredStatus: "Vulnerable",
      preservationEffort: "Local government apprenticeship program",
      howToSupport: "Buy directly from artisan workshops",
      indigenousCommunity: "Nishijin Textile Guild",
    },
  ],
};

describe("DestinationExplorer – Tab Navigation", () => {
  it("renders landmark tab as default active tab", () => {
    render(<DestinationExplorer data={mockDiscoverData} />);
    expect(screen.getByText("Fushimi Inari Taisha")).toBeTruthy();
  });

  it("tablist has proper ARIA role", () => {
    render(<DestinationExplorer data={mockDiscoverData} />);
    const tablist = document.querySelector('[role="tablist"]');
    expect(tablist).toBeTruthy();
  });

  it("tabs have aria-selected matching active state", () => {
    render(<DestinationExplorer data={mockDiscoverData} />);
    const tabs = document.querySelectorAll('[role="tab"]');
    expect(tabs.length).toBeGreaterThan(0);
    const selectedTabs = Array.from(tabs).filter(
      (tab) => tab.getAttribute("aria-selected") === "true"
    );
    expect(selectedTabs.length).toBe(1);
  });

  it("switches to hidden gems tab when clicked", () => {
    render(<DestinationExplorer data={mockDiscoverData} />);
    const gemsTab = screen.getByRole("tab", { name: /hidden gems/i });
    fireEvent.click(gemsTab);
    expect(screen.getByText("Pontocho Alley")).toBeTruthy();
  });

  it("switches to etiquette tab and shows etiquette content", () => {
    render(<DestinationExplorer data={mockDiscoverData} />);
    const etiquetteTab = screen.getByRole("tab", { name: /etiquette/i });
    fireEvent.click(etiquetteTab);
    expect(screen.getByText("Temple Etiquette")).toBeTruthy();
  });

  it("switches to heritage tab and shows heritage content", () => {
    render(<DestinationExplorer data={mockDiscoverData} />);
    const heritageTab = screen.getByRole("tab", { name: /heritage/i });
    fireEvent.click(heritageTab);
    expect(screen.getByText("Nishijin Weaving")).toBeTruthy();
  });
});

describe("DestinationExplorer – Landmark Accessibility", () => {
  it("save button has descriptive aria-label", () => {
    render(<DestinationExplorer data={mockDiscoverData} />);
    const saveBtn = screen.getByRole("button", { name: /save fushimi inari taisha to passport/i });
    expect(saveBtn).toBeTruthy();
  });

  it("landmark image has meaningful alt text", () => {
    render(<DestinationExplorer data={mockDiscoverData} />);
    const img = screen.getByAltText("Fushimi Inari Taisha");
    expect(img).toBeTruthy();
  });
});

describe("DestinationExplorer – Save to Passport", () => {
  beforeEach(() => localStorage.clear());

  it("persists landmark to localStorage on save click", () => {
    render(<DestinationExplorer data={mockDiscoverData} />);
    const saveBtn = screen.getByRole("button", { name: /save fushimi inari taisha to passport/i });
    fireEvent.click(saveBtn);
    const saved = JSON.parse(localStorage.getItem("wanderlore_saved_items") ?? "[]");
    expect(saved.length).toBeGreaterThan(0);
    expect(saved[0].title).toBe("Fushimi Inari Taisha");
  });
});
