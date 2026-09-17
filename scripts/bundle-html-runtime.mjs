#!/usr/bin/env node
// Idempotently inline maintained helpers; does not infer IDs or remove legacy runtimes.
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
const root = resolve(import.meta.dirname,'..');
const [mode,input,output] = process.argv.slice(2);
if (!['homepage','presentation'].includes(mode) || !input || !output) {
  console.error('Usage: bundle-html-runtime.mjs homepage|presentation input.html output.html'); process.exit(2);
}
let html = readFileSync(resolve(input),'utf8');
html = html.replace(/<!-- html-runtime:start -->[\s\S]*?<!-- html-runtime:end -->\s*/g,'');
if (!/<\/body>/i.test(html)) throw new Error('Input must contain </body>');
const read = name => readFileSync(resolve(root,'assets',name),'utf8');
const script = (id,source) => `<script id="${id}">\n${source.replace(/<\/script/gi,'<\\/script')}\n</script>`;
const parts = ['<!-- html-runtime:start -->',`<style id="html-runtime-style">${read('html-runtime.css')}</style>`,script('html-runtime',read('html-runtime.js'))];
if (mode === 'presentation') {
  parts.push(`<script type="application/json" id="presenter-document">${JSON.stringify(read('presenter.html')).replace(/</g,'\\u003c')}</script>`);
  parts.push(script('presentation-runtime',read('presentation-runtime.js')));
}
parts.push('<!-- html-runtime:end -->');
html = html.replace(/<\/body>/i, parts.join('\n')+'\n</body>');
writeFileSync(resolve(output),html);
console.log(`Bundled ${mode}: ${resolve(output)}`);
