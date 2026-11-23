'use strict';

const mediaFolders = {
  repaint: 'comfyUI-局部重绘制',
  parts: 'comfyUI-角色拆件',
  pose: 'comfyUI-人物改动作',
  lora: 'Lora',
};
const slides = Array.from(document.querySelectorAll('.panel'));
const nav = Array.from(document.querySelectorAll('.chapter-nav a'));
const controls = Array.from(document.querySelectorAll('[data-step]'));
const counter = document.querySelector('.page-count');
const dialog = document.querySelector('.image-dialog');
const dialogImage = dialog.querySelector('img');
const dialogTitle = dialog.querySelector('h2');
const zoomButton = document.createElement('button');
const motion = matchMedia('(prefers-reduced-motion: reduce)');
const ease = 'cubic-bezier(.76,0,.18,1)';
const stagesReady = new WeakSet();

const number = value => String(value).padStart(2, '0');
const mediaPath = (...segments) => './' + segments.map(encodeURIComponent).join('/');
const backgroundPath = (name, portrait = false) => {
  return portrait ? mediaPath('背景图', '竖版', name + '.png') : mediaPath('背景图', name + '.png');
};

zoomButton.type = 'button';
zoomButton.className = 'image-zoom';
zoomButton.textContent = '查看细节';
zoomButton.hidden = true;
zoomButton.setAttribute('aria-pressed', 'false');
dialog.querySelector('.close-dialog').before(zoomButton);

function createImage(src, alt) {
  const image = document.createElement('img');
  image.alt = alt;
  image.dataset.src = src;
  image.decoding = 'async';
  image.draggable = false;
  return image;
}

function loadImage(image) {
  if (!image.hasAttribute('src')) image.src = image.dataset.src;
}

function makeFlipGallery(key, entries, cardBackground) {
  const gallery = document.querySelector('[data-gallery="' + key + '"]');
  const grid = document.createElement('div');
  grid.className = 'gallery-grid';
  entries.forEach(entry => {
    const [label, frontFile, backFile, frontLabel, backLabel, revision = ''] = entry;
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'flip-card';
    button.setAttribute('aria-pressed', 'false');
    button.setAttribute('aria-label', label + '，' + frontLabel + '。点击切换到' + backLabel);
    button.innerHTML = '<span class="flip-figure"><span class="art-lift"><span class="art-rotor"><span class="art-side art-front"></span><span class="art-side art-back" aria-hidden="true"></span></span></span></span><span class="art-label"><span></span><small></small></span>';
    const frame = button.querySelector('.flip-figure');
    const lift = button.querySelector('.art-lift');
    if (cardBackground) frame.style.setProperty('--card-art', 'url("' + backgroundPath(cardBackground, true) + '")');
    const front = button.querySelector('.art-front');
    const back = button.querySelector('.art-back');
    const frontImg = createImage(mediaPath(mediaFolders[key], frontFile) + revision, label + ' · ' + frontLabel);
    const backImg = createImage(mediaPath(mediaFolders[key], backFile) + revision, label + ' · ' + backLabel);
    front.append(frontImg);
    back.append(backImg);
    const caption = button.querySelector('.art-label');
    caption.firstElementChild.textContent = label;
    const sideLabel = caption.lastElementChild;
    sideLabel.textContent = frontLabel;
    let loading = false;
    let liftAnimation;
    const prepareBack = () => loadImage(backImg);
    button.addEventListener('pointerenter', prepareBack, { once: true });
    button.addEventListener('focusin', prepareBack, { once: true });
    button.addEventListener('click', async () => {
      if (loading) return;
      const flipped = button.getAttribute('aria-pressed') === 'true';
      if (!flipped && !backImg.naturalWidth) {
        loading = true;
        button.setAttribute('aria-busy', 'true');
        loadImage(backImg);
        try {
          await backImg.decode();
        } catch {
          if (!backImg.naturalWidth) {
            sideLabel.textContent = '图片加载失败';
            backImg.removeAttribute('src');
            return;
          }
        } finally {
          loading = false;
          button.removeAttribute('aria-busy');
        }
      }
      const side = flipped ? frontLabel : backLabel;
      const otherSide = flipped ? backLabel : frontLabel;
      const initialTransform = getComputedStyle(lift).transform;
      liftAnimation?.cancel();
      button.setAttribute('aria-pressed', String(!flipped));
      button.setAttribute('aria-label', label + '，' + side + '。点击切换到' + otherSide);
      front.setAttribute('aria-hidden', String(!flipped));
      back.setAttribute('aria-hidden', String(flipped));
      sideLabel.textContent = side;
      if (!reduced()) {
        const tilt = parseFloat(getComputedStyle(button).getPropertyValue('--card-tilt')) || 0;
        const fan = tilt ? tilt * 2.25 : 2.5;
        liftAnimation = lift.animate([
          { transform: initialTransform },
          { transform: 'translate3d(0,-12px,24px) rotateZ(' + fan + 'deg) scale(1.025)', offset: .38 },
          { transform: 'translate3d(0,-6px,9px) rotateZ(' + (flipped ? fan * .24 : fan * .6) + 'deg)', offset: .74 },
          { transform: getComputedStyle(lift).transform },
        ], { duration: 790, easing: 'cubic-bezier(.25,.68,.22,1)' });
      }
    });
    grid.append(button);
  });
  gallery.append(grid);
}

