// V0.2.1 contextual tips: standard recipe stays authoritative; tips are optional guidance.
state.version='0.2.1';

function esc0210(s){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function recipeText0210(r){return [r?.name,r?.desc,...(r?.tags||[]),...(r?.ings||[]).flat(),...(r?.season||[]).flat(),...(r?.steps||[])].join(' ');}
function ingredientNames0210(r){return (r?.ings||[]).map(x=>String(x[0]||''));}
function seasonRows0210(r){return (r?.season||[]).map(x=>({name:String(x[0]||''),amount:String(x[1]||''),required:!!x[2]}));}
function firstVeg0210(r){
  const veg=/番茄|土豆|包菜|白菜|青菜|菠菜|西兰花|蘑菇|金针菇|青椒|洋葱|胡萝卜|黄瓜|茄子|芹菜|豆芽|玉米|南瓜|红薯|莲藕|冬瓜|丝瓜|莴笋|娃娃菜|油麦菜|生菜|韭菜|菜心|芦笋|山药|豆角|豇豆|菌菇|木耳/;
  return ingredientNames0210(r).find(n=>veg.test(n))||'';
}
function mealContext0210(r){
  const ids=state.meal?.dishes||[];const list=ids.map(recipeById0200).filter(Boolean);
  const meat=list.filter(x=>x.cat==='肉菜').length;
  return {count:list.length,meat,isCurrent:list.some(x=>x.id===r?.id)};
}
function tip0210(kind,label,text,priority){return {kind,label,text,priority};}
function dedupeTips0210(list){
  const seen=new Set();return list.filter(x=>{const k=x.text;if(!k||seen.has(k))return false;seen.add(k);return true}).sort((a,b)=>a.priority-b.priority).slice(0,3);
}

function recipeTips0210(r){
  if(!r||!Array.isArray(r.steps)||!r.steps.length)return [];
  const text=recipeText0210(r);const names=ingredientNames0210(r);const season=seasonRows0210(r);const tips=[];
  const veg=firstVeg0210(r);const meal=mealContext0210(r);

  // One high-value technique reminder when the recipe has a common failure point.
  if(names.some(n=>/虾仁|虾滑|鲜虾|河虾|海虾/.test(n))||(/虾/.test(r.name)&&/炒|煎|滑/.test(text)))
    tips.push(tip0210('key','关键提醒','虾类刚熟、颜色完全变化后就尽快进入下一步，继续久炒容易变老。',10));
  else if(names.includes('鸡蛋')&&/炒|滑|凝固|盛出/.test(text))
    tips.push(tip0210('key','关键提醒','炒鸡蛋时刚凝固就可以先盛出，最后回锅利用余温熟透，口感会更嫩。',10));
  else if(names.some(n=>/包菜|白菜|青菜|菠菜|油麦菜|生菜|菜心/.test(n))&&/炒|翻炒/.test(text))
    tips.push(tip0210('key','关键提醒','叶菜洗好后尽量沥干再下热锅，能减少出水；断生后就可以出锅。',10));
  else if(names.some(n=>/土豆/.test(n))&&(r.ings||[]).some(x=>/切丝|洗去.*淀粉|冲洗.*淀粉/.test(String(x[2]||''))))
    tips.push(tip0210('key','关键提醒','土豆丝切好后冲掉表面淀粉并沥干，炒出来会更清爽、脆一些。',10));
  else if(names.some(n=>/豆腐/.test(n))&&/煎|翻|烧/.test(text))
    tips.push(tip0210('key','关键提醒','豆腐下锅后先让接触锅的一面定型，再轻轻翻动，更不容易碎。',10));
  else if(/勾芡|水淀粉/.test(text))
    tips.push(tip0210('key','关键提醒','淀粉水静置后会沉底，下锅前重新搅匀，再边倒边观察浓稠度。',10));

  // Meal-aware guidance: explain what to do, without adding a new setting.
  if(meal.isCurrent&&meal.count>=4){
    if(r.cat==='肉菜'&&meal.meat>=2&&veg)
      tips.push(tip0210('meal','这一桌','本餐荤菜已经比较多，这道按系统建议量做即可；想清爽一点，可以把'+veg+'稍微多放些。',20));
    else
      tips.push(tip0210('meal','这一桌','本餐菜品比较丰富，这道不用刻意做到每个人一整份，按本餐建议量做一盘共享即可。',22));
  }

  // Taste / health choices: optional by design, never rewrite the source recipe.
  const chili=season.find(x=>/辣椒|干红椒|小米椒|辣椒粉|辣椒油|辣酱/.test(x.name))||names.find(n=>/辣椒|小米椒|尖椒|干红椒/.test(n));
  if(chili)
    tips.push(tip0210('taste','口味可调','喜欢更辣可以优先增加辣椒类用量，不建议只靠多加复合酱料来增辣，避免同时变咸。',30));
  const optionalVinegar=season.find(x=>/醋/.test(x.name)&&!x.required);
  if(optionalVinegar)
    tips.push(tip0210('taste','口味可调','喜欢酸香可以在接近出锅时少量补醋，先少加、尝味后再决定。',31));
  const optionalSugar=season.find(x=>/糖/.test(x.name)&&!x.required);
  if(optionalSugar)
    tips.push(tip0210('health','想清爽些','糖是可选项时可以少放或不放，先尝食材本身的味道再决定。',32));
  if(veg&&r.cat==='肉菜')
    tips.push(tip0210('health','想蔬菜多些','可以把'+veg+'适量增加一些；配菜变多后，盐和酱汁最好最后尝味再补。',34));
  else if(season.some(x=>x.name==='食用油')&&/炒|煎/.test(text))
    tips.push(tip0210('health','想清爽些','食用油可以先从较少的量开始，不够再补；保持锅热比一次倒很多油更重要。',36));

  return dedupeTips0210(tips);
}

function tipRowsHtml0210(tips,scope='recipe'){
  if(!tips.length)return '';
  return tips.map((t,i)=>`<div class="kitchen-tip-row-0210 ${esc0210(t.kind)} ${i>=2?'tip-extra-0210':''}" data-tip-kind="${esc0210(t.kind)}"><span class="tip-dot-0210">${t.kind==='key'?'!':t.kind==='meal'?'🍽':'💡'}</span><div><b>${esc0210(t.label)}</b><p>${esc0210(t.text)}</p></div></div>`).join('');
}
function buildTipBox0210(tips,scope='recipe'){
  if(!tips.length)return null;
  const box=document.createElement('section');box.className=`kitchen-tips-0210 ${scope}`;box.dataset.tipScope=scope;
  box.innerHTML=`<div class="tips-head-0210"><b>💡 做得更顺手</b><small>标准菜谱不变，按需要参考</small></div><div class="tips-list-0210">${tipRowsHtml0210(tips,scope)}</div>${tips.length>2?'<button class="tips-more-0210" type="button">更多技巧（1）</button>':''}`;
  const more=box.querySelector('.tips-more-0210');if(more)more.onclick=()=>{const open=box.classList.toggle('tips-open-0210');more.textContent=open?'收起技巧':'更多技巧（1）'};
  return box;
}
function injectRecipeTips0210(r){
  if(q('[data-tip-scope="recipe"]'))return;
  const box=buildTipBox0210(recipeTips0210(r),'recipe');if(!box)return;
  const status=q('.recipe-status-line');const footer=q('.sheet-footer');
  if(status)status.insertAdjacentElement('beforebegin',box);else if(footer)footer.insertAdjacentElement('beforebegin',box);
}

const recipeModalV0210Base=recipeModal;
recipeModal=function(id){recipeModalV0210Base(id);const r=recipeById0200(id);if(r)injectRecipeTips0210(r);};

function prepTips0210(){
  const tasks=mealPrepTasks0200();const names=tasks.map(t=>t.name);const tips=[];
  const hasRaw=names.some(n=>/鸡|猪|牛|羊|鸭|鹅|鱼|虾|肉|排骨|肥肠/.test(n));
  const hasProduce=names.some(n=>/菜|番茄|土豆|瓜|豆|椒|葱|姜|蒜|藕|菇|笋|芹|萝卜|玉米|山药/.test(n));
  if(hasRaw&&hasProduce)tips.push(tip0210('key','处理顺序','生肉和蔬菜尽量分开处理；处理生肉后清洁刀、砧板和双手，再继续处理其他食材。',10));
  if((state.meal?.dishes||[]).length>=4)tips.push(tip0210('meal','菜多时','可以先完成耐放的切配；绿叶菜和容易出水的食材尽量靠近开火前再处理。',20));
  if(mealSupport0200().length)tips.push(tip0210('meal','提前制作','需要自己做的调味料或半成品会优先进入灶台顺序，这里把它们的原料备好即可。',25));
  return dedupeTips0210(tips).slice(0,2);
}
function injectPrepTips0210(){
  if(q('[data-tip-scope="prep"]'))return;
  const tips=prepTips0210();if(!tips.length)return;const box=buildTipBox0210(tips,'prep');
  const list=q('.meal-prep-list');if(list)list.insertAdjacentElement('beforebegin',box);
}
const renderMealPrepV0210Base=renderMealPrep0200;
renderMealPrep0200=function(){renderMealPrepV0210Base();injectPrepTips0210();};

function stepTip0210(r,stepIndex){
  const step=String(r?.steps?.[stepIndex]||'');if(!step)return '';
  if(/加盐|加入盐|生抽|酱油|调味|调入/.test(step))return '调味先少量加入，翻匀后尝味，再决定要不要补；比一次加足更容易控制。';
  if(/收汁|大火收/.test(step))return '收汁阶段水分下降很快，尽量别离锅；接近理想浓度时就可以准备关火。';
  if(/鸡蛋/.test(step)&&/炒|凝固|滑|盛出/.test(step))return '鸡蛋刚凝固即可进入下一步，余温还会继续加热，别等到完全变干。';
  if(/虾|鱼片|海鲜/.test(step)&&/炒|煎|煮|滑/.test(step))return '这类食材熟得快，达到菜谱要求的熟度后及时进入下一步，避免继续久加热。';
  if(/包菜|青菜|菠菜|油麦菜|生菜|菜心/.test(step)&&/炒|翻/.test(step))return '保持锅热并快速翻炒，叶菜断生即可，久炒容易大量出水。';
  if(/勾芡|水淀粉|淀粉水/.test(step))return '淀粉水下锅前重新搅匀，少量分次加入更容易控制浓稠度。';
  if(/煎/.test(step))return '先让接触锅的一面定型再翻，不要频繁翻动，通常更不容易粘锅或破碎。';
  if(/炖|焖/.test(step)&&/小火|中小火/.test(step))return '保持稳定的小火即可，不必频繁开盖；中途只需确认没有干锅。';
  return '';
}
function injectStepTip0210(){
  if(!state.cook||q('.kitchen-step-tip-0210'))return;const r=recipeById0200(state.cook.recipe);if(!r)return;
  const text=stepTip0210(r,state.cook.step||0);if(!text)return;
  const box=document.createElement('div');box.className='kitchen-step-tip-0210';box.innerHTML=`<span>💡</span><div><b>这一步注意</b><p>${esc0210(text)}</p></div>`;
  const pre=q('.preflight');const progress=q('.meal-cook-progress');
  if(pre)pre.insertAdjacentElement('afterend',box);else if(progress)progress.insertAdjacentElement('afterend',box);else q('#root')?.appendChild(box);
}
const stoveV0210Base=stove;
stove=function(){stoveV0210Base();injectStepTip0210();};

save();render();
