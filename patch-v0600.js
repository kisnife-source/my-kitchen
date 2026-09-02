// V0.6.0 — main interface refactor focused on speed, clarity and one-task-per-screen.
state.version='0.6.0';

function esc0600(v=''){
  return String(v).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
}
function pageHead0600(title,sub='',action=''){
  return `<header class="page-head-0600"><div><h1>${title}</h1>${sub?`<p>${sub}</p>`:''}</div>${action}</header>`;
}
function kindLabel0600(kind){return kind==='food'?'食材':kind==='seasoning'?'调味料':'厨具'}
function ownedCount0600(){
  const c=inventoryCount0300();
  return {food:c.food,season:c.season,tool:c.tool,total:c.food+c.season+c.tool};
}

/* ---------------- Home ---------------- */
function home0600(){
  const count=ownedCount0600();
  const meal=typeof mealNames040==='function'?mealNames040():[];
  const cooking=state.cook?recipeById0200(state.cook.recipe):null;
  const recs=count.food&&typeof homeRecommendations040==='function'?homeRecommendations040().slice(0,3):[];
  const menuRemaining=(state.meal?.dishes||[]).filter(id=>!(state.meal?.completed||[]).includes(id)).length;
  const shopCount=(state.shopping||[]).length;

  q('#root').innerHTML=`<div class="page-0600 home-0600">
    ${pageHead0600('今天吃什么？',count.food?`冰箱里有 ${count.food} 种食材，可以直接开始选。`:'先把家里常用的东西记进冰箱。',
      '<button class="text-action-0600" id="homeKitchen0600">管理冰箱</button>')}

    <div class="quick-status-0600">
      <button data-home-go-0600="stove"><span>今日菜单</span><b>${menuRemaining} 道</b></button>
      <button id="homeShopping0600"><span>待采购</span><b>${shopCount} 项</b></button>
      <button data-home-go-0600="fridge"><span>厨房物品</span><b>${count.total} 项</b></button>
    </div>

    ${cooking?`<section class="focus-card-0600 active">
      <div><small>正在做</small><h2>${esc0600(cooking.name)}</h2><p>第 ${(state.cook.step||0)+1} / ${cooking.steps?.length||1} 步</p></div>
      <button id="homeContinueCook0600">继续做饭</button>
    </section>`:meal.length?`<section class="focus-card-0600">
      <div><small>今日菜单</small><h2>${meal.map(r=>esc0600(r.name)).slice(0,3).join(' · ')}${meal.length>3?'…':''}</h2><p>${meal.length} 道 · ${state.meal.servings||2} 人份</p></div>
      <button id="homeContinueMenu0600">查看菜单</button>
    </section>`:''}

    <section class="main-card-0600 recommend-card-0600">
      <div class="section-head-0600">
        <div><h2>为你推荐</h2><p>${count.food?'只显示最值得看的几道菜':'先建立厨房库存，推荐才会更准确'}</p></div>
        <button id="homeAllRecipes0600">全部菜谱</button>
      </div>

      ${count.food?`<div class="mode-chips-0600">
        ${[['best','适合'],['easy','省事'],['fast','最快'],['clear','清库存']].map(([k,n])=>`<button data-home-mode-0600="${k}" class="${state.recommendMode0300===k?'on':''}">${n}</button>`).join('')}
      </div>
      <div class="recommend-list-0600">
        ${recs.map(r=>{const s=rs(r);return `<button data-home-recipe-0600="${r.id}">
          <span class="food-symbol-0600">${r.icon||'🍽️'}</span>
          <span class="recommend-copy-0600"><b>${esc0600(r.name)}</b><small>${r.mins||'--'} 分钟 · ${recommendationReason040(r)}</small></span>
          <span class="ready-dot-0600 ${s.ready?'ready':''}">${s.ready?'可做':'›'}</span>
        </button>`}).join('')}
      </div>`:`<div class="onboarding-0600">
        <div class="onboarding-icon-0600">🧺</div>
        <b>先设置一次厨房物品</b>
        <p>记录几种常用食材、调味料和厨具。之后选菜、购物和准备都会自动利用这些信息。</p>
        <button class="primary" id="homeSetup0600">设置我的厨房</button>
      </div>`}
    </section>
  </div>`;

  q('#homeKitchen0600').onclick=()=>go('fridge');
  q('#homeAllRecipes0600').onclick=()=>go('board');
  const setup=q('#homeSetup0600');if(setup)setup.onclick=()=>manageModal('food');
  q('#homeShopping0600').onclick=()=>shoppingModal();
  qa('[data-home-go-0600]').forEach(b=>b.onclick=()=>go(b.getAttribute('data-home-go-0600')));
  const cc=q('#homeContinueCook0600');if(cc)cc.onclick=()=>go('stove');
  const cm=q('#homeContinueMenu0600');if(cm)cm.onclick=()=>go('stove');
  qa('[data-home-mode-0600]').forEach(b=>b.onclick=()=>{
    state.recommendMode0300=b.getAttribute('data-home-mode-0600');save();home0600();setChrome040();
  });
  qa('[data-home-recipe-0600]').forEach(b=>b.onclick=()=>recipeModal(b.getAttribute('data-home-recipe-0600')));
}
home040=home0600;

