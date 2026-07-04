import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { LocalEventsCalendar } from "@/components/events/LocalEventsCalendar";
import { LocalEvent } from "@/lib/types";

const mockEvents: LocalEvent[] = [
  {
    id: "e1",
    title: "Gion Matsuri Festival",
    dateRange: "July 1–31, 2025",
    category: "festival",
    description: "One of Japan's most famous festivals celebrating the Yasaka Shrine",
    location: "Yasaka Shrine, Kyoto",
    authenticityScore: 98,
    ticketInfo: "Free entry",
    image: "https://example.com/gion.jpg",
  },
  {
    id: "e2",
    title: "Kodo Drumming Workshop",
    dateRange: "August 5–6, 2025",
    category: "workshop",
    description: "Participate in traditional taiko drumming under master artisans",
    location: "Nishijin Cultural Center",
    authenticityScore: 95,
    ticketInfo: "¥3,000 per session",
    image: "https://example.com/kodo.jpg",
  },
];

describe("LocalEventsCalendar – Rendering with Initial Events", () => {
  it("renders calendar heading with destination name", () => {
    render(<LocalEventsCalendar destination="Kyoto" initialEvents={mockEvents} />);
    expect(screen.getByText(/live events.*kyoto/i)).toBeTruthy();
  });

  it("renders all initial events", () => {
    render(<LocalEventsCalendar destination="Kyoto" initialEvents={mockEvents} />);
    expect(screen.getByText("Gion Matsuri Festival")).toBeTruthy();
    expect(screen.getByText("Kodo Drumming Workshop")).toBeTruthy();
  });

  it("renders authenticity score for each event", () => {
    render(<LocalEventsCalendar destination="Kyoto" initialEvents={mockEvents} />);
    expect(screen.getByText(/98% Authentic/i)).toBeTruthy();
    expect(screen.getByText(/95% Authentic/i)).toBeTruthy();
  });

  it("renders event date ranges", () => {
    render(<LocalEventsCalendar destination="Kyoto" initialEvents={mockEvents} />);
    expect(screen.getByText(/july 1.*31, 2025/i)).toBeTruthy();
  });
});

describe("LocalEventsCalendar – Category Filters", () => {
  it("renders filter category buttons", () => {
    render(<LocalEventsCalendar destination="Kyoto" initialEvents={mockEvents} />);
    expect(screen.getByRole("button", { name: /all gatherings/i })).toBeTruthy();
    expect(screen.getByText(/traditional festivals/i)).toBeTruthy();
    expect(screen.getByText(/artisan workshops/i)).toBeTruthy();
  });

  it("filter buttons are wrapped in a group with aria-label", () => {
    render(<LocalEventsCalendar destination="Kyoto" initialEvents={mockEvents} />);
    const group = document.querySelector('[role="group"][aria-label="Event Categories"]');
    expect(group).toBeTruthy();
  });
});

describe("LocalEventsCalendar – Bookmark Events", () => {
  beforeEach(() => localStorage.clear());

  it("saves event to localStorage when Bookmark Event is clicked", () => {
    render(<LocalEventsCalendar destination="Kyoto" initialEvents={mockEvents} />);
    const bookmarkBtns = screen.getAllByRole("button", { name: /bookmark event/i });
    fireEvent.click(bookmarkBtns[0]);
    const saved = JSON.parse(localStorage.getItem("wanderlore_saved_items") ?? "[]");
    expect(saved.length).toBeGreaterThan(0);
    expect(saved[0].title).toBe("Gion Matsuri Festival");
  });

  it("changes button text to Saved to Passport after clicking", async () => {
    render(<LocalEventsCalendar destination="Kyoto" initialEvents={mockEvents} />);
    const bookmarkBtns = screen.getAllByRole("button", { name: /bookmark event/i });
    fireEvent.click(bookmarkBtns[0]);
    await waitFor(() => {
      expect(screen.getByText(/Saved to Passport/i)).toBeTruthy();
    });
  });
});

describe("LocalEventsCalendar – API Loading State", () => {
  it("fetches events from API when no initialEvents are provided", async () => {
    const mockResponse = { success: true, data: mockEvents };
    global.fetch = vi.fn().mockResolvedValue({
      json: async () => mockResponse,
    });

    render(<LocalEventsCalendar destination="Kyoto" />);
    await waitFor(() => {
      expect(screen.getByText("Gion Matsuri Festival")).toBeTruthy();
    });

    (global.fetch as ReturnType<typeof vi.fn>).mockRestore();
  });
});
