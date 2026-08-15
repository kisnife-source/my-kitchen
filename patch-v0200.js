// V0.2.0 meal planning, portions, acquisition choices and multi-dish cooking
state.version='0.2.0';

const MEAL_DEFAULT_SERVINGS_0200=2;
function blankMeal0200(){return {servings:MEAL_DEFAULT_SERVINGS_0200,dishes:[],support:[],completed:[],prepChecked:{},phase:'plan'};}
if(!state.meal||typeof state.meal!=='object')state.meal=blankMeal0200();
if(!Number.isFinite(state.meal.servings)||state.meal.servings<1)state.meal.servings=MEAL_DEFAULT_SERVINGS_0200;
if(!Array.isArray(state.meal.dishes))state.meal.dishes=[];
if(!Array.isArray(state.meal.support))state.meal.support=[];
if(!Array.isArray(state.meal.completed))state.meal.completed=[];
if(!state.meal.prepChecked||typeof state.meal.prepChecked!=='object')state.meal.prepChecked={};
if(!['plan','prep','cook'].includes(state.meal.phase))state.meal.phase='plan';
if(typeof state.mealView!=='boolean')state.mealView=false;
if(!['plan','prep'].includes(state.mealPage))state.mealPage='plan';

function recipeById0200(id){return recipes.find(r=>r.id===id)||null;}
function mealSupport0200(){return (state.meal.support||[]).filter(x=>x&&recipeById0200(x.id));}
function mealRecipeIds0200(){return [...state.meal.dishes,...mealSupport0200().map(x=>x.id)].filter((id,i,a)=>recipeById0200(id)&&a.indexOf(id)===i);}
function mealRecipes0200(){return mealRecipeIds0200().map(recipeById0200).filter(Boolean);}
function inMeal0200(id){return state.meal.dishes.includes(id)||mealSupport0200().some(x=>x.id===id);}
function isSupport0200(id){return mealSupport0200().some(x=>x.id===id);}
function outputSupport0200(kind,name){return mealSupport0200().find(x=>x.outputKind===kind&&x.outputName===name)||null;}
function recipeBaseServings0200(r){
  if(Number.isFinite(r?.servings)&&r.servings>0)return r.servings;
  if((r?.tags||[]).some(x=>String(x).includes('一人食')))return 1;
  if((r?.ings||[]).some(x=>String(x[1]||'').includes('1人份')))return 1;
  return 2;
}
function cleanNumber0200(n){
  if(!Number.isFinite(n))return '';
  const rounded=Math.round(n*10)/10;
  return Number.isInteger(rounded)?String(rounded):String(rounded).replace(/\.0$/,'');
}
function scaleAmount0200(amount,r,servings=state.meal.servings){
  const s=String(amount??'').trim();if(!s)return '';
  if(/适量|少量|少许|见步骤|按需|按口味|若干|酌量/.test(s))return s;
  const factor=servings/recipeBaseServings0200(r);
  if(Math.abs(factor-1)<0.001)return s;
  if(/^1人份/.test(s))return s.replace(/^1人份/,`${servings}人份`);
  let m=s.match(/^(约)?半(个|颗|根|把|张|盒|包|瓶|杯|碗|勺|汤匙|茶匙)(.*)$/);
  if(m)return `${m[1]||''}${cleanNumber0200(.5*factor)}${m[2]}${m[3]||''}`;
  m=s.match(/^(约)?(\d+(?:\.\d+)?)(g|kg|克|ml|mL|L|升|个|颗|根|片|勺|汤匙|茶匙|杯|碗|盒|包|瓶|张|把|块|份)(.*)$/);
  if(m)return `${m[1]||''}${cleanNumber0200(parseFloat(m[2])*factor)}${m[3]}${m[4]||''}`;
  return s;
}
function amountPart0200(amount){
  const s=String(amount||'').trim();
  const m=s.match(/^(约)?(\d+(?:\.\d+)?)(g|kg|克|ml|mL|L|升|个|颗|根|片|勺|汤匙|茶匙|杯|碗|盒|包|瓶|张|把|块|份)$/);
  return m?{n:parseFloat(m[2]),unit:m[3],approx:!!m[1]}:null;
}
function aggregateAmounts0200(amounts){
  const vals=amounts.filter(Boolean);if(!vals.length)return '';
  const parsed=vals.map(amountPart0200);
  if(parsed.every(Boolean)&&new Set(parsed.map(x=>x.unit)).size===1){
    const n=parsed.reduce((a,b)=>a+b.n,0);return `${parsed.some(x=>x.approx)?'约':''}${cleanNumber0200(n)}${parsed[0].unit}`;
  }
  return [...new Set(vals)].join(' + ');
}
function dependencyRecipe0200(name){
  const same=recipes.filter(r=>r.name===name&&Array.isArray(r.steps)&&r.steps.length&&((r.ings?.length||0)+(r.season?.length||0)>0));
  return same.find(r=>r.cat==='调味配方')||same.find(r=>r.hoc)||same[0]||null;
}
function needIcon0200(kind,name){return kind==='food'?(FOOD[name]||'🥣'):kind==='seasoning'?'🧂':'🍳';}
function mealRequirementData0200(){
  const map=new Map();
  for(const r of mealRecipes0200()){
    for(const [name,amount] of r.ings||[]){
      const key=`food|${name}`;if(!map.has(key))map.set(key,{key,kind:'food',name,uses:[]});
      map.get(key).uses.push({recipeId:r.id,recipeName:r.name,amount:scaleAmount0200(amount,r)});
    }
    for(const [name,amount,required] of r.season||[]){
      if(!required)continue;const key=`seasoning|${name}`;if(!map.has(key))map.set(key,{key,kind:'seasoning',name,uses:[]});
      map.get(key).uses.push({recipeId:r.id,recipeName:r.name,amount:scaleAmount0200(amount,r)});
    }
  }
  const items=[...map.values()].map(x=>{
    const support=outputSupport0200(x.kind,x.name);
    return {...x,amount:aggregateAmounts0200(x.uses.map(u=>u.amount)),owned:has(x.kind,x.name),shopping:inShop(x.kind,x.name),support,dependency:dependencyRecipe0200(x.name)};
  });
  const missing=items.filter(x=>!x.owned&&!x.support);
  const planned=items.filter(x=>!x.owned&&x.support);
  const toolGroups=[];
  const seen=new Set();
  for(const r of mealRecipes0200())for(const group of r.tools||[]){
    const names=[...group].sort();const key=names.join('|');if(seen.has(key))continue;seen.add(key);
    toolGroups.push({key,names,ready:names.some(n=>has('tool',n))});
  }
  return {items,missing,planned,toolGroups,badTools:toolGroups.filter(x=>!x.ready)};
}
function addMealDish0200(id){
  if(!recipeById0200(id))return;
  if(!state.meal.dishes.includes(id))state.meal.dishes.push(id);
  state.meal.completed=state.meal.completed.filter(x=>x!==id);state.meal.phase='plan';save();
}
function addMealSupport0200(r,kind,name){
  if(!r)return;
  state.meal.support=mealSupport0200().filter(x=>!(x.outputKind===kind&&x.outputName===name));
  if(!state.meal.support.some(x=>x.id===r.id&&x.outputKind===kind&&x.outputName===name))state.meal.support.push({id:r.id,outputKind:kind,outputName:name});
  rmShop(kind,name);state.meal.completed=state.meal.completed.filter(x=>x!==r.id);state.meal.phase='plan';save();
}
function removeMealRecipe0200(id){
  state.meal.dishes=state.meal.dishes.filter(x=>x!==id);
  state.meal.support=mealSupport0200().filter(x=>x.id!==id);
  state.meal.completed=state.meal.completed.filter(x=>x!==id);
  for(const key of Object.keys(state.meal.prepChecked||{}))if(key.includes(`|${id}|`))delete state.meal.prepChecked[key];
  if(!state.meal.dishes.length){state.meal.support=[];state.meal.completed=[];state.meal.prepChecked={};state.meal.phase='plan';}
  save();
}
function resetMeal0200(){
  const servings=state.meal.servings||MEAL_DEFAULT_SERVINGS_0200;
  state.meal=blankMeal0200();state.meal.servings=servings;state.mealView=false;state.mealPage='plan';state.cook=null;state.prep=null;save();
}
function syncMealShopping0200(){
  const ids=new Set(mealRecipeIds0200());
  for(const item of state.shopping||[]){
    if(!Array.isArray(item.needs))continue;
    for(const n of item.needs){
      if(!ids.has(n.recipeId))continue;
      const r=recipeById0200(n.recipeId);if(!r)continue;
      const src=item.kind==='food'?(r.ings||[]).find(x=>x[0]===item.name):(r.season||[]).find(x=>x[0]===item.name&&x[2]);
      if(src)n.amount=scaleAmount0200(src[1],r);
    }
  }
  save();
}
function setServings0200(n){state.meal.servings=Math.max(1,Math.min(12,Math.round(n)));syncMealShopping0200();state.meal.prepChecked={};save();}
function addNeedToShopping0200(item){
  for(const use of item.uses)addShop(item.kind,item.name,{recipeId:use.recipeId,amount:use.amount});
  save();
}
function addAllMissingShopping0200(){const d=mealRequirementData0200();d.missing.forEach(addNeedToShopping0200);save();}
function mealPrepTasks0200(){
  const map=new Map();
  for(const r of mealRecipes0200()){
    for(const [name,amount,prep] of r.ings||[]){
      if(outputSupport0200('food',name)&&!has('food',name))continue;
      const action=String(prep||'').trim()||'备好';
      const key=`${name}|${action}`;
      if(!map.has(key))map.set(key,{key,name,action,uses:[],amounts:[]});
      const row=map.get(key);row.uses.push({recipeId:r.id,recipeName:r.name});row.amounts.push(scaleAmount0200(amount,r));
    }
  }
  return [...map.values()].map(x=>({...x,amount:aggregateAmounts0200(x.amounts)}));
}
function mealSortScore0200(r){
  if(isSupport0200(r.id))return -10000-(r.mins||0);
  if(r.cat==='汤炖'||['炖菜','汤','蒸菜','砂锅菜'].includes(r.source?.category))return 1000-(r.mins||0);
  if(r.cat==='主食')return 2000-(r.mins||0);
  if(r.cat==='肉菜')return 3000-(r.mins||0);
  if(r.cat==='半成品'||r.cat==='饮品')return 3500-(r.mins||0);
  if(r.cat==='蛋类')return 4000-(r.mins||0);
  if(r.cat==='素菜')return 5000-(r.mins||0);
  return 3200-(r.mins||0);
}
function mealQueue0200(){return mealRecipes0200().filter(r=>!state.meal.completed.includes(r.id)).sort((a,b)=>mealSortScore0200(a)-mealSortScore0200(b));}
function nextMealRecipe0200(){return mealQueue0200()[0]||null;}
function mealProgress0200(){
  const dishTotal=state.meal.dishes.length,dishDone=state.meal.dishes.filter(id=>state.meal.completed.includes(id)).length;
  const supportTotal=mealSupport0200().length,supportDone=mealSupport0200().filter(x=>state.meal.completed.includes(x.id)).length;
  return {dishTotal,dishDone,supportTotal,supportDone};
}

