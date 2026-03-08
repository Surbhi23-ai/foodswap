import { NextRequest, NextResponse } from "next/server";
import { chatWithNutritionAI } from "@/lib/openai";

export const runtime = "nodejs";
export const maxDuration = 30;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message, conversation_history = [] } = body;

    if (!message || typeof message !== "string" || !message.trim()) {
      return NextResponse.json(
        { error: "Field 'message' is required.", success: false },
        { status: 400 }
      );
    }

    const reply = await chatWithNutritionAI(
      message.trim(),
      conversation_history
    );

    return NextResponse.json({ reply, success: true });
  } catch (err: unknown) {
    console.error("[/api/chat POST]", err);
    const message = err instanceof Error ? err.message : "Chat request failed.";
    return NextResponse.json({ error: message, success: false }, { status: 500 });
  }
}
