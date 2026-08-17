import {chromium} from 'playwright-core';
import fs from 'node:fs';fs.mkdirSync('ui-screenshots',{recursive:true});
const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_PATH,args:['--no-sandbox','--disable-dev-shm-usage']});
const page=await browser.newPage({viewport:{width:390,height:844},locale:'zh-CN'});const failures=[],runtime=[];
page.on('pageerror',e=>runtime.push('pageerror: '+e.message));page.on('console',m=>{if(m.type()==='error')runtime.push('console: '+m.text())});
await page.goto('http://127.0.0.1:8080/',{waitUntil:'networkidle'});await page.evaluate(()=>localStorage.clear());await page.reload({waitUntil:'networkidle'});
const checks=await page.evaluate(()=>{
  const amb=/适量|少量|少许|按需|按口味|若干|酌量/;
  function season(name){for(const r of recipes){const x=(r.season||[]).find(v=>v[0]===name&&amb.test(String(v[1]||'')));if(x)return {recipe:r.name,raw:x[1],out:practicalAmount0202('seasoning',name,x[1],r),fry:fryProcess0202b(r)}}return null}
  function food(name){for(const r of recipes){const x=(r.ings||[]).find(v=>v[0]===name&&amb.test(String(v[1]||'')));if(x)return {recipe:r.name,raw:x[1],out:practicalAmount0202('food',name,x[1],r)}}return null}
  return {
    shortening:season('起酥油'),lard:season('熟猪油'),soyJuice:season('豉油汁'),chickenPowder:season('鸡精'),
    teaEgg:food('茶叶蛋'),stock:food('老鸡汤'),rice:food('米饭'),rawRice:food('大米')
  };
});
function expectUnit(label,row,unit){if(row&&!String(row.out).includes(unit))failures.push(`${label} wrong unit ${JSON.stringify(row)}`)}
expectUnit('起酥油',checks.shortening,'g');expectUnit('熟猪油',checks.lard,'g');expectUnit('豉油汁',checks.soyJuice,'ml');expectUnit('鸡精',checks.chickenPowder,'g');expectUnit('茶叶蛋',checks.teaEgg,'个');expectUnit('老鸡汤',checks.stock,'ml');expectUnit('米饭',checks.rice,'g');expectUnit('大米',checks.rawRice,'g');
if(checks.shortening?.fry&&!String(checks.shortening.out).includes('500g'))failures.push(`frying shortening should be process amount ${JSON.stringify(checks.shortening)}`);
if(runtime.length)failures.push(...runtime);
const report={version:await page.evaluate(()=>state.version),checks,runtime,failures};fs.writeFileSync('ui-screenshots/v0202-semantic-audit.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));
await browser.close();if(failures.length)process.exitCode=1;
