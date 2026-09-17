# Homepage acceptance

This checklist applies only to Homepage Mode. PPT uses [PPT_VISUAL_QA.md](PPT_VISUAL_QA.md) and the checks in [PRESENTATION_WORKFLOW.md](PRESENTATION_WORKFLOW.md).

Review the rendered page, not just its source:

- Identity, real evidence and next action are clear. Projects explain contribution and outcomes; missing claims are marked honestly.
- The user's selected reference is recognizable in composition, type, spacing and interaction. Visual choices support content; no particular palette or layout is mandatory.
- Chinese typography has reliable CJK fallbacks, readable body text and intentional heading wraps.
- Desktop and mobile have balanced hero and project scale, useful images, sufficient whitespace and no overlap or horizontal overflow.
- Sections form a continuous browsing experience; responsive layout and scroll behavior work. Mobile does not depend on hover.
- Links, filters, media, keyboard focus and touch controls work. Images have meaningful alt text; QR codes retain full bounds and quiet zones.
- Motion respects reduced motion; expensive effects have a usable fallback.
- Standalone HTML editing and export follow [shared acceptance](references/html-editing-export.md#acceptance). No slide stage, deck shortcuts or presenter UI has leaked into the homepage.
- Project build/checks pass where applicable. Report skipped checks and material limitations honestly.
