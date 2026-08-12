import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export async function createProduct(data: Prisma.ProductCreateInput) {
  return await prisma.product.create({
    data,
    include: {
      category: true,
      brand: true,
      occasions: true,
    },
  });
}

export async function getProducts() {
  return prisma.product.findMany({
    include: {
      category: true,
      brand: true,
      occasions: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function getProductById(id: string) {
  return prisma.product.findUnique({
    where: { id },
    include: {
      category: true,
      brand: true,
      occasions: true,
    },
  });
}

export async function updateProduct(
  id: string,
  data: Prisma.ProductUpdateInput,
) {
  return prisma.product.update({
    where: { id },
    data,
    include: {
      category: true,
      brand: true,
      occasions: true,
    },
  });
}

export async function deleteProduct(id: string) {
  return prisma.product.delete({
    where: { id },
  });
}
