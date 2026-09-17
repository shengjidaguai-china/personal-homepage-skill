---
name: profile-interview
description: 从用户主动提供的本地资料中提取经历、优势、矛盾与缺口，生成可确认的访谈问题和定位候选证据；不得访问外部个人数据。
---

# Profile Interview

## 使用场景

初次接收简历、用户补充资料、作品清单或口述经历时使用。

## 输入

- `case_id`
- `local_material_refs`
- `user_goal`
- `public_identity_preferences`

## 输出

- `ProfileDraft`：经历、能力、价值观、目标受众与限制。
- `GapList`：会影响定位判断的缺口，按优先级排序。
- `InterviewQuestions`：一次最多 7 个，只问无法从现有材料发现的问题。
- `PositionSignals`：带本地证据引用的定位线索，不等于最终定位。

## 调用条件

仅处理用户主动提供的本地材料；不需要外部数据授权。

## 依赖

Docling 兼容文档解析接口、PII 检测接口、AgentTeams 共享任务目录。

## 失败处理

解析失败时保留原文件哈希，切换到只读文本提取；信息冲突时标为 `conflict` 并询问用户，不自行选择。

## 安全边界

不得访问搜索引擎、社媒或代码平台；不得把缺失信息写成事实；联系方式默认标为非公开。

## 复用价值

可用于求职、创作者、自由职业者、专家、学生和创业者的结构化访谈。
