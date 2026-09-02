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
