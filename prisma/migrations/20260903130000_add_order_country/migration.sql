-- Add a country to order shipping addresses. Defaults to "India" so existing
-- orders and any flow that omits the field still store a sensible value.
ALTER TABLE "orders" ADD COLUMN "country" TEXT NOT NULL DEFAULT 'India';
