(() => {
  'use strict';

  const count = 4;
  const panel = document.createElement('section');
  panel.className = 'panel scene-asset';
  panel.setAttribute('aria-label', '场景资产');
  panel.inert = true;
  const cards = Array.from({ length: count * 3 }, (_, i) => {
    const id = String(i % count + 1).padStart(3, '0');
    return `<article class="style-card scene-card" role="option" tabindex="0" aria-selected="false" aria-label="场景 ${id}，点击切换" data-card="${i}">
      <img src="assets/scene-asset/${id}.webp" alt="雨林树屋场景视角 ${id}" decoding="async">
      <div class="style-card-meta"><b>${id}</b><span>RAINFOREST / TREEHOUSE</span></div>
    </article>`;
  }).join('');

  panel.innerHTML = `<div class="stage">
    <header class="scene-asset-header">
      <p class="eyebrow">SCENE ASSET / 3D TRANSFORMATION</p>
      <h2 class="chrome-heading"><span class="chrome-text" data-chrome="场景资产">场景资产</span><span class="chrome-text scene-asset-english" data-chrome="Scene assets">Scene assets</span></h2>
    </header>
    <div class="scene-asset-carousel style-carousel" aria-label="四张雨林树屋场景图轮播">
      <div class="style-carousel-window" role="listbox" aria-label="选择场景图片"><div class="style-carousel-track">${cards}</div></div>
      <div class="style-carousel-controls"><button type="button" class="style-prev" aria-label="上一张场景图">←</button><span class="style-carousel-count" aria-live="polite">01 / 04</span><button type="button" class="style-next" aria-label="下一张场景图">→</button></div>
    </div>
    <div class="scene-asset-copy">
      <h3>从 AI 生成图到 UE5 三维场景</h3>
      <p class="scene-asset-copy-en" lang="en"><strong>From AI-Generated Image to 3D Scene in Unreal Engine 5</strong></p>
      <p>从 AI 生成的雨林树屋场景开始，探索 <strong>Tripo AI 三维模型生成平台—Autodesk Maya 三维制作软件—Epic Games 虚幻引擎 5</strong> 的完整流程：将巨树、树屋、藤蔓、植被与水域拆分生成，在 Maya 中整理模型与材质，再导入虚幻引擎 5 组合场景。通过测试，评估原图的造型、色彩、材质和空间层次能否延续至三维，并验证资产用于游戏场景的复用与调整潜力。</p>
    </div>
  </div>`;
  document.querySelector('.ending').before(panel);

  const viewport = panel.querySelector('.style-carousel-window');
  const track = panel.querySelector('.style-carousel-track');
  const items = [...track.children];
  const number = panel.querySelector('.style-carousel-count');
  let index = count;
  let hovering = false;
  let dragging = false;
  let startX = 0;
  let lastWheel = 0;
  const isActive = () => panel.classList.contains('active') && !document.hidden;

  function position(instant = false) {
    const css = getComputedStyle(panel);
    const narrow = parseFloat(css.getPropertyValue('--scene-card-small')) || 300;
    const wide = parseFloat(css.getPropertyValue('--scene-card-wide')) || 640;
    const gap = parseFloat(css.getPropertyValue('--scene-card-gap')) || 18;
    if (instant) track.classList.add('no-motion');
    track.style.transform = `translate3d(${viewport.clientWidth / 2 - index * (narrow + gap) - wide / 2}px,0,0)`;
    if (instant) requestAnimationFrame(() => track.classList.remove('no-motion'));
  }

  function select(next, instant = false) {
    if (next < 0 || next >= items.length) { next = (next % count + count) % count + count; instant = true; }
    index = next;
    items.forEach((item, i) => { item.classList.toggle('is-current', i === index); item.setAttribute('aria-selected', String(i === index)); });
    number.textContent = `${String(index % count + 1).padStart(2, '0')} / 04`;
    position(instant);
  }

  track.addEventListener('transitionend', event => {
    if (event.target !== track || event.propertyName !== 'transform') return;
    if (index < count || index >= count * 2) select((index % count + count) % count + count, true);
  });
  panel.querySelector('.style-prev').addEventListener('click', () => select(index - 1));
  panel.querySelector('.style-next').addEventListener('click', () => select(index + 1));
  items.forEach((item, i) => {
    item.addEventListener('click', () => { if (!dragging) select(i); });
    item.addEventListener('keydown', event => {
      if ((event.key === 'Enter' || event.key === ' ') && event.target === item) { event.preventDefault(); event.stopPropagation(); select(i); }
    });
  });
  viewport.addEventListener('wheel', event => {
    if (!isActive() || event.ctrlKey) return;
    event.preventDefault(); event.stopPropagation();
    if (performance.now() - lastWheel < 420) return;
    lastWheel = performance.now();
    select(index + Math.sign(Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY));
  }, { passive: false });
  viewport.addEventListener('touchstart', event => event.stopPropagation(), { passive: true });
  viewport.addEventListener('touchend', event => event.stopPropagation(), { passive: true });
  viewport.addEventListener('pointerdown', event => { startX = event.clientX; dragging = false; });
  viewport.addEventListener('pointerup', event => {
    const dx = event.clientX - startX;
    if (Math.abs(dx) < 42) return;
    dragging = true;
    select(index + (dx < 0 ? 1 : -1));
    setTimeout(() => { dragging = false; }, 0);
  });
  viewport.addEventListener('keydown', event => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault(); event.stopPropagation();
    select(index + (event.key === 'ArrowRight' ? 1 : -1));
  });
  viewport.addEventListener('mouseenter', () => { hovering = true; });
  viewport.addEventListener('mouseleave', () => { hovering = false; });
  panel.addEventListener('focusin', () => { hovering = true; });
  panel.addEventListener('focusout', () => { hovering = false; });
  new ResizeObserver(() => position(true)).observe(viewport);
  setInterval(() => { if (isActive() && !hovering && !dragging) select(index + 1); }, 7000);
  select(index, true);
})();
