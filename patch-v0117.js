// V0.1.17 CookLikeHOC / 老乡鸡来源菜谱 integration
state.version='0.1.17';
if(typeof state.hocOnly!=='boolean')state.hocOnly=false;

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

recipeBody=function(list){
  const visible=(state.hocOnly&&state.boardMode==='recipes')?list.filter(r=>r.hoc):list;
  if(!visible.length)return `<div class="empty">${state.hocOnly&&state.boardMode==='recipes'?'这个分类下暂时没有老乡鸡来源菜谱':'没有找到菜谱'}</div>`;
  if(state.viewMode==='list'){
    return `<div class="recipe-list">${visible.map(r=>`<button class="recipe-row ${r.hoc?'hoc-card':''}" data-r="${r.id}"><div class="icon">${r.icon}</div><div class="recipe-row-main"><div class="recipe-row-title"><h3>${r.name}</h3>${r.hoc?hocBadge(true):''}</div><p>${r.desc}</p></div><div class="row-meta"><span class="tag">${r.mins}分钟</span>${status(r)}</div></button>`).join('')}</div>`;
  }
  return `<div class="recipe-grid">${visible.map(r=>`<button class="recipe-card ${r.hoc?'hoc-card':''}" data-r="${r.id}">${r.hoc?`<div class="hoc-card-label">${hocBadge(false)}</div>`:''}<div class="icon">${r.icon}</div><h3>${r.name}</h3><p>${r.desc}</p><div class="meta"><span class="tag">约${r.mins}分钟</span><span class="tag">${r.cat}</span>${status(r)}</div></button>`).join('')}</div>`;
};

const boardV0117Base=board;
board=function(){
  boardV0117Base();
  if(state.prep||state.boardMode!=='recipes'||!(HOC_DATA.recipes||[]).length)return;
  const filters=q('.filters');
  if(!filters||q('[data-hoc-only]'))return;
  const btn=document.createElement('button');
  btn.className=`filter hoc-source-filter ${state.hocOnly?'on':''}`;
  btn.dataset.hocOnly='1';
  btn.innerHTML=`🐔 老乡鸡 <small>${HOC_DATA.meta?.count||HOC_DATA.recipes.length}</small>`;
  btn.onclick=()=>{state.hocOnly=!state.hocOnly;save();board()};
  filters.appendChild(btn);
};

const recipeModalV0117Base=recipeModal;
recipeModal=function(id){
  recipeModalV0117Base(id);
  const r=recipes.find(x=>x.id===id);
  if(!r?.hoc||!r.source)return;
  const title=q('.recipe-title-block');
  if(!title||q('.hoc-source-box'))return;
  const box=document.createElement('div');
  box.className='hoc-source-box';
  box.innerHTML=`<div class="hoc-source-top">${hocBadge(false)}${r.source.scaled?'<span class="hoc-home-scale">家用比例</span>':''}</div><div class="hoc-source-text"><b>来源：CookLikeHOC</b><small>基于《老乡鸡菜品溯源报告》整理 · 非老乡鸡官方仓库</small>${r.source.scaled?'<small>门店批量克重已按原比例缩放为家庭份量</small>':'<small>步骤已拆分、改写为适合本工具逐步执行的表述</small>'}</div><a class="hoc-source-link" href="${r.source.url}" target="_blank" rel="noopener noreferrer">查看原始记录 ↗</a>`;
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
