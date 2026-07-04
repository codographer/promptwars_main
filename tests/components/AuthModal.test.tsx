import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { AuthModal } from "@/components/auth/AuthModal";

// Mock next-auth
vi.mock("next-auth/react", () => ({
  signIn: vi.fn().mockResolvedValue({ ok: true }),
}));

const mockOnClose = vi.fn();
const mockOnSuccess = vi.fn();

beforeEach(() => {
  mockOnClose.mockClear();
  mockOnSuccess.mockClear();
  localStorage.clear();
  vi.spyOn(window, "location", "get").mockReturnValue({
    ...window.location,
    reload: vi.fn(),
  });
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("AuthModal – Accessibility (WCAG 2.1 AA)", () => {
  it("renders dialog with proper role and aria-modal", () => {
    render(<AuthModal isOpen onClose={mockOnClose} />);
    const dialog = screen.getByRole("dialog");
    expect(dialog).toBeTruthy();
    expect(dialog.getAttribute("aria-modal")).toBe("true");
  });

  it("dialog has aria-labelledby pointing to visible heading", () => {
    render(<AuthModal isOpen onClose={mockOnClose} />);
    const dialog = screen.getByRole("dialog");
    const labelId = dialog.getAttribute("aria-labelledby");
    expect(labelId).toBe("auth-modal-title");
    const heading = document.getElementById(labelId!);
    expect(heading).toBeTruthy();
    expect(heading!.textContent).toContain("Welcome Back");
  });

  it("all inputs have associated <label> via htmlFor/id", () => {
    render(<AuthModal isOpen onClose={mockOnClose} />);
    const emailInput = screen.getByLabelText(/email address/i);
    expect(emailInput).toBeTruthy();
    const passwordInput = screen.getByLabelText(/password/i);
    expect(passwordInput).toBeTruthy();
  });

  it("close button has descriptive aria-label", () => {
    render(<AuthModal isOpen onClose={mockOnClose} />);
    const closeBtn = screen.getByRole("button", { name: /close authentication dialog/i });
    expect(closeBtn).toBeTruthy();
  });

  it("calls onClose when ESC key is pressed", () => {
    render(<AuthModal isOpen onClose={mockOnClose} />);
    fireEvent.keyDown(document, { key: "Escape" });
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it("calls onClose when backdrop is clicked", () => {
    render(<AuthModal isOpen onClose={mockOnClose} />);
    const dialog = screen.getByRole("dialog");
    fireEvent.click(dialog);
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it("does not render when isOpen is false", () => {
    render(<AuthModal isOpen={false} onClose={mockOnClose} />);
    expect(screen.queryByRole("dialog")).toBeNull();
  });
});

describe("AuthModal – Sign Up mode", () => {
  it("shows Full Name field after clicking Sign Up toggle", () => {
    render(<AuthModal isOpen onClose={mockOnClose} />);
    const toggle = screen.getByRole("button", { name: /sign up/i });
    fireEvent.click(toggle);
    const nameInput = screen.getByLabelText(/full name/i);
    expect(nameInput).toBeTruthy();
  });

  it("heading updates to Join WanderLore AI in sign up mode", () => {
    render(<AuthModal isOpen onClose={mockOnClose} />);
    fireEvent.click(screen.getByRole("button", { name: /sign up/i }));
    expect(screen.getByText(/join wanderlore ai/i)).toBeTruthy();
  });
});

describe("AuthModal – Guest Mode", () => {
  it("persists guest user to localStorage on instant guest click", async () => {
    render(<AuthModal isOpen onClose={mockOnClose} onSuccessGuest={mockOnSuccess} />);
    const guestBtn = screen.getByRole("button", { name: /continue instantly as guest/i });
    fireEvent.click(guestBtn);
    const stored = JSON.parse(localStorage.getItem("wanderlore_user")!);
    expect(stored).toHaveProperty("name");
    expect(stored).toHaveProperty("email");
    expect(mockOnSuccess).toHaveBeenCalledTimes(1);
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });
});

describe("AuthModal – Google OAuth button", () => {
  it("renders Google sign-in button with accessible label", () => {
    render(<AuthModal isOpen onClose={mockOnClose} />);
    const googleBtn = screen.getByRole("button", { name: /continue with google/i });
    expect(googleBtn).toBeTruthy();
  });
});
