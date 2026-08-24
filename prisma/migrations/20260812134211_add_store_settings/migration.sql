-- CreateTable
CREATE TABLE "store_settings" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "storeName" TEXT NOT NULL DEFAULT 'Danish Perfumes',
    "supportEmail" TEXT NOT NULL DEFAULT 'support@danishperfumes.com',
    "supportPhone" TEXT NOT NULL DEFAULT '',
    "address" TEXT NOT NULL DEFAULT '',
    "freeShippingThreshold" DOUBLE PRECISION NOT NULL DEFAULT 1500,
    "shippingFee" DOUBLE PRECISION NOT NULL DEFAULT 99,
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "store_settings_pkey" PRIMARY KEY ("id")
);
