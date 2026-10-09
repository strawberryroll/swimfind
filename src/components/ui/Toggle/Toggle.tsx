import clsx from "clsx";
import type { ComponentProps } from "react";

import styles from "./Toggle.module.css";

type ToggleProps = Omit<ComponentProps<"input">, "type" | "role">;

export function Toggle({ className, ...props }: ToggleProps) {
  return (
    <input
      type="checkbox"
      // biome-ignore lint/a11y/useAriaPropsForRole: 네이티브 checkbox의 checked 상태가 switch 상태로 노출되므로 aria-checked를 따로 두면 값이 어긋날 수 있다.
      role="switch"
      className={clsx(styles.toggle, className)}
      {...props}
    />
  );
}
