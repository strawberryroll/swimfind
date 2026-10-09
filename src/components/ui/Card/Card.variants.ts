import { cva, type VariantProps } from "class-variance-authority";

import styles from "./Card.module.css";

export const cardVariants = cva(styles.base, {
  variants: {
    variant: {
      elevated: styles.elevated,
      outlined: styles.outlined,
    },
    padding: {
      none: "",
      md: styles.paddingMd,
    },
  },
  defaultVariants: {
    variant: "elevated",
    padding: "none",
  },
});

export type CardVariants = VariantProps<typeof cardVariants>;
