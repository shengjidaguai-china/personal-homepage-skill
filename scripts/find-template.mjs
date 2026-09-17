#!/usr/bin/env node
import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';
const root=resolve(import.meta.dirname,'..');
const index=JSON.parse(readFileSync(resolve(root,'assets/template-index.json'),'utf8'));
const query=process.argv.slice(2).join(' ').trim().toLowerCase();
const matches=index.filter(e=>!query||[e.id,e.name,...e.keywordsZh].join(' ').toLowerCase().includes(query));
console.log(JSON.stringify(matches.map(e=>({...e,preview:e.preview?resolve(root,e.preview):null,implementation:resolve(root,e.implementation)})),null,2));
if(!matches.length)process.exitCode=1;
