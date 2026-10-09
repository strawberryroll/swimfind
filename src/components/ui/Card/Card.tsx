import clsx from "clsx";
import type { ComponentProps } from "react";

import { type CardVariants, cardVariants } from "./Card.variants";

type CardProps = ComponentProps<"div"> & CardVariants;

export function Card({ variant, padding, className, ...props }: CardProps) {
  return (
    <div
      className={clsx(cardVariants({ variant, padding }), className)}
      {...props}
    />
  );
}
