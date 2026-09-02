// V0.5.0 Custom Recipe V2: quick text input, source, notes, and copy-to-my-recipe.
state.version='0.5.0';

function recipeSourceUrl0500(r){
  return String(r?.customMeta?.sourceUrl||r?.source?.url||'').trim();
}
function recipeNotes0500(r){
  return String(r?.customMeta?.notes||'').trim();
}
function validHttpUrl0500(url){
  if(!url)return '';
  try{
    const u=new URL(url,location.href);
    return /^https?:$/.test(u.protocol)?u.href:'';
  }catch(e){return ''}
}
function customDraft0500(r){
  const base=r?clone(r):blankCustom0409();
  base.customMeta={...(base.customMeta||{})};
  base.customMeta.sourceUrl=recipeSourceUrl0500(base);
  base.customMeta.notes=recipeNotes0500(base);
  return base;
}

normalizeCustomRecipe0409=function(data,id){
  const cat=String(data.cat||'其他').trim()||'其他';
  return {
    id:id||('custom_'+Date.now().toString(36)),
    name:String(data.name||'').trim(),
    icon:customIcon0409(cat),
    cat,
    tags:['自定义'],
    mins:Math.max(1,Math.min(999,Number(data.mins)||15)),
    desc:String(data.desc||'').trim()||'我的自定义菜谱',
    ings:(data.ings||[]).map(x=>[
      String(x[0]||'').trim(),
      String(x[1]||'').trim()||'适量',
      String(x[2]||'').trim()
    ]).filter(x=>x[0]),
    season:(data.season||[]).map(x=>[
      String(x[0]||'').trim(),
      String(x[1]||'').trim()||'适量',
      x[2]?1:0
    ]).filter(x=>x[0]),
    tools:(data.tools||[]).map(g=>(g||[]).map(x=>String(x||'').trim()).filter(Boolean)).filter(g=>g.length),
    steps:(data.steps||[]).map(x=>String(x||'').trim()).filter(Boolean),
    customMeta:{
      sourceUrl:validHttpUrl0500(String(data.sourceUrl||'').trim())||String(data.sourceUrl||'').trim(),
      notes:String(data.notes||'').trim()
    },
    custom:true
  };
};

readCustomForm0409=function(){
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
    sourceUrl:q('#customRecipeSource0500')?.value||'',
    notes:q('#customRecipeNotes0500')?.value||'',
    ings,season,tools,steps
  };
};