function mealBar0200(){
  if(state.prep||state.boardMode!=='recipes'&&state.boardMode!=='ingredients')return;
  if(q('.meal-bar-0200'))return;
  const mode=q('.board-mode');if(!mode)return;
  const d=state.meal.dishes.length;
  const bar=document.createElement('button');bar.className=`meal-bar-0200 ${d?'active':'empty'}`;
  bar.innerHTML=`<span class="meal-bar-icon">🍽</span><span class="meal-bar-copy"><b>本餐${d?` · ${d}道`:' · 还没选菜'}</b><small>${d?`${state.meal.servings}人份 · 统一检查、准备和制作`:'选好菜后统一准备'}</small></span><span class="meal-bar-go">${d?'查看':'打开'} ›</span>`;
  bar.onclick=()=>{state.mealView=true;state.mealPage='plan';save();board()};
  mode.insertAdjacentElement('afterend',bar);
}
function mealDishRows0200(){
  return state.meal.dishes.map((id,idx)=>{const r=recipeById0200(id);if(!r)return'';const done=state.meal.completed.includes(id);return `<div class="meal-dish-row"><div class="meal-dish-icon">${r.icon}</div><div class="meal-dish-main"><b>${r.name}</b><small>${done?'已完成':`约${r.mins}分钟${r.hoc?' · 🐔 老乡鸡做法':''}`}</small></div><button class="meal-mini-btn" data-meal-open="${id}">查看</button><button class="meal-remove" data-meal-remove="${id}" aria-label="移出本餐">×</button></div>`}).join('');
}
function supportRows0200(){
  return mealSupport0200().map(s=>{const r=recipeById0200(s.id);if(!r)return'';const done=state.meal.completed.includes(r.id);return `<div class="meal-support-row"><div><b>🔪 ${r.name}</b><small>${done?'已制作完成':`用于替代购买「${s.outputName}」`}</small></div>${done?'<span class="meal-state-ok">✓ 已完成</span>':`<button class="meal-mini-btn" data-support-buy="${s.outputKind}|${s.outputName}">改为购买</button>`}</div>`}).join('');
}
function renderMealPlan0200(){
  const d=mealRequirementData0200();const dishCount=state.meal.dishes.length;
  const missingNew=d.missing.filter(x=>!x.shopping).length;
  const requirementRows=d.missing.map(item=>`<div class="meal-need-row"><div class="meal-need-icon">${needIcon0200(item.kind,item.name)}</div><div class="meal-need-main"><b>${item.name}</b><small>${item.amount||'按菜谱'} · ${item.uses.length>1?`用于${item.uses.length}道/项`:item.uses[0]?.recipeName||''}</small></div>${item.shopping?'<span class="meal-state-wait">待买</span>':`<button class="meal-mini-btn buy" data-meal-buy="${item.key}">加入购物袋</button>`}${item.dependency?`<button class="meal-mini-btn make" data-meal-make="${item.key}">自己做</button>`:''}</div>`).join('');
  const toolRows=d.badTools.map(g=>`<div class="meal-tool-row"><div><b>还缺一组厨具</b><small>任选一个即可</small></div><div class="meal-tool-options">${g.names.map(n=>`<button data-meal-tool="${n}">我有${n}</button>`).join('')}</div></div>`).join('');
  q('#root').innerHTML=`<h2>🔪 菜板 · 本餐</h2>
    <div class="meal-plan-head card"><div><b>🍽 这一顿吃什么</b><small>${dishCount?`${dishCount}道菜 · 按${state.meal.servings}人准备`:'还没有加入菜品'}</small></div><button class="meal-back-select" id="mealBackSelect">继续选菜</button></div>
    <div class="meal-serving-card card"><div><b>用餐人数</b><small>份量会同步到本餐需求和购物袋</small></div><div class="meal-stepper"><button id="servMinus">−</button><strong>${state.meal.servings}<small>人</small></strong><button id="servPlus">＋</button></div></div>
    <div class="meal-scale-note">默认菜谱按2人份估算；“适量 / 见步骤”等保持原菜谱写法。</div>
    ${dishCount?`<div class="meal-section"><div class="meal-section-title"><b>上桌菜品</b><small>${dishCount}道</small></div><div class="meal-list">${mealDishRows0200()}</div></div>`:'<div class="card empty">从菜谱详情点“加入本餐”。一道菜也是一顿饭，多道菜会自动合并材料和准备任务。</div>'}
    ${mealSupport0200().length?`<div class="meal-section"><div class="meal-section-title"><b>提前制作</b><small>${mealSupport0200().length}项</small></div><div class="meal-list">${supportRows0200()}</div></div>`:''}
    ${dishCount?`<div class="meal-summary-card card ${d.missing.length||d.badTools.length?'blocked':'ready'}"><div class="meal-summary-top"><div><b>${d.missing.length||d.badTools.length?'还有条件没解决':'这顿需要的都齐了'}</b><small>${d.missing.length?`缺${d.missing.length}项材料`:d.planned.length?`${d.planned.length}项会提前自制`:'材料已齐'}${d.badTools.length?` · 缺${d.badTools.length}组厨具`:''}</small></div><span>${d.missing.length+d.badTools.length?d.missing.length+d.badTools.length:'✓'}</span></div></div>`:''}
    ${d.missing.length?`<div class="meal-section"><div class="meal-section-title"><b>缺少的材料</b><small>可以买，也可选择已有配方自己做</small></div><div class="meal-list">${requirementRows}</div>${missingNew?`<button class="meal-wide-secondary" id="mealBuyAll">缺少的全部加入购物袋（${missingNew}）</button>`:''}</div>`:''}
    ${d.badTools.length?`<div class="meal-section"><div class="meal-section-title"><b>厨具确认</b><small>不满足会影响制作</small></div><div class="meal-list">${toolRows}</div></div>`:''}
    ${dishCount?`<div class="meal-plan-actions"><button class="secondary" id="mealShopping">购物袋${state.shopping.length?`（${state.shopping.length}）`:''}</button><button class="primary" id="mealStartPrep" ${d.missing.length||d.badTools.length?'disabled':''}>开始集中准备</button></div>`:''}`;
  q('#mealBackSelect').onclick=()=>{state.mealView=false;save();board()};
  q('#servMinus').onclick=()=>{setServings0200(state.meal.servings-1);renderMealPlan0200()};
  q('#servPlus').onclick=()=>{setServings0200(state.meal.servings+1);renderMealPlan0200()};
  qa('[data-meal-open]').forEach(b=>b.onclick=()=>recipeModal(b.dataset.mealOpen));
  qa('[data-meal-remove]').forEach(b=>b.onclick=()=>{removeMealRecipe0200(b.dataset.mealRemove);renderMealPlan0200()});
  qa('[data-meal-buy]').forEach(b=>b.onclick=()=>{const item=mealRequirementData0200().items.find(x=>x.key===b.dataset.mealBuy);if(item){addNeedToShopping0200(item);renderMealPlan0200()}});
  qa('[data-meal-make]').forEach(b=>b.onclick=()=>{const item=mealRequirementData0200().items.find(x=>x.key===b.dataset.mealMake);if(item?.dependency){addMealSupport0200(item.dependency,item.kind,item.name);renderMealPlan0200()}});
  qa('[data-support-buy]').forEach(b=>b.onclick=()=>{const [kind,name]=b.dataset.supportBuy.split('|');const item=mealRequirementData0200().items.find(x=>x.kind===kind&&x.name===name);state.meal.support=mealSupport0200().filter(x=>!(x.outputKind===kind&&x.outputName===name));if(item)addNeedToShopping0200({...item,support:null});save();renderMealPlan0200()});
  qa('[data-meal-tool]').forEach(b=>b.onclick=()=>{have('tool',b.dataset.mealTool);renderMealPlan0200()});
  const buyAll=q('#mealBuyAll');if(buyAll)buyAll.onclick=()=>{addAllMissingShopping0200();renderMealPlan0200()};
  const shop=q('#mealShopping');if(shop)shop.onclick=()=>shoppingModal();
  const start=q('#mealStartPrep');if(start)start.onclick=()=>{state.meal.phase='prep';state.mealPage='prep';state.meal.prepChecked={};save();renderMealPrep0200()};
}
function renderMealPrep0200(){
  const tasks=mealPrepTasks0200();const done=tasks.filter(t=>state.meal.prepChecked[t.key]).length;const complete=done===tasks.length;
  q('#root').innerHTML=`<h2>🔪 集中准备</h2><div class="meal-prep-head card"><div><b>先把这一桌需要的东西一起准备好</b><small>${state.meal.dishes.length}道菜 · ${state.meal.servings}人份 · ${done}/${tasks.length}</small></div><button class="meal-back-select" id="prepBackPlan">返回本餐</button></div>
    ${mealSupport0200().length?`<div class="meal-prep-support-note">有 ${mealSupport0200().length} 项“自己做”的配方，会在灶台顺序中优先制作。</div>`:''}
    <div class="meal-prep-list">${tasks.length?tasks.map(t=>`<button class="meal-prep-task ${state.meal.prepChecked[t.key]?'done':''}" data-meal-prep="${encodeURIComponent(t.key)}"><span class="meal-prep-check">${state.meal.prepChecked[t.key]?'✓':'○'}</span><span class="meal-prep-copy"><b>${FOOD[t.name]||'🥣'} ${t.name}${t.amount?` · ${t.amount}`:''}</b><small>${t.action}${t.uses.length>1?` · 用于${t.uses.length}道/项`:''}</small></span></button>`).join(''):'<div class="card empty">这顿饭没有额外洗切任务，可以直接进入灶台。</div>'}</div>
    <div class="meal-prep-footer"><div class="meal-prep-status ${complete?'ready':''}">${complete?'准备完成，可以开始做饭。':`还差 ${tasks.length-done} 项`}</div><button class="primary" id="startMealCook" ${complete?'':'disabled'}>开始做饭</button></div>`;
  q('#prepBackPlan').onclick=()=>{state.mealPage='plan';state.meal.phase='plan';save();renderMealPlan0200()};
  qa('[data-meal-prep]').forEach(b=>b.onclick=()=>{const key=decodeURIComponent(b.dataset.mealPrep);state.meal.prepChecked[key]=!state.meal.prepChecked[key];save();renderMealPrep0200()});
  q('#startMealCook').onclick=()=>{const next=nextMealRecipe0200();state.meal.phase='cook';state.mealView=false;state.mealPage='plan';state.scene='stove';state.prep=null;state.cook=next?{recipe:next.id,step:0}:null;save();render()};
}

