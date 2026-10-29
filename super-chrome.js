/* Metallic Paint shader and shape preprocessing adapted from React Bits, Copyright (c) 2026 David Haz. MIT + Commons Clause; see assets/vendor/REACT-BITS-LICENSE.md. https://reactbits.dev/animations/metallic-paint */
(()=>{
const WORKING_SIZE=192;
const VERTEX = `#version 300 es
layout(location = 0) in vec2 a_position;
uniform vec2 u_resolution;
uniform float u_imageAspect;
uniform float u_scale;
uniform float u_rotation;
out vec2 v_imageUV;

void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
  vec2 uv = a_position * 0.5;
  float r = u_rotation * 3.14159265358979323846 / 180.0;
  mat2 turn = mat2(cos(r), sin(r), -sin(r), cos(r));
  vec2 imageBox;
  imageBox.x = min(u_resolution.x / u_imageAspect, u_resolution.y) * u_imageAspect;
  imageBox.y = imageBox.x / u_imageAspect;
  v_imageUV = uv * (u_resolution / imageBox) / u_scale;
  v_imageUV.x *= u_imageAspect;
  v_imageUV = turn * v_imageUV;
  v_imageUV.x /= u_imageAspect;
  v_imageUV += 0.5;
  v_imageUV.y = 1.0 - v_imageUV.y;
}`;

const FRAGMENT = `#version 300 es
precision highp float;

uniform sampler2D u_image;
uniform vec2 u_resolution;
uniform float u_time;
uniform vec4 u_colorBack;
uniform vec4 u_colorTint;
uniform float u_softness;
uniform float u_repetition;
uniform float u_shiftRed;
uniform float u_shiftBlue;
uniform float u_distortion;
uniform float u_contour;
uniform float u_angle;
uniform vec2 u_tilt;
uniform float u_reveal;
uniform float u_light;

in vec2 v_imageUV;

out vec4 fragColor;

#define PI 3.14159265358979323846

vec2 rotate(vec2 uv, float th) {
  return mat2(cos(th), sin(th), -sin(th), cos(th)) * uv;
}

vec3 permute(vec3 x) { return mod(((x * 34.0) + 1.0) * x, 289.0); }

float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
  vec2 i = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
  m = m * m;
  m = m * m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
  vec3 g;
  g.x = a0.x * x0.x + h.x * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

float getColorChanges(float c1, float c2, float stripe, vec3 w, float blur, float bump, float tint) {
  float ch = mix(c2, c1, smoothstep(0.0, 2.0 * blur, stripe));
  float border = w[0];
  ch = mix(ch, c2, smoothstep(border, border + 2.0 * blur, stripe));
  bump = smoothstep(0.2, 0.8, bump);
  border = w[0] + 0.4 * (1.0 - bump) * w[1];
  ch = mix(ch, c1, smoothstep(border, border + 2.0 * blur, stripe));
  border = w[0] + 0.5 * (1.0 - bump) * w[1];
  ch = mix(ch, c2, smoothstep(border, border + 2.0 * blur, stripe));
  border = w[0] + w[1];
  ch = mix(ch, c1, smoothstep(border, border + 2.0 * blur, stripe));
  float gradientT = (stripe - w[0] - w[1]) / w[2];
  float gradient = mix(c1, c2, smoothstep(0.0, 1.0, gradientT));
  ch = mix(ch, gradient, smoothstep(border, border + 0.5 * blur, stripe));
  ch = mix(ch, 1.0 - min(1.0, (1.0 - ch) / max(tint, 0.0001)), u_colorTint.a);
  return ch;
}

float getImgFrame(vec2 uv, float th) {
  float frame = 1.0;
  frame *= smoothstep(0.0, th, uv.y);
  frame *= 1.0 - smoothstep(1.0 - th, 1.0, uv.y);
  frame *= smoothstep(0.0, th, uv.x);
  frame *= 1.0 - smoothstep(1.0 - th, 1.0, uv.x);
  return frame;
}

float blurEdge3x3(sampler2D tex, vec2 uv, vec2 dudx, vec2 dudy, float radius, float centerSample) {
  vec2 texel = 1.0 / vec2(textureSize(tex, 0));
  vec2 r = radius * texel;
  float sum = 4.0 * centerSample;
  sum += 2.0 * textureGrad(tex, uv + vec2(0.0, -r.y), dudx, dudy).r;
  sum += 2.0 * textureGrad(tex, uv + vec2(0.0, r.y), dudx, dudy).r;
  sum += 2.0 * textureGrad(tex, uv + vec2(-r.x, 0.0), dudx, dudy).r;
  sum += 2.0 * textureGrad(tex, uv + vec2(r.x, 0.0), dudx, dudy).r;
  sum += textureGrad(tex, uv + vec2(-r.x, -r.y), dudx, dudy).r;
  sum += textureGrad(tex, uv + vec2(r.x, -r.y), dudx, dudy).r;
  sum += textureGrad(tex, uv + vec2(-r.x, r.y), dudx, dudy).r;
  sum += textureGrad(tex, uv + vec2(r.x, r.y), dudx, dudy).r;
  return sum / 16.0;
}

void main() {
  const float firstFrameOffset = 2.8;
  float t = 0.3 * (u_time + firstFrameOffset);

  vec2 uv = v_imageUV;
  vec2 dudx = dFdx(v_imageUV);
  vec2 dudy = dFdy(v_imageUV);
  vec4 img = textureGrad(u_image, uv, dudx, dudy);

  float cycleWidth = u_repetition;

  vec2 rotatedUV = uv - vec2(0.5);
  float angle = (-u_angle + 70.0) * PI / 180.0;
  float cosA = cos(angle);
  float sinA = sin(angle);
  rotatedUV = vec2(rotatedUV.x * cosA - rotatedUV.y * sinA, rotatedUV.x * sinA + rotatedUV.y * cosA) + vec2(0.5);

  float edge = blurEdge3x3(u_image, uv, dudx, dudy, 6.0, img.r);
  edge = pow(edge, 1.6);
  edge *= smoothstep(0.0, 0.4, u_contour);

  float opacity = img.g * getImgFrame(v_imageUV, 0.0);
  float depth = img.r;

  float diagBLtoTR = rotatedUV.x - rotatedUV.y;
  float diagTLtoBR = rotatedUV.x + rotatedUV.y;

  vec3 color1 = mix(vec3(0.98, 0.98, 1.0), vec3(0.9, 0.9, 0.93), u_light);
  vec3 color2 = vec3(0.28, 0.29, 0.32 + 0.08 * smoothstep(0.7, 1.3, diagTLtoBR));

  vec2 gradUV = uv - 0.5 - u_tilt * vec2(0.18, -0.12);
  float dist = length(gradUV + vec2(0.0, 0.2 * diagBLtoTR));
  gradUV = rotate(gradUV, (0.25 - 0.2 * diagBLtoTR) * PI);
  float direction = gradUV.x;

  float bump = pow(1.8 * dist, 1.2);
  bump = 1.0 - bump;
  bump *= pow(uv.y, 0.3);

  float thinStrip1 = 0.12 / cycleWidth * (1.0 - 0.4 * bump);
  float thinStrip2 = 0.07 / cycleWidth * (1.0 + 0.4 * bump);
  float wideStrip = 1.0 - thinStrip1 - thinStrip2;

  float noise = snoise(uv - t);
  edge += (1.0 - edge) * u_distortion * noise;

  direction += diagBLtoTR;
  direction -= 2.0 * noise * diagBLtoTR * (smoothstep(0.0, 1.0, edge) * (1.0 - smoothstep(0.0, 1.0, edge)));
  direction *= mix(1.0, 1.0 - edge, smoothstep(0.5, 1.0, u_contour));
  direction -= 1.7 * edge * smoothstep(0.5, 1.0, u_contour);
  direction += 0.2 * pow(u_contour, 4.0) * (1.0 - smoothstep(0.0, 1.0, edge));

  bump *= clamp(pow(uv.y, 0.1), 0.3, 1.0);
  direction *= 0.1 + (1.1 - edge) * bump;
  direction *= 0.4 + 0.6 * (1.0 - smoothstep(0.5, 1.0, edge));
  direction += 0.18 * (smoothstep(0.1, 0.2, uv.y) * (1.0 - smoothstep(0.2, 0.4, uv.y)));
  direction += 0.03 * (smoothstep(0.1, 0.2, 1.0 - uv.y) * (1.0 - smoothstep(0.2, 0.4, 1.0 - uv.y)));
  direction *= 0.5 + 0.5 * pow(uv.y, 2.0);
  direction *= cycleWidth;
  direction -= t + dot(u_tilt, vec2(0.35, 0.2));

  float colorDispersion = clamp(1.0 - bump, 0.0, 1.0);
  float dispersionRed = colorDispersion;
  dispersionRed += 0.03 * bump * noise;
  dispersionRed += 5.0 * (smoothstep(-0.1, 0.2, uv.y) * (1.0 - smoothstep(0.1, 0.5, uv.y))) * (smoothstep(0.4, 0.6, bump) * (1.0 - smoothstep(0.4, 1.0, bump)));
  dispersionRed -= diagBLtoTR;

  float dispersionBlue = colorDispersion * 1.3;
  dispersionBlue += (smoothstep(0.0, 0.4, uv.y) * (1.0 - smoothstep(0.1, 0.8, uv.y))) * (smoothstep(0.4, 0.6, bump) * (1.0 - smoothstep(0.4, 0.8, bump)));
  dispersionBlue -= 0.2 * edge;

  dispersionRed *= u_shiftRed / 20.0;
  dispersionBlue *= u_shiftBlue / 20.0;

  float softness = 0.05 * u_softness;
  float blur = softness + 0.5 * smoothstep(1.0, 10.0, u_repetition) * smoothstep(0.0, 1.0, edge);
  float smallCanvas = 1.0 - smoothstep(100.0, 500.0, min(u_resolution.x, u_resolution.y));
  blur += smallCanvas * smoothstep(0.0, 1.0, edge);
  float rExtraBlur = softness * (0.05 + 0.1 * (u_shiftRed / 20.0) * bump);
  float gExtraBlur = softness * 0.05 / max(0.001, abs(1.0 - diagBLtoTR));

  vec3 w = vec3(thinStrip1 * cycleWidth, thinStrip2 * cycleWidth, wideStrip);
  w[1] -= 0.02 * smoothstep(0.0, 1.0, edge + bump);
  float stripeR = fract(direction + dispersionRed);
  float r = getColorChanges(color1.r, color2.r, stripeR, w, blur + fwidth(stripeR) + rExtraBlur, bump, u_colorTint.r);
  float stripeG = fract(direction);
  float g = getColorChanges(color1.g, color2.g, stripeG, w, blur + fwidth(stripeG) + gExtraBlur, bump, u_colorTint.g);
  float stripeB = fract(direction - dispersionBlue);
  float b = getColorChanges(color1.b, color2.b, stripeB, w, blur + fwidth(stripeB), bump, u_colorTint.b);

  vec3 sheen = mix(vec3(1.0), u_colorTint.rgb, 0.45 * u_colorTint.a);
  r *= sheen.r;
  g *= sheen.g;
  b *= sheen.b;

  float rim = smoothstep(0.78, 1.0, depth) * u_light;
  r *= 1.0 - rim * 0.62;
  g *= 1.0 - rim * 0.62;
  b *= 1.0 - rim * 0.58;

  float pour = u_reveal * 1.25 - 0.1;
  opacity *= smoothstep(1.0 - pour, 1.15 - pour, depth) * smoothstep(0.0, 0.25, u_reveal);

  vec3 color = vec3(r, g, b) * opacity;
  vec3 back = u_colorBack.rgb * u_colorBack.a;
  color += back * (1.0 - opacity);
  opacity += u_colorBack.a * (1.0 - opacity);
  color += 1.0 / 256.0 * (fract(sin(dot(0.014 * gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453123) - 0.5);
  fragColor = vec4(color, opacity);
}`;

const drawTextSource = async (text, fontFamily, fontWeight) => {
  const size = text.length>30 ? 96 : text.length>16 ? 160 : 320;
  const font = `${fontWeight} ${size}px ${fontFamily}`;
  try {
    await document.fonts?.load(font, text);
  } catch {
    return null;
  }
  const probe = document.createElement('canvas').getContext('2d');
  probe.font = font;
  const metrics = probe.measureText(text);
  const ascent = metrics.actualBoundingBoxAscent || size * 0.8;
  const descent = metrics.actualBoundingBoxDescent || size * 0.2;
  const left = metrics.actualBoundingBoxLeft || 0;
  const right = metrics.actualBoundingBoxRight || metrics.width;
  const pad = size * 0.12;
  const canvas = document.createElement('canvas');
  canvas.width = Math.ceil(left + right + pad * 2);
  canvas.height = Math.ceil(ascent + descent + pad * 2);
  const ctx = canvas.getContext('2d');
  ctx.font = font;
  ctx.fillStyle = '#000';
  ctx.textBaseline = 'alphabetic';
  ctx.fillText(text, pad + left, pad + ascent);
  return canvas;
};

const solvePoisson = (mask, width, height) => {
  const interior = [];
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = y * width + x;
      if (!mask[i]) continue;
      const boundary =
        x === 0 ||
        y === 0 ||
        x === width - 1 ||
        y === height - 1 ||
        !mask[i - 1] ||
        !mask[i + 1] ||
        !mask[i - width] ||
        !mask[i + width] ||
        !mask[i - width - 1] ||
        !mask[i - width + 1] ||
        !mask[i + width - 1] ||
        !mask[i + width + 1];
      if (!boundary) interior.push(i);
    }
  }
  const field = new Float32Array(width * height);
  const red = [];
  const black = [];
  interior.forEach(i => (((i % width) + Math.floor(i / width)) % 2 === 0 ? red.push(i) : black.push(i)));
  const relax = list => {
    for (let k = 0; k < list.length; k++) {
      const i = list[k];
      const sum = field[i + 1] + field[i - 1] + field[i - width] + field[i + width];
      field[i] = 1.9 * ((0.01 + sum) / 4) - 0.9 * field[i];
    }
  };
  for (let iteration = 0; iteration < 40; iteration++) {
    relax(red);
    relax(black);
  }
  let peak = 0;
  interior.forEach(i => {
    if (field[i] > peak) peak = field[i];
  });
  return { field, peak: peak || 1 };
};

