// V0.1.17b: clarify multi-stage CookLikeHOC source recipes.
const recipeModalV0117b=recipeModal;
recipeModal=function(id){
  recipeModalV0117b(id);
  const r=recipes.find(x=>x.id===id);
  if(!r?.hoc||!r.source?.complex)return;
  const top=q('.hoc-source-top');
  if(top&&!q('.hoc-complex-badge'))top.insertAdjacentHTML('beforeend','<span class="hoc-home-scale hoc-complex-badge">多阶段配方</span>');
  const text=q('.hoc-source-text');
  if(text&&!q('.hoc-complex-note'))text.insertAdjacentHTML('beforeend','<small class="hoc-complex-note">多阶段克重保留在具体步骤中，材料标签中的“见步骤”不代表缺少数据。</small>');
};
render();
