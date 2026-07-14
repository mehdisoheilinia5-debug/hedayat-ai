"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

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
    <main className="flex min-h-screen flex-col items-center justify-center bg-ink-900 px-6">
      <div className="mb-8 text-center">
        <h1 className="font-nastaliq text-4xl text-sepia-200">هدایت</h1>
        <p className="mt-2 text-sm text-sepia-100/70">
          گفتگوی هنری و ادبی با بازآفرینی صادق هدایت
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-lg border border-sepia-500/20 bg-ink-800 p-6"
      >
        <div className="mb-4 flex gap-2 text-sm">
          <button
            type="button"
            onClick={() => setMode("login")}
            className={`flex-1 rounded py-2 transition ${
              mode === "login"
                ? "bg-sepia-500/20 text-sepia-200"
                : "text-sepia-100/50"
            }`}
          >
            ورود
          </button>
          <button
            type="button"
            onClick={() => setMode("signup")}
            className={`flex-1 rounded py-2 transition ${
              mode === "signup"
                ? "bg-sepia-500/20 text-sepia-200"
                : "text-sepia-100/50"
            }`}
          >
            ثبت‌نام
          </button>
        </div>

        <label className="mb-1 block text-xs text-sepia-100/60">ایمیل</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mb-4 w-full rounded border border-sepia-500/30 bg-ink-900 px-3 py-2 text-sepia-100 outline-none focus:border-sepia-300"
          placeholder="you@example.com"
        />

        <label className="mb-1 block text-xs text-sepia-100/60">
          رمز عبور
        </label>
        <input
          type="password"
          required
          minLength={6}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mb-4 w-full rounded border border-sepia-500/30 bg-ink-900 px-3 py-2 text-sepia-100 outline-none focus:border-sepia-300"
          placeholder="••••••••"
        />

        {error && (
          <p className="mb-3 text-sm text-red-400" role="alert">
            {error}
          </p>
        )}
        {message && (
          <p className="mb-3 text-sm text-sepia-200" role="status">
            {message}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded bg-sepia-400 py-2 font-medium text-ink-900 transition hover:bg-sepia-300 disabled:opacity-50"
        >
          {loading ? "لطفاً صبر کن..." : mode === "login" ? "ورود" : "ثبت‌نام"}
        </button>
      </form>
    </main>
  );
}