const processShape = source => {
  const width = source.width;
  const height = source.height;
  const fit = Math.min(WORKING_SIZE / Math.min(width, height), 2048 / Math.max(width, height));
  const workW = Math.max(2, Math.round(width * fit));
  const workH = Math.max(2, Math.round(height * fit));

  const small = document.createElement('canvas');
  small.width = workW;
  small.height = workH;
  const smallCtx = small.getContext('2d', { willReadFrequently: true });
  smallCtx.drawImage(source, 0, 0, workW, workH);
  const smallData = smallCtx.getImageData(0, 0, workW, workH).data;
  const mask = new Uint8Array(workW * workH);
  for (let i = 0; i < mask.length; i++) mask[i] = smallData[i * 4 + 3] > 0 ? 1 : 0;

  const { field, peak } = solvePoisson(mask, workW, workH);
  const gradient = smallCtx.createImageData(workW, workH);
  for (let i = 0; i < mask.length; i++) {
    const p = i * 4;
    const value = mask[i] ? 255 * (1 - field[i] / peak) : 255;
    gradient.data[p] = value;
    gradient.data[p + 1] = value;
    gradient.data[p + 2] = value;
    gradient.data[p + 3] = mask[i] ? 255 : 0;
  }
  smallCtx.putImageData(gradient, 0, 0);

  const out = document.createElement('canvas');
  out.width = width;
  out.height = height;
  const outCtx = out.getContext('2d', { willReadFrequently: true });
  outCtx.imageSmoothingEnabled = true;
  outCtx.imageSmoothingQuality = 'high';
  outCtx.drawImage(small, 0, 0, workW, workH, 0, 0, width, height);
  const result = outCtx.getImageData(0, 0, width, height);
  const original = source.getContext('2d', { willReadFrequently: true }).getImageData(0, 0, width, height).data;
  for (let i = 0; i < result.data.length; i += 4) {
    const alpha = original[i + 3];
    if (alpha === 0) {
      result.data[i] = 255;
      result.data[i + 1] = 0;
    } else {
      result.data[i] = result.data[i + 3] === 0 ? 0 : result.data[i];
      result.data[i + 1] = alpha;
    }
    result.data[i + 2] = 255;
    result.data[i + 3] = 255;
  }
  return result;
};

