import { NodeIO } from "@gltf-transform/core";
import { ALL_EXTENSIONS } from "@gltf-transform/extensions";
import { draco, textureCompress, dedup, prune, weld, simplify } from "@gltf-transform/functions";
import { MeshoptSimplifier } from "meshoptimizer";
import draco3d from "draco3d";
import sharp from "sharp";
import { createHash } from "node:crypto";
import { readFile, writeFile, access } from "node:fs/promises";
import { execFileSync } from "node:child_process";

const upload = process.argv.includes("--upload");
const onlyIndex = process.argv.indexOf("--only");
const only = onlyIndex < 0 ? null : process.argv[onlyIndex + 1];
if (onlyIndex >= 0 && (!only || only.startsWith("--"))) throw new Error("--only requires a filename stem");
const base = (process.env.WEB_ASSET_BASE_URL || "").replace(/\/$/, "");
if (upload && !base.startsWith("https://")) throw new Error("Set WEB_ASSET_BASE_URL before uploading");
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({
  "draco3d.decoder": await draco3d.createDecoderModule(),
  "draco3d.encoder": await draco3d.createEncoderModule()
});
const registry = JSON.parse(await readFile("data/web-assets.json", "utf8"));
let obsolete = [];
try { obsolete = JSON.parse(await readFile(".cache/obsolete-web-objects.json", "utf8")); } catch {}
await MeshoptSimplifier.ready;
const env = Object.fromEntries(Object.entries(process.env).filter(([key]) => !["http_proxy", "https_proxy", "all_proxy"].includes(key.toLowerCase())));
for (const [id, record] of Object.entries(registry.models)) {
  if (!record.object_key) continue;
  const name = record.object_key.replace(/^web-models\//, "").replace(/-[a-f0-9]{12}\.glb$/, "");
  if (only && only !== name) continue;
  const input = ".cache/web-assets/" + name + ".glb";
  try { await access(input); } catch { continue; }
  const output = ".cache/web-assets/" + name + ".web.glb";
  const document = await io.read(input);
  const animationCount = document.getRoot().listAnimations().length;
  if (record.source_animation_count && !animationCount) throw new Error(name + ": source animation was lost");
  const triangles = () => document.getRoot().listMeshes().flatMap(mesh => mesh.listPrimitives())
    .reduce((count, primitive) => count + (primitive.getIndices()?.getCount() || primitive.getAttribute("POSITION")?.getCount() || 0) / 3, 0);
  const initialTriangles = triangles();
  // Keep animated geometry, skin weights, and morph targets unchanged.
  if (!animationCount && initialTriangles > 200000) {
    await document.transform(weld(), simplify({ simplifier: MeshoptSimplifier, ratio: 200000 / initialTriangles, error: 0.01 }));
  }
  await document.transform(dedup(), textureCompress({ encoder: sharp, resize: [1024, 1024] }), draco(), prune());
  await io.write(output, document);
  const restored = await io.read(output);
  if (restored.getRoot().listAnimations().length !== animationCount) throw new Error(name + ": optimization lost animation");
  const bytes = await readFile(output);
  const hash = createHash("sha256").update(bytes).digest("hex");
  const key = "web-models/" + name + "-" + hash.slice(0, 12) + ".glb";
  if (upload) {
    execFileSync("aws", ["s3", "cp", output, "s3://ffishasia-models/" + key,
      "--profile", "r2", "--endpoint-url", "https://bab4f0abd1eb8841b9cfc25ef1087c7d.r2.cloudflarestorage.com",
      "--content-type", "model/gltf-binary", "--cache-control", "public,max-age=31536000,immutable", "--no-progress"],
    { env, stdio: ["ignore", "pipe", "pipe"] });
    if (key !== record.object_key) obsolete.push(record.object_key);
    registry.models[id] = { ...record, object_key: key, glb_url: base + "/" + key,
      glb_bytes: bytes.length, glb_sha256: hash, preview_triangles: Math.round(triangles()),
      glb_animation_count: animationCount,
      optimization: (animationCount ? "Original animated geometry, " : "Meshopt simplification (200k target, 1% error bound), ") + "1024px textures, Draco compression" };
    await writeFile("data/web-assets.json", JSON.stringify(registry, null, 2) + "\n");
  }
  console.log(name + ": " + (record.glb_bytes / 1048576).toFixed(1) + " -> " + (bytes.length / 1048576).toFixed(1) + " MB");
}
await writeFile(".cache/obsolete-web-objects.json", JSON.stringify([...new Set(obsolete)], null, 2) + "\n");
