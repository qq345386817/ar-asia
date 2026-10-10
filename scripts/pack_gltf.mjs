import { NodeIO } from "@gltf-transform/core";

const [input, output] = process.argv.slice(2);
if (!input || !output) throw new Error("Usage: node pack_gltf.mjs input.gltf output.glb");
const io = new NodeIO();
const document = await io.read(input);
await io.write(output, document);
