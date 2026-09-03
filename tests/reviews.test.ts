import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { prisma } from "@/lib/prisma";
import {
  buildDistribution,
  getProductReviewAggregate,
  submitProductReview,
} from "@/lib/services/review.service";
import { getStorefrontProductBySlug } from "@/lib/services/storefront-data";

const ts = Date.now();
const slug = `review-test-${ts}`;

let categoryId = "";
let brandId = "";
let productId = "";
const userIds: string[] = [];

async function makeUser(email: string): Promise<string> {
  const user = await prisma.user.create({
    data: { name: "Test Reviewer", email, provider: "credentials" },
    select: { id: true },
  });
  userIds.push(user.id);
  return user.id;
}

beforeAll(async () => {
  const category = await prisma.category.create({
    data: { name: `Review Test ${ts}`, slug: `review-cat-${ts}` },
    select: { id: true },
  });
  const brand = await prisma.brand.create({
    data: { name: `Review Test ${ts}`, slug: `review-brand-${ts}` },
    select: { id: true },
  });
  const product = await prisma.product.create({
    data: {
      name: `Review Test ${ts}`,
      slug,
      price: 100,
      imageUrl: "https://example.com/p.png",
      volume: "10ml",
      categoryId: category.id,
      brandId: brand.id,
    },
    select: { id: true },
  });
  categoryId = category.id;
  brandId = brand.id;
  productId = product.id;
});

afterAll(async () => {
  if (!productId) return;
  await prisma.review.deleteMany({ where: { productId } });
  await prisma.orderItem.deleteMany({
    where: { order: { userId: { in: userIds } } },
  });
  await prisma.order.deleteMany({ where: { userId: { in: userIds } } });
  await prisma.user.deleteMany({ where: { id: { in: userIds } } });
  await prisma.product.delete({ where: { id: productId } });
  await prisma.brand.delete({ where: { id: brandId } });
  await prisma.category.delete({ where: { id: categoryId } });
});

describe("review round trip", () => {
  it("submit writes a review and the storefront rating reflects it", async () => {
    const userId = await makeUser(`review-a-${ts}@test.local`);
    const result = await submitProductReview({
      productId,
      userId,
      rating: 5,
      comment: "  Long-lasting and rich.  ",
    });

    expect(result.success).toBe(true);
    expect(result.aggregate).toMatchObject({
      count: 1,
      average: 5,
      verifiedCount: 0,
    });
    expect(result.aggregate!.reviews[0]).toMatchObject({
      rating: 5,
      comment: "Long-lasting and rich.",
      verified: false,
    });
    expect(result.aggregate!.distribution).toEqual([
      { stars: 5, percent: 100 },
      { stars: 4, percent: 0 },
      { stars: 3, percent: 0 },
      { stars: 2, percent: 0 },
      { stars: 1, percent: 0 },
    ]);

    // Cards aggregate the same reviews table the submit just wrote to.
    const storefront = await getStorefrontProductBySlug(slug);
    expect(storefront).toMatchObject({ rating: 5, reviewCount: 1 });
  });

  it("resubmitting updates the same review instead of adding another", async () => {
    const result = await submitProductReview({
      productId,
      userId: userIds[0],
      rating: 3,
      comment: "Better after drydown.",
    });

    expect(result.aggregate).toMatchObject({ count: 1, average: 3 });
    expect(result.aggregate!.reviews).toHaveLength(1);
    expect(result.aggregate!.reviews[0]).toMatchObject({
      rating: 3,
      comment: "Better after drydown.",
    });
    expect(await prisma.review.count({ where: { productId } })).toBe(1);

    const storefront = await getStorefrontProductBySlug(slug);
    expect(storefront).toMatchObject({ rating: 3, reviewCount: 1 });
  });

  it("averages and distributes multiple reviews", async () => {
    const otherUser = await makeUser(`review-b-${ts}@test.local`);
    await submitProductReview({
      productId,
      userId: otherUser,
      rating: 5,
      comment: "Five stars, love it.",
    });

    const aggregate = await getProductReviewAggregate(productId);
    expect(aggregate).toMatchObject({ count: 2, average: 4 });
    expect(aggregate.distribution).toEqual([
      { stars: 5, percent: 50 },
      { stars: 4, percent: 0 },
      { stars: 3, percent: 50 },
      { stars: 2, percent: 0 },
      { stars: 1, percent: 0 },
    ]);
  });

  it("clamps out-of-range ratings and rejects empty comments", async () => {
    const user = await makeUser(`review-c-${ts}@test.local`);
    await submitProductReview({
      productId,
      userId: user,
      rating: 9,
      comment: "Over the top.",
    });

    const clamped = await getProductReviewAggregate(productId);
    expect(clamped.reviews.find((r) => r.rating > 5)).toBeUndefined();

    const rejected = await submitProductReview({
      productId,
      userId: user,
      rating: 4,
      comment: "nope",
    });
    expect(rejected.success).toBe(false);
    const after = await getProductReviewAggregate(productId);
    expect(after.reviews.find((r) => r.comment === "nope")).toBeUndefined();
  });

  it("badges only reviews from customers who ordered the product", async () => {
    const buyer = await makeUser(`review-d-${ts}@test.local`);
    await submitProductReview({
      productId,
      userId: buyer,
      rating: 4,
      comment: "Lovely bottle.",
    });

    expect((await getProductReviewAggregate(productId)).verifiedCount).toBe(0);

    await prisma.order.create({
      data: {
        orderNumber: `RT-${ts}-1`,
        idempotencyKey: `rt-${ts}-1`,
        userId: buyer,
        customerName: "Test Reviewer",
        customerEmail: "x@test.local",
        customerPhone: "000",
        street: "1",
        city: "Mumbai",
        state: "MH",
        pincode: "400001",
        subtotal: 100,
        shippingFee: 0,
        total: 100,
        items: {
          create: [
            {
              productId,
              productName: "Test",
              productImage: "x",
              unitPrice: 100,
              quantity: 1,
              lineTotal: 100,
            },
          ],
        },
      },
    });

    const aggregate = await getProductReviewAggregate(productId);
    expect(aggregate.verifiedCount).toBe(1);
    expect(aggregate.reviews.find((r) => r.verified)).toMatchObject({
      name: "Test Reviewer",
    });
  });
});

const distributionCases: Array<{
  name: string;
  count: number;
  starCounts: Record<number, number>;
  expected: number[];
}> = [
  { name: "no reviews", count: 0, starCounts: {}, expected: [0, 0, 0, 0, 0] },
  { name: "two stars split", count: 2, starCounts: { 5: 1, 3: 1 }, expected: [50, 0, 50, 0, 0] },
  { name: "rounds to whole percents", count: 3, starCounts: { 5: 2, 4: 1 }, expected: [67, 33, 0, 0, 0] },
];

describe("buildDistribution", () => {
  it.each(distributionCases)("$name", ({ count, starCounts, expected }) => {
    expect(buildDistribution(count, starCounts).map((d) => d.percent)).toEqual(
      expected,
    );
  });
});