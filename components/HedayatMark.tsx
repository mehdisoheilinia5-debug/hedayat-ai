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
      viewBox="0 0 120 110"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* عینک گرد */}
      <circle cx="40" cy="35" r="20" stroke="currentColor" strokeWidth="4" fill="none" />
      <circle cx="80" cy="35" r="20" stroke="currentColor" strokeWidth="4" fill="none" />

      <line
        x1="60"
        y1="33"
        x2="60"
        y2="33"
        stroke="currentColor"
        strokeWidth="4"
      />
      <line
        x1="59"
        y1="33"
        x2="61"
        y2="33"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
      />

      <line
        x1="20"
        y1="35"
        x2="10"
        y2="30"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        opacity="0.6"
      />
      <line
        x1="100"
        y1="35"
        x2="110"
        y2="30"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        opacity="0.6"
      />

      {/* چشم‌ها (چشمک‌زن) */}
      <circle
        cx="40"
        cy="35"
        r="4.5"
        fill="currentColor"
        className={blinking ? "blink-el" : ""}
      />
      <circle
        cx="80"
        cy="35"
        r="4.5"
        fill="currentColor"
        className={blinking ? "blink-el" : ""}
      />

      {/* سبیل نازک، فقط بالای لب */}
      <path
        d="M48 62 Q60 66 72 62"
        stroke="currentColor"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />

      {/* کراوات هلالی که به خط عمودی تبدیل می‌شود */}
      <path
        d="M46 78 Q60 90 74 78"
        stroke="currentColor"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />
      <line
        x1="60"
        y1="88"
        x2="60"
        y2="108"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}