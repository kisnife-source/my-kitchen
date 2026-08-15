// V0.1.16 visual-density refinement after mobile screenshot review
state.version='0.1.16';
if(typeof state.manageFoodGroup!=='string'||!['肉蛋水产','蔬菜菌菇','主食与其他'].includes(state.manageFoodGroup))state.manageFoodGroup='肉蛋水产';
save();

function collapseIngredientGroups16(){
  if(state.prep||state.boardMode!=='ingredients'||state.foodQuery.trim())return;
  qa('.intent-subgroup').forEach(block=>{
    const head=block.querySelector('.intent-subgroup-head');
    const grid=block.querySelector('.intent-food-subgrid');
    if(!head||!grid)return;
    const hasSelected=!!grid.querySelector('.intent-food.intent-on');
    block.classList.toggle('collapsed',!hasSelected);
    head.setAttribute('role','button');
    head.setAttribute('tabindex','0');
    const refreshChevron=()=>{
      let chev=head.querySelector('.intent-subgroup-chevron');
      if(!chev){chev=document.createElement('i');chev.className='intent-subgroup-chevron';head.appendChild(chev)}
      chev.textContent=block.classList.contains('collapsed')?'⌄':'⌃';
    };
    refreshChevron();
    const toggle=()=>{block.classList.toggle('collapsed');refreshChevron()};
    head.onclick=toggle;
    head.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();toggle()}};
  });
}

const boardV0116Base=board;
board=function(){
  boardV0116Base();
  collapseIngredientGroups16();
};

manageModal=function(tab='food'){
  const kind=tab==='semi'?'food':tab;
  const allNames=tab==='food'?Object.keys(FOOD).filter(n=>!SEMI_PREPARED.includes(n)):tab==='semi'?SEMI_PREPARED:tab==='seasoning'?SEASON:TOOLS;
  const searchable=tab==='food'||tab==='semi';
  const query=searchable?state.manageQuery.trim():'';
  let names=allNames.filter(n=>!query||n.includes(query));
  if(tab==='food'&&!query)names=names.filter(n=>foodGroup15(n)===state.manageFoodGroup);
  const icon=n=>kind==='food'?FOOD[n]:kind==='seasoning'?'🧂':'🍳';
  const foodGroups=['肉蛋水产','蔬菜菌菇','主食与其他'];
  q('#modal').innerHTML=`<div class="modal"><div class="sheet"><div class="sheet-handle"></div><div class="sheet-head"><div class="title"><b>厨房物品</b><small>${tab==='food'?'常用食材':tab==='semi'?'半成品':tab==='seasoning'?'调味料':'厨具'}</small></div><button class="icon-close" id="x">×</button></div><div class="manage-tabs"><button data-tab="food" class="${tab==='food'?'on':''}">食材</button><button data-tab="semi" class="${tab==='semi'?'on':''}">半成品</button><button data-tab="seasoning" class="${tab==='seasoning'?'on':''}">调味料</button><button data-tab="tool" class="${tab==='tool'?'on':''}">厨具</button></div>${searchable?`<div class="manage-search-row"><input id="manageSearch" class="search" placeholder="搜索${tab==='semi'?'半成品':'食材'}" value="${state.manageQuery}"><small>${names.length}/${allNames.length}</small></div>`:''}${tab==='food'&&!query?`<div class="manage-food-groups">${foodGroups.map(g=>`<button data-food-group="${g}" class="${state.manageFoodGroup===g?'on':''}">${g}</button>`).join('')}</div>`:''}<div class="picker-grid manage-picker">${names.length?names.map(n=>`<button class="pick ${has(kind,n)?'on':''}" data-pick="${kind}|${n}">${icon(n)} ${n}</button>`).join(''):'<div class="empty">没有找到</div>'}</div><div class="sheet-footer"><button class="secondary" id="back" style="width:100%">返回冰箱</button></div></div></div>`;
  const back=()=>{state.manageQuery='';save();close();render()};
  q('#x').onclick=back;q('#back').onclick=back;
  const search=q('#manageSearch');
  if(search)search.oninput=e=>{state.manageQuery=e.target.value;save();manageModal(tab)};
  qa('[data-tab]').forEach(b=>b.onclick=()=>{state.manageQuery='';save();manageModal(b.dataset.tab)});
  qa('[data-food-group]').forEach(b=>b.onclick=()=>{state.manageFoodGroup=b.dataset.foodGroup;save();manageModal('food')});
  qa('[data-pick]').forEach(b=>b.onclick=()=>{const[k,n]=b.dataset.pick.split('|');has(k,n)?missing(k,n):have(k,n);manageModal(tab)});
};

render();
