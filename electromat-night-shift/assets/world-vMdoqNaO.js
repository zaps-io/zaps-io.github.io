var A=Object.defineProperty;var P=(i,e,n)=>e in i?A(i,e,{enumerable:!0,configurable:!0,writable:!0,value:n}):i[e]=n;var c=(i,e,n)=>P(i,typeof e!="symbol"?e+"":e,n);import*as s from"https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.js";import{P as D,K as M,w as h,y as S,H as z,z as I,C as L}from"./sim-D_RhrL6A.js";import{p as m,a as p,b as T,c as O,e as _,d as K,g as W,f as Y,w as U,h as B,i as G,j as N,k as X}from"./shift-BPW5ywOh.js";const pe={red:15086117,char:1973796,amber:15243822,cyan:54517,cream:16117992,chrome:12106944},F=2.45,V=12,Z=12;function u(i){return(i-V)*F}function d(i){return(i-Z)*F}function fe(i){return Math.PI/2-i}const y=.32;function q(i,e,n,t){return{minX:i-n,maxX:i+n,minZ:e-t,maxZ:e+t}}function b(i,e,n,t=y){for(const a of n)if(i>a.minX-t&&i<a.maxX+t&&e>a.minZ-t&&e<a.maxZ+t)return!0;return!1}function ye(i){const e=document.createElement("canvas");e.width=932,e.height=310;const n=e.getContext("2d");n.clearRect(0,0,e.width,e.height),n.drawImage(i,0,0,932,310);const t=n.getImageData(0,0,e.width,e.height);for(let r=0;r<t.data.length;r+=4)(t.data[r]+t.data[r+1]+t.data[r+2])/3<28&&(t.data[r+3]=0);n.putImageData(t,0,0);const a=new s.CanvasTexture(e);return a.colorSpace=s.SRGBColorSpace,a.magFilter=s.LinearFilter,a.minFilter=s.LinearFilter,a.generateMipmaps=!1,a.needsUpdate=!0,a}const j=2;function H(i=typeof window<"u"?window.devicePixelRatio||1:2){return Math.max(j,i)}function Q(i,e,n=typeof window<"u"?window.devicePixelRatio||1:2){const t=H(n);return{w:Math.max(2,Math.round(Math.max(i,1)*t)),h:Math.max(2,Math.round(Math.max(e,1)*t))}}const J=`
#include <common>
uniform float snap;
uniform vec3 lightDir;
varying vec3 vShade;
varying vec2 vUv;
varying float vFog;

void main() {
  vUv = uv;
  vec3 n = normalize(normalMatrix * normal);
  float lambert = max(dot(n, normalize(lightDir)), 0.0);
  float hemi = 0.58 + 0.42 * max(n.y, 0.0);
  vShade = vec3(0.72 + 0.38 * lambert + hemi * 0.22);
  vec4 clip = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  vec3 ndc = clip.xyz / max(clip.w, 0.0001);
  ndc.xy = floor(ndc.xy * snap + 0.5) / snap;
  gl_Position = vec4(ndc * clip.w, clip.w);
  vFog = gl_Position.z;
}
`,$=`
uniform vec3 color;
uniform vec3 emissive;
uniform float emissiveIntensity;
uniform sampler2D map;
uniform float hasMap;
uniform float opacity;
varying vec2 vUv;
varying vec3 vShade;
varying float vFog;

void main() {
  vec4 texel = vec4(1.0);
  if (hasMap > 0.5) texel = texture2D(map, vUv);
  if (texel.a < 0.08) discard;
  vec3 base = color * texel.rgb * vShade;
  base += emissive * emissiveIntensity;
  float fog = smoothstep(110.0, 240.0, vFog);
  base = mix(base, vec3(0.1, 0.1, 0.14), fog * 0.16);
  gl_FragColor = vec4(base, opacity * texel.a);
}
`;function R(i,e=s.RepeatWrapping){return i.magFilter=s.NearestFilter,i.minFilter=s.NearestFilter,i.generateMipmaps=!1,i.wrapS=e,i.wrapT=e,i.colorSpace=s.SRGBColorSpace,i.needsUpdate=!0,i}function ge(i){const e=i.map?R(i.map):null;return new s.ShaderMaterial({uniforms:{snap:{value:i.snap??220},lightDir:{value:new s.Vector3(.32,.9,.28).normalize()},color:{value:new s.Color(i.color??16777215)},emissive:{value:new s.Color(i.emissive??0)},emissiveIntensity:{value:i.emissiveIntensity??0},map:{value:e},hasMap:{value:e?1:0},opacity:{value:i.opacity??1}},vertexShader:J,fragmentShader:$,transparent:!!i.transparent||(i.opacity??1)<1})}function ve(i){return new s.MeshBasicMaterial({color:i.color??16777215,map:i.map?R(i.map,s.ClampToEdgeWrapping):null,transparent:!!i.transparent,opacity:i.opacity??1,depthWrite:i.depthWrite??!0,toneMapped:!1})}function ee(i){return i?(i.magFilter=s.LinearFilter,i.minFilter=s.LinearFilter,i.colorSpace=s.SRGBColorSpace,i.needsUpdate=!0,i):null}function xe(i){return new s.MeshStandardMaterial({color:i.color??16777215,map:ee(i.map),roughness:i.roughness??.52,metalness:i.metalness??.12,emissive:i.emissive??0,emissiveIntensity:i.emissiveIntensity??0,transparent:!!i.transparent,opacity:i.opacity??1})}function ke(i,e=.9){return new s.MeshStandardMaterial({color:i,emissive:i,emissiveIntensity:e,roughness:.32,metalness:.18})}const ie=`
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`,te=`
uniform sampler2D tDiffuse;
uniform vec2 resolution;
varying vec2 vUv;

float bayer(vec2 p) {
  int x = int(mod(p.x, 4.0));
  int y = int(mod(p.y, 4.0));
  int i = x + y * 4;
  float m[16];
  m[0]=0.0; m[1]=8.0; m[2]=2.0; m[3]=10.0;
  m[4]=12.0; m[5]=4.0; m[6]=14.0; m[7]=6.0;
  m[8]=3.0; m[9]=11.0; m[10]=1.0; m[11]=9.0;
  m[12]=15.0; m[13]=7.0; m[14]=13.0; m[15]=5.0;
  return m[i] / 16.0;
}

void main() {
  vec2 uv = vUv;
  vec3 col = texture2D(tDiffuse, uv).rgb;
  float grain = (bayer(gl_FragCoord.xy) - 0.5) * 0.028;
  col += grain;
  float vig = smoothstep(1.42, 0.22, length(uv * 2.0 - 1.0));
  col *= 0.94 + 0.08 * vig;
  gl_FragColor = vec4(col, 1.0);
}
`;class we{constructor(){c(this,"target");c(this,"quadScene",new s.Scene);c(this,"quadCam",new s.OrthographicCamera(-1,1,1,-1,0,1));c(this,"mat");this.target=new s.WebGLRenderTarget(2,2,{minFilter:s.LinearFilter,magFilter:s.NearestFilter,generateMipmaps:!1,depthBuffer:!0,colorSpace:s.SRGBColorSpace}),this.mat=new s.ShaderMaterial({uniforms:{tDiffuse:{value:this.target.texture},resolution:{value:new s.Vector2(1,1)}},vertexShader:ie,fragmentShader:te,depthTest:!1,depthWrite:!1});const e=new s.Mesh(new s.PlaneGeometry(2,2),this.mat);this.quadScene.add(e)}resize(e,n){const t=Q(e,n);return(this.target.width!==t.w||this.target.height!==t.h)&&this.target.setSize(t.w,t.h),t}present(e,n,t){const a=new s.Vector2;e.getSize(a);const r=this.resize(a.x,a.y);this.mat.uniforms.resolution.value.set(r.w,r.h),e.setRenderTarget(this.target),e.setClearColor(790552,1),e.render(n,t),e.setRenderTarget(null),e.render(this.quadScene,this.quadCam)}dispose(){this.target.dispose(),this.mat.dispose()}}const C={w:.44,d:.36,h:1.72},E={w:2.4,d:.85,h:2.2},g=[{tileX:3.15,tileY:5.2},{tileX:3.15,tileY:4.05}],Me={w:26.4,d:13.2,t:.22,y:5.05,radius:.62},ne=[{x:-12.85,zOffset:-5.55},{x:12.85,zOffset:-5.55},{x:-12.85,zOffset:5.55},{x:12.85,zOffset:5.55}];function ae(i){const e=D[Math.max(0,Math.min(3,i-1))];return{x:u(e.x),z:d(e.y-1.85)}}function re(i){const e=g[Math.max(0,Math.min(g.length-1,i))];return{x:u(e.tileX),z:d(e.tileY)}}function se(){return d(8.15)}function oe(){return{x:u(z.x),z:d(z.y-.15)}}function Se(){const i=[],e=(a,r,o,l)=>{i.push(q(a,r,o,l))};for(let a=1;a<=4;a+=1){const r=ae(a);e(r.x,r.z,C.w*.52,C.d*.55)}for(let a=0;a<g.length;a+=1){const r=re(a);e(r.x,r.z,E.w*.5,E.d*.5)}const n=se();for(const a of ne)e(a.x,n+a.zOffset,.1,.1);const t=oe();return e(t.x,t.z-3.05,4.55,.18),e(t.x-4.45,t.z,.18,3.1),e(t.x+4.45,t.z,.18,3.1),e(t.x-2.9,t.z+3.05,1.55,.18),e(t.x+2.9,t.z+3.05,1.55,.18),e(t.x-2.15,t.z-.35,.88,.32),e(t.x+2.15,t.z-.35,.88,.32),e(t.x,t.z-1.85,1.12,.28),e(u(M.x),d(M.y),.42,.3),e(u(h.x)-1.15,d(h.y),.72,.95),e(u(h.x)+1.15,d(h.y),.72,.95),e(u(S.x),d(S.y),1.02,.82),e(u(4.15),d(6.35),1.05,.42),e(0,-23.4,19,.16),i}const f=1.67,ce=7.1,le=11.2;function ze(i,e,n){return!!n}class be{constructor(){c(this,"camera");c(this,"yaw",0);c(this,"pitch",-.08);c(this,"x",0);c(this,"z",6.4);c(this,"keys",new Set);c(this,"bob",0);c(this,"locked",!1);this.camera=new s.PerspectiveCamera(72,1,.08,280),this.camera.position.set(this.x,f,this.z)}bind(e){window.addEventListener("keydown",n=>{this.keys.add(n.code),["KeyW","KeyA","KeyS","KeyD","Space"].includes(n.code)&&n.preventDefault()}),window.addEventListener("keyup",n=>this.keys.delete(n.code)),e.addEventListener("mousemove",n=>{this.locked&&(this.yaw-=n.movementX*.0022,this.pitch-=n.movementY*.002,this.pitch=Math.max(-1.4,Math.min(1.35,this.pitch)))}),document.addEventListener("pointerlockchange",()=>{this.locked=document.pointerLockElement===e})}lookAt(e,n,t){const a=e-this.x,r=n-f,o=t-this.z;this.yaw=Math.atan2(-a,-o),this.pitch=Math.atan2(r,Math.hypot(a,o))}place(e,n,t,a=-.06){this.x=e,this.z=n,this.yaw=t,this.pitch=a,this.syncCam(0)}tick(e,n,t){const a=new s.Vector3(-Math.sin(this.yaw),0,-Math.cos(this.yaw)),r=new s.Vector3(Math.cos(this.yaw),0,-Math.sin(this.yaw));let o=0,l=0;t||(this.keys.has("KeyW")&&(o+=a.x,l+=a.z),this.keys.has("KeyS")&&(o-=a.x,l-=a.z),this.keys.has("KeyD")&&(o+=r.x,l+=r.z),this.keys.has("KeyA")&&(o-=r.x,l-=r.z));const x=o!==0||l!==0;if(x){const k=Math.hypot(o,l)||1,w=(this.keys.has("ShiftLeft")||this.keys.has("ShiftRight")?le:ce)*e;this.tryMove(o/k*w,l/k*w,n),this.bob+=e*10}else this.bob*=.9;this.syncCam(x?1:.35)}tryMove(e,n,t){const a=this.x+e;b(a,this.z,t,y)||(this.x=a);const r=this.z+n;b(this.x,r,t,y)||(this.z=r),this.x=Math.max(-17.2,Math.min(17.2,this.x)),this.z=Math.max(-22.5,Math.min(20.5,this.z))}syncCam(e){const n=Math.sin(this.bob)*.035*e,t=Math.cos(this.bob*.5)*.012*e;this.camera.position.set(this.x+t,f+n,this.z),this.camera.rotation.order="YXZ",this.camera.rotation.y=this.yaw,this.camera.rotation.x=this.pitch}get position(){return this.camera.position}}const de=7;function Ce(i,e){const n=new s.Raycaster;n.setFromCamera(new s.Vector2(0,0),i),n.far=de;const t=n.intersectObjects(e,!0);for(const a of t){let r=a.object;for(;r;){const o=r.userData.kind;if(o)return{kind:o,id:r.userData.id,distance:a.distance};r=r.parent}}return null}function v(i,e){return i.guests.find(n=>n.id===e)}function Ee(i,e){if(!e||i.phase!=="shift")return{cue:"",glyph:"",prompt:""};if(e.kind==="ack"){const t=i.bays.find(a=>a.id===e.id);if(t&&(t.alarm||t.tripped))return{cue:"red",glyph:"E",prompt:"ACK"}}if(e.kind==="tape")return{cue:"cyan",glyph:"E",prompt:""};if(e.kind==="curing"&&i.curingOn)return{cue:"amber",glyph:"E",prompt:"CUT"};if(e.kind==="refuse"&&m(i))return{cue:"red",glyph:"Q",prompt:""};if(e.kind==="keypad"&&N(i))return{cue:"amber",glyph:"E",prompt:"CODE"};if(e.kind==="kiosk"&&m(i))return{cue:"amber",glyph:"E",prompt:"PAY"};if(e.kind==="bay"){const t=i.bays.find(a=>a.id===e.id);if(t&&(t.alarm||t.tripped))return{cue:"red",glyph:"E",prompt:"ACK"}}const n=v(i,e.id);if(n&&!n.served&&!n.walked&&!n.denied){if(e.kind==="inlet"&&!n.plugged)return{cue:"cyan",glyph:"E",prompt:"PLUG"};if((e.kind==="driver"||e.kind==="car")&&!n.greeted)return{cue:"cyan",glyph:"E",prompt:"TALK"};if(n.plugged&&!n.authorized)return{cue:"amber",glyph:"",prompt:"PAY"};if(X(i,n.id))return{cue:"cyan",glyph:"E",prompt:"TAP"}}return{cue:"",glyph:"",prompt:""}}function Fe(i,e,n=!1){if(!e||i.phase!=="shift")return null;if(e.kind==="refuse"||n&&(e.kind==="kiosk"||e.kind==="car"||e.kind==="driver")){const t=m(i);if(t&&p(i,t.id,!1))return"refuse";if(e.kind==="car"||e.kind==="driver"){const a=v(i,e.id);if(a&&a.auth==="kiosk"&&a.assignedBay!=null&&p(i,a.id,!1))return"refuse"}}if(e.kind==="ack"||e.kind==="bay"){const t=Number(e.id),a=i.bays.find(r=>r.id===t);if(a&&(a.alarm||a.tripped)&&T(i,t))return"ack"}if(e.kind==="tape"){const t=e.id;if(I(i,t)&&L(i,t))return"tape"}if(e.kind==="curing"&&O(i))return"cut";if(e.kind==="keypad"&&_(i))return"code";if(e.kind==="kiosk"){const t=m(i);if(t&&p(i,t.id,!0))return"pay"}if(e.kind==="driver"||e.kind==="car"||e.kind==="inlet"){const t=v(i,e.id);if(!t)return null;if(e.kind==="inlet"&&K(i,t.id))return"plug";if((e.kind==="driver"||e.kind==="car")&&!t.greeted&&W(i,t.id))return"talk";if(Y(i,t.id))return"enroll"}if(e.kind==="bay"){const t=U(i);if(t&&B(i,t.id,Number(e.id)))return G(i,t.id),"plug"}return null}export{pe as C,C as D,E as P,be as W,g as Y,ke as a,u as b,xe as c,Se as d,ne as e,ae as f,ge as g,Me as h,fe as i,we as j,ye as k,Ce as l,Ee as m,R as n,ze as o,ve as p,Fe as u,d as w,re as y};
