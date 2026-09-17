---
name: brand-strategy
description: 基于已确认资料与证据，从差异化、可信度和受众价值三项标准生成最多三个品牌定位候选，并维护用户选择记录。
---

# Brand Strategy

## 输入

- `ProfileDraft`
- `PositionSignals`
- `ClaimEvidence[]`
- `target_outcome`

## 输出

- `PositionOption[1..3]`：名称、一句话、目标受众、支持证据、优势、风险。
- `BrandBrief`：仅在用户确认后生成，包含表达边界和禁用表述。

## 调用条件

候选定位可在本地资料阶段生成；最终 `BrandBrief` 必须有 G1 人工审批记录。

## 依赖

Claim-Evidence Ledger、AgentTeams Team Leader 验收、可选多模型评审。

## 失败处理

证据不足时缩小承诺或输出补充材料请求；定位差异度不足时只保留一个稳健候选，不凑数。

## 安全边界

不得使用受保护身份、医疗 / 法律结论或无法证明的头衔；不得把推断改写为硬事实。

## 复用价值

可用于主页、媒体包、求职简介、演讲者介绍、社媒简介和个人产品定位。
