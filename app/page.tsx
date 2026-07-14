import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-ink-900 p-8 text-center">
      <h1 className="font-nastaliq text-5xl text-sepia-200">هدایت</h1>
      <p className="max-w-md text-sepia-100/80">
        یک بازسازی هنری و ادبی از صادق هدایت — گفتگو با روحی که از دل آثار و
        نامه‌هایش بازآفرینی شده است.
      </p>
      <Link
        href="/login"
        className="rounded-full bg-sepia-400 px-8 py-3 font-medium text-ink-900 transition hover:bg-sepia-300"
      >
        آغاز گفتگو
      </Link>
    </main>
  );
}