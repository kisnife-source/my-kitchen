import {chromium} from 'playwright-core';
import fs from 'node:fs';
fs.mkdirSync('ui-screenshots',{recursive:true});
const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_PATH,args:['--no-sandbox','--disable-dev-shm-usage']});
const context=await browser.newContext({viewport:{width:390,height:844},locale:'zh-CN'});
const page=await context.newPage();
const failures=[];const runtime=[];
page.on('pageerror',e=>runtime.push('pageerror: '+e.message));
page.on('console',m=>{if(m.type()==='error')runtime.push('console: '+m.text())});
async function fresh(){await page.goto('http://127.0.0.1:8080/',{waitUntil:'networkidle'});await page.evaluate(()=>localStorage.clear());await page.reload({waitUntil:'networkidle'});}
async function completeCurrent(){while(await page.locator('#next').count())await page.locator('#next').click();if(!(await page.locator('#done').count()))throw new Error('finish button missing');await page.locator('#done').click();}
await fresh();

const initial=await page.evaluate(()=>({version:state.version,bar:!!document.querySelector('.meal-bar-0200'),servings:state.meal?.servings,dishes:state.meal?.dishes?.length,hoc:recipes.filter(r=>r.hoc).length,commercial:recipes.filter(r=>['东方树叶（335mL）','摩登罐装可乐','农夫山泉矿泉水（运动盖）'].includes(r.name)).map(r=>r.name)}));
if(initial.version!=='0.2.0')failures.push(`version ${initial.version}`);
if(!initial.bar)failures.push('meal bar missing');
if(initial.servings!==2||initial.dishes!==0)failures.push(`fresh meal state bad ${JSON.stringify(initial)}`);
if(initial.hoc<300||initial.commercial.length)failures.push(`HOC data bad ${JSON.stringify(initial)}`);

await page.evaluate(()=>{state.boardMode='recipes';state.query='番茄炒蛋';state.filter='全部';state.hocOnly=false;state.mealView=false;board()});
await page.locator('[data-r="r4"]').click();
if((await page.locator('#recipePrimary').innerText())!=='加入本餐')failures.push('recipe primary is not 加入本餐');
await page.locator('#recipePrimary').click();
await page.evaluate(()=>{state.query='西兰花炒虾仁';board()});
await page.locator('[data-r="r12"]').click();
await page.locator('#recipePrimary').click();
let meal=await page.evaluate(()=>({dishes:state.meal.dishes.slice(),bar:document.querySelector('.meal-bar-0200')?.textContent.replace(/\s+/g,' ').trim()}));
if(meal.dishes.length!==2||!meal.bar?.includes('2道'))failures.push(`multi-dish add failed ${JSON.stringify(meal)}`);
await page.locator('.meal-bar-0200').click();
if(await page.locator('.meal-dish-row').count()!==2)failures.push('meal plan does not show 2 dishes');

await page.locator('#servPlus').click();await page.locator('#servPlus').click();
const scaled=await page.evaluate(()=>{const d=mealRequirementData0200();return {servings:state.meal.servings,tomato:d.items.find(x=>x.name==='番茄')?.amount,egg:d.items.find(x=>x.name==='鸡蛋')?.amount,broccoli:d.items.find(x=>x.name==='西兰花')?.amount,missing:d.missing.length,badTools:d.badTools.length}});
if(scaled.servings!==4||scaled.tomato!=='4个'||scaled.egg!=='6个')failures.push(`portion scaling bad ${JSON.stringify(scaled)}`);

if(await page.locator('#mealBuyAll').count())await page.locator('#mealBuyAll').click();
const shopScaled=await page.evaluate(()=>({tomato:state.shopping.find(x=>x.name==='番茄')?.needs?.find(n=>n.recipeId==='r4')?.amount,egg:state.shopping.find(x=>x.name==='鸡蛋')?.needs?.find(n=>n.recipeId==='r4')?.amount,count:state.shopping.length}));
if(shopScaled.tomato!=='4个'||shopScaled.egg!=='6个'||!shopScaled.count)failures.push(`shopping scaling bad ${JSON.stringify(shopScaled)}`);
await page.locator('#mealShopping').click();
let guard=0;while(await page.locator('[data-bought]').count()){await page.locator('[data-bought]').first().click();if(++guard>60)throw new Error('shopping loop guard');}
await page.locator('#done').click();
const afterBuy=await page.evaluate(()=>({missing:mealRequirementData0200().missing.length,mealPlan:!!document.querySelector('#mealStartPrep')}));
if(afterBuy.missing!==0||!afterBuy.mealPlan)failures.push(`shopping return/refresh bad ${JSON.stringify(afterBuy)}`);

