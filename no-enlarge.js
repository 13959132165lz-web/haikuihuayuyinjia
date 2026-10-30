(() => {
 'use strict';
 // Keep image artwork in its designed position and remove its preview action.
 document.querySelectorAll('button.image-view,button.gx-visual').forEach(button=>{
  button.disabled=true;
  button.tabIndex=-1;
  button.setAttribute('role','img');
  button.setAttribute('aria-label',button.querySelector('img')?.alt||button.getAttribute('aria-label')?.replace(/^(放大|查看)/,'')||'作品图片');
 });
 // Preserve playback and seeking while removing native fullscreen/PiP enlargement.
 document.querySelectorAll('video').forEach(video=>{
  video.controlsList?.add('nofullscreen');
  video.disablePictureInPicture=true;
 });
})();
