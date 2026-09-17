/* PPT-only runtime; shared HtmlTools must be initialized first. */
(() => {
  'use strict';
  const tools = window.HtmlTools, stage = document.getElementById('stage'), shell = document.getElementById('stageShell');
  if (!tools || !stage || !shell || window.DeckPlayer) return;
  const slides = () => [...stage.querySelectorAll('.slide')];
  let index = 0, activeId = null, presenter = null;
  const channel = 'html-presenter-' + Math.random().toString(36).slice(2);
  const button = document.createElement('button'); button.id = 'presenterToggle'; button.textContent = '演讲者模式';
  tools.toolbar.append(button);
  const noteFor = id => [...document.querySelectorAll('[data-note-for]')].find(n => n.dataset.noteFor === id);
  const titleFor = slide => slide?.querySelector('h1,h2')?.textContent || slide?.dataset.slideTitle || '';
  const countText = (n, total) => String(n).padStart(2,'0') + ' / ' + String(total).padStart(2,'0');
  function syncPresenter() {
    if (!presenter || presenter.closed) return;
    const list = slides(), slide = list[index];
    const preview = slide?.cloneNode(true);
    preview?.querySelectorAll('[contenteditable]').forEach(n => n.contentEditable = 'false');
    preview?.querySelectorAll('script,iframe,object,embed').forEach(n => n.remove());
    const css = [...document.querySelectorAll('style')].map(n => n.textContent).join('\n');
    presenter.postMessage({channel, type:'state', id:slide?.dataset.slideId || null, index:slide ? index : -1, total:list.length,
      title:titleFor(slide), nextTitle:titleFor(list[index+1]), notes:noteFor(slide?.dataset.slideId)?.textContent || '',
      html:preview?.outerHTML || '', css, base:document.baseURI}, '*');
  }
  function go(next, hash = true) {
    const list = slides();
    index = Math.max(0, Math.min(list.length - 1, next)); activeId = list[index]?.dataset.slideId || null;
    list.forEach((s, i) => {
      s.classList.toggle('active', i === index); s.setAttribute('aria-hidden', String(i !== index));
      s.inert = i !== index;
      s.querySelectorAll('.page-number').forEach(n => n.textContent = countText(i+1,list.length));
    });
    const counter = document.getElementById('counter'); if (counter) counter.textContent = countText(list.length ? index+1 : 0,list.length);
    if (hash && activeId) history.replaceState(null, '', '#' + encodeURIComponent(activeId));
    syncPresenter();
  }
  function refresh() {
    const found = slides().findIndex(s => s.dataset.slideId === activeId);
    tools.refresh(); go(found >= 0 ? found : index);
  }
  function fromHash() {
    let hash; try { hash = decodeURIComponent(location.hash.slice(1)); } catch {hash = '';}
    const found = slides().findIndex(s => s.dataset.slideId === hash), legacy = hash.match(/^slide-(\d+)$/);
    go(found >= 0 ? found : legacy ? Number(legacy[1])-1 : index, false);
  }
  function resize() { stage.style.setProperty('--scale', String(shell.getBoundingClientRect().width / 1920)); }
  function openPresenter() {
    if (presenter && !presenter.closed) {presenter.focus(); syncPresenter(); return;}
    presenter = window.open('', channel, 'popup=yes,width=1280,height=860,resizable=yes,scrollbars=yes');
    if (!presenter) {tools.notify('演讲者窗口被拦截。请允许本页弹出窗口，再点击演讲者模式或按 N。');return;}
    // The presenter template is bundled as inert JSON, with no personal content.
    const source = JSON.parse(document.getElementById('presenter-document').textContent);
    presenter.document.open(); presenter.document.write(source); presenter.document.close();
    presenter.focus();
  }
  window.addEventListener('message', event => {
    if (!presenter || event.source !== presenter || event.data?.channel !== channel) return;
    const d = event.data;
    if (d.type === 'ready') syncPresenter();
    if (d.type === 'navigate') {
      if (d.edge === 'first') go(0); else if (d.edge === 'last') go(slides().length-1);
      else if (d.delta === 1 || d.delta === -1) go(index+d.delta);
    }
    if (d.type === 'notes-edit' && typeof d.text === 'string' && slides().some(s => s.dataset.slideId === d.id)) {
      const n = noteFor(d.id); if (n) {n.textContent = d.text; tools.save();}
    }
  });
  button.onclick = openPresenter;
  document.addEventListener('keydown', e => {
    if (e.defaultPrevented || tools.isTyping(e.target) || e.metaKey || e.ctrlKey || e.altKey) return;
    if (['ArrowRight','ArrowDown',' ','PageDown'].includes(e.key)) {e.preventDefault();go(index+1);}
    if (['ArrowLeft','ArrowUp','PageUp'].includes(e.key)) {e.preventDefault();go(index-1);}
    if (e.key === 'Home') {e.preventDefault();go(0);}
    if (e.key === 'End') {e.preventDefault();go(slides().length-1);}
    if (e.key.toLowerCase() === 'n') {e.preventDefault();openPresenter();}
    if (e.key.toLowerCase() === 'f') {
      e.preventDefault();
      const action = document.fullscreenElement ? document.exitFullscreen?.() : document.documentElement.requestFullscreen?.();
      action?.catch(() => tools.notify('浏览器未允许全屏，可使用浏览器全屏菜单。'));
    }
  });
  let touch;
  stage.addEventListener('touchstart', e => {touch = tools.isTyping(e.target) ? null : e.changedTouches[0];}, {passive:true});
  stage.addEventListener('touchend', e => {if (!touch) return; const t = e.changedTouches[0], dx = t.clientX-touch.clientX, dy = t.clientY-touch.clientY; if (Math.abs(dx)>50 && Math.abs(dx)>Math.abs(dy)) go(index+(dx<0?1:-1)); touch=null;}, {passive:true});
  document.addEventListener('html:change', () => {
    slides().forEach(s => s.dataset.slideTitle = titleFor(s)); syncPresenter();
  });
  document.addEventListener('html:before-export', e => {
    e.detail.clone.querySelectorAll('.slide-dots').forEach(n => n.replaceChildren());
    const list = [...e.detail.clone.querySelectorAll('.slide')];
    list.forEach((s,i) => {s.classList.toggle('active',i===0);s.setAttribute('aria-hidden',String(i!==0));s.inert=i!==0;});
    const counter = e.detail.clone.querySelector('#counter'); if (counter) counter.textContent = countText(list.length?1:0,list.length);
  });
  new MutationObserver(records => {
    if (records.some(r => [...r.addedNodes,...r.removedNodes].some(n => n.nodeType === 1 && (n.matches('.slide') || n.querySelector('.slide'))))) refresh();
  }).observe(stage, {childList:true,subtree:true});
  addEventListener('resize',resize); addEventListener('hashchange',fromHash);
  window.DeckPlayer = {go,refresh,openPresenter,syncPresenter,get index(){return index;}};
  resize();fromHash();
})();
