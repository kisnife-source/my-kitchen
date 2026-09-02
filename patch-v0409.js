// V0.4.9 user-created recipes.
state.version='0.4.9';

(function restoreCustomRecipes0409(){
  const preload=window.__MK_PRELOAD;
  const stored=Array.isArray(preload?.customRecipes)?preload.customRecipes:[];
  state.customRecipes=stored.filter(r=>r&&r.id&&r.name&&Array.isArray(r.steps));
  for(const r of state.customRecipes){
    if(!recipes.some(x=>x.id===r.id))recipes.push(r);
    registerCustomRecipeCatalog0409(r);
  }
})();

function esc0409(v=''){
  return String(v).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
}
function registerCustomRecipeCatalog0409(r){
  for(const row of r.ings||[]){
    const n=String(row?.[0]||'').trim();
    if(n&&!FOOD[n]&&!SEASON.includes(n))FOOD[n]='🥣';
  }
  for(const row of r.season||[]){
    const n=String(row?.[0]||'').trim();
    if(n&&!SEASON.includes(n))SEASON.push(n);
  }
  for(const group of r.tools||[])for(const raw of group||[]){
    const n=String(raw||'').trim();
    if(n&&!TOOLS.includes(n))TOOLS.push(n);
  }
}
function isCustomRecipe0409(id){return (state.customRecipes||[]).some(r=>r.id===id)}
function customRecipe0409(id){return (state.customRecipes||[]).find(r=>r.id===id)||null}
function customIcon0409(cat){
  return {肉菜:'🥩',素菜:'🥬',蛋类:'🍳',主食:'🍚',汤炖:'🍲',半成品:'🥟',饮品:'🥛'}[cat]||'🍽';
}
function blankCustom0409(){
  return {id:'',name:'',cat:'肉菜',mins:15,desc:'',ings:[['','','']],season:[],tools:[['']],steps:[''],tags:['自定义'],custom:true};
}
function normalizeCustomRecipe0409(data,id){
  const cat=String(data.cat||'其他').trim()||'其他';
  return {
    id:id||('custom_'+Date.now().toString(36)),
    name:String(data.name||'').trim(),
    icon:customIcon0409(cat),
    cat,
    tags:['自定义'],
    mins:Math.max(1,Math.min(999,Number(data.mins)||15)),
    desc:String(data.desc||'').trim()||'我的自定义菜谱',
    ings:(data.ings||[]).map(x=>[String(x[0]||'').trim(),String(x[1]||'').trim()||'适量',String(x[2]||'').trim()]).filter(x=>x[0]),
    season:(data.season||[]).map(x=>[String(x[0]||'').trim(),String(x[1]||'').trim()||'适量',x[2]?1:0]).filter(x=>x[0]),
    tools:(data.tools||[]).map(g=>(g||[]).map(x=>String(x||'').trim()).filter(Boolean)).filter(g=>g.length),
    steps:(data.steps||[]).map(x=>String(x||'').trim()).filter(Boolean),
    custom:true
  };
}
function customRowIngredient0409(row=['','','']){
  return `<div class="custom-row-0409 custom-ing-row-0409">
    <input class="custom-name-0409" list="foodCatalog0409" placeholder="食材，如 鸡腿肉" value="${esc0409(row[0])}">
    <input class="custom-amount-0409" placeholder="用量，如 300g" value="${esc0409(row[1])}">
    <input class="custom-prep-0409" placeholder="准备方式，如 切块" value="${esc0409(row[2])}">
    <button type="button" class="custom-row-remove-0409" aria-label="删除">×</button>
  </div>`;
}
function customRowSeason0409(row=['','',1]){
  return `<div class="custom-row-0409 custom-season-row-0409">
    <input class="custom-name-0409" list="seasonCatalog0409" placeholder="调味料，如 生抽" value="${esc0409(row[0])}">
    <input class="custom-amount-0409" placeholder="用量，如 1勺" value="${esc0409(row[1])}">
    <label class="custom-required-0409"><input type="checkbox" ${row[2]?'checked':''}>必需</label>
    <button type="button" class="custom-row-remove-0409" aria-label="删除">×</button>
  </div>`;
}
function customRowTool0409(group=['']){
  return `<div class="custom-row-0409 custom-tool-row-0409">
    <input class="custom-tool-input-0409" list="toolCatalog0409" placeholder="厨具；可用 / 分隔替代项" value="${esc0409((group||[]).join(' / '))}">
    <button type="button" class="custom-row-remove-0409" aria-label="删除">×</button>
  </div>`;
}
function customRowStep0409(step=''){
  return `<div class="custom-step-row-0409">
    <span class="custom-step-index-0409"></span>
    <textarea class="custom-step-input-0409" rows="2" placeholder="写清这一小步怎么做">${esc0409(step)}</textarea>
    <button type="button" class="custom-row-remove-0409" aria-label="删除">×</button>
  </div>`;
}
function refreshStepNumbers0409(){
  qa('.custom-step-row-0409').forEach((row,i)=>{const n=row.querySelector('.custom-step-index-0409');if(n)n.textContent=i+1});
}
function bindCustomRowRemove0409(){
  qa('.custom-row-remove-0409').forEach(btn=>btn.onclick=()=>{
    const row=btn.closest('.custom-row-0409,.custom-step-row-0409');
    if(row)row.remove();
    refreshStepNumbers0409();
  });
}
function readCustomForm0409(){
  const ings=qa('.custom-ing-row-0409').map(row=>[
    row.querySelector('.custom-name-0409')?.value||'',
    row.querySelector('.custom-amount-0409')?.value||'',
    row.querySelector('.custom-prep-0409')?.value||''
  ]);
  const season=qa('.custom-season-row-0409').map(row=>[
    row.querySelector('.custom-name-0409')?.value||'',
    row.querySelector('.custom-amount-0409')?.value||'',
    !!row.querySelector('.custom-required-0409 input')?.checked
  ]);
  const tools=qa('.custom-tool-row-0409').map(row=>
    String(row.querySelector('.custom-tool-input-0409')?.value||'').split('/').map(x=>x.trim()).filter(Boolean)
  );
  const steps=qa('.custom-step-input-0409').map(x=>x.value);
  return {
    name:q('#customRecipeName0409')?.value||'',
    cat:q('#customRecipeCat0409')?.value||'其他',
    mins:q('#customRecipeMins0409')?.value||15,
    desc:q('#customRecipeDesc0409')?.value||'',
    ings,season,tools,steps
  };
}
function saveCustomRecipe0409(editId=''){
  const r=normalizeCustomRecipe0409(readCustomForm0409(),editId||'');
  if(!r.name)return toast('请先填写菜名');
  if(!r.ings.length)return toast('至少填写 1 项食材');
  if(!r.steps.length)return toast('至少填写 1 个步骤');

  registerCustomRecipeCatalog0409(r);
  if(editId){
    const i=state.customRecipes.findIndex(x=>x.id===editId);
    if(i>=0)state.customRecipes[i]=r;
    const j=recipes.findIndex(x=>x.id===editId);
    if(j>=0)recipes[j]=r; else recipes.push(r);
  }else{
    state.customRecipes.push(r);
    recipes.push(r);
  }
  save();
  close();
  toast(editId?'菜谱已更新':'已添加到我的菜谱');
  state.scene='board';
  state.boardMode='recipes';
  state.filter='全部';
  state.query=r.name;
  save();
  render();
}
function customRecipeEditor0409(editId=''){
  const original=editId?customRecipe0409(editId):null;
  const r=original?clone(original):blankCustom0409();
  if(!r.ings?.length)r.ings=[['','','']];
  if(!r.steps?.length)r.steps=[''];

  q('#modal').innerHTML=`<div class="modal"><div class="sheet custom-recipe-sheet-0409">
    <div class="sheet-handle"></div>
    <div class="sheet-head custom-editor-head-0409">
      <div class="title"><b>${editId?'编辑我的菜谱':'添加自定义菜谱'}</b><small>以后会和普通菜谱一样参与搜索、推荐和今日菜单</small></div>
      <button type="button" class="icon-close" id="customClose0409">×</button>
    </div>

    <section class="custom-form-card-0409">
      <div class="custom-basic-grid-0409">
        <label class="wide"><span>菜名</span><input id="customRecipeName0409" placeholder="例如：妈妈版红烧肉" value="${esc0409(r.name)}"></label>
        <label><span>分类</span><select id="customRecipeCat0409">
          ${['肉菜','素菜','蛋类','主食','汤炖','半成品','其他'].map(x=>`<option value="${x}" ${r.cat===x?'selected':''}>${x}</option>`).join('')}
        </select></label>
        <label><span>大约用时</span><div class="custom-mins-0409"><input id="customRecipeMins0409" type="number" min="1" max="999" value="${Number(r.mins)||15}"><i>分钟</i></div></label>
        <label class="wide"><span>一句话说明 <small>可选</small></span><input id="customRecipeDesc0409" placeholder="例如：偏甜口，适合配米饭" value="${esc0409(r.desc==='我的自定义菜谱'?'':r.desc)}"></label>
      </div>
    </section>

    <section class="custom-form-section-0409">
      <div class="custom-section-head-0409"><div><b>食材</b><small>名称、用量和提前处理</small></div><button type="button" id="customAddIng0409">＋ 食材</button></div>
      <div id="customIngList0409" class="custom-rows-0409">${r.ings.map(customRowIngredient0409).join('')}</div>
    </section>

    <section class="custom-form-section-0409">
      <div class="custom-section-head-0409"><div><b>调味料</b><small>不填也可以</small></div><button type="button" id="customAddSeason0409">＋ 调味</button></div>
      <div id="customSeasonList0409" class="custom-rows-0409">${(r.season||[]).map(customRowSeason0409).join('')}</div>
    </section>

    <section class="custom-form-section-0409">
      <div class="custom-section-head-0409"><div><b>厨具</b><small>“炒锅 / 平底锅”表示任选一种</small></div><button type="button" id="customAddTool0409">＋ 厨具</button></div>
      <div id="customToolList0409" class="custom-rows-0409">${(r.tools||[]).map(customRowTool0409).join('')}</div>
    </section>

    <section class="custom-form-section-0409">
      <div class="custom-section-head-0409"><div><b>制作步骤</b><small>一行一个动作，灶台会逐步显示</small></div><button type="button" id="customAddStep0409">＋ 步骤</button></div>
      <div id="customStepList0409" class="custom-steps-0409">${r.steps.map(customRowStep0409).join('')}</div>
    </section>

    <datalist id="foodCatalog0409">${Object.keys(FOOD).map(n=>`<option value="${esc0409(n)}"></option>`).join('')}</datalist>
    <datalist id="seasonCatalog0409">${SEASON.map(n=>`<option value="${esc0409(n)}"></option>`).join('')}</datalist>
    <datalist id="toolCatalog0409">${TOOLS.map(n=>`<option value="${esc0409(n)}"></option>`).join('')}</datalist>

    <div class="sheet-footer custom-editor-footer-0409">
      <div class="custom-footer-actions-0409">
        ${editId?'<button type="button" class="custom-delete-0409" id="customDelete0409">删除</button>':''}
        <button type="button" class="primary" id="customSave0409">${editId?'保存修改':'添加菜谱'}</button>
      </div>
    </div>
  </div></div>`;

  refreshStepNumbers0409();
  bindCustomRowRemove0409();
  q('#customClose0409').onclick=close;
  q('#customAddIng0409').onclick=()=>{q('#customIngList0409').insertAdjacentHTML('beforeend',customRowIngredient0409());bindCustomRowRemove0409()};
  q('#customAddSeason0409').onclick=()=>{q('#customSeasonList0409').insertAdjacentHTML('beforeend',customRowSeason0409());bindCustomRowRemove0409()};
  q('#customAddTool0409').onclick=()=>{q('#customToolList0409').insertAdjacentHTML('beforeend',customRowTool0409());bindCustomRowRemove0409()};
  q('#customAddStep0409').onclick=()=>{q('#customStepList0409').insertAdjacentHTML('beforeend',customRowStep0409());refreshStepNumbers0409();bindCustomRowRemove0409()};
  q('#customSave0409').onclick=()=>saveCustomRecipe0409(editId);
  const del=q('#customDelete0409');if(del)del.onclick=()=>confirmDeleteCustomRecipe0409(editId);
}
function confirmDeleteCustomRecipe0409(id){
  const r=customRecipe0409(id);if(!r)return;
  q('#modal').innerHTML=`<div class="modal"><div class="sheet small-sheet-040">
    <div class="sheet-handle"></div>
    <div class="sheet-head"><div class="title"><b>删除「${esc0409(r.name)}」？</b><small>删除后不会影响冰箱里的食材记录。</small></div></div>
    <div class="sheet-footer"><div class="dual"><button type="button" class="secondary" id="customDeleteCancel0409">取消</button><button type="button" class="danger" id="customDeleteOK0409">确认删除</button></div></div>
  </div></div>`;
  q('#customDeleteCancel0409').onclick=()=>customRecipeEditor0409(id);
  q('#customDeleteOK0409').onclick=()=>{
    state.customRecipes=state.customRecipes.filter(x=>x.id!==id);
    const idx=recipes.findIndex(x=>x.id===id);if(idx>=0)recipes.splice(idx,1);
    if(typeof removeMealRecipe0200==='function')removeMealRecipe0200(id);
    if(state.cook?.recipe===id)state.cook=null;
    if(state.recipe===id)state.recipe=null;
    save();close();render();toast('已删除自定义菜谱');
  };
}
function decorateRecipePage0409(){
  if(state.scene!=='board'||state.meal?.phase==='prep')return;
  if(q('.custom-recipe-add-0409'))return;
  const h=q('#root > h2');if(!h)return;
  const head=document.createElement('div');
  head.className='recipe-title-row-0409';
  h.replaceWith(head);
  head.appendChild(h);
  const btn=document.createElement('button');
  btn.type='button';
  btn.className='custom-recipe-add-0409';
  btn.textContent='＋ 自定义';
  btn.onclick=()=>customRecipeEditor0409();
  head.appendChild(btn);

  qa('[data-r]').forEach(card=>{
    const id=card.getAttribute('data-r');
    if(!isCustomRecipe0409(id)||card.querySelector('.custom-badge-0409'))return;
    const badge=document.createElement('span');
    badge.className='custom-badge-0409';
    badge.textContent='我的';
    card.appendChild(badge);
  });
}
const boardV0409Base=board;
board=function(){
  const out=boardV0409Base();
  decorateRecipePage0409();
  return out;
};

const recipeModalV0409Base=recipeModal;
recipeModal=function(id){
  recipeModalV0409Base(id);
  if(!isCustomRecipe0409(id))return;
  const sheet=q('#modal .sheet');if(!sheet||q('.custom-recipe-actions-0409'))return;
  const title=sheet.querySelector('.recipe-title-block,.recipe-title-stack,.sheet-head');
  if(title){
    const mark=document.createElement('div');
    mark.className='custom-recipe-note-0409';
    mark.textContent='我的自定义菜谱';
    title.insertAdjacentElement('afterend',mark);
  }
  const actions=document.createElement('div');
  actions.className='custom-recipe-actions-0409';
  actions.innerHTML='<button type="button" id="editCustomRecipe0409">编辑菜谱</button>';
  const footer=sheet.querySelector('.sheet-footer');
  if(footer)footer.insertAdjacentElement('beforebegin',actions); else sheet.appendChild(actions);
  q('#editCustomRecipe0409').onclick=()=>customRecipeEditor0409(id);
};

const renderV0409Base=render;
render=function(){
  const out=renderV0409Base();
  if(state.scene==='board')decorateRecipePage0409();
  return out;
};

save();
render();