function amountSplit0500(line){
  const cleaned=String(line||'').replace(/^[-•·]\s*/,'').trim();
  if(!cleaned)return ['','',''];
  const explicit=cleaned.split(/\s*[*|｜]\s*/);
  if(explicit.length>=2)return [explicit[0]||'',explicit[1]||'',explicit.slice(2).join(' ')||''];
  const spaced=cleaned.split(/\s+/);
  if(spaced.length>=2){
    const idx=spaced.findIndex((x,i)=>i>0&&/^(?:\d|半|一|二|三|四|五|六|七|八|九|十|少许|适量|若干)/.test(x));
    if(idx>0)return [spaced.slice(0,idx).join(''),spaced[idx]||'',spaced.slice(idx+1).join(' ')];
  }
  const m=cleaned.match(/^(.+?)(\d+(?:\.\d+)?(?:\/\d+)?\s*(?:kg|g|克|千克|斤|两|ml|毫升|升|L|个|颗|只|根|把|片|块|瓣|勺|茶匙|汤匙|杯|碗|盒|包|瓶|张|份))(.*)$/i);
  if(m)return [m[1].trim(),m[2].trim(),m[3].trim()];
  return [cleaned,'适量',''];
}
function parseQuickRecipe0500(text){
  const out={name:'',cat:'肉菜',mins:15,desc:'',sourceUrl:'',notes:'',ings:[],season:[],tools:[],steps:[]};
  const lines=String(text||'').replace(/\r/g,'').split('\n');
  let section='';
  const sectionOf=line=>{
    const s=line.replace(/^#+\s*/,'').replace(/^\[|\]$/g,'').replace(/[：:]$/,'').trim();
    if(/^(食材|材料|主料|配料)$/.test(s))return 'ings';
    if(/^(调味料|调味|调料)$/.test(s))return 'season';
    if(/^(厨具|工具)$/.test(s))return 'tools';
    if(/^(步骤|做法|制作步骤|制作)$/.test(s))return 'steps';
    return '';
  };
  for(const raw of lines){
    let line=raw.trim();
    if(!line)continue;
    const sec=sectionOf(line);
    if(sec){section=sec;continue}
    let m;
    if((m=line.match(/^(?:菜名|名称|标题)\s*[：:]\s*(.+)$/))){out.name=m[1].trim();continue}
    if((m=line.match(/^分类\s*[：:]\s*(.+)$/))){out.cat=m[1].trim();continue}
    if((m=line.match(/^(?:用时|时间|耗时)\s*[：:]\s*(.+)$/))){out.mins=parseInt(m[1],10)||15;continue}
    if((m=line.match(/^(?:说明|描述)\s*[：:]\s*(.+)$/))){out.desc=m[1].trim();continue}
    if((m=line.match(/^(?:来源|网址|链接)\s*[：:]\s*(.+)$/))){out.sourceUrl=m[1].trim();continue}
    if((m=line.match(/^(?:备注|心得)\s*[：:]\s*(.+)$/))){out.notes=m[1].trim();continue}

    if(section==='ings'){
      const row=amountSplit0500(line);
      if(row[0])out.ings.push(row);
    }else if(section==='season'){
      const row=amountSplit0500(line);
      const optional=/可选|可省|非必需/.test(line);
      if(row[0])out.season.push([row[0],row[1],optional?0:1]);
    }else if(section==='tools'){
      const group=line.replace(/^[-•·]\s*/,'').split(/\s*(?:\/|、|或)\s*/).map(x=>x.trim()).filter(Boolean);
      if(group.length)out.tools.push(group);
    }else if(section==='steps'){
      line=line.replace(/^\s*(?:\d+[\.、)）]|[-•·])\s*/,'').trim();
      if(line&&line!=='---')out.steps.push(line);
    }else if(/^\d+[\.、)）]\s*/.test(line)){
      out.steps.push(line.replace(/^\d+[\.、)）]\s*/,'').trim());
    }
  }
  return out;
}
function quickTextFromRecipe0500(data){
  const r=data||{};
  const lines=[];
  lines.push('菜名：'+(r.name||''));
  lines.push('分类：'+(r.cat||'其他'));
  lines.push('用时：'+(Number(r.mins)||15)+'分钟');
  if(r.desc)lines.push('说明：'+r.desc);
  if(r.sourceUrl||recipeSourceUrl0500(r))lines.push('来源：'+(r.sourceUrl||recipeSourceUrl0500(r)));
  if(r.notes||recipeNotes0500(r))lines.push('备注：'+(r.notes||recipeNotes0500(r)));
  lines.push('');
  lines.push('# 食材');
  (r.ings||[]).forEach(x=>lines.push([x[0],x[1],x[2]].filter(Boolean).join(' * ')));
  lines.push('');
  lines.push('# 调味料');
  (r.season||[]).forEach(x=>lines.push([x[0],x[1],x[2]?'必需':'可选'].filter(Boolean).join(' * ')));
  lines.push('');
  lines.push('# 厨具');
  (r.tools||[]).forEach(g=>lines.push((g||[]).join(' / ')));
  lines.push('');
  lines.push('# 步骤');
  (r.steps||[]).forEach((s,i)=>lines.push((i+1)+'. '+s));
  return lines.join('\n');
}
function mergeQuickIntoDraft0500(parsed,current){
  return {
    ...current,
    ...parsed,
    name:parsed.name||current.name||'',
    desc:parsed.desc||current.desc||'',
    sourceUrl:parsed.sourceUrl||current.sourceUrl||recipeSourceUrl0500(current),
    notes:parsed.notes||current.notes||recipeNotes0500(current),
    ings:parsed.ings.length?parsed.ings:(current.ings||[]),
    season:parsed.season.length?parsed.season:(current.season||[]),
    tools:parsed.tools.length?parsed.tools:(current.tools||[]),
    steps:parsed.steps.length?parsed.steps:(current.steps||[])
  };
}
function customRecipeEditor0500(editId='',draft=null,startMode='form'){
  const original=editId?customRecipe0409(editId):null;
  const r=customDraft0500(draft||original||blankCustom0409());
  if(!r.ings?.length)r.ings=[['','','']];
  if(!r.steps?.length)r.steps=[''];
  const source=recipeSourceUrl0500(r);
  const notes=recipeNotes0500(r);

  q('#modal').innerHTML=`<div class="modal"><div class="sheet custom-recipe-sheet-0409 custom-recipe-sheet-0500">
    <div class="sheet-handle"></div>
    <div class="sheet-head custom-editor-head-0409">
      <div class="title"><b>${editId?'编辑我的菜谱':'添加自定义菜谱'}</b><small>可以慢慢填，也可以整段粘贴后自动拆成食材和步骤</small></div>
      <button type="button" class="icon-close" id="customClose0500">×</button>
    </div>

    <div class="custom-mode-tabs-0500">
      <button type="button" data-custom-mode-0500="form" class="${startMode==='form'?'on':''}">结构化填写</button>
      <button type="button" data-custom-mode-0500="text" class="${startMode==='text'?'on':''}">快速文字输入</button>
    </div>

    <div id="customFormPanel0500" class="${startMode==='form'?'':'custom-hidden-0500'}">
      <section class="custom-form-card-0409">
        <div class="custom-basic-grid-0409">
          <label class="wide"><span>菜名</span><input id="customRecipeName0409" placeholder="例如：妈妈版红烧肉" value="${esc0409(r.name)}"></label>
          <label><span>分类</span><select id="customRecipeCat0409">
            ${['肉菜','素菜','蛋类','主食','汤炖','半成品','其他'].map(x=>`<option value="${x}" ${r.cat===x?'selected':''}>${x}</option>`).join('')}
          </select></label>
          <label><span>大约用时</span><div class="custom-mins-0409"><input id="customRecipeMins0409" type="number" min="1" max="999" value="${Number(r.mins)||15}"><i>分钟</i></div></label>
          <label class="wide"><span>一句话说明 <small>可选</small></span><input id="customRecipeDesc0409" placeholder="例如：偏甜口，适合配米饭" value="${esc0409(r.desc==='我的自定义菜谱'?'':r.desc)}"></label>
          <label class="wide"><span>来源网址 <small>可选</small></span><input id="customRecipeSource0500" inputmode="url" placeholder="原菜谱、视频或文章链接" value="${esc0409(source)}"></label>
          <label class="wide"><span>心得 / 备注 <small>可选</small></span><textarea id="customRecipeNotes0500" rows="3" placeholder="例如：下次糖少一点；家里人更喜欢炖久一点">${esc0409(notes)}</textarea></label>
        </div>
      </section>

      <section class="custom-form-section-0409">
        <div class="custom-section-head-0409"><div><b>食材</b><small>名称、用量和提前处理</small></div><button type="button" id="customAddIng0500">＋ 食材</button></div>
        <div id="customIngList0409" class="custom-rows-0409">${r.ings.map(customRowIngredient0409).join('')}</div>
      </section>

      <section class="custom-form-section-0409">
        <div class="custom-section-head-0409"><div><b>调味料</b><small>可以标记必需 / 可选</small></div><button type="button" id="customAddSeason0500">＋ 调味</button></div>
        <div id="customSeasonList0409" class="custom-rows-0409">${(r.season||[]).map(customRowSeason0409).join('')}</div>
      </section>

      <section class="custom-form-section-0409">
        <div class="custom-section-head-0409"><div><b>厨具</b><small>“炒锅 / 平底锅”表示任选一种</small></div><button type="button" id="customAddTool0500">＋ 厨具</button></div>
        <div id="customToolList0409" class="custom-rows-0409">${(r.tools||[]).map(customRowTool0409).join('')}</div>
      </section>

      <section class="custom-form-section-0409">
        <div class="custom-section-head-0409"><div><b>制作步骤</b><small>一行一个动作，灶台逐步显示</small></div><button type="button" id="customAddStep0500">＋ 步骤</button></div>
        <div id="customStepList0409" class="custom-steps-0409">${r.steps.map(customRowStep0409).join('')}</div>
      </section>

      <datalist id="foodCatalog0409">${Object.keys(FOOD).map(n=>`<option value="${esc0409(n)}"></option>`).join('')}</datalist>
      <datalist id="seasonCatalog0409">${SEASON.map(n=>`<option value="${esc0409(n)}"></option>`).join('')}</datalist>
      <datalist id="toolCatalog0409">${TOOLS.map(n=>`<option value="${esc0409(n)}"></option>`).join('')}</datalist>
    </div>

    <div id="customTextPanel0500" class="custom-text-panel-0500 ${startMode==='text'?'':'custom-hidden-0500'}">
      <div class="quick-help-0500">
        <b>直接粘贴整段菜谱</b>
        <p>建议用“# 食材 / # 调味料 / # 厨具 / # 步骤”分段。食材可写成“番茄 * 2个 * 切块”。</p>
      </div>
      <textarea id="customQuickText0500" rows="20" spellcheck="false">${esc0409(quickTextFromRecipe0500({...r,sourceUrl:source,notes}))}</textarea>
      <div class="quick-example-0500">
        <span>例：</span>
        <code># 食材\n番茄 * 2个 * 切块\n鸡蛋 * 3个\n# 步骤\n1. 鸡蛋炒熟盛出\n2. 番茄炒软后合炒</code>
      </div>
      <button type="button" class="primary quick-parse-0500" id="customParse0500">解析并回到表单检查</button>
    </div>

    <div class="sheet-footer custom-editor-footer-0409" id="customFooter0500">
      <div class="custom-footer-actions-0409">
        ${editId?'<button type="button" class="custom-delete-0409" id="customDelete0500">删除</button>':''}
        <button type="button" class="primary" id="customSave0500">${editId?'保存修改':'添加菜谱'}</button>
      </div>
    </div>
  </div></div>`;

  refreshStepNumbers0409();
  bindCustomRowRemove0409();

  const form=q('#customFormPanel0500'),textPanel=q('#customTextPanel0500'),footer=q('#customFooter0500');
  const setMode=mode=>{
    const textMode=mode==='text';
    form.classList.toggle('custom-hidden-0500',textMode);
    textPanel.classList.toggle('custom-hidden-0500',!textMode);
    footer.classList.toggle('custom-hidden-0500',textMode);
    qa('[data-custom-mode-0500]').forEach(b=>b.classList.toggle('on',b.getAttribute('data-custom-mode-0500')===mode));
    if(textMode){
      const current=readCustomForm0409();
      q('#customQuickText0500').value=quickTextFromRecipe0500(current);
    }
  };

  q('#customClose0500').onclick=close;
  qa('[data-custom-mode-0500]').forEach(btn=>btn.onclick=()=>setMode(btn.getAttribute('data-custom-mode-0500')));
  q('#customAddIng0500').onclick=()=>{q('#customIngList0409').insertAdjacentHTML('beforeend',customRowIngredient0409());bindCustomRowRemove0409()};
  q('#customAddSeason0500').onclick=()=>{q('#customSeasonList0409').insertAdjacentHTML('beforeend',customRowSeason0409());bindCustomRowRemove0409()};
  q('#customAddTool0500').onclick=()=>{q('#customToolList0409').insertAdjacentHTML('beforeend',customRowTool0409());bindCustomRowRemove0409()};
  q('#customAddStep0500').onclick=()=>{q('#customStepList0409').insertAdjacentHTML('beforeend',customRowStep0409());refreshStepNumbers0409();bindCustomRowRemove0409()};
  q('#customParse0500').onclick=()=>{
    const current=readCustomForm0409();
    const parsed=parseQuickRecipe0500(q('#customQuickText0500').value);
    const merged=mergeQuickIntoDraft0500(parsed,current);
    customRecipeEditor0500(editId,merged,'form');
    toast('已解析，请检查后保存');
  };
  q('#customSave0500').onclick=()=>saveCustomRecipe0409(editId);
  const del=q('#customDelete0500');if(del)del.onclick=()=>confirmDeleteCustomRecipe0409(editId);
}
customRecipeEditor0409=customRecipeEditor0500;

