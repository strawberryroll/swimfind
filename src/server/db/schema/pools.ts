import { sql } from "drizzle-orm";
import {
  boolean,
  check,
  doublePrecision,
  integer,
  pgEnum,
  pgTable,
  serial,
  text,
  time,
  timestamp,
  unique,
  varchar,
} from "drizzle-orm/pg-core";

export const poolStatusEnum = pgEnum("pool_status", ["ACTIVE", "INACTIVE"]);

export const freeSwimmingStatusEnum = pgEnum("free_swimming_status", [
  "OPERATED",
  "NOT_OPERATED",
  "UNKNOWN",
]);

export const dayOfWeekEnum = pgEnum("day_of_week", [
  "MON",
  "TUE",
  "WED",
  "THU",
  "FRI",
  "SAT",
  "SUN",
]);

export const pools = pgTable("pools", {
  id: serial("id").primaryKey(),

  name: varchar("name", { length: 100 }).notNull(),

  address: varchar("address", { length: 255 }).notNull(),

  latitude: doublePrecision("latitude").notNull(),

  longitude: doublePrecision("longitude").notNull(),

  phone: varchar("phone", { length: 30 }),

  homepageUrl: text("homepage_url"),

  status: poolStatusEnum("status").notNull().default("ACTIVE"),

  freeSwimmingStatus: freeSwimmingStatusEnum("free_swimming_status")
    .notNull()
    .default("UNKNOWN"),

  freeSwimmingVerifiedAt: timestamp("free_swimming_verified_at", {
    withTimezone: true,
  }),

  freeSwimmingNote: text("free_swimming_note"),

  infoVerifiedAt: timestamp("info_verified_at", {
    withTimezone: true,
  }),
});

export const poolOperatingHours = pgTable(
  "pool_operating_hours",
  {
    id: serial("id").primaryKey(),

    poolId: integer("pool_id")
      .notNull()
      .references(() => pools.id),

    dayOfWeek: dayOfWeekEnum("day_of_week").notNull(),

    openTime: time("open_time"),

    closeTime: time("close_time"),

    isClosed: boolean("is_closed").notNull().default(false),

    verifiedAt: timestamp("verified_at", { withTimezone: true }),
  },
  (table) => [
    unique("pool_operating_hours_pool_id_day_of_week_unique").on(
      table.poolId,
      table.dayOfWeek,
    ),
    check(
      "pool_operating_hours_closed_time_check",
      sql`(
        (${table.isClosed} = true AND ${table.openTime} IS NULL AND ${table.closeTime} IS NULL)
        OR
        (${table.isClosed} = false AND ${table.openTime} IS NOT NULL AND ${table.closeTime} IS NOT NULL)
      )`,
    ),
    check(
      "pool_operating_hours_time_order_check",
      sql`${table.openTime} < ${table.closeTime}`,
    ),
  ],
);
