import { cva, type VariantProps } from "class-variance-authority";

import styles from "./Chip.module.css";

export const chipVariants = cva(styles.base, {
  variants: {
    tone: {
      default: styles.default,
      overlay: styles.overlay,
    },
    size: {
      sm: styles.sm,
      md: styles.md,
    },
  },
  defaultVariants: {
    tone: "default",
    size: "md",
  },
});

export type ChipVariants = VariantProps<typeof chipVariants>;
