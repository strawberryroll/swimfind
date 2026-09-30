CREATE TYPE "day_of_week" AS ENUM('MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN');--> statement-breakpoint
CREATE TABLE "pool_operating_hours" (
	"id" serial PRIMARY KEY,
	"pool_id" integer NOT NULL,
	"day_of_week" "day_of_week" NOT NULL,
	"open_time" time,
	"close_time" time,
	"is_closed" boolean DEFAULT false NOT NULL,
	"verified_at" timestamp with time zone,
	CONSTRAINT "pool_operating_hours_pool_id_day_of_week_unique" UNIQUE("pool_id","day_of_week"),
	CONSTRAINT "pool_operating_hours_closed_time_check" CHECK ((
        ("is_closed" = true AND "open_time" IS NULL AND "close_time" IS NULL)
        OR
        ("is_closed" = false AND "open_time" IS NOT NULL AND "close_time" IS NOT NULL)
      )),
	CONSTRAINT "pool_operating_hours_time_order_check" CHECK ("open_time" < "close_time")
);
--> statement-breakpoint
ALTER TABLE "pool_operating_hours" ADD CONSTRAINT "pool_operating_hours_pool_id_pools_id_fkey" FOREIGN KEY ("pool_id") REFERENCES "pools"("id");