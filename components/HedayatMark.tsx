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
      <defs>
        <filter id="hedayat-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="1" stdDeviation="0.6" floodOpacity="0.25" />
        </filter>
      </defs>

      {/* دسته‌های عینک */}
      <path
        d="M16 38 Q6 34 4 30"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinecap="round"
        fill="none"
        opacity="0.55"
      />
      <path
        d="M104 38 Q114 34 116 30"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinecap="round"
        fill="none"
        opacity="0.55"
      />

      {/* قاب عینک — دو لایه برای حس حجم */}
      <circle
        cx="40"
        cy="40"
        r="23"
        stroke="currentColor"
        strokeWidth="5.5"
        strokeLinejoin="round"
        fill="none"
        filter="url(#hedayat-shadow)"
      />
      <circle
        cx="80"
        cy="40"
        r="23"
        stroke="currentColor"
        strokeWidth="5.5"
        strokeLinejoin="round"
        fill="none"
        filter="url(#hedayat-shadow)"
      />
      <circle cx="40" cy="40" r="23" stroke="currentColor" strokeWidth="1" opacity="0.3" fill="none" />
      <circle cx="80" cy="40" r="23" stroke="currentColor" strokeWidth="1" opacity="0.3" fill="none" />

      {/* پل عینک */}
      <path
        d="M63 36 Q60 40 57 36"
        stroke="currentColor"
        strokeWidth="5.5"
        strokeLinecap="round"
        fill="none"
      />

      {/* چشم‌ها */}
      <g style={{ transformBox: "fill-box", transformOrigin: "center" }}>
        <circle
          cx="40"
          cy="40"
          r="6"
          fill="currentColor"
          className={blinking ? "blink-el" : ""}
          style={{ transformBox: "fill-box", transformOrigin: "center" }}
        />
      </g>
      <g style={{ transformBox: "fill-box", transformOrigin: "center" }}>
        <circle
          cx="80"
          cy="40"
          r="6"
          fill="currentColor"
          className={blinking ? "blink-el" : ""}
          style={{ transformBox: "fill-box", transformOrigin: "center" }}
        />
      </g>
    </svg>
  );
}