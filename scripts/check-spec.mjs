import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');

const requiredFiles = [
  'package.json',
  'references/template-selection.md',
  'references/html-editing-export.md',
  'references/presenter-mode.md',
  'assets/template-index.json',
  'assets/html-runtime.js',
  'assets/html-runtime.css',
  'assets/presentation-runtime.js',
  'assets/presenter.html',
  'scripts/bundle-html-runtime.mjs',
  'scripts/find-template.mjs',
  'tests/html-runtime.test.mjs',
  'index.html',
  'SKILL.md',
  'README.md',
  'STYLE_PRESETS.md',
  'HOMEPAGE_GENERATION_WORKFLOW.md',
  'DESIGN_REVIEW.md',
  'IMAGE_WORKFLOW.md',
  'PRESENTATION_WORKFLOW.md',
  'PPT_VISUAL_QA.md',
  'templates/orbis-nft/README.md',
  'templates/presentation-html/README.md',
  'templates/presentation-html/presentation.html',
  'scripts/capture-slides.mjs',
  'scripts/verify-html-ppt-stage.mjs',
  'src/main.tsx',
  'src/App.tsx',
  'src/index.css',
  'src/data/templates.ts',
  'src/data/profile-schema.ts',
  'src/components/GalleryHeader.tsx',
  'src/components/TemplateFilters.tsx',
  'src/components/TemplateGrid.tsx',
  'src/components/TemplateCard.tsx',
  'src/components/PreviewCanvas.tsx',
  'src/previews/tech.tsx',
  'src/previews/creator.tsx',
  'src/previews/business.tsx',
  'src/previews/art.tsx',
  'src/previews/previewData.ts',
  'assets/template-previews/orbis-nft-space-landing.svg',
  'vite.config.ts',
  'tsconfig.json',
];

const requiredTemplates = [
  'Cinematic Scroll Personal Brand',
  'Soft Product Video Hero',
  '3D Tech Portfolio',
  'Motion Gradient Brand',
  'Magazine Portfolio',
  'Terminal Hacker Homepage',
  'Minimal Premium Resume',
  'Cute Pixel Creator',
  'AI System Dashboard',
  'Creator Bento Homepage',
  'Dark Editorial Portfolio',
  'Spatial Project Gallery',
  'Business Personal Brand',
  'Case Study Portfolio',
  'Art Museum Portfolio',
  'TOONHUB Figurine Carousel',
  'Clean Developer Homepage',
  'Orbis NFT Space Landing',
];

const requiredSnippets = {
  'templates/orbis-nft/README.md': ['Orbis NFT Space Landing Prompt Template', 'liquid-glass', 'Anton', 'Condiment', 'CloudFront video slots'],
  'templates/presentation-html/presentation.html': ['--stage-w: 1920', '--stage-h: 1080', 'class="slide active"', 'data-slide-id=', 'data-original-number=', 'data-slide-title=', 'ArrowRight', 'Escape', 'requestFullscreen'],
  'scripts/capture-slides.mjs': ['qa-report.json', 'slide.dataset.slideId', 'titleBaseline', 'contentBoundingBox', 'bottomSafeZoneViolated'],
  'scripts/verify-html-ppt-stage.mjs': ['duplicate data-slide-id', 'missing or ineffective shortcuts', 'broken images', 'layout/motion transform conflict'],
  'IMAGE_WORKFLOW.md': ['Classify roles', 'Evaluate usability', 'Missing image fallback'],
  'STYLE_PRESETS.md': requiredTemplates,
  'src/index.css': [
    '@tailwind base;',
    '--gallery-bg: #0b0b0f;',
    '--gallery-ink: #f8f4ec;',
    '--museum-paper: #f7f3ea;',
    '--font-cjk-sans:',
    '--font-cjk-serif:',
    'balanced-title',
    'readable-copy',
    'safe-bottom-space',
    'focus-visible',
    'prefers-reduced-motion',
  ],
  'src/data/templates.ts': [
    'export type TemplateDefinition',
    'identityFits',
    'densityModes',
    'imagePolicy',
    'generationNotes',
    'risks',
    'typography',
  ],
  'src/App.tsx': ['GalleryHeader', 'TemplateFilters', 'TemplateGrid', 'templates.filter'],
};

const failures = [];
const fileContents = new Map();

for (const file of requiredFiles) {
  const path = resolve(root, file);
  if (!existsSync(path)) {
    failures.push(`Missing file: ${file}`);
    continue;
  }
  fileContents.set(file, readFileSync(path, 'utf8'));
}

for (const [file, snippets] of Object.entries(requiredSnippets)) {
  const content = fileContents.get(file);
  if (!content) continue;
  for (const snippet of snippets) {
    if (!content.includes(snippet)) {
      failures.push(`${file} missing snippet: ${snippet}`);
    }
  }
}

const templateRegistry = fileContents.get('src/data/templates.ts');
if (templateRegistry) {
  for (const template of requiredTemplates) {
    if (!templateRegistry.includes(template)) {
      failures.push(`src/data/templates.ts missing template: ${template}`);
    }
  }

  const templateCount = (templateRegistry.match(/id: '/g) || []).length;
  if (templateCount < requiredTemplates.length) {
    failures.push(`Expected at least ${requiredTemplates.length} template entries, found ${templateCount}`);
  }
}

for (const doc of ['SKILL.md', 'README.md', 'STYLE_PRESETS.md', 'HOMEPAGE_GENERATION_WORKFLOW.md', 'PRESENTATION_WORKFLOW.md', 'PPT_VISUAL_QA.md', 'DESIGN_REVIEW.md', 'IMAGE_WORKFLOW.md']) {
  const content = fileContents.get(doc);
  if (!content) continue;
  if (/\b(TODO|TBD|FIXME)\b/i.test(content)) {
    failures.push(`${doc} contains placeholder marker TODO/TBD/FIXME`);
  }
}

// Resolve active workflow/reference Markdown links instead of pinning prose headings.
const linkedDocs = ['SKILL.md', 'HOMEPAGE_GENERATION_WORKFLOW.md', 'PRESENTATION_WORKFLOW.md', 'PPT_VISUAL_QA.md', 'DESIGN_REVIEW.md', 'STYLE_PRESETS.md', ...readdirSync(resolve(root,'references')).filter(f=>f.endsWith('.md')).map(f=>'references/'+f), 'templates/single-html/README.md', 'templates/presentation-html/README.md'];
for (const doc of linkedDocs) {
  const content = readFileSync(resolve(root,doc),'utf8');
  for (const match of content.matchAll(/\[[^\]]*\]\(([^)]+)\)/g)) {
    const link = match[1].split('#')[0];
    if (!link || /^(https?:|mailto:)/.test(link)) continue;
    if (!existsSync(resolve(root,doc,'..',link))) failures.push(`${doc}: broken link ${link}`);
  }
}

if (failures.length) {
  console.error('Homepage gallery spec check failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('Homepage gallery spec check passed: dual homepage/presentation skill docs, source structure, CJK rules, and visual presets are present.');