makeFlipGallery('repaint', [
  ['OK1 / G1', 'OK1.png', 'G1.png', '重绘结果', '原图'],
  ['OK2 / G2', 'OK2.jpg', 'G2.png', '重绘结果', '原图'],
  ['OK3 / G3', 'OK3.jpg', 'G3.png', '重绘结果', '原图', '?v=ab0307f0-1399e320'],
], '06');
makeFlipGallery('pose', [
  ['倒悬', '01_倒悬.png', ' (1).jpg', '生成结果', '动作参考'],
  ['后仰', '02_后仰.png', ' (2).jpg', '生成结果', '动作参考'],
  ['抱膝悬坐', '03_抱膝悬坐.png', ' (3).jpg', '生成结果', '动作参考'],
], '05');
makeFlipGallery('lora', [1, 2, 3, 4].map(index => [
  number(index),
  'Gustav Klimt Vienna Secession painting (' + index + ').jpg',
  '2dddliandan(' + index + ')' + (index < 3 ? '.jpg' : '.png'),
  '生成结果',
  '训练素材',
]));

const partsGrid = document.createElement('div');
partsGrid.className = 'gallery-grid';
const viewNames = ['正面', '左侧面', '右侧面', '背面'];
['光头', '头发', '上半身', '下半身'].forEach((part, row) => {
  viewNames.forEach((view, column) => {
    const index = number(row * viewNames.length + column + 1);
    const path = mediaPath(mediaFolders.parts, [index, part, view].join('_') + '.png');
    const label = part + ' · ' + view;
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'part-card';
    const caption = document.createElement('span');
    caption.textContent = index + ' · ' + label;
    button.append(createImage(path, label), caption);
    button.addEventListener('click', () => presentImage(path, label));
    partsGrid.append(button);
  });
});
document.querySelector('[data-gallery="parts"]').append(partsGrid);

document.querySelectorAll('[data-folder]').forEach(folder => {
  const key = folder.dataset.folder;
  const labels = key === 'repaint' ? ['过程图'] : ['过程图', '原图'];
  const id = key + '-folder-contents';
  folder.innerHTML = '<button class="folder-toggle" type="button" aria-controls="' + id + '" aria-expanded="false"><span class="folder-shape" aria-hidden="true"><i></i></span></button><div class="folder-tray" id="' + id + '" inert></div>';
  folder.querySelector('.folder-toggle').setAttribute('aria-label', '打开文件夹 · ' + labels.join('与'));
  const tray = folder.querySelector('.folder-tray');
  folder.classList.toggle('single-preview', labels.length === 1);
  labels.forEach(label => {
    const path = mediaPath(mediaFolders[key], label + '.png');
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'folder-image';
    button.setAttribute('aria-label', label);
    button.append(createImage(path, ''));
    button.addEventListener('click', () => presentImage(path, label, label === '过程图'));
    tray.append(button);
  });
});

const folders = Array.from(document.querySelectorAll('.project-folder'));
const folderStates = new WeakMap();
function toggleFolder(folder, open) {
  const button = folder.querySelector('.folder-toggle');
  const tray = folder.querySelector('.folder-tray');
  if (!open && tray.contains(document.activeElement)) button.focus({ preventScroll: true });
  button.setAttribute('aria-expanded', String(open));
  folder.classList.toggle('is-open', open);
  tray.inert = !open;
  if (open) tray.querySelectorAll('img[data-src]').forEach(loadImage);
}

function closeFolder(folder) {
  const state = folderStates.get(folder);
  clearTimeout(state.closeTimer);
  state.pinned = false;
  toggleFolder(folder, false);
}

