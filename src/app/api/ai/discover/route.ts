import { NextResponse } from "next/server";
import { discoverSchema } from "@/lib/validations";
import { checkRateLimit, getClientIp, sanitizeInput } from "@/lib/security";
import { generateDiscovery } from "@/lib/ai/gemini-service";

export async function POST(req: Request) {
  try {
    const ip = getClientIp(req);
    const rateLimit = checkRateLimit(ip, 30, 60 * 1000);

    if (!rateLimit.success) {
      return NextResponse.json(
        { error: "Too many requests. Please try again in a minute." },
        { status: 429, headers: { "Retry-After": "60" } }
      );
    }

    const body = await req.json();
    const validated = discoverSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: "Invalid destination request", details: validated.error.issues },
        { status: 400 }
      );
    }

    const destination = sanitizeInput(validated.data.destination);
    const data = await generateDiscovery(destination);

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
    console.error("Discover API Error:", error);
    return NextResponse.json(
      { error: "Failed to generate cultural discovery data" },
      { status: 500 }
    );
  }
}
