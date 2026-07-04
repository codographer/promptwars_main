import { NextResponse } from "next/server";
import { storytellerSchema } from "@/lib/validations";
import { checkRateLimit, getClientIp, sanitizeInput } from "@/lib/security";
import { generateStory } from "@/lib/ai/gemini-service";

export async function POST(req: Request) {
  try {
    const ip = getClientIp(req);
    const rateLimit = checkRateLimit(ip, 40, 60 * 1000);

    if (!rateLimit.success) {
      return NextResponse.json(
        { error: "Too many requests. Please take a moment before asking another story." },
        { status: 429, headers: { "Retry-After": "60" } }
      );
    }

    const body = await req.json();
    const validated = storytellerSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: "Invalid storyteller request", details: validated.error.issues },
        { status: 400 }
      );
    }

    const destination = sanitizeInput(validated.data.destination);
    const landmarkName = sanitizeInput(validated.data.landmarkName);
    const customTopic = validated.data.customTopic
      ? sanitizeInput(validated.data.customTopic)
      : undefined;

    const data = await generateStory(
      destination,
      landmarkName,
      validated.data.persona,
      customTopic
    );

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
    console.error("Storyteller API Error:", error);
    return NextResponse.json(
      { error: "Failed to generate cultural story" },
      { status: 500 }
    );
  }
}
