(() => {
 'use strict';
 function createStack(config){
 const {base,clips}=config,total=clips.length,countText=total===5?'五个片段':'六个片段';
 const section=document.createElement('section');section.className='panel gx gx-shot-production '+(config.className||'');section.setAttribute('aria-label',config.label);section.dataset.caseId=config.id;section.inert=true;
 section.innerHTML=`<div class="gx-shot-scroll" tabindex="0" aria-label="${total}条分镜视频，滚动逐层叠放"><div class="gx-shot-content"><div class="gx-shot-sticky"><div class="stage"><header class="gx-shot-heading"><div class="gx-shot-section"><p class="eyebrow">${config.eyebrow}</p><p>${config.sectionTitle}</p><button class="gx-shot-method-link" type="button">${config.footerLink}</button></div><div class="gx-shot-title"><h2>${config.title}</h2><p lang="en">${config.english}</p></div></header><div class="gx-shot-cards" aria-label="${total}条视频叠放展示">${clips.map((clip,i)=>{const n=String(i+1).padStart(2,'0');return `<article class="gx-shot-card" data-shot-card="${i}" aria-label="分镜片段 ${n}"><div class="gx-shot-frame"><video muted loop playsinline preload="none" poster="${base+clip.file}.webp" data-src="${base+clip.file}.mp4" aria-label="分镜视频 ${n}"></video><span class="gx-shot-number" aria-hidden="true">${n}</span><button class="gx-shot-select" data-shot-jump="${i+1}" aria-label="查看分镜片段 ${n}"></button></div><div class="gx-shot-card-caption"><span>片段 ${n}</span><span>${clip.duration} s / ANIMATIC STUDY</span></div></article>`}).join('')}</div><section class="gx-shot-method" aria-label="${config.footerLabel}">${config.footer}</section><nav class="gx-shot-nav" aria-label="分镜视频导航"><button class="gx-shot-prev" aria-label="上一片段">←</button><button data-shot-jump="0" aria-current="true">总览</button><div class="gx-shot-steps">${clips.map((_,i)=>`<button data-shot-jump="${i+1}" aria-label="跳转片段 ${String(i+1).padStart(2,'0')}" aria-current="false">${String(i+1).padStart(2,'0')}</button>`).join('')}</div><button class="gx-shot-next" aria-label="下一片段">→</button><input class="gx-shot-range" type="range" min="0" max="${total}" step="0.01" value="0" aria-label="视频叠放进度"><span class="gx-shot-count" aria-live="polite">${countText} / 滚动叠放</span></nav><p class="gx-shot-scroll-hint">向下滚动，视频逐层叠放 <span>SCROLL TO STACK ↓</span></p></div></div></div></div>`;
 document.querySelector('#track').append(section);
 const scroll=section.querySelector('.gx-shot-scroll'),content=section.querySelector('.gx-shot-content'),stage=section.querySelector('.stage'),cards=[...section.querySelectorAll('.gx-shot-card')],videos=cards.map(c=>c.querySelector('video'));
 content.style.height=((total+1)*100)+'dvh';
 const documentBody=document.createElement('div');documentBody.className='gx-shot-document';scroll.prepend(documentBody);documentBody.append(content);
 cards.forEach(card=>{card.querySelector('.gx-shot-select').tabIndex=-1});
 const method=section.querySelector('.gx-shot-method'),small=matchMedia('(max-width:800px)'),reduced=matchMedia('(prefers-reduced-motion:reduce)'),range=section.querySelector('.gx-shot-range'),count=section.querySelector('.gx-shot-count');
 let front=-2,progress=0,raf=0,active=false,lenis=null,lastWidth=0,lastHeight=0,lastSmall=null;
 const clamp=(x,a=0,b=1)=>Math.max(a,Math.min(b,x)),mix=(a,b,t)=>a+(b-a)*t;
 function mediaState(index){
  if(index===front)return;front=index;
  videos.forEach((video,i)=>{const current=i===index;video.controls=current;video.tabIndex=current?0:-1;video.setAttribute('aria-hidden',String(!current));cards[i].classList.toggle('is-current',current);cards[i].querySelector('.gx-shot-select').hidden=current;if(current&&active&&!document.hidden){if(!video.getAttribute('src')){video.src=video.dataset.src;video.load()}video.play().catch(()=>{})}else video.pause()});
  const selected=index+1;section.querySelectorAll('.gx-shot-nav [data-shot-jump]').forEach(b=>b.setAttribute('aria-current',String(Number(b.dataset.shotJump)===selected)));
  count.textContent=index<0?countText+' / 滚动叠放':`${String(index+1).padStart(2,'0')} / ${String(total).padStart(2,'0')}`;
  section.querySelector('.gx-shot-prev').disabled=index<0;section.querySelector('.gx-shot-next').disabled=index===total-1;
 }
 function render(value){
  progress=clamp(value,0,total);const p=progress,mobile=small.matches,w=mobile?stage.clientWidth:1600,h=mobile?stage.clientHeight:900;
  const fw=mobile?w*.88:config.focusWidth||880,fx=mobile?w*.06:360,fy=mobile?Math.max(270,h*.33):215;
  cards.forEach((card,i)=>{
   const compact=mobile&&h<760,ox=mobile?w*(.06+i*.184/(total-1)):90+i*config.spacing,oy=mobile?(compact?275+i*56/(total-1):Math.max(290,h*.36)+i*80/(total-1)):225+i*120/(total-1),ow=mobile?w*(compact?0.66:0.72):config.cardWidth||640;
   let x,y,width;
   if(p<=1){if(i===0){x=mix(ox,fx,p);y=mix(oy,fy,p);width=mix(ow,fw,p)}else{x=ox+p*w*1.05;y=oy;width=ow}}
   else{const t=clamp(p-i);x=mix(w*1.12+(i-1)*18,fx,t);y=mix(fy+85,fy,t);width=mix(ow,fw,t);if(p>i+1){const age=p-i-1;x=fx-age*(mobile?7:18);y=fy-age*(mobile?6:12);width=fw-age*(mobile?3:14)}}
   card.style.width=width+'px';card.style.transform=`translate3d(${x}px,${y}px,0)`;card.style.zIndex=String(i+1);
  });
  range.value=String(p);range.setAttribute('aria-valuetext',p<.55?'叠放总览':`片段 ${Math.min(total,Math.floor(p-.55)+1)}，共${total}条`);
  mediaState(p<.55?-1:Math.min(total-1,Math.floor(p-.55)));
  section.dataset.stackProgress=p.toFixed(3);section.dataset.currentShot=String(front+1);
 }
 function redraw(){render(scroll.scrollTop/Math.max(1,scroll.clientHeight))}
 if(window.Lenis){lenis=new Lenis({wrapper:scroll,content:documentBody,autoRaf:false,lerp:.09,smoothWheel:true,syncTouch:false,overscroll:false,respectReducedMotion:true});lenis.on('scroll',redraw);scroll.dataset.scrollEngine='lenis'}else scroll.dataset.scrollEngine='native';
 scroll.addEventListener('scroll',redraw,{passive:true});scroll.addEventListener('wheel',e=>e.stopPropagation(),{passive:true});
 function go(step){const top=clamp(step,0,total)*scroll.clientHeight;if(lenis)lenis.scrollTo(top,{immediate:reduced.matches,lerp:.09});else scroll.scrollTo({top,behavior:reduced.matches?'instant':'smooth'})}
 section.querySelectorAll('[data-shot-jump]').forEach(b=>b.addEventListener('click',()=>go(Number(b.dataset.shotJump))));
 section.querySelector('.gx-shot-prev').addEventListener('click',()=>go(Math.max(0,front)));
 section.querySelector('.gx-shot-next').addEventListener('click',()=>go(Math.min(total,front+2)));
 range.addEventListener('input',()=>go(Number(range.value)));
 section.addEventListener('keydown',e=>{if(e.target.closest('video,input'))return;const dir={ArrowDown:1,ArrowRight:1,PageDown:1,ArrowUp:-1,ArrowLeft:-1,PageUp:-1}[e.key];if(dir||e.key==='Home'||e.key==='End'){e.preventDefault();e.stopPropagation();go(e.key==='Home'?0:e.key==='End'?total:Math.round(progress)+dir)}});
 function fit(){const width=stage.clientWidth,height=scroll.clientHeight;if(width===lastWidth&&height===lastHeight&&small.matches===lastSmall)return;const previous=scroll.scrollTop/Math.max(1,lastHeight||height);lastWidth=width;lastHeight=height;lastSmall=small.matches;if(small.matches){documentBody.append(method)}else{stage.append(method)}lenis?.resize();if(lenis)lenis.scrollTo(previous*height,{immediate:true,force:true});else scroll.scrollTop=previous*height;redraw()}
 section.querySelector('.gx-shot-method-link').addEventListener('click',()=>{if(lenis){lenis.resize();lenis.scrollTo('bottom',{immediate:true,force:true})}else scroll.scrollTop=scroll.scrollHeight-scroll.clientHeight;method.tabIndex=-1;method.focus({preventScroll:true})});
 function frame(time){if(!active)return;lenis?.raf(time);raf=requestAnimationFrame(frame)}
 function activation(){const next=section.classList.contains('active');if(next===active)return;active=next;cancelAnimationFrame(raf);if(active){lenis?.start();lenis?.resize();front=-2;redraw();raf=requestAnimationFrame(frame)}else{lenis?.stop();videos.forEach(v=>v.pause())}}
 new MutationObserver(activation).observe(section,{attributes:true,attributeFilter:['class']});
 const visibility=new IntersectionObserver(entries=>entries.forEach(entry=>{const video=entry.target;if(!entry.isIntersecting)video.pause();else if(active&&videos.indexOf(video)===front&&!document.hidden)video.play().catch(()=>{})}),{root:scroll,threshold:.05});videos.forEach(video=>visibility.observe(video));
 document.addEventListener('visibilitychange',()=>{if(document.hidden)videos.forEach(v=>v.pause());else if(active){front=-2;redraw()}});
 window.addEventListener('resize',fit);fit();activation();render(0);

 }
 createStack({
  id:'case2',base:'assets/gx/',label:'古相思曲 · 视频与分镜',eyebrow:'CASE 02 / VIDEO / SHOT PRODUCTION',sectionTitle:'十二、案例二 · 视频与分镜',
  title:'把抽象情绪翻译成<br>可拍的物理现象',english:'Translate abstract emotions into<br>photographable physical phenomena.',spacing:170,
  clips:[{file:'shot-01',duration:'11.48'},{file:'shot-05',duration:'8.20'},{file:'shot-03',duration:'15.07'},{file:'shot-04',duration:'15.07'},{file:'shot-02',duration:'15.07'}],
  footerLabel:'镜头组织方法',footerLink:'镜头组织方法 ↓',footer:'<div class="gx-shot-method-heading"><p>镜头组织方法 <span>SHOT BREAKDOWN</span></p><p>每个镜头先声明禁用运镜清单。</p></div><div class="gx-shot-dimensions"><div><b>戏型</b><p>对白文戏 / 反应独白 / 动作武打 / 节奏 / 氛围仪式 / 空镜过渡</p></div><div><b>人物数量</b><p>单人 / 双人 / 多人</p></div><div><b>镜头能量</b><p>固定 / 微颤 / 稳定运动 / 高速跟拍 / 急抖</p></div><div><b>风险元素</b><p>口型 / 接触 / 道具 / 特效 / 微表情</p></div></div>'
 });
 createStack({
  id:'case3',className:'gx-super-mapping',base:'assets/super/',label:'超能映射 · 星域奇旅PV',eyebrow:'CASE 3 | SUPER MAPPING | SHOT PRODUCTION',sectionTitle:'案例三 · 超能映射',
  title:'案例三｜超能映射（《星域奇旅》PV）<br>——90 秒讲清“不想成为主角”的英雄',english:"Case 3 | Super Mapping (\"Star Domain Odyssey\" PV) – A 90-Second Explanation of a Hero Who \"Doesn't Want to Be the Protagonist\"",
  spacing:160,cardWidth:600,focusWidth:820,
  clips:[{file:'pv-01',duration:'10.05'},{file:'pv-02',duration:'4.09'},{file:'pv-03',duration:'8.06'},{file:'pv-04',duration:'15.04'},{file:'pv-05',duration:'8.08'},{file:'pv-06',duration:'5.74'}],
  footerLabel:'项目定位与主命题',footerLink:'项目文案 ↓',footer:'<div class="gx-shot-method-heading"><p>项目定位 <span>PROJECT POSITIONING</span></p><p>主命题与 Slogan</p></div><div class="gx-super-copy"><div><b>项目定位</b><p>90—100s 高概念混剪 PV，极致风格化 / 复古未来主义 / 人物 IP 向科幻动作剧集。近未来超能力群像：观星署“造神”机构 × 觉醒的映射能力者。</p></div><div><b>情绪锚点</b><p>英雄并非无所不能；如果命运让你成为英雄，你能否拒绝？</p></div><div><b>Slogan</b><p>他们说我疯了，但神夺走了我的命运，那是我们彼此拯救的唯一武器。我们在废墟中背靠着背。</p></div></div>'
 });
 document.querySelector('.contents-list li:nth-child(4)').innerHTML='<button data-page="14"><span>超能映射</span><small>SUPER MAPPING / STAR DOMAIN ODYSSEY PV</small></button>';
})();