/* ---------------- Fridge ---------------- */
function fridgeGroup0600(title,kind,names,tab){
  const query=String(state.fridgeQuery||'').trim();
  const filtered=names.filter(n=>!query||n.includes(query));
  const visible=query?filtered:filtered.slice(0,10);
  const rest=Math.max(0,filtered.length-visible.length);
  return `<section class="inventory-group-0600">
    <button class="inventory-group-head-0600" data-manage-0600="${tab}">
      <span><b>${title}</b><small>${names.length} 种</small></span><i>管理 ›</i>
    </button>
    ${visible.length?`<div class="inventory-preview-0600">
      ${visible.map(n=>ownedChip0300(kind,n)).join('')}
      ${rest?`<button class="inventory-more-0600" data-manage-0600="${tab}">还有 ${rest} 种</button>`:''}
    </div>`:`<button class="inventory-empty-0600" data-manage-0600="${tab}">${query?'没有匹配项':'还没记录，点这里添加'}</button>`}
  </section>`;
}
fridge=function(){
  const c=ownedCount0600();
  const allFood=ownedNames0300('food');
  const foods=allFood.filter(n=>!(typeof SEMI_PREPARED!=='undefined'&&SEMI_PREPARED.includes(n)));
  const semis=allFood.filter(n=>typeof SEMI_PREPARED!=='undefined'&&SEMI_PREPARED.includes(n));
  const seasons=ownedNames0300('seasoning');
  const tools=ownedNames0300('tool');

  q('#root').innerHTML=`<div class="page-0600 fridge-0600">
    ${pageHead0600('冰箱',c.total?`已记录 ${c.food} 种食材 · ${c.season} 种调味料 · ${c.tool} 件厨具`:'记录家里现在有什么',
      `<button class="text-action-0600" id="fridgeShopping0600">购物清单${state.shopping.length?` <em>${state.shopping.length}</em>`:''}</button>`)}

    <div class="fridge-search-0600">
      <input id="fridgeSearch0600" class="search" placeholder="搜索已记录物品" value="${esc0600(state.fridgeQuery||'')}">
      <button class="primary" id="fridgeAdd0600">＋ 添加</button>
    </div>

    <div class="inventory-groups-0600">
      ${fridgeGroup0600('食材','food',foods,'food')}
      ${fridgeGroup0600('半成品','food',semis,'semi')}
      ${fridgeGroup0600('调味料','seasoning',seasons,'seasoning')}
      ${fridgeGroup0600('厨具','tool',tools,'tool')}
    </div>
  </div>`;

  q('#fridgeShopping0600').onclick=()=>shoppingModal();
  q('#fridgeAdd0600').onclick=()=>manageModal('food');
  q('#fridgeSearch0600').oninput=e=>{state.fridgeQuery=e.target.value;save();fridge()};
  qa('[data-manage-0600]').forEach(b=>b.onclick=()=>manageModal(b.getAttribute('data-manage-0600')));
  qa('[data-fridge-remove]').forEach(btn=>{
    btn.title='点一下确认，再点一次删除';
    btn.onclick=e=>{
      e.preventDefault();
      const raw=btn.getAttribute('data-fridge-remove')||'';
      const cut=raw.indexOf('|');if(cut<0)return;
      const kind=raw.slice(0,cut),name=raw.slice(cut+1);
      armDelete0420(btn,kind,name,'fridge0600',()=>{
        removeOwned0420(kind,name);fridge();toast('已移除 '+name);
      });
    };
  });
};

