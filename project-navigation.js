(() => {
 'use strict';
 const cover=document.querySelector('.cover');
 const folder=document.createElement('div');folder.className='project-folder';
 folder.innerHTML=`<div class="project-folder-back" aria-hidden="true"></div><div class="project-folder-paper" aria-hidden="true"></div><nav class="project-folder-notes" aria-label="三个项目快捷入口" inert>${[['超能映射',13,-75,-73,-5],['古相思曲',7,5,-132,4],['海葵花与银甲',3,-65,-188,-3]].map(([name,page,x,y,r],i)=>`<button class="project-note" data-page="${page}" data-project-entry style="--note-x:${x}px;--note-y:${y}px;--note-r:${r}deg;--note-i:${i}"><span>${name}</span><small>↗ ${String(page+1).padStart(2,'0')}</small></button>`).join('')}</nav><button class="project-folder-trigger" aria-expanded="false" aria-label="打开项目文件夹"><span class="project-folder-face"><span class="project-folder-symbol">▱</span><span>项目档案<small>PROJECTS / 03</small></span><i>↗</i></span></button>`;
 cover.append(folder);const trigger=folder.querySelector('.project-folder-trigger'),notes=folder.querySelector('nav');let pinned=false,hover=false,focused=false,timer=0;
 const archivePages=[cover,document.querySelector('.workflow'),document.querySelector('.ending')];
 const available=()=>archivePages.some(p=>p.matches('.active,.transitioning'));
 function sync(){const open=available()&&(pinned||hover||focused);folder.classList.toggle('is-open',open);trigger.setAttribute('aria-expanded',String(open));notes.inert=!open;}
 folder.addEventListener('pointerenter',e=>{if(e.pointerType==='mouse'){clearTimeout(timer);hover=true;sync()}});folder.addEventListener('pointerleave',e=>{if(e.pointerType==='mouse')timer=setTimeout(()=>{hover=false;sync()},190)});
 trigger.addEventListener('click',()=>{pinned=!pinned;if(!pinned){hover=false;focused=false}sync()});folder.addEventListener('focusin',()=>{focused=true;sync()});folder.addEventListener('focusout',e=>{focused=folder.contains(e.relatedTarget);sync()});
 folder.addEventListener('keydown',e=>{if(e.key==='Escape'){e.stopPropagation();pinned=hover=focused=false;sync();trigger.focus();focused=false;sync()}});
 document.addEventListener('pointerdown',e=>{if(!folder.contains(e.target)){pinned=hover=focused=false;sync()}});
 archivePages.forEach(panel=>new MutationObserver(()=>{if(!available())pinned=hover=focused=false;sync()}).observe(panel,{attributes:true,attributeFilter:['class']}));sync();
 const heading=document.querySelector('.gx-tone-heading');
 if(heading){heading.querySelector('h2>span')?.remove();const subtitle=document.createElement('p');subtitle.className='gx-tonal-subtitle';subtitle.innerHTML='先定全篇影调基准，再让每场戏围绕基准变化<span lang="en">First, establish the overall tonal baseline for the entire film, then have each scene revolve around variations of this baseline.</span>';heading.append(subtitle);}
})();
