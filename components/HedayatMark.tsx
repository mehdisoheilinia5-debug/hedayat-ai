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
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M30 55 Q30 20 60 20 Q90 20 90 55"
        stroke="currentColor"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />
      <line
        x1="53"
        y1="58"
        x2="67"
        y2="58"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <circle cx="40" cy="58" r="13" stroke="currentColor" strokeWidth="3" fill="none" />
      <circle cx="80" cy="58" r="13" stroke="currentColor" strokeWidth="3" fill="none" />
      <circle
        cx="40"
        cy="58"
        r="3.5"
        fill="currentColor"
        className={blinking ? "blink-el" : ""}
      />
      <circle
        cx="80"
        cy="58"
        r="3.5"
        fill="currentColor"
        className={blinking ? "blink-el" : ""}
      />
      <path
        d="M33 82 Q48 93 60 82 Q72 93 87 82"
        stroke="currentColor"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />
      <line
        x1="21"
        y1="58"
        x2="27"
        y2="58"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.5"
      />
      <line
        x1="93"
        y1="58"
        x2="99"
        y2="58"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.5"
      />
    </svg>
  );
}