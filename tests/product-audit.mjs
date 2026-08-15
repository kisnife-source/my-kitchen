import { chromium } from 'playwright-core';
import fs from 'node:fs';

fs.mkdirSync('ui-screenshots',{recursive:true});
const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_PATH,args:['--no-sandbox','--disable-dev-shm-usage']});
const context=await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:1,locale:'zh-CN'});
const page=await context.newPage();
const runtimeErrors=[];
page.on('pageerror',e=>runtimeErrors.push('pageerror: '+e.message));
page.on('console',m=>{if(m.type()==='error')runtimeErrors.push('console: '+m.text())});

async function fresh(){
  await page.goto('http://127.0.0.1:8080/',{waitUntil:'networkidle'});
  await page.evaluate(()=>localStorage.clear());
  await page.reload({waitUntil:'networkidle'});
}
async function shot(name){await page.waitForTimeout(80);await page.screenshot({path:`ui-screenshots/${name}.png`,fullPage:false})}
await fresh();

const data=await page.evaluate(()=>{
  const duplicateNames=[];const byName=new Map();
  for(const r of recipes){const a=byName.get(r.name)||[];a.push(r);byName.set(r.name,a)}
  for(const [name,arr] of byName)if(arr.length>1)duplicateNames.push({name,count:arr.length,ids:arr.map(r=>r.id),hoc:arr.map(r=>!!r.hoc)});
  const noSteps=recipes.filter(r=>!Array.isArray(r.steps)||!r.steps.length).map(r=>({id:r.id,name:r.name,cat:r.cat,hoc:!!r.hoc,incomplete:!!r.source?.incomplete,source:r.source?.category||null}));
  const noInputs=recipes.filter(r=>!(r.ings?.length)&&!(r.season?.length)).map(r=>({id:r.id,name:r.name,cat:r.cat,hoc:!!r.hoc,incomplete:!!r.source?.incomplete,source:r.source?.category||null}));
  const noFood=recipes.filter(r=>!(r.ings?.length)).map(r=>({id:r.id,name:r.name,cat:r.cat,hoc:!!r.hoc,incomplete:!!r.source?.incomplete,season:r.season?.length||0}));
  const veryLongSteps=[];for(const r of recipes)for(let i=0;i<(r.steps||[]).length;i++)if(String(r.steps[i]).length>180)veryLongSteps.push({recipe:r.name,step:i+1,len:String(r.steps[i]).length,text:String(r.steps[i]).slice(0,120)});
  const longNames=recipes.filter(r=>r.name.length>=14).sort((a,b)=>b.name.length-a.name.length).slice(0,30).map(r=>({name:r.name,len:r.name.length,hoc:!!r.hoc}));
  const recipeNames=new Set(recipes.map(r=>r.name));
  const dependencyRefs=[];
  for(const r of recipes)for(const x of r.ings||[])if(recipeNames.has(x[0])&&x[0]!==r.name)dependencyRefs.push({recipe:r.name,input:x[0],kind:'food'});
  for(const r of recipes)for(const x of r.season||[])if(recipeNames.has(x[0])&&x[0]!==r.name)dependencyRefs.push({recipe:r.name,input:x[0],kind:'seasoning'});
  const incomplete=recipes.filter(r=>r.hoc&&r.source?.incomplete).map(r=>({name:r.name,cat:r.cat,ings:r.ings?.length||0,season:r.season?.length||0,steps:r.steps?.length||0}));
  const hocMeta=window.HOC_DATA?.meta||{};
  const hocBadgeText=document.querySelector('[data-hoc-only]')?.textContent?.replace(/\s+/g,' ').trim()||'';
  return {
    version:state.version,recipeCount:recipes.length,hocCount:recipes.filter(r=>r.hoc).length,hocMeta,hocBadgeText,
    duplicateNames,noSteps,noInputs,noFood,veryLongSteps:veryLongSteps.slice(0,30),longNames,dependencyRefs:dependencyRefs.slice(0,80),dependencyRefCount:dependencyRefs.length,
    incompleteCount:incomplete.length,incompleteNoSteps:incomplete.filter(x=>!x.steps).length,incompleteNoInputs:incomplete.filter(x=>!x.ings&&!x.season).length,
    formulaEmpty:recipes.filter(r=>r.cat==='调味配方'&&!r.ings?.length&&!r.season?.length).map(r=>r.name),
    drinkNames:recipes.filter(r=>r.cat==='饮品').map(r=>r.name)
  };
});

