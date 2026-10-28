(() => {
 'use strict';
 // Subpage backgrounds live outside the scaled 1600×900 artwork, so they
 // fill the viewport on ultrawide and portrait screens without changing text.
 const controllers=[];
 document.querySelectorAll('.gx-people,.gx-spaces,.gx-tones').forEach(panel=>{
  const layer=document.createElement('div');layer.className='viewport-backdrop';layer.setAttribute('aria-hidden','true');panel.prepend(layer);panel.classList.add('has-viewport-backdrop');let signature='';
  function sync(){
   if(!panel.classList.contains('active'))return;
   let source=panel.querySelector('.gx-subslide.gx-subactive .gx-subbackground'),pseudo=null;
   if(panel.classList.contains('gx-tones')){const tabs=[...panel.querySelectorAll('[data-tone]')],index=Math.max(0,tabs.findIndex(t=>t.getAttribute('aria-selected')==='true'));source=panel.querySelectorAll('.gx-tone')[index];pseudo='::before';}
   if(!source)return;
   const css=getComputedStyle(source,pseudo),next=css.backgroundImage+'|'+css.backgroundPosition;
   if(next===signature)return;signature=next;layer.style.backgroundImage=css.backgroundImage;layer.style.backgroundPosition=css.backgroundPosition;
  }
  new MutationObserver(sync).observe(panel,{subtree:true,attributes:true,attributeFilter:['class','style','aria-selected']});
  // Changes to the layer's own style are observed once; signature stops loops.
  window.addEventListener('resize',()=>{signature='';sync()});controllers.push(sync);sync();
 });
 document.addEventListener('DOMContentLoaded',()=>controllers.forEach(sync=>sync()),{once:true});
})();
