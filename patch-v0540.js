// V0.5.4 screenshot-driven consistency cleanup.
state.version='0.5.4';

function stripSceneEmoji0540(){
  const targets=[
    '.fridge-title-044 h2',
    '.recipe-title-row-0409 h2',
    '.stove-title-0406 h2',
    '.mine-title-040 h2'
  ];
  for(const sel of targets){
    const el=q(sel);
    if(!el)continue;
    el.textContent=(el.textContent||'').replace(/^[\p{Extended_Pictographic}\uFE0F\u200D\s]+/u,'').trim();
  }
  if(state.scene==='board'&&state.meal?.phase==='prep'){
    const h=q('#root h2');
    if(h)h.textContent=(h.textContent||'').replace(/^[\p{Extended_Pictographic}\uFE0F\u200D\s]+/u,'').trim();
  }
}

function cleanHome0540(){
  if(state.scene!=='home')return;
  const items=qa('.home-kitchen-040 button');
  if(items.length>=4){
    const recipeCount=items[2].querySelector('b');
    if(recipeCount)recipeCount.textContent=recipes.length;
    const mealCount=(state.meal?.dishes||[]).filter(id=>!(state.meal?.completed||[]).includes(id)).length;
    const last=items[3];
    const b=last.querySelector('b'),small=last.querySelector('small');
    if(b)b.textContent=mealCount;
    if(small)small.textContent='今日菜单';
    last.setAttribute('data-home-jump-040','stove');
    last.onclick=()=>go('stove');
  }
}

function cleanFridge0540(){
  if(state.scene!=='fridge')return;
  const summary=qa('.inventory-overview-044>div');
  // “常备” was an extra state users did not find useful. Keep old data compatible,
  // but remove the concept from the visible inventory UI.
  if(summary[2])summary[2].remove();

  qa('.inventory-head-044>div small').forEach(el=>{
    el.textContent=(el.textContent||'').replace(/\s*·\s*常备\s*\d+\s*种/g,'').trim();
  });
}

function cleanMine0540(){
  if(state.scene!=='mine')return;
  qa('.setting-row-040 small').forEach(el=>{
    if((el.textContent||'').includes('菜板的默认浏览方式')){
      el.textContent='菜谱页的默认浏览方式';
    }
  });
  const aboutTitle=q('.about-040 b');
  if(aboutTitle)aboutTitle.textContent='我的小厨房 · V0.5.4';
  const about=q('.about-040 p');
  if(about)about.textContent='跟随设备自动切换亮色/暗色主题。首页负责推荐，冰箱负责库存，菜谱负责找菜和选菜，灶台负责今日菜单与制作。';
}

function cleanStove0540(){
  if(state.scene!=='stove')return;
  const p=q('.stove-empty-card-0406 p');
  if(p)p.textContent='去菜谱挑几道菜，加入“今日菜单”后都会集中显示在这里。';
}

function polishMain0540(){
  stripSceneEmoji0540();
  cleanHome0540();
  cleanFridge0540();
  cleanMine0540();
  cleanStove0540();
}

const manageModalV0540Base=manageModal;
manageModal=function(tab='food'){
  // “常备” is intentionally no longer exposed. Old links/state fall back to 调味料.
  if(tab==='staple')tab='seasoning';
  manageModalV0540Base(tab);

  const sheet=q('.inventory-sheet-044');
  if(!sheet)return;
  sheet.dataset.inventoryTab0540=tab;

  const staple=q('[data-tab-044="staple"]');
  if(staple)staple.remove();

  const count=q('#manageCount044');
  if(count&&count.parentElement){
    count.parentElement.innerHTML='已有 <b id="manageCount044">'+count.textContent+'</b>';
  }
};

const renderV0540Base=render;
render=function(){
  const out=renderV0540Base();
  polishMain0540();
  return out;
};

const homeV0540Base=home040;
home040=function(){homeV0540Base();polishMain0540()};

const fridgeV0540Base=fridge;
fridge=function(){const out=fridgeV0540Base();polishMain0540();return out};

const boardV0540Base=board;
board=function(){const out=boardV0540Base();polishMain0540();return out};

const stoveV0540Base=stove;
stove=function(){const out=stoveV0540Base();polishMain0540();return out};

const mineV0540Base=mine040;
mine040=function(){mineV0540Base();polishMain0540()};

save();
render();
