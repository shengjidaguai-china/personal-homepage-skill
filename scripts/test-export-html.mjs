#!/usr/bin/env node
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import {chromium} from 'playwright';

export async function checkExport(browser, target) {
  const qaRoot=await fs.mkdtemp(path.join(os.tmpdir(),'homepage-html-export-'));
  let context=await browser.newContext({acceptDownloads:true});
  try {
    let page=await context.newPage();
    await page.goto(pathToFileURL(target).href);
    const editable=page.locator('[data-edit-id]:visible').first();
    const id=await editable.getAttribute('data-edit-id');
    const marker=`导出往返验证 ${Date.now()}`;
    await page.keyboard.press('KeyE');
    await editable.fill(marker);
    await page.keyboard.press('Escape');
    await page.reload();
    if(await page.locator(`[data-edit-id="${id}"]`).textContent()!==marker)throw new Error('Local reload lost edit');
    const [download]=await Promise.all([page.waitForEvent('download'),page.locator('#exportHtml').click({force:true})]);
    const exportedPath=path.join(qaRoot,download.suggestedFilename());await download.saveAs(exportedPath);
    const source=await fs.readFile(exportedPath,'utf8');
    if(!source.includes(marker)||!/data-edit-version="export-[^"]+"/.test(source))throw new Error('Missing embedded edit/export version');
    await context.close();context=await browser.newContext({acceptDownloads:true});
    page=await context.newPage();await page.goto(pathToFileURL(exportedPath).href);
    const node=page.locator(`[data-edit-id="${id}"]`);
    if(await node.textContent()!==marker)throw new Error('Fresh context lost embedded edit');
    if(await page.locator('#exportHtml').count()!==1)throw new Error('Duplicate or missing export control');
    if(await page.locator('.slide').count()>1){
      await page.keyboard.press('End');
      if(await page.locator('.slide.active').getAttribute('data-slide-id')===await page.locator('.slide').first().getAttribute('data-slide-id'))throw new Error('Exported deck does not navigate');
      await page.keyboard.press('Home');
    }
    await page.keyboard.press('KeyE');await node.fill(marker+' 再编辑');await page.keyboard.press('Escape');
    const [again]=await Promise.all([page.waitForEvent('download'),page.locator('#exportHtml').click({force:true})]);
    const againPath=path.join(qaRoot,'second.html');await again.saveAs(againPath);
    if(!(await fs.readFile(againPath,'utf8')).includes(marker+' 再编辑'))throw new Error('Re-export lost second edit');
    return {target,localReload:true,freshContextExport:true,reEditAndExport:true};
  } finally {await context.close();await fs.rm(qaRoot,{recursive:true,force:true});}
}
if(process.argv[1] && path.resolve(process.argv[1])===path.resolve(import.meta.filename)){
  const targets=process.argv.slice(2).map(value=>path.resolve(value));
  if(!targets.length){console.error('Usage: test-export-html.mjs <page.html> [more.html]');process.exit(2);}
  const browser=await chromium.launch();
  try {const results=[];for(const target of targets)results.push(await checkExport(browser,target));console.log(JSON.stringify(results,null,2));}
  finally{await browser.close();}
}
