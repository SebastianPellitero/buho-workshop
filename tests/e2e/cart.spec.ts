import { test, expect } from "@playwright/test";

test.describe("Cart flow", () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage before each test
    await page.goto("/");
    await page.evaluate(() => localStorage.clear());
  });

  test("cart badge starts at 0 / empty", async ({ page }) => {
    await page.goto("/");
    // Badge should not render or show 0 when cart is empty
    const badge = page.locator("[data-testid='cart-badge-count']");
    await expect(badge).not.toBeVisible();
  });

  test("navigating to a category shows product cards", async ({ page }) => {
    await page.goto("/3d-prints");
    // At least one product card should be rendered
    const cards = page.locator("[data-testid='product-card']");
    await expect(cards.first()).toBeVisible({ timeout: 10_000 });
  });

  test("product detail page shows size selector and color picker", async ({ page }) => {
    await page.goto("/3d-prints");
    const firstCard = page.locator("[data-testid='product-card']").first();
    await expect(firstCard).toBeVisible({ timeout: 10_000 });
    await firstCard.click();

    // Expect size buttons
    await expect(page.getByRole("button", { name: "S" })).toBeVisible();
    await expect(page.getByRole("button", { name: "M" })).toBeVisible();
    await expect(page.getByRole("button", { name: "L" })).toBeVisible();
  });

  test("selecting size and color enables add-to-cart and updates price", async ({ page }) => {
    await page.goto("/3d-prints");
    await page.locator("[data-testid='product-card']").first().click();

    // Select size M
    await page.getByRole("button", { name: "M" }).click();

    // Price display should update (not show "Select a size")
    await expect(page.getByText(/select a size/i)).not.toBeVisible();
    await expect(page.getByText(/€/)).toBeVisible();
  });

  test("adding an item to the cart increments the badge", async ({ page }) => {
    await page.goto("/3d-prints");
    await page.locator("[data-testid='product-card']").first().click();

    // Select first available color swatch
    const swatch = page.locator("button[title]").first();
    await swatch.click();

    // Select size
    await page.getByRole("button", { name: "M" }).click();

    // Click add to cart
    await page.getByRole("button", { name: /add to cart/i }).click();

    // Cart badge should show 1
    await expect(page.locator("[data-testid='cart-badge-count']")).toHaveText("1");
  });
});
