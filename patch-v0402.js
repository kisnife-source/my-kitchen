// V0.4.2 safe inventory interactions + repaired bulk add flow.
state.version='0.4.2';

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
