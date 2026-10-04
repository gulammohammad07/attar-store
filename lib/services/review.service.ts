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

/** Customer emails who ordered this product — verifies guest buyer reviews. */
async function getPurchasedEmails(
  productId: string,
  emails: string[],
): Promise<Set<string>> {
  const cleanEmails = emails.map((e) => e.trim().toLowerCase()).filter(Boolean);
  if (cleanEmails.length === 0) return new Set();
  const purchasedItems = await prisma.orderItem.findMany({
    where: {
      productId,
      order: {
        customerEmail: { in: cleanEmails, mode: "insensitive" },
      },
    },
    select: { order: { select: { customerEmail: true } } },
  });
  return new Set(
    purchasedItems.map((item) => item.order.customerEmail.toLowerCase()),
  );
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
      user: { select: { id: true, name: true, email: true } },
    },
  });

  const userIds = reviews
    .map((review) => review.userId)
    .filter((id): id is string => Boolean(id));

  const guestEmails = reviews
    .map((review) => review.guestEmail)
    .filter((e): e is string => Boolean(e));

  const [purchasedUserIds, purchasedEmails] = await Promise.all([
    getPurchasedUserIds(productId, userIds),
    getPurchasedEmails(productId, guestEmails),
  ]);

  return toAggregate(
    reviews.map((review) => ({
      id: review.id,
      rating: review.rating,
      comment: review.comment,
      createdAt: review.createdAt.toISOString(),
      name: review.user?.name || review.guestName || "Customer",
      verified: Boolean(
        (review.userId && purchasedUserIds.has(review.userId)) ||
          (review.guestEmail &&
            purchasedEmails.has(review.guestEmail.toLowerCase())),
      ),
    })),
  );
}

export type SubmitProductReviewInput = {
  productId: string;
  userId?: string | null;
  guestName?: string | null;
  guestEmail?: string | null;
  rating: number;
  comment: string;
};

export async function submitProductReview(
  input: SubmitProductReviewInput,
): Promise<ReviewSubmitResult> {
  const product = await prisma.product.findUnique({
    where: { id: input.productId },
    select: { id: true },
  });
  if (!product) {
    return { success: false, message: "Product not found." };
  }

  const rating = Math.min(5, Math.max(1, Math.round(input.rating || 5)));
  const comment = (input.comment || "").trim().slice(0, 1000);
  if (comment.length < 5) {
    return {
      success: false,
      message: "Please write a short review (at least 5 characters).",
    };
  }

  try {
    if (input.userId) {
      // One review per user per product — resubmitting updates it.
      const existing = await prisma.review.findFirst({
        where: { productId: input.productId, userId: input.userId },
      });

      if (existing) {
        await prisma.review.update({
          where: { id: existing.id },
          data: { rating, comment },
        });
      } else {
        await prisma.review.create({
          data: {
            productId: input.productId,
            userId: input.userId,
            rating,
            comment,
          },
        });
      }
    } else {
      const guestName = (input.guestName || "").trim().slice(0, 80);
      if (!guestName || guestName.length < 2) {
        return {
          success: false,
          message: "Please enter your name (at least 2 characters).",
        };
      }
      const guestEmail = input.guestEmail
        ? input.guestEmail.trim().slice(0, 120)
        : null;

      await prisma.review.create({
        data: {
          productId: input.productId,
          guestName,
          guestEmail,
          rating,
          comment,
        },
      });
    }
  } catch (err) {
    console.error("Failed to save review:", err);
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