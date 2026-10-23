import { test, expect } from "@playwright/test";
import { readFile } from "node:fs/promises";

const locales = ["en-US", "de-DE", "ja", "ko", "zh-Hans", "zh-Hant"];
const catalog = JSON.parse(await readFile(new URL("../../../FFishAsia/Resources/manifest.json", import.meta.url), "utf8"));

test("localized homepages keep specimen and navigation visible in both themes", async ({ page }) => {
  test.setTimeout(180000);
  const errors = [];
  page.on("pageerror", error => errors.push(error.message));
  for (const colorScheme of ["light", "dark"]) {
    await page.emulateMedia({ colorScheme });
    for (const locale of locales) {
      for (const width of [320, 390, 768, 1440, 1920]) {
        await page.setViewportSize({ width, height: 900 });
        await page.goto(`/${locale}/`);
        await expect(page.locator("h1")).toHaveText("Little Nature");
        await expect(page.locator(".hero-specimen")).toBeVisible();
        await expect.poll(() => page.locator(".hero-specimen").evaluate(image => image.complete && image.naturalWidth > 0)).toBe(true);
        await expect(page.locator(".hero-actions .button")).toHaveAttribute("href", `/${locale}/models/`);
        await expect(page.locator(".hero-motion-link")).toHaveAttribute("href", `/${locale}/collections/motion/`);
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
        const [brand, store, nav, language] = await Promise.all([
          page.locator(".brand").boundingBox(), page.locator(".store-nav").boundingBox(),
          page.locator(".nav-links").boundingBox(), page.locator(".language-select").boundingBox()
        ]);
        const overlaps = (a, b) => a.x < b.x + b.width - 1 && a.x + a.width > b.x + 1 && a.y < b.y + b.height - 1 && a.y + a.height > b.y + 1;
        expect(overlaps(brand, store), `${locale}/${width}: brand/store`).toBe(false);
        expect(overlaps(nav, language), `${locale}/${width}: nav/language`).toBe(false);
        const firstCollection = await page.locator(".theme-links").boundingBox();
        expect(firstCollection.y, `${locale}/${width}: next section`).toBeLessThan(900);
      }
    }
  }
  expect(errors).toEqual([]);
});

test("help, privacy and catalog share navigation without overflow", async ({ page }) => {
  test.setTimeout(120000);
  for (const locale of locales) {
    for (const route of ["models/", "help", "privacy-policy"]) {
      await page.setViewportSize({ width: 390, height: 844 });
      await page.goto(`/${locale}/${route}`);
      await expect(page.locator(".experience-site .site-header")).toBeVisible();
      await expect(page.locator("h1")).toHaveCount(1);
      await expect(page.locator(".store-nav")).toHaveAttribute("href", /apps\.apple\.com\/app\/id6766551832/);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      if (route !== "privacy-policy") {
        await expect(page.locator('.nav-links [aria-current="page"]')).toHaveCount(1);
      }
    }
  }
});

test("homepage calls to action and language selector reach the corresponding tools", async ({ page }) => {
  await page.goto("/en-US/");
  await page.locator(".hero-motion-link").click();
  await expect(page).toHaveURL(/\/en-US\/collections\/motion\/$/);
  await expect(page.locator(".specimen-tile:visible")).toHaveCount(3);
  await page.locator(".language-select").selectOption("/de-DE/collections/motion/");
  await expect(page).toHaveURL(/\/de-DE\/collections\/motion\/$/);
  await page.locator(".brand").click();
  await expect(page).toHaveURL(/\/de-DE\/$/);
  await page.locator(".hero-actions .button").click();
  await expect(page).toHaveURL(/\/de-DE\/models\/$/);
  await expect(page.locator(".specimen-tile")).toHaveCount(catalog.models.length);
});

test("language navigation remains usable without JavaScript", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  await page.goto(`${process.env.PLAYWRIGHT_BASE_URL || "http://127.0.0.1:8765"}/en-US/privacy-policy`);
  await expect(page.locator(".language-noscript a")).toHaveCount(6);
  await page.locator('.language-noscript a[href="/de-DE/privacy-policy"]').click();
  await expect(page).toHaveURL(/\/de-DE\/privacy-policy$/);
  await expect(page.locator("h1")).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await context.close();
});
