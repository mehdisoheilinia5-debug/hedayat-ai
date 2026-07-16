import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { MsEdgeTTS, OUTPUT_FORMAT } from "msedge-tts";

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

    const tts = new MsEdgeTTS();
    await tts.setMetadata(
      "fa-IR-FaridNeural",
      OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3
    );

    const { audioStream } = await tts.toStream(text);

    const chunks: Buffer[] = [];
    for await (const chunk of audioStream) {
      chunks.push(chunk as Buffer);
    }
    const audioBuffer = Buffer.concat(chunks);

    return new NextResponse(audioBuffer, {
      headers: { "Content-Type": "audio/mpeg" },
    });
  } catch (error) {
    console.error("TTS error:", error);
    return NextResponse.json({ error: "خطا در تولید صدا." }, { status: 500 });
  }
}