// V0.5.1 theme integration: follow device appearance and keep browser chrome in sync.
state.version='0.5.1';

(function theme0510(){
  const media=window.matchMedia?.('(prefers-color-scheme: dark)');
  const apply=()=>{
    const dark=!!media?.matches;
    document.documentElement.dataset.theme=dark?'dark':'light';
    document.documentElement.style.colorScheme=dark?'dark':'light';
    let meta=document.querySelector('meta[name="theme-color"]');
    if(!meta){
      meta=document.createElement('meta');
      meta.name='theme-color';
      document.head.appendChild(meta);
    }
    meta.content=dark?'#151815':'#f7f7f4';
  };
  apply();
  if(media?.addEventListener)media.addEventListener('change',apply);
  else if(media?.addListener)media.addListener(apply);
})();

const mineV0510Base=mine040;
mine040=function(){
  mineV0510Base();
  const aboutTitle=q('.about-040 b');
  if(aboutTitle)aboutTitle.textContent='我的小厨房 · V0.5.1';
  const about=q('.about-040 p');
  if(about)about.textContent='跟随设备自动切换亮色/暗色主题。首页负责推荐，冰箱负责库存，菜谱负责找菜和选菜，灶台负责今日菜单与制作。';
  setChrome040();
};

save();
render();
