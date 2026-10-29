(() => {
 'use strict';
 const cover=document.querySelector('.cover');cover.classList.add('home-weaving');
 const chrome=(text,cls='')=>`<span class="chrome-text ${cls}" data-chrome="${text}" data-chrome-tone="red">${text}</span>`;
 cover.querySelector('.stage').innerHTML=`<div class="home-scroll" tabindex="0" aria-label="首页与个人履历，向下滚动阅读"><section class="home-hero" aria-label="织象 · WEAVING VISIONS">
 <p class="home-eyebrow">LIANG ZHEN / VISUAL ARCHITECTURE / 2026</p>
 <h1 class="chrome-heading home-heading">${chrome('织象')}${chrome('WEAVING VISIONS')}</h1>
 <div class="home-subtitle">${chrome('AI视觉架构 · 工作流与项目实践')}${chrome('AI Visual Architecture · Workflows & Project Practice')}</div>
 <div class="home-motto">${chrome('以视觉为线，以技术为经纬，将想象织成可见的世界。')}<span lang="en">${chrome('Using vision as the thread and technology as the warp and weft,')}${chrome('imagination is woven into a visible world.')}</span></div>
 <div class="home-hero-footer"><span>视觉为线 · 技术为经纬</span><button class="home-about-link">个人履历 / ABOUT ME ↓</button></div>
 </section><section class="home-profile" aria-label="梁臻 · 个人履历"><aside class="home-profile-aside"><h2>梁 臻</h2><p class="home-profile-name-en">liang zhen</p>
 <dl class="home-contact"><div><dt>电话</dt><dd><a href="tel:13959132165">139 5913 2165</a></dd></div><div><dt>微信</dt><dd>Lz139591</dd></div><div><dt>邮箱</dt><dd><a href="mailto:13959132165@163.com">13959132165@163.com</a></dd></div></dl></aside>
 <div class="home-resume"><section><h3>教育背景<small>EDUCATION</small></h3><h4>天津美术学院</h4><p class="resume-date">2021.9 — 2025.6</p><p>本科 实验艺术学院 科技艺术系</p><p>主修课程：数字交互视觉设计、移动媒体交互界面、虚拟现实思维和表达、移动媒体影像技术、材料语言、多维空间造型基础、实验创作基础、移动媒体艺术概论等等。</p></section>
 <section><h3>AI视觉工程师<small>AI VISUAL ENGINEER</small></h3><ol><li><b>角色设计：</b>探索人物长相、服装与风格，结合二维设计和三维视觉转化，减少形象模板化，控制系列一致性。</li><li><b>场景与道具设计：</b>结合资料考据，规划空间布局，细化材质、色彩、陈设和使用痕迹。</li><li><b>光影与色彩设计：</b>根据剧情和情绪制定影调方案，协调人物与环境受光。</li><li><b>分镜与视频制作：</b>将人物心理转化为表情、动作和镜头提示词，完成部分AI视频及特效测试。</li><li><b>流程整理：</b>沉淀提示词、参考库与检查规则，支持资产复用。</li></ol><p class="home-strength">目前优势集中在视觉设计、风格把控和生成问题分析，并逐步向表演与镜头设计延伸。</p></section>
 <section><h3>工作经历<small>EXPERIENCE</small></h3><h4>与光同尘（杭州）文化科技有限公司</h4><p class="resume-date">2025.8—2026.10</p><p>与光同尘是国内领先的AI原生影视内容公司，依托自研AIGC核心技术，提供剧本、分镜、成片到宣发一站式智能影像解决方案。</p><p>业务涵盖AI原生影视、商业广告、AI软件研发、海外市场拓展。原创代表作包括《有山灵》《小松果大冒险》《传武》《机器背包客》及OPPO品牌定制AI漫剧。</p><p>在内容与技术业务之外，公司旗下教育品牌“与光同行”深耕校企合作，专注AI影像专业人才培养。</p><p class="home-work-role">我担任AI视觉工程师，主要负责项目前期角色、场景、道具的视觉设计与AI制作，并参与影调探索、视频生成及制作流程整理。</p></section>
 <div class="home-profile-end"><button class="home-top-link">↑ 返回首页顶部</button><button data-page="1">浏览作品目录 →</button></div></div></section></div>`;
 const folder=document.querySelector('.project-folder');cover.querySelector('.home-hero').append(folder);
 folder.querySelectorAll('.project-note>span').forEach(el=>{el.classList.add('chrome-text');el.dataset.chrome=el.textContent;el.dataset.chromeTone='red';});
 const sculpture=document.createElement('div');sculpture.className='folder-sculpture';sculpture.setAttribute('role','img');sculpture.setAttribute('aria-label','漂浮自转的红色三维花饰');sculpture.innerHTML='<span class="folder-model-status" role="status">3D / LOADING</span>';folder.prepend(sculpture);
 const scroller=cover.querySelector('.home-scroll'),reduced=matchMedia('(prefers-reduced-motion:reduce)');
 cover.querySelector('.home-about-link').addEventListener('click',()=>scroller.scrollTo({top:cover.querySelector('.home-profile').offsetTop,behavior:reduced.matches?'instant':'smooth'}));
 cover.querySelector('.home-top-link').addEventListener('click',()=>scroller.scrollTo({top:0,behavior:reduced.matches?'instant':'smooth'}));
 // Keep the resume's native wheel/keyboard/touch scrolling inside the first page.
 scroller.addEventListener('wheel',e=>e.stopPropagation(),{passive:true});
 scroller.addEventListener('keydown',e=>{if(['ArrowDown','ArrowUp','PageDown','PageUp','Home','End',' '].includes(e.key))e.stopPropagation()});
 let loading=false;function boot(){if(loading||!folder.classList.contains('is-open'))return;loading=true;import('./home-sculpture.js').then(m=>m.mountSculpture(sculpture,folder,cover)).catch(()=>{sculpture.querySelector('.folder-model-status').textContent='3D 暂未加载';loading=false});}
 new MutationObserver(boot).observe(folder,{attributes:true,attributeFilter:['class']});boot();
})();
