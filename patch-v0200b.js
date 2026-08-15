// V0.2.0 persistence + shopping return refinements
state.version='0.2.0';
const pre0200b=window.__MK_PRELOAD||null;
if(pre0200b?.meal&&typeof pre0200b.meal==='object'){
  state.meal={...blankMeal0200(),...pre0200b.meal};
  if(!Number.isFinite(state.meal.servings)||state.meal.servings<1)state.meal.servings=MEAL_DEFAULT_SERVINGS_0200;
  state.meal.dishes=Array.isArray(state.meal.dishes)?state.meal.dishes.filter((id,i,a)=>recipes.some(r=>r.id===id)&&a.indexOf(id)===i):[];
  state.meal.support=Array.isArray(state.meal.support)?state.meal.support.filter((x,i,a)=>x&&recipes.some(r=>r.id===x.id)&&a.findIndex(y=>y&&y.id===x.id&&y.outputKind===x.outputKind&&y.outputName===x.outputName)===i):[];
  state.meal.completed=Array.isArray(state.meal.completed)?state.meal.completed.filter((id,i,a)=>recipes.some(r=>r.id===id)&&a.indexOf(id)===i):[];
  if(!state.meal.prepChecked||typeof state.meal.prepChecked!=='object')state.meal.prepChecked={};
  if(!['plan','prep','cook'].includes(state.meal.phase))state.meal.phase='plan';
}
if(typeof pre0200b?.mealView==='boolean')state.mealView=pre0200b.mealView;
if(['plan','prep'].includes(pre0200b?.mealPage))state.mealPage=pre0200b.mealPage;

const shoppingModalV0200Base=shoppingModal;
shoppingModal=function(returnId=null){
  const fromMeal=!returnId&&state.mealView;
  shoppingModalV0200Base(returnId);
  if(!fromMeal)return;
  const backToMeal=()=>{close();renderMealPlan0200()};
  const x=q('#x'),back=q('#back'),done=q('#done');
  if(x)x.onclick=backToMeal;
  if(back)back.onclick=backToMeal;
  if(done)done.onclick=()=>{toast('购物袋已保存');backToMeal()};
};

save();render();
