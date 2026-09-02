// V0.4.6 move the selected-meal workflow from Board to Stove.
// UI term: “今日菜单” — Board chooses dishes, Stove owns the cooking list and execution.
state.version='0.4.6';

function todayMenuDishes0406(){
  return (state.meal?.dishes||[]).map(recipeById0200).filter(Boolean);
}
function todayMenuEstimate0406(){
  const rows=todayMenuDishes0406();
  return rows.reduce((sum,r)=>sum+(Number(r.mins)||0),0);
}
function todayMenuRequirement0406(){
  try{return mealRequirementData0200()}catch(e){return {missing:[],badTools:[],planned:[],items:[]}}
}
function todayMenuDishRows0406(){
  return todayMenuDishes0406().map((r,i)=>{
    const done=(state.meal.completed||[]).includes(r.id);
    return `<div class="today-dish-0406 ${done?'done':''}">
      <span class="today-dish-index-0406">${done?'✓':i+1}</span>
      <div class="today-dish-copy-0406">
        <b>${r.icon||'🍽'} ${r.name}</b>
        <small>${done?'已完成':`${r.cat||'菜品'} · 约 ${r.mins||'--'} 分钟`}</small>
      </div>
      <button type="button" class="today-dish-open-0406" data-menu-open-0406="${r.id}">查看</button>
      ${state.meal.phase==='plan'?`<button type="button" class="today-dish-remove-0406" data-menu-remove-0406="${r.id}" aria-label="从今日菜单移除">×</button>`:''}
    </div>`;
  }).join('');
}

function bindTodayMenu0406(){
  qa('[data-menu-open-0406]').forEach(btn=>btn.onclick=()=>recipeModal(btn.getAttribute('data-menu-open-0406')));
  qa('[data-menu-remove-0406]').forEach(btn=>btn.onclick=()=>{
    removeMealRecipe0200(btn.getAttribute('data-menu-remove-0406'));
    stove();
    setChrome040();
  });
}

function renderTodayStove0406(){
  const dishes=todayMenuDishes0406();
  const req=todayMenuRequirement0406();
  const servings=state.meal.servings||2;
  const missing=req.missing||[], badTools=req.badTools||[];
  const blocked=missing.length+badTools.length;
  const total=todayMenuEstimate0406();

  if(!dishes.length){
    q('#root').innerHTML=`<div class="stove-home-0406 empty-state-0406">
      <div class="stove-title-0406"><div><h2>🍳 灶台</h2><p>今天准备做什么</p></div></div>
      <section class="stove-empty-card-0406">
        <div class="stove-empty-icon-0406">🍽</div>
        <b>今天还没选菜</b>
        <p>去菜板挑几道菜，加入“今日菜单”后都会集中显示在这里。</p>
        <button type="button" class="primary" id="stovePickDishes0406">去菜板选菜</button>
      </section>
    </div>`;
    q('#stovePickDishes0406').onclick=()=>go('board');
    return;
  }

  q('#root').innerHTML=`<div class="stove-home-0406">
    <div class="stove-title-0406">
      <div><h2>🍳 今日菜单</h2><p>今天要做的菜都在这里</p></div>
      <button type="button" id="stoveAddDish0406" class="stove-add-0406">＋ 加菜</button>
    </div>

    <section class="today-summary-0406">
      <div><b>${dishes.length}</b><small>道菜</small></div>
      <div><b>${servings}</b><small>人份</small></div>
      <div><b>${total||'--'}</b><small>分钟合计</small></div>
      <div class="${blocked?'warn':'ready'}"><b>${blocked||'✓'}</b><small>${blocked?'待确认':'材料齐'}</small></div>
    </section>

    <section class="today-menu-card-0406">
      <div class="today-section-head-0406">
        <div><b>今天要做</b><small>${dishes.length} 道菜</small></div>
        <div class="today-serving-0406"><button id="menuServMinus0406">−</button><span>${servings}人</span><button id="menuServPlus0406">＋</button></div>
      </div>
      <div class="today-dishes-0406">${todayMenuDishRows0406()}</div>
    </section>

    <section class="today-ready-0406 ${blocked?'blocked':'ready'}">
      <div>
        <b>${blocked?'还需要确认一下':'可以开始准备了'}</b>
        <small>${missing.length?`缺 ${missing.length} 项材料`:''}${missing.length&&badTools.length?' · ':''}${badTools.length?`缺 ${badTools.length} 组厨具`:(!missing.length?'食材、调味料和厨具已满足':'')}</small>
      </div>
      <span>${blocked?blocked:'✓'}</span>
    </section>

    ${missing.length?`<section class="today-detail-0406">
      <div class="today-section-head-0406"><div><b>缺少的材料</b><small>可以加入购物清单</small></div></div>
      <div class="today-missing-0406">
        ${missing.slice(0,8).map(item=>`<div><span>${needIcon0200(item.kind,item.name)}</span><b>${item.name}</b><small>${item.amount||'按菜谱'}</small>${item.shopping?'<i>待买</i>':`<button type="button" data-menu-buy-0406="${encodeURIComponent(item.key)}">加入购物</button>`}</div>`).join('')}
      </div>
      ${missing.length>8?`<p class="today-more-0406">还有 ${missing.length-8} 项未显示</p>`:''}
    </section>`:''}

    ${badTools.length?`<section class="today-detail-0406">
      <div class="today-section-head-0406"><div><b>厨具确认</b><small>每组任选一种即可</small></div></div>
      <div class="today-tools-0406">
        ${badTools.map((g,idx)=>`<div><small>第 ${idx+1} 组</small><span>${g.names.map(n=>`<button type="button" data-menu-tool-0406="${encodeURIComponent(n)}">我有 ${n}</button>`).join('')}</span></div>`).join('')}
      </div>
    </section>`:''}

    <div class="today-actions-0406">
      <button type="button" class="secondary" id="menuShopping0406">购物清单${state.shopping.length?`（${state.shopping.length}）`:''}</button>
      <button type="button" class="primary" id="menuStartPrep0406" ${blocked?'disabled':''}>去菜板集中准备</button>
    </div>
  </div>`;

  q('#stoveAddDish0406').onclick=()=>go('board');
  q('#menuServMinus0406').onclick=()=>{setServings0200(servings-1);stove();setChrome040()};
  q('#menuServPlus0406').onclick=()=>{setServings0200(servings+1);stove();setChrome040()};
  q('#menuShopping0406').onclick=()=>shoppingModal();
  q('#menuStartPrep0406').onclick=()=>{
    state.meal.phase='prep';
    state.mealPage='prep';
    state.mealView=true;
    state.meal.prepChecked={};
    state.scene='board';
    save();
    render();
  };

  qa('[data-menu-buy-0406]').forEach(btn=>btn.onclick=()=>{
    const key=decodeURIComponent(btn.getAttribute('data-menu-buy-0406')||'');
    const item=mealRequirementData0200().items.find(x=>x.key===key);
    if(item){addNeedToShopping0200(item);stove();setChrome040()}
  });
  qa('[data-menu-tool-0406]').forEach(btn=>btn.onclick=()=>{
    have('tool',decodeURIComponent(btn.getAttribute('data-menu-tool-0406')||''));
    stove();setChrome040();
  });
  bindTodayMenu0406();
}

