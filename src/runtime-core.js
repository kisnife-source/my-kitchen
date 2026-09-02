/* My Kitchen runtime core.
 * Consolidated from the original bootstrap patch chain.
 * Keep hoc-recipes.generated.js loaded after this file.
 */

/* ===== app.js ===== */
const FOOD={鸡腿肉:'🍗',鸡胸肉:'🍗',猪肉:'🥩',牛肉:'🥩',虾仁:'🦐',鱼片:'🐟',香肠:'🌭',培根:'🥓',鸡蛋:'🥚',豆腐:'⬜',番茄:'🍅',土豆:'🥔',包菜:'🥬',白菜:'🥬',青菜:'🥬',菠菜:'🥬',西兰花:'🥦',蘑菇:'🍄',金针菇:'🍄',青椒:'🫑',洋葱:'🧅',胡萝卜:'🥕',黄瓜:'🥒',茄子:'🍆',芹菜:'🥬',豆芽:'🌱',玉米:'🌽',南瓜:'🎃',红薯:'🍠',葱:'🌿',姜:'🫚',蒜:'🧄',大米:'🍚',挂面:'🍜',水饺:'🥟',包子:'🥟',手抓饼:'🫓',面包:'🍞',牛奶:'🥛'};
const SEASON=['食用油','盐','糖','生抽','老抽','料酒','醋','蚝油','淀粉','胡椒','香油','豆瓣酱','番茄酱'];
const TOOLS=['炒锅','平底锅','汤锅','电饭煲','蒸锅','微波炉','空气炸锅','烤箱'];
const R=(id,name,icon,cat,tags,mins,desc,ings,season,tools,steps)=>({id,name,icon,cat,tags,mins,desc,ings,season,tools,steps});
const recipes=[
R('r1','土豆烧鸡','🍲','肉菜',['下饭','一锅'],30,'鸡肉和土豆一起焖，适合配米饭',[['鸡腿肉','300g','切约3cm小块'],['土豆','2个','去皮切滚刀块']],[['食用油','适量',1],['生抽','1.5勺',1],['盐','适量',1],['老抽','半勺',0]],[['炒锅','平底锅']],['锅热加油，下鸡腿肉炒至变色。','加入土豆翻炒1分钟，加入生抽。','加清水至食材一半高度，大火煮开。','转中小火焖至土豆软糯、鸡肉熟透。','开盖收汁，补盐即可。']),
R('r2','包菜炒鸡','🥘','肉菜',['快手','下饭'],15,'鸡肉配包菜，简单快速',[['鸡腿肉','200g','切薄片或小块'],['包菜','半颗','撕小片并沥干']],[['食用油','适量',1],['生抽','1勺',1],['盐','适量',1],['蚝油','半勺',0]],[['炒锅','平底锅']],['锅热加油，下鸡肉炒至变色。','加入包菜大火翻炒。','加生抽和盐。','包菜断生后出锅。']),
R('r3','小鸡炖蘑菇','🍲','汤炖',['暖胃','一锅'],40,'鸡肉和蘑菇慢炖，汤汁浓郁',[['鸡腿肉','300g','切块'],['蘑菇','200g','洗净，大的切半']],[['食用油','少量',1],['盐','适量',1],['生抽','1勺',1],['料酒','1勺',0]],[['汤锅','炒锅']],['少量油把鸡肉炒至微黄。','加入蘑菇炒软。','加入生抽和热水煮开。','小火炖约25分钟。','最后加盐。']),
R('r4','番茄炒蛋','🍳','蛋类',['快手','家常'],10,'酸甜鲜香的家常经典',[['番茄','2个','切块'],['鸡蛋','3个','打散']],[['食用油','适量',1],['盐','适量',1],['糖','少量',0]],[['炒锅','平底锅']],['鸡蛋炒至刚凝固后盛出。','番茄下锅炒软出汁。','加盐，可加少量糖。','倒回鸡蛋翻匀。']),
R('r5','手撕包菜','🥬','素菜',['快手','省事'],8,'脆爽下饭，食材很简单',[['包菜','半颗','撕小片并沥干']],[['食用油','适量',1],['盐','适量',1],['生抽','半勺',0],['醋','少量',0]],[['炒锅','平底锅']],['锅烧热后加油。','放入包菜快速翻炒。','加盐，可加少量生抽。','断生即可。']),
R('r6','清炒土豆丝','🥔','素菜',['快手','家常'],12,'清爽脆口的基础家常菜',[['土豆','2个','切细丝并洗去表面淀粉']],[['食用油','适量',1],['盐','适量',1],['醋','少量',0]],[['炒锅','平底锅']],['锅热加油，下土豆丝。','大火翻炒约2分钟。','加盐继续翻炒。','喜欢酸味可淋醋。']),
R('r7','青椒炒肉','🫑','肉菜',['下饭','快手'],15,'青椒与猪肉的经典搭配',[['猪肉','200g','切薄片'],['青椒','2个','去籽切块或丝']],[['食用油','适量',1],['生抽','1勺',1],['盐','适量',1],['淀粉','少量',0]],[['炒锅','平底锅']],['猪肉炒至变色。','加入青椒大火翻炒。','加入生抽和盐。','青椒断生后出锅。']),
R('r8','青菜面','🍜','主食',['省事','一人食'],12,'一锅就能解决的一顿饭',[['挂面','1人份','按食量取出'],['青菜','1把','洗净']],[['盐','适量',1],['生抽','半勺',0],['胡椒','少量',0]],[['汤锅']],['水烧开，下挂面。','面条接近熟时加入青菜。','加盐调味。','煮好后盛出。']),
R('r9','煮水饺','🥟','速食',['省事','速食'],10,'冷冻水饺也可以直接解决一顿饭',[['水饺','1人份','无需提前解冻']],[],[['汤锅']],['足量水烧开。','下水饺并轻推避免粘底。','再次沸腾后按包装时间煮熟。','捞出即可。']),
R('r10','鸡蛋炒饭','🍚','主食',['快手','清库存'],12,'剩米饭的高效吃法',[['大米','1碗熟米饭','最好冷藏过'],['鸡蛋','2个','打散'],['葱','少量','切葱花']],[['食用油','适量',1],['盐','适量',1],['生抽','少量',0]],[['炒锅','平底锅']],['先炒鸡蛋。','加入米饭炒散。','加盐，可加生抽。','撒葱花翻匀。']),
R('r11','洋葱炒蛋','🧅','蛋类',['快手','家常'],10,'洋葱甜香配鸡蛋',[['洋葱','1个','切丝'],['鸡蛋','3个','打散']],[['食用油','适量',1],['盐','适量',1]],[['炒锅','平底锅']],['鸡蛋炒至半熟盛出。','洋葱炒软。','倒回鸡蛋。','加盐翻匀。']),
R('r12','西兰花炒虾仁','🥦','肉菜',['清淡','快手'],15,'清爽高蛋白搭配',[['西兰花','半颗','切小朵'],['虾仁','200g','擦干水分']],[['食用油','适量',1],['盐','适量',1],['料酒','少量',0]],[['炒锅','平底锅']],['西兰花焯水后沥干。','虾仁炒至变色。','加入西兰花翻炒。','加盐出锅。']),
R('r13','红烧豆腐','⬜','素菜',['下饭','省钱'],18,'豆腐软嫩，酱汁下饭',[['豆腐','1盒','切块'],['葱','少量','切葱花']],[['食用油','适量',1],['生抽','1勺',1],['盐','少量',1],['淀粉','少量',0]],[['炒锅','平底锅']],['豆腐煎至微黄。','加生抽和少量清水。','小火焖5分钟。','撒葱花出锅。']),
R('r14','黄瓜炒蛋','🥒','蛋类',['快手','清淡'],10,'黄瓜清脆，鸡蛋柔软',[['黄瓜','1根','切片'],['鸡蛋','3个','打散']],[['食用油','适量',1],['盐','适量',1]],[['炒锅','平底锅']],['鸡蛋炒熟盛出。','黄瓜快速翻炒。','倒回鸡蛋。','加盐翻匀。']),
R('r15','番茄牛肉汤','🥣','汤炖',['暖胃','一锅'],25,'番茄酸香，牛肉鲜嫩',[['牛肉','200g','切薄片'],['番茄','2个','切块'],['姜','2片','切片']],[['盐','适量',1],['胡椒','少量',0]],[['汤锅']],['番茄煮软出汁。','加入热水和姜片。','下牛肉片煮熟。','加盐调味。']),
R('r16','南瓜粥','🎃','主食',['清淡','早餐'],35,'南瓜甜糯，适合早餐或晚餐',[['南瓜','200g','切小块'],['大米','半杯','淘洗']],[],[['汤锅','电饭煲']],['大米和南瓜一起加水。','煮开后转小火。','煮至米粒开花、南瓜软烂。','按喜好调稠度。']),
R('r17','蒸包子','🥟','速食',['早餐','省事'],12,'冷冻包子直接蒸热即可',[['包子','2个','冷冻可直接蒸']],[],[['蒸锅','电饭煲']],['锅中加水。','放入包子。','水开后蒸约8至10分钟。','关火焖1分钟。']),
R('r18','煎手抓饼','🫓','速食',['早餐','快手'],8,'无需解冻，直接煎到酥脆',[['手抓饼','1张','无需解冻']],[['食用油','少量',0]],[['平底锅']],['平底锅预热。','放入手抓饼。','中小火两面煎金黄。','出锅即可。']),
R('r19','芹菜炒肉','🥬','肉菜',['家常','下饭'],15,'芹菜爽脆，猪肉鲜香',[['猪肉','200g','切丝'],['芹菜','2根','切段']],[['食用油','适量',1],['生抽','1勺',1],['盐','适量',1]],[['炒锅','平底锅']],['猪肉炒至变色。','加入芹菜翻炒。','加生抽和盐。','芹菜断生即可。']),
R('r20','蒜蓉青菜','🥬','素菜',['快手','清淡'],6,'最快解决一把青菜',[['青菜','1把','洗净沥干'],['蒜','2瓣','切末']],[['食用油','适量',1],['盐','适量',1]],[['炒锅','平底锅']],['蒜末炒香。','下青菜大火翻炒。','加盐。','断生立即出锅。']),
R('r21','培根鸡蛋卷饼','🥓','主食',['早餐','快手'],10,'手抓饼加培根鸡蛋就能成一餐',[['手抓饼','1张','无需解冻'],['培根','2片','直接使用'],['鸡蛋','1个','打散或整颗']],[['番茄酱','适量',0]],[['平底锅']],['培根先煎至微卷。','手抓饼煎至一面金黄。','加入鸡蛋并翻面。','放培根卷起。']),
R('r22','金针菇豆腐汤','🍄','汤炖',['省钱','清淡'],15,'金针菇和豆腐的轻汤',[['金针菇','1把','去根洗净'],['豆腐','半盒','切块']],[['盐','适量',1],['胡椒','少量',0],['香油','少量',0]],[['汤锅']],['水烧开后下豆腐。','加入金针菇。','煮约5分钟。','加盐即可。'])
];
/* Curated data is loaded before this runtime so it participates in migration. */
(function mergeCuratedKitchenData(){
  const catalog=window.MK_EXTRA_CATALOG||{};
  Object.assign(FOOD,catalog.foods||{});
  for(const n of catalog.seasonings||[])if(!SEASON.includes(n))SEASON.push(n);
  for(const n of catalog.tools||[])if(!TOOLS.includes(n))TOOLS.push(n);
  for(const r of window.MK_EXTRA_RECIPES||[]){
    if(!r?.id||!r?.name)continue;
    if(!recipes.some(x=>x.id===r.id))recipes.push(r);
  }
})();

