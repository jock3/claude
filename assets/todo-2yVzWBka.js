import"./modulepreload-polyfill-B5Qt9EMX.js";/* empty css                        */import{c as Ne,r as m,j as e,X as ie,a as Se,R as ze}from"./x-DQiwR93G.js";import{s as oe,P as Q,L as Ce,C as Ee,T as Le}from"./supabase-cLNDT8ps.js";import{C as le}from"./check-DL9iMPUa.js";/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Me=Ne("Calendar",[["path",{d:"M8 2v4",key:"1cmpym"}],["path",{d:"M16 2v4",key:"4m81vk"}],["rect",{width:"18",height:"18",x:"3",y:"4",rx:"2",key:"1hopcy"}],["path",{d:"M3 10h18",key:"8toen8"}]]);async function Te(i){const{data:l}=await oe.from("profiles").select("id, name").eq("name",i).maybeSingle();if(l)return l;const{data:N}=await oe.from("profiles").insert({name:i}).select("id, name").single();return N}async function $e(i){const{data:l}=await oe.from("projects").select("*").eq("profile_id",i).order("created_at",{ascending:!1});return l||[]}async function ue(i){await oe.from("projects").upsert(i)}async function De(i){await oe.from("projects").delete().eq("id",i)}const re=[{key:"todo",label:"Att göra",color:"#6A6964"},{key:"doing",label:"Pågår",color:"#2E6FD4"},{key:"review",label:"Granskning",color:"#E0A93B"},{key:"done",label:"Klar",color:"#5BAE6E"}],se="ailabb_profile_id",de="ailabb_profile_name",he=()=>{const i=new Date;return i.setMonth(i.getMonth()+1),i.toISOString().split("T")[0]},Fe=i=>new Date(i).toLocaleDateString("sv-SE"),U=i=>{const l=new Date;l.setHours(0,0,0,0);const N=new Date(i);return N.setHours(0,0,0,0),Math.round((N-l)/864e5)},Ie=i=>{let l=0,N=0;for(const v of i||[]){N++,v.done&&l++;for(const x of v.children||[]){N++,x.done&&l++;for(const b of x.children||[])N++,b.done&&l++}}return{done:l,total:N}};function me(){return m.useEffect(()=>{const i=window.matchMedia("(pointer: fine)").matches,l=window.matchMedia("(prefers-reduced-motion: reduce)").matches,N=[];if(i){const v=document.getElementById("tl-cursor-dot"),x=document.getElementById("tl-cursor-ring");let b=0,D=0,C=0,T=0,W=!1,E;const s=j=>{b=j.clientX,D=j.clientY,v.style.left=b+"px",v.style.top=D+"px",W||(v.classList.add("visible"),x.classList.add("visible"),W=!0)},w=(j,p,d)=>j+(p-j)*d;let y=0;const F=j=>{const p=Math.min(j-y||16,50);y=j;const d=1-Math.pow(.78,p/16.67);C=w(C,b,d),T=w(T,D,d),x.style.left=C+"px",x.style.top=T+"px",E=requestAnimationFrame(F)};E=requestAnimationFrame(F);const A=()=>{v.classList.add("clicking"),x.classList.add("clicking")},S=()=>{v.classList.remove("clicking"),x.classList.remove("clicking")},I='a, button, input, textarea, [role="button"], .s-app-item',_=j=>{j.target.closest(I)&&(v.classList.add("hovering"),x.classList.add("hovering"))},O=j=>{j.target.closest(I)&&(v.classList.remove("hovering"),x.classList.remove("hovering"))};document.addEventListener("mousemove",s),document.addEventListener("mousedown",A),document.addEventListener("mouseup",S),document.addEventListener("mouseover",_),document.addEventListener("mouseout",O),N.push(()=>{cancelAnimationFrame(E),document.removeEventListener("mousemove",s),document.removeEventListener("mousedown",A),document.removeEventListener("mouseup",S),document.removeEventListener("mouseover",_),document.removeEventListener("mouseout",O)})}{const v=document.getElementById("tl-spotlight");let x=!1;const b=D=>{v.style.setProperty("--mx",D.clientX+"px"),v.style.setProperty("--my",D.clientY+"px"),x||(v.classList.add("visible"),x=!0)};document.addEventListener("mousemove",b),N.push(()=>document.removeEventListener("mousemove",b))}{let v=function(){this.x=Math.random()*w,this.y=Math.random()*y,this.vx=(Math.random()-.5)*.38,this.vy=(Math.random()-.5)*.38,this.sz=Math.random()*1.1+.4,this.al=Math.random()*.28+.1},x=function(){F=Math.min(window.devicePixelRatio||1,2),w=window.innerWidth,y=window.innerHeight,E.width=w*F,E.height=y*F,E.style.width=w+"px",E.style.height=y+"px",s.setTransform(1,0,0,1,0,0),s.scale(F,F),A=[];const p=w<768?42:74;for(let d=0;d<p;d++)A.push(new v)},b=function(p){I.forEach(d=>{const L=(d[0]+Math.sin(p*d[3]+d[4])*.22)*w,h=(d[1]+Math.cos(p*d[3]*.73+d[4]*1.1)*.18)*y,$=d[2]*Math.max(w,y),P=s.createRadialGradient(L,h,0,L,h,$);P.addColorStop(0,`rgba(${d[5]},${d[6]},${d[7]},${d[8]*2.4})`),P.addColorStop(.38,`rgba(${d[5]},${d[6]},${d[7]},${d[8]})`),P.addColorStop(1,`rgba(${d[5]},${d[6]},${d[7]},0)`),s.fillStyle=P,s.fillRect(0,0,w,y)})},D=function(p){const $=w/14,P=y/9;s.lineWidth=.85,s.strokeStyle="rgba(34,197,94,0.045)";let z,k,g,M,R,B;for(z=0;z<=9;z++){for(s.beginPath(),k=0;k<=14;k++)g=k*$,M=z*P,R=Math.sin(g*.009+p*46e-5+z*.28)*20,B=Math.cos(M*.007+p*35e-5+k*.19)*12.4,k===0?s.moveTo(g+R,M+B):s.lineTo(g+R,M+B);s.stroke()}for(k=0;k<=14;k++){for(s.beginPath(),z=0;z<=9;z++)g=k*$,M=z*P,R=Math.sin(g*.009+p*46e-5+z*.28)*20,B=Math.cos(M*.007+p*35e-5+k*.19)*12.4,z===0?s.moveTo(g+R,M+B):s.lineTo(g+R,M+B);s.stroke()}},C=function(){const p=A.length;let d,L,h,$,P,z,k,g;for(d=0;d<p;d++){for(h=A[d],L=d+1;L<p;L++)$=A[L],P=h.x-$.x,z=h.y-$.y,k=P*P+z*z,k<O&&(g=(1-Math.sqrt(k)/_)*.09,s.beginPath(),s.moveTo(h.x,h.y),s.lineTo($.x,$.y),s.strokeStyle=`rgba(74,222,128,${g})`,s.lineWidth=.55,s.stroke());s.beginPath(),s.arc(h.x,h.y,h.sz,0,6.2832),s.fillStyle=`rgba(167,243,208,${h.al})`,s.fill(),h.x+=h.vx,h.y+=h.vy,h.x<-6?h.x=w+6:h.x>w+6&&(h.x=-6),h.y<-6?h.y=y+6:h.y>y+6&&(h.y=-6)}},T=function(p){s.clearRect(0,0,w,y),b(p),D(p),C(),S=requestAnimationFrame(T)},W=function(){s.clearRect(0,0,w,y),I.forEach(p=>{const d=p[2]*Math.max(w,y),L=s.createRadialGradient(p[0]*w,p[1]*y,0,p[0]*w,p[1]*y,d);L.addColorStop(0,`rgba(${p[5]},${p[6]},${p[7]},${p[8]*1.6})`),L.addColorStop(1,`rgba(${p[5]},${p[6]},${p[7]},0)`),s.fillStyle=L,s.fillRect(0,0,w,y)})};const E=document.getElementById("tl-bg-canvas"),s=E.getContext("2d",{alpha:!0});let w,y,F,A,S;const I=[[.14,.22,.42,14e-5,0,34,197,94,.09],[.78,.63,.36,1e-4,2.1,22,163,74,.07],[.48,.85,.31,17e-5,4,74,222,128,.055],[.86,.13,.27,12e-5,1.3,16,185,129,.05],[.24,.76,.24,19e-5,3.4,52,211,153,.045]],_=128,O=_*_,j=()=>{if(S&&cancelAnimationFrame(S),x(),l){W();return}S=requestAnimationFrame(T)};x(),window.addEventListener("resize",j),l?W():S=requestAnimationFrame(T),N.push(()=>{window.removeEventListener("resize",j),S&&cancelAnimationFrame(S)})}return()=>N.forEach(v=>v())},[]),e.jsxs(e.Fragment,{children:[e.jsx("div",{className:"tl-cursor-dot",id:"tl-cursor-dot","aria-hidden":"true"}),e.jsx("div",{className:"tl-cursor-ring",id:"tl-cursor-ring","aria-hidden":"true"}),e.jsx("canvas",{id:"tl-bg-canvas","aria-hidden":"true"}),e.jsx("div",{className:"tl-noise","aria-hidden":"true"}),e.jsx("div",{className:"tl-spotlight",id:"tl-spotlight","aria-hidden":"true"})]})}function Pe({activeUser:i,onSwitch:l}){const[N,v]=m.useState(()=>document.documentElement.getAttribute("data-theme")||"dark"),[x,b]=m.useState(!1),D=()=>{const C=N==="dark"?"light":"dark";document.documentElement.setAttribute("data-theme",C),localStorage.setItem("ailabb_theme",C),v(C)};return m.useEffect(()=>{if(!x)return;const C=()=>b(!1),T=setTimeout(()=>document.addEventListener("click",C),0);return()=>{clearTimeout(T),document.removeEventListener("click",C)}},[x]),e.jsxs("aside",{className:"tl-sidebar","aria-label":"Navigering",children:[e.jsx("a",{href:"../../",className:"s-logo",title:"AI Labb","aria-label":"AI Labb",children:e.jsxs("svg",{fill:"currentColor",xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 623.04 583.35","aria-hidden":"true",children:[e.jsx("path",{d:"M232.17,3c7.02-7.42,19.19.1,15.62,9.67-9.95,26.68-27.78,61.43-58.57,88.15-55.09,47.8-70.9,80.05-80.29,122.79-.83,3.78-4.33,6.37-8.19,6.09l-13.61-.98c-5.61-.4-9.92-5.11-9.82-10.73.52-29.28,13.8-103.04,70.2-141.85C183.44,51.41,212.65,23.65,232.17,3Z"}),e.jsx("path",{d:"M74.3,234.65s-22.36,17.42-24.83,29.76c-1.77,8.84,31.32,11.98,50.2,13.05,6.54.37,11.77-5.35,10.78-11.82-1.08-7.08-2.45-16.17-3.61-24.42-2.35-16.66-32.55-6.56-32.55-6.56Z"}),e.jsx("path",{d:"M51.87,290.51s-38.3,9.33-38.3,64.83,12.33,99.9-13.57,145.54c0,0,96.6-69.22,110.75-161.62,3.8-24.79-9.47-49.48-32.56-59.27-8.67-3.68-14.96,9.96-26.32,10.52Z"}),e.jsxs("text",{className:"logo-cls-1",style:{fontSize:"193.17px",fontFamily:"Montserrat-Bold, Montserrat",fontWeight:700,opacity:.91},transform:"translate(144.86 300.16)",children:[e.jsx("tspan",{x:"0",y:"0",children:"0"}),e.jsx("tspan",{x:"130",y:"0",children:"100"})]}),e.jsxs("text",{className:"logo-cls-2",style:{fontSize:"189.12px",fontFamily:"Montserrat-Bold, Montserrat",fontWeight:700,opacity:.91},transform:"translate(259.2 447.19) scale(1.04 1)",children:[e.jsx("tspan",{x:"0",y:"0",children:"0"}),e.jsx("tspan",{x:"127.28",y:"0",children:"111"})]})]})}),e.jsx("div",{className:"s-sep"}),e.jsx("a",{href:"../../",className:"s-btn",title:"Hem","aria-label":"Hem",children:e.jsxs("svg",{width:"17",height:"17",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"1.75",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("path",{d:"m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"}),e.jsx("polyline",{points:"9 22 9 12 15 12 15 22"})]})}),e.jsx("div",{className:"s-sep"}),e.jsxs("div",{className:"s-apps",children:[e.jsxs("a",{href:"../todo/",className:"s-app-item active",title:"Todo","aria-current":"page",children:[e.jsx("div",{className:"s-bubble ib-todo","aria-hidden":"true",children:e.jsxs("svg",{width:"17",height:"17",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"1.75",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("rect",{width:"18",height:"18",x:"3",y:"3",rx:"2"}),e.jsx("path",{d:"m9 12 2 2 4-4"})]})}),e.jsx("span",{className:"s-icon-label",children:"Todo"})]}),e.jsxs("a",{href:"../kampanj/",className:"s-app-item",title:"Kampanj",children:[e.jsx("div",{className:"s-bubble ib-kampanj","aria-hidden":"true",children:e.jsxs("svg",{width:"17",height:"17",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"1.75",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("circle",{cx:"12",cy:"12",r:"10"}),e.jsx("circle",{cx:"12",cy:"12",r:"6"}),e.jsx("circle",{cx:"12",cy:"12",r:"2"})]})}),e.jsx("span",{className:"s-icon-label",children:"Kampanj"})]}),e.jsxs("a",{href:"../seo-audit/",className:"s-app-item",title:"SEO",children:[e.jsx("div",{className:"s-bubble ib-seo","aria-hidden":"true",children:e.jsxs("svg",{width:"17",height:"17",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"1.75",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("circle",{cx:"11",cy:"11",r:"8"}),e.jsx("path",{d:"m21 21-4.35-4.35"})]})}),e.jsx("span",{className:"s-icon-label",children:"SEO"})]}),e.jsxs("a",{href:"../trackr/",className:"s-app-item",title:"Track3r",children:[e.jsx("div",{className:"s-bubble ib-trackr","aria-hidden":"true",children:e.jsx("svg",{width:"17",height:"17",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"1.75",strokeLinecap:"round",strokeLinejoin:"round",children:e.jsx("polyline",{points:"22 12 18 12 15 21 9 3 6 12 2 12"})})}),e.jsx("span",{className:"s-icon-label",children:"Track3r"})]})]}),e.jsx("div",{className:"s-spacer"}),e.jsx("div",{className:"s-sep"}),e.jsxs("div",{className:"tl-side-user",onClick:C=>C.stopPropagation(),children:[e.jsx("button",{className:"s-btn s-user-btn",onClick:()=>b(C=>!C),title:i,"aria-label":"Användare",children:e.jsx("span",{className:"s-avatar-el",children:i?i[0].toUpperCase():"?"})}),x&&e.jsxs("div",{className:"tl-side-user-pop",children:[e.jsx("div",{className:"tl-side-user-name",children:i}),e.jsxs("button",{onClick:()=>{b(!1),l()},children:[e.jsx(Ce,{size:14}),"Byt användare"]})]})]}),e.jsx("button",{className:"theme-toggle",onClick:D,"aria-label":"Byt tema",title:"Byt tema",children:N==="dark"?e.jsxs("svg",{width:"15",height:"15",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"1.75",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("circle",{cx:"12",cy:"12",r:"4"}),e.jsx("path",{d:"M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"})]}):e.jsx("svg",{width:"15",height:"15",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"1.75",strokeLinecap:"round",strokeLinejoin:"round",children:e.jsx("path",{d:"M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"})})})]})}function ce({value:i,onChange:l,onBlur:N,onKeyDown:v,fontSize:x,fontWeight:b}){return e.jsx("input",{autoFocus:!0,className:"tl-edit-input",value:i,onChange:l,onBlur:N,onKeyDown:v,style:x?{fontSize:x,fontWeight:b}:{}})}function be({project:i,onUpdate:l,onDelete:N,onArchive:v,isArchived:x=!1,showToast:b}){const[D,C]=m.useState(""),[T,W]=m.useState({}),[E,s]=m.useState({}),[w,y]=m.useState(new Set),[F,A]=m.useState(new Set),[S,I]=m.useState(null),[_,O]=m.useState(""),[j,p]=m.useState(x),[d,L]=m.useState(!1),[h,$]=m.useState(!1),[P,z]=m.useState(i.description||""),k=m.useRef(null),g=i.todos||[],M=U(i.deadline),R=i.checkpoint===re.length-1,{done:B,total:Y}=Ie(g),G=()=>Date.now().toString()+Math.random().toString(36).slice(2,6),Z=()=>new Date().toISOString(),X=(t,r)=>{I(t),O(r)},o=()=>{if(!S)return;const t=_.trim();if(!t){I(null);return}if(S==="__name__"){l({name:t}),I(null);return}const r=S.split("/");if(r.length===1)l({todos:g.map(a=>a.id===r[0]?{...a,text:t}:a)});else if(r.length===2){const[a,n]=r;l({todos:g.map(c=>c.id!==a?c:{...c,children:(c.children||[]).map(f=>f.id===n?{...f,text:t}:f)})})}else{const[a,n,c]=r;l({todos:g.map(f=>f.id!==a?f:{...f,children:(f.children||[]).map(V=>V.id!==n?V:{...V,children:(V.children||[]).map(ne=>ne.id===c?{...ne,text:t}:ne)})})})}I(null)},u=t=>{L(!1),t&&l({deadline:t})},H=()=>{$(!1),l({description:P.trim()})},q=()=>{D.trim()&&(l({todos:[...g,{id:G(),text:D.trim(),done:!1,createdAt:Z(),children:[]}]}),C(""))},K=t=>l({todos:g.map(r=>r.id===t?{...r,done:!r.done}:r)}),J=t=>{k.current=g;const r=g.filter(a=>a.id!==t);l({todos:r}),y(a=>{const n=new Set(a);return n.delete(t),n}),b&&b("Todo raderad",()=>l({todos:k.current}))},ee=t=>y(r=>{const a=new Set(r);return a.has(t)?a.delete(t):a.add(t),a}),pe=t=>{const r=(T[t]||"").trim();r&&(l({todos:g.map(a=>a.id!==t?a:{...a,children:[...a.children||[],{id:G(),text:r,done:!1,createdAt:Z(),children:[]}]})}),W(a=>({...a,[t]:""})))},ve=(t,r)=>l({todos:g.map(a=>a.id!==t?a:{...a,children:(a.children||[]).map(n=>n.id===r?{...n,done:!n.done}:n)})}),we=(t,r)=>{k.current=g;const a=g.map(n=>n.id!==t?n:{...n,children:(n.children||[]).filter(c=>c.id!==r)});l({todos:a}),A(n=>{const c=new Set(n);return c.delete(`${t}/${r}`),c}),b&&b("Todo raderad",()=>l({todos:k.current}))},xe=(t,r)=>{const a=`${t}/${r}`;A(n=>{const c=new Set(n);return c.has(a)?c.delete(a):c.add(a),c})},ge=(t,r)=>{const a=`${t}/${r}`,n=(E[a]||"").trim();n&&(l({todos:g.map(c=>c.id!==t?c:{...c,children:(c.children||[]).map(f=>f.id!==r?f:{...f,children:[...f.children||[],{id:G(),text:n,done:!1,createdAt:Z()}]})})}),s(c=>({...c,[a]:""})))},ye=(t,r,a)=>l({todos:g.map(n=>n.id!==t?n:{...n,children:(n.children||[]).map(c=>c.id!==r?c:{...c,children:(c.children||[]).map(f=>f.id===a?{...f,done:!f.done}:f)})})}),ke=(t,r,a)=>{k.current=g;const n=g.map(c=>c.id!==t?c:{...c,children:(c.children||[]).map(f=>f.id!==r?f:{...f,children:(f.children||[]).filter(V=>V.id!==a)})});l({todos:n}),b&&b("Todo raderad",()=>l({todos:k.current}))};let ae="",te="";M<0?(ae="overdue",te=`${Math.abs(M)} d försenad`):M===0?(ae="urgent",te="Idag"):M<=7?(ae="urgent",te=`${M} d kvar`):te=`${M} d kvar`;const je=Y>0?Math.round(B/Y*100):0;return e.jsxs("div",{className:`tl-project ${x?"archived":""}`,children:[e.jsxs("div",{className:"tl-project-header",children:[e.jsx("button",{className:"tl-collapse-btn",onClick:()=>p(t=>!t),"aria-label":j?"Expandera":"Minimera",children:e.jsx(Ee,{size:18,style:{transform:j?"rotate(-90deg)":"rotate(0)",transition:"transform 200ms"}})}),S==="__name__"?e.jsx("input",{autoFocus:!0,className:"tl-project-name-input",value:_,onChange:t=>O(t.target.value),onBlur:o,onKeyDown:t=>{t.key==="Enter"&&o(),t.key==="Escape"&&I(null)}}):e.jsx("h3",{className:"tl-project-name",onClick:()=>X("__name__",i.name),children:i.name}),Y>0&&e.jsxs("span",{className:"tl-todo-counter",children:[B,"/",Y," klara"]}),x&&i.archived_at&&e.jsxs("span",{className:"tl-archived-date",children:["Arkiverad ",Fe(i.archived_at)]}),!x&&(d?e.jsx("input",{autoFocus:!0,type:"date",className:"tl-deadline-input",defaultValue:i.deadline,onBlur:t=>u(t.target.value),onKeyDown:t=>{t.key==="Enter"&&u(t.target.value),t.key==="Escape"&&L(!1)}}):e.jsxs("div",{className:`tl-deadline-badge ${ae}`,style:{cursor:"pointer"},onClick:()=>L(!0),children:[e.jsx(Me,{size:12}),te]})),R&&!x&&e.jsx("button",{className:"tl-archive-btn",onClick:v,children:"Arkivera"}),e.jsx("button",{className:"tl-icon-btn",onClick:N,"aria-label":"Ta bort projekt",children:e.jsx(Le,{size:16})})]}),!j&&!x&&e.jsx("div",{className:"tl-project-desc-row",children:h?e.jsx("input",{autoFocus:!0,className:"tl-desc-input",value:P,placeholder:"Lägg till beskrivning…",onChange:t=>z(t.target.value),onBlur:H,onKeyDown:t=>{t.key==="Enter"&&H(),t.key==="Escape"&&($(!1),z(i.description||""))}}):e.jsx("span",{className:`tl-project-desc ${i.description?"":"empty"}`,onClick:()=>{z(i.description||""),$(!0)},children:i.description||"Lägg till beskrivning…"})}),Y>0&&e.jsx("div",{className:"tl-project-progress-bar",children:e.jsx("div",{className:"tl-project-progress-fill",style:{width:`${je}%`}})}),!j&&e.jsxs(e.Fragment,{children:[e.jsx("div",{className:"tl-progress",children:re.map((t,r)=>{const a=r<=i.checkpoint;return e.jsxs(m.Fragment,{children:[e.jsxs("button",{className:`tl-progress-step ${r===i.checkpoint?"active":""}`,onClick:()=>l({checkpoint:r}),"aria-label":`Sätt status till ${t.label}`,children:[e.jsx("span",{className:"tl-pdot",style:a?{background:t.color,borderColor:t.color}:{}}),e.jsx("span",{className:"tl-plabel",children:t.label})]}),r<re.length-1&&e.jsx("span",{className:"tl-progress-line",style:r<i.checkpoint?{background:t.color}:{}})]},t.key)})}),e.jsxs("div",{className:"tl-todos",children:[g.length===0&&e.jsx("p",{className:"tl-empty-hint",children:"Inga todos ännu."}),g.map(t=>e.jsxs("div",{className:"tl-todo-block",children:[e.jsxs("div",{className:`tl-row l0 ${t.done?"done":""}`,children:[e.jsx("button",{className:`tl-circle-btn ${t.done?"checked":""}`,onClick:()=>K(t.id),"aria-label":"Markera klar",children:t.done&&e.jsx(le,{size:10,strokeWidth:3})}),S===t.id?e.jsx(ce,{value:_,onChange:r=>O(r.target.value),onBlur:o,onKeyDown:r=>{r.key==="Enter"&&o(),r.key==="Escape"&&I(null)}}):e.jsx("span",{className:"tl-row-text",onClick:()=>X(t.id,t.text),children:t.text}),e.jsx("button",{className:`tl-add-child-btn ${w.has(t.id)?"open":""}`,onClick:()=>ee(t.id),title:"Lägg till sub-todo",children:e.jsx(Q,{size:11,strokeWidth:2.5})}),e.jsx("button",{className:"tl-icon-btn",onClick:()=>J(t.id),"aria-label":"Ta bort",children:e.jsx(ie,{size:14})})]}),((t.children||[]).length>0||w.has(t.id))&&e.jsxs("div",{className:"tl-children",children:[(t.children||[]).map(r=>{const a=`${t.id}/${r.id}`;return e.jsxs("div",{className:"tl-todo-block",children:[e.jsxs("div",{className:`tl-row l1 ${r.done?"done":""}`,children:[e.jsx("button",{className:`tl-circle-btn sm ${r.done?"checked":""}`,onClick:()=>ve(t.id,r.id),"aria-label":"Markera klar",children:r.done&&e.jsx(le,{size:8,strokeWidth:3})}),S===a?e.jsx(ce,{value:_,onChange:n=>O(n.target.value),onBlur:o,onKeyDown:n=>{n.key==="Enter"&&o(),n.key==="Escape"&&I(null)}}):e.jsx("span",{className:"tl-row-text",onClick:()=>X(a,r.text),children:r.text}),e.jsx("button",{className:`tl-add-child-btn sm ${F.has(a)?"open":""}`,onClick:()=>xe(t.id,r.id),title:"Lägg till sub-sub-todo",children:e.jsx(Q,{size:10,strokeWidth:2.5})}),e.jsx("button",{className:"tl-icon-btn",onClick:()=>we(t.id,r.id),"aria-label":"Ta bort",children:e.jsx(ie,{size:13})})]}),((r.children||[]).length>0||F.has(a))&&e.jsxs("div",{className:"tl-children sub",children:[(r.children||[]).map(n=>{const c=`${t.id}/${r.id}/${n.id}`;return e.jsxs("div",{className:`tl-row l2 ${n.done?"done":""}`,children:[e.jsx("button",{className:`tl-circle-btn sm ${n.done?"checked":""}`,onClick:()=>ye(t.id,r.id,n.id),"aria-label":"Markera klar",children:n.done&&e.jsx(le,{size:8,strokeWidth:3})}),S===c?e.jsx(ce,{value:_,onChange:f=>O(f.target.value),onBlur:o,onKeyDown:f=>{f.key==="Enter"&&o(),f.key==="Escape"&&I(null)}}):e.jsx("span",{className:"tl-row-text",onClick:()=>X(c,n.text),children:n.text}),e.jsx("button",{className:"tl-icon-btn",onClick:()=>ke(t.id,r.id,n.id),"aria-label":"Ta bort",children:e.jsx(ie,{size:12})})]},n.id)}),F.has(a)&&e.jsxs("div",{className:"tl-inline-add",children:[e.jsx("input",{autoFocus:!0,type:"text",placeholder:"Sub-sub-todo…",value:E[a]||"",onChange:n=>s(c=>({...c,[a]:n.target.value})),onKeyDown:n=>{n.key==="Enter"&&ge(t.id,r.id),n.key==="Escape"&&xe(t.id,r.id)}}),e.jsx("button",{onClick:()=>ge(t.id,r.id),disabled:!(E[a]||"").trim(),children:e.jsx(Q,{size:12})})]})]})]},r.id)}),w.has(t.id)&&e.jsxs("div",{className:"tl-inline-add",children:[e.jsx("input",{autoFocus:!0,type:"text",placeholder:"Sub-todo…",value:T[t.id]||"",onChange:r=>W(a=>({...a,[t.id]:r.target.value})),onKeyDown:r=>{r.key==="Enter"&&pe(t.id),r.key==="Escape"&&ee(t.id)}}),e.jsx("button",{onClick:()=>pe(t.id),disabled:!(T[t.id]||"").trim(),children:e.jsx(Q,{size:12})})]})]})]},t.id)),e.jsxs("div",{className:"tl-add-note",children:[e.jsx("input",{type:"text",placeholder:"Lägg till todo…",value:D,onChange:t=>C(t.target.value),onKeyDown:t=>t.key==="Enter"&&q()}),e.jsxs("button",{onClick:q,disabled:!D.trim(),children:[e.jsx(Q,{size:14,strokeWidth:2.5}),"Lägg till"]})]})]})]})]})}function _e(){const[i,l]=m.useState(null),[N,v]=m.useState(null),[x,b]=m.useState([]),[D,C]=m.useState(!0),[T,W]=m.useState(null),E=m.useRef(null),s=m.useRef({}),[w,y]=m.useState(!1),[F,A]=m.useState(""),[S,I]=m.useState(0),[_,O]=m.useState(he()),j=(o,u)=>{E.current&&clearTimeout(E.current),W({msg:o,undoFn:u||null}),E.current=setTimeout(()=>W(null),4e3)},p=()=>{E.current&&clearTimeout(E.current),W(null)};m.useEffect(()=>{async function o(){let u=null;try{u=JSON.parse(localStorage.getItem("ailabb_active_user"))}catch{}if(!u){window.location.replace("../../");return}l(u);const H=localStorage.getItem(se),q=localStorage.getItem(de);let K;if(H&&q===u)K=H;else{const ee=await Te(u);if(!ee){window.location.replace("../../");return}K=ee.id,localStorage.setItem(se,K),localStorage.setItem(de,u)}v(K);const J=await $e(K);b(J),C(!1)}o()},[]);const d=()=>{localStorage.removeItem("ailabb_active_user"),localStorage.removeItem(se),localStorage.removeItem(de),window.location.replace("../../")},L=()=>{A(""),I(0),O(he())},h=async()=>{if(!F.trim())return;const o={id:Date.now().toString(),profile_id:N,name:F.trim(),checkpoint:S,deadline:_,description:"",todos:[],created_at:new Date().toISOString()};b(u=>[o,...u]),L(),y(!1);try{await ue(o)}catch{j("Kunde inte spara ändringarna")}},$=(o,u)=>{const H=x.find(K=>K.id===o);if(!H)return;let q={...H,...u};u.checkpoint!==void 0&&u.checkpoint<re.length-1&&q.archived&&(q={...q,archived:!1,archived_at:null}),b(K=>K.map(J=>J.id===o?q:J)),s.current[o]&&clearTimeout(s.current[o]),s.current[o]=setTimeout(async()=>{try{await ue({...q,profile_id:N})}catch{j("Kunde inte spara ändringarna")}},800)},P=o=>$(o,{archived:!0,archived_at:new Date().toISOString()}),z=async o=>{window.confirm("Ta bort projektet?")&&(b(u=>u.filter(H=>H.id!==o)),await De(o))},k=x.filter(o=>!o.archived),g=k.filter(o=>U(o.deadline)<0),M=k.filter(o=>{const u=U(o.deadline);return u>=0&&u<=7}),R=k.filter(o=>U(o.deadline)>7),B=[...g,...M,...R],Y=x.filter(o=>o.archived).sort((o,u)=>new Date(u.archived_at||0)-new Date(o.archived_at||0)),G=g.length,Z=M.filter(o=>U(o.deadline)===0).length,X=M.filter(o=>U(o.deadline)>0).length+R.length;return D?e.jsxs(e.Fragment,{children:[e.jsx(fe,{}),e.jsx(me,{}),e.jsx("div",{className:"tl-fullscreen-loader",children:"Laddar…"})]}):e.jsxs(e.Fragment,{children:[e.jsx(fe,{}),e.jsx(me,{}),e.jsx(Pe,{activeUser:i,onSwitch:d}),e.jsxs("div",{className:"tl-app-root",children:[e.jsxs("section",{className:"tl-hero",children:[e.jsxs("h1",{children:["Hej ",i,", redo att ",e.jsx("span",{className:"hand",children:"labba?"})]}),e.jsx("p",{children:"Liten plats för att hålla koll på pågående experiment. Skapa ett projekt, sätt en deadline och samla anteckningar längs vägen."})]}),w?e.jsxs("div",{className:"tl-form-card",children:[e.jsx("h2",{children:"Nytt projekt"}),e.jsxs("div",{className:"tl-field",children:[e.jsx("label",{className:"tl-field-label",children:"Projektnamn"}),e.jsx("input",{type:"text",placeholder:"t.ex. Bygg AI-labbet",value:F,onChange:o=>A(o.target.value),onKeyDown:o=>o.key==="Enter"&&h(),autoFocus:!0})]}),e.jsxs("div",{className:"tl-field",children:[e.jsx("label",{className:"tl-field-label",children:"Status"}),e.jsx("div",{className:"tl-checkpoints",children:re.map((o,u)=>e.jsxs("button",{type:"button",className:`tl-cp-pill ${S===u?"active":""}`,onClick:()=>I(u),style:S===u?{borderColor:o.color,background:`${o.color}20`}:{},children:[e.jsx("span",{className:"tl-dot",style:{background:o.color}}),o.label]},o.key))})]}),e.jsxs("div",{className:"tl-field",children:[e.jsx("label",{className:"tl-field-label",children:"Deadline"}),e.jsx("input",{type:"date",value:_,onChange:o=>O(o.target.value)})]}),e.jsxs("div",{className:"tl-form-actions",children:[e.jsx("button",{className:"tl-btn-primary",onClick:h,disabled:!F.trim(),children:"Skapa projekt"}),e.jsx("button",{className:"tl-btn-ghost",onClick:()=>{L(),y(!1)},children:"Avbryt"})]})]}):e.jsxs("button",{className:"tl-new-btn",onClick:()=>y(!0),children:[e.jsx(Q,{size:18,strokeWidth:2.5}),"Nytt projekt"]}),e.jsxs("section",{style:{marginTop:28},children:[B.length>0&&e.jsxs("div",{className:"tl-summary-bar",children:[G>0&&e.jsxs("span",{children:[G," försenade"]}),Z>0&&e.jsxs("span",{children:[Z," idag"]}),X>0&&e.jsxs("span",{children:[X," pågående"]})]}),B.length===0&&Y.length===0?e.jsxs("div",{className:"tl-empty-state",children:[e.jsx("h3",{children:"Inga projekt ännu"}),e.jsx("p",{children:"Skapa ditt första projekt för att komma igång."})]}):B.length===0?e.jsxs("div",{className:"tl-empty-state",children:[e.jsx("h3",{children:"Inga aktiva projekt"}),e.jsx("p",{children:"Alla projekt är arkiverade. Skapa ett nytt eller återställ ett nedan."})]}):B.map(o=>e.jsx(be,{project:o,onUpdate:u=>$(o.id,u),onDelete:()=>z(o.id),onArchive:()=>P(o.id),showToast:j},o.id))]}),Y.length>0&&e.jsxs("section",{className:"tl-archive-section",children:[e.jsx("h2",{className:"tl-archive-heading",children:"Arkiverade projekt"}),Y.map(o=>e.jsx(be,{project:o,isArchived:!0,onUpdate:u=>$(o.id,u),onDelete:()=>z(o.id),onArchive:()=>P(o.id),showToast:j},o.id))]})]}),T&&e.jsxs("div",{className:"tl-toast",children:[e.jsx("span",{children:T.msg}),T.undoFn&&e.jsx("button",{className:"tl-toast-undo",onClick:()=>{T.undoFn(),p()},children:"Ångra"})]})]})}function fe(){return e.jsx("style",{children:`
      /* ── Green theme tokens ── */
      :root {
        --tl-green:        #4ADE80;
        --tl-green-hover:  #86EFAC;
        --tl-green-dim:    #22c55e;
        --tl-green-bg:     rgba(34,197,94,0.12);
        --tl-green-bg2:    rgba(34,197,94,0.06);
        --tl-green-border: rgba(74,222,128,0.26);
        --tl-green-glow:   0 0 0 1px rgba(74,222,128,0.22), 0 8px 32px rgba(34,197,94,0.12);
        --tl-green-text:   #16a34a;
      }
      [data-theme="light"] {
        --tl-green:        #16a34a;
        --tl-green-hover:  #15803d;
        --tl-green-dim:    #22c55e;
        --tl-green-bg:     rgba(22,163,74,0.10);
        --tl-green-bg2:    rgba(22,163,74,0.05);
        --tl-green-border: rgba(22,163,74,0.28);
        --tl-green-glow:   0 0 0 1px rgba(22,163,74,0.20), 0 8px 32px rgba(22,163,74,0.10);
        --tl-green-text:   #15803d;
      }

      /* ── Subtle green ambient on the page bg ── */
      body {
        background-image: radial-gradient(ellipse 80% 50% at 20% -10%, rgba(34,197,94,0.07) 0%, transparent 60%);
      }

      /* ───────────────────────────────────────────────
         Hamilton FX — custom cursor, canvas, sidebar (green)
         ─────────────────────────────────────────────── */

      /* Custom cursor */
      @media (pointer: fine) { *, *::before, *::after { cursor: none !important; } }
      .tl-cursor-dot {
        position: fixed; width: 8px; height: 8px; left: 0; top: 0;
        background: #fff;
        box-shadow: 0 0 0 1px rgba(34,197,94,0.6), 0 0 12px rgba(74,222,128,0.7);
        border-radius: 50%; pointer-events: none; z-index: 9999;
        transform: translate(-50%,-50%); opacity: 0;
        transition: width 200ms var(--ease-spring), height 200ms var(--ease-spring),
                    box-shadow 200ms var(--ease-out), opacity 350ms var(--ease-out);
      }
      .tl-cursor-ring {
        position: fixed; width: 32px; height: 32px; left: 0; top: 0;
        border: 1.5px solid rgba(74,222,128,0.45); border-radius: 50%;
        pointer-events: none; z-index: 9998; transform: translate(-50%,-50%); opacity: 0;
        transition: width 300ms var(--ease-out), height 300ms var(--ease-out),
                    border-color 300ms var(--ease-out), opacity 350ms var(--ease-out);
      }
      .tl-cursor-dot.visible,  .tl-cursor-ring.visible { opacity: 1; }
      .tl-cursor-dot.hovering  { width: 11px; height: 11px; box-shadow: 0 0 0 1px rgba(34,197,94,0.85), 0 0 18px rgba(74,222,128,0.8); }
      .tl-cursor-ring.hovering { width: 46px; height: 46px; border-color: rgba(74,222,128,0.7); }
      .tl-cursor-dot.clicking  { width: 5px; height: 5px; }
      .tl-cursor-ring.clicking { width: 20px; height: 20px; }
      @media (pointer: coarse) { .tl-cursor-dot, .tl-cursor-ring { display: none; } }

      /* Background canvas + texture */
      #tl-bg-canvas { position: fixed; inset: 0; z-index: 0; pointer-events: none; display: block; }
      .tl-noise {
        position: fixed; inset: 0; z-index: 1; pointer-events: none; opacity: 0.028;
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E");
        background-repeat: repeat; background-size: 200px 200px;
      }
      .tl-spotlight {
        pointer-events: none; position: fixed; inset: 0; z-index: 2; opacity: 0;
        background: radial-gradient(700px circle at var(--mx,50%) var(--my,50%), rgba(34,197,94,0.05) 0%, transparent 65%);
        transition: opacity 600ms var(--ease-out);
      }
      .tl-spotlight.visible { opacity: 1; }

      /* Sidebar pill */
      .tl-sidebar {
        position: fixed; left: 20px; top: 20px;
        width: 72px; border-radius: 9999px;
        background: color-mix(in oklch, var(--color-surface) 88%, transparent);
        backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
        border: 1px solid var(--color-border);
        box-shadow: 0 4px 24px rgba(0,0,0,0.18), 0 1px 4px rgba(0,0,0,0.1);
        display: flex; flex-direction: column; align-items: center;
        gap: 4px; padding: 14px 0; z-index: 100;
        animation: tl-side-in 450ms var(--ease-out) both;
      }
      @keyframes tl-side-in { from { opacity: 0; } to { opacity: 1; } }

      .s-logo {
        display: flex; align-items: center; justify-content: center;
        width: 42px; height: 38px; flex-shrink: 0; margin-bottom: 2px;
        color: var(--color-text); text-decoration: none; border: 0;
        transition: filter var(--dur-base) var(--ease-out);
      }
      .s-logo:hover { filter: drop-shadow(0 0 10px rgba(74,222,128,0.55)); }
      .s-logo svg { height: 26px; width: auto; }

      .s-btn {
        width: 40px; height: 40px; border-radius: 50%;
        display: flex; align-items: center; justify-content: center;
        cursor: pointer; color: var(--color-text-muted);
        background: transparent; border: 0; outline: none; text-decoration: none;
        flex-shrink: 0; position: relative;
        transition: background 180ms var(--ease-out), color 180ms var(--ease-out);
      }
      .s-btn:hover { background: var(--color-surface-2); color: var(--color-text); }
      .s-btn:focus-visible { box-shadow: 0 0 0 2px var(--tl-green); }

      .s-sep { width: 28px; height: 1px; background: var(--color-border); margin: 5px 0; flex-shrink: 0; }
      .s-spacer { flex: 1; min-height: 4px; }

      .s-apps { display: flex; flex-direction: column; align-items: center; gap: 8px; width: 100%; padding: 0 4px; box-sizing: border-box; }
      .s-app-item {
        display: flex; flex-direction: column; align-items: center; gap: 5px;
        text-decoration: none; color: inherit; border: 0; outline: none; cursor: pointer;
        width: 60px; border-radius: 10px; padding: 7px 0 6px; flex-shrink: 0;
        transition: background 180ms var(--ease-out);
      }
      .s-app-item:hover { background: var(--color-surface-2); }
      .s-app-item:focus-visible { box-shadow: 0 0 0 2px var(--tl-green); }
      .s-bubble {
        width: 38px; height: 38px; border-radius: 11px;
        display: flex; align-items: center; justify-content: center; flex-shrink: 0;
        transition: transform 220ms var(--ease-spring), box-shadow 200ms var(--ease-out);
      }
      .s-app-item:hover .s-bubble { transform: scale(1.1) translateY(-2px); box-shadow: 0 5px 14px rgba(0,0,0,0.22); }
      .ib-home    { background: linear-gradient(135deg,rgba(255,88,45,.22),rgba(255,120,55,.32));   border: 1px solid rgba(255,88,45,.42);   color: #FF7040; }
      .ib-todo    { background: linear-gradient(135deg,rgba(34,197,94,.15),rgba(22,163,74,.25));    border: 1px solid rgba(34,197,94,.26);   color: #4ADE80; }
      .ib-kampanj { background: linear-gradient(135deg,rgba(245,158,11,.15),rgba(251,191,36,.22));  border: 1px solid rgba(245,158,11,.30);  color: #FCD34D; }
      .ib-seo     { background: linear-gradient(135deg,rgba(99,102,241,.15),rgba(129,140,248,.23)); border: 1px solid rgba(99,102,241,.28);  color: #A5B4FC; }
      .ib-trackr  { background: linear-gradient(135deg,rgba(236,72,153,.14),rgba(219,39,119,.23));  border: 1px solid rgba(236,72,153,.28);  color: #F472B6; }
      .s-app-item.active .s-bubble { box-shadow: 0 0 0 1.5px rgba(74,222,128,0.6), 0 0 14px rgba(74,222,128,0.3); }
      .s-app-item.active .s-icon-label { color: var(--tl-green); font-weight: 600; }
      .s-icon-label {
        font-size: 10px; font-family: var(--font-display); font-weight: 500;
        color: var(--color-text-faint); text-align: center; line-height: 1;
        transition: color 150ms var(--ease-out);
      }
      .s-app-item:hover .s-icon-label { color: var(--color-text-muted); }

      .s-user-btn { padding: 0; }
      .s-avatar-el {
        width: 34px; height: 34px; border-radius: 50%;
        background: linear-gradient(135deg, var(--tl-green-dim), var(--tl-green));
        color: #0f172a; font-size: 14px; font-weight: 700;
        display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0;
        box-shadow: 0 0 0 2px rgba(74,222,128,0.25);
      }
      .tl-side-user { position: relative; }
      .tl-side-user-pop {
        position: absolute; left: calc(100% + 12px); bottom: 0; min-width: 180px;
        background: var(--color-surface); border: 1px solid var(--color-border);
        border-radius: 10px; padding: 6px;
        box-shadow: 0 8px 24px rgba(0,0,0,0.18), 0 2px 6px rgba(0,0,0,0.08); z-index: 120;
        animation: tl-side-in 160ms var(--ease-out) both;
      }
      .tl-side-user-name {
        font-size: 11px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase;
        color: var(--color-text-faint); padding: 6px 10px 8px;
      }
      .tl-side-user-pop button {
        display: flex; align-items: center; gap: 10px; width: 100%;
        padding: 9px 10px; background: transparent; border: 0; border-radius: 6px;
        color: var(--color-text-muted); font-family: inherit; font-size: 13px; font-weight: 500;
        cursor: pointer; text-align: left; transition: background 150ms, color 150ms;
      }
      .tl-side-user-pop button:hover { background: var(--tl-green-bg2); color: var(--tl-green); }

      .theme-toggle {
        background: transparent; border: 0; color: var(--color-text-muted);
        padding: 0; border-radius: 50%; cursor: pointer;
        display: flex; align-items: center; justify-content: center;
        width: 40px; height: 40px; flex-shrink: 0;
        transition: color var(--dur-fast) var(--ease-out), background var(--dur-fast) var(--ease-out), transform 300ms var(--ease-spring);
      }
      .theme-toggle:hover { color: var(--color-text); background: var(--color-surface-2); transform: rotate(18deg) scale(1.1); }
      .theme-toggle:active { transform: rotate(36deg) scale(0.9); }

      .tl-app-root, .tl-welcome-root {
        min-height: 100vh;
        color: var(--color-text);
        font-family: var(--font-body, "Montserrat", sans-serif);
        -webkit-font-smoothing: antialiased;
        position: relative; z-index: 10;
      }
      .tl-app-root { max-width: 960px; margin: 0 auto; padding: 48px 32px 110px; }
      .tl-welcome-root { max-width: 640px; margin: 0 auto; padding: 32px 24px 96px; display: flex; flex-direction: column; }
      /* Clear the fixed sidebar when the centered margin is too narrow for it */
      @media (max-width: 1184px) { .tl-app-root { margin-left: 116px; margin-right: auto; } }
      .tl-welcome-root { max-width: 640px; padding: 32px 24px 96px; display: flex; flex-direction: column; }

      .tl-fullscreen-loader {
        min-height: 100vh; display: flex; align-items: center; justify-content: center;
        color: var(--color-text-faint); font-size: 15px;
        font-family: var(--font-body, "Montserrat", sans-serif);
      }
      .tl-loading { color: var(--color-text-faint); font-size: 13px; margin: 0; }

      /* ── Nav ── */
      .tl-top-nav { display: flex; justify-content: space-between; align-items: center; margin-bottom: 56px; gap: 16px; }
      .tl-nav-right { display: flex; align-items: center; gap: 32px; }
      .tl-logo { display: inline-flex; align-items: center; height: 36px; color: var(--color-text); text-decoration: none; transition: opacity 200ms; border: 0; }
      .tl-logo:hover { opacity: 0.85; }
      .tl-logo svg { height: 100%; width: auto; }
      .tl-menu { display: flex; gap: 32px; list-style: none; margin: 0; padding: 0; }
      .tl-menu a { font-size: 14px; font-weight: 500; color: var(--color-text-muted); text-decoration: none; transition: color 200ms; position: relative; border: 0; }
      .tl-menu a:hover, .tl-menu a.active { color: var(--color-text); }
      .tl-menu a.active::after {
        content: ''; position: absolute; left: 0; right: 0; bottom: -6px;
        height: 2px; background: var(--tl-green); border-radius: 2px;
      }
      .tl-has-dropdown { position: relative; }
      .tl-has-dropdown > a { display: inline-flex; align-items: center; gap: 6px; }
      .tl-chev { font-size: 9px; line-height: 1; transition: transform 200ms; }
      .tl-has-dropdown:hover .tl-chev,
      .tl-has-dropdown:focus-within .tl-chev { transform: rotate(180deg); }
      .tl-dropdown {
        position: absolute; top: calc(100% + 10px); right: 0; min-width: 180px;
        list-style: none; margin: 0; padding: 6px;
        background: var(--color-surface); border: 1px solid var(--color-border);
        border-radius: 10px; box-shadow: 0 16px 48px rgba(0,0,0,0.12), 0 4px 12px rgba(0,0,0,0.06);
        opacity: 0; visibility: hidden; transform: translateY(-4px);
        transition: opacity 200ms, visibility 200ms, transform 200ms; z-index: 20;
      }
      .tl-dropdown::before { content: ''; position: absolute; top: -10px; left: 0; right: 0; height: 10px; }
      .tl-has-dropdown:hover .tl-dropdown,
      .tl-has-dropdown:focus-within .tl-dropdown { opacity: 1; visibility: visible; transform: translateY(0); }
      .tl-dropdown li { display: block; }
      .tl-dropdown a {
        display: block; padding: 8px 12px; border-radius: 6px;
        font-size: 14px; font-weight: 500; color: var(--color-text-muted); border: 0;
        transition: background 150ms, color 150ms;
      }
      .tl-dropdown a:hover { background: var(--color-surface-2); color: var(--color-text); }
      .tl-dropdown a.active { color: var(--tl-green); }
      .tl-dropdown a::after { display: none; }

      /* ── User chip ── */
      .tl-user-menu { position: relative; }
      .tl-user-chip {
        display: inline-flex; align-items: center; gap: 8px;
        padding: 5px 12px 5px 5px; border-radius: 999px;
        border: 1px solid var(--tl-green-border); background: var(--tl-green-bg2);
        color: var(--color-text); font-family: inherit;
        font-size: 13px; font-weight: 500; cursor: pointer; transition: all 200ms;
      }
      .tl-user-chip:hover { border-color: var(--tl-green); background: var(--tl-green-bg); }
      .tl-user-chip .tl-user-name { white-space: nowrap; max-width: 140px; overflow: hidden; text-overflow: ellipsis; }
      .tl-avatar {
        width: 26px; height: 26px; border-radius: 50%;
        background: linear-gradient(135deg, rgba(34,197,94,.22), rgba(22,163,74,.36));
        border: 1px solid var(--tl-green-border);
        color: var(--tl-green);
        font-size: 12px; font-weight: 700;
        display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0;
      }
      .tl-user-chip .tl-avatar { width: 22px; height: 22px; font-size: 11px; }
      .tl-user-dropdown {
        position: absolute; top: calc(100% + 8px); right: 0; min-width: 180px;
        background: var(--color-surface); border: 1px solid var(--color-border);
        border-radius: 10px; padding: 6px;
        box-shadow: 0 8px 24px rgba(0,0,0,0.12), 0 2px 6px rgba(0,0,0,0.06); z-index: 20;
      }
      .tl-user-dropdown button {
        display: flex; align-items: center; gap: 10px; width: 100%;
        padding: 9px 12px; background: transparent; border: 0;
        border-radius: 6px; color: var(--color-text-muted);
        font-family: inherit; font-size: 13px; font-weight: 500;
        cursor: pointer; text-align: left; transition: all 200ms;
      }
      .tl-user-dropdown button:hover { background: var(--color-surface-2); color: var(--color-text); }

      /* ── Hero ── */
      .tl-hero { margin-bottom: 36px; }
      .tl-hero h1 { font-size: clamp(32px, 4.5vw, 52px); font-weight: 800; line-height: 1.05; letter-spacing: -0.03em; margin: 0 0 14px; }
      .tl-hero h1 .hand {
        font-family: var(--font-hand, "Patrick Hand", cursive);
        color: var(--tl-green); font-weight: 400;
        display: inline-block; transform: rotate(-2deg);
        text-shadow: 0 0 32px rgba(74,222,128,0.35);
      }
      .tl-hero p { color: var(--color-text-muted); font-size: 17px; line-height: 1.6; margin: 0; max-width: 60ch; }

      /* ── Primary buttons ── */
      .tl-new-btn, .tl-btn-primary {
        background: var(--tl-green-bg); color: var(--tl-green);
        border: 1px solid var(--tl-green-border);
        font-family: inherit; font-weight: 600; font-size: 14px;
        cursor: pointer; transition: all 200ms;
        display: inline-flex; align-items: center; gap: 8px;
        box-shadow: var(--tl-green-glow);
      }
      .tl-new-btn { padding: 12px 20px; border-radius: 10px; }
      .tl-btn-primary { padding: 11px 22px; border-radius: 10px; }
      .tl-new-btn:hover, .tl-btn-primary:hover {
        background: var(--tl-green-bg); border-color: var(--tl-green);
        box-shadow: 0 0 0 1px rgba(74,222,128,0.45), 0 12px 40px rgba(34,197,94,0.18);
        transform: translateY(-1px);
      }
      .tl-new-btn:active { transform: scale(0.98); }
      .tl-btn-primary:disabled { background: var(--color-surface-3); color: var(--color-text-faint); border-color: transparent; box-shadow: none; cursor: not-allowed; transform: none; }
      .tl-btn-ghost {
        background: transparent; color: var(--color-text-muted); border: 0;
        padding: 11px 14px; border-radius: 10px; font-family: inherit;
        font-weight: 500; font-size: 14px; cursor: pointer; transition: color 200ms;
      }
      .tl-btn-ghost:hover { color: var(--color-text); }

      /* ── Form card ── */
      .tl-form-card {
        background: var(--color-surface);
        border: 1px solid var(--tl-green-border);
        border-radius: 16px; padding: 28px; margin: 8px 0 32px;
        box-shadow: var(--tl-green-glow);
      }
      .tl-form-card h2 { font-size: 20px; font-weight: 700; margin: 0 0 20px; }
      .tl-field { margin-bottom: 20px; }
      .tl-field-label { font-size: 11px; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; color: var(--color-text-muted); margin-bottom: 8px; display: block; }

      .tl-app-root input[type="text"],
      .tl-app-root input[type="date"],
      .tl-welcome-root input[type="text"] {
        background: var(--color-surface-2); border: 1px solid var(--color-border);
        color: var(--color-text); font-family: inherit; font-size: 16px;
        padding: 11px 14px; border-radius: 10px; width: 100%;
        outline: none; transition: border-color 200ms, box-shadow 200ms; box-sizing: border-box;
      }
      .tl-app-root input[type="text"]:focus,
      .tl-app-root input[type="date"]:focus,
      .tl-welcome-root input[type="text"]:focus {
        border-color: var(--tl-green);
        box-shadow: 0 0 0 3px rgba(74,222,128,0.12);
      }
      .tl-app-root input[type="date"] { color-scheme: light dark; }
      .tl-app-root ::placeholder, .tl-welcome-root ::placeholder { color: var(--color-text-faint); }

      .tl-checkpoints { display: flex; gap: 8px; flex-wrap: wrap; }
      .tl-cp-pill {
        display: inline-flex; align-items: center; gap: 8px;
        padding: 8px 14px; border-radius: 999px;
        border: 1px solid var(--color-border); background: var(--color-surface-2);
        font-family: inherit; font-size: 13px; font-weight: 500;
        color: var(--color-text-muted); cursor: pointer; transition: all 200ms;
      }
      .tl-cp-pill .tl-dot { width: 9px; height: 9px; border-radius: 50%; flex-shrink: 0; }
      .tl-cp-pill:hover { color: var(--color-text); border-color: var(--color-border-strong); }
      .tl-cp-pill.active { color: var(--color-text); box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
      .tl-form-actions { display: flex; gap: 12px; align-items: center; margin-top: 8px; }

      /* ── Summary bar ── */
      .tl-summary-bar {
        font-size: 13px; color: var(--color-text-muted); margin-bottom: 12px;
        display: flex; gap: 12px; flex-wrap: wrap;
      }
      .tl-summary-bar span::after { content: ' ·'; }
      .tl-summary-bar span:last-child::after { content: ''; }

      /* ── Project cards — glass morphism style ── */
      .tl-project {
        background: color-mix(in srgb, var(--color-surface) 90%, transparent);
        border: 1px solid var(--color-border);
        border-radius: 16px; margin-bottom: 16px; overflow: hidden;
        transition: border-color 200ms, box-shadow 200ms;
        backdrop-filter: blur(8px);
      }
      .tl-project:hover {
        border-color: var(--tl-green-border);
        box-shadow: var(--tl-green-glow);
      }
      .tl-project.archived { background: var(--color-surface-2); border-color: var(--color-border); }
      .tl-project.archived:hover { border-color: var(--color-border-strong); box-shadow: none; }
      .tl-project.archived .tl-project-name { opacity: 0.85; }
      .tl-project-header { padding: 20px 24px 12px; display: flex; align-items: center; gap: 12px; }
      .tl-collapse-btn {
        background: transparent; border: 0; color: var(--color-text-faint);
        padding: 2px; margin-left: -4px; border-radius: 6px; cursor: pointer;
        display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0;
        transition: color 200ms, background 200ms;
      }
      .tl-collapse-btn:hover { color: var(--tl-green); background: var(--tl-green-bg2); }
      .tl-archive-btn {
        background: transparent; border: 1px solid var(--color-border-strong);
        color: var(--color-text-muted); padding: 6px 14px; border-radius: 999px;
        font-family: inherit; font-size: 12px; font-weight: 600; cursor: pointer;
        white-space: nowrap; transition: all 200ms;
      }
      .tl-archive-btn:hover { background: var(--tl-green-bg); border-color: var(--tl-green-border); color: var(--tl-green); }
      .tl-archived-date { font-size: 12px; font-weight: 500; color: var(--color-text-faint); white-space: nowrap; }
      .tl-archive-section { margin-top: 48px; }
      .tl-archive-heading {
        font-size: 13px; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase;
        color: var(--color-text-faint); margin: 0 0 16px; padding-bottom: 12px;
        border-bottom: 1px solid var(--color-border);
      }
      .tl-project-name { font-size: 22px; font-weight: 700; margin: 0; flex: 1; word-break: break-word; cursor: text; border-radius: 6px; padding: 2px 4px; margin-left: -4px; transition: background 150ms; }
      .tl-project-name:hover { background: var(--tl-green-bg2); }
      .tl-project-name-input { flex: 1; font-size: 22px; font-weight: 700; background: var(--color-surface); border: 1px solid var(--tl-green); border-radius: 8px; padding: 2px 8px; outline: none; margin-left: -4px; color: var(--color-text); font-family: inherit; width: 0; box-shadow: 0 0 0 3px rgba(74,222,128,0.12); }
      .tl-deadline-badge {
        display: inline-flex; align-items: center; gap: 6px;
        font-size: 12px; font-weight: 500; color: var(--color-text-muted);
        padding: 5px 10px; border-radius: 999px;
        background: var(--color-surface-2); border: 1px solid var(--color-border); white-space: nowrap;
        transition: all 200ms; cursor: pointer;
      }
      .tl-deadline-badge:hover { border-color: var(--tl-green-border); color: var(--tl-green); }
      .tl-deadline-badge.urgent { color: var(--color-warn); border-color: rgba(224,169,59,0.3); }
      .tl-deadline-badge.overdue { background: rgba(214,59,59,0.10); color: #f87171; border-color: rgba(248,113,113,0.35); }
      .tl-deadline-input {
        font-size: 12px; font-weight: 500; color: var(--color-text);
        padding: 4px 8px; border-radius: 999px; border: 1px solid var(--tl-green);
        background: var(--color-surface); font-family: inherit; outline: none;
        width: auto; white-space: nowrap; box-sizing: border-box;
        box-shadow: 0 0 0 3px rgba(74,222,128,0.12);
      }
      .tl-todo-counter {
        font-size: 12px; font-weight: 500; color: var(--color-text-faint);
        white-space: nowrap; flex-shrink: 0;
      }

      .tl-project-desc-row { padding: 0 24px 8px 52px; }
      .tl-project-desc {
        font-size: 13px; color: var(--color-text-muted); cursor: text;
        border-radius: 4px; padding: 2px 4px; display: inline-block;
        transition: background 150ms;
      }
      .tl-project-desc.empty { color: var(--color-text-faint); opacity: 0; transition: opacity 150ms; }
      .tl-project-desc-row:hover .tl-project-desc.empty { opacity: 1; }
      .tl-desc-input {
        font-size: 13px; color: var(--color-text); font-family: inherit;
        background: var(--color-surface); border: 1px solid var(--tl-green);
        border-radius: 6px; padding: 3px 8px; outline: none;
        width: 100%; box-sizing: border-box;
        box-shadow: 0 0 0 3px rgba(74,222,128,0.10);
      }

      /* ── Progress bar — green tint ── */
      .tl-project-progress-bar { height: 3px; background: var(--color-border); width: 100%; }
      .tl-project-progress-fill {
        height: 100%;
        background: linear-gradient(90deg, var(--tl-green-dim), var(--tl-green));
        box-shadow: 0 0 8px rgba(74,222,128,0.4);
        transition: width 300ms ease;
      }

      .tl-icon-btn {
        background: transparent; border: 0; color: var(--color-text-faint);
        padding: 6px; border-radius: 6px; cursor: pointer;
        display: inline-flex; align-items: center; justify-content: center;
        transition: color 200ms, background 200ms;
      }
      .tl-icon-btn:hover { color: var(--color-text); background: var(--color-surface-2); }

      .tl-theme-toggle {
        background: transparent; border: 0; color: var(--color-text-muted);
        padding: 6px; border-radius: 8px; cursor: pointer;
        display: inline-flex; align-items: center; justify-content: center;
        transition: color 200ms, background 200ms;
      }
      .tl-theme-toggle:hover { color: var(--color-text); background: var(--color-surface-2); }

      /* ── Progress steps ── */
      .tl-progress { padding: 4px 24px 20px; display: flex; align-items: center; overflow-x: auto; }
      .tl-progress::-webkit-scrollbar { display: none; }
      .tl-progress-step {
        display: flex; align-items: center; gap: 8px; cursor: pointer; flex-shrink: 0;
        background: transparent; border: 0; padding: 4px 2px; color: inherit; font-family: inherit;
      }
      .tl-pdot {
        width: 12px; height: 12px; border-radius: 50%;
        background: var(--color-surface-3); border: 2px solid var(--color-border-strong);
        transition: all 200ms; flex-shrink: 0;
      }
      .tl-progress-step.active .tl-pdot { transform: scale(1.2); }
      .tl-plabel { font-size: 12px; font-weight: 500; color: var(--color-text-faint); transition: color 200ms; white-space: nowrap; }
      .tl-progress-step.active .tl-plabel { color: var(--color-text); font-weight: 600; }
      .tl-progress-step:hover .tl-plabel { color: var(--color-text); }
      .tl-progress-line { flex: 1; height: 2px; background: var(--color-border); margin: 0 10px; min-width: 16px; transition: background 200ms; }

      /* ── Todos ── */
      .tl-todos { border-top: 1px solid var(--color-border); padding: 14px 24px 18px; background: var(--tl-green-bg2); }
      .tl-empty-hint { font-size: 13px; color: var(--color-text-faint); margin: 4px 0 12px; font-style: italic; }

      .tl-todo-block { margin-bottom: 1px; }

      .tl-row { display: flex; align-items: flex-start; gap: 8px; padding: 5px 0; }
      .tl-row.done .tl-row-text { text-decoration: line-through; color: var(--color-text-faint); }
      .tl-row-text { flex: 1; word-break: break-word; padding-top: 1px; transition: color 200ms; cursor: text; border-radius: 4px; }
      .tl-row-text:hover { background: var(--color-surface-2); }
      .tl-row.l0 .tl-row-text { font-size: 16px; font-weight: 500; color: var(--color-text); }
      .tl-row.l1 .tl-row-text { font-size: 14px; font-weight: 400; color: var(--color-text); }
      .tl-row.l2 .tl-row-text { font-size: 13px; font-weight: 400; color: var(--color-text-muted); }
      .tl-row.l0 { padding: 6px 0; }
      .tl-row.l1 { padding: 4px 0; }
      .tl-row.l2 { padding: 3px 0; }

      /* ── Checkboxes — green ── */
      .tl-circle-btn {
        width: 18px; height: 18px; border-radius: 50%;
        border: 2px solid var(--color-border-strong);
        background: var(--color-surface); cursor: pointer;
        flex-shrink: 0; margin-top: 2px; padding: 0;
        display: inline-flex; align-items: center; justify-content: center;
        transition: all 150ms; color: transparent;
      }
      .tl-circle-btn.sm { width: 15px; height: 15px; margin-top: 3px; }
      .tl-circle-btn:hover { border-color: var(--tl-green); background: var(--tl-green-bg2); color: var(--tl-green); }
      .tl-circle-btn.checked {
        background: linear-gradient(135deg, var(--tl-green-dim), var(--tl-green));
        border-color: var(--tl-green); color: #0f172a;
        box-shadow: 0 0 8px rgba(74,222,128,0.35);
      }

      .tl-edit-input {
        flex: 1; background: var(--color-surface);
        border: 1px solid var(--tl-green); border-radius: 6px;
        color: var(--color-text); font-family: inherit; font-size: inherit;
        padding: 1px 8px; outline: none; min-width: 0;
        box-shadow: 0 0 0 3px rgba(74,222,128,0.10);
      }

      .tl-children {
        margin-left: 7px; padding-left: 16px;
        border-left: 2px solid var(--tl-green-border);
        margin-top: 2px; margin-bottom: 4px;
      }
      .tl-children.sub { padding-left: 14px; }

      .tl-add-child-btn {
        background: transparent; border: 0;
        color: var(--color-text-faint); padding: 3px 4px; border-radius: 4px;
        cursor: pointer; display: inline-flex; align-items: center;
        transition: color 150ms, background 150ms; flex-shrink: 0; margin-top: 2px;
      }
      .tl-add-child-btn:hover { color: var(--tl-green); background: var(--tl-green-bg2); }
      .tl-add-child-btn.open { color: var(--tl-green); background: var(--tl-green-bg); }

      .tl-inline-add { display: flex; gap: 6px; padding: 6px 0 4px; }
      .tl-inline-add input { flex: 1; padding: 6px 10px; font-size: 13px; border-radius: 8px; }
      .tl-inline-add button {
        padding: 6px 10px; background: var(--tl-green-bg);
        border: 1px solid var(--tl-green-border); color: var(--tl-green);
        border-radius: 8px; font-family: inherit; font-size: 13px;
        cursor: pointer; display: inline-flex; align-items: center;
        transition: all 200ms;
      }
      .tl-inline-add button:hover:not(:disabled) { background: var(--tl-green-bg); border-color: var(--tl-green); }
      .tl-inline-add button:disabled { opacity: 0.35; cursor: not-allowed; }

      .tl-add-note { display: flex; gap: 8px; margin-top: 12px; }
      .tl-add-note input { flex: 1; padding: 9px 12px; font-size: 14px; }
      .tl-add-note button {
        padding: 9px 14px; background: var(--tl-green-bg);
        border: 1px solid var(--tl-green-border); color: var(--tl-green);
        border-radius: 10px; font-family: inherit; font-weight: 600; font-size: 13px;
        cursor: pointer; display: inline-flex; align-items: center; gap: 6px;
        transition: all 200ms; white-space: nowrap;
      }
      .tl-add-note button:hover:not(:disabled) { border-color: var(--tl-green); box-shadow: var(--tl-green-glow); }
      .tl-add-note button:disabled { opacity: 0.5; cursor: not-allowed; }

      /* ── Empty state ── */
      .tl-empty-state {
        text-align: center; padding: 56px 24px; color: var(--color-text-muted);
        border: 1px dashed var(--tl-green-border); border-radius: 16px;
        background: var(--tl-green-bg2);
      }
      .tl-empty-state h3 { color: var(--color-text); margin: 0 0 8px; font-weight: 700; }
      .tl-empty-state p { margin: 0; font-size: 14px; }

      /* ── Toast ── */
      .tl-toast {
        position: fixed; bottom: 32px; left: 50%; transform: translateX(-50%);
        background: var(--color-surface);
        border: 1px solid var(--tl-green-border);
        color: var(--color-text);
        padding: 12px 20px; border-radius: 10px; font-size: 14px; font-weight: 500;
        box-shadow: var(--tl-green-glow); z-index: 100; white-space: nowrap;
        display: inline-flex; align-items: center; gap: 12px;
        animation: tl-toast-in 200ms ease;
      }
      .tl-toast-undo {
        background: transparent; border: 0; color: var(--tl-green);
        font-family: inherit; font-size: 14px; font-weight: 700;
        cursor: pointer; padding: 0; text-decoration: underline; opacity: 0.9;
        transition: opacity 150ms;
      }
      .tl-toast-undo:hover { opacity: 1; }
      @keyframes tl-toast-in {
        from { opacity: 0; transform: translateX(-50%) translateY(8px); }
        to   { opacity: 1; transform: translateX(-50%) translateY(0); }
      }

      /* ── Welcome screen ── */
      .tl-welcome-nav { margin-bottom: 64px; }
      .tl-welcome-card { flex: 1; display: flex; flex-direction: column; justify-content: center; }
      .tl-welcome-card h1 { font-size: clamp(40px, 6vw, 64px); font-weight: 800; line-height: 1.05; letter-spacing: -0.03em; margin: 0 0 20px; }
      .tl-welcome-card h1 .hand { font-family: var(--font-hand, "Patrick Hand", cursive); color: var(--tl-green); font-weight: 400; display: inline-block; transform: rotate(-2deg); font-size: 1.1em; }
      .tl-welcome-card p { color: var(--color-text-muted); font-size: 17px; line-height: 1.6; margin: 0 0 36px; max-width: 50ch; }
      .tl-welcome-input { display: flex; gap: 12px; margin-bottom: 36px; }
      .tl-welcome-input input { flex: 1; font-size: 17px; padding: 14px 18px; }
      .tl-welcome-input button { padding: 14px 22px; white-space: nowrap; }
      .tl-welcome-users { display: flex; flex-direction: column; gap: 14px; }
      .tl-welcome-label { font-size: 11px; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; color: var(--color-text-faint); }
      .tl-user-pills { display: flex; flex-wrap: wrap; gap: 8px; }
      .tl-user-pill {
        display: inline-flex; align-items: center; gap: 10px;
        padding: 6px 18px 6px 6px; border-radius: 999px;
        border: 1px solid var(--color-border); background: var(--color-surface);
        color: var(--color-text); font-family: inherit;
        font-size: 14px; font-weight: 500; cursor: pointer; transition: all 200ms;
      }
      .tl-user-pill:hover { border-color: var(--tl-green-border); background: var(--tl-green-bg2); }
      .tl-user-pill:disabled { opacity: 0.5; cursor: not-allowed; }

      /* ── Responsive ── */
      @media (max-width: 768px) { .tl-app-root { max-width: 100%; } }

      /* Sidebar → bottom horizontal pill on mobile */
      @media (max-width: 680px) {
        .tl-sidebar {
          left: 12px; right: 12px; top: auto; bottom: 12px; transform: none;
          width: auto; flex-direction: row; align-items: center;
          padding: 0 14px; height: 60px; gap: 4px;
          justify-content: space-between;
        }
        .tl-sidebar .s-sep, .tl-sidebar .s-spacer { display: none; }
        .s-apps { flex-direction: row; gap: 4px; padding: 0; }
        .s-app-item { flex-direction: row; gap: 8px; width: auto; padding: 8px 10px; border-radius: 8px; }
        .s-bubble { width: 28px; height: 28px; border-radius: 8px; }
        .s-icon-label { font-size: 11px; }
        .tl-side-user-pop { left: auto; right: 0; bottom: calc(100% + 10px); }
        .tl-app-root { margin-left: auto; margin-right: auto; padding: 28px 18px 110px; }
      }
      @media (max-width: 460px) {
        .s-app-item .s-icon-label { display: none; }
        .s-logo { display: none; }
      }

      @media (max-width: 540px) {
        .tl-user-chip .tl-user-name { max-width: 80px; }
        .tl-form-card { padding: 20px; }
        .tl-project-header { padding: 16px 18px 10px; flex-wrap: wrap; }
        .tl-progress { padding: 4px 18px 18px; }
        .tl-plabel { font-size: 11px; }
        .tl-welcome-input { flex-direction: column; }
        .tl-welcome-input button { width: 100%; }
      }

      @media (prefers-reduced-motion: reduce) {
        *, *::before, *::after { transition-duration: 0.01ms !important; animation-duration: 0.01ms !important; }
      }
    `})}Se.createRoot(document.getElementById("root")).render(e.jsx(ze.StrictMode,{children:e.jsx(_e,{})}));
