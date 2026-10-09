import clsx from "clsx";
import type { ComponentProps } from "react";

import { type SelectVariants, selectVariants } from "./Select.variants";

type SelectProps = ComponentProps<"select"> & SelectVariants;

export function Select({ shape, className, ...props }: SelectProps) {
  return (
    <select className={clsx(selectVariants({ shape }), className)} {...props} />
  );
}
