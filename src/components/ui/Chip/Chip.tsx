import clsx from "clsx";
import type { ComponentProps } from "react";

import { type ChipVariants, chipVariants } from "./Chip.variants";

type ChipProps = Omit<ComponentProps<"button">, "aria-pressed"> &
  ChipVariants & {
    selected?: boolean;
  };

export function Chip({
  tone,
  size,
  selected,
  type = "button",
  className,
  ...props
}: ChipProps) {
  return (
    <button
      type={type}
      className={clsx(chipVariants({ tone, size }), className)}
      aria-pressed={selected}
      {...props}
    />
  );
}
