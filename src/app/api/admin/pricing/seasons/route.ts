import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createSeasonalRule, listSeasonalRules } from "@/lib/db/services/pricingService";

export async function GET() {
  try {
    const seasons = await listSeasonalRules();
    return NextResponse.json({
      success: true,
      seasons,
      data: seasons,
    });
  } catch (error: any) {
    console.error("Error fetching seasonal rules:", error);
    return NextResponse.json(
      { error: "Failed to load seasonal rules." },
      { status: 500 }
    );
  }
}

function isValidDateString(d: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(d) && !isNaN(new Date(d).getTime());
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);

    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { error: "Invalid request payload." },
        { status: 400 }
      );
    }

    const { name, startDate, endDate, nightlyRate, minStay, description, isActive } = body;

    if (!name || typeof name !== "string" || !name.trim()) {
      return NextResponse.json(
        { error: "Season name is required." },
        { status: 400 }
      );
    }

    if (!startDate || !isValidDateString(startDate)) {
      return NextResponse.json(
        { error: "Valid start date (YYYY-MM-DD) is required." },
        { status: 400 }
      );
    }

    if (!endDate || !isValidDateString(endDate)) {
      return NextResponse.json(
        { error: "Valid end date (YYYY-MM-DD) is required." },
        { status: 400 }
      );
    }

    if (endDate <= startDate) {
      return NextResponse.json(
        { error: "End date must be strictly after start date." },
        { status: 400 }
      );
    }

    if (isNaN(Number(nightlyRate)) || Number(nightlyRate) < 0) {
      return NextResponse.json(
        { error: "Nightly rate must be 0 or greater." },
        { status: 400 }
      );
    }

    const season = await createSeasonalRule({
      name,
      startDate,
      endDate,
      nightlyRate: Number(nightlyRate),
      minStay: Math.max(1, Number(minStay) || 3),
      description,
      isActive: isActive !== false,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Seasonal rule created successfully.",
        season,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating seasonal rule:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to create seasonal rule." },
      { status: 400 }
    );
  }
}
