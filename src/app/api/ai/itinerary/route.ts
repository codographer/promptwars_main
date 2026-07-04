import { NextResponse } from "next/server";
import { itinerarySchema } from "@/lib/validations";
import { checkRateLimit, getClientIp, sanitizeInput } from "@/lib/security";
import { generateItinerary } from "@/lib/ai/gemini-service";

export async function POST(req: Request) {
  try {
    const ip = getClientIp(req);
    const rateLimit = checkRateLimit(ip, 20, 60 * 1000);

    if (!rateLimit.success) {
      return NextResponse.json(
        { error: "Too many itinerary requests. Please try again soon." },
        { status: 429, headers: { "Retry-After": "60" } }
      );
    }

    const body = await req.json();
    const validated = itinerarySchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: "Invalid itinerary parameters", details: validated.error.issues },
        { status: 400 }
      );
    }

    const sanitizedInput = {
      ...validated.data,
      destination: sanitizeInput(validated.data.destination),
      interests: validated.data.interests.map(sanitizeInput),
      accessibilityNeeds: validated.data.accessibilityNeeds
        ? sanitizeInput(validated.data.accessibilityNeeds)
        : undefined,
    };

    const data = await generateItinerary(sanitizedInput);

    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error: any) {
    console.error("Itinerary API Error:", error);
    return NextResponse.json(
      { error: "Failed to generate custom cultural itinerary" },
      { status: 500 }
    );
  }
}
