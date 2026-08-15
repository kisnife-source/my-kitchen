// V0.1.12 end-to-end interaction refinement
state.version='0.1.12';

const preload=window.__MK_PRELOAD||null;
if(!window.__MK_HAD_STATE){
  state.foods=[];
  SEASON.forEach(n=>state.set.seasonings[n]=0);
  TOOLS.forEach(n=>state.set.cookware[n]=0);
  state.shopping=[];
}
if(preload){
  if(preload.prep&&recipes.some(r=>r.id===preload.prep.recipe)) state.prep=preload.prep;
  if(['recipes','ingredients'].includes(preload.boardMode)) state.boardMode=preload.boardMode;
  if(Array.isArray(preload.matchFoods)) state.matchFoods=preload.matchFoods.filter(n=>FOOD[n]);
  if(typeof preload.foodQuery==='string') state.foodQuery=preload.foodQuery;
}
if(state.filter==='速食') state.filter='半成品';
if(!Array.isArray(state.matchFoods)) state.matchFoods=[];
if(typeof state.foodQuery!=='string') state.foodQuery='';
save();

addShop=function(kind,name,meta=null){
  let item=state.shopping.find(x=>x.kind===kind&&x.name===name);
  if(!item){
    item={kind,name};
    state.shopping.push(item);
  }
  if(meta&&meta.recipeId){
    if(!Array.isArray(item.needs)) item.needs=[];
    const existing=item.needs.find(x=>x.recipeId===meta.recipeId);
    if(existing) existing.amount=meta.amount||existing.amount||'';
    else item.needs.push({recipeId:meta.recipeId,amount:meta.amount||''});
  }
  save();
};

function intentFoodChip(name){
  const selected=state.matchFoods.includes(name);
  const owned=has('food',name);
  const queued=inShop('food',name);
  return `<button class="intent-food ${owned?'owned':'other'} ${selected?'intent-on':''}" data-match-food="${name}">${FOOD[name]} <span>${name}</span>${queued?'<small>待买</small>':''}</button>`;
}

