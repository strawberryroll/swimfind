CREATE TABLE "free_swimming_sessions" (
	"id" serial PRIMARY KEY,
	"schedule_id" integer NOT NULL,
	"start_time" time NOT NULL,
	"end_time" time NOT NULL,
	"entry_close_time" time,
	"eligibility_note" text,
	CONSTRAINT "free_swimming_sessions_time_order_check" CHECK ("start_time" < "end_time"),
	CONSTRAINT "free_swimming_sessions_entry_close_time_check" CHECK (
        "entry_close_time" IS NULL
        OR "entry_close_time" <= "end_time"
      )
);
--> statement-breakpoint
ALTER TABLE "free_swimming_sessions" ADD CONSTRAINT "free_swimming_sessions_xpEnOiJWjZcm_fkey" FOREIGN KEY ("schedule_id") REFERENCES "free_swimming_schedules"("id");