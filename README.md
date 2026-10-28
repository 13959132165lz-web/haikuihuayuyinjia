# 梁臻 · AI美术作品集

十七页交互作品集。GitHub Pages 从 main 分支根目录发布，无需构建。

包含高清图片、23 段视频、液态图片交互、墨水文字和纵向翻页动效。

《古相思曲》包含视频、故事概览、角色设计、场景概念、五组影调与44张色调总览。
人物主页面包含总览和陆鸢、沈不言、倚华、陆时四个横向子页；场景主页面包含总览和宫廷、权谋、秘境、战场、现代五个横向子页。26张场景图及1张补充图均已纳入。
色调总览支持悬停、键盘聚焦和点击翻转；触屏可点击查看彩色图。

第14页为《古相思曲》视频与分镜，原素材顺序为1、5、3、4、2。第15页为《超能映射》（《星域奇旅》PV），按超能力文件夹1—6的原顺序展示六条视频，并完整展示项目定位、情绪锚点与Slogan。两页共用相同的叠放布局，支持滚轮逐层叠放、触屏滑动、序号跳转和原生播放控件。Lenis 1.3.27 分别绑定各页内部滚动容器，不影响其他页面，源码及MIT许可证保存在 assets/vendor/。参考：https://lenis.dev/ 、https://github.com/darkroomengineering/lenis 。

第16页为案例三角色设定，按文案顺序展示8个玻璃态人物文件夹，收录18张原始照片；点击展开，选择照片查看完整人物档案，支持原图放大、Esc关闭与焦点返回。宁焱现有素材为小女孩和少年两组，未提供怪物图，保留怪物设定文案。第17页采用第6页的左侧标题与右侧九宫格结构，完整展示9张场景原图。背景分别来自P16/P17背景。移动端使用两列文件夹、单列场景和可滚动人物档案。

两页标题使用本地液态金属WebGL着色器；离开页面或后台时暂停，减少动态效果设置下保持静态，WebGL不可用时显示银色渐变文字。着色器和形状预处理改编自 [React Bits Metallic Paint](https://reactbits.dev/animations/metallic-paint)，许可证见 assets/vendor/REACT-BITS-LICENSE.md。文件夹交互参考 [React Bits Folder](https://reactbits.dev/components/folder)，玻璃材质参考用户提供的 [Glass Folder Cards](https://cdn.21st.dev/kedhareswer/glass-folder-cards/default/bundle.1791785999938-44a040f8-6f3a-44cb-96a2-dbb978781ac2.html)，通过原生HTML/CSS实现，不依赖外部运行脚本。

作品及素材版权归原权利人所有，未经许可请勿复制或再分发。
