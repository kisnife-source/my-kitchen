// V0.4.0 information architecture refresh: Home + My, cleaner daily workflow.
state.version='0.4.0';

if(!Number.isFinite(state.homeRecommendCount040))state.homeRecommendCount040=3;
state.homeRecommendCount040=Math.max(3,Math.min(5,state.homeRecommendCount040));
if(!['best','easy','fast','clear'].includes(state.recommendMode0300))state.recommendMode0300='best';

(function restoreScene040(){
  const p=window.__MK_PRELOAD;
  if(p&&['home','fridge','board','stove','mine'].includes(p.scene))state.scene=p.scene;
  else if(!window.__MK_HAD_STATE)state.scene='home';
})();

function sceneMeta040(scene){
  return {
    home:['首页','今天吃什么'],
    fridge:['冰箱','我有什么'],
    board:['菜板','决定这一顿'],
    stove:['灶台','怎么做'],
    mine:['我的','设置']
  }[scene]||['我的小厨房',''];
}
function setChrome040(){
  const meta=sceneMeta040(state.scene);
  const h=q('.top-title h1'),sub=q('#sub');
  if(h)h.textContent=meta[0];
  if(sub)sub.textContent=meta[1];
  qa('.nav button').forEach(b=>b.classList.toggle('on',b.dataset.s===state.scene));
  document.body.classList.toggle('cooking-040',state.scene==='stove'&&!!state.cook);
}
function normalRecipes040(){
  return recipes.filter(r=>r&&r.id&&r.name&&r.cat!=='调味配方'&&!/饮品|饮料/.test(String(r.cat||'')));
}
function homeRecommendations040(){
  return normalRecipes040()
    .slice()
    .sort((a,b)=>recipeScore0300(a,state.recommendMode0300)-recipeScore0300(b,state.recommendMode0300)||a.mins-b.mins)
    .slice(0,state.homeRecommendCount040);
}
function recommendationReason040(r){
  const x=recipeInventoryStats0300(r);
  if(x.missingFood===0&&x.missingSeason===0&&x.toolMissing===0)return '食材齐全';
  if(x.missingFood===0&&x.toolMissing===0&&x.missingSeason<=1)return x.missingSeason?'只差 1 种调味':'基本齐全';
  if(x.missingFood===1&&x.toolMissing===0)return '只差 1 样食材';
  return `缺 ${x.missingFood+x.missingSeason+x.toolMissing} 项`;
}
function modeCopy040(){
  return {best:'最适合',easy:'省事',fast:'最快',clear:'清库存'}[state.recommendMode0300]||'最适合';
}
function mealNames040(){
  if(!state.meal?.dishes?.length)return [];
  return state.meal.dishes.map(id=>recipeById0200(id)).filter(Boolean);
}
function home040(){
  const count=inventoryCount0300();
  const meal=mealNames040();
  const recs=homeRecommendations040();
  const cooking=state.cook?recipeById0200(state.cook.recipe):null;
  q('#root').innerHTML=`<div class="home-040">
    <section class="home-hero-040">
      <div>
        <small>你的厨房</small>
        <h2>今天吃什么？</h2>
        <p>${count.food? `已有 ${count.food} 种食材 · ${count.season} 种调味料`:'先把家里现有的东西记进冰箱'}</p>
      </div>
      <button id="homeFridge040">管理冰箱</button>
    </section>

    ${cooking?`<section class="continue-040">
      <div><small>正在做</small><b>${cooking.name}</b><span>第 ${(state.cook.step||0)+1} / ${cooking.steps?.length||1} 步</span></div>
      <button id="continueCook040">继续做饭</button>
    </section>`:meal.length?`<section class="continue-040 soft">
      <div><small>这一顿</small><b>${meal.map(r=>r.name).slice(0,3).join(' · ')}${meal.length>3?'…':''}</b><span>${meal.length} 道 · ${state.meal.servings||2} 人份</span></div>
      <button id="continueMeal040">继续安排</button>
    </section>`:''}

    <section class="home-section-040">
      <div class="home-section-head-040"><div><h3>为你推荐</h3><p>只给少量值得看的选择</p></div><button id="moreRecipes040">更多</button></div>
      <div class="home-modes-040">${[['best','适合'],['easy','省事'],['fast','最快'],['clear','清库存']].map(([k,n])=>`<button data-home-mode-040="${k}" class="${state.recommendMode0300===k?'on':''}">${n}</button>`).join('')}</div>
      ${count.food? `<div class="home-recipe-list-040">${recs.map((r,i)=>`<button class="home-recipe-040" data-home-recipe-040="${r.id}">
        <span class="rank-040">${i+1}</span>
        <div class="home-recipe-copy-040"><b>${r.name}</b><small>${r.mins||'--'} 分钟 · ${recommendationReason040(r)}</small></div>
        <span class="arrow-040">›</span>
      </button>`).join('')}</div>`:`<div class="home-empty-040"><b>还没有可用库存</b><p>先记录几种常用食材，首页就会根据你的厨房推荐。</p><button id="homeAdd040">去添加食材</button></div>`}
    </section>

    <section class="home-kitchen-040">
      <button data-home-jump-040="fridge"><b>${count.food}</b><small>食材</small></button>
      <button data-home-jump-040="fridge"><b>${count.season}</b><small>调味料</small></button>
      <button data-home-jump-040="board"><b>${normalRecipes040().length}</b><small>菜谱</small></button>
      <button data-home-jump-040="mine"><b>V0.4</b><small>设置</small></button>
    </section>
  </div>`;
  q('#homeFridge040').onclick=()=>go('fridge');
  const add=q('#homeAdd040');if(add)add.onclick=()=>{go('fridge');setTimeout(()=>manageModal('food'),0)};
  q('#moreRecipes040').onclick=()=>go('board');
  const cc=q('#continueCook040');if(cc)cc.onclick=()=>go('stove');
  const cm=q('#continueMeal040');if(cm)cm.onclick=()=>{state.mealView=true;state.mealPage='plan';save();go('board')};
  qa('[data-home-mode-040]').forEach(b=>b.onclick=()=>{state.recommendMode0300=b.dataset.homeMode040;save();home040();setChrome040()});
  qa('[data-home-recipe-040]').forEach(b=>b.onclick=()=>recipeModal(b.dataset.homeRecipe040));
  qa('[data-home-jump-040]').forEach(b=>b.onclick=()=>go(b.dataset.homeJump040));
}

