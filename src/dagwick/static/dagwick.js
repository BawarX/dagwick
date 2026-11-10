var DagwickBundle=(function(a,l){"use strict";const W="Dagwick",ga="0.2.0",Ya="/dagwick/api",Ua="dagwick";async function _(e,i,r){const c=new URL(`${Ya}${e}`,document.baseURI);for(const[d,s]of Object.entries(i))c.searchParams.set(d,s);const t=await fetch(c,{signal:r,credentials:"same-origin"});if(!t.ok){let d=`HTTP ${t.status}`;try{const s=await t.json();typeof s?.detail=="string"&&(d=s.detail)}catch{}throw new Error(d)}return t.json()}const Wa=(e,i)=>_("/score",{dag_id:e},i),qa=(e,i)=>_("/health",{dag_id:e},i),Za=(e,i)=>_("/history",{dag_id:e},i),Va=e=>_("/fleet",{},e),Ka=e=>_("/themes",{},e),j=e=>_(`/themes/${encodeURIComponent(e)}/css`,{});let J;function wa(){return J??=_("/config",{}).catch(e=>{throw J=void 0,e}),J}function O(e,i){const[r,c]=l.useState(),[t,d]=l.useState(),[s,n]=l.useState(!0),[p,k]=l.useState(0);l.useEffect(()=>{const h=new AbortController;return n(!0),d(void 0),e(h.signal).then(c).catch(x=>{h.signal.aborted||d(x instanceof Error?x.message:String(x))}).finally(()=>!h.signal.aborted&&n(!1)),()=>h.abort()},[...i,p]);const m=l.useCallback(()=>k(h=>h+1),[]);return{data:r,error:t,loading:s,reload:m}}function Xa(e){return{A:"radiant",B:"happy",C:"calm",D:"worried",F:"out"}[e]}function R({mood:e,size:i=150,season:r}){const c={radiant:1.15,happy:1,calm:.8,worried:.55,out:0}[e]*(r==="newroz"?1.25:1),t=e!=="out";return a.jsxs("svg",{className:`dagwick-lamp dagwick-lamp--${e}`,width:i,height:i,viewBox:"0 0 160 160",role:"img","aria-label":t?`Lantern is ${e}`:"Lantern has gone out",children:[a.jsxs("defs",{children:[a.jsxs("radialGradient",{id:"dagwick-glow",cx:"50%",cy:"50%",r:"50%",children:[a.jsx("stop",{offset:"0%",stopColor:"var(--dagwick-flame-core)",stopOpacity:"0.6"}),a.jsx("stop",{offset:"55%",stopColor:"var(--dagwick-flame)",stopOpacity:"0.2"}),a.jsx("stop",{offset:"100%",stopColor:"var(--dagwick-flame)",stopOpacity:"0"})]}),a.jsxs("linearGradient",{id:"dagwick-flame-grad",x1:"0",y1:"1",x2:"0",y2:"0",children:[a.jsx("stop",{offset:"0%",stopColor:"var(--dagwick-flame-deep)"}),a.jsx("stop",{offset:"55%",stopColor:"var(--dagwick-flame)"}),a.jsx("stop",{offset:"100%",stopColor:"var(--dagwick-flame-core)"})]}),a.jsxs("linearGradient",{id:"dagwick-metal",x1:"0",y1:"0",x2:"1",y2:"0",children:[a.jsx("stop",{offset:"0%",stopColor:"var(--dagwick-metal-dark)"}),a.jsx("stop",{offset:"45%",stopColor:"var(--dagwick-metal)"}),a.jsx("stop",{offset:"100%",stopColor:"var(--dagwick-metal-dark)"})]}),a.jsxs("linearGradient",{id:"dagwick-glass",x1:"0",y1:"0",x2:"1",y2:"0",children:[a.jsx("stop",{offset:"0%",stopColor:"var(--dagwick-glass)",stopOpacity:"0.35"}),a.jsx("stop",{offset:"30%",stopColor:"var(--dagwick-glass)",stopOpacity:"0.08"}),a.jsx("stop",{offset:"100%",stopColor:"var(--dagwick-glass)",stopOpacity:"0.22"})]})]}),a.jsx("ellipse",{cx:"80",cy:"146",rx:"44",ry:"5",fill:"var(--dagwick-shadow)"}),r&&a.jsx(ja,{season:r}),t&&a.jsx("circle",{className:"dagwick-glow",cx:"80",cy:"88",r:44*c+16,fill:"url(#dagwick-glow)"}),e==="radiant"&&a.jsxs("g",{className:"dagwick-sparkles",fill:"var(--dagwick-flame-core)",children:[a.jsx("path",{d:"M128 52 l2 6 6 2 -6 2 -2 6 -2 -6 -6 -2 6 -2z"}),a.jsx("path",{d:"M30 70 l1.5 4 4 1.5 -4 1.5 -1.5 4 -1.5 -4 -4 -1.5 4 -1.5z"}),a.jsx("path",{d:"M132 100 l1.2 3 3 1.2 -3 1.2 -1.2 3 -1.2 -3 -3 -1.2 3 -1.2z"})]}),a.jsxs("g",{className:"dagwick-body",children:[a.jsx("path",{d:"M56 50 C 56 16, 104 16, 104 50",fill:"none",stroke:"var(--dagwick-metal-dark)",strokeWidth:"4",strokeLinecap:"round"}),a.jsx("circle",{cx:"80",cy:"24",r:"5",fill:"none",stroke:"var(--dagwick-metal-dark)",strokeWidth:"3.5"}),a.jsx("path",{d:"M62 44 L98 44 L110 58 L50 58 Z",fill:"url(#dagwick-metal)"}),a.jsx("rect",{x:"70",y:"38",width:"20",height:"7",rx:"2",fill:"var(--dagwick-metal-dark)"}),t&&a.jsxs("g",{className:"dagwick-flame",style:{transform:`scale(${c})`},children:[a.jsx("path",{d:"M80 106 C 67 98, 71 82, 80 68 C 82 79, 93 86, 89 97 C 87 102, 84 105, 80 106 Z",fill:"url(#dagwick-flame-grad)"}),a.jsx("path",{d:"M80 104 C 75 99, 77 92, 80 86 C 81 92, 86 95, 84 99 C 83 102, 81 103, 80 104 Z",fill:"var(--dagwick-flame-core)"})]}),a.jsx("path",{d:"M70 114 L90 114 L87 106 L73 106 Z",fill:"var(--dagwick-metal-dark)"}),a.jsx("path",{d:"M80 106 L80 102",stroke:"var(--dagwick-wick)",strokeWidth:"2.5",strokeLinecap:"round"}),a.jsx("path",{d:"M58 58 C 40 72, 40 100, 58 114 L102 114 C 120 100, 120 72, 102 58 Z",fill:"url(#dagwick-glass)",stroke:"var(--dagwick-glass-edge)",strokeWidth:"1.5"}),a.jsx("path",{d:"M54 72 C 50 82, 50 92, 54 102",fill:"none",stroke:"var(--dagwick-glass)",strokeOpacity:"0.55",strokeWidth:"3",strokeLinecap:"round"}),a.jsx("path",{d:"M66 58 C 58 76, 58 96, 66 114",fill:"none",stroke:"var(--dagwick-metal-dark)",strokeWidth:"2.5"}),a.jsx("path",{d:"M94 58 C 102 76, 102 96, 94 114",fill:"none",stroke:"var(--dagwick-metal-dark)",strokeWidth:"2.5"}),a.jsx("path",{d:"M48 114 L112 114 L116 134 C 116 141, 44 141, 44 134 Z",fill:"url(#dagwick-metal)"}),a.jsx("rect",{x:"44",y:"132",width:"72",height:"5",rx:"2.5",fill:"var(--dagwick-metal-dark)",opacity:"0.6"}),a.jsx(Qa,{mood:e})]}),r&&a.jsx(Ja,{season:r}),!t&&a.jsx("g",{className:"dagwick-smoke",fill:"none",stroke:"var(--dagwick-smoke)",strokeWidth:"3",strokeLinecap:"round",children:a.jsx("path",{d:"M80 36 C 72 28, 88 22, 80 14 C 72 6, 88 0, 82 -6"})})]})}function Qa({mood:e}){const r="var(--dagwick-ink)",c={radiant:"M73 127 Q 80 134 87 127",happy:"M74 128 Q 80 132 86 128",calm:"M75 129 L 85 129",worried:"M74 131 Q 80 126 86 131",out:"M75 131 Q 80 128 85 131"}[e];return a.jsxs("g",{className:"dagwick-face",children:[e==="radiant"||e==="happy"?a.jsxs(a.Fragment,{children:[a.jsx("path",{d:"M65 122 q4 -4.5 8 0",stroke:r,strokeWidth:"2.6",fill:"none",strokeLinecap:"round"}),a.jsx("path",{d:"M87 122 q4 -4.5 8 0",stroke:r,strokeWidth:"2.6",fill:"none",strokeLinecap:"round"})]}):e==="out"?a.jsxs(a.Fragment,{children:[a.jsx("path",{d:"M65 121 l8 2",stroke:r,strokeWidth:"2.6",strokeLinecap:"round"}),a.jsx("path",{d:"M87 123 l8 -2",stroke:r,strokeWidth:"2.6",strokeLinecap:"round"})]}):a.jsxs("g",{className:"dagwick-eyes",children:[a.jsx("circle",{cx:"69",cy:122,r:"3",fill:r}),a.jsx("circle",{cx:"91",cy:122,r:"3",fill:r})]}),a.jsx("path",{d:c,stroke:r,strokeWidth:"2.6",fill:"none",strokeLinecap:"round"}),(e==="radiant"||e==="happy")&&a.jsxs(a.Fragment,{children:[a.jsx("circle",{cx:"60",cy:"127",r:"3.5",fill:"var(--dagwick-blush)"}),a.jsx("circle",{cx:"100",cy:"127",r:"3.5",fill:"var(--dagwick-blush)"})]}),e==="worried"&&a.jsx("path",{d:"M100 116 q3 5 0 8 q-3 -3 0 -8z",fill:"var(--dagwick-tear)"})]})}function ja({season:e}){return e==="ramadan"||e==="eid"?a.jsxs("g",{fill:"#fde68a",children:[a.jsx("path",{d:"M128 4 a15 15 0 1 0 13 24 a12 12 0 1 1 -13 -24z"}),a.jsx("path",{d:"M148 40 l1.5 4 4.3 .2 -3.4 2.6 1.2 4.2 -3.6 -2.4 -3.6 2.4 1.2 -4.2 -3.4 -2.6 4.3 -.2z"})]}):null}function Ja({season:e}){switch(e){case"christmas":return a.jsxs("g",{className:"dagwick-acc",children:[a.jsx("path",{d:"M54 40 C 60 10, 96 2, 124 18 C 112 16, 104 22, 106 40 Z",fill:"#dc2626"}),a.jsx("circle",{cx:"126",cy:"19",r:"7",fill:"#fff"}),a.jsx("rect",{x:"48",y:"36",width:"64",height:"12",rx:"6",fill:"#fff"}),a.jsx("path",{d:"M48 114 q6 -5 12 0 q6 -5 12 0 q6 -5 12 0 q6 -5 12 0 q6 -5 16 0 Z",fill:"#fff"}),a.jsxs("g",{transform:"translate(104 117)",children:[a.jsx("path",{d:"M0 0 q6 -8 12 -2 q-6 0 -12 2z",fill:"#16a34a"}),a.jsx("path",{d:"M0 0 q-2 -10 6 -12 q-2 6 -6 12z",fill:"#15803d"}),a.jsx("circle",{cx:"1",cy:"-1",r:"2.4",fill:"#dc2626"}),a.jsx("circle",{cx:"4.5",cy:"1",r:"2.2",fill:"#ef4444"})]})]});case"new-year":case"birthday":return a.jsxs("g",{className:"dagwick-acc",transform:"rotate(-12 80 40)",children:[a.jsx("polygon",{points:"68,42 92,42 80,2",fill:e==="birthday"?"#ec4899":"#7c3aed"}),a.jsx("path",{d:"M71 34 L89 34 M74 24 L86 24 M77 14 L83 14",stroke:"#fde047",strokeWidth:"3"}),a.jsx("circle",{cx:"80",cy:"2",r:"4.5",fill:e==="birthday"?"#60a5fa":"#f472b6"})]});case"newroz":return a.jsxs("g",{className:"dagwick-acc",children:[a.jsx("path",{d:"M66 44 q4 -7 8 -2 M94 44 q-4 -7 -8 -2",stroke:"#22c55e",strokeWidth:"2",fill:"none"}),a.jsx("circle",{cx:"60",cy:"43",r:"5",fill:"#f9a8d4"}),a.jsx("circle",{cx:"60",cy:"43",r:"2",fill:"#fde047"}),a.jsx("circle",{cx:"80",cy:"37",r:"5.5",fill:"#fef08a"}),a.jsx("circle",{cx:"80",cy:"37",r:"2.2",fill:"#f97316"}),a.jsx("circle",{cx:"100",cy:"43",r:"5",fill:"#ffffff"}),a.jsx("circle",{cx:"100",cy:"43",r:"2",fill:"#fde047"})]});case"halloween":return a.jsxs("g",{className:"dagwick-acc dagwick-spider",children:[a.jsx("path",{d:"M104 58 L112 84",stroke:"#d8d0e8",strokeWidth:".8"}),a.jsx("circle",{cx:"112",cy:"87",r:"3.4",fill:"#1a1024"}),a.jsx("path",{d:"M108 85 l-4 -2 M108 88 l-4 1 M116 85 l4 -2 M116 88 l4 1",stroke:"#1a1024",strokeWidth:"1"})]});case"eid":return a.jsxs("g",{className:"dagwick-acc",children:[a.jsx("ellipse",{cx:"128",cy:"141",rx:"20",ry:"4",fill:"#e5e7eb"}),[[118,135],[130,133],[140,137]].map(([i,r],c)=>a.jsxs("g",{children:[a.jsx("circle",{cx:i,cy:r,r:"6.5",fill:"#c98b4a",stroke:"#8a5a2b",strokeWidth:"1"}),a.jsx("path",{d:`M${i-3.5} ${r} a3.5 3.5 0 1 1 7 0`,fill:"none",stroke:"#8a5a2b",strokeWidth:"1"}),a.jsx("circle",{cx:i,cy:r,r:"1.2",fill:"#8a5a2b"})]},c))]});case"language-day":return a.jsxs("g",{className:"dagwick-acc",children:[a.jsx("rect",{x:"114",y:"104",width:"30",height:"24",rx:"3",fill:"#fff7e6",stroke:"#c9a46b"}),a.jsx("rect",{x:"112",y:"102",width:"34",height:"5",rx:"2.5",fill:"#e9d3a7"}),a.jsx("rect",{x:"112",y:"125",width:"34",height:"5",rx:"2.5",fill:"#e9d3a7"}),a.jsx("text",{x:"129",y:"122",textAnchor:"middle",fontSize:"15",fill:"#7c2d12",fontWeight:"700",children:"ک"})]});default:return null}}const pa=()=>window.matchMedia?.("(prefers-reduced-motion: reduce)").matches??!1;function Ra(e,i=900){const[r,c]=l.useState(pa()?e:0),t=l.useRef(0);return l.useEffect(()=>{if(pa())return c(e);const d=performance.now(),s=t.current;let n=0;const p=m=>{const h=Math.min(1,(m-d)/i);c(s+(e-s)*(1-Math.pow(1-h,3))),h<1?n=requestAnimationFrame(p):t.current=e};n=requestAnimationFrame(p);const k=setTimeout(()=>{cancelAnimationFrame(n),t.current=e,c(e)},i+100);return()=>{cancelAnimationFrame(n),clearTimeout(k)}},[e,i]),r}function ka({score:e,grade:i}){const r=Ra(e),c=52,t=2*Math.PI*c;return a.jsxs("div",{className:`dagwick-ring dagwick-grade-${i}`,"aria-label":`Score ${e} out of 100, grade ${i}`,children:[a.jsxs("svg",{width:"132",height:"132",viewBox:"0 0 132 132",children:[a.jsx("circle",{cx:"66",cy:"66",r:c,className:"dagwick-ring-track"}),a.jsx("circle",{cx:"66",cy:"66",r:c,className:"dagwick-ring-fill",strokeDasharray:t,strokeDashoffset:t*(1-r/100),transform:"rotate(-90 66 66)"})]}),a.jsxs("div",{className:"dagwick-ring-label",children:[a.jsx("span",{className:"dagwick-grade",children:i}),a.jsx("span",{className:"dagwick-score",children:Math.floor(r)})]})]})}function ae({code:e}){const[i,r]=l.useState(!1),c=async()=>{try{await navigator.clipboard.writeText(e),r(!0),setTimeout(()=>r(!1),1500)}catch{}};return a.jsxs("div",{className:"dagwick-code",children:[a.jsx("pre",{children:a.jsx("code",{children:e})}),a.jsx("button",{className:"dagwick-copy",onClick:c,"aria-label":"Copy code",children:i?"Copied ✓":"Copy"})]})}const ee={A:"I'm glowing! ✨",B:"Nice and warm.",C:"A little more oil?",D:"I'm flickering…",F:"It's dark in here."};function ha({grade:e,size:i=150,season:r}){return a.jsxs("div",{className:"dagwick-mascot",children:[a.jsx("div",{className:"dagwick-bubble",children:ee[e]}),a.jsx(R,{mood:Xa(e),size:i,season:r})]})}function G({title:e,body:i,action:r}){return a.jsxs("div",{className:"dagwick-empty",children:[a.jsx(R,{mood:"out",size:110}),a.jsx("h3",{children:e}),a.jsx("p",{className:"dagwick-muted",children:i}),r]})}function aa({label:e="Lighting the lamp…"}){return a.jsxs("div",{className:"dagwick-empty",children:[a.jsx(R,{mood:"calm",size:110}),a.jsx("p",{className:"dagwick-muted",children:e})]})}function fa({grade:e,size:i="md"}){return a.jsx("span",{className:`dagwick-badge dagwick-badge--${e} dagwick-badge--${i}`,children:e})}function ie({score:e,grade:i}){const c=2*Math.PI*18;return a.jsxs("div",{className:`dagwick-mini dagwick-grade-${i}`,"aria-label":`Score ${e}, grade ${i}`,children:[a.jsxs("svg",{width:"46",height:"46",viewBox:"0 0 46 46",children:[a.jsx("circle",{cx:"23",cy:"23",r:18,className:"dagwick-ring-track"}),a.jsx("circle",{cx:"23",cy:"23",r:18,className:"dagwick-ring-fill",strokeDasharray:c,strokeDashoffset:c*(1-e/100),transform:"rotate(-90 23 23)"})]}),a.jsx("span",{children:Math.floor(e)})]})}function re({dagId:e,children:i,className:r}){const c=globalThis.ReactRouterDOM?.Link,t=`/dags/${encodeURIComponent(e)}/plugin/${Ua}`;return c?a.jsx(c,{to:t,className:r,children:i}):a.jsx("a",{href:new URL(t.slice(1),document.baseURI).href,className:r,children:i})}const ba=e=>a.jsxs("div",{className:"dagwick-eyebrow",children:[a.jsx("span",{className:"dagwick-brand",children:W})," · ",e]});function ce(e){if(e<60)return`${Math.round(e)} s`;if(e<3600)return`${Math.round(e/60)} min`;const i=Math.floor(e/3600),r=Math.round(e%3600/60);return r?`${i} h ${r} min`:`${i} h`}function te(e,i=Date.now()){const r=Math.max(0,Math.round((i-Date.parse(e))/6e4));if(r<60)return`${r} min ago`;const c=Math.round(r/60);return c<48?`${c} h ago`:`${Math.round(c/24)} days ago`}function oe(e){return e===null||Math.abs(e)<10?e===null?void 0:"steady":e>0?`${e}% slower than before`:`${-e}% faster than before`}function de({dagId:e}){const{data:i,error:r}=O(c=>qa(e,c),[e]);return r||!i?null:a.jsx(se,{health:i})}function se({health:e,now:i}){const r=e;return a.jsxs("section",{className:"dagwick-health","aria-label":"Run health",children:[a.jsxs("div",{className:"dagwick-health-head",children:[a.jsx("span",{className:"dagwick-side-title",children:"Run health"}),a.jsxs("span",{className:"dagwick-muted",children:["last ",r.window_days," days · not part of the score"]})]}),r.runs===0?a.jsxs("p",{className:"dagwick-muted dagwick-health-empty",children:["No finished runs in the last ",r.window_days," days."]}):a.jsxs("div",{className:"dagwick-cats",children:[a.jsx(q,{label:"Runs succeeded",value:`${r.success_rate}%`,sub:`${r.succeeded} of ${r.runs}${r.truncated?"+":""} runs`,tone:r.success_rate!==null&&r.success_rate<90?"fail":"pass"}),a.jsx(q,{label:"Tasks retried",value:r.retry_rate===null?"–":`${r.retry_rate}%`,sub:`${r.tasks_retried} of ${r.tasks_finished} tasks`,tone:r.retry_rate!==null&&r.retry_rate>=10?"warn":void 0}),a.jsx(q,{label:"Typical run",value:r.median_seconds===null?"–":ce(r.median_seconds),sub:oe(r.duration_trend_pct)??"not enough runs for a trend",tone:r.duration_trend_pct!==null&&r.duration_trend_pct>=25?"warn":void 0}),a.jsx(q,{label:"Last run",value:r.last_state?r.last_state[0].toUpperCase()+r.last_state.slice(1):"–",sub:r.last_end?te(r.last_end,i):"",tone:r.last_state==="failed"?"fail":r.last_state==="success"?"pass":void 0})]})]})}function q({label:e,value:i,sub:r,tone:c}){return a.jsxs("div",{className:`dagwick-cat dagwick-htile${c?` dagwick-htile--${c}`:""}`,children:[a.jsx("div",{className:"dagwick-cat-head",children:a.jsx("span",{children:e})}),a.jsx("div",{className:"dagwick-htile-value",children:i}),a.jsx("div",{className:"dagwick-muted dagwick-htile-sub",children:r})]})}const ne=5;function le(e){return e?new Date(e).toLocaleDateString(void 0,{day:"numeric",month:"short"}):""}function xa(e){const i=[];for(let r=e.length-1;r>0&&i.length<ne;r--){const c=e[r];(c.better.length||c.worse.length)&&i.push({point:c,from:e[r-1].score})}return i}function ge({dagId:e}){const{data:i}=O(r=>Za(e,r),[e]);return i?a.jsx(we,{history:i}):null}function we({history:e}){const i=e.versions;return a.jsxs("section",{className:"dagwick-section","aria-label":"Score history",children:[a.jsxs("div",{className:"dagwick-section-head",children:[a.jsx("span",{className:"dagwick-side-title",children:"Score history"}),a.jsxs("span",{className:"dagwick-muted",children:[e.truncated?`last ${i.length} versions`:`${i.length} version${i.length===1?"":"s"}`," · code checks only"]})]}),i.length<2?a.jsx("p",{className:"dagwick-muted dagwick-section-empty",children:"Only one version so far. Each time the DAG's code changes, its new score appears here."}):a.jsxs("div",{className:"dagwick-history",children:[a.jsx(pe,{versions:i}),a.jsxs("ul",{className:"dagwick-changes",children:[xa(i).map(({point:r,from:c})=>a.jsxs("li",{children:[a.jsxs("span",{className:"dagwick-change-head",children:[a.jsxs("strong",{children:["v",r.version]}),a.jsx("span",{className:"dagwick-muted",children:le(r.created_at)}),a.jsxs("span",{className:r.score>=c?"dagwick-up":"dagwick-down",children:[Math.round(c)," → ",Math.round(r.score)]})]}),r.better.length>0&&a.jsxs("span",{className:"dagwick-up",children:["Now passing: ",r.better.join(", ")]}),r.worse.length>0&&a.jsxs("span",{className:"dagwick-down",children:["Now failing: ",r.worse.join(", ")]})]},r.version)),xa(i).length===0&&a.jsx("li",{className:"dagwick-muted",children:"The code changed, but no check result did."})]})]})]})}function pe({versions:e}){const t=n=>6+n*288/Math.max(e.length-1,1),d=n=>58-n/100*52,s=e.map((n,p)=>`${t(p)},${d(n.score)}`).join(" ");return a.jsxs("svg",{className:"dagwick-spark",viewBox:"0 0 300 64",preserveAspectRatio:"none",role:"img","aria-label":`Score by version, from ${Math.round(e[0].score)} to ${Math.round(e[e.length-1].score)}`,children:[a.jsx("polyline",{points:s,fill:"none",stroke:"var(--dagwick-accent)",strokeWidth:"2",vectorEffect:"non-scaling-stroke"}),e.map((n,p)=>a.jsx("circle",{cx:t(p),cy:d(n.score),r:"3",className:`dagwick-spark-dot dagwick-spark-dot--${n.grade}`,children:a.jsx("title",{children:`v${n.version}: ${n.grade} ${Math.round(n.score)}`})},n.version))]})}const b=(e,i=0)=>{const r=Math.sin(e*12.9898+i*78.233)*43758.5453;return r-Math.floor(r)},D=e=>Array.from({length:e},(i,r)=>r),S=e=>`${(e*100).toFixed(1)}%`,v=e=>`${e.toFixed(2)}s`,F=["#f472b6","#60a5fa","#fde047","#4ade80","#c084fc","#fb923c"],ma=["#ef4444","#f59e0b","#22c55e","#3b82f6","#ec4899","#a855f7","#14b8a6"],ua=["ڕ","ڵ","ڤ","ێ","ۆ","ژ","چ","گ","پ","ê","î","û","ş","ç","x","Kurdî","کوردی"];function ke(){return a.jsxs(a.Fragment,{children:[D(28).map(e=>a.jsx("span",{className:"dagwick-flake",style:{left:S(b(e,1)),width:3+b(e,2)*5,height:3+b(e,2)*5,opacity:.5+b(e,3)*.5,animationDuration:`${v(6+b(e,4)*7)}, ${v(2.5+b(e,5)*2)}`,animationDelay:`${v(-b(e,6)*12)}, ${v(-b(e,7)*3)}`}},e)),a.jsx("svg",{className:"dagwick-snowbank",viewBox:"0 0 400 20",preserveAspectRatio:"none",children:a.jsx("path",{d:"M0 20 V10 Q20 2 45 9 T95 8 T150 10 T205 7 T260 10 T320 6 T400 9 V20 Z"})})]})}function he({style:e}){return a.jsx("span",{className:"dagwick-bat",style:e,children:a.jsx("span",{className:"dagwick-bat-bob",children:a.jsxs("svg",{viewBox:"0 0 40 20",width:"34",height:"17",children:[a.jsx("g",{className:"dagwick-wing-l",children:a.jsx("path",{d:"M20 9 C 14 2, 6 2, 0 6 C 5 7, 7 10, 6 13 C 10 10, 14 11, 20 12 Z"})}),a.jsx("g",{className:"dagwick-wing-r",children:a.jsx("path",{d:"M20 9 C 26 2, 34 2, 40 6 C 35 7, 33 10, 34 13 C 30 10, 26 11, 20 12 Z"})}),a.jsx("ellipse",{cx:"20",cy:"10.5",rx:"3",ry:"4"}),a.jsx("path",{d:"M18 7 l-1 -3 2 2 M22 7 l1 -3 -2 2"})]})})})}function fe(){return a.jsxs(a.Fragment,{children:[a.jsx("span",{className:"dagwick-moon"}),D(7).map(e=>a.jsx(he,{style:{top:S(.06+b(e,1)*.55),transform:`scale(${.6+b(e,2)*.7})`,animationDuration:v(9+b(e,3)*8),animationDelay:v(-b(e,4)*16)}},e))]})}function va({n:e=30}){return a.jsx(a.Fragment,{children:D(e).map(i=>a.jsx("span",{className:"dagwick-confetti",style:{left:S(b(i,1)),background:F[i%F.length],animationDuration:`${v(4+b(i,2)*5)}, ${v(1+b(i,3)*2)}`,animationDelay:`${v(-b(i,4)*9)}, 0s`}},i))})}function be(){return a.jsx(a.Fragment,{children:[{left:"12%",top:"18%",color:"#f472b6",delay:0},{left:"82%",top:"14%",color:"#60a5fa",delay:1.1},{left:"64%",top:"30%",color:"#fde047",delay:2.2}].map((e,i)=>a.jsx("span",{className:"dagwick-firework",style:{left:e.left,top:e.top,animationDelay:v(e.delay)},children:D(12).map(r=>a.jsx("i",{style:{background:e.color,transform:`rotate(${r*30}deg) translateY(-26px)`}},r))},i))})}function xe(){return a.jsx(a.Fragment,{children:D(5).map(e=>a.jsx("span",{className:"dagwick-balloon",style:{left:S(.08+b(e,1)*.84),background:F[e%F.length],animationDuration:v(10+b(e,2)*6),animationDelay:v(-b(e,3)*14)}},e))})}function me(){return a.jsxs(a.Fragment,{children:[D(18).map(e=>a.jsx("span",{className:"dagwick-ember",style:{left:S(.05+b(e,1)*.9),animationDuration:v(4+b(e,2)*4),animationDelay:v(-b(e,3)*8)}},e)),a.jsxs("svg",{className:"dagwick-mountains",viewBox:"0 0 800 120",preserveAspectRatio:"none",children:[a.jsx("path",{className:"far",d:"M0 120 L0 70 L90 30 L170 66 L260 18 L360 64 L450 26 L560 70 L650 22 L740 60 L800 40 L800 120 Z"}),a.jsx("path",{className:"near",d:"M0 120 L0 92 L120 58 L220 90 L330 54 L440 92 L560 60 L690 94 L800 64 L800 120 Z"})]}),[[.325,.6],[.5625,.638],[.8125,.61]].map(([e,i],r)=>a.jsx("span",{className:"dagwick-fire",style:{left:S(e),top:S(i),animationDelay:v(r*.3)}},r)),a.jsx("div",{className:"dagwick-govend",children:D(9).map(e=>a.jsx("span",{className:"dagwick-dancer",style:{animationDelay:v(e*.18)},children:a.jsxs("svg",{viewBox:"0 0 20 36",width:"22",height:"40",children:[a.jsx("circle",{cx:"10",cy:"5",r:"4",fill:"#f1d3b3"}),a.jsx("path",{d:"M6 3 Q10 -1 14 3 L14 5 L6 5 Z",fill:e%2?"#1f2937":"#7c2d12"}),a.jsx("path",{d:"M10 9 L3 32 L17 32 Z",fill:ma[e%ma.length]}),a.jsx("path",{d:"M7 32 L7 35 M13 32 L13 35",stroke:"#1f2937",strokeWidth:"1.6"}),a.jsx("path",{d:"M-1 15 L21 15",stroke:"#f1d3b3",strokeWidth:"2",strokeLinecap:"round"}),e===0&&a.jsx("path",{d:"M-1 15 L-5 6 L1 9 Z",fill:"#facc15"})]})},e))})]})}function ya({n:e=22}){return a.jsx(a.Fragment,{children:D(e).map(i=>a.jsx("span",{className:"dagwick-star",style:{left:S(b(i,1)),top:S(b(i,2)*.7),animationDelay:v(-b(i,3)*3),animationDuration:v(2+b(i,4)*2.5)}},i))})}function ue(){return a.jsx("div",{className:"dagwick-hanging",children:[.2,.55,.85].map((e,i)=>a.jsx("span",{style:{left:S(e),height:26+i*14,animationDelay:v(i*.6)},children:a.jsxs("svg",{viewBox:"0 0 16 26",width:"16",height:"26",children:[a.jsx("path",{d:"M8 0 L8 4",stroke:"#e9c46a"}),a.jsx("path",{d:"M3 6 L13 6 L11 4 L5 4 Z",fill:"#e9c46a"}),a.jsx("path",{d:"M3 6 Q0 13 3 20 L13 20 Q16 13 13 6 Z",fill:"#fbbf24",opacity:".85"}),a.jsx("path",{d:"M4 20 L12 20 L10 23 L6 23 Z",fill:"#e9c46a"})]})},i))})}function ve(){return a.jsxs("svg",{className:"dagwick-bunting",viewBox:"0 0 800 40",preserveAspectRatio:"none",children:[a.jsx("path",{d:"M0 4 Q400 34 800 4",fill:"none",stroke:"#e9c46a",strokeWidth:"1.5"}),D(16).map(e=>{const i=25+e*48,r=4+30*(1-((i-400)/400)**2)*.95;return a.jsx("path",{d:`M${i-10} ${r} L${i+10} ${r} L${i} ${r+16} Z`,fill:F[e%F.length]},e)})]})}function ye(){return a.jsx(a.Fragment,{children:D(16).map(e=>a.jsx("span",{className:"dagwick-letter",style:{left:S(.04+b(e,1)*.92),fontSize:13+b(e,2)*11,animationDuration:v(7+b(e,3)*6),animationDelay:v(-b(e,4)*12)},children:ua[e%ua.length]},e))})}const Ne={christmas:()=>a.jsx(ke,{}),halloween:()=>a.jsx(fe,{}),"new-year":()=>a.jsxs(a.Fragment,{children:[a.jsx(be,{}),a.jsx(va,{})]}),birthday:()=>a.jsxs(a.Fragment,{children:[a.jsx(xe,{}),a.jsx(va,{n:18})]}),newroz:()=>a.jsx(me,{}),ramadan:()=>a.jsxs(a.Fragment,{children:[a.jsx(ya,{}),a.jsx(ue,{})]}),eid:()=>a.jsxs(a.Fragment,{children:[a.jsx(ve,{}),a.jsx(ya,{n:14})]}),"language-day":()=>a.jsx(ye,{})};function Na({season:e}){return e?a.jsx("div",{className:`dagwick-fx dagwick-fx--${e.id}`,"aria-hidden":"true",children:Ne[e.id]()}):null}function $a({state:e}){const{season:i,available:r,hidden:c,setHidden:t}=e;return i?a.jsxs("div",{className:"dagwick-greeting",children:[a.jsx("span",{"aria-hidden":"true",children:i.icon}),a.jsx("span",{children:i.greeting}),a.jsx("button",{className:"dagwick-greeting-hide",onClick:()=>t(!0),title:"Hide seasonal decorations",children:"Hide"})]}):r&&c?a.jsxs("button",{className:"dagwick-greeting-show",onClick:()=>t(!1),children:[r.icon," Show the ",r.name," mood"]}):null}const I=[["A",90],["B",75],["C",60],["D",40]];function $e(e,i=I){return i.find(([,r])=>e>=r)?.[0]??"F"}function Ce(e){if(!e||typeof e!="object")return I;const i=e,r=I.map(([c,t])=>[c,typeof i[c]=="number"?i[c]:t]);return r.every(([,c],t)=>t===0||r[t-1][1]>c)?r:I}function Ca(){const[e,i]=l.useState(I);return l.useEffect(()=>{let r=!0;return wa().then(c=>r&&i(Ce(c.grades))).catch(()=>{}),()=>{r=!1}},[]),e}const ea={eid:{id:"eid",name:"Eid",greeting:"Eid Mubarak!",icon:"🍪"},newroz:{id:"newroz",name:"Newroz",greeting:"Happy Newroz!",icon:"🔥"},"language-day":{id:"language-day",name:"Kurdish Language Day",greeting:"Kurdish Language Day",icon:"✍️"},christmas:{id:"christmas",name:"Christmas",greeting:"Merry Christmas!",icon:"🎄"},"new-year":{id:"new-year",name:"New Year",greeting:"Happy New Year!",icon:"🎉"},halloween:{id:"halloween",name:"Halloween",greeting:"Happy Halloween!",icon:"🎃"},ramadan:{id:"ramadan",name:"Ramadan",greeting:"Ramadan Kareem",icon:"🌙"},birthday:{id:"birthday",name:"Dagwick's birthday",greeting:"Dagwick turns another year older!",icon:"🎂"}},Sa=["newroz","eid","language-day","christmas","new-year","halloween","ramadan","birthday"],Z=(e,i,r,c)=>{const t=e*100+i,d=r[0]*100+r[1],s=c[0]*100+c[1];return d<=s?t>=d&&t<=s:t>=d||t<=s};function Ma(e){try{const i=new Intl.DateTimeFormat("en-US-u-ca-islamic-umalqura",{month:"numeric",day:"numeric"}).formatToParts(e),r=Number(i.find(t=>t.type==="month")?.value),c=Number(i.find(t=>t.type==="day")?.value);return r&&c?{month:r,day:c}:void 0}catch{return}}const Se={eid:e=>{const i=Ma(e);return!!i&&(i.month===10&&i.day<=3||i.month===12&&i.day>=10&&i.day<=13)},newroz:e=>Z(e.getMonth()+1,e.getDate(),[3,19],[3,23]),"language-day":e=>e.getMonth()+1===5&&e.getDate()===15,christmas:e=>Z(e.getMonth()+1,e.getDate(),[12,18],[12,26]),"new-year":e=>Z(e.getMonth()+1,e.getDate(),[12,31],[1,2]),halloween:e=>Z(e.getMonth()+1,e.getDate(),[10,24],[11,1]),ramadan:e=>Ma(e)?.month===9,birthday:e=>e.getMonth()+1===11&&e.getDate()===8};function Me(e,i="auto"){if(i==="off")return;const c=(i==="auto"?Sa:Sa.filter(t=>i.includes(t))).find(t=>Se[t](e));return c?ea[c]:void 0}function La(e){return!!e&&e in ea}const ia="dagwick.moods.hidden";function Le(){try{return window.localStorage.getItem(ia)==="1"}catch{return!1}}function De(e){try{e?window.localStorage.setItem(ia,"1"):window.localStorage.removeItem(ia)}catch{}}function Ae(){const e=new URLSearchParams(window.location.search).get("dagwick_mood");return e==="everyday"?null:La(e)?ea[e]:void 0}function Da(){const[e]=l.useState(Ae),[i,r]=l.useState(()=>e??void 0),[c,t]=l.useState(Le);return l.useEffect(()=>{if(e!==void 0)return;const s=new AbortController;return wa().then(n=>{if(s.signal.aborted)return;const p=n.seasonal_moods==="auto"||n.seasonal_moods==="off"?n.seasonal_moods:n.seasonal_moods.filter(La);r(Me(new Date,p))}).catch(()=>{}),()=>s.abort()},[e]),{season:c?void 0:i,available:i,hidden:c,setHidden:s=>{De(s),t(s)}}}const V={reliability:"Reliability",observability:"Observability",scheduling:"Scheduling",ownership:"Ownership",structure:"Structure",performance:"Performance",security:"Security"},Aa={fail:0,warn:1,pass:2,ack:3,skip:4},ze={A:"Shining bright. This DAG is in great shape.",B:"A steady flame. A few small things to polish.",C:"Burning, but dimly. Some important habits are missing.",D:"Flickering. This DAG needs attention soon.",F:"The lamp has gone out. Start with the red items below."},T=e=>e.weight-e.points,za=(e,i)=>Aa[e.status]-Aa[i.status]||T(i)-T(e);function _e({dagId:e}){const{data:i,error:r,reload:c}=O(t=>Wa(e,t),[e]);return r?a.jsx(G,{title:"Couldn't check this DAG",body:r,action:a.jsx("button",{className:"dagwick-btn",onClick:c,children:"Try again"})}):i?a.jsx(Te,{report:i},i.dag_id):a.jsx(aa,{})}function Fe(e,i){const r=[...i].reverse().find(([,p])=>p>e.score);if(!r)return;const[c,t]=r;let d=t/100*e.max_points-e.points;const s=[],n=e.checks.filter(p=>p.status==="fail"||p.status==="warn").sort((p,k)=>T(k)-T(p));for(const p of n){if(d<=1e-9)break;s.push(p),d-=T(p)}return d<=1e-9?{grade:c,picks:s}:void 0}function Te({report:e}){const i=Da(),r=i.season,c=e.counts.fail+e.counts.warn,[t,d]=l.useState(c?"attention":"all"),[s,n]=l.useState(()=>{const w=e.checks.filter($=>$.fix).sort(za),C=w.filter($=>$.status==="fail");return new Set((C.length?C:w.slice(0,2)).map($=>$.id))}),p=w=>n(C=>{const $=new Set(C);return $.delete(w)||$.add(w),$}),k=l.useMemo(()=>Oe(e.checks),[e]),m=Ca(),h=l.useMemo(()=>Fe(e,m),[e,m]),x=l.useMemo(()=>e.checks.filter(w=>t==="all"?!0:t==="passed"?w.status==="pass":w.status==="fail"||w.status==="warn").sort(za),[e,t]),M=w=>{d("attention"),n(C=>new Set(C).add(w)),requestAnimationFrame(()=>document.getElementById(`dagwick-check-${w}`)?.scrollIntoView({behavior:"smooth",block:"center"}))};return a.jsxs(a.Fragment,{children:[a.jsxs("section",{className:`dagwick-hero dagwick-grade-${e.grade}${r?` dagwick-season dagwick-season-${r.id}`:""}`,children:[a.jsx(Na,{season:r}),a.jsx(ha,{grade:e.grade,season:r?.id}),a.jsxs("div",{className:"dagwick-hero-text",children:[a.jsx($a,{state:i}),ba("DAG health"),a.jsx("h2",{className:"dagwick-dag",children:e.dag_id}),a.jsx("p",{className:"dagwick-headline",children:ze[e.grade]}),a.jsxs("div",{className:"dagwick-chips",children:[a.jsx(K,{status:"pass",n:e.counts.pass,label:"passing"}),a.jsx(K,{status:"warn",n:e.counts.warn,label:"to improve"}),a.jsx(K,{status:"fail",n:e.counts.fail,label:"failing"}),e.counts.ack>0&&a.jsx(K,{status:"ack",n:e.counts.ack,label:"acknowledged"})]})]}),a.jsx("div",{className:"dagwick-hero-side",children:a.jsx(ka,{score:e.score,grade:e.grade})})]}),h?a.jsxs("section",{className:"dagwick-goal",children:[a.jsxs("div",{className:"dagwick-goal-text",children:[a.jsx("span",{className:"dagwick-goal-step",children:"Next step"}),"Fix ",h.picks.length===1?"this check":`these ${h.picks.length} checks`," to reach"," ",a.jsx("span",{className:`dagwick-badge dagwick-badge--${h.grade}`,children:h.grade})]}),a.jsx("div",{className:"dagwick-goal-picks",children:h.picks.map(w=>a.jsxs("button",{className:"dagwick-pick",onClick:()=>M(w.id),children:[w.title," ",a.jsxs("span",{className:"dagwick-pick-gain",children:["+",T(w).toFixed(w.points%1?1:0)]})]},w.id))})]}):e.score<100?a.jsx("section",{className:"dagwick-goal dagwick-goal--top",children:a.jsxs("div",{className:"dagwick-goal-text",children:[a.jsx("span",{className:"dagwick-goal-step",children:"Top grade"})," Polish the last ",c," item",c===1?"":"s"," for a perfect 100."]})}):null,a.jsx("section",{className:"dagwick-cats","aria-label":"Score by category",children:k.map(w=>a.jsxs("div",{className:"dagwick-cat",children:[a.jsxs("div",{className:"dagwick-cat-head",children:[a.jsx("span",{children:V[w.id]??w.id}),a.jsxs("span",{className:"dagwick-muted",children:[Math.round(w.pct),"%"]})]}),a.jsx("div",{className:"dagwick-bar",children:a.jsx("div",{className:"dagwick-bar-fill",style:{width:`${w.pct}%`,background:Ge(w.pct)}})})]},w.id))}),a.jsx(de,{dagId:e.dag_id}),a.jsx(ge,{dagId:e.dag_id}),a.jsxs("section",{className:"dagwick-list",children:[a.jsxs("div",{className:"dagwick-tabs",role:"tablist",children:[a.jsxs(ca,{active:t==="attention",onClick:()=>d("attention"),children:["Needs attention ",a.jsx("span",{className:"dagwick-count",children:c})]}),a.jsxs(ca,{active:t==="all",onClick:()=>d("all"),children:["All checks ",a.jsx("span",{className:"dagwick-count",children:e.checks.length})]}),a.jsxs(ca,{active:t==="passed",onClick:()=>d("passed"),children:["Passed ",a.jsx("span",{className:"dagwick-count",children:e.counts.pass})]})]}),x.length===0?a.jsx("div",{className:"dagwick-clear",children:"Nothing here. Every check in this view is passing. ✨"}):a.jsx("ul",{className:"dagwick-checks",children:x.map(w=>a.jsx(Be,{check:w,open:s.has(w.id),onToggle:()=>p(w.id)},w.id))})]}),a.jsxs("footer",{className:"dagwick-foot dagwick-muted",children:[e.points," / ",e.max_points," points · scored automatically from the latest parsed version of this DAG · ",W," ",ga]})]})}const Ee={pass:"✓",warn:"!",fail:"✕",skip:"–",ack:"~"},ra=8;function Be({check:e,open:i,onToggle:r}){const[c,t]=l.useState(!1),d=!!e.fix,s=c?e.items:e.items.slice(0,ra);return a.jsxs("li",{id:`dagwick-check-${e.id}`,className:`dagwick-check dagwick-check--${e.status}${i&&d?" is-open":""}`,children:[a.jsx("span",{className:"dagwick-icon","aria-label":e.status,children:Ee[e.status]}),a.jsxs("div",{className:"dagwick-check-body",children:[a.jsxs("button",{className:"dagwick-check-head",onClick:d?r:void 0,disabled:!d,"aria-expanded":d?i:void 0,children:[a.jsx("span",{className:"dagwick-check-title",children:e.title}),a.jsx("span",{className:"dagwick-tag",children:V[e.category]??e.category}),e.pack&&e.pack!=="dagwick"&&a.jsx("span",{className:"dagwick-tag dagwick-tag--pack",title:`From the check pack ${e.pack}`,children:e.pack}),a.jsxs("span",{className:"dagwick-pts",children:[e.status==="skip"||e.status==="ack"?"n/a":`${e.points} / ${e.weight}`,d&&a.jsx("span",{className:"dagwick-caret",children:i?"▾":"▸"})]})]}),a.jsx("div",{className:"dagwick-check-msg",children:e.message}),e.ack_reason&&a.jsxs("div",{className:"dagwick-ack",children:[a.jsx("span",{className:"dagwick-ack-label",children:"Acknowledged"}),e.ack_reason]}),e.ack_note&&a.jsx("div",{className:"dagwick-ack-note",children:e.ack_note}),i&&d&&a.jsxs("div",{className:"dagwick-detail",children:[e.items.length>0&&a.jsxs("div",{className:"dagwick-items",children:[a.jsx("span",{className:"dagwick-items-label",children:"Affected"}),s.map(n=>a.jsx("code",{className:"dagwick-item",children:n},n)),e.items.length>ra&&a.jsx("button",{className:"dagwick-more",onClick:()=>t(!c),children:c?"show less":`+${e.items.length-ra} more`})]}),a.jsxs("div",{className:"dagwick-fix",children:[a.jsx("span",{className:"dagwick-fix-label",children:"How to fix"}),e.fix,e.example&&a.jsx(ae,{code:e.example})]})]})]})]})}function K({status:e,n:i,label:r}){return a.jsxs("span",{className:`dagwick-chip dagwick-chip--${e}`,children:[a.jsx("strong",{children:i})," ",r]})}function ca({active:e,onClick:i,children:r}){return a.jsx("button",{role:"tab","aria-selected":e,className:`dagwick-tab${e?" is-active":""}`,onClick:i,children:r})}function Oe(e){const i=new Map;for(const r of e){if(r.status==="skip"||r.status==="ack")continue;const c=i.get(r.category)??{earned:0,possible:0};c.earned+=r.points,c.possible+=r.weight,i.set(r.category,c)}return Object.keys(V).filter(r=>i.has(r)).concat([...i.keys()].filter(r=>!(r in V))).map(r=>{const c=i.get(r);return{id:r,pct:c.possible?c.earned/c.possible*100:0}})}function Ge(e){return e>=90?"var(--dagwick-pass)":e>=60?"var(--dagwick-warn)":"var(--dagwick-fail)"}function _a(e){return[...new Set(e.split(",").map(i=>i.trim()).filter(Boolean))]}function Fa(e){const i=new Map;for(const r of e)for(const c of new Set(r))i.set(c,(i.get(c)??0)+1);return[...i.entries()].map(([r,c])=>({name:r,count:c})).sort((r,c)=>c.count-r.count||r.name.localeCompare(c.name))}function ta(e,i){return(!i.owner||_a(e.owners).includes(i.owner))&&(!i.tag||(e.tags??[]).includes(i.tag))}function Ie(e){const i=[e.owner,e.tag&&`#${e.tag}`].filter(Boolean);return i.length?i.join(" · "):void 0}function He(e){const i=new URLSearchParams(e);return{owner:i.get("owner")||void 0,tag:i.get("tag")||void 0}}function Pe(e,i){const r=new URLSearchParams(e);for(const t of["owner","tag"]){const d=i[t];d?r.set(t,d):r.delete(t)}const c=r.toString();return c?`?${c}`:""}function Ye(e,i){return{owners:Fa(e.filter(r=>ta(r,{tag:i.tag})).map(r=>_a(r.owners))),tags:Fa(e.filter(r=>ta(r,{owner:i.owner})).map(r=>r.tags??[]))}}function Ue(e,i,r){if(r!==0){if(e==="ArrowDown")return Math.min(i+1,r-1);if(e==="ArrowUp")return Math.max(i-1,0);if(e==="Home")return 0;if(e==="End")return r-1;if(e==="PageDown")return Math.min(i+8,r-1);if(e==="PageUp")return Math.max(i-8,0)}}function We(e,i,r){const c=i.toLowerCase();if(!c)return;const t=c.length>1&&[...c].every(n=>n===c[0]),d=t?c[0]:c,s=c.length===1||t?r+1:r;for(let n=0;n<e.length;n++){const p=(s+n)%e.length;if(e[p].toLowerCase().startsWith(d))return p}}const qe=700;function Ta({label:e,all:i,empty:r,options:c,value:t,onChange:d}){const s=l.useId(),[n,p]=l.useState(!1),[k,m]=l.useState(0),h=l.useRef(null),x=l.useRef(null),M=l.useRef(null),w=l.useRef({text:"",at:0}),C=t&&!c.some(g=>g.name===t)?[{name:t,count:0},...c]:c,$=[{name:"",label:i,count:void 0},...C.map(g=>({...g,label:g.name}))],u=Math.max(0,$.findIndex(g=>g.name===(t??""))),L=$.length===1,E=()=>{m(u),p(!0)},B=(g=!0)=>{p(!1),g&&x.current?.focus()},A=g=>{B(),d($[g].name||void 0)};l.useEffect(()=>{if(!n)return;M.current?.focus();const g=N=>!h.current?.contains(N.target)&&p(!1);return document.addEventListener("mousedown",g),()=>document.removeEventListener("mousedown",g)},[n]),l.useEffect(()=>{n&&M.current?.querySelector(`[data-i="${k}"]`)?.scrollIntoView({block:"nearest"})},[n,k]);const P=g=>{const N=Date.now();w.current={text:(N-w.current.at<qe?w.current.text:"")+g,at:N};const z=We($.map(Q=>Q.label),w.current.text,k);z!==void 0&&m(z)},Y=g=>{["ArrowDown","ArrowUp","Enter"," "].includes(g.key)&&(g.preventDefault(),E())},X=g=>{const N=Ue(g.key,k,$.length);N!==void 0?(g.preventDefault(),m(N)):g.key==="Enter"||g.key===" "&&!w.current.text?(g.preventDefault(),A(k)):g.key==="Escape"?(g.preventDefault(),B()):g.key==="Tab"?B(!1):g.key.length===1&&!g.metaKey&&!g.ctrlKey&&!g.altKey&&(g.preventDefault(),P(g.key))};return a.jsxs("div",{className:"dagwick-dd",ref:h,children:[a.jsx("span",{id:`${s}-label`,className:"dagwick-sr-only",children:e}),a.jsx("button",{ref:x,id:`${s}-button`,type:"button",className:`dagwick-select${t?" is-set":""}`,"aria-haspopup":"listbox","aria-expanded":n,"aria-labelledby":`${s}-label ${s}-button`,disabled:L,onClick:()=>n?B():E(),onKeyDown:Y,children:a.jsx("span",{className:"dagwick-dd-value",children:t??(L?r:i)})}),n&&a.jsx("ul",{ref:M,className:"dagwick-dd-list",role:"listbox",tabIndex:-1,"aria-labelledby":`${s}-label`,"aria-activedescendant":`${s}-opt-${k}`,onKeyDown:X,onBlur:g=>!h.current?.contains(g.relatedTarget)&&p(!1),children:$.map((g,N)=>[a.jsxs("li",{id:`${s}-opt-${N}`,"data-i":N,role:"option","aria-selected":N===u,className:`dagwick-dd-opt${N===k?" is-active":""}`,onMouseMove:()=>N!==k&&m(N),onClick:()=>A(N),children:[a.jsx("span",{className:"dagwick-dd-check","aria-hidden":"true",children:N===u?"✓":""}),a.jsx("span",{className:"dagwick-dd-name",children:g.label}),g.count!==void 0&&a.jsx("span",{className:"dagwick-dd-count",children:g.count})]},g.name||"__all"),N===0&&$.length>1&&a.jsx("li",{className:"dagwick-dd-sep",role:"presentation"},"__sep")])})]})}const Ze=["dag_id","owners","tags","paused","score","grade","failing_checks","warning_checks","runs_30d","success_rate"];function Ve(e){if(e==null)return"";let i=String(e);return typeof e=="string"&&/^[=+\-@\t\r]/.test(i)&&(i=`'${i}`),/[",\r\n]/.test(i)?`"${i.replace(/"/g,'""')}"`:i}const Ea=(e,i)=>e.issues.filter(r=>r.status===i).map(r=>r.id).join("; ");function Ke(e){const i=e.map(r=>[r.dag_id,r.owners,(r.tags??[]).join("; "),r.is_paused,r.score,r.grade,Ea(r,"fail"),Ea(r,"warn"),r.health?.runs??0,r.health?.success_rate??null]);return[Ze,...i].map(r=>r.map(Ve).join(",")).join(`\r
`)+`\r
`}function Xe(e=new Date){const i=r=>String(r).padStart(2,"0");return`dagwick-fleet-${e.getFullYear()}-${i(e.getMonth()+1)}-${i(e.getDate())}.csv`}function Qe(e,i){const r=URL.createObjectURL(new Blob(["\uFEFF",i],{type:"text/csv;charset=utf-8"})),c=document.createElement("a");c.href=r,c.download=e,document.body.appendChild(c),c.click(),c.remove(),setTimeout(()=>URL.revokeObjectURL(r),0)}const Ba=["A","B","C","D","F"],je={A:"Shining",B:"Steady",C:"Dim",D:"Flickering",F:"Out"},Je={A:"The whole fleet is shining.",B:"The fleet burns steady.",C:"The fleet glows dimly.",D:"The fleet is flickering.",F:"The fleet has gone dark."},Re={A:"is shining.",B:"burns steady.",C:"glows dimly.",D:"is flickering.",F:"has gone dark."},ai=[{id:"worst",label:"Needs care"},{id:"best",label:"Healthiest"},{id:"name",label:"A–Z"}],oa=3,ei=6;function ii(){const{data:e,error:i,reload:r}=O(c=>Va(c),[]);return i?a.jsx(G,{title:"Couldn't load the fleet",body:i,action:a.jsx("button",{className:"dagwick-btn",onClick:r,children:"Try again"})}):e?e.dags.length===0?a.jsx(G,{title:"No DAGs yet",body:"Once Airflow parses a DAG you can read, it shows up here."}):a.jsx(ri,{dags:e.dags,truncated:e.truncated}):a.jsx(aa,{label:"Checking every DAG…"})}function ri({dags:e,truncated:i}){const r=Da(),c=r.season,[t,d]=l.useState(""),[s,n]=l.useState(),[p,k]=l.useState(),[m,h]=l.useState("worst"),[x,M]=l.useState(()=>He(window.location.search)),w=o=>{M(o),n(void 0),k(void 0);const{pathname:f,search:y,hash:U}=window.location;window.history.replaceState(window.history.state,"",f+Pe(y,o)+U)},{owners:C,tags:$}=l.useMemo(()=>Ye(e,x),[e,x]),u=l.useMemo(()=>e.filter(o=>ta(o,x)),[e,x]),L=Ie(x),E=u.reduce((o,f)=>o+f.score,0)/u.length,B=Ca(),A=$e(E,B),P=l.useMemo(()=>Object.fromEntries(Ba.map(o=>[o,u.filter(f=>f.grade===o).length])),[u]),Y=P.A+P.B,X=u.reduce((o,f)=>o+(f.counts.ack??0),0),g=u.length-Y,N=l.useMemo(()=>{const o=new Map;for(const f of u)for(const y of f.issues){const U=o.get(y.id)??{id:y.id,title:y.title,dags:0,fails:0};U.dags+=1,y.status==="fail"&&(U.fails+=1),o.set(y.id,U)}return[...o.values()].sort((f,y)=>y.dags-f.dags||y.fails-f.fails).slice(0,ei)},[u]),z=l.useMemo(()=>{const o=t.trim().toLowerCase();return u.filter(f=>(!s||f.grade===s)&&(!p||f.issues.some(y=>y.id===p.id))&&(!o||f.dag_id.toLowerCase().includes(o)||f.owners.toLowerCase().includes(o))).sort((f,y)=>m==="name"?f.dag_id.localeCompare(y.dag_id):m==="best"?y.score-f.score:f.score-y.score)},[u,t,s,p,m]),Q=!!(s||p||t.trim());return u.length===0?a.jsx(a.Fragment,{children:a.jsx(G,{title:`No DAGs for ${L}`,body:"Nothing you can see matches this owner and tag. The link may be old, or the DAGs may have moved.",action:a.jsx("button",{className:"dagwick-btn",onClick:()=>w({}),children:"Show all DAGs"})})}):a.jsxs(a.Fragment,{children:[a.jsxs("section",{className:`dagwick-hero dagwick-grade-${A}${c?` dagwick-season dagwick-season-${c.id}`:""}`,children:[a.jsx(Na,{season:c}),a.jsx(ha,{grade:A,season:c?.id}),a.jsxs("div",{className:"dagwick-hero-text",children:[a.jsx($a,{state:r}),ba("Fleet health"),a.jsx("h2",{className:"dagwick-dag",children:L??"All DAGs"}),a.jsxs("p",{className:"dagwick-headline",children:[L?`${L} ${Re[A]}`:Je[A]," ",g===0?"Every DAG is healthy.":`${g} of ${u.length} ${u.length===1?"DAG needs":"DAGs need"} care.`]}),a.jsxs("div",{className:"dagwick-stats",children:[a.jsx(H,{value:u.length,label:"DAGs"}),a.jsx(H,{value:(Math.floor(E*10)/10).toFixed(1),label:"average score"}),a.jsx(H,{value:g,label:"need care (C–F)",tone:g?"fail":void 0}),a.jsx(H,{value:Y,label:"healthy (A–B)",tone:Y?"pass":void 0}),X>0&&a.jsx(H,{value:X,label:"acknowledged"})]})]}),a.jsxs("div",{className:"dagwick-hero-side",children:[a.jsx(ka,{score:E,grade:A}),a.jsx("span",{className:"dagwick-muted dagwick-ring-caption",children:L?"average":"fleet average"})]})]}),a.jsx("section",{className:"dagwick-grades","aria-label":"Filter by grade",children:Ba.map(o=>{const f=P[o],y=s===o;return a.jsxs("button",{className:`dagwick-gcard dagwick-gcard--${o}${y?" is-active":""}${s&&!y?" is-dim":""}`,disabled:f===0,onClick:()=>n(y?void 0:o),"aria-pressed":y,children:[a.jsx(fa,{grade:o,size:"lg"}),a.jsxs("div",{className:"dagwick-gcard-text",children:[a.jsx("span",{className:"dagwick-gcard-n",children:f}),a.jsx("span",{className:"dagwick-muted",children:je[o]})]}),a.jsx("div",{className:"dagwick-gcard-bar",children:a.jsx("div",{style:{width:`${f/u.length*100}%`}})})]},o)})}),a.jsxs("div",{className:"dagwick-fleet-grid",children:[a.jsxs("section",{className:"dagwick-list",children:[a.jsxs("div",{className:"dagwick-toolbar",children:[a.jsxs("div",{className:"dagwick-search-wrap",children:[a.jsxs("svg",{viewBox:"0 0 24 24",width:"16",height:"16","aria-hidden":"true",children:[a.jsx("circle",{cx:"11",cy:"11",r:"7",fill:"none",stroke:"currentColor",strokeWidth:"2"}),a.jsx("path",{d:"M20 20l-4-4",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round"})]}),a.jsx("input",{className:"dagwick-search",type:"search",placeholder:"Search DAGs",value:t,onChange:o=>d(o.target.value),"aria-label":"Search DAGs"})]}),a.jsx(Ta,{label:"Filter by owner",all:"All owners",empty:"No owners",options:C,value:x.owner,onChange:o=>w({...x,owner:o})}),a.jsx(Ta,{label:"Filter by tag",all:"All tags",empty:"No tags",options:$,value:x.tag,onChange:o=>w({...x,tag:o})}),a.jsx("div",{className:"dagwick-seg",role:"radiogroup","aria-label":"Sort",children:ai.map(o=>a.jsx("button",{role:"radio","aria-checked":m===o.id,className:m===o.id?"is-active":"",onClick:()=>h(o.id),children:o.label},o.id))}),a.jsx("button",{className:"dagwick-btn dagwick-csv",onClick:()=>Qe(Xe(),Ke(z)),disabled:z.length===0,title:Q||L?"Download the DAGs shown, as CSV":"Download every DAG, as CSV",children:"Download CSV"})]}),Q&&a.jsxs("div",{className:"dagwick-filters",children:[a.jsxs("span",{className:"dagwick-muted",children:[z.length," of ",u.length," DAGs"]}),s&&a.jsxs(da,{onClear:()=>n(void 0),children:["Grade ",s]}),p&&a.jsx(da,{onClear:()=>k(void 0),children:p.title}),t.trim()&&a.jsxs(da,{onClear:()=>d(""),children:["“",t.trim(),"”"]})]}),z.length===0?a.jsx("div",{className:"dagwick-clear",children:"No DAG matches."}):a.jsx("ul",{className:"dagwick-rows",children:z.map(o=>a.jsx("li",{children:a.jsxs(re,{dagId:o.dag_id,className:`dagwick-row dagwick-row--${o.grade}`,children:[a.jsx(ie,{score:o.score,grade:o.grade}),a.jsxs("div",{className:"dagwick-row-main",children:[a.jsxs("div",{className:"dagwick-row-title",children:[a.jsx("span",{className:"dagwick-row-name",children:o.dag_id}),o.is_paused&&a.jsx("span",{className:"dagwick-tag",children:"paused"})]}),a.jsxs("div",{className:"dagwick-row-sub dagwick-muted",children:[o.owners&&a.jsx("span",{children:o.owners}),a.jsx("span",{children:o.counts.fail+o.counts.warn===0?"All checks passing":`${o.counts.fail} failing · ${o.counts.warn} to improve`}),o.counts.ack>0&&a.jsxs("span",{children:[o.counts.ack," acknowledged"]}),o.health&&o.health.runs>0&&o.health.success_rate!==null&&a.jsxs("span",{className:o.health.success_rate<90?"dagwick-health-low":void 0,children:[o.health.success_rate,"% of ",o.health.runs," runs succeeded"]})]}),o.issues.length>0&&a.jsxs("div",{className:"dagwick-row-issues",children:[o.issues.slice(0,oa).map(f=>a.jsx("span",{className:`dagwick-ichip dagwick-ichip--${f.status}`,children:f.title},f.id)),o.issues.length>oa&&a.jsxs("span",{className:"dagwick-ichip dagwick-ichip--more",children:["+",o.issues.length-oa]})]})]}),a.jsx(fa,{grade:o.grade}),a.jsx("span",{className:"dagwick-row-go","aria-hidden":"true",children:"›"})]})},o.dag_id))})]}),a.jsx("aside",{className:"dagwick-side",children:a.jsxs("div",{className:"dagwick-side-card",children:[a.jsxs("h3",{className:"dagwick-side-title",children:["Most common issues",L?` · ${L}`:""]}),N.length===0?a.jsx("p",{className:"dagwick-muted dagwick-side-empty",children:"No issues anywhere. ✨"}):a.jsx("ul",{className:"dagwick-common",children:N.map(o=>{const f=p?.id===o.id;return a.jsx("li",{children:a.jsxs("button",{className:`dagwick-common-item${f?" is-active":""}`,onClick:()=>k(f?void 0:{id:o.id,title:o.title}),"aria-pressed":f,children:[a.jsxs("div",{className:"dagwick-common-head",children:[a.jsx("span",{children:o.title}),a.jsxs("span",{className:"dagwick-muted",children:[o.dags,"/",u.length]})]}),a.jsx("div",{className:"dagwick-bar",children:a.jsx("div",{className:"dagwick-bar-fill",style:{width:`${o.dags/u.length*100}%`,background:o.fails>=o.dags/2?"var(--dagwick-fail)":"var(--dagwick-warn)"}})})]})},o.id)})}),a.jsx("p",{className:"dagwick-side-hint dagwick-muted",children:"Click an issue to see which DAGs have it."})]})})]}),a.jsxs("footer",{className:"dagwick-foot dagwick-muted",children:[i?`Showing the first ${e.length} DAGs. `:"","Scored automatically from the latest parsed version of each DAG. · ",W," ",ga]})]})}function H({value:e,label:i,tone:r}){return a.jsxs("div",{className:`dagwick-stat${r?` dagwick-stat--${r}`:""}`,children:[a.jsx("span",{className:"dagwick-stat-value",children:e}),a.jsx("span",{className:"dagwick-stat-label",children:i})]})}function da({children:e,onClear:i}){return a.jsxs("button",{className:"dagwick-fchip",onClick:i,"aria-label":"Remove filter",children:[e," ",a.jsx("span",{"aria-hidden":"true",children:"✕"})]})}const ci=[{id:"fleet",label:"Fleet"},{id:"themes",label:"Themes"}];function ti(e){return new URLSearchParams(e).get("view")==="themes"?"themes":"fleet"}function oi(e,i){const r=new URLSearchParams(e);i==="fleet"?r.delete("view"):r.set("view",i);const c=r.toString();return c?`?${c}`:""}function di({view:e,onChange:i}){const r=c=>{const{pathname:t,search:d,hash:s}=window.location;window.history.replaceState(window.history.state,"",t+oi(d,c)+s),i(c)};return a.jsx("nav",{className:"dagwick-pagetabs","aria-label":"Dagwick pages",children:ci.map(c=>a.jsx("button",{type:"button",className:`dagwick-pagetab${e===c.id?" is-active":""}`,"aria-current":e===c.id?"page":void 0,onClick:()=>r(c.id),children:c.label},c.id))})}const Oa="dagwick_themes_off",Ga="dagwick_theme",sa="*",si=3600*24*365;function ni(e){const i={};for(const r of e.split(";")){const c=r.indexOf("=");c>0&&(i[r.slice(0,c).trim()]=decodeURIComponent(r.slice(c+1).trim()))}return i}function Ia(e){const i=ni(e),r=(i[Oa]??"").split(",").map(c=>c.trim()).filter(Boolean);return{auto:!r.includes(sa),applied:i[Ga]||void 0,removed:r.filter(c=>c!==sa)}}function li(e){const i=[...e.auto?[]:[sa],...e.removed],r=(c,t)=>t?`${c}=${t}; Path=/; Max-Age=${si}; SameSite=Lax`:`${c}=; Path=/; Max-Age=0; SameSite=Lax`;return[r(Oa,i.join(",")),r(Ga,e.applied??"")]}function na(e,i){if(i.applied&&e.some(r=>r.id===i.applied))return i.applied;if(i.auto)return e.find(r=>r.active&&!i.removed.includes(r.id))?.id}function gi(e,i){return{...e,applied:i,removed:e.removed.filter(r=>r!==i)}}function wi(e,i,r){const c=e.find(t=>t.id===r)?.active;return{...i,applied:i.applied===r?void 0:i.applied,removed:c&&!i.removed.includes(r)?[...i.removed,r]:i.removed}}function pi(e,i){return{...e,auto:i,removed:i?[]:e.removed}}function ki(e,i,r){return na(i,r)===e.id?r.applied===e.id?"applied":"showing":e.active&&r.auto?"removed":"waiting"}const hi=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];function fi(e,i){const r=([c,t])=>`${t} ${hi[c-1]}`;return e[0]===i[0]&&e[1]===i[1]?r(e):`${r(e)} – ${r(i)}`}const bi={applied:{label:"Applied",tone:"on"},showing:{label:"Showing now",tone:"on"},removed:{label:"Removed",tone:"off"},waiting:{label:"Not in season",tone:"idle"}},Ha="dagwick-live-theme";function xi(e){let i=document.getElementById(Ha);i||(i=document.createElement("style"),i.id=Ha,document.head.appendChild(i)),i.textContent=e}function mi(){const{data:e,error:i,reload:r}=O(c=>Ka(c),[]);return i?a.jsx(G,{title:"Couldn't load the themes",body:i,action:a.jsx("button",{className:"dagwick-btn",onClick:r,children:"Try again"})}):e?a.jsx(ui,{themes:e}):a.jsx(aa,{label:"Loading themes…"})}function ui({themes:e}){const[i,r]=l.useState(()=>Ia(document.cookie)),c=l.useRef(na(e,Ia(document.cookie))),[t,d]=l.useState(),[s,n]=l.useState(),p=async(k,m)=>{d(m),n(void 0);try{const h=na(e,k),x=c.current;let M="";if(h&&h!==x){const[w,C]=await Promise.all([j(h),x?j(x):void 0]);M=(C?.reset??"")+w.css}else!h&&x&&(M=(await j(x)).hide);for(const w of li(k))document.cookie=w;xi(M),r(k)}catch(h){n(h instanceof Error?h.message:"Couldn't change the theme")}finally{d(void 0)}};return a.jsxs("section",{className:"dagwick-themes",children:[a.jsxs("header",{className:"dagwick-themes-head",children:[a.jsx("h2",{children:"Seasonal themes"}),a.jsx("p",{className:"dagwick-muted",children:"Themes decorate all of Airflow, not only Dagwick. Your choices are saved in this browser and only change what you see."})]}),a.jsx("div",{className:"dagwick-theme-settings",children:a.jsxs("label",{className:"dagwick-switch",children:[a.jsx("input",{type:"checkbox",role:"switch",checked:i.auto,disabled:!!t,onChange:k=>p(pi(i,k.target.checked),"auto")}),a.jsx("span",{className:"dagwick-switch-track","aria-hidden":"true"}),a.jsxs("span",{className:"dagwick-switch-text",children:[a.jsx("strong",{children:"Show themes on their dates"}),a.jsx("small",{className:"dagwick-muted",children:i.auto?"Each theme appears by itself on its dates and goes away afterwards.":"No theme appears by itself. Apply one below whenever you like."})]})]})}),s&&a.jsx("p",{className:"dagwick-theme-problem",role:"alert",children:s}),a.jsx("div",{className:"dagwick-theme-list",children:e.map(k=>{const m=ki(k,e,i),h=m==="applied"||m==="showing",x=bi[m];return a.jsxs("article",{className:`dagwick-theme${h?" is-on":""}`,children:[a.jsx(vi,{id:k.id}),a.jsxs("div",{className:"dagwick-theme-body",children:[a.jsxs("div",{className:"dagwick-theme-title",children:[a.jsx("h3",{children:k.name}),a.jsx("span",{className:`dagwick-theme-status is-${x.tone}`,children:x.label})]}),a.jsxs("p",{className:"dagwick-theme-dates",children:[fi(k.start,k.end)," · every year"]}),a.jsx("p",{className:"dagwick-muted",children:k.description}),a.jsx("div",{className:"dagwick-theme-actions",children:h?a.jsx("button",{className:"dagwick-btn",disabled:!!t,onClick:()=>p(wi(e,i,k.id),k.id),children:t===k.id?"Removing…":"Remove theme"}):a.jsx("button",{className:"dagwick-btn dagwick-btn-primary",disabled:!!t,onClick:()=>p(gi(i,k.id),k.id),children:t===k.id?"Applying…":"Apply theme"})})]})]},k.id)})})]})}function vi({id:e}){return e==="halloween"?a.jsx(yi,{}):a.jsx(Ni,{})}function yi(){const e=[[70,26,.55,-10],[128,18,.4,8],[176,40,.7,-4],[40,52,.35,12]],i=[[30,88,1.6],[96,70,1.2],[150,84,1.8],[196,64,1.1],[118,94,1.3]];return a.jsxs("svg",{className:"dagwick-theme-scene",viewBox:"0 0 220 110",role:"img","aria-label":"Bats over a foggy night",children:[a.jsxs("defs",{children:[a.jsxs("radialGradient",{id:"dagwick-hw-moon",children:[a.jsx("stop",{offset:"0",stopColor:"#fde68a"}),a.jsx("stop",{offset:"1",stopColor:"#f59e0b"})]}),a.jsxs("radialGradient",{id:"dagwick-hw-ember",children:[a.jsx("stop",{offset:"0",stopColor:"#fff3c4"}),a.jsx("stop",{offset:".4",stopColor:"#fb923c"}),a.jsx("stop",{offset:"1",stopColor:"#f97316",stopOpacity:"0"})]})]}),a.jsx("rect",{width:"220",height:"110",fill:"#1d1430"}),a.jsx("circle",{cx:"176",cy:"30",r:"26",fill:"#f59e0b",opacity:".12"}),a.jsx("circle",{cx:"176",cy:"30",r:"15",fill:"url(#dagwick-hw-moon)"}),e.map(([r,c,t,d],s)=>a.jsx("path",{transform:`translate(${r} ${c}) rotate(${d}) scale(${t})`,fill:"#0d0714",d:"M0 -2 C2 -6 6 -6 8 -3 C10 -6 14 -7 18 -4 C15 -3 14 0 15 3 C12 1 9 2 8 4 C6 2 3 2 0 5 C-3 2 -6 2 -8 4 C-9 2 -12 1 -15 3 C-14 0 -15 -3 -18 -4 C-14 -7 -10 -6 -8 -3 C-6 -6 -2 -6 0 -2Z"},s)),i.map(([r,c,t],d)=>a.jsx("circle",{cx:r,cy:c,r:t*2.4,fill:"url(#dagwick-hw-ember)"},d)),a.jsx("ellipse",{cx:"60",cy:"104",rx:"90",ry:"14",fill:"#7c3aed",opacity:".35"}),a.jsx("ellipse",{cx:"170",cy:"106",rx:"80",ry:"12",fill:"#4c1d95",opacity:".45"})]})}function Ni(){const e=[[26,22,7],[70,46,5],[112,18,9],[150,52,6],[190,26,7],[48,64,4],[132,74,4]];return a.jsxs("svg",{className:"dagwick-theme-scene",viewBox:"0 0 220 110",role:"img","aria-label":"Snow falling over Airflow",children:[a.jsx("rect",{width:"220",height:"110",fill:"#1b2433"}),e.map(([i,r,c],t)=>a.jsx("g",{transform:`translate(${i} ${r}) rotate(${t*13})`,stroke:"#fff",strokeWidth:c/6,strokeLinecap:"round",fill:"none",opacity:.45+t%3*.15,children:[0,60,120,180,240,300].map(d=>a.jsx("path",{transform:`rotate(${d})`,d:`M0 0 V${-c} M0 ${-c*.45} l${-c*.22} ${-c*.2} M0 ${-c*.45} l${c*.22} ${-c*.2}`},d))},t)),a.jsx("path",{d:"M0 96 C30 86 60 88 90 94 S150 102 180 92 S210 86 220 90 V110 H0Z",fill:"#eef4fa"})]})}const $i=`
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
.dagwick-theme { transition: border-color .25s ease, box-shadow .25s ease; }
.dagwick-theme.is-on { border-color: color-mix(in srgb, var(--dagwick-accent) 55%, var(--dagwick-border)); box-shadow: 0 0 0 1px color-mix(in srgb, var(--dagwick-accent) 25%, transparent); }
.dagwick-theme-status { transition: color .25s ease, background-color .25s ease; }
.dagwick-theme-settings {
  display: flex; align-items: center; padding: 14px 16px; max-width: 760px;
  border: 1px solid var(--dagwick-border); border-radius: 14px; background: var(--dagwick-surface);
}
.dagwick-switch-text { display: grid; gap: 2px; }
.dagwick-switch-text strong { font-size: 14px; }
.dagwick-switch-text small { font-size: 12.5px; }
.dagwick-switch input:disabled + .dagwick-switch-track { opacity: .6; }
.dagwick-btn-primary { background: var(--dagwick-accent); border-color: var(--dagwick-accent); color: #1d1405; font-weight: 600; }
.dagwick-btn-primary:hover:not(:disabled) { filter: brightness(1.06); }
.dagwick-btn { transition: background-color .2s ease, border-color .2s ease, opacity .2s ease, filter .2s ease; }
.dagwick-btn:disabled { opacity: .65; cursor: progress; }
.dagwick-theme-problem { margin: 0; color: var(--dagwick-fail); font-size: 13.5px; }
.dagwick-switch { display: inline-flex; align-items: center; gap: 8px; font-size: 13.5px; cursor: pointer; }
.dagwick-switch input { position: absolute; opacity: 0; width: 1px; height: 1px; }
.dagwick-switch-track {
  flex: none; width: 34px; height: 20px; border-radius: 999px; background: var(--dagwick-border); position: relative; transition: background .15s;
}
.dagwick-switch-track::after {
  content: ""; position: absolute; top: 3px; left: 3px; width: 14px; height: 14px; border-radius: 50%;
  background: #fff; transition: transform .15s; box-shadow: 0 1px 2px rgba(0,0,0,.25);
}
.dagwick-switch input:checked + .dagwick-switch-track { background: var(--dagwick-accent); }
.dagwick-switch input:checked + .dagwick-switch-track::after { transform: translateX(14px); }
.dagwick-switch input:focus-visible + .dagwick-switch-track { outline: 2px solid var(--dagwick-accent); outline-offset: 2px; }
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
`;function Ci({dagId:e}){return a.jsxs("div",{className:"dagwick",children:[a.jsx("style",{children:$i}),e?a.jsx(_e,{dagId:e},e):a.jsx(Si,{})]})}function Si(){const[e,i]=l.useState(()=>ti(window.location.search));return a.jsxs(a.Fragment,{children:[a.jsx(di,{view:e,onChange:i}),e==="themes"?a.jsx(mi,{}):a.jsx(ii,{})]})}function la(e){return a.jsx(Ci,{...e})}const Pa=globalThis;return Pa[W]=la,Pa.AirflowPlugin=la,la})(ReactJSXRuntime,React);