const compile = (gl, type, source) => {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) return shader;
  gl.deleteShader(shader);
  return null;
};



// All lettering shares one GPU context. Each visible label receives a 2D snapshot;
// this keeps long resume pages below the browser's WebGL-context limit.
const reduced=matchMedia('(prefers-reduced-motion:reduce)');
const surface=document.createElement('canvas');
const gl=surface.getContext('webgl2',{alpha:true,antialias:false,premultipliedAlpha:true});
if(!gl)return;
const vertex=compile(gl,gl.VERTEX_SHADER,VERTEX),fragment=compile(gl,gl.FRAGMENT_SHADER,FRAGMENT);
if(!vertex||!fragment)return;
const program=gl.createProgram();gl.attachShader(program,vertex);gl.attachShader(program,fragment);gl.linkProgram(program);gl.deleteShader(vertex);gl.deleteShader(fragment);
if(!gl.getProgramParameter(program,gl.LINK_STATUS))return;
gl.useProgram(program);
const u={};for(let i=0;i<gl.getProgramParameter(program,gl.ACTIVE_UNIFORMS);i++){const info=gl.getActiveUniform(program,i);u[info.name]=gl.getUniformLocation(program,info.name);}
const vao=gl.createVertexArray(),buffer=gl.createBuffer();gl.bindVertexArray(vao);gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),gl.STATIC_DRAW);gl.enableVertexAttribArray(0);gl.vertexAttribPointer(0,2,gl.FLOAT,false,0,0);
gl.uniform1i(u.u_image,0);

