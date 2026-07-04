import { NextResponse } from "next/server";
import { eventsSchema } from "@/lib/validations";
import { checkRateLimit, getClientIp, sanitizeInput } from "@/lib/security";
import { generateLocalEvents } from "@/lib/ai/gemini-service";

export async function POST(req: Request) {
  try {
    const ip = getClientIp(req);
    const rateLimit = checkRateLimit(ip, 30, 60 * 1000);

    if (!rateLimit.success) {
      return NextResponse.json(
        { error: "Too many requests. Please wait a moment." },
        { status: 429, headers: { "Retry-After": "60" } }
      );
    }

    const body = await req.json();
    const validated = eventsSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: "Invalid events query", details: validated.error.issues },
        { status: 400 }
      );
    }

    const destination = sanitizeInput(validated.data.destination);
    const category = validated.data.category || "all";

    const data = await generateLocalEvents(destination, category);

    return NextResponse.json(
      { success: true, data },
      {
        status: 200,
        headers: {
          "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
        },
      }
    );
  } catch (error: any) {
    console.error("Events API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch cultural events and workshops" },
      { status: 500 }
    );
  }
}
