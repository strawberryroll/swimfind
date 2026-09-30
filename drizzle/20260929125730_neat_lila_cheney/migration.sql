CREATE TABLE "pool_closures" (
	"id" serial PRIMARY KEY,
	"pool_id" integer NOT NULL,
	"closure_date" date NOT NULL,
	"type" text NOT NULL,
	"description" text,
	"source_url" text,
	"verified_at" timestamp with time zone
);
--> statement-breakpoint
ALTER TABLE "pool_closures" ADD CONSTRAINT "pool_closures_pool_id_pools_id_fkey" FOREIGN KEY ("pool_id") REFERENCES "pools"("id");