async function wrappedSource(el,style){
 const size=parseFloat(style.fontSize),scale=2,font=`${style.fontWeight} ${size*scale}px ${style.fontFamily}`;
 await document.fonts?.load(font,el.dataset.chrome);
 const w=el.clientWidth,h=el.clientHeight;if(!w||!h)return null;
 const canvas=document.createElement('canvas');canvas.width=Math.ceil(w*scale);canvas.height=Math.ceil(h*scale);
 const ctx=canvas.getContext('2d');ctx.font=font;ctx.fillStyle='#000';ctx.textBaseline='alphabetic';
 const left=parseFloat(style.paddingLeft)||0,right=parseFloat(style.paddingRight)||0,top=parseFloat(style.paddingTop)||0;
 const width=(w-left-right)*scale,lines=[];
 // Keep explicit workflow line breaks and wrap long Chinese resume copy.
 const br=el.querySelector('br'),text=br&&getComputedStyle(br).display==='none'?el.dataset.chrome.replaceAll('\n',''):el.dataset.chrome;
 for(const paragraph of text.split('\n')){
  let line='';for(const char of paragraph){if(line&&ctx.measureText(line+char).width>width){lines.push(line);line=char;}else line+=char;}lines.push(line);
 }
 const metrics=ctx.measureText('国Mg'),ascent=metrics.fontBoundingBoxAscent||size*scale*.88,descent=metrics.fontBoundingBoxDescent||size*scale*.22;
 const lineHeight=(parseFloat(style.lineHeight)||size*1.2)*scale;
 lines.forEach((line,i)=>{const length=ctx.measureText(line).width;const x=left*scale+(style.textAlign==='center'?(width-length)/2:style.textAlign==='right'?width-length:0);ctx.fillText(line,x,top*scale+i*lineHeight+(lineHeight-ascent-descent)/2+ascent);});
 return canvas;
}

