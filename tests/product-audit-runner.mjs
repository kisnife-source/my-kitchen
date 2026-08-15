import fs from 'node:fs';
import {pathToFileURL} from 'node:url';
const src=fs.readFileSync('tests/product-audit.mjs','utf8');
const fixed=src.replace('return {width,scrollWidth:root.scrollWidth','return {width:innerWidth,scrollWidth:root.scrollWidth');
if(fixed===src)throw new Error('product audit viewport patch target missing');
const tmp='tests/.product-audit-runtime.mjs';
fs.writeFileSync(tmp,fixed,'utf8');
try{await import(pathToFileURL(process.cwd()+'/'+tmp).href+`?t=${Date.now()}`)}finally{try{fs.unlinkSync(tmp)}catch{}}
