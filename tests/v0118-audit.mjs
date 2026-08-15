import {chromium} from 'playwright-core';
import fs from 'node:fs';

fs.mkdirSync('ui-screenshots',{recursive:true});
const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_PATH,args:['--no-sandbox','--disable-dev-shm-usage']});
const context=await browser.newContext({viewport:{width:390,height:844},locale:'zh-CN'});
const page=await context.newPage();
const failures=[];
page.on('pageerror',e=>failures.push('pageerror: '+e.message));
page.on('console',m=>{if(m.type()==='error')failures.push('console: '+m.text())});

async function fresh(){
  await page.goto('http://127.0.0.1:8080/',{waitUntil:'networkidle'});
  await page.evaluate(()=>localStorage.clear());
  await page.reload({waitUntil:'networkidle'});
}
await fresh();

const classification=await page.evaluate(()=>({
  version:state.version,
  formulaCount:recipes.filter(r=>r.hoc&&r.source?.category==='配料'&&r.cat==='调味配方').length,
  misplacedFormulaCount:recipes.filter(r=>r.hoc&&r.source?.category==='配料'&&r.cat==='半成品').length,
  drinkCount:recipes.filter(r=>r.hoc&&r.source?.category==='饮品'&&r.cat==='饮品').length,
  misplacedDrinkCount:recipes.filter(r=>r.hoc&&r.source?.category==='饮品'&&r.cat==='主食').length
}));
if(classification.version!=='0.1.18')failures.push(`wrong version ${classification.version}`);
if(classification.formulaCount<30||classification.misplacedFormulaCount)failures.push(`formula classification bad ${JSON.stringify(classification)}`);
if(classification.drinkCount<15||classification.misplacedDrinkCount)failures.push(`drink classification bad ${JSON.stringify(classification)}`);

// Expanded foods and HOC cooking state must survive a real page reload.
const seed=await page.evaluate(()=>{
  const hoc=recipes.find(r=>r.hoc&&r.ings?.some(x=>x[0]==='肥肠'))||recipes.find(r=>r.hoc);
  state.foods=['莲藕'];if(FOOD['肥肠'])state.foods.push('肥肠');
  state.matchFoods=FOOD['肥肠']?['肥肠']:['莲藕'];
  state.recipe=hoc?.id||null;
  state.prep=hoc?{recipe:hoc.id,checked:{}}:null;
  state.cook=hoc?{recipe:hoc.id,step:0}:null;
  state.ingredientOpenGroups=['蔬菜菌菇'];
  save();
  return {id:hoc?.id||null};
});
await page.reload({waitUntil:'networkidle'});
const persisted=await page.evaluate(seed=>({
  lotus:state.foods.includes('莲藕'),
  hocFood:!FOOD['肥肠']||state.foods.includes('肥肠'),
  match:!FOOD['肥肠']||(state.matchFoods||[]).includes('肥肠'),
  recipe:!seed.id||state.recipe===seed.id,
  prep:!seed.id||state.prep?.recipe===seed.id,
  cook:!seed.id||state.cook?.recipe===seed.id,
  open:(state.ingredientOpenGroups||[]).includes('蔬菜菌菇')
}),seed);
if(Object.values(persisted).some(v=>!v))failures.push(`expanded state lost on reload ${JSON.stringify(persisted)}`);

// Regression: selecting then deselecting an ingredient must not collapse its group.
await fresh();
await page.evaluate(()=>{state.boardMode='ingredients';state.foodQuery='';state.matchFoods=[];state.ingredientOpenGroups=[];save();board()});
const vegHead=page.locator('[data-ingredient-group="蔬菜菌菇"]');
if(!(await vegHead.count()))failures.push('vegetable group header missing');
else{
  await vegHead.click();
  const garlic=page.locator('[data-match-food="蒜"]').last();
  if(!(await garlic.count()))failures.push('garlic chip missing after opening group');
  else{
    await garlic.click();
    const afterSelect=await page.locator('[data-ingredient-group="蔬菜菌菇"]').getAttribute('aria-expanded');
    if(afterSelect!=='true')failures.push('group collapsed after selecting ingredient');
    await page.locator('[data-match-food="蒜"]').last().click();
    const afterDeselect=await page.locator('[data-ingredient-group="蔬菜菌菇"]').getAttribute('aria-expanded');
    if(afterDeselect!=='true')failures.push('group collapsed after deselecting ingredient');
  }
}

const scale=await page.evaluate(()=>{
  state.boardMode='ingredients';state.foodQuery='';state.matchFoods=[];state.ingredientOpenGroups=[];board();
  const closedFoodChips=document.querySelectorAll('[data-match-food]').length;
  const common=['鸡蛋','鸡腿肉','猪肉','葱','姜','蒜','土豆','豆腐'].map(name=>({name,count:recipes.filter(r=>(r.ings||[]).some(x=>x[0]===name)).length})).sort((a,b)=>b.count-a.count)[0];
  state.matchFoods=[common.name];state.recipeLimit=36;board();
  const renderedMatchedRecipes=document.querySelectorAll('[data-r]').length;
  manageModal('seasoning');
  const seasoningPicks=document.querySelectorAll('[data-pick]').length;
  const seasoningGroups=document.querySelectorAll('[data-season-group]').length;
  close();
  return {closedFoodChips,common,renderedMatchedRecipes,seasoningPicks,seasoningGroups};
});
if(scale.closedFoodChips>80)failures.push(`collapsed ingredient browser still renders too many chips: ${scale.closedFoodChips}`);
if(scale.renderedMatchedRecipes>40)failures.push(`ingredient matches not paginated: ${scale.renderedMatchedRecipes}`);
if(scale.seasoningPicks>80||scale.seasoningGroups<3)failures.push(`seasoning browser still too dense: ${JSON.stringify(scale)}`);

const report={classification,persisted,scale,failures};
fs.writeFileSync('ui-screenshots/v0118-audit.json',JSON.stringify(report,null,2));
console.log(JSON.stringify(report,null,2));
await browser.close();
if(failures.length)process.exitCode=1;
