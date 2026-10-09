import clsx from "clsx";
import type { ComponentProps } from "react";

import styles from "./Avatar.module.css";

type AvatarProps = Omit<ComponentProps<"span">, "children"> & {
  name: string;
  size?: "sm" | "md" | "lg";
};

export function Avatar({
  name,
  size = "md",
  className,
  ...props
}: AvatarProps) {
  const initial = Array.from(name.trim())[0]?.toUpperCase() ?? "";

  return (
    <span
      role="img"
      aria-label={name}
      className={clsx(styles.avatar, styles[size], className)}
      {...props}
    >
      {initial}
    </span>
  );
}
