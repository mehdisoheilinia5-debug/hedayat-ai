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

    // محدودیت طول متن (اختیاری اما مفید)
    if (text.length > 5000) {
      return NextResponse.json({ error: "متن طولانی است (حداکثر ۵۰۰۰ کاراکتر)." }, { status: 400 });
    }

    const tts = new MsEdgeTTS();
    await tts.setMetadata(
      "fa-IR-FaridNeural",
      OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3
    );

    // دریافت جریان صوتی
    const result = await tts.toStream(text);
    
    // جمع‌آوری تکه‌های صوتی
    const chunks: Buffer[] = [];
    for await (const chunk of result.audioStream) {
      chunks.push(Buffer.from(chunk));
    }
    const audioBuffer = Buffer.concat(chunks);

    // بازگشت پاسخ صوتی
    return new NextResponse(audioBuffer, {
      status: 200,
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Length": audioBuffer.length.toString(),
      },
    });
  } catch (error) {
    console.error("TTS error:", error);
    
    // خطای خاص برای تشخیص بهتر
    if (error instanceof Error) {
      return NextResponse.json(
        { error: `خطا در تولید صدا: ${error.message}` },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: "خطا در تولید صدا." },
      { status: 500 }
    );
  }
}