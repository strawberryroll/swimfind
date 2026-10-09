import clsx from "clsx";
import type { ComponentProps } from "react";

import styles from "./Badge.module.css";
import { type BadgeVariants, badgeVariants } from "./Badge.variants";

type BadgeProps = ComponentProps<"span"> &
  BadgeVariants & {
    dot?: boolean;
  };

export function Badge({
  tone,
  appearance,
  size,
  dot = false,
  className,
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={clsx(badgeVariants({ tone, appearance, size }), className)}
      {...props}
    >
      {dot && <span className={styles.dot} aria-hidden="true" />}
      {children}
    </span>
  );
}
