import {chromium} from 'playwright-core';
import fs from 'node:fs';
fs.mkdirSync('ui-screenshots',{recursive:true});
const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_PATH,args:['--no-sandbox','--disable-dev-shm-usage']});
const context=await browser.newContext({viewport:{width:390,height:844},locale:'zh-CN'});
const page=await context.newPage();const failures=[],runtime=[];
page.on('pageerror',e=>runtime.push('pageerror: '+e.message));page.on('console',m=>{if(m.type()==='error')runtime.push('console: '+m.text())});
async function fresh(){await page.goto('http://127.0.0.1:8080/',{waitUntil:'networkidle'});await page.evaluate(()=>localStorage.clear());await page.reload({waitUntil:'networkidle'});}
await fresh();

const sourceScan=await page.evaluate(()=>{
  const re=/适量|少量|少许|按需|按口味|若干|酌量/;const season=[],foods=[];
  for(const r of recipes){
    for(const x of r.season||[])if(re.test(String(x[1]||'')))season.push({recipe:r.name,name:x[0],raw:x[1],required:!!x[2]});
    for(const x of r.ings||[])if(re.test(String(x[1]||'')))foods.push({recipe:r.name,name:x[0],raw:x[1]});
  }
  const freq=a=>Object.entries(a.reduce((o,x)=>(o[x.name]=(o[x.name]||0)+1,o),{})).sort((a,b)=>b[1]-a[1]).slice(0,20);
  return {seasonCount:season.length,requiredSeasonCount:season.filter(x=>x.required).length,foodCount:foods.length,seasonTop:freq(season),foodTop:freq(foods),seasonExamples:season.slice(0,20),foodExamples:foods.slice(0,20)};
});

const resolvedScan=await page.evaluate(()=>{
  const re=/适量|少量|少许|按需|按口味|若干|酌量/;const unresolved=[];let resolved=0;
  for(const r of recipes){
    for(const x of r.season||[]){if(!re.test(String(x[1]||'')))continue;const out=practicalAmount0202('seasoning',x[0],x[1],r);resolved++;if(re.test(out))unresolved.push({recipe:r.name,kind:'seasoning',name:x[0],raw:x[1],out});}
    for(const x of r.ings||[]){if(!re.test(String(x[1]||'')))continue;const out=practicalAmount0202('food',x[0],x[1],r);resolved++;if(re.test(out))unresolved.push({recipe:r.name,kind:'food',name:x[0],raw:x[1],out});}
  }
  return {resolved,unresolved:unresolved.slice(0,30)};
});
if(resolvedScan.unresolved.length)failures.push(`ambiguous quantities unresolved: ${JSON.stringify(resolvedScan.unresolved.slice(0,5))}`);

const r4=await page.evaluate(()=>{
  state.meal=blankMeal0200();state.meal.servings=3;state.meal.dishes=['r4'];state.mealView=true;state.mealPage='plan';save();board();
  const d=mealRequirementData0200();const recipe=recipeById0200('r4');
  return {version:state.version,egg:d.items.find(x=>x.name==='鸡蛋')?.amount,salt:d.items.find(x=>x.name==='盐')?.amount,oil:d.items.find(x=>x.name==='食用油')?.amount,target:recommendedDishServings0200c(recipe),tipsLoaded:typeof recipeTips0210!=='undefined'};
});
if(r4.version!=='0.2.2')failures.push(`wrong version ${r4.version}`);
if(r4.egg!=='5个')failures.push(`egg quantity is not kitchen-practical: ${r4.egg}`);
if(!String(r4.salt).startsWith('参考约')||/适量/.test(String(r4.salt)))failures.push(`salt still vague ${r4.salt}`);
if(!String(r4.oil).startsWith('参考约')||/适量/.test(String(r4.oil)))failures.push(`oil still vague ${r4.oil}`);
if(r4.tipsLoaded)failures.push('V0.2.1 tips code is still loaded');

await page.evaluate(()=>recipeModal('r4'));
const recipeUI=await page.evaluate(()=>{
  const rows=[...document.querySelectorAll('[data-recipe-item]')].map(b=>({key:b.dataset.recipeItem,text:b.innerText.replace(/\s+/g,' ').trim()}));
  return {salt:rows.find(x=>x.key==='seasoning|盐')?.text||'',oil:rows.find(x=>x.key==='seasoning|食用油')?.text||'',tips:document.querySelectorAll('.kitchen-tips-0210,.kitchen-step-tip-0210').length,overflow:document.documentElement.scrollWidth>innerWidth+2};
});
if(!recipeUI.salt.includes('参考约')||recipeUI.salt.includes('适量'))failures.push(`recipe salt UI vague ${recipeUI.salt}`);
if(recipeUI.tips)failures.push('tips UI still visible');if(recipeUI.overflow)failures.push('recipe quantity UI overflow');
await page.screenshot({path:'ui-screenshots/0202-01-reference-amounts.png',fullPage:false});
await page.evaluate(()=>close());

