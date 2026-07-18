import Link from "next/link";
import HedayatMark from "@/components/HedayatMark";

export default function Home() {
  return (
    <main className="flex h-[100dvh] flex-col items-center justify-center gap-6 overflow-hidden bg-[var(--bg)] p-8 text-center">
      <HedayatMark size={72} className="text-[var(--text)]" />
      <h1 className="font-nastaliq text-5xl text-[var(--text)]">هدایت</h1>
      <p className="max-w-md text-[var(--text-muted)]">
        یک بازسازی هنری و ادبی از صادق هدایت — گفتگو با روحی که از دل آثار و
        نامه‌هایش بازآفرینی شده است.
      </p>
      <Link
        href="/login"
        className="rounded-full bg-[var(--text)] px-8 py-3 font-medium text-[var(--bg)] transition"
      >
        آغاز گفتگو
      </Link>
    </main>
  );
}