var $=Object.defineProperty;var ee=(t,e,i)=>e in t?$(t,e,{enumerable:!0,configurable:!0,writable:!0,value:i}):t[e]=i;var u=(t,e,i)=>ee(t,typeof e!="symbol"?e+"":e,i);import*as s from"https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.js";import{P as te,K as U,w as x,y as K,H as N,z as ne,C as ie}from"./sim-D_RhrL6A.js";import{p as k,a as P,b as ae,c as re,e as se,d as oe,g as ce,f as le,w as ue,h as he,i as de,j as me,k as pe}from"./shift-DgEysS9c.js";const v={red:15086117,char:1973796,amber:15243822,cyan:54517,cream:16117992,chrome:12106944},V=2.45,fe=12,ye=12;function m(t){return(t-fe)*V}function d(t){return(t-ye)*V}function Oe(t){return-t}const T=.32;function ve(t,e,i,n){return{minX:t-i,maxX:t+i,minZ:e-n,maxZ:e+n}}function X(t,e,i,n=T){for(const a of i)if(t>a.minX-n&&t<a.maxX+n&&e>a.minZ-n&&e<a.maxZ+n)return!0;return!1}function Ue(t){const e=document.createElement("canvas");e.width=932,e.height=310;const i=e.getContext("2d");i.clearRect(0,0,e.width,e.height),i.drawImage(t,0,0,932,310);const n=i.getImageData(0,0,e.width,e.height);for(let r=0;r<n.data.length;r+=4)(n.data[r]+n.data[r+1]+n.data[r+2])/3<28&&(n.data[r+3]=0);i.putImageData(n,0,0);const a=new s.CanvasTexture(e);return a.colorSpace=s.SRGBColorSpace,a.magFilter=s.LinearFilter,a.minFilter=s.LinearFilter,a.generateMipmaps=!1,a.needsUpdate=!0,a}const ge=2;function we(t=typeof window<"u"?window.devicePixelRatio||1:2){return Math.max(ge,t)}function xe(t,e,i=typeof window<"u"?window.devicePixelRatio||1:2){const n=we(i);return{w:Math.max(2,Math.round(Math.max(t,1)*n)),h:Math.max(2,Math.round(Math.max(e,1)*n))}}const Me=`
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
`,ke=`
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
`;function Z(t,e=s.RepeatWrapping){return t.magFilter=s.NearestFilter,t.minFilter=s.NearestFilter,t.generateMipmaps=!1,t.wrapS=e,t.wrapT=e,t.colorSpace=s.SRGBColorSpace,t.needsUpdate=!0,t}function Ke(t){const e=t.map?Z(t.map):null;return new s.ShaderMaterial({uniforms:{snap:{value:t.snap??220},lightDir:{value:new s.Vector3(.32,.9,.28).normalize()},color:{value:new s.Color(t.color??16777215)},emissive:{value:new s.Color(t.emissive??0)},emissiveIntensity:{value:t.emissiveIntensity??0},map:{value:e},hasMap:{value:e?1:0},opacity:{value:t.opacity??1}},vertexShader:Me,fragmentShader:ke,transparent:!!t.transparent||(t.opacity??1)<1})}function Ne(t){return new s.MeshBasicMaterial({color:t.color??16777215,map:t.map?Z(t.map,s.ClampToEdgeWrapping):null,transparent:!!t.transparent,opacity:t.opacity??1,depthWrite:t.depthWrite??!0,toneMapped:!1})}function be(t){return t?(t.magFilter=s.LinearFilter,t.minFilter=s.LinearFilter,t.colorSpace=s.SRGBColorSpace,t.needsUpdate=!0,t):null}function M(t){return new s.MeshStandardMaterial({color:t.color??16777215,map:be(t.map),roughness:t.roughness??.52,metalness:t.metalness??.12,emissive:t.emissive??0,emissiveIntensity:t.emissiveIntensity??0,transparent:!!t.transparent,opacity:t.opacity??1})}function F(t,e=.9){return new s.MeshStandardMaterial({color:t,emissive:t,emissiveIntensity:e,roughness:.32,metalness:.18})}const Se=`
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`,ze=`
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
`;class Xe{constructor(){u(this,"target");u(this,"quadScene",new s.Scene);u(this,"quadCam",new s.OrthographicCamera(-1,1,1,-1,0,1));u(this,"mat");this.target=new s.WebGLRenderTarget(2,2,{minFilter:s.LinearFilter,magFilter:s.NearestFilter,generateMipmaps:!1,depthBuffer:!0,colorSpace:s.SRGBColorSpace}),this.mat=new s.ShaderMaterial({uniforms:{tDiffuse:{value:this.target.texture},resolution:{value:new s.Vector2(1,1)}},vertexShader:Se,fragmentShader:ze,depthTest:!1,depthWrite:!1});const e=new s.Mesh(new s.PlaneGeometry(2,2),this.mat);this.quadScene.add(e)}resize(e,i){const n=xe(e,i);return(this.target.width!==n.w||this.target.height!==n.h)&&this.target.setSize(n.w,n.h),n}present(e,i,n){const a=new s.Vector2;e.getSize(a);const r=this.resize(a.x,a.y);this.mat.uniforms.resolution.value.set(r.w,r.h),e.setRenderTarget(this.target),e.setClearColor(790552,1),e.render(i,n),e.setRenderTarget(null),e.render(this.quadScene,this.quadCam)}dispose(){this.target.dispose(),this.mat.dispose()}}const H={w:.44,d:.36,h:1.72},q={w:2.4,d:.85,h:2.2},L=[{tileX:3.15,tileY:5.2},{tileX:3.15,tileY:4.05}],He={w:26.4,d:13.2,t:.22,y:5.05,radius:.62},Ce=[{x:-8.4,zOffset:4.35}];function Ee(t){const e=te[Math.max(0,Math.min(3,t-1))];return{x:m(e.x),z:d(e.y-1.85)}}function Ie(t){const e=L[Math.max(0,Math.min(L.length-1,t))];return{x:m(e.tileX),z:d(e.tileY)}}function Pe(){return d(8.15)}function Fe(){return{x:m(N.x),z:d(N.y-.15)}}function qe(){const t=[],e=(a,r,o,c)=>{t.push(ve(a,r,o,c))};for(let a=1;a<=4;a+=1){const r=Ee(a);e(r.x,r.z,H.w*.52,H.d*.55)}for(let a=0;a<L.length;a+=1){const r=Ie(a);e(r.x,r.z,q.w*.5,q.d*.5)}const i=Pe();for(const a of Ce)e(a.x,i+a.zOffset,.52,.52);const n=Fe();return e(n.x,n.z-3.35,5.05,.18),e(n.x-4.95,n.z,.2,3.4),e(n.x+4.95,n.z,.2,3.4),e(n.x-3.15,n.z+3.35,1.7,.18),e(n.x+3.15,n.z+3.35,1.7,.18),e(n.x-2.15,n.z-.35,.88,.32),e(n.x+2.15,n.z-.35,.88,.32),e(n.x,n.z-1.85,1.12,.28),e(m(U.x),d(U.y),.42,.3),e(m(x.x)-1.15,d(x.y),.72,.95),e(m(x.x)+1.15,d(x.y),.72,.95),e(m(K.x),d(K.y),1.02,.82),e(m(4.15),d(6.35),1.05,.42),e(0,-23.4,19,.16),t}function Re(t){return t==="van"?{L:4.75,W:2.05,H:1.78,belt:.92,tire:.38}:t==="suv"?{L:4.7,W:2,H:1.56,belt:.78,tire:.38}:t==="hatch"?{L:4.24,W:1.86,H:1.32,belt:.6,tire:.34}:{L:4.58,W:1.92,H:1.26,belt:.62,tire:.35}}function Te(t){const e=t===v.char?2894900:t===v.chrome?13159636:15986664;return M({color:e,roughness:.18,metalness:.68,emissive:e,emissiveIntensity:t===v.char?.22:.3})}function Le(t){const e=t.W*.5,{H:i,belt:n,tire:a}=t,r=new s.Shape,o=a+.08;return r.moveTo(-e*.28,.07),r.lineTo(-e*.42,.07),r.absarc(-e*.7,a*.15,o,Math.PI*1.05,Math.PI*-.08,!1),r.lineTo(-e*1.04,n*.92),r.quadraticCurveTo(-e*1.06,n+.08,-e*.92,n+.1),r.quadraticCurveTo(-e*.72,i*.78,-e*.48,i),r.lineTo(e*.48,i),r.quadraticCurveTo(e*.72,i*.78,e*.92,n+.1),r.quadraticCurveTo(e*1.06,n+.08,e*1.04,n*.92),r.absarc(e*.7,a*.15,o,Math.PI*1.08,Math.PI*-.05,!0),r.lineTo(e*.28,.07),r.closePath(),r}function Ae(t,e){const i=t.attributes.position;for(let n=0;n<i.count;n+=1){const a=i.getX(n),r=i.getY(n),o=i.getZ(n),c=s.MathUtils.clamp((a+e.L*.5)/e.L,0,1),l=1-c*c*.28;let p=r;c>.72&&r>e.belt&&(p=e.belt+(r-e.belt)*(1-(c-.72)*2.2)),i.setXYZ(n,a,Math.max(.05,p),o*l)}i.needsUpdate=!0,t.computeVertexNormals()}function Ve(t,e,i){const n=Re(e),{L:a,W:r,H:o,belt:c,tire:l}=n,p=Te(i),f=new s.ExtrudeGeometry(Le(n),{depth:a,bevelEnabled:!1,steps:14,curveSegments:28});f.rotateY(Math.PI/2),f.translate(-a*.5,0,0),Ae(f,n);const G=new s.Mesh(f,p);G.name="cineHull",t.add(G);const D=M({color:529438,roughness:.04,metalness:.88,emissive:1056816,emissiveIntensity:.42,transparent:!0,opacity:.92}),g=Math.max(.34,o-c-.06),w=new s.Mesh(new s.PlaneGeometry(r*.7,g),D);w.position.set(-a*.5-.02,c+g*.52,0),w.rotation.y=Math.PI/2,w.name="cineCabin",t.add(w);const b=new s.Mesh(new s.BoxGeometry(a*.42,g*.92,r*.58),D);b.name="cineGlass",b.position.set(-a*.06,c+g*.5,0),t.add(b);const W=F(1052692,.1);W.roughness=.82;const j=M({color:15265010,roughness:.14,metalness:.8,emissive:13159636,emissiveIntensity:.4}),Q=M({color:13949150,roughness:.18,metalness:.72,emissive:12106948,emissiveIntensity:.28}),Y=r*.7;for(const y of[-a*.3,a*.3])for(const h of[-Y,Y]){const z=new s.Mesh(new s.CylinderGeometry(l,l+.028,.28,28),W);z.rotation.x=Math.PI/2,z.position.set(y,l,h),t.add(z);const C=new s.Mesh(new s.CylinderGeometry(l*.38,l*.5,.3,20),j);C.rotation.x=Math.PI/2,C.position.set(y,l,h),t.add(C);for(let E=0;E<5;E+=1){const I=new s.Mesh(new s.CylinderGeometry(.016,.03,l*.98,6),Q);I.position.set(y,l,h),I.rotation.z=E*Math.PI/5,t.add(I)}}const S=[],J=F(v.cream,1.1),_=F(v.red,2.2);for(const y of[-r*.28,r*.28]){const h=new s.Mesh(new s.SphereGeometry(.08,12,10),J);h.scale.set(1.15,.62,.78),h.position.set(a*.48,c*.68,y),t.add(h),S.push(h)}const B=c*.88,O=new s.Mesh(new s.BoxGeometry(.05,.055,r*.94),_);O.position.set(-a*.5-.04,B,0),t.add(O);for(const y of[-r*.46,r*.46]){const h=new s.Mesh(new s.BoxGeometry(.18,.05,.055),_);h.position.set(-a*.5+.04,B,y),t.add(h),S.push(h)}return S}const R=1.67,Ge=7.1,De=11.2;function Ze(t,e,i){return!!i}class je{constructor(){u(this,"camera");u(this,"yaw",0);u(this,"pitch",-.08);u(this,"x",0);u(this,"z",6.4);u(this,"keys",new Set);u(this,"bob",0);u(this,"locked",!1);this.camera=new s.PerspectiveCamera(72,1,.08,280),this.camera.position.set(this.x,R,this.z)}bind(e){window.addEventListener("keydown",i=>{this.keys.add(i.code),["KeyW","KeyA","KeyS","KeyD","Space"].includes(i.code)&&i.preventDefault()}),window.addEventListener("keyup",i=>this.keys.delete(i.code)),e.addEventListener("mousemove",i=>{this.locked&&(this.yaw-=i.movementX*.0022,this.pitch-=i.movementY*.002,this.pitch=Math.max(-1.4,Math.min(1.35,this.pitch)))}),document.addEventListener("pointerlockchange",()=>{this.locked=document.pointerLockElement===e})}lookAt(e,i,n){const a=e-this.x,r=i-R,o=n-this.z;this.yaw=Math.atan2(-a,-o),this.pitch=Math.atan2(r,Math.hypot(a,o))}place(e,i,n,a=-.06){this.x=e,this.z=i,this.yaw=n,this.pitch=a,this.syncCam(0)}tick(e,i,n){const a=new s.Vector3(-Math.sin(this.yaw),0,-Math.cos(this.yaw)),r=new s.Vector3(Math.cos(this.yaw),0,-Math.sin(this.yaw));let o=0,c=0;n||(this.keys.has("KeyW")&&(o+=a.x,c+=a.z),this.keys.has("KeyS")&&(o-=a.x,c-=a.z),this.keys.has("KeyD")&&(o+=r.x,c+=r.z),this.keys.has("KeyA")&&(o-=r.x,c-=r.z));const l=o!==0||c!==0;if(l){const p=Math.hypot(o,c)||1,f=(this.keys.has("ShiftLeft")||this.keys.has("ShiftRight")?De:Ge)*e;this.tryMove(o/p*f,c/p*f,i),this.bob+=e*10}else this.bob*=.9;this.syncCam(l?1:.35)}tryMove(e,i,n){const a=this.x+e;X(a,this.z,n,T)||(this.x=a);const r=this.z+i;X(this.x,r,n,T)||(this.z=r),this.x=Math.max(-17.2,Math.min(17.2,this.x)),this.z=Math.max(-22.5,Math.min(20.5,this.z))}syncCam(e){const i=Math.sin(this.bob)*.035*e,n=Math.cos(this.bob*.5)*.012*e;this.camera.position.set(this.x+n,R+i,this.z),this.camera.rotation.order="YXZ",this.camera.rotation.y=this.yaw,this.camera.rotation.x=this.pitch}get position(){return this.camera.position}}const We=7;function Qe(t,e){const i=new s.Raycaster;i.setFromCamera(new s.Vector2(0,0),t),i.far=We;const n=i.intersectObjects(e,!0);for(const a of n){let r=a.object;for(;r;){const o=r.userData.kind;if(o)return{kind:o,id:r.userData.id,distance:a.distance};r=r.parent}}return null}function A(t,e){return t.guests.find(i=>i.id===e)}function Je(t,e){if(!e||t.phase!=="shift")return{cue:"",glyph:"",prompt:""};if(e.kind==="ack"){const n=t.bays.find(a=>a.id===e.id);if(n&&(n.alarm||n.tripped))return{cue:"red",glyph:"E",prompt:"ACK"}}if(e.kind==="tape")return{cue:"cyan",glyph:"E",prompt:""};if(e.kind==="curing"&&t.curingOn)return{cue:"amber",glyph:"E",prompt:"CUT"};if(e.kind==="refuse"&&k(t))return{cue:"red",glyph:"Q",prompt:""};if(e.kind==="keypad"&&me(t))return{cue:"amber",glyph:"E",prompt:"CODE"};if(e.kind==="kiosk"&&k(t))return{cue:"amber",glyph:"E",prompt:"PAY"};if(e.kind==="bay"){const n=t.bays.find(a=>a.id===e.id);if(n&&(n.alarm||n.tripped))return{cue:"red",glyph:"E",prompt:"ACK"}}const i=A(t,e.id);if(i&&!i.served&&!i.walked&&!i.denied){if(e.kind==="inlet"&&!i.plugged)return{cue:"cyan",glyph:"E",prompt:"PLUG"};if((e.kind==="driver"||e.kind==="car")&&!i.greeted)return{cue:"cyan",glyph:"E",prompt:"TALK"};if(i.plugged&&!i.authorized)return{cue:"amber",glyph:"",prompt:"PAY"};if(pe(t,i.id))return{cue:"cyan",glyph:"E",prompt:"TAP"}}return{cue:"",glyph:"",prompt:""}}function $e(t,e,i=!1){if(!e||t.phase!=="shift")return null;if(e.kind==="refuse"||i&&(e.kind==="kiosk"||e.kind==="car"||e.kind==="driver")){const n=k(t);if(n&&P(t,n.id,!1))return"refuse";if(e.kind==="car"||e.kind==="driver"){const a=A(t,e.id);if(a&&a.auth==="kiosk"&&a.assignedBay!=null&&P(t,a.id,!1))return"refuse"}}if(e.kind==="ack"||e.kind==="bay"){const n=Number(e.id),a=t.bays.find(r=>r.id===n);if(a&&(a.alarm||a.tripped)&&ae(t,n))return"ack"}if(e.kind==="tape"){const n=e.id;if(ne(t,n)&&ie(t,n))return"tape"}if(e.kind==="curing"&&re(t))return"cut";if(e.kind==="keypad"&&se(t))return"code";if(e.kind==="kiosk"){const n=k(t);if(n&&P(t,n.id,!0))return"pay"}if(e.kind==="driver"||e.kind==="car"||e.kind==="inlet"){const n=A(t,e.id);if(!n)return null;if(e.kind==="inlet"&&oe(t,n.id))return"plug";if((e.kind==="driver"||e.kind==="car")&&!n.greeted&&ce(t,n.id))return"talk";if(le(t,n.id))return"enroll"}if(e.kind==="bay"){const n=ue(t);if(n&&he(t,n.id,Number(e.id)))return de(t,n.id),"plug"}return null}export{v as C,H as D,q as P,je as W,L as Y,d as a,Ke as b,Oe as c,Ee as d,M as e,qe as f,Ce as g,He as h,Xe as i,Qe as j,Ue as k,Je as l,Ve as m,F as n,Ze as o,Ne as p,$e as u,m as w,Ie as y};
