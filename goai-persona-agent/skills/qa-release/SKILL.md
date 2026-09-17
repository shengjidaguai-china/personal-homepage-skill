---
name: qa-release
description: 独立验证事实覆盖、隐私、无障碍、响应式、依赖与发布安全；管理最终人工审批、版本发布、撤回和回滚。
---

# QA Release

## 输入

- `BuildArtifact`
- `SourceMap`
- `ClaimEvidence[]`
- `ConsentGrant[]`
- `previous_release_id`

## 输出

- `QAReport`：事实证据覆盖率、越权调用数、隐私违规、功能与视觉测试。
- `PublishApproval`
- `ReleaseManifest`
- `RollbackReport`

## 调用条件

QA 在构建后运行；发布必须同时满足 `QAReport.gate=PASS` 与用户 G3 `PublishApproval`。

## 依赖

Promptfoo、Playwright、axe-core、Presidio 兼容检测、Git / 静态托管适配器、OpenTelemetry。

## 失败处理

任何硬闸门失败都生成整改任务，不允许降级放行；发布失败不切换当前版本；回滚失败立即冻结写操作并通知人工。

## 安全边界

发布、删除和撤回均为高风险动作；凭据只通过 AgentTeams / Higress 授权引用；日志不得包含密钥或原始敏感内容。

## 复用价值

适用于任何由多 Agent 生成并对外公开的个人页面、媒体包、PDF 或静态站点。