const defaults={seasonings:{食用油:1,盐:1,糖:1,生抽:1,老抽:0,料酒:0,醋:1,蚝油:1,淀粉:1,胡椒:0,香油:0,豆瓣酱:0,番茄酱:0},cookware:{炒锅:1,平底锅:1,汤锅:1,电饭煲:1,蒸锅:0,微波炉:1,空气炸锅:0,烤箱:0}};
const clone=x=>JSON.parse(JSON.stringify(x)),uniq=a=>[...new Set(a)],q=s=>document.querySelector(s),qa=s=>[...document.querySelectorAll(s)];
function migrate(raw){let o=raw||{},foods=Array.isArray(o.foods)?o.foods:Array.isArray(o.inv)?o.inv.filter(x=>FOOD[x.name]).map(x=>x.name):[];let s={version:'0.1.5',scene:['fridge','board','stove'].includes(o.scene)?o.scene:'board',foods:uniq(foods.filter(x=>FOOD[x])),set:clone(defaults),shopping:Array.isArray(o.shopping)?o.shopping:[],recipe:recipes.some(r=>r.id===o.recipe)?o.recipe:null,prep:null,cook:o.cook&&recipes.some(r=>r.id===o.cook.recipe)?o.cook:null,filter:o.filter||'全部',query:o.query||'',viewMode:o.viewMode==='list'?'list':'cards'};if(o.set){s.set.seasonings={...s.set.seasonings,...(o.set.seasonings||{})};s.set.cookware={...s.set.cookware,...(o.set.cookware||{})}}return s}
let state=migrate(JSON.parse(localStorage.getItem('mk01')||'null'));
function save(){localStorage.setItem('mk01',JSON.stringify(state));let e=q('#shopCount');if(e)e.textContent=state.shopping.length}function close(){q('#modal').innerHTML=''}function toast(t){q('#toast').innerHTML='<div class="toast">'+t+'</div>';setTimeout(()=>q('#toast').innerHTML='',1800)}
const key=(k,n)=>k+':'+n;function inShop(k,n){return state.shopping.some(x=>key(x.kind,x.name)===key(k,n))}function addShop(k,n){if(!inShop(k,n))state.shopping.push({kind:k,name:n})}function rmShop(k,n){state.shopping=state.shopping.filter(x=>key(x.kind,x.name)!==key(k,n))}
function has(k,n){return k==='food'?state.foods.includes(n):k==='seasoning'?!!state.set.seasonings[n]:!!state.set.cookware[n]}function have(k,n){rmShop(k,n);if(k==='food')state.foods=uniq([...state.foods,n]);if(k==='seasoning')state.set.seasonings[n]=1;if(k==='tool')state.set.cookware[n]=1;save()}function missing(k,n){if(k==='food')state.foods=state.foods.filter(x=>x!==n);if(k==='seasoning')state.set.seasonings[n]=0;if(k==='tool')state.set.cookware[n]=0;save()}
const required=r=>[...r.ings.map(x=>['food',x[0],x[1]]),...r.season.filter(x=>x[2]).map(x=>['seasoning',x[0],x[1]])],miss=r=>required(r).filter(x=>!has(x[0],x[1])),toolOK=r=>r.tools.every(g=>g.some(n=>has('tool',n)));
function rs(r){let a=required(r),m=miss(r);return{have:a.length-m.length,total:a.length,missing:m.length,tool:toolOK(r),ready:m.length===0&&toolOK(r)}}function status(r){let s=rs(r),shopping=miss(r).filter(x=>inShop(x[0],x[1])).length;return s.ready?'<span class="tag good">可以准备</span>':shopping?`<span class="tag bad">待买 ${shopping}</span>`:`<span class="tag warn">缺 ${s.missing+(s.tool?0:1)} 项</span>`}
function go(scene){state.scene=scene;state.prep=null;save();render()}function render(){qa('.nav button').forEach(b=>b.classList.toggle('on',b.dataset.s===state.scene));q('#sub').textContent=state.scene==='board'?(state.prep?'准备食材':'做什么'):state.scene==='fridge'?'有什么':'怎么做';state.scene==='board'?board():state.scene==='fridge'?fridge():stove()}
function board(){if(state.prep)return prepView();let cats=['全部','肉菜','素菜','蛋类','主食','汤炖','速食'],list=recipes.filter(r=>(state.filter==='全部'||r.cat===state.filter)&&(!state.query||r.name.includes(state.query)||r.ings.some(x=>x[0].includes(state.query))||r.tags.some(x=>x.includes(state.query))));let body=state.viewMode==='list'?`<div class="recipe-list">${list.map(r=>`<button class="recipe-row" data-r="${r.id}"><div class="icon">${r.icon}</div><div><h3>${r.name}</h3><p>${r.desc}</p></div><div class="row-meta"><span class="tag">${r.mins}分钟</span>${status(r)}</div></button>`).join('')}</div>`:`<div class="recipe-grid">${list.map(r=>`<button class="recipe-card" data-r="${r.id}"><div class="icon">${r.icon}</div><h3>${r.name}</h3><p>${r.desc}</p><div class="meta"><span class="tag">约${r.mins}分钟</span><span class="tag">${r.cat}</span>${status(r)}</div></button>`).join('')}</div>`;q('#root').innerHTML=`<h2>🔪 菜板</h2><div class="board-tools"><div class="search-row"><input id="search" class="search" placeholder="搜索菜名或食材" value="${state.query}"><div class="view-switch"><button data-view="cards" class="${state.viewMode==='cards'?'on':''}">▦</button><button data-view="list" class="${state.viewMode==='list'?'on':''}">☰</button></div></div><div class="filters">${cats.map(c=>`<button class="filter ${state.filter===c?'on':''}" data-cat="${c}">${c}</button>`).join('')}</div></div>${body||'<div class="empty">没有找到菜谱</div>'}`;q('#search').oninput=e=>{state.query=e.target.value.trim();save();board()};qa('[data-view]').forEach(b=>b.onclick=()=>{state.viewMode=b.dataset.view;save();board()});qa('[data-cat]').forEach(b=>b.onclick=()=>{state.filter=b.dataset.cat;save();board()});qa('[data-r]').forEach(b=>b.onclick=()=>recipeModal(b.dataset.r))}
function needRow(k,n,amt,opt=0){let h=has(k,n),shop=inShop(k,n),icon=k==='food'?(FOOD[n]||'🥣'):'🧂';return`<div class="need ${h?'state-have':shop?'state-shop':''}"><div class="need-icon">${icon}</div><div class="need-info"><strong>${n}${opt?'<span class="optional">可省</span>':''}</strong><small>${amt}</small></div><button class="have-toggle ${h?'on':shop?'shop':''}" data-have="${k}|${n}">${h?'✓ 有':shop?'购物袋':'标为有'}</button></div>`}
function recipeModal(id){let r=recipes.find(x=>x.id===id);if(!r)return;state.recipe=id;save();let s=rs(r),m=miss(r),bad=r.tools.filter(g=>!g.some(n=>has('tool',n))),optional=r.season.filter(x=>!x[2]).length,shopN=m.filter(x=>inShop(x[0],x[1])).length;q('#modal').innerHTML=`<div class="modal"><div class="sheet"><div class="sheet-handle"></div><div class="sheet-head"><div class="title"><b>${r.icon} ${r.name}</b><small>${r.desc} · 约${r.mins}分钟</small></div><button class="icon-close" id="x">×</button></div><div class="recipe-summary"><div class="summary-cell"><b>${s.have}/${s.total}</b><small>必需项已有</small></div><div class="summary-cell"><b>${shopN}</b><small>已在购物袋</small></div><div class="summary-cell"><b>${s.tool?'✓':'—'}</b><small>厨具</small></div></div><div class="section-title">食材 <span class="count">${r.ings.length}项</span></div><div class="need-list">${r.ings.map(x=>needRow('food',x[0],x[1])).join('')}</div><div class="section-title">调味 <span class="count">必需${r.season.filter(x=>x[2]).length}${optional?' · 可省'+optional:''}</span></div><div class="need-list">${r.season.length?r.season.map(x=>needRow('seasoning',x[0],x[1],!x[2])).join(''):'<div class="muted">不需要额外调味料</div>'}</div><div class="section-title">厨具</div>${r.tools.map(g=>{let active=g.find(n=>has('tool',n));return`<div class="tool-need"><div class="tool-head"><div class="need-icon">🍳</div><div><strong>${g.join(' / ')}</strong><small>任选一种即可</small></div><span class="tool-status ${active?'have':''}">${active?'已有 '+active:'还没确认'}</span></div><div class="tool-options">${g.map(n=>`<button class="toolbtn ${has('tool',n)?'on':''}" data-tool="${n}">${has('tool',n)?'✓ ':''}${n}</button>`).join('')}</div></div>`}).join('')}${bad.length?`<div class="blocker">缺厨具：${bad.map(g=>g.join(' / ')+'（任选一种）').join('；')}</div>`:m.length?`<div class="blocker">还缺 ${m.length} 项，可以一次加入购物袋。</div>`:'<div class="ready">✓ 条件齐全，可以开始准备。</div>'}<div class="sheet-footer"><div class="dual"><button class="secondary" id="back">返回菜谱</button><button class="primary" id="act">${m.length?'缺的加入购物袋（'+m.length+'）':bad.length?'先确认厨具':'开始准备'}</button></div></div></div></div>`;q('#x').onclick=close;q('#back').onclick=close;qa('[data-have]').forEach(b=>b.onclick=()=>{let[k,n]=b.dataset.have.split('|');has(k,n)?missing(k,n):have(k,n);recipeModal(id)});qa('[data-tool]').forEach(b=>b.onclick=()=>{let n=b.dataset.tool;has('tool',n)?missing('tool',n):have('tool',n);recipeModal(id)});q('#act').onclick=()=>{let mm=miss(r);if(mm.length){mm.forEach(x=>addShop(x[0],x[1]));save();return shoppingModal(id)}if(!toolOK(r))return toast('请先确认一种可用厨具');state.prep={recipe:id,checked:{}};save();close();render()}}
function prepView(){let r=recipes.find(x=>x.id===state.prep.recipe),done=Object.values(state.prep.checked).filter(Boolean).length;q('#root').innerHTML=`<h2>🔪 准备 · ${r.name}</h2><div class="card"><div class="head"><b>食材准备</b><small>${done}/${r.ings.length}</small></div><div class="prep-list">${r.ings.map(x=>{let ck=!!state.prep.checked[x[0]];return`<div class="prep ${ck?'done':''}"><button class="prep-check" data-p="${x[0]}">${ck?'✓':'○'}</button><div><strong>${FOOD[x[0]]||'🥣'} ${x[0]} · ${x[1]}</strong><small>${x[2]}</small></div></div>`}).join('')}</div><div class="section-title">调味</div><div class="meta">${r.season.map(x=>`<span class="tag ${x[2]?'good':''}">${x[0]} · ${x[1]}${x[2]?'':' · 可省'}</span>`).join('')}</div><div class="dual" style="margin-top:13px"><button class="secondary" id="reselect">重新选菜</button><button class="primary" id="cook">去灶台</button></div></div>`;qa('[data-p]').forEach(b=>b.onclick=()=>{state.prep.checked[b.dataset.p]=!state.prep.checked[b.dataset.p];save();render()});q('#reselect').onclick=()=>{state.prep=null;save();render()};q('#cook').onclick=()=>{if(!rs(r).ready){state.prep=null;save();return recipeModal(r.id)}state.cook={recipe:r.id,step:0};state.prep=null;save();go('stove')}}
function stove(){if(!state.cook){q('#root').innerHTML='<h2>🍳 灶台</h2><div class="card empty">还没有要做的菜。<br><button class="primary" style="margin-top:12px" onclick="go(\'board\')">去菜板选菜</button></div>';return}let r=recipes.find(x=>x.id===state.cook.recipe),i=state.cook.step;q('#root').innerHTML=`<h2>🍳 ${r.name}</h2><div class="preflight">✓ 食材、调味和厨具已确认。</div><div class="card cook"><div class="head"><b>步骤 ${i+1}/${r.steps.length}</b><small>约${r.mins}分钟</small></div><div class="step">${r.steps[i]}</div><div class="pan"></div><div class="actions"><button class="secondary" id="prev">上一步</button><button class="next" id="next">下一步</button><button class="finish" id="done">完成</button></div></div>`;q('#prev').onclick=()=>{state.cook.step=Math.max(0,i-1);save();render()};q('#next').onclick=()=>{state.cook.step=Math.min(r.steps.length-1,i+1);save();render()};q('#done').onclick=()=>{state.cook=null;save();go('board');toast('开饭啦 🎉')}}
function fridge(){q('#root').innerHTML=`<h2>🧊 冰箱</h2><div class="card fridge-section"><div class="head"><b>食材</b><div class="fridge-actions"><small>${state.foods.length} 种</small><button class="mini-add" data-manage="food">＋ 添加</button></div></div>${state.foods.length?`<div class="home-grid">${state.foods.map(n=>`<button class="home-item" data-remove="food|${n}">${FOOD[n]} ${n}</button>`).join('')}</div>`:'<div class="empty">还没有食材</div>'}</div><div class="card fridge-section"><div class="head"><b>调味料</b><button class="mini-add" data-manage="seasoning">＋ 添加</button></div><div class="home-grid">${SEASON.filter(n=>has('seasoning',n)).map(n=>`<button class="home-item" data-remove="seasoning|${n}">🧂 ${n}</button>`).join('')||'<div class="empty">还没有调味料</div>'}</div></div><div class="card fridge-section"><div class="head"><b>厨具</b><button class="mini-add" data-manage="tool">＋ 添加</button></div><div class="home-grid">${TOOLS.filter(n=>has('tool',n)).map(n=>`<button class="home-item" data-remove="tool|${n}">🍳 ${n}</button>`).join('')||'<div class="empty">还没有厨具</div>'}</div></div>`;qa('[data-remove]').forEach(b=>b.onclick=()=>{let[k,n]=b.dataset.remove.split('|');missing(k,n);render()});qa('[data-manage]').forEach(b=>b.onclick=()=>manageModal(b.dataset.manage))}
function manageModal(tab='food'){let names=tab==='food'?Object.keys(FOOD):tab==='seasoning'?SEASON:TOOLS,icon=n=>tab==='food'?FOOD[n]:tab==='seasoning'?'🧂':'🍳';q('#modal').innerHTML=`<div class="modal"><div class="sheet"><div class="sheet-handle"></div><div class="sheet-head"><div class="title"><b>厨房物品</b><small>点一下切换家里有 / 没有</small></div><button class="icon-close" id="x">×</button></div><div class="manage-tabs"><button data-tab="food" class="${tab==='food'?'on':''}">食材</button><button data-tab="seasoning" class="${tab==='seasoning'?'on':''}">调味料</button><button data-tab="tool" class="${tab==='tool'?'on':''}">厨具</button></div><div class="picker-grid">${names.map(n=>`<button class="pick ${has(tab,n)?'on':''}" data-pick="${tab}|${n}">${icon(n)} ${n}${has(tab,n)?' ✓':''}</button>`).join('')}</div><div class="sheet-footer"><button class="secondary" id="back" style="width:100%">返回冰箱</button></div></div></div>`;q('#x').onclick=close;q('#back').onclick=close;qa('[data-tab]').forEach(b=>b.onclick=()=>manageModal(b.dataset.tab));qa('[data-pick]').forEach(b=>b.onclick=()=>{let[k,n]=b.dataset.pick.split('|');has(k,n)?missing(k,n):have(k,n);manageModal(tab)})}
function shoppingModal(returnId=null){q('#modal').innerHTML=`<div class="modal"><div class="sheet"><div class="sheet-handle"></div><div class="sheet-head"><div class="title"><b>🛍 购物袋</b><small>${returnId?'买到后可直接返回刚才的菜谱。':'买到后会自动记进厨房。'}</small></div><button class="icon-close" id="x">×</button></div>${state.shopping.length?state.shopping.map(x=>`<div class="shopping-row"><div style="font-size:22px">${x.kind==='food'?FOOD[x.name]:x.kind==='seasoning'?'🧂':'🍳'}</div><div class="grow"><b>${x.name}</b><small>${x.kind==='food'?'食材':x.kind==='seasoning'?'调味料':'厨具'}</small></div><button class="tiny" data-bought="${x.kind}|${x.name}">买到了</button><button class="remove" data-rm="${x.kind}|${x.name}">移除</button></div>`).join(''):'<div class="empty">购物袋是空的</div>'}<div class="sheet-footer"><div class="dual"><button class="secondary" id="back">${returnId?'返回菜谱':'关闭'}</button><button class="primary" id="done">完成采购</button></div></div></div></div>`;q('#x').onclick=close;q('#back').onclick=()=>returnId?recipeModal(returnId):close();q('#done').onclick=()=>{close();toast('购物袋已保存')};qa('[data-bought]').forEach(b=>b.onclick=()=>{let[k,n]=b.dataset.bought.split('|');have(k,n);shoppingModal(returnId)});qa('[data-rm]').forEach(b=>b.onclick=()=>{let[k,n]=b.dataset.rm.split('|');rmShop(k,n);save();shoppingModal(returnId)})}
qa('.nav button').forEach(b=>b.onclick=()=>go(b.dataset.s));q('#shoppingBtn').onclick=()=>shoppingModal();save();render();