board=function(){
  if(state.prep)return prepView();
  const cats=['全部','肉菜','素菜','蛋类','主食','汤炖','半成品'];
  const mode=`<div class="board-mode"><button data-board-mode="recipes" class="${state.boardMode==='recipes'?'on':''}">选菜谱</button><button data-board-mode="ingredients" class="${state.boardMode==='ingredients'?'on':''}">按食材找菜</button></div>`;

  if(state.boardMode==='ingredients'){
    const fq=state.foodQuery.trim();
    const allFoods=Object.keys(FOOD).filter(n=>!fq||n.includes(fq));
    const homeFoods=allFoods.filter(n=>has('food',n));
    const otherFoods=allFoods.filter(n=>!has('food',n));
    const selected=state.matchFoods.filter(n=>FOOD[n]);
    let matched=[];
    if(selected.length){
      matched=recipes.map(r=>{
        const names=r.ings.map(x=>x[0]);
        const overlap=selected.filter(n=>names.includes(n)).length;
        return {r,overlap};
      }).filter(x=>x.overlap>0)
        .sort((a,b)=>b.overlap-a.overlap||rs(a.r).missing-rs(b.r).missing||a.r.mins-b.r.mins)
        .map(x=>x.r);
    }
    const section=(title,items,empty)=>`<div class="intent-section"><div class="intent-section-head"><b>${title}</b><small>${items.length} 种</small></div>${items.length?`<div class="intent-food-grid">${items.map(intentFoodChip).join('')}</div>`:`<div class="intent-empty">${empty}</div>`}</div>`;
    q('#root').innerHTML=`<h2>🔪 菜板</h2>${mode}
      <div class="ingredient-find card intent-browser">
        <div class="search-row"><input id="foodSearch" class="search" placeholder="搜索想吃的食材，如虾仁" value="${state.foodQuery}"><button class="clear-foods" id="clearFoods" ${selected.length?'':'disabled'}>清空</button></div>
        ${selected.length?`<div class="intent-selected-line"><b>这顿想用 ${selected.length} 种</b><span>棕色描边 = 已选</span></div>`:''}
        ${section('家里有',homeFoods,'冰箱里还没有记录食材')}
        ${section('其他食材',otherFoods,fq?'没有找到这个食材':'没有其他食材')}
      </div>
      <div class="match-head"><b>${selected.length?`匹配菜谱 · 已选 ${selected.length} 种`:'选择这顿想用的食材'}</b><div class="view-switch"><button data-view="cards" class="${state.viewMode==='cards'?'on':''}">▦</button><button data-view="list" class="${state.viewMode==='list'?'on':''}">☰</button></div></div>
      ${selected.length?recipeBody(matched):'<div class="empty">家里有的、准备买的、现在没有但想吃的食材都可以选。</div>'}`;
    q('#foodSearch').oninput=e=>{state.foodQuery=e.target.value;save();board()};
    q('#clearFoods').onclick=()=>{state.matchFoods=[];save();board()};
    qa('[data-match-food]').forEach(b=>b.onclick=()=>{
      const n=b.dataset.matchFood;
      state.matchFoods=state.matchFoods.includes(n)?state.matchFoods.filter(x=>x!==n):[...state.matchFoods,n];
      save();board();
    });
    qa('[data-view]').forEach(b=>b.onclick=()=>{state.viewMode=b.dataset.view;save();board()});
    qa('[data-board-mode]').forEach(b=>b.onclick=()=>{state.boardMode=b.dataset.boardMode;save();board()});
    bindRecipeCards();
    return;
  }

  const list=recipes.filter(r=>(state.filter==='全部'||r.cat===state.filter)&&(!state.query||r.name.includes(state.query)||r.ings.some(x=>x[0].includes(state.query))||r.tags.some(x=>x.includes(state.query))));
  q('#root').innerHTML=`<h2>🔪 菜板</h2>${mode}<div class="board-tools"><div class="search-row"><input id="search" class="search" placeholder="搜索菜名或食材" value="${state.query}"><div class="view-switch"><button data-view="cards" class="${state.viewMode==='cards'?'on':''}">▦</button><button data-view="list" class="${state.viewMode==='list'?'on':''}">☰</button></div></div><div class="filters">${cats.map(c=>`<button class="filter ${state.filter===c?'on':''}" data-cat="${c}">${c}</button>`).join('')}</div></div>${recipeBody(list)}`;
  q('#search').oninput=e=>{state.query=e.target.value.trim();save();board()};
  qa('[data-view]').forEach(b=>b.onclick=()=>{state.viewMode=b.dataset.view;save();board()});
  qa('[data-cat]').forEach(b=>b.onclick=()=>{state.filter=b.dataset.cat;save();board()});
  qa('[data-board-mode]').forEach(b=>b.onclick=()=>{state.boardMode=b.dataset.boardMode;save();board()});
  bindRecipeCards();
};

