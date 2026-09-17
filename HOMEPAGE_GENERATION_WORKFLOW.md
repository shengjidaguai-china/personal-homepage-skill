# Homepage workflow

Only for a continuous responsive personal website. Use [DESIGN_REVIEW.md](DESIGN_REVIEW.md) for its acceptance; do not load PPT layout or presenter rules.

## Understand and choose

Inspect the provided page, reference and assets. Use known identity, audience, goal, projects and contact routes; ask only for missing information that materially blocks the work. Prefer honest marked placeholders to invented evidence.

Follow the chosen visual reference. Otherwise use the [template index](references/template-selection.md), inspect the actual previews, and choose for the content. A few real hero previews can help when direction is ambiguous; their number is flexible and they need not create a confirmation gate. Keep option labels and production notes outside the design.

## Build a continuous page

Plan the path from identity to evidence to next action. Select relevant sections: hero, selected projects, capabilities, about/experience, writing or channels, contact. Remove empty sections. Explain each project's problem, personal contribution and result; add method/stack when useful.

Use a continuous background and coherent typography, spacing and components. The user's block-based reference may intentionally have visible section boundaries. Create a focal point with the actual content; a second CTA, 3D object or animated background is optional.

Real images shape the layout: follow [IMAGE_WORKFLOW.md](IMAGE_WORKFLOW.md). Keep meaningful screenshots large and QR codes uncropped with their quiet zones. Motion should aid browsing, respect reduced motion, and have mobile fallbacks.

Choose a [single HTML starter](templates/single-html/README.md), [React/Tailwind starter](templates/react-tailwind/README.md), or an indexed complete template. Keep profile data centralized where practical. For standalone HTML load [shared editing/export](references/html-editing-export.md); preserve existing project behavior when editing.

Read these only when needed:
- [Section content](HOMEPAGE_SECTIONS.md) and [profile data](DATA_SCHEMA.md)
- [Motion patterns](MOTION_PATTERNS.md) and [components](COMPONENT_PATTERNS.md)
- [Cinematic style](CINEMATIC_SCROLL_TEMPLATE.md), only when selected

## Verify and deliver

Run relevant project build/checks. Inspect actual desktop and mobile rendering: hierarchy, title wrapping, project/image size, section continuity, bottom spacing, links, touch and keyboard interactions, asset loading and horizontal overflow. Use [homepage review](DESIGN_REVIEW.md). For HTML, test editing, local reload and export/reopen/re-edit. Deliver files and replacement/usage notes; state any unverified external links or dependencies.

## Focused checks for substantial changes

- Before coding, keep a lightweight homepage requirement checklist linking the original request, assets, target section/component, interaction state and acceptance evidence. Use structured template decomposition when following a reference, then verify with a desktop/mobile rendered comparison.
- A low-content homepage strategy can use a real large image, a single featured case, editorial whitespace or an asymmetric composition. Avoid meaningless cards added just to fill space.
- Verify final computed styles, desktop/mobile screenshots, assets and key interactions. Separate positioning layers from animation layers only when needed.
- PPT slide-id, page numbers, fixed 1920×1080 sizing, presentation keyboard shortcuts and bottom safe-zone rules must not be required for Homepage Mode.
