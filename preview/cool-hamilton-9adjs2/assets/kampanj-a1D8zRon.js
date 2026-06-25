import"./modulepreload-polyfill-B5Qt9EMX.js";/* empty css                        */import{r as h,j as e,c as se,R as ie}from"./client-DA9KcuQA.js";import{s as M,P as H,C as Z,L as ce,T as de}from"./supabase-Dq3kB0jD.js";import{X as pe}from"./x-Ur_tvLsE.js";async function me(t){const{data:a}=await M.from("profiles").select("id, name").eq("name",t).maybeSingle();if(a)return a;const{data:r}=await M.from("profiles").insert({name:t}).select("id, name").single();return r}async function xe(t){const{data:a}=await M.from("campaigns").select("*").eq("profile_id",t).order("created_at",{ascending:!1});return a||[]}async function E(t){await M.from("campaigns").upsert(t)}async function ue(t){await M.from("campaigns").delete().eq("id",t)}const K=["Instagram","Facebook","TikTok","LinkedIn","Google Ads","YouTube","X","Snapchat"],z={inaktiv:{key:"inaktiv",label:"Inaktiv",short:"Inaktiv",color:"#6A6964"},schemalagd:{key:"schemalagd",label:"Schemalagd",short:"Schemalagd",color:"#E0A93B"},aktiv:{key:"aktiv",label:"Aktiv",short:"Aktiv",color:"#5BAE6E"},klar:{key:"klar",label:"Klar",short:"Klar",color:"#2E6FD4"}},F={upcoming:{key:"upcoming",label:"Kommande",color:"#6A6964"},active:{key:"active",label:"Pågår",color:"#5BAE6E"},completed:{key:"completed",label:"Avslutad",color:"#2E6FD4"}},$="ailabb_profile_id",L="ailabb_profile_name";function O(){return new Date().toISOString().split("T")[0]}function B(t){const a=new Date;return a.setDate(a.getDate()+t),a.toISOString().split("T")[0]}function C(t){return new Date(t).toLocaleDateString("sv-SE",{day:"numeric",month:"short"})}function X(t){return!t||isNaN(t)?"0 kr":new Intl.NumberFormat("sv-SE").format(t)+" kr"}function J(t,a){const r=new Date;r.setHours(0,0,0,0);const s=new Date(t);s.setHours(0,0,0,0);const l=new Date(a);return l.setHours(0,0,0,0),r<s?F.upcoming:r>l?F.completed:F.active}function R(t){const a=new Date;a.setHours(0,0,0,0);const r=new Date(t);return r.setHours(0,0,0,0),a<r?"schemalagd":"aktiv"}function V(t){if(t.status==="schemalagd"){const a=new Date;a.setHours(0,0,0,0);const r=new Date(t.start);if(r.setHours(0,0,0,0),a>=r)return{...t,status:"aktiv"}}return t}function ge(t){let a=!1;return{campaigns:t.map(s=>({...s,platforms:(s.platforms||[]).map(l=>{const n=V(l);return n!==l&&(a=!0),n})})),changed:a}}function fe(t,a){const r=[],s=new Date(t),l=new Date(a),n=new Date(s.getFullYear(),s.getMonth(),1);for(;n<=l;)r.push({date:new Date(n),label:n.toLocaleDateString("sv-SE",{month:"short"}).replace(".","")}),n.setMonth(n.getMonth()+1);return r}function D(t,a,r){const s=new Date(t).getTime(),l=new Date(a).getTime(),n=new Date(r).getTime();return n===l?0:Math.max(0,Math.min(100,(s-l)/(n-l)*100))}function A(t,a){return{name:"",budget:0,start:t,end:a,status:R(t)}}const he=()=>e.jsx("a",{href:"../../",className:"kl-logo","aria-label":"Gustav Mattsson — AI Labb",children:e.jsxs("svg",{fill:"currentColor",xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 623.04 583.35","aria-hidden":"true",children:[e.jsx("defs",{children:e.jsx("style",{children:`
          .logo-cls-1 { font-size: 193.17px; }
          .logo-cls-1, .logo-cls-2 {
            font-family: Montserrat-Bold, Montserrat;
            font-weight: 700;
            opacity: .91;
          }
          .logo-cls-2 { font-size: 189.12px; }
        `})}),e.jsx("path",{d:"M232.17,3c7.02-7.42,19.19.1,15.62,9.67-9.95,26.68-27.78,61.43-58.57,88.15-55.09,47.8-70.9,80.05-80.29,122.79-.83,3.78-4.33,6.37-8.19,6.09l-13.61-.98c-5.61-.4-9.92-5.11-9.82-10.73.52-29.28,13.8-103.04,70.2-141.85C183.44,51.41,212.65,23.65,232.17,3Z"}),e.jsx("path",{d:"M74.3,234.65s-22.36,17.42-24.83,29.76c-1.77,8.84,31.32,11.98,50.2,13.05,6.54.37,11.77-5.35,10.78-11.82-1.08-7.08-2.45-16.17-3.61-24.42-2.35-16.66-32.55-6.56-32.55-6.56Z"}),e.jsx("path",{d:"M51.87,290.51s-38.3,9.33-38.3,64.83,12.33,99.9-13.57,145.54c0,0,96.6-69.22,110.75-161.62,3.8-24.79-9.47-49.48-32.56-59.27-8.67-3.68-14.96,9.96-26.32,10.52Z"}),e.jsxs("text",{className:"logo-cls-1",transform:"translate(144.86 300.16)",children:[e.jsx("tspan",{x:"0",y:"0",children:"0"}),e.jsx("tspan",{x:"130",y:"0",children:"100"})]}),e.jsxs("text",{className:"logo-cls-2",transform:"translate(259.2 447.19) scale(1.04 1)",children:[e.jsx("tspan",{x:"0",y:"0",children:"0"}),e.jsx("tspan",{x:"127.28",y:"0",children:"111"})]})]})});function ke(){const[t,a]=h.useState(()=>document.documentElement.getAttribute("data-theme")||"dark"),r=()=>{const s=t==="dark"?"light":"dark";document.documentElement.setAttribute("data-theme",s),localStorage.setItem("ailabb_theme",s),a(s)};return e.jsx("button",{className:"kl-theme-toggle",onClick:r,"aria-label":"Byt tema",children:t==="dark"?e.jsxs("svg",{width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"1.75",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("circle",{cx:"12",cy:"12",r:"4"}),e.jsx("path",{d:"M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"})]}):e.jsx("svg",{width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"1.75",strokeLinecap:"round",strokeLinejoin:"round",children:e.jsx("path",{d:"M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"})})})}function be({activeUser:t,onSwitch:a}){const[r,s]=h.useState(!1);return h.useEffect(()=>{if(!r)return;const l=()=>s(!1),n=setTimeout(()=>document.addEventListener("click",l),0);return()=>{clearTimeout(n),document.removeEventListener("click",l)}},[r]),e.jsxs("div",{className:"kl-user-menu",onClick:l=>l.stopPropagation(),children:[e.jsxs("button",{className:"kl-user-chip",onClick:()=>s(!r),children:[e.jsx("span",{className:"kl-avatar",children:t[0].toUpperCase()}),e.jsx("span",{className:"kl-user-name",children:t}),e.jsx(Z,{size:12,style:{transform:r?"rotate(180deg)":"rotate(0)",transition:"transform 200ms"}})]}),r&&e.jsx("div",{className:"kl-user-dropdown",children:e.jsxs("button",{onClick:()=>{s(!1),a()},children:[e.jsx(ce,{size:14}),"Byt användare"]})})]})}function ve({start:t,end:a}){const r=new Date(t),s=new Date(a),l=new Date,n=s-r,p=Math.max(0,Math.min(n,l-r)),i=n>0?p/n*100:0,k=J(t,a),v=k.key==="active",m=k.key==="completed",u=Math.max(1,Math.ceil(n/864e5)),w=m?100:v?i:0;return e.jsxs("div",{className:"kl-timeline",children:[e.jsxs("div",{className:"kl-timeline-labels",children:[e.jsx("span",{children:C(t)}),e.jsxs("span",{className:"duration",children:[u," ",u===1?"dag":"dagar"]}),e.jsx("span",{children:C(a)})]}),e.jsxs("div",{className:"kl-timeline-bar",style:{marginBottom:v?24:0},children:[e.jsx("div",{className:"kl-timeline-fill",style:{width:`${w}%`,background:k.color}}),v&&e.jsxs(e.Fragment,{children:[e.jsx("div",{className:"kl-timeline-today",style:{left:`${i}%`}}),e.jsx("div",{className:"kl-timeline-today-label",style:{left:`${i}%`},children:"Idag"})]})]})]})}function we({campaign:t}){const a=t.platforms||[];if(a.length===0)return null;const r=fe(t.start,t.end),s=new Date,l=s>=new Date(t.start)&&s<=new Date(t.end),n=l?D(s.toISOString(),t.start,t.end):null;return e.jsxs("div",{children:[e.jsx("div",{className:"kl-section-label",children:"Kampanjöversikt"}),e.jsxs("div",{className:"kl-cal",children:[e.jsx("div",{className:"kl-cal-header",children:r.map((p,i)=>e.jsx("span",{className:"kl-cal-month",style:{left:`${D(p.date,t.start,t.end)}%`},children:p.label},i))}),a.map((p,i)=>{const k=D(p.start,t.start,t.end),v=D(p.end,t.start,t.end),m=Math.max(.5,v-k),u=z[p.status]||z.aktiv,w=p.status==="inaktiv";return e.jsxs("div",{className:"kl-cal-row",children:[e.jsx("span",{className:`kl-cal-row-label ${w?"inaktiv":""}`,children:p.name||"Plattform"}),e.jsxs("div",{className:"kl-cal-track",children:[r.map((x,b)=>b===0?null:e.jsx("span",{className:"kl-cal-line",style:{left:`${D(x.date,t.start,t.end)}%`}},b)),l&&i===0&&e.jsx("span",{className:"kl-cal-today-line",style:{left:`${n}%`}}),e.jsx("div",{className:`kl-cal-bar ${w?"inaktiv":""}`,style:w?{left:`${k}%`,width:`${m}%`}:{left:`${k}%`,width:`${m}%`,background:u.color},title:`${p.name}: ${C(p.start)} – ${C(p.end)} (${u.short})`})]})]},i)})]})]})}function ye({campaign:t,onDelete:a,onUpdatePlatform:r,onAddPlatform:s}){const[l,n]=h.useState(!1),p=J(t.start,t.end),i=t.platforms||[],k=i.reduce((m,u)=>m+(Number(u.budget)||0),0),v=`${C(t.start)} – ${C(t.end)}`;return e.jsxs("div",{className:`kl-campaign ${l?"open":""}`,children:[e.jsxs("button",{className:"kl-campaign-header",onClick:()=>n(!l),"aria-expanded":l,children:[e.jsxs("div",{className:"kl-campaign-title",children:[e.jsx("span",{className:"kl-campaign-client",children:t.client}),e.jsx("span",{className:"kl-campaign-name",children:t.name})]}),e.jsx("span",{className:"kl-meta-pill",children:v}),e.jsx("span",{className:"kl-meta-pill budget",children:X(k)}),e.jsxs("span",{className:`kl-meta-pill status ${p.key}`,children:[e.jsx("span",{className:"sdot",style:{background:p.color}}),p.label]}),e.jsx(Z,{size:18,className:"kl-chevron"})]}),l&&e.jsxs("div",{className:"kl-campaign-body",children:[e.jsx(ve,{start:t.start,end:t.end}),e.jsxs("div",{children:[e.jsx("div",{className:"kl-section-label",children:"Plattformar"}),e.jsxs("div",{className:"kl-platform-list",children:[i.length===0?e.jsx("p",{className:"kl-pl-empty-hint",children:"Inga plattformar tillagda än."}):i.map((m,u)=>{const w=z[m.status]||z.aktiv;return e.jsxs("div",{className:`kl-pl-item ${m.status==="inaktiv"?"inaktiv":""}`,children:[e.jsxs("div",{className:"kl-pl-row-top",children:[e.jsxs("div",{className:"kl-pl-name",children:[e.jsx("span",{className:"pdot",style:{background:w.color}}),e.jsx("input",{type:"text",className:"kl-pl-inline-input kl-pl-name-input",value:m.name,onChange:x=>r(u,{name:x.target.value}),placeholder:"Plattform","aria-label":"Plattformnamn"})]}),e.jsxs("div",{className:"kl-pl-budget-edit",children:[e.jsx("input",{type:"number",className:"kl-pl-inline-input",min:"0",step:"100",value:m.budget||"",onChange:x=>r(u,{budget:Number(x.target.value)||0}),placeholder:"0","aria-label":"Budget"}),e.jsx("span",{className:"suffix",children:"kr"})]})]}),e.jsxs("div",{className:"kl-pl-row-bottom",children:[e.jsxs("div",{className:"kl-pl-dates-edit",children:[e.jsx("input",{type:"date",className:"kl-pl-inline-input",value:m.start,min:t.start,max:m.end||t.end,onChange:x=>r(u,{start:x.target.value}),"aria-label":"Startdatum"}),e.jsx("span",{className:"dash",children:"–"}),e.jsx("input",{type:"date",className:"kl-pl-inline-input",value:m.end,min:m.start||t.start,max:t.end,onChange:x=>r(u,{end:x.target.value}),"aria-label":"Slutdatum"})]}),e.jsx("div",{className:"kl-status-seg compact",role:"radiogroup","aria-label":"Plattformsstatus",children:Object.values(z).map(x=>e.jsxs("button",{type:"button",role:"radio","aria-checked":m.status===x.key,className:m.status===x.key?"active":"",onClick:()=>r(u,{status:x.key}),title:x.label,children:[e.jsx("span",{className:"sdot",style:{background:x.color}}),x.short]},x.key))})]})]},u)}),i.length>0&&e.jsxs("div",{className:"kl-pl-total",children:[e.jsx("span",{className:"label",children:"Total budget"}),e.jsx("span",{className:"value",children:X(k)})]}),e.jsxs("button",{className:"kl-pl-add-btn",onClick:s,children:[e.jsx(H,{size:14,strokeWidth:2.5}),"Lägg till plattform"]})]})]}),e.jsx(we,{campaign:t}),e.jsx("div",{className:"kl-body-actions",children:e.jsxs("button",{className:"kl-btn-danger",onClick:a,children:[e.jsx(de,{size:14}),"Ta bort kampanj"]})})]})]})}function je({platform:t,onChange:a,onRemove:r,canRemove:s,campaignStart:l,campaignEnd:n,suggestionIndex:p}){return e.jsxs("div",{className:"kl-platform-card",children:[e.jsxs("div",{className:"kl-pc-row top",children:[e.jsx("input",{type:"text",placeholder:K[p%K.length],value:t.name,onChange:i=>a({name:i.target.value}),list:"kl-platform-suggestions"}),e.jsxs("div",{className:"kl-pc-budget-wrap",children:[e.jsx("input",{type:"number",min:"0",step:"100",placeholder:"Budget",value:t.budget,onChange:i=>a({budget:i.target.value})}),e.jsx("span",{className:"currency",children:"kr"})]}),e.jsx("button",{type:"button",className:"kl-icon-btn danger",onClick:r,disabled:!s,"aria-label":"Ta bort plattform",children:e.jsx(pe,{size:16})})]}),e.jsxs("div",{className:"kl-pc-row dates",children:[e.jsxs("div",{children:[e.jsx("span",{className:"kl-pc-mini-label",children:"Start"}),e.jsx("input",{type:"date",value:t.start,min:l,max:n,onChange:i=>a({start:i.target.value})})]}),e.jsxs("div",{children:[e.jsx("span",{className:"kl-pc-mini-label",children:"Slut"}),e.jsx("input",{type:"date",value:t.end,min:t.start||l,max:n,onChange:i=>a({end:i.target.value})})]})]}),e.jsx("div",{className:"kl-pc-row status",children:e.jsxs("div",{children:[e.jsx("span",{className:"kl-pc-mini-label",children:"Status"}),e.jsx("div",{className:"kl-status-seg",role:"radiogroup","aria-label":"Plattformsstatus",children:Object.values(z).map(i=>e.jsxs("button",{type:"button",role:"radio","aria-checked":t.status===i.key,className:t.status===i.key?"active":"",onClick:()=>a({status:i.key}),children:[e.jsx("span",{className:"sdot",style:{background:i.color}}),i.label]},i.key))})]})})]})}function Ne(){const[t,a]=h.useState(null),[r,s]=h.useState(null),[l,n]=h.useState([]),[p,i]=h.useState(!0),[k,v]=h.useState(!1),[m,u]=h.useState(""),[w,x]=h.useState(""),[b,G]=h.useState(O()),[j,W]=h.useState(B(30)),[N,P]=h.useState([A(O(),B(30))]);h.useEffect(()=>{async function o(){let c=null;try{c=JSON.parse(localStorage.getItem("ailabb_active_user"))}catch{}if(!c){window.location.replace("../../");return}a(c);const d=localStorage.getItem($),f=localStorage.getItem(L);let g;if(d&&f===c)g=d;else{const S=await me(c);if(!S){window.location.replace("../../");return}g=S.id,localStorage.setItem($,g),localStorage.setItem(L,c)}s(g);const y=await xe(g),{campaigns:I,changed:T}=ge(y);n(I),T&&I.forEach(S=>E(S)),i(!1)}o()},[]);const Q=()=>{localStorage.removeItem("ailabb_active_user"),localStorage.removeItem($),localStorage.removeItem(L),window.location.replace("../../")},Y=()=>{u(""),x("");const o=O(),c=B(30);G(o),W(c),P([A(o,c)])},ee=(o,c)=>{P(N.map((d,f)=>{if(f!==o)return d;const g={...d,...c};return"start"in c&&(g.status==="schemalagd"||g.status==="aktiv")&&(g.status=R(g.start)),g}))},te=()=>P([...N,A(b,j)]),ae=o=>P(N.filter((c,d)=>d!==o)),U=m.trim()&&w.trim()&&b&&j&&new Date(j)>=new Date(b),re=async()=>{if(!U)return;const o=N.filter(d=>d.name.trim()||d.budget).map(d=>({name:d.name.trim()||"Plattform",budget:Number(d.budget)||0,start:d.start||b,end:d.end||j,status:d.status||R(d.start||b)})),c={id:Date.now().toString(),profile_id:r,client:m.trim(),name:w.trim(),start:b,end:j,platforms:o,created_at:new Date().toISOString()};n(d=>[c,...d]),Y(),v(!1),await E(c)},oe=async o=>{window.confirm("Ta bort kampanjen?")&&(n(c=>c.filter(d=>d.id!==o)),await ue(o))},le=async(o,c,d)=>{const f=l.map(y=>{if(y.id!==o)return y;const I=(y.platforms||[]).map((T,S)=>{if(S!==c)return T;let _={...T,...d};return _=V(_),_});return{...y,platforms:I}});n(f);const g=f.find(y=>y.id===o);g&&await E({...g,profile_id:r})},ne=async o=>{const c=l.map(f=>{if(f.id!==o)return f;const g=A(f.start,f.end);return{...f,platforms:[...f.platforms||[],g]}});n(c);const d=c.find(f=>f.id===o);d&&await E({...d,profile_id:r})};return p?e.jsxs(e.Fragment,{children:[e.jsx(q,{}),e.jsx("div",{className:"kl-fullscreen-loader",children:"Laddar…"})]}):e.jsxs(e.Fragment,{children:[e.jsx(q,{}),e.jsxs("div",{className:"kl-app-root",children:[e.jsxs("nav",{className:"kl-top-nav",children:[e.jsx(he,{}),e.jsxs("div",{className:"kl-nav-right",children:[e.jsxs("ul",{className:"kl-menu",children:[e.jsx("li",{children:e.jsx("a",{href:"../../",children:"Hem"})}),e.jsxs("li",{className:"kl-has-dropdown",children:[e.jsxs("a",{href:"#","aria-haspopup":"true",children:["Appar ",e.jsx("span",{className:"kl-chev","aria-hidden":"true",children:"▾"})]}),e.jsxs("ul",{className:"kl-dropdown",role:"menu",children:[e.jsx("li",{role:"none",children:e.jsx("a",{href:"../todo/",role:"menuitem",children:"Todo"})}),e.jsx("li",{role:"none",children:e.jsx("a",{href:"../kampanj/",role:"menuitem",className:"active",children:"Kampanjplanerare"})}),e.jsx("li",{role:"none",children:e.jsx("a",{href:"../seo-audit/",role:"menuitem",children:"SEO & GEO-granskning"})}),e.jsx("li",{role:"none",children:e.jsx("a",{href:"../trackr/",role:"menuitem",children:"Track3r"})})]})]})]}),e.jsx(ke,{}),e.jsx(be,{activeUser:t,onSwitch:Q})]})]}),e.jsxs("section",{className:"kl-hero",children:[e.jsxs("h1",{children:["Hej ",t,", dags att ",e.jsx("span",{className:"hand",children:"planera?"})]}),e.jsx("p",{children:"Bygg och håll koll på kampanjer åt dina kunder. Varje plattform kan köras under egna perioder inom kampanjen."})]}),k?e.jsxs("div",{className:"kl-form-card",children:[e.jsx("h2",{children:"Ny kampanj"}),e.jsxs("div",{className:"kl-field-row",children:[e.jsxs("div",{className:"kl-field",children:[e.jsx("label",{className:"kl-field-label",children:"Kund"}),e.jsx("input",{type:"text",placeholder:"t.ex. IKEA",value:m,onChange:o=>u(o.target.value),autoFocus:!0})]}),e.jsxs("div",{className:"kl-field",children:[e.jsx("label",{className:"kl-field-label",children:"Kampanjnamn"}),e.jsx("input",{type:"text",placeholder:"t.ex. Sommarkampanj 2026",value:w,onChange:o=>x(o.target.value)})]})]}),e.jsxs("div",{className:"kl-field-row",children:[e.jsxs("div",{className:"kl-field",children:[e.jsx("label",{className:"kl-field-label",children:"Startdatum"}),e.jsx("input",{type:"date",value:b,onChange:o=>G(o.target.value)})]}),e.jsxs("div",{className:"kl-field",children:[e.jsx("label",{className:"kl-field-label",children:"Slutdatum"}),e.jsx("input",{type:"date",value:j,onChange:o=>W(o.target.value),min:b})]})]}),e.jsxs("div",{className:"kl-field",children:[e.jsx("label",{className:"kl-field-label",children:"Plattformar & budget"}),e.jsxs("div",{className:"kl-platforms",children:[N.map((o,c)=>e.jsx(je,{platform:o,onChange:d=>ee(c,d),onRemove:()=>ae(c),canRemove:N.length>1,campaignStart:b,campaignEnd:j,suggestionIndex:c},c)),e.jsx("datalist",{id:"kl-platform-suggestions",children:K.map(o=>e.jsx("option",{value:o},o))}),e.jsxs("button",{type:"button",className:"kl-btn-secondary",style:{alignSelf:"flex-start"},onClick:te,children:[e.jsx(H,{size:14,strokeWidth:2.5}),"Lägg till plattform"]})]})]}),e.jsxs("div",{className:"kl-form-actions",children:[e.jsx("button",{className:"kl-btn-primary",onClick:re,disabled:!U,children:"Skapa kampanj"}),e.jsx("button",{className:"kl-btn-ghost",onClick:()=>{Y(),v(!1)},children:"Avbryt"})]})]}):e.jsxs("button",{className:"kl-new-btn",onClick:()=>v(!0),children:[e.jsx(H,{size:18,strokeWidth:2.5}),"Ny kampanj"]}),e.jsx("section",{style:{marginTop:28},children:l.length===0?e.jsxs("div",{className:"kl-empty-state",children:[e.jsx("h3",{children:"Inga kampanjer ännu"}),e.jsx("p",{children:"Skapa din första kampanj för att komma igång."})]}):l.map(o=>e.jsx(ye,{campaign:o,onDelete:()=>oe(o.id),onUpdatePlatform:(c,d)=>le(o.id,c,d),onAddPlatform:()=>ne(o.id)},o.id))})]})]})}function q(){return e.jsx("style",{children:`
      .kl-app-root, .kl-welcome-root {
        min-height: 100vh;
        margin: 0 auto;
        color: var(--color-text);
        font-family: var(--font-body, "Montserrat", sans-serif);
        -webkit-font-smoothing: antialiased;
      }
      .kl-app-root { max-width: 920px; padding: 32px 24px 96px; }
      .kl-welcome-root { max-width: 640px; padding: 32px 24px 96px; display: flex; flex-direction: column; }

      .kl-fullscreen-loader {
        min-height: 100vh; display: flex; align-items: center; justify-content: center;
        color: var(--color-text-faint); font-size: 15px;
        font-family: var(--font-body, "Montserrat", sans-serif);
      }

      /* Top nav */
      .kl-top-nav { display: flex; justify-content: space-between; align-items: center; margin-bottom: 56px; gap: 16px; }
      .kl-nav-right { display: flex; align-items: center; gap: 32px; }
      .kl-logo { display: inline-flex; align-items: center; height: 36px; color: var(--color-text); text-decoration: none; transition: opacity 200ms; border: 0; }
      .kl-logo:hover { opacity: 0.85; }
      .kl-logo svg { height: 100%; width: auto; }
      .kl-menu { display: flex; gap: 32px; list-style: none; margin: 0; padding: 0; }
      .kl-menu a { font-size: 14px; font-weight: 500; color: var(--color-text-muted); text-decoration: none; transition: color 200ms; position: relative; border: 0; }
      .kl-menu a:hover, .kl-menu a.active { color: var(--color-text); }
      .kl-menu a.active::after {
        content: ''; position: absolute; left: 0; right: 0; bottom: -6px;
        height: 2px; background: var(--color-red); border-radius: 2px;
      }
      .kl-has-dropdown { position: relative; }
      .kl-has-dropdown > a { display: inline-flex; align-items: center; gap: 6px; }
      .kl-chev { font-size: 9px; line-height: 1; transition: transform 200ms; }
      .kl-has-dropdown:hover .kl-chev,
      .kl-has-dropdown:focus-within .kl-chev { transform: rotate(180deg); }
      .kl-dropdown {
        position: absolute; top: calc(100% + 10px); right: 0; min-width: 180px;
        list-style: none; margin: 0; padding: 6px;
        background: var(--color-surface); border: 1px solid var(--color-border);
        border-radius: 10px; box-shadow: 0 16px 48px rgba(0,0,0,0.12), 0 4px 12px rgba(0,0,0,0.06);
        opacity: 0; visibility: hidden; transform: translateY(-4px);
        transition: opacity 200ms, visibility 200ms, transform 200ms; z-index: 20;
      }
      .kl-dropdown::before { content: ''; position: absolute; top: -10px; left: 0; right: 0; height: 10px; }
      .kl-has-dropdown:hover .kl-dropdown,
      .kl-has-dropdown:focus-within .kl-dropdown { opacity: 1; visibility: visible; transform: translateY(0); }
      .kl-dropdown li { display: block; }
      .kl-dropdown a {
        display: block; padding: 8px 12px; border-radius: 6px;
        font-size: 14px; font-weight: 500; color: var(--color-text-muted); border: 0;
        transition: background 150ms, color 150ms;
      }
      .kl-dropdown a:hover { background: var(--color-surface-2); color: var(--color-text); }
      .kl-dropdown a::after { display: none; }

      /* User chip */
      .kl-user-menu { position: relative; }
      .kl-user-chip {
        display: inline-flex; align-items: center; gap: 8px;
        padding: 5px 12px 5px 5px; border-radius: 999px;
        border: 1px solid var(--color-border); background: var(--color-surface);
        color: var(--color-text); font-family: inherit;
        font-size: 13px; font-weight: 500; cursor: pointer; transition: all 200ms;
      }
      .kl-user-chip:hover { border-color: var(--color-border-strong); background: var(--color-surface-2); }
      .kl-user-chip .kl-user-name { white-space: nowrap; max-width: 140px; overflow: hidden; text-overflow: ellipsis; }
      .kl-avatar {
        width: 26px; height: 26px; border-radius: 50%;
        background: var(--color-red); color: #FFFFFF;
        font-size: 12px; font-weight: 700;
        display: inline-flex; align-items: center; justify-content: center;
        flex-shrink: 0;
      }
      .kl-user-chip .kl-avatar { width: 22px; height: 22px; font-size: 11px; }
      .kl-user-dropdown {
        position: absolute; top: calc(100% + 8px); right: 0; min-width: 180px;
        background: var(--color-surface); border: 1px solid var(--color-border);
        border-radius: 10px; padding: 6px;
        box-shadow: 0 8px 24px rgba(0,0,0,0.12), 0 2px 6px rgba(0,0,0,0.06); z-index: 20;
      }
      .kl-user-dropdown button {
        display: flex; align-items: center; gap: 10px; width: 100%;
        padding: 9px 12px; background: transparent; border: 0;
        border-radius: 6px; color: var(--color-text-muted);
        font-family: inherit; font-size: 13px; font-weight: 500;
        cursor: pointer; text-align: left; transition: all 200ms;
      }
      .kl-user-dropdown button:hover { background: var(--color-surface-2); color: var(--color-text); }

      /* Welcome */
      .kl-welcome-nav { margin-bottom: 64px; }
      .kl-welcome-card { flex: 1; display: flex; flex-direction: column; justify-content: center; }
      .kl-welcome-card h1 {
        font-size: clamp(40px, 6vw, 64px); font-weight: 700;
        line-height: 1.05; letter-spacing: -0.02em; margin: 0 0 20px;
      }
      .kl-welcome-card h1 .hand {
        font-family: var(--font-hand, "Patrick Hand", cursive);
        color: var(--color-red); font-weight: 400;
        display: inline-block; transform: rotate(-2deg); font-size: 1.1em;
      }
      .kl-welcome-card p {
        color: var(--color-text-muted); font-size: 17px; line-height: 1.6;
        margin: 0 0 36px; max-width: 50ch;
      }
      .kl-welcome-input { display: flex; gap: 12px; margin-bottom: 36px; }
      .kl-welcome-input input { flex: 1; font-size: 17px; padding: 14px 18px; }
      .kl-welcome-input button { padding: 14px 22px; white-space: nowrap; }
      .kl-welcome-users { display: flex; flex-direction: column; gap: 14px; }
      .kl-welcome-label {
        font-size: 11px; font-weight: 600; letter-spacing: 0.12em;
        text-transform: uppercase; color: var(--color-text-faint);
      }
      .kl-user-pills { display: flex; flex-wrap: wrap; gap: 8px; }
      .kl-user-pill {
        display: inline-flex; align-items: center; gap: 10px;
        padding: 6px 18px 6px 6px; border-radius: 999px;
        border: 1px solid var(--color-border); background: var(--color-surface);
        color: var(--color-text); font-family: inherit;
        font-size: 14px; font-weight: 500; cursor: pointer;
        transition: all 200ms;
      }
      .kl-user-pill:hover { border-color: var(--color-border-strong); background: var(--color-surface-2); }

      /* Hero */
      .kl-hero { margin-bottom: 32px; }
      .kl-hero h1 {
        font-size: clamp(32px, 4.5vw, 48px); font-weight: 700;
        line-height: 1.1; letter-spacing: -0.02em; margin: 0 0 12px;
      }
      .kl-hero h1 .hand {
        font-family: var(--font-hand, "Patrick Hand", cursive);
        color: var(--color-red); font-weight: 400;
        display: inline-block; transform: rotate(-2deg);
      }
      .kl-hero p { color: var(--color-text-muted); font-size: 17px; line-height: 1.6; margin: 0; max-width: 60ch; }

      /* Buttons */
      .kl-new-btn, .kl-btn-primary {
        background: var(--color-red); color: var(--color-text-inverse); border: 0;
        font-family: inherit; font-weight: 600; font-size: 14px;
        cursor: pointer; transition: background 200ms, transform 100ms;
        display: inline-flex; align-items: center; gap: 8px;
      }
      .kl-new-btn { padding: 12px 20px; border-radius: 10px; }
      .kl-btn-primary { padding: 11px 22px; border-radius: 10px; }
      .kl-new-btn:hover, .kl-btn-primary:hover { background: var(--color-red-hover); }
      .kl-new-btn:active { transform: scale(0.98); }
      .kl-btn-primary:disabled {
        background: var(--color-surface-3); color: var(--color-text-faint); cursor: not-allowed;
      }
      .kl-btn-ghost {
        background: transparent; color: var(--color-text-muted); border: 0;
        padding: 11px 14px; border-radius: 10px; font-family: inherit;
        font-weight: 500; font-size: 14px; cursor: pointer; transition: color 200ms;
      }
      .kl-btn-ghost:hover { color: var(--color-text); }
      .kl-btn-secondary {
        background: var(--color-surface-3); border: 1px solid var(--color-border-strong);
        color: var(--color-text); border-radius: 10px;
        font-family: inherit; font-weight: 500; font-size: 13px;
        padding: 9px 14px; cursor: pointer; transition: all 200ms;
        display: inline-flex; align-items: center; gap: 6px;
      }
      .kl-btn-secondary:hover:not(:disabled) { background: var(--color-border); }
      .kl-btn-danger {
        background: transparent; color: var(--color-text-muted);
        border: 1px solid var(--color-border);
        padding: 8px 14px; border-radius: 10px;
        font-family: inherit; font-weight: 500; font-size: 13px;
        cursor: pointer; transition: all 200ms;
        display: inline-flex; align-items: center; gap: 6px;
      }
      .kl-btn-danger:hover {
        background: rgba(214,59,59,0.1); color: var(--color-red); border-color: rgba(214,59,59,0.4);
      }

      /* Form */
      .kl-form-card {
        background: var(--color-surface); border: 1px solid var(--color-border);
        border-radius: 16px; padding: 28px; margin: 8px 0 32px;
      }
      .kl-form-card h2 { font-size: 20px; font-weight: 600; margin: 0 0 20px; }
      .kl-field { margin-bottom: 20px; }
      .kl-field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 20px; }
      .kl-field-label {
        font-size: 11px; font-weight: 600; letter-spacing: 0.12em;
        text-transform: uppercase; color: var(--color-text-muted);
        margin-bottom: 8px; display: block;
      }
      .kl-app-root input[type="text"], .kl-app-root input[type="number"], .kl-app-root input[type="date"],
      .kl-welcome-root input[type="text"] {
        background: var(--color-surface-2); border: 1px solid var(--color-border);
        color: var(--color-text); font-family: inherit; font-size: 15px;
        padding: 10px 14px; border-radius: 10px; width: 100%; outline: none;
        transition: border-color 200ms;
      }
      .kl-app-root input:focus, .kl-welcome-root input:focus { border-color: var(--color-blue); }
      .kl-app-root input[type="date"] { color-scheme: light dark; }
      .kl-app-root ::placeholder, .kl-welcome-root ::placeholder { color: var(--color-text-faint); }
      .kl-app-root input[type="number"] { -moz-appearance: textfield; }
      .kl-app-root input[type="number"]::-webkit-outer-spin-button,
      .kl-app-root input[type="number"]::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }

      /* Platform sub-form */
      .kl-platforms { display: flex; flex-direction: column; gap: 10px; }
      .kl-platform-card {
        background: var(--color-surface-2); border: 1px solid var(--color-border);
        border-radius: 12px; padding: 14px 14px 12px;
        display: flex; flex-direction: column; gap: 10px;
        transition: border-color 200ms;
      }
      .kl-platform-card:focus-within { border-color: var(--color-border-strong); }
      .kl-pc-row { display: grid; gap: 8px; align-items: center; }
      .kl-pc-row.top { grid-template-columns: 1fr 160px auto; }
      .kl-pc-row.dates { grid-template-columns: 1fr 1fr; }
      .kl-pc-row.status { grid-template-columns: 1fr; }
      .kl-pc-budget-wrap { position: relative; display: flex; align-items: center; }
      .kl-pc-budget-wrap input { padding-right: 36px; }
      .kl-pc-budget-wrap .currency { position: absolute; right: 14px; color: var(--color-text-faint); font-size: 14px; pointer-events: none; }
      .kl-pc-mini-label {
        font-size: 10px; font-weight: 600; letter-spacing: 0.1em;
        text-transform: uppercase; color: var(--color-text-faint);
        margin-bottom: 6px; display: block;
      }

      .kl-icon-btn {
        background: transparent; border: 0; color: var(--color-text-faint);
        padding: 6px; border-radius: 6px; cursor: pointer;
        display: inline-flex; align-items: center; justify-content: center;
        transition: color 200ms, background 200ms;
      }
      .kl-icon-btn:hover { color: var(--color-text); background: var(--color-surface-2); }
      .kl-icon-btn.danger:hover { color: var(--color-red); background: rgba(214,59,59,0.1); }
      .kl-icon-btn:disabled { opacity: 0.3; cursor: not-allowed; }

      .kl-theme-toggle {
        background: transparent; border: 0; color: var(--color-text-muted);
        padding: 6px; border-radius: 8px; cursor: pointer;
        display: inline-flex; align-items: center; justify-content: center;
        transition: color 200ms, background 200ms;
      }
      .kl-theme-toggle:hover { color: var(--color-text); background: var(--color-surface-2); }

      /* Status segmented control */
      .kl-status-seg {
        display: inline-flex; gap: 4px;
        background: var(--color-surface-2); padding: 3px;
        border: 1px solid var(--color-border); border-radius: 999px;
        flex-wrap: nowrap;
      }
      .kl-status-seg button {
        border: 0; background: transparent; color: var(--color-text-muted);
        font-family: inherit; font-size: 12px; font-weight: 500;
        padding: 6px 12px; border-radius: 999px; cursor: pointer;
        display: inline-flex; align-items: center; gap: 6px;
        transition: all 200ms; white-space: nowrap;
      }
      .kl-status-seg button:hover { color: var(--color-text); }
      .kl-status-seg button.active {
        color: var(--color-text); background: var(--color-surface);
        box-shadow: 0 1px 3px rgba(0,0,0,0.1);
      }
      .kl-status-seg button .sdot { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }
      .kl-status-seg.compact { padding: 2px; }
      .kl-status-seg.compact button { padding: 4px 9px; font-size: 11px; gap: 5px; }
      .kl-status-seg.compact button .sdot { width: 6px; height: 6px; }

      .kl-form-actions { display: flex; gap: 12px; align-items: center; margin-top: 8px; }

      /* Campaign card */
      .kl-campaign {
        background: var(--color-surface); border: 1px solid var(--color-border);
        border-radius: 16px; margin-bottom: 14px; overflow: hidden;
        transition: border-color 200ms;
      }
      .kl-campaign:hover { border-color: var(--color-border-strong); }
      .kl-campaign-header {
        display: grid; grid-template-columns: 1fr auto auto auto auto;
        gap: 16px; align-items: center; padding: 18px 20px;
        cursor: pointer; user-select: none;
        background: transparent; border: 0; width: 100%;
        text-align: left; color: inherit; font-family: inherit;
        transition: background 150ms;
      }
      .kl-campaign-header:hover { background: rgba(128,128,128,0.04); }
      .kl-campaign-title { display: flex; flex-direction: column; gap: 4px; min-width: 0; }
      .kl-campaign-client {
        font-size: 11px; font-weight: 600; letter-spacing: 0.12em;
        text-transform: uppercase; color: var(--color-text-muted);
        white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
      }
      .kl-campaign-name {
        font-size: 17px; font-weight: 600; color: var(--color-text);
        white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
      }
      .kl-meta-pill {
        display: inline-flex; align-items: center; gap: 6px;
        font-size: 12px; font-weight: 500;
        padding: 5px 10px; border-radius: 999px;
        background: var(--color-surface-2); border: 1px solid var(--color-border);
        color: var(--color-text-muted); white-space: nowrap;
      }
      .kl-meta-pill.budget { color: var(--color-text); font-weight: 600; }
      .kl-meta-pill.status { color: var(--color-text); }
      .kl-meta-pill.status .sdot { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }
      .kl-meta-pill.status.active .sdot { animation: kl-pulse 2s infinite; }
      @keyframes kl-pulse {
        0%, 100% { opacity: 1; transform: scale(1); }
        50% { opacity: 0.6; transform: scale(0.85); }
      }
      .kl-chevron { color: var(--color-text-faint); transition: transform 250ms cubic-bezier(0.22, 1, 0.36, 1); }
      .kl-campaign.open .kl-chevron { transform: rotate(180deg); color: var(--color-text); }

      .kl-campaign-body {
        border-top: 1px solid var(--color-border);
        background: rgba(128,128,128,0.04);
        padding: 22px 20px 20px;
        display: flex; flex-direction: column; gap: 24px;
      }
      .kl-section-label {
        font-size: 11px; font-weight: 600; letter-spacing: 0.12em;
        text-transform: uppercase; color: var(--color-text-faint);
        margin-bottom: 10px;
      }

      /* Overall campaign timeline */
      .kl-timeline { display: flex; flex-direction: column; gap: 10px; }
      .kl-timeline-labels {
        display: flex; justify-content: space-between; align-items: center;
        font-size: 12px; color: var(--color-text-muted); font-weight: 500;
      }
      .kl-timeline-labels .duration {
        font-size: 11px; letter-spacing: 0.08em;
        text-transform: uppercase; color: var(--color-text-faint);
      }
      .kl-timeline-bar {
        position: relative; height: 8px;
        background: var(--color-surface-3); border-radius: 999px;
      }
      .kl-timeline-fill {
        position: absolute; left: 0; top: 0; bottom: 0;
        border-radius: 999px;
        transition: width 400ms cubic-bezier(0.22, 1, 0.36, 1);
      }
      .kl-timeline-today {
        position: absolute; top: 50%;
        width: 14px; height: 14px; border-radius: 50%;
        background: var(--color-text); border: 3px solid var(--color-bg);
        transform: translate(-50%, -50%);
        box-shadow: 0 0 0 2px var(--color-success), 0 0 10px rgba(31,122,58,0.25);
      }
      .kl-timeline-today-label {
        position: absolute; top: 18px;
        transform: translateX(-50%);
        font-size: 10px; font-weight: 600; color: var(--color-success);
        letter-spacing: 0.08em; text-transform: uppercase; white-space: nowrap;
      }

      /* Platform list (display) */
      .kl-platform-list { display: flex; flex-direction: column; gap: 8px; }
      .kl-pl-item {
        display: flex; flex-direction: column; gap: 10px;
        padding: 12px 14px;
        background: var(--color-surface-2); border: 1px solid var(--color-border);
        border-radius: 10px;
        transition: opacity 250ms, border-color 200ms;
      }
      .kl-pl-item.inaktiv { opacity: 0.65; }
      .kl-pl-row-top { display: flex; justify-content: space-between; align-items: center; gap: 12px; min-width: 0; }
      .kl-pl-row-bottom { display: flex; justify-content: space-between; align-items: center; gap: 12px; flex-wrap: wrap; }
      .kl-pl-name { display: flex; align-items: center; gap: 10px; flex: 1; min-width: 0; }
      .kl-pl-name .pdot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; transition: background 300ms; }

      /* Inline editable inputs */
      .kl-pl-inline-input {
        background: var(--color-bg); border: 1px solid var(--color-border);
        color: var(--color-text); font-family: inherit;
        border-radius: 8px; outline: none;
        transition: border-color 200ms, background 200ms;
      }
      .kl-pl-inline-input:hover { border-color: var(--color-border-strong); background: var(--color-surface-3); }
      .kl-pl-inline-input:focus { border-color: var(--color-blue); background: var(--color-surface-3); }
      .kl-pl-name-input { font-size: 14px; font-weight: 600; padding: 4px 10px; flex: 1; min-width: 0; }

      .kl-pl-budget-edit { display: inline-flex; align-items: center; gap: 5px; flex-shrink: 0; }
      .kl-pl-budget-edit input[type="number"] {
        font-size: 14px; font-weight: 600; padding: 4px 8px;
        width: 96px; text-align: right; font-variant-numeric: tabular-nums;
        -moz-appearance: textfield;
      }
      .kl-pl-budget-edit input[type="number"]::-webkit-outer-spin-button,
      .kl-pl-budget-edit input[type="number"]::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
      .kl-pl-budget-edit .suffix { font-size: 13px; color: var(--color-text-muted); font-weight: 500; }

      .kl-pl-dates-edit { display: inline-flex; align-items: center; gap: 6px; flex-wrap: wrap; }
      .kl-pl-dates-edit input[type="date"] {
        font-size: 12px; font-weight: 500; padding: 4px 8px;
        width: auto; cursor: pointer; color-scheme: light dark;
      }
      .kl-pl-dates-edit .dash { color: var(--color-text-faint); font-size: 12px; }

      /* Add platform button */
      .kl-pl-add-btn {
        margin-top: 4px; padding: 12px 14px;
        background: transparent; border: 1px dashed var(--color-border);
        border-radius: 10px; color: var(--color-text-muted);
        font-family: inherit; font-weight: 500; font-size: 13px; cursor: pointer;
        display: inline-flex; align-items: center; justify-content: center; gap: 6px;
        transition: all 200ms; width: 100%;
      }
      .kl-pl-add-btn:hover {
        color: var(--color-text); border-color: var(--color-border-strong);
        background: var(--color-surface-2);
      }

      .kl-pl-empty-hint {
        font-size: 13px; color: var(--color-text-faint);
        margin: 0 0 4px; font-style: italic;
      }
      .kl-pl-total {
        display: flex; justify-content: space-between; align-items: center;
        padding: 12px 14px; margin-top: 4px;
        border-top: 1px dashed var(--color-border); font-size: 14px;
      }
      .kl-pl-total .label { color: var(--color-text-muted); font-weight: 500; }
      .kl-pl-total .value {
        color: var(--color-text); font-weight: 700; font-size: 16px;
        font-variant-numeric: tabular-nums;
      }

      /* Platform calendar (Gantt) */
      .kl-cal {
        display: flex; flex-direction: column; gap: 6px;
        padding-top: 22px; position: relative;
      }
      .kl-cal-header { position: absolute; top: 0; left: 112px; right: 0; height: 18px; }
      .kl-cal-month {
        position: absolute; top: 0;
        font-size: 10px; font-weight: 600; letter-spacing: 0.06em;
        text-transform: uppercase; color: var(--color-text-muted);
        transform: translateX(2px); white-space: nowrap;
      }
      .kl-cal-row {
        display: grid; grid-template-columns: 100px 1fr;
        gap: 12px; align-items: center;
      }
      .kl-cal-row-label {
        font-size: 13px; font-weight: 500; color: var(--color-text);
        white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
      }
      .kl-cal-row-label.inaktiv { color: var(--color-text-faint); }
      .kl-cal-track {
        position: relative; height: 14px;
        background: var(--color-surface-3); border-radius: 7px;
      }
      .kl-cal-line {
        position: absolute; top: -22px; bottom: 0;
        width: 1px; background: var(--color-border);
        pointer-events: none; opacity: 0.6;
      }
      .kl-cal-bar {
        position: absolute; top: 0; bottom: 0;
        border-radius: 7px; min-width: 4px;
        transition: all 300ms cubic-bezier(0.22, 1, 0.36, 1);
      }
      .kl-cal-bar.inaktiv {
        background: repeating-linear-gradient(45deg,
          var(--color-text-faint), var(--color-text-faint) 4px,
          transparent 4px, transparent 8px);
        border: 1px solid var(--color-text-faint); opacity: 0.5;
      }
      .kl-cal-today-line {
        position: absolute; top: -22px; bottom: 0;
        width: 2px; background: var(--color-text);
        pointer-events: none; z-index: 2;
        box-shadow: 0 0 6px rgba(0,0,0,0.15);
      }

      .kl-body-actions { display: flex; justify-content: flex-end; }

      .kl-empty-state {
        text-align: center; padding: 56px 24px;
        color: var(--color-text-muted);
        border: 1px dashed var(--color-border); border-radius: 16px;
      }
      .kl-empty-state h3 { color: var(--color-text); margin: 0 0 8px; font-weight: 600; }
      .kl-empty-state p { margin: 0; font-size: 14px; }

      /* Mobile */
      @media (max-width: 700px) {
        .kl-top-nav { margin-bottom: 32px; }
        .kl-nav-right { gap: 16px; }
        .kl-menu { gap: 16px; }
        .kl-user-chip .kl-user-name { max-width: 80px; }
        .kl-form-card { padding: 20px; }
        .kl-field-row { grid-template-columns: 1fr; gap: 0; }
        .kl-field-row .kl-field { margin-bottom: 20px; }
        .kl-pc-row.top { grid-template-columns: 1fr auto; }
        .kl-pc-row.top .kl-pc-budget-wrap { grid-column: 1 / -1; }
        .kl-status-seg { flex-wrap: wrap; }
        .kl-campaign-header {
          grid-template-columns: 1fr auto;
          grid-template-areas: "title chevron" "meta meta";
          gap: 10px;
        }
        .kl-campaign-title { grid-area: title; }
        .kl-chevron { grid-area: chevron; }
        .kl-campaign-header .kl-meta-pill:nth-of-type(1) { grid-area: meta; justify-self: start; }
        .kl-campaign-header .kl-meta-pill:nth-of-type(2),
        .kl-campaign-header .kl-meta-pill:nth-of-type(3) { display: none; }
        .kl-pl-row-bottom { flex-direction: column; align-items: flex-start; }
        .kl-pl-budget-edit input[type="number"] { width: 80px; }
        .kl-cal-header { left: 92px; }
        .kl-cal-row { grid-template-columns: 80px 1fr; gap: 8px; }
        .kl-cal-row-label { font-size: 12px; }
        .kl-welcome-input { flex-direction: column; }
        .kl-welcome-input button { width: 100%; }
      }
    `})}se.createRoot(document.getElementById("root")).render(e.jsx(ie.StrictMode,{children:e.jsx(Ne,{})}));
