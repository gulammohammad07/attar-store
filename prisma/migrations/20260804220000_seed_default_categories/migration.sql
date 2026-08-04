-- Seed default store categories (idempotent)
INSERT INTO "Category" ("id", "name", "slug", "description", "imageUrl", "isActive", "createdAt", "updatedAt")
VALUES
  (gen_random_uuid()::text, 'Men''s Attar', 'men-attar', 'Bold, masculine blends for everyday wear.', NULL, true, NOW(), NOW()),
  (gen_random_uuid()::text, 'Women''s Attar', 'women-attar', 'Elegant, feminine attars and florals.', NULL, true, NOW(), NOW()),
  (gen_random_uuid()::text, 'Arabic Attar', 'arabic-attar', 'Classic Arabian oils, oud and incense.', NULL, true, NOW(), NOW()),
  (gen_random_uuid()::text, 'Oud Collection', 'oud-collection', 'The finest aged oud and agarwood.', NULL, true, NOW(), NOW())
ON CONFLICT ("slug") DO NOTHING;
