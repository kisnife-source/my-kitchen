import { chromium } from 'playwright-core';
import fs from 'node:fs';

fs.mkdirSync('ui-screenshots',{recursive:true});
const browser=await chromium.launch({
  headless:true,
  executablePath:process.env.CHROME_PATH,
  args:['--no-sandbox','--disable-dev-shm-usage']
});
const context=await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:2,locale:'zh-CN'});
const page=await context.newPage();
const errors=[];
page.on('pageerror',e=>errors.push('pageerror: '+e.message));
page.on('console',m=>{if(m.type()==='error')errors.push('console: '+m.text())});

async function shot(name){
  await page.waitForTimeout(180);
  const metrics=await page.evaluate(()=>({w:innerWidth,scrollW:document.documentElement.scrollWidth,h:innerHeight,scrollH:document.documentElement.scrollHeight}));
  if(metrics.scrollW>metrics.w+2)errors.push(`${name}: horizontal overflow ${metrics.scrollW}/${metrics.w}`);
  await page.screenshot({path:`ui-screenshots/${name}.png`,fullPage:false});
}

await page.goto('http://127.0.0.1:8080/',{waitUntil:'networkidle'});
await page.evaluate(()=>localStorage.clear());
await page.reload({waitUntil:'networkidle'});
await shot('01-board');

await page.locator('[data-r="r28"]').click();
await shot('02-recipe-detail');
await page.locator('#backRecipe').click();

await page.locator('[data-board-mode="ingredients"]').click();
await shot('03-ingredient-browser');
await page.locator('#foodSearch').fill('虾仁');
await page.waitForTimeout(120);
await shot('04-ingredient-search');
await page.locator('[data-match-food="虾仁"]').click();
await shot('05-ingredient-match');

await page.locator('[data-s="fridge"]').click();
await page.locator('[data-manage="food"]').click();
await shot('06-fridge-manage');
await page.locator('#manageSearch').fill('莲藕');
await page.waitForTimeout(100);
await shot('07-fridge-search');
await page.locator('#back').click();

await page.locator('[data-s="board"]').click();
await page.locator('[data-board-mode="recipes"]').click();
await page.locator('#search').fill('虾仁滑蛋');
await page.locator('[data-r="r63"]').click();
await page.locator('#markAllRequired').click();
await page.locator('[data-recipe-tool="平底锅"]').click();
await shot('08-recipe-ready');
await page.locator('#recipePrimary').click();
await shot('09-prep');
for(const el of await page.locator('.prep').all())await el.click();
await shot('10-prep-ready');
await page.locator('#cook').click();
await shot('11-stove-first');
for(let i=0;i<3;i++){
  const next=page.locator('#next');
  if(await next.count())await next.click();
}
await shot('12-stove-last');
const done=page.locator('#done');
if(await done.count()){
  await done.click();
  await shot('13-finish-check');
}

fs.writeFileSync('ui-screenshots/report.txt',errors.length?errors.join('\n'):'OK - no page errors or horizontal overflow detected\n');
await browser.close();
if(errors.length){
  console.error(errors.join('\n'));
  process.exitCode=1;
}
