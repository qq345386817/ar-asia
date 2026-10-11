import { NodeIO } from "@gltf-transform/core";
import { ALL_EXTENSIONS } from "@gltf-transform/extensions";

const [input, output] = process.argv.slice(2);
if (!input || !output) throw new Error("Usage: node pack_gltf.mjs input.gltf output.glb");
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS);
const document = await io.read(input);
await io.write(output, document);
