import AppHeader from "@/components/AppHeader";

export default function AboutPage() {
  return (
    <>
      <AppHeader />
      <main className="h-[100dvh] overflow-y-auto bg-[var(--bg)] px-6 pb-12 pt-20 text-[var(--text)]">
        <div className="mx-auto max-w-xl">
          <h1 className="font-nastaliq mb-6 text-3xl">درباره‌ی هدایت AI</h1>
          <p className="mb-4 leading-relaxed">
            هدایت AI یک بازسازی هنری و ادبی از صادق هدایت، نویسنده‌ی برجسته‌ی
            ایرانی، است. این ابزار برای گفتگوی صوتی با شخصیتی طراحی شده که بر
            پایه‌ی زندگی‌نامه، سبک نوشتار، و جهان‌بینی مستند هدایت ساخته شده.
          </p>
          <p className="mb-4 leading-relaxed">
            توجه مهم: این یک هوش مصنوعیه که تلاش می‌کنه افکار و سبک هدایت رو
            بازتاب بده، نه ادعای هویت واقعی او. هیچ نقل‌قول مستقیمی از آثارش
            بدون ارجاع به منبع اصلی ارائه نمی‌شه.
          </p>
          <p className="leading-relaxed text-[var(--text-muted)]">
            ساخته‌شده با عشق به ادبیات فارسی، توسط سام.
          </p>
        </div>
      </main>
    </>
  );
}