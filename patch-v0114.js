// V0.1.14 compact prompt for bulk-confirm action
state.version='0.1.14';
save();

const recipeModalV0113=recipeModal;
recipeModal=function(id){
  recipeModalV0113(id);

  const r=recipes.find(x=>x.id===id);
  if(!r)return;
  const requiredAll=[
    ...r.ings.map(x=>['food',x[0],x[1]]),
    ...r.season.filter(x=>x[2]).map(x=>['seasoning',x[0],x[1]])
  ];
  const allHave=requiredAll.every(x=>has(x[0],x[1]));
  const bulk=q('#markAllRequired');
  if(!bulk)return;

  if(allHave){
    const done=document.createElement('div');
    done.className='bulk-confirm-done';
    done.textContent='✓ 已准备好';
    bulk.replaceWith(done);
    return;
  }

  bulk.textContent='一键添加';
  bulk.classList.remove('done');
  bulk.disabled=false;
  const wrap=document.createElement('div');
  wrap.className='bulk-confirm-prompt';
  const hint=document.createElement('small');
  hint.textContent='都准备好了？';
  bulk.parentNode.insertBefore(wrap,bulk);
  wrap.appendChild(hint);
  wrap.appendChild(bulk);
};

render();
