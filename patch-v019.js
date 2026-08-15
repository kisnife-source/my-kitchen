// V0.1.11 align bulk-confirm action with recipe title
state.version='0.1.11';
save();

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
  else {
    const parts=[];
    if(missingRequired.length) parts.push(`缺 ${missingRequired.length} 个必需项`);
    if(badToolGroups.length) parts.push(`缺 ${badToolGroups.length} 组厨具`);
    statusText=`<div class="recipe-status-line blocked">${parts.join(' · ')}</div>`;
  }

  let primaryLabel='开始准备';
  if(missingRequired.length){
    primaryLabel=newMissing.length?`缺少的加入购物袋（${newMissing.length}）`:`查看购物袋（${alreadyShopping}）`;
  }else if(badToolGroups.length){
    primaryLabel='先确认厨具';
  }

  q('#modal').innerHTML=`<div class="modal"><div class="sheet"><div class="sheet-handle"></div>
  <div class="recipe-title-block">
    <div class="recipe-title-row"><b>${r.icon} ${r.name}</b><button class="title-bulk-add ${allRequiredHave?'done':''}" id="markAllRequired" ${allRequiredHave?'disabled':''}>${allRequiredHave?'已添加':'一键添加'}</button></div>
    <small>${r.desc} · 约${r.mins}分钟</small>
  </div>

  <div class="recipe-mini-summary"><span class="tag ${allRequiredHave?'good':'bad'}"><strong>${requiredAll.length-missingRequired.length}/${requiredAll.length}</strong> 必需</span>${alreadyShopping?`<span class="tag bad">购物袋 ${alreadyShopping}</span>`:''}<span class="tag ${badToolGroups.length?'bad':'good'}">厨具 ${badToolGroups.length?'缺':'有'}</span></div>

  <div class="recipe-chip-section"><div class="recipe-chip-title"><span>食材</span><small>红 = 缺 · 绿 = 有</small></div><div class="recipe-chip-grid">${requiredFoods.map(x=>recipeChip(x[0],x[1],x[2],false)).join('')}</div></div>

  ${requiredSeason.length?`<div class="recipe-chip-section"><div class="recipe-chip-title"><span>必需调味</span><small>会影响能否开始</small></div><div class="recipe-chip-grid">${requiredSeason.map(x=>recipeChip(x[0],x[1],x[2],false)).join('')}</div></div>`:''}

  ${optionalSeason.length?`<div class="recipe-chip-section"><div class="recipe-chip-title"><span>可选</span><span class="optional-note"><i class="optional-dot"></i>不影响制作</span></div><div class="recipe-chip-grid">${optionalSeason.map(x=>recipeChip(x[0],x[1],x[2],true)).join('')}</div></div>`:''}

  <div class="recipe-chip-section"><div class="recipe-chip-title"><span>厨具</span><small>满足每组任意一个</small></div>${toolHTML}</div>
  ${statusText}
  <div class="sheet-footer"><div class="recipe-footer-actions"><button class="secondary" id="backRecipe">返回菜谱</button><button class="primary" id="recipePrimary">${primaryLabel}</button></div></div></div></div>`;

  q('#backRecipe').onclick=()=>close();
  qa('[data-recipe-item]').forEach(b=>b.onclick=()=>{
    const [k,n]=b.dataset.recipeItem.split('|');
    has(k,n)?missing(k,n):have(k,n);
    recipeModal(id);
  });
  qa('[data-recipe-tool]').forEach(b=>b.onclick=()=>{
    const n=b.dataset.recipeTool;
    has('tool',n)?missing('tool',n):have('tool',n);
    recipeModal(id);
  });
  const markAll=q('#markAllRequired');
  if(markAll&&!allRequiredHave) markAll.onclick=()=>{
    requiredAll.forEach(x=>have(x[0],x[1]));
    save();
    recipeModal(id);
  };
  q('#recipePrimary').onclick=()=>{
    const currentMissing=requiredAll.filter(x=>!has(x[0],x[1]));
    const currentNew=currentMissing.filter(x=>!inShop(x[0],x[1]));
    if(currentMissing.length){
      if(currentNew.length){currentNew.forEach(x=>addShop(x[0],x[1]));save()}
      shoppingModal(id);return;
    }
    if(!toolOK(r)){toast('请先确认一种可用厨具');return}
    state.prep={recipe:id,checked:{}};save();close();render();
  };
};

render();