const boardV0200Base=board;
board=function(){
  if(!state.prep&&state.mealView){return state.mealPage==='prep'?renderMealPrep0200():renderMealPlan0200();}
  boardV0200Base();
  if(!state.prep)mealBar0200();
};

const recipeModalV0200Base=recipeModal;
recipeModal=function(id){
  recipeModalV0200Base(id);const r=recipeById0200(id);if(!r)return;
  qa('[data-recipe-item]').forEach(b=>{const [kind,name]=b.dataset.recipeItem.split('|');const src=kind==='food'?(r.ings||[]).find(x=>x[0]===name):(r.season||[]).find(x=>x[0]===name);const amt=b.querySelector('.chip-amount');if(src&&amt)amt.textContent=scaleAmount0200(src[1],r)});
  const title=q('.recipe-title-block,.recipe-title-stack');if(title&&!title.querySelector('.meal-portion-inline'))title.insertAdjacentHTML('beforeend',`<div class="meal-portion-inline">按本餐 <b>${state.meal.servings}人份</b> 显示用量</div>`);
  const primary=q('#recipePrimary');if(primary){
    const supportMode=r.cat==='调味配方';const added=supportMode?mealSupport0200().some(x=>x.id===id):state.meal.dishes.includes(id);
    primary.disabled=false;primary.textContent=added?'查看本餐':supportMode?'作为提前制作加入本餐':'加入本餐';
    primary.onclick=()=>{
      if(added){close();state.mealView=true;state.mealPage='plan';state.scene='board';save();render();return}
      if(supportMode){state.meal.support.push({id:r.id,outputKind:'seasoning',outputName:r.name});state.meal.support=mealSupport0200();}
      else addMealDish0200(id);
      state.meal.phase='plan';save();close();render();toast(supportMode?'已加入本餐 · 提前制作':'已加入本餐');
    };
  }
  const status=q('.recipe-status-line');if(status){status.textContent=inMeal0200(id)?'已加入本餐，可在本餐中统一处理缺少、份量和准备。':'检查完这道菜后，加入本餐统一安排。';status.classList.remove('blocked');}
};

