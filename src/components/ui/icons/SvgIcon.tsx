import type { ComponentProps, ReactNode } from "react";

// Figma(수영 서비스)의 아이콘 SVG를 React 컴포넌트로 옮긴 것이다.
// path 데이터는 Figma 원본 그대로이고, 색은 currentColor로 바꿔 CSS의 color로 정한다.

export type IconProps = Omit<ComponentProps<"svg">, "children" | "viewBox"> & {
  size?: number;
};

type SvgIconProps = IconProps & {
  viewBox: string;
  children: ReactNode;
};

export function SvgIcon({ size, viewBox, children, ...props }: SvgIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox={viewBox}
      fill="none"
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  );
}
