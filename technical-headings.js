/* Dashed glyph contours inspired by React Bits Tech Text.
   https://reactbits.dev/text-animations/tech-text */
(() => {
 'use strict';
 const reduced=matchMedia('(prefers-reduced-motion:reduce)');
 const targets=['.story-header h2>span','.characters .section-heading h2','.scenes .scene-aside h2','.motion-heading h2'];
 targets.forEach(selector=>{
  const target=document.querySelector(selector);if(!target)return;
  target.closest('h2').classList.add('tech-heading');
  const word=document.createElement('span');word.className='tech-wordmark';word.tabIndex=0;
  const text=target.textContent;word.innerHTML='<span class="tech-readable"></span><canvas aria-hidden="true"></canvas>';word.querySelector('span').textContent=text;target.replaceChildren(word);
  const canvas=word.querySelector('canvas'),ctx=canvas.getContext('2d');if(!ctx)return;
  const panel=word.closest('.panel'),pad=14;let raf=0,last=0,glyphs=[],width=0,height=0,fontSize=0,baseline=0,color='',accent='',inside=false,keyboard=false,pointer={x:0,y:0},touchTimer=0;
  function resize(){
   const css=getComputedStyle(word);width=word.clientWidth;height=word.clientHeight;if(!width||!height)return;
   const dpr=Math.min(devicePixelRatio||1,2);canvas.width=Math.ceil((width+pad*2)*dpr);canvas.height=Math.ceil((height+pad*2)*dpr);canvas.style.width=width+pad*2+'px';canvas.style.height=height+pad*2+'px';ctx.setTransform(dpr,0,0,dpr,pad*dpr,pad*dpr);
   fontSize=parseFloat(css.fontSize);ctx.font=`${css.fontWeight} ${css.fontSize} ${css.fontFamily}`;ctx.textBaseline='alphabetic';ctx.lineJoin='round';color=css.color;accent=getComputedStyle(document.documentElement).getPropertyValue('--cyan').trim()||color;
   const full=ctx.measureText(text),spacing=parseFloat(css.letterSpacing)||0;baseline=(height-full.actualBoundingBoxAscent-full.actualBoundingBoxDescent)/2+full.actualBoundingBoxAscent;
   let x=0;glyphs=[...text].map((char,i)=>{const w=ctx.measureText(char).width,g={char,x,w,p:0};x+=w+spacing;return g});
   word.classList.add('tech-ready');wake();
  }
  function draw(now){
   raf=0;const dt=Math.min((now-(last||now))/1000,.05);last=now;ctx.clearRect(-pad,-pad,width+pad*2,height+pad*2);let moving=false;
   glyphs.forEach((g,i)=>{
    const distance=Math.hypot(pointer.x-(g.x+g.w/2),(pointer.y-height/2)*.65),goal=keyboard?1:inside?Math.max(0,1-distance/(fontSize*2.4)):0;
    g.p=reduced.matches?goal:g.p+(goal-g.p)*(1-Math.exp(-Math.max(dt,.016)*14));if(Math.abs(goal-g.p)>.005)moving=true;
    ctx.globalAlpha=1-g.p;ctx.fillStyle=color;ctx.fillText(g.char,g.x,baseline);
    if(g.p>.008){
     ctx.globalAlpha=g.p;ctx.strokeStyle=accent;ctx.lineWidth=Math.max(.85,fontSize*.022);ctx.setLineDash([3.5,2.5]);ctx.lineDashOffset=reduced.matches?0:-now*.014;ctx.strokeText(g.char,g.x,baseline);ctx.setLineDash([]);
     if(g.p>.25&&g.char.trim()){
      const top=baseline-fontSize*.8;ctx.globalAlpha=g.p*.65;ctx.lineWidth=.55;ctx.setLineDash([2,3]);ctx.strokeRect(g.x-2,top-3,g.w+4,fontSize*.91);ctx.setLineDash([]);
      [[g.x-2,top-3],[g.x+g.w+2,top-3],[g.x-2,top+fontSize*.91-3],[g.x+g.w+2,top+fontSize*.91-3]].forEach(([x,y])=>ctx.fillRect(x-1,y-1,2,2));
      ctx.save();ctx.font='6px monospace';ctx.fillStyle=accent;ctx.globalAlpha=g.p*.7;ctx.fillText(String(i+1).padStart(2,'0'),g.x,top-6);ctx.restore();
     }
    }
   });ctx.globalAlpha=1;
   if(panel.classList.contains('active')&&!document.hidden&&!reduced.matches&&(inside||keyboard||moving))raf=requestAnimationFrame(draw);
  }
  function wake(){if(!raf&&panel.classList.contains('active')&&!document.hidden){last=0;raf=requestAnimationFrame(draw)}}
  function locate(e){const rect=word.getBoundingClientRect();pointer={x:(e.clientX-rect.left)*width/Math.max(rect.width,1),y:(e.clientY-rect.top)*height/Math.max(rect.height,1)};inside=true;wake()}
  word.addEventListener('pointerenter',locate);word.addEventListener('pointermove',locate);word.addEventListener('pointerdown',e=>{clearTimeout(touchTimer);locate(e)});word.addEventListener('pointerleave',()=>{inside=false;wake()});word.addEventListener('pointerup',e=>{if(e.pointerType!=='mouse')touchTimer=setTimeout(()=>{inside=false;wake()},550)});
  word.addEventListener('focus',()=>{keyboard=true;wake()});word.addEventListener('blur',()=>{keyboard=false;wake()});
  new ResizeObserver(resize).observe(word);new MutationObserver(()=>{cancelAnimationFrame(raf);raf=0;inside=keyboard=false;wake()}).observe(panel,{attributes:true,attributeFilter:['class']});document.addEventListener('visibilitychange',()=>{cancelAnimationFrame(raf);raf=0;wake()});reduced.addEventListener('change',()=>{cancelAnimationFrame(raf);raf=0;wake()});document.fonts.ready.then(resize);resize();
 });
})();
