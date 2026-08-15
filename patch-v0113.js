// V0.1.13 clarify recipe bulk-confirm action
state.version='0.1.13';
save();

const recipeModalV0112=recipeModal;
recipeModal=function(id){
  recipeModalV0112(id);

  const r=recipes.find(x=>x.id===id);
  if(!r)return;

  const requiredAll=[
    ...r.ings.map(x=>['food',x[0],x[1]]),
    ...r.season.filter(x=>x[2]).map(x=>['seasoning',x[0],x[1]])
  ];
  const ownedCount=requiredAll.filter(x=>has(x[0],x[1])).length;
  const allHave=ownedCount===requiredAll.length;

  const bulk=q('#markAllRequired');
  if(bulk){
    bulk.textContent=allHave?'✓ 已全部有':'材料全都有';
    bulk.setAttribute('aria-label',allHave?'必需材料已全部有':'将这道菜的必需材料标记为家里都有');
  }

  const firstSummary=q('.recipe-mini-summary .tag');
  if(firstSummary){
    firstSummary.innerHTML=`必需 <strong>${ownedCount}/${requiredAll.length}</strong> 已有`;
  }
};

render();
