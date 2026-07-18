"use client";

import { useState, useRef, useCallback } from "react";
import AppHeader from "@/components/AppHeader";

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

  const resetToIdle = useCallback(() => {
    abortRef.current?.abort();
    window.speechSynthesis?.cancel();
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

      speak(data.reply);
    } catch (e: any) {
      if (e?.name === "AbortError") return;
      setErrorMsg("ارتباط با سرور برقرار نشد یا زمان زیادی طول کشید (سرویس رایگان ممکنه در حال بیدار شدن باشه).");
      setState("error");
    } finally {
      clearTimeout(timeout);
    }
  }

  function speak(text: string) {
    if (!window.speechSynthesis) {
      setState("idle");
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "fa-IR";
    utterance.rate = 0.95;
    utterance.pitch = 0.85;

    const voices = window.speechSynthesis.getVoices();
    const faVoice = voices.find((v) => v.lang?.toLowerCase().startsWith("fa"));
    if (faVoice) utterance.voice = faVoice;

    utterance.onstart = () => setState("speaking");
    utterance.onend = () => setState("idle");
    utterance.onerror = () => setState("idle");

    window.speechSynthesis.speak(utterance);
  }

  const isBusy = state === "thinking" || state === "speaking";

  return (
    <>
      <AppHeader />
      <main className="flex min-h-screen flex-col items-center justify-between bg-[var(--bg)] px-6 pb-8 pt-20">
        <p className="max-w-xs text-center text-xs text-[var(--text-muted)]">
          {INTRO_NOTE}
        </p>

        <div className="flex flex-1 flex-col items-center justify-center gap-6">
          <button
            onClick={handleMicPress}
            disabled={isBusy}
            className="flex h-32 w-32 items-center justify-center rounded-full border-2 border-sepia-400/50 bg-[var(--bg-elevated)] transition disabled:opacity-60"
            aria-label="شروع یا پایان صحبت"
          >
            <BigOwlMark state={state} />
          </button>

          <p className="text-sm text-[var(--text-muted)]">{stateLabel(state)}</p>

          {isBusy && (
            <button
              onClick={resetToIdle}
              className="rounded-full border border-sepia-400/40 px-4 py-1.5 text-xs text-sepia-300"
            >
              لغو
            </button>
          )}

          {errorMsg && (
            <p className="max-w-xs text-center text-sm text-red-400" role="alert">
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