import { boolean, integer, pgTable, serial, text } from "drizzle-orm/pg-core";

import { pools } from "./pools";

export const poolImages = pgTable("pool_images", {
  id: serial("id").primaryKey(),

  poolId: integer("pool_id")
    .notNull()
    .references(() => pools.id),

  imageKey: text("image_key").notNull(),

  sortOrder: integer("sort_order").notNull().default(0),

  isPrimary: boolean("is_primary").notNull().default(false),
});
