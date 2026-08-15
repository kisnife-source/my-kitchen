// V0.2.0 portion model correction: diners describe the whole table, not every dish.
// Shared dishes split a table-level portion budget; staples/drinks use their own pools.

function roundHalf0200c(n){return Math.round(n*2)/2;}
function portionGroup0200c(r){
  if(!r)return 'shared';
  if(isSupport0200(r.id)||r.cat==='调味配方')return 'support';
  if(r.cat==='主食')return 'staple';
  if(r.cat==='饮品')return 'drink';
  return 'shared';
}
function portionWeight0200c(r){
  if(!r)return 1;
  if(r.cat==='肉菜')return 1.15;
  if(r.cat==='素菜')return .85;
  if(r.cat==='蛋类')return .9;
  if(r.cat==='汤炖')return 1;
  return 1;
}
function mealPoolRecipes0200c(r){
  const group=portionGroup0200c(r);
  if(group==='support')return [r];
  const list=(state.meal.dishes||[]).map(recipeById0200).filter(Boolean);
  if(r&&!list.some(x=>x.id===r.id))list.push(r);
  return list.filter(x=>portionGroup0200c(x)===group);
}
function recommendedDishServings0200c(r){
  if(!r)return state.meal.servings||MEAL_DEFAULT_SERVINGS_0200;
  const diners=Math.max(1,state.meal.servings||MEAL_DEFAULT_SERVINGS_0200);
  const group=portionGroup0200c(r);
  if(group==='support')return recipeBaseServings0200(r);
  const pool=mealPoolRecipes0200c(r);
  if(pool.length<=1)return diners;
  const sum=pool.reduce((n,x)=>n+portionWeight0200c(x),0)||1;
  const budget=diners*(group==='shared'?2:1);
  const raw=budget*portionWeight0200c(r)/sum;
  // Shared dishes should not be shrunk below the source recipe's practical base plate.
  const floor=group==='shared'?Math.min(diners,recipeBaseServings0200(r)):1;
  return Math.max(floor,Math.min(diners,roundHalf0200c(raw)));
}
function portionLabel0200c(r){
  const n=recommendedDishServings0200c(r);
  const diners=state.meal.servings||MEAL_DEFAULT_SERVINGS_0200;
  if(portionGroup0200c(r)==='support')return '按原配方一次';
  return n===diners?`建议${cleanNumber0200(n)}人份`:`建议${cleanNumber0200(n)}人份 · ${diners}人共享`;
}

scaleAmount0200=function(amount,r,servings){
  const s=String(amount??'').trim();if(!s)return '';
  if(/适量|少量|少许|见步骤|按需|按口味|若干|酌量/.test(s))return s;
  const target=Number.isFinite(servings)?servings:recommendedDishServings0200c(r);
  const factor=target/recipeBaseServings0200(r);
  if(Math.abs(factor-1)<0.001)return s;
  if(/^1人份/.test(s))return s.replace(/^1人份/,`${cleanNumber0200(target)}人份`);
  let m=s.match(/^(约)?半(个|颗|根|把|张|盒|包|瓶|杯|碗|勺|汤匙|茶匙)(.*)$/);
  if(m)return `${m[1]||''}${cleanNumber0200(.5*factor)}${m[2]}${m[3]||''}`;
  m=s.match(/^(约)?(\d+(?:\.\d+)?)(g|kg|克|ml|mL|L|升|个|颗|根|片|勺|汤匙|茶匙|杯|碗|盒|包|瓶|张|把|块|份)(.*)$/);
  if(m)return `${m[1]||''}${cleanNumber0200(parseFloat(m[2])*factor)}${m[3]}${m[4]||''}`;
  return s;
};

mealDishRows0200=function(){
  return state.meal.dishes.map(id=>{
    const r=recipeById0200(id);if(!r)return'';const done=state.meal.completed.includes(id);
    return `<div class="meal-dish-row"><div class="meal-dish-icon">${r.icon}</div><div class="meal-dish-main"><b>${r.name}</b><small>${done?'已完成':`${portionLabel0200c(r)} · 约${r.mins}分钟${r.hoc?' · 🐔 老乡鸡做法':''}`}</small></div><button class="meal-mini-btn" data-meal-open="${id}">查看</button><button class="meal-remove" data-meal-remove="${id}" aria-label="移出本餐">×</button></div>`;
  }).join('');
};

const renderMealPlan0200BeforePortionFix=renderMealPlan0200;
renderMealPlan0200=function(){
  renderMealPlan0200BeforePortionFix();
  const head=q('.meal-plan-head small');if(head&&state.meal.dishes.length)head.textContent=`${state.meal.dishes.length}道菜 · ${state.meal.servings}人用餐`;
  const servingNote=q('.meal-serving-card small');if(servingNote)servingNote.textContent='人数决定整桌总量；多道菜会自动分摊每道建议份量';
  const scaleNote=q('.meal-scale-note');if(scaleNote)scaleNote.textContent='共享菜按整桌总量自动分摊，并保留菜谱的基础成菜份量；主食和饮品单独计算。';
};

const renderMealPrep0200BeforePortionFix=renderMealPrep0200;
renderMealPrep0200=function(){
  renderMealPrep0200BeforePortionFix();
  const sub=q('.meal-prep-head small');if(sub)sub.textContent=sub.textContent.replace(`${state.meal.servings}人份`,`${state.meal.servings}人用餐`);
};

const mealBar0200BeforePortionFix=mealBar0200;
mealBar0200=function(){
  mealBar0200BeforePortionFix();
  const small=q('.meal-bar-0200 .meal-bar-copy small');
  if(small&&state.meal.dishes.length)small.textContent=`${state.meal.servings}人用餐 · 自动分配每道份量`;
};

const recipeModal0200BeforePortionFix=recipeModal;
recipeModal=function(id){
  recipeModal0200BeforePortionFix(id);
  const r=recipeById0200(id);if(!r)return;
  const note=q('.meal-portion-inline');
  if(note)note.innerHTML=`${state.meal.servings}人用餐 · 本菜 <b>${portionLabel0200c(r)}</b>`;
};

syncMealShopping0200();
save();render();
