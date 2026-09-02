/* My Kitchen V0.5.5 runtime features.
 * Consolidated from the V0.5.4 feature patch chain.
 * This is now a runtime source; legacy patch files remain only as history.
 */

/* ===== patch-v0117.js ===== */
// V0.1.17 CookLikeHOC / 老乡鸡来源菜谱 integration
state.version='0.1.17';
if(typeof state.hocOnly!=='boolean')state.hocOnly=false;
if(!Number.isFinite(state.recipeLimit)||state.recipeLimit<1)state.recipeLimit=36;

const HOC_DATA=window.HOC_DATA||{meta:{count:0},foods:{},foodGroups:{},seasonings:[],recipes:[]};
Object.assign(FOOD,HOC_DATA.foods||{});
(HOC_DATA.seasonings||[]).forEach(n=>{if(!SEASON.includes(n))SEASON.push(n)});
(HOC_DATA.recipes||[]).forEach(r=>{if(!recipes.some(x=>x.id===r.id))recipes.push(r)});

if(typeof foodGroup15==='function'){
  const foodGroupV0117Base=foodGroup15;
  foodGroup15=function(name){return HOC_DATA.foodGroups?.[name]||foodGroupV0117Base(name)};
}
save();

function hocBadge(short=false){return `<span class="hoc-badge ${short?'short':''}">🐔 ${short?'老乡鸡':'老乡鸡做法'}</span>`}
let recipeScope117='';

recipeBody=function(list){
  let visible=(state.hocOnly&&state.boardMode==='recipes')?list.filter(r=>r.hoc):list;
  if(!visible.length)return `<div class="empty">${state.hocOnly&&state.boardMode==='recipes'?'这个分类下暂时没有老乡鸡来源菜谱':'没有找到菜谱'}</div>`;

  let shown=visible;
  let more='';
  if(state.boardMode==='recipes'){
    const scope=`${state.filter}|${state.query}|${state.hocOnly?'hoc':'all'}|${state.viewMode}`;
    if(scope!==recipeScope117){recipeScope117=scope;state.recipeLimit=36}
    const limit=Math.max(36,state.recipeLimit||36);
    shown=visible.slice(0,limit);
    const remaining=visible.length-shown.length;
    if(remaining>0)more=`<button class="recipe-load-more" id="recipeLoadMore">再显示 ${Math.min(36,remaining)} 道 <small>还有 ${remaining} 道</small></button>`;
  }

  if(state.viewMode==='list'){
    return `<div class="recipe-list">${shown.map(r=>`<button class="recipe-row ${r.hoc?'hoc-card':''}" data-r="${r.id}"><div class="icon">${r.icon}</div><div class="recipe-row-main"><div class="recipe-row-title"><h3>${r.name}</h3>${r.hoc?hocBadge(true):''}</div><p>${r.desc}</p></div><div class="row-meta"><span class="tag">${r.mins}分钟</span>${status(r)}</div></button>`).join('')}</div>${more}`;
  }
  return `<div class="recipe-grid">${shown.map(r=>`<button class="recipe-card ${r.hoc?'hoc-card':''}" data-r="${r.id}">${r.hoc?`<div class="hoc-card-label">${hocBadge(false)}</div>`:''}<div class="icon">${r.icon}</div><h3>${r.name}</h3><p>${r.desc}</p><div class="meta"><span class="tag">约${r.mins}分钟</span><span class="tag">${r.cat}</span>${status(r)}</div></button>`).join('')}</div>${more}`;
};

const boardV0117Base=board;
board=function(){
  boardV0117Base();
  const load=q('#recipeLoadMore');
  if(load)load.onclick=()=>{state.recipeLimit=(state.recipeLimit||36)+36;save();board()};
  if(state.prep||state.boardMode!=='recipes'||!(HOC_DATA.recipes||[]).length)return;
  const filters=q('.filters');
  if(!filters||q('[data-hoc-only]'))return;
  const btn=document.createElement('button');
  btn.className=`filter hoc-source-filter ${state.hocOnly?'on':''}`;
  btn.dataset.hocOnly='1';
  btn.innerHTML=`🐔 老乡鸡 <small>${HOC_DATA.meta?.count||HOC_DATA.recipes.length}</small>`;
  btn.onclick=()=>{state.hocOnly=!state.hocOnly;state.recipeLimit=36;save();board()};
  filters.insertBefore(btn,filters.children[1]||null);
};

const recipeModalV0117Base=recipeModal;
recipeModal=function(id){
  recipeModalV0117Base(id);
  const r=recipes.find(x=>x.id===id);
  if(!r?.hoc||!r.source)return;
  const title=q('.recipe-title-block');
  if(!title||q('.hoc-source-box'))return;
  const box=document.createElement('div');
  box.className=`hoc-source-box ${r.source.incomplete?'incomplete':''}`;
  const sourceState=r.source.incomplete
    ? '<span class="hoc-source-status incomplete">资料不完整</span>'
    : '<span class="hoc-source-status complete">来源步骤完整</span>';
  let detail='步骤已拆分、改写为适合本工具逐步执行的表述';
  if(r.source.incomplete)detail='来源记录未公开完整配方或制作步骤，请以原始记录为准';
  else if(r.source.scaled)detail='门店批量克重已按原比例缩放为家庭份量；步骤已做简化表述';
  box.innerHTML=`<div class="hoc-source-top">${hocBadge(false)}${r.source.scaled?'<span class="hoc-home-scale">家用比例</span>':''}${sourceState}</div><div class="hoc-source-text"><b>来源：CookLikeHOC</b><small>基于《老乡鸡菜品溯源报告》整理 · 非老乡鸡官方仓库</small><small>${detail}</small></div><a class="hoc-source-link" href="${r.source.url}" target="_blank" rel="noopener noreferrer">查看原始记录 ↗</a>`;
  title.insertAdjacentElement('afterend',box);
};

function decorateHocScene(id){
  const r=recipes.find(x=>x.id===id);
  if(!r?.hoc)return;
  const h=q('#root h2');
  if(h&&!h.querySelector('.hoc-scene-badge'))h.insertAdjacentHTML('beforeend',` <span class="hoc-scene-badge">🐔 老乡鸡</span>`);
}

const prepViewV0117Base=prepView;
prepView=function(){
  const id=state.prep?.recipe;
  prepViewV0117Base();
  if(id)decorateHocScene(id);
};

const stoveV0117Base=stove;
stove=function(){
  const id=state.cook?.recipe;
  stoveV0117Base();
  if(id)decorateHocScene(id);
};

// The source library adds many seasonings; keep fridge management searchable.
manageModal=function(tab='food'){
  const kind=tab==='semi'?'food':tab;
  const allNames=tab==='food'?Object.keys(FOOD).filter(n=>!SEMI_PREPARED.includes(n)):tab==='semi'?SEMI_PREPARED:tab==='seasoning'?SEASON:TOOLS;
  const searchable=tab==='food'||tab==='semi'||tab==='seasoning';
  const query=searchable?state.manageQuery.trim():'';
  let names=allNames.filter(n=>!query||n.includes(query));
  if(tab==='food'&&!query)names=names.filter(n=>foodGroup15(n)===state.manageFoodGroup);
  const icon=n=>kind==='food'?FOOD[n]:kind==='seasoning'?'🧂':'🍳';
  const foodGroups=['肉蛋水产','蔬菜菌菇','主食与其他'];
  const label=tab==='food'?'常用食材':tab==='semi'?'半成品':tab==='seasoning'?'调味料':'厨具';
  q('#modal').innerHTML=`<div class="modal"><div class="sheet"><div class="sheet-handle"></div><div class="sheet-head"><div class="title"><b>厨房物品</b><small>${label}</small></div><button class="icon-close" id="x">×</button></div><div class="manage-tabs"><button data-tab="food" class="${tab==='food'?'on':''}">食材</button><button data-tab="semi" class="${tab==='semi'?'on':''}">半成品</button><button data-tab="seasoning" class="${tab==='seasoning'?'on':''}">调味料</button><button data-tab="tool" class="${tab==='tool'?'on':''}">厨具</button></div>${searchable?`<div class="manage-search-row"><input id="manageSearch" class="search" placeholder="搜索${label}" value="${state.manageQuery}"><small>${names.length}/${allNames.length}</small></div>`:''}${tab==='food'&&!query?`<div class="manage-food-groups">${foodGroups.map(g=>`<button data-food-group="${g}" class="${state.manageFoodGroup===g?'on':''}">${g}</button>`).join('')}</div>`:''}<div class="picker-grid manage-picker">${names.length?names.map(n=>`<button class="pick ${has(kind,n)?'on':''}" data-pick="${kind}|${n}">${icon(n)} ${n}</button>`).join(''):'<div class="empty">没有找到</div>'}</div><div class="sheet-footer"><button class="secondary" id="back" style="width:100%">返回冰箱</button></div></div></div>`;
  const back=()=>{state.manageQuery='';save();close();render()};
  q('#x').onclick=back;q('#back').onclick=back;
  const search=q('#manageSearch');
  if(search)search.oninput=e=>{state.manageQuery=e.target.value;save();manageModal(tab)};
  qa('[data-tab]').forEach(b=>b.onclick=()=>{state.manageQuery='';save();manageModal(b.dataset.tab)});
  qa('[data-food-group]').forEach(b=>b.onclick=()=>{state.manageFoodGroup=b.dataset.foodGroup;save();manageModal('food')});
  qa('[data-pick]').forEach(b=>b.onclick=()=>{const[k,n]=b.dataset.pick.split('|');has(k,n)?missing(k,n):have(k,n);manageModal(tab)});
};

render();

;


/* ===== patch-v0117b.js ===== */
// V0.1.17b: clarify multi-stage CookLikeHOC source recipes.
const recipeModalV0117b=recipeModal;
recipeModal=function(id){
  recipeModalV0117b(id);
  const r=recipes.find(x=>x.id===id);
  if(!r?.hoc||!r.source?.complex)return;
  const top=q('.hoc-source-top');
  if(top&&!q('.hoc-complex-badge'))top.insertAdjacentHTML('beforeend','<span class="hoc-home-scale hoc-complex-badge">多阶段配方</span>');
  const text=q('.hoc-source-text');
  if(text&&!q('.hoc-complex-note'))text.insertAdjacentHTML('beforeend','<small class="hoc-complex-note">多阶段克重保留在具体步骤中，材料标签中的“见步骤”不代表缺少数据。</small>');
};
render();

;


/* ===== patch-v0118.js ===== */
// V0.1.18 expanded-library stability + scalable browsing
state.version='0.1.18';

const EXTRA_RECIPE_CATS_118=['调味配方','饮品'];
const INGREDIENT_GROUPS_118=['肉蛋水产','蔬菜菌菇','主食与其他','半成品'];
const SEASON_GROUPS_118=['基础调味','酱汁酱料','香辛料','复合调料','其他'];

if(!Array.isArray(state.ingredientOpenGroups))state.ingredientOpenGroups=[];
if(typeof state.manageSeasonGroup!=='string')state.manageSeasonGroup='基础调味';

// app.js migrates localStorage before V0.1.15 and CookLikeHOC data are loaded.
// Restore fields that could only be validated after the full library exists.
(function restoreExpandedState118(){
  const p=window.__MK_PRELOAD;
  if(!p)return;
  if(Array.isArray(p.foods))state.foods=uniq(p.foods.filter(n=>FOOD[n]));
  if(Array.isArray(p.matchFoods))state.matchFoods=uniq(p.matchFoods.filter(n=>FOOD[n]));
  if(p.recipe&&recipes.some(r=>r.id===p.recipe))state.recipe=p.recipe;
  if(p.prep?.recipe&&recipes.some(r=>r.id===p.prep.recipe))state.prep=p.prep;
  if(p.cook?.recipe&&recipes.some(r=>r.id===p.cook.recipe))state.cook=p.cook;
  if(p.set?.seasonings)state.set.seasonings={...state.set.seasonings,...p.set.seasonings};
  if(p.set?.cookware)state.set.cookware={...state.set.cookware,...p.set.cookware};
  if(typeof p.hocOnly==='boolean')state.hocOnly=p.hocOnly;
  if(typeof p.manageQuery==='string')state.manageQuery=p.manageQuery;
  if(typeof p.manageFoodGroup==='string')state.manageFoodGroup=p.manageFoodGroup;
  if(Array.isArray(p.ingredientOpenGroups))state.ingredientOpenGroups=uniq(p.ingredientOpenGroups.filter(g=>INGREDIENT_GROUPS_118.includes(g)));
  if(typeof p.manageSeasonGroup==='string'&&SEASON_GROUPS_118.includes(p.manageSeasonGroup))state.manageSeasonGroup=p.manageSeasonGroup;
  if(Number.isFinite(p.recipeLimit)&&p.recipeLimit>0)state.recipeLimit=p.recipeLimit;
})();

function recipeVariant118(r){
  if(!r?.hoc||!r.source?.path)return '';
  const same=recipes.filter(x=>x.name===r.name);
  if(same.length<2)return '';
  const bits=r.source.path.split('/');
  const parent=bits.length>2?bits.slice(1,-1).join(' / '):r.source.category;
  return parent||r.source.category||'来源记录';
}

let recipeScope118='';
recipeBody=function(list){
  let visible=(state.hocOnly&&state.boardMode==='recipes')?list.filter(r=>r.hoc):list;
  if(!visible.length)return `<div class="empty">${state.hocOnly&&state.boardMode==='recipes'?'这个分类下暂时没有老乡鸡来源菜谱':'没有找到菜谱'}</div>`;

  const paged=state.boardMode==='recipes'||state.boardMode==='ingredients';
  let shown=visible,more='';
  if(paged){
    const scope=state.boardMode==='ingredients'
      ? `ingredients|${(state.matchFoods||[]).join('|')}|${state.viewMode}`
      : `recipes|${state.filter}|${state.query}|${state.hocOnly?'hoc':'all'}|${state.viewMode}`;
    if(scope!==recipeScope118){recipeScope118=scope;state.recipeLimit=36}
    const limit=Math.max(36,state.recipeLimit||36);
    shown=visible.slice(0,limit);
    const remaining=visible.length-shown.length;
    if(remaining>0)more=`<button class="recipe-load-more" id="recipeLoadMore">再显示 ${Math.min(36,remaining)} 道 <small>还有 ${remaining} 道</small></button>`;
  }

  const variant=r=>{const v=recipeVariant118(r);return v?`<span class="recipe-variant">${v}</span>`:''};
  if(state.viewMode==='list'){
    return `<div class="recipe-list">${shown.map(r=>`<button class="recipe-row ${r.hoc?'hoc-card':''}" data-r="${r.id}"><div class="icon">${r.icon}</div><div class="recipe-row-main"><div class="recipe-row-title"><h3>${r.name}</h3>${r.hoc?hocBadge(true):''}${variant(r)}</div><p>${r.desc}</p></div><div class="row-meta"><span class="tag">${r.mins}分钟</span>${status(r)}</div></button>`).join('')}</div>${more}`;
  }
  return `<div class="recipe-grid">${shown.map(r=>`<button class="recipe-card ${r.hoc?'hoc-card':''}" data-r="${r.id}">${r.hoc?`<div class="hoc-card-label">${hocBadge(false)}</div>`:''}<div class="icon">${r.icon}</div><h3>${r.name}</h3>${variant(r)}<p>${r.desc}</p><div class="meta"><span class="tag">约${r.mins}分钟</span><span class="tag">${r.cat}</span>${status(r)}</div></button>`).join('')}</div>${more}`;
};

function ingredientGroup118(name){
  if(SEMI_PREPARED.includes(name))return '半成品';
  const g=typeof foodGroup15==='function'?foodGroup15(name):'主食与其他';
  return INGREDIENT_GROUPS_118.includes(g)?g:'主食与其他';
}

function intentFoodChip118(name,compact=false){
  const selected=(state.matchFoods||[]).includes(name);
  const owned=has('food',name);
  const queued=inShop('food',name);
  return `<button class="intent-food ${owned?'owned':'other'} ${selected?'intent-on':''} ${compact?'intent-compact':''}" data-match-food="${name}">${FOOD[name]||'🥣'} <span>${name}</span>${queued?'<small>待买</small>':''}</button>`;
}