recipeModal=function(id){
  const r=recipes.find(x=>x.id===id);if(!r)return;
  state.recipe=id;save();
  const requiredFoods=r.ings.map(x=>['food',x[0],x[1]]);
  const requiredSeason=r.season.filter(x=>x[2]).map(x=>['seasoning',x[0],x[1]]);
  const optionalSeason=r.season.filter(x=>!x[2]).map(x=>['seasoning',x[0],x[1]]);
  const requiredAll=[...requiredFoods,...requiredSeason];
  const missingRequired=requiredAll.filter(x=>!has(x[0],x[1]));
  const newMissing=missingRequired.filter(x=>!inShop(x[0],x[1]));
  const alreadyShopping=missingRequired.length-newMissing.length;
  const toolGroups=r.tools||[];
  const badToolGroups=toolGroups.filter(g=>!g.some(n=>has('tool',n)));
  const ready=missingRequired.length===0&&badToolGroups.length===0;
  const allRequiredHave=missingRequired.length===0;
  const toolHTML=toolGroups.length?toolGroups.map((g,idx)=>{
    const groupReady=g.some(n=>has('tool',n));
    return `<div class="tool-chip-group ${groupReady?'':'missing-group'}"><div class="tool-chip-head"><b>${toolGroups.length>1?'厨具 '+(idx+1):'厨具'} · 任选一种</b><small>${groupReady?'已满足':'需要一个'}</small></div><div class="tool-chip-grid">${g.map(n=>`<button class="tool-chip ${has('tool',n)?'have':groupReady?'neutral':'missing'}" data-recipe-tool="${n}">${n}</button>`).join('')}</div></div>`;
  }).join(''):'<div class="muted">不需要额外厨具</div>';
  let statusText='';
  if(ready) statusText='<div class="recipe-status-line ready">条件齐全，可以开始准备。</div>';
  else{
    const parts=[];
    if(missingRequired.length)parts.push(`缺 ${missingRequired.length} 个必需项`);
    if(badToolGroups.length)parts.push(`缺 ${badToolGroups.length} 组厨具`);
    statusText=`<div class="recipe-status-line blocked">${parts.join(' · ')}</div>`;
  }
  let primaryLabel='开始准备';
  if(missingRequired.length) primaryLabel=newMissing.length?`缺少的加入购物袋（${newMissing.length}）`:`查看购物袋（${alreadyShopping}）`;
  else if(badToolGroups.length) primaryLabel='先确认厨具';

  q('#modal').innerHTML=`<div class="modal"><div class="sheet"><div class="sheet-handle"></div>
    <div class="recipe-title-block"><div class="recipe-title-row"><b>${r.icon} ${r.name}</b><button class="title-bulk-add ${allRequiredHave?'done':''}" id="markAllRequired" ${allRequiredHave?'disabled':''}>${allRequiredHave?'已添加':'一键添加'}</button></div><small>${r.desc} · 约${r.mins}分钟</small></div>
    <div class="recipe-mini-summary"><span class="tag ${allRequiredHave?'good':'bad'}"><strong>${requiredAll.length-missingRequired.length}/${requiredAll.length}</strong> 必需</span>${alreadyShopping?`<span class="tag bad">购物袋 ${alreadyShopping}</span>`:''}<span class="tag ${badToolGroups.length?'bad':'good'}">厨具 ${badToolGroups.length?'缺':'有'}</span></div>
    <div class="recipe-chip-section"><div class="recipe-chip-title"><span>食材</span><small>红 = 缺 · 绿 = 有</small></div><div class="recipe-chip-grid">${requiredFoods.map(x=>recipeChip(x[0],x[1],x[2],false)).join('')}</div></div>
    ${requiredSeason.length?`<div class="recipe-chip-section"><div class="recipe-chip-title"><span>必需调味</span><small>会影响能否开始</small></div><div class="recipe-chip-grid">${requiredSeason.map(x=>recipeChip(x[0],x[1],x[2],false)).join('')}</div></div>`:''}
    ${optionalSeason.length?`<div class="recipe-chip-section"><div class="recipe-chip-title"><span>可选</span><span class="optional-note"><i class="optional-dot"></i>不影响制作</span></div><div class="recipe-chip-grid">${optionalSeason.map(x=>recipeChip(x[0],x[1],x[2],true)).join('')}</div></div>`:''}
    <div class="recipe-chip-section"><div class="recipe-chip-title"><span>厨具</span><small>满足每组任意一个</small></div>${toolHTML}</div>
    ${statusText}
    <div class="sheet-footer"><div class="recipe-footer-actions"><button class="secondary" id="backRecipe">返回菜谱</button><button class="primary" id="recipePrimary">${primaryLabel}</button></div></div>
  </div></div>`;
  q('#backRecipe').onclick=()=>close();
  qa('[data-recipe-item]').forEach(b=>b.onclick=()=>{const[k,n]=b.dataset.recipeItem.split('|');has(k,n)?missing(k,n):have(k,n);recipeModal(id)});
  qa('[data-recipe-tool]').forEach(b=>b.onclick=()=>{const n=b.dataset.recipeTool;has('tool',n)?missing('tool',n):have('tool',n);recipeModal(id)});
  const markAll=q('#markAllRequired');
  if(markAll&&!allRequiredHave)markAll.onclick=()=>{requiredAll.forEach(x=>have(x[0],x[1]));save();recipeModal(id)};
  q('#recipePrimary').onclick=()=>{
    const currentMissing=requiredAll.filter(x=>!has(x[0],x[1]));
    if(currentMissing.length){
      currentMissing.forEach(x=>addShop(x[0],x[1],{recipeId:id,amount:x[2]}));
      shoppingModal(id);return;
    }
    if(!toolOK(r)){toast('请先确认一种可用厨具');return}
    state.prep={recipe:id,checked:{}};save();close();render();
  };
};