folders.forEach(folder => {
  const toggle = folder.querySelector('.folder-toggle');
  const state = { pinned: false, closeTimer: 0 };
  folderStates.set(folder, state);
  folder.append(folder.querySelector('.folder-tray'));
  folder.addEventListener('pointerenter', event => {
    if (event.pointerType !== 'mouse') return;
    clearTimeout(state.closeTimer);
    toggleFolder(folder, true);
  });
  folder.addEventListener('pointerleave', event => {
    if (event.pointerType !== 'mouse' || state.pinned) return;
    state.closeTimer = setTimeout(() => {
      if (!folder.matches(':hover') && !state.pinned) closeFolder(folder);
    }, 240);
  });
  folder.addEventListener('focusout', event => {
    if (!state.pinned && !folder.contains(event.relatedTarget) && !folder.matches(':hover')) closeFolder(folder);
  });
  toggle.addEventListener('click', event => {
    clearTimeout(state.closeTimer);
    const open = toggle.getAttribute('aria-expanded') === 'true';
    if (state.pinned || (open && event.detail === 0)) {
      closeFolder(folder);
      return;
    }
    state.pinned = true;
    toggleFolder(folder, true);
  });
});

document.addEventListener('pointerdown', event => {
  folders.forEach(folder => {
    if (folder.classList.contains('is-open') && !folder.contains(event.target)) closeFolder(folder);
  });
});


function presentImage(path, label, zoomable = false) {
  dialogTitle.textContent = label;
  dialogImage.src = path;
  dialogImage.alt = label;
  dialog.toggleAttribute('data-large', zoomable);
  zoomButton.hidden = !zoomable;
  dialog.showModal();
}

function zoomImage() {
  const zoomed = dialog.toggleAttribute('data-zoom');
  zoomButton.setAttribute('aria-pressed', String(zoomed));
  zoomButton.textContent = zoomed ? '适应窗口' : '查看细节';
}

zoomButton.addEventListener('click', zoomImage);
dialogImage.addEventListener('click', () => {
  if (dialog.hasAttribute('data-large')) zoomImage();
});
dialog.querySelector('.close-dialog').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => {
  if (event.target === dialog) dialog.close();
});
dialog.addEventListener('close', () => {
  dialog.removeAttribute('data-zoom');
  zoomButton.setAttribute('aria-pressed', 'false');
  zoomButton.textContent = '查看细节';
  dialogImage.removeAttribute('src');
});

function prepareSlide(slide) {
  if (stagesReady.has(slide)) return;
  const background = slide.dataset.background;
  slide.style.setProperty('--page-art', 'url("' + backgroundPath(background) + '")');
  slide.style.setProperty('--mobile-art', 'url("' + backgroundPath(background, true) + '")');
  slide.querySelectorAll('.art-front img, .part-card img, .folder-image img').forEach(loadImage);
  stagesReady.add(slide);
}

let current = -1;
let route = null;
let special = null;
let scrollFrame = 0;
const pageFromHash = () => /^[1-5]$/.test(location.hash.slice(1)) ? Number(location.hash.slice(1)) - 1 : 0;
const reduced = () => motion.matches || typeof Element.prototype.animate !== 'function';
const chapterHash = index => '#' + (index + 1);

const lenis = typeof window.Lenis === 'function' ? new window.Lenis({
  autoRaf: true,
  smoothWheel: !motion.matches,
  lerp: .105,
  anchors: false,
}) : null;
dialog.setAttribute('data-lenis-prevent', '');

function setActive(target) {
  if (current === target) return;
  if (current >= 0) slides[current].querySelectorAll('.project-folder.is-open').forEach(closeFolder);
  current = target;
  prepareSlide(slides[target]);
  slides.forEach((slide, index) => slide.classList.toggle('active', index === target));
  nav.forEach((link, index) => {
    if (index === target) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });
  controls[0].disabled = target === 0;
  controls[1].disabled = target === slides.length - 1;
  counter.firstChild.textContent = number(target + 1) + ' ';
}

function updateChapterFromScroll() {
  scrollFrame = 0;
  if (special) return;
  const readingLine = innerHeight * .36;
  const index = slides.findIndex(slide => slide.getBoundingClientRect().bottom > readingLine);
  if (index === -1) return;
  setActive(index);
  if (!route && location.hash !== chapterHash(index)) history.replaceState(null, '', chapterHash(index));
}

function onScroll() {
  if (!scrollFrame) scrollFrame = requestAnimationFrame(updateChapterFromScroll);
}

function reveal(slide) {
  if (reduced()) return;
  slide.querySelectorAll('[data-reveal]').forEach((section, index) => {
    section.animate(
      [{ opacity: 0, transform: 'translate3d(0,52px,0)' }, { opacity: 1, transform: 'translate3d(0,0,0)' }],
      { duration: 720, delay: index * 75, easing: 'cubic-bezier(.22,.8,.18,1)', fill: 'backwards' },
    );
  });
}

