(() => {
 'use strict';
 const reduced=matchMedia('(prefers-reduced-motion:reduce)'),mobile=matchMedia('(max-width:800px)');
 document.querySelectorAll('.gx-people,.gx-spaces,.gx-tones').forEach(panel=>{
  const track=panel.querySelector('.gx-subtrack,.gx-tone-track');if(!track)return;
  track.classList.add('smooth-horizontal');
  const lenis=window.Lenis?new Lenis({wrapper:track,content:track,orientation:'horizontal',gestureOrientation:'horizontal',smoothWheel:false,autoRaf:false,lerp:.105}):null;
  let raf=0,target=track.scrollLeft,idleTimer=0,endAt=0,lastWheelAt=0,touch=null;
  const count=track.children.length,max=()=>Math.max(0,track.scrollWidth-track.clientWidth);
  const hint=document.createElement('div');hint.className='horizontal-scroll-hint';hint.innerHTML='<span>滚动横向浏览 / SCROLL TO EXPLORE →</span><i aria-hidden="true"></i>';panel.querySelector('.stage').append(hint);
  const atEnd=()=>max()>0&&track.scrollLeft>=max()-2;
  function paint(){hint.style.setProperty('--horizontal-progress',String(max()?track.scrollLeft/max():0));if(atEnd()){if(!endAt)endAt=performance.now();}else endAt=0;hint.querySelector('span').textContent=atEnd()?'继续向前滚动，进入下一页 / CONTINUE TO NEXT PAGE →':'滚动横向浏览 / SCROLL TO EXPLORE →';}
  function nextPage(){if(!panel.classList.contains('active')||document.hidden||document.querySelector('dialog[open]'))return;clearTimeout(idleTimer);cancelAnimationFrame(raf);raf=0;endAt=0;document.querySelector('#next-page').click();}
  function frame(t){raf=0;if(!panel.classList.contains('active')||document.hidden)return;lenis?.raf(t);paint();if(lenis?.isScrolling)raf=requestAnimationFrame(frame);}
  function move(x,immediate=false){target=Math.max(0,Math.min(max(),x));if(lenis){lenis.scrollTo(target,{immediate:immediate||reduced.matches,force:true,onComplete:paint});if(!raf)raf=requestAnimationFrame(frame);}else track.scrollTo({left:target,behavior:immediate||reduced.matches?'instant':'smooth'});paint();}
  track.portfolioHorizontal={go:i=>move(i*track.clientWidth),resize:i=>{lenis?.resize();move(i*track.clientWidth,true)}};
  // Capture before older carousel handlers; the vertical wheel becomes a continuous horizontal journey.
  panel.addEventListener('wheel',e=>{
   if(e.ctrlKey||document.querySelector('dialog[open]'))return;
   if(mobile.matches&&Math.abs(e.deltaY)>Math.abs(e.deltaX))return;
   if(e.target.closest('.gx-original-rail')&&Math.abs(e.deltaX)>Math.abs(e.deltaY))return;
   e.preventDefault();e.stopImmediatePropagation();
   const delta=(Math.abs(e.deltaX)>Math.abs(e.deltaY)?e.deltaX:e.deltaY)*(e.deltaMode===1?24:e.deltaMode===2?track.clientWidth:1);
   const now=performance.now(),newGesture=now-lastWheelAt>180;lastWheelAt=now;
   // Finish viewing the final slide first; a fresh forward gesture continues the deck.
   if(delta>0&&atEnd()&&endAt&&now-endAt>300&&newGesture){nextPage();return;}
   if(!lenis?.isScrolling)target=track.scrollLeft;
   move(target+delta*1.55);clearTimeout(idleTimer);
   idleTimer=setTimeout(()=>move((delta>0?Math.ceil(target/track.clientWidth):Math.floor(target/track.clientWidth))*track.clientWidth),220);
  },{capture:true,passive:false});
  track.addEventListener('touchstart',e=>{touch=e.touches.length===1?{x:e.touches[0].clientX,y:e.touches[0].clientY,end:atEnd(),nested:!!e.target.closest('.gx-original-rail')}:null;clearTimeout(idleTimer);lenis?.stop();cancelAnimationFrame(raf);raf=0},{passive:true});
  track.addEventListener('touchend',e=>{lenis?.start();const start=touch;touch=null;if(start&&!start.nested&&e.changedTouches.length){const dx=start.x-e.changedTouches[0].clientX,dy=start.y-e.changedTouches[0].clientY;if(start.end&&dx>65&&dx>Math.abs(dy)*1.5){nextPage();return;}}idleTimer=setTimeout(()=>move(Math.round(track.scrollLeft/track.clientWidth)*track.clientWidth),160)},{passive:true});
  panel.addEventListener('keydown',e=>{if(e.key==='ArrowRight'&&atEnd()&&!e.target.closest('input,textarea,video,.gx-original-rail')){e.preventDefault();e.stopImmediatePropagation();nextPage();}},{capture:true});
  track.addEventListener('scroll',paint,{passive:true});
  function stop(){cancelAnimationFrame(raf);raf=0;clearTimeout(idleTimer);endAt=0;lastWheelAt=0;touch=null;lenis?.scrollTo(track.scrollLeft,{immediate:true,force:true});target=track.scrollLeft;}
  new MutationObserver(()=>{if(!panel.classList.contains('active'))stop();else{lenis?.resize();paint()}}).observe(panel,{attributes:true,attributeFilter:['class']});document.addEventListener('visibilitychange',()=>{if(document.hidden)stop()});reduced.addEventListener('change',()=>move(target,true));paint();
 });
})();
