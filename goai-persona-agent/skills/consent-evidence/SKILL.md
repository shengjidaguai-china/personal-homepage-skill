---
name: consent-evidence
description: 签发和校验数据源授权令牌，在最小权限下采集证据，并维护事实、推断、包装分层的 Claim-Evidence Ledger。
---

# Consent Evidence

## 使用场景

G1 定位确认后，用户需要授权外部个人数据源；或 Agent 要主动检索公开网络、GitHub、作品站、媒体、公司官网/官方账号及引用外部事实时使用。用户上传资料只是身份起点，不是唯一证据源。

## 输入

- `case_id`
- `approved_position_id`
- `source_requests[]`：来源、用途、字段范围、访问方式、有效期。
- `claim_requests[]`
- `identity_anchors[]`：姓名、别名、已确认账号和公司官方域名等最小定位线索。

## 输出

- `ConsentGrant[]`
- `EvidenceItem[]`：来源 URL、抓取时间、内容摘要、哈希、授权编号。
- `ClaimEvidence[]`
- `AccessTrace[]`
- `IdentityMatchReview[]`：同名、同昵称或账号归属不确定时的人工确认任务。

## 调用条件

外部访问或检索必须同时存在 G1 的 `approved_position_id` 和状态为 `active` 的对应 `ConsentGrant`。公司官网证据默认标记为 `internal-only`，可支撑事实核验，不得自动在主页或参赛材料中暴露公司名。

## 依赖

OPA 兼容策略接口、Presidio 兼容 PII 检测、Playwright / Firecrawl 只读适配器、GitHub MCP 或 API。

## 失败处理

授权缺失立即 `ACCESS_DENIED`；来源不可访问时不得用搜索摘要代替原证据；同名或归属不确定的结果进入 `IdentityMatchReview`，未经本人确认不得合并；冲突证据全部保留并降级可信度；调用幂等键为 `case_id + source + scope + date`。

## 安全边界

默认拒绝、最小范围、只读优先；不得采集未授权的家庭、精确位置、健康或财务信息；授权撤回后停止调用并触发删除 / 保留例外清单。

## 复用价值

可复用于简历核验、专家主页、创作者媒体包、自由职业者作品集和企业员工介绍。
