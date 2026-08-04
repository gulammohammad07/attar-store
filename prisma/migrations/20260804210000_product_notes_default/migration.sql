-- Backfill existing NULL notes and enforce a default
UPDATE "Product" SET "notes" = '{}' WHERE "notes" IS NULL;
ALTER TABLE "Product" ALTER COLUMN "notes" SET DEFAULT '{}';
ALTER TABLE "Product" ALTER COLUMN "notes" SET NOT NULL;
