import { test, expect } from "@playwright/test";
import { readFile } from "node:fs/promises";

const languages = ["en-US", "de-DE", "ja", "ko", "zh-Hans", "zh-Hant"];
const allCopy = JSON.parse(await readFile(new URL("../../data/web-copy.json", import.meta.url), "utf8"));
const catalog = JSON.parse(await readFile(new URL("../../../FFishAsia/Resources/manifest.json", import.meta.url), "utf8"));
const experience = JSON.parse(await readFile(new URL("../../data/experience.json", import.meta.url), "utf8"));

test("all languages render and search without overflow at desktop and mobile widths", async ({ page }) => {
  const errors = [];
  page.on("pageerror", error => errors.push(error.message));
  for (const locale of languages) {
    for (const width of [1440, 390]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto("/" + locale + "/models/");
      await expect(page.locator("h1")).toHaveText(allCopy[locale].catalogTitle);
      await expect(page.locator(".specimen-tile:visible")).toHaveCount(catalog.models.length);
      await page.locator("#model-search").fill("Geothelphusa dehaani");
      await expect(page.locator(".specimen-tile:visible")).toHaveCount(2);
      await page.locator("#model-search").fill("");
      await page.locator("#animated-filter").check();
      await expect(page.locator(".specimen-tile:visible")).toHaveCount(catalog.models.filter(model => model.has_animation).length);
      await page.locator("#animated-filter").uncheck();
      await page.locator("#model-search").fill("no-such-species-1234");
      await expect(page.locator("#catalog-empty")).toBeVisible();
      await page.locator("#reset-filters").click();
      await expect(page.locator(".specimen-tile:visible")).toHaveCount(catalog.models.length);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    }
  }
  expect(errors).toEqual([]);
});

test("selection survives model navigation and language changes; print sets paginate", async ({ page }) => {
  await page.goto("/en-US/models/");
  await page.locator('[data-card-id="35559c2236d04c1a80ccbe08cae863c6"]').click();
  await page.locator('[data-card-id="0f4f583d5e3842eca1152c0bb021ec32"]').click();
  await page.goto("/de-DE/study-cards/");
  await expect(page.locator(".study-preview .print-card")).toHaveCount(2);
  await page.locator("#select-featured").click();
  await expect(page.locator(".study-preview .print-card")).toHaveCount(experience.featured.length);
  await page.locator("#card-layout").selectOption("matching");
  await page.evaluate(() => window.dispatchEvent(new Event("beforeprint")));
  await expect(page.locator("#print-output .print-page")).toHaveCount(Math.ceil(experience.featured.length / 9) * 2);
  await expect(page.locator("#print-output .print-card")).toHaveCount(experience.featured.length * 2);
  await page.emulateMedia({ media: "print" });
  await page.pdf({ path: "/tmp/little-nature-cards-de-A4.pdf", preferCSSPageSize: true, printBackground: true });
  await page.emulateMedia({ media: "screen" });
  await page.locator("#paper-size").selectOption("Letter");
  await page.evaluate(() => window.dispatchEvent(new Event("beforeprint")));
  await page.emulateMedia({ media: "print" });
  await page.pdf({ path: "/tmp/little-nature-cards-de-Letter.pdf", preferCSSPageSize: true, printBackground: true });
  await page.emulateMedia({ media: "screen" });
  await page.locator("#clear-cards").click();
  await expect(page.locator("#study-empty")).toBeVisible();
  await expect(page.locator("#print-cards")).toBeDisabled();
});

test("a browser with unavailable local storage can still select and print cards", async ({ page }) => {
  await page.addInitScript(() => Object.defineProperty(window, "localStorage", { get() { throw new DOMException("Blocked", "SecurityError"); } }));
  await page.goto("/en-US/study-cards/");
  await expect(page.locator(".study-preview .print-card")).toHaveCount(6);
  await page.locator("#clear-cards").click();
  await expect(page.locator("#print-cards")).toBeDisabled();
  await page.locator("#select-featured").click();
  await expect(page.locator(".study-preview .print-card")).toHaveCount(experience.featured.length);
});