guard=0;while(await page.locator('[data-meal-tool]').count()){await page.locator('[data-meal-tool]').first().click();if(++guard>20)throw new Error('tool loop guard');}
if(await page.locator('#mealStartPrep').isDisabled())failures.push('meal prep still disabled after requirements ready');
await page.locator('#mealStartPrep').click();
const prepInitial=await page.evaluate(()=>({tasks:document.querySelectorAll('.meal-prep-task').length,phase:state.meal.phase,disabled:document.querySelector('#startMealCook')?.disabled}));
if(prepInitial.phase!=='prep'||prepInitial.tasks<3||!prepInitial.disabled)failures.push(`prep initial bad ${JSON.stringify(prepInitial)}`);
guard=0;while(await page.locator('.meal-prep-task:not(.done)').count()){await page.locator('.meal-prep-task:not(.done)').first().click();if(++guard>50)throw new Error('prep loop guard');}
if(await page.locator('#startMealCook').isDisabled())failures.push('start meal cook still disabled');
await page.locator('#startMealCook').click();
let cookState=await page.evaluate(()=>({phase:state.meal.phase,scene:state.scene,cook:state.cook?.recipe,dishCount:state.meal.dishes.length}));
if(cookState.phase!=='cook'||cookState.scene!=='stove'||!cookState.cook)failures.push(`cook start bad ${JSON.stringify(cookState)}`);
await completeCurrent();
let between=await page.evaluate(()=>({completed:state.meal.completed.length,cook:state.cook,hasNext:!!document.querySelector('#mealCookNext')}));
if(between.completed!==1||between.cook!==null||!between.hasNext)failures.push(`between dishes bad ${JSON.stringify(between)}`);
await page.locator('#mealCookNext').click();await completeCurrent();
if(!(await page.locator('#mealNoneUsed').count()))failures.push('whole-meal finish modal missing');
await page.locator('#mealNoneUsed').click();
const reset=await page.evaluate(()=>({dishes:state.meal.dishes.length,support:state.meal.support.length,phase:state.meal.phase,scene:state.scene}));
if(reset.dishes||reset.support||reset.phase!=='plan'||reset.scene!=='board')failures.push(`meal reset bad ${JSON.stringify(reset)}`);

await page.evaluate(()=>{addMealDish0200('r4');addMealDish0200('r12');setServings0200(5);state.mealView=true;state.mealPage='plan';save();});
await page.reload({waitUntil:'networkidle'});
const persisted=await page.evaluate(()=>({version:state.version,dishes:state.meal.dishes.slice(),servings:state.meal.servings,mealView:state.mealView,page:state.mealPage,plan:!!document.querySelector('.meal-serving-card')}));
if(persisted.version!=='0.2.0'||persisted.dishes.length!==2||persisted.servings!==5||!persisted.mealView||!persisted.plan)failures.push(`meal persistence bad ${JSON.stringify(persisted)}`);

await fresh();
const depSeed=await page.evaluate(()=>{
  for(const r of recipes){
    const req=[...(r.ings||[]).map(x=>['food',x[0]]),...(r.season||[]).filter(x=>x[2]).map(x=>['seasoning',x[0]])];
    for(const [kind,name] of req){const d=dependencyRecipe0200(name);if(d&&d.id!==r.id){addMealDish0200(r.id);state.mealView=true;state.mealPage='plan';save();board();return {recipe:r.name,recipeId:r.id,kind,name,depId:d.id,depName:d.name}}}
  }
  return null;
});
if(!depSeed)failures.push('no recipe dependency found');
else{
  const make=page.locator(`[data-meal-make="${depSeed.kind}|${depSeed.name}"]`);
  if(!(await make.count()))failures.push(`self-make action missing ${JSON.stringify(depSeed)}`);
  else{
    await make.click();
    const depAfter=await page.evaluate(seed=>({support:state.meal.support,missing:mealRequirementData0200().missing.some(x=>x.kind===seed.kind&&x.name===seed.name),planned:mealRequirementData0200().planned.some(x=>x.kind===seed.kind&&x.name===seed.name),first:mealQueue0200()[0]?.id}),depSeed);
    if(!depAfter.support.some(x=>x.id===depSeed.depId)||depAfter.missing||!depAfter.planned||depAfter.first!==depSeed.depId)failures.push(`self-make dependency bad ${JSON.stringify({depSeed,depAfter})}`);
  }
}

await fresh();await page.locator('[data-board-mode="ingredients"]').click();
const veg=page.locator('[data-ingredient-group="蔬菜菌菇"]');if(await veg.count()){await veg.click();const garlic=page.locator('[data-match-food="蒜"]').last();await garlic.click();await page.locator('[data-match-food="蒜"]').last().click();const open=await page.locator('[data-ingredient-group="蔬菜菌菇"]').getAttribute('aria-expanded');if(open!=='true')failures.push('ingredient group collapsed after deselect');}

await fresh();await page.evaluate(()=>{state.boardMode='recipes';state.query='宫保鸡丁';state.hocOnly=true;board()});
const hoc=page.locator('[data-r]').filter({hasText:'宫保鸡丁'}).first();if(await hoc.count()){await hoc.click();const source=await page.locator('.hoc-source-box').innerText().catch(()=> '');if(!source.includes('CookLikeHOC')||!source.includes('非老乡鸡官方仓库'))failures.push('HOC attribution missing');await page.locator('#backRecipe').click();}else failures.push('HOC 宫保鸡丁 missing');

const widths=[];for(const width of [360,390,430]){await page.setViewportSize({width,height:844});await page.evaluate(()=>{state.mealView=false;state.boardMode='recipes';state.query='';state.filter='全部';state.hocOnly=false;board()});const m=await page.evaluate(()=>({w:innerWidth,sw:document.documentElement.scrollWidth}));widths.push({width,...m});if(m.sw>m.w+2)failures.push(`horizontal overflow ${width}: ${m.sw}/${m.w}`)}

if(runtime.length)failures.push(...runtime);
const report={initial,scaled,shopScaled,afterBuy,prepInitial,cookState,between,reset,persisted,depSeed,widths,runtime,failures};
fs.writeFileSync('ui-screenshots/v0200-audit.json',JSON.stringify(report,null,2));
console.log(JSON.stringify(report,null,2));
await browser.close();if(failures.length)process.exitCode=1;
