---
name: personal-homepage-skill
description: Create or edit personal homepages, portfolios, creator or resume websites, and fixed 16:9 HTML presentations with editable text, HTML export, and optional speaker notes.
---

# Personal Homepage & HTML Presentation

Identify the requested deliverable, then load only its workflow. Inspect an existing file or reference before changing it. Small edits need only the relevant implementation and checks.

| Mode | Deliverable | Read |
| --- | --- | --- |
| Homepage Mode | Continuous responsive website, portfolio, resume, project showcase | [Homepage workflow](HOMEPAGE_GENERATION_WORKFLOW.md) |
| Presentation Mode | Fixed 16:9 HTML PPT, page-by-page playback, slide notes and independent presenter window | [Presentation workflow](PRESENTATION_WORKFLOW.md) |

These modes have separate layout and acceptance rules. A homepage does not inherit slide sizing, page navigation or presenter mode; a deck does not inherit mobile reflow or scroll sections. When both are requested, produce separate artifacts, sharing only suitable content and visual assets.

## Shared decisions

- Follow the user's chosen template and references. Otherwise inspect actual candidates through the [template index](references/template-selection.md) and select for the person, audience, content and available assets. AI does not imply a black terminal; premium does not imply black/gold gradients. Cute Pixel Creator is an option, not a default.
- Preserve facts, viewpoints and explicit user choices. Mark missing facts; never invent metrics, endorsements, projects or links. Prefer real screenshots, cases, portraits and intact QR codes to decorative substitutes.
- Use readable CJK-capable typography and verified asset paths. Respect licenses and retain attribution for reused source.
- Treat suggested word counts, compositions and preview counts as adjustable guidance. Check actual rendering and functionality; do not add approval gates for ordinary design decisions or early self-review.

## Shared capabilities, loaded when needed

For standalone HTML, include editing and export unless the user declines them. Reuse [HTML editing and export](references/html-editing-export.md) and the bundled runtime instead of rewriting it. Stable semantic IDs, local saving and editable exported files are shared capabilities. Presenter mode belongs only to Presentation Mode.

For asset selection read [IMAGE_WORKFLOW.md](IMAGE_WORKFLOW.md); for style details read the selected entry in [STYLE_PRESETS.md](STYLE_PRESETS.md). Additional homepage section, data, motion and component references are linked from its workflow. Product planning and historical project documents are not required generation context.

Deliver the usable artifact, a short usage note, checks actually performed, and material limitations. Publishing is a separate user request.
