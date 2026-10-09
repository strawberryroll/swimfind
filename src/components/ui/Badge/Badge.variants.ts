import { cva, type VariantProps } from "class-variance-authority";

import styles from "./Badge.module.css";

export const badgeVariants = cva(styles.base, {
  variants: {
    tone: {
      primary: styles.primary,
      success: styles.success,
      warning: styles.warning,
      danger: styles.danger,
      neutral: styles.neutral,
    },
    appearance: {
      plain: styles.plain,
      soft: styles.soft,
    },
    size: {
      sm: styles.sm,
      md: styles.md,
    },
  },
  defaultVariants: {
    tone: "neutral",
    appearance: "plain",
    size: "sm",
  },
});

export type BadgeVariants = VariantProps<typeof badgeVariants>;