;


/* ===== patch-v016.js ===== */
// V0.1.6 interaction patch
state.version='0.1.6';
if(!['recipes','ingredients'].includes(state.boardMode)) state.boardMode='recipes';
if(!Array.isArray(state.matchFoods)) state.matchFoods=[];
if(typeof state.foodQuery!=='string') state.foodQuery='';
save();

const deleteWindows=new Map();
function disarmDelete(name){
  const rec=deleteWindows.get(name);
  if(rec){clearTimeout(rec.timer);deleteWindows.delete(name)}
  const btn=document.querySelector(`[data-food-remove="${name}"]`);
  if(btn) btn.classList.remove('delete-armed');
}
function armFoodDelete(btn,name){
  if(deleteWindows.has(name)){
    disarmDelete(name);
    missing('food',name);
    render();
    toast(name+' 已从冰箱移除');
    return;
  }
  btn.classList.add('delete-armed');
  const timer=setTimeout(()=>disarmDelete(name),1600);
  deleteWindows.set(name,{timer});
}

function recipeBody(list){
  if(!list.length)return '<div class="empty">没有找到菜谱</div>';
  if(state.viewMode==='list'){
    return `<div class="recipe-list">${list.map(r=>`<button class="recipe-row" data-r="${r.id}"><div class="icon">${r.icon}</div><div><h3>${r.name}</h3><p>${r.desc}</p></div><div class="row-meta"><span class="tag">${r.mins}分钟</span>${status(r)}</div></button>`).join('')}</div>`;
  }
  return `<div class="recipe-grid">${list.map(r=>`<button class="recipe-card" data-r="${r.id}"><div class="icon">${r.icon}</div><h3>${r.name}</h3><p>${r.desc}</p><div class="meta"><span class="tag">约${r.mins}分钟</span><span class="tag">${r.cat}</span>${status(r)}</div></button>`).join('')}</div>`;
}
function bindRecipeCards(){qa('[data-r]').forEach(b=>b.onclick=()=>recipeModal(b.dataset.r))}
function board(){
  if(state.prep)return prepView();
  const cats=['全部','肉菜','素菜','蛋类','主食','汤炖','速食'];
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
        return {r,overlap,coverage:overlap/selected.length};
      }).filter(x=>x.overlap>0).sort((a,b)=>b.overlap-a.overlap||rs(a.r).missing-rs(b.r).missing||a.r.mins-b.r.mins).map(x=>x.r);
    }
    q('#root').innerHTML=`<h2>🔪 菜板</h2>${mode}<div class="ingredient-find card"><div class="search-row"><input id="foodSearch" class="search" placeholder="搜索食材" value="${state.foodQuery}"><button class="clear-foods" id="clearFoods" ${selected.length?'':'disabled'}>清空</button></div><div class="picker-grid compact-foods">${foods.map(n=>`<button class="pick ${selected.includes(n)?'on':''}" data-match-food="${n}">${FOOD[n]} ${n}</button>`).join('')}</div></div><div class="match-head"><b>${selected.length?`匹配菜谱 · 已选 ${selected.length} 种`:'先选择想用的食材'}</b><div class="view-switch"><button data-view="cards" class="${state.viewMode==='cards'?'on':''}">▦</button><button data-view="list" class="${state.viewMode==='list'?'on':''}">☰</button></div></div>${selected.length?recipeBody(matched):'<div class="empty">选择一种或多种食材后，这里会显示会用到它们的菜谱。</div>'}`;
    q('#foodSearch').oninput=e=>{state.foodQuery=e.target.value;save();board()};
    q('#clearFoods').onclick=()=>{state.matchFoods=[];save();board()};
    qa('[data-match-food]').forEach(b=>b.onclick=()=>{const n=b.dataset.matchFood;state.matchFoods=state.matchFoods.includes(n)?state.matchFoods.filter(x=>x!==n):[...state.matchFoods,n];save();board()});
    qa('[data-view]').forEach(b=>b.onclick=()=>{state.viewMode=b.dataset.view;save();board()});
    qa('[data-board-mode]').forEach(b=>b.onclick=()=>{state.boardMode=b.dataset.boardMode;save();board()});
    bindRecipeCards();
    return;
  }
  const list=recipes.filter(r=>(state.filter==='全部'||r.cat===state.filter)&&(!state.query||r.name.includes(state.query)||r.ings.some(x=>x[0].includes(state.query))||r.tags.some(x=>x.includes(state.query))));
  q('#root').innerHTML=`<h2>🔪 菜板</h2>${mode}<div class="board-tools"><div class="search-row"><input id="search" class="search" placeholder="搜索菜名或食材" value="${state.query}"><div class="view-switch"><button data-view="cards" class="${state.viewMode==='cards'?'on':''}">▦</button><button data-view="list" class="${state.viewMode==='list'?'on':''}">☰</button></div></div><div class="filters">${cats.map(c=>`<button class="filter ${state.filter===c?'on':''}" data-cat="${c}">${c}</button>`).join('')}</div></div>${recipeBody(list)}`;
  q('#search').oninput=e=>{state.query=e.target.value.trim();save();board()};
  qa('[data-view]').forEach(b=>b.onclick=()=>{state.viewMode=b.dataset.view;save();board()});
  qa('[data-cat]').forEach(b=>b.onclick=()=>{state.filter=b.dataset.cat;save();board()});
  qa('[data-board-mode]').forEach(b=>b.onclick=()=>{state.boardMode=b.dataset.boardMode;save();board()});
  bindRecipeCards();
}

function needRow(k,n,amt,opt=0){
  const h=has(k,n),icon=k==='food'?(FOOD[n]||'🥣'):'🧂';
  return `<button class="need compact-need ${h?'state-have':'state-missing'}" data-have="${k}|${n}"><div class="need-icon">${icon}</div><div class="need-info"><strong>${n}${opt?'<span class="optional">可省</span>':''}</strong><small>${amt}</small></div><span class="need-state">${h?'有':'缺'}</span></button>`;
}
function recipeModal(id){
  const r=recipes.find(x=>x.id===id);if(!r)return;
  state.recipe=id;save();
  const s=rs(r),m=miss(r),requiredMissing=m.filter(x=>!inShop(x[0],x[1])),bad=r.tools.filter(g=>!g.some(n=>has('tool',n))),optional=r.season.filter(x=>!x[2]).length,shopN=m.filter(x=>inShop(x[0],x[1])).length;
  q('#modal').innerHTML=`<div class="modal"><div class="sheet"><div class="sheet-handle"></div><div class="sheet-head"><div class="title"><b>${r.icon} ${r.name}</b><small>${r.desc} · 约${r.mins}分钟</small></div><button class="icon-close" id="x">×</button></div><div class="recipe-summary"><div class="summary-cell"><b>${s.have}/${s.total}</b><small>必需项已有</small></div><div class="summary-cell"><b>${shopN}</b><small>购物袋</small></div><div class="summary-cell"><b>${s.tool?'有':'缺'}</b><small>厨具</small></div></div><div class="section-title">食材 <span class="count">点击红/绿切换</span></div><div class="need-list">${r.ings.map(x=>needRow('food',x[0],x[1])).join('')}</div><div class="section-title">调味 <span class="count">必需${r.season.filter(x=>x[2]).length}${optional?' · 可省'+optional:''}</span></div><div class="need-list">${r.season.length?r.season.map(x=>needRow('seasoning',x[0],x[1],!x[2])).join(''):'<div class="muted">不需要额外调味料</div>'}</div><div class="section-title">厨具</div>${r.tools.map(g=>`<div class="tool-need"><div class="tool-head"><div class="need-icon">🍳</div><div><strong>${g.join(' / ')}</strong><small>任选一种即可</small></div></div><div class="tool-options">${g.map(n=>`<button class="toolbtn ${has('tool',n)?'on':'off'}" data-tool="${n}">${n}</button>`).join('')}</div></div>`).join('')}${bad.length?`<div class="blocker">缺厨具：${bad.map(g=>g.join(' / ')+'（任选一种）').join('；')}</div>`:m.length?`<div class="blocker">还有 ${m.length} 个必需食材/调味没有确认。</div>`:'<div class="ready">条件齐全，可以开始准备。</div>'}<div class="sheet-footer"><div class="dual"><button class="secondary" id="back">返回菜谱</button><button class="primary" id="act">${m.length?`一键补齐必需（${m.length}）`:bad.length?'先确认厨具':'开始准备'}</button></div></div></div></div>`;
  q('#x').onclick=close;q('#back').onclick=close;
  qa('[data-have]').forEach(b=>b.onclick=()=>{let[k,n]=b.dataset.have.split('|');has(k,n)?missing(k,n):have(k,n);recipeModal(id)});
  qa('[data-tool]').forEach(b=>b.onclick=()=>{let n=b.dataset.tool;has('tool',n)?missing('tool',n):have('tool',n);recipeModal(id)});
  q('#act').onclick=()=>{let mm=miss(r);if(mm.length){mm.forEach(x=>addShop(x[0],x[1]));save();shoppingModal(id);return}if(!toolOK(r))return toast('请先确认一种可用厨具');state.prep={recipe:id,checked:{}};save();close();render()};
}

function fridge(){
  q('#root').innerHTML=`<h2>🧊 冰箱</h2><div class="card fridge-section"><div class="head"><b>食材</b><div class="fridge-actions"><small>${state.foods.length} 种</small><button class="mini-add" data-manage="food">＋ 添加</button></div></div>${state.foods.length?`<div class="home-grid">${state.foods.map(n=>`<button class="home-item fridge-food" data-food-remove="${n}">${FOOD[n]} ${n}<span class="delete-progress"></span></button>`).join('')}</div>`:'<div class="empty">还没有食材</div>'}</div><div class="card fridge-section"><div class="head"><b>调味料</b><button class="mini-add" data-manage="seasoning">＋ 添加</button></div><div class="home-grid">${SEASON.filter(n=>has('seasoning',n)).map(n=>`<button class="home-item" data-remove="seasoning|${n}">🧂 ${n}</button>`).join('')||'<div class="empty">还没有调味料</div>'}</div></div><div class="card fridge-section"><div class="head"><b>厨具</b><button class="mini-add" data-manage="tool">＋ 添加</button></div><div class="home-grid">${TOOLS.filter(n=>has('tool',n)).map(n=>`<button class="home-item" data-remove="tool|${n}">🍳 ${n}</button>`).join('')||'<div class="empty">还没有厨具</div>'}</div></div>`;
  qa('[data-food-remove]').forEach(b=>b.onclick=()=>armFoodDelete(b,b.dataset.foodRemove));
  qa('[data-remove]').forEach(b=>b.onclick=()=>{let[k,n]=b.dataset.remove.split('|');missing(k,n);render()});
  qa('[data-manage]').forEach(b=>b.onclick=()=>manageModal(b.dataset.manage));
}
function manageModal(tab='food'){
  const names=tab==='food'?Object.keys(FOOD):tab==='seasoning'?SEASON:TOOLS,icon=n=>tab==='food'?FOOD[n]:tab==='seasoning'?'🧂':'🍳';
  q('#modal').innerHTML=`<div class="modal"><div class="sheet"><div class="sheet-handle"></div><div class="sheet-head"><div class="title"><b>厨房物品</b></div><button class="icon-close" id="x">×</button></div><div class="manage-tabs"><button data-tab="food" class="${tab==='food'?'on':''}">食材</button><button data-tab="seasoning" class="${tab==='seasoning'?'on':''}">调味料</button><button data-tab="tool" class="${tab==='tool'?'on':''}">厨具</button></div><div class="picker-grid">${names.map(n=>`<button class="pick ${has(tab,n)?'on':''}" data-pick="${tab}|${n}">${icon(n)} ${n}</button>`).join('')}</div><div class="sheet-footer"><button class="secondary" id="back" style="width:100%">返回冰箱</button></div></div></div>`;
  const back=()=>{close();render()};
  q('#x').onclick=back;q('#back').onclick=back;
  qa('[data-tab]').forEach(b=>b.onclick=()=>manageModal(b.dataset.tab));
  qa('[data-pick]').forEach(b=>b.onclick=()=>{let[k,n]=b.dataset.pick.split('|');has(k,n)?missing(k,n):have(k,n);manageModal(tab)});
}

