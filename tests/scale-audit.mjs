import { chromium } from 'playwright-core';
import fs from 'node:fs';

fs.mkdirSync('ui-screenshots',{recursive:true});
const generated=fs.readFileSync('hoc-recipes.generated.js','utf8');
const prefix='window.HOC_DATA=';
const at=generated.indexOf(prefix);
if(at<0)throw new Error('HOC_DATA missing');
const hoc=JSON.parse(generated.slice(at+prefix.length).trim().replace(/;\s*$/,''));

const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_PATH,args:['--no-sandbox','--disable-dev-shm-usage']});
const context=await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:1,locale:'zh-CN'});
const page=await context.newPage();
const runtimeErrors=[];
page.on('pageerror',e=>runtimeErrors.push('pageerror: '+e.message));
page.on('console',m=>{if(m.type()==='error')runtimeErrors.push('console: '+m.text())});
await page.goto('http://127.0.0.1:8080/',{waitUntil:'networkidle'});
await page.evaluate(()=>localStorage.clear());
await page.reload({waitUntil:'networkidle'});

const runtime=await page.evaluate(()=>{
  const duplicateNames=[];
  const byName=new Map();
  for(const r of recipes){const a=byName.get(r.name)||[];a.push(r.id);byName.set(r.name,a)}
  for(const [name,ids] of byName)if(ids.length>1)duplicateNames.push({name,count:ids.length,ids});
  const ids=recipes.map(r=>r.id);
  const duplicateIds=[...new Set(ids.filter((x,i)=>ids.indexOf(x)!==i))];
  const invalidFoods=[],invalidSeasonings=[],invalidTools=[];
  for(const r of recipes){
    for(const x of r.ings||[])if(!Object.prototype.hasOwnProperty.call(FOOD,x[0]))invalidFoods.push({recipe:r.name,item:x[0]});
    for(const x of r.season||[])if(!SEASON.includes(x[0]))invalidSeasonings.push({recipe:r.name,item:x[0]});
    for(const g of r.tools||[])for(const n of g)if(!TOOLS.includes(n))invalidTools.push({recipe:r.name,item:n});
  }
  const sourceCats={};
  const appCats={};
  for(const r of recipes){appCats[r.cat]=(appCats[r.cat]||0)+1;if(r.hoc){const c=r.source?.category||'未知';sourceCats[c]=(sourceCats[c]||0)+1}}
  const hocCondimentRecipes=recipes.filter(r=>r.hoc&&r.source?.category==='配料');
  const sauceLike=hocCondimentRecipes.filter(r=>/(酱|汁|油|料|卤|椒|粉|汤底|底料)/.test(r.name));
  const noFoodRecipes=recipes.filter(r=>!(r.ings||[]).length);
  return {
    recipeCount:recipes.length,
    foodCount:Object.keys(FOOD).length,
    seasoningCount:SEASON.length,
    toolCount:TOOLS.length,
    hocCount:recipes.filter(r=>r.hoc).length,
    duplicateNames:duplicateNames.slice(0,80),duplicateNameCount:duplicateNames.length,duplicateIds,
    invalidFoods:invalidFoods.slice(0,80),invalidFoodCount:invalidFoods.length,
    invalidSeasonings:invalidSeasonings.slice(0,80),invalidSeasoningCount:invalidSeasonings.length,
    invalidTools:invalidTools.slice(0,80),invalidToolCount:invalidTools.length,
    sourceCats,appCats,
    hocCondimentCount:hocCondimentRecipes.length,
    sauceLikeInHalfPrepared:sauceLike.filter(r=>r.cat==='半成品').length,
    sauceLikeExamples:sauceLike.filter(r=>r.cat==='半成品').slice(0,30).map(r=>r.name),
    noFoodRecipeCount:noFoodRecipes.length,
    noFoodExamples:noFoodRecipes.slice(0,30).map(r=>({name:r.name,cat:r.cat,source:r.source?.category||null}))
  };
});

async function metric(label,fn){
  return await page.evaluate(({label,src})=>{
    const f=(0,eval)(`(${src})`);
    const t0=performance.now();
    const extra=f();
    const ms=performance.now()-t0;
    return {label,ms:Number(ms.toFixed(2)),...extra};
  },{label,src:fn.toString()});
}

const perf=[];
perf.push(await metric('recipe-board-render',()=>{state.prep=null;state.boardMode='recipes';state.filter='全部';state.query='';state.hocOnly=false;state.recipeLimit=36;board();return {cards:document.querySelectorAll('[data-r]').length,dom:document.querySelectorAll('*').length,scrollH:document.documentElement.scrollHeight}}));
perf.push(await metric('ingredient-browser-empty',()=>{state.boardMode='ingredients';state.foodQuery='';state.matchFoods=[];board();return {foodChips:document.querySelectorAll('[data-match-food]').length,recipeCards:document.querySelectorAll('[data-r]').length,dom:document.querySelectorAll('*').length,scrollH:document.documentElement.scrollHeight}}));
perf.push(await metric('ingredient-search-xia',()=>{state.boardMode='ingredients';state.foodQuery='虾';state.matchFoods=[];board();return {foodChips:document.querySelectorAll('[data-match-food]').length,dom:document.querySelectorAll('*').length,scrollH:document.documentElement.scrollHeight}}));

