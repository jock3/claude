import"./modulepreload-polyfill-B5Qt9EMX.js";/* empty css                        */import{c as Ne,j as e,R as Se,r as h,X as re}from"./x-wswtVhe5.js";import{P as Y,L as Ce,C as Ee,T as ze}from"./trash-2-BFVfJBeX.js";import{C as Me}from"./calendar-koblg3tA.js";import{C as oe}from"./check-BYZJ08I6.js";const xe="Gustav",ie="ailabb_todo_preview",ee=i=>{const s=new Date;return s.setHours(0,0,0,0),s.setDate(s.getDate()+i),s.toISOString().split("T")[0]},Te=[{id:"demo1",profile_id:"preview",name:"Bygg AI-labbet",checkpoint:1,deadline:ee(52),description:"Skapa ett personligt labb med AI-verktyg och experiment.",todos:[{id:"a1",text:"Planera projektstruktur",done:!0,createdAt:"",children:[]},{id:"a2",text:"Designa UI-komponenter",done:!0,createdAt:"",children:[{id:"b1",text:"Välj typsnitt och färger",done:!0,createdAt:"",children:[]},{id:"b2",text:"Bygga komponentbibliotek",done:!1,createdAt:"",children:[]}]},{id:"a3",text:"Integrera Supabase",done:!1,createdAt:"",children:[]},{id:"a4",text:"Driftsätta MVP",done:!1,createdAt:"",children:[]}],archived:!1,created_at:""},{id:"demo2",profile_id:"preview",name:"SEO-audit",checkpoint:0,deadline:ee(9),description:"Grundlig SEO-genomgång och förbättringar.",todos:[{id:"c1",text:"Keyword-research",done:!1,createdAt:"",children:[]},{id:"c2",text:"On-page optimering",done:!1,createdAt:"",children:[]},{id:"c3",text:"Teknisk SEO",done:!1,createdAt:"",children:[]}],archived:!1,created_at:""},{id:"demo3",profile_id:"preview",name:"Kampanjanalys Q1",checkpoint:3,deadline:ee(-45),description:"",todos:[{id:"d1",text:"Hämta rådata",done:!0,createdAt:"",children:[]},{id:"d2",text:"Analysera konverteringar",done:!0,createdAt:"",children:[]},{id:"d3",text:"Skriv rapport",done:!0,createdAt:"",children:[]}],archived:!0,archived_at:ee(-10),created_at:""}];function Le(){try{const i=localStorage.getItem(ie);if(i)return JSON.parse(i)}catch{}return null}function ne(i){try{localStorage.setItem(ie,JSON.stringify(i))}catch{}}const Q=[{key:"todo",label:"Att göra",color:"#6A6964"},{key:"doing",label:"Pågår",color:"#2E6FD4"},{key:"review",label:"Granskning",color:"#E0A93B"},{key:"done",label:"Klar",color:"#5BAE6E"}],ge=()=>{const i=new Date;return i.setMonth(i.getMonth()+1),i.toISOString().split("T")[0]},De=i=>new Date(i).toLocaleDateString("sv-SE"),J=i=>{const s=new Date;s.setHours(0,0,0,0);const C=new Date(i);return C.setHours(0,0,0,0),Math.round((C-s)/864e5)},$e=i=>{let s=0,C=0;for(const k of i||[]){C++,k.done&&s++;for(const x of k.children||[]){C++,x.done&&s++;for(const f of x.children||[])C++,f.done&&s++}}return{done:s,total:C}};function ue(){return h.useEffect(()=>{const i=window.matchMedia("(pointer: fine)").matches,s=window.matchMedia("(prefers-reduced-motion: reduce)").matches,C=[];if(i){const k=document.getElementById("tl-cursor-dot"),x=document.getElementById("tl-cursor-ring");let f=0,E=0,j=0,F=0,H=!1,D;const l=N=>{f=N.clientX,E=N.clientY,k.style.left=f+"px",k.style.top=E+"px",H||(k.classList.add("visible"),x.classList.add("visible"),H=!0)},v=(N,p,d)=>N+(p-N)*d;let w=0;const I=N=>{const p=Math.min(N-w||16,50);w=N;const d=1-Math.pow(.78,p/16.67);j=v(j,f,d),F=v(F,E,d),x.style.left=j+"px",x.style.top=F+"px",D=requestAnimationFrame(I)};D=requestAnimationFrame(I);const B=()=>{k.classList.add("clicking"),x.classList.add("clicking")},z=()=>{k.classList.remove("clicking"),x.classList.remove("clicking")},$='a, button, input, textarea, [role="button"], .s-app-item',O=N=>{N.target.closest($)&&(k.classList.add("hovering"),x.classList.add("hovering"))},R=N=>{N.target.closest($)&&(k.classList.remove("hovering"),x.classList.remove("hovering"))};document.addEventListener("mousemove",l),document.addEventListener("mousedown",B),document.addEventListener("mouseup",z),document.addEventListener("mouseover",O),document.addEventListener("mouseout",R),C.push(()=>{cancelAnimationFrame(D),document.removeEventListener("mousemove",l),document.removeEventListener("mousedown",B),document.removeEventListener("mouseup",z),document.removeEventListener("mouseover",O),document.removeEventListener("mouseout",R)})}{const k=document.getElementById("tl-spotlight");let x=!1;const f=E=>{k.style.setProperty("--mx",E.clientX+"px"),k.style.setProperty("--my",E.clientY+"px"),x||(k.classList.add("visible"),x=!0)};document.addEventListener("mousemove",f),C.push(()=>document.removeEventListener("mousemove",f))}{let k=function(){this.x=Math.random()*v,this.y=Math.random()*w,this.vx=(Math.random()-.5)*.38,this.vy=(Math.random()-.5)*.38,this.sz=Math.random()*1.1+.4,this.al=Math.random()*.28+.1},x=function(){I=Math.min(window.devicePixelRatio||1,2),v=window.innerWidth,w=window.innerHeight,D.width=v*I,D.height=w*I,D.style.width=v+"px",D.style.height=w+"px",l.setTransform(1,0,0,1,0,0),l.scale(I,I),B=[];const p=v<768?42:74;for(let d=0;d<p;d++)B.push(new k)},f=function(p){$.forEach(d=>{const M=(d[0]+Math.sin(p*d[3]+d[4])*.22)*v,u=(d[1]+Math.cos(p*d[3]*.73+d[4]*1.1)*.18)*w,L=d[2]*Math.max(v,w),A=l.createRadialGradient(M,u,0,M,u,L);A.addColorStop(0,`rgba(${d[5]},${d[6]},${d[7]},${d[8]*2.4})`),A.addColorStop(.38,`rgba(${d[5]},${d[6]},${d[7]},${d[8]})`),A.addColorStop(1,`rgba(${d[5]},${d[6]},${d[7]},0)`),l.fillStyle=A,l.fillRect(0,0,v,w)})},E=function(p){const L=v/14,A=w/9;l.lineWidth=.85,l.strokeStyle="rgba(34,197,94,0.045)";let S,y,g,T,K,W;for(S=0;S<=9;S++){for(l.beginPath(),y=0;y<=14;y++)g=y*L,T=S*A,K=Math.sin(g*.009+p*46e-5+S*.28)*20,W=Math.cos(T*.007+p*35e-5+y*.19)*12.4,y===0?l.moveTo(g+K,T+W):l.lineTo(g+K,T+W);l.stroke()}for(y=0;y<=14;y++){for(l.beginPath(),S=0;S<=9;S++)g=y*L,T=S*A,K=Math.sin(g*.009+p*46e-5+S*.28)*20,W=Math.cos(T*.007+p*35e-5+y*.19)*12.4,S===0?l.moveTo(g+K,T+W):l.lineTo(g+K,T+W);l.stroke()}},j=function(){const p=B.length;let d,M,u,L,A,S,y,g;for(d=0;d<p;d++){for(u=B[d],M=d+1;M<p;M++)L=B[M],A=u.x-L.x,S=u.y-L.y,y=A*A+S*S,y<R&&(g=(1-Math.sqrt(y)/O)*.09,l.beginPath(),l.moveTo(u.x,u.y),l.lineTo(L.x,L.y),l.strokeStyle=`rgba(74,222,128,${g})`,l.lineWidth=.55,l.stroke());l.beginPath(),l.arc(u.x,u.y,u.sz,0,6.2832),l.fillStyle=`rgba(167,243,208,${u.al})`,l.fill(),u.x+=u.vx,u.y+=u.vy,u.x<-6?u.x=v+6:u.x>v+6&&(u.x=-6),u.y<-6?u.y=w+6:u.y>w+6&&(u.y=-6)}},F=function(p){l.clearRect(0,0,v,w),f(p),E(p),j(),z=requestAnimationFrame(F)},H=function(){l.clearRect(0,0,v,w),$.forEach(p=>{const d=p[2]*Math.max(v,w),M=l.createRadialGradient(p[0]*v,p[1]*w,0,p[0]*v,p[1]*w,d);M.addColorStop(0,`rgba(${p[5]},${p[6]},${p[7]},${p[8]*1.6})`),M.addColorStop(1,`rgba(${p[5]},${p[6]},${p[7]},0)`),l.fillStyle=M,l.fillRect(0,0,v,w)})};const D=document.getElementById("tl-bg-canvas"),l=D.getContext("2d",{alpha:!0});let v,w,I,B,z;const $=[[.14,.22,.42,14e-5,0,34,197,94,.09],[.78,.63,.36,1e-4,2.1,22,163,74,.07],[.48,.85,.31,17e-5,4,74,222,128,.055],[.86,.13,.27,12e-5,1.3,16,185,129,.05],[.24,.76,.24,19e-5,3.4,52,211,153,.045]],O=128,R=O*O,N=()=>{if(z&&cancelAnimationFrame(z),x(),s){H();return}z=requestAnimationFrame(F)};x(),window.addEventListener("resize",N),s?H():z=requestAnimationFrame(F),C.push(()=>{window.removeEventListener("resize",N),z&&cancelAnimationFrame(z)})}return()=>C.forEach(k=>k())},[]),e.jsxs(e.Fragment,{children:[e.jsx("div",{className:"tl-cursor-dot",id:"tl-cursor-dot","aria-hidden":"true"}),e.jsx("div",{className:"tl-cursor-ring",id:"tl-cursor-ring","aria-hidden":"true"}),e.jsx("canvas",{id:"tl-bg-canvas","aria-hidden":"true"}),e.jsx("div",{className:"tl-noise","aria-hidden":"true"}),e.jsx("div",{className:"tl-spotlight",id:"tl-spotlight","aria-hidden":"true"})]})}function Ae({activeUser:i,onSwitch:s}){const[C,k]=h.useState(()=>document.documentElement.getAttribute("data-theme")||"dark"),[x,f]=h.useState(!1),E=()=>{const j=C==="dark"?"light":"dark";document.documentElement.setAttribute("data-theme",j),localStorage.setItem("ailabb_theme",j),k(j)};return h.useEffect(()=>{if(!x)return;const j=()=>f(!1),F=setTimeout(()=>document.addEventListener("click",j),0);return()=>{clearTimeout(F),document.removeEventListener("click",j)}},[x]),e.jsxs("aside",{className:"tl-sidebar","aria-label":"Navigering",children:[e.jsx("a",{href:"../../",className:"s-logo",title:"AI Labb","aria-label":"AI Labb",children:e.jsxs("svg",{fill:"currentColor",xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 623.04 583.35","aria-hidden":"true",children:[e.jsx("path",{d:"M232.17,3c7.02-7.42,19.19.1,15.62,9.67-9.95,26.68-27.78,61.43-58.57,88.15-55.09,47.8-70.9,80.05-80.29,122.79-.83,3.78-4.33,6.37-8.19,6.09l-13.61-.98c-5.61-.4-9.92-5.11-9.82-10.73.52-29.28,13.8-103.04,70.2-141.85C183.44,51.41,212.65,23.65,232.17,3Z"}),e.jsx("path",{d:"M74.3,234.65s-22.36,17.42-24.83,29.76c-1.77,8.84,31.32,11.98,50.2,13.05,6.54.37,11.77-5.35,10.78-11.82-1.08-7.08-2.45-16.17-3.61-24.42-2.35-16.66-32.55-6.56-32.55-6.56Z"}),e.jsx("path",{d:"M51.87,290.51s-38.3,9.33-38.3,64.83,12.33,99.9-13.57,145.54c0,0,96.6-69.22,110.75-161.62,3.8-24.79-9.47-49.48-32.56-59.27-8.67-3.68-14.96,9.96-26.32,10.52Z"}),e.jsxs("text",{style:{fontSize:"193.17px",fontFamily:"Montserrat-Bold, Montserrat",fontWeight:700,opacity:.91},transform:"translate(144.86 300.16)",children:[e.jsx("tspan",{x:"0",y:"0",children:"0"}),e.jsx("tspan",{x:"130",y:"0",children:"100"})]}),e.jsxs("text",{style:{fontSize:"189.12px",fontFamily:"Montserrat-Bold, Montserrat",fontWeight:700,opacity:.91},transform:"translate(259.2 447.19) scale(1.04 1)",children:[e.jsx("tspan",{x:"0",y:"0",children:"0"}),e.jsx("tspan",{x:"127.28",y:"0",children:"111"})]})]})}),e.jsx("div",{className:"s-sep"}),e.jsx("a",{href:"../../",className:"s-btn",title:"Hem","aria-label":"Hem",children:e.jsxs("svg",{width:"17",height:"17",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"1.75",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("path",{d:"m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"}),e.jsx("polyline",{points:"9 22 9 12 15 12 15 22"})]})}),e.jsx("div",{className:"s-sep"}),e.jsxs("div",{className:"s-apps",children:[e.jsxs("a",{href:"../todo/",className:"s-app-item active",title:"Todo","aria-current":"page",children:[e.jsx("div",{className:"s-bubble ib-todo","aria-hidden":"true",children:e.jsxs("svg",{width:"17",height:"17",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"1.75",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("rect",{width:"18",height:"18",x:"3",y:"3",rx:"2"}),e.jsx("path",{d:"m9 12 2 2 4-4"})]})}),e.jsx("span",{className:"s-icon-label",children:"Todo"})]}),e.jsxs("a",{href:"../kampanj/",className:"s-app-item",title:"Kampanj",children:[e.jsx("div",{className:"s-bubble ib-kampanj","aria-hidden":"true",children:e.jsxs("svg",{width:"17",height:"17",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"1.75",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("circle",{cx:"12",cy:"12",r:"10"}),e.jsx("circle",{cx:"12",cy:"12",r:"6"}),e.jsx("circle",{cx:"12",cy:"12",r:"2"})]})}),e.jsx("span",{className:"s-icon-label",children:"Kampanj"})]}),e.jsxs("a",{href:"../seo-audit/",className:"s-app-item",title:"SEO",children:[e.jsx("div",{className:"s-bubble ib-seo","aria-hidden":"true",children:e.jsxs("svg",{width:"17",height:"17",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"1.75",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("circle",{cx:"11",cy:"11",r:"8"}),e.jsx("path",{d:"m21 21-4.35-4.35"})]})}),e.jsx("span",{className:"s-icon-label",children:"SEO"})]}),e.jsxs("a",{href:"../trackr/",className:"s-app-item",title:"Track3r",children:[e.jsx("div",{className:"s-bubble ib-trackr","aria-hidden":"true",children:e.jsx("svg",{width:"17",height:"17",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"1.75",strokeLinecap:"round",strokeLinejoin:"round",children:e.jsx("polyline",{points:"22 12 18 12 15 21 9 3 6 12 2 12"})})}),e.jsx("span",{className:"s-icon-label",children:"Track3r"})]})]}),e.jsx("div",{className:"s-spacer"}),e.jsx("div",{className:"s-sep"}),e.jsxs("div",{className:"tl-side-user",onClick:j=>j.stopPropagation(),children:[e.jsx("button",{className:"s-btn s-user-btn",onClick:()=>f(j=>!j),title:i,"aria-label":"Användare",children:e.jsx("span",{className:"s-avatar-el",children:i?i[0].toUpperCase():"?"})}),x&&e.jsxs("div",{className:"tl-side-user-pop",children:[e.jsx("div",{className:"tl-side-user-name",children:i}),e.jsxs("button",{onClick:()=>{f(!1),s()},children:[e.jsx(Ce,{size:14}),"Återställ demo"]})]})]}),e.jsx("button",{className:"theme-toggle",onClick:E,"aria-label":"Byt tema",title:"Byt tema",children:C==="dark"?e.jsxs("svg",{width:"15",height:"15",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"1.75",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("circle",{cx:"12",cy:"12",r:"4"}),e.jsx("path",{d:"M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"})]}):e.jsx("svg",{width:"15",height:"15",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"1.75",strokeLinecap:"round",strokeLinejoin:"round",children:e.jsx("path",{d:"M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"})})})]})}function ae({value:i,onChange:s,onBlur:C,onKeyDown:k,fontSize:x,fontWeight:f}){return e.jsx("input",{autoFocus:!0,className:"tl-edit-input",value:i,onChange:s,onBlur:C,onKeyDown:k,style:x?{fontSize:x,fontWeight:f}:{}})}function he({project:i,onUpdate:s,onDelete:C,onArchive:k,isArchived:x=!1,showToast:f}){const[E,j]=h.useState(""),[F,H]=h.useState({}),[D,l]=h.useState({}),[v,w]=h.useState(new Set),[I,B]=h.useState(new Set),[z,$]=h.useState(null),[O,R]=h.useState(""),[N,p]=h.useState(x),[d,M]=h.useState(!1),[u,L]=h.useState(!1),[A,S]=h.useState(i.description||""),y=h.useRef(null),g=i.todos||[],T=J(i.deadline),K=i.checkpoint===Q.length-1,{done:W,total:q}=$e(g),o=()=>Date.now().toString()+Math.random().toString(36).slice(2,6),m=()=>new Date().toISOString(),P=(t,r)=>{$(t),R(r)},_=()=>{if(!z)return;const t=O.trim();if(!t){$(null);return}if(z==="__name__"){s({name:t}),$(null);return}const r=z.split("/");if(r.length===1)s({todos:g.map(n=>n.id===r[0]?{...n,text:t}:n)});else if(r.length===2){const[n,a]=r;s({todos:g.map(c=>c.id!==n?c:{...c,children:(c.children||[]).map(b=>b.id===a?{...b,text:t}:b)})})}else{const[n,a,c]=r;s({todos:g.map(b=>b.id!==n?b:{...b,children:(b.children||[]).map(X=>X.id!==a?X:{...X,children:(X.children||[]).map(te=>te.id===c?{...te,text:t}:te)})})})}$(null)},G=t=>{M(!1),t&&s({deadline:t})},V=()=>{L(!1),s({description:A.trim()})},se=()=>{E.trim()&&(s({todos:[...g,{id:o(),text:E.trim(),done:!1,createdAt:m(),children:[]}]}),j(""))},be=t=>s({todos:g.map(r=>r.id===t?{...r,done:!r.done}:r)}),fe=t=>{y.current=g;const r=g.filter(n=>n.id!==t);s({todos:r}),w(n=>{const a=new Set(n);return a.delete(t),a}),f&&f("Todo raderad",()=>s({todos:y.current}))},le=t=>w(r=>{const n=new Set(r);return n.has(t)?n.delete(t):n.add(t),n}),de=t=>{const r=(F[t]||"").trim();r&&(s({todos:g.map(n=>n.id!==t?n:{...n,children:[...n.children||[],{id:o(),text:r,done:!1,createdAt:m(),children:[]}]})}),H(n=>({...n,[t]:""})))},ve=(t,r)=>s({todos:g.map(n=>n.id!==t?n:{...n,children:(n.children||[]).map(a=>a.id===r?{...a,done:!a.done}:a)})}),ke=(t,r)=>{y.current=g;const n=g.map(a=>a.id!==t?a:{...a,children:(a.children||[]).filter(c=>c.id!==r)});s({todos:n}),B(a=>{const c=new Set(a);return c.delete(`${t}/${r}`),c}),f&&f("Todo raderad",()=>s({todos:y.current}))},ce=(t,r)=>{const n=`${t}/${r}`;B(a=>{const c=new Set(a);return c.has(n)?c.delete(n):c.add(n),c})},pe=(t,r)=>{const n=`${t}/${r}`,a=(D[n]||"").trim();a&&(s({todos:g.map(c=>c.id!==t?c:{...c,children:(c.children||[]).map(b=>b.id!==r?b:{...b,children:[...b.children||[],{id:o(),text:a,done:!1,createdAt:m()}]})})}),l(c=>({...c,[n]:""})))},we=(t,r,n)=>s({todos:g.map(a=>a.id!==t?a:{...a,children:(a.children||[]).map(c=>c.id!==r?c:{...c,children:(c.children||[]).map(b=>b.id===n?{...b,done:!b.done}:b)})})}),ye=(t,r,n)=>{y.current=g;const a=g.map(c=>c.id!==t?c:{...c,children:(c.children||[]).map(b=>b.id!==r?b:{...b,children:(b.children||[]).filter(X=>X.id!==n)})});s({todos:a}),f&&f("Todo raderad",()=>s({todos:y.current}))};let U="",Z="";T<0?(U="overdue",Z=`${Math.abs(T)} d försenad`):T===0?(U="urgent",Z="Idag"):T<=7?(U="urgent",Z=`${T} d kvar`):Z=`${T} d kvar`;const je=q>0?Math.round(W/q*100):0;return e.jsxs("div",{className:`tl-project ${x?"archived":""}`,children:[e.jsxs("div",{className:"tl-project-header",children:[e.jsx("button",{className:"tl-collapse-btn",onClick:()=>p(t=>!t),"aria-label":N?"Expandera":"Minimera",children:e.jsx(Ee,{size:18,style:{transform:N?"rotate(-90deg)":"rotate(0)",transition:"transform 200ms"}})}),z==="__name__"?e.jsx("input",{autoFocus:!0,className:"tl-project-name-input",value:O,onChange:t=>R(t.target.value),onBlur:_,onKeyDown:t=>{t.key==="Enter"&&_(),t.key==="Escape"&&$(null)}}):e.jsx("h3",{className:"tl-project-name",onClick:()=>P("__name__",i.name),children:i.name}),q>0&&e.jsxs("span",{className:"tl-todo-counter",children:[W,"/",q," klara"]}),x&&i.archived_at&&e.jsxs("span",{className:"tl-archived-date",children:["Arkiverad ",De(i.archived_at)]}),!x&&(d?e.jsx("input",{autoFocus:!0,type:"date",className:"tl-deadline-input",defaultValue:i.deadline,onBlur:t=>G(t.target.value),onKeyDown:t=>{t.key==="Enter"&&G(t.target.value),t.key==="Escape"&&M(!1)}}):e.jsxs("div",{className:`tl-deadline-badge ${U}`,style:{cursor:"pointer"},onClick:()=>M(!0),children:[e.jsx(Me,{size:12}),Z]})),K&&!x&&e.jsx("button",{className:"tl-archive-btn",onClick:k,children:"Arkivera"}),e.jsx("button",{className:"tl-icon-btn",onClick:C,"aria-label":"Ta bort projekt",children:e.jsx(ze,{size:16})})]}),!N&&!x&&e.jsx("div",{className:"tl-project-desc-row",children:u?e.jsx("input",{autoFocus:!0,className:"tl-desc-input",value:A,placeholder:"Lägg till beskrivning…",onChange:t=>S(t.target.value),onBlur:V,onKeyDown:t=>{t.key==="Enter"&&V(),t.key==="Escape"&&(L(!1),S(i.description||""))}}):e.jsx("span",{className:`tl-project-desc ${i.description?"":"empty"}`,onClick:()=>{S(i.description||""),L(!0)},children:i.description||"Lägg till beskrivning…"})}),q>0&&e.jsx("div",{className:"tl-project-progress-bar",children:e.jsx("div",{className:"tl-project-progress-fill",style:{width:`${je}%`}})}),!N&&e.jsxs(e.Fragment,{children:[e.jsx("div",{className:"tl-progress",children:Q.map((t,r)=>{const n=r<=i.checkpoint;return e.jsxs(h.Fragment,{children:[e.jsxs("button",{className:`tl-progress-step ${r===i.checkpoint?"active":""}`,onClick:()=>s({checkpoint:r}),"aria-label":`Sätt status till ${t.label}`,children:[e.jsx("span",{className:"tl-pdot",style:n?{background:t.color,borderColor:t.color}:{}}),e.jsx("span",{className:"tl-plabel",children:t.label})]}),r<Q.length-1&&e.jsx("span",{className:"tl-progress-line",style:r<i.checkpoint?{background:t.color}:{}})]},t.key)})}),e.jsxs("div",{className:"tl-todos",children:[g.length===0&&e.jsx("p",{className:"tl-empty-hint",children:"Inga todos ännu."}),g.map(t=>e.jsxs("div",{className:"tl-todo-block",children:[e.jsxs("div",{className:`tl-row l0 ${t.done?"done":""}`,children:[e.jsx("button",{className:`tl-circle-btn ${t.done?"checked":""}`,onClick:()=>be(t.id),"aria-label":"Markera klar",children:t.done&&e.jsx(oe,{size:10,strokeWidth:3})}),z===t.id?e.jsx(ae,{value:O,onChange:r=>R(r.target.value),onBlur:_,onKeyDown:r=>{r.key==="Enter"&&_(),r.key==="Escape"&&$(null)}}):e.jsx("span",{className:"tl-row-text",onClick:()=>P(t.id,t.text),children:t.text}),e.jsx("button",{className:`tl-add-child-btn ${v.has(t.id)?"open":""}`,onClick:()=>le(t.id),title:"Lägg till sub-todo",children:e.jsx(Y,{size:11,strokeWidth:2.5})}),e.jsx("button",{className:"tl-icon-btn",onClick:()=>fe(t.id),"aria-label":"Ta bort",children:e.jsx(re,{size:14})})]}),((t.children||[]).length>0||v.has(t.id))&&e.jsxs("div",{className:"tl-children",children:[(t.children||[]).map(r=>{const n=`${t.id}/${r.id}`;return e.jsxs("div",{className:"tl-todo-block",children:[e.jsxs("div",{className:`tl-row l1 ${r.done?"done":""}`,children:[e.jsx("button",{className:`tl-circle-btn sm ${r.done?"checked":""}`,onClick:()=>ve(t.id,r.id),"aria-label":"Markera klar",children:r.done&&e.jsx(oe,{size:8,strokeWidth:3})}),z===n?e.jsx(ae,{value:O,onChange:a=>R(a.target.value),onBlur:_,onKeyDown:a=>{a.key==="Enter"&&_(),a.key==="Escape"&&$(null)}}):e.jsx("span",{className:"tl-row-text",onClick:()=>P(n,r.text),children:r.text}),e.jsx("button",{className:`tl-add-child-btn sm ${I.has(n)?"open":""}`,onClick:()=>ce(t.id,r.id),title:"Lägg till sub-sub-todo",children:e.jsx(Y,{size:10,strokeWidth:2.5})}),e.jsx("button",{className:"tl-icon-btn",onClick:()=>ke(t.id,r.id),"aria-label":"Ta bort",children:e.jsx(re,{size:13})})]}),((r.children||[]).length>0||I.has(n))&&e.jsxs("div",{className:"tl-children sub",children:[(r.children||[]).map(a=>{const c=`${t.id}/${r.id}/${a.id}`;return e.jsxs("div",{className:`tl-row l2 ${a.done?"done":""}`,children:[e.jsx("button",{className:`tl-circle-btn sm ${a.done?"checked":""}`,onClick:()=>we(t.id,r.id,a.id),"aria-label":"Markera klar",children:a.done&&e.jsx(oe,{size:8,strokeWidth:3})}),z===c?e.jsx(ae,{value:O,onChange:b=>R(b.target.value),onBlur:_,onKeyDown:b=>{b.key==="Enter"&&_(),b.key==="Escape"&&$(null)}}):e.jsx("span",{className:"tl-row-text",onClick:()=>P(c,a.text),children:a.text}),e.jsx("button",{className:"tl-icon-btn",onClick:()=>ye(t.id,r.id,a.id),"aria-label":"Ta bort",children:e.jsx(re,{size:12})})]},a.id)}),I.has(n)&&e.jsxs("div",{className:"tl-inline-add",children:[e.jsx("input",{autoFocus:!0,type:"text",placeholder:"Sub-sub-todo…",value:D[n]||"",onChange:a=>l(c=>({...c,[n]:a.target.value})),onKeyDown:a=>{a.key==="Enter"&&pe(t.id,r.id),a.key==="Escape"&&ce(t.id,r.id)}}),e.jsx("button",{onClick:()=>pe(t.id,r.id),disabled:!(D[n]||"").trim(),children:e.jsx(Y,{size:12})})]})]})]},r.id)}),v.has(t.id)&&e.jsxs("div",{className:"tl-inline-add",children:[e.jsx("input",{autoFocus:!0,type:"text",placeholder:"Sub-todo…",value:F[t.id]||"",onChange:r=>H(n=>({...n,[t.id]:r.target.value})),onKeyDown:r=>{r.key==="Enter"&&de(t.id),r.key==="Escape"&&le(t.id)}}),e.jsx("button",{onClick:()=>de(t.id),disabled:!(F[t.id]||"").trim(),children:e.jsx(Y,{size:12})})]})]})]},t.id)),e.jsxs("div",{className:"tl-add-note",children:[e.jsx("input",{type:"text",placeholder:"Lägg till todo…",value:E,onChange:t=>j(t.target.value),onKeyDown:t=>t.key==="Enter"&&se()}),e.jsxs("button",{onClick:se,disabled:!E.trim(),children:[e.jsx(Y,{size:14,strokeWidth:2.5}),"Lägg till"]})]})]})]})]})}function Fe(){const[i,s]=h.useState([]),[C,k]=h.useState(!0),[x,f]=h.useState(null),E=h.useRef(null),j=h.useRef({}),F=h.useRef([]),[H,D]=h.useState(!1),[l,v]=h.useState(""),[w,I]=h.useState(0),[B,z]=h.useState(ge());h.useEffect(()=>{F.current=i},[i]),h.useEffect(()=>{const m=Le()??Te.map(P=>({...P,todos:JSON.parse(JSON.stringify(P.todos))}));s(m),k(!1)},[]);const $=(o,m)=>{E.current&&clearTimeout(E.current),f({msg:o,undoFn:m||null}),E.current=setTimeout(()=>f(null),4e3)},O=()=>{E.current&&clearTimeout(E.current),f(null)},R=()=>{window.confirm("Återställ till original-demo-data?")&&(localStorage.removeItem(ie),window.location.reload())},N=()=>{v(""),I(0),z(ge())},p=()=>{if(!l.trim())return;const o={id:Date.now().toString(),profile_id:"preview",name:l.trim(),checkpoint:w,deadline:B,description:"",todos:[],created_at:new Date().toISOString()};s(m=>{const P=[o,...m];return ne(P),P}),N(),D(!1)},d=(o,m)=>{const P=i.find(G=>G.id===o);if(!P)return;let _={...P,...m};m.checkpoint!==void 0&&m.checkpoint<Q.length-1&&_.archived&&(_={..._,archived:!1,archived_at:null}),s(G=>G.map(V=>V.id===o?_:V)),j.current[o]&&clearTimeout(j.current[o]),j.current[o]=setTimeout(()=>ne(F.current),800)},M=o=>d(o,{archived:!0,archived_at:new Date().toISOString()}),u=o=>{window.confirm("Ta bort projektet?")&&s(m=>{const P=m.filter(_=>_.id!==o);return ne(P),P})},L=i.filter(o=>!o.archived),A=L.filter(o=>J(o.deadline)<0),S=L.filter(o=>{const m=J(o.deadline);return m>=0&&m<=7}),y=L.filter(o=>J(o.deadline)>7),g=[...A,...S,...y],T=i.filter(o=>o.archived).sort((o,m)=>new Date(m.archived_at||0)-new Date(o.archived_at||0)),K=A.length,W=S.filter(o=>J(o.deadline)===0).length,q=S.filter(o=>J(o.deadline)>0).length+y.length;return C?e.jsxs(e.Fragment,{children:[e.jsx(me,{}),e.jsx(ue,{}),e.jsx("div",{className:"tl-fullscreen-loader",children:"Laddar…"})]}):e.jsxs(e.Fragment,{children:[e.jsx(me,{}),e.jsx(ue,{}),e.jsxs("div",{className:"tl-preview-banner",children:[e.jsx("span",{children:"Demo-läge — ändringar sparas lokalt i din webbläsare"}),e.jsx("button",{onClick:R,children:"Återställ demo"})]}),e.jsx(Ae,{activeUser:xe,onSwitch:R}),e.jsxs("div",{className:"tl-app-root tl-preview-offset",children:[e.jsxs("section",{className:"tl-hero",children:[e.jsxs("h1",{children:["Hej ",xe,", redo att ",e.jsx("span",{className:"hand",children:"labba?"})]}),e.jsx("p",{children:"Liten plats för att hålla koll på pågående experiment. Skapa ett projekt, sätt en deadline och samla anteckningar längs vägen."})]}),H?e.jsxs("div",{className:"tl-form-card",children:[e.jsx("h2",{children:"Nytt projekt"}),e.jsxs("div",{className:"tl-field",children:[e.jsx("label",{className:"tl-field-label",children:"Projektnamn"}),e.jsx("input",{type:"text",placeholder:"t.ex. Bygg AI-labbet",value:l,onChange:o=>v(o.target.value),onKeyDown:o=>o.key==="Enter"&&p(),autoFocus:!0})]}),e.jsxs("div",{className:"tl-field",children:[e.jsx("label",{className:"tl-field-label",children:"Status"}),e.jsx("div",{className:"tl-checkpoints",children:Q.map((o,m)=>e.jsxs("button",{type:"button",className:`tl-cp-pill ${w===m?"active":""}`,onClick:()=>I(m),style:w===m?{borderColor:o.color,background:`${o.color}20`}:{},children:[e.jsx("span",{className:"tl-dot",style:{background:o.color}}),o.label]},o.key))})]}),e.jsxs("div",{className:"tl-field",children:[e.jsx("label",{className:"tl-field-label",children:"Deadline"}),e.jsx("input",{type:"date",value:B,onChange:o=>z(o.target.value)})]}),e.jsxs("div",{className:"tl-form-actions",children:[e.jsx("button",{className:"tl-btn-primary",onClick:p,disabled:!l.trim(),children:"Skapa projekt"}),e.jsx("button",{className:"tl-btn-ghost",onClick:()=>{N(),D(!1)},children:"Avbryt"})]})]}):e.jsxs("button",{className:"tl-new-btn",onClick:()=>D(!0),children:[e.jsx(Y,{size:18,strokeWidth:2.5}),"Nytt projekt"]}),e.jsxs("section",{style:{marginTop:28},children:[g.length>0&&e.jsxs("div",{className:"tl-summary-bar",children:[K>0&&e.jsxs("span",{children:[K," försenade"]}),W>0&&e.jsxs("span",{children:[W," idag"]}),q>0&&e.jsxs("span",{children:[q," pågående"]})]}),g.length===0&&T.length===0?e.jsxs("div",{className:"tl-empty-state",children:[e.jsx("h3",{children:"Inga projekt ännu"}),e.jsx("p",{children:"Skapa ditt första projekt för att komma igång."})]}):g.length===0?e.jsxs("div",{className:"tl-empty-state",children:[e.jsx("h3",{children:"Inga aktiva projekt"}),e.jsx("p",{children:"Alla projekt är arkiverade. Skapa ett nytt eller återställ ett nedan."})]}):g.map(o=>e.jsx(he,{project:o,onUpdate:m=>d(o.id,m),onDelete:()=>u(o.id),onArchive:()=>M(o.id),showToast:$},o.id))]}),T.length>0&&e.jsxs("section",{className:"tl-archive-section",children:[e.jsx("h2",{className:"tl-archive-heading",children:"Arkiverade projekt"}),T.map(o=>e.jsx(he,{project:o,isArchived:!0,onUpdate:m=>d(o.id,m),onDelete:()=>u(o.id),onArchive:()=>M(o.id),showToast:$},o.id))]})]}),x&&e.jsxs("div",{className:"tl-toast",children:[e.jsx("span",{children:x.msg}),x.undoFn&&e.jsx("button",{className:"tl-toast-undo",onClick:()=>{x.undoFn(),O()},children:"Ångra"})]})]})}function me(){return e.jsx("style",{children:`
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

      body {
        background-image: radial-gradient(ellipse 80% 50% at 20% -10%, rgba(34,197,94,0.07) 0%, transparent 60%);
      }

      /* ── Preview banner ── */
      .tl-preview-banner {
        position: fixed; top: 0; left: 0; right: 0; z-index: 200;
        background: rgba(34,197,94,0.07);
        border-bottom: 1px solid rgba(74,222,128,0.18);
        padding: 7px 24px 7px 104px;
        font-size: 12px; color: var(--tl-green);
        font-family: var(--font-body, "Montserrat", sans-serif);
        display: flex; align-items: center; gap: 14px;
        backdrop-filter: blur(8px);
      }
      .tl-preview-banner button {
        background: transparent;
        border: 1px solid rgba(74,222,128,0.30);
        color: var(--tl-green); border-radius: 6px;
        padding: 3px 10px; font-size: 11px; cursor: pointer;
        font-family: inherit; transition: border-color 200ms;
      }
      .tl-preview-banner button:hover { border-color: var(--tl-green); }
      @media (max-width: 680px) {
        .tl-preview-banner { padding-left: 14px; }
      }

      /* ── Offset content below banner ── */
      .tl-preview-offset { padding-top: 80px !important; }

      /* ── Custom cursor ── */
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

      /* ── Sidebar pill ── */
      .tl-sidebar {
        position: fixed; left: 20px; top: 40px;
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

      /* ── App root ── */
      .tl-app-root {
        min-height: 100vh; color: var(--color-text);
        font-family: var(--font-body, "Montserrat", sans-serif);
        -webkit-font-smoothing: antialiased;
        position: relative; z-index: 10;
        max-width: 960px; margin: 0 auto; padding: 48px 32px 110px;
      }
      @media (max-width: 1184px) { .tl-app-root { margin-left: 116px; margin-right: auto; } }

      .tl-fullscreen-loader {
        min-height: 100vh; display: flex; align-items: center; justify-content: center;
        color: var(--color-text-faint); font-size: 15px;
        font-family: var(--font-body, "Montserrat", sans-serif);
      }

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

      /* ── Buttons ── */
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
        background: var(--color-surface); border: 1px solid var(--tl-green-border);
        border-radius: 16px; padding: 28px; margin: 8px 0 32px;
        box-shadow: var(--tl-green-glow);
      }
      .tl-form-card h2 { font-size: 20px; font-weight: 700; margin: 0 0 20px; }
      .tl-field { margin-bottom: 20px; }
      .tl-field-label { font-size: 11px; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; color: var(--color-text-muted); margin-bottom: 8px; display: block; }

      .tl-app-root input[type="text"],
      .tl-app-root input[type="date"] {
        background: var(--color-surface-2); border: 1px solid var(--color-border);
        color: var(--color-text); font-family: inherit; font-size: 16px;
        padding: 11px 14px; border-radius: 10px; width: 100%;
        outline: none; transition: border-color 200ms, box-shadow 200ms; box-sizing: border-box;
      }
      .tl-app-root input[type="text"]:focus,
      .tl-app-root input[type="date"]:focus {
        border-color: var(--tl-green); box-shadow: 0 0 0 3px rgba(74,222,128,0.12);
      }
      .tl-app-root input[type="date"] { color-scheme: light dark; }
      .tl-app-root ::placeholder { color: var(--color-text-faint); }

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

      /* ── Project cards ── */
      .tl-project {
        background: color-mix(in srgb, var(--color-surface) 90%, transparent);
        border: 1px solid var(--color-border);
        border-radius: 16px; margin-bottom: 16px; overflow: hidden;
        transition: border-color 200ms, box-shadow 200ms;
        backdrop-filter: blur(8px);
      }
      .tl-project:hover { border-color: var(--tl-green-border); box-shadow: var(--tl-green-glow); }
      .tl-project.archived { background: var(--color-surface-2); border-color: var(--color-border); }
      .tl-project.archived:hover { border-color: var(--color-border-strong); box-shadow: none; }
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
      .tl-todo-counter { font-size: 12px; font-weight: 500; color: var(--color-text-faint); white-space: nowrap; flex-shrink: 0; }

      .tl-project-desc-row { padding: 0 24px 8px 52px; }
      .tl-project-desc { font-size: 13px; color: var(--color-text-muted); cursor: text; border-radius: 4px; padding: 2px 4px; display: inline-block; transition: background 150ms; }
      .tl-project-desc.empty { color: var(--color-text-faint); opacity: 0; transition: opacity 150ms; }
      .tl-project-desc-row:hover .tl-project-desc.empty { opacity: 1; }
      .tl-desc-input {
        font-size: 13px; color: var(--color-text); font-family: inherit;
        background: var(--color-surface); border: 1px solid var(--tl-green);
        border-radius: 6px; padding: 3px 8px; outline: none;
        width: 100%; box-sizing: border-box; box-shadow: 0 0 0 3px rgba(74,222,128,0.10);
      }

      .tl-project-progress-bar { height: 3px; background: var(--color-border); width: 100%; }
      .tl-project-progress-fill {
        height: 100%;
        background: linear-gradient(90deg, var(--tl-green-dim), var(--tl-green));
        box-shadow: 0 0 8px rgba(74,222,128,0.4); transition: width 300ms ease;
      }

      .tl-icon-btn {
        background: transparent; border: 0; color: var(--color-text-faint);
        padding: 6px; border-radius: 6px; cursor: pointer;
        display: inline-flex; align-items: center; justify-content: center;
        transition: color 200ms, background 200ms;
      }
      .tl-icon-btn:hover { color: var(--color-text); background: var(--color-surface-2); }

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

      /* ── Checkboxes ── */
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

      .tl-children { margin-left: 7px; padding-left: 16px; border-left: 2px solid var(--tl-green-border); margin-top: 2px; margin-bottom: 4px; }
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
        cursor: pointer; display: inline-flex; align-items: center; transition: all 200ms;
      }
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
        background: var(--color-surface); border: 1px solid var(--tl-green-border);
        color: var(--color-text); padding: 12px 20px; border-radius: 10px;
        font-size: 14px; font-weight: 500; box-shadow: var(--tl-green-glow);
        z-index: 100; white-space: nowrap;
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

      /* ── Responsive ── */
      @media (max-width: 768px) { .tl-app-root { max-width: 100%; } }

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
        .tl-form-card { padding: 20px; }
        .tl-project-header { padding: 16px 18px 10px; flex-wrap: wrap; }
        .tl-progress { padding: 4px 18px 18px; }
        .tl-plabel { font-size: 11px; }
      }
      @media (prefers-reduced-motion: reduce) {
        *, *::before, *::after { transition-duration: 0.01ms !important; animation-duration: 0.01ms !important; }
      }
    `})}Ne.createRoot(document.getElementById("root")).render(e.jsx(Se.StrictMode,{children:e.jsx(Fe,{})}));
