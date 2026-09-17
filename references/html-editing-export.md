# Shared HTML editing and export

For both standalone homepage and PPT outputs, unless the user opts out. The maintained implementation is [html-runtime.js](../assets/html-runtime.js) with [html-runtime.css](../assets/html-runtime.css). Layout and slide behavior are outside this runtime.

## Reuse

The two HTML starters already embed the runtime. For a new static HTML file, mark editable text with explicit semantic IDs, remove any old editor/export handlers to avoid duplicate listeners, then inline the helpers:

```bash
"$NODE_BIN" "$SKILL_DIR/scripts/bundle-html-runtime.mjs" homepage input.html output.html
# Or, for a fixed-stage deck:
"$NODE_BIN" "$SKILL_DIR/scripts/bundle-html-runtime.mjs" presentation input.html output.html
```

Set `NODE_BIN` to an executable Node path and `SKILL_DIR` to this installed Skill. The bundler replaces only its marked block, so it can be rerun after helper changes. It does not remove unrelated scripts, infer IDs or convert a homepage into a deck. Inspect legacy behavior before migration; for a small edit, retaining a working legacy runtime may be safer.

`presentation` additionally embeds the [PPT runtime](../assets/presentation-runtime.js) and [presenter document](../assets/presenter.html). Homepage bundles never include them.

## Markup and storage contract

```html
<html data-edit-key="my-profile-edits" data-export-name="我的主页">
<h1 data-edit-id="hero-title">真实标题</h1>
<p data-edit-id="project-search-result">真实结果</p>
```

Every editable node has a unique stable semantic ID. Avoid nested editable nodes, IDs derived from current DOM order, and editing controls whose labels are used as program logic. Slides use topic-based IDs such as `case-search-title`; reordering slides does not change them. For legacy nodes, assign IDs once before loading saved edits and persist them in the source; preserve existing valid IDs and storage key prefixes.

Edits are an object keyed by IDs, stored under `data-edit-key + ':' + location.pathname`, with an export version suffix when present. Existing unversioned object storage remains readable. Corrupt/unavailable storage is tolerated; failed saves prompt HTML export. Renaming a source path creates a separate local save namespace.

The top-left area reveals **编辑** and **导出 HTML**. Keyboard focus and touch also expose controls. E toggles editing outside text/form inputs, Escape exits, and Cmd/Ctrl+S saves. Text input autosaves. Image slots are not text-editable: replace actual assets in source or preserve an existing asset editor.

For dynamically replaced content, call `HtmlTools.save()` before removing nodes, then `HtmlTools.refresh({restore:true})` after re-rendering. Removed IDs remain in the local store for filtered items but never apply to other IDs. Structural changes are persisted by source edits or HTML export, not by the text-only local store. Avoid resurrecting a deliberately deleted semantic ID for unrelated content.

## Export behavior and scope

Export serializes the current DOM, CSS and JavaScript. It removes generated editor controls/editing state, preserves semantic IDs and notes, and assigns a unique `data-edit-version` so stale edits cannot overwrite exported markup—even when replacing the source at the same path. Opening the export recreates controls and permits editing and re-export. PPT adds its own slide reset using the `html:before-export` event.

The exporter packages HTML, not external assets. For a truly single-file offline deliverable, embed images, fonts and other required assets before delivery. For larger videos/media, ship the containing folder and keep relative paths intact. An exported file moved away from those assets needs that folder structure too. The static starters do not require external fonts.

This is a static-DOM helper. In React or another framework that re-renders/hydrates the page, DOM edits can be overwritten; adapt state/data serialization or export a tested static snapshot. Do not automatically inject this runtime into framework templates or the existing Hero portable build.

## Acceptance

Use [test-export-html.mjs](../scripts/test-export-html.mjs) for edit → save → export → fresh-context reopen → edit again → re-export. Check local reload, version isolation at the same path, no duplicate toolbar, and any target-specific interactions. For runtime development, run `npm run test:html-runtime`; it additionally covers slide reorder/delete/merge, notes and two-window synchronization.

Neither browser local saving nor exporting removes speaker notes from the file. For a notes-free public handout, explicitly remove notes and presenter data in a separate requested copy.
