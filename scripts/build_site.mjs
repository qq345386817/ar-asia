import { cp, mkdir, readdir, rm, stat } from "node:fs/promises";
import { join } from "node:path";

const output = "public";
const folders = ["en-US", "de-DE", "ja", "ko", "zh-Hans", "zh-Hant", "model-images", "style", "assets"];
const rootFiles = /^(?:index|help|privacy-policy|404|google[a-z0-9]+)\.html$|^(?:sitemap\.xml|robots\.txt|llms\.txt|_redirects|_headers|app-icon\.png|apple-touch-icon\.png|favicon-\d+\.png)$/;
await rm(output, { recursive: true, force: true });
await mkdir(output);
for (const folder of folders) await cp(folder, join(output, folder), { recursive: true });
for (const name of await readdir(".")) {
  if (rootFiles.test(name)) await cp(name, join(output, name));
}
async function check(directory) {
  let count = 0;
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) count += await check(path);
    else {
      if ((await stat(path)).size > 25 * 1024 * 1024) throw new Error("Cloudflare Pages file size limit: " + path);
      count++;
    }
  }
  return count;
}
const count = await check(output);
if (count > 20000) throw new Error("Cloudflare Pages file count limit exceeded");
console.log("Static site ready: " + count + " files. No credentials, source model archives, or node_modules copied.");
