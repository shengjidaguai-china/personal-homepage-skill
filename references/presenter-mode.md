# Presenter mode — PPT only

Reuse [presentation-runtime.js](../assets/presentation-runtime.js) and [presenter.html](../assets/presenter.html) through the presentation bundler. The audience document owns slide state and the note source; the separate popup shows current slide preview, next title, complete notes, note font controls, timer and navigation.

## Content and DOM contract

Keep the audience stage `#stage` inside `#stageShell`; put `.slide` elements inside the stage. Keep the `#counter` overlay outside it. Use unique `data-slide-id`, preserved `data-original-number` and current `data-slide-title` metadata. The stage must be authored at 1920×1080; use the starter's stage CSS.

Put notes outside the visible stage:

```html
<aside hidden data-note-for="case-search" data-edit-id="case-search-notes">完整讲稿，保持原文顺序。</aside>
```

Use HTML-escaped text, preserve paragraph breaks, and bind notes to semantic IDs, not slide indices. The presenter edits plain note text and the audience runtime saves it in the shared editor store. Full source language and sequence belong here when the user requests retention; summaries on slides must not replace the original script.

Current number/total and next title are computed from live slides. Runtime deletion/reordering keeps the active semantic slide where possible, otherwise clamps to the nearest valid position. `DeckPlayer.refresh()` can explicitly refresh after a structural edit. Hashes accept semantic IDs and old `slide-N` links; removed or malformed targets fall back safely.

Before merging, move the required notes in source order into the retained slide's note node. The runtime cannot decide which passages a user intended to omit. Remove obsolete note nodes only after preserving required content. Never reuse removed slide/edit IDs for unrelated text.

## Windows and sharing

Click **演讲者模式** or press N outside editable text. Repeated opens focus the existing presenter window. Navigation works in both windows; note editing isolates navigation keys. A unique per-window channel plus a `message.source` check separates decks. The popup's preview iframe is sandboxed and uses the audience file's base path for relative assets. Keep deck styling inline for export/preview; complex third-party widgets need their own validation.

If a popup is blocked, keep audience playback usable and show a retry instruction. Allow popups for this page, then click again. If the audience window closes or reloads, reopen presenter from the live audience page. The timer starts on request and is a session aid; it is not saved into exported slides.

- **Extended display:** put audience slides on the projected/shared display and the presenter on an unshared display.
- **Share a window:** select the audience window, keeping the presenter separate.
- **Share an entire screen / mirror displays:** everything visible on that screen can be captured, including the presenter. No HTML window can guarantee it will hide from full-screen capture.

Notes remain embedded in the exported HTML and are not a confidentiality boundary.

## Verify after runtime or structural changes

Test both directions of navigation; current and next title; note selection and editing; font size; timer start/pause/reset; popup blocking, close and reopen; source-window disconnection; multiple decks; and shortcuts inside editable notes. Export then reopen in a fresh browser context and repeat navigation/notes sync. Test deleted active and final slides, reordered slides, merged notes and stale hashes. Existing helper regression is `tests/html-runtime.test.mjs`; generated files still require a relevant smoke test.
