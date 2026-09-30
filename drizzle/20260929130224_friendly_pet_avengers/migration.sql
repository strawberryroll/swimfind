CREATE TABLE "pool_images" (
	"id" serial PRIMARY KEY,
	"pool_id" integer NOT NULL,
	"image_key" text NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"is_primary" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
ALTER TABLE "pool_images" ADD CONSTRAINT "pool_images_pool_id_pools_id_fkey" FOREIGN KEY ("pool_id") REFERENCES "pools"("id");