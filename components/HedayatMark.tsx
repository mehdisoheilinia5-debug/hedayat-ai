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
      viewBox="0 0 120 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* عینک گرد */}
      <circle cx="40" cy="40" r="22" stroke="currentColor" strokeWidth="4" fill="none" />
      <circle cx="80" cy="40" r="22" stroke="currentColor" strokeWidth="4" fill="none" />

      {/* اتصال وسط عینک */}
      <line
        x1="62"
        y1="38"
        x2="58"
        y2="38"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
      />

      {/* دسته‌های عینک */}
      <line
        x1="18"
        y1="40"
        x2="8"
        y2="35"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        opacity="0.6"
      />
      <line
        x1="102"
        y1="40"
        x2="112"
        y2="35"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        opacity="0.6"
      />

      {/* چشم‌ها (چشمک‌زن) */}
      <circle
        cx="40"
        cy="40"
        r="5"
        fill="currentColor"
        className={blinking ? "blink-el" : ""}
      />
      <circle
        cx="80"
        cy="40"
        r="5"
        fill="currentColor"
        className={blinking ? "blink-el" : ""}
      />
    </svg>
  );
}