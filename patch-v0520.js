// V0.5.2 visual polish: unified line icons, calmer hierarchy, consistent page chrome.
state.version='0.5.2';

function icon0520(name,cls=''){
  const paths={
    home:'<path d="M3.5 10.5 12 3.8l8.5 6.7v8.2a1.8 1.8 0 0 1-1.8 1.8H5.3a1.8 1.8 0 0 1-1.8-1.8z"/><path d="M9 20.5v-6h6v6"/>',
    fridge:'<rect x="5" y="2.8" width="14" height="18.4" rx="2.5"/><path d="M5 10.2h14"/><path d="M8 6.2v1.8M8 13.5v2.2"/>',
    recipe:'<path d="M3.7 5.3c2.8-1.2 5.4-.9 8.3.8v14c-2.9-1.7-5.5-2-8.3-.8z"/><path d="M20.3 5.3c-2.8-1.2-5.4-.9-8.3.8v14c2.9-1.7 5.5-2 8.3-.8z"/>',
    stove:'<path d="M4 12.8h13.2a4.8 4.8 0 0 1-4.7 4H8.7A4.8 4.8 0 0 1 4 12.8Z"/><path d="M17.2 13h3.3"/><path d="M8 9.7c-1.1-1.3 1.1-2.1 0-3.5M12 9.7c-1.1-1.3 1.1-2.1 0-3.5"/>',
    user:'<circle cx="12" cy="8.2" r="3.2"/><path d="M5.2 20c.6-4 3-6 6.8-6s6.2 2 6.8 6"/>',
    plate:'<circle cx="12" cy="12" r="7.5"/><circle cx="12" cy="12" r="3.7"/>',
    plus:'<path d="M12 5v14M5 12h14"/>'
  };
  return `<svg class="ui-icon-0520 ${cls}" viewBox="0 0 24 24" aria-hidden="true" focusable="false">${paths[name]||paths.plate}</svg>`;
}

function installNav0520(){
  const items={
    home:['home','首页'],
    fridge:['fridge','冰箱'],
    board:['recipe','菜谱'],
    stove:['stove','灶台'],
    mine:['user','我的']
  };
  for(const [scene,[icon,label]] of Object.entries(items)){
    const btn=q(`.nav button[data-s="${scene}"]`);
    if(!btn)continue;
    const badge=btn.querySelector('.nav-menu-count-0406')?.outerHTML||'';
    btn.innerHTML=`<span class="nav-icon-wrap-0520">${icon0520(icon)}</span><span class="nav-label-0520">${label}</span>${badge}`;
    btn.setAttribute('aria-label',label);
  }
}

function decorateTitle0520(){
  const map={
    fridge:['.fridge-title-044 h2','fridge'],
    board:['.recipe-title-row-0409 h2, #root > h2','recipe'],
    stove:['.stove-title-0406 h2','stove'],
    mine:['.mine-title-040 h2','user']
  };
  const row=map[state.scene];
  if(!row)return;
  const el=q(row[0]);
  if(!el||el.dataset.polished0520)return;
  let text=(el.textContent||'').trim();
  text=text.replace(/^[🧊📖🔪🍳👤]\s*/,'');
  el.innerHTML=`<span class="scene-title-icon-0520">${icon0520(row[1])}</span><span>${text}</span>`;
  el.dataset.polished0520='1';
}

function polishEmptyStates0520(){
  const stoveEmpty=q('.stove-empty-icon-0406');
  if(stoveEmpty)stoveEmpty.innerHTML=icon0520('plate','empty-plate-0520');
}

function polishUi0520(){
  installNav0520();
  decorateTitle0520();
  polishEmptyStates0520();
}

const renderV0520Base=render;
render=function(){
  const out=renderV0520Base();
  polishUi0520();
  return out;
};

const homeV0520Base=home040;
home040=function(){homeV0520Base();polishUi0520()};

const fridgeV0520Base=fridge;
fridge=function(){const out=fridgeV0520Base();polishUi0520();return out};

const boardV0520Base=board;
board=function(){const out=boardV0520Base();polishUi0520();return out};

const stoveV0520Base=stove;
stove=function(){const out=stoveV0520Base();polishUi0520();return out};

const mineV0520Base=mine040;
mine040=function(){
  mineV0520Base();
  const aboutTitle=q('.about-040 b');if(aboutTitle)aboutTitle.textContent='我的小厨房 · V0.5.2';
  polishUi0520();
};

polishUi0520();
save();
render();
