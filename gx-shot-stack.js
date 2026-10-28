(() => {
 'use strict';
 const base='assets/gx/',durations=['11.48','15.07','15.07','15.07','8.20'];
 const section=document.createElement('section');section.className='panel gx gx-shot-production';section.setAttribute('aria-label','古相思曲 · 视频与分镜');section.inert=true;
 section.innerHTML=`<div class="gx-shot-scroll" tabindex="0" aria-label="五条分镜视频，滚动逐层叠放"><div class="gx-shot-content"><div class="gx-shot-sticky"><div class="stage"><header class="gx-shot-heading"><div class="gx-shot-section"><p class="eyebrow">XII / CASE 02 / SHOT PRODUCTION</p><p>十二、案例二 · 视频与分镜</p><button class="gx-shot-method-link" type="button">镜头组织方法 ↓</button></div><div class="gx-shot-title"><h2>把抽象情绪翻译成<br>可拍的物理现象</h2><p lang="en">Translate abstract emotions into<br>photographable physical phenomena.</p></div></header><div class="gx-shot-cards" aria-label="五条视频叠放展示">${durations.map((duration,i)=>{const n=String(i+1).padStart(2,'0');return `<article class="gx-shot-card" data-shot-card="${i}" aria-label="分镜片段 ${n}"><div class="gx-shot-frame"><video muted loop playsinline preload="none" poster="${base}shot-${n}.webp" data-src="${base}shot-${n}.mp4" aria-label="分镜视频 ${n}"></video><span class="gx-shot-number" aria-hidden="true">${n}</span><button class="gx-shot-select" data-shot-jump="${i+1}" aria-label="查看分镜片段 ${n}"></button></div><div class="gx-shot-card-caption"><span>片段 ${n}</span><span>${duration} s / ANIMATIC STUDY</span></div></article>`}).join('')}</div><section class="gx-shot-method" aria-label="镜头组织方法"><div class="gx-shot-method-heading"><p>镜头组织方法 <span>SHOT BREAKDOWN</span></p><p>每个镜头先声明禁用运镜清单。</p></div><div class="gx-shot-dimensions"><div><b>戏型</b><p>对白文戏 / 反应独白 / 动作武打 / 节奏 / 氛围仪式 / 空镜过渡</p></div><div><b>人物数量</b><p>单人 / 双人 / 多人</p></div><div><b>镜头能量</b><p>固定 / 微颤 / 稳定运动 / 高速跟拍 / 急抖</p></div><div><b>风险元素</b><p>口型 / 接触 / 道具 / 特效 / 微表情</p></div></div></section><nav class="gx-shot-nav" aria-label="分镜视频导航"><button class="gx-shot-prev" aria-label="上一片段">←</button><button data-shot-jump="0" aria-current="true">总览</button><div class="gx-shot-steps">${durations.map((_,i)=>`<button data-shot-jump="${i+1}" aria-label="跳转片段 ${String(i+1).padStart(2,'0')}" aria-current="false">${String(i+1).padStart(2,'0')}</button>`).join('')}</div><button class="gx-shot-next" aria-label="下一片段">→</button><input class="gx-shot-range" type="range" min="0" max="5" step="0.01" value="0" aria-label="视频叠放进度"><span class="gx-shot-count" aria-live="polite">五个片段 / 滚动叠放</span></nav><p class="gx-shot-scroll-hint">向下滚动，视频逐层叠放 <span>SCROLL TO STACK ↓</span></p></div></div></div></div>`;
 document.querySelector('#track').append(section);
 const scroll=section.querySelector('.gx-shot-scroll'),content=section.querySelector('.gx-shot-content'),stage=section.querySelector('.stage'),cards=[...section.querySelectorAll('.gx-shot-card')],videos=cards.map(c=>c.querySelector('video'));
 const documentBody=document.createElement('div');documentBody.className='gx-shot-document';scroll.prepend(documentBody);documentBody.append(content);
 cards.forEach(card=>{card.querySelector('.gx-shot-select').tabIndex=-1});
 const method=section.querySelector('.gx-shot-method'),small=matchMedia('(max-width:800px)'),reduced=matchMedia('(prefers-reduced-motion:reduce)'),range=section.querySelector('.gx-shot-range'),count=section.querySelector('.gx-shot-count');
 let front=-2,progress=0,raf=0,active=false,lenis=null,lastWidth=0,lastHeight=0,lastSmall=null;
 const clamp=(x,a=0,b=1)=>Math.max(a,Math.min(b,x)),mix=(a,b,t)=>a+(b-a)*t;
 function mediaState(index){
  if(index===front)return;front=index;
  videos.forEach((video,i)=>{const current=i===index;video.controls=current;video.tabIndex=current?0:-1;video.setAttribute('aria-hidden',String(!current));cards[i].classList.toggle('is-current',current);cards[i].querySelector('.gx-shot-select').hidden=current;if(current&&active&&!document.hidden){if(!video.getAttribute('src')){video.src=video.dataset.src;video.load()}video.play().catch(()=>{})}else video.pause()});
  const selected=index+1;section.querySelectorAll('.gx-shot-nav [data-shot-jump]').forEach(b=>b.setAttribute('aria-current',String(Number(b.dataset.shotJump)===selected)));
  count.textContent=index<0?'五个片段 / 滚动叠放':`${String(index+1).padStart(2,'0')} / 05`;
  section.querySelector('.gx-shot-prev').disabled=index<0;section.querySelector('.gx-shot-next').disabled=index===4;
 }
 function render(value){
  progress=clamp(value,0,5);const p=progress,mobile=small.matches,w=mobile?stage.clientWidth:1600,h=mobile?stage.clientHeight:900;
  const fw=mobile?w*.88:880,fx=mobile?w*.06:360,fy=mobile?Math.max(270,h*.33):215;
  cards.forEach((card,i)=>{
   const compact=mobile&&h<760,ox=mobile?w*(.06+i*.046):90+i*170,oy=mobile?(compact?275+i*14:Math.max(290,h*.36)+i*20):225+i*30,ow=mobile?w*(compact?0.66:0.72):640;
   let x,y,width;
   if(p<=1){if(i===0){x=mix(ox,fx,p);y=mix(oy,fy,p);width=mix(ow,fw,p)}else{x=ox+p*w*1.05;y=oy;width=ow}}
   else{const t=clamp(p-i);x=mix(w*1.12+(i-1)*18,fx,t);y=mix(fy+85,fy,t);width=mix(ow,fw,t);if(p>i+1){const age=p-i-1;x=fx-age*(mobile?7:18);y=fy-age*(mobile?6:12);width=fw-age*(mobile?3:14)}}
   card.style.width=width+'px';card.style.transform=`translate3d(${x}px,${y}px,0)`;card.style.zIndex=String(i+1);
  });
  range.value=String(p);range.setAttribute('aria-valuetext',p<.55?'叠放总览':`片段 ${Math.min(5,Math.floor(p-.55)+1)}，共5条`);
  mediaState(p<.55?-1:Math.min(4,Math.floor(p-.55)));
  section.dataset.stackProgress=p.toFixed(3);section.dataset.currentShot=String(front+1);
 }
 function redraw(){render(scroll.scrollTop/Math.max(1,scroll.clientHeight))}
 if(window.Lenis){lenis=new Lenis({wrapper:scroll,content:documentBody,autoRaf:false,lerp:.09,smoothWheel:true,syncTouch:false,overscroll:false,respectReducedMotion:true});lenis.on('scroll',redraw);scroll.dataset.scrollEngine='lenis'}else scroll.dataset.scrollEngine='native';
 scroll.addEventListener('scroll',redraw,{passive:true});scroll.addEventListener('wheel',e=>e.stopPropagation(),{passive:true});
 function go(step){const top=clamp(step,0,5)*scroll.clientHeight;if(lenis)lenis.scrollTo(top,{immediate:reduced.matches,lerp:.09});else scroll.scrollTo({top,behavior:reduced.matches?'instant':'smooth'})}
 section.querySelectorAll('[data-shot-jump]').forEach(b=>b.addEventListener('click',()=>go(Number(b.dataset.shotJump))));
 section.querySelector('.gx-shot-prev').addEventListener('click',()=>go(Math.max(0,front)));
 section.querySelector('.gx-shot-next').addEventListener('click',()=>go(Math.min(5,front+2)));
 range.addEventListener('input',()=>go(Number(range.value)));
 section.addEventListener('keydown',e=>{if(e.target.closest('video,input'))return;const dir={ArrowDown:1,ArrowRight:1,PageDown:1,ArrowUp:-1,ArrowLeft:-1,PageUp:-1}[e.key];if(dir||e.key==='Home'||e.key==='End'){e.preventDefault();e.stopPropagation();go(e.key==='Home'?0:e.key==='End'?5:Math.round(progress)+dir)}});
 function fit(){const width=stage.clientWidth,height=scroll.clientHeight;if(width===lastWidth&&height===lastHeight&&small.matches===lastSmall)return;const previous=scroll.scrollTop/Math.max(1,lastHeight||height);lastWidth=width;lastHeight=height;lastSmall=small.matches;if(small.matches){documentBody.append(method)}else{stage.append(method)}lenis?.resize();if(lenis)lenis.scrollTo(previous*height,{immediate:true,force:true});else scroll.scrollTop=previous*height;redraw()}
 section.querySelector('.gx-shot-method-link').addEventListener('click',()=>{if(lenis){lenis.resize();lenis.scrollTo('bottom',{immediate:true,force:true})}else scroll.scrollTop=scroll.scrollHeight-scroll.clientHeight;method.tabIndex=-1;method.focus({preventScroll:true})});
 function frame(time){if(!active)return;lenis?.raf(time);raf=requestAnimationFrame(frame)}
 function activation(){const next=section.classList.contains('active');if(next===active)return;active=next;cancelAnimationFrame(raf);if(active){lenis?.start();lenis?.resize();front=-2;redraw();raf=requestAnimationFrame(frame)}else{lenis?.stop();videos.forEach(v=>v.pause())}}
 new MutationObserver(activation).observe(section,{attributes:true,attributeFilter:['class']});
 const visibility=new IntersectionObserver(entries=>entries.forEach(entry=>{const video=entry.target;if(!entry.isIntersecting)video.pause();else if(active&&videos.indexOf(video)===front&&!document.hidden)video.play().catch(()=>{})}),{root:scroll,threshold:.05});videos.forEach(video=>visibility.observe(video));
 document.addEventListener('visibilitychange',()=>{if(document.hidden)videos.forEach(v=>v.pause());else if(active){front=-2;redraw()}});
 window.addEventListener('resize',fit);fit();activation();render(0);
})();
