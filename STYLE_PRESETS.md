# Style Presets

Use this file to choose a visual direction based on user identity, goal, content, and risk level. Do not force all users into one style.

## Selection

Use the [maintained template index](references/template-selection.md) to find names, Chinese search terms, actual previews and implementation paths. Inspect candidates before choosing. Follow the user's explicit template; otherwise consider audience, assets, tone and content. Identity tags are search aids, not automatic rankings. AI does not default to a dark terminal; premium can be light, colorful or restrained. Cute Pixel Creator is one available style, not the default.

The descriptions below describe visual vocabulary. Homepage hero/section/motion suggestions apply to homepages; for PPT translate the vocabulary into fixed slides using the presentation workflow.

## 0. Cinematic Scroll Personal Brand

**Best for:** AI engineers, AI creators, founders, consultants, high-end personal brands, and users who provide premium landing-page references such as WISA.

**Vibe:** dark, cinematic, minimal, expensive, editorial, restrained.

**Color:** pure black or near-black base, white primary text, translucent white secondary text, very limited accent color.

**Typography:** Manrope or refined geometric sans for large headlines, JetBrains Mono or similar mono for nav labels, metadata, and buttons.

**Hero:** fixed full-screen video or cinematic abstract background, 90% width container, 12-column grid, name and positioning anchored bottom-left, concise intro top/right, glass CTA bottom-right.

**Sections:** scroll-reveal statement, 3-column proof/link grid, glassmorphism footer as the main platform/project entry hub.

**Motion:** scroll-driven video scrub, word-by-word reveal, header slide-out, nav text fly-up, CTA arrow fly-out/fly-in, subtle viewport reveals.

**Risks:** can become too empty if content is weak. Keep copy sharp, links obvious, and footer useful.

**Hard rule:** if the user provides a concrete cinematic template or says to strictly follow a reference, use this preset and preserve the reference structure. Do not propose alternative visual directions first.

See [CINEMATIC_SCROLL_TEMPLATE.md](CINEMATIC_SCROLL_TEMPLATE.md).

## 0B. Soft Product Video Hero

**Best for:** users who provide polished SaaS/product hero references, personal product creators, AI tool builders, and link-hub pages that need a soft premium product feel without looking like a resume.

**Vibe:** soft, clean, premium, product-led, friendly, secure, high-clarity.

**Color:** warm neutral or muted video background, dark blue-gray text, one strong violet/brand CTA accent, light pill login surfaces.

**Typography:** bold characterful display heading paired with Inter-like readable body. Icons can be embedded inline in headlines when they reinforce the concept.

**Hero:** full-viewport looping background video, minimal centered headline, inline semantic icons, concise subtext, strong pill CTA, and a simple floating nav with primary/secondary account actions.

**Sections:** use sparingly; this style works best as a landing hero, digital card, product entry page, or compact personal tool intro.

**Motion:** Framer Motion fade-up system, subtle button scale/brightness, mobile sheet slide-in, backdrop blur, and staggered mobile nav links.

**Risks:** can become generic SaaS. Keep the person/product identity specific, avoid adding many sections, and preserve the soft video atmosphere.

**Reference pattern:** password-manager landing hero with Helvetica Now Display Bold, Inter, full-screen video, geometric SVG logo, pill nav CTAs, inline Lucide headline icons, and mobile slide-in sheet.

## 0C. TOONHUB Figurine Carousel

**Best for:** playful creators, toy / IP artists, character designers, product makers, visual storytellers, and users who provide a saturated character-figurine carousel reference.

**Vibe:** bold, playful, collectible, toy-store premium, kinetic, pop-cultural, tactile.

**Color:** one saturated background per character or project, with a lighter panel color behind the subject. Palette transitions should feel decisive and candy-like, not generic gradients.

**Typography:** Anton-style condensed display type for giant ghost words and brand marks, paired with Inter-like readable body text.

**Hero:** full-viewport character carousel, oversized ghost display text such as `3D SHAPE`, center figurine, left/right/back supporting figurines, grain overlay, brand label, bottom-left copy, prev/next buttons, and a bottom-right discovery CTA.

