import { calculatePrice } from "../price";

describe("calculatePrice", () => {
  it("applies 1.0x for size S", () => {
    expect(calculatePrice(10, "S")).toBe(10);
  });

  it("applies 1.4x for size M", () => {
    expect(calculatePrice(10, "M")).toBe(14);
  });

  it("applies 1.8x for size L", () => {
    expect(calculatePrice(10, "L")).toBe(18);
  });

  it("rounds to 2 decimal places", () => {
    expect(calculatePrice(9.99, "M")).toBe(13.99);
  });

  it("falls back to 1.0x for unknown size", () => {
    expect(calculatePrice(10, "XL")).toBe(10);
  });

  it("handles zero base price", () => {
    expect(calculatePrice(0, "L")).toBe(0);
  });

  it("handles fractional base price with L multiplier", () => {
    // 7.50 * 1.8 = 13.50
    expect(calculatePrice(7.5, "L")).toBe(13.5);
  });
});
