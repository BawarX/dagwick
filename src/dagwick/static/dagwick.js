var DagwickBundle=(function(a,g){"use strict";const W="Dagwick",ga="0.2.0",Pa="/dagwick/api",Ha="dagwick";async function _(e,r,i){const c=new URL(`${Pa}${e}`,document.baseURI);for(const[s,d]of Object.entries(r))c.searchParams.set(s,d);const t=await fetch(c,{signal:i,credentials:"same-origin"});if(!t.ok){let s=`HTTP ${t.status}`;try{const d=await t.json();typeof d?.detail=="string"&&(s=d.detail)}catch{}throw new Error(s)}return t.json()}const Ya=(e,r)=>_("/score",{dag_id:e},r),Ua=(e,r)=>_("/health",{dag_id:e},r),Wa=(e,r)=>_("/history",{dag_id:e},r),qa=e=>_("/fleet",{},e),Za=e=>_("/themes",{},e);let j;function wa(){return j??=_("/config",{}).catch(e=>{throw j=void 0,e}),j}function B(e,r){const[i,c]=g.useState(),[t,s]=g.useState(),[d,n]=g.useState(!0),[p,m]=g.useState(0);g.useEffect(()=>{const f=new AbortController;return n(!0),s(void 0),e(f.signal).then(c).catch(y=>{f.signal.aborted||s(y instanceof Error?y.message:String(y))}).finally(()=>!f.signal.aborted&&n(!1)),()=>f.abort()},[...r,p]);const $=g.useCallback(()=>m(f=>f+1),[]);return{data:i,error:t,loading:d,reload:$}}function Va(e){return{A:"radiant",B:"happy",C:"calm",D:"worried",F:"out"}[e]}function J({mood:e,size:r=150,season:i}){const c={radiant:1.15,happy:1,calm:.8,worried:.55,out:0}[e]*(i==="newroz"?1.25:1),t=e!=="out";return a.jsxs("svg",{className:`dagwick-lamp dagwick-lamp--${e}`,width:r,height:r,viewBox:"0 0 160 160",role:"img","aria-label":t?`Lantern is ${e}`:"Lantern has gone out",children:[a.jsxs("defs",{children:[a.jsxs("radialGradient",{id:"dagwick-glow",cx:"50%",cy:"50%",r:"50%",children:[a.jsx("stop",{offset:"0%",stopColor:"var(--dagwick-flame-core)",stopOpacity:"0.6"}),a.jsx("stop",{offset:"55%",stopColor:"var(--dagwick-flame)",stopOpacity:"0.2"}),a.jsx("stop",{offset:"100%",stopColor:"var(--dagwick-flame)",stopOpacity:"0"})]}),a.jsxs("linearGradient",{id:"dagwick-flame-grad",x1:"0",y1:"1",x2:"0",y2:"0",children:[a.jsx("stop",{offset:"0%",stopColor:"var(--dagwick-flame-deep)"}),a.jsx("stop",{offset:"55%",stopColor:"var(--dagwick-flame)"}),a.jsx("stop",{offset:"100%",stopColor:"var(--dagwick-flame-core)"})]}),a.jsxs("linearGradient",{id:"dagwick-metal",x1:"0",y1:"0",x2:"1",y2:"0",children:[a.jsx("stop",{offset:"0%",stopColor:"var(--dagwick-metal-dark)"}),a.jsx("stop",{offset:"45%",stopColor:"var(--dagwick-metal)"}),a.jsx("stop",{offset:"100%",stopColor:"var(--dagwick-metal-dark)"})]}),a.jsxs("linearGradient",{id:"dagwick-glass",x1:"0",y1:"0",x2:"1",y2:"0",children:[a.jsx("stop",{offset:"0%",stopColor:"var(--dagwick-glass)",stopOpacity:"0.35"}),a.jsx("stop",{offset:"30%",stopColor:"var(--dagwick-glass)",stopOpacity:"0.08"}),a.jsx("stop",{offset:"100%",stopColor:"var(--dagwick-glass)",stopOpacity:"0.22"})]})]}),a.jsx("ellipse",{cx:"80",cy:"146",rx:"44",ry:"5",fill:"var(--dagwick-shadow)"}),i&&a.jsx(Xa,{season:i}),t&&a.jsx("circle",{className:"dagwick-glow",cx:"80",cy:"88",r:44*c+16,fill:"url(#dagwick-glow)"}),e==="radiant"&&a.jsxs("g",{className:"dagwick-sparkles",fill:"var(--dagwick-flame-core)",children:[a.jsx("path",{d:"M128 52 l2 6 6 2 -6 2 -2 6 -2 -6 -6 -2 6 -2z"}),a.jsx("path",{d:"M30 70 l1.5 4 4 1.5 -4 1.5 -1.5 4 -1.5 -4 -4 -1.5 4 -1.5z"}),a.jsx("path",{d:"M132 100 l1.2 3 3 1.2 -3 1.2 -1.2 3 -1.2 -3 -3 -1.2 3 -1.2z"})]}),a.jsxs("g",{className:"dagwick-body",children:[a.jsx("path",{d:"M56 50 C 56 16, 104 16, 104 50",fill:"none",stroke:"var(--dagwick-metal-dark)",strokeWidth:"4",strokeLinecap:"round"}),a.jsx("circle",{cx:"80",cy:"24",r:"5",fill:"none",stroke:"var(--dagwick-metal-dark)",strokeWidth:"3.5"}),a.jsx("path",{d:"M62 44 L98 44 L110 58 L50 58 Z",fill:"url(#dagwick-metal)"}),a.jsx("rect",{x:"70",y:"38",width:"20",height:"7",rx:"2",fill:"var(--dagwick-metal-dark)"}),t&&a.jsxs("g",{className:"dagwick-flame",style:{transform:`scale(${c})`},children:[a.jsx("path",{d:"M80 106 C 67 98, 71 82, 80 68 C 82 79, 93 86, 89 97 C 87 102, 84 105, 80 106 Z",fill:"url(#dagwick-flame-grad)"}),a.jsx("path",{d:"M80 104 C 75 99, 77 92, 80 86 C 81 92, 86 95, 84 99 C 83 102, 81 103, 80 104 Z",fill:"var(--dagwick-flame-core)"})]}),a.jsx("path",{d:"M70 114 L90 114 L87 106 L73 106 Z",fill:"var(--dagwick-metal-dark)"}),a.jsx("path",{d:"M80 106 L80 102",stroke:"var(--dagwick-wick)",strokeWidth:"2.5",strokeLinecap:"round"}),a.jsx("path",{d:"M58 58 C 40 72, 40 100, 58 114 L102 114 C 120 100, 120 72, 102 58 Z",fill:"url(#dagwick-glass)",stroke:"var(--dagwick-glass-edge)",strokeWidth:"1.5"}),a.jsx("path",{d:"M54 72 C 50 82, 50 92, 54 102",fill:"none",stroke:"var(--dagwick-glass)",strokeOpacity:"0.55",strokeWidth:"3",strokeLinecap:"round"}),a.jsx("path",{d:"M66 58 C 58 76, 58 96, 66 114",fill:"none",stroke:"var(--dagwick-metal-dark)",strokeWidth:"2.5"}),a.jsx("path",{d:"M94 58 C 102 76, 102 96, 94 114",fill:"none",stroke:"var(--dagwick-metal-dark)",strokeWidth:"2.5"}),a.jsx("path",{d:"M48 114 L112 114 L116 134 C 116 141, 44 141, 44 134 Z",fill:"url(#dagwick-metal)"}),a.jsx("rect",{x:"44",y:"132",width:"72",height:"5",rx:"2.5",fill:"var(--dagwick-metal-dark)",opacity:"0.6"}),a.jsx(Ka,{mood:e})]}),i&&a.jsx(Qa,{season:i}),!t&&a.jsx("g",{className:"dagwick-smoke",fill:"none",stroke:"var(--dagwick-smoke)",strokeWidth:"3",strokeLinecap:"round",children:a.jsx("path",{d:"M80 36 C 72 28, 88 22, 80 14 C 72 6, 88 0, 82 -6"})})]})}function Ka({mood:e}){const i="var(--dagwick-ink)",c={radiant:"M73 127 Q 80 134 87 127",happy:"M74 128 Q 80 132 86 128",calm:"M75 129 L 85 129",worried:"M74 131 Q 80 126 86 131",out:"M75 131 Q 80 128 85 131"}[e];return a.jsxs("g",{className:"dagwick-face",children:[e==="radiant"||e==="happy"?a.jsxs(a.Fragment,{children:[a.jsx("path",{d:"M65 122 q4 -4.5 8 0",stroke:i,strokeWidth:"2.6",fill:"none",strokeLinecap:"round"}),a.jsx("path",{d:"M87 122 q4 -4.5 8 0",stroke:i,strokeWidth:"2.6",fill:"none",strokeLinecap:"round"})]}):e==="out"?a.jsxs(a.Fragment,{children:[a.jsx("path",{d:"M65 121 l8 2",stroke:i,strokeWidth:"2.6",strokeLinecap:"round"}),a.jsx("path",{d:"M87 123 l8 -2",stroke:i,strokeWidth:"2.6",strokeLinecap:"round"})]}):a.jsxs("g",{className:"dagwick-eyes",children:[a.jsx("circle",{cx:"69",cy:122,r:"3",fill:i}),a.jsx("circle",{cx:"91",cy:122,r:"3",fill:i})]}),a.jsx("path",{d:c,stroke:i,strokeWidth:"2.6",fill:"none",strokeLinecap:"round"}),(e==="radiant"||e==="happy")&&a.jsxs(a.Fragment,{children:[a.jsx("circle",{cx:"60",cy:"127",r:"3.5",fill:"var(--dagwick-blush)"}),a.jsx("circle",{cx:"100",cy:"127",r:"3.5",fill:"var(--dagwick-blush)"})]}),e==="worried"&&a.jsx("path",{d:"M100 116 q3 5 0 8 q-3 -3 0 -8z",fill:"var(--dagwick-tear)"})]})}function Xa({season:e}){return e==="ramadan"||e==="eid"?a.jsxs("g",{fill:"#fde68a",children:[a.jsx("path",{d:"M128 4 a15 15 0 1 0 13 24 a12 12 0 1 1 -13 -24z"}),a.jsx("path",{d:"M148 40 l1.5 4 4.3 .2 -3.4 2.6 1.2 4.2 -3.6 -2.4 -3.6 2.4 1.2 -4.2 -3.4 -2.6 4.3 -.2z"})]}):null}function Qa({season:e}){switch(e){case"christmas":return a.jsxs("g",{className:"dagwick-acc",children:[a.jsx("path",{d:"M54 40 C 60 10, 96 2, 124 18 C 112 16, 104 22, 106 40 Z",fill:"#dc2626"}),a.jsx("circle",{cx:"126",cy:"19",r:"7",fill:"#fff"}),a.jsx("rect",{x:"48",y:"36",width:"64",height:"12",rx:"6",fill:"#fff"}),a.jsx("path",{d:"M48 114 q6 -5 12 0 q6 -5 12 0 q6 -5 12 0 q6 -5 12 0 q6 -5 16 0 Z",fill:"#fff"}),a.jsxs("g",{transform:"translate(104 117)",children:[a.jsx("path",{d:"M0 0 q6 -8 12 -2 q-6 0 -12 2z",fill:"#16a34a"}),a.jsx("path",{d:"M0 0 q-2 -10 6 -12 q-2 6 -6 12z",fill:"#15803d"}),a.jsx("circle",{cx:"1",cy:"-1",r:"2.4",fill:"#dc2626"}),a.jsx("circle",{cx:"4.5",cy:"1",r:"2.2",fill:"#ef4444"})]})]});case"new-year":case"birthday":return a.jsxs("g",{className:"dagwick-acc",transform:"rotate(-12 80 40)",children:[a.jsx("polygon",{points:"68,42 92,42 80,2",fill:e==="birthday"?"#ec4899":"#7c3aed"}),a.jsx("path",{d:"M71 34 L89 34 M74 24 L86 24 M77 14 L83 14",stroke:"#fde047",strokeWidth:"3"}),a.jsx("circle",{cx:"80",cy:"2",r:"4.5",fill:e==="birthday"?"#60a5fa":"#f472b6"})]});case"newroz":return a.jsxs("g",{className:"dagwick-acc",children:[a.jsx("path",{d:"M66 44 q4 -7 8 -2 M94 44 q-4 -7 -8 -2",stroke:"#22c55e",strokeWidth:"2",fill:"none"}),a.jsx("circle",{cx:"60",cy:"43",r:"5",fill:"#f9a8d4"}),a.jsx("circle",{cx:"60",cy:"43",r:"2",fill:"#fde047"}),a.jsx("circle",{cx:"80",cy:"37",r:"5.5",fill:"#fef08a"}),a.jsx("circle",{cx:"80",cy:"37",r:"2.2",fill:"#f97316"}),a.jsx("circle",{cx:"100",cy:"43",r:"5",fill:"#ffffff"}),a.jsx("circle",{cx:"100",cy:"43",r:"2",fill:"#fde047"})]});case"halloween":return a.jsxs("g",{className:"dagwick-acc dagwick-spider",children:[a.jsx("path",{d:"M104 58 L112 84",stroke:"#d8d0e8",strokeWidth:".8"}),a.jsx("circle",{cx:"112",cy:"87",r:"3.4",fill:"#1a1024"}),a.jsx("path",{d:"M108 85 l-4 -2 M108 88 l-4 1 M116 85 l4 -2 M116 88 l4 1",stroke:"#1a1024",strokeWidth:"1"})]});case"eid":return a.jsxs("g",{className:"dagwick-acc",children:[a.jsx("ellipse",{cx:"128",cy:"141",rx:"20",ry:"4",fill:"#e5e7eb"}),[[118,135],[130,133],[140,137]].map(([r,i],c)=>a.jsxs("g",{children:[a.jsx("circle",{cx:r,cy:i,r:"6.5",fill:"#c98b4a",stroke:"#8a5a2b",strokeWidth:"1"}),a.jsx("path",{d:`M${r-3.5} ${i} a3.5 3.5 0 1 1 7 0`,fill:"none",stroke:"#8a5a2b",strokeWidth:"1"}),a.jsx("circle",{cx:r,cy:i,r:"1.2",fill:"#8a5a2b"})]},c))]});case"language-day":return a.jsxs("g",{className:"dagwick-acc",children:[a.jsx("rect",{x:"114",y:"104",width:"30",height:"24",rx:"3",fill:"#fff7e6",stroke:"#c9a46b"}),a.jsx("rect",{x:"112",y:"102",width:"34",height:"5",rx:"2.5",fill:"#e9d3a7"}),a.jsx("rect",{x:"112",y:"125",width:"34",height:"5",rx:"2.5",fill:"#e9d3a7"}),a.jsx("text",{x:"129",y:"122",textAnchor:"middle",fontSize:"15",fill:"#7c2d12",fontWeight:"700",children:"ک"})]});default:return null}}const pa=()=>window.matchMedia?.("(prefers-reduced-motion: reduce)").matches??!1;function ja(e,r=900){const[i,c]=g.useState(pa()?e:0),t=g.useRef(0);return g.useEffect(()=>{if(pa())return c(e);const s=performance.now(),d=t.current;let n=0;const p=$=>{const f=Math.min(1,($-s)/r);c(d+(e-d)*(1-Math.pow(1-f,3))),f<1?n=requestAnimationFrame(p):t.current=e};n=requestAnimationFrame(p);const m=setTimeout(()=>{cancelAnimationFrame(n),t.current=e,c(e)},r+100);return()=>{cancelAnimationFrame(n),clearTimeout(m)}},[e,r]),i}function ka({score:e,grade:r}){const i=ja(e),c=52,t=2*Math.PI*c;return a.jsxs("div",{className:`dagwick-ring dagwick-grade-${r}`,"aria-label":`Score ${e} out of 100, grade ${r}`,children:[a.jsxs("svg",{width:"132",height:"132",viewBox:"0 0 132 132",children:[a.jsx("circle",{cx:"66",cy:"66",r:c,className:"dagwick-ring-track"}),a.jsx("circle",{cx:"66",cy:"66",r:c,className:"dagwick-ring-fill",strokeDasharray:t,strokeDashoffset:t*(1-i/100),transform:"rotate(-90 66 66)"})]}),a.jsxs("div",{className:"dagwick-ring-label",children:[a.jsx("span",{className:"dagwick-grade",children:r}),a.jsx("span",{className:"dagwick-score",children:Math.floor(i)})]})]})}function Ja({code:e}){const[r,i]=g.useState(!1),c=async()=>{try{await navigator.clipboard.writeText(e),i(!0),setTimeout(()=>i(!1),1500)}catch{}};return a.jsxs("div",{className:"dagwick-code",children:[a.jsx("pre",{children:a.jsx("code",{children:e})}),a.jsx("button",{className:"dagwick-copy",onClick:c,"aria-label":"Copy code",children:r?"Copied ✓":"Copy"})]})}const Ra={A:"I'm glowing! ✨",B:"Nice and warm.",C:"A little more oil?",D:"I'm flickering…",F:"It's dark in here."};function ha({grade:e,size:r=150,season:i}){return a.jsxs("div",{className:"dagwick-mascot",children:[a.jsx("div",{className:"dagwick-bubble",children:Ra[e]}),a.jsx(J,{mood:Va(e),size:r,season:i})]})}function G({title:e,body:r,action:i}){return a.jsxs("div",{className:"dagwick-empty",children:[a.jsx(J,{mood:"out",size:110}),a.jsx("h3",{children:e}),a.jsx("p",{className:"dagwick-muted",children:r}),i]})}function R({label:e="Lighting the lamp…"}){return a.jsxs("div",{className:"dagwick-empty",children:[a.jsx(J,{mood:"calm",size:110}),a.jsx("p",{className:"dagwick-muted",children:e})]})}function fa({grade:e,size:r="md"}){return a.jsx("span",{className:`dagwick-badge dagwick-badge--${e} dagwick-badge--${r}`,children:e})}function ae({score:e,grade:r}){const c=2*Math.PI*18;return a.jsxs("div",{className:`dagwick-mini dagwick-grade-${r}`,"aria-label":`Score ${e}, grade ${r}`,children:[a.jsxs("svg",{width:"46",height:"46",viewBox:"0 0 46 46",children:[a.jsx("circle",{cx:"23",cy:"23",r:18,className:"dagwick-ring-track"}),a.jsx("circle",{cx:"23",cy:"23",r:18,className:"dagwick-ring-fill",strokeDasharray:c,strokeDashoffset:c*(1-e/100),transform:"rotate(-90 23 23)"})]}),a.jsx("span",{children:Math.floor(e)})]})}function ee({dagId:e,children:r,className:i}){const c=globalThis.ReactRouterDOM?.Link,t=`/dags/${encodeURIComponent(e)}/plugin/${Ha}`;return c?a.jsx(c,{to:t,className:i,children:r}):a.jsx("a",{href:new URL(t.slice(1),document.baseURI).href,className:i,children:r})}const ba=e=>a.jsxs("div",{className:"dagwick-eyebrow",children:[a.jsx("span",{className:"dagwick-brand",children:W})," · ",e]});function ie(e){if(e<60)return`${Math.round(e)} s`;if(e<3600)return`${Math.round(e/60)} min`;const r=Math.floor(e/3600),i=Math.round(e%3600/60);return i?`${r} h ${i} min`:`${r} h`}function re(e,r=Date.now()){const i=Math.max(0,Math.round((r-Date.parse(e))/6e4));if(i<60)return`${i} min ago`;const c=Math.round(i/60);return c<48?`${c} h ago`:`${Math.round(c/24)} days ago`}function ce(e){return e===null||Math.abs(e)<10?e===null?void 0:"steady":e>0?`${e}% slower than before`:`${-e}% faster than before`}function te({dagId:e}){const{data:r,error:i}=B(c=>Ua(e,c),[e]);return i||!r?null:a.jsx(oe,{health:r})}function oe({health:e,now:r}){const i=e;return a.jsxs("section",{className:"dagwick-health","aria-label":"Run health",children:[a.jsxs("div",{className:"dagwick-health-head",children:[a.jsx("span",{className:"dagwick-side-title",children:"Run health"}),a.jsxs("span",{className:"dagwick-muted",children:["last ",i.window_days," days · not part of the score"]})]}),i.runs===0?a.jsxs("p",{className:"dagwick-muted dagwick-health-empty",children:["No finished runs in the last ",i.window_days," days."]}):a.jsxs("div",{className:"dagwick-cats",children:[a.jsx(q,{label:"Runs succeeded",value:`${i.success_rate}%`,sub:`${i.succeeded} of ${i.runs}${i.truncated?"+":""} runs`,tone:i.success_rate!==null&&i.success_rate<90?"fail":"pass"}),a.jsx(q,{label:"Tasks retried",value:i.retry_rate===null?"–":`${i.retry_rate}%`,sub:`${i.tasks_retried} of ${i.tasks_finished} tasks`,tone:i.retry_rate!==null&&i.retry_rate>=10?"warn":void 0}),a.jsx(q,{label:"Typical run",value:i.median_seconds===null?"–":ie(i.median_seconds),sub:ce(i.duration_trend_pct)??"not enough runs for a trend",tone:i.duration_trend_pct!==null&&i.duration_trend_pct>=25?"warn":void 0}),a.jsx(q,{label:"Last run",value:i.last_state?i.last_state[0].toUpperCase()+i.last_state.slice(1):"–",sub:i.last_end?re(i.last_end,r):"",tone:i.last_state==="failed"?"fail":i.last_state==="success"?"pass":void 0})]})]})}function q({label:e,value:r,sub:i,tone:c}){return a.jsxs("div",{className:`dagwick-cat dagwick-htile${c?` dagwick-htile--${c}`:""}`,children:[a.jsx("div",{className:"dagwick-cat-head",children:a.jsx("span",{children:e})}),a.jsx("div",{className:"dagwick-htile-value",children:r}),a.jsx("div",{className:"dagwick-muted dagwick-htile-sub",children:i})]})}const de=5;function se(e){return e?new Date(e).toLocaleDateString(void 0,{day:"numeric",month:"short"}):""}function xa(e){const r=[];for(let i=e.length-1;i>0&&r.length<de;i--){const c=e[i];(c.better.length||c.worse.length)&&r.push({point:c,from:e[i-1].score})}return r}function ne({dagId:e}){const{data:r}=B(i=>Wa(e,i),[e]);return r?a.jsx(le,{history:r}):null}function le({history:e}){const r=e.versions;return a.jsxs("section",{className:"dagwick-section","aria-label":"Score history",children:[a.jsxs("div",{className:"dagwick-section-head",children:[a.jsx("span",{className:"dagwick-side-title",children:"Score history"}),a.jsxs("span",{className:"dagwick-muted",children:[e.truncated?`last ${r.length} versions`:`${r.length} version${r.length===1?"":"s"}`," · code checks only"]})]}),r.length<2?a.jsx("p",{className:"dagwick-muted dagwick-section-empty",children:"Only one version so far. Each time the DAG's code changes, its new score appears here."}):a.jsxs("div",{className:"dagwick-history",children:[a.jsx(ge,{versions:r}),a.jsxs("ul",{className:"dagwick-changes",children:[xa(r).map(({point:i,from:c})=>a.jsxs("li",{children:[a.jsxs("span",{className:"dagwick-change-head",children:[a.jsxs("strong",{children:["v",i.version]}),a.jsx("span",{className:"dagwick-muted",children:se(i.created_at)}),a.jsxs("span",{className:i.score>=c?"dagwick-up":"dagwick-down",children:[Math.round(c)," → ",Math.round(i.score)]})]}),i.better.length>0&&a.jsxs("span",{className:"dagwick-up",children:["Now passing: ",i.better.join(", ")]}),i.worse.length>0&&a.jsxs("span",{className:"dagwick-down",children:["Now failing: ",i.worse.join(", ")]})]},i.version)),xa(r).length===0&&a.jsx("li",{className:"dagwick-muted",children:"The code changed, but no check result did."})]})]})]})}function ge({versions:e}){const t=n=>6+n*288/Math.max(e.length-1,1),s=n=>58-n/100*52,d=e.map((n,p)=>`${t(p)},${s(n.score)}`).join(" ");return a.jsxs("svg",{className:"dagwick-spark",viewBox:"0 0 300 64",preserveAspectRatio:"none",role:"img","aria-label":`Score by version, from ${Math.round(e[0].score)} to ${Math.round(e[e.length-1].score)}`,children:[a.jsx("polyline",{points:d,fill:"none",stroke:"var(--dagwick-accent)",strokeWidth:"2",vectorEffect:"non-scaling-stroke"}),e.map((n,p)=>a.jsx("circle",{cx:t(p),cy:s(n.score),r:"3",className:`dagwick-spark-dot dagwick-spark-dot--${n.grade}`,children:a.jsx("title",{children:`v${n.version}: ${n.grade} ${Math.round(n.score)}`})},n.version))]})}const h=(e,r=0)=>{const i=Math.sin(e*12.9898+r*78.233)*43758.5453;return i-Math.floor(i)},C=e=>Array.from({length:e},(r,i)=>i),S=e=>`${(e*100).toFixed(1)}%`,x=e=>`${e.toFixed(2)}s`,F=["#f472b6","#60a5fa","#fde047","#4ade80","#c084fc","#fb923c"],ua=["#ef4444","#f59e0b","#22c55e","#3b82f6","#ec4899","#a855f7","#14b8a6"],ma=["ڕ","ڵ","ڤ","ێ","ۆ","ژ","چ","گ","پ","ê","î","û","ş","ç","x","Kurdî","کوردی"];function we(){return a.jsxs(a.Fragment,{children:[C(28).map(e=>a.jsx("span",{className:"dagwick-flake",style:{left:S(h(e,1)),width:3+h(e,2)*5,height:3+h(e,2)*5,opacity:.5+h(e,3)*.5,animationDuration:`${x(6+h(e,4)*7)}, ${x(2.5+h(e,5)*2)}`,animationDelay:`${x(-h(e,6)*12)}, ${x(-h(e,7)*3)}`}},e)),a.jsx("svg",{className:"dagwick-snowbank",viewBox:"0 0 400 20",preserveAspectRatio:"none",children:a.jsx("path",{d:"M0 20 V10 Q20 2 45 9 T95 8 T150 10 T205 7 T260 10 T320 6 T400 9 V20 Z"})})]})}function pe({style:e}){return a.jsx("span",{className:"dagwick-bat",style:e,children:a.jsx("span",{className:"dagwick-bat-bob",children:a.jsxs("svg",{viewBox:"0 0 40 20",width:"34",height:"17",children:[a.jsx("g",{className:"dagwick-wing-l",children:a.jsx("path",{d:"M20 9 C 14 2, 6 2, 0 6 C 5 7, 7 10, 6 13 C 10 10, 14 11, 20 12 Z"})}),a.jsx("g",{className:"dagwick-wing-r",children:a.jsx("path",{d:"M20 9 C 26 2, 34 2, 40 6 C 35 7, 33 10, 34 13 C 30 10, 26 11, 20 12 Z"})}),a.jsx("ellipse",{cx:"20",cy:"10.5",rx:"3",ry:"4"}),a.jsx("path",{d:"M18 7 l-1 -3 2 2 M22 7 l1 -3 -2 2"})]})})})}function ke(){return a.jsxs(a.Fragment,{children:[a.jsx("span",{className:"dagwick-moon"}),C(7).map(e=>a.jsx(pe,{style:{top:S(.06+h(e,1)*.55),transform:`scale(${.6+h(e,2)*.7})`,animationDuration:x(9+h(e,3)*8),animationDelay:x(-h(e,4)*16)}},e))]})}function va({n:e=30}){return a.jsx(a.Fragment,{children:C(e).map(r=>a.jsx("span",{className:"dagwick-confetti",style:{left:S(h(r,1)),background:F[r%F.length],animationDuration:`${x(4+h(r,2)*5)}, ${x(1+h(r,3)*2)}`,animationDelay:`${x(-h(r,4)*9)}, 0s`}},r))})}function he(){return a.jsx(a.Fragment,{children:[{left:"12%",top:"18%",color:"#f472b6",delay:0},{left:"82%",top:"14%",color:"#60a5fa",delay:1.1},{left:"64%",top:"30%",color:"#fde047",delay:2.2}].map((e,r)=>a.jsx("span",{className:"dagwick-firework",style:{left:e.left,top:e.top,animationDelay:x(e.delay)},children:C(12).map(i=>a.jsx("i",{style:{background:e.color,transform:`rotate(${i*30}deg) translateY(-26px)`}},i))},r))})}function fe(){return a.jsx(a.Fragment,{children:C(5).map(e=>a.jsx("span",{className:"dagwick-balloon",style:{left:S(.08+h(e,1)*.84),background:F[e%F.length],animationDuration:x(10+h(e,2)*6),animationDelay:x(-h(e,3)*14)}},e))})}function be(){return a.jsxs(a.Fragment,{children:[C(18).map(e=>a.jsx("span",{className:"dagwick-ember",style:{left:S(.05+h(e,1)*.9),animationDuration:x(4+h(e,2)*4),animationDelay:x(-h(e,3)*8)}},e)),a.jsxs("svg",{className:"dagwick-mountains",viewBox:"0 0 800 120",preserveAspectRatio:"none",children:[a.jsx("path",{className:"far",d:"M0 120 L0 70 L90 30 L170 66 L260 18 L360 64 L450 26 L560 70 L650 22 L740 60 L800 40 L800 120 Z"}),a.jsx("path",{className:"near",d:"M0 120 L0 92 L120 58 L220 90 L330 54 L440 92 L560 60 L690 94 L800 64 L800 120 Z"})]}),[[.325,.6],[.5625,.638],[.8125,.61]].map(([e,r],i)=>a.jsx("span",{className:"dagwick-fire",style:{left:S(e),top:S(r),animationDelay:x(i*.3)}},i)),a.jsx("div",{className:"dagwick-govend",children:C(9).map(e=>a.jsx("span",{className:"dagwick-dancer",style:{animationDelay:x(e*.18)},children:a.jsxs("svg",{viewBox:"0 0 20 36",width:"22",height:"40",children:[a.jsx("circle",{cx:"10",cy:"5",r:"4",fill:"#f1d3b3"}),a.jsx("path",{d:"M6 3 Q10 -1 14 3 L14 5 L6 5 Z",fill:e%2?"#1f2937":"#7c2d12"}),a.jsx("path",{d:"M10 9 L3 32 L17 32 Z",fill:ua[e%ua.length]}),a.jsx("path",{d:"M7 32 L7 35 M13 32 L13 35",stroke:"#1f2937",strokeWidth:"1.6"}),a.jsx("path",{d:"M-1 15 L21 15",stroke:"#f1d3b3",strokeWidth:"2",strokeLinecap:"round"}),e===0&&a.jsx("path",{d:"M-1 15 L-5 6 L1 9 Z",fill:"#facc15"})]})},e))})]})}function ya({n:e=22}){return a.jsx(a.Fragment,{children:C(e).map(r=>a.jsx("span",{className:"dagwick-star",style:{left:S(h(r,1)),top:S(h(r,2)*.7),animationDelay:x(-h(r,3)*3),animationDuration:x(2+h(r,4)*2.5)}},r))})}function xe(){return a.jsx("div",{className:"dagwick-hanging",children:[.2,.55,.85].map((e,r)=>a.jsx("span",{style:{left:S(e),height:26+r*14,animationDelay:x(r*.6)},children:a.jsxs("svg",{viewBox:"0 0 16 26",width:"16",height:"26",children:[a.jsx("path",{d:"M8 0 L8 4",stroke:"#e9c46a"}),a.jsx("path",{d:"M3 6 L13 6 L11 4 L5 4 Z",fill:"#e9c46a"}),a.jsx("path",{d:"M3 6 Q0 13 3 20 L13 20 Q16 13 13 6 Z",fill:"#fbbf24",opacity:".85"}),a.jsx("path",{d:"M4 20 L12 20 L10 23 L6 23 Z",fill:"#e9c46a"})]})},r))})}function ue(){return a.jsxs("svg",{className:"dagwick-bunting",viewBox:"0 0 800 40",preserveAspectRatio:"none",children:[a.jsx("path",{d:"M0 4 Q400 34 800 4",fill:"none",stroke:"#e9c46a",strokeWidth:"1.5"}),C(16).map(e=>{const r=25+e*48,i=4+30*(1-((r-400)/400)**2)*.95;return a.jsx("path",{d:`M${r-10} ${i} L${r+10} ${i} L${r} ${i+16} Z`,fill:F[e%F.length]},e)})]})}function me(){return a.jsx(a.Fragment,{children:C(16).map(e=>a.jsx("span",{className:"dagwick-letter",style:{left:S(.04+h(e,1)*.92),fontSize:13+h(e,2)*11,animationDuration:x(7+h(e,3)*6),animationDelay:x(-h(e,4)*12)},children:ma[e%ma.length]},e))})}const ve={christmas:()=>a.jsx(we,{}),halloween:()=>a.jsx(ke,{}),"new-year":()=>a.jsxs(a.Fragment,{children:[a.jsx(he,{}),a.jsx(va,{})]}),birthday:()=>a.jsxs(a.Fragment,{children:[a.jsx(fe,{}),a.jsx(va,{n:18})]}),newroz:()=>a.jsx(be,{}),ramadan:()=>a.jsxs(a.Fragment,{children:[a.jsx(ya,{}),a.jsx(xe,{})]}),eid:()=>a.jsxs(a.Fragment,{children:[a.jsx(ue,{}),a.jsx(ya,{n:14})]}),"language-day":()=>a.jsx(me,{})};function Na({season:e}){return e?a.jsx("div",{className:`dagwick-fx dagwick-fx--${e.id}`,"aria-hidden":"true",children:ve[e.id]()}):null}function $a({state:e}){const{season:r,available:i,hidden:c,setHidden:t}=e;return r?a.jsxs("div",{className:"dagwick-greeting",children:[a.jsx("span",{"aria-hidden":"true",children:r.icon}),a.jsx("span",{children:r.greeting}),a.jsx("button",{className:"dagwick-greeting-hide",onClick:()=>t(!0),title:"Hide seasonal decorations",children:"Hide"})]}):i&&c?a.jsxs("button",{className:"dagwick-greeting-show",onClick:()=>t(!1),children:[i.icon," Show the ",i.name," mood"]}):null}const I=[["A",90],["B",75],["C",60],["D",40]];function ye(e,r=I){return r.find(([,i])=>e>=i)?.[0]??"F"}function Ne(e){if(!e||typeof e!="object")return I;const r=e,i=I.map(([c,t])=>[c,typeof r[c]=="number"?r[c]:t]);return i.every(([,c],t)=>t===0||i[t-1][1]>c)?i:I}function Sa(){const[e,r]=g.useState(I);return g.useEffect(()=>{let i=!0;return wa().then(c=>i&&r(Ne(c.grades))).catch(()=>{}),()=>{i=!1}},[]),e}const aa={eid:{id:"eid",name:"Eid",greeting:"Eid Mubarak!",icon:"🍪"},newroz:{id:"newroz",name:"Newroz",greeting:"Happy Newroz!",icon:"🔥"},"language-day":{id:"language-day",name:"Kurdish Language Day",greeting:"Kurdish Language Day",icon:"✍️"},christmas:{id:"christmas",name:"Christmas",greeting:"Merry Christmas!",icon:"🎄"},"new-year":{id:"new-year",name:"New Year",greeting:"Happy New Year!",icon:"🎉"},halloween:{id:"halloween",name:"Halloween",greeting:"Happy Halloween!",icon:"🎃"},ramadan:{id:"ramadan",name:"Ramadan",greeting:"Ramadan Kareem",icon:"🌙"},birthday:{id:"birthday",name:"Dagwick's birthday",greeting:"Dagwick turns another year older!",icon:"🎂"}},Ma=["newroz","eid","language-day","christmas","new-year","halloween","ramadan","birthday"],Z=(e,r,i,c)=>{const t=e*100+r,s=i[0]*100+i[1],d=c[0]*100+c[1];return s<=d?t>=s&&t<=d:t>=s||t<=d};function Ca(e){try{const r=new Intl.DateTimeFormat("en-US-u-ca-islamic-umalqura",{month:"numeric",day:"numeric"}).formatToParts(e),i=Number(r.find(t=>t.type==="month")?.value),c=Number(r.find(t=>t.type==="day")?.value);return i&&c?{month:i,day:c}:void 0}catch{return}}const $e={eid:e=>{const r=Ca(e);return!!r&&(r.month===10&&r.day<=3||r.month===12&&r.day>=10&&r.day<=13)},newroz:e=>Z(e.getMonth()+1,e.getDate(),[3,19],[3,23]),"language-day":e=>e.getMonth()+1===5&&e.getDate()===15,christmas:e=>Z(e.getMonth()+1,e.getDate(),[12,18],[12,26]),"new-year":e=>Z(e.getMonth()+1,e.getDate(),[12,31],[1,2]),halloween:e=>Z(e.getMonth()+1,e.getDate(),[10,24],[11,1]),ramadan:e=>Ca(e)?.month===9,birthday:e=>e.getMonth()+1===11&&e.getDate()===8};function Se(e,r="auto"){if(r==="off")return;const c=(r==="auto"?Ma:Ma.filter(t=>r.includes(t))).find(t=>$e[t](e));return c?aa[c]:void 0}function La(e){return!!e&&e in aa}const ea="dagwick.moods.hidden";function Me(){try{return window.localStorage.getItem(ea)==="1"}catch{return!1}}function Ce(e){try{e?window.localStorage.setItem(ea,"1"):window.localStorage.removeItem(ea)}catch{}}function Le(){const e=new URLSearchParams(window.location.search).get("dagwick_mood");return e==="everyday"?null:La(e)?aa[e]:void 0}function Da(){const[e]=g.useState(Le),[r,i]=g.useState(()=>e??void 0),[c,t]=g.useState(Me);return g.useEffect(()=>{if(e!==void 0)return;const d=new AbortController;return wa().then(n=>{if(d.signal.aborted)return;const p=n.seasonal_moods==="auto"||n.seasonal_moods==="off"?n.seasonal_moods:n.seasonal_moods.filter(La);i(Se(new Date,p))}).catch(()=>{}),()=>d.abort()},[e]),{season:c?void 0:r,available:r,hidden:c,setHidden:d=>{Ce(d),t(d)}}}const V={reliability:"Reliability",observability:"Observability",scheduling:"Scheduling",ownership:"Ownership",structure:"Structure",performance:"Performance",security:"Security"},Aa={fail:0,warn:1,pass:2,ack:3,skip:4},De={A:"Shining bright. This DAG is in great shape.",B:"A steady flame. A few small things to polish.",C:"Burning, but dimly. Some important habits are missing.",D:"Flickering. This DAG needs attention soon.",F:"The lamp has gone out. Start with the red items below."},T=e=>e.weight-e.points,za=(e,r)=>Aa[e.status]-Aa[r.status]||T(r)-T(e);function Ae({dagId:e}){const{data:r,error:i,reload:c}=B(t=>Ya(e,t),[e]);return i?a.jsx(G,{title:"Couldn't check this DAG",body:i,action:a.jsx("button",{className:"dagwick-btn",onClick:c,children:"Try again"})}):r?a.jsx(_e,{report:r},r.dag_id):a.jsx(R,{})}function ze(e,r){const i=[...r].reverse().find(([,p])=>p>e.score);if(!i)return;const[c,t]=i;let s=t/100*e.max_points-e.points;const d=[],n=e.checks.filter(p=>p.status==="fail"||p.status==="warn").sort((p,m)=>T(m)-T(p));for(const p of n){if(s<=1e-9)break;d.push(p),s-=T(p)}return s<=1e-9?{grade:c,picks:d}:void 0}function _e({report:e}){const r=Da(),i=r.season,c=e.counts.fail+e.counts.warn,[t,s]=g.useState(c?"attention":"all"),[d,n]=g.useState(()=>{const w=e.checks.filter(N=>N.fix).sort(za),L=w.filter(N=>N.status==="fail");return new Set((L.length?L:w.slice(0,2)).map(N=>N.id))}),p=w=>n(L=>{const N=new Set(L);return N.delete(w)||N.add(w),N}),m=g.useMemo(()=>Ee(e.checks),[e]),$=Sa(),f=g.useMemo(()=>ze(e,$),[e,$]),y=g.useMemo(()=>e.checks.filter(w=>t==="all"?!0:t==="passed"?w.status==="pass":w.status==="fail"||w.status==="warn").sort(za),[e,t]),z=w=>{s("attention"),n(L=>new Set(L).add(w)),requestAnimationFrame(()=>document.getElementById(`dagwick-check-${w}`)?.scrollIntoView({behavior:"smooth",block:"center"}))};return a.jsxs(a.Fragment,{children:[a.jsxs("section",{className:`dagwick-hero dagwick-grade-${e.grade}${i?` dagwick-season dagwick-season-${i.id}`:""}`,children:[a.jsx(Na,{season:i}),a.jsx(ha,{grade:e.grade,season:i?.id}),a.jsxs("div",{className:"dagwick-hero-text",children:[a.jsx($a,{state:r}),ba("DAG health"),a.jsx("h2",{className:"dagwick-dag",children:e.dag_id}),a.jsx("p",{className:"dagwick-headline",children:De[e.grade]}),a.jsxs("div",{className:"dagwick-chips",children:[a.jsx(K,{status:"pass",n:e.counts.pass,label:"passing"}),a.jsx(K,{status:"warn",n:e.counts.warn,label:"to improve"}),a.jsx(K,{status:"fail",n:e.counts.fail,label:"failing"}),e.counts.ack>0&&a.jsx(K,{status:"ack",n:e.counts.ack,label:"acknowledged"})]})]}),a.jsx("div",{className:"dagwick-hero-side",children:a.jsx(ka,{score:e.score,grade:e.grade})})]}),f?a.jsxs("section",{className:"dagwick-goal",children:[a.jsxs("div",{className:"dagwick-goal-text",children:[a.jsx("span",{className:"dagwick-goal-step",children:"Next step"}),"Fix ",f.picks.length===1?"this check":`these ${f.picks.length} checks`," to reach"," ",a.jsx("span",{className:`dagwick-badge dagwick-badge--${f.grade}`,children:f.grade})]}),a.jsx("div",{className:"dagwick-goal-picks",children:f.picks.map(w=>a.jsxs("button",{className:"dagwick-pick",onClick:()=>z(w.id),children:[w.title," ",a.jsxs("span",{className:"dagwick-pick-gain",children:["+",T(w).toFixed(w.points%1?1:0)]})]},w.id))})]}):e.score<100?a.jsx("section",{className:"dagwick-goal dagwick-goal--top",children:a.jsxs("div",{className:"dagwick-goal-text",children:[a.jsx("span",{className:"dagwick-goal-step",children:"Top grade"})," Polish the last ",c," item",c===1?"":"s"," for a perfect 100."]})}):null,a.jsx("section",{className:"dagwick-cats","aria-label":"Score by category",children:m.map(w=>a.jsxs("div",{className:"dagwick-cat",children:[a.jsxs("div",{className:"dagwick-cat-head",children:[a.jsx("span",{children:V[w.id]??w.id}),a.jsxs("span",{className:"dagwick-muted",children:[Math.round(w.pct),"%"]})]}),a.jsx("div",{className:"dagwick-bar",children:a.jsx("div",{className:"dagwick-bar-fill",style:{width:`${w.pct}%`,background:Oe(w.pct)}})})]},w.id))}),a.jsx(te,{dagId:e.dag_id}),a.jsx(ne,{dagId:e.dag_id}),a.jsxs("section",{className:"dagwick-list",children:[a.jsxs("div",{className:"dagwick-tabs",role:"tablist",children:[a.jsxs(ra,{active:t==="attention",onClick:()=>s("attention"),children:["Needs attention ",a.jsx("span",{className:"dagwick-count",children:c})]}),a.jsxs(ra,{active:t==="all",onClick:()=>s("all"),children:["All checks ",a.jsx("span",{className:"dagwick-count",children:e.checks.length})]}),a.jsxs(ra,{active:t==="passed",onClick:()=>s("passed"),children:["Passed ",a.jsx("span",{className:"dagwick-count",children:e.counts.pass})]})]}),y.length===0?a.jsx("div",{className:"dagwick-clear",children:"Nothing here. Every check in this view is passing. ✨"}):a.jsx("ul",{className:"dagwick-checks",children:y.map(w=>a.jsx(Te,{check:w,open:d.has(w.id),onToggle:()=>p(w.id)},w.id))})]}),a.jsxs("footer",{className:"dagwick-foot dagwick-muted",children:[e.points," / ",e.max_points," points · scored automatically from the latest parsed version of this DAG · ",W," ",ga]})]})}const Fe={pass:"✓",warn:"!",fail:"✕",skip:"–",ack:"~"},ia=8;function Te({check:e,open:r,onToggle:i}){const[c,t]=g.useState(!1),s=!!e.fix,d=c?e.items:e.items.slice(0,ia);return a.jsxs("li",{id:`dagwick-check-${e.id}`,className:`dagwick-check dagwick-check--${e.status}${r&&s?" is-open":""}`,children:[a.jsx("span",{className:"dagwick-icon","aria-label":e.status,children:Fe[e.status]}),a.jsxs("div",{className:"dagwick-check-body",children:[a.jsxs("button",{className:"dagwick-check-head",onClick:s?i:void 0,disabled:!s,"aria-expanded":s?r:void 0,children:[a.jsx("span",{className:"dagwick-check-title",children:e.title}),a.jsx("span",{className:"dagwick-tag",children:V[e.category]??e.category}),e.pack&&e.pack!=="dagwick"&&a.jsx("span",{className:"dagwick-tag dagwick-tag--pack",title:`From the check pack ${e.pack}`,children:e.pack}),a.jsxs("span",{className:"dagwick-pts",children:[e.status==="skip"||e.status==="ack"?"n/a":`${e.points} / ${e.weight}`,s&&a.jsx("span",{className:"dagwick-caret",children:r?"▾":"▸"})]})]}),a.jsx("div",{className:"dagwick-check-msg",children:e.message}),e.ack_reason&&a.jsxs("div",{className:"dagwick-ack",children:[a.jsx("span",{className:"dagwick-ack-label",children:"Acknowledged"}),e.ack_reason]}),e.ack_note&&a.jsx("div",{className:"dagwick-ack-note",children:e.ack_note}),r&&s&&a.jsxs("div",{className:"dagwick-detail",children:[e.items.length>0&&a.jsxs("div",{className:"dagwick-items",children:[a.jsx("span",{className:"dagwick-items-label",children:"Affected"}),d.map(n=>a.jsx("code",{className:"dagwick-item",children:n},n)),e.items.length>ia&&a.jsx("button",{className:"dagwick-more",onClick:()=>t(!c),children:c?"show less":`+${e.items.length-ia} more`})]}),a.jsxs("div",{className:"dagwick-fix",children:[a.jsx("span",{className:"dagwick-fix-label",children:"How to fix"}),e.fix,e.example&&a.jsx(Ja,{code:e.example})]})]})]})]})}function K({status:e,n:r,label:i}){return a.jsxs("span",{className:`dagwick-chip dagwick-chip--${e}`,children:[a.jsx("strong",{children:r})," ",i]})}function ra({active:e,onClick:r,children:i}){return a.jsx("button",{role:"tab","aria-selected":e,className:`dagwick-tab${e?" is-active":""}`,onClick:r,children:i})}function Ee(e){const r=new Map;for(const i of e){if(i.status==="skip"||i.status==="ack")continue;const c=r.get(i.category)??{earned:0,possible:0};c.earned+=i.points,c.possible+=i.weight,r.set(i.category,c)}return Object.keys(V).filter(i=>r.has(i)).concat([...r.keys()].filter(i=>!(i in V))).map(i=>{const c=r.get(i);return{id:i,pct:c.possible?c.earned/c.possible*100:0}})}function Oe(e){return e>=90?"var(--dagwick-pass)":e>=60?"var(--dagwick-warn)":"var(--dagwick-fail)"}function _a(e){return[...new Set(e.split(",").map(r=>r.trim()).filter(Boolean))]}function Fa(e){const r=new Map;for(const i of e)for(const c of new Set(i))r.set(c,(r.get(c)??0)+1);return[...r.entries()].map(([i,c])=>({name:i,count:c})).sort((i,c)=>c.count-i.count||i.name.localeCompare(c.name))}function ca(e,r){return(!r.owner||_a(e.owners).includes(r.owner))&&(!r.tag||(e.tags??[]).includes(r.tag))}function Be(e){const r=[e.owner,e.tag&&`#${e.tag}`].filter(Boolean);return r.length?r.join(" · "):void 0}function Ge(e){const r=new URLSearchParams(e);return{owner:r.get("owner")||void 0,tag:r.get("tag")||void 0}}function Ie(e,r){const i=new URLSearchParams(e);for(const t of["owner","tag"]){const s=r[t];s?i.set(t,s):i.delete(t)}const c=i.toString();return c?`?${c}`:""}function Pe(e,r){return{owners:Fa(e.filter(i=>ca(i,{tag:r.tag})).map(i=>_a(i.owners))),tags:Fa(e.filter(i=>ca(i,{owner:r.owner})).map(i=>i.tags??[]))}}function He(e,r,i){if(i!==0){if(e==="ArrowDown")return Math.min(r+1,i-1);if(e==="ArrowUp")return Math.max(r-1,0);if(e==="Home")return 0;if(e==="End")return i-1;if(e==="PageDown")return Math.min(r+8,i-1);if(e==="PageUp")return Math.max(r-8,0)}}function Ye(e,r,i){const c=r.toLowerCase();if(!c)return;const t=c.length>1&&[...c].every(n=>n===c[0]),s=t?c[0]:c,d=c.length===1||t?i+1:i;for(let n=0;n<e.length;n++){const p=(d+n)%e.length;if(e[p].toLowerCase().startsWith(s))return p}}const Ue=700;function Ta({label:e,all:r,empty:i,options:c,value:t,onChange:s}){const d=g.useId(),[n,p]=g.useState(!1),[m,$]=g.useState(0),f=g.useRef(null),y=g.useRef(null),z=g.useRef(null),w=g.useRef({text:"",at:0}),L=t&&!c.some(l=>l.name===t)?[{name:t,count:0},...c]:c,N=[{name:"",label:r,count:void 0},...L.map(l=>({...l,label:l.name}))],b=Math.max(0,N.findIndex(l=>l.name===(t??""))),M=N.length===1,E=()=>{$(b),p(!0)},O=(l=!0)=>{p(!1),l&&y.current?.focus()},D=l=>{O(),s(N[l].name||void 0)};g.useEffect(()=>{if(!n)return;z.current?.focus();const l=v=>!f.current?.contains(v.target)&&p(!1);return document.addEventListener("mousedown",l),()=>document.removeEventListener("mousedown",l)},[n]),g.useEffect(()=>{n&&z.current?.querySelector(`[data-i="${m}"]`)?.scrollIntoView({block:"nearest"})},[n,m]);const H=l=>{const v=Date.now();w.current={text:(v-w.current.at<Ue?w.current.text:"")+l,at:v};const A=Ye(N.map(Q=>Q.label),w.current.text,m);A!==void 0&&$(A)},Y=l=>{["ArrowDown","ArrowUp","Enter"," "].includes(l.key)&&(l.preventDefault(),E())},X=l=>{const v=He(l.key,m,N.length);v!==void 0?(l.preventDefault(),$(v)):l.key==="Enter"||l.key===" "&&!w.current.text?(l.preventDefault(),D(m)):l.key==="Escape"?(l.preventDefault(),O()):l.key==="Tab"?O(!1):l.key.length===1&&!l.metaKey&&!l.ctrlKey&&!l.altKey&&(l.preventDefault(),H(l.key))};return a.jsxs("div",{className:"dagwick-dd",ref:f,children:[a.jsx("span",{id:`${d}-label`,className:"dagwick-sr-only",children:e}),a.jsx("button",{ref:y,id:`${d}-button`,type:"button",className:`dagwick-select${t?" is-set":""}`,"aria-haspopup":"listbox","aria-expanded":n,"aria-labelledby":`${d}-label ${d}-button`,disabled:M,onClick:()=>n?O():E(),onKeyDown:Y,children:a.jsx("span",{className:"dagwick-dd-value",children:t??(M?i:r)})}),n&&a.jsx("ul",{ref:z,className:"dagwick-dd-list",role:"listbox",tabIndex:-1,"aria-labelledby":`${d}-label`,"aria-activedescendant":`${d}-opt-${m}`,onKeyDown:X,onBlur:l=>!f.current?.contains(l.relatedTarget)&&p(!1),children:N.map((l,v)=>[a.jsxs("li",{id:`${d}-opt-${v}`,"data-i":v,role:"option","aria-selected":v===b,className:`dagwick-dd-opt${v===m?" is-active":""}`,onMouseMove:()=>v!==m&&$(v),onClick:()=>D(v),children:[a.jsx("span",{className:"dagwick-dd-check","aria-hidden":"true",children:v===b?"✓":""}),a.jsx("span",{className:"dagwick-dd-name",children:l.label}),l.count!==void 0&&a.jsx("span",{className:"dagwick-dd-count",children:l.count})]},l.name||"__all"),v===0&&N.length>1&&a.jsx("li",{className:"dagwick-dd-sep",role:"presentation"},"__sep")])})]})}const We=["dag_id","owners","tags","paused","score","grade","failing_checks","warning_checks","runs_30d","success_rate"];function qe(e){if(e==null)return"";let r=String(e);return typeof e=="string"&&/^[=+\-@\t\r]/.test(r)&&(r=`'${r}`),/[",\r\n]/.test(r)?`"${r.replace(/"/g,'""')}"`:r}const Ea=(e,r)=>e.issues.filter(i=>i.status===r).map(i=>i.id).join("; ");function Ze(e){const r=e.map(i=>[i.dag_id,i.owners,(i.tags??[]).join("; "),i.is_paused,i.score,i.grade,Ea(i,"fail"),Ea(i,"warn"),i.health?.runs??0,i.health?.success_rate??null]);return[We,...r].map(i=>i.map(qe).join(",")).join(`\r
`)+`\r
`}function Ve(e=new Date){const r=i=>String(i).padStart(2,"0");return`dagwick-fleet-${e.getFullYear()}-${r(e.getMonth()+1)}-${r(e.getDate())}.csv`}function Ke(e,r){const i=URL.createObjectURL(new Blob(["\uFEFF",r],{type:"text/csv;charset=utf-8"})),c=document.createElement("a");c.href=i,c.download=e,document.body.appendChild(c),c.click(),c.remove(),setTimeout(()=>URL.revokeObjectURL(i),0)}const Oa=["A","B","C","D","F"],Xe={A:"Shining",B:"Steady",C:"Dim",D:"Flickering",F:"Out"},Qe={A:"The whole fleet is shining.",B:"The fleet burns steady.",C:"The fleet glows dimly.",D:"The fleet is flickering.",F:"The fleet has gone dark."},je={A:"is shining.",B:"burns steady.",C:"glows dimly.",D:"is flickering.",F:"has gone dark."},Je=[{id:"worst",label:"Needs care"},{id:"best",label:"Healthiest"},{id:"name",label:"A–Z"}],ta=3,Re=6;function ai(){const{data:e,error:r,reload:i}=B(c=>qa(c),[]);return r?a.jsx(G,{title:"Couldn't load the fleet",body:r,action:a.jsx("button",{className:"dagwick-btn",onClick:i,children:"Try again"})}):e?e.dags.length===0?a.jsx(G,{title:"No DAGs yet",body:"Once Airflow parses a DAG you can read, it shows up here."}):a.jsx(ei,{dags:e.dags,truncated:e.truncated}):a.jsx(R,{label:"Checking every DAG…"})}function ei({dags:e,truncated:r}){const i=Da(),c=i.season,[t,s]=g.useState(""),[d,n]=g.useState(),[p,m]=g.useState(),[$,f]=g.useState("worst"),[y,z]=g.useState(()=>Ge(window.location.search)),w=o=>{z(o),n(void 0),m(void 0);const{pathname:k,search:u,hash:U}=window.location;window.history.replaceState(window.history.state,"",k+Ie(u,o)+U)},{owners:L,tags:N}=g.useMemo(()=>Pe(e,y),[e,y]),b=g.useMemo(()=>e.filter(o=>ca(o,y)),[e,y]),M=Be(y),E=b.reduce((o,k)=>o+k.score,0)/b.length,O=Sa(),D=ye(E,O),H=g.useMemo(()=>Object.fromEntries(Oa.map(o=>[o,b.filter(k=>k.grade===o).length])),[b]),Y=H.A+H.B,X=b.reduce((o,k)=>o+(k.counts.ack??0),0),l=b.length-Y,v=g.useMemo(()=>{const o=new Map;for(const k of b)for(const u of k.issues){const U=o.get(u.id)??{id:u.id,title:u.title,dags:0,fails:0};U.dags+=1,u.status==="fail"&&(U.fails+=1),o.set(u.id,U)}return[...o.values()].sort((k,u)=>u.dags-k.dags||u.fails-k.fails).slice(0,Re)},[b]),A=g.useMemo(()=>{const o=t.trim().toLowerCase();return b.filter(k=>(!d||k.grade===d)&&(!p||k.issues.some(u=>u.id===p.id))&&(!o||k.dag_id.toLowerCase().includes(o)||k.owners.toLowerCase().includes(o))).sort((k,u)=>$==="name"?k.dag_id.localeCompare(u.dag_id):$==="best"?u.score-k.score:k.score-u.score)},[b,t,d,p,$]),Q=!!(d||p||t.trim());return b.length===0?a.jsx(a.Fragment,{children:a.jsx(G,{title:`No DAGs for ${M}`,body:"Nothing you can see matches this owner and tag. The link may be old, or the DAGs may have moved.",action:a.jsx("button",{className:"dagwick-btn",onClick:()=>w({}),children:"Show all DAGs"})})}):a.jsxs(a.Fragment,{children:[a.jsxs("section",{className:`dagwick-hero dagwick-grade-${D}${c?` dagwick-season dagwick-season-${c.id}`:""}`,children:[a.jsx(Na,{season:c}),a.jsx(ha,{grade:D,season:c?.id}),a.jsxs("div",{className:"dagwick-hero-text",children:[a.jsx($a,{state:i}),ba("Fleet health"),a.jsx("h2",{className:"dagwick-dag",children:M??"All DAGs"}),a.jsxs("p",{className:"dagwick-headline",children:[M?`${M} ${je[D]}`:Qe[D]," ",l===0?"Every DAG is healthy.":`${l} of ${b.length} ${b.length===1?"DAG needs":"DAGs need"} care.`]}),a.jsxs("div",{className:"dagwick-stats",children:[a.jsx(P,{value:b.length,label:"DAGs"}),a.jsx(P,{value:(Math.floor(E*10)/10).toFixed(1),label:"average score"}),a.jsx(P,{value:l,label:"need care (C–F)",tone:l?"fail":void 0}),a.jsx(P,{value:Y,label:"healthy (A–B)",tone:Y?"pass":void 0}),X>0&&a.jsx(P,{value:X,label:"acknowledged"})]})]}),a.jsxs("div",{className:"dagwick-hero-side",children:[a.jsx(ka,{score:E,grade:D}),a.jsx("span",{className:"dagwick-muted dagwick-ring-caption",children:M?"average":"fleet average"})]})]}),a.jsx("section",{className:"dagwick-grades","aria-label":"Filter by grade",children:Oa.map(o=>{const k=H[o],u=d===o;return a.jsxs("button",{className:`dagwick-gcard dagwick-gcard--${o}${u?" is-active":""}${d&&!u?" is-dim":""}`,disabled:k===0,onClick:()=>n(u?void 0:o),"aria-pressed":u,children:[a.jsx(fa,{grade:o,size:"lg"}),a.jsxs("div",{className:"dagwick-gcard-text",children:[a.jsx("span",{className:"dagwick-gcard-n",children:k}),a.jsx("span",{className:"dagwick-muted",children:Xe[o]})]}),a.jsx("div",{className:"dagwick-gcard-bar",children:a.jsx("div",{style:{width:`${k/b.length*100}%`}})})]},o)})}),a.jsxs("div",{className:"dagwick-fleet-grid",children:[a.jsxs("section",{className:"dagwick-list",children:[a.jsxs("div",{className:"dagwick-toolbar",children:[a.jsxs("div",{className:"dagwick-search-wrap",children:[a.jsxs("svg",{viewBox:"0 0 24 24",width:"16",height:"16","aria-hidden":"true",children:[a.jsx("circle",{cx:"11",cy:"11",r:"7",fill:"none",stroke:"currentColor",strokeWidth:"2"}),a.jsx("path",{d:"M20 20l-4-4",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round"})]}),a.jsx("input",{className:"dagwick-search",type:"search",placeholder:"Search DAGs",value:t,onChange:o=>s(o.target.value),"aria-label":"Search DAGs"})]}),a.jsx(Ta,{label:"Filter by owner",all:"All owners",empty:"No owners",options:L,value:y.owner,onChange:o=>w({...y,owner:o})}),a.jsx(Ta,{label:"Filter by tag",all:"All tags",empty:"No tags",options:N,value:y.tag,onChange:o=>w({...y,tag:o})}),a.jsx("div",{className:"dagwick-seg",role:"radiogroup","aria-label":"Sort",children:Je.map(o=>a.jsx("button",{role:"radio","aria-checked":$===o.id,className:$===o.id?"is-active":"",onClick:()=>f(o.id),children:o.label},o.id))}),a.jsx("button",{className:"dagwick-btn dagwick-csv",onClick:()=>Ke(Ve(),Ze(A)),disabled:A.length===0,title:Q||M?"Download the DAGs shown, as CSV":"Download every DAG, as CSV",children:"Download CSV"})]}),Q&&a.jsxs("div",{className:"dagwick-filters",children:[a.jsxs("span",{className:"dagwick-muted",children:[A.length," of ",b.length," DAGs"]}),d&&a.jsxs(oa,{onClear:()=>n(void 0),children:["Grade ",d]}),p&&a.jsx(oa,{onClear:()=>m(void 0),children:p.title}),t.trim()&&a.jsxs(oa,{onClear:()=>s(""),children:["“",t.trim(),"”"]})]}),A.length===0?a.jsx("div",{className:"dagwick-clear",children:"No DAG matches."}):a.jsx("ul",{className:"dagwick-rows",children:A.map(o=>a.jsx("li",{children:a.jsxs(ee,{dagId:o.dag_id,className:`dagwick-row dagwick-row--${o.grade}`,children:[a.jsx(ae,{score:o.score,grade:o.grade}),a.jsxs("div",{className:"dagwick-row-main",children:[a.jsxs("div",{className:"dagwick-row-title",children:[a.jsx("span",{className:"dagwick-row-name",children:o.dag_id}),o.is_paused&&a.jsx("span",{className:"dagwick-tag",children:"paused"})]}),a.jsxs("div",{className:"dagwick-row-sub dagwick-muted",children:[o.owners&&a.jsx("span",{children:o.owners}),a.jsx("span",{children:o.counts.fail+o.counts.warn===0?"All checks passing":`${o.counts.fail} failing · ${o.counts.warn} to improve`}),o.counts.ack>0&&a.jsxs("span",{children:[o.counts.ack," acknowledged"]}),o.health&&o.health.runs>0&&o.health.success_rate!==null&&a.jsxs("span",{className:o.health.success_rate<90?"dagwick-health-low":void 0,children:[o.health.success_rate,"% of ",o.health.runs," runs succeeded"]})]}),o.issues.length>0&&a.jsxs("div",{className:"dagwick-row-issues",children:[o.issues.slice(0,ta).map(k=>a.jsx("span",{className:`dagwick-ichip dagwick-ichip--${k.status}`,children:k.title},k.id)),o.issues.length>ta&&a.jsxs("span",{className:"dagwick-ichip dagwick-ichip--more",children:["+",o.issues.length-ta]})]})]}),a.jsx(fa,{grade:o.grade}),a.jsx("span",{className:"dagwick-row-go","aria-hidden":"true",children:"›"})]})},o.dag_id))})]}),a.jsx("aside",{className:"dagwick-side",children:a.jsxs("div",{className:"dagwick-side-card",children:[a.jsxs("h3",{className:"dagwick-side-title",children:["Most common issues",M?` · ${M}`:""]}),v.length===0?a.jsx("p",{className:"dagwick-muted dagwick-side-empty",children:"No issues anywhere. ✨"}):a.jsx("ul",{className:"dagwick-common",children:v.map(o=>{const k=p?.id===o.id;return a.jsx("li",{children:a.jsxs("button",{className:`dagwick-common-item${k?" is-active":""}`,onClick:()=>m(k?void 0:{id:o.id,title:o.title}),"aria-pressed":k,children:[a.jsxs("div",{className:"dagwick-common-head",children:[a.jsx("span",{children:o.title}),a.jsxs("span",{className:"dagwick-muted",children:[o.dags,"/",b.length]})]}),a.jsx("div",{className:"dagwick-bar",children:a.jsx("div",{className:"dagwick-bar-fill",style:{width:`${o.dags/b.length*100}%`,background:o.fails>=o.dags/2?"var(--dagwick-fail)":"var(--dagwick-warn)"}})})]})},o.id)})}),a.jsx("p",{className:"dagwick-side-hint dagwick-muted",children:"Click an issue to see which DAGs have it."})]})})]}),a.jsxs("footer",{className:"dagwick-foot dagwick-muted",children:[r?`Showing the first ${e.length} DAGs. `:"","Scored automatically from the latest parsed version of each DAG. · ",W," ",ga]})]})}function P({value:e,label:r,tone:i}){return a.jsxs("div",{className:`dagwick-stat${i?` dagwick-stat--${i}`:""}`,children:[a.jsx("span",{className:"dagwick-stat-value",children:e}),a.jsx("span",{className:"dagwick-stat-label",children:r})]})}function oa({children:e,onClear:r}){return a.jsxs("button",{className:"dagwick-fchip",onClick:r,"aria-label":"Remove filter",children:[e," ",a.jsx("span",{"aria-hidden":"true",children:"✕"})]})}const ii=[{id:"fleet",label:"Fleet"},{id:"themes",label:"Themes"}];function ri(e){return new URLSearchParams(e).get("view")==="themes"?"themes":"fleet"}function ci(e,r){const i=new URLSearchParams(e);r==="fleet"?i.delete("view"):i.set("view",r);const c=i.toString();return c?`?${c}`:""}function ti({view:e,onChange:r}){const i=c=>{const{pathname:t,search:s,hash:d}=window.location;window.history.replaceState(window.history.state,"",t+ci(s,c)+d),r(c)};return a.jsx("nav",{className:"dagwick-pagetabs","aria-label":"Dagwick pages",children:ii.map(c=>a.jsx("button",{type:"button",className:`dagwick-pagetab${e===c.id?" is-active":""}`,"aria-current":e===c.id?"page":void 0,onClick:()=>i(c.id),children:c.label},c.id))})}const da="dagwick_themes_off",sa="dagwick_theme_preview",oi=3600*24*365;function Ba(e){const r={};for(const i of e.split(";")){const c=i.indexOf("=");c>0&&(r[i.slice(0,c).trim()]=decodeURIComponent(i.slice(c+1).trim()))}return r}function di(e){return(Ba(e)[da]??"").split(",").map(r=>r.trim()).filter(Boolean)}function si(e,r,i){const c=e.filter(t=>t!==r);return i?[...c,r]:c}function ni(e){return e.length?`${da}=${e.join(",")}; Path=/; Max-Age=${oi}; SameSite=Lax`:`${da}=; Path=/; Max-Age=0; SameSite=Lax`}function Ga(e){return e?`${sa}=${e}; Path=/; SameSite=Lax`:`${sa}=; Path=/; Max-Age=0; SameSite=Lax`}const li=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];function gi(e,r){const i=([c,t])=>`${t} ${li[c-1]}`;return e[0]===r[0]&&e[1]===r[1]?i(e):`${i(e)} – ${i(r)}`}function wi(e,r,i){return i===e.id?"preview":r.includes(e.id)?"off":e.active&&!i?"showing":"waiting"}const pi={showing:{label:"Showing now",tone:"on"},preview:{label:"Previewing",tone:"on"},off:{label:"Off for you",tone:"off"},waiting:{label:"Not in season",tone:"idle"}};function na(e){document.cookie=e,window.location.reload()}function ki(){const{data:e,error:r,reload:i}=B(d=>Za(d),[]),[c]=g.useState(()=>document.cookie);if(r)return a.jsx(G,{title:"Couldn't load the themes",body:r,action:a.jsx("button",{className:"dagwick-btn",onClick:i,children:"Try again"})});if(!e)return a.jsx(R,{label:"Loading themes…"});const t=di(c),s=Ba(c)[sa]||void 0;return a.jsxs("section",{className:"dagwick-themes",children:[a.jsxs("header",{className:"dagwick-themes-head",children:[a.jsx("h2",{children:"Seasonal themes"}),a.jsx("p",{className:"dagwick-muted",children:"On their dates, themes decorate all of Airflow, not only Dagwick, and switch off by themselves afterwards. Your choices are saved in this browser and only change what you see."})]}),a.jsx("div",{className:"dagwick-theme-list",children:e.map(d=>a.jsx(hi,{theme:d,status:wi(d,t,s),off:t},d.id))})]})}function hi({theme:e,status:r,off:i}){const c=i.includes(e.id),t=pi[r];return a.jsxs("article",{className:"dagwick-theme",children:[a.jsx(fi,{}),a.jsxs("div",{className:"dagwick-theme-body",children:[a.jsxs("div",{className:"dagwick-theme-title",children:[a.jsx("h3",{children:e.name}),a.jsx("span",{className:`dagwick-theme-status is-${t.tone}`,children:t.label})]}),a.jsxs("p",{className:"dagwick-theme-dates",children:[gi(e.start,e.end)," · every year"]}),a.jsx("p",{className:"dagwick-muted",children:e.description}),a.jsxs("div",{className:"dagwick-theme-actions",children:[a.jsxs("label",{className:"dagwick-switch",children:[a.jsx("input",{type:"checkbox",role:"switch",checked:!c,onChange:s=>na(ni(si(i,e.id,!s.target.checked)))}),a.jsx("span",{"aria-hidden":"true"}),"Show on its dates"]}),r==="preview"?a.jsx("button",{className:"dagwick-btn",onClick:()=>na(Ga()),children:"Stop preview"}):a.jsx("button",{className:"dagwick-btn",onClick:()=>na(Ga(e.id)),children:"Preview now"})]})]})]})}function fi(){const e=[[26,22,7],[70,46,5],[112,18,9],[150,52,6],[190,26,7],[48,64,4],[132,74,4]];return a.jsxs("svg",{className:"dagwick-theme-scene",viewBox:"0 0 220 110",role:"img","aria-label":"Snow falling over Airflow",children:[a.jsx("rect",{width:"220",height:"110",fill:"#1b2433"}),e.map(([r,i,c],t)=>a.jsx("g",{transform:`translate(${r} ${i}) rotate(${t*13})`,stroke:"#fff",strokeWidth:c/6,strokeLinecap:"round",fill:"none",opacity:.45+t%3*.15,children:[0,60,120,180,240,300].map(s=>a.jsx("path",{transform:`rotate(${s})`,d:`M0 0 V${-c} M0 ${-c*.45} l${-c*.22} ${-c*.2} M0 ${-c*.45} l${c*.22} ${-c*.2}`},s))},t)),a.jsx("path",{d:"M0 96 C30 86 60 88 90 94 S150 102 180 92 S210 86 220 90 V110 H0Z",fill:"#eef4fa"})]})}const bi=`
.dagwick {
  --dagwick-bg: #ffffff;
  --dagwick-surface: #f8f7f4;
  --dagwick-border: #e7e3dc;
  --dagwick-text: #1d2129;
  --dagwick-muted: #6b6f78;
  --dagwick-pass: #15803d;
  --dagwick-pass-bg: #e8f5ec;
  --dagwick-warn: #b45309;
  --dagwick-warn-bg: #fdf3e2;
  --dagwick-fail: #c2410c;
  --dagwick-fail-bg: #fdece4;
  --dagwick-accent: #d97706;
  --dagwick-flame: #f59e0b;
  --dagwick-flame-deep: #ea580c;
  --dagwick-flame-core: #fde68a;
  --dagwick-metal: #e0a040;
  --dagwick-metal-dark: #8a5a1c;
  --dagwick-glass: #bfe3f7;
  --dagwick-glass-edge: rgba(120, 150, 170, 0.55);
  --dagwick-wick: #3f2a1d;
  --dagwick-ink: #3b1f12;
  --dagwick-blush: #f4a28c;
  --dagwick-tear: #60a5fa;
  --dagwick-smoke: #a8a29e;
  --dagwick-shadow: rgba(60, 40, 20, 0.12);
  color: var(--dagwick-text);
  font: inherit;
  padding: 8px 4px 24px;
  width: 100%;
  max-width: 1440px;
  margin-inline: auto;
  box-sizing: border-box;
  container: dagwick / inline-size;
}
html.dark .dagwick {
  --dagwick-bg: #171a21;
  --dagwick-surface: #1e222b;
  --dagwick-border: #2c313c;
  --dagwick-text: #ebe7e0;
  --dagwick-muted: #9a9fab;
  --dagwick-pass: #4ade80;
  --dagwick-pass-bg: rgba(74, 222, 128, 0.1);
  --dagwick-warn: #fbbf24;
  --dagwick-warn-bg: rgba(251, 191, 36, 0.1);
  --dagwick-fail: #fb7c4c;
  --dagwick-fail-bg: rgba(251, 124, 76, 0.12);
  --dagwick-accent: #fbbf24;
  --dagwick-shadow: rgba(0, 0, 0, 0.35);
  --dagwick-glass: #dbeefa;
  --dagwick-glass-edge: rgba(200, 225, 240, 0.4);
  --dagwick-smoke: #6b7280;
}
.dagwick * { box-sizing: border-box; }
.dagwick-muted { color: var(--dagwick-muted); }

.dagwick-hero {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 24px;
  align-items: center;
  padding: 20px 24px;
  border: 1px solid var(--dagwick-border);
  border-radius: 16px;
  background:
    radial-gradient(600px 220px at 0% 0%, color-mix(in srgb, var(--dagwick-flame) 14%, transparent), transparent 70%),
    var(--dagwick-bg);
}
.dagwick-grade-D, .dagwick-grade-F { background: var(--dagwick-bg); }
.dagwick-eyebrow { font-size: 12px; letter-spacing: .08em; text-transform: uppercase; color: var(--dagwick-muted); }
.dagwick-brand { color: var(--dagwick-accent); font-weight: 700; }
.dagwick-dag { margin: 4px 0 6px; font-size: 22px; font-weight: 700; word-break: break-all; }
.dagwick-headline { margin: 0 0 12px; font-size: 15px; }
.dagwick-potential { margin: 10px 0 0; font-size: 13px; color: var(--dagwick-muted); }
.dagwick-potential strong { color: var(--dagwick-accent); }
.dagwick-chips { display: flex; flex-wrap: wrap; gap: 8px; }
.dagwick-chip { font-size: 13px; padding: 3px 10px; border-radius: 999px; }
.dagwick-chip--pass { color: var(--dagwick-pass); background: var(--dagwick-pass-bg); }
.dagwick-chip--warn { color: var(--dagwick-warn); background: var(--dagwick-warn-bg); }
.dagwick-chip--fail { color: var(--dagwick-fail); background: var(--dagwick-fail-bg); }
.dagwick-chip--ack { color: var(--dagwick-muted); background: var(--dagwick-surface); }
.dagwick-hero-side { display: flex; flex-direction: column; align-items: center; gap: 12px; }

.dagwick-ring { position: relative; width: 132px; height: 132px; }
.dagwick-ring-track { fill: none; stroke: var(--dagwick-border); stroke-width: 10; }
.dagwick-ring-fill { fill: none; stroke: var(--dagwick-accent); stroke-width: 10; stroke-linecap: round; transition: stroke-dashoffset .9s cubic-bezier(.2,.8,.2,1); }
.dagwick-grade-A .dagwick-ring-fill { stroke: var(--dagwick-pass); }
.dagwick-grade-D .dagwick-ring-fill, .dagwick-grade-F .dagwick-ring-fill { stroke: var(--dagwick-fail); }
.dagwick-ring-label { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; line-height: 1; }
.dagwick-grade { font-size: 40px; font-weight: 800; }
.dagwick-score { font-size: 13px; color: var(--dagwick-muted); margin-top: 4px; }

.dagwick-btn {
  font: inherit; font-size: 13px; padding: 6px 14px; border-radius: 8px; cursor: pointer;
  color: var(--dagwick-text); background: var(--dagwick-surface); border: 1px solid var(--dagwick-border);
}
.dagwick-btn:hover:not(:disabled) { border-color: var(--dagwick-accent); }
.dagwick-csv { margin-left: auto; }
.dagwick-btn:disabled { opacity: .6; cursor: progress; }
.dagwick-btn:focus-visible, .dagwick-tab:focus-visible { outline: 2px solid var(--dagwick-accent); outline-offset: 2px; }

.dagwick-health { margin: 16px 0; }
.dagwick-health-head { display: flex; flex-wrap: wrap; align-items: baseline; gap: 4px 10px; }
.dagwick-health-head .dagwick-muted { font-size: 12px; }
.dagwick-health .dagwick-cats { margin: 8px 0 0; }
.dagwick-health-empty { margin: 6px 0 0; font-size: 13px; }
.dagwick-htile-value { font-size: 20px; font-weight: 800; line-height: 1.2; font-variant-numeric: tabular-nums; }
.dagwick-htile-sub { font-size: 12px; margin-top: 2px; }
.dagwick-htile--pass .dagwick-htile-value { color: var(--dagwick-pass); }
.dagwick-htile--warn .dagwick-htile-value { color: var(--dagwick-warn); }
.dagwick-htile--fail .dagwick-htile-value { color: var(--dagwick-fail); }
.dagwick-health-low { color: var(--dagwick-fail); }
/* Equal columns: every card has the same width at any size; a short last row keeps that width. */
.dagwick-cats { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 12px; margin: 16px 0; }
.dagwick-cat { min-width: 0; padding: 12px 14px; border: 1px solid var(--dagwick-border); border-radius: 12px; background: var(--dagwick-bg); }
.dagwick-cat-head { display: flex; justify-content: space-between; font-size: 13px; font-weight: 600; margin-bottom: 8px; }
.dagwick-bar { height: 6px; border-radius: 99px; background: var(--dagwick-border); overflow: hidden; }
.dagwick-bar-fill { height: 100%; border-radius: 99px; transition: width .9s cubic-bezier(.2,.8,.2,1); }

.dagwick-list { border: 1px solid var(--dagwick-border); border-radius: 16px; background: var(--dagwick-bg); }
.dagwick-list > :first-child { border-radius: 15px 15px 0 0; }
.dagwick-rows > li:last-child > .dagwick-row { border-radius: 0 0 15px 15px; }
.dagwick-sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; border: 0; }
.dagwick-tabs { display: flex; gap: 4px; padding: 8px; border-bottom: 1px solid var(--dagwick-border); background: var(--dagwick-surface); flex-wrap: wrap; }
.dagwick-tab { font: inherit; font-size: 13px; padding: 6px 12px; border-radius: 8px; border: 0; background: transparent; color: var(--dagwick-muted); cursor: pointer; }
.dagwick-tab.is-active { background: var(--dagwick-bg); color: var(--dagwick-text); box-shadow: 0 1px 2px var(--dagwick-shadow); }
.dagwick-count { margin-left: 4px; font-size: 11px; padding: 1px 6px; border-radius: 99px; background: var(--dagwick-border); }
.dagwick-checks { list-style: none; margin: 0; padding: 0; }
.dagwick-check { display: flex; gap: 14px; padding: 14px 18px; border-top: 1px solid var(--dagwick-border); }
.dagwick-check:first-child { border-top: 0; }
.dagwick-icon { flex: none; width: 24px; height: 24px; border-radius: 50%; display: grid; place-items: center; font-size: 13px; font-weight: 700; }
.dagwick-check--pass .dagwick-icon { color: var(--dagwick-pass); background: var(--dagwick-pass-bg); }
.dagwick-check--warn .dagwick-icon { color: var(--dagwick-warn); background: var(--dagwick-warn-bg); }
.dagwick-check--fail .dagwick-icon { color: var(--dagwick-fail); background: var(--dagwick-fail-bg); }
.dagwick-check--skip .dagwick-icon { color: var(--dagwick-muted); background: var(--dagwick-surface); }
.dagwick-check--skip { opacity: .7; }
.dagwick-check--ack .dagwick-icon { color: var(--dagwick-muted); background: var(--dagwick-surface); }
.dagwick-check--ack { opacity: .8; }
.dagwick-ack { margin-top: 6px; font-size: 13px; }
.dagwick-ack-label { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .06em; color: var(--dagwick-muted); margin-right: 6px; }
.dagwick-ack-note { margin-top: 6px; font-size: 12px; color: var(--dagwick-warn); }
.dagwick-check-body { flex: 1; min-width: 0; }
.dagwick-check-head { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.dagwick-check-title { font-weight: 600; }
.dagwick-tag { font-size: 11px; padding: 1px 8px; border-radius: 99px; border: 1px solid var(--dagwick-border); color: var(--dagwick-muted); }
.dagwick-tag--pack { border-style: dashed; }
.dagwick-pts { margin-left: auto; font-size: 12px; color: var(--dagwick-muted); font-variant-numeric: tabular-nums; }
.dagwick-check-msg { font-size: 14px; color: var(--dagwick-muted); margin-top: 2px; }
.dagwick-fix { margin-top: 8px; font-size: 13px; padding: 8px 12px; border-radius: 8px; background: var(--dagwick-surface); border-left: 3px solid var(--dagwick-accent); }
.dagwick-fix-label { display: block; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .06em; color: var(--dagwick-accent); margin-bottom: 2px; }
.dagwick-clear { padding: 28px; text-align: center; color: var(--dagwick-muted); }
.dagwick-foot { font-size: 12px; margin-top: 12px; text-align: right; }
.dagwick-empty { display: flex; flex-direction: column; align-items: center; gap: 6px; padding: 48px 16px; text-align: center; }
.dagwick-empty h3 { margin: 8px 0 0; }

/* Mascot + speech bubble */
.dagwick-mascot { position: relative; display: flex; flex-direction: column; align-items: center; }
.dagwick-bubble {
  position: relative; margin-bottom: -6px; padding: 5px 12px; border-radius: 12px; font-size: 13px; white-space: nowrap;
  background: var(--dagwick-surface); border: 1px solid var(--dagwick-border); box-shadow: 0 2px 6px var(--dagwick-shadow);
  animation: dagwick-pop .5s cubic-bezier(.2,1.4,.4,1) both;
}
.dagwick-bubble::after {
  content: ""; position: absolute; left: 50%; bottom: -6px; width: 10px; height: 10px; transform: translateX(-50%) rotate(45deg);
  background: var(--dagwick-surface); border-right: 1px solid var(--dagwick-border); border-bottom: 1px solid var(--dagwick-border);
}
@keyframes dagwick-pop { from { opacity: 0; transform: scale(.6) translateY(6px); } to { opacity: 1; transform: none; } }

/* Grade badges */
.dagwick-badge { display: inline-grid; place-items: center; min-width: 26px; height: 26px; padding: 0 6px; border-radius: 8px; font-weight: 800; font-size: 14px; color: #fff; }
.dagwick-badge--A { background: #16a34a; } .dagwick-badge--B { background: #65a30d; } .dagwick-badge--C { background: #d97706; }
.dagwick-badge--D { background: #ea580c; } .dagwick-badge--F { background: #dc2626; }
.dagwick-ring.dagwick-grade-B .dagwick-ring-fill { stroke: #84cc16; }

/* Next goal */
.dagwick-goal {
  display: flex; align-items: center; gap: 12px 16px; flex-wrap: wrap; margin-top: 16px; padding: 12px 16px; border-radius: 12px;
  border: 1px dashed color-mix(in srgb, var(--dagwick-accent) 55%, transparent);
  background: color-mix(in srgb, var(--dagwick-flame) 7%, var(--dagwick-bg));
}
.dagwick-goal-text { display: flex; align-items: center; gap: 8px; font-size: 14px; flex-wrap: wrap; }
.dagwick-goal-step { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .06em; color: var(--dagwick-accent); }
.dagwick-goal-picks { display: flex; gap: 8px; flex-wrap: wrap; margin-left: auto; }
.dagwick-pick {
  font: inherit; font-size: 13px; padding: 4px 10px; border-radius: 99px; cursor: pointer;
  color: var(--dagwick-text); background: var(--dagwick-bg); border: 1px solid var(--dagwick-border);
}
.dagwick-pick:hover { border-color: var(--dagwick-accent); }
.dagwick-pick-gain { color: var(--dagwick-pass); font-weight: 700; margin-left: 2px; }

/* Expandable check rows */
.dagwick-check-head { all: unset; display: flex; align-items: center; gap: 8px; flex-wrap: wrap; width: 100%; cursor: pointer; }
.dagwick-check-head:disabled { cursor: default; }
.dagwick-check-head:focus-visible { outline: 2px solid var(--dagwick-accent); outline-offset: 4px; border-radius: 4px; }
.dagwick-caret { margin-left: 8px; color: var(--dagwick-muted); }
.dagwick-check { transition: background .2s; }
.dagwick-check.is-open { background: color-mix(in srgb, var(--dagwick-surface) 60%, transparent); }
.dagwick-detail { margin-top: 10px; display: flex; flex-direction: column; gap: 10px; animation: dagwick-fade .25s ease both; }
@keyframes dagwick-fade { from { opacity: 0; transform: translateY(-4px); } to { opacity: 1; transform: none; } }
.dagwick-items { display: flex; flex-wrap: wrap; align-items: center; gap: 6px; }
.dagwick-items-label { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .06em; color: var(--dagwick-muted); margin-right: 2px; }
.dagwick-item { font-size: 12px; padding: 2px 8px; border-radius: 6px; background: var(--dagwick-fail-bg); color: var(--dagwick-fail); }
.dagwick-check--warn .dagwick-item { background: var(--dagwick-warn-bg); color: var(--dagwick-warn); }
.dagwick-more { all: unset; font-size: 12px; color: var(--dagwick-accent); cursor: pointer; }
.dagwick-fix { margin-top: 0; }
.dagwick-code { position: relative; margin-top: 8px; }
.dagwick-code pre {
  margin: 0; padding: 10px 70px 10px 12px; border-radius: 8px; overflow-x: auto; font-size: 12.5px; line-height: 1.5;
  background: #11131a; color: #f3e9d7; border: 1px solid #262a35;
}
.dagwick-copy {
  position: absolute; top: 6px; right: 6px; font: inherit; font-size: 11px; padding: 3px 8px; border-radius: 6px; cursor: pointer;
  color: #f3e9d7; background: #262a35; border: 1px solid #343947;
}
.dagwick-copy:hover { border-color: var(--dagwick-flame); }

@container dagwick (max-width: 720px) {
  .dagwick-goal-picks { margin-left: 0; }
  .dagwick-history { grid-template-columns: 1fr; }
}

/* Score history */
.dagwick-section { margin: 16px 0; }
.dagwick-section-head { display: flex; flex-wrap: wrap; align-items: baseline; gap: 4px 10px; }
.dagwick-section-head .dagwick-muted { font-size: 12px; }
.dagwick-section-empty { margin: 6px 0 0; font-size: 13px; }
.dagwick-history { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1.4fr); gap: 16px; margin-top: 8px; padding: 12px 14px; border: 1px solid var(--dagwick-border); border-radius: 12px; background: var(--dagwick-bg); }
.dagwick-spark { width: 100%; height: 64px; display: block; }
.dagwick-spark-dot { fill: var(--dagwick-accent); }
.dagwick-spark-dot--A, .dagwick-spark-dot--B { fill: var(--dagwick-pass); }
.dagwick-spark-dot--D, .dagwick-spark-dot--F { fill: var(--dagwick-fail); }
.dagwick-changes { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 8px; font-size: 13px; }
.dagwick-changes li { display: flex; flex-direction: column; gap: 2px; }
.dagwick-change-head { display: flex; gap: 8px; align-items: baseline; }
.dagwick-up { color: var(--dagwick-pass); }
.dagwick-down { color: var(--dagwick-fail); }

/* Fleet */
.dagwick-badge--sm { min-width: 20px; height: 20px; font-size: 11px; border-radius: 6px; }
.dagwick-badge--lg { min-width: 38px; height: 38px; font-size: 20px; border-radius: 11px; }
.dagwick-ring-caption { font-size: 12px; }
.dagwick-stats { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 4px; }
.dagwick-stat {
  display: flex; flex-direction: column; min-width: 104px; padding: 8px 14px; border-radius: 10px;
  background: color-mix(in srgb, var(--dagwick-surface) 80%, transparent); border: 1px solid var(--dagwick-border);
}
.dagwick-stat-value { font-size: 20px; font-weight: 800; line-height: 1.2; font-variant-numeric: tabular-nums; }
.dagwick-stat-label { font-size: 12px; color: var(--dagwick-muted); }
.dagwick-stat--fail .dagwick-stat-value { color: var(--dagwick-fail); }
.dagwick-stat--pass .dagwick-stat-value { color: var(--dagwick-pass); }

.dagwick-grades { display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 12px; margin: 16px 0; }
.dagwick-gcard {
  font: inherit; color: inherit; text-align: left; cursor: pointer; position: relative; overflow: hidden;
  display: grid; grid-template-columns: auto 1fr; gap: 4px 12px; align-items: center;
  padding: 12px 14px 16px; border-radius: 12px; border: 1px solid var(--dagwick-border); background: var(--dagwick-bg);
  transition: border-color .15s, transform .15s, opacity .2s, box-shadow .15s;
}
.dagwick-gcard:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 4px 14px var(--dagwick-shadow); }
.dagwick-gcard:disabled { cursor: default; opacity: .45; }
.dagwick-gcard.is-dim { opacity: .5; }
.dagwick-gcard.is-active { border-color: var(--dagwick-accent); box-shadow: 0 0 0 1px var(--dagwick-accent) inset; }
.dagwick-gcard:focus-visible { outline: 2px solid var(--dagwick-accent); outline-offset: 2px; }
.dagwick-gcard-text { display: flex; flex-direction: column; line-height: 1.15; }
.dagwick-gcard-n { font-size: 22px; font-weight: 800; font-variant-numeric: tabular-nums; }
.dagwick-gcard-text .dagwick-muted { font-size: 12px; }
.dagwick-gcard-bar { position: absolute; left: 0; right: 0; bottom: 0; height: 4px; background: var(--dagwick-border); }
.dagwick-gcard-bar > div { height: 100%; transition: width .6s cubic-bezier(.2,.8,.2,1); }
.dagwick-gcard--A .dagwick-gcard-bar > div { background: #16a34a; } .dagwick-gcard--B .dagwick-gcard-bar > div { background: #65a30d; }
.dagwick-gcard--C .dagwick-gcard-bar > div { background: #d97706; } .dagwick-gcard--D .dagwick-gcard-bar > div { background: #ea580c; }
.dagwick-gcard--F .dagwick-gcard-bar > div { background: #dc2626; }

.dagwick-btn--quiet { font-size: 12.5px; padding: 4px 12px; }
.dagwick-select {
  flex: 0 1 190px; min-width: 130px; max-width: 100%; font: inherit; font-size: 14px; padding: 7px 30px 7px 12px; border-radius: 8px; cursor: pointer;
  color: var(--dagwick-text); background-color: var(--dagwick-bg); border: 1px solid var(--dagwick-border); outline: none;
  appearance: none; background-image: linear-gradient(45deg, transparent 50%, currentColor 50%), linear-gradient(135deg, currentColor 50%, transparent 50%);
  background-position: calc(100% - 15px) 52%, calc(100% - 10px) 52%; background-size: 5px 5px; background-repeat: no-repeat;
}
.dagwick-select:focus-visible { border-color: var(--dagwick-accent); box-shadow: 0 0 0 2px color-mix(in srgb, var(--dagwick-accent) 25%, transparent); }
.dagwick-select.is-set { border-color: var(--dagwick-accent); font-weight: 600; }
.dagwick-dd { position: relative; flex: 0 0 180px; width: 180px; }
.dagwick-select:disabled { cursor: default; opacity: .55; }
.dagwick-toolbar .dagwick-csv { margin-left: auto; }
@container dagwick (max-width: 720px) {
  .dagwick-search-wrap, .dagwick-dd { flex: 1 1 100%; width: 100%; }
  .dagwick-toolbar .dagwick-csv { margin-left: 0; }
}
.dagwick-dd > .dagwick-select { width: 100%; text-align: left; }
.dagwick-dd-value { display: block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.dagwick-dd-list {
  position: absolute; z-index: 30; top: calc(100% + 6px); left: 0; min-width: max(100%, 240px); max-height: 320px; overflow-y: auto;
  margin: 0; padding: 6px; list-style: none; color: var(--dagwick-text); background: var(--dagwick-bg); outline: none;
  border: 1px solid var(--dagwick-border); border-radius: 12px; scrollbar-width: thin;
  box-shadow: 0 14px 34px var(--dagwick-shadow), 0 2px 6px var(--dagwick-shadow);
  transform-origin: top left; animation: dagwick-dd-in .14s ease-out;
}
@keyframes dagwick-dd-in { from { opacity: 0; transform: translateY(-4px) scale(.98); } }
.dagwick-dd-opt {
  display: grid; grid-template-columns: 14px minmax(0, 1fr) auto; align-items: center; gap: 8px;
  padding: 7px 10px; border-radius: 8px; cursor: pointer; font-size: 13.5px; line-height: 1.3;
}
.dagwick-dd-opt.is-active { background: color-mix(in srgb, var(--dagwick-accent) 13%, transparent); }
.dagwick-dd-opt[aria-selected="true"] .dagwick-dd-name { font-weight: 700; }
.dagwick-dd-check { color: var(--dagwick-accent); font-size: 12px; font-weight: 800; }
.dagwick-dd-name { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.dagwick-dd-count {
  min-width: 26px; text-align: center; padding: 1px 8px; border-radius: 999px; font-size: 11.5px; font-weight: 600;
  font-variant-numeric: tabular-nums; color: var(--dagwick-muted); background: var(--dagwick-surface); border: 1px solid var(--dagwick-border);
}
.dagwick-dd-opt.is-active .dagwick-dd-count { color: var(--dagwick-text); }
.dagwick-dd-sep { height: 1px; margin: 4px 6px; background: var(--dagwick-border); }
@media (prefers-reduced-motion: reduce) { .dagwick-dd-list { animation: none; } }
.dagwick-fleet-grid { display: grid; grid-template-columns: minmax(0, 1fr) 300px; gap: 16px; align-items: start; }
.dagwick-toolbar { display: flex; gap: 10px; align-items: center; padding: 10px; border-bottom: 1px solid var(--dagwick-border); background: var(--dagwick-surface); flex-wrap: wrap; }
.dagwick-search-wrap { position: relative; flex: 0 0 260px; width: 260px; color: var(--dagwick-muted); }
.dagwick-search-wrap svg { position: absolute; left: 11px; top: 50%; transform: translateY(-50%); pointer-events: none; }
.dagwick-search {
  width: 100%; font: inherit; font-size: 14px; padding: 7px 12px 7px 34px; border-radius: 8px;
  color: var(--dagwick-text); background: var(--dagwick-bg); border: 1px solid var(--dagwick-border); outline: none;
}
.dagwick-search:focus { border-color: var(--dagwick-accent); }
.dagwick-seg { display: inline-flex; padding: 3px; gap: 2px; border-radius: 9px; background: var(--dagwick-bg); border: 1px solid var(--dagwick-border); }
.dagwick-seg button { font: inherit; font-size: 13px; padding: 5px 12px; border-radius: 6px; border: 0; cursor: pointer; background: transparent; color: var(--dagwick-muted); }
.dagwick-seg button.is-active { background: var(--dagwick-surface); color: var(--dagwick-text); box-shadow: 0 1px 2px var(--dagwick-shadow); }
.dagwick-seg button:focus-visible { outline: 2px solid var(--dagwick-accent); outline-offset: 1px; }
.dagwick-filters { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; padding: 8px 14px; font-size: 13px; border-bottom: 1px solid var(--dagwick-border); }
.dagwick-fchip {
  font: inherit; font-size: 12px; padding: 3px 10px; border-radius: 99px; cursor: pointer;
  color: var(--dagwick-accent); background: color-mix(in srgb, var(--dagwick-flame) 12%, transparent);
  border: 1px solid color-mix(in srgb, var(--dagwick-accent) 40%, transparent);
}

.dagwick-rows { list-style: none; margin: 0; padding: 0; }
.dagwick-rows li + li { border-top: 1px solid var(--dagwick-border); }
.dagwick-row {
  display: grid; grid-template-columns: auto minmax(0, 1fr) auto auto; gap: 14px; align-items: center;
  padding: 12px 16px 12px 13px; color: inherit; text-decoration: none; border-left: 3px solid transparent;
  transition: background .15s;
}
.dagwick-row--A { border-left-color: #16a34a; } .dagwick-row--B { border-left-color: #65a30d; } .dagwick-row--C { border-left-color: #d97706; }
.dagwick-row--D { border-left-color: #ea580c; } .dagwick-row--F { border-left-color: #dc2626; }
.dagwick-row:hover { background: var(--dagwick-surface); }
.dagwick-row:hover .dagwick-row-name { color: var(--dagwick-accent); }
.dagwick-row:hover .dagwick-row-go { transform: translateX(3px); color: var(--dagwick-accent); }
.dagwick-row:focus-visible { outline: 2px solid var(--dagwick-accent); outline-offset: -2px; }
.dagwick-row-main { min-width: 0; }
.dagwick-row-title { display: flex; align-items: center; gap: 8px; }
.dagwick-row-name { font-weight: 600; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.dagwick-row-sub { font-size: 12.5px; display: flex; gap: 10px; flex-wrap: wrap; margin-top: 1px; }
.dagwick-row-sub span + span::before { content: "·"; margin-right: 10px; }
.dagwick-row-issues { display: flex; gap: 6px; flex-wrap: wrap; margin-top: 7px; }
.dagwick-ichip { font-size: 11.5px; padding: 2px 8px; border-radius: 6px; white-space: nowrap; }
.dagwick-ichip--fail { color: var(--dagwick-fail); background: var(--dagwick-fail-bg); }
.dagwick-ichip--warn { color: var(--dagwick-warn); background: var(--dagwick-warn-bg); }
.dagwick-ichip--more { color: var(--dagwick-muted); background: var(--dagwick-surface); }
.dagwick-row-go { font-size: 22px; color: var(--dagwick-muted); transition: transform .15s, color .15s; }
.dagwick-mini { position: relative; width: 46px; height: 46px; flex: none; }
.dagwick-mini .dagwick-ring-track { stroke-width: 5; }
.dagwick-mini .dagwick-ring-fill { stroke-width: 5; }
.dagwick-mini span { position: absolute; inset: 0; display: grid; place-items: center; font-size: 13px; font-weight: 800; font-variant-numeric: tabular-nums; }

.dagwick-side { position: sticky; top: 12px; }
.dagwick-side-card { padding: 16px; border: 1px solid var(--dagwick-border); border-radius: 16px; background: var(--dagwick-bg); }
.dagwick-side-title { margin: 0 0 12px; font-size: 14px; font-weight: 700; }
.dagwick-side-empty { margin: 0; font-size: 13px; }
.dagwick-side-hint { margin: 12px 0 0; font-size: 12px; }
.dagwick-common { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 4px; }
.dagwick-common-item { all: unset; box-sizing: border-box; display: block; width: 100%; cursor: pointer; padding: 8px 10px; border-radius: 10px; border: 1px solid transparent; }
.dagwick-common-item:hover { background: var(--dagwick-surface); }
.dagwick-common-item.is-active { background: var(--dagwick-surface); border-color: var(--dagwick-accent); }
.dagwick-common-item:focus-visible { outline: 2px solid var(--dagwick-accent); }
.dagwick-common-head { display: flex; justify-content: space-between; gap: 8px; font-size: 13px; margin-bottom: 6px; }
.dagwick-common-head .dagwick-muted { font-variant-numeric: tabular-nums; }

@container dagwick (max-width: 1100px) {
  .dagwick-fleet-grid { grid-template-columns: 1fr; }
  .dagwick-side { position: static; order: -1; }
}
@container dagwick (max-width: 720px) {
  .dagwick-grades { grid-template-columns: repeat(3, minmax(0, 1fr)); }
  .dagwick-gcard { grid-template-columns: 1fr; justify-items: start; }
  .dagwick-side { order: 0; }
  .dagwick-row { grid-template-columns: auto minmax(0, 1fr) auto; }
  .dagwick-row-go { display: none; }
}

/* Seasonal moods: decoration only, behind the hero content */
.dagwick-hero { position: relative; overflow: hidden; isolation: isolate; }
.dagwick-hero > :not(.dagwick-fx) { position: relative; z-index: 1; }
.dagwick-fx { position: absolute; inset: 0; z-index: 0; pointer-events: none; overflow: hidden; border-radius: inherit; }
.dagwick-season-halloween { --dagwick-flame: #22c55e; --dagwick-flame-deep: #15803d; --dagwick-flame-core: #d9f99d; --dagwick-glass: #fb923c; }
.dagwick-season-newroz { --dagwick-flame: #f97316; --dagwick-flame-deep: #dc2626; --dagwick-flame-core: #fde68a; }
.dagwick-season-ramadan, .dagwick-season-eid { --dagwick-glass: #e6fffa; }

.dagwick-fx--christmas { background: linear-gradient(180deg, rgba(37, 66, 122, .35), transparent 80%); }
.dagwick-fx--halloween { background: radial-gradient(420px 220px at 55% 0%, rgba(124, 58, 237, .28), transparent 70%), linear-gradient(180deg, rgba(42, 22, 64, .45), transparent 90%); }
.dagwick-fx--newroz { background: linear-gradient(180deg, rgba(30, 58, 95, .28), rgba(120, 50, 70, .28)); }
.dagwick-fx--ramadan { background: linear-gradient(180deg, rgba(15, 60, 80, .4), transparent 90%); }
.dagwick-fx--eid { background: radial-gradient(500px 200px at 50% 0%, rgba(233, 196, 106, .18), transparent 70%); }
.dagwick-fx--new-year, .dagwick-fx--birthday { background: radial-gradient(500px 220px at 50% 0%, rgba(192, 132, 252, .16), transparent 70%); }
.dagwick-fx--language-day { background: radial-gradient(500px 220px at 50% 100%, rgba(251, 191, 36, .12), transparent 70%); }

.dagwick-flake { position: absolute; top: -10px; border-radius: 50%; background: #fff; box-shadow: 0 0 4px rgba(255, 255, 255, .7);
  animation-name: dagwick-fall, dagwick-sway; animation-timing-function: linear, ease-in-out;
  animation-iteration-count: infinite; animation-direction: normal, alternate; }
html:not(.dark) .dagwick-flake { background: #a9c9ea; box-shadow: none; }
.dagwick-snowbank { position: absolute; left: 0; bottom: 0; width: 100%; height: 16px; fill: #f8fbff; opacity: .9; }
html:not(.dark) .dagwick-snowbank { fill: #dceaf8; }
@keyframes dagwick-fall { from { top: -8%; } to { top: 108%; } }
@keyframes dagwick-sway { from { transform: translateX(-10px); } to { transform: translateX(10px); } }

.dagwick-moon { position: absolute; right: 30%; top: 14px; width: 54px; height: 54px; border-radius: 50%;
  background: radial-gradient(circle at 38% 38%, #fffbea, #f5e6b8 60%, #e3cf8f); box-shadow: 0 0 40px rgba(245, 230, 184, .45); }
.dagwick-bat { position: absolute; left: -8%; animation: dagwick-fly linear infinite; }
.dagwick-bat-bob { display: block; animation: dagwick-bob 1.6s ease-in-out infinite alternate; }
.dagwick-bat svg { display: block; fill: #140b22; stroke: #140b22; filter: drop-shadow(0 0 2px rgba(190, 242, 100, .45)); }
html:not(.dark) .dagwick-bat svg { filter: none; }
.dagwick-wing-l, .dagwick-wing-r { transform-box: view-box; transform-origin: 20px 10px; animation: dagwick-flap .2s ease-in-out infinite alternate; }
@keyframes dagwick-fly { from { left: -8%; } to { left: 108%; } }
@keyframes dagwick-bob { from { transform: translateY(-9px); } to { transform: translateY(9px); } }
@keyframes dagwick-flap { from { transform: scaleY(1); } to { transform: scaleY(.25); } }

.dagwick-confetti { position: absolute; top: -10px; width: 7px; height: 4px; border-radius: 1px;
  animation-name: dagwick-fall, dagwick-spin; animation-timing-function: linear; animation-iteration-count: infinite; }
@keyframes dagwick-spin { to { transform: rotate(360deg); } }
.dagwick-firework { position: absolute; width: 0; height: 0; animation: dagwick-burst 3.3s ease-out infinite; }
.dagwick-firework i { position: absolute; width: 4px; height: 4px; border-radius: 50%; }
@keyframes dagwick-burst { 0% { transform: scale(.2); opacity: 0; } 15% { opacity: 1; } 60% { transform: scale(1.2); opacity: .9; } 100% { transform: scale(1.6); opacity: 0; } }
.dagwick-balloon { position: absolute; bottom: -60px; width: 22px; height: 28px; border-radius: 50% 50% 46% 46%; opacity: .85; animation: dagwick-rise linear infinite; }
.dagwick-balloon::after { content: ""; position: absolute; left: 50%; top: 100%; width: 1px; height: 24px; background: rgba(160, 160, 160, .6); }
@keyframes dagwick-rise { from { bottom: -60px; } to { bottom: 110%; } }

.dagwick-ember { position: absolute; bottom: 10%; width: 4px; height: 4px; border-radius: 50%; background: #fdba74; box-shadow: 0 0 6px #fb923c; animation: dagwick-ember linear infinite; }
@keyframes dagwick-ember { 0% { bottom: 12%; opacity: 0; transform: translateX(0); } 15% { opacity: 1; } 100% { bottom: 95%; opacity: 0; transform: translateX(16px); } }
.dagwick-mountains { position: absolute; left: 0; bottom: 0; width: 100%; height: 55%; }
.dagwick-mountains .far { fill: rgba(80, 44, 74, .55); }
.dagwick-mountains .near { fill: rgba(36, 20, 40, .85); }
html:not(.dark) .dagwick-mountains .far { fill: rgba(140, 100, 120, .22); }
html:not(.dark) .dagwick-mountains .near { fill: rgba(110, 70, 90, .3); }
.dagwick-fire { position: absolute; width: 14px; height: 20px; margin: -20px 0 0 -7px; border-radius: 50% 50% 45% 45% / 62% 62% 38% 38%;
  background: radial-gradient(circle at 50% 72%, #fff1b8 0 18%, #fbbf24 38%, #f97316 62%, #dc2626 100%);
  box-shadow: 0 0 14px 4px rgba(249, 115, 22, .55), 0 0 40px 10px rgba(249, 115, 22, .2);
  transform-origin: 50% 100%; animation: dagwick-flicker .45s ease-in-out infinite alternate; }
@keyframes dagwick-flicker { from { transform: scaleY(.8); } to { transform: scaleY(1.12); } }
.dagwick-govend { position: absolute; left: 54%; bottom: 0; display: flex; }
.dagwick-dancer { display: block; margin: 0 -2px; animation: dagwick-govend 1.1s ease-in-out infinite; }
.dagwick-dancer svg { display: block; overflow: visible; }
@keyframes dagwick-govend { 0%, 100% { transform: translateY(0) rotate(0); } 25% { transform: translateY(-3px) rotate(-4deg); } 75% { transform: translateY(-1px) rotate(4deg); } }

.dagwick-star { position: absolute; width: 3px; height: 3px; border-radius: 50%; background: #fde68a; box-shadow: 0 0 6px #fde68a; animation: dagwick-twinkle ease-in-out infinite; }
@keyframes dagwick-twinkle { 0%, 100% { opacity: .2; transform: scale(.8); } 50% { opacity: 1; transform: scale(1.3); } }
.dagwick-hanging span { position: absolute; top: 0; display: flex; flex-direction: column; align-items: center; transform-origin: top center; animation: dagwick-swing 3s ease-in-out infinite alternate; }
.dagwick-hanging span::before { content: ""; width: 1px; flex: 1; background: #e9c46a; }
@keyframes dagwick-swing { from { transform: rotate(-5deg); } to { transform: rotate(5deg); } }
.dagwick-bunting { position: absolute; top: 0; left: 0; width: 100%; height: 34px; }
.dagwick-letter { position: absolute; bottom: -30px; color: var(--dagwick-accent); opacity: 0; font-weight: 700; animation: dagwick-letter linear infinite; }
@keyframes dagwick-letter { 0% { bottom: -10%; opacity: 0; } 15% { opacity: .3; } 85% { opacity: .2; } 100% { bottom: 105%; opacity: 0; } }

.dagwick-greeting {
  display: inline-flex; flex-wrap: wrap; align-items: center; gap: 4px 10px; margin-bottom: 8px; padding: 4px 6px 4px 12px;
  border-radius: 999px; font-size: 13px; border: 1px solid var(--dagwick-border);
  background: color-mix(in srgb, var(--dagwick-bg) 72%, transparent); backdrop-filter: blur(4px);
}
.dagwick-greeting-hide { font: inherit; font-size: 12px; padding: 2px 9px; border-radius: 999px; border: 0; cursor: pointer; background: var(--dagwick-surface); color: var(--dagwick-muted); }
.dagwick-greeting-hide:hover { color: var(--dagwick-text); }
.dagwick-greeting-show { all: unset; display: inline-block; margin-bottom: 8px; font-size: 12px; color: var(--dagwick-muted); cursor: pointer; }
.dagwick-greeting-show:hover { color: var(--dagwick-accent); }
.dagwick-greeting-hide:focus-visible, .dagwick-greeting-show:focus-visible { outline: 2px solid var(--dagwick-accent); outline-offset: 2px; }

/* Page tabs (Fleet | Themes), like Airflow's own Dags | Dag Runs | Task Instances */
.dagwick-pagetabs { display: flex; gap: 4px; border-bottom: 1px solid var(--dagwick-border); margin: 0 0 18px; }
.dagwick-pagetab {
  all: unset; cursor: pointer; padding: 8px 14px 10px; font-size: 17px; font-weight: 600;
  color: var(--dagwick-muted); border-bottom: 3px solid transparent; margin-bottom: -1px;
}
.dagwick-pagetab:hover { color: var(--dagwick-text); }
.dagwick-pagetab.is-active { color: var(--dagwick-text); border-bottom-color: var(--dagwick-accent); }
.dagwick-pagetab:focus-visible { outline: 2px solid var(--dagwick-accent); outline-offset: 2px; border-radius: 4px; }

/* Themes page */
.dagwick-themes { display: grid; gap: 18px; }
.dagwick-themes-head h2 { margin: 0 0 4px; font-size: 20px; }
.dagwick-themes-head p { margin: 0; max-width: 70ch; }
.dagwick-theme-list { display: grid; grid-template-columns: repeat(auto-fill, minmax(min(100%, 560px), 1fr)); gap: 14px; }
.dagwick-theme {
  display: grid; grid-template-columns: 200px 1fr; gap: 18px; padding: 16px;
  border: 1px solid var(--dagwick-border); border-radius: 14px; background: var(--dagwick-surface);
}
.dagwick-theme-scene { width: 100%; height: auto; border-radius: 10px; display: block; }
.dagwick-theme-body { display: grid; gap: 6px; align-content: start; min-width: 0; }
.dagwick-theme-body p { margin: 0; font-size: 13.5px; }
.dagwick-theme-title { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
.dagwick-theme-title h3 { margin: 0; font-size: 16px; }
.dagwick-theme-dates { font-weight: 600; font-variant-numeric: tabular-nums; }
.dagwick-theme-status { font-size: 11.5px; font-weight: 700; padding: 2px 9px; border-radius: 999px; }
.dagwick-theme-status.is-on { color: var(--dagwick-pass); background: var(--dagwick-pass-bg); }
.dagwick-theme-status.is-off { color: var(--dagwick-fail); background: var(--dagwick-fail-bg); }
.dagwick-theme-status.is-idle { color: var(--dagwick-muted); background: var(--dagwick-bg); border: 1px solid var(--dagwick-border); }
.dagwick-theme-actions { display: flex; align-items: center; gap: 14px; flex-wrap: wrap; margin-top: 6px; }
.dagwick-switch { display: inline-flex; align-items: center; gap: 8px; font-size: 13.5px; cursor: pointer; }
.dagwick-switch input { position: absolute; opacity: 0; width: 1px; height: 1px; }
.dagwick-switch span {
  width: 34px; height: 20px; border-radius: 999px; background: var(--dagwick-border); position: relative; transition: background .15s;
}
.dagwick-switch span::after {
  content: ""; position: absolute; top: 3px; left: 3px; width: 14px; height: 14px; border-radius: 50%;
  background: #fff; transition: transform .15s; box-shadow: 0 1px 2px rgba(0,0,0,.25);
}
.dagwick-switch input:checked + span { background: var(--dagwick-accent); }
.dagwick-switch input:checked + span::after { transform: translateX(14px); }
.dagwick-switch input:focus-visible + span { outline: 2px solid var(--dagwick-accent); outline-offset: 2px; }
@container dagwick (max-width: 560px) { .dagwick-theme { grid-template-columns: 1fr; } }

/* The lamp */
.dagwick-lamp { flex: none; overflow: visible; }
.dagwick-flame { transform-box: fill-box; transform-origin: 50% 100%; }
.dagwick-flame path:first-child { transform-box: fill-box; transform-origin: 50% 100%; animation: dagwick-sway 2.4s ease-in-out infinite; }
.dagwick-lamp--worried .dagwick-flame path:first-child { animation: dagwick-flicker .5s steps(2) infinite; }
.dagwick-glow { animation: dagwick-breathe 3s ease-in-out infinite; transform-box: fill-box; transform-origin: center; }
.dagwick-sparkles path { animation: dagwick-twinkle 2s ease-in-out infinite; transform-box: fill-box; transform-origin: center; }
.dagwick-sparkles path:nth-child(2) { animation-delay: .6s; }
.dagwick-sparkles path:nth-child(3) { animation-delay: 1.2s; }
.dagwick-lamp--radiant .dagwick-body, .dagwick-lamp--happy .dagwick-body { animation: dagwick-bob 3s ease-in-out infinite; }
.dagwick-eyes { animation: dagwick-blink 4s infinite; transform-box: fill-box; transform-origin: center; }
.dagwick-smoke path { stroke-dasharray: 80; animation: dagwick-smoke 3.2s ease-in-out infinite; }
@keyframes dagwick-sway { 0%,100% { transform: rotate(-3deg) scaleY(1); } 50% { transform: rotate(3deg) scaleY(1.06); } }
@keyframes dagwick-flicker { 0% { opacity: 1; transform: scaleY(1); } 100% { opacity: .55; transform: scaleY(.8) rotate(4deg); } }
@keyframes dagwick-breathe { 0%,100% { opacity: .85; transform: scale(1); } 50% { opacity: 1; transform: scale(1.06); } }
@keyframes dagwick-twinkle { 0%,100% { opacity: 0; transform: scale(.4); } 50% { opacity: 1; transform: scale(1); } }
@keyframes dagwick-bob { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-2px); } }
@keyframes dagwick-blink { 0%,92%,100% { transform: scaleY(1); } 95% { transform: scaleY(.1); } }
@keyframes dagwick-smoke { 0% { stroke-dashoffset: 80; opacity: 0; } 30% { opacity: .9; } 100% { stroke-dashoffset: -80; opacity: 0; } }
@media (prefers-reduced-motion: reduce) { .dagwick *, .dagwick-lamp * { animation: none !important; transition: none !important; } }

@container dagwick (max-width: 720px) {
  .dagwick-hero { grid-template-columns: auto auto; justify-content: center; justify-items: center; text-align: center; gap: 16px 32px; }
  .dagwick-hero-text { grid-column: 1 / -1; order: 1; }
  .dagwick-chips, .dagwick-stats { justify-content: center; }
}
`;function xi({dagId:e}){return a.jsxs("div",{className:"dagwick",children:[a.jsx("style",{children:bi}),e?a.jsx(Ae,{dagId:e},e):a.jsx(ui,{})]})}function ui(){const[e,r]=g.useState(()=>ri(window.location.search));return a.jsxs(a.Fragment,{children:[a.jsx(ti,{view:e,onChange:r}),e==="themes"?a.jsx(ki,{}):a.jsx(ai,{})]})}function la(e){return a.jsx(xi,{...e})}const Ia=globalThis;return Ia[W]=la,Ia.AirflowPlugin=la,la})(ReactJSXRuntime,React);
