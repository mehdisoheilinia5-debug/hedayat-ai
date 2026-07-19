// app/api/chat/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { buildHedayatMessages, type ChatMessage } from "@/lib/hedayat-persona";

const OPENROUTER_MODEL = "openrouter/free";

export async function POST(req: NextRequest) {
  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "برای گفتگو باید وارد حساب کاربری‌ات بشی." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const conversationHistory: ChatMessage[] = body.messages;

    if (!conversationHistory || !Array.isArray(conversationHistory)) {
      return NextResponse.json(
        { error: "فرمت پیام‌ها نامعتبر است." },
        { status: 400 }
      );
    }

    const messages = buildHedayatMessages(conversationHistory);

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL || "https://hedayat-ai.onrender.com",
          "X-Title": "Hedayat AI",
        },
        body: JSON.stringify({
          model: OPENROUTER_MODEL,
          messages,
          temperature: 0.7,
          max_tokens: 1500,
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("OpenRouter error:", errorText);
      return NextResponse.json(
        { error: "خطا در دریافت پاسخ. لطفاً دوباره تلاش کن." },
        { status: 502 }
      );
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content;

    if (!reply) {
      return NextResponse.json(
        { error: "پاسخی دریافت نشد." },
        { status: 502 }
      );
    }

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "خطای غیرمنتظره رخ داد." },
      { status: 500 }
    );
  }
}