/* ---------------- Kitchen items manager ---------------- */
manageModal=function(tab='food'){
  if(tab==='staple')tab='seasoning';
  if(!['food','semi','seasoning','tool'].includes(tab))tab='food';
  const kind=tab==='seasoning'?'seasoning':tab==='tool'?'tool':'food';
  const all=catalogNames0300(tab);
  const query=String(state.manageQuery0300||'').trim();
  const cats=tab==='tool'?[]:manageCategories0300(tab,all);

  if(!query&&tab!=='tool'&&(!state.manageCategory0300||!cats.some(([g])=>g===state.manageCategory0300))){
    state.manageCategory0300=cats[0]?.[0]||'';
  }
  let names=all.filter(n=>!query||n.includes(query));
  if(!query&&tab!=='tool'&&state.manageCategory0300){
    names=names.filter(n=>category0300(tab,n)===state.manageCategory0300);
  }
  names.sort((a,b)=>Number(has(kind,b))-Number(has(kind,a))||a.localeCompare(b,'zh-CN'));

  const labels={food:'食材',semi:'半成品',seasoning:'调味料',tool:'厨具'};
  const owned=ownedNames0300(kind).length;
  q('#modal').innerHTML=`<div class="modal"><div class="sheet inventory-manager-0600">
    <div class="sheet-handle"></div>
    <div class="sheet-head">
      <div class="title"><b>厨房物品</b><small>点一下添加，再点一下取消</small></div>
      <button class="icon-close" id="managerClose0600">×</button>
    </div>

    <div class="manager-tabs-0600">
      ${['food','semi','seasoning','tool'].map(t=>`<button data-manager-tab-0600="${t}" class="${tab===t?'on':''}">${labels[t]}</button>`).join('')}
    </div>

    <div class="manager-search-0600">
      <input id="managerSearch0600" class="search" placeholder="搜索${labels[tab]}" value="${esc0600(state.manageQuery0300||'')}">
      <span>已有 <b>${owned}</b></span>
    </div>

    ${!query&&cats.length?`<div class="manager-cats-0600">
      ${cats.map(([g,n])=>`<button data-manager-cat-0600="${encodeURIComponent(g)}" class="${state.manageCategory0300===g?'on':''}">${g}<small>${n}</small></button>`).join('')}
    </div>`:''}

    <div class="manager-grid-0600">
      ${names.length?names.map(name=>{
        const on=has(kind,name);
        const icon=kind==='food'?icon0300(kind,name):'';
        return `<button class="manager-item-0600 ${on?'on':''}" data-manager-item-0600="${encodeURIComponent(name)}">
          ${icon?`<span>${icon}</span>`:''}<b>${esc0600(name)}</b><i>${on?'✓':'＋'}</i>
        </button>`;
      }).join(''):'<div class="empty manager-none-0600">没有找到</div>'}
    </div>

    <div class="sheet-footer"><button class="primary" id="managerDone0600">完成</button></div>
  </div></div>`;

  const finish=()=>{state.manageQuery0300='';save();close();render()};
  q('#managerClose0600').onclick=finish;
  q('#managerDone0600').onclick=finish;
  q('#managerSearch0600').oninput=e=>{state.manageQuery0300=e.target.value;save();manageModal(tab)};
  qa('[data-manager-tab-0600]').forEach(b=>b.onclick=()=>{
    state.manageQuery0300='';state.manageCategory0300='';save();manageModal(b.getAttribute('data-manager-tab-0600'));
  });
  qa('[data-manager-cat-0600]').forEach(b=>b.onclick=()=>{
    state.manageCategory0300=decodeURIComponent(b.getAttribute('data-manager-cat-0600'));save();manageModal(tab);
  });
  qa('[data-manager-item-0600]').forEach(b=>b.onclick=()=>{
    const name=decodeURIComponent(b.getAttribute('data-manager-item-0600'));
    has(kind,name)?removeOwned0420(kind,name):have(kind,name);
    save();manageModal(tab);
  });
};

