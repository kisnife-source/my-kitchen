import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {execFileSync} from 'node:child_process';

const sourceRoot=path.resolve(process.argv[2]||'/tmp/CookLikeHOC');
const outFile=path.resolve(process.argv[3]||'hoc-recipes.generated.js');
const reportFile=path.resolve('hoc-sync-report.json');
const SOURCE_REPO='Gar-b-age/CookLikeHOC';
const SOURCE_BASE='https://github.com/Gar-b-age/CookLikeHOC/blob/main/';
const SOURCE_DIRS=['主食','凉拌','卤菜','早餐','汤','炒菜','炖菜','炸品','烤类','烫菜','煮锅','砂锅菜','蒸菜','配料','饮品'];
if(!fs.existsSync(sourceRoot))throw new Error(`CookLikeHOC source not found: ${sourceRoot}`);

function walk(dir){
  const result=[];
  if(!fs.existsSync(dir))return result;
  for(const ent of fs.readdirSync(dir,{withFileTypes:true})){
    const p=path.join(dir,ent.name);
    if(ent.isDirectory())result.push(...walk(p));
    else if(ent.isFile()&&ent.name.toLowerCase().endsWith('.md')&&ent.name.toLowerCase()!=='readme.md')result.push(p);
  }
  return result;
}
function stripMd(s=''){
  return s.replace(/<!--.*?-->/g,'').replace(/!\[[^\]]*\]\([^)]*\)/g,'').replace(/\[([^\]]+)\]\([^)]+\)/g,'$1').replace(/[*_`>#]/g,'').replace(/<[^>]+>/g,'').replace(/\s+/g,' ').trim();
}
function headingIndex(lines,matcher){
  return lines.findIndex(line=>{const m=line.match(/^##\s+(.+)$/);return !!m&&matcher(stripMd(m[1]))});
}
function sectionLines(lines,startIndex){
  if(startIndex<0)return [];
  const out=[];
  for(let i=startIndex+1;i<lines.length;i++){if(/^##\s+/.test(lines[i]))break;out.push(lines[i])}
  return out;
}
function bulletValues(lines){
  const out=[];
  for(const raw of lines){
    const line=raw.trim();
    if(!line||line.startsWith('![')||line.startsWith('<!--')||/^#{1,6}\s+/.test(line))continue;
    let m=line.match(/^[-*+]\s+(?:\d+[.、)]\s*)?(.+)$/);if(!m)m=line.match(/^\d+[.、)]\s*(.+)$/);
    if(m){const v=stripMd(m[1]).replace(/[；;。]+$/,'').trim();if(v)out.push(v)}
  }
  return out;
}
function safeName(s){return stripMd(s).replace(/["'<>|]/g,'').replace(/\s+/g,' ').trim()}

const aliases=new Map([
  ['大豆油','食用油'],['食用调和油','食用油'],['调和油','食用油'],['色拉油','食用油'],['菜籽油','食用油'],
  ['食盐','盐'],['精盐','盐'],['白砂糖','糖'],['白糖','糖'],
  ['西红柿','番茄'],['圆包菜','包菜'],['土鸡蛋','鸡蛋'],['鲜鸡蛋','鸡蛋'],['鸡蛋液','鸡蛋'],
  ['生姜','姜'],['姜片','姜'],['大蒜','蒜'],['蒜米','蒜'],['蒜子','蒜'],['拍蒜','蒜'],['香葱','葱'],['小葱','葱'],['大葱','葱'],['京葱','葱'],['葱段','葱'],['葱花','葱'],
  ['鸡丁','鸡腿肉'],['鸡块','鸡腿肉'],['去骨鸡腿肉','鸡腿肉'],['鸡胸丁','鸡胸肉'],['鸡胸肉片','鸡胸肉'],['调理鸡胸肉','鸡胸肉'],
  ['调理牛肉片','牛肉'],['牛肉片','牛肉'],['牛肉丝','牛肉'],['调理肉片','猪肉'],['调理肉丝','猪肉'],['猪肉丝','猪肉'],['猪肉片','猪肉'],['肉片','猪肉'],['肉丝','猪肉'],['瘦肉片','猪肉'],['瘦肉块','猪肉'],
  ['五花肉块','五花肉'],['五花肉片','五花肉'],['胡萝卜丝','胡萝卜'],['胡萝卜片','胡萝卜'],['芹菜段','芹菜'],['西芹段','西芹'],['土豆片','土豆'],['土豆丝','土豆'],['莴笋片','莴笋'],['莴笋丝','莴笋'],['黄瓜片','黄瓜'],['螺丝椒块','螺丝椒'],['鸡胗片','鸡胗'],['罗汉笋块','罗汉笋']
]);
function rawTerm(raw){
  let s=stripMd(raw).replace(/^\d+(?:\.\d+)?\s*(?:kg|g|克|千克|斤|ml|mL|毫升|L|升|个|只|枚|片|根|颗|块|张|勺|份|包|袋|盒|碗|杯|瓶)\s*/i,'').trim();
  s=s.replace(/（来自[^）]*）/g,'').replace(/\(来自[^)]*\)/g,'').trim();
  return safeName((s.split(/[（(]/)[0]||s).trim());
}
function normalizeCutForm(s){
  const m=s.match(/^(.{1,12}?)(丁|片|丝|段|块|末)$/);if(!m)return s;
  const base=m[1];
  if(/(胡萝卜|土豆|莴笋|黄瓜|青椒|红椒|螺丝椒|芹菜|西芹|白菜|包菜|葱|姜|蒜|五花肉|牛肉|猪肉|鸡肉|鸡腿肉|鸡胸肉|鸡胗|豆腐|西兰花|花菜|萝卜|罗汉笋)/.test(base))return base;
  return s;
}
function ingredientBase(raw){
  let s=rawTerm(raw).replace(/^(新鲜|鲜|熟制|冷冻|冷藏)\s*/,'').trim();
  s=aliases.get(s)||s;s=normalizeCutForm(s);return safeName(s);
}
function ingredientPrep(raw,canonical){
  const cleaned=stripMd(raw).replace(/（来自[^）]*）/g,'').replace(/\(来自[^)]*\)/g,'').trim();
  if(!cleaned||cleaned===canonical)return '按来源配方准备';
  return `源配方：${safeName(cleaned)}`;
}
function expandIngredientBullets(items){
  const out=[];
  for(const raw of items){
    const cleaned=stripMd(raw);
    const generic=cleaned.match(/^(?:配菜|时蔬|蔬菜)[（(]([^）)]+)[）)]/);
    if(generic){out.push(...generic[1].split(/[、，,]/).map(x=>x.replace(/等$/,'').trim()).filter(Boolean));continue}
    if(!/[（(]/.test(cleaned)&&/[、，]/.test(cleaned)&&cleaned.length<90){out.push(...cleaned.split(/[、，,]/).map(x=>x.replace(/等$/,'').trim()).filter(Boolean));continue}
    out.push(raw);
  }
  return out;
}
function looksLikeIngredient(raw){
  const s=stripMd(raw);
  if(!s||s.length>90)return false;
  if(/^(将|把|在|用|取|先|再|最后|清洗|洗净|加入|放入|倒入|下入|投入)/.test(s))return false;
  if(/(浸泡|清洗|备用|磨制|煮制|蒸制|炸制|翻炒|烧开|搅拌|装盘|出锅|来自[^）)]*$|无特别说明|皆来自)/.test(s))return false;
  return true;
}
function ignoredIngredient(name){return /^(水|清水|热水|饮用水|农夫山泉)$/.test(name)}

function isSeasoning(name,category){
  if(category==='饮品')return false;
  if(/(果汁|椰汁|奶|茶|饮料)$/.test(name))return false;
  return [
    /油$/,/(食用油|大豆油|菜籽油|调和油|芝麻油|香油|麻油|猪油)/,/盐$/,/(白糖|白砂糖|冰糖|红糖|糖$)/,
    /(生抽|老抽|酱油|蚝油|料酒|黄酒|醋$|陈醋|香醋|米醋)/,/(淀粉|胡椒|花椒|孜然|味精|鸡精|椒盐|辣椒面|辣椒粉|五香粉|十三香|芝麻$)/,
    /酱$/,/(豆瓣酱|番茄酱|辣椒酱|甜面酱|黄豆酱|沙茶酱|芝麻酱|花生酱|调味酱|复合酱|酱汁|酱料)/,
    /(泡椒|剁椒|干红椒|干辣椒|干红辣椒|辣椒段|辣椒油|红油)/,/(汤料|底料|调味料|调味粉|卤料|香辛料|蜂蜜|麦芽糖)/,
    /料$/,/(调味汁|鸡汁|姜汁|花椒汁|豉油汁|蒸鱼汁|风味汁|烧肉汁|糖醋汁)$/,/汁$/
  ].some(r=>r.test(name))&&!/(粉丝|米粉|河粉|凉粉|淀粉肠|料理)/.test(name);
}
function foodGroup(name){
  if(/奶/.test(name))return '主食与其他';
  if(/(鸡|鸭|鹅|猪|肉|排骨|肋排|大排|肥肠|猪肚|牛|羊|鱼|虾|蟹|蛤|贝|鱿鱼|蛋|肠|火腿|培根)/.test(name))return '肉蛋水产';
  if(/(菜|青|白菜|菠菜|生菜|芹|笋|瓜|萝卜|豆芽|豆角|四季豆|毛豆|蚕豆|土豆|山药|藕|茄|椒|葱|姜|蒜|菇|菌|木耳|海带|花菜|西兰花|玉米|香椿|韭|芋|莴笋|蔬)/.test(name))return '蔬菜菌菇';
  return '主食与其他';
}
function foodEmoji(name){
  if(/奶/.test(name))return '🥛'; if(/鸡蛋干|豆腐|香干|豆干|豆皮/.test(name))return '⬜'; if(/蛋/.test(name))return '🥚';
  if(/虾/.test(name))return '🦐';if(/鱼/.test(name))return '🐟';if(/蟹/.test(name))return '🦀';if(/蛤|贝/.test(name))return '🐚';
  if(/鸡/.test(name))return '🍗';if(/鸭|鹅/.test(name))return '🦆';if(/猪|肉|排骨|大排|肥肠|猪肚|肠|火腿|培根/.test(name))return '🥩';if(/牛|羊/.test(name))return '🥩';
  if(/番茄|西红柿/.test(name))return '🍅';if(/土豆|山药|芋/.test(name))return '🥔';if(/萝卜|胡萝卜/.test(name))return '🥕';if(/茄/.test(name))return '🍆';
  if(/小米辣|辣椒/.test(name))return '🌶️';if(/椒/.test(name))return '🫑';if(/玉米/.test(name))return '🌽';if(/菇|菌|木耳/.test(name))return '🍄';if(/藕/.test(name))return '🪷';if(/瓜/.test(name))return '🥒';
  if(name==='姜')return '🫚';if(name==='蒜')return '🧄';if(/米饭|大米|米$|饭$|年糕/.test(name))return '🍚';if(/面|粉丝|米线|粉$/.test(name))return '🍜';
  if(/包子|饺|馄饨|馒头|饼|油条/.test(name))return '🥟';if(/豆浆|饮|茶|汁/.test(name))return '🥤';if(/菜|笋|菠菜|生菜|莴笋|芹|葱|韭|海带/.test(name))return '🥬';return '🥣';
}
function recipeIcon(name,category,foods){
  if(['汤','炖菜','砂锅菜','煮锅'].includes(category))return '🥣';if(category==='饮品')return '🥤';if(['主食','早餐'].includes(category))return /面|粉|米线/.test(name)?'🍜':'🍚';if(category==='炸品')return '🍤';if(category==='烤类')return '🔥';if(category==='蒸菜')return '♨️';return foodEmoji(foods[0]||name);
}
function inferCat(category,foodNames){
  if(['汤','炖菜','砂锅菜','煮锅'].includes(category))return '汤炖';if(['主食','早餐','饮品'].includes(category))return '主食';if(category==='配料')return '半成品';
  const joined=foodNames.join(' ');if(/(鸡|鸭|鹅|猪|肉|排骨|大排|肥肠|猪肚|牛|羊|鱼|虾|蟹|蛤|贝|鱿鱼|肠|火腿|培根)/.test(joined))return '肉菜';if(/蛋/.test(joined))return '蛋类';return '素菜';
}
function inferTools(category,steps){
  const t=steps.join('');if(['凉拌','饮品','配料'].includes(category))return [];if(category==='蒸菜'||/蒸/.test(t))return [['蒸锅']];if(category==='烤类'||/烤/.test(t))return [['烤箱','空气炸锅']];if(category==='炸品'||/油炸|炸至|炸制/.test(t))return [['炒锅','汤锅']];if(category==='炒菜'||/翻炒|炒至|煸炒|爆炒/.test(t))return [['炒锅','平底锅']];if(['卤菜','汤','炖菜','煮锅','砂锅菜'].includes(category)||/炖|煮|焖|卤|汆|烫/.test(t))return [['汤锅','电饭煲']];if(/煎/.test(t))return [['平底锅']];return [['炒锅','平底锅','汤锅']];
}
function defaultMinutes(category,steps){
  const text=steps.join(' ');const mins=[...text.matchAll(/(\d+(?:\.\d+)?)\s*(?:分钟|min)/gi)].map(m=>Number(m[1]));const secs=[...text.matchAll(/(\d+(?:\.\d+)?)\s*秒/g)].map(m=>Number(m[1])/60);const explicit=Math.ceil(mins.reduce((a,b)=>a+b,0)+secs.reduce((a,b)=>a+b,0));const base={凉拌:10,卤菜:45,早餐:15,汤:40,炒菜:15,炖菜:45,炸品:20,烤类:30,烫菜:15,煮锅:25,砂锅菜:35,蒸菜:25,主食:25,配料:10,饮品:5}[category]||20;return Math.max(base,Math.min(120,explicit||0));
}

const unitPattern='(?:kg|千克|g|克|斤|ml|mL|毫升|L|升|个|只|枚|片|根|颗|块|张|勺|份|包|袋|盒|碗|杯|瓶)';
function escapeRegExp(s){return s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')}
function amountOccurrences(raw,canonical,steps){
  const candidates=[rawTerm(raw),canonical].filter(Boolean).filter((x,i,a)=>a.indexOf(x)===i).sort((a,b)=>b.length-a.length);
  const found=[];
  for(const token of candidates){
    const re=new RegExp(`(\\d+(?:\\.\\d+)?)\\s*(${unitPattern})\\s*(?:的)?${escapeRegExp(token)}(?![\\u4e00-\\u9fffA-Za-z0-9])`,'gi');
    for(const m of steps.join(' ').matchAll(re))found.push({num:Number(m[1]),unit:m[2],token,index:m.index||0});
  }
  found.sort((a,b)=>a.index-b.index);return found;
}
function bulletAmount(raw){const m=stripMd(raw).match(new RegExp(`(\\d+(?:\\.\\d+)?)\\s*(${unitPattern})`,'i'));return m?{num:Number(m[1]),unit:m[2]}:null}
function chooseAmount(raw,canonical,steps){return amountOccurrences(raw,canonical,steps)[0]||bulletAmount(raw)}
function grams(a){if(!a)return null;const u=a.unit.toLowerCase();if(u==='kg'||a.unit==='千克')return a.num*1000;if(a.unit==='斤')return a.num*500;if(u==='g'||a.unit==='克')return a.num;return null}
function homeScale(records){const weights=records.filter(x=>!x.seasoning).map(x=>grams(x.amount)).filter(x=>x&&x>0);const max=weights.length?Math.max(...weights):0;return max>650?Math.max(.06,400/max):1}
function roundScaled(n){if(n>=100)return Math.max(1,Math.round(n/10)*10);if(n>=20)return Math.max(1,Math.round(n/5)*5);if(n>=5)return Math.max(1,Math.round(n));return Math.max(.5,Math.round(n*2)/2)}
function scaledAmount(amount,scale,complex){
  if(complex)return '见步骤';if(!amount)return '适量';let {num,unit}=amount;if(scale<.999)num=roundScaled(num*scale);if(unit==='克')unit='g';if(unit==='千克')unit='kg';if(unit==='毫升')unit='ml';return `${Number.isInteger(num)?num:Number(num.toFixed(1))}${unit}`;
}
function scaleStepNumbers(text,scale){
  if(scale>=.999)return text;return text.replace(new RegExp(`(\\d+(?:\\.\\d+)?)\\s*(${unitPattern})`,'gi'),(all,n,u)=>{const val=roundScaled(Number(n)*scale);let unit=u;if(unit==='克')unit='g';if(unit==='千克')unit='kg';if(unit==='毫升')unit='ml';return `${Number.isInteger(val)?val:Number(val.toFixed(1))}${unit}`});
}
function adaptClause(s){return s.replace(/^\d+[.、)]\s*/,'').replace(/均匀翻炒|翻炒均匀/g,'炒匀').replace(/煸炒/g,'炒').replace(/下入|投入|倒入/g,'加入').replace(/进行/g,'').replace(/即可出锅|即可盛出/g,'出锅').replace(/出锅前/g,'最后').replace(/烧开后/g,'煮开后').replace(/\s+/g,' ').trim()}
function adaptSteps(rawSteps,scale,incomplete,category,complex){
  if(!rawSteps.length){if(category==='饮品')return ['按包装要求保存；需要饮用时直接取用。'];if(incomplete)return ['来源记录未公开完整配比或制作步骤；可打开原始记录查看已知信息。'];return ['来源记录没有提供独立的完整制作步骤；请打开原始记录核对。']}
  const out=[];for(const raw of rawSteps){const scaled=complex?raw:scaleStepNumbers(raw,scale);for(const p of scaled.split(/[；;。]+/).map(adaptClause).filter(Boolean)){if(p.length>72){const chunks=p.split(/，/).map(x=>x.trim()).filter(Boolean);out.push(...(chunks.length>1?chunks:[p]))}else out.push(p)}}return out.map(x=>/[。！？]$/.test(x)?x:`${x}。`);
}
function sourceUrl(rel){return SOURCE_BASE+rel.split('/').map(encodeURIComponent).join('/')}

const foods={},foodGroups={};const seasonings=new Set(),recipes=[],warnings=[];let sourceCommit='unknown';
try{sourceCommit=execFileSync('git',['-C',sourceRoot,'rev-parse','HEAD'],{encoding:'utf8'}).trim()}catch{}
const files=SOURCE_DIRS.flatMap(d=>walk(path.join(sourceRoot,d))).sort((a,b)=>a.localeCompare(b,'zh-CN'));
for(const file of files){
  const rel=path.relative(sourceRoot,file).split(path.sep).join('/');const category=rel.split('/')[0];const md=fs.readFileSync(file,'utf8');const lines=md.split(/\r?\n/);const title=(lines.find(l=>/^#\s+/.test(l))||'').replace(/^#\s+/,'').trim()||path.basename(file,'.md');
  const ingStart=headingIndex(lines,h=>/(配料|原料|食材|材料|成分|组成)/.test(h));const stepStart=headingIndex(lines,h=>/(步骤|做法|制作|流程)/.test(h));const stepSection=sectionLines(lines,stepStart);const complex=stepSection.some(l=>/^###\s+/.test(l));
  let rawIngredients=expandIngredientBullets(bulletValues(sectionLines(lines,ingStart)));let rawSteps=bulletValues(stepSection);
  if(!rawIngredients.length){const beforeSteps=stepStart>0?lines.slice(1,stepStart):lines.slice(1);rawIngredients=expandIngredientBullets(bulletValues(beforeSteps).filter(looksLikeIngredient));if(!rawIngredients.length)warnings.push(`${rel}: no ingredient data`)}
  const incomplete=/未公布|未公开|未知|请依据个人口味|自行调整/.test(md)||!rawSteps.length;if(!rawSteps.length&&category!=='饮品'&&category!=='配料')warnings.push(`${rel}: no step data`);
  const records=[],seen=new Set();
  for(const raw of rawIngredients){const name=ingredientBase(raw);if(!name||name.length>32||ignoredIngredient(name)||seen.has(name))continue;seen.add(name);const seasoning=isSeasoning(name,category);records.push({raw,name,seasoning,amount:chooseAmount(raw,name,rawSteps),prep:ingredientPrep(raw,name)})}
  const scale=complex?1:homeScale(records);const foodNames=records.filter(x=>!x.seasoning).map(x=>x.name);
  for(const rec of records){if(rec.seasoning)seasonings.add(rec.name);else{foods[rec.name]=foods[rec.name]||foodEmoji(rec.name);foodGroups[rec.name]=foodGroups[rec.name]||foodGroup(rec.name)}}
  const ings=records.filter(x=>!x.seasoning).map(x=>[x.name,scaledAmount(x.amount,scale,complex),x.prep]);const season=records.filter(x=>x.seasoning).map(x=>[x.name,scaledAmount(x.amount,scale,complex),1]);const steps=adaptSteps(rawSteps,scale,incomplete,category,complex);
  const id='hoc-'+crypto.createHash('sha1').update(rel).digest('hex').slice(0,12);
  recipes.push({id,name:safeName(title),icon:recipeIcon(title,category,foodNames),cat:inferCat(category,foodNames),tags:['老乡鸡','CookLikeHOC',category,complex?'多阶段配方':scale<.999?'家用比例':'源配方',incomplete?'来源资料不完整':'来源步骤完整'],mins:defaultMinutes(category,rawSteps),desc:`${category} · CookLikeHOC 来源做法`,ings,season,tools:inferTools(category,rawSteps),steps,hoc:true,source:{label:'CookLikeHOC / 老乡鸡菜品溯源报告整理',repo:SOURCE_REPO,category,path:rel,url:sourceUrl(rel),nonOfficial:true,adapted:true,scaled:scale<.999,scale:Number(scale.toFixed(4)),complex,incomplete}});
}
const data={meta:{sourceRepo:SOURCE_REPO,sourceCommit,generatedAt:new Date().toISOString(),count:recipes.length,note:'菜名、配料及配方参数依据来源记录整理；普通批量菜谱按比例缩放，多阶段菜谱保留步骤中的分阶段克重。CookLikeHOC 非老乡鸡官方仓库。'},foods,foodGroups,seasonings:[...seasonings].sort((a,b)=>a.localeCompare(b,'zh-CN')),recipes};
fs.writeFileSync(outFile,`// AUTO-GENERATED by scripts/sync-hoc-v3.mjs. Do not edit manually.\nwindow.HOC_DATA=${JSON.stringify(data,null,2)};\n`,'utf8');
const report={sourceCommit,recipeCount:recipes.length,foodCount:Object.keys(foods).length,seasoningCount:seasonings.size,incompleteCount:recipes.filter(r=>r.source.incomplete).length,scaledCount:recipes.filter(r=>r.source.scaled).length,complexCount:recipes.filter(r=>r.source.complex).length,warnings};fs.writeFileSync(reportFile,JSON.stringify(report,null,2)+'\n','utf8');console.log(JSON.stringify(report,null,2));if(recipes.length<80)throw new Error(`Only ${recipes.length} recipes parsed; expected at least 80.`);
