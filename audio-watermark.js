(() => {
 'use strict';
 const bgm=document.createElement('audio');
 bgm.src='assets/audio/cyberpunk-city.mp3';
 bgm.loop=true;bgm.preload='none';bgm.volume=0.12;
 bgm.setAttribute('aria-label','背景音乐 Cyberpunk City');
 const click=document.createElement('audio');
 click.src='assets/audio/cool-interface-click-tone.wav';
 click.preload='auto';click.volume=0.28;
 const watermark=document.createElement('div');
 watermark.className='portfolio-watermark';
 watermark.textContent='织象 / WEAVING VISIONS · LIANG ZHEN';
 watermark.setAttribute('aria-label','作品署名：织象，梁臻');
 const toggle=document.createElement('button');
 toggle.className='portfolio-audio-toggle';toggle.type='button';
 toggle.setAttribute('aria-label','关闭背景音乐');
 toggle.setAttribute('aria-pressed','true');
 toggle.innerHTML='<span aria-hidden="true">♫</span><span>音乐开启</span>';
 document.body.append(bgm,click,watermark,toggle);
 let enabled=true,unlocked=false;
 const videoPlaying=()=>[...document.querySelectorAll('video')].some(video=>!video.paused&&!video.ended);
 function syncMusic(){
  if(!unlocked||!enabled||document.hidden||videoPlaying()){bgm.pause();return;}
  bgm.play().catch(()=>{});
 }
 function unlock(){if(unlocked)return;unlocked=true;syncMusic();}
 document.addEventListener('pointerdown',unlock,{capture:true});
 document.addEventListener('keydown',unlock,{capture:true});
 document.addEventListener('play',event=>{if(event.target.tagName==='VIDEO')syncMusic();},true);
 document.addEventListener('pause',event=>{if(event.target.tagName==='VIDEO')queueMicrotask(syncMusic);},true);
 document.addEventListener('ended',event=>{if(event.target.tagName==='VIDEO')queueMicrotask(syncMusic);},true);
 document.addEventListener('visibilitychange',syncMusic);
 toggle.addEventListener('click',()=>{enabled=!enabled;unlocked=true;toggle.setAttribute('aria-pressed',String(enabled));toggle.setAttribute('aria-label',enabled?'关闭背景音乐':'开启背景音乐');toggle.lastElementChild.textContent=enabled?'音乐开启':'音乐关闭';syncMusic();});
 document.addEventListener('click',()=>{
  click.currentTime=0;click.play().catch(()=>{});
 });
})();
