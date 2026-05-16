/**
 * Tiny hand-drawn SVG doodles used as low-opacity decorations across pages.
 * Drop them inside any positioned container; they'll sit absolutely in the corner you give them.
 */

export function ScribbleStar({
  style,
  color = "var(--clay)",
  size = 36,
}: {
  style?: React.CSSProperties;
  color?: string;
  size?: number;
}) {
  return (
    <svg
      className="scribble"
      width={size}
      height={size}
      viewBox="0 0 36 36"
      fill="none"
      style={style}
      aria-hidden="true"
    >
      <path
        d="M18 4 L20 14 L30 16 L21 21 L24 31 L18 25 L12 31 L15 21 L6 16 L16 14 Z"
        stroke={color}
        strokeWidth="2.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function ScribbleSwirl({
  style,
  color = "var(--sage-dark)",
  size = 44,
}: {
  style?: React.CSSProperties;
  color?: string;
  size?: number;
}) {
  return (
    <svg
      className="scribble"
      width={size}
      height={size}
      viewBox="0 0 44 44"
      fill="none"
      style={style}
      aria-hidden="true"
    >
      <path
        d="M22 8 C 30 8 34 14 34 22 C 34 30 28 36 20 34 C 12 32 10 22 14 18 C 18 14 26 16 26 22 C 26 26 22 28 20 26"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ScribbleHeart({
  style,
  color = "var(--dusty-rose)",
  size = 32,
}: {
  style?: React.CSSProperties;
  color?: string;
  size?: number;
}) {
  return (
    <svg
      className="scribble"
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      style={style}
      aria-hidden="true"
    >
      <path
        d="M16 27 C 6 19 4 12 9 8 C 13 5 16 10 16 12 C 16 10 19 5 23 8 C 28 12 26 19 16 27 Z"
        stroke={color}
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ScribbleDashes({
  style,
  color = "var(--mustard-dark)",
  size = 40,
}: {
  style?: React.CSSProperties;
  color?: string;
  size?: number;
}) {
  return (
    <svg
      className="scribble"
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      style={style}
      aria-hidden="true"
    >
      <path d="M6 12 L 12 9" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
      <path d="M16 6 L 22 4" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
      <path d="M26 14 L 32 11" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
      <path d="M8 24 L 14 22" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
      <path d="M20 30 L 26 28" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}
