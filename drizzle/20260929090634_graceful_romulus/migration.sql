CREATE TYPE "free_swimming_schedule_status" AS ENUM('ACTIVE', 'INACTIVE');--> statement-breakpoint
CREATE TABLE "free_swimming_schedules" (
	"id" serial PRIMARY KEY,
	"pool_id" integer NOT NULL,
	"day_of_week" "day_of_week" NOT NULL,
	"start_date" date,
	"end_date" date,
	"status" "free_swimming_schedule_status" DEFAULT 'ACTIVE'::"free_swimming_schedule_status" NOT NULL,
	"verified_at" timestamp with time zone,
	"source_url" text,
	CONSTRAINT "free_swimming_schedules_date_range_check" CHECK (
        "start_date" IS NULL
        OR "end_date" IS NULL
        OR "start_date" <= "end_date"
      )
);
--> statement-breakpoint
ALTER TABLE "free_swimming_schedules" ADD CONSTRAINT "free_swimming_schedules_pool_id_pools_id_fkey" FOREIGN KEY ("pool_id") REFERENCES "pools"("id");