**Sections:** best used as a hero-first page. Follow-up sections can map each character/project to story, process, product drop, gallery, or contact / order CTA.

**Motion:** locked prev/next carousel with role-based image transforms, 650ms transition discipline, background and panel color transitions, subtle center floating, and `prefers-reduced-motion` fallback.

**Risks:** image quality drives the result. Use user-provided or clearly authorized character/figurine images; do not invent inaccessible Figma image URLs. Avoid using it for serious résumé pages unless the user explicitly wants a playful collectible identity.

**Reference pattern:** TOONHUB character-figurine carousel: React + TypeScript + Vite + Tailwind, lucide-react arrows, Anton + Inter, saturated background states, SVG fractalNoise grain, role-derived carousel positions, and exact 650ms navigation lock.

## 0D. Clean Developer Homepage

**Best for:** frontend developers, indie hackers, open-source authors, technical bloggers, photographers-with-code, and users who provide passer-by.com-style clean personal homepage references.

**Vibe:** clean, friendly, light, developer-first, calm, approachable, real personal website rather than product landing page.

**Color:** off-white or very pale blue base, soft blue section wash, charcoal/gray text, one decisive blue CTA accent, light gray borders.

**Typography:** readable sans with optional handwritten/logo accent. Avoid over-stylizing; hierarchy comes from spacing, weight, and concise labels.

**Hero:** compact top navigation, small personal logo/wordmark, centered intro copy, highlighted role keyword, avatar or sketch portrait card on one side, location pill, two CTAs such as contact and projects, and a soft wave/gradient transition into the next section.

**Sections:** About split with visual block + concise summary, GitHub/open-source CTA band, project grid with simple hover overlays, writing / photography / message links, clean footer.

**Motion:** gentle fade-up, hover overlay on project cards, subtle background/wave movement. No heavy 3D, no scattered particles.

**Risks:** can look too plain if typography and spacing are weak. Use a continuous page shell, soft transitions, and a strong project grid so it feels like a real homepage, not stacked blocks.

**Reference pattern:** Passer-by developer homepage: light personal developer site with logo nav, centered identity hero, sketch/avatar visual, location pill, wave divider, About module, GitHub CTA, and project cards.

## 0E. Orbis NFT Space Landing

**Best for:** creator NFT drops, collectible/IP projects, digital object portfolios, artist project launches, and users who explicitly provide the `Orbis.Nft` dark space landing prompt.

**Vibe:** dark space, cinematic, collectible, liquid glass, high-contrast, poster-like.

**Color:** `#010828` deep navy base, `#EFF4FF` cream text, `#6FFF00` neon script accents, with one restrained purple gradient only for collection card action buttons.

**Typography:** Anton for headings, logo, navigation, and CTA display text; Condiment for cursive accent overlays; system monospace for uppercase descriptions, labels, and rarity metadata.

**Hero:** full-viewport video with clipped rounded bottom corners, centered max-width container, liquid-glass nav, oversized Anton uppercase title, neon Condiment `Nft collection` accent, and separate desktop/mobile social icon placement.

**Sections:** four-part landing sequence: video hero, video intro/about, solid-navy collection grid with video cards, and final video CTA.

**Motion:** looping muted videos, hover glass states, subtle social button transitions, optional reveal animations that respect `prefers-reduced-motion`.

**Risks:** this is not a default personal resume style. Use only for user-provided or authorized project/collectible references, and do not invent rarity scores, blockchain claims, social links, texture assets, or video URLs.

**Reference pattern:** `templates/orbis-nft/README.md` records the full prompt template, including CloudFront video slots, liquid-glass CSS, texture overlay, responsive sizing, and adaptation rules.

## 1. 3D Tech Portfolio

**Best for:** AI engineers, frontend engineers, indie developers, open-source authors, Coding Agent researchers.

**Vibe:** dark, technical, spatial, precise, premium.

**Color:** black / charcoal base, cyan-green or orange accent, subtle grid lines.

