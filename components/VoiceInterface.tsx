"use client";

import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const INTRO_NOTE =
  "این یک بازسازی هنری بر پایه‌ی آثار و زندگی‌نامه‌ی صادق هدایت است، نه ادعای هویت واقعی او.";

type VoiceState = "idle" | "listening" | "thinking" | "speaking" | "error";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export default function VoiceInterface() {
  const router = useRouter();
  const supabase = createClient();

  const [state, setState] = useState<VoiceState>("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const historyRef = useRef<ChatMessage[]>([]);
  const recognitionRef = useRef<any>(null);

  const handleMicPress = useCallback(() => {
    if (state === "listening") {
      recognitionRef.current?.stop();
      return;
    }
    if (state !== "idle" && state !== "error") return;

    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setErrorMsg("مرورگرت از تشخیص گفتار پشتیبانی نمی‌کنه. از Chrome استفاده کن.");
      setState("error");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "fa-IR";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setErrorMsg(null);
      setState("listening");
    };

    recognition.onerror = () => {
      setErrorMsg("صدایی شنیده نشد. دوباره تلاش کن.");
      setState("error");
    };

    recognition.onresult = async (event: any) => {
      const transcript = event.results[0][0].transcript;
      if (!transcript?.trim()) {
        setState("idle");
        return;
      }
      await sendMessage(transcript);
    };

    recognition.onend = () => {
      setState((s) => (s === "listening" ? "idle" : s));
    };

    recognitionRef.current = recognition;
    recognition.start();
  }, [state]);

  async function sendMessage(text: string) {
    setState("thinking");
    const nextHistory: ChatMessage[] = [
      ...historyRef.current,
      { role: "user", content: text },
    ];
    historyRef.current = nextHistory;

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextHistory }),
      });
      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error || "خطایی رخ داد.");
        setState("error");
        return;
      }

      historyRef.current = [
        ...nextHistory,
        { role: "assistant", content: data.reply },
      ];

      await playVoice(data.reply);
    } catch {
      setErrorMsg("ارتباط با سرور برقرار نشد.");
      setState("error");
    }
  }

  async function playVoice(text: string) {
    try {
      const res = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      if (!res.ok) {
        setState("idle");
        return;
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);

      setState("speaking");
      audio.onended = () => setState("idle");
      audio.onerror = () => setState("idle");
      await audio.play();
    } catch {
      setState("idle");
    }
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <main className="flex h-screen flex-col items-center justify-between bg-ink-900 px-6 py-8">
      <div className="flex w-full items-center justify-between">
        <span className="font-nastaliq text-xl text-sepia-200">هدایت</span>
        <button
          onClick={handleSignOut}
          className="text-xs text-sepia-100/50 hover:text-sepia-200"
        >
          خروج
        </button>
      </div>

      <p className="max-w-xs text-center text-xs text-sepia-100/40">
        {INTRO_NOTE}
      </p>

      <div className="flex flex-1 flex-col items-center justify-center gap-6">
        <button
          onClick={handleMicPress}
          disabled={state === "thinking" || state === "speaking"}
          className="flex h-32 w-32 items-center justify-center rounded-full border-2 border-sepia-400/50 bg-ink-800 transition disabled:opacity-60"
          aria-label="شروع یا پایان صحبت"
        >
          <BigOwlMark state={state} />
        </button>

        <p className="text-sm text-sepia-100/60">{stateLabel(state)}</p>

        {errorMsg && (
          <p className="max-w-xs text-center text-sm text-red-400" role="alert">
            {errorMsg}
          </p>
        )}
      </div>

      <div className="h-4" />
    </main>
  );
}

function stateLabel(state: VoiceState) {
  switch (state) {
    case "listening":
      return "در حال شنیدن... دوباره لمس کن تا تمام شود";
    case "thinking":
      return "هدایت در حال تأمل است...";
    case "speaking":
      return "هدایت صحبت می‌کند...";
    case "error":
      return "برای تلاش دوباره لمس کن";
    default:
      return "برای صحبت لمس کن";
  }
}

function BigOwlMark({ state }: { state: VoiceState }) {
  const pulsing = state === "listening";
  const blinking = state === "thinking" || state === "speaking";

  return (
    <div
      className={`flex gap-3 ${pulsing ? "animate-pulse" : ""}`}
      aria-hidden="true"
    >
      <span
        className={`h-4 w-6 rounded-full bg-sepia-300 ${
          blinking ? "owl-eye" : ""
        }`}
      />
      <span
        className={`h-4 w-6 rounded-full bg-sepia-300 ${
          blinking ? "owl-eye" : ""
        }`}
      />
    </div>
  );
}