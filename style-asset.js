(() => {
  'use strict';

  const count = 7;
  const panel = document.createElement('section');
  panel.className = 'panel style-asset';
  panel.setAttribute('aria-label', '风格资产研创');
  panel.inert = true;
  const chrome = (text, extra = '') => `<span class="chrome-text ${extra}" data-chrome="${text}" data-chrome-tone="red"${extra === 'style-title-en' ? ' data-chrome-wrap="true"' : ''}>${text}</span>`;
  const cards = Array.from({ length: count * 3 }, (_, i) => {
    const n = i % count + 1;
    const id = String(n).padStart(3, '0');
    return `<article class="style-card${n >= 6 ? ' style-card--portrait' : ''}" tabindex="0" role="option" aria-label="视频 ${id}，点击切换或暂停" aria-selected="false" data-card="${i}">
      <video muted loop playsinline preload="none" poster="assets/style-asset/${id}.jpg" aria-label="风格化角色测试 ${id}"></video>
      <div class="style-card-meta"><b>${id}</b><span>2.5D / CHARACTER STUDY</span></div>
      <button type="button" class="style-play" aria-label="暂停视频">Ⅱ</button>
    </article>`;
  }).join('');

  panel.innerHTML = `<div class="stage">
    <header class="style-header">
      <p class="eyebrow">STYLE ASSET / RESEARCH & INNOVATION</p>
      <h2 class="chrome-heading">${chrome('风格资产研创')}${chrome('Style Asset Research and Innovation', 'style-title-en')}</h2>
      <div class="style-subtitle"><p>风格化3D角色与游戏资产转化探索</p><p lang="en">Exploration of Stylized Characters and Game Asset Transformation</p></div>
      <p class="style-intro">围绕AI生成的创意角色图像，探索强线条、绘画感与三维体积之间的转化方式。重点关注角色辨识度、发型轮廓、面部比例及原有风格的保留，测试不同视觉特征的参考图在三维生成中的适配性。</p>
    </header>
    <div class="style-carousel" aria-label="七组2.5D角色视频轮播">
      <div class="style-carousel-window" role="listbox" aria-label="选择角色视频"><div class="style-carousel-track">${cards}</div></div>
      <div class="style-carousel-controls"><button type="button" class="style-prev" aria-label="上一个视频">←</button><span class="style-carousel-count" aria-live="polite">01 / 07</span><button type="button" class="style-next" aria-label="下一个视频">→</button></div>
    </div>
    <div class="style-copy"><p>通过三组偏三维、两组偏二维的2.5D角色参考测试，探索强线条、绘画感与个性化造型向三维模型转化的适配性，重点观察角色辨识度、形体还原和多视角一致性。</p><p>同时，评估生成模型作为三维游戏资产制作起点的可能，识别后续重拓扑、UV整理、贴图烘焙、骨骼绑定与引擎验证所需的处理，为参考图筛选、美术风格确定及制作成本评估提供依据。</p></div>
    <span class="style-footnote">SEVEN MOTION STUDIES / 01—07</span>
  </div>`;
  document.querySelector('.ending').before(panel);

  const viewport = panel.querySelector('.style-carousel-window');
  const track = panel.querySelector('.style-carousel-track');
  const items = [...track.children];
  const number = panel.querySelector('.style-carousel-count');
  let index = count;
  let hover = false;
  let dragging = false;
  let startX = 0;
  let lastWheel = 0;
  let timer = 0;
  const file = i => `assets/style-asset/${String(i % count + 1).padStart(3, '0')}.mp4`;
  const isActive = () => panel.classList.contains('active') && !document.hidden;

  function position(instant = false) {
    const css = getComputedStyle(panel);
    const narrow = parseFloat(css.getPropertyValue('--style-card-small')) || 280;
    const wide = parseFloat(css.getPropertyValue('--style-card-wide')) || 500;
    const portraitNarrow = parseFloat(css.getPropertyValue('--style-card-portrait-small')) || 141;
    const portraitWide = parseFloat(css.getPropertyValue('--style-card-portrait-wide')) || 169;
    const gap = parseFloat(css.getPropertyValue('--style-card-gap')) || 18;
    const before = items.slice(0, index).reduce((total, item) => total + (item.classList.contains('style-card--portrait') ? portraitNarrow : narrow), 0);
    const currentWidth = items[index].classList.contains('style-card--portrait') ? portraitWide : wide;
    if (instant) track.classList.add('no-motion');
    track.style.transform = `translate3d(${viewport.clientWidth / 2 - before - index * gap - currentWidth / 2}px, 0, 0)`;
    if (instant) requestAnimationFrame(() => track.classList.remove('no-motion'));
  }

  function syncVideo() {
    items.forEach((item, i) => {
      const active = i === index;
      item.classList.toggle('is-current', active);
      item.setAttribute('aria-selected', String(active));
      const video = item.querySelector('video');
      if (active && isActive()) {
        if (!video.src) video.src = file(i);
        video.play().catch(() => {});
      } else video.pause();
    });
    number.textContent = `${String(index % count + 1).padStart(2, '0')} / 07`;
  }

  function select(next, instant = false) {
    if (next < 0 || next >= items.length) { next = (next % count + count) % count + count; instant = true; }
    index = next;
    syncVideo();
    position(instant);
  }

  function toggleVideo(item) {
    const video = item.querySelector('video');
    if (video.paused) video.play().catch(() => {});
    else video.pause();
  }

  track.addEventListener('transitionend', event => {
    if (event.target !== track || event.propertyName !== 'transform') return;
    if (index < count || index >= count * 2) select((index % count + count) % count + count, true);
  });
  panel.querySelector('.style-prev').addEventListener('click', () => select(index - 1));
  panel.querySelector('.style-next').addEventListener('click', () => select(index + 1));
  items.forEach((item, i) => {
    const video = item.querySelector('video');
    const play = item.querySelector('.style-play');
    video.addEventListener('play', () => { item.classList.remove('is-paused'); play.textContent = 'Ⅱ'; play.setAttribute('aria-label', '暂停视频'); });
    video.addEventListener('pause', () => { item.classList.add('is-paused'); play.textContent = '▶'; play.setAttribute('aria-label', '播放视频'); });
    play.addEventListener('click', event => { event.stopPropagation(); toggleVideo(item); });
    item.addEventListener('click', event => {
      if (i !== index && !dragging) select(i);
      else if (!dragging && event.target !== play) toggleVideo(item);
    });
    item.addEventListener('keydown', event => {
      if ((event.key === 'Enter' || event.key === ' ') && event.target === item) { event.preventDefault(); event.stopPropagation(); i === index ? toggleVideo(item) : select(i); }
    });
  });
  viewport.addEventListener('wheel', event => {
    if (!isActive() || event.ctrlKey) return;
    event.preventDefault();
    event.stopPropagation();
    if (performance.now() - lastWheel < 420) return;
    lastWheel = performance.now();
    select(index + Math.sign(Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY));
  }, { passive: false });
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
    event.preventDefault();
    event.stopPropagation();
    select(index + (event.key === 'ArrowRight' ? 1 : -1));
  });
  viewport.addEventListener('mouseenter', () => { hover = true; });
  viewport.addEventListener('mouseleave', () => { hover = false; });
  panel.addEventListener('focusin', () => { hover = true; });
  panel.addEventListener('focusout', () => { hover = false; });
  new MutationObserver(syncVideo).observe(panel, { attributes: true, attributeFilter: ['class'] });
  document.addEventListener('visibilitychange', syncVideo);
  new ResizeObserver(() => position(true)).observe(viewport);
  timer = setInterval(() => { if (isActive() && !hover && !dragging) select(index + 1); }, 8500);
  select(index, true);
})();
