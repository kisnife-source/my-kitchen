import {chromium} from 'playwright-core';
import fs from 'node:fs';
fs.mkdirSync('ui-screenshots',{recursive:true});
const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_PATH,args:['--no-sandbox','--disable-dev-shm-usage']});
const context=await browser.newContext({viewport:{width:390,height:844},locale:'zh-CN'});
const page=await context.newPage();const failures=[];const runtime=[];
page.on('pageerror',e=>runtime.push('pageerror: '+e.message));
page.on('console',m=>{if(m.type()==='error')runtime.push('console: '+m.text())});
async function fresh(){await page.goto('http://127.0.0.1:8080/',{waitUntil:'networkidle'});await page.evaluate(()=>localStorage.clear());await page.reload({waitUntil:'networkidle'});}
async function shot(name){await page.waitForTimeout(80);await page.screenshot({path:`ui-screenshots/${name}.png`,fullPage:false});}
await fresh();

const initial=await page.evaluate(()=>({version:state.version,title:document.title,coverage:recipes.filter(r=>recipeTips0210(r).length).length,total:recipes.length}));
if(initial.version!=='0.2.1'||!initial.title.includes('V0.2.1'))failures.push(`version/title bad ${JSON.stringify(initial)}`);
if(initial.coverage<40)failures.push(`tip coverage unexpectedly low ${JSON.stringify(initial)}`);

await page.evaluate(()=>{state.boardMode='recipes';state.query='番茄炒蛋';state.filter='全部';state.hocOnly=false;board()});
await page.locator('[data-r="r4"]').click();
const tomatoTips=await page.evaluate(()=>({count:document.querySelectorAll('[data-tip-scope="recipe"] .kitchen-tip-row-0210').length,visible:[...document.querySelectorAll('[data-tip-scope="recipe"] .kitchen-tip-row-0210')].filter(x=>getComputedStyle(x).display!=='none').length,text:document.querySelector('[data-tip-scope="recipe"]')?.innerText||'',more:!!document.querySelector('.tips-more-0210'),inputs:document.querySelectorAll('[data-tip-scope="recipe"] input,[data-tip-scope="recipe"] select').length}));
if(tomatoTips.count<2||tomatoTips.count>3||tomatoTips.visible>2||!tomatoTips.text.includes('鸡蛋')||tomatoTips.inputs)failures.push(`recipe tips bad ${JSON.stringify(tomatoTips)}`);
await shot('0201-01-recipe-tips');
if(tomatoTips.more){await page.locator('.tips-more-0210').click();const open=await page.locator('[data-tip-scope="recipe"] .kitchen-tip-row-0210').evaluateAll(xs=>xs.filter(x=>getComputedStyle(x).display!=='none').length);if(open!==tomatoTips.count)failures.push(`more tips did not reveal all: ${open}/${tomatoTips.count}`)}
await page.locator('#backRecipe').click();

// Four shared dishes: tips may explain table context, but must not add per-dish controls.
await page.evaluate(()=>{state.meal.dishes=['r4','r12','r5','r7'];state.meal.servings=3;state.mealView=true;state.mealPage='plan';save();board()});
const portion=await page.evaluate(()=>state.meal.dishes.map(id=>({id,target:recommendedDishServings0200c(recipeById0200(id))})));
if(portion.some(x=>x.target>=3)||portion.some(x=>x.target<2))failures.push(`shared portion regression ${JSON.stringify(portion)}`);
await page.evaluate(()=>recipeModal('r7'));
const mealTip=await page.evaluate(()=>({text:document.querySelector('[data-tip-scope="recipe"]')?.innerText||'',controls:document.querySelectorAll('[data-tip-scope="recipe"] input,[data-tip-scope="recipe"] select,[data-tip-scope="recipe"] button:not(.tips-more-0210)').length}));
if(!mealTip.text.includes('本餐')||mealTip.controls)failures.push(`meal-aware tip missing or interactive ${JSON.stringify(mealTip)}`);
// 青椒 alone must not be treated as a request to make the dish hotter.
if(mealTip.text.includes('喜欢更辣'))failures.push('green pepper created a false spicy tip');
await page.locator('#backRecipe').click();

// Consolidated prep should surface cross-dish hygiene / batching guidance.
await page.evaluate(()=>{state.meal.dishes=['r2','r5','r12','r4'];state.meal.servings=3;state.mealView=true;state.mealPage='prep';state.meal.phase='prep';state.meal.prepChecked={};save();renderMealPrep0200()});
const prep=await page.evaluate(()=>({text:document.querySelector('[data-tip-scope="prep"]')?.innerText||'',count:document.querySelectorAll('[data-tip-scope="prep"] .kitchen-tip-row-0210').length,inputs:document.querySelectorAll('[data-tip-scope="prep"] input,[data-tip-scope="prep"] select').length}));
if(!prep.text.includes('生肉')||!prep.text.includes('菜多时')||prep.count>2||prep.inputs)failures.push(`prep tips bad ${JSON.stringify(prep)}`);
await shot('0201-02-prep-tips');

// Stove guidance is step-specific and only one card is shown.
await page.evaluate(()=>{state.meal.dishes=['r4'];state.meal.completed=[];state.meal.phase='cook';state.scene='stove';state.cook={recipe:'r4',step:0};save();render()});
let stepTip=await page.evaluate(()=>({count:document.querySelectorAll('.kitchen-step-tip-0210').length,text:document.querySelector('.kitchen-step-tip-0210')?.innerText||''}));
if(stepTip.count!==1||!stepTip.text.includes('鸡蛋'))failures.push(`egg step tip bad ${JSON.stringify(stepTip)}`);
await shot('0201-03-step-tip');
await page.evaluate(()=>{state.cook.step=2;save();render()});
stepTip=await page.evaluate(()=>({count:document.querySelectorAll('.kitchen-step-tip-0210').length,text:document.querySelector('.kitchen-step-tip-0210')?.innerText||''}));
if(stepTip.count!==1||!stepTip.text.includes('尝味'))failures.push(`seasoning step tip bad ${JSON.stringify(stepTip)}`);

// Incomplete source records with no executable steps must not receive fabricated advice.
const incomplete=await page.evaluate(()=>{const r=recipes.find(x=>x.source?.incomplete&&!x.steps?.length);return r?{name:r.name,tips:recipeTips0210(r).length}:null});
if(incomplete&&incomplete.tips)failures.push(`incomplete record got fabricated tips ${JSON.stringify(incomplete)}`);

const widths=[];for(const width of [360,390,430]){await page.setViewportSize({width,height:844});await page.evaluate(()=>{state.scene='board';state.mealView=false;state.boardMode='recipes';state.query='';state.filter='全部';state.hocOnly=false;board()});const m=await page.evaluate(()=>({w:innerWidth,sw:document.documentElement.scrollWidth}));widths.push({width,...m});if(m.sw>m.w+2)failures.push(`horizontal overflow ${width}: ${m.sw}/${m.w}`)}
if(runtime.length)failures.push(...runtime);
const report={initial,tomatoTips,portion,mealTip,prep,stepTip,incomplete,widths,runtime,failures};
fs.writeFileSync('ui-screenshots/v0201-audit.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));
await browser.close();if(failures.length)process.exitCode=1;
