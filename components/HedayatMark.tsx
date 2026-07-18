export default function HedayatMark({
  size = 32,
  blinking = false,
  className = "",
}: {
  size?: number;
  blinking?: boolean;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* دسته‌های عینک */}
      <path
        d="M12 30 Q4 27 2 24"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
        opacity="0.5"
      />
      <path
        d="M108 30 Q116 27 118 24"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
        opacity="0.5"
      />

      {/* قاب عینک */}
      <circle cx="32" cy="30" r="20" stroke="currentColor" strokeWidth="4.5" fill="none" />
      <circle cx="88" cy="30" r="20" stroke="currentColor" strokeWidth="4.5" fill="none" />

      {/* پل عینک */}
      <path
        d="M56 28 Q60 32 64 28"
        stroke="currentColor"
        strokeWidth="4.5"
        strokeLinecap="round"
        fill="none"
      />

      {/* چشم‌ها — یکی‌درمیون چشمک می‌زنن */}
      <circle
        cx="32"
        cy="30"
        r="6"
        fill="currentColor"
        className={blinking ? "blink-a" : ""}
      />
      <circle
        cx="88"
        cy="30"
        r="6"
        fill="currentColor"
        className={blinking ? "blink-b" : ""}
      />
    </svg>
  );
}