/* ---------------- Recipes ---------------- */
function recipeMatches0600(r){
  const filter=state.filter||'全部';
  const query=String(state.query||'').trim();
  const catOK=filter==='全部'||r.cat===filter;
  const qOK=!query||r.name.includes(query)||(r.desc||'').includes(query)||(r.ings||[]).some(x=>String(x[0]).includes(query))||(r.tags||[]).some(x=>String(x).includes(query));
  const sourceOK=!state.hocOnly||r.hoc;
  return catOK&&qOK&&sourceOK;
}
function recipeList0600(){
  const all=recipes.filter(recipeMatches0600);
  const limit=Math.max(30,state.recipeLimit||30);
  const shown=all.slice(0,limit);
  return {all,shown,remaining:Math.max(0,all.length-shown.length)};
}
function recipeStatusText0600(r){
  const x=recipeInventoryStats0300(r);
  if(x.missingFood===0&&x.missingSeason===0&&x.toolMissing===0)return ['可以做','good'];
  const n=x.missingFood+x.missingSeason+x.toolMissing;
  return [`缺 ${n} 项`,n<=2?'warn':'bad'];
}
function openRecipeFilter0600(){
  const cats=[...new Set(recipes.map(r=>r.cat).filter(Boolean))];
  q('#modal').innerHTML=`<div class="modal"><div class="sheet filter-sheet-0600">
    <div class="sheet-handle"></div>
    <div class="sheet-head"><div class="title"><b>筛选菜谱</b><small>只在需要时使用更多条件</small></div><button class="icon-close" id="filterClose0600">×</button></div>
    <div class="filter-options-0600">
      <button data-filter-0600="全部" class="${state.filter==='全部'?'on':''}">全部</button>
      ${cats.map(c=>`<button data-filter-0600="${encodeURIComponent(c)}" class="${state.filter===c?'on':''}">${c}</button>`).join('')}
    </div>
    ${recipes.some(r=>r.hoc)?`<button class="source-toggle-0600 ${state.hocOnly?'on':''}" id="hocToggle0600"><span>🐔 只看老乡鸡来源</span><i>${state.hocOnly?'已开启':'不限'}</i></button>`:''}
    <div class="sheet-footer"><button class="primary" id="filterDone0600">完成</button></div>
  </div></div>`;
  q('#filterClose0600').onclick=close;
  q('#filterDone0600').onclick=close;
  qa('[data-filter-0600]').forEach(b=>b.onclick=()=>{
    state.filter=decodeURIComponent(b.getAttribute('data-filter-0600'));state.recipeLimit=30;save();close();board();
  });
  const hoc=q('#hocToggle0600');if(hoc)hoc.onclick=()=>{state.hocOnly=!state.hocOnly;save();openRecipeFilter0600()};
}
function renderRecipeBoard0600(){
  if(state.filter==null)state.filter='全部';
  const data=recipeList0600();
  const common=['全部','肉菜','素菜'].filter(c=>c==='全部'||recipes.some(r=>r.cat===c));
  const extraActive=!common.includes(state.filter)||state.hocOnly;
  q('#root').innerHTML=`<div class="page-0600 recipes-0600">
    ${pageHead0600('菜谱','搜索、筛选，然后加入今日菜单。',
      '<button class="text-action-0600" id="customRecipe0600">＋ 自定义</button>')}

    <div class="recipe-search-row-0600">
      <input id="recipeSearch0600" class="search" placeholder="搜索菜名或食材" value="${esc0600(state.query||'')}">
      <button id="ingredientFind0600">按食材找</button>
    </div>

    <div class="recipe-filter-row-0600">
      ${common.map(c=>`<button data-quick-filter-0600="${c}" class="${state.filter===c&&!state.hocOnly?'on':''}">${c}</button>`).join('')}
      <button id="recipeMoreFilter0600" class="${extraActive?'on':''}">${extraActive&&state.filter!=='全部'?esc0600(state.filter):'筛选'}⌄</button>
    </div>

    <div class="recipe-count-0600"><span>${data.all.length} 道菜谱</span>${state.query?`<button id="clearRecipeSearch0600">清除搜索</button>`:''}</div>

    <div class="recipe-scan-list-0600">
      ${data.shown.length?data.shown.map(r=>{
        const [st,cls]=recipeStatusText0600(r);
        return `<button data-recipe-0600="${r.id}">
          <span class="recipe-icon-0600">${r.icon||'🍽️'}</span>
          <span class="recipe-copy-0600">
            <span class="recipe-titleline-0600"><b>${esc0600(r.name)}</b>${r.custom?'<em>我的</em>':''}${r.hoc?'<em class="hoc">老乡鸡</em>':''}</span>
            <small>${esc0600(r.desc||r.cat||'')} </small>
            <span class="recipe-meta-0600"><i>${r.mins||'--'} 分钟</i><i>${esc0600(r.cat||'其他')}</i><i class="${cls}">${st}</i></span>
          </span>
          <span class="recipe-chevron-0600">›</span>
        </button>`;
      }).join(''):'<div class="empty recipe-none-0600">没有找到菜谱</div>'}
    </div>
    ${data.remaining?`<button class="load-more-0600" id="loadMore0600">再显示 ${Math.min(30,data.remaining)} 道 <small>还有 ${data.remaining} 道</small></button>`:''}
  </div>`;

  q('#customRecipe0600').onclick=()=>customRecipeEditor0409();
  q('#ingredientFind0600').onclick=()=>{state.boardMode='ingredients';save();board()};
  q('#recipeSearch0600').oninput=e=>{state.query=e.target.value.trim();state.recipeLimit=30;save();board()};
  const clear=q('#clearRecipeSearch0600');if(clear)clear.onclick=()=>{state.query='';save();board()};
  qa('[data-quick-filter-0600]').forEach(b=>b.onclick=()=>{
    state.filter=b.getAttribute('data-quick-filter-0600');state.hocOnly=false;state.recipeLimit=30;save();board();
  });
  q('#recipeMoreFilter0600').onclick=openRecipeFilter0600;
  qa('[data-recipe-0600]').forEach(b=>b.onclick=()=>recipeModal(b.getAttribute('data-recipe-0600')));
  const load=q('#loadMore0600');if(load)load.onclick=()=>{state.recipeLimit=(state.recipeLimit||30)+30;save();board()};
}
function polishIngredientMode0600(){
  const oldH=q('#root>h2');
  if(oldH)oldH.remove();
  const mode=q('.board-mode');if(mode)mode.remove();
  const root=q('#root');
  if(!root)return;
  const header=document.createElement('div');
  header.className='ingredient-head-0600';
  header.innerHTML=`<div><h1>按食材找</h1><p>选你想用的食材，再看能做什么。</p></div><button id="backRecipes0600">返回菜谱</button>`;
  root.insertBefore(header,root.firstChild);
  q('#backRecipes0600').onclick=()=>{state.boardMode='recipes';save();board()};
}
board=function(){
  if(state.meal?.phase==='prep'||state.prep)return typeof renderMealPrep0200==='function'&&state.meal?.phase==='prep'?renderMealPrep0200():prepView();
  if(state.boardMode==='ingredients'){
    renderIngredientBoard118();polishIngredientMode0600();return;
  }
  state.boardMode='recipes';
  renderRecipeBoard0600();
};