render();

;


/* ===== patch-v017.js ===== */
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

;


/* ===== patch-v018.js ===== */
// V0.1.8 compact recipe prerequisite sheet
state.version='0.1.8';
save();

function recipeChip(kind,name,amount,optional=false){
  const owned=has(kind,name);
  const icon=kind==='food'?(FOOD[name]||'🥣'):'🧂';
  const cls=optional?(owned?'optional-have':'optional-missing'):(owned?'have':'missing');
  return `<button class="recipe-chip ${cls}" data-recipe-item="${kind}|${name}" aria-pressed="${owned}"><span class="chip-icon">${icon}</span><span class="chip-name">${name}</span>${amount?`<span class="chip-amount">${amount}</span>`:''}</button>`;
}

recipeModal=function(id){
  const r=recipes.find(x=>x.id===id);if(!r)return;
  state.recipe=id;save();

  const requiredFoods=r.ings.map(x=>['food',x[0],x[1]]);
  const requiredSeason=r.season.filter(x=>x[2]).map(x=>['seasoning',x[0],x[1]]);
  const optionalSeason=r.season.filter(x=>!x[2]).map(x=>['seasoning',x[0],x[1]]);
  const requiredAll=[...requiredFoods,...requiredSeason];
  const missingRequired=requiredAll.filter(x=>!has(x[0],x[1]));
  const newMissing=missingRequired.filter(x=>!inShop(x[0],x[1]));
  const alreadyShopping=missingRequired.length-newMissing.length;
  const toolGroups=r.tools||[];
  const badToolGroups=toolGroups.filter(g=>!g.some(n=>has('tool',n)));
  const ready=missingRequired.length===0&&badToolGroups.length===0;
  const allRequiredHave=missingRequired.length===0;

  const toolHTML=toolGroups.length?toolGroups.map((g,idx)=>{
    const groupReady=g.some(n=>has('tool',n));
    return `<div class="tool-chip-group ${groupReady?'':'missing-group'}"><div class="tool-chip-head"><b>${toolGroups.length>1?'厨具 '+(idx+1):'厨具'} · 任选一种</b><small>${groupReady?'已满足':'需要一个'}</small></div><div class="tool-chip-grid">${g.map(n=>`<button class="tool-chip ${has('tool',n)?'have':groupReady?'neutral':'missing'}" data-recipe-tool="${n}">${n}</button>`).join('')}</div></div>`;
  }).join(''):'<div class="muted">不需要额外厨具</div>';

  let statusText='';
  if(ready) statusText='<div class="recipe-status-line ready">条件齐全，可以开始准备。</div>';
  else {
    const parts=[];
    if(missingRequired.length) parts.push(`缺 ${missingRequired.length} 个必需项`);
    if(badToolGroups.length) parts.push(`缺 ${badToolGroups.length} 组厨具`);
    statusText=`<div class="recipe-status-line blocked">${parts.join(' · ')}</div>`;
  }

  let primaryLabel='开始准备';
  if(missingRequired.length){
    primaryLabel=newMissing.length?`缺少的加入购物袋（${newMissing.length}）`:`查看购物袋（${alreadyShopping}）`;
  }else if(badToolGroups.length){
    primaryLabel='先确认厨具';
  }

  q('#modal').innerHTML=`<div class="modal"><div class="sheet"><div class="sheet-handle"></div><div class="sheet-head"><div class="title"><b>${r.icon} ${r.name}</b><small>${r.desc} · 约${r.mins}分钟</small></div><button class="icon-close" id="x">×</button></div>
  <div class="recipe-mini-summary"><span class="tag ${allRequiredHave?'good':'bad'}"><strong>${requiredAll.length-missingRequired.length}/${requiredAll.length}</strong> 必需</span>${alreadyShopping?`<span class="tag bad">购物袋 ${alreadyShopping}</span>`:''}<span class="tag ${badToolGroups.length?'bad':'good'}">厨具 ${badToolGroups.length?'缺':'有'}</span><button class="mark-all-inline ${allRequiredHave?'all-have':''}" id="markAllRequired">必需都在</button></div>

  <div class="recipe-chip-section"><div class="recipe-chip-title"><span>食材</span><small>红 = 缺 · 绿 = 有</small></div><div class="recipe-chip-grid">${requiredFoods.map(x=>recipeChip(x[0],x[1],x[2],false)).join('')}</div></div>

  ${requiredSeason.length?`<div class="recipe-chip-section"><div class="recipe-chip-title"><span>必需调味</span><small>会影响能否开始</small></div><div class="recipe-chip-grid">${requiredSeason.map(x=>recipeChip(x[0],x[1],x[2],false)).join('')}</div></div>`:''}

  ${optionalSeason.length?`<div class="recipe-chip-section"><div class="recipe-chip-title"><span>可选</span><span class="optional-note"><i class="optional-dot"></i>不影响制作</span></div><div class="recipe-chip-grid">${optionalSeason.map(x=>recipeChip(x[0],x[1],x[2],true)).join('')}</div></div>`:''}

  <div class="recipe-chip-section"><div class="recipe-chip-title"><span>厨具</span><small>满足每组任意一个</small></div>${toolHTML}</div>
  ${statusText}
  <div class="sheet-footer"><div class="recipe-footer-actions"><button class="secondary" id="backRecipe">返回菜谱</button><button class="primary" id="recipePrimary">${primaryLabel}</button></div></div></div></div>`;

  const back=()=>close();
  q('#x').onclick=back;
  q('#backRecipe').onclick=back;
  qa('[data-recipe-item]').forEach(b=>b.onclick=()=>{
    const [k,n]=b.dataset.recipeItem.split('|');
    has(k,n)?missing(k,n):have(k,n);
    recipeModal(id);
  });
  qa('[data-recipe-tool]').forEach(b=>b.onclick=()=>{
    const n=b.dataset.recipeTool;
    has('tool',n)?missing('tool',n):have('tool',n);
    recipeModal(id);
  });
  q('#markAllRequired').onclick=()=>{
    requiredAll.forEach(x=>have(x[0],x[1]));
    save();
    recipeModal(id);
  };
  q('#recipePrimary').onclick=()=>{
    const currentMissing=requiredAll.filter(x=>!has(x[0],x[1]));
    const currentNew=currentMissing.filter(x=>!inShop(x[0],x[1]));
    if(currentMissing.length){
      if(currentNew.length){currentNew.forEach(x=>addShop(x[0],x[1]));save()}
      shoppingModal(id);return;
    }
    if(!toolOK(r)){toast('请先确认一种可用厨具');return}
    state.prep={recipe:id,checked:{}};save();close();render();
  };
};

render();

;


/* ===== patch-v019.js ===== */
// V0.1.11 align bulk-confirm action with recipe title
state.version='0.1.11';
save();

recipeModal=function(id){
  const r=recipes.find(x=>x.id===id);if(!r)return;
  state.recipe=id;save();

  const requiredFoods=r.ings.map(x=>['food',x[0],x[1]]);
  const requiredSeason=r.season.filter(x=>x[2]).map(x=>['seasoning',x[0],x[1]]);
  const optionalSeason=r.season.filter(x=>!x[2]).map(x=>['seasoning',x[0],x[1]]);
  const requiredAll=[...requiredFoods,...requiredSeason];
  const missingRequired=requiredAll.filter(x=>!has(x[0],x[1]));
  const newMissing=missingRequired.filter(x=>!inShop(x[0],x[1]));
  const alreadyShopping=missingRequired.length-newMissing.length;
  const toolGroups=r.tools||[];
  const badToolGroups=toolGroups.filter(g=>!g.some(n=>has('tool',n)));
  const ready=missingRequired.length===0&&badToolGroups.length===0;
  const allRequiredHave=missingRequired.length===0;

  const toolHTML=toolGroups.length?toolGroups.map((g,idx)=>{
    const groupReady=g.some(n=>has('tool',n));
    return `<div class="tool-chip-group ${groupReady?'':'missing-group'}"><div class="tool-chip-head"><b>${toolGroups.length>1?'厨具 '+(idx+1):'厨具'} · 任选一种</b><small>${groupReady?'已满足':'需要一个'}</small></div><div class="tool-chip-grid">${g.map(n=>`<button class="tool-chip ${has('tool',n)?'have':groupReady?'neutral':'missing'}" data-recipe-tool="${n}">${n}</button>`).join('')}</div></div>`;
  }).join(''):'<div class="muted">不需要额外厨具</div>';

  let statusText='';
  if(ready) statusText='<div class="recipe-status-line ready">条件齐全，可以开始准备。</div>';
  else {
    const parts=[];
    if(missingRequired.length) parts.push(`缺 ${missingRequired.length} 个必需项`);
    if(badToolGroups.length) parts.push(`缺 ${badToolGroups.length} 组厨具`);
    statusText=`<div class="recipe-status-line blocked">${parts.join(' · ')}</div>`;
  }

  let primaryLabel='开始准备';
  if(missingRequired.length){
    primaryLabel=newMissing.length?`缺少的加入购物袋（${newMissing.length}）`:`查看购物袋（${alreadyShopping}）`;
  }else if(badToolGroups.length){
    primaryLabel='先确认厨具';
  }

  q('#modal').innerHTML=`<div class="modal"><div class="sheet"><div class="sheet-handle"></div>
  <div class="recipe-title-block">
    <div class="recipe-title-row"><b>${r.icon} ${r.name}</b><button class="title-bulk-add ${allRequiredHave?'done':''}" id="markAllRequired" ${allRequiredHave?'disabled':''}>${allRequiredHave?'已添加':'一键添加'}</button></div>
    <small>${r.desc} · 约${r.mins}分钟</small>
  </div>

  <div class="recipe-mini-summary"><span class="tag ${allRequiredHave?'good':'bad'}"><strong>${requiredAll.length-missingRequired.length}/${requiredAll.length}</strong> 必需</span>${alreadyShopping?`<span class="tag bad">购物袋 ${alreadyShopping}</span>`:''}<span class="tag ${badToolGroups.length?'bad':'good'}">厨具 ${badToolGroups.length?'缺':'有'}</span></div>

  <div class="recipe-chip-section"><div class="recipe-chip-title"><span>食材</span><small>红 = 缺 · 绿 = 有</small></div><div class="recipe-chip-grid">${requiredFoods.map(x=>recipeChip(x[0],x[1],x[2],false)).join('')}</div></div>

  ${requiredSeason.length?`<div class="recipe-chip-section"><div class="recipe-chip-title"><span>必需调味</span><small>会影响能否开始</small></div><div class="recipe-chip-grid">${requiredSeason.map(x=>recipeChip(x[0],x[1],x[2],false)).join('')}</div></div>`:''}

  ${optionalSeason.length?`<div class="recipe-chip-section"><div class="recipe-chip-title"><span>可选</span><span class="optional-note"><i class="optional-dot"></i>不影响制作</span></div><div class="recipe-chip-grid">${optionalSeason.map(x=>recipeChip(x[0],x[1],x[2],true)).join('')}</div></div>`:''}

  <div class="recipe-chip-section"><div class="recipe-chip-title"><span>厨具</span><small>满足每组任意一个</small></div>${toolHTML}</div>
  ${statusText}
  <div class="sheet-footer"><div class="recipe-footer-actions"><button class="secondary" id="backRecipe">返回菜谱</button><button class="primary" id="recipePrimary">${primaryLabel}</button></div></div></div></div>`;

  q('#backRecipe').onclick=()=>close();
  qa('[data-recipe-item]').forEach(b=>b.onclick=()=>{
    const [k,n]=b.dataset.recipeItem.split('|');
    has(k,n)?missing(k,n):have(k,n);
    recipeModal(id);
  });
  qa('[data-recipe-tool]').forEach(b=>b.onclick=()=>{
    const n=b.dataset.recipeTool;
    has('tool',n)?missing('tool',n):have('tool',n);
    recipeModal(id);
  });
  const markAll=q('#markAllRequired');
  if(markAll&&!allRequiredHave) markAll.onclick=()=>{
    requiredAll.forEach(x=>have(x[0],x[1]));
    save();
    recipeModal(id);
  };
  q('#recipePrimary').onclick=()=>{
    const currentMissing=requiredAll.filter(x=>!has(x[0],x[1]));
    const currentNew=currentMissing.filter(x=>!inShop(x[0],x[1]));
    if(currentMissing.length){
      if(currentNew.length){currentNew.forEach(x=>addShop(x[0],x[1]));save()}
      shoppingModal(id);return;
    }
    if(!toolOK(r)){toast('请先确认一种可用厨具');return}
    state.prep={recipe:id,checked:{}};save();close();render();
  };
};

render();

;


/* ===== patch-v0112.js ===== */
// V0.1.12 end-to-end interaction refinement
state.version='0.1.12';