const commonMatches=await page.evaluate(()=>{
  const candidates=['鸡蛋','鸡腿肉','猪肉','葱','姜','蒜','土豆','豆腐'];
  return candidates.map(name=>({name,count:recipes.filter(r=>(r.ings||[]).some(x=>x[0]===name)).length})).sort((a,b)=>b.count-a.count);
});
const mostCommon=commonMatches[0];
perf.push(await metric('ingredient-match-common',()=>{const candidates=['鸡蛋','鸡腿肉','猪肉','葱','姜','蒜','土豆','豆腐'];const ranked=candidates.map(name=>({name,count:recipes.filter(r=>(r.ings||[]).some(x=>x[0]===name)).length})).sort((a,b)=>b.count-a.count);state.boardMode='ingredients';state.foodQuery='';state.matchFoods=[ranked[0].name];board();return {ingredient:ranked[0].name,expectedMatches:ranked[0].count,renderedRecipes:document.querySelectorAll('[data-r]').length,foodChips:document.querySelectorAll('[data-match-food]').length,dom:document.querySelectorAll('*').length,scrollH:document.documentElement.scrollHeight}}));
perf.push(await metric('seasoning-manage-render',()=>{manageModal('seasoning');return {picks:document.querySelectorAll('[data-pick]').length,dom:document.querySelectorAll('*').length,sheetScrollH:document.querySelector('.sheet')?.scrollHeight||0}}));
await page.evaluate(()=>close());

const stateSizes=await page.evaluate(()=>{
  const before=JSON.stringify(state).length;
  const backup=JSON.parse(JSON.stringify(state));
  state.foods=Object.keys(FOOD);
  for(const n of SEASON)state.set.seasonings[n]=1;
  for(const n of TOOLS)state.set.cookware[n]=1;
  save();
  const worst=localStorage.getItem('mk01')?.length||0;
  Object.keys(state).forEach(k=>delete state[k]);Object.assign(state,backup);save();
  return {freshStateChars:before,allInventoryChars:worst};
});

const issues=[];
if(runtime.invalidFoodCount||runtime.invalidSeasoningCount||runtime.invalidToolCount)issues.push({severity:'high',key:'invalid-references',detail:`food ${runtime.invalidFoodCount}, seasoning ${runtime.invalidSeasoningCount}, tool ${runtime.invalidToolCount}`});
if(runtime.duplicateIds.length)issues.push({severity:'high',key:'duplicate-recipe-ids',detail:runtime.duplicateIds});
if(runtime.sauceLikeInHalfPrepared)issues.push({severity:'high',key:'condiments-misclassified-as-half-prepared',detail:`${runtime.sauceLikeInHalfPrepared}/${runtime.hocCondimentCount} source 配料 records look like sauces/seasonings but are 半成品`});
const matchPerf=perf.find(x=>x.label==='ingredient-match-common');
if(matchPerf?.renderedRecipes>60)issues.push({severity:'medium',key:'ingredient-match-unpaginated',detail:`${matchPerf.ingredient} renders ${matchPerf.renderedRecipes} recipe results at once`});
const ingEmpty=perf.find(x=>x.label==='ingredient-browser-empty');
if(ingEmpty?.foodChips>250)issues.push({severity:'medium',key:'ingredient-browser-heavy-dom',detail:`${ingEmpty.foodChips} ingredient buttons exist in DOM even when groups are collapsed`});
const seasoningPerf=perf.find(x=>x.label==='seasoning-manage-render');
if(seasoningPerf?.picks>100)issues.push({severity:'medium',key:'seasoning-picker-density',detail:`${seasoningPerf.picks} seasoning buttons rendered at once`});
if(runtime.duplicateNameCount>20)issues.push({severity:'low',key:'duplicate-recipe-names',detail:`${runtime.duplicateNameCount} duplicate recipe names across libraries`});
if(stateSizes.allInventoryChars>1000000)issues.push({severity:'medium',key:'localstorage-growth',detail:`worst inventory state ${stateSizes.allInventoryChars} chars`});

const report={generatedAt:new Date().toISOString(),hocMeta:hoc.meta,runtime,commonMatches,perf,stateSizes,runtimeErrors,issues};
fs.writeFileSync('ui-screenshots/scale-audit.json',JSON.stringify(report,null,2));
console.log(JSON.stringify(report,null,2));
await browser.close();
