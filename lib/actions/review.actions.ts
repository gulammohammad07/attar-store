"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth/dal";
import {
  getProductReviewAggregate,
  submitProductReview,
  type ReviewAggregate,
  type ReviewItem,
  type ReviewDistribution,
  type ReviewSubmitResult,
} from "@/lib/services/review.service";

export type { ReviewAggregate, ReviewItem, ReviewDistribution, ReviewSubmitResult };

export async function getProductReviewAggregateAction(
  productId: string,
): Promise<ReviewAggregate> {
  return getProductReviewAggregate(productId);
}

export async function submitReviewAction(input: {
  productId: string;
  rating: number;
  comment: string;
}): Promise<ReviewSubmitResult> {
  const user = await getCurrentUser();
  if (!user) {
    return { success: false, message: "Please sign in to leave a review." };
  }

  const result = await submitProductReview({
    productId: input.productId,
    userId: user.id,
    rating: input.rating,
    comment: input.comment,
  });

  // Storefront card ratings read the reviews table on every render, so a
  // submit must clear every cached page that shows them.
  if (result.success) {
    revalidatePath("/", "layout");
  }

  return result;
}