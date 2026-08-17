// V0.2.2 practical quantities: replace vague amounts with usable references and shopping guidance.
state.version='0.2.2';

const AMBIGUOUS_AMOUNT_0202=/适量|少量|少许|按需|按口味|若干|酌量/;
function ambiguousAmount0202(v){return AMBIGUOUS_AMOUNT_0202.test(String(v||''))&&!/见步骤/.test(String(v||''));}
function waterLike0202(name){return /^(水|清水|热水|开水|凉水|温水|饮用水)$/.test(String(name||''));}
function targetServings0202(r,servings){
  if(Number.isFinite(servings)&&servings>0)return servings;
  if(typeof recommendedDishServings0200c==='function')return recommendedDishServings0200c(r);
  return Math.max(1,state.meal?.servings||2);
}
function roundReference0202(n){
  if(!Number.isFinite(n)||n<=0)return 0;
  if(n<1)return Math.max(.1,Math.round(n*10)/10);
  if(n<5)return Math.round(n*2)/2;
  if(n<20)return Math.round(n);
  if(n<100)return Math.round(n/5)*5;
  return Math.round(n/10)*10;
}
function ref0202(n,unit){return `参考约${cleanNumber0200(roundReference0202(n))}${unit}`;}
function ambiguityFactor0202(raw){
  const s=String(raw||'');
  if(/少量|少许/.test(s))return .5;
  if(/按口味|酌量/.test(s))return .75;
  return 1;
}
function seasoningReference0202(name,r,raw,target){
  const n=String(name||'');const level=ambiguityFactor0202(raw);
  const salty=(r?.season||[]).some(x=>String(x[0]||'')!==n&&/生抽|老抽|酱油|蚝油|豆瓣酱|豆豉|咸味|底料|调味酱/.test(String(x[0]||''))&&x[2]);
  let per=2,unit='g';
  if(/食用油|菜籽油|色拉油|花生油|玉米油/.test(n)){per=r?.cat==='汤炖'?3:8;unit='ml';}
  else if(/^盐$|食盐|精盐/.test(n)){per=salty?.6:.9;unit='g';}
  else if(/白糖|糖$|砂糖/.test(n)){per=2;unit='g';}
  else if(/生抽|酱油/.test(n)&&!/老抽/.test(n)){per=5;unit='ml';}
  else if(/老抽/.test(n)){per=1.5;unit='ml';}
  else if(/料酒|黄酒|花雕/.test(n)){per=5;unit='ml';}
  else if(/醋/.test(n)){per=4;unit='ml';}
  else if(/蚝油/.test(n)){per=5;unit='g';}
  else if(/淀粉|生粉/.test(n)){per=4;unit='g';}
  else if(/胡椒/.test(n)){per=.3;unit='g';}
  else if(/香油|芝麻油/.test(n)){per=1.5;unit='ml';}
  else if(/豆瓣酱/.test(n)){per=6;unit='g';}
  else if(/番茄酱/.test(n)){per=8;unit='g';}
  else if(/辣椒油|红油/.test(n)){per=3;unit='ml';}
  else if(/油$/.test(n)){per=2;unit='ml';}
  else if(/粉$|椒盐|孜然|五香|十三香|花椒|香料/.test(n)){per=.5;unit='g';}
  else if(/酱|膏|底料|调料|调味料|汁$|料$/.test(n)){per=8;unit='g';}
  return ref0202(per*Math.max(1,target)*level,unit);
}
function foodReference0202(name,r,raw,target){
  const n=String(name||'');const level=ambiguityFactor0202(raw);const t=Math.max(1,target);
  if(waterLike0202(n))return '按步骤加水';
  if(/鸡蛋|鸭蛋|鹅蛋|鹌鹑蛋/.test(n))return `${Math.max(1,Math.round(t*level))}个`;
  if(/葱|香菜|芫荽/.test(n))return ref0202(5*t*level,'g');
  if(/姜/.test(n))return ref0202(4*t*level,'g');
  if(/蒜/.test(n))return ref0202(4*t*level,'g');
  if(/辣椒|小米椒|尖椒/.test(n))return ref0202(6*t*level,'g');
  if(/鸡|猪|牛|羊|鸭|鹅|肉|排骨|鱼|虾|贝|肥肠|腊肉|培根/.test(n))return ref0202(80*t*level,'g');
  if(/豆腐|豆干|千张|腐竹/.test(n))return ref0202(90*t*level,'g');
  if(/大米|米饭/.test(n))return ref0202(70*t*level,'g');
  if(/面|粉|米线/.test(n))return ref0202(80*t*level,'g');
  if(/菜|番茄|土豆|瓜|豆|椒|笋|藕|菇|菌|萝卜|洋葱|芹|玉米|南瓜|山药/.test(n))return ref0202(90*t*level,'g');
  return ref0202(50*t*level,'g');
}

