-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "galleryPublicIds" TEXT[] DEFAULT ARRAY[]::TEXT[];
