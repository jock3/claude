import{c as Ne,r as p,j as e,X as le,a as Se,R as ze}from"./x-CKpBcyvF.js";/* empty css                        */import{s as Q,P as H,C as be,L as Ce,T as Ee}from"./supabase-DFv7ZDbz.js";import{C as ie}from"./check-B7FBZ1Am.js";/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Te=Ne("Calendar",[["path",{d:"M8 2v4",key:"1cmpym"}],["path",{d:"M16 2v4",key:"4m81vk"}],["rect",{width:"18",height:"18",x:"3",y:"4",rx:"2",key:"1hopcy"}],["path",{d:"M3 10h18",key:"8toen8"}]]);async function De(l){const{data:i}=await Q.from("profiles").select("id, name").eq("name",l).maybeSingle();if(i)return i;const{data:x}=await Q.from("profiles").insert({name:l}).select("id, name").single();return x}async function _e(l){const{data:i}=await Q.from("projects").select("*").eq("profile_id",l).order("created_at",{ascending:!1});return i||[]}async function he(l){await Q.from("projects").upsert(l)}async function Ie(l){await Q.from("projects").delete().eq("id",l)}const V=[{key:"todo",label:"Att göra",color:"#6A6964"},{key:"doing",label:"Pågår",color:"#2E6FD4"},{key:"review",label:"Granskning",color:"#E0A93B"},{key:"done",label:"Klar",color:"#5BAE6E"}],se="ailabb_profile_id",ce="ailabb_profile_name",me=()=>{const l=new Date;return l.setMonth(l.getMonth()+1),l.toISOString().split("T")[0]},Me=l=>new Date(l).toLocaleDateString("sv-SE"),Y=l=>{const i=new Date;i.setHours(0,0,0,0);const x=new Date(l);return x.setHours(0,0,0,0),Math.round((x-i)/864e5)},$e=l=>{let i=0,x=0;for(const g of l||[]){x++,g.done&&i++;for(const u of g.children||[]){x++,u.done&&i++;for(const m of u.children||[])x++,m.done&&i++}}return{done:i,total:x}},Fe=()=>e.jsx("a",{href:"../../",className:"tl-logo","aria-label":"Gustav Mattsson — AI Labb",children:e.jsxs("svg",{fill:"currentColor",xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 623.04 583.35","aria-hidden":"true",children:[e.jsx("defs",{children:e.jsx("style",{children:`
          .logo-cls-1 { font-size: 193.17px; }
          .logo-cls-1, .logo-cls-2 {
            font-family: Montserrat-Bold, Montserrat;
            font-weight: 700;
            opacity: .91;
          }
          .logo-cls-2 { font-size: 189.12px; }
        `})}),e.jsx("path",{d:"M232.17,3c7.02-7.42,19.19.1,15.62,9.67-9.95,26.68-27.78,61.43-58.57,88.15-55.09,47.8-70.9,80.05-80.29,122.79-.83,3.78-4.33,6.37-8.19,6.09l-13.61-.98c-5.61-.4-9.92-5.11-9.82-10.73.52-29.28,13.8-103.04,70.2-141.85C183.44,51.41,212.65,23.65,232.17,3Z"}),e.jsx("path",{d:"M74.3,234.65s-22.36,17.42-24.83,29.76c-1.77,8.84,31.32,11.98,50.2,13.05,6.54.37,11.77-5.35,10.78-11.82-1.08-7.08-2.45-16.17-3.61-24.42-2.35-16.66-32.55-6.56-32.55-6.56Z"}),e.jsx("path",{d:"M51.87,290.51s-38.3,9.33-38.3,64.83,12.33,99.9-13.57,145.54c0,0,96.6-69.22,110.75-161.62,3.8-24.79-9.47-49.48-32.56-59.27-8.67-3.68-14.96,9.96-26.32,10.52Z"}),e.jsxs("text",{className:"logo-cls-1",transform:"translate(144.86 300.16)",children:[e.jsx("tspan",{x:"0",y:"0",children:"0"}),e.jsx("tspan",{x:"130",y:"0",children:"100"})]}),e.jsxs("text",{className:"logo-cls-2",transform:"translate(259.2 447.19) scale(1.04 1)",children:[e.jsx("tspan",{x:"0",y:"0",children:"0"}),e.jsx("tspan",{x:"127.28",y:"0",children:"111"})]})]})});function Pe(){const[l,i]=p.useState(()=>document.documentElement.getAttribute("data-theme")||"dark"),x=()=>{const g=l==="dark"?"light":"dark";document.documentElement.setAttribute("data-theme",g),localStorage.setItem("ailabb_theme",g),i(g)};return e.jsx("button",{className:"tl-theme-toggle",onClick:x,"aria-label":"Byt tema",children:l==="dark"?e.jsxs("svg",{width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"1.75",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("circle",{cx:"12",cy:"12",r:"4"}),e.jsx("path",{d:"M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"})]}):e.jsx("svg",{width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"1.75",strokeLinecap:"round",strokeLinejoin:"round",children:e.jsx("path",{d:"M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"})})})}function Le({activeUser:l,onSwitch:i}){const[x,g]=p.useState(!1);return p.useEffect(()=>{if(!x)return;const u=()=>g(!1),m=setTimeout(()=>document.addEventListener("click",u),0);return()=>{clearTimeout(m),document.removeEventListener("click",u)}},[x]),e.jsxs("div",{className:"tl-user-menu",onClick:u=>u.stopPropagation(),children:[e.jsxs("button",{className:"tl-user-chip",onClick:()=>g(!x),children:[e.jsx("span",{className:"tl-avatar",children:l[0].toUpperCase()}),e.jsx("span",{className:"tl-user-name",children:l}),e.jsx(be,{size:12,style:{transform:x?"rotate(180deg)":"rotate(0)",transition:"transform 200ms"}})]}),x&&e.jsx("div",{className:"tl-user-dropdown",children:e.jsxs("button",{onClick:()=>{g(!1),i()},children:[e.jsx(Ce,{size:14}),"Byt användare"]})})]})}function de({value:l,onChange:i,onBlur:x,onKeyDown:g,fontSize:u,fontWeight:m}){return e.jsx("input",{autoFocus:!0,className:"tl-edit-input",value:l,onChange:i,onBlur:x,onKeyDown:g,style:u?{fontSize:u,fontWeight:m}:{}})}function ge({project:l,onUpdate:i,onDelete:x,onArchive:g,isArchived:u=!1,showToast:m}){const[$,U]=p.useState(""),[C,F]=p.useState({}),[N,P]=p.useState({}),[X,L]=p.useState(new Set),[E,q]=p.useState(new Set),[b,v]=p.useState(null),[T,D]=p.useState(""),[S,oe]=p.useState(u),[ne,A]=p.useState(!1),[ee,_]=p.useState(!1),[G,K]=p.useState(l.description||""),w=p.useRef(null),h=l.todos||[],k=Y(l.deadline),te=l.checkpoint===V.length-1,{done:I,total:z}=$e(h),O=()=>Date.now().toString()+Math.random().toString(36).slice(2,6),B=()=>new Date().toISOString(),M=(t,r)=>{v(t),D(r)},o=()=>{if(!b)return;const t=T.trim();if(!t){v(null);return}if(b==="__name__"){i({name:t}),v(null);return}const r=b.split("/");if(r.length===1)i({todos:h.map(n=>n.id===r[0]?{...n,text:t}:n)});else if(r.length===2){const[n,a]=r;i({todos:h.map(s=>s.id!==n?s:{...s,children:(s.children||[]).map(d=>d.id===a?{...d,text:t}:d)})})}else{const[n,a,s]=r;i({todos:h.map(d=>d.id!==n?d:{...d,children:(d.children||[]).map(R=>R.id!==a?R:{...R,children:(R.children||[]).map(ae=>ae.id===s?{...ae,text:t}:ae)})})})}v(null)},c=t=>{A(!1),t&&i({deadline:t})},y=()=>{_(!1),i({description:G.trim()})},j=()=>{$.trim()&&(i({todos:[...h,{id:O(),text:$.trim(),done:!1,createdAt:B(),children:[]}]}),U(""))},f=t=>i({todos:h.map(r=>r.id===t?{...r,done:!r.done}:r)}),W=t=>{w.current=h;const r=h.filter(n=>n.id!==t);i({todos:r}),L(n=>{const a=new Set(n);return a.delete(t),a}),m&&m("Todo raderad",()=>i({todos:w.current}))},Z=t=>L(r=>{const n=new Set(r);return n.has(t)?n.delete(t):n.add(t),n}),pe=t=>{const r=(C[t]||"").trim();r&&(i({todos:h.map(n=>n.id!==t?n:{...n,children:[...n.children||[],{id:O(),text:r,done:!1,createdAt:B(),children:[]}]})}),F(n=>({...n,[t]:""})))},ve=(t,r)=>i({todos:h.map(n=>n.id!==t?n:{...n,children:(n.children||[]).map(a=>a.id===r?{...a,done:!a.done}:a)})}),we=(t,r)=>{w.current=h;const n=h.map(a=>a.id!==t?a:{...a,children:(a.children||[]).filter(s=>s.id!==r)});i({todos:n}),q(a=>{const s=new Set(a);return s.delete(`${t}/${r}`),s}),m&&m("Todo raderad",()=>i({todos:w.current}))},xe=(t,r)=>{const n=`${t}/${r}`;q(a=>{const s=new Set(a);return s.has(n)?s.delete(n):s.add(n),s})},ue=(t,r)=>{const n=`${t}/${r}`,a=(N[n]||"").trim();a&&(i({todos:h.map(s=>s.id!==t?s:{...s,children:(s.children||[]).map(d=>d.id!==r?d:{...d,children:[...d.children||[],{id:O(),text:a,done:!1,createdAt:B()}]})})}),P(s=>({...s,[n]:""})))},ke=(t,r,n)=>i({todos:h.map(a=>a.id!==t?a:{...a,children:(a.children||[]).map(s=>s.id!==r?s:{...s,children:(s.children||[]).map(d=>d.id===n?{...d,done:!d.done}:d)})})}),ye=(t,r,n)=>{w.current=h;const a=h.map(s=>s.id!==t?s:{...s,children:(s.children||[]).map(d=>d.id!==r?d:{...d,children:(d.children||[]).filter(R=>R.id!==n)})});i({todos:a}),m&&m("Todo raderad",()=>i({todos:w.current}))};let re="",J="";k<0?(re="overdue",J=`${Math.abs(k)} d försenad`):k===0?(re="urgent",J="Idag"):k<=7?(re="urgent",J=`${k} d kvar`):J=`${k} d kvar`;const je=z>0?Math.round(I/z*100):0;return e.jsxs("div",{className:`tl-project ${u?"archived":""}`,children:[e.jsxs("div",{className:"tl-project-header",children:[e.jsx("button",{className:"tl-collapse-btn",onClick:()=>oe(t=>!t),"aria-label":S?"Expandera":"Minimera",children:e.jsx(be,{size:18,style:{transform:S?"rotate(-90deg)":"rotate(0)",transition:"transform 200ms"}})}),b==="__name__"?e.jsx("input",{autoFocus:!0,className:"tl-project-name-input",value:T,onChange:t=>D(t.target.value),onBlur:o,onKeyDown:t=>{t.key==="Enter"&&o(),t.key==="Escape"&&v(null)}}):e.jsx("h3",{className:"tl-project-name",onClick:()=>M("__name__",l.name),children:l.name}),z>0&&e.jsxs("span",{className:"tl-todo-counter",children:[I,"/",z," klara"]}),u&&l.archived_at&&e.jsxs("span",{className:"tl-archived-date",children:["Arkiverad ",Me(l.archived_at)]}),!u&&(ne?e.jsx("input",{autoFocus:!0,type:"date",className:"tl-deadline-input",defaultValue:l.deadline,onBlur:t=>c(t.target.value),onKeyDown:t=>{t.key==="Enter"&&c(t.target.value),t.key==="Escape"&&A(!1)}}):e.jsxs("div",{className:`tl-deadline-badge ${re}`,style:{cursor:"pointer"},onClick:()=>A(!0),children:[e.jsx(Te,{size:12}),J]})),te&&!u&&e.jsx("button",{className:"tl-archive-btn",onClick:g,children:"Arkivera"}),e.jsx("button",{className:"tl-icon-btn",onClick:x,"aria-label":"Ta bort projekt",children:e.jsx(Ee,{size:16})})]}),!S&&!u&&e.jsx("div",{className:"tl-project-desc-row",children:ee?e.jsx("input",{autoFocus:!0,className:"tl-desc-input",value:G,placeholder:"Lägg till beskrivning…",onChange:t=>K(t.target.value),onBlur:y,onKeyDown:t=>{t.key==="Enter"&&y(),t.key==="Escape"&&(_(!1),K(l.description||""))}}):e.jsx("span",{className:`tl-project-desc ${l.description?"":"empty"}`,onClick:()=>{K(l.description||""),_(!0)},children:l.description||"Lägg till beskrivning…"})}),z>0&&e.jsx("div",{className:"tl-project-progress-bar",children:e.jsx("div",{className:"tl-project-progress-fill",style:{width:`${je}%`}})}),!S&&e.jsxs(e.Fragment,{children:[e.jsx("div",{className:"tl-progress",children:V.map((t,r)=>{const n=r<=l.checkpoint;return e.jsxs(p.Fragment,{children:[e.jsxs("button",{className:`tl-progress-step ${r===l.checkpoint?"active":""}`,onClick:()=>i({checkpoint:r}),"aria-label":`Sätt status till ${t.label}`,children:[e.jsx("span",{className:"tl-pdot",style:n?{background:t.color,borderColor:t.color}:{}}),e.jsx("span",{className:"tl-plabel",children:t.label})]}),r<V.length-1&&e.jsx("span",{className:"tl-progress-line",style:r<l.checkpoint?{background:t.color}:{}})]},t.key)})}),e.jsxs("div",{className:"tl-todos",children:[h.length===0&&e.jsx("p",{className:"tl-empty-hint",children:"Inga todos ännu."}),h.map(t=>e.jsxs("div",{className:"tl-todo-block",children:[e.jsxs("div",{className:`tl-row l0 ${t.done?"done":""}`,children:[e.jsx("button",{className:`tl-circle-btn ${t.done?"checked":""}`,onClick:()=>f(t.id),"aria-label":"Markera klar",children:t.done&&e.jsx(ie,{size:10,strokeWidth:3})}),b===t.id?e.jsx(de,{value:T,onChange:r=>D(r.target.value),onBlur:o,onKeyDown:r=>{r.key==="Enter"&&o(),r.key==="Escape"&&v(null)}}):e.jsx("span",{className:"tl-row-text",onClick:()=>M(t.id,t.text),children:t.text}),e.jsx("button",{className:`tl-add-child-btn ${X.has(t.id)?"open":""}`,onClick:()=>Z(t.id),title:"Lägg till sub-todo",children:e.jsx(H,{size:11,strokeWidth:2.5})}),e.jsx("button",{className:"tl-icon-btn",onClick:()=>W(t.id),"aria-label":"Ta bort",children:e.jsx(le,{size:14})})]}),((t.children||[]).length>0||X.has(t.id))&&e.jsxs("div",{className:"tl-children",children:[(t.children||[]).map(r=>{const n=`${t.id}/${r.id}`;return e.jsxs("div",{className:"tl-todo-block",children:[e.jsxs("div",{className:`tl-row l1 ${r.done?"done":""}`,children:[e.jsx("button",{className:`tl-circle-btn sm ${r.done?"checked":""}`,onClick:()=>ve(t.id,r.id),"aria-label":"Markera klar",children:r.done&&e.jsx(ie,{size:8,strokeWidth:3})}),b===n?e.jsx(de,{value:T,onChange:a=>D(a.target.value),onBlur:o,onKeyDown:a=>{a.key==="Enter"&&o(),a.key==="Escape"&&v(null)}}):e.jsx("span",{className:"tl-row-text",onClick:()=>M(n,r.text),children:r.text}),e.jsx("button",{className:`tl-add-child-btn sm ${E.has(n)?"open":""}`,onClick:()=>xe(t.id,r.id),title:"Lägg till sub-sub-todo",children:e.jsx(H,{size:10,strokeWidth:2.5})}),e.jsx("button",{className:"tl-icon-btn",onClick:()=>we(t.id,r.id),"aria-label":"Ta bort",children:e.jsx(le,{size:13})})]}),((r.children||[]).length>0||E.has(n))&&e.jsxs("div",{className:"tl-children sub",children:[(r.children||[]).map(a=>{const s=`${t.id}/${r.id}/${a.id}`;return e.jsxs("div",{className:`tl-row l2 ${a.done?"done":""}`,children:[e.jsx("button",{className:`tl-circle-btn sm ${a.done?"checked":""}`,onClick:()=>ke(t.id,r.id,a.id),"aria-label":"Markera klar",children:a.done&&e.jsx(ie,{size:8,strokeWidth:3})}),b===s?e.jsx(de,{value:T,onChange:d=>D(d.target.value),onBlur:o,onKeyDown:d=>{d.key==="Enter"&&o(),d.key==="Escape"&&v(null)}}):e.jsx("span",{className:"tl-row-text",onClick:()=>M(s,a.text),children:a.text}),e.jsx("button",{className:"tl-icon-btn",onClick:()=>ye(t.id,r.id,a.id),"aria-label":"Ta bort",children:e.jsx(le,{size:12})})]},a.id)}),E.has(n)&&e.jsxs("div",{className:"tl-inline-add",children:[e.jsx("input",{autoFocus:!0,type:"text",placeholder:"Sub-sub-todo…",value:N[n]||"",onChange:a=>P(s=>({...s,[n]:a.target.value})),onKeyDown:a=>{a.key==="Enter"&&ue(t.id,r.id),a.key==="Escape"&&xe(t.id,r.id)}}),e.jsx("button",{onClick:()=>ue(t.id,r.id),disabled:!(N[n]||"").trim(),children:e.jsx(H,{size:12})})]})]})]},r.id)}),X.has(t.id)&&e.jsxs("div",{className:"tl-inline-add",children:[e.jsx("input",{autoFocus:!0,type:"text",placeholder:"Sub-todo…",value:C[t.id]||"",onChange:r=>F(n=>({...n,[t.id]:r.target.value})),onKeyDown:r=>{r.key==="Enter"&&pe(t.id),r.key==="Escape"&&Z(t.id)}}),e.jsx("button",{onClick:()=>pe(t.id),disabled:!(C[t.id]||"").trim(),children:e.jsx(H,{size:12})})]})]})]},t.id)),e.jsxs("div",{className:"tl-add-note",children:[e.jsx("input",{type:"text",placeholder:"Lägg till todo…",value:$,onChange:t=>U(t.target.value),onKeyDown:t=>t.key==="Enter"&&j()}),e.jsxs("button",{onClick:j,disabled:!$.trim(),children:[e.jsx(H,{size:14,strokeWidth:2.5}),"Lägg till"]})]})]})]})]})}function Ae(){const[l,i]=p.useState(null),[x,g]=p.useState(null),[u,m]=p.useState([]),[$,U]=p.useState(!0),[C,F]=p.useState(null),N=p.useRef(null),P=p.useRef({}),[X,L]=p.useState(!1),[E,q]=p.useState(""),[b,v]=p.useState(0),[T,D]=p.useState(me()),S=(o,c)=>{N.current&&clearTimeout(N.current),F({msg:o,undoFn:c||null}),N.current=setTimeout(()=>F(null),4e3)},oe=()=>{N.current&&clearTimeout(N.current),F(null)};p.useEffect(()=>{async function o(){let c=null;try{c=JSON.parse(localStorage.getItem("ailabb_active_user"))}catch{}if(!c){window.location.replace("../../");return}i(c);const y=localStorage.getItem(se),j=localStorage.getItem(ce);let f;if(y&&j===c)f=y;else{const Z=await De(c);if(!Z){window.location.replace("../../");return}f=Z.id,localStorage.setItem(se,f),localStorage.setItem(ce,c)}g(f);const W=await _e(f);m(W),U(!1)}o()},[]);const ne=()=>{localStorage.removeItem("ailabb_active_user"),localStorage.removeItem(se),localStorage.removeItem(ce),window.location.replace("../../")},A=()=>{q(""),v(0),D(me())},ee=async()=>{if(!E.trim())return;const o={id:Date.now().toString(),profile_id:x,name:E.trim(),checkpoint:b,deadline:T,description:"",todos:[],created_at:new Date().toISOString()};m(c=>[o,...c]),A(),L(!1);try{await he(o)}catch{S("Kunde inte spara ändringarna")}},_=(o,c)=>{const y=u.find(f=>f.id===o);if(!y)return;let j={...y,...c};c.checkpoint!==void 0&&c.checkpoint<V.length-1&&j.archived&&(j={...j,archived:!1,archived_at:null}),m(f=>f.map(W=>W.id===o?j:W)),P.current[o]&&clearTimeout(P.current[o]),P.current[o]=setTimeout(async()=>{try{await he({...j,profile_id:x})}catch{S("Kunde inte spara ändringarna")}},800)},G=o=>_(o,{archived:!0,archived_at:new Date().toISOString()}),K=async o=>{window.confirm("Ta bort projektet?")&&(m(c=>c.filter(y=>y.id!==o)),await Ie(o))},w=u.filter(o=>!o.archived),h=w.filter(o=>Y(o.deadline)<0),k=w.filter(o=>{const c=Y(o.deadline);return c>=0&&c<=7}),te=w.filter(o=>Y(o.deadline)>7),I=[...h,...k,...te],z=u.filter(o=>o.archived).sort((o,c)=>new Date(c.archived_at||0)-new Date(o.archived_at||0)),O=h.length,B=k.filter(o=>Y(o.deadline)===0).length,M=k.filter(o=>Y(o.deadline)>0).length+te.length;return $?e.jsxs(e.Fragment,{children:[e.jsx(fe,{}),e.jsx("div",{className:"tl-fullscreen-loader",children:"Laddar…"})]}):e.jsxs(e.Fragment,{children:[e.jsx(fe,{}),e.jsxs("div",{className:"tl-app-root",children:[e.jsxs("nav",{className:"tl-top-nav",children:[e.jsx(Fe,{}),e.jsxs("div",{className:"tl-nav-right",children:[e.jsxs("ul",{className:"tl-menu",children:[e.jsx("li",{children:e.jsx("a",{href:"../../",children:"Hem"})}),e.jsxs("li",{className:"tl-has-dropdown",children:[e.jsxs("a",{href:"#","aria-haspopup":"true",children:["Appar ",e.jsx("span",{className:"tl-chev","aria-hidden":"true",children:"▾"})]}),e.jsxs("ul",{className:"tl-dropdown",role:"menu",children:[e.jsx("li",{role:"none",children:e.jsx("a",{href:"../todo/",role:"menuitem",className:"active",children:"Todo"})}),e.jsx("li",{role:"none",children:e.jsx("a",{href:"../kampanj/",role:"menuitem",children:"Kampanjplanerare"})}),e.jsx("li",{role:"none",children:e.jsx("a",{href:"../seo-audit/",role:"menuitem",children:"SEO & GEO-granskning"})}),e.jsx("li",{role:"none",children:e.jsx("a",{href:"../trackr/",role:"menuitem",children:"Track3r"})})]})]})]}),e.jsx(Pe,{}),e.jsx(Le,{activeUser:l,onSwitch:ne})]})]}),e.jsxs("section",{className:"tl-hero",children:[e.jsxs("h1",{children:["Hej ",l,", redo att ",e.jsx("span",{className:"hand",children:"labba?"})]}),e.jsx("p",{children:"Liten plats för att hålla koll på pågående experiment. Skapa ett projekt, sätt en deadline och samla anteckningar längs vägen."})]}),X?e.jsxs("div",{className:"tl-form-card",children:[e.jsx("h2",{children:"Nytt projekt"}),e.jsxs("div",{className:"tl-field",children:[e.jsx("label",{className:"tl-field-label",children:"Projektnamn"}),e.jsx("input",{type:"text",placeholder:"t.ex. Bygg AI-labbet",value:E,onChange:o=>q(o.target.value),onKeyDown:o=>o.key==="Enter"&&ee(),autoFocus:!0})]}),e.jsxs("div",{className:"tl-field",children:[e.jsx("label",{className:"tl-field-label",children:"Status"}),e.jsx("div",{className:"tl-checkpoints",children:V.map((o,c)=>e.jsxs("button",{type:"button",className:`tl-cp-pill ${b===c?"active":""}`,onClick:()=>v(c),style:b===c?{borderColor:o.color,background:`${o.color}20`}:{},children:[e.jsx("span",{className:"tl-dot",style:{background:o.color}}),o.label]},o.key))})]}),e.jsxs("div",{className:"tl-field",children:[e.jsx("label",{className:"tl-field-label",children:"Deadline"}),e.jsx("input",{type:"date",value:T,onChange:o=>D(o.target.value)})]}),e.jsxs("div",{className:"tl-form-actions",children:[e.jsx("button",{className:"tl-btn-primary",onClick:ee,disabled:!E.trim(),children:"Skapa projekt"}),e.jsx("button",{className:"tl-btn-ghost",onClick:()=>{A(),L(!1)},children:"Avbryt"})]})]}):e.jsxs("button",{className:"tl-new-btn",onClick:()=>L(!0),children:[e.jsx(H,{size:18,strokeWidth:2.5}),"Nytt projekt"]}),e.jsxs("section",{style:{marginTop:28},children:[I.length>0&&e.jsxs("div",{className:"tl-summary-bar",children:[O>0&&e.jsxs("span",{children:[O," försenade"]}),B>0&&e.jsxs("span",{children:[B," idag"]}),M>0&&e.jsxs("span",{children:[M," pågående"]})]}),I.length===0&&z.length===0?e.jsxs("div",{className:"tl-empty-state",children:[e.jsx("h3",{children:"Inga projekt ännu"}),e.jsx("p",{children:"Skapa ditt första projekt för att komma igång."})]}):I.length===0?e.jsxs("div",{className:"tl-empty-state",children:[e.jsx("h3",{children:"Inga aktiva projekt"}),e.jsx("p",{children:"Alla projekt är arkiverade. Skapa ett nytt eller återställ ett nedan."})]}):I.map(o=>e.jsx(ge,{project:o,onUpdate:c=>_(o.id,c),onDelete:()=>K(o.id),onArchive:()=>G(o.id),showToast:S},o.id))]}),z.length>0&&e.jsxs("section",{className:"tl-archive-section",children:[e.jsx("h2",{className:"tl-archive-heading",children:"Arkiverade projekt"}),z.map(o=>e.jsx(ge,{project:o,isArchived:!0,onUpdate:c=>_(o.id,c),onDelete:()=>K(o.id),onArchive:()=>G(o.id),showToast:S},o.id))]})]}),C&&e.jsxs("div",{className:"tl-toast",children:[e.jsx("span",{children:C.msg}),C.undoFn&&e.jsx("button",{className:"tl-toast-undo",onClick:()=>{C.undoFn(),oe()},children:"Ångra"})]})]})}function fe(){return e.jsx("style",{children:`
      .tl-app-root, .tl-welcome-root {
        min-height: 100vh;
        margin: 0 auto;
        color: var(--color-text);
        font-family: var(--font-body, "Montserrat", sans-serif);
        -webkit-font-smoothing: antialiased;
      }
      .tl-app-root { max-width: 75%; padding: 32px 24px 96px; }
      .tl-welcome-root { max-width: 640px; padding: 32px 24px 96px; display: flex; flex-direction: column; }

      .tl-fullscreen-loader {
        min-height: 100vh; display: flex; align-items: center; justify-content: center;
        color: var(--color-text-faint); font-size: 15px;
        font-family: var(--font-body, "Montserrat", sans-serif);
      }
      .tl-loading { color: var(--color-text-faint); font-size: 13px; margin: 0; }

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
        height: 2px; background: var(--color-red); border-radius: 2px;
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
      .tl-dropdown a::after { display: none; }

      .tl-user-menu { position: relative; }
      .tl-user-chip {
        display: inline-flex; align-items: center; gap: 8px;
        padding: 5px 12px 5px 5px; border-radius: 999px;
        border: 1px solid var(--color-border); background: var(--color-surface);
        color: var(--color-text); font-family: inherit;
        font-size: 13px; font-weight: 500; cursor: pointer; transition: all 200ms;
      }
      .tl-user-chip:hover { border-color: var(--color-border-strong); background: var(--color-surface-2); }
      .tl-user-chip .tl-user-name { white-space: nowrap; max-width: 140px; overflow: hidden; text-overflow: ellipsis; }
      .tl-avatar {
        width: 26px; height: 26px; border-radius: 50%;
        background: var(--color-red); color: #FFFFFF;
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

      .tl-welcome-nav { margin-bottom: 64px; }
      .tl-welcome-card { flex: 1; display: flex; flex-direction: column; justify-content: center; }
      .tl-welcome-card h1 {
        font-size: clamp(40px, 6vw, 64px); font-weight: 700;
        line-height: 1.05; letter-spacing: -0.02em; margin: 0 0 20px;
      }
      .tl-welcome-card h1 .hand {
        font-family: var(--font-hand, "Patrick Hand", cursive);
        color: var(--color-red); font-weight: 400;
        display: inline-block; transform: rotate(-2deg); font-size: 1.1em;
      }
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
      .tl-user-pill:hover { border-color: var(--color-border-strong); background: var(--color-surface-2); }
      .tl-user-pill:disabled { opacity: 0.5; cursor: not-allowed; }

      .tl-hero { margin-bottom: 32px; }
      .tl-hero h1 { font-size: clamp(32px, 4.5vw, 48px); font-weight: 700; line-height: 1.1; letter-spacing: -0.02em; margin: 0 0 12px; }
      .tl-hero h1 .hand {
        font-family: var(--font-hand, "Patrick Hand", cursive);
        color: var(--color-red); font-weight: 400;
        display: inline-block; transform: rotate(-2deg);
      }
      .tl-hero p { color: var(--color-text-muted); font-size: 17px; line-height: 1.6; margin: 0; max-width: 60ch; }

      .tl-new-btn, .tl-btn-primary {
        background: var(--color-red); color: var(--color-text-inverse); border: 0;
        font-family: inherit; font-weight: 600; font-size: 14px;
        cursor: pointer; transition: background 200ms, transform 100ms;
        display: inline-flex; align-items: center; gap: 8px;
      }
      .tl-new-btn { padding: 12px 20px; border-radius: 10px; }
      .tl-btn-primary { padding: 11px 22px; border-radius: 10px; }
      .tl-new-btn:hover, .tl-btn-primary:hover { background: var(--color-red-hover); }
      .tl-new-btn:active { transform: scale(0.98); }
      .tl-btn-primary:disabled { background: var(--color-surface-3); color: var(--color-text-faint); cursor: not-allowed; }
      .tl-btn-ghost {
        background: transparent; color: var(--color-text-muted); border: 0;
        padding: 11px 14px; border-radius: 10px; font-family: inherit;
        font-weight: 500; font-size: 14px; cursor: pointer; transition: color 200ms;
      }
      .tl-btn-ghost:hover { color: var(--color-text); }

      .tl-form-card { background: var(--color-surface); border: 1px solid var(--color-border); border-radius: 16px; padding: 28px; margin: 8px 0 32px; }
      .tl-form-card h2 { font-size: 20px; font-weight: 600; margin: 0 0 20px; }
      .tl-field { margin-bottom: 20px; }
      .tl-field-label { font-size: 11px; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; color: var(--color-text-muted); margin-bottom: 8px; display: block; }

      .tl-app-root input[type="text"],
      .tl-app-root input[type="date"],
      .tl-welcome-root input[type="text"] {
        background: var(--color-surface-2); border: 1px solid var(--color-border);
        color: var(--color-text); font-family: inherit; font-size: 16px;
        padding: 11px 14px; border-radius: 10px; width: 100%;
        outline: none; transition: border-color 200ms; box-sizing: border-box;
      }
      .tl-app-root input[type="text"]:focus,
      .tl-app-root input[type="date"]:focus,
      .tl-welcome-root input[type="text"]:focus { border-color: var(--color-blue); }
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

      .tl-summary-bar {
        font-size: 13px; color: var(--color-text-muted); margin-bottom: 12px;
        display: flex; gap: 12px; flex-wrap: wrap;
      }
      .tl-summary-bar span::after { content: ' ·'; }
      .tl-summary-bar span:last-child::after { content: ''; }

      .tl-project { background: var(--color-surface); border: 1px solid var(--color-border); border-radius: 16px; margin-bottom: 16px; overflow: hidden; }
      .tl-project.archived { background: var(--color-surface-2); border-color: var(--color-border); }
      .tl-project.archived .tl-project-name { opacity: 0.85; }
      .tl-project-header { padding: 20px 24px 12px; display: flex; align-items: center; gap: 12px; }
      .tl-collapse-btn {
        background: transparent; border: 0; color: var(--color-text-faint);
        padding: 2px; margin-left: -4px; border-radius: 6px; cursor: pointer;
        display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0;
        transition: color 200ms, background 200ms;
      }
      .tl-collapse-btn:hover { color: var(--color-text); background: var(--color-surface-2); }
      .tl-archive-btn {
        background: transparent; border: 1px solid var(--color-border-strong);
        color: var(--color-text-muted); padding: 6px 14px; border-radius: 999px;
        font-family: inherit; font-size: 12px; font-weight: 600; cursor: pointer;
        white-space: nowrap; transition: all 200ms;
      }
      .tl-archive-btn:hover { background: var(--color-success); border-color: var(--color-success); color: #FFFFFF; }
      .tl-archived-date { font-size: 12px; font-weight: 500; color: var(--color-text-faint); white-space: nowrap; }
      .tl-archive-section { margin-top: 48px; }
      .tl-archive-heading {
        font-size: 13px; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase;
        color: var(--color-text-faint); margin: 0 0 16px; padding-bottom: 12px;
        border-bottom: 1px solid var(--color-border);
      }
      .tl-project-name { font-size: 22px; font-weight: 700; margin: 0; flex: 1; word-break: break-word; cursor: text; border-radius: 6px; padding: 2px 4px; margin-left: -4px; transition: background 150ms; }
      .tl-project-name:hover { background: var(--color-surface-2); }
      .tl-project-name-input { flex: 1; font-size: 22px; font-weight: 700; background: var(--color-surface); border: 1px solid var(--color-blue); border-radius: 8px; padding: 2px 8px; outline: none; margin-left: -4px; color: var(--color-text); font-family: inherit; width: 0; }
      .tl-deadline-badge {
        display: inline-flex; align-items: center; gap: 6px;
        font-size: 12px; font-weight: 500; color: var(--color-text-muted);
        padding: 5px 10px; border-radius: 999px;
        background: var(--color-surface-2); border: 1px solid var(--color-border); white-space: nowrap;
      }
      .tl-deadline-badge.urgent { color: var(--color-warn); border-color: rgba(224,169,59,0.3); }
      .tl-deadline-badge.overdue { background: rgba(214,59,59,0.12); color: var(--color-red); border-color: rgba(214,59,59,0.4); }
      .tl-deadline-input {
        font-size: 12px; font-weight: 500; color: var(--color-text);
        padding: 4px 8px; border-radius: 999px; border: 1px solid var(--color-blue);
        background: var(--color-surface); font-family: inherit; outline: none;
        width: auto; white-space: nowrap; box-sizing: border-box;
      }
      .tl-todo-counter {
        font-size: 12px; font-weight: 500; color: var(--color-text-faint);
        white-space: nowrap; flex-shrink: 0;
      }

      .tl-project-desc-row {
        padding: 0 24px 8px 52px;
      }
      .tl-project-desc {
        font-size: 13px; color: var(--color-text-muted); cursor: text;
        border-radius: 4px; padding: 2px 4px; display: inline-block;
        transition: background 150ms;
      }
      .tl-project-desc.empty {
        color: var(--color-text-faint); opacity: 0; transition: opacity 150ms;
      }
      .tl-project-desc-row:hover .tl-project-desc.empty { opacity: 1; }
      .tl-desc-input {
        font-size: 13px; color: var(--color-text); font-family: inherit;
        background: var(--color-surface); border: 1px solid var(--color-blue);
        border-radius: 6px; padding: 3px 8px; outline: none;
        width: 100%; box-sizing: border-box;
      }

      .tl-project-progress-bar {
        height: 3px; background: var(--color-border); width: 100%;
      }
      .tl-project-progress-fill {
        height: 100%; background: var(--color-success); transition: width 300ms ease;
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
      .tl-todos { border-top: 1px solid var(--color-border); padding: 14px 24px 18px; background: rgba(128,128,128,0.04); }
      .tl-empty-hint { font-size: 13px; color: var(--color-text-faint); margin: 4px 0 12px; font-style: italic; }

      .tl-todo-block { margin-bottom: 1px; }

      .tl-row { display: flex; align-items: flex-start; gap: 8px; padding: 5px 0; }
      .tl-row.done .tl-row-text { text-decoration: line-through; color: var(--color-text-faint); }
      .tl-row-text {
        flex: 1; word-break: break-word; padding-top: 1px;
        transition: color 200ms; cursor: text; border-radius: 4px;
      }
      .tl-row-text:hover { background: var(--color-surface-2); }
      .tl-row.l0 .tl-row-text { font-size: 16px; font-weight: 500; color: var(--color-text); }
      .tl-row.l1 .tl-row-text { font-size: 14px; font-weight: 400; color: var(--color-text); }
      .tl-row.l2 .tl-row-text { font-size: 13px; font-weight: 400; color: var(--color-text-muted); }
      .tl-row.l0 { padding: 6px 0; }
      .tl-row.l1 { padding: 4px 0; }
      .tl-row.l2 { padding: 3px 0; }

      .tl-circle-btn {
        width: 18px; height: 18px; border-radius: 50%;
        border: 2px solid var(--color-border-strong);
        background: var(--color-surface); cursor: pointer;
        flex-shrink: 0; margin-top: 2px; padding: 0;
        display: inline-flex; align-items: center; justify-content: center;
        transition: all 150ms; color: transparent;
      }
      .tl-circle-btn.sm { width: 15px; height: 15px; margin-top: 3px; }
      .tl-circle-btn:hover { border-color: var(--color-success); background: rgba(31,122,58,0.08); color: var(--color-success); }
      .tl-circle-btn.checked { background: var(--color-success); border-color: var(--color-success); color: white; }

      .tl-edit-input {
        flex: 1; background: var(--color-surface);
        border: 1px solid var(--color-blue); border-radius: 6px;
        color: var(--color-text); font-family: inherit; font-size: inherit;
        padding: 1px 8px; outline: none; min-width: 0;
      }

      .tl-children {
        margin-left: 7px; padding-left: 16px;
        border-left: 2px solid var(--color-border);
        margin-top: 2px; margin-bottom: 4px;
      }
      .tl-children.sub { padding-left: 14px; }

      .tl-add-child-btn {
        background: transparent; border: 0;
        color: var(--color-text-faint); padding: 3px 4px; border-radius: 4px;
        cursor: pointer; display: inline-flex; align-items: center;
        transition: color 150ms, background 150ms; flex-shrink: 0; margin-top: 2px;
      }
      .tl-add-child-btn:hover { color: var(--color-text-muted); background: var(--color-surface-2); }
      .tl-add-child-btn.open { color: var(--color-text); background: var(--color-surface-3); }

      .tl-inline-add { display: flex; gap: 6px; padding: 6px 0 4px; }
      .tl-inline-add input { flex: 1; padding: 6px 10px; font-size: 13px; border-radius: 8px; }
      .tl-inline-add button {
        padding: 6px 10px; background: var(--color-surface-3);
        border: 1px solid var(--color-border-strong); color: var(--color-text);
        border-radius: 8px; font-family: inherit; font-size: 13px;
        cursor: pointer; display: inline-flex; align-items: center;
        transition: all 200ms;
      }
      .tl-inline-add button:hover:not(:disabled) { background: var(--color-border); }
      .tl-inline-add button:disabled { opacity: 0.35; cursor: not-allowed; }

      .tl-add-note { display: flex; gap: 8px; margin-top: 12px; }
      .tl-add-note input { flex: 1; padding: 9px 12px; font-size: 14px; }
      .tl-add-note button {
        padding: 9px 14px; background: var(--color-surface-3);
        border: 1px solid var(--color-border-strong); color: var(--color-text);
        border-radius: 10px; font-family: inherit; font-weight: 500; font-size: 13px;
        cursor: pointer; display: inline-flex; align-items: center; gap: 6px;
        transition: all 200ms; white-space: nowrap;
      }
      .tl-add-note button:hover:not(:disabled) { background: var(--color-border); }
      .tl-add-note button:disabled { opacity: 0.5; cursor: not-allowed; }

      .tl-empty-state {
        text-align: center; padding: 56px 24px; color: var(--color-text-muted);
        border: 1px dashed var(--color-border); border-radius: 16px;
      }
      .tl-empty-state h3 { color: var(--color-text); margin: 0 0 8px; font-weight: 600; }
      .tl-empty-state p { margin: 0; font-size: 14px; }

      .tl-toast {
        position: fixed; bottom: 32px; left: 50%; transform: translateX(-50%);
        background: var(--color-text); color: var(--color-text-inverse);
        padding: 12px 20px; border-radius: 10px; font-size: 14px; font-weight: 500;
        box-shadow: var(--shadow-lg); z-index: 100; white-space: nowrap;
        display: inline-flex; align-items: center; gap: 12px;
        animation: tl-toast-in 200ms ease;
      }
      .tl-toast-undo {
        background: transparent; border: 0; color: var(--color-text-inverse);
        font-family: inherit; font-size: 14px; font-weight: 700;
        cursor: pointer; padding: 0; text-decoration: underline; opacity: 0.85;
        transition: opacity 150ms;
      }
      .tl-toast-undo:hover { opacity: 1; }
      @keyframes tl-toast-in {
        from { opacity: 0; transform: translateX(-50%) translateY(8px); }
        to   { opacity: 1; transform: translateX(-50%) translateY(0); }
      }

      @media (max-width: 540px) {
        .tl-top-nav { margin-bottom: 32px; }
        .tl-nav-right { gap: 16px; }
        .tl-menu { gap: 16px; }
        .tl-user-chip .tl-user-name { max-width: 80px; }
        .tl-form-card { padding: 20px; }
        .tl-project-header { padding: 16px 18px 10px; flex-wrap: wrap; }
        .tl-progress { padding: 4px 18px 18px; }
        .tl-plabel { font-size: 11px; }
        .tl-notes { padding: 12px 18px 16px; }
        .tl-welcome-input { flex-direction: column; }
        .tl-welcome-input button { width: 100%; }
      }
    `})}Se.createRoot(document.getElementById("root")).render(e.jsx(ze.StrictMode,{children:e.jsx(Ae,{})}));