const scaleAmountV0202Base=scaleAmount0200;
function normalizeCount0202(s){
  const text=String(s||'');
  const m=text.match(/^(约)?(\d+(?:\.\d+)?)(个|片|张|包|瓶|块|盒)(.*)$/);
  if(!m)return text;
  const n=parseFloat(m[2]);if(!Number.isFinite(n)||Number.isInteger(n))return text;
  const rounded=Math.max(1,Math.round(n));
  return `${m[1]||''}${rounded}${m[3]}${m[4]||''}`;
}
scaleAmount0200=function(amount,r,servings){
  return normalizeCount0202(scaleAmountV0202Base(amount,r,servings));
};
function practicalAmount0202(kind,name,raw,r,servings){
  const s=String(raw??'').trim();if(!s)return '';
  if(/见步骤/.test(s))return s;
  const target=targetServings0202(r,servings);
  if(ambiguousAmount0202(s))return kind==='seasoning'?seasoningReference0202(name,r,s,target):foodReference0202(name,r,s,target);
  return scaleAmount0200(s,r,servings);
}

function parsedAmount0202(v){
  let s=String(v||'').trim();if(!s)return null;
  let reference=false,approx=false;
  if(s.startsWith('参考约')){reference=true;approx=true;s=s.slice(3)}
  else if(s.startsWith('参考')){reference=true;s=s.slice(2)}
  if(s.startsWith('约')){approx=true;s=s.slice(1)}
  let m=s.match(/^半(勺|汤匙|茶匙|杯|碗|个|颗|根|片|盒|包|瓶|张|把|块|份)$/);
  let n,unit;if(m){n=.5;unit=m[1]}else{m=s.match(/^(\d+(?:\.\d+)?)(g|kg|克|ml|mL|L|升|个|颗|根|片|勺|汤匙|茶匙|杯|碗|盒|包|瓶|张|把|块|份)$/);if(!m)return null;n=parseFloat(m[1]);unit=m[2]}
  let dim=unit,factor=1,outUnit=unit;
  if(unit==='kg'){dim='mass';factor=1000;outUnit='g'}else if(unit==='g'||unit==='克'){dim='mass';outUnit='g'}
  else if(unit==='L'||unit==='升'){dim='volume';factor=1000;outUnit='ml'}else if(unit==='ml'||unit==='mL'){dim='volume';outUnit='ml'}
  else if(unit==='勺'||unit==='汤匙'){dim='volume';factor=15;outUnit='ml'}else if(unit==='茶匙'){dim='volume';factor=5;outUnit='ml'}
  return {n:n*factor,unit:outUnit,dim,reference,approx};
}
const aggregateAmountsV0202Base=aggregateAmounts0200;
aggregateAmounts0200=function(amounts){
  const vals=amounts.filter(Boolean);if(!vals.length)return '';
  if(vals.length===1)return vals[0];
  const p=vals.map(parsedAmount0202);
  if(p.every(Boolean)&&new Set(p.map(x=>x.dim)).size===1){
    const sum=p.reduce((a,b)=>a+b.n,0);const unit=p[0].unit;
    const prefix=p.some(x=>x.reference)?'参考约':p.some(x=>x.approx)?'约':'';
    return `${prefix}${cleanNumber0200(roundReference0202(sum))}${unit}`;
  }
  return aggregateAmountsV0202Base(vals);
};

