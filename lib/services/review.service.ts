import { prisma } from "@/lib/prisma";

export type ReviewItem = {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  name: string;
  verified: boolean;
};

export type ReviewDistribution = {
  stars: number;
  percent: number;
};

export type ReviewAggregate = {
  reviews: ReviewItem[];
  count: number;
  verifiedCount: number;
  average: number;
  distribution: ReviewDistribution[];
};

export type ReviewSubmitResult = {
  success: boolean;
  message?: string;
  aggregate?: ReviewAggregate;
};

/** 1★–5★ breakdown as percentages; all zeros when there are no reviews yet. */
export function buildDistribution(
  count: number,
  starCounts: Record<number, number>,
): ReviewDistribution[] {
  return [5, 4, 3, 2, 1].map((stars) => ({
    stars,
    percent: count > 0 ? Math.round(((starCounts[stars] ?? 0) / count) * 100) : 0,
  }));
}

/** User ids who ordered this product — the only reviews that earn the verified badge. */
async function getPurchasedUserIds(
  productId: string,
  userIds: string[],
): Promise<Set<string>> {
  if (userIds.length === 0) return new Set();
  const purchasedItems = await prisma.orderItem.findMany({
    where: {
      productId,
      order: { userId: { in: userIds } },
    },
    select: { order: { select: { userId: true } } },
  });
  return new Set(purchasedItems.map((item) => item.order.userId));
}

function toAggregate(items: ReviewItem[]): ReviewAggregate {
  const count = items.length;
  const verifiedCount = items.filter((item) => item.verified).length;
  const average =
    count > 0
      ? Math.round((items.reduce((sum, item) => sum + item.rating, 0) / count) * 10) / 10
      : 4.5;
  const starCounts: Record<number, number> = {};
  for (const item of items) {
    starCounts[item.rating] = (starCounts[item.rating] ?? 0) + 1;
  }
  return {
    reviews: items,
    count,
    verifiedCount,
    average,
    distribution: buildDistribution(count, starCounts),
  };
}

export async function getProductReviewAggregate(
  productId: string,
): Promise<ReviewAggregate> {
  const reviews = await prisma.review.findMany({
    where: { productId },
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { id: true, name: true } },
    },
  });

  const purchasedUserIds = await getPurchasedUserIds(
    productId,
    reviews.map((review) => review.userId),
  );

  return toAggregate(
    reviews.map((review) => ({
      id: review.id,
      rating: review.rating,
      comment: review.comment,
      createdAt: review.createdAt.toISOString(),
      name: review.user.name,
      verified: purchasedUserIds.has(review.userId),
    })),
  );
}

export async function submitProductReview(input: {
  productId: string;
  userId: string;
  rating: number;
  comment: string;
}): Promise<ReviewSubmitResult> {
  const product = await prisma.product.findUnique({
    where: { id: input.productId },
    select: { id: true },
  });
  if (!product) {
    return { success: false, message: "Product not found." };
  }

  const rating = Math.min(5, Math.max(1, Math.round(input.rating)));
  const comment = input.comment.trim().slice(0, 1000);
  if (comment.length < 5) {
    return {
      success: false,
      message: "Please write a short review (at least 5 characters).",
    };
  }

  try {
    // One review per user per product — resubmitting updates it.
    await prisma.review.upsert({
      where: {
        productId_userId: { productId: input.productId, userId: input.userId },
      },
      update: { rating, comment },
      create: {
        productId: input.productId,
        userId: input.userId,
        rating,
        comment,
      },
    });
  } catch {
    return {
      success: false,
      message: "We couldn't save your review. Please try again.",
    };
  }

  return {
    success: true,
    message: "Thanks! Your review is now live on this product.",
    aggregate: await getProductReviewAggregate(input.productId),
  };
}