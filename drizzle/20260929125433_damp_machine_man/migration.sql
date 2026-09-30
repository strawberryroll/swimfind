CREATE TYPE "free_swimming_price_type" AS ENUM('DAILY', 'MONTHLY');--> statement-breakpoint
CREATE TYPE "free_swimming_target_type" AS ENUM('ADULT', 'YOUTH', 'CHILD');--> statement-breakpoint
CREATE TABLE "free_swimming_prices" (
	"id" serial PRIMARY KEY,
	"pool_id" integer NOT NULL,
	"price_type" "free_swimming_price_type" NOT NULL,
	"target_type" "free_swimming_target_type" NOT NULL,
	"amount" integer NOT NULL,
	"note" text,
	"verified_at" timestamp with time zone,
	"source_url" text,
	CONSTRAINT "free_swimming_prices_pool_price_target_unique" UNIQUE("pool_id","price_type","target_type"),
	CONSTRAINT "free_swimming_prices_amount_check" CHECK ("amount" >= 0)
);
--> statement-breakpoint
ALTER TABLE "free_swimming_prices" ADD CONSTRAINT "free_swimming_prices_pool_id_pools_id_fkey" FOREIGN KEY ("pool_id") REFERENCES "pools"("id");