const preload=window.__MK_PRELOAD||null;
if(!window.__MK_HAD_STATE){
  state.foods=[];
  SEASON.forEach(n=>state.set.seasonings[n]=0);
  TOOLS.forEach(n=>state.set.cookware[n]=0);
  state.shopping=[];
}
if(preload){
  if(preload.prep&&recipes.some(r=>r.id===preload.prep.recipe)) state.prep=preload.prep;
  if(['recipes','ingredients'].includes(preload.boardMode)) state.boardMode=preload.boardMode;
  if(Array.isArray(preload.matchFoods)) state.matchFoods=preload.matchFoods.filter(n=>FOOD[n]);
  if(typeof preload.foodQuery==='string') state.foodQuery=preload.foodQuery;
}
if(state.filter==='速食') state.filter='半成品';
if(!Array.isArray(state.matchFoods)) state.matchFoods=[];
if(typeof state.foodQuery!=='string') state.foodQuery='';
save();

addShop=function(kind,name,meta=null){
  let item=state.shopping.find(x=>x.kind===kind&&x.name===name);
  if(!item){
    item={kind,name};
    state.shopping.push(item);
  }
  if(meta&&meta.recipeId){
    if(!Array.isArray(item.needs)) item.needs=[];
    const existing=item.needs.find(x=>x.recipeId===meta.recipeId);
    if(existing) existing.amount=meta.amount||existing.amount||'';
    else item.needs.push({recipeId:meta.recipeId,amount:meta.amount||''});
  }
  save();
};

function intentFoodChip(name){
  const selected=state.matchFoods.includes(name);
  const owned=has('food',name);
  const queued=inShop('food',name);
  return `<button class="intent-food ${owned?'owned':'other'} ${selected?'intent-on':''}" data-match-food="${name}">${FOOD[name]} <span>${name}</span>${queued?'<small>待买</small>':''}</button>`;
}

board=function(){
  if(state.prep)return prepView();
  const cats=['全部','肉菜','素菜','蛋类','主食','汤炖','半成品'];
  const mode=`<div class="board-mode"><button data-board-mode="recipes" class="${state.boardMode==='recipes'?'on':''}">选菜谱</button><button data-board-mode="ingredients" class="${state.boardMode==='ingredients'?'on':''}">按食材找菜</button></div>`;

  if(state.boardMode==='ingredients'){
    const fq=state.foodQuery.trim();
    const allFoods=Object.keys(FOOD).filter(n=>!fq||n.includes(fq));
    const homeFoods=allFoods.filter(n=>has('food',n));
    const otherFoods=allFoods.filter(n=>!has('food',n));
    const selected=state.matchFoods.filter(n=>FOOD[n]);
    let matched=[];
    if(selected.length){
      matched=recipes.map(r=>{
        const names=r.ings.map(x=>x[0]);
        const overlap=selected.filter(n=>names.includes(n)).length;
        return {r,overlap};
      }).filter(x=>x.overlap>0)
        .sort((a,b)=>b.overlap-a.overlap||rs(a.r).missing-rs(b.r).missing||a.r.mins-b.r.mins)
        .map(x=>x.r);
    }
    const section=(title,items,empty)=>`<div class="intent-section"><div class="intent-section-head"><b>${title}</b><small>${items.length} 种</small></div>${items.length?`<div class="intent-food-grid">${items.map(intentFoodChip).join('')}</div>`:`<div class="intent-empty">${empty}</div>`}</div>`;
    q('#root').innerHTML=`<h2>🔪 菜板</h2>${mode}
      <div class="ingredient-find card intent-browser">
        <div class="search-row"><input id="foodSearch" class="search" placeholder="搜索想吃的食材，如虾仁" value="${state.foodQuery}"><button class="clear-foods" id="clearFoods" ${selected.length?'':'disabled'}>清空</button></div>
        ${selected.length?`<div class="intent-selected-line"><b>这顿想用 ${selected.length} 种</b><span>棕色描边 = 已选</span></div>`:''}
        ${section('家里有',homeFoods,'冰箱里还没有记录食材')}
        ${section('其他食材',otherFoods,fq?'没有找到这个食材':'没有其他食材')}
      </div>
      <div class="match-head"><b>${selected.length?`匹配菜谱 · 已选 ${selected.length} 种`:'选择这顿想用的食材'}</b><div class="view-switch"><button data-view="cards" class="${state.viewMode==='cards'?'on':''}">▦</button><button data-view="list" class="${state.viewMode==='list'?'on':''}">☰</button></div></div>
      ${selected.length?recipeBody(matched):'<div class="empty">家里有的、准备买的、现在没有但想吃的食材都可以选。</div>'}`;
    q('#foodSearch').oninput=e=>{state.foodQuery=e.target.value;save();board()};
    q('#clearFoods').onclick=()=>{state.matchFoods=[];save();board()};
    qa('[data-match-food]').forEach(b=>b.onclick=()=>{
      const n=b.dataset.matchFood;
      state.matchFoods=state.matchFoods.includes(n)?state.matchFoods.filter(x=>x!==n):[...state.matchFoods,n];
      save();board();
    });
    qa('[data-view]').forEach(b=>b.onclick=()=>{state.viewMode=b.dataset.view;save();board()});
    qa('[data-board-mode]').forEach(b=>b.onclick=()=>{state.boardMode=b.dataset.boardMode;save();board()});
    bindRecipeCards();
    return;
  }

  const list=recipes.filter(r=>(state.filter==='全部'||r.cat===state.filter)&&(!state.query||r.name.includes(state.query)||r.ings.some(x=>x[0].includes(state.query))||r.tags.some(x=>x.includes(state.query))));
  q('#root').innerHTML=`<h2>🔪 菜板</h2>${mode}<div class="board-tools"><div class="search-row"><input id="search" class="search" placeholder="搜索菜名或食材" value="${state.query}"><div class="view-switch"><button data-view="cards" class="${state.viewMode==='cards'?'on':''}">▦</button><button data-view="list" class="${state.viewMode==='list'?'on':''}">☰</button></div></div><div class="filters">${cats.map(c=>`<button class="filter ${state.filter===c?'on':''}" data-cat="${c}">${c}</button>`).join('')}</div></div>${recipeBody(list)}`;
  q('#search').oninput=e=>{state.query=e.target.value.trim();save();board()};
  qa('[data-view]').forEach(b=>b.onclick=()=>{state.viewMode=b.dataset.view;save();board()});
  qa('[data-cat]').forEach(b=>b.onclick=()=>{state.filter=b.dataset.cat;save();board()});
  qa('[data-board-mode]').forEach(b=>b.onclick=()=>{state.boardMode=b.dataset.boardMode;save();board()});
  bindRecipeCards();
};

recipeModal=function(id){
  const r=recipes.find(x=>x.id===id);if(!r)return;
  state.recipe=id;save();
  const requiredFoods=r.ings.map(x=>['food',x[0],x[1]]);
  const requiredSeason=r.season.filter(x=>x[2]).map(x=>['seasoning',x[0],x[1]]);
  const optionalSeason=r.season.filter(x=>!x[2]).map(x=>['seasoning',x[0],x[1]]);
  const requiredAll=[...requiredFoods,...requiredSeason];
  const missingRequired=requiredAll.filter(x=>!has(x[0],x[1]));
  const newMissing=missingRequired.filter(x=>!inShop(x[0],x[1]));
  const alreadyShopping=missingRequired.length-newMissing.length;
  const toolGroups=r.tools||[];
  const badToolGroups=toolGroups.filter(g=>!g.some(n=>has('tool',n)));
  const ready=missingRequired.length===0&&badToolGroups.length===0;
  const allRequiredHave=missingRequired.length===0;
  const toolHTML=toolGroups.length?toolGroups.map((g,idx)=>{
    const groupReady=g.some(n=>has('tool',n));
    return `<div class="tool-chip-group ${groupReady?'':'missing-group'}"><div class="tool-chip-head"><b>${toolGroups.length>1?'厨具 '+(idx+1):'厨具'} · 任选一种</b><small>${groupReady?'已满足':'需要一个'}</small></div><div class="tool-chip-grid">${g.map(n=>`<button class="tool-chip ${has('tool',n)?'have':groupReady?'neutral':'missing'}" data-recipe-tool="${n}">${n}</button>`).join('')}</div></div>`;
  }).join(''):'<div class="muted">不需要额外厨具</div>';
  let statusText='';
  if(ready) statusText='<div class="recipe-status-line ready">条件齐全，可以开始准备。</div>';
  else{
    const parts=[];
    if(missingRequired.length)parts.push(`缺 ${missingRequired.length} 个必需项`);
    if(badToolGroups.length)parts.push(`缺 ${badToolGroups.length} 组厨具`);
    statusText=`<div class="recipe-status-line blocked">${parts.join(' · ')}</div>`;
  }
  let primaryLabel='开始准备';
  if(missingRequired.length) primaryLabel=newMissing.length?`缺少的加入购物袋（${newMissing.length}）`:`查看购物袋（${alreadyShopping}）`;
  else if(badToolGroups.length) primaryLabel='先确认厨具';

  q('#modal').innerHTML=`<div class="modal"><div class="sheet"><div class="sheet-handle"></div>
    <div class="recipe-title-block"><div class="recipe-title-row"><b>${r.icon} ${r.name}</b><button class="title-bulk-add ${allRequiredHave?'done':''}" id="markAllRequired" ${allRequiredHave?'disabled':''}>${allRequiredHave?'已添加':'一键添加'}</button></div><small>${r.desc} · 约${r.mins}分钟</small></div>
    <div class="recipe-mini-summary"><span class="tag ${allRequiredHave?'good':'bad'}"><strong>${requiredAll.length-missingRequired.length}/${requiredAll.length}</strong> 必需</span>${alreadyShopping?`<span class="tag bad">购物袋 ${alreadyShopping}</span>`:''}<span class="tag ${badToolGroups.length?'bad':'good'}">厨具 ${badToolGroups.length?'缺':'有'}</span></div>
    <div class="recipe-chip-section"><div class="recipe-chip-title"><span>食材</span><small>红 = 缺 · 绿 = 有</small></div><div class="recipe-chip-grid">${requiredFoods.map(x=>recipeChip(x[0],x[1],x[2],false)).join('')}</div></div>
    ${requiredSeason.length?`<div class="recipe-chip-section"><div class="recipe-chip-title"><span>必需调味</span><small>会影响能否开始</small></div><div class="recipe-chip-grid">${requiredSeason.map(x=>recipeChip(x[0],x[1],x[2],false)).join('')}</div></div>`:''}
    ${optionalSeason.length?`<div class="recipe-chip-section"><div class="recipe-chip-title"><span>可选</span><span class="optional-note"><i class="optional-dot"></i>不影响制作</span></div><div class="recipe-chip-grid">${optionalSeason.map(x=>recipeChip(x[0],x[1],x[2],true)).join('')}</div></div>`:''}
    <div class="recipe-chip-section"><div class="recipe-chip-title"><span>厨具</span><small>满足每组任意一个</small></div>${toolHTML}</div>
    ${statusText}
    <div class="sheet-footer"><div class="recipe-footer-actions"><button class="secondary" id="backRecipe">返回菜谱</button><button class="primary" id="recipePrimary">${primaryLabel}</button></div></div>
  </div></div>`;
  q('#backRecipe').onclick=()=>close();
  qa('[data-recipe-item]').forEach(b=>b.onclick=()=>{const[k,n]=b.dataset.recipeItem.split('|');has(k,n)?missing(k,n):have(k,n);recipeModal(id)});
  qa('[data-recipe-tool]').forEach(b=>b.onclick=()=>{const n=b.dataset.recipeTool;has('tool',n)?missing('tool',n):have('tool',n);recipeModal(id)});
  const markAll=q('#markAllRequired');
  if(markAll&&!allRequiredHave)markAll.onclick=()=>{requiredAll.forEach(x=>have(x[0],x[1]));save();recipeModal(id)};
  q('#recipePrimary').onclick=()=>{
    const currentMissing=requiredAll.filter(x=>!has(x[0],x[1]));
    if(currentMissing.length){
      currentMissing.forEach(x=>addShop(x[0],x[1],{recipeId:id,amount:x[2]}));
      shoppingModal(id);return;
    }
    if(!toolOK(r)){toast('请先确认一种可用厨具');return}
    state.prep={recipe:id,checked:{}};save();close();render();
  };
};

function shoppingNeedText(item){
  if(!Array.isArray(item.needs)||!item.needs.length)return item.kind==='food'?'食材':item.kind==='seasoning'?'调味料':'厨具';
  return item.needs.map(n=>{
    const r=recipes.find(x=>x.id===n.recipeId);
    return `${n.amount||'适量'}${r?` · ${r.name}`:''}`;
  }).join('；');
}

shoppingModal=function(returnId=null){
  q('#modal').innerHTML=`<div class="modal"><div class="sheet"><div class="sheet-handle"></div><div class="sheet-head"><div class="title"><b>🛍 购物袋</b><small>${returnId?'买到后可直接返回刚才的菜谱。':'买到后会自动记进厨房。'}</small></div><button class="icon-close" id="x">×</button></div>${state.shopping.length?state.shopping.map(x=>`<div class="shopping-row"><div class="shopping-icon">${x.kind==='food'?(FOOD[x.name]||'🥣'):x.kind==='seasoning'?'🧂':'🍳'}</div><div class="grow"><b>${x.name}</b><small>${shoppingNeedText(x)}</small></div><button class="tiny" data-bought="${x.kind}|${x.name}">买到了</button><button class="remove" data-rm="${x.kind}|${x.name}">移除</button></div>`).join(''):'<div class="empty">购物袋是空的</div>'}<div class="sheet-footer"><div class="dual"><button class="secondary" id="back">${returnId?'返回菜谱':'关闭'}</button><button class="primary" id="done">保存并关闭</button></div></div></div></div>`;
  q('#x').onclick=close;
  q('#back').onclick=()=>returnId?recipeModal(returnId):close();
  q('#done').onclick=()=>{close();toast('购物袋已保存')};
  qa('[data-bought]').forEach(b=>b.onclick=()=>{const[k,n]=b.dataset.bought.split('|');have(k,n);shoppingModal(returnId)});
  qa('[data-rm]').forEach(b=>b.onclick=()=>{const[k,n]=b.dataset.rm.split('|');rmShop(k,n);save();shoppingModal(returnId)});
};

