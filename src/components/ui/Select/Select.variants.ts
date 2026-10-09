import { cva, type VariantProps } from "class-variance-authority";

import styles from "./Select.module.css";

export const selectVariants = cva(styles.base, {
  variants: {
    shape: {
      pill: styles.pill,
      box: styles.box,
    },
  },
  defaultVariants: {
    shape: "pill",
  },
});

export type SelectVariants = VariantProps<typeof selectVariants>;
