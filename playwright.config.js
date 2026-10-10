import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  timeout: 90000,
  expect: { timeout: 10000 },
  workers: 1,
  outputDir: "/tmp/little-nature-web-test-results",
  reporter: [["list"]],
  use: {
    baseURL: "http://127.0.0.1:8765",
    channel: "chrome",
    screenshot: "only-on-failure",
    trace: "retain-on-failure",
    launchOptions: { args: ["--no-proxy-server"] }
  }
});
