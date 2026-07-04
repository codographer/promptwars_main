"use client";

import React, { useState, useEffect } from "react";
import { Eye, Type, Volume2, ShieldAlert, Check, X } from "lucide-react";

export function AccessibilityMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [textSize, setTextSize] = useState<"normal" | "large" | "xl">("normal");
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [announcement, setAnnouncement] = useState("");

  // Load preferences from localStorage on mount
  useEffect(() => {
    const timeout = setTimeout(() => {
      const savedContrast = localStorage.getItem("a11y_high_contrast") === "true";
      const savedSize = (localStorage.getItem("a11y_text_size") as "normal" | "large" | "xl") || "normal";
      const savedVoice = localStorage.getItem("a11y_voice") !== "false";

      setHighContrast(savedContrast);
      setTextSize(savedSize);
      setVoiceEnabled(savedVoice);

      if (savedContrast) document.documentElement.classList.add("high-contrast");
      if (savedSize === "large") document.documentElement.style.fontSize = "115%";
      else if (savedSize === "xl") document.documentElement.style.fontSize = "130%";
    }, 0);
    return () => clearTimeout(timeout);
  }, []);

  const toggleHighContrast = () => {
    const nextState = !highContrast;
    setHighContrast(nextState);
    localStorage.setItem("a11y_high_contrast", String(nextState));
    setTimeout(() => {
      if (nextState) document.documentElement.classList.add("high-contrast");
      else document.documentElement.classList.remove("high-contrast");
    }, 0);
    announce(nextState ? "High contrast mode enabled" : "High contrast mode disabled");
  };

  const applyTextSize = (size: "normal" | "large" | "xl") => {
    setTextSize(size);
    localStorage.setItem("a11y_text_size", size);
    setTimeout(() => {
      if (size === "large") document.documentElement.style.fontSize = "115%";
      else if (size === "xl") document.documentElement.style.fontSize = "130%";
      else document.documentElement.style.fontSize = "100%";
    }, 0);
    if (size === "large") announce("Text size set to large");
    else if (size === "xl") announce("Text size set to extra large");
    else announce("Text size reset to normal");
  };

  const toggleVoice = () => {
    const nextState = !voiceEnabled;
    setVoiceEnabled(nextState);
    localStorage.setItem("a11y_voice", String(nextState));
    announce(nextState ? "Audio narration enabled" : "Audio narration muted");
  };

  const announce = (msg: string) => {
    setAnnouncement(msg);
    setTimeout(() => setAnnouncement(""), 3000);
  };

  return (
    <>
      {/* Screen Reader Live Region */}
      <div
        className="sr-only"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {announcement}
      </div>

      {/* Floating Trigger Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Open Accessibility Menu"
          aria-expanded={isOpen}
          aria-controls="accessibility-dialog"
          className="flex items-center justify-center w-12 h-12 rounded-full bg-[#E07A5F] text-white shadow-xl hover:bg-[#C65D42] transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-[#D4AF37]"
        >
          <Eye className="w-6 h-6 animate-pulse" />
        </button>

        {/* Modal Panel */}
        {isOpen && (
          <div
            id="accessibility-dialog"
            role="dialog"
            aria-label="Accessibility Settings"
            aria-modal="true"
            className="absolute bottom-16 right-0 w-80 p-5 rounded-2xl glass-panel-gold bg-[#181B26]/95 border border-[#D4AF37]/30 shadow-2xl backdrop-blur-xl text-[#F4F1DE] transition-all duration-300"
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#2A2E3D]">
              <div className="flex items-center gap-2 text-[#D4AF37] font-semibold">
                <ShieldAlert className="w-5 h-5" />
                <span>Accessibility (WCAG 2.1)</span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                aria-label="Close Accessibility Menu"
                className="text-[#9496A1] hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 space-y-4">
              {/* High Contrast Toggle */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">High Contrast Theme</span>
                <button
                  onClick={toggleHighContrast}
                  aria-pressed={highContrast}
                  className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-200 ${
                    highContrast ? "bg-[#2A9D8F]" : "bg-[#2A2E3D]"
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${
                      highContrast ? "translate-x-6" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              {/* Text Size Controls */}
              <div>
                <span className="text-sm font-medium block mb-2 flex items-center gap-1.5">
                  <Type className="w-4 h-4 text-[#E07A5F]" /> Text Scaling
                </span>
                <div className="grid grid-cols-3 gap-2" role="group" aria-label="Text Scaling Options">
                  {(["normal", "large", "xl"] as const).map((size) => (
                    <button
                      key={size}
                      onClick={() => applyTextSize(size)}
                      aria-pressed={textSize === size}
                      className={`py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                        textSize === size
                          ? "bg-[#D4AF37] text-[#0F1117] border-[#D4AF37] shadow-md"
                          : "bg-[#0F1117]/60 text-[#9496A1] border-[#2A2E3D] hover:border-[#D4AF37]/50"
                      }`}
                    >
                      {size.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              {/* Audio Narration Toggle */}
              <div className="flex items-center justify-between pt-2 border-t border-[#2A2E3D]">
                <span className="text-sm font-medium flex items-center gap-1.5">
                  <Volume2 className="w-4 h-4 text-[#2A9D8F]" /> Story Voice Narration
                </span>
                <button
                  onClick={toggleVoice}
                  aria-pressed={voiceEnabled}
                  className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-200 ${
                    voiceEnabled ? "bg-[#2A9D8F]" : "bg-[#2A2E3D]"
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${
                      voiceEnabled ? "translate-x-6" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            </div>

            <div className="mt-5 text-[11px] text-[#9496A1] bg-[#0F1117]/80 p-2.5 rounded-lg border border-[#2A2E3D] text-center flex items-center justify-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-[#2A9D8F]" />
              <span>Keyboard & ARIA screen reader optimized</span>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
