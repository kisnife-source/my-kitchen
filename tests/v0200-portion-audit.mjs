import {chromium} from 'playwright-core';
import fs from 'node:fs';
fs.mkdirSync('ui-screenshots',{recursive:true});
const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_PATH,args:['--no-sandbox','--disable-dev-shm-usage']});
const context=await browser.newContext({viewport:{width:390,height:844},locale:'zh-CN'});
const page=await context.newPage();
const failures=[];const runtime=[];
page.on('pageerror',e=>runtime.push('pageerror: '+e.message));
page.on('console',m=>{if(m.type()==='error')runtime.push('console: '+m.text())});
await page.goto('http://127.0.0.1:8080/',{waitUntil:'networkidle'});
await page.evaluate(()=>localStorage.clear());
await page.reload({waitUntil:'networkidle'});

const oneDish=await page.evaluate(()=>{
  state.meal.dishes=['r4'];state.meal.servings=3;state.mealView=true;state.mealPage='plan';save();board();
  const r=recipeById0200('r4');const d=mealRequirementData0200();
  return {target:recommendedDishServings0200c(r),tomato:d.items.find(x=>x.name==='番茄')?.amount,egg:d.items.find(x=>x.name==='鸡蛋')?.amount};
});
if(oneDish.target!==3||oneDish.tomato!=='3个')failures.push(`single dish should cover all diners ${JSON.stringify(oneDish)}`);

const twoDishes=await page.evaluate(()=>{
  state.meal.dishes=['r4','r12'];state.meal.servings=3;save();board();
  return state.meal.dishes.map(id=>({id,target:recommendedDishServings0200c(recipeById0200(id))}));
});
if(twoDishes.some(x=>x.target!==3))failures.push(`two-dish meal should still use full-table portions ${JSON.stringify(twoDishes)}`);

const fourDishes=await page.evaluate(()=>{
  state.meal.dishes=['r4','r12','r5','r7'];state.meal.servings=3;state.mealView=true;state.mealPage='plan';save();board();
  const targets=state.meal.dishes.map(id=>({id,name:recipeById0200(id).name,target:recommendedDishServings0200c(recipeById0200(id))}));
  const d=mealRequirementData0200();
  return {
    targets,
    tomato:d.items.find(x=>x.name==='番茄')?.amount,
    egg:d.items.find(x=>x.name==='鸡蛋')?.amount,
    shrimp:d.items.find(x=>x.name==='虾仁')?.amount,
    text:document.querySelector('#root')?.innerText||'',
    overflow:document.documentElement.scrollWidth>innerWidth+2
  };
});
if(fourDishes.targets.some(x=>x.target>=3))failures.push(`four shared dishes were naively scaled to all diners ${JSON.stringify(fourDishes.targets)}`);
if(fourDishes.targets.some(x=>x.target<2))failures.push(`shared dishes shrank below practical base plate ${JSON.stringify(fourDishes.targets)}`);
if(fourDishes.tomato!=='2个'||fourDishes.egg!=='3个'||fourDishes.shrimp!=='200g')failures.push(`four-dish ingredient quantities not redistributed ${JSON.stringify(fourDishes)}`);
if(!fourDishes.text.includes('3人用餐')||!fourDishes.text.includes('3人共享'))failures.push('meal UI does not explain diner vs per-dish portion');
if(fourDishes.overflow)failures.push('portion UI causes horizontal overflow');
await page.screenshot({path:'ui-screenshots/0200-15-shared-portions.png',fullPage:false});

const withStaple=await page.evaluate(()=>{
  state.meal.dishes=['r4','r12','r5','r7','r8'];state.meal.servings=3;save();
  const shared=recommendedDishServings0200c(recipeById0200('r4'));
  const staple=recommendedDishServings0200c(recipeById0200('r8'));
  return {shared,staple,noodle:scaleAmount0200('1人份',recipeById0200('r8'))};
});
if(withStaple.shared>=3||withStaple.staple!==3||withStaple.noodle!=='3人份')failures.push(`staple was incorrectly pooled with shared dishes ${JSON.stringify(withStaple)}`);

const support=await page.evaluate(()=>{
  const r=recipes.find(x=>x.cat==='调味配方'&&x.ings?.length&&x.steps?.length);
  if(!r)return null;
  state.meal.support=[{id:r.id,outputKind:'seasoning',outputName:r.name}];state.meal.servings=8;save();
  return {name:r.name,base:recipeBaseServings0200(r),target:recommendedDishServings0200c(r),label:portionLabel0200c(r)};
});
if(support&&(support.target!==support.base||support.label!=='按原配方一次'))failures.push(`support formula incorrectly scaled by diner count ${JSON.stringify(support)}`);

if(runtime.length)failures.push(...runtime);
const report={oneDish,twoDishes,fourDishes,withStaple,support,runtime,failures};
fs.writeFileSync('ui-screenshots/v0200-portion-audit.json',JSON.stringify(report,null,2));
console.log(JSON.stringify(report,null,2));
await browser.close();
if(failures.length)process.exitCode=1;
