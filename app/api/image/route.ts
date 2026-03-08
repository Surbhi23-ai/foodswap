import { NextRequest, NextResponse } from "next/server";
import { analyzeFoodImage } from "@/lib/openai";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { image } = body;

    if (!image || typeof image !== "string") {
      return NextResponse.json(
        { error: "Field 'image' (base64 string) is required.", success: false },
        { status: 400 }
      );
    }

    // Strip data URI prefix if present
    const base64 = image.includes(",") ? image.split(",")[1] : image;

    const result = await analyzeFoodImage(base64);
    return NextResponse.json({ result, success: true });
  } catch (err: unknown) {
    console.error("[/api/image POST]", err);
    const message =
      err instanceof Error ? err.message : "Image analysis failed.";
    return NextResponse.json({ error: message, success: false }, { status: 500 });
  }
}