go=function(scene){state.scene=scene;save();render()};

prepView=function(){
  const r=recipes.find(x=>x.id===state.prep.recipe);if(!r){state.prep=null;save();return board()}
  const done=Object.values(state.prep.checked||{}).filter(Boolean).length;
  const total=r.ings.length;
  const complete=done===total;
  q('#root').innerHTML=`<h2>🔪 准备 · ${r.name}</h2><div class="card prep-card"><div class="head"><b>食材准备</b><small>${done}/${total}</small></div><div class="prep-list">${r.ings.map(x=>{const ck=!!state.prep.checked[x[0]];return`<button class="prep ${ck?'done':''}" data-p="${x[0]}"><span class="prep-check">${ck?'✓':'○'}</span><span><strong>${FOOD[x[0]]||'🥣'} ${x[0]} · ${x[1]}</strong><small>${x[2]}</small></span></button>`}).join('')}</div><div class="section-title">调味</div><div class="meta">${r.season.map(x=>`<span class="tag ${x[2]?'good':''}">${x[0]} · ${x[1]}${x[2]?'':' · 可省'}</span>`).join('')||'<span class="muted">无需额外调味</span>'}</div>${!complete?`<div class="prep-hint">还差 ${total-done} 项准备完成</div>`:'<div class="prep-hint ready-hint">食材准备完成，可以去灶台。</div>'}<div class="dual" style="margin-top:11px"><button class="secondary" id="reselect">重新选菜</button><button class="primary" id="cook" ${complete?'':'disabled'}>去灶台</button></div></div>`;
  qa('[data-p]').forEach(b=>b.onclick=()=>{state.prep.checked[b.dataset.p]=!state.prep.checked[b.dataset.p];save();render()});
  q('#reselect').onclick=()=>{state.prep=null;save();render()};
  q('#cook').onclick=()=>{
    if(!complete)return;
    if(!rs(r).ready){state.prep=null;save();return recipeModal(r.id)}
    state.cook={recipe:r.id,step:0};state.prep=null;save();go('stove');
  };
};

function finishMealModal(r){
  state.cook=null;state.scene='board';save();render();
  const candidates=[...r.ings.map(x=>['food',x[0]]),...r.season.filter(x=>x[2]).map(x=>['seasoning',x[0]])].filter(x=>has(x[0],x[1]));
  if(!candidates.length){toast('开饭啦 🎉');return}
  const selected=new Set();
  q('#modal').innerHTML=`<div class="modal"><div class="sheet finish-sheet"><div class="sheet-handle"></div><div class="sheet-head"><div class="title"><b>🍽 做好了</b><small>有东西刚好用完吗？</small></div></div><div class="used-up-grid">${candidates.map(([k,n])=>`<button class="used-up-chip" data-used="${k}|${n}">${k==='food'?(FOOD[n]||'🥣'):'🧂'} ${n}</button>`).join('')}</div><div class="sheet-footer"><div class="dual"><button class="secondary" id="noneUsed">都还有</button><button class="primary" id="confirmUsed" disabled>确认用完</button></div></div></div></div>`;
  qa('[data-used]').forEach(b=>b.onclick=()=>{
    const key=b.dataset.used;
    selected.has(key)?selected.delete(key):selected.add(key);
    b.classList.toggle('on',selected.has(key));
    const confirm=q('#confirmUsed');
    confirm.disabled=selected.size===0;
    confirm.textContent=selected.size?`确认用完（${selected.size}）`:'确认用完';
  });
  q('#noneUsed').onclick=()=>{close();toast('开饭啦 🎉')};
  q('#confirmUsed').onclick=()=>{
    selected.forEach(v=>{const[k,n]=v.split('|');missing(k,n)});
    close();toast('已更新冰箱 · 开饭啦 🎉');
  };
}

stove=function(){
  if(!state.cook){
    if(state.prep){const r=recipes.find(x=>x.id===state.prep.recipe);q('#root').innerHTML=`<h2>🍳 灶台</h2><div class="card empty">${r?r.name:'这道菜'}还在菜板准备中。<br><button class="primary" style="margin-top:12px" id="backPrep">回菜板继续准备</button></div>`;q('#backPrep').onclick=()=>go('board');return}
    q('#root').innerHTML='<h2>🍳 灶台</h2><div class="card empty">还没有要做的菜。<br><button class="primary" style="margin-top:12px" onclick="go(\'board\')">去菜板选菜</button></div>';return;
  }
  const r=recipes.find(x=>x.id===state.cook.recipe),i=state.cook.step,last=i===r.steps.length-1;
  q('#root').innerHTML=`<h2>🍳 ${r.name}</h2><div class="preflight">食材、调味和厨具已确认</div><div class="card cook compact-cook"><div class="head"><b>步骤 ${i+1}/${r.steps.length}</b><small>约${r.mins}分钟</small></div><div class="step">${r.steps[i]}</div><div class="pan"></div><div class="actions ${last?'last-step':'normal-step'}"><button class="secondary" id="prev" ${i===0?'disabled':''}>上一步</button>${last?'<button class="finish" id="done">完成制作</button>':'<button class="next" id="next">下一步</button>'}</div></div>`;
  q('#prev').onclick=()=>{if(i===0)return;state.cook.step=i-1;save();render()};
  if(last)q('#done').onclick=()=>finishMealModal(r);
  else q('#next').onclick=()=>{state.cook.step=i+1;save();render()};
};

save();render();

;


/* ===== patch-v0113.js ===== */
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

;


/* ===== patch-v0114.js ===== */
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

;


/* ===== patch-v0115.js ===== */
// V0.1.15 expanded everyday ingredient + recipe library
state.version='0.1.15';

Object.assign(FOOD,{
  '鸭腿':'🦆','鸡翅':'🍗','排骨':'🥩','五花肉':'🥓','肉末':'🥩','火腿肠':'🌭',
  '鱿鱼':'🦑','花蛤':'🐚','鲈鱼':'🐟','莲藕':'🪷','冬瓜':'🍈','白萝卜':'🥕',
  '山药':'🥔','娃娃菜':'🥬','生菜':'🥬','油麦菜':'🥬','韭菜':'🌿','四季豆':'🫛',
  '香菇':'🍄','木耳':'🍄','海带':'🌿','粉丝':'🍜','年糕':'🍚','馄饨':'🥟',
  '汤圆':'⚪','馒头':'🥯','可乐':'🥤'
});

['馄饨','汤圆','馒头'].forEach(n=>{if(!SEMI_PREPARED.includes(n))SEMI_PREPARED.push(n)});

function addR15(recipe){if(!recipes.some(r=>r.id===recipe.id))recipes.push(recipe)}

