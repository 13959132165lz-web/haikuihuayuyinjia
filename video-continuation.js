(() => {
 document.querySelectorAll('.gx-shot-production').forEach(panel=>{
  const scroll=panel.querySelector('.gx-shot-scroll');let endAt=0,lastWheel=0,touch=null;
  const bottom=()=>scroll.scrollHeight>scroll.clientHeight+10&&scroll.scrollTop>=scroll.scrollHeight-scroll.clientHeight-3;
  function paint(){if(bottom()){if(!endAt)endAt=performance.now();}else endAt=0;}
  function next(){if(!panel.classList.contains('active')||document.hidden||document.querySelector('dialog[open]'))return;endAt=0;document.querySelector('#next-page').click();}
  scroll.addEventListener('scroll',paint,{passive:true});
  scroll.addEventListener('wheel',e=>{const now=performance.now(),fresh=now-lastWheel>180;lastWheel=now;if(!e.ctrlKey&&e.deltaY>0&&bottom()&&endAt&&now-endAt>300&&fresh){e.preventDefault();e.stopImmediatePropagation();next();}},{capture:true,passive:false});
  scroll.addEventListener('touchstart',e=>{touch=e.touches.length===1?{x:e.touches[0].clientX,y:e.touches[0].clientY,end:bottom(),media:!!e.target.closest('video,input')}:null;},{passive:true});
  scroll.addEventListener('touchend',e=>{const s=touch;touch=null;if(!s||s.media||!e.changedTouches.length)return;const dx=s.x-e.changedTouches[0].clientX,dy=s.y-e.changedTouches[0].clientY;if(s.end&&dy>65&&dy>Math.abs(dx)*1.5)next();},{passive:true});
  panel.addEventListener('keydown',e=>{if(['ArrowDown','PageDown','ArrowRight'].includes(e.key)&&bottom()&&!e.target.closest('video,input,textarea')){e.preventDefault();e.stopImmediatePropagation();next();}},{capture:true});
  new MutationObserver(()=>{endAt=0;lastWheel=0;touch=null;if(panel.classList.contains('active'))paint();}).observe(panel,{attributes:true,attributeFilter:['class']});paint();
 });
})();