const finishMealModalV0200Base=finishMealModal;
function finishWholeMeal0200(){
  const req=mealRequirementData0200();const candidates=req.items.filter(x=>x.owned);const uniq=new Map(candidates.map(x=>[x.key,x]));
  if(!uniq.size){resetMeal0200();state.scene='board';render();toast('这一顿做好啦 🎉');return}
  const selected=new Set();
  q('#modal').innerHTML=`<div class="modal"><div class="sheet finish-sheet"><div class="sheet-handle"></div><div class="sheet-head"><div class="title"><b>🍽 这一顿做好啦</b><small>刚好用完的点一下，其他会继续留在厨房。</small></div></div><div class="used-up-grid">${[...uniq.values()].map(x=>`<button class="used-up-chip" data-meal-used="${x.key}">${needIcon0200(x.kind,x.name)} ${x.name}</button>`).join('')}</div><div class="sheet-footer"><div class="dual"><button class="secondary" id="mealNoneUsed">都还有</button><button class="primary" id="mealConfirmUsed" disabled>确认用完</button></div></div></div></div>`;
  qa('[data-meal-used]').forEach(b=>b.onclick=()=>{const k=b.dataset.mealUsed;selected.has(k)?selected.delete(k):selected.add(k);b.classList.toggle('on',selected.has(k));q('#mealConfirmUsed').disabled=!selected.size});
  const finish=()=>{for(const key of selected){const x=uniq.get(key);if(x)missing(x.kind,x.name)}resetMeal0200();state.scene='board';close();render();toast('开饭啦 🎉')};
  q('#mealNoneUsed').onclick=()=>{selected.clear();finish()};q('#mealConfirmUsed').onclick=finish;
}
finishMealModal=function(r){
  if(state.meal.phase!=='cook'||!inMeal0200(r.id))return finishMealModalV0200Base(r);
  if(!state.meal.completed.includes(r.id))state.meal.completed.push(r.id);
  const support=mealSupport0200().find(x=>x.id===r.id);if(support)have(support.outputKind,support.outputName);
  state.cook=null;save();
  const next=nextMealRecipe0200();
  if(!next){finishWholeMeal0200();return}
  state.scene='stove';render();toast(`${r.name}完成 · 可以继续下一道`);
};

