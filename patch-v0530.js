// V0.5.3 consistency pass — keep the warm character, unify hierarchy and wording.
state.version='0.5.3';

function polishConsistency0530(){
  // Keep scene naming stable: navigation name = page title.
  if(state.scene==='stove'){
    const h=q('.stove-title-0406 h2');
    if(h)h.textContent='🍳 灶台';
    const p=q('.stove-title-0406 p');
    if(p)p.textContent=(state.meal?.dishes||[]).length?'今日菜单 · 今天要做的菜':'今天准备做什么';
    const menuHead=q('.today-menu-card-0406 .today-section-head-0406>div:first-child>b');
    if(menuHead)menuHead.textContent='今日菜单';
  }

  if(state.scene==='board'&&state.meal?.phase!=='prep'){
    const h=q('.recipe-title-row-0409 h2, #root > h2');
    if(h)h.textContent='📖 菜谱';
  }

  // One wording for shopping throughout the main flow.
  qa('.shopping-btn-044').forEach(b=>{
    b.childNodes.forEach(n=>{
      if(n.nodeType===Node.TEXT_NODE&&n.nodeValue.includes('购物清单'))n.nodeValue=n.nodeValue.replace('购物清单','购物清单');
    });
  });
}

const renderV0530Base=render;
render=function(){
  const out=renderV0530Base();
  polishConsistency0530();
  return out;
};

const homeV0530Base=home040;
home040=function(){homeV0530Base();polishConsistency0530()};

const fridgeV0530Base=fridge;
fridge=function(){const out=fridgeV0530Base();polishConsistency0530();return out};

const boardV0530Base=board;
board=function(){const out=boardV0530Base();polishConsistency0530();return out};

const stoveV0530Base=stove;
stove=function(){const out=stoveV0530Base();polishConsistency0530();return out};

const mineV0530Base=mine040;
mine040=function(){
  mineV0530Base();
  const aboutTitle=q('.about-040 b');
  if(aboutTitle)aboutTitle.textContent='我的小厨房 · V0.5.3';
  polishConsistency0530();
};

save();
render();