const flow={};
// Shopping: missing requirements should enter once, preserve amount/source, buying removes item and marks it owned.
await page.evaluate(()=>{state.boardMode='recipes';state.filter='全部';state.query='番茄炒蛋';state.foods=[];for(const n of SEASON)state.set.seasonings[n]=0;for(const n of TOOLS)state.set.cookware[n]=0;state.shopping=[];save();board()});
const tomatoCard=page.locator('[data-r]').filter({hasText:'番茄炒蛋'}).first();
if(await tomatoCard.count()){
  await tomatoCard.click();
  const rid=await page.evaluate(()=>state.recipe);
  await page.locator('#recipePrimary').click();
  flow.shoppingAfterAdd=await page.evaluate(id=>({items:state.shopping.map(x=>({kind:x.kind,name:x.name,needs:x.needs||[]})),allHave:state.shopping.every(x=>!has(x.kind,x.name)),id}),rid);
  await shot('audit-01-shopping');
  const bought=page.locator('[data-bought]').first();
  if(await bought.count()){
    const key=await bought.getAttribute('data-bought');
    await bought.click();
    flow.shoppingAfterBuy=await page.evaluate(k=>{const [kind,name]=k.split('|');return {kind,name,owned:has(kind,name),stillInShop:inShop(kind,name),count:state.shopping.length}},key);
  }
  await page.locator('#back').click();
  if(await page.locator('#backRecipe').count())await page.locator('#backRecipe').click();
}else flow.shoppingError='番茄炒蛋 card missing';

// Merge the same shopping item across two recipes, without duplicate rows.
flow.shoppingMerge=await page.evaluate(()=>{
  state.shopping=[];addShop('food','鸡蛋',{recipeId:'r4',amount:'3个'});addShop('food','鸡蛋',{recipeId:'r11',amount:'2个'});
  const rows=state.shopping.filter(x=>x.kind==='food'&&x.name==='鸡蛋');
  return {rows:rows.length,needs:rows[0]?.needs||[]};
});

// Prep -> stove -> finish full flow.
await fresh();
await page.evaluate(()=>{state.boardMode='recipes';state.query='虾仁滑蛋';board()});
const shrimp=page.locator('[data-r="r63"]');
if(await shrimp.count()){
  await shrimp.click();
  if(await page.locator('#markAllRequired').count())await page.locator('#markAllRequired').click();
  if(await page.locator('[data-recipe-tool="平底锅"]').count())await page.locator('[data-recipe-tool="平底锅"]').click();
  await page.locator('#recipePrimary').click();
  flow.prepInitial=await page.evaluate(()=>({prep:state.prep,disabled:document.querySelector('#cook')?.disabled,total:document.querySelectorAll('.prep').length}));
  for(const el of await page.locator('.prep').all())await el.click();
  flow.prepReady=await page.evaluate(()=>({disabled:document.querySelector('#cook')?.disabled,done:document.querySelectorAll('.prep.done').length,total:document.querySelectorAll('.prep').length}));
  await page.locator('#cook').click();
  flow.stoveStart=await page.evaluate(()=>({scene:state.scene,cook:state.cook,hasNext:!!document.querySelector('#next'),hasDone:!!document.querySelector('#done')}));
  while(await page.locator('#next').count())await page.locator('#next').click();
  flow.stoveLast=await page.evaluate(()=>({step:state.cook?.step,total:recipes.find(r=>r.id===state.cook?.recipe)?.steps?.length||0,hasNext:!!document.querySelector('#next'),hasDone:!!document.querySelector('#done')}));
  await page.locator('#done').click();
  flow.finishModal=await page.evaluate(()=>({scene:state.scene,cook:state.cook,usedUp:document.querySelectorAll('[data-used]').length,confirmDisabled:document.querySelector('#confirmUsed')?.disabled}));
  await shot('audit-02-finish');
}else flow.prepError='虾仁滑蛋 missing';

// Ingredient intent: an unavailable ingredient must still be selectable and match recipes.
await fresh();
await page.locator('[data-board-mode="ingredients"]').click();
await page.locator('#foodSearch').fill('虾仁');
await page.locator('[data-match-food="虾仁"]').click();
flow.intent=await page.evaluate(()=>({owned:has('food','虾仁'),selected:state.matchFoods.includes('虾仁'),matches:document.querySelectorAll('[data-r]').length,selectedChip:document.querySelectorAll('[data-match-food="虾仁"].intent-on').length}));

// Search and category state; HOC-only + query should not create stale results.
await fresh();
await page.evaluate(()=>{state.boardMode='recipes';state.query='鸡';state.filter='肉菜';state.hocOnly=true;state.recipeLimit=36;board()});
flow.searchFilter=await page.evaluate(()=>({cards:[...document.querySelectorAll('[data-r]')].map(x=>x.textContent.trim()).slice(0,5),count:document.querySelectorAll('[data-r]').length,filter:state.filter,query:state.query,hocOnly:state.hocOnly,allHoc:[...document.querySelectorAll('[data-r]')].every(el=>el.classList.contains('hoc-card'))}));

