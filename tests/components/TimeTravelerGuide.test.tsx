import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, act, waitFor } from "@testing-library/react";
import { TimeTravelerGuide } from "@/components/storyteller/TimeTravelerGuide";

describe("TimeTravelerGuide Component", () => {
  beforeEach(() => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        data: {
          title: "The Story of Kinkaku-ji in Kyoto",
          personaName: "Court Scholar & Archivist",
          timePeriod: "Classical Heritage Era",
          storyContent: "A glorious golden sanctuary reflected in the calm waters of Kyoto.",
          audioScript: "Welcome to Kinkaku-ji.",
          historicalFact: "Built in 1397 as a retirement villa.",
          culturalProverb: {
            original: "Tradition is the preservation of fire.",
            translation: "Honor the wisdom of ancestors.",
            meaning: "Keep crafts and stories alive.",
          },
          tags: ["Zen", "Golden Pavilion"],
        },
      }),
    } as any);
  });

  it("should render the component with default Kyoto landmark and historian persona", async () => {
    await act(async () => {
      render(<TimeTravelerGuide destination="Kyoto" initialLandmark="Kinkaku-ji" />);
    });
    expect(screen.getByText(/Immersive Historical Folklore & Myths/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Court Scholar & Archivist/i)[0]).toBeInTheDocument();
    expect(screen.getAllByText(/Master Guild Craftsman/i)[0]).toBeInTheDocument();
  });

  it("should allow switching to another persona like Wandering Folklore Bard", async () => {
    await act(async () => {
      render(<TimeTravelerGuide destination="Kyoto" />);
    });
    const bardButton = screen.getAllByText(/Wandering Folklore Bard/i)[0].closest("button");
    expect(bardButton).toBeInTheDocument();
    if (bardButton) {
      await act(async () => {
        fireEvent.click(bardButton);
      });
      expect(bardButton).toHaveAttribute("aria-checked", "true");
    }
  });

  it("should display the audio narration button once story is loaded", async () => {
    await act(async () => {
      render(<TimeTravelerGuide destination="Kyoto" />);
    });
    const listenButton = await screen.findByText(/Listen to Story/i);
    expect(listenButton).toBeInTheDocument();
  });
});