function renderIngredientBoard118(){
  const fq=(state.foodQuery||'').trim();
  const selected=(state.matchFoods||[]).filter(n=>FOOD[n]);
  const allFoods=Object.keys(FOOD);
  const matchedRecipes=selected.length?recipes.map(r=>{
    const names=(r.ings||[]).map(x=>x[0]);
    const overlap=selected.filter(n=>names.includes(n)).length;
    return {r,overlap};
  }).filter(x=>x.overlap>0)
    .sort((a,b)=>b.overlap-a.overlap||rs(a.r).missing-rs(b.r).missing||a.r.mins-b.r.mins)
    .map(x=>x.r):[];

  let browser='';
  if(fq){
    const found=allFoods.filter(n=>n.includes(fq));
    browser=`<div class="intent-section"><div class="intent-section-head"><b>搜索结果</b><small>${found.length} 种</small></div>${found.length?`<div class="intent-food-grid">${found.map(n=>intentFoodChip118(n)).join('')}</div>`:'<div class="intent-empty">没有找到这个食材</div>'}</div>`;
  }else{
    const home=allFoods.filter(n=>has('food',n));
    const other=allFoods.filter(n=>!has('food',n));
    const groups=INGREDIENT_GROUPS_118.map(group=>({group,items:other.filter(n=>ingredientGroup118(n)===group)})).filter(x=>x.items.length);
    browser=`
      <div class="intent-section"><div class="intent-section-head"><b>家里有</b><small>${home.length} 种</small></div>${home.length?`<div class="intent-food-grid">${home.map(n=>intentFoodChip118(n)).join('')}</div>`:'<div class="intent-empty">冰箱里还没有记录食材</div>'}</div>
      <div class="intent-section"><div class="intent-section-head"><b>其他食材</b><small>点分类展开</small></div><div class="ingredient-group-list">${groups.map(({group,items})=>{
        const open=state.ingredientOpenGroups.includes(group);
        return `<div class="ingredient-group-block ${open?'open':''}"><button class="ingredient-group-head" data-ingredient-group="${group}" aria-expanded="${open}"><span>${group}</span><small>${items.length} 种</small><i>${open?'⌃':'⌄'}</i></button>${open?`<div class="intent-food-grid ingredient-group-grid">${items.map(n=>intentFoodChip118(n)).join('')}</div>`:''}</div>`;
      }).join('')}</div></div>`;
  }

  const selectedHTML=selected.length?`<div class="intent-selected-box"><div class="intent-selected-line"><b>这顿想用 ${selected.length} 种</b><span>再次点击可取消</span></div><div class="intent-selected-chips">${selected.map(n=>intentFoodChip118(n,true)).join('')}</div></div>`:'';
  const mode=`<div class="board-mode"><button data-board-mode="recipes">选菜谱</button><button data-board-mode="ingredients" class="on">按食材找菜</button></div>`;

  q('#root').innerHTML=`<h2>🔪 菜板</h2>${mode}<div class="ingredient-find card intent-browser"><div class="search-row"><input id="foodSearch" class="search" placeholder="搜索想吃的食材，如虾仁" value="${state.foodQuery||''}"><button class="clear-foods" id="clearFoods" ${selected.length?'':'disabled'}>清空</button></div>${selectedHTML}${browser}</div><div class="match-head"><b>${selected.length?`匹配菜谱 · 已选 ${selected.length} 种`:'选择这顿想用的食材'}</b><div class="view-switch"><button data-view="cards" class="${state.viewMode==='cards'?'on':''}">▦</button><button data-view="list" class="${state.viewMode==='list'?'on':''}">☰</button></div></div>${selected.length?recipeBody(matchedRecipes):'<div class="empty">家里有的、准备买的、现在没有但想吃的食材都可以选。</div>'}`;

  q('#foodSearch').oninput=e=>{state.foodQuery=e.target.value;save();board()};
  q('#clearFoods').onclick=()=>{state.matchFoods=[];state.recipeLimit=36;save();board()};
  qa('[data-ingredient-group]').forEach(b=>b.onclick=()=>{
    const g=b.dataset.ingredientGroup;
    state.ingredientOpenGroups=state.ingredientOpenGroups.includes(g)?state.ingredientOpenGroups.filter(x=>x!==g):[...state.ingredientOpenGroups,g];
    save();board();
  });
  qa('[data-match-food]').forEach(b=>b.onclick=()=>{
    const n=b.dataset.matchFood;
    state.matchFoods=state.matchFoods.includes(n)?state.matchFoods.filter(x=>x!==n):[...state.matchFoods,n];
    state.recipeLimit=36;
    save();board();
  });
  qa('[data-view]').forEach(b=>b.onclick=()=>{state.viewMode=b.dataset.view;state.recipeLimit=36;save();board()});
  qa('[data-board-mode]').forEach(b=>b.onclick=()=>{state.boardMode=b.dataset.boardMode;state.recipeLimit=36;save();board()});
  const load=q('#recipeLoadMore');
  if(load)load.onclick=()=>{state.recipeLimit=(state.recipeLimit||36)+36;save();board()};
  bindRecipeCards();
}

function addExtraRecipeFilters118(){
  if(state.prep||state.boardMode!=='recipes')return;
  const filters=q('.filters');
  if(!filters)return;
  EXTRA_RECIPE_CATS_118.forEach(cat=>{
    if(!recipes.some(r=>r.cat===cat)||filters.querySelector(`[data-extra-cat="${cat}"]`))return;
    const btn=document.createElement('button');
    btn.className=`filter ${state.filter===cat?'on':''}`;
    btn.dataset.extraCat=cat;
    btn.textContent=cat;
    btn.onclick=()=>{state.filter=cat;state.recipeLimit=36;save();board()};
    filters.appendChild(btn);
  });
}

const boardV0118Base=board;
board=function(){
  if(!state.prep&&state.boardMode==='ingredients')return renderIngredientBoard118();
  boardV0118Base();
  addExtraRecipeFilters118();
};

// V0.1.16 inferred open/closed state from whether a group contained a selected
// ingredient. Keep this as a no-op because V0.1.18 owns group state explicitly.
collapseIngredientGroups16=function(){};

function seasoningGroup118(name){
  if(/^(食用油|盐|糖|生抽|老抽|酱油|味极鲜|蚝油|料酒|黄酒|花雕酒|醋|陈醋|香醋|米醋|淀粉|玉米淀粉|味精|鸡精)$/.test(name))return '基础调味';
  if(/(八角|花椒|胡椒|孜然|桂皮|香叶|小茴香|山奈|草果|陈皮|十三香|五香粉|椒盐|芝麻|辣椒面|辣椒粉|干辣椒|干红椒|泡椒)/.test(name))return '香辛料';
  if(/(底料|汤料|卤料|料包|调味料|调味粉|香辛料|鸡杂料|鸡翅调料|小炒料|烧鸡料|蒸蛋料|炒菜基料|鸡油料)/.test(name))return '复合调料';
  if(/(酱|汁|油$|红油|葱油|麻油|香油|豉油)/.test(name))return '酱汁酱料';
  return '其他';
}

manageModal=function(tab='food'){
  const kind=tab==='semi'?'food':tab;
  const allNames=tab==='food'?Object.keys(FOOD).filter(n=>!SEMI_PREPARED.includes(n)):tab==='semi'?SEMI_PREPARED:tab==='seasoning'?SEASON:TOOLS;
  const searchable=tab==='food'||tab==='semi'||tab==='seasoning';
  const query=searchable?(state.manageQuery||'').trim():'';
  let names=allNames.filter(n=>!query||n.includes(query));
  const foodGroups=['肉蛋水产','蔬菜菌菇','主食与其他'];
  if(tab==='food'&&!query)names=names.filter(n=>foodGroup15(n)===state.manageFoodGroup);
  if(tab==='seasoning'&&!query){
    const available=SEASON_GROUPS_118.filter(g=>allNames.some(n=>seasoningGroup118(n)===g));
    if(!available.includes(state.manageSeasonGroup))state.manageSeasonGroup=available[0]||'其他';
    names=names.filter(n=>seasoningGroup118(n)===state.manageSeasonGroup);
  }
  const icon=n=>kind==='food'?FOOD[n]:kind==='seasoning'?'🧂':'🍳';
  const label=tab==='food'?'常用食材':tab==='semi'?'半成品':tab==='seasoning'?'调味料':'厨具';
  const seasonGroups=SEASON_GROUPS_118.map(g=>({g,count:allNames.filter(n=>seasoningGroup118(n)===g).length})).filter(x=>x.count);

  q('#modal').innerHTML=`<div class="modal"><div class="sheet"><div class="sheet-handle"></div><div class="sheet-head"><div class="title"><b>厨房物品</b><small>${label}</small></div><button class="icon-close" id="x">×</button></div><div class="manage-tabs"><button data-tab="food" class="${tab==='food'?'on':''}">食材</button><button data-tab="semi" class="${tab==='semi'?'on':''}">半成品</button><button data-tab="seasoning" class="${tab==='seasoning'?'on':''}">调味料</button><button data-tab="tool" class="${tab==='tool'?'on':''}">厨具</button></div>${searchable?`<div class="manage-search-row"><input id="manageSearch" class="search" placeholder="搜索${label}" value="${state.manageQuery||''}"><small>${names.length}/${allNames.length}</small></div>`:''}${tab==='food'&&!query?`<div class="manage-food-groups">${foodGroups.map(g=>`<button data-food-group="${g}" class="${state.manageFoodGroup===g?'on':''}">${g}</button>`).join('')}</div>`:''}${tab==='seasoning'&&!query?`<div class="manage-food-groups manage-season-groups">${seasonGroups.map(x=>`<button data-season-group="${x.g}" class="${state.manageSeasonGroup===x.g?'on':''}">${x.g}<small>${x.count}</small></button>`).join('')}</div>`:''}<div class="picker-grid manage-picker">${names.length?names.map(n=>`<button class="pick ${has(kind,n)?'on':''}" data-pick="${kind}|${n}">${icon(n)} ${n}</button>`).join(''):'<div class="empty">没有找到</div>'}</div><div class="sheet-footer"><button class="secondary" id="back" style="width:100%">返回冰箱</button></div></div></div>`;

  const back=()=>{state.manageQuery='';save();close();render()};
  q('#x').onclick=back;q('#back').onclick=back;
  const search=q('#manageSearch');
  if(search)search.oninput=e=>{state.manageQuery=e.target.value;save();manageModal(tab)};
  qa('[data-tab]').forEach(b=>b.onclick=()=>{state.manageQuery='';save();manageModal(b.dataset.tab)});
  qa('[data-food-group]').forEach(b=>b.onclick=()=>{state.manageFoodGroup=b.dataset.foodGroup;save();manageModal('food')});
  qa('[data-season-group]').forEach(b=>b.onclick=()=>{state.manageSeasonGroup=b.dataset.seasonGroup;save();manageModal('seasoning')});
  qa('[data-pick]').forEach(b=>b.onclick=()=>{const[k,n]=b.dataset.pick.split('|');has(k,n)?missing(k,n):have(k,n);manageModal(tab)});
};

save();
render();

;


/* ===== patch-v0119.js ===== */
// V0.1.19 keep horizontally-scrolled recipe filters stable across rerenders
state.version='0.1.19';
let recipeFilterScroll119=0;

const boardV0119Base=board;
board=function(){
  boardV0119Base();
  if(state.prep||state.boardMode!=='recipes')return;
  const filters=q('.filters');
  if(!filters)return;
  const max=Math.max(0,filters.scrollWidth-filters.clientWidth);
  filters.scrollLeft=Math.min(recipeFilterScroll119,max);
  filters.addEventListener('scroll',()=>{recipeFilterScroll119=filters.scrollLeft},{passive:true});
};

save();
render();

;


/* ===== patch-v0200.js ===== */
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

;


/* ===== patch-v0200b.js ===== */
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

;


/* ===== patch-v0200c.js ===== */
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
  if(pool.length<=2)return diners;
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
  const scaleNote=q('.meal-scale-note');if(scaleNote)scaleNote.textContent='1～2道菜按全桌人数；3道以上共享菜按整桌总量分摊，并保留基础成菜份量。主食和饮品单独计算。';
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

;


/* ===== patch-v0202.js ===== */
// V0.2.2 practical quantities: replace vague amounts with usable references and shopping guidance.
state.version='0.2.2';

const AMBIGUOUS_AMOUNT_0202=/适量|少量|少许|按需|按口味|若干|酌量/;
function ambiguousAmount0202(v){return AMBIGUOUS_AMOUNT_0202.test(String(v||''))&&!/见步骤/.test(String(v||''));}
function waterLike0202(name){return /^(水|清水|热水|开水|凉水|温水|饮用水)$/.test(String(name||''));}
function targetServings0202(r,servings){
  if(Number.isFinite(servings)&&servings>0)return servings;
  if(typeof recommendedDishServings0200c==='function')return recommendedDishServings0200c(r);
  return Math.max(1,state.meal?.servings||2);
}
function roundReference0202(n){
  if(!Number.isFinite(n)||n<=0)return 0;
  if(n<1)return Math.max(.1,Math.round(n*10)/10);
  if(n<5)return Math.round(n*2)/2;
  if(n<20)return Math.round(n);
  if(n<100)return Math.round(n/5)*5;
  return Math.round(n/10)*10;
}
function ref0202(n,unit){return `参考约${cleanNumber0200(roundReference0202(n))}${unit}`;}
function ambiguityFactor0202(raw){
  const s=String(raw||'');
  if(/少量|少许/.test(s))return .5;
  if(/按口味|酌量/.test(s))return .75;
  return 1;
}
function seasoningReference0202(name,r,raw,target){
  const n=String(name||''),level=ambiguityFactor0202(raw);
  const salty=(r?.season||[]).some(x=>String(x[0]||'')!==n&&/生抽|老抽|酱油|蚝油|豆瓣酱|豆豉|底料|调味酱/.test(String(x[0]||''))&&x[2]);
  let per=2,unit='g';
  if(/食用油|菜籽油|色拉油|花生油|玉米油/.test(n)){per=r?.cat==='汤炖'?3:8;unit='ml';}
  else if(/^盐$|食盐|精盐/.test(n)){per=salty ? .6 : .9;unit='g';}
  else if(/白糖|糖$|砂糖/.test(n)){per=2;unit='g';}
  else if(/生抽|酱油/.test(n)&&!/老抽/.test(n)){per=5;unit='ml';}
  else if(/老抽/.test(n)){per=1.5;unit='ml';}
  else if(/料酒|黄酒|花雕/.test(n)){per=5;unit='ml';}
  else if(/醋/.test(n)){per=4;unit='ml';}
  else if(/蚝油/.test(n)){per=5;unit='g';}
  else if(/淀粉|生粉/.test(n)){per=4;unit='g';}
  else if(/胡椒/.test(n)){per=.3;unit='g';}
  else if(/香油|芝麻油/.test(n)){per=1.5;unit='ml';}
  else if(/豆瓣酱/.test(n)){per=6;unit='g';}
  else if(/番茄酱/.test(n)){per=8;unit='g';}
  else if(/辣椒油|红油/.test(n)){per=3;unit='ml';}
  else if(/油$/.test(n)){per=2;unit='ml';}
  else if(/粉$|椒盐|孜然|五香|十三香|花椒|香料/.test(n)){per=.5;unit='g';}
  else if(/酱|膏|底料|调料|调味料|汁$|料$/.test(n)){per=8;unit='g';}
  return ref0202(per*Math.max(1,target)*level,unit);
}
function foodReference0202(name,r,raw,target){
  const n=String(name||''),level=ambiguityFactor0202(raw),t=Math.max(1,target);
  if(waterLike0202(n))return '按步骤加水';
  if(/鸡蛋|鸭蛋|鹅蛋|鹌鹑蛋/.test(n))return `${Math.max(1,Math.round(t*level))}个`;
  if(/葱|香菜|芫荽/.test(n))return ref0202(5*t*level,'g');
  if(/姜/.test(n))return ref0202(4*t*level,'g');
  if(/蒜/.test(n))return ref0202(4*t*level,'g');
  if(/辣椒|小米椒|尖椒/.test(n))return ref0202(6*t*level,'g');
  if(/鸡|猪|牛|羊|鸭|鹅|肉|排骨|鱼|虾|贝|肥肠|腊肉|培根/.test(n))return ref0202(80*t*level,'g');
  if(/豆腐|豆干|千张|腐竹/.test(n))return ref0202(90*t*level,'g');
  if(/大米|米饭/.test(n))return ref0202(70*t*level,'g');
  if(/面|粉|米线/.test(n))return ref0202(80*t*level,'g');
  if(/菜|番茄|土豆|瓜|豆|椒|笋|藕|菇|菌|萝卜|洋葱|芹|玉米|南瓜|山药/.test(n))return ref0202(90*t*level,'g');
  return ref0202(50*t*level,'g');
}

const scaleAmountV0202Base=scaleAmount0200;
function normalizeCount0202(s){
  const text=String(s||''),m=text.match(/^(约)?(\d+(?:\.\d+)?)(个|片|张|包|瓶|块|盒)(.*)$/);
  if(!m)return text;
  const n=parseFloat(m[2]);if(!Number.isFinite(n)||Number.isInteger(n))return text;
  return `${m[1]||''}${Math.max(1,Math.round(n))}${m[3]}${m[4]||''}`;
}
scaleAmount0200=function(amount,r,servings){return normalizeCount0202(scaleAmountV0202Base(amount,r,servings));};
function practicalAmount0202(kind,name,raw,r,servings){
  const s=String(raw??'').trim();if(!s)return '';
  if(/见步骤/.test(s))return s;
  const target=targetServings0202(r,servings);
  if(ambiguousAmount0202(s))return kind==='seasoning'?seasoningReference0202(name,r,s,target):foodReference0202(name,r,s,target);
  return scaleAmount0200(s,r,servings);
}

function parsedAmount0202(v){
  let s=String(v||'').trim();if(!s)return null;
  let reference=false,approx=false;
  if(s.startsWith('参考约')){reference=true;approx=true;s=s.slice(3)}else if(s.startsWith('参考')){reference=true;s=s.slice(2)}
  if(s.startsWith('约')){approx=true;s=s.slice(1)}
  let m=s.match(/^半(勺|汤匙|茶匙|杯|碗|个|颗|根|片|盒|包|瓶|张|把|块|份)$/),n,unit;
  if(m){n=.5;unit=m[1]}else{m=s.match(/^(\d+(?:\.\d+)?)(g|kg|克|ml|mL|L|升|个|颗|根|片|勺|汤匙|茶匙|杯|碗|盒|包|瓶|张|把|块|份)$/);if(!m)return null;n=parseFloat(m[1]);unit=m[2]}
  let dim=unit,factor=1,outUnit=unit;
  if(unit==='kg'){dim='mass';factor=1000;outUnit='g'}else if(unit==='g'||unit==='克'){dim='mass';outUnit='g'}
  else if(unit==='L'||unit==='升'){dim='volume';factor=1000;outUnit='ml'}else if(unit==='ml'||unit==='mL'){dim='volume';outUnit='ml'}
  else if(unit==='勺'||unit==='汤匙'){dim='volume';factor=15;outUnit='ml'}else if(unit==='茶匙'){dim='volume';factor=5;outUnit='ml'}
  return {n:n*factor,unit:outUnit,dim,reference,approx};
}
const aggregateAmountsV0202Base=aggregateAmounts0200;
aggregateAmounts0200=function(amounts){
  const vals=amounts.filter(Boolean);if(!vals.length)return '';if(vals.length===1)return vals[0];
  const p=vals.map(parsedAmount0202);
  if(p.every(Boolean)&&new Set(p.map(x=>x.dim)).size===1){
    const sum=p.reduce((a,b)=>a+b.n,0),unit=p[0].unit,prefix=p.some(x=>x.reference)?'参考约':p.some(x=>x.approx)?'约':'';
    return `${prefix}${cleanNumber0200(roundReference0202(sum))}${unit}`;
  }
  return aggregateAmountsV0202Base(vals);
};

