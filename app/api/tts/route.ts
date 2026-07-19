import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { EdgeTTS } from "edge-tts-universal";

export async function POST(req: NextRequest) {
  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "احراز هویت لازم است." }, { status: 401 });
    }

    const { text } = await req.json();
    if (!text || typeof text !== "string") {
      return NextResponse.json({ error: "متن نامعتبر است." }, { status: 400 });
    }

    const tts = new EdgeTTS(text, "fa-IR-FaridNeural", {
      rate: "-12%",
      volume: "+0%",
      pitch: "+0Hz",
    });
    const result = await tts.synthesize();
    const audioBuffer = Buffer.from(await result.audio.arrayBuffer());

    return new NextResponse(audioBuffer, {
      headers: { "Content-Type": "audio/mpeg" },
    });
  } catch (error) {
    console.error("TTS error:", error);
    return NextResponse.json({ error: "خطا در تولید صدا." }, { status: 500 });
  }
}