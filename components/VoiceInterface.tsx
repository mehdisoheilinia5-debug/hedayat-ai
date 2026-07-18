"use client";

import { useState, useRef, useCallback } from "react";
import AppHeader from "@/components/AppHeader";
import HedayatMark from "@/components/HedayatMark";

const INTRO_NOTE =
  "این یک بازسازی هنری بر پایه‌ی آثار و زندگی‌نامه‌ی صادق هدایت است، نه ادعای هویت واقعی او.";

type VoiceState = "idle" | "listening" | "thinking" | "speaking" | "error";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export default function VoiceInterface() {
  const [state, setState] = useState<VoiceState>("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const historyRef = useRef<ChatMessage[]>([]);
  const recognitionRef = useRef<any>(null);
  const abortRef = useRef<AbortController | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const resetToIdle = useCallback(() => {
    abortRef.current?.abort();
    audioRef.current?.pause();
    audioRef.current = null;
    setErrorMsg(null);
    setState("idle");
  }, []);

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

    const controller = new AbortController();
    abortRef.current = controller;
    const timeout = setTimeout(() => controller.abort(), 90000);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextHistory }),
        signal: controller.signal,
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
    } catch (e: any) {
      if (e?.name === "AbortError") return;
      setErrorMsg("ارتباط با سرور برقرار نشد یا زمان زیادی طول کشید.");
      setState("error");
    } finally {
      clearTimeout(timeout);
    }
  }

  async function playVoice(text: string) {
    const controller = new AbortController();
    abortRef.current = controller;
    const timeout = setTimeout(() => controller.abort(), 60000);

    try {
      const res = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
        signal: controller.signal,
      });

      if (!res.ok) {
        setErrorMsg("خطا در تولید صدا.");
        setState("error");
        return;
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audioRef.current = audio;

      setState("speaking");
      audio.onended = () => setState("idle");
      audio.onerror = () => setState("idle");
      await audio.play();
    } catch (e: any) {
      if (e?.name === "AbortError") return;
      setState("idle");
    } finally {
      clearTimeout(timeout);
    }
  }

  const isBusy = state === "thinking" || state === "speaking";
  const blinking = state === "thinking" || state === "speaking";

  return (
    <>
      <AppHeader />
      <main className="flex h-[100dvh] flex-col items-center justify-between overflow-hidden bg-[var(--bg)] px-6 pb-8 pt-20">
        <p className="max-w-xs text-center text-xs text-[var(--text-muted)]">
          {INTRO_NOTE}
        </p>

        <div className="flex flex-1 flex-col items-center justify-center gap-6">
          <button
            onClick={handleMicPress}
            disabled={isBusy}
            className={`flex h-36 w-36 items-center justify-center rounded-full border-2 border-[var(--border)] bg-[var(--bg-elevated)] transition disabled:opacity-60 ${
              state === "listening" ? "animate-pulse" : ""
            }`}
            aria-label="شروع یا پایان صحبت"
          >
            <HedayatMark size={70} blinking={blinking} className="text-[var(--text-muted)]" />
          </button>

          <p className="text-sm text-[var(--text-muted)]">{stateLabel(state)}</p>

          {isBusy && (
            <button
              onClick={resetToIdle}
              className="rounded-full border border-[var(--border)] px-4 py-1.5 text-xs text-[var(--text)]"
            >
              لغو
            </button>
          )}

          {errorMsg && (
            <p className="max-w-xs text-center text-sm text-red-500" role="alert">
              {errorMsg}
            </p>
          )}
        </div>

        <div className="h-4" />
      </main>
    </>
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