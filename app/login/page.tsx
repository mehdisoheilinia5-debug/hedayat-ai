"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import HedayatMark from "@/components/HedayatMark";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();

  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);

    if (mode === "login") {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        setError("ورود ناموفق بود. ایمیل یا رمز عبور را بررسی کن.");
      } else {
        router.push("/chat");
        router.refresh();
      }
    } else {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) {
        setError("ثبت‌نام ناموفق بود. دوباره تلاش کن.");
      } else {
        setMessage("ثبت‌نام انجام شد. ایمیلت را برای تأیید حساب بررسی کن.");
      }
    }

    setLoading(false);
  }

  return (
    <main className="flex h-[100dvh] flex-col items-center justify-center overflow-hidden bg-[var(--bg)] px-6">
      <div className="mb-8 flex flex-col items-center text-center">
        <HedayatMark size={56} className="mb-3 text-[var(--text)]" />
        <h1 className="font-nastaliq text-4xl text-[var(--text)]">هدایت</h1>
        <p className="mt-2 text-sm text-[var(--text-muted)]">
          گفتگوی هنری و ادبی با بازآفرینی صادق هدایت
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)] p-6"
      >
        <div className="mb-4 flex gap-2 text-sm">
          <button
            type="button"
            onClick={() => setMode("login")}
            className={`flex-1 rounded py-2 transition ${
              mode === "login"
                ? "bg-black/10 text-[var(--text)] dark:bg-white/10"
                : "text-[var(--text-muted)]"
            }`}
          >
            ورود
          </button>
          <button
            type="button"
            onClick={() => setMode("signup")}
            className={`flex-1 rounded py-2 transition ${
              mode === "signup"
                ? "bg-black/10 text-[var(--text)] dark:bg-white/10"
                : "text-[var(--text-muted)]"
            }`}
          >
            ثبت‌نام
          </button>
        </div>

        <label className="mb-1 block text-xs text-[var(--text-muted)]">ایمیل</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mb-4 w-full rounded border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-[var(--text)] outline-none focus:border-[var(--accent)]"
          placeholder="you@example.com"
        />

        <label className="mb-1 block text-xs text-[var(--text-muted)]">
          رمز عبور
        </label>
        <input
          type="password"
          required
          minLength={6}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mb-4 w-full rounded border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-[var(--text)] outline-none focus:border-[var(--accent)]"
          placeholder="••••••••"
        />

        {error && (
          <p className="mb-3 text-sm text-red-500" role="alert">
            {error}
          </p>
        )}
        {message && (
          <p className="mb-3 text-sm text-[var(--text)]" role="status">
            {message}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded bg-[var(--text)] py-2 font-medium text-[var(--bg)] transition disabled:opacity-50"
        >
          {loading ? "لطفاً صبر کن..." : mode === "login" ? "ورود" : "ثبت‌نام"}
        </button>
      </form>
    </main>
  );
}