function duplicateRecipe0500(id){
  const src=recipeById0200(id)||recipes.find(x=>x.id===id);
  if(!src)return;
  const draft=customDraft0500(src);
  draft.id='';
  draft.custom=true;
  draft.name=(src.name||'菜谱')+' · 我的版本';
  draft.tags=['自定义'];
  draft.customMeta={
    sourceUrl:recipeSourceUrl0500(src),
    notes:isCustomRecipe0409(id)?recipeNotes0500(src):''
  };
  customRecipeEditor0500('',draft,'form');
}
function decorateRecipeDetail0500(id){
  const r=recipeById0200(id)||recipes.find(x=>x.id===id);
  const sheet=q('#modal .sheet');if(!r||!sheet)return;

  if(!q('.recipe-v2-meta-0500')&&(recipeSourceUrl0500(r)||recipeNotes0500(r))){
    const box=document.createElement('div');
    box.className='recipe-v2-meta-0500';
    const source=validHttpUrl0500(recipeSourceUrl0500(r));
    box.innerHTML=`${recipeNotes0500(r)?`<div><b>我的心得</b><p>${esc0409(recipeNotes0500(r))}</p></div>`:''}
      ${source?`<a href="${esc0409(source)}" target="_blank" rel="noopener noreferrer">查看原始来源 ↗</a>`:''}`;
    const footer=sheet.querySelector('.sheet-footer');
    if(footer)footer.insertAdjacentElement('beforebegin',box);else sheet.appendChild(box);
  }

  let actions=q('.custom-recipe-actions-0409');
  if(!actions){
    actions=document.createElement('div');
    actions.className='custom-recipe-actions-0409';
    const footer=sheet.querySelector('.sheet-footer');
    if(footer)footer.insertAdjacentElement('beforebegin',actions);else sheet.appendChild(actions);
  }
  if(!actions.querySelector('#copyRecipe0500')){
    const btn=document.createElement('button');
    btn.type='button';btn.id='copyRecipe0500';
    btn.textContent=isCustomRecipe0409(id)?'复制一份':'复制为我的菜谱';
    btn.onclick=()=>duplicateRecipe0500(id);
    actions.appendChild(btn);
  }
}
const recipeModalV0500Base=recipeModal;
recipeModal=function(id){
  recipeModalV0500Base(id);
  decorateRecipeDetail0500(id);
};

save();
render();
