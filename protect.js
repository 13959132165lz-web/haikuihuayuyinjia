(() => {
 'use strict';
 // Browser-side deterrents only; rendered media cannot be made uncapturable.
 const mediaSelector='img,video,canvas,.image-view,.video-tile,.lightbox-stage,.media-tile';
 function protect(root){
  const elements=[];
  if(root.nodeType===1&&root.matches('img,video,a[download]'))elements.push(root);
  if(root.querySelectorAll)elements.push(...root.querySelectorAll('img,video,a[download]'));
  for(const el of elements){
   if(el.matches('a[download]')){el.remove();continue;}
   el.draggable=false;el.style.webkitUserDrag='none';el.style.userSelect='none';el.style.webkitTouchCallout='none';
   if(el.tagName==='VIDEO'){el.setAttribute('controlslist','nodownload noremoteplayback nofullscreen');el.disablePictureInPicture=true;el.disableRemotePlayback=true;}
  }
 }
 protect(document);
 new MutationObserver(records=>records.forEach(r=>r.addedNodes.forEach(protect))).observe(document.body,{childList:true,subtree:true});
 document.addEventListener('contextmenu',e=>e.preventDefault(),{capture:true});
 document.addEventListener('dragstart',e=>{if(e.target.closest?.(mediaSelector))e.preventDefault();},{capture:true});
 function selectedMedia(e){
  if(e.target.closest?.(mediaSelector)||document.activeElement?.closest?.(mediaSelector))return true;
  const selection=getSelection();
  return selection&&selection.rangeCount&&[...document.querySelectorAll('img,video')].some(m=>selection.containsNode(m,true));
 }
 document.addEventListener('copy',e=>{if(selectedMedia(e)){e.preventDefault();e.clipboardData?.clearData();}},{capture:true});
 document.addEventListener('cut',e=>{if(selectedMedia(e))e.preventDefault();},{capture:true});
 document.addEventListener('keydown',e=>{if((e.ctrlKey||e.metaKey)&&(e.key.toLowerCase()==='s'||(['c','x'].includes(e.key.toLowerCase())&&selectedMedia(e))))e.preventDefault();},{capture:true});
})();