const hasV0202Base=has;
has=function(kind,name){if(kind==='food'&&waterLike0202(name))return true;return hasV0202Base(kind,name)};

const mealRequirementDataV0202Base=mealRequirementData0200;
mealRequirementData0200=function(){
  const d=mealRequirementDataV0202Base();
  for(const item of d.items){
    for(const use of item.uses){
      const r=recipeById0200(use.recipeId);if(!r)continue;
      const src=item.kind==='food'?(r.ings||[]).find(x=>x[0]===item.name):(r.season||[]).find(x=>x[0]===item.name&&x[2]);
      if(src)use.amount=practicalAmount0202(item.kind,item.name,src[1],r);
    }
    item.amount=aggregateAmounts0200(item.uses.map(x=>x.amount));item.owned=has(item.kind,item.name);item.shopping=inShop(item.kind,item.name);
  }
  d.missing=d.items.filter(x=>!x.owned&&!x.support);d.planned=d.items.filter(x=>!x.owned&&x.support);return d;
};

syncMealShopping0200=function(){
  const ids=new Set(mealRecipeIds0200());
  for(const item of state.shopping||[]){
    if(!Array.isArray(item.needs))continue;
    for(const n of item.needs){
      if(!ids.has(n.recipeId))continue;const r=recipeById0200(n.recipeId);if(!r)continue;
      const src=item.kind==='food'?(r.ings||[]).find(x=>x[0]===item.name):(r.season||[]).find(x=>x[0]===item.name&&x[2]);
      if(src)n.amount=practicalAmount0202(item.kind,item.name,src[1],r);
    }
  }
  save();
};

const mealPrepTasksV0202Base=mealPrepTasks0200;
mealPrepTasks0200=function(){
  const tasks=mealPrepTasksV0202Base();
  for(const task of tasks){
    const amounts=[];
    for(const use of task.uses||[]){
      const r=recipeById0200(use.recipeId);if(!r)continue;
      const src=(r.ings||[]).find(x=>x[0]===task.name&&(String(x[2]||'').trim()||'备好')===task.action);
      if(src)amounts.push(practicalAmount0202('food',task.name,src[1],r));
    }
    if(amounts.length)task.amount=aggregateAmounts0200(amounts);
  }
  return tasks;
};

function seasoningPack0202(name){
  const n=String(name||'');
  if(/食用油|菜籽油|色拉油|花生油|玉米油|生抽|老抽|酱油|料酒|黄酒|醋|香油|芝麻油|辣椒油/.test(n))return '1瓶';
  if(/盐|糖|淀粉|生粉|胡椒|孜然|五香|十三香|花椒|辣椒粉/.test(n))return '1小袋/盒';
  if(/酱|膏|底料|调料|调味料|汁$|料$/.test(n))return '1份成品';
  return '1份常规包装';
}
function foodPack0202(name,amount){
  const n=String(name||'');
  if(/葱|香菜|芫荽/.test(n))return '1小把';if(/姜/.test(n))return '1小块';if(/蒜/.test(n))return '1头';
  const p=parsedAmount0202(amount);if(!p)return '';
  if(['个','颗','根','片','盒','包','瓶','张','把','块','份'].includes(p.unit))return `${Math.max(1,Math.ceil(p.n))}${p.unit}`;
  if(p.dim==='mass'){
    const g=p.n,buy=g<=100?Math.ceil(g/50)*50:g<=500?Math.ceil(g/100)*100:Math.ceil(g/250)*250;return `约${buy}g`;
  }
  return '';
}
shoppingNeedText=function(item){
  if(!Array.isArray(item.needs)||!item.needs.length)return item.kind==='food'?'食材':item.kind==='seasoning'?'调味料':'厨具';
  const total=aggregateAmounts0200(item.needs.map(n=>n.amount).filter(Boolean)),uses=item.needs.length;
  if(item.kind==='seasoning')return `建议买${seasoningPack0202(item.name)}${total?` · 本餐预计用${total}`:''}${uses>1?` · 用于${uses}道/项`:''}`;
  if(item.kind==='food'){
    const pack=foodPack0202(item.name,total);
    if(pack&&total&&pack!==total)return `建议买${pack} · 本餐约用${total}${uses>1?` · 用于${uses}道/项`:''}`;
    return `${total?`本餐需要${total}`:'按菜谱采购'}${uses>1?` · 用于${uses}道/项`:''}`;
  }
  return '厨具';
};

const recipeModalV0202Base=recipeModal;
recipeModal=function(id){
  recipeModalV0202Base(id);const r=recipeById0200(id);if(!r)return;
  qa('[data-recipe-item]').forEach(b=>{
    const [kind,name]=b.dataset.recipeItem.split('|'),src=kind==='food'?(r.ings||[]).find(x=>x[0]===name):(r.season||[]).find(x=>x[0]===name),amt=b.querySelector('.chip-amount');
    if(!src||!amt)return;const shown=practicalAmount0202(kind,name,src[1],r);amt.textContent=shown;amt.classList.toggle('amount-reference-0202',String(shown).startsWith('参考'));
  });
};

function stepMentions0202(name,step){
  const n=String(name||''),s=String(step||'');if(n&&s.includes(n))return true;
  if(/食用油|菜籽油|色拉油|花生油|玉米油/.test(n)&&/(加油|下油|放油|油热|锅热.{0,5}油)/.test(s))return true;
  if(/盐/.test(n)&&/(加盐|放盐|补盐|盐调味)/.test(s))return true;
  if(/^糖$|白糖|砂糖/.test(n)&&/(加糖|放糖|白糖|砂糖)/.test(s))return true;
  if(/醋/.test(n)&&/(加醋|放醋|淋醋|陈醋|香醋)/.test(s))return true;
  if(/淀粉|生粉/.test(n)&&/(淀粉|勾芡)/.test(s))return true;
  return false;
}
function escapeRegex0202(s){return String(s||'').replace(/[.*+?^${}()|[\]\\]/g,'\\$&');}
function stepAlreadyQuantified0202(name,step){const e=escapeRegex0202(name),s=String(step||'');return new RegExp(`${e}.{0,8}\\d|\\d.{0,8}${e}`).test(s);}
function stepAmounts0202(r,step){
  let rows=(r.season||[]).filter(x=>stepMentions0202(x[0],step)&&!stepAlreadyQuantified0202(x[0],step));
  if(!rows.length&&/(全部调味|所有调味|调味即可|进行调味)/.test(String(step||'')))rows=(r.season||[]).filter(x=>x[2]).slice(0,4);
  return rows.slice(0,4).map(x=>({name:x[0],amount:practicalAmount0202('seasoning',x[0],x[1],r)})).filter(x=>x.amount&&x.amount!=='见步骤');
}
const stoveV0202Base=stove;
stove=function(){
  stoveV0202Base();if(!state.cook||q('.step-amounts-0202'))return;
  const r=recipeById0200(state.cook.recipe);if(!r)return;const step=r.steps?.[state.cook.step||0]||'',rows=stepAmounts0202(r,step);if(!rows.length)return;
  const box=document.createElement('div');box.className='step-amounts-0202';box.innerHTML=`<b>本步用量</b><div>${rows.map(x=>`<span>${x.name} · ${x.amount}</span>`).join('')}</div>`;
  q('.step')?.insertAdjacentElement('afterend',box);
};

const renderMealPlanV0202Base=renderMealPlan0200;
renderMealPlan0200=function(){renderMealPlanV0202Base();const note=q('.meal-scale-note');if(note)note.textContent='人数会自动换算用量；原菜谱写“适量”的项目会给出参考量，购物袋按实际购买单位提示。';};

syncMealShopping0200();
save();render();

;


/* ===== patch-v0202b.js ===== */
// V0.2.2 quantity semantic refinements for fats, stocks, eggs and cooked staples.
function fryProcess0202b(r){return /油炸|炸制|炸至|复炸|浸炸|下油锅|炸熟|炸酥/.test([...(r?.steps||[]),r?.desc||''].join(' '));}
const seasoningReferenceV0202bBase=seasoningReference0202;
seasoningReference0202=function(name,r,raw,target){
  const n=String(name||''),level=ambiguityFactor0202(raw),t=Math.max(1,target);
  if(/起酥油|熟猪油|猪油|牛油|黄油/.test(n)){
    if(fryProcess0202b(r)&&/适量|按需/.test(String(raw||'')))return '参考约500g';
    return ref0202(5*t*level,'g');
  }
  if(/豉油汁|蒸鱼豉油|豉油/.test(n))return ref0202(5*t*level,'ml');
  if(/鸡精|味精/.test(n))return ref0202(.5*t*level,'g');
  if(/食用油|菜籽油|色拉油|花生油|玉米油/.test(n)&&fryProcess0202b(r)&&/适量|按需/.test(String(raw||'')))return '参考约500ml';
  return seasoningReferenceV0202bBase(name,r,raw,target);
};

const foodReferenceV0202bBase=foodReference0202;
foodReference0202=function(name,r,raw,target){
  const n=String(name||''),level=ambiguityFactor0202(raw),t=Math.max(1,target);
  if(waterLike0202(n))return '按步骤加水';
  if(/茶叶蛋|卤蛋|荷包蛋|煎蛋|鸡蛋|鸭蛋|鹅蛋|鹌鹑蛋/.test(n))return `${Math.max(1,Math.round(t*level))}个`;
  if(/老鸡汤|高汤|鸡汤|骨汤|汤底|浓汤/.test(n))return ref0202(150*t*level,'ml');
  if(/^米饭$|熟米饭/.test(n))return ref0202(150*t*level,'g');
  if(/^大米$|生米/.test(n))return ref0202(70*t*level,'g');
  if(/小母鸡|老母鸡|整鸡|童子鸡|三黄鸡/.test(n))return ref0202(250*t*level,'g');
  return foodReferenceV0202bBase(name,r,raw,target);
};

const seasoningPackV0202bBase=seasoningPack0202;
seasoningPack0202=function(name){
  const n=String(name||'');
  if(/起酥油|熟猪油|猪油|牛油|黄油/.test(n))return '1盒/袋';
  return seasoningPackV0202bBase(name);
};

syncMealShopping0200();
save();render();

;


/* ===== patch-v0300.js ===== */
// V0.3.0 scalable kitchen data foundation: large inventory, bulk manual entry and recommendation ranking.
state.version='0.3.0';

if(!state.inventoryMeta||typeof state.inventoryMeta!=='object')state.inventoryMeta={};
if(!Array.isArray(state.stapleSeasonings))state.stapleSeasonings=[];
if(typeof state.fridgeQuery!=='string')state.fridgeQuery='';
if(typeof state.manageQuery0300!=='string')state.manageQuery0300='';
if(typeof state.manageCategory0300!=='string')state.manageCategory0300='';
if(!['best','easy','fast','clear'].includes(state.recommendMode0300))state.recommendMode0300='best';

function itemKind0300(name){
  if(SEASON.includes(name))return 'seasoning';
  if(TOOLS.includes(name))return 'tool';
  return 'food';
}
function foodCategory0300(name){
  if(typeof SEMI_PREPARED!=='undefined'&&SEMI_PREPARED.includes(name))return '半成品';
  if(typeof foodGroup15==='function')return foodGroup15(name);
  return '其他食材';
}
function seasoningCategory0300(name){
  if(typeof seasoningGroup118==='function')return seasoningGroup118(name);
  if(/盐|糖|生抽|老抽|酱油|蚝油|料酒|醋|淀粉|味精|鸡精/.test(name))return '基础调味';
  if(/八角|花椒|胡椒|孜然|桂皮|香叶|芝麻|辣椒/.test(name))return '香辛料';
  if(/酱|汁|油$/.test(name))return '酱汁酱料';
  return '其他';
}
function ensureCatalog0300(){
  for(const r of recipes){
    for(const row of r.ings||[]){
      const n=row[0];if(n&&!FOOD[n]&&!SEASON.includes(n))FOOD[n]='🥣';
    }
    for(const row of r.season||[]){
      const n=row[0];if(n&&!SEASON.includes(n))SEASON.push(n);
    }
    for(const group of r.tools||[])for(const n of group||[])if(n&&!TOOLS.includes(n))TOOLS.push(n);
  }
}
ensureCatalog0300();

function catalogNames0300(tab){
  if(tab==='seasoning'||tab==='staple')return [...SEASON];
  if(tab==='tool')return [...TOOLS];
  const all=Object.keys(FOOD);
  if(tab==='semi')return all.filter(n=>typeof SEMI_PREPARED!=='undefined'&&SEMI_PREPARED.includes(n));
  return all.filter(n=>!(typeof SEMI_PREPARED!=='undefined'&&SEMI_PREPARED.includes(n)));
}
function category0300(tab,name){
  if(tab==='seasoning'||tab==='staple')return seasoningCategory0300(name);
  if(tab==='tool')return '厨具';
  return foodCategory0300(name);
}
function icon0300(kind,name){
  return kind==='food'?(FOOD[name]||'🥣'):kind==='seasoning'?'🧂':'🍳';
}
function ownedNames0300(kind){
  if(kind==='food')return [...state.foods];
  if(kind==='seasoning')return SEASON.filter(n=>has('seasoning',n));
  return TOOLS.filter(n=>has('tool',n));
}
function markStaple0300(name,on){
  state.stapleSeasonings=uniq((state.stapleSeasonings||[]).filter(n=>SEASON.includes(n)));
  if(on){
    if(!has('seasoning',name))have('seasoning',name);
    state.stapleSeasonings=uniq([...state.stapleSeasonings,name]);
  }else state.stapleSeasonings=state.stapleSeasonings.filter(n=>n!==name);
  save();
}
function inventoryCount0300(){
  return {food:state.foods.length,season:ownedNames0300('seasoning').length,staple:state.stapleSeasonings.length,tool:ownedNames0300('tool').length};
}
function ownedChip0300(kind,name){
  const staple=kind==='seasoning'&&state.stapleSeasonings.includes(name);
  return `<button class="inventory-chip-0300" data-fridge-remove="${kind}|${name}" title="点击移除"><span>${icon0300(kind,name)}</span><b>${name}</b>${staple?'<i>常备</i>':''}<em>×</em></button>`;
}
function fridgeSection0300(title,kind,names,tab,sub=''){
  const qv=state.fridgeQuery.trim();
  const list=names.filter(n=>!qv||n.includes(qv));
  return `<section class="inventory-section-0300 card"><div class="inventory-head-0300"><div><b>${title}</b><small>${sub||names.length+' 种'}</small></div><button class="mini-add" data-manage-0300="${tab}">＋ 管理</button></div>${list.length?`<div class="inventory-chips-0300">${list.map(n=>ownedChip0300(kind,n)).join('')}</div>`:`<div class="empty">${qv?'没有匹配的已记录物品':'还没有记录'}</div>`}</section>`;
}

fridge=function(){
  const c=inventoryCount0300();
  const foods=ownedNames0300('food').filter(n=>!(typeof SEMI_PREPARED!=='undefined'&&SEMI_PREPARED.includes(n)));
  const semis=ownedNames0300('food').filter(n=>typeof SEMI_PREPARED!=='undefined'&&SEMI_PREPARED.includes(n));
  const seasons=ownedNames0300('seasoning').sort((a,b)=>(state.stapleSeasonings.includes(b)?1:0)-(state.stapleSeasonings.includes(a)?1:0)||a.localeCompare(b,'zh-CN'));
  const tools=ownedNames0300('tool');
  q('#root').innerHTML=`<h2>🧊 冰箱</h2>
    <div class="inventory-overview-0300">
      <div><b>${c.food}</b><small>食材/半成品</small></div>
      <div><b>${c.season}</b><small>调味料</small></div>
      <div><b>${c.staple}</b><small>常备</small></div>
      <div><b>${c.tool}</b><small>厨具</small></div>
    </div>
    <div class="inventory-search-0300"><input id="fridgeSearch0300" class="search" placeholder="搜索已记录的食材、调味料或厨具" value="${state.fridgeQuery}"><button id="fridgeAdd0300">＋ 批量添加</button></div>
    <div class="inventory-note-0300">不要求精确称重。食材先记录“有/没有”，盐、生抽等可设为“常备”。</div>
    ${fridgeSection0300('食材','food',foods,'food')}
    ${fridgeSection0300('半成品','food',semis,'semi')}
    ${fridgeSection0300('调味料','seasoning',seasons,'seasoning',`${seasons.length} 种 · 常备 ${c.staple} 种`)}
    ${fridgeSection0300('厨具','tool',tools,'tool')}`;
  q('#fridgeSearch0300').oninput=e=>{state.fridgeQuery=e.target.value;save();fridge()};
  q('#fridgeAdd0300').onclick=()=>manageModal('food');
  qa('[data-manage-0300]').forEach(b=>b.onclick=()=>manageModal(b.getAttribute('data-manage-0300')));
  qa('[data-fridge-remove]').forEach(b=>b.onclick=()=>{
    const [kind,name]=b.dataset.fridgeRemove.split('|');
    if(kind==='seasoning')markStaple0300(name,false);
    missing(kind,name);fridge();
  });
};

