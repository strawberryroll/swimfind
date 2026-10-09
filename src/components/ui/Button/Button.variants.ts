import { cva, type VariantProps } from "class-variance-authority";

import styles from "./Button.module.css";

export const buttonVariants = cva(styles.base, {
  variants: {
    variant: {
      primary: styles.primary,
      secondary: styles.secondary,
      subtle: styles.subtle,
      ghost: styles.ghost,
      danger: styles.danger,
    },
    size: {
      sm: styles.sm,
      md: styles.md,
    },
    fullWidth: {
      true: styles.fullWidth,
      false: "",
    },
  },
  defaultVariants: {
    variant: "primary",
    size: "md",
    fullWidth: false,
  },
});

export type ButtonVariants = VariantProps<typeof buttonVariants>;
