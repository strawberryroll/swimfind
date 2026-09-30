import { sql } from "drizzle-orm";
import {
  check,
  date,
  integer,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";

import { dayOfWeekEnum, pools } from "./pools";

export const freeSwimmingScheduleStatusEnum = pgEnum(
  "free_swimming_schedule_status",
  ["ACTIVE", "INACTIVE"],
);

export const freeSwimmingSchedules = pgTable(
  "free_swimming_schedules",
  {
    id: serial("id").primaryKey(),

    poolId: integer("pool_id")
      .notNull()
      .references(() => pools.id),

    dayOfWeek: dayOfWeekEnum("day_of_week").notNull(),

    startDate: date("start_date"),

    endDate: date("end_date"),

    status: freeSwimmingScheduleStatusEnum("status")
      .notNull()
      .default("ACTIVE"),

    verifiedAt: timestamp("verified_at", {
      withTimezone: true,
    }),

    sourceUrl: text("source_url"),
  },
  (table) => [
    check(
      "free_swimming_schedules_date_range_check",
      sql`
        ${table.startDate} IS NULL
        OR ${table.endDate} IS NULL
        OR ${table.startDate} <= ${table.endDate}
      `,
    ),
    uniqueIndex("free_swimming_schedules_active_unique")
      .on(
        table.poolId,
        table.dayOfWeek,
        sql`COALESCE(${table.startDate}, '-infinity'::date)`,
        sql`COALESCE(${table.endDate}, 'infinity'::date)`,
      )
      .where(sql`${table.status} = 'ACTIVE'`),
  ],
);