const hasV0202Base=has;
has=function(kind,name){if(kind==='food'&&waterLike0202(name))return true;return hasV0202Base(kind,name)};

const mealRequirementDataV0202Base=mealRequirementData0200;
mealRequirementData0200=function(){
  const d=mealRequirementDataV0202Base();
  for(const item of d.items){
    for(const use of item.uses){
      const r=recipeById0200(use.recipeId);if(!r)continue;
      const src=item.kind==='food'?(r.ings||[]).find(x=>x[0]===item.name):(r.season||[]).find(x=>x[0]===item.name&&x[2]);
      if(src)use.amount=practicalAmount0202(item.kind,item.name,src[1],r);
    }
    item.amount=aggregateAmounts0200(item.uses.map(x=>x.amount));
    item.owned=has(item.kind,item.name);item.shopping=inShop(item.kind,item.name);
  }
  d.missing=d.items.filter(x=>!x.owned&&!x.support);
  d.planned=d.items.filter(x=>!x.owned&&x.support);
  return d;
};

syncMealShopping0200=function(){
  const ids=new Set(mealRecipeIds0200());
  for(const item of state.shopping||[]){
    if(!Array.isArray(item.needs))continue;
    for(const n of item.needs){
      if(!ids.has(n.recipeId))continue;
      const r=recipeById0200(n.recipeId);if(!r)continue;
      const src=item.kind==='food'?(r.ings||[]).find(x=>x[0]===item.name):(r.season||[]).find(x=>x[0]===item.name&&x[2]);
      if(src)n.amount=practicalAmount0202(item.kind,item.name,src[1],r);
    }
  }
  save();
};

const mealPrepTasksV0202Base=mealPrepTasks0200;
mealPrepTasks0200=function(){
  const tasks=mealPrepTasksV0202Base();
  for(const task of tasks){
    const amounts=[];
    for(const use of task.uses||[]){
      const r=recipeById0200(use.recipeId);if(!r)continue;
      const src=(r.ings||[]).find(x=>x[0]===task.name&&(String(x[2]||'').trim()||'备好')===task.action);
      if(src)amounts.push(practicalAmount0202('food',task.name,src[1],r));
    }
    if(amounts.length)task.amount=aggregateAmounts0200(amounts);
  }
  return tasks;
};

function seasoningPack0202(name){
  const n=String(name||'');
  if(/食用油|菜籽油|色拉油|花生油|玉米油|生抽|老抽|酱油|料酒|黄酒|醋|香油|芝麻油|辣椒油/.test(n))return '1瓶';
  if(/盐|糖|淀粉|生粉|胡椒|孜然|五香|十三香|花椒|辣椒粉/.test(n))return '1小袋/盒';
  if(/酱|膏|底料|调料|调味料|汁$|料$/.test(n))return '1份成品';
  return '1份常规包装';
}
function foodPack0202(name,amount){
  const n=String(name||'');
  if(/葱|香菜|芫荽/.test(n))return '1小把';
  if(/姜/.test(n))return '1小块';
  if(/蒜/.test(n))return '1头';
  const p=parsedAmount0202(amount);if(!p)return '';
  if(['个','颗','根','片','盒','包','瓶','张','把','块','份'].includes(p.unit))return `${Math.max(1,Math.ceil(p.n))}${p.unit}`;
  if(p.dim==='mass'){
    const g=p.n;const buy=g<=100?Math.ceil(g/50)*50:g<=500?Math.ceil(g/100)*100:Math.ceil(g/250)*250;
    return `约${buy}g`;
  }
  return '';
}
shoppingNeedText=function(item){
  if(!Array.isArray(item.needs)||!item.needs.length)return item.kind==='food'?'食材':item.kind==='seasoning'?'调味料':'厨具';
  const amounts=item.needs.map(n=>n.amount).filter(Boolean);const total=aggregateAmounts0200(amounts);const uses=item.needs.length;
  if(item.kind==='seasoning')return `建议买${seasoningPack0202(item.name)}${total?` · 本餐预计用${total}`:''}${uses>1?` · 用于${uses}道/项`:''}`;
  if(item.kind==='food'){
    const pack=foodPack0202(item.name,total);
    if(pack&&total&&pack!==total)return `建议买${pack} · 本餐约用${total}${uses>1?` · 用于${uses}道/项`:''}`;
    return `${total?`本餐需要${total}`:'按菜谱采购'}${uses>1?` · 用于${uses}道/项`:''}`;
  }
  return '厨具';
};