function shoppingNeedText(item){
  if(!Array.isArray(item.needs)||!item.needs.length)return item.kind==='food'?'食材':item.kind==='seasoning'?'调味料':'厨具';
  return item.needs.map(n=>{
    const r=recipes.find(x=>x.id===n.recipeId);
    return `${n.amount||'适量'}${r?` · ${r.name}`:''}`;
  }).join('；');
}

shoppingModal=function(returnId=null){
  q('#modal').innerHTML=`<div class="modal"><div class="sheet"><div class="sheet-handle"></div><div class="sheet-head"><div class="title"><b>🛍 购物袋</b><small>${returnId?'买到后可直接返回刚才的菜谱。':'买到后会自动记进厨房。'}</small></div><button class="icon-close" id="x">×</button></div>${state.shopping.length?state.shopping.map(x=>`<div class="shopping-row"><div class="shopping-icon">${x.kind==='food'?(FOOD[x.name]||'🥣'):x.kind==='seasoning'?'🧂':'🍳'}</div><div class="grow"><b>${x.name}</b><small>${shoppingNeedText(x)}</small></div><button class="tiny" data-bought="${x.kind}|${x.name}">买到了</button><button class="remove" data-rm="${x.kind}|${x.name}">移除</button></div>`).join(''):'<div class="empty">购物袋是空的</div>'}<div class="sheet-footer"><div class="dual"><button class="secondary" id="back">${returnId?'返回菜谱':'关闭'}</button><button class="primary" id="done">保存并关闭</button></div></div></div></div>`;
  q('#x').onclick=close;
  q('#back').onclick=()=>returnId?recipeModal(returnId):close();
  q('#done').onclick=()=>{close();toast('购物袋已保存')};
  qa('[data-bought]').forEach(b=>b.onclick=()=>{const[k,n]=b.dataset.bought.split('|');have(k,n);shoppingModal(returnId)});
  qa('[data-rm]').forEach(b=>b.onclick=()=>{const[k,n]=b.dataset.rm.split('|');rmShop(k,n);save();shoppingModal(returnId)});
};

go=function(scene){state.scene=scene;save();render()};

prepView=function(){
  const r=recipes.find(x=>x.id===state.prep.recipe);if(!r){state.prep=null;save();return board()}
  const done=Object.values(state.prep.checked||{}).filter(Boolean).length;
  const total=r.ings.length;
  const complete=done===total;
  q('#root').innerHTML=`<h2>🔪 准备 · ${r.name}</h2><div class="card prep-card"><div class="head"><b>食材准备</b><small>${done}/${total}</small></div><div class="prep-list">${r.ings.map(x=>{const ck=!!state.prep.checked[x[0]];return`<button class="prep ${ck?'done':''}" data-p="${x[0]}"><span class="prep-check">${ck?'✓':'○'}</span><span><strong>${FOOD[x[0]]||'🥣'} ${x[0]} · ${x[1]}</strong><small>${x[2]}</small></span></button>`}).join('')}</div><div class="section-title">调味</div><div class="meta">${r.season.map(x=>`<span class="tag ${x[2]?'good':''}">${x[0]} · ${x[1]}${x[2]?'':' · 可省'}</span>`).join('')||'<span class="muted">无需额外调味</span>'}</div>${!complete?`<div class="prep-hint">还差 ${total-done} 项准备完成</div>`:'<div class="prep-hint ready-hint">食材准备完成，可以去灶台。</div>'}<div class="dual" style="margin-top:11px"><button class="secondary" id="reselect">重新选菜</button><button class="primary" id="cook" ${complete?'':'disabled'}>去灶台</button></div></div>`;
  qa('[data-p]').forEach(b=>b.onclick=()=>{state.prep.checked[b.dataset.p]=!state.prep.checked[b.dataset.p];save();render()});
  q('#reselect').onclick=()=>{state.prep=null;save();render()};
  q('#cook').onclick=()=>{
    if(!complete)return;
    if(!rs(r).ready){state.prep=null;save();return recipeModal(r.id)}
    state.cook={recipe:r.id,step:0};state.prep=null;save();go('stove');
  };
};

