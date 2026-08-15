import {chromium} from 'playwright-core';
import fs from 'node:fs';
fs.mkdirSync('ui-screenshots',{recursive:true});
const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_PATH,args:['--no-sandbox','--disable-dev-shm-usage']});
const context=await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:2,locale:'zh-CN'});
const page=await context.newPage();const errors=[];
page.on('pageerror',e=>errors.push('pageerror: '+e.message));page.on('console',m=>{if(m.type()==='error')errors.push('console: '+m.text())});
async function fresh(){await page.goto('http://127.0.0.1:8080/',{waitUntil:'networkidle'});await page.evaluate(()=>localStorage.clear());await page.reload({waitUntil:'networkidle'});}
async function shot(name){await page.waitForTimeout(120);const m=await page.evaluate(()=>({w:innerWidth,sw:document.documentElement.scrollWidth}));if(m.sw>m.w+2)errors.push(`${name}: overflow ${m.sw}/${m.w}`);await page.screenshot({path:`ui-screenshots/${name}.png`,fullPage:false});}
async function finishCurrentToIdle(){while(await page.locator('#next').count())await page.locator('#next').click();await page.locator('#done').click();}
await fresh();await shot('0200-01-board');
await page.evaluate(()=>{state.query='番茄炒蛋';state.boardMode='recipes';board()});await page.locator('[data-r="r4"]').click();await shot('0200-02-recipe-portion');await page.locator('#recipePrimary').click();
await page.evaluate(()=>{state.query='西兰花炒虾仁';board()});await page.locator('[data-r="r12"]').click();await page.locator('#recipePrimary').click();
await page.locator('.meal-bar-0200').click();await shot('0200-03-meal-plan-2p');
await page.locator('#servPlus').click();await page.locator('#servPlus').click();await shot('0200-04-meal-plan-4p');
if(await page.locator('#mealBuyAll').count())await page.locator('#mealBuyAll').click();await page.locator('#mealShopping').click();await shot('0200-05-shopping-scaled');
let guard=0;while(await page.locator('[data-bought]').count()){await page.locator('[data-bought]').first().click();if(++guard>60)throw new Error('shopping guard');}await page.locator('#done').click();
guard=0;while(await page.locator('[data-meal-tool]').count()){await page.locator('[data-meal-tool]').first().click();if(++guard>20)throw new Error('tool guard');}await shot('0200-06-meal-ready');
await page.locator('#mealStartPrep').click();await shot('0200-07-consolidated-prep');guard=0;while(await page.locator('.meal-prep-task:not(.done)').count()){await page.locator('.meal-prep-task:not(.done)').first().click();if(++guard>50)throw new Error('prep guard');}await shot('0200-08-prep-ready');
await page.locator('#startMealCook').click();await shot('0200-09-stove-first');await finishCurrentToIdle();await shot('0200-10-between-dishes');await page.locator('#mealCookNext').click();while(await page.locator('#next').count())await page.locator('#next').click();await shot('0200-11-stove-last');await page.locator('#done').click();await shot('0200-12-whole-meal-finish');

await fresh();const dep=await page.evaluate(()=>{for(const r of recipes){const req=[...(r.ings||[]).map(x=>['food',x[0]]),...(r.season||[]).filter(x=>x[2]).map(x=>['seasoning',x[0]])];for(const [kind,name] of req){const d=dependencyRecipe0200(name);if(d&&d.id!==r.id){addMealDish0200(r.id);state.mealView=true;save();board();return {kind,name}}}}return null});if(dep){await shot('0200-13-buy-or-make');const make=page.locator(`[data-meal-make="${dep.kind}|${dep.name}"]`);if(await make.count()){await make.click();await shot('0200-14-self-make-planned')}}
fs.writeFileSync('ui-screenshots/v0200-walkthrough-report.txt',errors.length?errors.join('\n'):'OK - V0.2.0 meal walkthrough passed\n');console.log(errors.length?errors.join('\n'):'OK');await browser.close();if(errors.length)process.exitCode=1;
