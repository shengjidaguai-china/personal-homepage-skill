# Component Patterns

Use this file only for homepage implementation-level component ideas. PPT layout is maintained in PRESENTATION_WORKFLOW.md. Components must serve personal identity and content, not generic landing-page decoration.

## Global Visual Component Rules

- Visual previews should look like real homepage sections, not option cards or internal planning artifacts.
- Do not place option labels, pros/risks, workflow notes, or template names inside the visual composition.
- Every selected style needs a component grammar: repeated spacing rhythm, typography roles, CTA treatment, card shape, border logic, and background vocabulary.
- Use a Continuous Page Shell for multi-section homepages: define one page-level background system, connect sections with gradients, waves, masks, overlap, sticky media, or shared texture, and avoid hard section seam / background block breakpoints unless the reference intentionally uses them.
- If a portrait, logo, QR code, or project screenshot is weak or missing, use a wordmark, nickname mark, abstract identity symbol, modal QR placeholder, or high-quality mockup placeholder instead of forcing a poor asset into the hero.
- Keep social/platform CTAs visually obvious and easy to click on mobile.

## 0. Cinematic Scroll Shell

Use this when [CINEMATIC_SCROLL_TEMPLATE.md](CINEMATIC_SCROLL_TEMPLATE.md) is selected or the user provides a WISA-style dark cinematic reference.

Core components:

```text
LoadingScreen
FixedVideoBackground / CinematicBackgroundFallback
MotionHeader
FlyUpNavItem
TwoPartCTAButton
ScrollRevealStatement
ThreeColumnProofGrid
GlassFooter
QrModal
```

Rules:

- Preserve the reference's sparse rhythm: hero, statement, supporting grid, glass footer.
- Keep navigation, CTA, and footer glassmorphism precise; do not apply glass to every card.
- Use two-part CTA buttons when the reference calls for premium button interactions.
- Use QR modal only for platform entries that need it, such as 小红书、公众号、视频号.
- Do not replace this shell with generic bento grids, dashboard panels, terminal blocks, or random floating cards.

## 1. Navigation

### Pattern

Sticky or floating nav with section anchors.

### Requirements

- compact on mobile
- visible focus state
- active section optional
- CTA link optional

### Avoid

- oversized SaaS navbar
- many irrelevant links

## 2. Hero Layouts

### 2.1 3D Floating Avatar Hero

Use a visual object or avatar-like symbol floating beside text. If no avatar exists, use abstract geometric identity.

Implementation options:

- CSS 3D cards
- React Three Fiber lightweight geometry
- layered div shapes

Fallback:

- static identity card on mobile

### 2.2 Terminal Identity Hero

Use a terminal panel to reveal identity and projects.

Example content:

```text
> whoami
AI engineer building Agentic Search and Coding Agent demos
> projects --active
Search Agent / SlidePage / BossHunter
```

Rules:

- keep essential info visible without waiting for typing
- do not make the entire page terminal-only

### 2.3 Magazine Cover Hero

Use editorial composition, large name, tags, issue-like metadata, and image/abstract poster.

Rules:

- asymmetric layout
- strong typography
- avoid fake magazine labels unless stylistically clear

### 2.4 AI System Hero

Show the person as the center of an AI workflow.

Nodes may include:

```text
Research
Product
Frontend
Agent Design
Verifier
Projects
Content
```

Rules:

- keep the person at the center
- avoid making it look like a SaaS product dashboard

## 3. Animated Background

### Pattern

A decorative component behind Hero:

- grid
- gradient mesh
- noise
- particles
- glow layers

### Requirements

- `aria-hidden="true"`
- `pointer-events: none`
- readable text overlay
- reduced-motion support

## 4. Project Cards

### Required data

- title
- summary
- problem
- role
- features
- stack
- result
- link
- image placeholder

### Card variations

Use at least 2 variations in a project grid:

- featured large card
- compact side card
- code + preview split card
- timeline card
- 3D tilt card

### Avoid

- identical equal-size cards
- vague summaries
- fake screenshots

## 5. Skill Cards

### Pattern

Capability-first card.

Fields:

```text
category
capability
description
related output
tools
```

### Visual options

- grouped columns
- radial skill map
- bento capabilities
- terminal command list

## 6. Timeline

### Pattern

Milestones instead of resume table.

Fields:

```text
year / period
title
context
owned work
result
```

### Visual options

- vertical line
- horizontal scroll milestones
- log stream
- editorial date blocks

## 7. Content Cards

### Pattern

Cards for articles, videos, notes, podcasts, repos.

Fields:

```text
title
platform
topic
description
link
metric or placeholder
```

### Avoid

- fake metrics
- broken platform labels

## 8. Contact CTA

### Pattern

Strong final block that makes next action obvious.

Variants:

- email-first card
- project collaboration CTA
- resume download CTA
- booking CTA
- follow channels CTA

### Requirements

- at least one primary CTA
- clear fallback contact method
- social links visible

## 9. 3D Canvas Wrapper

### Pattern

A wrapper around React Three Fiber or canvas effects.

Requirements:

- lazy load if possible
- fallback markup
- mobile disable option
- reduced-motion disable option
- no heavy external models by default

## 10. Theme Switcher

Optional. Use only if requested or easy to include without complexity.

Requirements:

- CSS variables
- persistent preference optional
- no broken contrast in either mode

## 11. Profile Data Provider

All personal content should come from one profile object.

Do not hard-code user content deep in components.

See [DATA_SCHEMA.md](DATA_SCHEMA.md).
