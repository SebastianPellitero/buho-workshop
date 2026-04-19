import { test, expect } from "@playwright/test";

// Helper: seed one item into cart via localStorage then navigate
async function seedCart(page: import("@playwright/test").Page) {
  await page.goto("/");
  await page.evaluate(() => {
    const item = {
      variantId: "test-variant-id",
      productName: "Owl Figurine",
      color: "Red",
      size: "M",
      price: 14,
      quantity: 1,
      image: "",
    };
    localStorage.setItem("buho_cart", JSON.stringify([item]));
  });
}

test.describe("Checkout flow", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => localStorage.clear());
  });

  test("cart page shows empty state when cart is empty", async ({ page }) => {
    await page.goto("/cart");
    await expect(page.getByText(/your cart is empty/i)).toBeVisible();
  });

  test("cart page shows items when cart has entries", async ({ page }) => {
    await seedCart(page);
    await page.goto("/cart");
    await expect(page.getByText(/owl figurine/i)).toBeVisible();
  });

  test("checkout page is accessible from the cart", async ({ page }) => {
    await seedCart(page);
    await page.goto("/cart");
    await page.getByRole("link", { name: /checkout/i }).click();
    await expect(page).toHaveURL(/\/checkout/);
  });

  test("checkout page shows guest form fields", async ({ page }) => {
    await seedCart(page);
    await page.goto("/checkout");
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.getByLabel(/address/i)).toBeVisible();
    await expect(page.getByLabel(/city/i)).toBeVisible();
    await expect(page.getByLabel(/postal code/i)).toBeVisible();
  });

  test("checkout page shows order summary with correct item", async ({ page }) => {
    await seedCart(page);
    await page.goto("/checkout");
    await expect(page.getByText(/owl figurine/i)).toBeVisible();
    // Total should be visible
    await expect(page.getByText(/total/i)).toBeVisible();
  });
});
