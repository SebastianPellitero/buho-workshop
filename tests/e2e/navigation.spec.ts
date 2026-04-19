import { test, expect } from "@playwright/test";

test.describe("Navigation", () => {
  test("home page loads and shows category links", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/buho workshop/i);
    await expect(page.getByRole("link", { name: /3d prints/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /montessori/i })).toBeVisible();
  });

  test("navbar links navigate to correct routes", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: /3d prints/i }).click();
    await expect(page).toHaveURL(/\/3d-prints/);
  });

  test("montessori category page loads", async ({ page }) => {
    await page.goto("/montessori");
    await expect(page).toHaveURL(/\/montessori/);
  });

  test("account page redirects unauthenticated users to login", async ({ page }) => {
    await page.goto("/account");
    // Should be redirected away from /account
    await expect(page).not.toHaveURL(/\/account/, { timeout: 5_000 });
  });

  test("dev panel is visible in development", async ({ page }) => {
    await page.goto("/?dev=true");
    // The gear button (aria-label) should be visible
    await expect(page.getByRole("button", { name: /dev error panel/i })).toBeVisible();
  });
});
