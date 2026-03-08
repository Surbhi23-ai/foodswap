import { NextRequest, NextResponse } from "next/server";
import { analyzeFoodByName } from "@/lib/openai";

export const runtime = "nodejs";
export const maxDuration = 30;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q")?.trim();

  if (!query) {
    return NextResponse.json(
      { error: "Query parameter 'q' is required.", success: false },
      { status: 400 }
    );
  }

  try {
    const result = await analyzeFoodByName(query);
    return NextResponse.json({ result, success: true });
  } catch (err: unknown) {
    console.error("[/api/food GET]", err);
    const message =
      err instanceof Error ? err.message : "Food analysis failed.";
    return NextResponse.json({ error: message, success: false }, { status: 500 });
  }
}
