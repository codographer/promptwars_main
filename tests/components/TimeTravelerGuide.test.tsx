import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { TimeTravelerGuide } from "@/components/storyteller/TimeTravelerGuide";

describe("TimeTravelerGuide Component", () => {
  it("should render the component with default Kyoto landmark and historian persona", () => {
    render(<TimeTravelerGuide destination="Kyoto" initialLandmark="Kinkaku-ji" />);
    expect(screen.getByText(/Immersive Historical Folklore & Myths/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Lord Kenjiro/i)[0]).toBeInTheDocument();
    expect(screen.getAllByText(/Master Haru/i)[0]).toBeInTheDocument();
  });

  it("should allow switching to another persona like Old Ren (Wandering Shamisen Bard)", () => {
    render(<TimeTravelerGuide destination="Kyoto" />);
    const bardButton = screen.getByText(/Old Ren/i).closest("button");
    expect(bardButton).toBeInTheDocument();
    if (bardButton) {
      act(() => {
        fireEvent.click(bardButton);
      });
      expect(bardButton).toHaveAttribute("aria-checked", "true");
    }
  });

  it("should display the audio narration button", () => {
    render(<TimeTravelerGuide destination="Kyoto" />);
    const listenButton = screen.getByText(/Listen to Story/i);
    expect(listenButton).toBeInTheDocument();
  });
});
