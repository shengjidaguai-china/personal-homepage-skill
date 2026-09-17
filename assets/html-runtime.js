/* Shared runtime. Source of truth: assets/html-runtime.js; inline with bundle-html-runtime.mjs. */
(() => {
  'use strict';
  if (window.HtmlTools) return;
  const root = document.documentElement;
  const hotzone = document.createElement('div');
  hotzone.className = 'edit-hotzone';
  hotzone.setAttribute('aria-hidden', 'true');
  const toolbar = document.createElement('div');
  toolbar.className = 'html-tools';
  toolbar.innerHTML = '<button class="edit-toggle" aria-pressed="false">编辑</button><button id="exportHtml">导出 HTML</button>';
  const status = document.createElement('div');
  status.className = 'html-status'; status.setAttribute('role', 'status');
  for (const el of [hotzone, toolbar, status]) el.dataset.runtimeGenerated = '';
  document.body.append(hotzone, toolbar, status);
  let active = false, warningTimer;
  const key = (root.dataset.editKey || 'html-edits') + ':' + location.pathname + (root.dataset.editVersion ? ':' + root.dataset.editVersion : '');
  let saved = {};
  try { const data = JSON.parse(localStorage.getItem(key) || '{}'); if (data && typeof data === 'object' && !Array.isArray(data)) saved = data; } catch {}
  const nodes = () => [...document.querySelectorAll('[data-edit-id]')];
  function notify(text) { status.textContent = text; clearTimeout(warningTimer); warningTimer = setTimeout(() => status.textContent = '', 6000); }
  function refresh({restore = false} = {}) {
    const ids = new Set();
    for (const n of nodes()) {
      const id = n.dataset.editId;
      if (!id || ids.has(id)) { notify('编辑 ID 缺失或重复，请先修复页面中的 data-edit-id'); continue; }
      ids.add(id);
      if (restore && Object.hasOwn(saved, id) && typeof saved[id] === 'string') n.innerHTML = saved[id];
      n.contentEditable = String(active && !n.hasAttribute('data-note-for'));
      n.spellcheck = false;
    }
  }
  function save() {
    // Retain IDs of temporarily filtered-out items; never map by DOM position.
    for (const n of nodes()) saved[n.dataset.editId] = n.innerHTML;
    try { localStorage.setItem(key, JSON.stringify(saved)); }
    catch { notify('本地保存不可用或空间不足，请导出 HTML 保存修改。'); }
    document.dispatchEvent(new CustomEvent('html:change'));
  }
  function setActive(value) {
    active = Boolean(value); document.body.classList.toggle('editing', active);
    toolbar.querySelector('.edit-toggle').textContent = active ? '结束编辑' : '编辑';
    toolbar.querySelector('.edit-toggle').setAttribute('aria-pressed', String(active));
    refresh();
    if (!active) { if (document.activeElement?.closest('[data-edit-id]')) document.activeElement.blur(); save(); }
  }
  function exportHTML() {
    save();
    const clone = root.cloneNode(true);
    clone.dataset.editVersion = 'export-' + Date.now() + '-' + Math.random().toString(36).slice(2);
    clone.querySelector('body').classList.remove('editing');
    clone.querySelectorAll('[data-runtime-generated]').forEach(n => n.remove());
    clone.querySelectorAll('[contenteditable]').forEach(n => n.setAttribute('contenteditable', 'false'));
    document.dispatchEvent(new CustomEvent('html:before-export', {detail: {clone}}));
    const url = URL.createObjectURL(new Blob(['<!doctype html>\n' + clone.outerHTML], {type:'text/html;charset=utf-8'}));
    const a = document.createElement('a'); a.href = url;
    a.download = (root.dataset.exportName || document.title || 'page').replace(/[\\/:*?"<>|]/g, '-') + '.html';
    a.click(); setTimeout(() => URL.revokeObjectURL(url), 2000);
  }
  const isTyping = target => Boolean(target?.closest?.('input,textarea,select,[contenteditable="true"]'));
  toolbar.querySelector('.edit-toggle').onclick = () => setActive(!active);
  toolbar.querySelector('#exportHtml').onclick = exportHTML;
  hotzone.onclick = () => setActive(!active);
  document.addEventListener('input', e => { if (e.target.closest?.('[data-edit-id]')) save(); });
  document.addEventListener('keydown', e => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 's') { e.preventDefault(); save(); return; }
    if (e.key === 'Escape' && active) { e.preventDefault(); setActive(false); return; }
    if (e.metaKey || e.ctrlKey || e.altKey || isTyping(e.target)) return;
    if (e.key.toLowerCase() === 'e') { e.preventDefault(); setActive(!active); }
  });
  window.HtmlTools = {save, refresh, setActive, exportHTML, notify, isTyping, toolbar, get active() {return active;}, key};
  refresh({restore:true});
})();
