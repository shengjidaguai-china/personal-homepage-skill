import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {resolve,join} from 'node:path';
import {tmpdir} from 'node:os';
import {pathToFileURL} from 'node:url';
import {spawnSync} from 'node:child_process';
import {chromium} from 'playwright';
import {checkExport} from '../scripts/test-export-html.mjs';
const root=resolve(import.meta.dirname,'..'),scratch=await fs.mkdtemp(join(tmpdir(),'html-runtime-test-'));
const homepage=resolve(root,'templates/single-html/personal-homepage.html'),deck=resolve(root,'templates/presentation-html/presentation.html');
const browser=await chromium.launch();
let checks=0;
const eq=(actual,expected)=>{assert.equal(actual,expected);checks++;};
const wait=async(page,fn,arg)=>page.waitForFunction(fn,arg,{timeout:5000});
const active=page=>page.locator('.slide.active').getAttribute('data-slide-id');
async function popup(page){const pending=page.waitForEvent('popup');await page.locator('#presenterToggle').click({force:true});const p=await pending;await p.waitForFunction(()=>document.getElementById('status')?.textContent.includes('已连接'));return p;}
async function download(page,path){const pending=page.waitForEvent('download');await page.locator('#exportHtml').click({force:true});await(await pending).saveAs(path);}
try{
  for(const target of [homepage,deck]){await checkExport(browser,target);checks++;}
  // Bundling is idempotent and changing mode removes PPT-only helpers.
  const bundled=join(scratch,'bundled.html');
  for(let i=0;i<2;i++){
    const result=spawnSync(process.execPath,[resolve(root,'scripts/bundle-html-runtime.mjs'),'presentation',i?bundled:deck,bundled]);eq(result.status,0);
  }
  eq((await fs.readFile(bundled,'utf8')).split('id="presentation-runtime"').length-1,1);
  const context=await browser.newContext({acceptDownloads:true});
  const errors=[];context.on('page',p=>p.on('pageerror',e=>errors.push(e.message)));
  const page=await context.newPage();await page.goto(pathToFileURL(bundled).href);
  const speaker=await popup(page);eq(await speaker.locator('#counter').textContent(),'1 / 2');
  eq(await speaker.locator('#notes').textContent(),await page.locator('[data-note-for="opening"]').textContent());
  eq(await page.locator('[data-note-for]:visible').count(),0);
  await page.keyboard.press('ArrowRight');await wait(speaker,()=>document.getElementById('counter').textContent==='2 / 2');
  await speaker.locator('#prev').click();await wait(page,()=>document.querySelector('.slide.active').dataset.slideId==='opening');
  // Preview really renders at 16:9, without opening nested helpers.
  const frame=speaker.frameLocator('#preview');await frame.locator('.slide.active').waitFor();
  eq(await frame.locator('.html-tools').count(),0);
  await speaker.locator('#edit').click();await speaker.locator('#notes').fill('完整讲稿第一段。\n原稿第二段，保留顺序。');
  await speaker.locator('#notes').press('ArrowRight');eq(await active(page),'opening');
  await speaker.keyboard.press('Escape');
  await wait(page,()=>document.querySelector('[data-note-for="opening"]').textContent.includes('原稿第二段'));
  const before=await speaker.locator('#notes').evaluate(n=>getComputedStyle(n).fontSize);await speaker.locator('#larger').click();assert.notEqual(await speaker.locator('#notes').evaluate(n=>getComputedStyle(n).fontSize),before);checks++;
  await speaker.locator('#pause').click();await wait(speaker,()=>document.getElementById('timer').textContent!=='00:00');
  await speaker.locator('#pause').click();const stopped=await speaker.locator('#timer').textContent();await speaker.waitForTimeout(1100);eq(await speaker.locator('#timer').textContent(),stopped);
  await speaker.locator('#reset').click();eq(await speaker.locator('#timer').textContent(),'00:00');
  // Exported multi-page decks retain notes and both directions of presenter navigation.
  eq(await speaker.locator('#nextTitle').textContent(),await page.locator('[data-slide-id="one-idea-per-slide"]').getAttribute('data-slide-title'));
  const twoPage=join(scratch,'two-page-export.html');await download(page,twoPage);
  const fresh=await browser.newContext();const reopenedDeck=await fresh.newPage();await reopenedDeck.goto(pathToFileURL(twoPage).href);
  const exportedSpeaker=await popup(reopenedDeck);
  eq(await exportedSpeaker.locator('#notes').textContent(),'完整讲稿第一段。\n原稿第二段，保留顺序。');
  await reopenedDeck.keyboard.press('End');await wait(exportedSpeaker,()=>document.getElementById('counter').textContent==='2 / 2');
  await exportedSpeaker.locator('#prev').click();await wait(reopenedDeck,()=>document.querySelector('.slide.active').dataset.slideId==='opening');
  eq(await exportedSpeaker.locator('#counter').textContent(),'1 / 2');await fresh.close();
  // Add and reorder: stable IDs keep edits and notes attached to their original topic.
  await page.evaluate(()=>{
    const section=document.createElement('section');section.className='slide';section.dataset.slideId='case-proof';section.dataset.originalNumber='03';section.dataset.slideTitle='真实案例';
    section.innerHTML='<h2 data-edit-id="case-proof-title">真实案例</h2>';
    document.getElementById('stage').append(section);
    const note=document.createElement('aside');note.hidden=true;note.dataset.noteFor='case-proof';note.dataset.editId='case-proof-notes';note.textContent='第三段案例原稿';document.body.append(note);
    HtmlTools.refresh();DeckPlayer.go(2);
  });
  await wait(speaker,()=>document.getElementById('counter').textContent==='3 / 3');
  await page.evaluate(()=>document.getElementById('stage').prepend(document.querySelector('[data-slide-id="case-proof"]')));
  await wait(speaker,()=>document.getElementById('counter').textContent==='1 / 3');eq(await speaker.locator('#notes').textContent(),'第三段案例原稿');
  // Delete active first slide, fallback safely, merge second source note in original order.
  await page.evaluate(()=>{
    document.querySelector('[data-slide-id="case-proof"]').remove();document.querySelector('[data-note-for="case-proof"]').remove();
    const first=document.querySelector('[data-note-for="opening"]'),second=document.querySelector('[data-note-for="one-idea-per-slide"]');first.textContent+='\n'+second.textContent;second.remove();
    document.querySelector('[data-slide-id="one-idea-per-slide"]').remove();HtmlTools.save();
  });
  await wait(speaker,()=>document.getElementById('counter').textContent==='1 / 1');eq(await active(page),'opening');
  const merged=await page.locator('[data-note-for="opening"]').textContent();assert.ok(merged.indexOf('原稿第二段')<merged.indexOf('按原稿顺序'));checks++;
  await page.evaluate(()=>location.hash='removed-topic');await page.keyboard.press('End');eq(await active(page),'opening');
  // Export overwrite at same path: original local save must not replace exported markup.
  const oldKey=await page.evaluate(()=>HtmlTools.key);const exported=join(scratch,'exported.html');await download(page,exported);
  await page.evaluate(key=>localStorage.setItem(key,JSON.stringify({'opening-notes':'STALE','opening-title':'STALE'})),oldKey);
  await fs.copyFile(exported,bundled);await page.reload();
  eq(await page.locator('[data-note-for="opening"]').textContent(),merged);eq(await page.locator('.slide').count(),1);
  await speaker.close();const after=await popup(page);eq(await after.locator('#notes').textContent(),merged);
  eq(await after.locator('#counter').textContent(),'1 / 1');
  // Empty deck and deletion of the final active page never leave stale speaker content.
  await page.evaluate(()=>document.querySelector('.slide').remove());
  await wait(after,()=>document.getElementById('counter').textContent==='0 / 0');eq(await after.locator('#notes').textContent(),'');
  await after.close();await page.reload();
  // Blocked popup gives actionable fallback without placing notes on audience screen.
  await page.evaluate(()=>{window.open=()=>null;});await page.keyboard.press('KeyN');
  assert.match(await page.locator('.html-status').textContent(),/弹出窗口/);checks++;eq(await page.locator('[data-note-for]:visible').count(),0);
  await page.reload();const reopened=await popup(page);
  // Second deck/popup uses an isolated channel.
  const other=await context.newPage();await other.goto(pathToFileURL(deck).href);const otherSpeaker=await popup(other);
  await otherSpeaker.keyboard.press('End');await wait(other,()=>document.querySelector('.slide.active').dataset.slideId==='one-idea-per-slide');eq(await reopened.locator('#counter').textContent(),'1 / 1');
  await other.close();await wait(otherSpeaker,()=>document.getElementById('status').textContent.includes('已关闭'));
  eq(errors.length,0);await context.close();
  // Storage denial and malformed stored JSON don't prevent editing/export.
  for(const broken of ['denied','corrupt']){
    const c=await browser.newContext();await c.addInitScript(kind=>{
      if(kind==='denied'){Storage.prototype.getItem=Storage.prototype.setItem=()=>{throw new DOMException('Unavailable','SecurityError');};}
      else Storage.prototype.getItem=()=>'{malformed';
    },broken);
    const p=await c.newPage();await p.goto(pathToFileURL(homepage).href);await p.keyboard.press('KeyE');await p.locator('[data-edit-id]').first().fill('继续编辑');await p.keyboard.press('Escape');await download(p,join(scratch,broken+'.html'));
    assert.ok((await fs.readFile(join(scratch,broken+'.html'),'utf8')).includes('继续编辑'));checks++;
    eq(await p.locator('#presenterToggle').count(),0);eq(await p.evaluate(()=>typeof window.DeckPlayer),'undefined');await c.close();
  }
  console.log(`HTML runtime regression passed: ${checks} assertions/scenarios; editing/export, storage isolation, presenter sync, reorder/delete/merge, popup fallback and disconnection.`);
}finally{await browser.close();await fs.rm(scratch,{recursive:true,force:true});}
