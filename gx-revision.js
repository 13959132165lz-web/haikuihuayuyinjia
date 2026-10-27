(() => {
 'use strict';
 const {cast,scenes,gallery,dims}=window.GX_DATA;
 const base='assets/gx/',esc=s=>String(s).replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;');
 const media=(f,a,cls='')=>`<button class="image-view ${cls}" data-image="${base+f}" aria-label="放大${esc(a)}"><img src="${base+f}" alt="${esc(a)}" loading="lazy" decoding="async"></button>`;
 const letter=(id,alt)=>`<img class="gx-letter" src="${base}letter-${id}.webp" alt="${alt}">`;
 const panel=(cls,label,body)=>`<section class="panel gx ${cls}" aria-label="${label}" inert><div class="stage">${body}</div></section>`;
 const head=(id,title,en,note='')=>`<header class="gx2-heading"><p class="eyebrow">CASE 02 / ${en}</p><h2>${letter(id,title)}</h2>${note?`<p class="gx2-heading-note">${note}</p>`:''}</header>`;
 let clipIndex=0;
 const clippedSvg=(file,rect,alt)=>{const [w,h]=dims[file],id='gx-crop-'+(++clipIndex);return `<svg viewBox="${rect.join(' ')}" role="img" aria-label="${esc(alt)}"><defs><clipPath id="${id}"><rect x="${rect[0]}" y="${rect[1]}" width="${rect[2]}" height="${rect[3]}" fill="white"/></clipPath></defs><image clip-path="url(#${id})" href="${base+file}" width="${w}" height="${h}"/></svg>`};
 const crop=(file,rect,alt,cls='')=>`<button class="gx-visual ${cls}" data-image="${base+file}" aria-label="放大${esc(alt)}">${clippedSvg(file,rect,alt)}</button>`;
 const rowBounds={'luyuan-a.png':[[0,535],[535,465],[1000,536]],'luyuan-b.png':[[0,510],[510,517],[1027,509]],'luyuan-c.png':[[0,520],[520,510],[1030,506]],'shen.png':[[0,528],[528,558]],'yihua.png':[[0,415],[415,360],[775,383],[1158,378]],'lushi.png':[[0,765],[765,771]],'lushi-blue.png':[[0,809]]};
 const outfit=(o,alt)=>{const [w]=dims[o.file],[y,h]=rowBounds[o.file][o.row];return clippedSvg(o.file,[0,y,w,h],alt)};
 const wardrobe={
  luyuan:[...['朱衣','华服','凤冠'].map((name,row)=>({file:'luyuan-a.png',row,rows:3,name})),...['银甲','淡紫','桃粉'].map((name,row)=>({file:'luyuan-b.png',row,rows:3,name})),...['素衣','山野','红妆'].map((name,row)=>({file:'luyuan-c.png',row,rows:3,name}))],
  shen:['玄红','青灰'].map((name,row)=>({file:'shen.png',row,rows:2,name})),
  yihua:['缟素','深紫','青衣','便装'].map((name,row)=>({file:'yihua.png',row,rows:4,name})),
  lushi:[{file:'lushi.png',row:0,rows:2,name:'玄甲'},{file:'lushi-blue.png',row:0,rows:1,name:'藏蓝'},{file:'lushi.png',row:1,rows:2,name:'绛红'}]
 };
 const poses={
  luyuan:{file:'luyuan-a.png',front:[374,0,222,535],back:[791,0,233,535],head:[0,0,365,520]},
  shen:{file:'shen.png',front:[520,0,255,535],back:[1110,0,255,535],head:[25,0,485,525]},
  yihua:{file:'yihua.png',front:[362,0,240,415],back:[785,0,239,415],head:[0,0,345,414]},
  lushi:{file:'lushi.png',front:[552,0,263,763],back:[804,0,220,763],head:[0,0,410,760]}
 };
 const subnav=(items,label)=>`<nav class="gx-subnav" aria-label="${label}横向分页"><button data-substep="-1" aria-label="上一子页">←</button><div>${items.map((name,i)=>`<button data-subpage="${i}" aria-current="${!i}">${name}</button>`).join('')}</div><button data-substep="1" aria-label="下一子页">→</button><span class="gx-subcount" aria-live="polite">01 / ${String(items.length).padStart(2,'0')}</span></nav>`;
 const slide=(label,bg,body,i)=>`<article class="gx-subslide" aria-label="${label}" ${i?'inert':''}><div class="gx-subbackground" style="--sub-bg:url('${base+bg}')"></div>${body}</article>`;
 const videoPanel=document.querySelector('.gx-showcase');
 videoPanel.setAttribute('aria-label','古相思曲 · 视频展示');
 videoPanel.querySelector('header').outerHTML=head('title','古相思曲','FILM SHOWCASE');
 videoPanel.querySelector('.gx-film-name').textContent='古相思曲 / 动态影像';
 videoPanel.querySelector('.gx-footnote').textContent='ECHOES OF ANCIENT YEARNING / FILM';
 const film=videoPanel.querySelector('video');film.setAttribute('aria-label','古相思曲上传视频');film.removeAttribute('poster');film.preload='metadata';
 film.addEventListener('loadedmetadata',()=>{if(film.currentTime===0&&film.duration>1)film.currentTime=.15},{once:true});film.load();
 document.querySelector('.gx-overview header').outerHTML=head('title','古相思曲','STORY / FIVE REVERSE JOURNEYS','逆时五穿');
 let people=slide('四位主要人物 · 总览','p10-bg.webp',`${head('characters','角色设计','CHARACTER DESIGN','被史书颠倒的人 / 史册叙事与真实叙事')}<div class="gx-cast-overview">${cast.map((c,i)=>{const p=poses[c.id];return `<article class="gx-cast-card"><div class="gx-cast-art">${crop(p.file,p.front,c.name+'正面','gx-cast-front')}${crop(p.file,p.back,c.name+'背面','gx-cast-back')}${crop(p.file,p.head,c.name+'大头特写','gx-cast-head')}</div><button class="gx-cast-label" data-goto-person="${i+1}">${letter(c.id,c.name)}<span>${c.en}<small>${c.tag}</small></span></button></article>`}).join('')}</div>`,0);
 cast.forEach((c,i)=>{
  const looks=wardrobe[c.id];
  const body=`${head('characters','角色设计','CHARACTER / '+c.en)}<div class="gx-character-artwork"><button class="gx-outfit-hero gx-visual" data-image="${base+looks[0].file}" aria-label="放大${c.name}服装设定">${outfit(looks[0],c.name+' · '+looks[0].name)}</button><div class="gx-look-options" aria-label="${c.name}服装造型">${looks.map((look,j)=>`<button data-person="${c.id}" data-look="${j}" aria-pressed="${j===0}">${outfit(look,c.name+look.name)}<span>${look.name}</span></button>`).join('')}</div><p class="gx-art-note">${String(i+1).padStart(2,'0')} / COSTUME & PORTRAIT STUDIES · 点击主图放大</p></div><div class="gx-person-copy"><div class="gx-name"><h3>${letter(c.id,c.name)}</h3><span>${c.en} / ${c.role}</span></div><p class="gx-tag">${c.tag}</p><p class="gx-keywords">${c.keys}</p><div class="gx-dual"><div><small>史册 / 表层叙事</small><p>${c.surface}</p></div><div><small>真实叙事</small><p>${c.truth}</p></div></div><p class="gx-ability"><b>能力点</b>${c.ability}</p><blockquote>${c.quote}</blockquote><details class="gx-biography"><summary>阅读完整人物小传 <span>＋</span></summary><div class="gx-bio-scroll" tabindex="0">${c.bio}</div></details>${c.id==='shen'?media('shen-extra.webp','沈不言补充特写','gx-extra-portrait'):''}</div>`;
  people+=slide(c.name+' · 人物设定',`p${10+i}-bg.webp`,body,i+1);
 });
 const oldCharacters=[...document.querySelectorAll('.gx-character')];
 oldCharacters[0].insertAdjacentHTML('beforebegin',panel('gx-people','古相思曲 · 角色设计',`<div class="gx-subtrack" data-subtrack="people" aria-label="四位人物横向展示">${people}</div>${subnav(['总览',...cast.map(c=>c.name)],'人物')}`));oldCharacters.forEach(p=>p.remove());
 const sceneOverview=`${head('scenes','场景概念','SPACE / EMOTIONAL GEOGRAPHY','两个时空，一座南晟——场景按“情绪线”而非“剧情线”归档')}<div class="gx-scene-mosaic">${scenes.map((s,i)=>`<button data-goto-scene="${i+1}" class="gx-scene-cover"><img src="${base+s.images[0].file}" alt="${s.name} · ${s.title}" loading="lazy"><span>${String(i+1).padStart(2,'0')} / ${s.name}<b>${s.title}</b><small>${s.originalCount}张场景图${i===1?'＋1张补充图':''}</small></span></button>`).join('')}</div><div class="gx-method-line"><span>先查资料、脑中规划布局，再按区域逐项描述陈设</span><p>横向分区（左中右） × 纵深层次（前景 / 中景 / 后景 / 远景） × 六维度细写（外观形状、颜色、纹样、材质、年代痕迹、空间位置）</p></div>`;
 let spaces=slide('五类场景 · 总览',scenes[0].images[0].file,sceneOverview,0);
 scenes.forEach((s,i)=>{
  const body=`${head('scenes','场景概念','ENVIRONMENT / '+['PALACE','STRATAGEMS','SECRET REALM','WARFRONT','MODERN'][i])}<div class="gx-scene-gallery" style="--thumb-columns:${Math.min(4,s.images.length-1)}"><div class="gx-scene-main">${media(s.images[0].file,s.name+' · '+s.images[0].original)}</div><div class="gx-scene-thumbs">${s.images.slice(1).map((img,j)=>`<figure>${media(img.file,s.name+' · '+img.original)}<figcaption>${String(j+2).padStart(2,'0')}${img.original==='增加图片14.png'?' / 补充':''}</figcaption></figure>`).join('')}</div></div><div class="gx-scene-copy"><p class="eyebrow">0${i+1} / ${s.name}</p><h3>${s.title}</h3><p>${s.copy}</p><div class="gx-space-analysis"><span>空间组织</span><p>横向分区：左 / 中 / 右</p><p>纵深层次：前景 / 中景 / 后景 / 远景</p><span>陈设描述</span><p>外观形状 · 颜色 · 纹样 · 材质<br>年代痕迹 · 空间位置</p></div><p class="gx-scene-image-count">${s.originalCount}张原有场景图${i===1?'＋1张补充图':''}<small>点击任意图片放大查看</small></p></div>`;
  spaces+=slide(s.name+' · '+s.title,s.images[0].file,body,i+1);
 });
 document.querySelector('.gx-scenes').outerHTML=panel('gx-spaces','古相思曲 · 场景概念',`<div class="gx-subtrack" data-subtrack="scenes" aria-label="五类场景横向展示">${spaces}</div>${subnav(['总览',...scenes.map(s=>s.name)],'场景')}`);
 const toneHead=document.querySelector('.gx-tones .gx-heading');toneHead.classList.add('gx-tone-heading');toneHead.querySelector('h2').innerHTML=letter('tones','色调体系')+'<span>先定全篇影调基准，再让每场戏围绕基准变化</span>';
 document.querySelector('#track').insertAdjacentHTML('beforeend',panel('gx-contact','古相思曲 · 完整色调排布',`<div class="gx-contact-grid" aria-label="44张色调图">${gallery.map((g,i)=>`<button class="gx-tone-flip" aria-label="色调图${i+1}：${esc(g.original)}，悬停或点击翻转" aria-pressed="false"><span class="gx-flip-inner"><span class="gx-flip-front"><img src="${base+g.file}" alt="${esc(g.original)}" loading="lazy"><i></i></span><span class="gx-flip-back" aria-hidden="true"><img src="${base+g.file}" alt="" loading="lazy"></span></span></button>`).join('')}</div><div class="gx-system-title"><p class="gx-system-kicker">ECHOES OF ANCIENT YEARNING / 44 COLOR STUDIES</p><h2><span>色调体系</span><span lang="en">Color system</span></h2><p>先定全篇影调基准，再让每场戏围绕基准变化</p><p lang="en">First, establish the overall tonal baseline for the entire film,<br>then have each scene revolve around variations of this baseline.</p></div>`));
 document.querySelector('.contents-list li:nth-child(3)').innerHTML='<button data-page="7"><span>古相思曲</span><small>ECHOES OF ANCIENT YEARNING</small></button>';
 const reduced=matchMedia('(prefers-reduced-motion:reduce)'),controllers=new Map();
 document.querySelectorAll('[data-subtrack]').forEach(track=>{
  const parent=track.closest('.panel'),slides=[...track.children],nav=parent.querySelector('.gx-subnav');let at=0;
  function sync(){slides.forEach((s,i)=>{s.inert=i!==at;s.classList.toggle('gx-subactive',i===at)});nav.querySelectorAll('[data-subpage]').forEach((b,i)=>b.setAttribute('aria-current',String(i===at)));nav.querySelector('[data-substep="-1"]').disabled=at===0;nav.querySelector('[data-substep="1"]').disabled=at===slides.length-1;nav.querySelector('.gx-subcount').textContent=`${String(at+1).padStart(2,'0')} / ${String(slides.length).padStart(2,'0')}`;}
  function go(i){at=Math.max(0,Math.min(slides.length-1,i));track.scrollTo({left:at*track.clientWidth,behavior:reduced.matches?'instant':'smooth'});sync()}
  controllers.set(track.dataset.subtrack,go);nav.querySelectorAll('[data-subpage]').forEach(b=>b.addEventListener('click',()=>go(Number(b.dataset.subpage))));nav.querySelectorAll('[data-substep]').forEach(b=>b.addEventListener('click',()=>go(at+Number(b.dataset.substep))));track.addEventListener('scroll',()=>{at=Math.round(track.scrollLeft/track.clientWidth);sync()},{passive:true});
  parent.addEventListener('keydown',e=>{if(e.target.closest('.gx-bio-scroll'))return;if(['ArrowLeft','ArrowRight'].includes(e.key)){e.preventDefault();e.stopPropagation();go(at+(e.key==='ArrowRight'?1:-1))}});
  let sum=0,last=0;track.addEventListener('wheel',e=>{if(e.target.closest('.gx-bio-scroll')||Math.abs(e.deltaY)>=Math.abs(e.deltaX))return;e.preventDefault();e.stopPropagation();const now=performance.now();if(now-last<650)return;sum+=e.deltaX;if(Math.abs(sum)>35){go(at+Math.sign(sum));sum=0;last=now}},{passive:false});window.addEventListener('resize',()=>track.scrollTo({left:at*track.clientWidth,behavior:'instant'}));sync();
 });
 document.querySelectorAll('[data-goto-person]').forEach(b=>b.addEventListener('click',()=>controllers.get('people')(Number(b.dataset.gotoPerson))));document.querySelectorAll('[data-goto-scene]').forEach(b=>b.addEventListener('click',()=>controllers.get('scenes')(Number(b.dataset.gotoScene))));
 document.querySelectorAll('[data-look]').forEach(b=>b.addEventListener('click',()=>{const s=b.closest('.gx-subslide'),hero=s.querySelector('.gx-outfit-hero'),look=wardrobe[b.dataset.person][Number(b.dataset.look)];hero.innerHTML=outfit(look,b.dataset.person+' · '+look.name);hero.dataset.image=base+look.file;s.querySelectorAll('[data-look]').forEach(el=>el.setAttribute('aria-pressed',String(el===b)))}));
 let visualFocus=null;const dialog=document.querySelector('#lightbox');document.querySelectorAll('.gx-visual').forEach(b=>b.addEventListener('click',()=>{visualFocus=b;const img=document.createElement('img');img.src=b.dataset.image;img.alt=b.getAttribute('aria-label').replace(/^放大/,'');document.querySelector('.lightbox-stage').replaceChildren(img);document.querySelector('#lightbox-caption').textContent=img.alt;dialog.showModal();document.querySelector('.lightbox-close').focus()}));dialog.addEventListener('close',()=>{visualFocus?.focus();visualFocus=null});
 document.querySelectorAll('.gx-tone-flip').forEach(b=>b.addEventListener('click',()=>b.setAttribute('aria-pressed',String(b.getAttribute('aria-pressed')!=='true'))));
})();
