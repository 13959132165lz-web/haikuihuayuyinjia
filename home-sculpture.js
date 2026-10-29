import * as THREE from './assets/vendor/three/three.module.min.js';
import {GLTFLoader} from './assets/vendor/three/GLTFLoader.js';

export async function mountSculpture(host,folder,panel){
 const reduced=matchMedia('(prefers-reduced-motion:reduce)');
 const renderer=new THREE.WebGLRenderer({alpha:true,antialias:true,powerPreference:'low-power'});
 renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.5));renderer.setClearColor(0,0);renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.55;
 renderer.domElement.setAttribute('aria-hidden','true');host.append(renderer.domElement);
 const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(35,1,.01,100),group=new THREE.Group();scene.add(group);camera.position.set(0,.08,4.7);
 scene.add(new THREE.HemisphereLight(0xffeee0,0x58151b,2.8));
 [[0xffe5d1,5,3,4,4],[0xff6d5b,3,-3,1,2],[0xffffff,4,0,3,-3]].forEach(([color,intensity,x,y,z])=>{const light=new THREE.DirectionalLight(color,intensity);light.position.set(x,y,z);scene.add(light)});
 let gltf;try{gltf=await new GLTFLoader().loadAsync(new URL('./assets/home/red.glb',import.meta.url).href);}catch(e){renderer.dispose();renderer.domElement.remove();throw e;}
 const model=gltf.scene,box=new THREE.Box3().setFromObject(model),center=box.getCenter(new THREE.Vector3()),size=box.getSize(new THREE.Vector3());
 model.position.sub(center);group.add(model);group.scale.setScalar(2.15/Math.max(size.x,size.y,size.z));group.rotation.set(.12,0,-.08);
 host.dataset.loaded='true';let raf=0,last=0,elapsed=0,visible=true;
 const active=()=>panel.classList.contains('active')&&folder.classList.contains('is-open')&&!document.hidden&&visible;
 function resize(){const w=host.clientWidth,h=host.clientHeight;if(!w||!h)return;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();}
 function draw(now){raf=0;if(!active())return;if(last)elapsed+=Math.min(50,now-last)/1000;last=now;group.rotation.y=reduced.matches?-.25:elapsed*.36;group.position.y=reduced.matches?0:Math.sin(elapsed*1.25)*.07;renderer.render(scene,camera);if(!reduced.matches)raf=requestAnimationFrame(draw);}
 function sync(){cancelAnimationFrame(raf);raf=0;last=0;if(active()){resize();raf=requestAnimationFrame(draw);}}
 new MutationObserver(sync).observe(folder,{attributes:true,attributeFilter:['class']});new MutationObserver(sync).observe(panel,{attributes:true,attributeFilter:['class']});new ResizeObserver(sync).observe(host);new IntersectionObserver(es=>{visible=es[0].isIntersecting;sync()}).observe(host);document.addEventListener('visibilitychange',sync);reduced.addEventListener('change',sync);
 renderer.domElement.addEventListener('webglcontextlost',()=>{cancelAnimationFrame(raf);host.dataset.loaded='false';host.querySelector('.folder-model-status').textContent='3D 暂停，请刷新重试'});sync();
}
