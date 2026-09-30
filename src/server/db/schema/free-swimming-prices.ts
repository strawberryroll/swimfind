import { sql } from "drizzle-orm";
import {
  check,
  integer,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  unique,
} from "drizzle-orm/pg-core";

import { pools } from "./pools";

export const freeSwimmingPriceTypeEnum = pgEnum("free_swimming_price_type", [
  "DAILY",
  "MONTHLY",
]);

export const freeSwimmingTargetTypeEnum = pgEnum("free_swimming_target_type", [
  "ADULT",
  "YOUTH",
  "CHILD",
]);

export const freeSwimmingPrices = pgTable(
  "free_swimming_prices",
  {
    id: serial("id").primaryKey(),

    poolId: integer("pool_id")
      .notNull()
      .references(() => pools.id),

    priceType: freeSwimmingPriceTypeEnum("price_type").notNull(),

    targetType: freeSwimmingTargetTypeEnum("target_type").notNull(),

    amount: integer("amount").notNull(),

    note: text("note"),

    verifiedAt: timestamp("verified_at", {
      withTimezone: true,
    }),

    sourceUrl: text("source_url"),
  },
  (table) => [
    unique("free_swimming_prices_pool_price_target_unique").on(
      table.poolId,
      table.priceType,
      table.targetType,
    ),
    check("free_swimming_prices_amount_check", sql`${table.amount} >= 0`),
  ],
);
