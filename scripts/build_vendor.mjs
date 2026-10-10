import { build } from "esbuild";
import { copyFile, mkdir } from "node:fs/promises";

await mkdir("assets/vendor", { recursive: true });
await build({
  entryPoints: ["scripts/icons.mjs"],
  outfile: "assets/vendor/icons.js",
  bundle: true,
  minify: true,
  format: "iife",
  target: "es2020",
  legalComments: "linked",
});
await copyFile("node_modules/@google/model-viewer/dist/model-viewer.min.js", "assets/vendor/model-viewer.js");
await copyFile("node_modules/@google/model-viewer/LICENSE", "assets/vendor/model-viewer.LICENSE");
await copyFile("node_modules/lucide/LICENSE", "assets/vendor/lucide.LICENSE");
await mkdir("assets/vendor/draco", { recursive: true });
for (const name of ["draco_decoder.wasm", "draco_wasm_wrapper.js", "draco_decoder.js"]) {
  await copyFile("node_modules/three/examples/jsm/libs/draco/gltf/" + name, "assets/vendor/draco/" + name);
}