**Typography:** geometric sans + mono accents. Avoid a default system-font-only look.

**Hero:** floating avatar, 3D geometry, code window, node graph, data stream, or project cards orbiting the identity.

**Sections:** bento highlights, capability-based skills, 3D project cards, technical timeline.

**Motion:** slow background grid drift, card tilt, scroll reveal, small data pulses.

**Risks:** can become unreadable or too cyberpunk. Keep contrast high and motion calm.

## 2. Motion Gradient Brand

**Best for:** creators, AI product explorers, founders, personal brand pages.

**Vibe:** bold, fluid, high-impact, premium, human.

**Color:** 2-3 strong colors, radial/conic gradient mesh, dark or light base.

**Typography:** large confident display type, clean readable body.

**Hero:** big statement, animated gradient layers, floating content cards, strong CTAs.

**Sections:** content cards, social proof, project/story cards, contact CTA.

**Motion:** slow gradient mesh, staggered cards, magnetic CTA, parallax accents.

**Risks:** easy to look like generic AI gradient. Use restrained palette and identity-specific motifs.

## 3. Magazine Portfolio

**Best for:** designers, artists, visual creators, content creators.

**Vibe:** editorial, curated, expressive, image-led.

**Color:** cream/black, low-saturation palettes, one sharp accent.

**Typography:** editorial serif display + elegant sans body.

**Hero:** magazine cover layout with name, role, issue-like tags, large image or abstract poster.

**Sections:** gallery wall, case study spreads, horizontal project scroll, pull quotes.

**Motion:** staggered text reveal, image mask reveal, gentle horizontal gallery.

**Risks:** can become decorative without content. Keep projects and case studies prominent.

## 4. Terminal Hacker Homepage

**Best for:** programmers, security researchers, open-source authors, Coding Agent builders.

**Vibe:** command-line, precise, hacker, credible.

**Color:** near-black, terminal green/cyan, muted amber, gray borders.

**Typography:** mono for UI, readable sans for body if needed.

**Hero:** terminal identity panel running commands like `whoami`, `projects --active`, `stack --focus`.

**Sections:** system-status highlights, repo-like project cards, logs timeline, docs/content list.

**Motion:** typing animation, cursor blink, log stream, hover scanlines.

**Risks:** novelty can hurt readability. Do not make every section a terminal.

## 5. Minimal Premium Resume

**Best for:** job seekers, students, interns, consultants, business pages.

**Vibe:** restrained, credible, clear, premium.

**Color:** white/ivory background, charcoal text, gray borders, one accent.

**Typography:** refined serif or professional sans, strong hierarchy.

**Hero:** name, role, concise value proposition, resume/download CTA, contact CTA.

**Sections:** case-study projects, skill groups, education/experience timeline, contact.

**Motion:** subtle reveal, hover lift, no heavy 3D by default.

**Risks:** can become boring. Add one refined visual memory point, not random decoration.

## 6. Cute Pixel Creator

**Best for:** young creators, illustrators, playful brands, light personal pages.

**Vibe:** cute, pixel, sticker-like, game UI, warm.

**Color:** low-saturation pastel, pixel accent colors, soft dark text.

**Typography:** readable rounded sans + pixel accent font for small labels.

**Hero:** pixel avatar or sticker cluster, content cards, playful status tags.

**Sections:** content wall, small quests/achievements, creator links, project stickers.

**Motion:** tiny bounce, sprite hover, gentle floating.

**Risks:** can become childish. Keep layout clean and copy mature.

## 7. AI System Dashboard

**Best for:** AI engineers, AI product managers, LLM researchers, Agent builders.

**Vibe:** system map, model interface, data/control plane.

**Color:** deep navy/black, electric cyan, violet only as minor accent, signal green.

**Typography:** technical sans + mono metrics.

**Hero:** identity as AI system diagram: inputs, tools, verifier, projects, outputs.

**Sections:** capability graph, agent pipeline projects, research notes, demo links.

**Motion:** node pulses, edge flow, background grid, orbiting skill nodes.

