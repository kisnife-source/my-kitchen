import {chromium} from 'playwright-core';
import fs from 'node:fs';
fs.mkdirSync('ui-screenshots',{recursive:true});
const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_PATH,args:['--no-sandbox','--disable-dev-shm-usage']});
const context=await browser.newContext({viewport:{width:390,height:844},locale:'zh-CN'});
const page=await context.newPage();
const runtime=[];page.on('pageerror',e=>runtime.push('pageerror: '+e.message));page.on('console',m=>{if(m.type()==='error')runtime.push('console: '+m.text())});
async function fresh(){await page.goto('http://127.0.0.1:8080/',{waitUntil:'networkidle'});await page.evaluate(()=>localStorage.clear());await page.reload({waitUntil:'networkidle'});}

await fresh();
const discovery=await page.evaluate(()=>({
  recipeCount:recipes.length,
  firstBatch:document.querySelectorAll('[data-r]').length,
  boardText:document.querySelector('#root')?.innerText||'',
  hasRecommendation:/推荐|今晚吃|智能菜单/.test(document.querySelector('#root')?.innerText||''),
  hasIngredientMode:!!document.querySelector('[data-board-mode="ingredients"]')
}));

await page.evaluate(()=>{
  have('food','番茄');have('food','鸡蛋');have('seasoning','食用油');have('seasoning','盐');have('tool','炒锅');
  state.meal=blankMeal0200();state.meal.servings=1;addMealDish0200('r4');state.mealView=true;state.mealPage='plan';save();board();
});
const quickDinner=await page.evaluate(()=>({
  missing:mealRequirementData0200().missing.map(x=>x.name),
  prepTasks:mealPrepTasks0200().map(x=>({name:x.name,action:x.action})),
  steps:recipeById0200('r4').steps.length,
  canStart:!document.querySelector('#mealStartPrep')?.disabled,
  pageHeight:document.documentElement.scrollHeight,
  viewport:innerHeight
}));

await fresh();
const familyMeal=await page.evaluate(()=>{
  state.meal=blankMeal0200();state.meal.servings=3;state.meal.dishes=['r4','r12','r5','r7'];state.mealView=true;state.mealPage='plan';save();board();
  const req=mealRequirementData0200();
  return {
    portions:state.meal.dishes.map(id=>({name:recipeById0200(id).name,target:recommendedDishServings0200c(recipeById0200(id))})),
    missingCount:req.missing.length,
    prepTaskCount:mealPrepTasks0200().length,
    cookStepCount:state.meal.dishes.reduce((n,id)=>n+(recipeById0200(id).steps?.length||0),0),
    planHeight:document.documentElement.scrollHeight,
    viewport:innerHeight
  };
});

await fresh();
const banquet=await page.evaluate(()=>{
  const ids=['r1','r4','r5','r7','r12','r13','r15','r16'];
  state.meal=blankMeal0200();state.meal.servings=6;state.meal.dishes=ids;state.mealView=true;state.mealPage='plan';save();board();
  const req=mealRequirementData0200();
  const tips=ids.map(id=>({name:recipeById0200(id).name,tips:recipeTips0210(recipeById0200(id)).length}));
  return {
    dishes:ids.length,
    missingCount:req.missing.length,
    requirementCount:req.items.length,
    prepTaskCount:mealPrepTasks0200().length,
    cookStepCount:ids.reduce((n,id)=>n+(recipeById0200(id).steps?.length||0),0),
    queue:mealQueue0200().map(r=>r.name),
    planHeight:document.documentElement.scrollHeight,
    viewport:innerHeight,
    tips
  };
});
await page.screenshot({path:'ui-screenshots/0201-practical-8-dish-plan.png',fullPage:false});

const fractionals=await page.evaluate(()=>{
  const out=[];
  const countUnit=/^(?:约)?(\d+(?:\.\d+)?)(个|颗|根|片|盒|包|瓶|张|把|块)(.*)$/;
  for(const diners of [3,5,7]){
    for(const r of recipes){
      for(const [name,amount] of r.ings||[]){
        const scaled=scaleAmount0200(amount,r,diners);const m=String(scaled).match(countUnit);
        if(m&&Number(m[1])%1!==0){out.push({diners,recipe:r.name,name,source:amount,scaled});if(out.length>=30)return out;}
      }
    }
  }
  return out;
});

await fresh();
const finishClutter=await page.evaluate(()=>{
  const ids=['r4','r12','r5','r7'];state.meal=blankMeal0200();state.meal.servings=3;state.meal.dishes=ids;
  const req=mealRequirementData0200();for(const x of req.items)have(x.kind,x.name);
  const now=mealRequirementData0200();
  const owned=now.items.filter(x=>x.owned);
  return {total:owned.length,seasonings:owned.filter(x=>x.kind==='seasoning').map(x=>x.name),foods:owned.filter(x=>x.kind==='food').map(x=>x.name)};
});

await fresh();
const tipRedundancy=await page.evaluate(()=>{
  state.meal=blankMeal0200();state.meal.servings=3;state.meal.dishes=['r4','r12','r5','r7'];
  return state.meal.dishes.map(id=>({name:recipeById0200(id).name,tips:recipeTips0210(recipeById0200(id)).map(t=>({label:t.label,text:t.text}))}));
});

const report={version:await page.evaluate(()=>state.version),discovery,quickDinner,familyMeal,banquet,fractionals,finishClutter,tipRedundancy,runtime};
fs.writeFileSync('ui-screenshots/v0201-practicality-audit.json',JSON.stringify(report,null,2));
console.log(JSON.stringify(report,null,2));
await browser.close();
if(runtime.length)process.exitCode=1;
