var L=Object.defineProperty;var T=(e,t,n)=>t in e?L(e,t,{enumerable:!0,configurable:!0,writable:!0,value:n}):e[t]=n;var c=(e,t,n)=>T(e,typeof t!="symbol"?t+"":t,n);import*as r from"https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.js";import{P as _,K as E,w as y,y as C,H as R,z as B,C as G}from"./sim-D_RhrL6A.js";import{p as g,a as v,b as K,c as O,e as W,d as Y,g as N,f as U,w as X,h as V,i as Z,j,k as q}from"./shift-TgR0nOiQ.js";const d={red:15086117,char:1973796,amber:15243822,cyan:54517,cream:16117992,chrome:12106944},P=2.45,H=12,Q=12;function m(e){return(e-H)*P}function u(e){return(e-Q)*P}function ke(e){return-e}const k=.32;function J(e,t,n,i){return{minX:e-n,maxX:e+n,minZ:t-i,maxZ:t+i}}function F(e,t,n,i=k){for(const a of n)if(e>a.minX-i&&e<a.maxX+i&&t>a.minZ-i&&t<a.maxZ+i)return!0;return!1}function Me(e){const t=document.createElement("canvas");t.width=932,t.height=310;const n=t.getContext("2d");n.clearRect(0,0,t.width,t.height),n.drawImage(e,0,0,932,310);const i=n.getImageData(0,0,t.width,t.height);for(let s=0;s<i.data.length;s+=4)(i.data[s]+i.data[s+1]+i.data[s+2])/3<28&&(i.data[s+3]=0);n.putImageData(i,0,0);const a=new r.CanvasTexture(t);return a.colorSpace=r.SRGBColorSpace,a.magFilter=r.LinearFilter,a.minFilter=r.LinearFilter,a.generateMipmaps=!1,a.needsUpdate=!0,a}const $=2;function ee(e=typeof window<"u"?window.devicePixelRatio||1:2){return Math.max($,e)}function te(e,t,n=typeof window<"u"?window.devicePixelRatio||1:2){const i=ee(n);return{w:Math.max(2,Math.round(Math.max(e,1)*i)),h:Math.max(2,Math.round(Math.max(t,1)*i))}}const ie=`
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
`,ne=`
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
`;function I(e,t=r.RepeatWrapping){return e.magFilter=r.NearestFilter,e.minFilter=r.NearestFilter,e.generateMipmaps=!1,e.wrapS=t,e.wrapT=t,e.colorSpace=r.SRGBColorSpace,e.needsUpdate=!0,e}function ae(e){const t=e.map?I(e.map):null;return new r.ShaderMaterial({uniforms:{snap:{value:e.snap??220},lightDir:{value:new r.Vector3(.32,.9,.28).normalize()},color:{value:new r.Color(e.color??16777215)},emissive:{value:new r.Color(e.emissive??0)},emissiveIntensity:{value:e.emissiveIntensity??0},map:{value:t},hasMap:{value:t?1:0},opacity:{value:e.opacity??1}},vertexShader:ie,fragmentShader:ne,transparent:!!e.transparent||(e.opacity??1)<1})}function x(e){return new r.MeshBasicMaterial({color:e.color??16777215,map:e.map?I(e.map,r.ClampToEdgeWrapping):null,transparent:!!e.transparent,opacity:e.opacity??1,depthWrite:e.depthWrite??!0,toneMapped:!1})}function re(e){return e?(e.magFilter=r.LinearFilter,e.minFilter=r.LinearFilter,e.colorSpace=r.SRGBColorSpace,e.needsUpdate=!0,e):null}function Se(e){return new r.MeshStandardMaterial({color:e.color??16777215,map:re(e.map),roughness:e.roughness??.52,metalness:e.metalness??.12,emissive:e.emissive??0,emissiveIntensity:e.emissiveIntensity??0,transparent:!!e.transparent,opacity:e.opacity??1})}function be(e,t=.9){return new r.MeshStandardMaterial({color:e,emissive:e,emissiveIntensity:t,roughness:.32,metalness:.18})}const se=`
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`,oe=`
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
`;class ze{constructor(){c(this,"target");c(this,"quadScene",new r.Scene);c(this,"quadCam",new r.OrthographicCamera(-1,1,1,-1,0,1));c(this,"mat");this.target=new r.WebGLRenderTarget(2,2,{minFilter:r.LinearFilter,magFilter:r.NearestFilter,generateMipmaps:!1,depthBuffer:!0,colorSpace:r.SRGBColorSpace}),this.mat=new r.ShaderMaterial({uniforms:{tDiffuse:{value:this.target.texture},resolution:{value:new r.Vector2(1,1)}},vertexShader:se,fragmentShader:oe,depthTest:!1,depthWrite:!1});const t=new r.Mesh(new r.PlaneGeometry(2,2),this.mat);this.quadScene.add(t)}resize(t,n){const i=te(t,n);return(this.target.width!==i.w||this.target.height!==i.h)&&this.target.setSize(i.w,i.h),i}present(t,n,i){const a=new r.Vector2;t.getSize(a);const s=this.resize(a.x,a.y);this.mat.uniforms.resolution.value.set(s.w,s.h),t.setRenderTarget(this.target),t.setClearColor(790552,1),t.render(n,i),t.setRenderTarget(null),t.render(this.quadScene,this.quadCam)}dispose(){this.target.dispose(),this.mat.dispose()}}const A={w:.44,d:.36,h:1.72},D={w:2.4,d:.85,h:2.2},M=[{tileX:3.15,tileY:5.2},{tileX:3.15,tileY:4.05}],Ee={w:26.4,d:13.2,t:.22,y:5.05,radius:.62},ce=[{x:-8.4,zOffset:4.35}];function le(e){const t=_[Math.max(0,Math.min(3,e-1))];return{x:m(t.x),z:u(t.y-1.85)}}function de(e){const t=M[Math.max(0,Math.min(M.length-1,e))];return{x:m(t.tileX),z:u(t.tileY)}}function ue(){return u(8.15)}function he(){return{x:m(R.x),z:u(R.y-.15)}}function Ce(){const e=[],t=(a,s,o,l)=>{e.push(J(a,s,o,l))};for(let a=1;a<=4;a+=1){const s=le(a);t(s.x,s.z,A.w*.52,A.d*.55)}for(let a=0;a<M.length;a+=1){const s=de(a);t(s.x,s.z,D.w*.5,D.d*.5)}const n=ue();for(const a of ce)t(a.x,n+a.zOffset,.52,.52);const i=he();return t(i.x,i.z-3.35,5.05,.18),t(i.x-4.95,i.z,.2,3.4),t(i.x+4.95,i.z,.2,3.4),t(i.x-3.15,i.z+3.35,1.7,.18),t(i.x+3.15,i.z+3.35,1.7,.18),t(i.x-2.15,i.z-.35,.88,.32),t(i.x+2.15,i.z-.35,.88,.32),t(i.x,i.z-1.85,1.12,.28),t(m(E.x),u(E.y),.42,.3),t(m(y.x)-1.15,u(y.y),.72,.95),t(m(y.x)+1.15,u(y.y),.72,.95),t(m(C.x),u(C.y),1.02,.82),t(m(4.15),u(6.35),1.05,.42),t(0,-23.4,19,.16),e}const w=1.67,me=7.1,pe=11.2;function Re(e,t,n){return!!n}class Fe{constructor(){c(this,"camera");c(this,"yaw",0);c(this,"pitch",-.08);c(this,"x",0);c(this,"z",6.4);c(this,"keys",new Set);c(this,"bob",0);c(this,"locked",!1);this.camera=new r.PerspectiveCamera(72,1,.08,280),this.camera.position.set(this.x,w,this.z)}bind(t){window.addEventListener("keydown",n=>{this.keys.add(n.code),["KeyW","KeyA","KeyS","KeyD","Space"].includes(n.code)&&n.preventDefault()}),window.addEventListener("keyup",n=>this.keys.delete(n.code)),t.addEventListener("mousemove",n=>{this.locked&&(this.yaw-=n.movementX*.0022,this.pitch-=n.movementY*.002,this.pitch=Math.max(-1.4,Math.min(1.35,this.pitch)))}),document.addEventListener("pointerlockchange",()=>{this.locked=document.pointerLockElement===t})}lookAt(t,n,i){const a=t-this.x,s=n-w,o=i-this.z;this.yaw=Math.atan2(-a,-o),this.pitch=Math.atan2(s,Math.hypot(a,o))}place(t,n,i,a=-.06){this.x=t,this.z=n,this.yaw=i,this.pitch=a,this.syncCam(0)}tick(t,n,i){const a=new r.Vector3(-Math.sin(this.yaw),0,-Math.cos(this.yaw)),s=new r.Vector3(Math.cos(this.yaw),0,-Math.sin(this.yaw));let o=0,l=0;i||(this.keys.has("KeyW")&&(o+=a.x,l+=a.z),this.keys.has("KeyS")&&(o-=a.x,l-=a.z),this.keys.has("KeyD")&&(o+=s.x,l+=s.z),this.keys.has("KeyA")&&(o-=s.x,l-=s.z));const f=o!==0||l!==0;if(f){const b=Math.hypot(o,l)||1,z=(this.keys.has("ShiftLeft")||this.keys.has("ShiftRight")?pe:me)*t;this.tryMove(o/b*z,l/b*z,n),this.bob+=t*10}else this.bob*=.9;this.syncCam(f?1:.35)}tryMove(t,n,i){const a=this.x+t;F(a,this.z,i,k)||(this.x=a);const s=this.z+n;F(this.x,s,i,k)||(this.z=s),this.x=Math.max(-17.2,Math.min(17.2,this.x)),this.z=Math.max(-22.5,Math.min(20.5,this.z))}syncCam(t){const n=Math.sin(this.bob)*.035*t,i=Math.cos(this.bob*.5)*.012*t;this.camera.position.set(this.x+i,w+n,this.z),this.camera.rotation.order="YXZ",this.camera.rotation.y=this.yaw,this.camera.rotation.x=this.pitch}get position(){return this.camera.position}}const fe=7;function Ae(e,t){const n=new r.Raycaster;n.setFromCamera(new r.Vector2(0,0),e),n.far=fe;const i=n.intersectObjects(t,!0);for(const a of i){let s=a.object;for(;s;){const o=s.userData.kind;if(o)return{kind:o,id:s.userData.id,distance:a.distance};s=s.parent}}return null}function S(e,t){return e.guests.find(n=>n.id===t)}function De(e,t){if(!t||e.phase!=="shift")return{cue:"",glyph:"",prompt:""};if(t.kind==="ack"){const i=e.bays.find(a=>a.id===t.id);if(i&&(i.alarm||i.tripped))return{cue:"red",glyph:"E",prompt:"ACK"}}if(t.kind==="tape")return{cue:"cyan",glyph:"E",prompt:""};if(t.kind==="curing"&&e.curingOn)return{cue:"amber",glyph:"E",prompt:"CUT"};if(t.kind==="refuse"&&g(e))return{cue:"red",glyph:"Q",prompt:""};if(t.kind==="keypad"&&j(e))return{cue:"amber",glyph:"E",prompt:"CODE"};if(t.kind==="kiosk"&&g(e))return{cue:"amber",glyph:"E",prompt:"PAY"};if(t.kind==="bay"){const i=e.bays.find(a=>a.id===t.id);if(i&&(i.alarm||i.tripped))return{cue:"red",glyph:"E",prompt:"ACK"}}const n=S(e,t.id);if(n&&!n.served&&!n.walked&&!n.denied){if(t.kind==="inlet"&&!n.plugged)return{cue:"cyan",glyph:"E",prompt:"PLUG"};if((t.kind==="driver"||t.kind==="car")&&!n.greeted)return{cue:"cyan",glyph:"E",prompt:"TALK"};if(n.plugged&&!n.authorized)return{cue:"amber",glyph:"",prompt:"PAY"};if(q(e,n.id))return{cue:"cyan",glyph:"E",prompt:"TAP"}}return{cue:"",glyph:"",prompt:""}}function Pe(e,t,n=!1){if(!t||e.phase!=="shift")return null;if(t.kind==="refuse"||n&&(t.kind==="kiosk"||t.kind==="car"||t.kind==="driver")){const i=g(e);if(i&&v(e,i.id,!1))return"refuse";if(t.kind==="car"||t.kind==="driver"){const a=S(e,t.id);if(a&&a.auth==="kiosk"&&a.assignedBay!=null&&v(e,a.id,!1))return"refuse"}}if(t.kind==="ack"||t.kind==="bay"){const i=Number(t.id),a=e.bays.find(s=>s.id===i);if(a&&(a.alarm||a.tripped)&&K(e,i))return"ack"}if(t.kind==="tape"){const i=t.id;if(B(e,i)&&G(e,i))return"tape"}if(t.kind==="curing"&&O(e))return"cut";if(t.kind==="keypad"&&W(e))return"code";if(t.kind==="kiosk"){const i=g(e);if(i&&v(e,i.id,!0))return"pay"}if(t.kind==="driver"||t.kind==="car"||t.kind==="inlet"){const i=S(e,t.id);if(!i)return null;if(t.kind==="inlet"&&Y(e,i.id))return"plug";if((t.kind==="driver"||t.kind==="car")&&!i.greeted&&N(e,i.id))return"talk";if(U(e,i.id))return"enroll"}if(t.kind==="bay"){const i=X(e);if(i&&V(e,i.id,Number(t.id)))return Z(e,i.id),"plug"}return null}const ye="reader",ge=.36,p={x:.3,y:-.26,z:-.52};function h(e,t,n,i,a,s,o,l){const f=new r.Mesh(new r.BoxGeometry(n,i,a),ae({color:t,snap:240}));return f.position.set(s,o,l),e.add(f),f}function Ie(){const e=new r.Group;e.name="reader",e.userData.kind=ye,h(e,d.chrome,.09,.08,.16,.14,-.28,-.4),h(e,d.chrome,.04,.11,.04,.17,-.22,-.36),h(e,d.chrome,.04,.1,.04,.2,-.23,-.39),h(e,d.char,.08,.07,.14,.3,-.26,-.42),h(e,d.chrome,.035,.09,.035,.33,-.2,-.38);const t=h(e,d.chrome,.17,.28,.07,.23,-.18,-.36);t.name="body",h(e,d.char,.15,.04,.02,.23,-.3,-.328),h(e,d.chrome,.15,.12,.02,.23,-.12,-.328);const n=new r.Mesh(new r.BoxGeometry(.11,.08,.016),x({color:d.cyan,transparent:!0,opacity:.42}));n.name="glass",n.position.set(.23,-.118,-.318),e.add(n);const i=new r.Mesh(new r.BoxGeometry(.15,.018,.016),x({color:d.cyan}));i.position.set(.23,-.28,-.328),e.add(i);const a=new r.Mesh(new r.BoxGeometry(.08,.03,.02),x({color:d.chrome}));return a.position.set(.23,-.22,-.324),e.add(a),e.scale.setScalar(ge),e.position.set(p.x,p.y,p.z),e.rotation.x=.14,e.visible=!1,e}function Le(e,t){if(e.visible=t.show,!t.show)return;const n=!!t.live;e.position.set(p.x,n?p.y+.028:p.y,p.z),e.rotation.z=n?-.06:-.02,e.rotation.x=.14;const i=e.getObjectByName("glass");if(i){const a=i.material;a.opacity=n?.45+.4*(.5+.5*Math.sin(t.pulse*8)):.34}}export{d as C,A as D,D as P,Fe as W,M as Y,u as a,ke as b,Se as c,le as d,Ce as e,ce as f,ae as g,Ee as h,ze as i,Ie as j,Me as k,Ae as l,De as m,be as n,Re as o,x as p,Le as s,Pe as u,m as w,de as y};
