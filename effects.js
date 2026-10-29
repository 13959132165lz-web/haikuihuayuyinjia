(() => {
 'use strict';
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const fine=matchMedia('(hover:hover) and (pointer:fine)');
 const clamp=(x,a,b)=>Math.min(b,Math.max(a,x));
 const lerp=(a,b,t)=>a+(b-a)*t;
 const panels=[...document.querySelectorAll('.panel')];
 let animations=[],transitionToken=0,transitionTimers=[];
 function animate(el,frames,options){
  const a=el.animate(frames,options);animations.push(a);
  a.finished.then(()=>{animations=animations.filter(item=>item!==a);}).catch(()=>{});return a;
 }
 // Split only display headings; long body copy keeps its natural line wrapping.
 document.querySelectorAll('h1,h2,h3').forEach(heading=>{
  if(heading.classList.contains('chrome-heading')||heading.classList.contains('tech-heading'))return;
  heading.setAttribute('aria-label',heading.textContent.trim()||heading.querySelector('img')?.alt||'');
  const walker=document.createTreeWalker(heading,NodeFilter.SHOW_TEXT),nodes=[];
  while(walker.nextNode())nodes.push(walker.currentNode);
  let index=0;
  for(const node of nodes){
   const fragment=document.createDocumentFragment();
   for(const char of node.textContent){const span=document.createElement('span');span.className='ink-char';span.textContent=char;span.setAttribute('aria-hidden','true');span.dataset.inkIndex=index++;fragment.append(span);}
   node.replaceWith(fragment);
  }
 });
 function reveal(panel,delay=0){
  if(reduced.matches)return;
  const onCurrentSlide=el=>{const slide=el.closest('.gx-subslide');return !slide||slide.classList.contains('gx-subactive')};
  [...panel.querySelectorAll('h1,h2,h3')].filter(onCurrentSlide).forEach((heading,j)=>{
   heading.querySelectorAll('.ink-char').forEach((char,i)=>{
    const color=getComputedStyle(char).color;
    animate(char,[
     {opacity:0,color:'#020608',filter:'blur(7px)',textShadow:'0 0 9px #020608',transform:'translateY(55%) scale(.48,1.5)',offset:0},
     {opacity:1,color:'#020608',filter:'blur(3px)',textShadow:'0 0 8px #020608',transform:'translateY(12%) scale(1.12,1.04)',offset:.33},
     {opacity:1,color,filter:'blur(.4px)',textShadow:'0 0 0px transparent',transform:'translateY(-2%) scale(1.025,1)',offset:.76},
     {opacity:1,color,filter:'blur(0px)',textShadow:'0 0 0px transparent',transform:'translateY(0) scale(1)',offset:1}
    ],{duration:1000,delay:delay+Math.min(j*65,200)+Math.min(i*24,450),easing:'cubic-bezier(.2,.65,.2,1)',fill:'backwards'});
   });
  });
  const copy=[...panel.querySelectorAll('p,.contents-list li,.workflow-steps li,.directions>div,.character .desire,.identity,.core')].filter(el=>onCurrentSlide(el)&&!el.parentElement.closest('.contents-list li,.workflow-steps li,.directions>div,.desire,.identity,.core'));
  copy.forEach((el,i)=>animate(el,[{opacity:0,color:'#020608',textShadow:'0 0 7px #020608',filter:'blur(6px)',transform:'translateY(24px) scale(.97,1.05)'},{opacity:1,color:getComputedStyle(el).color,textShadow:'0 0 0px transparent',filter:'blur(0px)',transform:'translateY(0) scale(1)'}],{duration:1000,delay:delay+180+Math.min(i*35,450),easing:'cubic-bezier(.2,.7,.15,1)',fill:'backwards'}));
  panel.querySelectorAll('img, .motion-screen').forEach((img,i)=>{
   if(img.closest('.workflow-collage')||!onCurrentSlide(img))return;
   animate(img,[{opacity:0,clipPath:'inset(18% 0 24% 0)',transform:'translateY(65px) scale(1.065)'},{opacity:1,clipPath:'inset(0% 0 0% 0)',transform:'translateY(0px) scale(1)'}],{duration:1250,delay:delay+260+Math.min(i*55,360),easing:'cubic-bezier(.18,.8,.16,1)',fill:'backwards'});
  });
 }
 function transition(from,to,direction,kind='default'){
  if(from===to)return;
  transitionToken++;const token=transitionToken;
  animations.forEach(a=>a.cancel());animations=[];transitionTimers.forEach(clearTimeout);transitionTimers=[];
  panels.forEach(p=>{p.getAnimations().forEach(a=>a.cancel());p.classList.remove('transitioning');p.style.zIndex='';});
  clearHover();
  if(reduced.matches){to.style.zIndex='2';return;}
  from.classList.add('transitioning');from.style.zIndex='1';to.style.zIndex='3';
  if(kind==='split'){
   to.dataset.entryTransition='center-open';
   animate(from,[{opacity:1},{opacity:.5}],{duration:1100,easing:'ease',fill:'both'});
   animate(to,[{clipPath:'inset(0 50% 0 50%)'},{clipPath:'inset(0 0% 0 0%)'}],{duration:1150,easing:'cubic-bezier(.76,0,.18,1)',fill:'both'});
   const stage=to.querySelector('.stage');
   if(stage)[...stage.children].filter(el=>!el.matches('.viewport-backdrop')).forEach((el,i)=>animate(el,[{opacity:0,transform:'translate3d(0,90px,0)'},{opacity:1,transform:'translate3d(0,0,0)'}],{duration:950,delay:420+Math.min(i*60,240),easing:'cubic-bezier(.2,.8,.2,1)',fill:'backwards'}));
   transitionTimers.push(setTimeout(()=>{if(token!==transitionToken)return;from.classList.remove('transitioning');from.style.zIndex='';to.style.zIndex='2';from.getAnimations().forEach(a=>a.cancel());to.getAnimations().forEach(a=>a.cancel());},1660));
   return;
  }
  animate(from,[{transform:'translateY(0%) scale(1)',opacity:1,filter:'brightness(1)'},{transform:`translateY(${-direction*24}%) scale(.94)`,opacity:.55,filter:'brightness(.65)'}],{duration:1180,easing:'cubic-bezier(.76,0,.2,1)',fill:'both'});
  animate(to,[{transform:`translateY(${direction*102}%)`,clipPath:direction>0?'inset(0 0 5% 0)':'inset(5% 0 0 0)'},{transform:'translateY(0%)',clipPath:'inset(0 0 0% 0)'}],{duration:1280,easing:'cubic-bezier(.76,0,.18,1)',fill:'both'});
  reveal(to,360);
  transitionTimers.push(setTimeout(()=>{if(token!==transitionToken)return;from.classList.remove('transitioning');from.style.zIndex='';to.style.zIndex='2';from.getAnimations().forEach(a=>a.cancel());to.getAnimations().forEach(a=>a.cancel());},1310));
 }
 // A light overlay samples the real image; it does not replace or recompress it.
 const root=document.createElement('div');root.className='fx-root';root.setAttribute('aria-hidden','true');
 root.innerHTML='<canvas class="fx-canvas"></canvas><div class="inertia-ring"></div><div class="glass-cursor"></div>';
 document.body.append(root);
 const canvas=root.querySelector('canvas'),ctx=canvas.getContext('2d',{alpha:true});
 const cursor=root.querySelector('.glass-cursor'),ring=root.querySelector('.inertia-ring');
 const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');svg.setAttribute('width','0');svg.setAttribute('height','0');svg.setAttribute('aria-hidden','true');svg.style.position='absolute';
 svg.innerHTML='<defs><filter id="liquid-image-warp" x="-8%" y="-8%" width="116%" height="116%" color-interpolation-filters="sRGB"><feTurbulence type="fractalNoise" baseFrequency=".011 .019" numOctaves="2" seed="8" result="noise"/><feDisplacementMap in="SourceGraphic" in2="noise" scale="0" xChannelSelector="R" yChannelSelector="G"/></filter></defs>';
 document.body.append(svg);const displacement=svg.querySelector('feDisplacementMap'),noise=svg.querySelector('feTurbulence');
 const point={x:innerWidth/2,y:innerHeight/2,lx:innerWidth/2,ly:innerHeight/2,rx:innerWidth/2,ry:innerHeight/2,vx:0,vy:0,visible:false};
 let frame=0,last=0,activity=0,hover=null,bursts=[],hasPointer=false,canvasWidth=0,canvasHeight=0;
 const originalStyles=new WeakMap(),sampleCache=new WeakMap();
 function size(){const dpr=Math.min(devicePixelRatio||1,1.5);canvasWidth=innerWidth;canvasHeight=innerHeight;canvas.width=Math.round(canvasWidth*dpr);canvas.height=Math.round(canvasHeight*dpr);ctx?.setTransform(dpr,0,0,dpr,0,0);}
 size();window.addEventListener('resize',()=>{size();clearHover();});
 function enabled(){return fine.matches&&!reduced.matches&&!document.hidden;}
 function schedule(){if(!frame&&enabled())frame=requestAnimationFrame(tick);}
 function remember(img){if(!originalStyles.has(img))originalStyles.set(img,{transform:img.style.transform,filter:img.style.filter,opacity:img.style.opacity,borderRadius:img.style.borderRadius});}
 function restore(img){const s=originalStyles.get(img);if(s)Object.assign(img.style,s);img.classList.remove('liquid-active');}
 function sample(img){
  const cached=sampleCache.get(img);if(cached&&cached.src===img.currentSrc)return cached.points;
  if(!img.complete||!img.naturalWidth)return [];
  try{
   const b=img.getBoundingClientRect();const cols=clamp(Math.round(b.width/11),15,64),rows=clamp(Math.round(b.height/12),10,38);
   const surface=document.createElement('canvas');surface.width=cols;surface.height=rows;const c=surface.getContext('2d',{willReadFrequently:true});
   const scale=getComputedStyle(img).objectFit==='contain'?Math.min(cols/img.naturalWidth,rows/img.naturalHeight):Math.max(cols/img.naturalWidth,rows/img.naturalHeight);
   const w=img.naturalWidth*scale,h=img.naturalHeight*scale;c.drawImage(img,(cols-w)/2,(rows-h)/2,w,h);
   const data=c.getImageData(0,0,cols,rows).data,points=[];const chars=' .,:;+=*#%@';
   for(let y=0;y<rows;y++)for(let x=0;x<cols;x++){
    const n=(y*cols+x)*4;if(data[n+3]<50||(x+y)%2===1)continue;
    const l=(data[n]*.2126+data[n+1]*.7152+data[n+2]*.0722)/255;
    points.push({u:(x+.5)/cols,v:(y+.5)/rows,char:chars[Math.max(1,Math.floor(l*9))],color:`rgb(${Math.min(255,data[n]+55)},${Math.min(255,data[n+1]+60)},${Math.min(255,data[n+2]+55)})`,seed:Math.random()*Math.PI*2,speed:20+Math.random()*70});
   }
   sampleCache.set(img,{src:img.currentSrc,points});return points;
  }catch{return [];}
 }
 function clearHover(){
  if(hover){restore(hover.img);hover=null;}bursts=[];displacement.setAttribute('scale','0');cursor.classList.remove('on-media');ctx?.clearRect(0,0,canvasWidth,canvasHeight);
 }
 function begin(img){
  if(hover?.img===img)return;
  release();if(!img||!enabled())return;
  remember(img);img.classList.add('liquid-active');
  const rect=img.getBoundingClientRect(),cx=rect.left+rect.width/2,cy=rect.top+rect.height/2;
  const neighbors=[...document.querySelectorAll('.panel.active .image-view img,.panel.active .video-tile img')].filter(other=>other!==img&&!img.closest('dialog')).map(other=>({element:other,rect:other.getBoundingClientRect()})).filter(n=>n.rect.width>15&&n.rect.left<innerWidth&&n.rect.top<innerHeight).sort((a,b)=>Math.hypot(a.rect.left+a.rect.width/2-cx,a.rect.top+a.rect.height/2-cy)-Math.hypot(b.rect.left+b.rect.width/2-cx,b.rect.top+b.rect.height/2-cy));
  hover={img,points:sample(img),born:performance.now(),power:0,rect,neighbor:neighbors[0]?.element};
  cursor.classList.add('on-media');activity=performance.now();schedule();
 }
 function release(){
  if(!hover)return;
  const h=hover;restore(h.img);bursts.push({points:h.points,rect:h.img.getBoundingClientRect(),born:performance.now(),x:point.x,y:point.y});if(bursts.length>3)bursts.shift();hover=null;cursor.classList.remove('on-media');activity=performance.now();schedule();
 }
 function identify(target){
  if(!(target instanceof Element)||target.closest('.gx-contact'))return null;
  if(target.tagName==='IMG')return target;
  const tile=target.closest('.image-view,.video-tile,.media-tile');return tile?.querySelector('img')||null;
 }
 document.addEventListener('pointermove',e=>{
  if(e.pointerType==='touch'||!enabled())return;
  if(!hasPointer){point.lx=point.rx=e.clientX;point.ly=point.ry=e.clientY;hasPointer=true;}
  point.vx=(e.clientX-point.x);point.vy=(e.clientY-point.y);point.x=e.clientX;point.y=e.clientY;point.visible=true;activity=performance.now();root.classList.add('tracking');document.documentElement.classList.add('glass-pointer');
  const img=identify(e.target);if(img)begin(img);else release();schedule();
 },{passive:true});
 document.addEventListener('pointerdown',e=>{if(e.pointerType!=='touch')cursor.classList.add('pressed');});document.addEventListener('pointerup',()=>cursor.classList.remove('pressed'));
 document.documentElement.addEventListener('pointerleave',()=>{point.visible=false;root.classList.remove('tracking');release();document.documentElement.classList.remove('glass-pointer');});
 window.addEventListener('blur',()=>{root.classList.remove('tracking');document.documentElement.classList.remove('glass-pointer');clearHover();});
 function tether(b,power){
  if(!ctx||!point.visible)return;
  const ax=clamp(point.rx,b.left,b.right),ay=clamp(point.ry,b.top,b.bottom),dx=point.x-ax,dy=point.y-ay,d=Math.hypot(dx,dy);
  if(d<12||d>180)return;
  const nx=-dy/d,ny=dx/d,wide=clamp(19-d*.075,2,18)*power,end=4*power;
  const gradient=ctx.createLinearGradient(ax,ay,point.x,point.y);gradient.addColorStop(0,'rgba(173,235,222,.35)');gradient.addColorStop(1,'rgba(240,255,252,.08)');ctx.fillStyle=gradient;
  ctx.beginPath();ctx.moveTo(ax+nx*wide,ay+ny*wide);ctx.bezierCurveTo(ax+dx*.6+nx*2,ay+dy*.6+ny*2,point.x-dx*.15+nx*end,point.y-dy*.15+ny*end,point.x+nx*end,point.y+ny*end);ctx.lineTo(point.x-nx*end,point.y-ny*end);ctx.bezierCurveTo(point.x-dx*.15-nx*end,point.y-dy*.15-ny*end,ax+dx*.6-nx*2,ay+dy*.6-ny*2,ax-nx*wide,ay-ny*wide);ctx.closePath();ctx.fill();
 }
 function particles(h,now,leaving=false){
  if(!ctx)return;const age=(now-h.born)/1000,b=h.rect;
  const envelope=leaving?Math.max(0,1-age/1.05):(.18+.74*Math.exp(-Math.pow((age-.35)/.36,2)));
  if(envelope<.015)return;
  ctx.font=`${clamp(b.width/44,8,13)}px Consolas,monospace`;ctx.textAlign='center';ctx.textBaseline='middle';
  for(const p of h.points){
   let x=b.left+p.u*b.width,y=b.top+p.v*b.height;
   const dx=x-point.x,dy=y-point.y,d=Math.hypot(dx,dy),local=Math.max(0,1-d/150);
   let spread=leaving?age*age*150:Math.exp(-age*2.8)*32;
   x+=Math.cos(p.seed+age*.8)*spread+(d>0?dx/d*local*18:0);y+=Math.sin(p.seed+age*.8)*spread+(d>0?dy/d*local*18:0);
   ctx.globalAlpha=envelope*(leaving?.68:.48+local*.5);ctx.fillStyle=p.color;ctx.fillText(p.char,x,y);
  }ctx.globalAlpha=1;
 }
 function imageBridge(h,now){
  if(!ctx||!h.neighbor)return;
  const a=h.rect,b=h.neighbor.getBoundingClientRect();
  const ac={x:a.left+a.width/2,y:a.top+a.height/2},bc={x:b.left+b.width/2,y:b.top+b.height/2};
  const dx=bc.x-ac.x,dy=bc.y-ac.y,d=Math.hypot(dx,dy);if(d<1)return;
  const ta=Math.min(a.width/2/Math.max(Math.abs(dx),.001),a.height/2/Math.max(Math.abs(dy),.001));
  const tb=Math.min(b.width/2/Math.max(Math.abs(dx),.001),b.height/2/Math.max(Math.abs(dy),.001));
  const x1=ac.x+dx*ta,y1=ac.y+dy*ta,x2=bc.x-dx*tb,y2=bc.y-dy*tb;
  const gap=Math.hypot(x2-x1,y2-y1);if(gap<8||gap>270||ta+tb>1)return;
  const nx=-dy/d,ny=dx/d,width=(7+Math.sin(now*.003)*2)*h.power,bend=Math.sin(now*.0018)*16*h.power;
  const mx=(x1+x2)/2+nx*bend,my=(y1+y2)/2+ny*bend;
  ctx.fillStyle='rgba(184,235,223,.24)';ctx.beginPath();ctx.moveTo(x1+nx*width,y1+ny*width);ctx.bezierCurveTo(mx+nx,my+ny,mx+nx,my+ny,x2+nx*width*.7,y2+ny*width*.7);ctx.lineTo(x2-nx*width*.7,y2-ny*width*.7);ctx.bezierCurveTo(mx-nx,my-ny,mx-nx,my-ny,x1-nx*width,y1-ny*width);ctx.closePath();ctx.fill();
 }
 function tick(now){
  frame=0;if(!enabled())return;const dt=clamp((now-last)/16.67,.4,2);last=now;
  point.lx=lerp(point.lx,point.x,1-Math.pow(.43,dt));point.ly=lerp(point.ly,point.y,1-Math.pow(.43,dt));point.rx=lerp(point.rx,point.x,1-Math.pow(.9,dt));point.ry=lerp(point.ry,point.y,1-Math.pow(.9,dt));
  const dx=point.x-point.rx,dy=point.y-point.ry,speed=Math.hypot(dx,dy),angle=Math.atan2(dy,dx)*180/Math.PI,stretch=Math.min(speed*.003,.32);
  cursor.style.transform=`translate3d(${point.lx}px,${point.ly}px,0) rotate(${angle}deg) scale(${1+stretch},${1-stretch*.45})`;
  ring.style.transform=`translate3d(${point.rx}px,${point.ry}px,0) rotate(${angle}deg) scale(${1+stretch*2},${1-stretch*.45})`;
  ctx?.clearRect(0,0,canvasWidth,canvasHeight);
  if(hover){
   const h=hover;const live=clamp(1-(now-activity-250)/1150,0,1);h.power=lerp(h.power,live,.15);const b=h.img.getBoundingClientRect();h.rect=b;
   const nx=clamp((point.x-b.left)/b.width-.5,-.5,.5),ny=clamp((point.y-b.top)/b.height-.5,-.5,.5),age=(now-h.born)/1000;
   const wave=Math.sin(age*2.7),power=h.power;
   displacement.setAttribute('scale',String((7+Math.min(speed*.17,19)+Math.sin(age*3)*3)*power));noise.setAttribute('baseFrequency',`${.011+Math.sin(age*.8)*.0015} ${.017+Math.cos(age*.6)*.002}`);
   if(power>.015){
    h.img.classList.add('liquid-active');h.img.style.filter='url(#liquid-image-warp)';h.img.style.transform=`perspective(850px) translate3d(${nx*9*power}px,${ny*9*power}px,0) rotateX(${-ny*6*power}deg) rotateY(${nx*8*power}deg) scale(${1+.02*power})`;
    h.img.style.borderRadius=`${(7+wave*2)*power}% ${(4+ny*5)*power}% ${(7-wave*2)*power}% ${(4-nx*5)*power}% / ${(5-ny*4)*power}% ${(8+wave*2)*power}% ${(4+ny*4)*power}% ${(8-wave*2)*power}%`;
    h.img.style.opacity=String(1-.75*Math.exp(-Math.pow((age-.32)/.28,2)));
    imageBridge(h,now);particles(h,now);tether(b,power);
   }else restore(h.img);
  }
  bursts=bursts.filter(b=>now-b.born<1100);for(const b of bursts){particles(b,now,true);tether(b.rect,Math.max(0,1-(now-b.born)/900));}
  if((hover&&hover.power>.015)||bursts.length||speed>.4||now-activity<1600)schedule();
 }
 function preference(){
  if(!enabled()){cancelAnimationFrame(frame);frame=0;clearHover();root.classList.remove('tracking');document.documentElement.classList.remove('glass-pointer');}
  if(reduced.matches){animations.forEach(a=>a.cancel());animations=[];panels.forEach(p=>p.classList.remove('transitioning'));}
 }
 reduced.addEventListener('change',preference);fine.addEventListener('change',preference);document.addEventListener('visibilitychange',preference);
 const lightbox=document.querySelector('#lightbox');if(lightbox)new MutationObserver(()=>{clearHover();(lightbox.open?lightbox:document.body).append(root);}).observe(lightbox,{attributes:true,attributeFilter:['open']});
 document.documentElement.classList.add('motion-ready');window.PortfolioMotion={transition};
 // Wait for local display fonts so ink does not jump between glyph metrics.
 document.fonts.ready.then(()=>{if(transitionToken===0)reveal(document.querySelector('.panel.active')||panels[0],80);});
})();
