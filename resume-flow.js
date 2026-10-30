(() => {
 'use strict';
 const cover=document.querySelector('.cover'),workflow=document.querySelector('.workflow'),ending=document.querySelector('.ending');
 const archivePages=[cover,workflow,ending];
 // Run after the older page builders, then renumber every existing navigation target.
 document.querySelector('.contents')?.remove();
 document.querySelectorAll('[data-page]').forEach(b=>{const old=Number(b.dataset.page);if(old>1)b.dataset.page=String(old-1);});
 document.querySelector('.navigation>button:last-child').setAttribute('aria-label','查看制作工作流');
 document.querySelectorAll('.project-note').forEach(b=>b.querySelector('small').textContent='↗ '+String(Number(b.dataset.page)+1).padStart(2,'0'));
 const nextButton=cover.querySelector('.home-profile-end [data-page]');nextButton.textContent='继续 · 制作工作流 →';nextButton.dataset.page='1';
 const mark=(el,wrap=false)=>{if(!el)return;el.classList.add('red-metal');el.dataset.chrome=el.innerText||el.textContent;if(wrap)el.dataset.chromeWrap='true';el.dataset.chromeTone='red';};
 cover.querySelector('.home-profile-aside h2').textContent='梁臻';
 cover.querySelectorAll('.home-profile-aside h2,.home-resume h4,.resume-date,.home-degree,.home-strength').forEach(el=>mark(el,true));
 cover.querySelectorAll('.home-resume>section h3').forEach(h=>{const text=h.firstChild;if(text?.nodeType!==3)return;const span=document.createElement('span');span.textContent=text.textContent;text.replaceWith(span);mark(span);});
 workflow.classList.add('workflow-red');
 workflow.querySelector('h2').classList.add('chrome-heading');mark(workflow.querySelector('h2'),true);
 const thesis=workflow.querySelector('.workflow-thesis');
 [...thesis.childNodes].filter(n=>n.nodeType===3&&n.textContent.trim()).forEach(n=>{const span=document.createElement('span');span.className='workflow-main-thesis';span.textContent=n.textContent;n.replaceWith(span);mark(span,true);});
 thesis.querySelectorAll('span:not(.workflow-main-thesis)').forEach(el=>mark(el,true));
 thesis.querySelectorAll(':scope>br').forEach(el=>el.remove());
 workflow.querySelectorAll('.workflow-steps li>span').forEach(el=>{const lines=el.innerHTML.split(/<br\s*\/?\s*>/i).map(t=>t.replace(/<[^>]*>/g,''));mark(el,true);el.dataset.chrome=lines.join('\n');});
 workflow.querySelectorAll('.feedback>span,.directions>div>span').forEach(el=>mark(el,true));
 // A viewport-level archive survives scrolling and the transition between the first two pages.
 const archive=document.createElement('aside');archive.className='persistent-archive home-weaving';archive.setAttribute('aria-label','项目快捷文件夹');
 const folder=document.querySelector('.project-folder');archive.append(folder);document.body.append(archive);
 function syncArchive(){const leaving=archive.classList.contains('departing')&&archive.parentElement.classList.contains('transitioning');const visible=archivePages.some(p=>p.classList.contains('active'))||leaving;if(!leaving){document.body.append(archive);archive.classList.remove('departing');}archive.classList.toggle('active',visible);archive.inert=!visible||leaving;archive.setAttribute('aria-hidden',String(!visible));}
 // Nest the live folder in the outgoing panel so it shares the exact page animation.
 window.PortfolioArchive={transition(from,to){if(archivePages.includes(from)&&!archivePages.includes(to)){from.append(archive);archive.classList.add('departing');archive.classList.add('active');archive.inert=true;}else{archive.classList.remove('departing');document.body.append(archive);syncArchive();}}};
 archivePages.forEach(p=>new MutationObserver(syncArchive).observe(p,{attributes:true,attributeFilter:['class']}));syncArchive();
 const scroll=cover.querySelector('.home-scroll');let previous=scroll.scrollTop,armed=false,timer=0,lastAdvance=-Infinity;
 const bottom=()=>scroll.scrollHeight>scroll.clientHeight+20&&scroll.scrollTop>=scroll.scrollHeight-scroll.clientHeight-3;
 const active=()=>cover.classList.contains('active')&&!document.hidden&&!document.querySelector('dialog[open]');
 function advance(){clearTimeout(timer);timer=0;if(!active()||!bottom()||!armed||performance.now()-lastAdvance<1800)return;armed=false;lastAdvance=performance.now();nextButton.click();}
 function schedule(){if(active()&&armed&&bottom()&&!timer)timer=setTimeout(advance,240);}
 scroll.addEventListener('wheel',e=>{if(e.deltaY>0&&!e.ctrlKey){armed=true;schedule()}else if(e.deltaY<0){armed=false;clearTimeout(timer);timer=0;}},{passive:true});
 scroll.addEventListener('touchstart',()=>{armed=true},{passive:true});
 scroll.addEventListener('keydown',e=>{if(['ArrowDown','PageDown','End',' '].includes(e.key)){armed=true;schedule()}});
 scroll.addEventListener('scroll',()=>{const now=scroll.scrollTop;if(now>previous+.5&&active())armed=true;if(now<previous-.5){armed=false;clearTimeout(timer);timer=0;}previous=now;schedule()},{passive:true});
 new MutationObserver(()=>{clearTimeout(timer);timer=0;armed=false;previous=scroll.scrollTop;}).observe(cover,{attributes:true,attributeFilter:['class']});
})();
