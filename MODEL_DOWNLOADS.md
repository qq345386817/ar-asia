# 模型手动下载清单

无需提供 Sketchfab API token；登录 Sketchfab 后，在下列模型页面选择
**Download 3D Model** 下载即可。若页面提示无法下载，请告诉我，不要改用来源不明的文件。

## 下载格式和放置目录

- 网站优先使用 **GLB**；没有 GLB 时下载 **glTF ZIP**，保留完整压缩包（包含纹理、bin 等文件）。
- 前两个已有动画模型必须使用原始 GLB/glTF，不能用 USDZ 转换替代，否则可能丢失动画。
- 后八个新增候选模型，除了 GLB/glTF，若提供 **USDZ** 也请一起下载，供 App 使用。
- 文件放在主项目 `usdz_resources/04/` 下。建议按表格中的目录名分别建子目录；文件本身不用重命名或解压。
- 下载后我会检查动画、材质、模型大小与协议，再优化并上传 R2。候选模型尚未加入正式模型目录。

## 优先：已有动画模型（2 个）

| 模型 | 下载页面 | 子目录 |
| --- | --- | --- |
| 日本泽蟹（低面数、动画） | [Japanese Freshwater Crab Low Poly](https://sketchfab.com/3d-models/35559c2236d04c1a80ccbe08cae863c6) | `japanese_freshwater_crab_lowpoly` |
| 日本锦蛇（动画） | [Striped Snake](https://sketchfab.com/3d-models/0f4f583d5e3842eca1152c0bb021ec32) | `striped_snake` |

## 新增候选模型（8 个）

以下是来源页面名称，尚未完成六种语言的正式命名。筛选时逐个通过
Sketchfab API 确认协议为 CC0-1.0；下载和接入时仍会再次核对。

| 模型（来源名称） | 下载页面 | 子目录 |
| --- | --- | --- |
| Ariake Stream Catfish（动画） | [有明溪鲶](https://sketchfab.com/3d-models/51e0cc7840c54790bfd674d70dfb6bab) | `ariake_stream_catfish` |
| Golden-ringed Dragonfly | [蜻蜓](https://sketchfab.com/3d-models/e97f063a09ff4d9da06fc5183008e2c9) | `golden_ringed_dragonfly` |
| Asian Mantis | [广腹螳螂](https://sketchfab.com/3d-models/eccb69c46a574d97ba0d755ed5a8b9a7) | `asian_mantis` |
| Mountain Stag Beetle | [深山锹甲](https://sketchfab.com/3d-models/e821b05809e54ab18d53b51de529666e) | `mountain_stag_beetle` |
| Tsushima Salamander | [对马岛小鲵](https://sketchfab.com/3d-models/8f44452b86964f849cbd361c357b8587) | `tsushima_salamander` |
| Japanese Eastern Tree Frog | [日本东部树蛙](https://sketchfab.com/3d-models/f0e348fa1b694fc5b49f990d8f1e3324) | `japanese_eastern_tree_frog` |
| Common Goldfish / Carassius auratus | [鲫属鱼类](https://sketchfab.com/3d-models/0f6de63d38c1410983b5a6a5c43fb8ea) | `carassius_auratus` |
| Mediterranean Hermit Crab | [寄居蟹](https://sketchfab.com/3d-models/1c6af8acf9a7444a97632d8c973d7cc4) | `mediterranean_hermit_crab` |

注：鲫属鱼类的来源描述未确定具体种下分类，接入时不会直接标为某个观赏金鱼品种。
