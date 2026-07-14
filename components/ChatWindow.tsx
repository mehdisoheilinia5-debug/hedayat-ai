"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Role = "user" | "assistant";
interface Message {
  role: Role;
  content: string;
}

const INTRO_NOTE =
  "این یک بازسازی هنری بر پایه‌ی آثار و زندگی‌نامه‌ی صادق هدایت است، نه ادعای هویت واقعی او.";

export default function ChatWindow() {
  const router = useRouter();
  const supabase = createClient();

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isThinking]);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || isThinking) return;

    const nextMessages: Message[] = [...messages, { role: "user", content: trimmed }];
    setMessages(nextMessages);
    setInput("");
    setError(null);
    setIsThinking(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "خطایی رخ داد.");
      } else {
        setMessages([...nextMessages, { role: "assistant", content: data.reply }]);
      }
    } catch {
      setError("ارتباط با سرور برقرار نشد.");
    } finally {
      setIsThinking(false);
    }
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <main className="flex h-screen flex-col bg-ink-900">
      <header className="flex items-center justify-between border-b border-sepia-500/20 px-4 py-3">
        <div className="flex items-center gap-2">
          <OwlMark thinking={isThinking} />
          <span className="font-nastaliq text-xl text-sepia-200">هدایت</span>
        </div>
        <button
          onClick={handleSignOut}
          className="text-xs text-sepia-100/50 hover:text-sepia-200"
        >
          خروج
        </button>
      </header>

      <p className="border-b border-sepia-500/10 bg-ink-800/40 px-4 py-2 text-center text-xs text-sepia-100/50">
        {INTRO_NOTE}
      </p>

      <div className="flex-1 overflow-y-auto px-4 py-6">
        {messages.length === 0 && (
          <p className="mt-10 text-center text-sm text-sepia-100/40">
            گفتگو را با یک جمله آغاز کن...
          </p>
        )}

        <div className="mx-auto flex max-w-2xl flex-col gap-4">
          {messages.map((m, i) => (
            <MessageBubble key={i} message={m} />
          ))}

          {isThinking && (
            <div className="flex items-center gap-2 border-r-2 border-sepia-400/40 pr-3">
              <OwlMark thinking small />
              <span className="text-xs text-sepia-100/40">در حال نوشتن...</span>
            </div>
          )}

          {error && (
            <p className="text-center text-sm text-red-400" role="alert">
              {error}
            </p>
          )}
        </div>
        <div ref={bottomRef} />
      </div>

      <form
        onSubmit={handleSend}
        className="border-t border-sepia-500/20 px-4 py-3"
      >
        <div className="mx-auto flex max-w-2xl items-center gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="پیامت را بنویس..."
            className="flex-1 rounded-full border border-sepia-500/30 bg-ink-800 px-4 py-2 text-sepia-100 outline-none focus:border-sepia-300"
          />
          <button
            type="submit"
            disabled={isThinking || !input.trim()}
            className="rounded-full bg-sepia-400 px-5 py-2 text-sm font-medium text-ink-900 transition hover:bg-sepia-300 disabled:opacity-40"
          >
            ارسال
          </button>
        </div>
      </form>
    </main>
  );
}

function MessageBubble({ message }: { message: Message }) {
  if (message.role === "user") {
    return (
      <div className="self-end rounded-2xl rounded-tl-sm bg-sepia-500/20 px-4 py-2 text-sepia-100">
        {message.content}
      </div>
    );
  }

  return (
    <div className="border-r-2 border-sepia-400/40 pr-3">
      <span className="font-nastaliq text-sm text-sepia-300">هدایت</span>
      <p className="mt-1 leading-relaxed text-sepia-100">{message.content}</p>
    </div>
  );
}

function OwlMark({
  thinking = false,
  small = false,
}: {
  thinking?: boolean;
  small?: boolean;
}) {
  const size = small ? "h-4 w-4" : "h-7 w-7";
  const eyeSize = small ? "h-1 w-1.5" : "h-1.5 w-2.5";

  return (
    <div
      className={`${size} flex items-center justify-center rounded-full border border-sepia-400/50 bg-ink-800`}
      aria-hidden="true"
    >
      <div className="flex gap-1">
        <span
          className={`${eyeSize} rounded-full bg-sepia-300 ${
            thinking ? "owl-eye" : ""
          }`}
        />
        <span
          className={`${eyeSize} rounded-full bg-sepia-300 ${
            thinking ? "owl-eye" : ""
          }`}
        />
      </div>
    </div>
  );
}