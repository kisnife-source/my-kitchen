// V0.1.7 semi-prepared food patch
state.version='0.1.7';

const SEMI_PREPARED=['水饺','包子','手抓饼'];

// Existing recipes: distinguish direct preparation from secondary processing.
const directMap={r9:['半成品',['直接处理','省事']],r17:['半成品',['直接处理','早餐']],r18:['半成品',['直接处理','快手']],r21:['半成品',['二次加工','早餐']]};
Object.entries(directMap).forEach(([id,[cat,tags]])=>{const r=recipes.find(x=>x.id===id);if(r){r.cat=cat;r.tags=tags}});

function addRecipeOnce(recipe){if(!recipes.some(r=>r.id===recipe.id))recipes.push(recipe)}
addRecipeOnce(R('r23','煎饺','🥟','半成品',['二次加工','快手'],12,'水饺不只可以煮，也可以煎出焦脆底',[['水饺','1人份','冷冻水饺可直接使用']],[['食用油','少量',1]],[['平底锅']],['平底锅加少量油，摆入水饺。','中火煎至底部微黄。','加入少量清水并立即盖盖。','水分基本收干后开盖，再煎至底部酥脆。']));
addRecipeOnce(R('r24','抱蛋煎饺','🍳','半成品',['二次加工','一人食'],15,'煎饺加鸡蛋，一份半成品直接变成完整一餐',[['水饺','1人份','冷冻可直接使用'],['鸡蛋','2个','打散']],[['食用油','少量',1],['盐','少量',0]],[['平底锅']],['平底锅加少量油，把水饺煎至底部微黄。','加入少量清水，盖盖焖至水饺基本熟透。','水分快干时倒入蛋液。','小火煎至蛋液凝固即可。']));
addRecipeOnce(R('r25','鸡蛋手抓饼','🫓','半成品',['二次加工','早餐'],10,'在基础手抓饼上加鸡蛋，简单升级',[['手抓饼','1张','无需解冻'],['鸡蛋','1个','打散']],[['番茄酱','适量',0]],[['平底锅']],['平底锅预热，放入手抓饼。','一面定型后翻面，倒入鸡蛋液。','蛋液凝固后再次翻面。','喜欢的话抹番茄酱，对折或卷起即可。']));
addRecipeOnce(R('r26','香肠手抓饼卷','🌭','半成品',['二次加工','早餐'],12,'手抓饼加香肠，直接做成方便拿着吃的卷饼',[['手抓饼','1张','无需解冻'],['香肠','1根','切开或整根使用']],[['番茄酱','适量',0]],[['平底锅']],['先把香肠煎热并微微上色。','放入手抓饼煎至两面金黄。','把香肠放在饼上。','可加番茄酱，卷起即可。']));

save();

board=function(){
  if(state.prep)return prepView();
  const cats=['全部','肉菜','素菜','蛋类','主食','汤炖','半成品'];
  const mode=`<div class="board-mode"><button data-board-mode="recipes" class="${state.boardMode==='recipes'?'on':''}">选菜谱</button><button data-board-mode="ingredients" class="${state.boardMode==='ingredients'?'on':''}">按食材找菜</button></div>`;
  if(state.boardMode==='ingredients'){
    const fq=state.foodQuery.trim();
    const foods=Object.keys(FOOD).filter(n=>!fq||n.includes(fq));
    const selected=state.matchFoods.filter(n=>FOOD[n]);
    let matched=[];
    if(selected.length){
      matched=recipes.map(r=>{
        const names=r.ings.map(x=>x[0]);
        const overlap=selected.filter(n=>names.includes(n)).length;
        return {r,overlap};
      }).filter(x=>x.overlap>0).sort((a,b)=>b.overlap-a.overlap||rs(a.r).missing-rs(b.r).missing||a.r.mins-b.r.mins).map(x=>x.r);
    }
    q('#root').innerHTML=`<h2>🔪 菜板</h2>${mode}<div class="ingredient-find card"><div class="search-row"><input id="foodSearch" class="search" placeholder="搜索食材或半成品" value="${state.foodQuery}"><button class="clear-foods" id="clearFoods" ${selected.length?'':'disabled'}>清空</button></div><div class="picker-grid compact-foods">${foods.map(n=>`<button class="pick ${selected.includes(n)?'on':''}" data-match-food="${n}">${FOOD[n]} ${n}</button>`).join('')}</div></div><div class="match-head"><b>${selected.length?`匹配菜谱 · 已选 ${selected.length} 种`:'选择现有食物'}</b><div class="view-switch"><button data-view="cards" class="${state.viewMode==='cards'?'on':''}">▦</button><button data-view="list" class="${state.viewMode==='list'?'on':''}">☰</button></div></div>${selected.length?recipeBody(matched):'<div class="empty">例如选择“水饺”，会同时出现煮水饺、煎饺、抱蛋煎饺。</div>'}`;
    q('#foodSearch').oninput=e=>{state.foodQuery=e.target.value;save();board()};
    q('#clearFoods').onclick=()=>{state.matchFoods=[];save();board()};
    qa('[data-match-food]').forEach(b=>b.onclick=()=>{const n=b.dataset.matchFood;state.matchFoods=state.matchFoods.includes(n)?state.matchFoods.filter(x=>x!==n):[...state.matchFoods,n];save();board()});
    qa('[data-view]').forEach(b=>b.onclick=()=>{state.viewMode=b.dataset.view;save();board()});
    qa('[data-board-mode]').forEach(b=>b.onclick=()=>{state.boardMode=b.dataset.boardMode;save();board()});
    bindRecipeCards();return;
  }
  const list=recipes.filter(r=>(state.filter==='全部'||r.cat===state.filter)&&(!state.query||r.name.includes(state.query)||r.ings.some(x=>x[0].includes(state.query))||r.tags.some(x=>x.includes(state.query))));
  q('#root').innerHTML=`<h2>🔪 菜板</h2>${mode}<div class="board-tools"><div class="search-row"><input id="search" class="search" placeholder="搜索菜名或食材" value="${state.query}"><div class="view-switch"><button data-view="cards" class="${state.viewMode==='cards'?'on':''}">▦</button><button data-view="list" class="${state.viewMode==='list'?'on':''}">☰</button></div></div><div class="filters">${cats.map(c=>`<button class="filter ${state.filter===c?'on':''}" data-cat="${c}">${c}</button>`).join('')}</div></div>${recipeBody(list)}`;
  q('#search').oninput=e=>{state.query=e.target.value.trim();save();board()};
  qa('[data-view]').forEach(b=>b.onclick=()=>{state.viewMode=b.dataset.view;save();board()});
  qa('[data-cat]').forEach(b=>b.onclick=()=>{state.filter=b.dataset.cat;save();board()});
  qa('[data-board-mode]').forEach(b=>b.onclick=()=>{state.boardMode=b.dataset.boardMode;save();board()});
  bindRecipeCards();
};

