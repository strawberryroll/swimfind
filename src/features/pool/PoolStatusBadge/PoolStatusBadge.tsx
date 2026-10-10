import type { ComponentProps } from "react";

import { Badge } from "@/components/ui/Badge/Badge";
import type { TodayFreeSwimmingStatus } from "@/server/pool/pool.types";

import { getPoolStatusDisplay } from "../pool-status-display";

type PoolStatusBadgeProps = Pick<
  ComponentProps<typeof Badge>,
  "appearance" | "size" | "className"
> & {
  status: TodayFreeSwimmingStatus;
};

export function PoolStatusBadge({ status, ...props }: PoolStatusBadgeProps) {
  const { label, tone, dot } = getPoolStatusDisplay(status);

  return (
    <Badge tone={tone} dot={dot} {...props}>
      {label}
    </Badge>
  );
}
