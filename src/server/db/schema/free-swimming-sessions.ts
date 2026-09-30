import { sql } from "drizzle-orm";
import {
  check,
  integer,
  pgTable,
  serial,
  text,
  time,
} from "drizzle-orm/pg-core";

import { freeSwimmingSchedules } from "./free-swimming-schedules";

export const freeSwimmingSessions = pgTable(
  "free_swimming_sessions",
  {
    id: serial("id").primaryKey(),

    scheduleId: integer("schedule_id")
      .notNull()
      .references(() => freeSwimmingSchedules.id),

    startTime: time("start_time").notNull(),

    endTime: time("end_time").notNull(),

    entryCloseTime: time("entry_close_time"),

    eligibilityNote: text("eligibility_note"),
  },
  (table) => [
    check(
      "free_swimming_sessions_time_order_check",
      sql`${table.startTime} < ${table.endTime}`,
    ),
    check(
      "free_swimming_sessions_entry_close_time_check",
      sql`
        ${table.entryCloseTime} IS NULL
        OR ${table.entryCloseTime} <= ${table.endTime}
      `,
    ),
  ],
);
