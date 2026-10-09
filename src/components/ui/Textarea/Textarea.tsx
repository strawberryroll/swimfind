import clsx from "clsx";
import type { ComponentProps } from "react";

import styles from "./Textarea.module.css";

type TextareaProps = ComponentProps<"textarea">;

export function Textarea({ className, ...props }: TextareaProps) {
  return <textarea className={clsx(styles.textarea, className)} {...props} />;
}
