# 已接入模型的来源与下载格式

本批模型已于 2026-10-11 全部下载，原始文件保存在 `usdz_resources/04/`。
8 个新增模型已接入统一 manifest；网页用 GLB 和 App 用 USDZ 已分别准备。

以下保留本批资源的来源和下载格式，便于追溯或重新准备资源，不是待办下载清单。
通过浏览器重新下载时无需配置 Sketchfab API token；登录后，在模型页面选择
**Download 3D Model**。若来源不再提供下载，不要替换为来源或协议不明的文件。

## 下载格式和放置目录

- 网站优先使用 **GLB**；没有 GLB 时下载 **glTF ZIP**，保留完整压缩包（包含纹理、bin 等文件）。
- 动画模型需要原始 GLB/glTF，不能用丢失动画轨道的 USDZ 转换结果替代。
- 表中的新增模型已分别准备网页 GLB 和 App USDZ；重新准备时应保留完整的原始下载包。
- 本批原始文件位于主项目 `usdz_resources/04/`，按表格目录名整理；不要覆盖或提交这些本机档案。
- 资源接入流程会检查动画、材质、模型大小与协议，再优化并上传 R2；流程见 README。

## 已有动画模型（2 个）

| 模型 | 下载页面 | 子目录 |
| --- | --- | --- |
| 日本泽蟹（低面数、动画） | [Japanese Freshwater Crab Low Poly](https://sketchfab.com/3d-models/35559c2236d04c1a80ccbe08cae863c6) | `japanese_freshwater_crab_lowpoly` |
| 日本锦蛇（动画） | [Striped Snake](https://sketchfab.com/3d-models/0f4f583d5e3842eca1152c0bb021ec32) | `striped_snake` |

## 已接入的新增模型（8 个）

以下保留下载时的来源页面名称，当前八语名称和分类资料见主项目的统一 manifest。
筛选、下载和接入时均逐个核对了 CC0-1.0 协议。

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
