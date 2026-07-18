"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import AppHeader from "@/components/AppHeader";

export default function ProfilePage() {
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [nameStatus, setNameStatus] = useState<string | null>(null);
  const [passStatus, setPassStatus] = useState<string | null>(null);
  const [passError, setPassError] = useState<string | null>(null);
  const [loadingName, setLoadingName] = useState(false);
  const [loadingPass, setLoadingPass] = useState(false);

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
    loadUser();
  }, [supabase]);

  async function handleSaveName(e: React.FormEvent) {
    e.preventDefault();
    setNameStatus(null);
    setLoadingName(true);

    const { error } = await supabase.auth.updateUser({
      data: { display_name: displayName },
    });

    setNameStatus(error ? "خطا در ذخیره‌ی نام." : "نام ذخیره شد.");
    setLoadingName(false);
  }

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    setPassStatus(null);
    setPassError(null);

    if (newPassword.length < 6) {
      setPassError("رمز عبور باید حداقل ۶ کاراکتر باشد.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPassError("رمز عبور و تکرار آن یکسان نیستند.");
      return;
    }

    setLoadingPass(true);
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      setPassError("خطا در تغییر رمز عبور.");
    } else {
      setPassStatus("رمز عبور با موفقیت تغییر کرد.");
      setNewPassword("");
      setConfirmPassword("");
    }
    setLoadingPass(false);
  }

  return (
    <>
      <AppHeader />
      <main className="h-[100dvh] overflow-y-auto bg-[var(--bg)] px-6 pb-12 pt-20 text-[var(--text)]">
        <div className="mx-auto max-w-md">
          <h1 className="font-nastaliq mb-6 text-3xl">پروفایل</h1>

          <div className="mb-6 rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)] p-4">
            <label className="mb-1 block text-xs text-[var(--text-muted)]">ایمیل</label>
            <p className="text-sm">{email}</p>
          </div>

          <form
            onSubmit={handleSaveName}
            className="mb-6 rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)] p-4"
          >
            <label className="mb-1 block text-xs text-[var(--text-muted)]">نام نمایشی</label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="mb-3 w-full rounded border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-[var(--text)] outline-none focus:border-[var(--accent)]"
              placeholder="اسمت را وارد کن"
            />
            {nameStatus && <p className="mb-2 text-xs text-[var(--text-muted)]">{nameStatus}</p>}
            <button
              type="submit"
              disabled={loadingName}
              className="w-full rounded bg-[var(--text)] py-2 text-sm font-medium text-[var(--bg)] disabled:opacity-50"
            >
              {loadingName ? "در حال ذخیره..." : "ذخیره‌ی نام"}
            </button>
          </form>

          <form
            onSubmit={handleChangePassword}
            className="rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)] p-4"
          >
            <label className="mb-1 block text-xs text-[var(--text-muted)]">رمز عبور جدید</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="mb-3 w-full rounded border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-[var(--text)] outline-none focus:border-[var(--accent)]"
              placeholder="••••••••"
            />
            <label className="mb-1 block text-xs text-[var(--text-muted)]">تکرار رمز عبور</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="mb-3 w-full rounded border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-[var(--text)] outline-none focus:border-[var(--accent)]"
              placeholder="••••••••"
            />
            {passError && <p className="mb-2 text-xs text-red-500">{passError}</p>}
            {passStatus && <p className="mb-2 text-xs text-[var(--text-muted)]">{passStatus}</p>}
            <button
              type="submit"
              disabled={loadingPass}
              className="w-full rounded bg-[var(--text)] py-2 text-sm font-medium text-[var(--bg)] disabled:opacity-50"
            >
              {loadingPass ? "در حال تغییر..." : "تغییر رمز عبور"}
            </button>
          </form>
        </div>
      </main>
    </>
  );
}