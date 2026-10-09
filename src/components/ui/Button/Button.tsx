import clsx from "clsx";
import type { ComponentProps } from "react";

import styles from "./Button.module.css";
import { type ButtonVariants, buttonVariants } from "./Button.variants";

type ButtonProps = ComponentProps<"button"> &
  ButtonVariants & {
    loading?: boolean;
  };

export function Button({
  variant,
  size,
  fullWidth,
  loading = false,
  type = "button",
  disabled,
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={clsx(
        buttonVariants({ variant, size, fullWidth }),
        loading && styles.loading,
        className,
      )}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading && <span className={styles.spinner} aria-hidden="true" />}
      {children}
    </button>
  );
}
