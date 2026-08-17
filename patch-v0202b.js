// V0.2.2 quantity semantic refinements for fats, stocks, eggs and cooked staples.
function fryProcess0202b(r){return /油炸|炸制|炸至|复炸|浸炸|下油锅|炸熟|炸酥/.test([...(r?.steps||[]),r?.desc||''].join(' '));}
const seasoningReferenceV0202bBase=seasoningReference0202;
seasoningReference0202=function(name,r,raw,target){
  const n=String(name||''),level=ambiguityFactor0202(raw),t=Math.max(1,target);
  if(/起酥油|熟猪油|猪油|牛油|黄油/.test(n)){
    if(fryProcess0202b(r)&&/适量|按需/.test(String(raw||'')))return '参考约500g';
    return ref0202(5*t*level,'g');
  }
  if(/豉油汁|蒸鱼豉油|豉油/.test(n))return ref0202(5*t*level,'ml');
  if(/鸡精|味精/.test(n))return ref0202(.5*t*level,'g');
  if(/食用油|菜籽油|色拉油|花生油|玉米油/.test(n)&&fryProcess0202b(r)&&/适量|按需/.test(String(raw||'')))return '参考约500ml';
  return seasoningReferenceV0202bBase(name,r,raw,target);
};

const foodReferenceV0202bBase=foodReference0202;
foodReference0202=function(name,r,raw,target){
  const n=String(name||''),level=ambiguityFactor0202(raw),t=Math.max(1,target);
  if(waterLike0202(n))return '按步骤加水';
  if(/茶叶蛋|卤蛋|荷包蛋|煎蛋|鸡蛋|鸭蛋|鹅蛋|鹌鹑蛋/.test(n))return `${Math.max(1,Math.round(t*level))}个`;
  if(/老鸡汤|高汤|鸡汤|骨汤|汤底|浓汤/.test(n))return ref0202(150*t*level,'ml');
  if(/^米饭$|熟米饭/.test(n))return ref0202(150*t*level,'g');
  if(/^大米$|生米/.test(n))return ref0202(70*t*level,'g');
  if(/小母鸡|老母鸡|整鸡|童子鸡|三黄鸡/.test(n))return ref0202(250*t*level,'g');
  return foodReferenceV0202bBase(name,r,raw,target);
};

const seasoningPackV0202bBase=seasoningPack0202;
seasoningPack0202=function(name){
  const n=String(name||'');
  if(/起酥油|熟猪油|猪油|牛油|黄油/.test(n))return '1盒/袋';
  return seasoningPackV0202bBase(name);
};

syncMealShopping0200();
save();render();
