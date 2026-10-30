(() => {
 'use strict';
 const assets=window.SUPER_DESIGN_ASSETS,base='assets/super/';
 if(!assets)return;
 const bios=[
 {
  "name": "杨见深",
  "mapping": "二郎神映射",
  "tag": "感知 / 借用 / 自我定义",
  "en": "YANG JIANSHEN"
 },
 {
  "name": "桑莞 / 齐小满",
  "mapping": "织女映射",
  "tag": "连接 / 等待 / 守护",
  "en": "SANG WAN / QI XIAOMAN"
 },
 {
  "name": "齐烈",
  "mapping": "孙悟空映射",
  "tag": "变化 / 忠诚 / 反抗",
  "en": "QI LIE"
 },
 {
  "name": "温绍",
  "mapping": "女娲映射",
  "tag": "塑形 / 血肉 / 真实",
  "en": "WEN SHAO"
 },
 {
  "name": "宁焱",
  "mapping": "红孩儿映射",
  "tag": "火焰 / 记忆 / 失控",
  "en": "NING YAN"
 },
 {
  "name": "燕知春",
  "mapping": "铁扇公主映射",
  "tag": "风刃 / 借力 / 自救",
  "en": "YAN ZHICHUN"
 },
 {
  "name": "洛明明",
  "mapping": "孟婆映射",
  "tag": "记忆 / 收尾 / 反抗",
  "en": "LUO MINGMING"
 },
 {
  "name": "白一诺",
  "mapping": "谛听映射",
  "tag": "真相 / 倾听 / 自我放逐",
  "en": "BAI YINUO"
 }
];
 const chrome=(cn,en)=>`<h2 class="chrome-heading"><span class="chrome-text" data-chrome="${cn}">${cn}</span><span class="chrome-text chrome-english" data-chrome="${en}">${en}</span></h2>`;
 const panel=document.createElement('section');panel.className='panel sm-design sm-characters';panel.setAttribute('aria-label','超能映射 · 角色设定');panel.inert=true;
 panel.innerHTML=`<div class="stage"><header class="sm-header"><p class="eyebrow">CHARACTER / DIVINE MAPPING</p>${chrome('角色设定','Character Setup')}</header><div class="sm-archive-note"><span>SUPER MAPPING</span><b>八个人，八种命运的回声</b><small>点击文件夹展开 · 照片保持原尺寸</small></div><div class="sm-folder-grid" role="list" aria-label="八位主要人物"></div><div class="sm-bottom"><span>CHARACTER ARCHIVE / 08 FILES</span><span>CHARACTER DESIGN / 18 IMAGES</span></div></div>`;
 document.querySelector('#track').append(panel);
 let opened=-1;
 function setOpen(index){opened=opened===index?-1:index;panel.querySelectorAll('.sm-folder').forEach((el,i)=>{const on=i===opened;el.classList.toggle('is-open',on);el.querySelector('.sm-folder-toggle').setAttribute('aria-expanded',String(on));el.querySelector('.sm-folder-photos').inert=!on;});}
 bios.forEach((bio,index)=>{
  const folder=document.createElement('article');folder.className='sm-folder';folder.setAttribute('role','listitem');
  let imgs=[...assets.characters[index].images].sort((a,b)=>(a.width/a.height)-(b.width/b.height));if(index===4)imgs=[...imgs.filter(x=>x.source.includes('(3)')),...imgs.filter(x=>!x.source.includes('(3)'))];
  folder.innerHTML=`<div class="sm-folder-object"><div class="sm-folder-back"></div><div class="sm-folder-photos" inert>${imgs.map((im,j)=>`<button class="sm-folder-photo image-view" data-image="${base+im.file}" style="--slot:${j};--fan:${j-(imgs.length-1)/2}" aria-label="放大${bio.name}照片${j+1}"><img src="${base+im.file}" alt="${bio.name}设定图${j+1}" loading="lazy"></button>`).join('')}</div><button class="sm-folder-toggle" aria-expanded="false" aria-label="展开${bio.name}文件夹"><span class="sm-folder-front"><span class="sm-folder-number">${String(index+1).padStart(2,'0')}</span><span class="sm-folder-name">${bio.name}</span><span class="sm-folder-map">${bio.mapping}</span><span class="sm-folder-action">${imgs.length} PHOTOS <i>↗</i></span></span></button></div><div class="sm-folder-caption"><span>${bio.en}</span><span>${bio.tag}</span></div>`;
  folder.querySelector('.sm-folder-toggle').addEventListener('click',()=>setOpen(index));folder.addEventListener('keydown',e=>{if(e.key==='Escape'){e.stopPropagation();opened=index;setOpen(index);folder.querySelector('.sm-folder-toggle').focus();}});panel.querySelector('.sm-folder-grid').append(folder);
 });
 const captions=['办公区 / WORKSPACE','垂直交通 / CIRCULATION','秩序空间 / ORDER','环形大厅 / ROTUNDA','实验空间 / LABORATORY','封闭走廊 / CORRIDOR','夜城 / NIGHT CITY','商业街 / COMMERCIAL STREET','城市纵深 / URBAN DEPTH'];
 const scene=document.createElement('section');scene.className='panel sm-design sm-scenes';scene.setAttribute('aria-label','超能映射 · 场景设计');scene.inert=true;
 scene.innerHTML=`<div class="stage"><aside class="sm-scene-aside"><p class="eyebrow">CASE 03 / SPACE / SCENE DESIGN</p>${chrome('场景设计','SCENE DESIGN')}<div class="sm-scene-index"><span>SUPER MAPPING</span><b>超能映射</b><p>《星域奇旅》PV</p></div><ol class="sm-scene-chapters"><li><b>01</b><span>秩序与日常<small>ORDER & EVERYDAY LIFE</small></span></li><li><b>02</b><span>机构与边界<small>INSTITUTION & BOUNDARY</small></span></li><li><b>03</b><span>城市与奇观<small>CITY & SPECTACLE</small></span></li></ol><span class="sm-scene-hint">09 SCENES / 场景展示</span></aside><div class="scene-grid sm-scene-grid">${assets.scenes.map((im,i)=>`<button class="scene-cell image-view" data-image="${base+im.file}" aria-label="放大超能映射场景${i+1}"><img src="${base+im.file}" alt="${captions[i]}" width="${im.width}" height="${im.height}" loading="lazy"><span class="scene-label">${String(i+1).padStart(2,'0')} / ${captions[i]}</span></button>`).join('')}</div></div>`;
 document.querySelector('#track').append(scene);
})();