function settingRow040(title,desc,control){
  return `<div class="setting-row-040"><div><b>${title}</b><small>${desc}</small></div><div class="setting-control-040">${control}</div></div>`;
}
function mine040(){
  const count=inventoryCount0300();
  const servings=Math.max(1,state.meal?.servings||2);
  const view=state.viewMode==='list'?'list':'cards';
  q('#root').innerHTML=`<div class="mine-040">
    <div class="mine-title-040"><h2>我的小厨房</h2><p>把不常用的功能和偏好放在这里。</p></div>

    <section class="settings-card-040">
      <h3>做饭偏好</h3>
      ${settingRow040('默认人数','本餐用量会按人数换算',`<div class="mini-stepper-040"><button id="mineServMinus040">−</button><b>${servings}</b><button id="mineServPlus040">＋</button></div>`)}
      ${settingRow040('首页默认推荐','决定首页优先怎么排序',`<select id="mineMode040"><option value="best" ${state.recommendMode0300==='best'?'selected':''}>最适合现在</option><option value="easy" ${state.recommendMode0300==='easy'?'selected':''}>最省事</option><option value="fast" ${state.recommendMode0300==='fast'?'selected':''}>最快做好</option><option value="clear" ${state.recommendMode0300==='clear'?'selected':''}>优先清库存</option></select>`)}
      ${settingRow040('首页推荐数量','首页保持克制，只显示少量菜',`<div class="segmented-040"><button data-rec-count-040="3" class="${state.homeRecommendCount040===3?'on':''}">3 道</button><button data-rec-count-040="5" class="${state.homeRecommendCount040===5?'on':''}">5 道</button></div>`)}
      ${settingRow040('菜谱显示','菜板的默认浏览方式',`<div class="segmented-040"><button data-view-040="cards" class="${view==='cards'?'on':''}">卡片</button><button data-view-040="list" class="${view==='list'?'on':''}">列表</button></div>`)}
    </section>

    <section class="settings-card-040">
      <h3>厨房数据</h3>
      <div class="data-summary-040"><span><b>${count.food}</b> 食材</span><span><b>${count.season}</b> 调味料</span><span><b>${count.tool}</b> 厨具</span><span><b>${recipes.length}</b> 菜谱</span></div>
      <button class="settings-link-040" id="mineManage040"><span>管理厨房物品</span><i>›</i></button>
      <button class="settings-link-040 danger" id="mineReset040"><span>重置本地数据</span><i>›</i></button>
    </section>

    <section class="about-040"><b>我的小厨房 · V0.4.0</b><p>首页负责推荐，冰箱负责库存，菜板负责组织这一顿，灶台负责执行。</p></section>
  </div>`;

  q('#mineServMinus040').onclick=()=>{setServings0200(Math.max(1,servings-1));mine040();setChrome040()};
  q('#mineServPlus040').onclick=()=>{setServings0200(Math.min(12,servings+1));mine040();setChrome040()};
  q('#mineMode040').onchange=e=>{state.recommendMode0300=e.target.value;save()};
  qa('[data-rec-count-040]').forEach(b=>b.onclick=()=>{state.homeRecommendCount040=Number(b.dataset.recCount040);save();mine040();setChrome040()});
  qa('[data-view-040]').forEach(b=>b.onclick=()=>{state.viewMode=b.dataset.view040;save();mine040();setChrome040()});
  q('#mineManage040').onclick=()=>go('fridge');
  q('#mineReset040').onclick=()=>resetConfirm040();
}
function resetConfirm040(){
  q('#modal').innerHTML=`<div class="modal"><div class="sheet small-sheet-040"><div class="sheet-handle"></div><div class="sheet-head"><div class="title"><b>重置本地数据？</b><small>会清空库存、购物袋、本餐和偏好，菜谱库不会删除。</small></div><button class="icon-close" id="x">×</button></div><div class="sheet-footer"><div class="dual"><button class="secondary" id="resetCancel040">取消</button><button class="danger" id="resetOK040">确认重置</button></div></div></div></div>`;
  q('#x').onclick=close;q('#resetCancel040').onclick=close;
  q('#resetOK040').onclick=()=>{localStorage.removeItem('mk01');location.reload()};
}

// Recommendation belongs on Home from V0.4 onward; keep Board focused on choosing and organizing the meal.
addRecommendBar0300=function(){};

const renderV040Base=render;
render=function(){
  if(state.scene==='home'){home040();setChrome040();return}
  if(state.scene==='mine'){mine040();setChrome040();return}
  renderV040Base();
  setChrome040();
};

save();
render();
