// V0.4.1 remove the global top bar and keep shopping where it belongs: the fridge.
state.version='0.4.1';

const fridgeV041Base=fridge;
fridge=function(){
  fridgeV041Base();
  const h=q('#root > h2');
  if(h&&!q('.fridge-topline-041')){
    const row=document.createElement('div');
    row.className='fridge-topline-041';
    h.replaceWith(row);
    row.appendChild(h);
    const btn=document.createElement('button');
    btn.className='fridge-shopping-041';
    btn.id='fridgeShopping041';
    btn.innerHTML=`购物清单${state.shopping.length?` <b>${state.shopping.length}</b>`:''}`;
    btn.onclick=()=>shoppingModal();
    row.appendChild(btn);
  }
};

save();
render();