addR15(R('r27','可乐鸡翅','🍗','肉菜',['下饭','一锅'],28,'甜咸酱香，鸡翅入味又省事',[
  ['鸡翅','8个','两面划一刀方便入味'],['可乐','330ml','普通可乐即可'],['姜','3片','切片']
],[['生抽','1.5勺',1],['老抽','半勺',0],['盐','少量',0]],[['炒锅','平底锅']],[
  '鸡翅擦干，锅中少量油煎至两面微黄。','加入姜片和生抽翻匀。','倒入可乐至基本没过鸡翅。','中火煮开后转小火焖约15分钟。','开盖收汁，尝味后决定是否补盐。'
]));
addR15(R('r28','红烧排骨','🍖','肉菜',['下饭','家常'],45,'酱香浓郁的家常排骨',[['排骨','500g','切小段并冲洗']],[['食用油','少量',1],['生抽','2勺',1],['老抽','半勺',0],['糖','1小勺',1],['料酒','1勺',0],['盐','少量',0]],[['炒锅','汤锅']],['排骨冷水下锅煮开后捞出。','锅中少量油和糖炒至微微焦黄。','放入排骨翻炒上色。','加生抽、热水，盖盖小火焖约30分钟。','开盖收汁，按口味补盐。']));
addR15(R('r29','莲藕排骨汤','🥣','汤炖',['暖胃','一锅'],55,'莲藕粉糯，排骨汤清甜',[['排骨','400g','焯水洗净'],['莲藕','1节','去皮切块'],['姜','3片','切片']],[['盐','适量',1],['料酒','少量',0],['胡椒','少量',0]],[['汤锅','电饭煲']],['排骨焯水后洗净。','排骨、莲藕和姜片放入锅中，加足量热水。','煮开后转小火炖约40分钟。','最后加盐，可加少量胡椒。']));
addR15(R('r30','肉末茄子','🍆','肉菜',['下饭','家常'],20,'软糯茄子裹上肉末酱汁',[['肉末','180g','提前拨散'],['茄子','2根','切条或滚刀块'],['蒜','2瓣','切末']],[['食用油','适量',1],['生抽','1勺',1],['豆瓣酱','半勺',0],['糖','少量',0],['盐','少量',1]],[['炒锅','平底锅']],['茄子用少量盐抓匀静置几分钟后擦干。','锅热加油，把茄子炒软后盛出。','肉末炒散，加入蒜末。','放回茄子，加生抽和少量水翻匀。','收汁后尝味出锅。']));
addR15(R('r31','肉末豆腐','⬜','肉菜',['省钱','下饭'],18,'豆腐软嫩，肉末酱汁很下饭',[['肉末','150g','拨散'],['豆腐','1盒','切小块'],['葱','少量','切葱花']],[['食用油','少量',1],['生抽','1勺',1],['盐','少量',1],['淀粉','少量',0]],[['炒锅','平底锅']],['肉末炒散至变色。','加入豆腐和半碗水。','加生抽，小火焖5分钟。','需要浓稠可加少量水淀粉。','补盐并撒葱花。']));
addR15(R('r32','回锅肉','🥓','肉菜',['下饭','香辣'],25,'五花肉和青椒的经典下饭菜',[['五花肉','250g','切薄片'],['青椒','2个','切块'],['洋葱','半个','切片']],[['食用油','少量',0],['豆瓣酱','1勺',1],['生抽','半勺',1],['糖','少量',0]],[['炒锅','平底锅']],['五花肉下锅小火煸出油脂。','肉片微卷后推到一边，加入豆瓣酱炒香。','加入洋葱和青椒大火翻炒。','加少量生抽，按口味加一点糖。','青椒断生即可。']));
addR15(R('r33','青椒火腿炒蛋','🍳','蛋类',['快手','一人食'],10,'火腿肠、青椒和鸡蛋的快手搭配',[['火腿肠','2根','切片'],['青椒','1个','切块'],['鸡蛋','2个','打散']],[['食用油','适量',1],['盐','少量',1],['生抽','少量',0]],[['炒锅','平底锅']],['鸡蛋炒至刚凝固后盛出。','火腿肠煎至边缘微黄。','加入青椒翻炒至断生。','倒回鸡蛋，加盐翻匀。']));
addR15(R('r34','韭菜炒蛋','🌿','蛋类',['快手','家常'],10,'韭菜鲜香配嫩鸡蛋',[['韭菜','1把','洗净切段'],['鸡蛋','3个','打散']],[['食用油','适量',1],['盐','适量',1]],[['炒锅','平底锅']],['鸡蛋先炒至七八成熟盛出。','锅中补少量油，下韭菜快速翻炒。','韭菜变软后倒回鸡蛋。','加盐翻匀立即出锅。']));
addR15(R('r35','四季豆炒肉','🫛','肉菜',['家常','下饭'],20,'四季豆脆嫩，肉片鲜香',[['四季豆','250g','去筋掰段'],['猪肉','180g','切薄片'],['蒜','2瓣','切片']],[['食用油','适量',1],['生抽','1勺',1],['盐','适量',1],['蚝油','半勺',0]],[['炒锅']],['四季豆先煸炒或焯水至完全熟透。','盛出后炒猪肉至变色。','加入蒜片和四季豆。','加生抽和盐，大火翻匀。']));
addR15(R('r36','香菇青菜','🍄','素菜',['清淡','快手'],12,'香菇鲜味配清脆青菜',[['香菇','6朵','切片'],['青菜','1把','洗净沥干'],['蒜','2瓣','切片']],[['食用油','适量',1],['盐','适量',1],['蚝油','半勺',0]],[['炒锅','平底锅']],['香菇先下锅炒软。','加入蒜片炒香。','放入青菜大火翻炒。','加盐，可加少量蚝油。']));
addR15(R('r37','冬瓜肉末汤','🥣','汤炖',['清淡','省事'],18,'冬瓜清甜，肉末让汤更有鲜味',[['冬瓜','300g','去皮切片'],['肉末','120g','拨散'],['葱','少量','切葱花']],[['盐','适量',1],['胡椒','少量',0],['香油','少量',0]],[['汤锅']],['锅中水烧开，下冬瓜煮至半透明。','肉末分散放入汤中并轻轻拨开。','煮至肉末熟透。','加盐，出锅前可加胡椒和香油。']));
addR15(R('r38','白萝卜炖牛肉','🥣','汤炖',['暖胃','一锅'],50,'萝卜吸满牛肉汤汁，适合冷天',[['牛肉','300g','切块'],['白萝卜','半根','去皮切块'],['姜','3片','切片']],[['盐','适量',1],['生抽','1勺',0],['料酒','1勺',0],['胡椒','少量',0]],[['汤锅','电饭煲']],['牛肉焯水后洗净。','牛肉和姜片加热水炖约30分钟。','加入白萝卜继续炖15分钟。','最后加盐，可加生抽和胡椒调味。']));
addR15(R('r39','山药排骨汤','🥣','汤炖',['清淡','暖胃'],50,'山药软糯，排骨汤温和清爽',[['排骨','400g','焯水'],['山药','250g','去皮切段'],['姜','3片','切片']],[['盐','适量',1],['胡椒','少量',0]],[['汤锅','电饭煲']],['排骨焯水洗净。','排骨和姜片加热水先炖30分钟。','加入山药继续炖15分钟。','山药软熟后加盐即可。']));
addR15(R('r40','娃娃菜豆腐汤','🥬','汤炖',['清淡','省钱'],15,'娃娃菜清甜，豆腐软嫩',[['娃娃菜','1颗','切段'],['豆腐','半盒','切块'],['葱','少量','切葱花']],[['盐','适量',1],['胡椒','少量',0],['香油','少量',0]],[['汤锅']],['水烧开后加入豆腐煮3分钟。','放入娃娃菜。','煮至菜叶变软。','加盐，撒葱花即可。']));
addR15(R('r41','蒜蓉生菜','🥬','素菜',['快手','清淡'],7,'大火快炒，保留生菜爽脆',[['生菜','1颗','洗净沥干'],['蒜','3瓣','切末']],[['食用油','适量',1],['盐','适量',1],['蚝油','半勺',0]],[['炒锅','平底锅']],['锅烧热后加油和蒜末。','蒜香出来后立即放生菜。','大火快速翻炒。','加盐，喜欢可加蚝油，刚变软就出锅。']));
addR15(R('r42','蚝油油麦菜','🥬','素菜',['快手','家常'],8,'油麦菜脆嫩，蚝油提鲜',[['油麦菜','1把','洗净切段'],['蒜','2瓣','切末']],[['食用油','适量',1],['盐','少量',1],['蚝油','1勺',1]],[['炒锅','平底锅']],['锅热加油，下蒜末炒香。','加入油麦菜大火翻炒。','菜叶刚变软时加入蚝油。','按口味补少量盐。']));
addR15(R('r43','莲藕炒肉片','🪷','肉菜',['脆爽','家常'],15,'莲藕脆爽，搭配肉片很下饭',[['莲藕','1节','去皮切薄片'],['猪肉','180g','切薄片'],['青椒','1个','切块']],[['食用油','适量',1],['生抽','1勺',1],['盐','适量',1],['醋','少量',0]],[['炒锅','平底锅']],['肉片炒至变色后盛出。','莲藕片下锅大火翻炒。','加入青椒和肉片。','加生抽和盐，喜欢脆酸可点少量醋。']));
addR15(R('r44','木耳炒鸡蛋','🍳','蛋类',['快手','家常'],12,'木耳爽脆，鸡蛋柔软',[['木耳','1小把','泡发后洗净'],['鸡蛋','3个','打散'],['青椒','1个','切块']],[['食用油','适量',1],['盐','适量',1],['生抽','少量',0]],[['炒锅','平底锅']],['鸡蛋炒至刚熟盛出。','木耳和青椒下锅翻炒。','倒回鸡蛋。','加盐翻匀即可。']));
addR15(R('r45','海带豆腐汤','🥣','汤炖',['清淡','省钱'],18,'海带鲜味让豆腐汤更有层次',[['海带','150g','洗净切小片'],['豆腐','半盒','切块'],['葱','少量','切葱花']],[['盐','适量',1],['胡椒','少量',0],['香油','少量',0]],[['汤锅']],['海带加水煮约8分钟。','加入豆腐继续煮5分钟。','加盐调味。','撒葱花，可滴少量香油。']));
addR15(R('r46','花蛤蒸蛋','🥚','蛋类',['鲜味','清淡'],18,'花蛤鲜味融进嫩蒸蛋',[['花蛤','250g','吐沙洗净'],['鸡蛋','2个','打散']],[['盐','少量',1],['生抽','少量',0],['香油','少量',0]],[['蒸锅','电饭煲']],['花蛤先煮至开口，保留少量清汤。','蛋液加入温热花蛤汤搅匀。','花蛤摆入碗中，倒入蛋液。','盖盘或保鲜膜蒸至凝固。','出锅可加少量生抽和香油。']));
addR15(R('r47','青椒炒鱿鱼','🦑','肉菜',['快手','下饭'],15,'鱿鱼弹嫩，青椒清香',[['鱿鱼','250g','处理干净切条'],['青椒','2个','切块'],['姜','2片','切丝']],[['食用油','适量',1],['生抽','1勺',1],['盐','少量',1],['料酒','1勺',0]],[['炒锅']],['鱿鱼快速焯水至卷起后捞出。','锅热加油，下姜丝和青椒。','加入鱿鱼大火快炒。','加生抽和盐，迅速翻匀出锅。']));
addR15(R('r48','香煎鲈鱼','🐟','肉菜',['清淡','家常'],22,'外皮微焦，鱼肉保持鲜嫩',[['鲈鱼','1条','处理干净并擦干'],['姜','3片','切丝'],['葱','少量','切段']],[['食用油','适量',1],['盐','适量',1],['生抽','1勺',0],['料酒','少量',0]],[['平底锅','炒锅']],['鱼身两面抹少量盐并擦干。','锅热加油，放鱼中火煎至一面定型。','翻面继续煎熟。','加入姜葱，可沿锅边淋少量生抽。','确认鱼肉熟透后出锅。']));
addR15(R('r49','包菜炒年糕','🍚','主食',['一锅','省事'],15,'软糯年糕配脆爽包菜',[['年糕','250g','切片或条'],['包菜','半颗','撕小片'],['火腿肠','1根','切片']],[['食用油','适量',1],['生抽','1勺',1],['盐','少量',1]],[['炒锅','平底锅']],['年糕按包装说明先焯软并沥干。','火腿肠煎香，加入包菜翻炒。','加入年糕。','加生抽和盐，少量水翻炒至入味。']));
addR15(R('r50','酸辣粉丝','🍜','主食',['一人食','开胃'],12,'酸辣有味，一碗就能解决一顿',[['粉丝','1人份','提前泡软'],['青菜','1把','洗净'],['蒜','1瓣','切末']],[['盐','少量',1],['醋','1.5勺',1],['生抽','1勺',1],['豆瓣酱','半勺',0],['香油','少量',0]],[['汤锅']],['锅中加水煮开，加入粉丝。','粉丝变软后加入青菜。','碗中放蒜末、生抽、醋和盐。','连汤倒入碗中，喜欢辣味可加豆瓣酱。']));
addR15(R('r51','煮馄饨','🥟','半成品',['直接处理','省事'],10,'冷冻馄饨快速解决一顿饭',[['馄饨','1人份','冷冻可直接煮'],['青菜','少量','可一起煮']],[['盐','少量',1],['生抽','少量',0],['香油','少量',0]],[['汤锅']],['水烧开后下馄饨并轻推。','再次沸腾后转中火煮熟。','最后一分钟加入青菜。','汤中加少量盐，按喜好加生抽和香油。']));
addR15(R('r52','煮汤圆','⚪','半成品',['直接处理','甜口'],10,'简单煮熟就可以吃的甜口主食',[['汤圆','1人份','冷冻可直接煮']],[],[['汤锅']],['锅中水烧开。','下汤圆后轻轻推动避免粘底。','再次沸腾后转中火。','汤圆浮起并按包装建议时间煮熟即可。']));
addR15(R('r53','蒸馒头','🥯','半成品',['直接处理','早餐'],10,'冷冻或冷藏馒头快速加热',[['馒头','2个','冷冻可直接蒸']],[],[['蒸锅','电饭煲']],['锅中加入足量水。','馒头摆入蒸屉。','水开后蒸至中心热透。','关火后稍等片刻再开盖。']));
addR15(R('r54','馒头鸡蛋片','🍳','半成品',['二次加工','早餐'],12,'剩馒头裹蛋液煎成香脆早餐',[['馒头','1个','切约1cm厚片'],['鸡蛋','2个','打散']],[['食用油','少量',1],['盐','少量',1]],[['平底锅']],['蛋液加少量盐打匀。','馒头片两面快速蘸蛋液。','平底锅少量油，中小火煎馒头片。','两面金黄、蛋液熟透即可。']));
addR15(R('r55','鸭腿焖土豆','🍲','肉菜',['下饭','一锅'],40,'鸭腿和土豆焖到酱香软烂',[['鸭腿','2只','剁块或整只划刀'],['土豆','2个','切滚刀块'],['姜','3片','切片']],[['生抽','2勺',1],['盐','适量',1],['老抽','半勺',0],['料酒','1勺',0],['食用油','少量',0]],[['炒锅','汤锅']],['鸭腿煎出部分油脂并炒至表面微黄。','加入姜片和生抽。','加热水焖约20分钟。','加入土豆继续焖至软熟。','开盖收汁并补盐。']));
addR15(R('r56','肉末蒸蛋','🥚','蛋类',['清淡','下饭'],18,'嫩蒸蛋上铺肉末，一碗很有满足感',[['鸡蛋','3个','打散'],['肉末','120g','拨散'],['葱','少量','切葱花']],[['盐','少量',1],['生抽','半勺',1],['香油','少量',0]],[['蒸锅','电饭煲']],['蛋液加温水和少量盐搅匀。','盖盘蒸至基本凝固。','肉末炒熟后加少量生抽。','把肉末铺在蒸蛋上，再蒸2分钟。','撒葱花即可。']));
addR15(R('r57','蒜香金针菇','🍄','素菜',['快手','省钱'],12,'金针菇吸满蒜香酱汁',[['金针菇','1把','去根洗净'],['蒜','4瓣','切末'],['葱','少量','切葱花']],[['食用油','少量',1],['生抽','1勺',1],['盐','少量',1],['蚝油','半勺',0]],[['平底锅','炒锅']],['少量油炒香蒜末。','加入金针菇翻炒至变软出水。','加入生抽和少量盐。','收掉多余水分，撒葱花。']));
addR15(R('r58','西兰花炒牛肉','🥦','肉菜',['高蛋白','快手'],18,'牛肉配西兰花，清爽又下饭',[['牛肉','200g','切薄片'],['西兰花','半颗','切小朵'],['蒜','2瓣','切片']],[['食用油','适量',1],['生抽','1勺',1],['盐','少量',1],['蚝油','半勺',0],['淀粉','少量',0]],[['炒锅','平底锅']],['西兰花焯水至断生后沥干。','牛肉大火快速炒至变色。','加入蒜片和西兰花。','加生抽和盐，快速翻匀出锅。']));
addR15(R('r59','番茄鸡蛋面','🍜','主食',['一人食','快手'],15,'番茄鸡蛋汤底配面条，简单完整',[['挂面','1人份','按食量取'],['番茄','1个','切块'],['鸡蛋','1个','打散'],['青菜','少量','洗净']],[['盐','适量',1],['食用油','少量',1],['生抽','少量',0]],[['汤锅']],['少量油把番茄炒软出汁。','加水烧开后下挂面。','面条接近熟时淋入蛋液。','加入青菜和盐，煮熟即可。']));
addR15(R('r60','白菜炖豆腐','🥬','汤炖',['省钱','一锅'],20,'白菜炖到软甜，豆腐吸满汤汁',[['白菜','半颗','切段'],['豆腐','1盒','切块'],['葱','少量','切段']],[['盐','适量',1],['生抽','半勺',0],['胡椒','少量',0]],[['汤锅','炒锅']],['白菜先下锅炒软或直接加少量水煮。','加入豆腐和热水。','盖盖炖约10分钟。','最后加盐，喜欢可加胡椒。']));
addR15(R('r61','黄瓜拌木耳','🥒','素菜',['凉菜','清爽'],10,'脆爽开胃，不需要开火炒菜',[['黄瓜','1根','拍碎切段'],['木耳','1小把','泡发并焯熟'],['蒜','2瓣','切末']],[['盐','适量',1],['醋','1勺',1],['生抽','半勺',1],['香油','少量',0],['糖','少量',0]],[],['木耳泡发后焯熟并过凉水。','黄瓜拍碎切段。','加入蒜末、生抽、醋和盐。','拌匀后静置几分钟即可。']));
addR15(R('r62','香肠炒饭','🍚','主食',['快手','清库存'],12,'香肠和剩米饭的快手组合',[['大米','1碗熟米饭','冷饭更容易炒散'],['香肠','1根','切丁'],['鸡蛋','1个','打散'],['葱','少量','切葱花']],[['食用油','少量',1],['盐','少量',1],['生抽','少量',0]],[['炒锅','平底锅']],['鸡蛋炒散后盛出。','香肠丁煎香。','加入米饭炒散。','倒回鸡蛋，加盐翻匀，最后撒葱花。']));
addR15(R('r63','虾仁滑蛋','🦐','蛋类',['高蛋白','快手'],10,'虾仁鲜嫩，鸡蛋保持柔软滑嫩',[['虾仁','180g','擦干水分'],['鸡蛋','3个','打散'],['葱','少量','切葱花']],[['食用油','适量',1],['盐','适量',1],['料酒','少量',0]],[['炒锅','平底锅']],['虾仁炒至刚变色后盛出。','蛋液加盐打匀。','小火倒入蛋液，加入虾仁。','轻轻推炒至大部分凝固，撒葱花出锅。']));
addR15(R('r64','番茄虾仁','🍅','肉菜',['快手','酸甜'],15,'番茄酸甜包裹鲜嫩虾仁',[['番茄','2个','切块'],['虾仁','200g','擦干水分'],['蒜','1瓣','切末']],[['食用油','适量',1],['盐','适量',1],['糖','少量',0],['番茄酱','半勺',0]],[['炒锅','平底锅']],['虾仁先炒至变色后盛出。','蒜末和番茄下锅炒软出汁。','可加半勺番茄酱增强味道。','倒回虾仁，加盐翻匀即可。']));
addR15(R('r65','鸡翅土豆焖锅','🍲','肉菜',['一锅','下饭'],35,'鸡翅和土豆一锅焖熟，省事下饭',[['鸡翅','6个','两面划刀'],['土豆','2个','切块'],['洋葱','半个','切块']],[['生抽','1.5勺',1],['盐','适量',1],['老抽','少量',0],['食用油','少量',1]],[['炒锅','平底锅']],['鸡翅煎至两面微黄。','加入洋葱和土豆翻炒。','加生抽和热水至食材一半高度。','盖盖中小火焖至鸡翅熟透、土豆软烂。','开盖收汁。']));
addR15(R('r66','红薯粥','🍠','主食',['早餐','清淡'],35,'红薯自然甜味融进米粥',[['红薯','1个','去皮切小块'],['大米','半杯','淘洗']],[['糖','少量',0]],[['汤锅','电饭煲']],['大米和红薯一起加水。','煮开后转小火。','煮至米粒开花、红薯软烂。','喜欢甜味可加少量糖。']));
addR15(R('r67','玉米胡萝卜排骨汤','🌽','汤炖',['清甜','一锅'],55,'玉米和胡萝卜让排骨汤自然清甜',[['排骨','400g','焯水'],['玉米','1根','切段'],['胡萝卜','1根','切块'],['姜','3片','切片']],[['盐','适量',1],['胡椒','少量',0]],[['汤锅','电饭煲']],['排骨焯水洗净。','所有主料加热水入锅。','煮开后转小火炖约45分钟。','最后加盐即可。']));
addR15(R('r68','蒜香花蛤','🐚','肉菜',['快手','鲜味'],12,'花蛤开口就熟，蒜香鲜味很足',[['花蛤','500g','吐沙洗净'],['蒜','4瓣','切末'],['葱','少量','切段']],[['食用油','少量',1],['生抽','半勺',0],['料酒','1勺',0],['盐','少量',0]],[['炒锅']],['锅热加少量油炒香蒜末。','倒入花蛤大火翻炒。','加少量料酒并盖盖1至2分钟。','花蛤基本开口后撒葱段，按口味加生抽。']));
addR15(R('r69','香菇蒸鸡','🍗','肉菜',['清淡','省事'],25,'鸡肉和香菇一起蒸，鲜味集中',[['鸡腿肉','300g','切小块'],['香菇','6朵','切片'],['姜','3片','切丝']],[['生抽','1勺',1],['盐','少量',1],['淀粉','少量',0],['香油','少量',0]],[['蒸锅','电饭煲']],['鸡腿肉加生抽和盐拌匀。','加入香菇和姜丝。','装盘后放入蒸锅。','水开后蒸约15至18分钟，确认鸡肉熟透。']));
addR15(R('r70','娃娃菜粉丝煲','🥬','汤炖',['一锅','暖胃'],18,'娃娃菜清甜，粉丝吸满汤汁',[['娃娃菜','1颗','切段'],['粉丝','1把','提前泡软'],['豆腐','半盒','切块'],['蒜','2瓣','切末']],[['盐','适量',1],['生抽','1勺',1],['蚝油','半勺',0],['香油','少量',0]],[['汤锅','炒锅']],['蒜末炒香后放入娃娃菜。','加入豆腐和适量热水煮开。','放入泡软粉丝。','加生抽和盐，煮至粉丝透明入味。']));