**Risks:** can look like SaaS dashboard. Keep person at the center, not product metrics.

## 8. Creator Bento Homepage

**Best for:** self-media creators, writers, video creators, podcasters, account operators.

**Vibe:** modular, social, energetic, content-first.

**Color:** strong personal brand color + neutral base.

**Typography:** friendly bold display, readable body.

**Hero:** personal identity with content themes, platform cards, featured content preview.

**Sections:** bento highlights, content cards, platform links, collaboration CTA.

**Motion:** card fly-in, hover expansion, content preview carousel.

**Risks:** bento can become generic. Make each block carry different information.

## 9. Dark Editorial Portfolio

**Best for:** premium portfolios, designers, creative technologists, art-school applications.

**Vibe:** gallery, dark magazine, cinematic, restrained.

**Color:** black, warm gray, muted gold/cream accent.

**Typography:** elegant serif headlines, narrow sans labels.

**Hero:** full-bleed editorial composition, oversized name, minimal navigation.

**Sections:** project spreads, case-study cards, large pull quotes, image-led gallery.

**Motion:** mask reveals, slow fade, parallax image depth.

**Risks:** dark pages can reduce readability. Keep text contrast and spacing high.

## 10. Art Museum Portfolio

**Best for:** artists, photographers, fine-art creators, curators, museum-like portfolios, and users who provide Google Arts & Culture as a reference.

**Vibe:** museum curation, refined discovery, quiet prestige, artwork-first, editorial education.

**Color:** museum paper, warm white, ink black, soft stone gray, restrained terracotta or gallery-red accents.

**Typography:** refined serif display for names and exhibition titles, precise sans or mono labels for collection metadata.

**Hero:** search/discovery entry, featured artwork or photo wall, curator statement, topic chips such as Works, Series, Exhibitions, Studio, Contact.

**Sections:** artwork wall, virtual gallery, story cards, collection themes, artist statement, exhibition timeline, contact/inquiry.

**Motion:** slow artwork reveal, gallery wall parallax, card expansion, horizontal exhibition stroll, gentle zoom into details.

**Risks:** can look like a copied museum website. Use it as a high-level curation pattern only; never copy Google Arts & Culture assets, text, collections, or exact page structure.

**Reference pattern:** Google Arts & Culture-style discovery and curation experience: search-first exploration, topic navigation, story cards, artwork grids, virtual gallery modules, and educational collection browsing.

## 11. Spatial Project Gallery

**Best for:** portfolio-heavy users with several projects or demos.

**Vibe:** 3D gallery, project wall, spatial navigation.

**Color:** depends on identity; usually dark neutral with bright project accents.

**Typography:** strong display labels, compact project metadata.

**Hero:** project cards floating around identity or stacked in depth.

**Sections:** interactive project wall, case-study expansion, timeline.

**Motion:** CSS 3D transforms, hover depth, scroll-based project movement.

**Risks:** can hide content. Always keep project text readable and accessible.

## 12. Business Personal Brand

**Best for:** founders, consultants, freelancers, service providers.

**Vibe:** premium, credible, conversion-oriented.

**Color:** ivory/black/navy, muted accent, strong CTA color.

**Typography:** executive serif or confident sans.

**Hero:** problem solved, personal credibility, service CTA, proof cards.

**Sections:** problems solved, services, case outcomes, testimonials, booking CTA.

**Motion:** subtle reveal, trust-building micro-interactions, no distracting 3D.

**Risks:** can become generic consultancy site. Keep personal story and proof visible.

## 13. Case Study Portfolio

**Best for:** job seekers, product designers, developers, PMs with projects.

**Vibe:** structured, evidence-based, clear.

**Color:** neutral base, role-specific accent.

**Typography:** clean hierarchy, easy scanning.

**Hero:** focused role and proof, not overdesigned.

**Sections:** case-study project cards, role/responsibility/result, skills mapped to work.

**Motion:** scroll reveal, hover details, progress timeline.

**Risks:** can become resume table. Use visual hierarchy and project storytelling.
