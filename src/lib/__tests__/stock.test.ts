jest.mock("../prisma");

import { validateCartStock } from "../stock";
import { prisma } from "../prisma";
import type { CartItem } from "@/types";

const mockedFindUnique = prisma.productVariant.findUnique as jest.MockedFunction<
  typeof prisma.productVariant.findUnique
>;

const makeItem = (variantId: string, quantity: number): CartItem => ({
  variantId,
  productName: `Product ${variantId}`,
  color: "Red",
  size: "M",
  price: 14,
  quantity,
  image: "/img.jpg",
});

beforeEach(() => {
  jest.clearAllMocks();
});

describe("validateCartStock", () => {
  it("returns no conflicts when all stock is sufficient", async () => {
    mockedFindUnique
      .mockResolvedValueOnce({ stockQty: 5 } as never)
      .mockResolvedValueOnce({ stockQty: 10 } as never);

    const items = [makeItem("v1", 2), makeItem("v2", 3)];
    const conflicts = await validateCartStock(items);
    expect(conflicts).toHaveLength(0);
  });

  it("returns a conflict when stock is insufficient", async () => {
    mockedFindUnique.mockResolvedValueOnce({ stockQty: 1 } as never);

    const items = [makeItem("v1", 5)];
    const conflicts = await validateCartStock(items);

    expect(conflicts).toHaveLength(1);
    expect(conflicts[0]).toMatchObject({
      variantId: "v1",
      requested: 5,
      available: 1,
    });
  });

  it("treats a missing variant as 0 stock", async () => {
    mockedFindUnique.mockResolvedValueOnce(null as never);

    const items = [makeItem("missing-v", 1)];
    const conflicts = await validateCartStock(items);

    expect(conflicts).toHaveLength(1);
    expect(conflicts[0].available).toBe(0);
  });

  it("returns multiple conflicts when several items are out of stock", async () => {
    mockedFindUnique
      .mockResolvedValueOnce({ stockQty: 0 } as never)
      .mockResolvedValueOnce({ stockQty: 0 } as never);

    const items = [makeItem("v1", 2), makeItem("v2", 1)];
    const conflicts = await validateCartStock(items);

    expect(conflicts).toHaveLength(2);
  });

  it("returns empty array for empty cart", async () => {
    const conflicts = await validateCartStock([]);
    expect(conflicts).toHaveLength(0);
    expect(mockedFindUnique).not.toHaveBeenCalled();
  });
});