if(typeof state.manageQuery!=='string')state.manageQuery='';

const FOOD_GROUPS_15={
  '肉蛋水产':['鸡腿肉','鸡胸肉','猪肉','牛肉','虾仁','鱼片','香肠','培根','鸡蛋','鸭腿','鸡翅','排骨','五花肉','肉末','火腿肠','鱿鱼','花蛤','鲈鱼'],
  '蔬菜菌菇':['豆腐','番茄','土豆','包菜','白菜','青菜','菠菜','西兰花','蘑菇','金针菇','青椒','洋葱','胡萝卜','黄瓜','茄子','芹菜','豆芽','玉米','南瓜','红薯','葱','姜','蒜','莲藕','冬瓜','白萝卜','山药','娃娃菜','生菜','油麦菜','韭菜','四季豆','香菇','木耳','海带'],
  '主食与其他':['大米','挂面','面包','牛奶','粉丝','年糕','可乐'],
  '半成品':['水饺','包子','手抓饼','馄饨','汤圆','馒头']
};
function foodGroup15(name){
  const extra=window.MK_EXTRA_CATALOG?.foodGroups?.[name];
  if(extra)return extra;
  for(const [g,names] of Object.entries(FOOD_GROUPS_15))if(names.includes(name))return g;
  return '主食与其他';
}
function enhanceIngredientGroups15(){
  if(state.prep||state.boardMode!=='ingredients'||state.foodQuery.trim())return;
  const sections=[...document.querySelectorAll('.intent-section')];
  const other=sections.find(s=>s.querySelector('.intent-section-head b')?.textContent.trim()==='其他食材');
  if(!other)return;
  const grid=other.querySelector('.intent-food-grid');
  if(!grid)return;
  const buttons=[...grid.querySelectorAll('.intent-food')];
  if(buttons.length<16)return;
  const wrap=document.createElement('div');
  wrap.className='intent-subgroups';
  Object.keys(FOOD_GROUPS_15).forEach(group=>{
    const items=buttons.filter(b=>foodGroup15(b.dataset.matchFood)===group);
    if(!items.length)return;
    const block=document.createElement('div');
    block.className='intent-subgroup';
    const head=document.createElement('div');
    head.className='intent-subgroup-head';
    head.innerHTML=`<span>${group}</span><small>${items.length}</small>`;
    const subgrid=document.createElement('div');
    subgrid.className='intent-food-subgrid';
    items.forEach(b=>subgrid.appendChild(b));
    block.append(head,subgrid);
    wrap.appendChild(block);
  });
  grid.replaceWith(wrap);
}

const boardV0115Base=board;
board=function(){
  boardV0115Base();
  enhanceIngredientGroups15();
};

manageModal=function(tab='food'){
  const kind=tab==='semi'?'food':tab;
  const allNames=tab==='food'?Object.keys(FOOD).filter(n=>!SEMI_PREPARED.includes(n)):tab==='semi'?SEMI_PREPARED:tab==='seasoning'?SEASON:TOOLS;
  const searchable=tab==='food'||tab==='semi';
  const query=searchable?state.manageQuery.trim():'';
  const names=allNames.filter(n=>!query||n.includes(query));
  const icon=n=>kind==='food'?FOOD[n]:kind==='seasoning'?'🧂':'🍳';
  q('#modal').innerHTML=`<div class="modal"><div class="sheet"><div class="sheet-handle"></div><div class="sheet-head"><div class="title"><b>厨房物品</b><small>${tab==='food'?'常用食材':tab==='semi'?'半成品':tab==='seasoning'?'调味料':'厨具'}</small></div><button class="icon-close" id="x">×</button></div><div class="manage-tabs"><button data-tab="food" class="${tab==='food'?'on':''}">食材</button><button data-tab="semi" class="${tab==='semi'?'on':''}">半成品</button><button data-tab="seasoning" class="${tab==='seasoning'?'on':''}">调味料</button><button data-tab="tool" class="${tab==='tool'?'on':''}">厨具</button></div>${searchable?`<div class="manage-search-row"><input id="manageSearch" class="search" placeholder="搜索${tab==='semi'?'半成品':'食材'}" value="${state.manageQuery}"><small>${names.length}/${allNames.length}</small></div>`:''}<div class="picker-grid manage-picker">${names.length?names.map(n=>`<button class="pick ${has(kind,n)?'on':''}" data-pick="${kind}|${n}">${icon(n)} ${n}</button>`).join(''):'<div class="empty">没有找到</div>'}</div><div class="sheet-footer"><button class="secondary" id="back" style="width:100%">返回冰箱</button></div></div></div>`;
  const back=()=>{state.manageQuery='';save();close();render()};
  q('#x').onclick=back;q('#back').onclick=back;
  const search=q('#manageSearch');
  if(search)search.oninput=e=>{state.manageQuery=e.target.value;save();manageModal(tab)};
  qa('[data-tab]').forEach(b=>b.onclick=()=>{state.manageQuery='';save();manageModal(b.dataset.tab)});
  qa('[data-pick]').forEach(b=>b.onclick=()=>{const[k,n]=b.dataset.pick.split('|');has(k,n)?missing(k,n):have(k,n);manageModal(tab)});
};

save();
render();

;


/* ===== patch-v0116.js ===== */
// V0.1.16 visual-density refinement after mobile screenshot review
state.version='0.1.16';
if(typeof state.manageFoodGroup!=='string'||!['肉蛋水产','蔬菜菌菇','主食与其他'].includes(state.manageFoodGroup))state.manageFoodGroup='肉蛋水产';
save();

function collapseIngredientGroups16(){
  if(state.prep||state.boardMode!=='ingredients'||state.foodQuery.trim())return;
  qa('.intent-subgroup').forEach(block=>{
    const head=block.querySelector('.intent-subgroup-head');
    const grid=block.querySelector('.intent-food-subgrid');
    if(!head||!grid)return;
    const hasSelected=!!grid.querySelector('.intent-food.intent-on');
    block.classList.toggle('collapsed',!hasSelected);
    head.setAttribute('role','button');
    head.setAttribute('tabindex','0');
    const refreshChevron=()=>{
      let chev=head.querySelector('.intent-subgroup-chevron');
      if(!chev){chev=document.createElement('i');chev.className='intent-subgroup-chevron';head.appendChild(chev)}
      chev.textContent=block.classList.contains('collapsed')?'⌄':'⌃';
    };
    refreshChevron();
    const toggle=()=>{block.classList.toggle('collapsed');refreshChevron()};
    head.onclick=toggle;
    head.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();toggle()}};
  });
}

const boardV0116Base=board;
board=function(){
  boardV0116Base();
  collapseIngredientGroups16();
};

manageModal=function(tab='food'){
  const kind=tab==='semi'?'food':tab;
  const allNames=tab==='food'?Object.keys(FOOD).filter(n=>!SEMI_PREPARED.includes(n)):tab==='semi'?SEMI_PREPARED:tab==='seasoning'?SEASON:TOOLS;
  const searchable=tab==='food'||tab==='semi';
  const query=searchable?state.manageQuery.trim():'';
  let names=allNames.filter(n=>!query||n.includes(query));
  if(tab==='food'&&!query)names=names.filter(n=>foodGroup15(n)===state.manageFoodGroup);
  const icon=n=>kind==='food'?FOOD[n]:kind==='seasoning'?'🧂':'🍳';
  const foodGroups=['肉蛋水产','蔬菜菌菇','主食与其他'];
  q('#modal').innerHTML=`<div class="modal"><div class="sheet"><div class="sheet-handle"></div><div class="sheet-head"><div class="title"><b>厨房物品</b><small>${tab==='food'?'常用食材':tab==='semi'?'半成品':tab==='seasoning'?'调味料':'厨具'}</small></div><button class="icon-close" id="x">×</button></div><div class="manage-tabs"><button data-tab="food" class="${tab==='food'?'on':''}">食材</button><button data-tab="semi" class="${tab==='semi'?'on':''}">半成品</button><button data-tab="seasoning" class="${tab==='seasoning'?'on':''}">调味料</button><button data-tab="tool" class="${tab==='tool'?'on':''}">厨具</button></div>${searchable?`<div class="manage-search-row"><input id="manageSearch" class="search" placeholder="搜索${tab==='semi'?'半成品':'食材'}" value="${state.manageQuery}"><small>${names.length}/${allNames.length}</small></div>`:''}${tab==='food'&&!query?`<div class="manage-food-groups">${foodGroups.map(g=>`<button data-food-group="${g}" class="${state.manageFoodGroup===g?'on':''}">${g}</button>`).join('')}</div>`:''}<div class="picker-grid manage-picker">${names.length?names.map(n=>`<button class="pick ${has(kind,n)?'on':''}" data-pick="${kind}|${n}">${icon(n)} ${n}</button>`).join(''):'<div class="empty">没有找到</div>'}</div><div class="sheet-footer"><button class="secondary" id="back" style="width:100%">返回冰箱</button></div></div></div>`;
  const back=()=>{state.manageQuery='';save();close();render()};
  q('#x').onclick=back;q('#back').onclick=back;
  const search=q('#manageSearch');
  if(search)search.oninput=e=>{state.manageQuery=e.target.value;save();manageModal(tab)};
  qa('[data-tab]').forEach(b=>b.onclick=()=>{state.manageQuery='';save();manageModal(b.dataset.tab)});
  qa('[data-food-group]').forEach(b=>b.onclick=()=>{state.manageFoodGroup=b.dataset.foodGroup;save();manageModal('food')});
  qa('[data-pick]').forEach(b=>b.onclick=()=>{const[k,n]=b.dataset.pick.split('|');has(k,n)?missing(k,n):have(k,n);manageModal(tab)});
};

render();

;