const stoveV0200Base=stove;
function renderMealStoveIdle0200(){
  const p=mealProgress0200();const next=nextMealRecipe0200();const queue=mealQueue0200();
  q('#root').innerHTML=`<h2>🍳 本餐制作</h2><div class="meal-stove-summary card"><div><b>上桌菜 ${p.dishDone}/${p.dishTotal}</b><small>${p.supportTotal?`提前制作 ${p.supportDone}/${p.supportTotal} · `:''}${queue.length?`还剩${queue.length}项`:'全部完成'}</small></div></div>${next?`<div class="card meal-next-card"><small>下一项建议</small><b>${next.icon} ${next.name}</b><p>${isSupport0200(next.id)?'先完成这项自制材料，再继续上桌菜。':`约${next.mins}分钟 · ${next.cat}`}</p><button class="primary" id="mealCookNext">开始${isSupport0200(next.id)?'制作':'下一道'}</button></div>`:''}<div class="meal-queue-list">${queue.slice(0,8).map((r,i)=>`<div class="meal-queue-row ${i===0?'next':''}"><span>${i+1}</span><div><b>${r.name}</b><small>${isSupport0200(r.id)?'提前制作':`${r.cat} · 约${r.mins}分钟`}</small></div></div>`).join('')}</div><button class="secondary meal-back-plan" id="mealBackPlanFromStove">查看本餐</button>`;
  const n=q('#mealCookNext');if(n)n.onclick=()=>{state.cook={recipe:next.id,step:0};save();render()};
  q('#mealBackPlanFromStove').onclick=()=>{state.scene='board';state.mealView=true;state.mealPage='plan';save();render()};
}
stove=function(){
  if(state.meal.phase==='cook'&&state.meal.dishes.length){
    if(!state.cook)return renderMealStoveIdle0200();
    stoveV0200Base();
    const r=recipeById0200(state.cook?.recipe);if(!r)return;
    const p=mealProgress0200();const pre=q('.preflight');
    if(pre&&!q('.meal-cook-progress'))pre.insertAdjacentHTML('beforebegin',`<div class="meal-cook-progress"><b>${isSupport0200(r.id)?'提前制作':'本餐'} · ${r.name}</b><span>上桌菜 ${p.dishDone}/${p.dishTotal}${p.supportTotal?` · 准备 ${p.supportDone}/${p.supportTotal}`:''}</span></div>`);
    return;
  }
  stoveV0200Base();
};

save();render();
