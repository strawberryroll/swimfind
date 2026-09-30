import {
  date,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

import { pools } from "./pools";

export const poolClosures = pgTable("pool_closures", {
  id: serial("id").primaryKey(),

  poolId: integer("pool_id")
    .notNull()
    .references(() => pools.id),

  closureDate: date("closure_date").notNull(),

  type: text("type").notNull(),

  description: text("description"),

  sourceUrl: text("source_url"),

  verifiedAt: timestamp("verified_at", {
    withTimezone: true,
  }),
});