/* ---------------- Stove dashboard ---------------- */
const stoveExecution0600=stove;
function stoveDashboard0600(){
  const dishes=todayMenuDishes0406();
  if(!dishes.length){
    q('#root').innerHTML=`<div class="page-0600 stove-0600">
      ${pageHead0600('灶台','今天要做的菜，都集中在这里。')}
      <section class="main-card-0600 stove-empty-0600">
        <div class="stove-empty-symbol-0600">🍽️</div>
        <h2>今天还没选菜</h2>
        <p>先去菜谱挑几道菜，加入今日菜单后再回来。</p>
        <button class="primary" id="stovePick0600">去菜谱选菜</button>
      </section>
    </div>`;
    q('#stovePick0600').onclick=()=>go('board');
    return;
  }
  const req=todayMenuRequirement0406();
  const missing=req.missing||[];
  const badTools=req.badTools||[];
  const blocked=missing.length||badTools.length;
  const totalMins=dishes.reduce((n,r)=>n+(Number(r.mins)||0),0);
  q('#root').innerHTML=`<div class="page-0600 stove-0600">
    ${pageHead0600('灶台',`${dishes.length} 道菜 · ${state.meal.servings||2} 人份`,
      '<button class="text-action-0600" id="stoveAdd0600">＋ 加菜</button>')}

    <section class="menu-card-0600">
      <div class="menu-summary-0600">
        <span><b>${dishes.length}</b><small>道菜</small></span>
        <span><b>${state.meal.servings||2}</b><small>人份</small></span>
        <span><b>${totalMins}</b><small>分钟合计</small></span>
      </div>
      <div class="menu-list-0600">
        ${dishes.map((r,i)=>`<div class="menu-row-0600">
          <span class="menu-index-0600">${i+1}</span>
          <button class="menu-open-0600" data-menu-open-0600="${r.id}"><b>${esc0600(r.name)}</b><small>${r.mins||'--'} 分钟 · ${esc0600(r.cat||'')}</small></button>
          <button class="menu-remove-0600 today-dish-remove-0406" data-menu-remove-0406="${r.id}">×</button>
        </div>`).join('')}
      </div>
    </section>

    <section class="readiness-card-0600 ${blocked?'blocked':'ready'}">
      <div><b>${blocked?'还没准备齐':'可以开始'}</b><small>${blocked?`缺 ${missing.length} 项材料${badTools.length?` · ${badTools.length} 组厨具`:''}`:'材料和厨具都已确认'}</small></div>
      ${missing.length?`<button id="stoveShop0600">加入购物清单</button>`:''}
    </section>

    <div class="stove-actions-0600">
      <button class="secondary" id="stoveShopping0600">购物清单${state.shopping.length?`（${state.shopping.length}）`:''}</button>
      <button class="primary" id="stoveStart0600" ${blocked?'disabled':''}>开始做饭</button>
    </div>
  </div>`;

  q('#stoveAdd0600').onclick=()=>go('board');
  q('#stoveShopping0600').onclick=()=>shoppingModal();
  const sh=q('#stoveShop0600');if(sh)sh.onclick=()=>{missing.forEach(x=>addShop(x[0],x[1]));save();shoppingModal()};
  qa('[data-menu-open-0600]').forEach(b=>b.onclick=()=>recipeModal(b.getAttribute('data-menu-open-0600')));
  if(typeof bindTodayMenuDelete0408==='function')bindTodayMenuDelete0408();
  q('#stoveStart0600').onclick=()=>{
    if(blocked)return;
    state.meal.phase='prep';state.scene='board';save();render();
  };
}
stove=function(){
  if(state.meal?.phase==='cook'||state.cook)return stoveExecution0600();
  stoveDashboard0600();
};

