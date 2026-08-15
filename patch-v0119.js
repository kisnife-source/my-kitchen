// V0.1.19 keep horizontally-scrolled recipe filters stable across rerenders
state.version='0.1.19';
let recipeFilterScroll119=0;

const boardV0119Base=board;
board=function(){
  boardV0119Base();
  if(state.prep||state.boardMode!=='recipes')return;
  const filters=q('.filters');
  if(!filters)return;
  const max=Math.max(0,filters.scrollWidth-filters.clientWidth);
  filters.scrollLeft=Math.min(recipeFilterScroll119,max);
  filters.addEventListener('scroll',()=>{recipeFilterScroll119=filters.scrollLeft},{passive:true});
};

save();
render();
