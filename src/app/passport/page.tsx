import React from "react";
import { Metadata } from "next";
import { CulturalPassport } from "@/components/passport/CulturalPassport";

export const metadata: Metadata = {
  title: "My AI Cultural Passport & Badges | WanderLore AI",
  description: "View your earned cultural stamps, bookmarked hidden gems, and saved sustainable itineraries in WanderLore AI.",
};

export default function PassportPage() {
  return <CulturalPassport />;
}
