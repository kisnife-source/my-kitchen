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