test("model loading is lazy; a network failure has a working retry", async ({ page }) => {
  const requests = [];
  page.on("request", request => { if (request.url().includes("sketchfab.com")) requests.push(request.url()); });
  await page.goto("/en-US/models/japanese-freshwater-crab-lowpoly/");
  expect(requests).toEqual([]);
  await page.route("https://pub-*.r2.dev/**", route => route.abort());
  await page.route("https://static.sketchfab.com/**", route => route.abort());
  await page.locator("#load-viewer").click();
  await expect(page.locator("#retry-viewer")).toBeVisible();
  await expect(page.locator("#viewer-status-text")).toHaveText(allCopy["en-US"].loadError);
  await page.locator("#retry-viewer").click();
  await expect(page.locator("#retry-viewer")).toBeVisible();
});

test("self-hosted animation loads and advances without Sketchfab requests", async ({ page }) => {
  const errors = [];
  page.on("pageerror", error => errors.push(error.message));
  const sourceRequests = [];
  page.on("request", request => { if (request.url().includes("sketchfab.com")) sourceRequests.push(request.url()); });
  for (const slug of ["japanese-freshwater-crab-lowpoly", "striped-snake", "ariake-stream-catfish"]) {
    await page.goto("/en-US/models/" + slug + "/");
    await page.locator("#load-viewer").click();
    await expect(page.locator("#specimen-viewer")).toHaveAttribute("data-ready", "true", { timeout: 65000 });
    await expect(page.locator("#animation-toggle")).toBeVisible();
    await expect(page.locator("#animation-toggle")).toHaveAttribute("aria-pressed", "true");
    await page.locator("#animation-toggle").click();
    await expect(page.locator("#animation-toggle")).toHaveAttribute("aria-pressed", "false");
    await page.locator("#animation-toggle").click();
    await expect(page.locator("#animation-toggle")).toHaveAttribute("aria-pressed", "true");
    const bounds = await page.locator("#specimen-viewer").boundingBox();
    const clip = { x: bounds.x + bounds.width * 0.15, y: bounds.y + bounds.height * 0.15,
      width: bounds.width * 0.7, height: bounds.height * 0.55 };
    const first = await page.screenshot({ clip, path: "/tmp/little-nature-" + slug + "-first.png" });
    await page.waitForTimeout(1200);
    const second = await page.screenshot({ clip, path: "/tmp/little-nature-" + slug + "-second.png" });
    expect(first.equals(second)).toBe(false);
  }
  expect(errors).toEqual([]);
  expect(sourceRequests).toEqual([]);
});

test("prepared GLB models render locally without falling back to the source viewer", async ({ page }) => {
  test.setTimeout(480000);
  const registry = JSON.parse(await readFile(new URL("../../data/web-assets.json", import.meta.url), "utf8"));
  const manifest = JSON.parse(await readFile(new URL("../../../FFishAsia/Resources/manifest.json", import.meta.url), "utf8"));
  const models = manifest.models.filter(model => registry.models[model.id]?.glb_url);
  const errors = [];
  page.on("pageerror", error => errors.push(error.message));
  for (const [index, model] of models.entries()) {
    const slug = model.filename.replace(".usdz", "").replaceAll("_", "-");
    await page.setViewportSize({ width: index % 2 ? 390 : 1440, height: 1000 });
    await page.goto("/en-US/models/" + slug + "/");
    await page.locator("#load-viewer").click();
    await expect(page.locator("#specimen-viewer")).toHaveAttribute("data-ready", "true", { timeout: 30000 });
    await expect(page.locator("#viewer-stage model-viewer")).toHaveCount(1);
    await expect(page.locator("#viewer-stage iframe")).toHaveCount(0);
    await expect(page.locator("#viewer-stage model-viewer")).toBeVisible();
    await page.locator("#specimen-viewer").screenshot({ path: "/tmp/little-nature-glb-" + slug + ".png" });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
  expect(errors).toEqual([]);
});
