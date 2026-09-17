# Motion Patterns

Use motion to clarify hierarchy, create memory, and make interaction feel polished. Never use motion just to show off.

## Global Rules

- Prefer `transform` and `opacity` animations.
- Avoid scroll hijacking.
- Keep text readable during animation.
- Disable or reduce motion under `prefers-reduced-motion`.
- Lower particle count and disable heavy 3D on mobile.
- Do not animate every element.
- Use one primary motion system per page, then add only small supporting interactions.
- Prefer fewer, better-orchestrated animations over scattered hover effects, particles, and glow.
- Include a strong first-load or first-scroll reveal when it supports the selected visual concept.

Required CSS:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    scroll-behavior: auto !important;
    transition-duration: 0.01ms !important;
  }
}
```

## 0. Cinematic Scroll Video

**Use for:** WISA-style cinematic personal brand pages, premium digital business cards, high-end creator/AI engineer homepages, and user-provided dark cinematic references.

**Effect:** a fixed full-screen video or abstract cinematic background is scrubbed by scroll progress, while sparse foreground sections reveal with editorial timing.

**Rules:**

- Use only when the user provides or accepts a suitable video/abstract background, or when an accessible fallback background is generated in CSS.
- Guard video scrubbing with `video.seeking` before assigning `currentTime` to avoid tearing and flicker.
- Add a loading screen until `canplaythrough` when using video.
- Keep foreground content sparse and readable; do not stack random neon orbs, dense bento grids, terminal panels, or dashboard widgets on top.
- Respect `prefers-reduced-motion`: stop scrubbing and show a static poster/gradient fallback.

## 1. Floating 3D Cards

**Use for:** project cards, skill cards, hero identity cards.

**Effect:** card rotates slightly on mouse movement and lifts on hover.

**Rules:**

- Keep max rotation under 10deg.
- Do not rotate body text too much.
- Disable on touch devices or reduce to simple hover lift.

## 2. Animated Gradient Mesh

**Use for:** creator brand, premium hero, AI product explorer pages.

**Effect:** slow radial/conic gradient movement behind hero.

**Rules:**

- Max 3 main colors.
- Keep movement slow.
- Add dark overlay if text contrast drops.

## 3. Particle Field

**Use for:** AI, technical, data-flow pages.

**Effect:** low-density particles or dots connected by subtle lines.

**Rules:**

- Density must be low.
- Do not flash.
- Pause or simplify on mobile.
- Canvas should be decorative with `aria-hidden="true"`.

## 4. Magnetic CTA

**Use for:** primary buttons and premium contact CTA.

**Effect:** button subtly follows cursor or glow responds to hover.

**Rules:**

- Keep movement under 8px.
- Provide visible focus state.
- Do not apply to all buttons.

## 5. Scroll Reveal

**Use for:** section entrances.

**Effect:** elements fade and move up when entering viewport.

**Rules:**

- Stagger within a section.
- Do not delay important content too long.
- Use Intersection Observer or Framer Motion viewport.

## 6. Parallax Gallery

**Use for:** designer portfolios and project galleries.

**Effect:** image layers move at different speeds.

**Rules:**

- Use locally within one section.
- Do not hijack page scroll.
- Disable on mobile if it causes jank.

## 7. Terminal Typing

**Use for:** Terminal Hacker Homepage.

**Effect:** typed commands reveal identity, stack, and projects.

**Rules:**

- Keep typed text short.
- Do not hide essential info until animation finishes.
- Provide static equivalent for reduced motion.

## 8. Orbiting Skill Nodes

**Use for:** AI System Dashboard, 3D Tech Portfolio.

**Effect:** skill labels or nodes orbit around identity/core theme.

**Rules:**

- Use 5-8 nodes max.
- Keep labels readable.
- Use CSS transforms or lightweight canvas.

## 9. Bento Hover Expansion

**Use for:** highlights, content, project grid.

**Effect:** card reveals details, border glow, or expands slightly on hover.

**Rules:**

- Do not change layout so much that nearby content jumps.
- Keep mobile click/tap behavior simple.

## 10. 3D Project Wall

**Use for:** Spatial Project Gallery.

**Effect:** project cards arranged with perspective depth.

**Rules:**

- Provide normal stacked list on mobile.
- Each project must still show name, problem, role, tech, result.
- Do not rely on 3D position to communicate content.

## 11. Dynamic Background Layers

**Use for:** high-impact hero.

Layers may include:

- grid layer
- glow layer
- noise layer
- particle layer
- gradient layer
- floating shape layer

Rules:

- Background supports content; it is not the content.
- Use `pointer-events: none` for decorative layers.
- Keep z-index stack simple.

## 12. Section Transition Bands

**Use for:** long one-page homepage.

**Effect:** diagonal band, blurred divider, or soft gradient bridge between sections.

**Rules:**

- Use sparingly.
- Avoid decorative clutter.
- Match selected style preset.

## 14. Motion Risk Matrix

| Risk | Symptom | Fix |
| --- | --- | --- |
| Motion overuse | Everything moves | Animate only hero, cards, section reveal |
| Poor readability | Text moves while reading | Stop animation after entrance |
| Mobile jank | Scroll feels heavy | Disable parallax/3D, reduce particles |
| Fake premium | Random glow balls | Use structured grid, gradients, and identity-specific motifs |
| Accessibility issue | Motion cannot be disabled | Add reduced-motion rules |
