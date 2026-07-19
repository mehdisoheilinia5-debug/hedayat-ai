"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import HedayatMark from "@/components/HedayatMark";

export default function AppHeader() {
  const router = useRouter();
  const supabase = createClient();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const [email, setEmail] = useState("");
  const [displayName, setDisplayName] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    const dark = stored ? stored === "dark" : true;
    setIsDark(dark);
  }, []);

  useEffect(() => {
    async function loadUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        setEmail(user.email || "");
        setDisplayName((user.user_metadata?.display_name as string) || "");
      }
    }
    if (menuOpen) loadUser();
  }, [menuOpen, supabase]);

  function toggleTheme() {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
    setMenuOpen(false);
    router.push("/login");
    router.refresh();
  }

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-40 flex h-14 items-center justify-between border-b border-[var(--border)] bg-[var(--bg)] px-4">
        <button
          onClick={() => setMenuOpen(true)}
          aria-label="باز کردن منو"
          className="flex h-9 w-9 flex-col items-center justify-center gap-1"
        >
          <span className="block h-0.5 w-6 bg-[var(--text)]" />
          <span className="block h-0.5 w-6 bg-[var(--text)]" />
          <span className="block h-0.5 w-6 bg-[var(--text)]" />
        </button>

        <div className="flex items-center gap-2">
          <span className="font-nastaliq text-xl text-[var(--text)]">هدایت AI</span>
          <HedayatMark size={26} className="text-[var(--text)]" />
        </div>
      </header>

      {menuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50"
          onClick={() => setMenuOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 right-0 z-50 flex w-64 flex-col gap-1 bg-[var(--bg-elevated)] p-4 transition-transform duration-300 ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <button
          onClick={() => setMenuOpen(false)}
          className="mb-4 self-start text-sm text-[var(--text-muted)]"
        >
          بستن ✕
        </button>

        <Link
          href="/profile"
          onClick={() => setMenuOpen(false)}
          className="mb-4 flex flex-col gap-0.5 rounded-lg border border-[var(--border)] px-3 py-3 hover:bg-black/5 dark:hover:bg-white/5"
        >
          <span className="text-sm font-medium text-[var(--text)]">
            {displayName || "کاربر هدایت AI"}
          </span>
          <span className="truncate text-xs text-[var(--text-muted)]">{email}</span>
        </Link>

        <Link
          href="/chat"
          onClick={() => setMenuOpen(false)}
          className="rounded px-3 py-2 text-[var(--text)] hover:bg-black/5 dark:hover:bg-white/5"
        >
          گفتگو
        </Link>
        <Link
          href="/about"
          onClick={() => setMenuOpen(false)}
          className="rounded px-3 py-2 text-[var(--text)] hover:bg-black/5 dark:hover:bg-white/5"
        >
          درباره‌ی برنامه
        </Link>

        <button
          onClick={toggleTheme}
          className="mt-2 rounded px-3 py-2 text-right text-[var(--text)] hover:bg-black/5 dark:hover:bg-white/5"
        >
          {isDark ? "☀️ تم روشن" : "🌙 تم تیره"}
        </button>

        <div className="mt-auto">
          <button
            onClick={handleSignOut}
            className="w-full rounded px-3 py-2 text-right text-red-500 hover:bg-red-500/10"
          >
            خروج از حساب
          </button>
        </div>
      </aside>
    </>
  );
}