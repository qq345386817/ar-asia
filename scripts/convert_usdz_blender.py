"""Run with Blender's bundled Python to convert an already downloaded CC0 model."""
import json
from pathlib import Path
import sys
import bpy

arguments = sys.argv[sys.argv.index("--") + 1:]
source, destination = map(Path, arguments[:2])
expects_animation = len(arguments) > 2 and arguments[2] == "animated"
bpy.ops.wm.read_factory_settings(use_empty=True)
parameters = {"filepath": str(source), "import_skeletons": True, "import_blendshapes": True, "import_visible_only": False}
properties = bpy.ops.wm.usd_import.get_rna_type().properties
if "import_textures_mode" in properties:
    parameters["import_textures_mode"] = "IMPORT_PACK"
result = bpy.ops.wm.usd_import(**parameters)
if "FINISHED" not in result:
    raise RuntimeError("USDZ import failed")
scene = bpy.context.scene
mesh_count = sum(obj.type == "MESH" for obj in scene.objects)
actions = len(bpy.data.actions)
print("IMPORTED_MODEL", json.dumps({"meshes": mesh_count, "actions": actions, "frames": [scene.frame_start, scene.frame_end],
      "objects": [{"name": obj.name, "type": obj.type, "modifiers": [modifier.type for modifier in obj.modifiers]} for obj in scene.objects]}), flush=True)
if not mesh_count:
    raise RuntimeError("Imported model has no geometry")
if expects_animation and not actions:
    raise RuntimeError("USDZ animation was not imported; use the original GLB/glTF download instead")
for image in bpy.data.images:
    if image.type != "IMAGE" or not image.size[0] or not image.size[1]:
        continue
    maximum = max(image.size)
    if maximum > 1024:
        scale = 1024 / maximum
        image.scale(max(1, round(image.size[0] * scale)), max(1, round(image.size[1] * scale)))
        image.pack()
if not expects_animation:
    total_faces = sum(sum(max(1, len(polygon.vertices) - 2) for polygon in obj.data.polygons)
                      for obj in scene.objects if obj.type == "MESH")
    ratio = min(1.0, 200000 / max(1, total_faces))
    for obj in scene.objects:
        if obj.type != "MESH":
            continue
        faces = sum(max(1, len(polygon.vertices) - 2) for polygon in obj.data.polygons)
        if ratio < 1 and faces > 100:
            modifier = obj.modifiers.new("Web preview", "DECIMATE")
            modifier.ratio = ratio
            bpy.context.view_layer.objects.active = obj
            bpy.ops.object.modifier_apply(modifier=modifier.name)
destination.parent.mkdir(parents=True, exist_ok=True)
export = {"filepath": str(destination), "export_format": "GLB", "export_animations": True,
          "export_cameras": False, "export_lights": False, "export_force_sampling": True}
available = bpy.ops.export_scene.gltf.get_rna_type().properties
if "export_animation_mode" in available:
    export["export_animation_mode"] = "ACTIONS"
bpy.ops.export_scene.gltf(**{key: value for key, value in export.items() if key in available})
print("EXPORTED_GLB", destination.name, destination.stat().st_size, flush=True)
