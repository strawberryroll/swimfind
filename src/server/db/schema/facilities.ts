import {
  boolean,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

import { pools } from "./pools";

export const facilities = pgTable("facilities", {
  id: serial("id").primaryKey(),

  poolId: integer("pool_id")
    .notNull()
    .references(() => pools.id),

  type: text("type").notNull(),

  description: text("description"),

  isAvailable: boolean("is_available").notNull(),

  verifiedAt: timestamp("verified_at", {
    withTimezone: true,
  }),
});
