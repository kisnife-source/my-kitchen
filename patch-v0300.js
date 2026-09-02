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
  qa('[data-manage-0300]').forEach(b=>b.onclick=()=>manageModal(b.dataset.manage0300));
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
  qa('[data-tab-0300]').forEach(b=>b.onclick=()=>{state.manageQuery0300='';state.manageCategory0300='';save();manageModal(b.dataset.tab0300)});
  qa('[data-cat-0300]').forEach(b=>b.onclick=()=>{state.manageCategory0300=b.dataset.cat0300;save();manageModal(tab)});
  qa('[data-pick-0300]').forEach(b=>b.onclick=()=>{
    const sep=b.dataset.pick0300.indexOf('|'),t=b.dataset.pick0300.slice(0,sep),name=b.dataset.pick0300.slice(sep+1);
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
  const reqFoods=(r.ings||[]).map(x=>x[0]).filter(n=>!waterLike0202?.(n));
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
  qa('[data-recommend-0300]').forEach(b=>b.onclick=()=>{state.recommendMode0300=b.dataset.recommend0300;state.recipeLimit=36;save();board()});
}
const boardV0300Base=board;
board=function(){boardV0300Base();addRecommendBar0300();};

save();
render();
