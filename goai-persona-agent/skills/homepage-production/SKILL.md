---
name: homepage-production
description: 把已确认的内容与视觉规范实现为响应式个人主页；优先调用 personal-homepage-skill，并输出可测试、可回滚的构建产物。
---

# Homepage Production

## 输入

- `InformationArchitecture`
- `ContentBlocks[]`
- `BrandBrief`
- `visual_reference_refs[]`
- `asset_grants[]`

## 输出

- `DesignSpec`
- `BuildArtifact`
- `AssetManifest`
- `SourceMap`：页面节点到 `claimId` 的映射。

## 调用条件

只接收 G1 后内容；图片和远程资产必须有授权或明确开源许可证。

## 依赖

`personal-homepage-skill`、React / HTML、Playwright、可选 GrapesJS 编辑接口。

## 失败处理

资产缺失时使用标注占位符；重型动效失败时降级为静态；构建失败时保留上一成功产物，不覆盖发布目录。

## 安全边界

禁止在构建阶段发起新的个人数据采集；禁止硬编码密钥和非公开信息；所有外链使用协议白名单。

## 复用价值

可供视觉 Agent 与前端 Agent 共同使用，适配求职、创作者、专家和开发者主页。
