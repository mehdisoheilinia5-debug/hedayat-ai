import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const MAX_CHUNK_LENGTH = 190;

function splitIntoChunks(text: string): string[] {
  const sentences = text.split(/(?<=[.!?؟۔])\s+/);
  const chunks: string[] = [];
  let current = "";

  for (const sentence of sentences) {
    if ((current + " " + sentence).trim().length > MAX_CHUNK_LENGTH) {
      if (current.trim()) chunks.push(current.trim());
      current = sentence;
    } else {
      current = (current + " " + sentence).trim();
    }
  }
  if (current.trim()) chunks.push(current.trim());

  return chunks.length > 0 ? chunks : [text.slice(0, MAX_CHUNK_LENGTH)];
}

async function fetchChunkAudio(chunk: string): Promise<ArrayBuffer> {
  const url = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(
    chunk
  )}&tl=fa&client=tw-ob`;

  const res = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36",
    },
  });

  if (!res.ok) {
    throw new Error(`Google TTS chunk failed: ${res.status}`);
  }

  return res.arrayBuffer();
}

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

    const chunks = splitIntoChunks(text);
    const audioBuffers: Buffer[] = [];

    for (const chunk of chunks) {
      const buf = await fetchChunkAudio(chunk);
      audioBuffers.push(Buffer.from(buf));
    }

    const finalAudio = Buffer.concat(audioBuffers);

    return new NextResponse(finalAudio, {
      headers: { "Content-Type": "audio/mpeg" },
    });
  } catch (error) {
    console.error("TTS error:", error);
    return NextResponse.json({ error: "خطا در تولید صدا." }, { status: 500 });
  }
}