function scrollImmediately(slide) {
  if (lenis) lenis.scrollTo(slide, { immediate: true, force: true });
  else window.scrollTo({ top: slide.getBoundingClientRect().top + scrollY, behavior: 'instant' });
}

function cancelSpecial() {
  if (!special) return;
  const previous = special;
  special = null;
  previous.transition?.skipTransition();
  previous.animation?.cancel();
  previous.slide.classList.remove('folder-entering');
  document.documentElement.classList.remove('folder-jump');
}

function openFromFolder(target) {
  const slide = slides[target];
  const sequence = { slide };
  special = sequence;
  route = null;
  slide.classList.add('folder-entering');
  const changePage = () => {
    if (special !== sequence) return;
    scrollImmediately(slide);
    setActive(target);
  };
  const finish = () => {
    if (special !== sequence) return;
    cancelSpecial();
    reveal(slide);
  };
  if (typeof document.startViewTransition === 'function') {
    document.documentElement.classList.add('folder-jump');
    sequence.transition = document.startViewTransition(changePage);
    sequence.transition.ready.catch(() => {});
    sequence.transition.finished.then(finish, finish);
  } else {
    changePage();
    sequence.animation = slide.animate(
      [{ clipPath: 'inset(0 50%)' }, { clipPath: 'inset(0)' }],
      { duration: 700, easing: ease },
    );
    sequence.animation.finished.then(finish, finish);
  }
}

function navigate(target, { historyEntry = true, fromFolder = false, immediate = false } = {}) {
  if (target < 0 || target >= slides.length) return;
  cancelSpecial();
  const slide = slides[target];
  prepareSlide(slide);
  const hash = chapterHash(target);
  if (historyEntry && location.hash !== hash) history.pushState(null, '', hash);
  if (fromFolder && target !== current && !reduced() && !immediate) {
    openFromFolder(target);
    return;
  }
  if (immediate || reduced()) {
    route = null;
    scrollImmediately(slide);
    setActive(target);
    return;
  }
  const entry = { target };
  route = entry;
  const done = () => {
    if (route !== entry) return;
    setActive(target);
    route = null;
  };
  if (lenis) {
    if (Math.abs(slide.getBoundingClientRect().top) < 1) {
      scrollImmediately(slide);
      done();
    } else {
      lenis.scrollTo(slide, { duration: 1.14, easing: t => 1 - (1 - t) ** 4, lock: true, force: true, onComplete: done });
    }
  } else {
    window.scrollTo({ top: slide.getBoundingClientRect().top + scrollY, behavior: 'smooth' });
    setTimeout(done, 850);
  }
}

const preload = new IntersectionObserver(entries => entries.forEach(entry => {
  if (entry.isIntersecting) {
    prepareSlide(entry.target);
    preload.unobserve(entry.target);
  }
}), { rootMargin: '75% 0px' });
slides.forEach(slide => preload.observe(slide));

document.addEventListener('click', event => {
  const link = event.target.closest('a[href^="#"]');
  if (!link || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  event.preventDefault();
  const folder = link.closest('.project-folder');
  if (folder) closeFolder(folder);
  navigate(Number(link.hash.slice(1)) - 1, { fromFolder: Boolean(folder) });
});
controls.forEach(button => button.addEventListener('click', () => navigate((route?.target ?? current) + Number(button.dataset.step))));
function readHistory() {
  const page = pageFromHash();
  if (route?.target !== page && (special || page !== current)) navigate(page, { historyEntry: false });
}
window.addEventListener('hashchange', readHistory);
window.addEventListener('popstate', readHistory);
window.addEventListener('scroll', onScroll, { passive: true });
window.addEventListener('resize', onScroll, { passive: true });
motion.addEventListener('change', () => {
  if (lenis) lenis.options.smoothWheel = !motion.matches;
  if (special || route) navigate(pageFromHash(), { historyEntry: false, immediate: true });
});

document.addEventListener('keydown', event => {
  if (dialog.open || event.altKey || event.ctrlKey || event.metaKey) return;
  if (event.key === 'Escape') {
    slides[current]?.querySelectorAll('.project-folder.is-open').forEach(closeFolder);
    return;
  }
  const direction = { ArrowLeft: -1, ArrowRight: 1 }[event.key];
  if (!direction || event.repeat) return;
  event.preventDefault();
  navigate((route?.target ?? current) + direction);
});

if (!location.hash) history.replaceState(null, '', '#1');
navigate(pageFromHash(), { historyEntry: false, immediate: true });
