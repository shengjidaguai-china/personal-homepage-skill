import { createRequire } from 'node:module';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const target = pathToFileURL(resolve(import.meta.dirname, '../templates/single-html/personal-homepage.html')).href;
const viewports = [
  { name: 'desktop', width: 1440, height: 1000 },
  { name: 'mobile', width: 390, height: 844 },
];
const failures = [];
const browser = await chromium.launch({ headless: true });

try {
  for (const viewport of viewports) {
    const page = await browser.newPage({ viewport });
    const errors = [];
    page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
    page.on('pageerror', (error) => errors.push(error.message));
    await page.goto(target, { waitUntil: 'load' });
    await page.waitForTimeout(100);
    const state = await page.evaluate(() => ({
      hasPptStage: Boolean(document.querySelector('.stage, .stage-shell, .slide')),
      horizontalOverflow: document.documentElement.scrollWidth > innerWidth + 1,
      verticalDocument: document.documentElement.scrollHeight > innerHeight,
      brokenImages: Array.from(document.images).filter((image) => !image.complete || image.naturalWidth === 0).map((image) => image.src),
      editToggle: Boolean(document.querySelector('.edit-toggle')),
    }));
    if (state.hasPptStage) failures.push(`${viewport.name}: Homepage Mode unexpectedly contains PPT stage/slide structure`);
    if (state.horizontalOverflow) failures.push(`${viewport.name}: horizontal overflow`);
    if (!state.verticalDocument) failures.push(`${viewport.name}: expected a continuous scrolling homepage`);
    if (state.brokenImages.length) failures.push(`${viewport.name}: broken images: ${state.brokenImages.join(', ')}`);
    if (!state.editToggle) failures.push(`${viewport.name}: missing default inline edit affordance`);
    if (errors.length) failures.push(`${viewport.name}: console errors: ${errors.join(' | ')}`);

    await page.keyboard.press('KeyE');
    const editState = await page.evaluate(() => ({
      editing: document.body.classList.contains('editing'),
      editableCount: document.querySelectorAll('[contenteditable="true"]').length,
    }));
    if (!editState.editing || editState.editableCount === 0) failures.push(`${viewport.name}: E did not activate inline editing`);
    const editable = page.locator('[contenteditable="true"]').first();
    if (await editable.count()) {
      await editable.evaluate((element) => { element.innerHTML += '<span data-homepage-save-marker>saved</span>'; });
      const storageBefore = await page.evaluate(() => JSON.stringify(localStorage));
      await page.keyboard.press(process.platform === 'darwin' ? 'Meta+KeyS' : 'Control+KeyS');
      await page.waitForTimeout(30);
      const storageAfter = await page.evaluate(() => JSON.stringify(localStorage));
      if (storageBefore === storageAfter || !storageAfter.includes('data-homepage-save-marker')) failures.push(`${viewport.name}: save shortcut did not persist edited content`);
      await page.evaluate(() => document.activeElement?.blur());
      await page.keyboard.press('KeyE');
      if (await page.evaluate(() => document.body.classList.contains('editing'))) failures.push(`${viewport.name}: E did not exit inline editing`);
    }
    await page.close();
  }
} finally {
  await browser.close();
}

if (failures.length) {
  console.error('Homepage regression failed:');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log('Homepage regression passed: desktop/mobile remain continuous, responsive, asset-clean, and free of PPT stage rules.');
