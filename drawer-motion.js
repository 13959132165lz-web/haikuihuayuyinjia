(() => {
 'use strict';
 const reduced=matchMedia('(prefers-reduced-motion:reduce)'),running=new WeakMap();let serial=0;
 function snapshot(source){
  const clone=source.cloneNode(true),prefix='drawer-'+(++serial)+'-';
  const ids=new Map();clone.querySelectorAll('[id]').forEach(el=>{ids.set(el.id,prefix+el.id);el.id=prefix+el.id});
  clone.querySelectorAll('*').forEach(el=>{for(const attr of [...el.attributes]){let value=attr.value;ids.forEach((next,old)=>{value=value.replaceAll(`url(#${old})`,`url(#${next})`);if(value==='#'+old)value='#'+next});if(value!==attr.value)el.setAttribute(attr.name,value)}});
  source.querySelectorAll('video').forEach((video,i)=>{const copy=clone.querySelectorAll('video')[i];if(!copy)return;const canvas=document.createElement('canvas');canvas.width=Math.min(1280,video.videoWidth||640);canvas.height=canvas.width*(video.videoHeight||360)/(video.videoWidth||640);try{canvas.getContext('2d').drawImage(video,0,0,canvas.width,canvas.height);copy.replaceWith(canvas)}catch{const image=document.createElement('img');image.src=video.poster;image.alt='';copy.replaceWith(image)}});
  clone.inert=true;clone.setAttribute('aria-hidden','true');return clone;
 }
 function swap(host,source,target,update,direction=1){
  running.get(host)?.();
  if(reduced.matches||!source||!target){update();return;}
  const rect=source.getBoundingClientRect(),parent=host.getBoundingClientRect(),scale=host.offsetWidth/parent.width;
  if(!rect.width||!rect.height||!Number.isFinite(scale)){update();return;}
  const x=(rect.left-parent.left)*scale,y=(rect.top-parent.top)*scale,w=rect.width*scale,h=rect.height*scale;
  const overlay=document.createElement('div');overlay.className='drawer-motion-layer';overlay.setAttribute('aria-hidden','true');overlay.inert=true;
  const ghost=snapshot(source);ghost.classList.add('drawer-motion-ghost');Object.assign(ghost.style,{position:'absolute',inset:'auto',left:x+'px',top:y+'px',width:w+'px',height:h+'px',minWidth:'0',margin:'0',transform:'none',contentVisibility:'visible'});overlay.append(ghost);
  const folds=document.createElement('div');folds.className='drawer-motion-folds';Object.assign(folds.style,{left:x+'px',top:y+'px',width:w+'px',height:h+'px'});
  const colors=['#b7b2a3','#96958b','#777e73','#5c6c61','#354f45'];
  for(let i=0;i<5;i++){const fold=document.createElement('i');fold.style.setProperty('--fold-color',colors[i]);fold.style.left=(i*10)+'%';folds.append(fold)}overlay.append(folds);host.append(overlay);ghost.scrollTop=source.scrollTop;ghost.scrollLeft=source.scrollLeft;
  update();const animations=[];
  function animate(el,frames,options){const a=el.animate(frames,{fill:'both',...options});animations.push(a);return a;}
  const d=direction<0?-1:1;
  animate(ghost,[{transform:'translateX(0) rotateY(0)',opacity:1},{transform:`translateX(${-d*112}%) rotateY(${d*18}deg)`,opacity:.12}],{duration:650,easing:'cubic-bezier(.62,0,.3,1)'});
  [...folds.children].forEach((fold,i)=>animate(fold,[{transform:`translateX(${d*w*(.85+i*.025)}px) scaleX(1)`,opacity:0},{transform:'translateX(0) scaleX(1)',opacity:.9,offset:.35},{transform:`translateX(${-d*w*(.9+i*.04)}px) scaleX(.16)`,opacity:0}],{duration:850,delay:i*22,easing:'cubic-bezier(.65,0,.2,1)'}));
  animate(target,[{transform:`translateX(${d*38}%) scaleX(.88)`,opacity:.3,clipPath:d>0?'inset(0 0 0 14%)':'inset(0 14% 0 0)'},{transform:'translateX(0) scaleX(1)',opacity:1,clipPath:'inset(0 0 0 0)'}],{duration:950,delay:80,easing:'cubic-bezier(.16,.78,.16,1)'});
  let timer;const cleanup=()=>{clearTimeout(timer);animations.forEach(a=>a.cancel());overlay.remove();if(running.get(host)===cleanup)running.delete(host)};running.set(host,cleanup);timer=setTimeout(cleanup,1060);
 }
 window.GXDrawerMotion={swap};
})();