const recipeModalV0202Base=recipeModal;
recipeModal=function(id){
  recipeModalV0202Base(id);const r=recipeById0200(id);if(!r)return;
  qa('[data-recipe-item]').forEach(b=>{
    const [kind,name]=b.dataset.recipeItem.split('|');
    const src=kind==='food'?(r.ings||[]).find(x=>x[0]===name):(r.season||[]).find(x=>x[0]===name);
    const amt=b.querySelector('.chip-amount');if(!src||!amt)return;
    const shown=practicalAmount0202(kind,name,src[1],r);amt.textContent=shown;
    amt.classList.toggle('amount-reference-0202',String(shown).startsWith('参考'));
  });
};

function stepMentions0202(name,step){
  const n=String(name||''),s=String(step||'');if(n&&s.includes(n))return true;
  if(/食用油|菜籽油|色拉油|花生油|玉米油/.test(n)&&/(加油|下油|放油|油热|锅热.{0,5}油)/.test(s))return true;
  if(/盐/.test(n)&&/(加盐|放盐|补盐|盐调味)/.test(s))return true;
  if(/^糖$|白糖|砂糖/.test(n)&&/(加糖|放糖|白糖|砂糖)/.test(s))return true;
  if(/醋/.test(n)&&/(加醋|放醋|淋醋|陈醋|香醋)/.test(s))return true;
  if(/淀粉|生粉/.test(n)&&/(淀粉|勾芡)/.test(s))return true;
  return false;
}
function stepAlreadyQuantified0202(name,step){
  const e=String(name||'').replace(/[.*+?^${}()|[\]\\]/g,'\\$&'),s=String(step||'');
  return new RegExp(`${e}.{0,8}\\d|\\d.{0,8}${e}`).test(s);
}
function stepAmounts0202(r,step){
  let rows=(r.season||[]).filter(x=>stepMentions0202(x[0],step)&&!stepAlreadyQuantified0202(x[0],step));
  if(!rows.length&&/(全部调味|所有调味|调味即可|进行调味)/.test(String(step||'')))rows=(r.season||[]).filter(x=>x[2]).slice(0,4);
  return rows.slice(0,4).map(x=>({name:x[0],amount:practicalAmount0202('seasoning',x[0],x[1],r)})).filter(x=>x.amount&&x.amount!=='见步骤');
}
const stoveV0202Base=stove;
stove=function(){
  stoveV0202Base();
  if(!state.cook||q('.step-amounts-0202'))return;
  const r=recipeById0200(state.cook.recipe);if(!r)return;const step=r.steps?.[state.cook.step||0]||'';
  const rows=stepAmounts0202(r,step);if(!rows.length)return;
  const box=document.createElement('div');box.className='step-amounts-0202';
  box.innerHTML=`<b>本步用量</b><div>${rows.map(x=>`<span>${x.name} · ${x.amount}</span>`).join('')}</div>`;
  const el=q('.step');if(el)el.insertAdjacentElement('afterend',box);
};

const renderMealPlanV0202Base=renderMealPlan0200;
renderMealPlan0200=function(){
  renderMealPlanV0202Base();
  const note=q('.meal-scale-note');if(note)note.textContent='人数会自动换算用量；原菜谱写“适量”的项目会给出参考量，购物袋按实际购买单位提示。';
};

syncMealShopping0200();
save();render();