// Mobile geometry at common widths and tap-target scan.
const viewportChecks=[];
for(const width of [360,390,430]){
  await page.setViewportSize({width,height:844});
  await page.evaluate(()=>{state.prep=null;state.boardMode='recipes';state.filter='全部';state.query='';state.hocOnly=false;state.recipeLimit=36;board()});
  const m=await page.evaluate(()=>{
    const root=document.documentElement;
    const visible=[...document.querySelectorAll('button,input,a')].filter(el=>{const r=el.getBoundingClientRect();const s=getComputedStyle(el);return r.width>0&&r.height>0&&s.visibility!=='hidden'&&s.display!=='none'});
    const tiny=visible.map(el=>{const r=el.getBoundingClientRect();return {tag:el.tagName,text:(el.textContent||el.getAttribute('aria-label')||el.getAttribute('placeholder')||'').trim().replace(/\s+/g,' ').slice(0,50),w:Math.round(r.width),h:Math.round(r.height)}}).filter(x=>x.h<32||x.w<28).slice(0,40);
    return {width,scrollWidth:root.scrollWidth,overflow:root.scrollWidth>innerWidth+2,tinyCount:tiny.length,tiny};
  });
  viewportChecks.push(m);
}
await page.setViewportSize({width:390,height:844});

// Long/complex HOC recipe geometry.
await page.evaluate(()=>{state.boardMode='recipes';state.query='肥肠鸡';state.filter='全部';state.hocOnly=true;board()});
const complex=page.locator('[data-r]').filter({hasText:'肥肠鸡'}).first();
let complexUI=null;
if(await complex.count()){
  await complex.click();await shot('audit-03-complex');
  complexUI=await page.evaluate(()=>({required:document.querySelectorAll('.recipe-chip.missing,.recipe-chip.have').length,status:document.querySelector('.recipe-status-line')?.textContent?.trim()||'',footerH:Math.round(document.querySelector('.sheet-footer')?.getBoundingClientRect().height||0),sheetH:Math.round(document.querySelector('.sheet')?.scrollHeight||0),viewportH:innerHeight}));
}

const observations=[];
function issue(severity,key,detail){observations.push({severity,key,detail})}
if(runtimeErrors.length)issue('high','runtime-errors',runtimeErrors);
if(data.noSteps.length)issue('high','recipes-without-steps',`${data.noSteps.length} recipes have no executable steps`,data.noSteps.slice(0,12));
if(data.noInputs.length)issue('medium','recipes-without-inputs',`${data.noInputs.length} recipes have neither ingredients nor seasonings`);
if(data.formulaEmpty.length)issue('medium','empty-formula-records',data.formulaEmpty);
if(data.duplicateNames.length)issue('low','duplicate-recipe-names',`${data.duplicateNames.length} duplicated names`,data.duplicateNames);
if(data.dependencyRefCount)issue('medium','recipe-as-ingredient-without-dependency-ui',`${data.dependencyRefCount} ingredient/seasoning references are themselves recipes; they are presented as plain requirements`,data.dependencyRefs.slice(0,20));
if(data.veryLongSteps.length)issue('low','very-long-cooking-steps',`${data.veryLongSteps.length} steps exceed 180 characters`,data.veryLongSteps.slice(0,10));
if(viewportChecks.some(x=>x.overflow))issue('high','mobile-horizontal-overflow',viewportChecks.filter(x=>x.overflow));
if(viewportChecks.some(x=>x.tinyCount>0))issue('low','small-interactive-targets',viewportChecks);
if(complexUI?.required>=18)issue('medium','complex-recipe-prerequisite-overload',complexUI);
if(flow.shoppingMerge?.rows!==1||flow.shoppingMerge?.needs?.length!==2)issue('high','shopping-merge-broken',flow.shoppingMerge);
if(flow.shoppingAfterBuy&&!flow.shoppingAfterBuy.owned||flow.shoppingAfterBuy?.stillInShop)issue('high','shopping-buy-state-broken',flow.shoppingAfterBuy);
if(flow.prepInitial&&!flow.prepInitial.disabled)issue('high','prep-gate-broken',flow.prepInitial);
if(flow.prepReady?.disabled)issue('high','prep-ready-still-blocked',flow.prepReady);
if(flow.stoveStart?.hasDone)issue('medium','finish-visible-too-early',flow.stoveStart);
if(flow.stoveLast&&!flow.stoveLast.hasDone)issue('high','finish-missing-last-step',flow.stoveLast);
if(flow.intent&&!flow.intent.selected)issue('high','unowned-ingredient-not-selectable',flow.intent);
if(flow.searchFilter&&!flow.searchFilter.allHoc)issue('high','hoc-filter-leaks-non-hoc',flow.searchFilter);

const report={generatedAt:new Date().toISOString(),data,flow,viewportChecks,complexUI,runtimeErrors,observations};
fs.writeFileSync('ui-screenshots/product-audit.json',JSON.stringify(report,null,2));
console.log(JSON.stringify(report,null,2));
await browser.close();
if(runtimeErrors.length)process.exitCode=1;