// The old Board “本餐” strip is deliberately removed.
mealBar0200=function(){};

const boardV0406Base=board;
board=function(){
  // Legacy saved state that tries to open the old meal-plan screen now goes to Stove.
  if(state.mealView&&!state.prep&&state.meal.phase!=='prep'){
    state.mealView=false;
    state.scene='stove';
    save();
    return stove();
  }
  return boardV0406Base();
};

const recipeModalV0406Base=recipeModal;
recipeModal=function(id){
  recipeModalV0406Base(id);
  const r=recipeById0200(id);if(!r)return;
  const supportMode=r.cat==='调味配方';
  const added=supportMode?mealSupport0200().some(x=>x.id===id):(state.meal.dishes||[]).includes(id);

  const portion=q('.meal-portion-inline');
  if(portion)portion.innerHTML=`按今日菜单 <b>${state.meal.servings||2}人份</b> 显示用量`;

  const status=q('.recipe-status-line');
  if(status)status.textContent=added?'已加入今日菜单，可到灶台统一查看和准备。':'加入今日菜单后，会在灶台集中查看今天要做的菜。';

  const primary=q('#recipePrimary');
  if(!primary)return;
  primary.disabled=false;
  primary.textContent=added?'查看今日菜单':supportMode?'加入今日菜单 · 提前制作':'加入今日菜单';
  primary.onclick=()=>{
    if(added){
      close();
      state.mealView=false;
      state.scene='stove';
      save();
      render();
      return;
    }
    if(supportMode){
      state.meal.support.push({id:r.id,outputKind:'seasoning',outputName:r.name});
      state.meal.support=mealSupport0200();
    }else addMealDish0200(id);
    state.meal.phase='plan';
    state.mealView=false;
    save();
    close();
    toast('已加入今日菜单');
    if(state.scene==='stove')render();
  };
};

const stoveV0406Base=stove;
stove=function(){
  // During actual cooking keep the existing step-by-step cooking mode.
  if(state.meal?.phase==='cook'&&state.meal?.dishes?.length){
    stoveV0406Base();
    const progress=q('.meal-cook-progress b');
    if(progress)progress.textContent=progress.textContent.replace(/^本餐\s*·/,'今日菜单 ·');
    const back=q('#mealBackPlanFromStove');
    if(back){
      back.textContent='查看今日菜单';
      back.onclick=()=>{state.meal.phase='plan';state.cook=null;save();stove();setChrome040()};
    }
    return;
  }
  renderTodayStove0406();
};

// Prep still physically belongs to the chopping-board scene, but returns to Stove's 今日菜单.
const renderMealPrepV0406Base=renderMealPrep0200;
renderMealPrep0200=function(){
  renderMealPrepV0406Base();
  const title=q('#root h2');if(title)title.textContent='🔪 今日菜单 · 集中准备';
  const back=q('#prepBackPlan');
  if(back){
    back.textContent='返回今日菜单';
    back.onclick=()=>{
      state.mealPage='plan';
      state.meal.phase='plan';
      state.mealView=false;
      state.scene='stove';
      save();
      render();
    };
  }
};

// Home's existing “这一顿” continuation now points to 今日菜单 on Stove.
const homeV0406Base=home040;
home040=function(){
  homeV0406Base();
  if(!state.cook&&(state.meal?.dishes||[]).length){
    const card=q('.continue-040.soft');
    if(card){
      const label=card.querySelector('small');if(label)label.textContent='今日菜单';
      const btn=card.querySelector('button');
      if(btn){btn.textContent='查看菜单';btn.onclick=()=>go('stove')}
    }
  }
};

const setChromeV0406Base=setChrome040;
setChrome040=function(){
  setChromeV0406Base();
  const stoveBtn=q('.nav button[data-s="stove"]');
  if(stoveBtn){
    let badge=stoveBtn.querySelector('.nav-menu-count-0406');
    const n=(state.meal?.dishes||[]).filter(id=>!(state.meal.completed||[]).includes(id)).length;
    if(n){
      if(!badge){badge=document.createElement('b');badge.className='nav-menu-count-0406';stoveBtn.appendChild(badge)}
      badge.textContent=n;
    }else if(badge)badge.remove();
  }
};

save();
render();