function manageCategories0300(tab,names){
  const counts={};
  for(const n of names){const g=category0300(tab,n);counts[g]=(counts[g]||0)+1}
  return Object.entries(counts).sort((a,b)=>b[1]-a[1]);
}
function setPickerState0300(btn,on,tab,name){
  btn.classList.toggle('on',on);
  const mark=btn.querySelector('.picker-mark-0300');if(mark)mark.textContent=on?'✓':'＋';
  if(tab==='staple')btn.classList.toggle('staple-on',on);
}
manageModal=function(tab='food'){
  if(!['food','semi','seasoning','staple','tool'].includes(tab))tab='food';
  const kind=(tab==='seasoning'||tab==='staple')?'seasoning':tab==='tool'?'tool':'food';
  let all=catalogNames0300(tab);
  if(tab==='staple')all=all.filter(n=>has('seasoning',n));
  const query=(state.manageQuery0300||'').trim();
  const cats=manageCategories0300(tab,all);
  if(!state.manageCategory0300||!cats.some(x=>x[0]===state.manageCategory0300))state.manageCategory0300=cats[0]?.[0]||'';
  let names=all.filter(n=>!query||n.includes(query));
  if(!query&&tab!=='tool'&&state.manageCategory0300)names=names.filter(n=>category0300(tab,n)===state.manageCategory0300);
  names.sort((a,b)=>{
    const ao=tab==='staple'?state.stapleSeasonings.includes(a):has(kind,a);
    const bo=tab==='staple'?state.stapleSeasonings.includes(b):has(kind,b);
    return Number(bo)-Number(ao)||a.localeCompare(b,'zh-CN');
  });
  const selectedCount=tab==='staple'?state.stapleSeasonings.length:ownedNames0300(kind).length;
  const tabLabel={food:'食材',semi:'半成品',seasoning:'调味料',staple:'常备',tool:'厨具'};
  q('#modal').innerHTML=`<div class="modal"><div class="sheet inventory-sheet-0300"><div class="sheet-handle"></div>
    <div class="sheet-head"><div class="title"><b>厨房物品</b><small>手动批量选择 · 已记录 <span id="manageSelectedCount0300">${selectedCount}</span></small></div><button class="icon-close" id="x">×</button></div>
    <div class="manage-tabs manage-tabs-0300">${['food','semi','seasoning','staple','tool'].map(t=>`<button data-tab-0300="${t}" class="${tab===t?'on':''}">${tabLabel[t]}</button>`).join('')}</div>
    <div class="manage-search-0300"><input id="manageSearch0300" class="search" placeholder="搜索${tabLabel[tab]}" value="${state.manageQuery0300}"><small>${names.length}/${all.length}</small></div>
    ${!query&&tab!=='tool'?`<div class="manage-categories-0300">${cats.map(([g,n])=>`<button data-cat-0300="${g}" class="${state.manageCategory0300===g?'on':''}">${g}<small>${n}</small></button>`).join('')}</div>`:''}
    ${tab==='staple'?'<div class="manage-help-0300">这里只显示你已经拥有的调味料。设为常备后，系统仍按“家里有”参与菜谱匹配，但你不用反复维护数量。</div>':''}
    <div class="picker-grid manage-picker manage-picker-0300">${names.length?names.map(n=>{
      const on=tab==='staple'?state.stapleSeasonings.includes(n):has(kind,n);
      return `<button class="pick picker-0300 ${on?'on':''} ${tab==='staple'&&on?'staple-on':''}" data-pick-0300="${tab}|${n}"><span>${icon0300(kind,n)}</span><b>${n}</b><i class="picker-mark-0300">${on?'✓':'＋'}</i></button>`;
    }).join(''):'<div class="empty">没有找到</div>'}</div>
    <div class="sheet-footer"><button class="primary" id="manageDone0300">完成</button></div></div></div>`;
  const done=()=>{state.manageQuery0300='';state.manageCategory0300='';save();close();render()};
  q('#x').onclick=done;q('#manageDone0300').onclick=done;
  q('#manageSearch0300').oninput=e=>{state.manageQuery0300=e.target.value;save();manageModal(tab)};
  qa('[data-tab-0300]').forEach(b=>b.onclick=()=>{state.manageQuery0300='';state.manageCategory0300='';save();manageModal(b.getAttribute('data-tab-0300'))});
  qa('[data-cat-0300]').forEach(b=>b.onclick=()=>{state.manageCategory0300=b.getAttribute('data-cat-0300');save();manageModal(tab)});
  qa('[data-pick-0300]').forEach(b=>b.onclick=()=>{
    const sep=b.getAttribute('data-pick-0300').indexOf('|'),t=b.getAttribute('data-pick-0300').slice(0,sep),name=b.getAttribute('data-pick-0300').slice(sep+1);
    if(t==='staple'){
      const on=!state.stapleSeasonings.includes(name);markStaple0300(name,on);setPickerState0300(b,on,t,name);
    }else{
      const k=(t==='seasoning')?'seasoning':t==='tool'?'tool':'food',on=!has(k,name);
      on?have(k,name):missing(k,name);
      if(k==='seasoning'&&!on)markStaple0300(name,false);
      setPickerState0300(b,on,t,name);
    }
    const cnt=t==='staple'?state.stapleSeasonings.length:ownedNames0300((t==='seasoning')?'seasoning':t==='tool'?'tool':'food').length;
    const el=q('#manageSelectedCount0300');if(el)el.textContent=cnt;
  });
};

function recipeInventoryStats0300(r){
  const reqFoods=(r.ings||[]).map(x=>x[0]).filter(n=>!(typeof waterLike0202==='function'&&waterLike0202(n)));
  const reqSeason=(r.season||[]).filter(x=>x[2]).map(x=>x[0]);
  const ownedFood=reqFoods.filter(n=>has('food',n)).length;
  const ownedSeason=reqSeason.filter(n=>has('seasoning',n)).length;
  const missingFood=reqFoods.length-ownedFood,missingSeason=reqSeason.length-ownedSeason;
  const toolMissing=toolOK(r)?0:1;
  const prep=(r.ings||[]).filter(x=>String(x[2]||'').trim()).length;
  const steps=(r.steps||[]).length;
  const pans=new Set((r.tools||[]).flat()).size;
  return {reqFoods,reqSeason,ownedFood,ownedSeason,missingFood,missingSeason,toolMissing,prep,steps,pans};
}
function recipeScore0300(r,mode=state.recommendMode0300){
  const x=recipeInventoryStats0300(r),mins=Number(r.mins)||99,tags=(r.tags||[]).join('|');
  const readyPenalty=x.missingFood*900+x.missingSeason*250+x.toolMissing*700;
  const easy=mins+x.steps*3+x.prep*4+x.pans*3-(/省事|一锅|快手/.test(tags)?12:0);
  if(mode==='fast')return readyPenalty+mins*2+x.steps;
  if(mode==='easy')return readyPenalty+easy;
  if(mode==='clear')return readyPenalty-x.ownedFood*90-x.reqFoods.length*8+easy*.5;
  return readyPenalty-x.ownedFood*35-x.ownedSeason*8+easy*.7;
}
const recipeBodyV0300Base=recipeBody;
recipeBody=function(list){
  const sorted=[...list].sort((a,b)=>recipeScore0300(a)-recipeScore0300(b)||String(a.name).localeCompare(String(b.name),'zh-CN'));
  return recipeBodyV0300Base(sorted);
};
function recommendLabel0300(){
  return {best:'最适合现在',easy:'最省事',fast:'最快做好',clear:'优先清库存'}[state.recommendMode0300]||'最适合现在';
}
function addRecommendBar0300(){
  if(state.prep||state.mealView||state.boardMode==='ingredients'||q('.recommend-bar-0300'))return;
  const anchor=q('.board-mode')||q('.board-tools');if(!anchor)return;
  const box=document.createElement('div');box.className='recommend-bar-0300';
  const c=inventoryCount0300();
  box.innerHTML=`<div class="recommend-title-0300"><div><b>今天先看哪些</b><small>从 ${recipes.length} 道菜谱里按库存和条件排序</small></div><span>${c.food} 种食材</span></div><div class="recommend-modes-0300">${[['best','最适合'],['easy','省事'],['fast','最快'],['clear','清库存']].map(([k,n])=>`<button data-recommend-0300="${k}" class="${state.recommendMode0300===k?'on':''}">${n}</button>`).join('')}</div><p>当前：<b>${recommendLabel0300()}</b>。缺少食材和厨具的菜会自动往后排。</p>`;
  anchor.insertAdjacentElement('afterend',box);
  qa('[data-recommend-0300]').forEach(b=>b.onclick=()=>{state.recommendMode0300=b.getAttribute('data-recommend-0300');state.recipeLimit=36;save();board()});
}
const boardV0300Base=board;
board=function(){boardV0300Base();addRecommendBar0300();};

save();
render();

;


/* ===== patch-v0400.js ===== */
// V0.4.0 information architecture refresh: Home + My, cleaner daily workflow.
state.version='0.4.0';

if(!Number.isFinite(state.homeRecommendCount040))state.homeRecommendCount040=3;
state.homeRecommendCount040=Math.max(3,Math.min(5,state.homeRecommendCount040));
if(!['best','easy','fast','clear'].includes(state.recommendMode0300))state.recommendMode0300='best';

(function restoreScene040(){
  const p=window.__MK_PRELOAD;
  if(p&&['home','fridge','board','stove','mine'].includes(p.scene))state.scene=p.scene;
  else if(!window.__MK_HAD_STATE)state.scene='home';
})();

function sceneMeta040(scene){
  return {
    home:['首页','今天吃什么'],
    fridge:['冰箱','我有什么'],
    board:['菜板','决定这一顿'],
    stove:['灶台','怎么做'],
    mine:['我的','设置']
  }[scene]||['我的小厨房',''];
}
function setChrome040(){
  const meta=sceneMeta040(state.scene);
  const h=q('.top-title h1'),sub=q('#sub');
  if(h)h.textContent=meta[0];
  if(sub)sub.textContent=meta[1];
  qa('.nav button').forEach(b=>b.classList.toggle('on',b.dataset.s===state.scene));
  document.body.classList.toggle('cooking-040',state.scene==='stove'&&!!state.cook);
}
function normalRecipes040(){
  return recipes.filter(r=>r&&r.id&&r.name&&r.cat!=='调味配方'&&!/饮品|饮料/.test(String(r.cat||'')));
}
function homeRecommendations040(){
  return normalRecipes040()
    .slice()
    .sort((a,b)=>recipeScore0300(a,state.recommendMode0300)-recipeScore0300(b,state.recommendMode0300)||a.mins-b.mins)
    .slice(0,state.homeRecommendCount040);
}
function recommendationReason040(r){
  const x=recipeInventoryStats0300(r);
  if(x.missingFood===0&&x.missingSeason===0&&x.toolMissing===0)return '食材齐全';
  if(x.missingFood===0&&x.toolMissing===0&&x.missingSeason<=1)return x.missingSeason?'只差 1 种调味':'基本齐全';
  if(x.missingFood===1&&x.toolMissing===0)return '只差 1 样食材';
  return `缺 ${x.missingFood+x.missingSeason+x.toolMissing} 项`;
}
function modeCopy040(){
  return {best:'最适合',easy:'省事',fast:'最快',clear:'清库存'}[state.recommendMode0300]||'最适合';
}
function mealNames040(){
  if(!state.meal?.dishes?.length)return [];
  return state.meal.dishes.map(id=>recipeById0200(id)).filter(Boolean);
}
function home040(){
  const count=inventoryCount0300();
  const meal=mealNames040();
  const recs=homeRecommendations040();
  const cooking=state.cook?recipeById0200(state.cook.recipe):null;
  q('#root').innerHTML=`<div class="home-040">
    <section class="home-hero-040">
      <div>
        <small>你的厨房</small>
        <h2>今天吃什么？</h2>
        <p>${count.food? `已有 ${count.food} 种食材 · ${count.season} 种调味料`:'先把家里现有的东西记进冰箱'}</p>
      </div>
      <button id="homeFridge040">管理冰箱</button>
    </section>

    ${cooking?`<section class="continue-040">
      <div><small>正在做</small><b>${cooking.name}</b><span>第 ${(state.cook.step||0)+1} / ${cooking.steps?.length||1} 步</span></div>
      <button id="continueCook040">继续做饭</button>
    </section>`:meal.length?`<section class="continue-040 soft">
      <div><small>这一顿</small><b>${meal.map(r=>r.name).slice(0,3).join(' · ')}${meal.length>3?'…':''}</b><span>${meal.length} 道 · ${state.meal.servings||2} 人份</span></div>
      <button id="continueMeal040">继续安排</button>
    </section>`:''}

    <section class="home-section-040">
      <div class="home-section-head-040"><div><h3>为你推荐</h3><p>只给少量值得看的选择</p></div><button id="moreRecipes040">更多</button></div>
      <div class="home-modes-040">${[['best','适合'],['easy','省事'],['fast','最快'],['clear','清库存']].map(([k,n])=>`<button data-home-mode-040="${k}" class="${state.recommendMode0300===k?'on':''}">${n}</button>`).join('')}</div>
      ${count.food? `<div class="home-recipe-list-040">${recs.map((r,i)=>`<button class="home-recipe-040" data-home-recipe-040="${r.id}">
        <span class="rank-040">${i+1}</span>
        <div class="home-recipe-copy-040"><b>${r.name}</b><small>${r.mins||'--'} 分钟 · ${recommendationReason040(r)}</small></div>
        <span class="arrow-040">›</span>
      </button>`).join('')}</div>`:`<div class="home-empty-040"><b>还没有可用库存</b><p>先记录几种常用食材，首页就会根据你的厨房推荐。</p><button id="homeAdd040">去添加食材</button></div>`}
    </section>

    <section class="home-kitchen-040">
      <button data-home-jump-040="fridge"><b>${count.food}</b><small>食材</small></button>
      <button data-home-jump-040="fridge"><b>${count.season}</b><small>调味料</small></button>
      <button data-home-jump-040="board"><b>${normalRecipes040().length}</b><small>菜谱</small></button>
      <button data-home-jump-040="mine"><b>V0.4</b><small>设置</small></button>
    </section>
  </div>`;
  q('#homeFridge040').onclick=()=>go('fridge');
  const add=q('#homeAdd040');if(add)add.onclick=()=>{go('fridge');setTimeout(()=>manageModal('food'),0)};
  q('#moreRecipes040').onclick=()=>go('board');
  const cc=q('#continueCook040');if(cc)cc.onclick=()=>go('stove');
  const cm=q('#continueMeal040');if(cm)cm.onclick=()=>{state.mealView=true;state.mealPage='plan';save();go('board')};
  qa('[data-home-mode-040]').forEach(b=>b.onclick=()=>{state.recommendMode0300=b.getAttribute('data-home-mode-040');save();home040();setChrome040()});
  qa('[data-home-recipe-040]').forEach(b=>b.onclick=()=>recipeModal(b.getAttribute('data-home-recipe-040')));
  qa('[data-home-jump-040]').forEach(b=>b.onclick=()=>go(b.getAttribute('data-home-jump-040')));
}

function settingRow040(title,desc,control){
  return `<div class="setting-row-040"><div><b>${title}</b><small>${desc}</small></div><div class="setting-control-040">${control}</div></div>`;
}
function mine040(){
  const count=inventoryCount0300();
  const servings=Math.max(1,state.meal?.servings||2);
  const view=state.viewMode==='list'?'list':'cards';
  q('#root').innerHTML=`<div class="mine-040">
    <div class="mine-title-040"><h2>我的小厨房</h2><p>把不常用的功能和偏好放在这里。</p></div>

    <section class="settings-card-040">
      <h3>做饭偏好</h3>
      ${settingRow040('默认人数','本餐用量会按人数换算',`<div class="mini-stepper-040"><button id="mineServMinus040">−</button><b>${servings}</b><button id="mineServPlus040">＋</button></div>`)}
      ${settingRow040('首页默认推荐','决定首页优先怎么排序',`<select id="mineMode040"><option value="best" ${state.recommendMode0300==='best'?'selected':''}>最适合现在</option><option value="easy" ${state.recommendMode0300==='easy'?'selected':''}>最省事</option><option value="fast" ${state.recommendMode0300==='fast'?'selected':''}>最快做好</option><option value="clear" ${state.recommendMode0300==='clear'?'selected':''}>优先清库存</option></select>`)}
      ${settingRow040('首页推荐数量','首页保持克制，只显示少量菜',`<div class="segmented-040"><button data-rec-count-040="3" class="${state.homeRecommendCount040===3?'on':''}">3 道</button><button data-rec-count-040="5" class="${state.homeRecommendCount040===5?'on':''}">5 道</button></div>`)}
      ${settingRow040('菜谱显示','菜板的默认浏览方式',`<div class="segmented-040"><button data-view-040="cards" class="${view==='cards'?'on':''}">卡片</button><button data-view-040="list" class="${view==='list'?'on':''}">列表</button></div>`)}
    </section>

    <section class="settings-card-040">
      <h3>厨房数据</h3>
      <div class="data-summary-040"><span><b>${count.food}</b> 食材</span><span><b>${count.season}</b> 调味料</span><span><b>${count.tool}</b> 厨具</span><span><b>${recipes.length}</b> 菜谱</span></div>
      <button class="settings-link-040" id="mineManage040"><span>管理厨房物品</span><i>›</i></button>
      <button class="settings-link-040 danger" id="mineReset040"><span>重置本地数据</span><i>›</i></button>
    </section>

    <section class="about-040"><b>我的小厨房 · V0.4.0</b><p>首页负责推荐，冰箱负责库存，菜板负责组织这一顿，灶台负责执行。</p></section>
  </div>`;

  q('#mineServMinus040').onclick=()=>{setServings0200(Math.max(1,servings-1));mine040();setChrome040()};
  q('#mineServPlus040').onclick=()=>{setServings0200(Math.min(12,servings+1));mine040();setChrome040()};
  q('#mineMode040').onchange=e=>{state.recommendMode0300=e.target.value;save()};
  qa('[data-rec-count-040]').forEach(b=>b.onclick=()=>{state.homeRecommendCount040=Number(b.getAttribute('data-rec-count-040'));save();mine040();setChrome040()});
  qa('[data-view-040]').forEach(b=>b.onclick=()=>{state.viewMode=b.getAttribute('data-view-040');save();mine040();setChrome040()});
  q('#mineManage040').onclick=()=>go('fridge');
  q('#mineReset040').onclick=()=>resetConfirm040();
}
function resetConfirm040(){
  q('#modal').innerHTML=`<div class="modal"><div class="sheet small-sheet-040"><div class="sheet-handle"></div><div class="sheet-head"><div class="title"><b>重置本地数据？</b><small>会清空库存、购物袋、本餐和偏好，菜谱库不会删除。</small></div><button class="icon-close" id="x">×</button></div><div class="sheet-footer"><div class="dual"><button class="secondary" id="resetCancel040">取消</button><button class="danger" id="resetOK040">确认重置</button></div></div></div></div>`;
  q('#x').onclick=close;q('#resetCancel040').onclick=close;
  q('#resetOK040').onclick=()=>{localStorage.removeItem('mk01');location.reload()};
}

