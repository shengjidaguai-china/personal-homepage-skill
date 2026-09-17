---
name: content-architecture
description: 将已审核的品牌主张组织为主页、作品集、媒体包或自我介绍的信息架构，并为每段内容保留 claimId 引用。
---

# Content Architecture

## 输入

- `BrandBrief`
- `ClaimEvidence[]`
- `delivery_type`
- `audience`

## 输出

- `InformationArchitecture`
- `ContentBlocks[]`：标题、正文、CTA、使用的 `claim_ids`、公开级别。
- `MissingContent[]`

## 调用条件

必须存在 G1 已确认的 `BrandBrief`；外部事实必须已经进入 Ledger。

## 依赖

个人主页数据 Schema、中文排版规则、内容长度检查。

## 失败处理

内容过密时重组层级，不删除关键限定语；缺少证据时使用明确占位符或移除该区块。

## 安全边界

联系方式、公司名、客户名和生活信息遵循字段级公开策略；不得生成虚假评价。

## 复用价值

同一套结构化内容可复用到主页、简历摘要、社媒简介、路演嘉宾页和个人介绍 PDF。
