(() => {
 const panel=document.createElement('section');panel.className='panel ending';panel.inert=true;panel.setAttribute('aria-label','谢谢 · THANKS');
 const metal=(s,cls='')=>`<span class="chrome-text ${cls}" data-chrome="${s}" data-chrome-tone="red">${s}</span>`;
 panel.innerHTML=`<div class="stage"><div class="ending-marks" aria-hidden="true">${[[12,9],[88,9],[50,22],[39,33],[61,33],[34,56],[66,56],[39,78],[61,78],[50,89]].map(([x,y])=>`<i style="left:${x}%;top:${y}%"></i>`).join('')}</div><figure class="ending-art"><img src="assets/home/ending-flower.png" alt="红色背景上的金属花枝"></figure><h2 class="chrome-heading ending-heading">${metal('——谢谢——')}${metal('——THANKS——')}</h2><div class="ending-signature">${metal('织象')}${metal('WEAVING VISIONS')}${metal('梁臻')}${metal('LIANGZHEN')}</div></div>`;
 document.querySelector('#track').append(panel);
})();
