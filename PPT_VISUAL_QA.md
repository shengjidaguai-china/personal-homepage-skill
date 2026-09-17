# HTML PPT visual acceptance

Only for Presentation Mode; functional checks are in [PRESENTATION_WORKFLOW.md](PRESENTATION_WORKFLOW.md).

## Before expanding a new deck

Inspect the chosen preview or source and capture its defining palette, typography, borders, alignment, spacing and image treatment. Transfer those visual features to a fixed slide composition. Use a few representative slides with actual content to test the design early.

Prioritize real project screenshots, case evidence, portraits and provided QR codes. Generated visuals may support concepts, but cannot substitute for claimed evidence. Keep screenshots readable and QR codes complete with quiet zones; do not crop them into decorative shapes.

## Review rendered slides

- **Density and emphasis:** can a listener identify the main point quickly? Is full narration in notes where appropriate? Split or redesign dense slides instead of reducing type to illegibility.
- **Hierarchy and rhythm:** titles, short points, evidence and transitions have distinct weight. Repeated layouts provide consistency while case pages and pauses provide useful variation.
- **Template fidelity:** compare type, borders, geometry, illustration treatment and spacing, not only colors. Do not substitute a terminal, dashboard or gold gradient for the chosen style.
- **Image scale:** screenshots and portraits are large enough for their role, with useful crops and readable captions. QR codes retain white margins and scan reliably at intended display size.
- **Composition:** check title baseline, text wrapping, content center, whitespace, bottom spacing and overlay collision. Intentional asymmetry and empty space are valid; filler is unnecessary.
- **Playback:** exactly one slide is painted; no clipping, adjacent-page residue or animation that moves important text during reading.

Use `qa-report.json` as risk evidence, not automatic aesthetic approval. For complex slides, `data-qa-content` can mark the content measurement boundary and `data-qa-ignore` or `aria-hidden` can exclude decoration. If an edit fails to appear, inspect computed styles, active state and layout/motion transforms, then compare rendered images.

Check all pages for new decks. Review affected pages at full size for small edits and compare neighboring pages for consistency. Record what was inspected and any remaining limitation; a successful overflow or navigation check alone is insufficient.