// Recommendation belongs on Home from V0.4 onward; keep Board focused on choosing and organizing the meal.
addRecommendBar0300=function(){};

const renderV040Base=render;
render=function(){
  if(state.scene==='home'){home040();setChrome040();return}
  if(state.scene==='mine'){mine040();setChrome040();return}
  renderV040Base();
  setChrome040();
};

save();
render();

;


/* ===== patch-v0401.js ===== */
// V0.4.1 remove the global top bar and keep shopping where it belongs: the fridge.
state.version='0.4.1';

const fridgeV041Base=fridge;
fridge=function(){
  fridgeV041Base();
  const h=q('#root > h2');
  if(h&&!q('.fridge-topline-041')){
    const row=document.createElement('div');
    row.className='fridge-topline-041';
    h.replaceWith(row);
    row.appendChild(h);
    const btn=document.createElement('button');
    btn.className='fridge-shopping-041';
    btn.id='fridgeShopping041';
    btn.innerHTML=`购物清单${state.shopping.length?` <b>${state.shopping.length}</b>`:''}`;
    btn.onclick=()=>shoppingModal();
    row.appendChild(btn);
  }
};

save();
render();

;


/* ===== patch-v0402.js ===== */
// V0.4.2 safe inventory interactions + repaired bulk add flow.
state.version='0.4.3';

const DELETE_WINDOW_0420=2600;
const pendingDelete0420=new Map();

function deleteKey0420(kind,name,scope='inventory'){return scope+'|'+kind+'|'+name}
function clearDelete0420(key,btn){
  const rec=pendingDelete0420.get(key);
  if(rec?.timer)clearTimeout(rec.timer);
  pendingDelete0420.delete(key);
  if(btn){
    btn.classList.remove('delete-armed-0420');
    btn.removeAttribute('aria-label');
    const hint=btn.querySelector('.delete-hint-0420');
    if(hint)hint.remove();
    const em=btn.querySelector('em');
    if(em)em.textContent='×';
    const mark=btn.querySelector('.picker-mark-0300');
    if(mark)mark.textContent='✓';
  }
}
function armDelete0420(btn,kind,name,scope='inventory',onConfirm){
  const key=deleteKey0420(kind,name,scope);
  if(pendingDelete0420.has(key)){
    clearDelete0420(key,btn);
    onConfirm();
    return true;
  }
  // Only one armed delete at a time to keep the UI predictable.
  for(const [other,rec] of pendingDelete0420){
    clearDelete0420(other,rec.btn);
  }
  btn.classList.add('delete-armed-0420');
  btn.setAttribute('aria-label','再点一次确认删除 '+name);
  const em=btn.querySelector('em');
  if(em)em.textContent='再点删除';
  const mark=btn.querySelector('.picker-mark-0300');
  if(mark)mark.textContent='删除?';
  if(!btn.querySelector('.delete-hint-0420')){
    const hint=document.createElement('span');
    hint.className='delete-hint-0420';
    btn.appendChild(hint);
  }
  const timer=setTimeout(()=>clearDelete0420(key,btn),DELETE_WINDOW_0420);
  pendingDelete0420.set(key,{timer,btn});
  return false;
}
function removeOwned0420(kind,name){
  if(kind==='seasoning')markStaple0300(name,false);
  missing(kind,name);
  save();
}
function bindSafeFridgeDeletes0420(){
  qa('[data-fridge-remove]').forEach(btn=>{
    btn.onclick=e=>{
      e.preventDefault();
      const raw=btn.dataset.fridgeRemove||'';
      const cut=raw.indexOf('|');
      if(cut<0)return;
      const kind=raw.slice(0,cut),name=raw.slice(cut+1);
      armDelete0420(btn,kind,name,'fridge',()=>{
        removeOwned0420(kind,name);
        fridge();
        toast('已移除 '+name);
      });
    };
  });
}

const fridgeV0420Base=fridge;
fridge=function(){
  fridgeV0420Base();
  bindSafeFridgeDeletes0420();
};

function pickerOwned0420(tab,kind,name){
  return tab==='staple'?state.stapleSeasonings.includes(name):has(kind,name);
}
function pickerRemove0420(tab,kind,name){
  if(tab==='staple'){
    markStaple0300(name,false);
    return;
  }
  removeOwned0420(kind,name);
}
function pickerAdd0420(tab,kind,name){
  if(tab==='staple'){
    markStaple0300(name,true);
    return;
  }
  have(kind,name);
}
function pickerLabel0420(tab){return {food:'食材',semi:'半成品',seasoning:'调味料',staple:'常备',tool:'厨具'}[tab]||'食材'}

manageModal=function(tab='food'){
  if(!['food','semi','seasoning','staple','tool'].includes(tab))tab='food';
  const kind=(tab==='seasoning'||tab==='staple')?'seasoning':tab==='tool'?'tool':'food';
  let all=catalogNames0300(tab);
  if(tab==='staple')all=all.filter(n=>has('seasoning',n));
  const query=(state.manageQuery0300||'').trim();
  const cats=manageCategories0300(tab,all);
  if(!state.manageCategory0300||!cats.some(x=>x[0]===state.manageCategory0300))state.manageCategory0300=cats[0]?.[0]||'';
  let names=all.filter(n=>!query||n.includes(query));
  if(!query&&tab!=='tool'&&state.manageCategory0300)names=names.filter(n=>category0300(tab,n)===state.manageCategory0300);
  names.sort((a,b)=>Number(pickerOwned0420(tab,kind,b))-Number(pickerOwned0420(tab,kind,a))||a.localeCompare(b,'zh-CN'));
  const selectedCount=tab==='staple'?state.stapleSeasonings.length:ownedNames0300(kind).length;
  const label=pickerLabel0420(tab);

  q('#modal').innerHTML=`<div class="modal"><div class="sheet inventory-sheet-0300"><div class="sheet-handle"></div>
    <div class="sheet-head"><div class="title"><b>厨房物品</b><small>点一下添加；已有物品需连续点两次才会删除</small></div><button class="icon-close" id="x">×</button></div>
    <div class="manage-tabs manage-tabs-0300">${['food','semi','seasoning','staple','tool'].map(t=>`<button data-tab-0420="${t}" class="${tab===t?'on':''}">${pickerLabel0420(t)}</button>`).join('')}</div>
    <div class="manage-search-0300"><input id="manageSearch0420" class="search" placeholder="搜索${label}" value="${state.manageQuery0300}"><small><span id="manageSelectedCount0420">${selectedCount}</span> 已有 · ${names.length}/${all.length}</small></div>
    ${!query&&tab!=='tool'?`<div class="manage-categories-0300">${cats.map(([g,n])=>`<button data-cat-0420="${g}" class="${state.manageCategory0300===g?'on':''}">${g}<small>${n}</small></button>`).join('')}</div>`:''}
    ${tab==='staple'?'<div class="manage-help-0300">常备不会从厨房删除调味料，只是取消“常备”标记；同样采用二次确认，避免误触。</div>':''}
    <div class="picker-grid manage-picker manage-picker-0300">${names.length?names.map(n=>{
      const on=pickerOwned0420(tab,kind,n);
      return `<button class="pick picker-0300 ${on?'on':''} ${tab==='staple'&&on?'staple-on':''}" data-pick-0420="${encodeURIComponent(n)}">
        <span>${icon0300(kind,n)}</span><b>${n}</b><i class="picker-mark-0300">${on?'✓':'＋'}</i>
      </button>`;
    }).join(''):'<div class="empty">没有找到</div>'}</div>
    <div class="sheet-footer"><button class="primary" id="manageDone0420">完成</button></div>
  </div></div>`;

  const done=()=>{state.manageQuery0300='';state.manageCategory0300='';save();close();render()};
  q('#x').onclick=done;q('#manageDone0420').onclick=done;
  q('#manageSearch0420').oninput=e=>{state.manageQuery0300=e.target.value;save();manageModal(tab)};
  qa('[data-tab-0420]').forEach(b=>b.onclick=()=>{state.manageQuery0300='';state.manageCategory0300='';save();manageModal(b.getAttribute('data-tab-0420'))});
  qa('[data-cat-0420]').forEach(b=>b.onclick=()=>{state.manageCategory0300=b.getAttribute('data-cat-0420');save();manageModal(tab)});

  qa('[data-pick-0420]').forEach(btn=>btn.onclick=()=>{
    const name=decodeURIComponent(btn.getAttribute('data-pick-0420')||'');
    const on=pickerOwned0420(tab,kind,name);
    if(!on){
      pickerAdd0420(tab,kind,name);
      btn.classList.add('on');
      if(tab==='staple')btn.classList.add('staple-on');
      const mark=btn.querySelector('.picker-mark-0300');if(mark)mark.textContent='✓';
      const cnt=tab==='staple'?state.stapleSeasonings.length:ownedNames0300(kind).length;
      const c=q('#manageSelectedCount0420');if(c)c.textContent=cnt;
      toast('已添加 '+name);
      return;
    }
    armDelete0420(btn,kind,name,'picker:'+tab,()=>{
      pickerRemove0420(tab,kind,name);
      btn.classList.remove('on','staple-on');
      const mark=btn.querySelector('.picker-mark-0300');if(mark)mark.textContent='＋';
      const cnt=tab==='staple'?state.stapleSeasonings.length:ownedNames0300(kind).length;
      const c=q('#manageSelectedCount0420');if(c)c.textContent=cnt;
      toast(tab==='staple'?'已取消常备 '+name:'已移除 '+name);
    });
  });
};

save();
render();

;


/* ===== patch-v0404.js ===== */
// V0.4.4 inventory UI stabilization.
// Fresh implementations are loaded last to avoid stale/cached event bindings from earlier patches.
state.version='0.4.5';

function fridgeSection044(title,kind,names,tab,sub=''){
  const qv=String(state.fridgeQuery||'').trim();
  const list=names.filter(n=>!qv||n.includes(qv));
  return `<section class="inventory-section-044">
    <div class="inventory-head-044">
      <div><b>${title}</b><small>${sub||names.length+' 种'}</small></div>
      <button type="button" class="manage-btn-044" data-manage-044="${tab}">管理</button>
    </div>
    ${list.length
      ? `<div class="inventory-chips-044">${list.map(n=>ownedChip0300(kind,n)).join('')}</div>`
      : `<div class="empty inventory-empty-044">${qv?'没有匹配的已记录物品':'还没有记录'}</div>`}
  </section>`;
}

fridge=function(){
  const c=inventoryCount0300();
  const allFood=ownedNames0300('food');
  const foods=allFood.filter(n=>!(typeof SEMI_PREPARED!=='undefined'&&SEMI_PREPARED.includes(n)));
  const semis=allFood.filter(n=>typeof SEMI_PREPARED!=='undefined'&&SEMI_PREPARED.includes(n));
  const seasons=ownedNames0300('seasoning').sort((a,b)=>(state.stapleSeasonings.includes(b)?1:0)-(state.stapleSeasonings.includes(a)?1:0)||a.localeCompare(b,'zh-CN'));
  const tools=ownedNames0300('tool');

  q('#root').innerHTML=`<div class="fridge-044">
    <div class="fridge-title-044">
      <div><h2>🧊 冰箱</h2><p>记录家里现在有什么</p></div>
      <button type="button" id="fridgeShopping044" class="shopping-btn-044">购物清单${state.shopping.length?` <b>${state.shopping.length}</b>`:''}</button>
    </div>

    <div class="inventory-overview-044">
      <div><b>${c.food}</b><small>食材/半成品</small></div>
      <div><b>${c.season}</b><small>调味料</small></div>
      <div><b>${c.staple}</b><small>常备</small></div>
      <div><b>${c.tool}</b><small>厨具</small></div>
    </div>

    <div class="inventory-search-044">
      <input id="fridgeSearch044" class="search" placeholder="搜索已记录物品" value="${state.fridgeQuery||''}">
      <button type="button" id="fridgeAdd044">＋ 添加</button>
    </div>

    ${fridgeSection044('食材','food',foods,'food')}
    ${fridgeSection044('半成品','food',semis,'semi')}
    ${fridgeSection044('调味料','seasoning',seasons,'seasoning',`${seasons.length} 种 · 常备 ${c.staple} 种`)}
    ${fridgeSection044('厨具','tool',tools,'tool')}
  </div>`;

  q('#fridgeShopping044').onclick=()=>shoppingModal();
  q('#fridgeAdd044').onclick=()=>manageModal('food');
  q('#fridgeSearch044').oninput=e=>{state.fridgeQuery=e.target.value;save();fridge()};

  qa('[data-manage-044]').forEach(btn=>{
    btn.onclick=()=>{
      const tab=btn.getAttribute('data-manage-044');
      manageModal(tab);
    };
  });

  // Keep two-tap deletion on the fridge itself.
  qa('[data-fridge-remove]').forEach(btn=>{
    btn.title='点一下确认，再点一次删除';
    btn.onclick=e=>{
      e.preventDefault();
      const raw=btn.getAttribute('data-fridge-remove')||'';
      const cut=raw.indexOf('|'); if(cut<0)return;
      const kind=raw.slice(0,cut),name=raw.slice(cut+1);
      armDelete0420(btn,kind,name,'fridge044',()=>{
        removeOwned0420(kind,name);
        fridge();
        toast('已移除 '+name);
      });
    };
  });
};

function managerData044(tab){
  const safe=['food','semi','seasoning','staple','tool'].includes(tab)?tab:'food';
  const kind=(safe==='seasoning'||safe==='staple')?'seasoning':safe==='tool'?'tool':'food';
  let all=catalogNames0300(safe);
  if(safe==='staple')all=all.filter(n=>has('seasoning',n));
  return {tab:safe,kind,all};
}
function managerOwned044(tab,kind,name){
  return tab==='staple'?state.stapleSeasonings.includes(name):has(kind,name);
}
function managerAdd044(tab,kind,name){
  if(tab==='staple')markStaple0300(name,true);
  else have(kind,name);
}
function managerRemove044(tab,kind,name){
  if(tab==='staple')markStaple0300(name,false);
  else removeOwned0420(kind,name);
}
function managerLabel044(tab){
  return {food:'食材',semi:'半成品',seasoning:'调味料',staple:'常备',tool:'厨具'}[tab]||'食材';
}
function managerCount044(tab,kind){
  return tab==='staple'?state.stapleSeasonings.length:ownedNames0300(kind).length;
}

manageModal=function(tab='food'){
  const data=managerData044(tab);
  tab=data.tab;
  const kind=data.kind, all=data.all;
  const query=String(state.manageQuery0300||'').trim();
  const cats=manageCategories0300(tab,all);

  if(tab==='tool'){
    state.manageCategory0300='';
  }else if(!state.manageCategory0300||!cats.some(([g])=>g===state.manageCategory0300)){
    state.manageCategory0300=cats[0]?.[0]||'';
  }

  let names=all.filter(n=>!query||n.includes(query));
  if(!query&&tab!=='tool'&&state.manageCategory0300){
    names=names.filter(n=>category0300(tab,n)===state.manageCategory0300);
  }
  names.sort((a,b)=>Number(managerOwned044(tab,kind,b))-Number(managerOwned044(tab,kind,a))||a.localeCompare(b,'zh-CN'));

  q('#modal').innerHTML=`<div class="modal"><div class="sheet inventory-sheet-044">
    <div class="sheet-handle"></div>
    <div class="sheet-head inventory-sheet-head-044">
      <div class="title"><b>厨房物品</b><small>点一下添加，再点一下取消</small></div>
      <button type="button" class="icon-close" data-close-044>×</button>
    </div>

    <div class="manage-tabs-044">
      ${['food','semi','seasoning','staple','tool'].map(t=>`<button type="button" data-tab-044="${t}" class="${tab===t?'on':''}">${managerLabel044(t)}</button>`).join('')}
    </div>

    <div class="manage-search-044">
      <input id="manageSearch044" class="search" placeholder="搜索${managerLabel044(tab)}" value="${state.manageQuery0300||''}">
      <small><b id="manageCount044">${managerCount044(tab,kind)}</b> 已有</small>
    </div>

    ${!query&&tab!=='tool'?`<div class="manage-categories-044">
      ${cats.map(([g,n])=>`<button type="button" data-cat-044="${encodeURIComponent(g)}" class="${state.manageCategory0300===g?'on':''}">${g}<small>${n}</small></button>`).join('')}
    </div>`:''}

    ${tab==='staple'?'<div class="manage-help-044">这里仅管理“常备”标记。取消常备不会删除厨房里的调味料。</div>':''}

    <div class="manage-picker-044">
      ${names.length?names.map(name=>{
        const on=managerOwned044(tab,kind,name);
        return `<button type="button" class="picker-044 ${on?'on':''}" data-item-044="${encodeURIComponent(name)}">
          <span class="picker-icon-044">${icon0300(kind,name)}</span>
          <b>${name}</b>
          <i class="picker-mark-0300">${on?'✓':'＋'}</i>
        </button>`;
      }).join(''):'<div class="empty">没有找到</div>'}
    </div>

    <div class="sheet-footer"><button type="button" class="primary" data-done-044>完成</button></div>
  </div></div>`;

  const sheet=q('.inventory-sheet-044');
  const finish=()=>{state.manageQuery0300='';state.manageCategory0300='';save();close();render()};
  q('[data-close-044]').onclick=finish;
  q('[data-done-044]').onclick=finish;

  q('#manageSearch044').oninput=e=>{
    state.manageQuery0300=e.target.value;
    save();
    manageModal(tab);
  };

  // One delegated handler controls every tab/category/item.
  sheet.addEventListener('click',e=>{
    const tabBtn=e.target.closest('[data-tab-044]');
    if(tabBtn){
      state.manageQuery0300='';
      state.manageCategory0300='';
      save();
      manageModal(tabBtn.getAttribute('data-tab-044'));
      return;
    }

    const catBtn=e.target.closest('[data-cat-044]');
    if(catBtn){
      state.manageCategory0300=decodeURIComponent(catBtn.getAttribute('data-cat-044'));
      save();
      manageModal(tab);
      return;
    }

    const itemBtn=e.target.closest('[data-item-044]');
    if(!itemBtn)return;
    const name=decodeURIComponent(itemBtn.getAttribute('data-item-044')||'');
    const on=managerOwned044(tab,kind,name);

    if(!on){
      managerAdd044(tab,kind,name);
      itemBtn.classList.add('on');
      const mark=itemBtn.querySelector('.picker-mark-0300'); if(mark)mark.textContent='✓';
      const count=q('#manageCount044'); if(count)count.textContent=managerCount044(tab,kind);
      toast('已添加 '+name);
      return;
    }

    // In the manager, tapping an owned item is an immediate toggle off.
    // This is intentionally different from the Fridge page, where removal
    // still requires a second tap because restoring an accidental removal
    // would otherwise require reopening the manager and finding the item again.
    managerRemove044(tab,kind,name);
    itemBtn.classList.remove('on');
    const mark=itemBtn.querySelector('.picker-mark-0300'); if(mark)mark.textContent='＋';
    const count=q('#manageCount044'); if(count)count.textContent=managerCount044(tab,kind);
    toast(tab==='staple'?'已取消常备 '+name:'已取消 '+name);
  });
};

