// V0.1.6 interaction patch
state.version='0.1.6';
if(!['recipes','ingredients'].includes(state.boardMode)) state.boardMode='recipes';
if(!Array.isArray(state.matchFoods)) state.matchFoods=[];
if(typeof state.foodQuery!=='string') state.foodQuery='';
save();

const deleteWindows=new Map();
function disarmDelete(name){
  const rec=deleteWindows.get(name);
  if(rec){clearTimeout(rec.timer);deleteWindows.delete(name)}
  const btn=document.querySelector(`[data-food-remove="${name}"]`);
  if(btn) btn.classList.remove('delete-armed');
}
function armFoodDelete(btn,name){
  if(deleteWindows.has(name)){
    disarmDelete(name);
    missing('food',name);
    render();
    toast(name+' 已从冰箱移除');
    return;
  }
  btn.classList.add('delete-armed');
  const timer=setTimeout(()=>disarmDelete(name),1600);
  deleteWindows.set(name,{timer});
}

function recipeBody(list){
  if(!list.length)return '<div class="empty">没有找到菜谱</div>';
  if(state.viewMode==='list'){
    return `<div class="recipe-list">${list.map(r=>`<button class="recipe-row" data-r="${r.id}"><div class="icon">${r.icon}</div><div><h3>${r.name}</h3><p>${r.desc}</p></div><div class="row-meta"><span class="tag">${r.mins}分钟</span>${status(r)}</div></button>`).join('')}</div>`;
  }
  return `<div class="recipe-grid">${list.map(r=>`<button class="recipe-card" data-r="${r.id}"><div class="icon">${r.icon}</div><h3>${r.name}</h3><p>${r.desc}</p><div class="meta"><span class="tag">约${r.mins}分钟</span><span class="tag">${r.cat}</span>${status(r)}</div></button>`).join('')}</div>`;
}
function bindRecipeCards(){qa('[data-r]').forEach(b=>b.onclick=()=>recipeModal(b.dataset.r))}
function board(){
  if(state.prep)return prepView();
  const cats=['全部','肉菜','素菜','蛋类','主食','汤炖','速食'];
  const mode=`<div class="board-mode"><button data-board-mode="recipes" class="${state.boardMode==='recipes'?'on':''}">选菜谱</button><button data-board-mode="ingredients" class="${state.boardMode==='ingredients'?'on':''}">按食材找菜</button></div>`;
  if(state.boardMode==='ingredients'){
    const fq=state.foodQuery.trim();
    const foods=Object.keys(FOOD).filter(n=>!fq||n.includes(fq));
    const selected=state.matchFoods.filter(n=>FOOD[n]);
    let matched=[];
    if(selected.length){
      matched=recipes.map(r=>{
        const names=r.ings.map(x=>x[0]);
        const overlap=selected.filter(n=>names.includes(n)).length;
        return {r,overlap,coverage:overlap/selected.length};
      }).filter(x=>x.overlap>0).sort((a,b)=>b.overlap-a.overlap||rs(a.r).missing-rs(b.r).missing||a.r.mins-b.r.mins).map(x=>x.r);
    }
    q('#root').innerHTML=`<h2>🔪 菜板</h2>${mode}<div class="ingredient-find card"><div class="search-row"><input id="foodSearch" class="search" placeholder="搜索食材" value="${state.foodQuery}"><button class="clear-foods" id="clearFoods" ${selected.length?'':'disabled'}>清空</button></div><div class="picker-grid compact-foods">${foods.map(n=>`<button class="pick ${selected.includes(n)?'on':''}" data-match-food="${n}">${FOOD[n]} ${n}</button>`).join('')}</div></div><div class="match-head"><b>${selected.length?`匹配菜谱 · 已选 ${selected.length} 种`:'先选择想用的食材'}</b><div class="view-switch"><button data-view="cards" class="${state.viewMode==='cards'?'on':''}">▦</button><button data-view="list" class="${state.viewMode==='list'?'on':''}">☰</button></div></div>${selected.length?recipeBody(matched):'<div class="empty">选择一种或多种食材后，这里会显示会用到它们的菜谱。</div>'}`;
    q('#foodSearch').oninput=e=>{state.foodQuery=e.target.value;save();board()};
    q('#clearFoods').onclick=()=>{state.matchFoods=[];save();board()};
    qa('[data-match-food]').forEach(b=>b.onclick=()=>{const n=b.dataset.matchFood;state.matchFoods=state.matchFoods.includes(n)?state.matchFoods.filter(x=>x!==n):[...state.matchFoods,n];save();board()});
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
}

function needRow(k,n,amt,opt=0){
  const h=has(k,n),icon=k==='food'?(FOOD[n]||'🥣'):'🧂';
  return `<button class="need compact-need ${h?'state-have':'state-missing'}" data-have="${k}|${n}"><div class="need-icon">${icon}</div><div class="need-info"><strong>${n}${opt?'<span class="optional">可省</span>':''}</strong><small>${amt}</small></div><span class="need-state">${h?'有':'缺'}</span></button>`;
}
function recipeModal(id){
  const r=recipes.find(x=>x.id===id);if(!r)return;
  state.recipe=id;save();
  const s=rs(r),m=miss(r),requiredMissing=m.filter(x=>!inShop(x[0],x[1])),bad=r.tools.filter(g=>!g.some(n=>has('tool',n))),optional=r.season.filter(x=>!x[2]).length,shopN=m.filter(x=>inShop(x[0],x[1])).length;
  q('#modal').innerHTML=`<div class="modal"><div class="sheet"><div class="sheet-handle"></div><div class="sheet-head"><div class="title"><b>${r.icon} ${r.name}</b><small>${r.desc} · 约${r.mins}分钟</small></div><button class="icon-close" id="x">×</button></div><div class="recipe-summary"><div class="summary-cell"><b>${s.have}/${s.total}</b><small>必需项已有</small></div><div class="summary-cell"><b>${shopN}</b><small>购物袋</small></div><div class="summary-cell"><b>${s.tool?'有':'缺'}</b><small>厨具</small></div></div><div class="section-title">食材 <span class="count">点击红/绿切换</span></div><div class="need-list">${r.ings.map(x=>needRow('food',x[0],x[1])).join('')}</div><div class="section-title">调味 <span class="count">必需${r.season.filter(x=>x[2]).length}${optional?' · 可省'+optional:''}</span></div><div class="need-list">${r.season.length?r.season.map(x=>needRow('seasoning',x[0],x[1],!x[2])).join(''):'<div class="muted">不需要额外调味料</div>'}</div><div class="section-title">厨具</div>${r.tools.map(g=>`<div class="tool-need"><div class="tool-head"><div class="need-icon">🍳</div><div><strong>${g.join(' / ')}</strong><small>任选一种即可</small></div></div><div class="tool-options">${g.map(n=>`<button class="toolbtn ${has('tool',n)?'on':'off'}" data-tool="${n}">${n}</button>`).join('')}</div></div>`).join('')}${bad.length?`<div class="blocker">缺厨具：${bad.map(g=>g.join(' / ')+'（任选一种）').join('；')}</div>`:m.length?`<div class="blocker">还有 ${m.length} 个必需食材/调味没有确认。</div>`:'<div class="ready">条件齐全，可以开始准备。</div>'}<div class="sheet-footer"><div class="dual"><button class="secondary" id="back">返回菜谱</button><button class="primary" id="act">${m.length?`一键补齐必需（${m.length}）`:bad.length?'先确认厨具':'开始准备'}</button></div></div></div></div>`;
  q('#x').onclick=close;q('#back').onclick=close;
  qa('[data-have]').forEach(b=>b.onclick=()=>{let[k,n]=b.dataset.have.split('|');has(k,n)?missing(k,n):have(k,n);recipeModal(id)});
  qa('[data-tool]').forEach(b=>b.onclick=()=>{let n=b.dataset.tool;has('tool',n)?missing('tool',n):have('tool',n);recipeModal(id)});
  q('#act').onclick=()=>{let mm=miss(r);if(mm.length){mm.forEach(x=>addShop(x[0],x[1]));save();shoppingModal(id);return}if(!toolOK(r))return toast('请先确认一种可用厨具');state.prep={recipe:id,checked:{}};save();close();render()};
}

function fridge(){
  q('#root').innerHTML=`<h2>🧊 冰箱</h2><div class="card fridge-section"><div class="head"><b>食材</b><div class="fridge-actions"><small>${state.foods.length} 种</small><button class="mini-add" data-manage="food">＋ 添加</button></div></div>${state.foods.length?`<div class="home-grid">${state.foods.map(n=>`<button class="home-item fridge-food" data-food-remove="${n}">${FOOD[n]} ${n}<span class="delete-progress"></span></button>`).join('')}</div>`:'<div class="empty">还没有食材</div>'}</div><div class="card fridge-section"><div class="head"><b>调味料</b><button class="mini-add" data-manage="seasoning">＋ 添加</button></div><div class="home-grid">${SEASON.filter(n=>has('seasoning',n)).map(n=>`<button class="home-item" data-remove="seasoning|${n}">🧂 ${n}</button>`).join('')||'<div class="empty">还没有调味料</div>'}</div></div><div class="card fridge-section"><div class="head"><b>厨具</b><button class="mini-add" data-manage="tool">＋ 添加</button></div><div class="home-grid">${TOOLS.filter(n=>has('tool',n)).map(n=>`<button class="home-item" data-remove="tool|${n}">🍳 ${n}</button>`).join('')||'<div class="empty">还没有厨具</div>'}</div></div>`;
  qa('[data-food-remove]').forEach(b=>b.onclick=()=>armFoodDelete(b,b.dataset.foodRemove));
  qa('[data-remove]').forEach(b=>b.onclick=()=>{let[k,n]=b.dataset.remove.split('|');missing(k,n);render()});
  qa('[data-manage]').forEach(b=>b.onclick=()=>manageModal(b.dataset.manage));
}
function manageModal(tab='food'){
  const names=tab==='food'?Object.keys(FOOD):tab==='seasoning'?SEASON:TOOLS,icon=n=>tab==='food'?FOOD[n]:tab==='seasoning'?'🧂':'🍳';
  q('#modal').innerHTML=`<div class="modal"><div class="sheet"><div class="sheet-handle"></div><div class="sheet-head"><div class="title"><b>厨房物品</b></div><button class="icon-close" id="x">×</button></div><div class="manage-tabs"><button data-tab="food" class="${tab==='food'?'on':''}">食材</button><button data-tab="seasoning" class="${tab==='seasoning'?'on':''}">调味料</button><button data-tab="tool" class="${tab==='tool'?'on':''}">厨具</button></div><div class="picker-grid">${names.map(n=>`<button class="pick ${has(tab,n)?'on':''}" data-pick="${tab}|${n}">${icon(n)} ${n}</button>`).join('')}</div><div class="sheet-footer"><button class="secondary" id="back" style="width:100%">返回冰箱</button></div></div></div>`;
  const back=()=>{close();render()};
  q('#x').onclick=back;q('#back').onclick=back;
  qa('[data-tab]').forEach(b=>b.onclick=()=>manageModal(b.dataset.tab));
  qa('[data-pick]').forEach(b=>b.onclick=()=>{let[k,n]=b.dataset.pick.split('|');has(k,n)?missing(k,n):have(k,n);manageModal(tab)});
}

render();