fridge=function(){
  const normalFoods=state.foods.filter(n=>!SEMI_PREPARED.includes(n));
  const semiFoods=state.foods.filter(n=>SEMI_PREPARED.includes(n));
  const foodChips=arr=>arr.length?`<div class="home-grid">${arr.map(n=>`<button class="home-item fridge-food" data-food-remove="${n}">${FOOD[n]} ${n}<span class="delete-progress"></span></button>`).join('')}</div>`:'<div class="empty">还没有</div>';
  q('#root').innerHTML=`<h2>🧊 冰箱</h2><div class="card fridge-section"><div class="head"><b>食材</b><div class="fridge-actions"><small>${normalFoods.length} 种</small><button class="mini-add" data-manage="food">＋ 添加</button></div></div>${foodChips(normalFoods)}</div><div class="card fridge-section"><div class="head"><b>半成品</b><div class="fridge-actions"><small>${semiFoods.length} 种</small><button class="mini-add" data-manage="semi">＋ 添加</button></div></div>${foodChips(semiFoods)}</div><div class="card fridge-section"><div class="head"><b>调味料</b><button class="mini-add" data-manage="seasoning">＋ 添加</button></div><div class="home-grid">${SEASON.filter(n=>has('seasoning',n)).map(n=>`<button class="home-item" data-remove="seasoning|${n}">🧂 ${n}</button>`).join('')||'<div class="empty">还没有调味料</div>'}</div></div><div class="card fridge-section"><div class="head"><b>厨具</b><button class="mini-add" data-manage="tool">＋ 添加</button></div><div class="home-grid">${TOOLS.filter(n=>has('tool',n)).map(n=>`<button class="home-item" data-remove="tool|${n}">🍳 ${n}</button>`).join('')||'<div class="empty">还没有厨具</div>'}</div></div>`;
  qa('[data-food-remove]').forEach(b=>b.onclick=()=>armFoodDelete(b,b.dataset.foodRemove));
  qa('[data-remove]').forEach(b=>b.onclick=()=>{let[k,n]=b.dataset.remove.split('|');missing(k,n);render()});
  qa('[data-manage]').forEach(b=>b.onclick=()=>manageModal(b.dataset.manage));
};

manageModal=function(tab='food'){
  const kind=tab==='semi'?'food':tab;
  const names=tab==='food'?Object.keys(FOOD).filter(n=>!SEMI_PREPARED.includes(n)):tab==='semi'?SEMI_PREPARED:tab==='seasoning'?SEASON:TOOLS;
  const icon=n=>kind==='food'?FOOD[n]:kind==='seasoning'?'🧂':'🍳';
  q('#modal').innerHTML=`<div class="modal"><div class="sheet"><div class="sheet-handle"></div><div class="sheet-head"><div class="title"><b>厨房物品</b></div><button class="icon-close" id="x">×</button></div><div class="manage-tabs"><button data-tab="food" class="${tab==='food'?'on':''}">食材</button><button data-tab="semi" class="${tab==='semi'?'on':''}">半成品</button><button data-tab="seasoning" class="${tab==='seasoning'?'on':''}">调味料</button><button data-tab="tool" class="${tab==='tool'?'on':''}">厨具</button></div><div class="picker-grid">${names.map(n=>`<button class="pick ${has(kind,n)?'on':''}" data-pick="${kind}|${n}">${icon(n)} ${n}</button>`).join('')}</div><div class="sheet-footer"><button class="secondary" id="back" style="width:100%">返回冰箱</button></div></div></div>`;
  const back=()=>{close();render()};q('#x').onclick=back;q('#back').onclick=back;
  qa('[data-tab]').forEach(b=>b.onclick=()=>manageModal(b.dataset.tab));
  qa('[data-pick]').forEach(b=>b.onclick=()=>{let[k,n]=b.dataset.pick.split('|');has(k,n)?missing(k,n):have(k,n);manageModal(tab)});
};

render();
