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
