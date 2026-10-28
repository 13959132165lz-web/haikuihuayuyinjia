(() => {
 'use strict';
 const assets=window.SUPER_DESIGN_ASSETS,base='assets/super/';
 if(!assets)return;
 const bios=[
 {name:'杨见深',mapping:'二郎神映射',tag:'感知 / 借用 / 自我定义',en:'YANG JIANSHEN',sections:[
 ['年龄 / 身份','29岁，精神病院在押患者 / AIGC程序员 / 归藏会创建者。'],
 ['神祇映射','不详（实为世上首例“三代神”）。他并非被神选中，而是在十三岁那年，濒死的二代神林渡在执念爆发瞬间，将能力残响意外映射入他体内创造的产物。'],
 ['核心能力','感知与短暂借用。能感知映射觉醒者的觉醒瞬间与境遇，并短暂借用对方的能力。限制是他永远无法同时拥有两种能力，也无法保留数小时以上。'],
 ['能力代价','每次借用都会在体内留下“映射残留”，被迫亲身体验对方的肉体痛苦或精神困境。'],
 ['人物标签与弧光','压抑、自疑、无力。他的核心困境是“看得见一切痛苦，却无力真正改变”。第一季中，他经历了从相信自己疯了的“被定义者”，最终找回记忆蜕变为“自我定义者”的历程。'],
 ['底层能力','倾向于“概率操控”作为底层能力，表现为“运气好”，但其本质是能控制概率，使其更具神秘感和深度。']]},
 {name:'桑莞 / 齐小满',mapping:'织女映射',tag:'连接 / 等待 / 守护',en:'SANG WAN / QI XIAOMAN',sections:[
 ['年龄 / 身份','25岁，归藏会二把手 / 杨见深颅内声音的主人 / 齐烈寻找了六年的妹妹。'],
 ['神祇映射','织女（跨越物理的连接者）。'],
 ['核心能力','编织超能力连接路径。能感知、维系或短暂接通不同觉醒者的能力，亦可将自身实影投射到反光面上进行远程通讯。'],
 ['能力代价','每一次编织连接，都在消耗她与对方之间的情感纽带。'],
 ['人物标签与弧光','等待、隐忍、守护、自我寻找。她一直面临女性主体性困境，一生都在被拉扯，为了守护杨见深等待了六年。第一季的定位是引导杨见深的“被寻找者”。']]},
 {name:'齐烈',mapping:'孙悟空映射',tag:'变化 / 忠诚 / 反抗',en:'QI LIE',sections:[
 ['年龄 / 身份','28岁，观星署外勤A组负责人。'],['神祇映射','孙悟空（变化形象外勤战力担当）。'],
 ['核心能力','七十二变化形。可从声音到体态完全复刻不同性别、外貌与身份，战斗直觉极强。'],
 ['能力代价','长时间变形后回归本体时，会经历短暂的“自我认知障碍”，记不起自己的脸。'],
 ['人物标签与弧光','伪装、内耗、忠诚、深情。他身处体制内，深受“理想主义”与“寻找失踪妹妹”的精神内耗折磨。第一季结尾，他从观星署最好用的武器（斗战胜佛），选择用七十二变掩护杨见深逃离，主动叛出回归反抗者本色（齐天大圣）。']]},
 {name:'温绍',mapping:'女娲映射',tag:'塑形 / 血肉 / 真实',en:'WEN SHAO',sections:[['人物小传','粉丝站哥，能揉捏塑形万物，代价是消耗自身血肉。他为了给偶像范小屿修图而不断自残，最终认识到真实的脸才最可贵。']]},
 {name:'宁焱',mapping:'红孩儿映射',tag:'火焰 / 记忆 / 失控',en:'NING YAN',sections:[['人物小传','红孩儿：变成了一个年仅六岁的小女孩，父亲是牺牲的消防员。杨见深曾在过去教她控制火焰，但她最终失控引发火灾，被观星署带走。在当下时空中，这个天真的小女孩已经被观星署抽干了记忆与情感，异化成了一头浑身缠绕残火与晶石的“烈焰怪物”，成为了观星署阴谋的直接受害者。']]},
 {name:'燕知春',mapping:'铁扇公主映射',tag:'风刃 / 借力 / 自救',en:'YAN ZHICHUN',sections:[['人物小传','归藏会成员，能操控压缩空气形成风刃，她将能力短暂借给家暴受害者，让杨见深看到了普通人自救的可能。']]},
 {name:'洛明明',mapping:'孟婆映射',tag:'记忆 / 收尾 / 反抗',en:'LUO MINGMING',sections:[['人物小传','洛明明：在过去时空中是“最强收尾专员”，而在当下时空中摇身一变，成为了反抗组织“铭忆会”的特别行动小队队长，带领队伍与观星署正面交火。她的记忆消除能力被开发出了极强的实战用途——只要指尖触碰敌人额头，就能让敌人“忘记攻击目的”而愣在原地。']]},
 {name:'白一诺',mapping:'谛听映射',tag:'真相 / 倾听 / 自我放逐',en:'BAI YINUO',sections:[['人物小传','白一诺，曾是业内最年轻有为的心理咨询师，谛听并不是第一次在他身上映射，只是那时在服药的杨见深并未感应到。谛听让白一诺能分辨每一句谎言，就在半年前，他忍不住告诉一个女孩她的男友在说谎。女孩没有信他，可一周后她从楼顶跳下。白一诺从此不再进行心理咨询，他搬到城市角落，开不收钱的“陪聊诊所”，专门听人说真假难辨的废话，却不再揭穿，这是他给自己的无期徒刑。']]}
 ];
 const chrome=(cn,en)=>`<h2 class="chrome-heading"><span class="chrome-text" data-chrome="${cn}">${cn}</span><span class="chrome-text chrome-english" data-chrome="${en}">${en}</span></h2>`;
 const panel=document.createElement('section');panel.className='panel sm-design sm-characters';panel.setAttribute('aria-label','超能映射 · 角色设定');panel.inert=true;
 panel.innerHTML=`<div class="stage"><header class="sm-header"><p class="eyebrow">CASE 03 / CHARACTER / DIVINE MAPPING</p>${chrome('案例三 · 角色设定','Case Three: Character Setup')}</header><div class="sm-archive-note"><span>SUPER MAPPING</span><b>八个人，八种命运的回声</b><small>点击文件夹展开 · 选择照片查看完整人物档案</small></div><div class="sm-folder-grid" role="list" aria-label="八位主要人物"></div><div class="sm-bottom"><span>CHARACTER ARCHIVE / 08 FILES</span><span>能力 · 代价 · 人物弧光</span></div></div>`;
 document.querySelector('#track').append(panel);
 const dialog=document.createElement('dialog');dialog.className='sm-dossier';dialog.id='sm-dossier';dialog.setAttribute('aria-labelledby','sm-dossier-title');
 dialog.innerHTML='<div class="sm-dossier-bar"><span>SUPER MAPPING / CHARACTER ARCHIVE</span><button class="sm-dossier-close" aria-label="关闭人物档案">关闭 ×</button></div><div class="sm-dossier-content"><div class="sm-dossier-photos"></div><article class="sm-dossier-copy" tabindex="0"></article></div>';
 document.body.append(dialog);let trigger=null,opened=-1;
 function openDossier(index,button){const b=bios[index],original=assets.characters[index].images,items=index===4?[original[2],original[3],original[0],original[1]]:original;trigger=button;
  dialog.querySelector('.sm-dossier-photos').innerHTML=items.map((im,j)=>{const label=index===4?(j<2?'形象 A':'形象 B'):(im.width>im.height?'服装与多视图设定':'肖像');return `<figure class="${im.width>im.height?'sm-sheet':'sm-portrait'}"><button class="image-view" data-image="${base+im.file}" aria-label="放大${b.name}${label}"><img src="${base+im.file}" alt="${b.name} · ${label}" width="${im.width}" height="${im.height}"></button><figcaption>${String(j+1).padStart(2,'0')} / ${label}</figcaption></figure>`;}).join('');
  dialog.querySelector('.sm-dossier-copy').innerHTML=`<p class="eyebrow">${String(index+1).padStart(2,'0')} / ${b.en}</p><h2 id="sm-dossier-title">${b.name}</h2><p class="sm-mapping">${b.mapping}</p><p class="sm-dossier-tags">${b.tag}</p>${b.sections.map(([title,copy])=>`<section><h3>${title}</h3><p>${copy}</p></section>`).join('')}`;
  // Register new photo buttons with the shared full-resolution viewer.
  dialog.querySelectorAll('.image-view').forEach(button=>button.addEventListener('click',()=>{const viewer=document.querySelector('#lightbox'),image=document.createElement('img');image.src=button.dataset.image;image.alt=button.querySelector('img').alt;document.querySelector('.lightbox-stage').replaceChildren(image);document.querySelector('#lightbox-caption').textContent=image.alt;viewer.addEventListener('close',()=>button.focus(),{once:true});viewer.showModal();document.querySelector('.lightbox-close').focus();}));
  dialog.showModal();dialog.querySelector('.sm-dossier-content').scrollTop=0;dialog.querySelector('.sm-dossier-close').focus();
 }
 function setOpen(index){opened=opened===index?-1:index;panel.querySelectorAll('.sm-folder').forEach((el,i)=>{const on=i===opened;el.classList.toggle('is-open',on);el.querySelector('.sm-folder-toggle').setAttribute('aria-expanded',String(on));el.querySelector('.sm-folder-photos').inert=!on;});}
 bios.forEach((bio,index)=>{
  const folder=document.createElement('article');folder.className='sm-folder';folder.setAttribute('role','listitem');folder.style.setProperty('--folder-hue',[345,190,32,260,8,160,220,38][index]);
  let imgs=[...assets.characters[index].images].sort((a,b)=>(a.width/a.height)-(b.width/b.height));if(index===4)imgs=[...imgs.filter(x=>x.source.includes('(3)')),...imgs.filter(x=>!x.source.includes('(3)'))];
  folder.innerHTML=`<div class="sm-folder-object"><div class="sm-folder-back"></div><div class="sm-folder-photos" inert>${imgs.map((im,j)=>`<button class="sm-folder-photo" style="--slot:${j};--fan:${j-(imgs.length-1)/2}" aria-label="打开${bio.name}人物档案，照片${j+1}"><img src="${base+im.file}" alt="${bio.name}设定图${j+1}" loading="lazy"></button>`).join('')}</div><button class="sm-folder-toggle" aria-expanded="false" aria-label="展开${bio.name}文件夹"><span class="sm-folder-front"><span class="sm-folder-number">${String(index+1).padStart(2,'0')}</span><span class="sm-folder-name">${bio.name}</span><span class="sm-folder-map">${bio.mapping}</span><span class="sm-folder-action">${imgs.length} PHOTOS <i>↗</i></span></span></button></div><div class="sm-folder-caption"><span>${bio.en}</span><span>${bio.tag}</span></div>`;
  folder.querySelector('.sm-folder-toggle').addEventListener('click',()=>setOpen(index));folder.querySelectorAll('.sm-folder-photo').forEach(button=>button.addEventListener('click',()=>openDossier(index,button)));folder.addEventListener('keydown',e=>{if(e.key==='Escape'){e.stopPropagation();opened=index;setOpen(index);folder.querySelector('.sm-folder-toggle').focus();}});panel.querySelector('.sm-folder-grid').append(folder);
 });
 dialog.querySelector('.sm-dossier-close').addEventListener('click',()=>dialog.close());dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close();});dialog.addEventListener('close',()=>trigger?.focus());
 dialog.addEventListener('wheel',e=>e.stopPropagation(),{passive:true});dialog.addEventListener('keydown',e=>e.stopPropagation());
 const captions=['办公区 / WORKSPACE','垂直交通 / CIRCULATION','秩序空间 / ORDER','环形大厅 / ROTUNDA','实验空间 / LABORATORY','封闭走廊 / CORRIDOR','夜城 / NIGHT CITY','商业街 / COMMERCIAL STREET','城市纵深 / URBAN DEPTH'];
 const scene=document.createElement('section');scene.className='panel sm-design sm-scenes';scene.setAttribute('aria-label','超能映射 · 场景设计');scene.inert=true;
 scene.innerHTML=`<div class="stage"><aside class="sm-scene-aside"><p class="eyebrow">CASE 03 / SPACE / SCENE DESIGN</p>${chrome('场景设计','SCENE DESIGN')}<div class="sm-scene-index"><span>SUPER MAPPING</span><b>超能映射</b><p>《星域奇旅》PV</p></div><ol class="sm-scene-chapters"><li><b>01</b><span>秩序与日常<small>ORDER & EVERYDAY LIFE</small></span></li><li><b>02</b><span>机构与边界<small>INSTITUTION & BOUNDARY</small></span></li><li><b>03</b><span>城市与奇观<small>CITY & SPECTACLE</small></span></li></ol><span class="sm-scene-hint">09 SCENES / 点击查看原图 ↗</span></aside><div class="scene-grid sm-scene-grid">${assets.scenes.map((im,i)=>`<button class="scene-cell image-view" data-image="${base+im.file}" aria-label="放大超能映射场景${i+1}"><img src="${base+im.file}" alt="${captions[i]}" width="${im.width}" height="${im.height}" loading="lazy"><span class="scene-label">${String(i+1).padStart(2,'0')} / ${captions[i]}</span></button>`).join('')}</div></div>`;
 document.querySelector('#track').append(scene);
})();