await page.evaluate(()=>{addAllMissingShopping0200();shoppingModal();});
const shopping=await page.evaluate(()=>{
  const rows=[...document.querySelectorAll('.shopping-row')].map(row=>({name:row.querySelector('b')?.textContent||'',text:row.innerText.replace(/\s+/g,' ').trim()}));
  return {salt:rows.find(x=>x.name==='盐')?.text||'',oil:rows.find(x=>x.name==='食用油')?.text||'',egg:rows.find(x=>x.name==='鸡蛋')?.text||'',overflow:document.documentElement.scrollWidth>innerWidth+2};
});
if(!shopping.salt.includes('建议买1小袋/盒')||!shopping.salt.includes('本餐预计用参考约'))failures.push(`salt shopping guidance bad ${shopping.salt}`);
if(!shopping.oil.includes('建议买1瓶')||!shopping.oil.includes('本餐预计用参考约'))failures.push(`oil shopping guidance bad ${shopping.oil}`);
if(shopping.egg&&!shopping.egg.includes('5个'))failures.push(`egg shopping amount bad ${shopping.egg}`);
if(shopping.overflow)failures.push('shopping quantity UI overflow');
await page.screenshot({path:'ui-screenshots/0202-02-shopping-guidance.png',fullPage:false});

await fresh();
const multi=await page.evaluate(()=>{
  state.meal=blankMeal0200();state.meal.servings=3;state.meal.dishes=['r4','r12','r5','r7'];state.mealView=true;state.mealPage='plan';save();board();
  const d=mealRequirementData0200(),amb=/适量|少量|少许|按需|按口味|若干|酌量/;
  return {seasonings:d.items.filter(x=>x.kind==='seasoning').map(x=>({name:x.name,amount:x.amount})),ambiguous:d.items.filter(x=>amb.test(String(x.amount||''))).map(x=>({name:x.name,amount:x.amount})),height:document.documentElement.scrollHeight,overflow:document.documentElement.scrollWidth>innerWidth+2};
});
if(multi.ambiguous.length)failures.push(`multi meal still vague ${JSON.stringify(multi.ambiguous)}`);if(multi.overflow)failures.push('multi meal overflow');

await fresh();
const stoveSeed=await page.evaluate(()=>{
  state.meal=blankMeal0200();state.meal.servings=3;state.meal.dishes=['r4'];state.meal.phase='cook';
  const r=recipeById0200('r4');for(const x of r.ings||[])have('food',x[0]);for(const x of r.season||[])if(x[2])have('seasoning',x[0]);have('tool','炒锅');
  state.scene='stove';state.cook={recipe:'r4',step:2};save();render();
  return {text:document.querySelector('.step-amounts-0202')?.innerText.replace(/\s+/g,' ').trim()||'',step:document.querySelector('.step')?.innerText||'',tips:document.querySelectorAll('.kitchen-step-tip-0210').length,overflow:document.documentElement.scrollWidth>innerWidth+2};
});
if(!stoveSeed.text.includes('本步用量')||!stoveSeed.text.includes('盐')||!stoveSeed.text.includes('参考约'))failures.push(`stove amount guidance missing ${JSON.stringify(stoveSeed)}`);
if(stoveSeed.tips)failures.push('old step tips still visible');if(stoveSeed.overflow)failures.push('stove amount UI overflow');
await page.screenshot({path:'ui-screenshots/0202-03-step-amount.png',fullPage:false});

const fractionals=await page.evaluate(()=>{
  const bad=[],re=/^(?:约)?(\d+(?:\.\d+)?)(个|片|张|包|瓶|块|盒)(?:.*)$/;
  for(const diners of [3,5,7])for(const r of recipes)for(const [name,raw] of r.ings||[]){const out=scaleAmount0200(raw,r,diners),m=String(out).match(re);if(m&&Number(m[1])%1!==0){bad.push({diners,recipe:r.name,name,raw,out});if(bad.length>=30)return bad;}}
  return bad;
});
if(fractionals.length)failures.push(`indivisible quantities remain ${JSON.stringify(fractionals.slice(0,5))}`);

const complex=await page.evaluate(()=>{
  const r=recipes.find(x=>x.name==='肥肠鸡'&&x.source?.complex)||recipes.find(x=>x.source?.complex);if(!r)return null;
  const src=[...(r.ings||[]).map(x=>['food',...x]),...(r.season||[]).map(x=>['seasoning',...x])].find(x=>String(x[2]||'').includes('见步骤'));
  return src?{recipe:r.name,raw:src[2],out:practicalAmount0202(src[0],src[1],src[2],r)}:null;
});
if(complex&&complex.out!=='见步骤')failures.push(`complex source detail was invented ${JSON.stringify(complex)}`);

const widths=[];for(const width of [360,390,430]){await page.setViewportSize({width,height:844});await page.evaluate(()=>{state.scene='board';state.mealView=true;state.mealPage='plan';render()});const m=await page.evaluate(()=>({w:innerWidth,sw:document.documentElement.scrollWidth}));widths.push({width,...m});if(m.sw>m.w+2)failures.push(`horizontal overflow ${width}: ${m.sw}/${m.w}`)}
if(runtime.length)failures.push(...runtime);
const report={sourceScan,resolvedScan,r4,recipeUI,shopping,multi,stoveSeed,fractionals,complex,widths,runtime,failures};
fs.writeFileSync('ui-screenshots/v0202-quantity-audit.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));
await browser.close();if(failures.length)process.exitCode=1;
