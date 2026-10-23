type IconProps = { size?: number; color?: string; className?: string };

export function UnsendArrow({ size = 17, color = "#FFFFFF", stroke = 2.2 }: IconProps & { stroke?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path d="M7 4 L3 8 L7 12" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3.5 8 H11 a4 4 0 0 1 0 8 H8" stroke={color} strokeWidth={stroke} strokeLinecap="round" />
    </svg>
  );
}

export function Sparkle({ size = 14, color = "#8EA0FF" }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M8 1.5 L9.6 6.4 L14.5 8 L9.6 9.6 L8 14.5 L6.4 9.6 L1.5 8 L6.4 6.4 Z"
        stroke={color}
        strokeWidth={1.6}
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ArrowRight({ size = 14, color = "#FFFFFF" }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M2.5 7h9M8 3.5 11.5 7 8 10.5" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ArrowUp({ size = 14, color = "#FFFFFF" }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M8 13V3M3.5 7.5 8 3l4.5 4.5" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Warning({ size = 22, color = "#9A6A00" }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true" className="shrink-0">
      <path d="M12 3 L22 20 H2 Z" stroke={color} strokeWidth={2} strokeLinejoin="round" />
      <path d="M12 10v4M12 17v.5" stroke={color} strokeWidth={2} strokeLinecap="round" />
    </svg>
  );
}

export function Check({ size = 16, color = "#FFFFFF" }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M3.5 8.5 L6.5 11.5 L12.5 4.5" stroke={color} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
