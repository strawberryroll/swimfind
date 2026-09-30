CREATE TABLE "facilities" (
	"id" serial PRIMARY KEY,
	"pool_id" integer NOT NULL,
	"type" text NOT NULL,
	"description" text,
	"is_available" boolean NOT NULL,
	"verified_at" timestamp with time zone
);
--> statement-breakpoint
ALTER TABLE "facilities" ADD CONSTRAINT "facilities_pool_id_pools_id_fkey" FOREIGN KEY ("pool_id") REFERENCES "pools"("id");