const records=[...document.querySelectorAll('[data-chrome]')].map(el=>({el,scope:el.closest('.panel,.persistent-archive'),folder:el.closest('.project-folder'),visible:false,pending:false,texture:null,canvas:null,key:'',dirty:true,tiltX:0,tiltY:0}));
let raf=0,last=0,time=0,lost=false;
const active=r=>r.visible&&r.scope?.classList.contains('active')&&(!r.folder||r.folder.classList.contains('is-open'));
function wake(){if(!raf&&!lost&&!document.hidden)raf=requestAnimationFrame(draw);}
function invalidate(){records.forEach(r=>r.dirty=true);wake();}
async function prepare(r,key,style){
 if(r.pending)return;r.pending=true;
 try{
  const source=r.el.dataset.chromeWrap?await wrappedSource(r.el,style):await drawTextSource(r.el.dataset.chrome,style.fontFamily,style.fontWeight);
  if(!source||lost)return;
  const shape=processShape(source);
  if(r.texture)gl.deleteTexture(r.texture);
  r.texture=gl.createTexture();gl.activeTexture(gl.TEXTURE0);gl.bindTexture(gl.TEXTURE_2D,r.texture);
  gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,shape.width,shape.height,0,gl.RGBA,gl.UNSIGNED_BYTE,shape.data);
  gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);
  r.aspect=source.width/source.height;r.key=key;r.dirty=true;
  if(!r.canvas){r.canvas=document.createElement('canvas');r.canvas.setAttribute('aria-hidden','true');r.ctx=r.canvas.getContext('2d');r.el.append(r.canvas);}
 }catch{r.el.classList.remove('chrome-ready');}finally{r.pending=false;wake();}
}
function draw(now){
 raf=0;if(lost||document.hidden||document.querySelector('dialog[open]'))return;
 if(last&&now-last<40){wake();return;}if(last)time+=Math.min(now-last,60)*.00055;last=now;
 let animating=false;
 for(const r of records){
  if(!active(r))continue;
  const rect=r.el.getBoundingClientRect();if(rect.bottom<=0||rect.top>=innerHeight||!rect.width||!rect.height)continue;
  const style=getComputedStyle(r.el),key=[r.el.dataset.chrome,style.fontFamily,style.fontWeight,style.fontSize,r.el.clientWidth,r.el.clientHeight].join('|');
  if(r.key!==key){prepare(r,key,style);continue;}
  animating=true;if(reduced.matches&&!r.dirty)continue;
  const dpr=Math.min(devicePixelRatio||1,1.5),w=Math.max(2,Math.round(rect.width*dpr)),h=Math.max(2,Math.round(rect.height*dpr)),red=r.el.dataset.chromeTone==='red';
  if(surface.width!==w||surface.height!==h){surface.width=w;surface.height=h;}
  if(r.canvas.width!==w||r.canvas.height!==h){r.canvas.width=w;r.canvas.height=h;}
  gl.viewport(0,0,w,h);gl.useProgram(program);gl.activeTexture(gl.TEXTURE0);gl.bindTexture(gl.TEXTURE_2D,r.texture);
  gl.uniform2f(u.u_resolution,w,h);gl.uniform1f(u.u_imageAspect,r.aspect);gl.uniform1f(u.u_scale,r.el.dataset.chromeWrap?1:.99);gl.uniform1f(u.u_rotation,0);gl.uniform1f(u.u_time,reduced.matches?0:time);
  gl.uniform4f(u.u_colorBack,0,0,0,0);gl.uniform4f(u.u_colorTint,1,red?.38:1,red?.31:1,red?.68:0);gl.uniform1f(u.u_softness,.15);gl.uniform1f(u.u_repetition,red?1.9:2.3);gl.uniform1f(u.u_shiftRed,red?.7:1.8);gl.uniform1f(u.u_shiftBlue,red?.4:1.8);gl.uniform1f(u.u_distortion,.1);gl.uniform1f(u.u_contour,.65);gl.uniform1f(u.u_angle,70);gl.uniform2f(u.u_tilt,r.tiltX,r.tiltY);gl.uniform1f(u.u_reveal,1);gl.uniform1f(u.u_light,0);
  gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT);gl.bindVertexArray(vao);gl.drawArrays(gl.TRIANGLE_STRIP,0,4);
  r.ctx.clearRect(0,0,w,h);r.ctx.drawImage(surface,0,0);r.el.classList.add('chrome-ready');r.dirty=false;
 }
 if(animating&&!reduced.matches)wake();
}
const io=new IntersectionObserver(entries=>{for(const e of entries){const r=records.find(r=>r.el===e.target);r.visible=e.isIntersecting;r.dirty=true;}wake();});
const ro=new ResizeObserver(invalidate);
records.forEach(r=>{io.observe(r.el);ro.observe(r.el);r.el.addEventListener('pointermove',e=>{const b=r.el.getBoundingClientRect();r.tiltX=((e.clientX-b.left)/b.width*2-1)*.3;r.tiltY=((e.clientY-b.top)/b.height*2-1)*.3;r.dirty=true;wake();});r.el.addEventListener('pointerleave',()=>{r.tiltX=r.tiltY=0;r.dirty=true;wake();});});
const scopes=new Set(records.flatMap(r=>[r.scope,r.folder]).filter(Boolean));
scopes.forEach(scope=>new MutationObserver(invalidate).observe(scope,{attributes:true,attributeFilter:['class']}));
document.querySelectorAll('dialog').forEach(d=>new MutationObserver(invalidate).observe(d,{attributes:true,attributeFilter:['open']}));
document.addEventListener('visibilitychange',()=>{last=0;invalidate();});window.addEventListener('resize',invalidate);reduced.addEventListener('change',invalidate);
document.fonts?.ready.then(invalidate);
surface.addEventListener('webglcontextlost',()=>{lost=true;cancelAnimationFrame(raf);records.forEach(r=>r.el.classList.remove('chrome-ready'));});wake();
})();
