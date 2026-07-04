import React from "react";
import { Metadata } from "next";
import { generateDiscovery } from "@/lib/ai/gemini-service";
import { DestinationDashboardClient } from "./DestinationDashboardClient";

interface Props {
  params: Promise<{ destination: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { destination } = await params;
  const decoded = decodeURIComponent(destination);
  const capital = decoded.charAt(0).toUpperCase() + decoded.slice(1);

  return {
    title: `${capital} Cultural Guide & Time-Traveler Stories | WanderLore AI`,
    description: `Explore authentic attractions, secret hidden gems, local etiquette, and AI time-traveler audio stories for ${capital}.`,
  };
}

export default async function ExploreDestinationPage({ params }: Props) {
  const { destination } = await params;
  const decoded = decodeURIComponent(destination);
  const data = await generateDiscovery(decoded);

  return <DestinationDashboardClient data={data} destination={data.destination} />;
}