save();
render();

;


/* ===== patch-v0406.js ===== */
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

;


/* ===== patch-v0407.js ===== */
// V0.4.7 terminology + flow polish: 菜板 -> 菜谱, focused prep mode.
state.version='0.4.7';

sceneMeta040=function(scene){
  return {
    home:['首页','今天吃什么'],
    fridge:['冰箱','我有什么'],
    board:['菜谱','找菜和选菜'],
    stove:['灶台','今日菜单'],
    mine:['我的','设置']
  }[scene]||['我的小厨房',''];
};

function polishRecipeScene0407(){
  if(state.scene!=='board'||state.meal?.phase==='prep')return;
  const h=q('#root > h2');
  if(h)h.textContent='📖 菜谱';

  const all=q('[data-board-mode="recipes"]');
  const byFood=q('[data-board-mode="ingredients"]');
  if(all)all.textContent='全部菜谱';
  if(byFood)byFood.textContent='按食材找';

  const search=q('#search');
  if(search)search.placeholder='搜索菜名、食材';
  const foodSearch=q('#foodSearch');
  if(foodSearch)foodSearch.placeholder='搜索想用的食材';
}

const boardV0407Base=board;
board=function(){
  const out=boardV0407Base();
  polishRecipeScene0407();
  return out;
};

const stoveV0407Base=stove;
stove=function(){
  stoveV0407Base();

  const pick=q('#stovePickDishes0406');
  if(pick)pick.textContent='去菜谱选菜';

  const prep=q('#menuStartPrep0406');
  if(prep)prep.textContent='开始集中准备';

  qa('.today-summary-0406 small').forEach(el=>{
    if(el.textContent==='分钟合计')el.textContent='时长合计';
  });
};

const setChromeV0407Base=setChrome040;
setChrome040=function(){
  setChromeV0407Base();

  // Preparation is a focused workflow, not a top-level "菜谱" page.
  const focusedPrep=state.meal?.phase==='prep';
  document.body.classList.toggle('focused-prep-0407',focusedPrep);

  const recipeNav=q('.nav button[data-s="board"]');
  if(recipeNav){
    const text=[...recipeNav.childNodes].find(n=>n.nodeType===Node.TEXT_NODE);
    if(text)text.nodeValue='菜谱';
  }
};

// Keep visible labels consistent even where older renderers still emit “菜板”.
const renderV0407Base=render;
render=function(){
  const out=renderV0407Base();
  if(state.scene==='board'&&state.meal?.phase!=='prep')polishRecipeScene0407();
  setChrome040();
  return out;
};

// About text is generated by an earlier patch; refresh it after rendering My.
const mineV0407Base=mine040;
mine040=function(){
  mineV0407Base();
  const aboutTitle=q('.about-040 b');if(aboutTitle)aboutTitle.textContent='我的小厨房 · V0.4.7';
  const about=q('.about-040 p');
  if(about)about.textContent='首页负责推荐，冰箱负责库存，菜谱负责找菜和选菜，灶台负责今日菜单与制作。';
  setChrome040();
};

save();
render();

;


/* ===== patch-v0408.js ===== */
// V0.4.8 simplify recipe filters + protect Today Menu removal.
state.version='0.4.8';

function recipeFilterOptions0408(){
  const filters=q('.filters');
  if(!filters)return [];
  const seen=new Set(), out=[];
  qa('.filters [data-cat], .filters [data-extra-cat]').forEach(btn=>{
    const value=btn.getAttribute('data-cat')||btn.getAttribute('data-extra-cat');
    if(!value||seen.has(value))return;
    seen.add(value);
    out.push({value,label:value});
  });
  return out;
}
function openRecipeFilter0408(){
  const options=recipeFilterOptions0408();
  const hocAvailable=!!q('.filters [data-hoc-only]');
  q('#modal').innerHTML=`<div class="modal"><div class="sheet recipe-filter-sheet-0408">
    <div class="sheet-handle"></div>
    <div class="sheet-head"><div class="title"><b>筛选菜谱</b><small>平时只保留常用选项，需要时再展开</small></div><button class="icon-close" id="filterClose0408">×</button></div>

    <div class="filter-sheet-section-0408">
      <b>分类</b>
      <div class="filter-sheet-grid-0408">
        ${options.map(x=>`<button type="button" data-filter-cat-0408="${encodeURIComponent(x.value)}" class="${state.filter===x.value?'on':''}">${x.label}</button>`).join('')}
      </div>
    </div>

    ${hocAvailable?`<div class="filter-sheet-section-0408">
      <b>来源</b>
      <button type="button" class="filter-source-0408 ${state.hocOnly?'on':''}" id="filterHoc0408">🐔 老乡鸡菜谱 <span>${state.hocOnly?'已开启':'不限'}</span></button>
    </div>`:''}

    <div class="sheet-footer"><button type="button" class="primary" id="filterDone0408">完成</button></div>
  </div></div>`;

  q('#filterClose0408').onclick=close;
  q('#filterDone0408').onclick=close;
  qa('[data-filter-cat-0408]').forEach(btn=>btn.onclick=()=>{
    state.filter=decodeURIComponent(btn.getAttribute('data-filter-cat-0408')||'全部');
    state.recipeLimit=36;
    save();
    close();
    board();
  });
  const hoc=q('#filterHoc0408');
  if(hoc)hoc.onclick=()=>{
    state.hocOnly=!state.hocOnly;
    state.recipeLimit=36;
    save();
    openRecipeFilter0408();
  };
}
function compactRecipeFilters0408(){
  if(state.scene!=='board'||state.prep||state.meal?.phase==='prep'||state.boardMode!=='recipes')return;
  const filters=q('.filters');
  if(!filters||q('.recipe-filter-compact-0408'))return;

  filters.classList.add('filters-hidden-0408');

  const common=['全部','肉菜','素菜','主食'];
  const currentExtra=!common.includes(state.filter)&&state.filter!=='全部'?state.filter:'';
  const activeCount=(state.filter&&state.filter!=='全部'?1:0)+(state.hocOnly?1:0);
  const row=document.createElement('div');
  row.className='recipe-filter-compact-0408';

  common.forEach(cat=>{
    if(!recipeFilterOptions0408().some(x=>x.value===cat))return;
    const btn=document.createElement('button');
    btn.type='button';
    btn.className=state.filter===cat?'on':'';
    btn.textContent=cat;
    btn.onclick=()=>{state.filter=cat;state.recipeLimit=36;save();board()};
    row.appendChild(btn);
  });

  const more=document.createElement('button');
  more.type='button';
  more.className='more '+(currentExtra||state.hocOnly?'on':'');
  more.innerHTML=`${currentExtra?currentExtra:'筛选'} <span>⌄</span>${activeCount? `<i>${activeCount}</i>`:''}`;
  more.onclick=openRecipeFilter0408;
  row.appendChild(more);

  filters.insertAdjacentElement('afterend',row);
}

const boardV0408Base=board;
board=function(){
  const out=boardV0408Base();
  compactRecipeFilters0408();
  return out;
};

// Today Menu uses a separate two-tap confirmation because an accidental removal
// would otherwise require returning to Recipes and finding the dish again.
const menuDeletePending0408=new Map();
const MENU_DELETE_WINDOW_0408=2600;

function clearMenuDelete0408(id,btn){
  const rec=menuDeletePending0408.get(id);
  if(rec?.timer)clearTimeout(rec.timer);
  menuDeletePending0408.delete(id);
  if(btn){
    btn.classList.remove('armed-0408');
    btn.innerHTML='×';
    const bar=btn.querySelector('.menu-delete-progress-0408');
    if(bar)bar.remove();
  }
}
function bindTodayMenuDelete0408(){
  qa('[data-menu-remove-0406]').forEach(btn=>{
    btn.onclick=e=>{
      e.preventDefault();
      const id=btn.getAttribute('data-menu-remove-0406');
      if(!id)return;
      if(menuDeletePending0408.has(id)){
        clearMenuDelete0408(id,btn);
        removeMealRecipe0200(id);
        stove();
        setChrome040();
        toast('已从今日菜单移除');
        return;
      }

      for(const [other,rec] of menuDeletePending0408)clearMenuDelete0408(other,rec.btn);
      btn.classList.add('armed-0408');
      btn.innerHTML='<span>再点</span><i class="menu-delete-progress-0408"></i>';
      const timer=setTimeout(()=>clearMenuDelete0408(id,btn),MENU_DELETE_WINDOW_0408);
      menuDeletePending0408.set(id,{timer,btn});
    };
  });
}

const renderTodayStoveV0408Base=renderTodayStove0406;
renderTodayStove0406=function(){
  renderTodayStoveV0408Base();
  bindTodayMenuDelete0408();
};

save();
render();

;


/* ===== patch-v0409.js ===== */
// V0.4.9 user-created recipes.
state.version='0.4.9';

(function restoreCustomRecipes0409(){
  const preload=window.__MK_PRELOAD;
  const stored=Array.isArray(preload?.customRecipes)?preload.customRecipes:[];
  state.customRecipes=stored.filter(r=>r&&r.id&&r.name&&Array.isArray(r.steps));
  for(const r of state.customRecipes){
    if(!recipes.some(x=>x.id===r.id))recipes.push(r);
    registerCustomRecipeCatalog0409(r);
  }
})();

