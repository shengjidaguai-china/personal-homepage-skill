import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const source = readFileSync(resolve(root, 'src/data/templates.ts'), 'utf8');
const failures = [];

const allowedCategories = new Set(['Tech', 'Creator', 'Business', 'Art']);
const allowedVisuals = new Set([
  'cinematic', 'heroNeural', 'softProduct', 'orbisNft', 'toonhub', 'clean', 'tech3d', 'gradient', 'magazine', 'terminal', 'resume',
  'pixel', 'dashboard', 'bento', 'darkEditorial', 'spatial', 'business', 'caseStudy', 'museum',
]);

const entries = [...source.matchAll(/\{\n\s+id: '([^']+)',[\s\S]*?\n\s+\}/g)].map((match) => ({ id: match[1], block: match[0] }));

if (!entries.length) failures.push('No template entries found in src/data/templates.ts');

const ids = new Set();
for (const entry of entries) {
  if (ids.has(entry.id)) failures.push(`Duplicate template id: ${entry.id}`);
  ids.add(entry.id);

  const category = entry.block.match(/category: '([^']+)'/)?.[1];
  if (!allowedCategories.has(category)) failures.push(`${entry.id} has invalid category: ${category}`);

  const visual = entry.block.match(/visual: '([^']+)'/)?.[1];
  if (!allowedVisuals.has(visual)) failures.push(`${entry.id} has invalid visual: ${visual}`);

  const requiredPatterns = [
    [/identityFits:\s*\[[^\]]+\]/, 'identityFits'],
    [/densityModes:\s*\[[^\]]+\]/, 'densityModes'],
    [/layoutGrammar:\s*'[^']+'/, 'layoutGrammar'],
    [/typography:\s*\{[\s\S]*?cjk:\s*'[^']+'[\s\S]*?\}/, 'typography.cjk'],
    [/palette:\s*\{[\s\S]*?accent:\s*'#[0-9a-fA-F]{3,8}'[\s\S]*?\}/, 'palette.accent'],
    [/heroPattern:\s*'[^']+'/, 'heroPattern'],
    [/sectionPlan:\s*\[[^\]]+\]/, 'sectionPlan'],
    [/motionPlan:\s*\[[^\]]+\]/, 'motionPlan'],
    [/imagePolicy:\s*'[^']+'/, 'imagePolicy'],
    [/generationNotes:\s*\[[^\]]+\]/, 'generationNotes'],
    [/risks:\s*\[[^\]]+\]/, 'risks'],
  ];

  for (const [pattern, label] of requiredPatterns) {
    if (!pattern.test(entry.block)) failures.push(`${entry.id} missing ${label}`);
  }
}

if (entries.length < 18) failures.push(`Expected at least 18 templates, found ${entries.length}`);

const catalog = JSON.parse(readFileSync(resolve(root,'assets/template-index.json'),'utf8'));
const catalogIds = new Set();
for (const entry of catalog) {
  if (catalogIds.has(entry.id)) failures.push(`Duplicate catalog ID: ${entry.id}`);
  catalogIds.add(entry.id);
  if (!entry.keywordsZh?.length) failures.push(`${entry.id}: missing Chinese search terms`);
  for (const field of ['preview','implementation','usage']) {
    if (entry[field] && !existsSync(resolve(root,entry[field]))) failures.push(`${entry.id}: missing ${field} ${entry[field]}`);
  }
  if (entry.kind === 'style-preview') {
    const definition=entries.find(e=>e.id===entry.id);
    if (!definition || !definition.block.includes(`name: '${entry.name}'`)) failures.push(`${entry.id}: catalog/registry name mismatch`);
    const impl=readFileSync(resolve(root,entry.implementation),'utf8');
    if (!impl.includes(`${entry.visual}: ${entry.export}`)) failures.push(`${entry.id}: missing preview mapping`);
  }
}
for (const entry of entries) if (!catalogIds.has(entry.id)) failures.push(`Unindexed style: ${entry.id}`);

if (failures.length) {
  console.error('Template registry check failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`Template registry check passed: ${entries.length} templates include generation metadata, CJK typography, image policy, and risks.`);
