import type {
  freeSwimmingPrices,
  freeSwimmingSchedules,
  freeSwimmingSessions,
  poolClosures,
  poolOperatingHours,
  pools,
} from "@/server/db/schema";

export type Pool = typeof pools.$inferSelect;

export type PoolOperatingHour = typeof poolOperatingHours.$inferSelect;

export type FreeSwimmingSchedule = typeof freeSwimmingSchedules.$inferSelect;

export type FreeSwimmingSession = typeof freeSwimmingSessions.$inferSelect;

export type PoolClosure = typeof poolClosures.$inferSelect;

export type FreeSwimmingPrice = typeof freeSwimmingPrices.$inferSelect;

export type TodayFreeSwimmingStatus =
  | "AVAILABLE"
  | "ENDED"
  | "CLOSED"
  | "NO_SCHEDULE"
  | "NOT_OPERATED"
  | "UNVERIFIED";

export type PoolDetail = {
  pool: Pool;
  operatingHours: PoolOperatingHour[];
  schedules: FreeSwimmingSchedule[];
  sessions: FreeSwimmingSession[];
  closures: PoolClosure[];
  prices: FreeSwimmingPrice[];
};

export type PoolStatusInput = {
  pool: Pick<Pool, "freeSwimmingStatus">;
  operatingHours: Pick<
    PoolOperatingHour,
    "dayOfWeek" | "isClosed" | "openTime" | "closeTime"
  >[];
  schedules: Pick<
    FreeSwimmingSchedule,
    "id" | "dayOfWeek" | "startDate" | "endDate" | "status"
  >[];
  sessions: Pick<FreeSwimmingSession, "scheduleId" | "startTime" | "endTime">[];
  closures: Pick<PoolClosure, "closureDate">[];
};

export type PoolDetailResult = PoolDetail & {
  todayStatus: TodayFreeSwimmingStatus;
};