function esc0409(v=''){
  return String(v).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
}
function registerCustomRecipeCatalog0409(r){
  for(const row of r.ings||[]){
    const n=String(row?.[0]||'').trim();
    if(n&&!FOOD[n]&&!SEASON.includes(n))FOOD[n]='🥣';
  }
  for(const row of r.season||[]){
    const n=String(row?.[0]||'').trim();
    if(n&&!SEASON.includes(n))SEASON.push(n);
  }
  for(const group of r.tools||[])for(const raw of group||[]){
    const n=String(raw||'').trim();
    if(n&&!TOOLS.includes(n))TOOLS.push(n);
  }
}
function isCustomRecipe0409(id){return (state.customRecipes||[]).some(r=>r.id===id)}
function customRecipe0409(id){return (state.customRecipes||[]).find(r=>r.id===id)||null}
function customIcon0409(cat){
  return {肉菜:'🥩',素菜:'🥬',蛋类:'🍳',主食:'🍚',汤炖:'🍲',半成品:'🥟',饮品:'🥛'}[cat]||'🍽';
}
function blankCustom0409(){
  return {id:'',name:'',cat:'肉菜',mins:15,desc:'',ings:[['','','']],season:[],tools:[['']],steps:[''],tags:['自定义'],custom:true};
}
function normalizeCustomRecipe0409(data,id){
  const cat=String(data.cat||'其他').trim()||'其他';
  return {
    id:id||('custom_'+Date.now().toString(36)),
    name:String(data.name||'').trim(),
    icon:customIcon0409(cat),
    cat,
    tags:['自定义'],
    mins:Math.max(1,Math.min(999,Number(data.mins)||15)),
    desc:String(data.desc||'').trim()||'我的自定义菜谱',
    ings:(data.ings||[]).map(x=>[String(x[0]||'').trim(),String(x[1]||'').trim()||'适量',String(x[2]||'').trim()]).filter(x=>x[0]),
    season:(data.season||[]).map(x=>[String(x[0]||'').trim(),String(x[1]||'').trim()||'适量',x[2]?1:0]).filter(x=>x[0]),
    tools:(data.tools||[]).map(g=>(g||[]).map(x=>String(x||'').trim()).filter(Boolean)).filter(g=>g.length),
    steps:(data.steps||[]).map(x=>String(x||'').trim()).filter(Boolean),
    custom:true
  };
}
function customRowIngredient0409(row=['','','']){
  return `<div class="custom-row-0409 custom-ing-row-0409">
    <input class="custom-name-0409" list="foodCatalog0409" placeholder="食材，如 鸡腿肉" value="${esc0409(row[0])}">
    <input class="custom-amount-0409" placeholder="用量，如 300g" value="${esc0409(row[1])}">
    <input class="custom-prep-0409" placeholder="准备方式，如 切块" value="${esc0409(row[2])}">
    <button type="button" class="custom-row-remove-0409" aria-label="删除">×</button>
  </div>`;
}
function customRowSeason0409(row=['','',1]){
  return `<div class="custom-row-0409 custom-season-row-0409">
    <input class="custom-name-0409" list="seasonCatalog0409" placeholder="调味料，如 生抽" value="${esc0409(row[0])}">
    <input class="custom-amount-0409" placeholder="用量，如 1勺" value="${esc0409(row[1])}">
    <label class="custom-required-0409"><input type="checkbox" ${row[2]?'checked':''}>必需</label>
    <button type="button" class="custom-row-remove-0409" aria-label="删除">×</button>
  </div>`;
}
function customRowTool0409(group=['']){
  return `<div class="custom-row-0409 custom-tool-row-0409">
    <input class="custom-tool-input-0409" list="toolCatalog0409" placeholder="厨具；可用 / 分隔替代项" value="${esc0409((group||[]).join(' / '))}">
    <button type="button" class="custom-row-remove-0409" aria-label="删除">×</button>
  </div>`;
}
function customRowStep0409(step=''){
  return `<div class="custom-step-row-0409">
    <span class="custom-step-index-0409"></span>
    <textarea class="custom-step-input-0409" rows="2" placeholder="写清这一小步怎么做">${esc0409(step)}</textarea>
    <button type="button" class="custom-row-remove-0409" aria-label="删除">×</button>
  </div>`;
}
function refreshStepNumbers0409(){
  qa('.custom-step-row-0409').forEach((row,i)=>{const n=row.querySelector('.custom-step-index-0409');if(n)n.textContent=i+1});
}
function bindCustomRowRemove0409(){
  qa('.custom-row-remove-0409').forEach(btn=>btn.onclick=()=>{
    const row=btn.closest('.custom-row-0409,.custom-step-row-0409');
    if(row)row.remove();
    refreshStepNumbers0409();
  });
}
function readCustomForm0409(){
  const ings=qa('.custom-ing-row-0409').map(row=>[
    row.querySelector('.custom-name-0409')?.value||'',
    row.querySelector('.custom-amount-0409')?.value||'',
    row.querySelector('.custom-prep-0409')?.value||''
  ]);
  const season=qa('.custom-season-row-0409').map(row=>[
    row.querySelector('.custom-name-0409')?.value||'',
    row.querySelector('.custom-amount-0409')?.value||'',
    !!row.querySelector('.custom-required-0409 input')?.checked
  ]);
  const tools=qa('.custom-tool-row-0409').map(row=>
    String(row.querySelector('.custom-tool-input-0409')?.value||'').split('/').map(x=>x.trim()).filter(Boolean)
  );
  const steps=qa('.custom-step-input-0409').map(x=>x.value);
  return {
    name:q('#customRecipeName0409')?.value||'',
    cat:q('#customRecipeCat0409')?.value||'其他',
    mins:q('#customRecipeMins0409')?.value||15,
    desc:q('#customRecipeDesc0409')?.value||'',
    ings,season,tools,steps
  };
}
function saveCustomRecipe0409(editId=''){
  const r=normalizeCustomRecipe0409(readCustomForm0409(),editId||'');
  if(!r.name)return toast('请先填写菜名');
  if(!r.ings.length)return toast('至少填写 1 项食材');
  if(!r.steps.length)return toast('至少填写 1 个步骤');

  registerCustomRecipeCatalog0409(r);
  if(editId){
    const i=state.customRecipes.findIndex(x=>x.id===editId);
    if(i>=0)state.customRecipes[i]=r;
    const j=recipes.findIndex(x=>x.id===editId);
    if(j>=0)recipes[j]=r; else recipes.push(r);
  }else{
    state.customRecipes.push(r);
    recipes.push(r);
  }
  save();
  close();
  toast(editId?'菜谱已更新':'已添加到我的菜谱');
  state.scene='board';
  state.boardMode='recipes';
  state.filter='全部';
  state.query=r.name;
  save();
  render();
}
function customRecipeEditor0409(editId=''){
  const original=editId?customRecipe0409(editId):null;
  const r=original?clone(original):blankCustom0409();
  if(!r.ings?.length)r.ings=[['','','']];
  if(!r.steps?.length)r.steps=[''];

  q('#modal').innerHTML=`<div class="modal"><div class="sheet custom-recipe-sheet-0409">
    <div class="sheet-handle"></div>
    <div class="sheet-head custom-editor-head-0409">
      <div class="title"><b>${editId?'编辑我的菜谱':'添加自定义菜谱'}</b><small>以后会和普通菜谱一样参与搜索、推荐和今日菜单</small></div>
      <button type="button" class="icon-close" id="customClose0409">×</button>
    </div>

    <section class="custom-form-card-0409">
      <div class="custom-basic-grid-0409">
        <label class="wide"><span>菜名</span><input id="customRecipeName0409" placeholder="例如：妈妈版红烧肉" value="${esc0409(r.name)}"></label>
        <label><span>分类</span><select id="customRecipeCat0409">
          ${['肉菜','素菜','蛋类','主食','汤炖','半成品','其他'].map(x=>`<option value="${x}" ${r.cat===x?'selected':''}>${x}</option>`).join('')}
        </select></label>
        <label><span>大约用时</span><div class="custom-mins-0409"><input id="customRecipeMins0409" type="number" min="1" max="999" value="${Number(r.mins)||15}"><i>分钟</i></div></label>
        <label class="wide"><span>一句话说明 <small>可选</small></span><input id="customRecipeDesc0409" placeholder="例如：偏甜口，适合配米饭" value="${esc0409(r.desc==='我的自定义菜谱'?'':r.desc)}"></label>
      </div>
    </section>

    <section class="custom-form-section-0409">
      <div class="custom-section-head-0409"><div><b>食材</b><small>名称、用量和提前处理</small></div><button type="button" id="customAddIng0409">＋ 食材</button></div>
      <div id="customIngList0409" class="custom-rows-0409">${r.ings.map(customRowIngredient0409).join('')}</div>
    </section>

    <section class="custom-form-section-0409">
      <div class="custom-section-head-0409"><div><b>调味料</b><small>不填也可以</small></div><button type="button" id="customAddSeason0409">＋ 调味</button></div>
      <div id="customSeasonList0409" class="custom-rows-0409">${(r.season||[]).map(customRowSeason0409).join('')}</div>
    </section>

    <section class="custom-form-section-0409">
      <div class="custom-section-head-0409"><div><b>厨具</b><small>“炒锅 / 平底锅”表示任选一种</small></div><button type="button" id="customAddTool0409">＋ 厨具</button></div>
      <div id="customToolList0409" class="custom-rows-0409">${(r.tools||[]).map(customRowTool0409).join('')}</div>
    </section>

    <section class="custom-form-section-0409">
      <div class="custom-section-head-0409"><div><b>制作步骤</b><small>一行一个动作，灶台会逐步显示</small></div><button type="button" id="customAddStep0409">＋ 步骤</button></div>
      <div id="customStepList0409" class="custom-steps-0409">${r.steps.map(customRowStep0409).join('')}</div>
    </section>

    <datalist id="foodCatalog0409">${Object.keys(FOOD).map(n=>`<option value="${esc0409(n)}"></option>`).join('')}</datalist>
    <datalist id="seasonCatalog0409">${SEASON.map(n=>`<option value="${esc0409(n)}"></option>`).join('')}</datalist>
    <datalist id="toolCatalog0409">${TOOLS.map(n=>`<option value="${esc0409(n)}"></option>`).join('')}</datalist>

    <div class="sheet-footer custom-editor-footer-0409">
      <div class="custom-footer-actions-0409">
        ${editId?'<button type="button" class="custom-delete-0409" id="customDelete0409">删除</button>':''}
        <button type="button" class="primary" id="customSave0409">${editId?'保存修改':'添加菜谱'}</button>
      </div>
    </div>
  </div></div>`;

  refreshStepNumbers0409();
  bindCustomRowRemove0409();
  q('#customClose0409').onclick=close;
  q('#customAddIng0409').onclick=()=>{q('#customIngList0409').insertAdjacentHTML('beforeend',customRowIngredient0409());bindCustomRowRemove0409()};
  q('#customAddSeason0409').onclick=()=>{q('#customSeasonList0409').insertAdjacentHTML('beforeend',customRowSeason0409());bindCustomRowRemove0409()};
  q('#customAddTool0409').onclick=()=>{q('#customToolList0409').insertAdjacentHTML('beforeend',customRowTool0409());bindCustomRowRemove0409()};
  q('#customAddStep0409').onclick=()=>{q('#customStepList0409').insertAdjacentHTML('beforeend',customRowStep0409());refreshStepNumbers0409();bindCustomRowRemove0409()};
  q('#customSave0409').onclick=()=>saveCustomRecipe0409(editId);
  const del=q('#customDelete0409');if(del)del.onclick=()=>confirmDeleteCustomRecipe0409(editId);
}
function confirmDeleteCustomRecipe0409(id){
  const r=customRecipe0409(id);if(!r)return;
  q('#modal').innerHTML=`<div class="modal"><div class="sheet small-sheet-040">
    <div class="sheet-handle"></div>
    <div class="sheet-head"><div class="title"><b>删除「${esc0409(r.name)}」？</b><small>删除后不会影响冰箱里的食材记录。</small></div></div>
    <div class="sheet-footer"><div class="dual"><button type="button" class="secondary" id="customDeleteCancel0409">取消</button><button type="button" class="danger" id="customDeleteOK0409">确认删除</button></div></div>
  </div></div>`;
  q('#customDeleteCancel0409').onclick=()=>customRecipeEditor0409(id);
  q('#customDeleteOK0409').onclick=()=>{
    state.customRecipes=state.customRecipes.filter(x=>x.id!==id);
    const idx=recipes.findIndex(x=>x.id===id);if(idx>=0)recipes.splice(idx,1);
    if(typeof removeMealRecipe0200==='function')removeMealRecipe0200(id);
    if(state.cook?.recipe===id)state.cook=null;
    if(state.recipe===id)state.recipe=null;
    save();close();render();toast('已删除自定义菜谱');
  };
}
function decorateRecipePage0409(){
  if(state.scene!=='board'||state.meal?.phase==='prep')return;
  if(q('.custom-recipe-add-0409'))return;
  const h=q('#root > h2');if(!h)return;
  const head=document.createElement('div');
  head.className='recipe-title-row-0409';
  h.replaceWith(head);
  head.appendChild(h);
  const btn=document.createElement('button');
  btn.type='button';
  btn.className='custom-recipe-add-0409';
  btn.textContent='＋ 自定义';
  btn.onclick=()=>customRecipeEditor0409();
  head.appendChild(btn);

  qa('[data-r]').forEach(card=>{
    const id=card.getAttribute('data-r');
    if(!isCustomRecipe0409(id)||card.querySelector('.custom-badge-0409'))return;
    const badge=document.createElement('span');
    badge.className='custom-badge-0409';
    badge.textContent='我的';
    card.appendChild(badge);
  });
}
const boardV0409Base=board;
board=function(){
  const out=boardV0409Base();
  decorateRecipePage0409();
  return out;
};

const recipeModalV0409Base=recipeModal;
recipeModal=function(id){
  recipeModalV0409Base(id);
  if(!isCustomRecipe0409(id))return;
  const sheet=q('#modal .sheet');if(!sheet||q('.custom-recipe-actions-0409'))return;
  const title=sheet.querySelector('.recipe-title-block,.recipe-title-stack,.sheet-head');
  if(title){
    const mark=document.createElement('div');
    mark.className='custom-recipe-note-0409';
    mark.textContent='我的自定义菜谱';
    title.insertAdjacentElement('afterend',mark);
  }
  const actions=document.createElement('div');
  actions.className='custom-recipe-actions-0409';
  actions.innerHTML='<button type="button" id="editCustomRecipe0409">编辑菜谱</button>';
  const footer=sheet.querySelector('.sheet-footer');
  if(footer)footer.insertAdjacentElement('beforebegin',actions); else sheet.appendChild(actions);
  q('#editCustomRecipe0409').onclick=()=>customRecipeEditor0409(id);
};

const renderV0409Base=render;
render=function(){
  const out=renderV0409Base();
  if(state.scene==='board')decorateRecipePage0409();
  return out;
};

save();
render();

;


/* ===== patch-v0500.js ===== */
// V0.5.0 Custom Recipe V2: quick text input, source, notes, and copy-to-my-recipe.
state.version='0.5.0';

function recipeSourceUrl0500(r){
  return String(r?.customMeta?.sourceUrl||r?.source?.url||'').trim();
}
function recipeNotes0500(r){
  return String(r?.customMeta?.notes||'').trim();
}
function validHttpUrl0500(url){
  if(!url)return '';
  try{
    const u=new URL(url,location.href);
    return /^https?:$/.test(u.protocol)?u.href:'';
  }catch(e){return ''}
}
function customDraft0500(r){
  const base=r?clone(r):blankCustom0409();
  base.customMeta={...(base.customMeta||{})};
  base.customMeta.sourceUrl=recipeSourceUrl0500(base);
  base.customMeta.notes=recipeNotes0500(base);
  return base;
}

normalizeCustomRecipe0409=function(data,id){
  const cat=String(data.cat||'其他').trim()||'其他';
  return {
    id:id||('custom_'+Date.now().toString(36)),
    name:String(data.name||'').trim(),
    icon:customIcon0409(cat),
    cat,
    tags:['自定义'],
    mins:Math.max(1,Math.min(999,Number(data.mins)||15)),
    desc:String(data.desc||'').trim()||'我的自定义菜谱',
    ings:(data.ings||[]).map(x=>[
      String(x[0]||'').trim(),
      String(x[1]||'').trim()||'适量',
      String(x[2]||'').trim()
    ]).filter(x=>x[0]),
    season:(data.season||[]).map(x=>[
      String(x[0]||'').trim(),
      String(x[1]||'').trim()||'适量',
      x[2]?1:0
    ]).filter(x=>x[0]),
    tools:(data.tools||[]).map(g=>(g||[]).map(x=>String(x||'').trim()).filter(Boolean)).filter(g=>g.length),
    steps:(data.steps||[]).map(x=>String(x||'').trim()).filter(Boolean),
    customMeta:{
      sourceUrl:validHttpUrl0500(String(data.sourceUrl||'').trim())||String(data.sourceUrl||'').trim(),
      notes:String(data.notes||'').trim()
    },
    custom:true
  };
};

readCustomForm0409=function(){
  const ings=qa('.custom-ing-row-0409').map(row=>[
    row.querySelector('.custom-name-0409')?.value||'',
    row.querySelector('.custom-amount-0409')?.value||'',
    row.querySelector('.custom-prep-0409')?.value||''
  ]);
  const season=qa('.custom-season-row-0409').map(row=>[
    row.querySelector('.custom-name-0409')?.value||'',
    row.querySelector('.custom-amount-0409')?.value||'',
    !!row.querySelector('.custom-required-0409 input')?.checked
  ]);
  const tools=qa('.custom-tool-row-0409').map(row=>
    String(row.querySelector('.custom-tool-input-0409')?.value||'').split('/').map(x=>x.trim()).filter(Boolean)
  );
  const steps=qa('.custom-step-input-0409').map(x=>x.value);
  return {
    name:q('#customRecipeName0409')?.value||'',
    cat:q('#customRecipeCat0409')?.value||'其他',
    mins:q('#customRecipeMins0409')?.value||15,
    desc:q('#customRecipeDesc0409')?.value||'',
    sourceUrl:q('#customRecipeSource0500')?.value||'',
    notes:q('#customRecipeNotes0500')?.value||'',
    ings,season,tools,steps
  };
};

