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
      viewBox="0 0 120 140"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* فرم کلی سر و صورت */}
      <path
        d="M35 60 Q33 20 60 18 Q87 20 85 60 Q85 95 76 108 Q68 118 60 118 Q52 118 44 108 Q35 95 35 60 Z"
        stroke="currentColor"
        strokeWidth="3"
        fill="none"
        strokeLinejoin="round"
      />

      {/* موهای شونه‌شده به عقب با فرق کنار */}
      <path
        d="M33 55 Q30 25 45 15 Q55 8 60 10 Q78 6 88 22 Q92 32 87 50"
        stroke="currentColor"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M46 14 Q50 22 48 30"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        opacity="0.6"
      />

      {/* ابروها */}
      <path
        d="M42 52 Q48 47 56 50"
        stroke="currentColor"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M65 50 Q73 47 80 52"
        stroke="currentColor"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
      />

      {/* عینک گرد و درشت */}
      <circle cx="49" cy="63" r="16" stroke="currentColor" strokeWidth="3" fill="none" />
      <circle cx="74" cy="63" r="16" stroke="currentColor" strokeWidth="3" fill="none" />
      <line
        x1="65"
        y1="61"
        x2="58"
        y2="61"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <line
        x1="33"
        y1="65"
        x2="27"
        y2="60"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.6"
      />
      <line
        x1="90"
        y1="65"
        x2="96"
        y2="60"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.6"
      />

      {/* چشم‌ها */}
      <circle
        cx="49"
        cy="63"
        r="3.2"
        fill="currentColor"
        className={blinking ? "blink-el" : ""}
      />
      <circle
        cx="74"
        cy="63"
        r="3.2"
        fill="currentColor"
        className={blinking ? "blink-el" : ""}
      />

      {/* بینی */}
      <path
        d="M61 66 Q59 80 56 85"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        opacity="0.7"
      />

      {/* سبیل نازک */}
      <path
        d="M46 93 Q60 98 74 93"
        stroke="currentColor"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
      />

      {/* لب و چانه */}
      <path
        d="M52 100 Q60 104 68 100"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        opacity="0.7"
      />

      {/* یقه و کراوات (اشاره‌ی مینیمال به ظاهر رسمی) */}
      <path
        d="M44 118 L52 128 L60 120 L68 128 L76 118"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.5"
      />
    </svg>
  );
}