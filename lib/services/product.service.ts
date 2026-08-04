import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export async function createProduct(data: Prisma.ProductCreateInput) {
  return await prisma.product.create({
    data,
    include: {
      category: true,
      brand: true,
    },
  });
}

export async function getProducts() {
  return prisma.product.findMany({
    include: {
      category: true,
      brand: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}