/* ---------------- My / settings ---------------- */
mine040=function(){
  const c=ownedCount0600();
  const servings=Math.max(1,state.meal?.servings||2);
  q('#root').innerHTML=`<div class="page-0600 mine-0600">
    ${pageHead0600('我的小厨房','只保留真正会经常用到的设置。')}

    <section class="settings-simple-0600">
      <h2>做饭偏好</h2>
      <div class="setting-simple-row-0600">
        <div><b>默认人数</b><small>菜谱用量按人数换算</small></div>
        <div class="stepper-0600"><button id="servMinus0600">−</button><b>${servings}</b><button id="servPlus0600">＋</button></div>
      </div>
      <div class="setting-simple-row-0600">
        <div><b>默认推荐</b><small>首页优先按什么排序</small></div>
        <select id="modeSelect0600">
          <option value="best" ${state.recommendMode0300==='best'?'selected':''}>最适合现在</option>
          <option value="easy" ${state.recommendMode0300==='easy'?'selected':''}>最省事</option>
          <option value="fast" ${state.recommendMode0300==='fast'?'selected':''}>最快做好</option>
          <option value="clear" ${state.recommendMode0300==='clear'?'selected':''}>优先清库存</option>
        </select>
      </div>
    </section>

    <section class="settings-simple-0600">
      <h2>厨房数据</h2>
      <div class="data-strip-0600"><span><b>${c.food}</b><small>食材</small></span><span><b>${c.season}</b><small>调味料</small></span><span><b>${c.tool}</b><small>厨具</small></span><span><b>${recipes.length}</b><small>菜谱</small></span></div>
      <button class="settings-action-0600" id="mineManage0600"><span>管理厨房物品</span><i>›</i></button>
      <button class="settings-action-0600" id="mineShopping0600"><span>购物清单</span><i>${state.shopping.length||''} ›</i></button>
      <button class="settings-action-0600 danger" id="mineReset0600"><span>重置本地数据</span><i>›</i></button>
    </section>

    <div class="theme-note-0600"><b>外观</b><span>自动跟随设备亮色 / 暗色主题</span></div>
    <footer class="version-0600">我的小厨房 · V0.6.0</footer>
  </div>`;

  q('#servMinus0600').onclick=()=>{setServings0200(Math.max(1,servings-1));mine040();setChrome040()};
  q('#servPlus0600').onclick=()=>{setServings0200(Math.min(12,servings+1));mine040();setChrome040()};
  q('#modeSelect0600').onchange=e=>{state.recommendMode0300=e.target.value;save()};
  q('#mineManage0600').onclick=()=>manageModal('food');
  q('#mineShopping0600').onclick=()=>shoppingModal();
  q('#mineReset0600').onclick=()=>resetConfirm040();
};

save();
render();