function finishMealModal(r){
  state.cook=null;state.scene='board';save();render();
  const candidates=[...r.ings.map(x=>['food',x[0]]),...r.season.filter(x=>x[2]).map(x=>['seasoning',x[0]])].filter(x=>has(x[0],x[1]));
  if(!candidates.length){toast('开饭啦 🎉');return}
  const selected=new Set();
  q('#modal').innerHTML=`<div class="modal"><div class="sheet finish-sheet"><div class="sheet-handle"></div><div class="sheet-head"><div class="title"><b>🍽 做好了</b><small>有东西刚好用完吗？</small></div></div><div class="used-up-grid">${candidates.map(([k,n])=>`<button class="used-up-chip" data-used="${k}|${n}">${k==='food'?(FOOD[n]||'🥣'):'🧂'} ${n}</button>`).join('')}</div><div class="sheet-footer"><div class="dual"><button class="secondary" id="noneUsed">都还有</button><button class="primary" id="confirmUsed" disabled>确认用完</button></div></div></div></div>`;
  qa('[data-used]').forEach(b=>b.onclick=()=>{
    const key=b.dataset.used;
    selected.has(key)?selected.delete(key):selected.add(key);
    b.classList.toggle('on',selected.has(key));
    const confirm=q('#confirmUsed');
    confirm.disabled=selected.size===0;
    confirm.textContent=selected.size?`确认用完（${selected.size}）`:'确认用完';
  });
  q('#noneUsed').onclick=()=>{close();toast('开饭啦 🎉')};
  q('#confirmUsed').onclick=()=>{
    selected.forEach(v=>{const[k,n]=v.split('|');missing(k,n)});
    close();toast('已更新冰箱 · 开饭啦 🎉');
  };
}

stove=function(){
  if(!state.cook){
    if(state.prep){const r=recipes.find(x=>x.id===state.prep.recipe);q('#root').innerHTML=`<h2>🍳 灶台</h2><div class="card empty">${r?r.name:'这道菜'}还在菜板准备中。<br><button class="primary" style="margin-top:12px" id="backPrep">回菜板继续准备</button></div>`;q('#backPrep').onclick=()=>go('board');return}
    q('#root').innerHTML='<h2>🍳 灶台</h2><div class="card empty">还没有要做的菜。<br><button class="primary" style="margin-top:12px" onclick="go(\'board\')">去菜板选菜</button></div>';return;
  }
  const r=recipes.find(x=>x.id===state.cook.recipe),i=state.cook.step,last=i===r.steps.length-1;
  q('#root').innerHTML=`<h2>🍳 ${r.name}</h2><div class="preflight">食材、调味和厨具已确认</div><div class="card cook compact-cook"><div class="head"><b>步骤 ${i+1}/${r.steps.length}</b><small>约${r.mins}分钟</small></div><div class="step">${r.steps[i]}</div><div class="pan"></div><div class="actions ${last?'last-step':'normal-step'}"><button class="secondary" id="prev" ${i===0?'disabled':''}>上一步</button>${last?'<button class="finish" id="done">完成制作</button>':'<button class="next" id="next">下一步</button>'}</div></div>`;
  q('#prev').onclick=()=>{if(i===0)return;state.cook.step=i-1;save();render()};
  if(last)q('#done').onclick=()=>finishMealModal(r);
  else q('#next').onclick=()=>{state.cook.step=i+1;save();render()};
};

save();render();