function amountSplit0500(line){
  const cleaned=String(line||'').replace(/^[-•·]\s*/,'').trim();
  if(!cleaned)return ['','',''];
  const explicit=cleaned.split(/\s*[*|｜]\s*/);
  if(explicit.length>=2)return [explicit[0]||'',explicit[1]||'',explicit.slice(2).join(' ')||''];
  const spaced=cleaned.split(/\s+/);
  if(spaced.length>=2){
    const idx=spaced.findIndex((x,i)=>i>0&&/^(?:\d|半|一|二|三|四|五|六|七|八|九|十|少许|适量|若干)/.test(x));
    if(idx>0)return [spaced.slice(0,idx).join(''),spaced[idx]||'',spaced.slice(idx+1).join(' ')];
  }
  const m=cleaned.match(/^(.+?)(\d+(?:\.\d+)?(?:\/\d+)?\s*(?:kg|g|克|千克|斤|两|ml|毫升|升|L|个|颗|只|根|把|片|块|瓣|勺|茶匙|汤匙|杯|碗|盒|包|瓶|张|份))(.*)$/i);
  if(m)return [m[1].trim(),m[2].trim(),m[3].trim()];
  return [cleaned,'适量',''];
}
function parseQuickRecipe0500(text){
  const out={name:'',cat:'肉菜',mins:15,desc:'',sourceUrl:'',notes:'',ings:[],season:[],tools:[],steps:[]};
  const lines=String(text||'').replace(/\r/g,'').split('\n');
  let section='';
  const sectionOf=line=>{
    const s=line.replace(/^#+\s*/,'').replace(/^\[|\]$/g,'').replace(/[：:]$/,'').trim();
    if(/^(食材|材料|主料|配料)$/.test(s))return 'ings';
    if(/^(调味料|调味|调料)$/.test(s))return 'season';
    if(/^(厨具|工具)$/.test(s))return 'tools';
    if(/^(步骤|做法|制作步骤|制作)$/.test(s))return 'steps';
    return '';
  };
  for(const raw of lines){
    let line=raw.trim();
    if(!line)continue;
    const sec=sectionOf(line);
    if(sec){section=sec;continue}
    let m;
    if((m=line.match(/^(?:菜名|名称|标题)\s*[：:]\s*(.+)$/))){out.name=m[1].trim();continue}
    if((m=line.match(/^分类\s*[：:]\s*(.+)$/))){out.cat=m[1].trim();continue}
    if((m=line.match(/^(?:用时|时间|耗时)\s*[：:]\s*(.+)$/))){out.mins=parseInt(m[1],10)||15;continue}
    if((m=line.match(/^(?:说明|描述)\s*[：:]\s*(.+)$/))){out.desc=m[1].trim();continue}
    if((m=line.match(/^(?:来源|网址|链接)\s*[：:]\s*(.+)$/))){out.sourceUrl=m[1].trim();continue}
    if((m=line.match(/^(?:备注|心得)\s*[：:]\s*(.+)$/))){out.notes=m[1].trim();continue}

    if(section==='ings'){
      const row=amountSplit0500(line);
      if(row[0])out.ings.push(row);
    }else if(section==='season'){
      const row=amountSplit0500(line);
      const optional=/可选|可省|非必需/.test(line);
      if(row[0])out.season.push([row[0],row[1],optional?0:1]);
    }else if(section==='tools'){
      const group=line.replace(/^[-•·]\s*/,'').split(/\s*(?:\/|、|或)\s*/).map(x=>x.trim()).filter(Boolean);
      if(group.length)out.tools.push(group);
    }else if(section==='steps'){
      line=line.replace(/^\s*(?:\d+[\.、)）]|[-•·])\s*/,'').trim();
      if(line&&line!=='---')out.steps.push(line);
    }else if(/^\d+[\.、)）]\s*/.test(line)){
      out.steps.push(line.replace(/^\d+[\.、)）]\s*/,'').trim());
    }
  }
  return out;
}
function quickTextFromRecipe0500(data){
  const r=data||{};
  const lines=[];
  lines.push('菜名：'+(r.name||''));
  lines.push('分类：'+(r.cat||'其他'));
  lines.push('用时：'+(Number(r.mins)||15)+'分钟');
  if(r.desc)lines.push('说明：'+r.desc);
  if(r.sourceUrl||recipeSourceUrl0500(r))lines.push('来源：'+(r.sourceUrl||recipeSourceUrl0500(r)));
  if(r.notes||recipeNotes0500(r))lines.push('备注：'+(r.notes||recipeNotes0500(r)));
  lines.push('');
  lines.push('# 食材');
  (r.ings||[]).forEach(x=>lines.push([x[0],x[1],x[2]].filter(Boolean).join(' * ')));
  lines.push('');
  lines.push('# 调味料');
  (r.season||[]).forEach(x=>lines.push([x[0],x[1],x[2]?'必需':'可选'].filter(Boolean).join(' * ')));
  lines.push('');
  lines.push('# 厨具');
  (r.tools||[]).forEach(g=>lines.push((g||[]).join(' / ')));
  lines.push('');
  lines.push('# 步骤');
  (r.steps||[]).forEach((s,i)=>lines.push((i+1)+'. '+s));
  return lines.join('\n');
}
function mergeQuickIntoDraft0500(parsed,current){
  return {
    ...current,
    ...parsed,
    name:parsed.name||current.name||'',
    desc:parsed.desc||current.desc||'',
    sourceUrl:parsed.sourceUrl||current.sourceUrl||recipeSourceUrl0500(current),
    notes:parsed.notes||current.notes||recipeNotes0500(current),
    ings:parsed.ings.length?parsed.ings:(current.ings||[]),
    season:parsed.season.length?parsed.season:(current.season||[]),
    tools:parsed.tools.length?parsed.tools:(current.tools||[]),
    steps:parsed.steps.length?parsed.steps:(current.steps||[])
  };
}
function customRecipeEditor0500(editId='',draft=null,startMode='form'){
  const original=editId?customRecipe0409(editId):null;
  const r=customDraft0500(draft||original||blankCustom0409());
  if(!r.ings?.length)r.ings=[['','','']];
  if(!r.steps?.length)r.steps=[''];
  const source=recipeSourceUrl0500(r);
  const notes=recipeNotes0500(r);

  q('#modal').innerHTML=`<div class="modal"><div class="sheet custom-recipe-sheet-0409 custom-recipe-sheet-0500">
    <div class="sheet-handle"></div>
    <div class="sheet-head custom-editor-head-0409">
      <div class="title"><b>${editId?'编辑我的菜谱':'添加自定义菜谱'}</b><small>可以慢慢填，也可以整段粘贴后自动拆成食材和步骤</small></div>
      <button type="button" class="icon-close" id="customClose0500">×</button>
    </div>

    <div class="custom-mode-tabs-0500">
      <button type="button" data-custom-mode-0500="form" class="${startMode==='form'?'on':''}">结构化填写</button>
      <button type="button" data-custom-mode-0500="text" class="${startMode==='text'?'on':''}">快速文字输入</button>
    </div>

    <div id="customFormPanel0500" class="${startMode==='form'?'':'custom-hidden-0500'}">
      <section class="custom-form-card-0409">
        <div class="custom-basic-grid-0409">
          <label class="wide"><span>菜名</span><input id="customRecipeName0409" placeholder="例如：妈妈版红烧肉" value="${esc0409(r.name)}"></label>
          <label><span>分类</span><select id="customRecipeCat0409">
            ${['肉菜','素菜','蛋类','主食','汤炖','半成品','其他'].map(x=>`<option value="${x}" ${r.cat===x?'selected':''}>${x}</option>`).join('')}
          </select></label>
          <label><span>大约用时</span><div class="custom-mins-0409"><input id="customRecipeMins0409" type="number" min="1" max="999" value="${Number(r.mins)||15}"><i>分钟</i></div></label>
          <label class="wide"><span>一句话说明 <small>可选</small></span><input id="customRecipeDesc0409" placeholder="例如：偏甜口，适合配米饭" value="${esc0409(r.desc==='我的自定义菜谱'?'':r.desc)}"></label>
          <label class="wide"><span>来源网址 <small>可选</small></span><input id="customRecipeSource0500" inputmode="url" placeholder="原菜谱、视频或文章链接" value="${esc0409(source)}"></label>
          <label class="wide"><span>心得 / 备注 <small>可选</small></span><textarea id="customRecipeNotes0500" rows="3" placeholder="例如：下次糖少一点；家里人更喜欢炖久一点">${esc0409(notes)}</textarea></label>
        </div>
      </section>

      <section class="custom-form-section-0409">
        <div class="custom-section-head-0409"><div><b>食材</b><small>名称、用量和提前处理</small></div><button type="button" id="customAddIng0500">＋ 食材</button></div>
        <div id="customIngList0409" class="custom-rows-0409">${r.ings.map(customRowIngredient0409).join('')}</div>
      </section>

      <section class="custom-form-section-0409">
        <div class="custom-section-head-0409"><div><b>调味料</b><small>可以标记必需 / 可选</small></div><button type="button" id="customAddSeason0500">＋ 调味</button></div>
        <div id="customSeasonList0409" class="custom-rows-0409">${(r.season||[]).map(customRowSeason0409).join('')}</div>
      </section>

      <section class="custom-form-section-0409">
        <div class="custom-section-head-0409"><div><b>厨具</b><small>“炒锅 / 平底锅”表示任选一种</small></div><button type="button" id="customAddTool0500">＋ 厨具</button></div>
        <div id="customToolList0409" class="custom-rows-0409">${(r.tools||[]).map(customRowTool0409).join('')}</div>
      </section>

      <section class="custom-form-section-0409">
        <div class="custom-section-head-0409"><div><b>制作步骤</b><small>一行一个动作，灶台逐步显示</small></div><button type="button" id="customAddStep0500">＋ 步骤</button></div>
        <div id="customStepList0409" class="custom-steps-0409">${r.steps.map(customRowStep0409).join('')}</div>
      </section>

      <datalist id="foodCatalog0409">${Object.keys(FOOD).map(n=>`<option value="${esc0409(n)}"></option>`).join('')}</datalist>
      <datalist id="seasonCatalog0409">${SEASON.map(n=>`<option value="${esc0409(n)}"></option>`).join('')}</datalist>
      <datalist id="toolCatalog0409">${TOOLS.map(n=>`<option value="${esc0409(n)}"></option>`).join('')}</datalist>
    </div>

    <div id="customTextPanel0500" class="custom-text-panel-0500 ${startMode==='text'?'':'custom-hidden-0500'}">
      <div class="quick-help-0500">
        <b>直接粘贴整段菜谱</b>
        <p>建议用“# 食材 / # 调味料 / # 厨具 / # 步骤”分段。食材可写成“番茄 * 2个 * 切块”。</p>
      </div>
      <textarea id="customQuickText0500" rows="20" spellcheck="false">${esc0409(quickTextFromRecipe0500({...r,sourceUrl:source,notes}))}</textarea>
      <div class="quick-example-0500">
        <span>例：</span>
        <code># 食材\n番茄 * 2个 * 切块\n鸡蛋 * 3个\n# 步骤\n1. 鸡蛋炒熟盛出\n2. 番茄炒软后合炒</code>
      </div>
      <button type="button" class="primary quick-parse-0500" id="customParse0500">解析并回到表单检查</button>
    </div>

    <div class="sheet-footer custom-editor-footer-0409" id="customFooter0500">
      <div class="custom-footer-actions-0409">
        ${editId?'<button type="button" class="custom-delete-0409" id="customDelete0500">删除</button>':''}
        <button type="button" class="primary" id="customSave0500">${editId?'保存修改':'添加菜谱'}</button>
      </div>
    </div>
  </div></div>`;

  refreshStepNumbers0409();
  bindCustomRowRemove0409();

  const form=q('#customFormPanel0500'),textPanel=q('#customTextPanel0500'),footer=q('#customFooter0500');
  const setMode=mode=>{
    const textMode=mode==='text';
    form.classList.toggle('custom-hidden-0500',textMode);
    textPanel.classList.toggle('custom-hidden-0500',!textMode);
    footer.classList.toggle('custom-hidden-0500',textMode);
    qa('[data-custom-mode-0500]').forEach(b=>b.classList.toggle('on',b.getAttribute('data-custom-mode-0500')===mode));
    if(textMode){
      const current=readCustomForm0409();
      q('#customQuickText0500').value=quickTextFromRecipe0500(current);
    }
  };

  q('#customClose0500').onclick=close;
  qa('[data-custom-mode-0500]').forEach(btn=>btn.onclick=()=>setMode(btn.getAttribute('data-custom-mode-0500')));
  q('#customAddIng0500').onclick=()=>{q('#customIngList0409').insertAdjacentHTML('beforeend',customRowIngredient0409());bindCustomRowRemove0409()};
  q('#customAddSeason0500').onclick=()=>{q('#customSeasonList0409').insertAdjacentHTML('beforeend',customRowSeason0409());bindCustomRowRemove0409()};
  q('#customAddTool0500').onclick=()=>{q('#customToolList0409').insertAdjacentHTML('beforeend',customRowTool0409());bindCustomRowRemove0409()};
  q('#customAddStep0500').onclick=()=>{q('#customStepList0409').insertAdjacentHTML('beforeend',customRowStep0409());refreshStepNumbers0409();bindCustomRowRemove0409()};
  q('#customParse0500').onclick=()=>{
    const current=readCustomForm0409();
    const parsed=parseQuickRecipe0500(q('#customQuickText0500').value);
    const merged=mergeQuickIntoDraft0500(parsed,current);
    customRecipeEditor0500(editId,merged,'form');
    toast('已解析，请检查后保存');
  };
  q('#customSave0500').onclick=()=>saveCustomRecipe0409(editId);
  const del=q('#customDelete0500');if(del)del.onclick=()=>confirmDeleteCustomRecipe0409(editId);
}
customRecipeEditor0409=customRecipeEditor0500;

function duplicateRecipe0500(id){
  const src=recipeById0200(id)||recipes.find(x=>x.id===id);
  if(!src)return;
  const draft=customDraft0500(src);
  draft.id='';
  draft.custom=true;
  draft.name=(src.name||'菜谱')+' · 我的版本';
  draft.tags=['自定义'];
  draft.customMeta={
    sourceUrl:recipeSourceUrl0500(src),
    notes:isCustomRecipe0409(id)?recipeNotes0500(src):''
  };
  customRecipeEditor0500('',draft,'form');
}
function decorateRecipeDetail0500(id){
  const r=recipeById0200(id)||recipes.find(x=>x.id===id);
  const sheet=q('#modal .sheet');if(!r||!sheet)return;

  if(!q('.recipe-v2-meta-0500')&&(recipeSourceUrl0500(r)||recipeNotes0500(r))){
    const box=document.createElement('div');
    box.className='recipe-v2-meta-0500';
    const source=validHttpUrl0500(recipeSourceUrl0500(r));
    box.innerHTML=`${recipeNotes0500(r)?`<div><b>我的心得</b><p>${esc0409(recipeNotes0500(r))}</p></div>`:''}
      ${source?`<a href="${esc0409(source)}" target="_blank" rel="noopener noreferrer">查看原始来源 ↗</a>`:''}`;
    const footer=sheet.querySelector('.sheet-footer');
    if(footer)footer.insertAdjacentElement('beforebegin',box);else sheet.appendChild(box);
  }

  let actions=q('.custom-recipe-actions-0409');
  if(!actions){
    actions=document.createElement('div');
    actions.className='custom-recipe-actions-0409';
    const footer=sheet.querySelector('.sheet-footer');
    if(footer)footer.insertAdjacentElement('beforebegin',actions);else sheet.appendChild(actions);
  }
  if(!actions.querySelector('#copyRecipe0500')){
    const btn=document.createElement('button');
    btn.type='button';btn.id='copyRecipe0500';
    btn.textContent=isCustomRecipe0409(id)?'复制一份':'复制为我的菜谱';
    btn.onclick=()=>duplicateRecipe0500(id);
    actions.appendChild(btn);
  }
}
const recipeModalV0500Base=recipeModal;
recipeModal=function(id){
  recipeModalV0500Base(id);
  decorateRecipeDetail0500(id);
};

save();
render();

;


/* ===== patch-v0510.js ===== */
// V0.5.1 theme integration: follow device appearance and keep browser chrome in sync.
state.version='0.5.1';

(function theme0510(){
  const media=window.matchMedia?.('(prefers-color-scheme: dark)');
  const apply=()=>{
    const dark=!!media?.matches;
    document.documentElement.dataset.theme=dark?'dark':'light';
    document.documentElement.style.colorScheme=dark?'dark':'light';
    let meta=document.querySelector('meta[name="theme-color"]');
    if(!meta){
      meta=document.createElement('meta');
      meta.name='theme-color';
      document.head.appendChild(meta);
    }
    meta.content=dark?'#151815':'#f7f7f4';
  };
  apply();
  if(media?.addEventListener)media.addEventListener('change',apply);
  else if(media?.addListener)media.addListener(apply);
})();

const mineV0510Base=mine040;
mine040=function(){
  mineV0510Base();
  const aboutTitle=q('.about-040 b');
  if(aboutTitle)aboutTitle.textContent='我的小厨房 · V0.5.1';
  const about=q('.about-040 p');
  if(about)about.textContent='跟随设备自动切换亮色/暗色主题。首页负责推荐，冰箱负责库存，菜谱负责找菜和选菜，灶台负责今日菜单与制作。';
  setChrome040();
};

save();
render();

;


/* ===== patch-v0530.js ===== */
// V0.5.3 consistency pass — keep the warm character, unify hierarchy and wording.
state.version='0.5.3';

function polishConsistency0530(){
  // Keep scene naming stable: navigation name = page title.
  if(state.scene==='stove'){
    const h=q('.stove-title-0406 h2');
    if(h)h.textContent='🍳 灶台';
    const p=q('.stove-title-0406 p');
    if(p)p.textContent=(state.meal?.dishes||[]).length?'今日菜单 · 今天要做的菜':'今天准备做什么';
    const menuHead=q('.today-menu-card-0406 .today-section-head-0406>div:first-child>b');
    if(menuHead)menuHead.textContent='今日菜单';
  }

  if(state.scene==='board'&&state.meal?.phase!=='prep'){
    const h=q('.recipe-title-row-0409 h2, #root > h2');
    if(h)h.textContent='📖 菜谱';
  }

  // One wording for shopping throughout the main flow.
  qa('.shopping-btn-044').forEach(b=>{
    b.childNodes.forEach(n=>{
      if(n.nodeType===Node.TEXT_NODE&&n.nodeValue.includes('购物清单'))n.nodeValue=n.nodeValue.replace('购物清单','购物清单');
    });
  });
}

const renderV0530Base=render;
render=function(){
  const out=renderV0530Base();
  polishConsistency0530();
  return out;
};

const homeV0530Base=home040;
home040=function(){homeV0530Base();polishConsistency0530()};

const fridgeV0530Base=fridge;
fridge=function(){const out=fridgeV0530Base();polishConsistency0530();return out};

const boardV0530Base=board;
board=function(){const out=boardV0530Base();polishConsistency0530();return out};

const stoveV0530Base=stove;
stove=function(){const out=stoveV0530Base();polishConsistency0530();return out};

const mineV0530Base=mine040;
mine040=function(){
  mineV0530Base();
  const aboutTitle=q('.about-040 b');
  if(aboutTitle)aboutTitle.textContent='我的小厨房 · V0.5.3';
  polishConsistency0530();
};

save();
render();

;


/* ===== patch-v0540.js ===== */
// V0.5.4 screenshot-driven consistency cleanup.
state.version=window.MK_VERSION||'0.5.5';

function stripSceneEmoji0540(){
  const targets=[
    '.fridge-title-044 h2',
    '.recipe-title-row-0409 h2',
    '.stove-title-0406 h2',
    '.mine-title-040 h2'
  ];
  for(const sel of targets){
    const el=q(sel);
    if(!el)continue;
    el.textContent=(el.textContent||'').replace(/^[\p{Extended_Pictographic}\uFE0F\u200D\s]+/u,'').trim();
  }
  if(state.scene==='board'&&state.meal?.phase==='prep'){
    const h=q('#root h2');
    if(h)h.textContent=(h.textContent||'').replace(/^[\p{Extended_Pictographic}\uFE0F\u200D\s]+/u,'').trim();
  }
}

function cleanHome0540(){
  if(state.scene!=='home')return;
  const items=qa('.home-kitchen-040 button');
  if(items.length>=4){
    const recipeCount=items[2].querySelector('b');
    if(recipeCount)recipeCount.textContent=recipes.length;
    const mealCount=(state.meal?.dishes||[]).filter(id=>!(state.meal?.completed||[]).includes(id)).length;
    const last=items[3];
    const b=last.querySelector('b'),small=last.querySelector('small');
    if(b)b.textContent=mealCount;
    if(small)small.textContent='今日菜单';
    last.setAttribute('data-home-jump-040','stove');
    last.onclick=()=>go('stove');
  }
}

function cleanFridge0540(){
  if(state.scene!=='fridge')return;
  const summary=qa('.inventory-overview-044>div');
  // “常备” was an extra state users did not find useful. Keep old data compatible,
  // but remove the concept from the visible inventory UI.
  if(summary[2])summary[2].remove();

  qa('.inventory-head-044>div small').forEach(el=>{
    el.textContent=(el.textContent||'').replace(/\s*·\s*常备\s*\d+\s*种/g,'').trim();
  });
}

function cleanMine0540(){
  if(state.scene!=='mine')return;
  qa('.setting-row-040 small').forEach(el=>{
    if((el.textContent||'').includes('菜板的默认浏览方式')){
      el.textContent='菜谱页的默认浏览方式';
    }
  });
  const aboutTitle=q('.about-040 b');
  if(aboutTitle)aboutTitle.textContent='我的小厨房 · V'+(window.MK_VERSION||'0.5.5');
  const about=q('.about-040 p');
  if(about)about.textContent='跟随设备自动切换亮色/暗色主题。首页负责推荐，冰箱负责库存，菜谱负责找菜和选菜，灶台负责今日菜单与制作。';
}

function cleanStove0540(){
  if(state.scene!=='stove')return;
  const p=q('.stove-empty-card-0406 p');
  if(p)p.textContent='去菜谱挑几道菜，加入“今日菜单”后都会集中显示在这里。';
}

function polishMain0540(){
  stripSceneEmoji0540();
  cleanHome0540();
  cleanFridge0540();
  cleanMine0540();
  cleanStove0540();
}

const manageModalV0540Base=manageModal;
manageModal=function(tab='food'){
  // “常备” is intentionally no longer exposed. Old links/state fall back to 调味料.
  if(tab==='staple')tab='seasoning';
  manageModalV0540Base(tab);

  const sheet=q('.inventory-sheet-044');
  if(!sheet)return;
  sheet.dataset.inventoryTab0540=tab;

  const staple=q('[data-tab-044="staple"]');
  if(staple)staple.remove();

  const count=q('#manageCount044');
  if(count&&count.parentElement){
    count.parentElement.innerHTML='已有 <b id="manageCount044">'+count.textContent+'</b>';
  }
};

const renderV0540Base=render;
render=function(){
  const out=renderV0540Base();
  polishMain0540();
  return out;
};

const homeV0540Base=home040;
home040=function(){homeV0540Base();polishMain0540()};

const fridgeV0540Base=fridge;
fridge=function(){const out=fridgeV0540Base();polishMain0540();return out};

const boardV0540Base=board;
board=function(){const out=boardV0540Base();polishMain0540();return out};

const stoveV0540Base=stove;
stove=function(){const out=stoveV0540Base();polishMain0540();return out};

const mineV0540Base=mine040;
mine040=function(){mineV0540Base();polishMain0540()};

save();
render();

;

/* ===== consolidated runtime footer ===== */
window.MK_VERSION=window.MK_VERSION||'0.5.5';
state.version=window.MK_VERSION;
document.title='我的小厨房 V'+window.MK_VERSION;
save();
