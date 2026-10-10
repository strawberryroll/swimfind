import { type IconProps, SvgIcon } from "./SvgIcon";

/** 물결. Figma에 없는 아이콘이라 단순한 곡선으로 직접 그렸다. */
export function WaveIcon({ size = 32, ...props }: IconProps) {
  return (
    <SvgIcon size={size} viewBox="0 0 24 24" {...props}>
      <g
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M2 9c2.5-2.5 5-2.5 7.5 0s5 2.5 7.5 0 3.5-1.5 5-0.5" />
        <path d="M2 15c2.5-2.5 5-2.5 7.5 0s5 2.5 7.5 0 3.5-1.5 5-0.5" />
      </g>
    </SvgIcon>
  );
}
