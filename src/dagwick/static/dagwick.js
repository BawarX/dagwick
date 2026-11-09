var DagwickBundle=(function(a,w){"use strict";const O="Dagwick",sa="0.2.0",Ba="/dagwick/api",Ga="dagwick";async function _(e,i,r){const c=new URL(`${Ba}${e}`,document.baseURI);for(const[d,g]of Object.entries(i))c.searchParams.set(d,g);const o=await fetch(c,{signal:r,credentials:"same-origin"});if(!o.ok){let d=`HTTP ${o.status}`;try{const g=await o.json();typeof g?.detail=="string"&&(d=g.detail)}catch{}throw new Error(d)}return o.json()}const Oa=(e,i)=>_("/score",{dag_id:e},i),qa=(e,i)=>_("/health",{dag_id:e},i),Ha=(e,i)=>_("/history",{dag_id:e},i),Ia=e=>_("/fleet",{},e);let U;function da(){return U??=_("/config",{}).catch(e=>{throw U=void 0,e}),U}function q(e,i){const[r,c]=w.useState(),[o,d]=w.useState(),[g,n]=w.useState(!0),[s,b]=w.useState(0);w.useEffect(()=>{const h=new AbortController;return n(!0),d(void 0),e(h.signal).then(c).catch(x=>{h.signal.aborted||d(x instanceof Error?x.message:String(x))}).finally(()=>!h.signal.aborted&&n(!1)),()=>h.abort()},[...i,s]);const y=w.useCallback(()=>b(h=>h+1),[]);return{data:r,error:o,loading:g,reload:y}}function Ya(e){return{A:"radiant",B:"happy",C:"calm",D:"worried",F:"out"}[e]}function X({mood:e,size:i=150,season:r}){const c={radiant:1.15,happy:1,calm:.8,worried:.55,out:0}[e]*(r==="newroz"?1.25:1),o=e!=="out";return a.jsxs("svg",{className:`dagwick-lamp dagwick-lamp--${e}`,width:i,height:i,viewBox:"0 0 160 160",role:"img","aria-label":o?`Lantern is ${e}`:"Lantern has gone out",children:[a.jsxs("defs",{children:[a.jsxs("radialGradient",{id:"dagwick-glow",cx:"50%",cy:"50%",r:"50%",children:[a.jsx("stop",{offset:"0%",stopColor:"var(--dagwick-flame-core)",stopOpacity:"0.6"}),a.jsx("stop",{offset:"55%",stopColor:"var(--dagwick-flame)",stopOpacity:"0.2"}),a.jsx("stop",{offset:"100%",stopColor:"var(--dagwick-flame)",stopOpacity:"0"})]}),a.jsxs("linearGradient",{id:"dagwick-flame-grad",x1:"0",y1:"1",x2:"0",y2:"0",children:[a.jsx("stop",{offset:"0%",stopColor:"var(--dagwick-flame-deep)"}),a.jsx("stop",{offset:"55%",stopColor:"var(--dagwick-flame)"}),a.jsx("stop",{offset:"100%",stopColor:"var(--dagwick-flame-core)"})]}),a.jsxs("linearGradient",{id:"dagwick-metal",x1:"0",y1:"0",x2:"1",y2:"0",children:[a.jsx("stop",{offset:"0%",stopColor:"var(--dagwick-metal-dark)"}),a.jsx("stop",{offset:"45%",stopColor:"var(--dagwick-metal)"}),a.jsx("stop",{offset:"100%",stopColor:"var(--dagwick-metal-dark)"})]}),a.jsxs("linearGradient",{id:"dagwick-glass",x1:"0",y1:"0",x2:"1",y2:"0",children:[a.jsx("stop",{offset:"0%",stopColor:"var(--dagwick-glass)",stopOpacity:"0.35"}),a.jsx("stop",{offset:"30%",stopColor:"var(--dagwick-glass)",stopOpacity:"0.08"}),a.jsx("stop",{offset:"100%",stopColor:"var(--dagwick-glass)",stopOpacity:"0.22"})]})]}),a.jsx("ellipse",{cx:"80",cy:"146",rx:"44",ry:"5",fill:"var(--dagwick-shadow)"}),r&&a.jsx(Pa,{season:r}),o&&a.jsx("circle",{className:"dagwick-glow",cx:"80",cy:"88",r:44*c+16,fill:"url(#dagwick-glow)"}),e==="radiant"&&a.jsxs("g",{className:"dagwick-sparkles",fill:"var(--dagwick-flame-core)",children:[a.jsx("path",{d:"M128 52 l2 6 6 2 -6 2 -2 6 -2 -6 -6 -2 6 -2z"}),a.jsx("path",{d:"M30 70 l1.5 4 4 1.5 -4 1.5 -1.5 4 -1.5 -4 -4 -1.5 4 -1.5z"}),a.jsx("path",{d:"M132 100 l1.2 3 3 1.2 -3 1.2 -1.2 3 -1.2 -3 -3 -1.2 3 -1.2z"})]}),a.jsxs("g",{className:"dagwick-body",children:[a.jsx("path",{d:"M56 50 C 56 16, 104 16, 104 50",fill:"none",stroke:"var(--dagwick-metal-dark)",strokeWidth:"4",strokeLinecap:"round"}),a.jsx("circle",{cx:"80",cy:"24",r:"5",fill:"none",stroke:"var(--dagwick-metal-dark)",strokeWidth:"3.5"}),a.jsx("path",{d:"M62 44 L98 44 L110 58 L50 58 Z",fill:"url(#dagwick-metal)"}),a.jsx("rect",{x:"70",y:"38",width:"20",height:"7",rx:"2",fill:"var(--dagwick-metal-dark)"}),o&&a.jsxs("g",{className:"dagwick-flame",style:{transform:`scale(${c})`},children:[a.jsx("path",{d:"M80 106 C 67 98, 71 82, 80 68 C 82 79, 93 86, 89 97 C 87 102, 84 105, 80 106 Z",fill:"url(#dagwick-flame-grad)"}),a.jsx("path",{d:"M80 104 C 75 99, 77 92, 80 86 C 81 92, 86 95, 84 99 C 83 102, 81 103, 80 104 Z",fill:"var(--dagwick-flame-core)"})]}),a.jsx("path",{d:"M70 114 L90 114 L87 106 L73 106 Z",fill:"var(--dagwick-metal-dark)"}),a.jsx("path",{d:"M80 106 L80 102",stroke:"var(--dagwick-wick)",strokeWidth:"2.5",strokeLinecap:"round"}),a.jsx("path",{d:"M58 58 C 40 72, 40 100, 58 114 L102 114 C 120 100, 120 72, 102 58 Z",fill:"url(#dagwick-glass)",stroke:"var(--dagwick-glass-edge)",strokeWidth:"1.5"}),a.jsx("path",{d:"M54 72 C 50 82, 50 92, 54 102",fill:"none",stroke:"var(--dagwick-glass)",strokeOpacity:"0.55",strokeWidth:"3",strokeLinecap:"round"}),a.jsx("path",{d:"M66 58 C 58 76, 58 96, 66 114",fill:"none",stroke:"var(--dagwick-metal-dark)",strokeWidth:"2.5"}),a.jsx("path",{d:"M94 58 C 102 76, 102 96, 94 114",fill:"none",stroke:"var(--dagwick-metal-dark)",strokeWidth:"2.5"}),a.jsx("path",{d:"M48 114 L112 114 L116 134 C 116 141, 44 141, 44 134 Z",fill:"url(#dagwick-metal)"}),a.jsx("rect",{x:"44",y:"132",width:"72",height:"5",rx:"2.5",fill:"var(--dagwick-metal-dark)",opacity:"0.6"}),a.jsx(Wa,{mood:e})]}),r&&a.jsx(Za,{season:r}),!o&&a.jsx("g",{className:"dagwick-smoke",fill:"none",stroke:"var(--dagwick-smoke)",strokeWidth:"3",strokeLinecap:"round",children:a.jsx("path",{d:"M80 36 C 72 28, 88 22, 80 14 C 72 6, 88 0, 82 -6"})})]})}function Wa({mood:e}){const r="var(--dagwick-ink)",c={radiant:"M73 127 Q 80 134 87 127",happy:"M74 128 Q 80 132 86 128",calm:"M75 129 L 85 129",worried:"M74 131 Q 80 126 86 131",out:"M75 131 Q 80 128 85 131"}[e];return a.jsxs("g",{className:"dagwick-face",children:[e==="radiant"||e==="happy"?a.jsxs(a.Fragment,{children:[a.jsx("path",{d:"M65 122 q4 -4.5 8 0",stroke:r,strokeWidth:"2.6",fill:"none",strokeLinecap:"round"}),a.jsx("path",{d:"M87 122 q4 -4.5 8 0",stroke:r,strokeWidth:"2.6",fill:"none",strokeLinecap:"round"})]}):e==="out"?a.jsxs(a.Fragment,{children:[a.jsx("path",{d:"M65 121 l8 2",stroke:r,strokeWidth:"2.6",strokeLinecap:"round"}),a.jsx("path",{d:"M87 123 l8 -2",stroke:r,strokeWidth:"2.6",strokeLinecap:"round"})]}):a.jsxs("g",{className:"dagwick-eyes",children:[a.jsx("circle",{cx:"69",cy:122,r:"3",fill:r}),a.jsx("circle",{cx:"91",cy:122,r:"3",fill:r})]}),a.jsx("path",{d:c,stroke:r,strokeWidth:"2.6",fill:"none",strokeLinecap:"round"}),(e==="radiant"||e==="happy")&&a.jsxs(a.Fragment,{children:[a.jsx("circle",{cx:"60",cy:"127",r:"3.5",fill:"var(--dagwick-blush)"}),a.jsx("circle",{cx:"100",cy:"127",r:"3.5",fill:"var(--dagwick-blush)"})]}),e==="worried"&&a.jsx("path",{d:"M100 116 q3 5 0 8 q-3 -3 0 -8z",fill:"var(--dagwick-tear)"})]})}function Pa({season:e}){return e==="ramadan"||e==="eid"?a.jsxs("g",{fill:"#fde68a",children:[a.jsx("path",{d:"M128 4 a15 15 0 1 0 13 24 a12 12 0 1 1 -13 -24z"}),a.jsx("path",{d:"M148 40 l1.5 4 4.3 .2 -3.4 2.6 1.2 4.2 -3.6 -2.4 -3.6 2.4 1.2 -4.2 -3.4 -2.6 4.3 -.2z"})]}):null}function Za({season:e}){switch(e){case"christmas":return a.jsxs("g",{className:"dagwick-acc",children:[a.jsx("path",{d:"M54 40 C 60 10, 96 2, 124 18 C 112 16, 104 22, 106 40 Z",fill:"#dc2626"}),a.jsx("circle",{cx:"126",cy:"19",r:"7",fill:"#fff"}),a.jsx("rect",{x:"48",y:"36",width:"64",height:"12",rx:"6",fill:"#fff"}),a.jsx("path",{d:"M48 114 q6 -5 12 0 q6 -5 12 0 q6 -5 12 0 q6 -5 12 0 q6 -5 16 0 Z",fill:"#fff"}),a.jsxs("g",{transform:"translate(104 117)",children:[a.jsx("path",{d:"M0 0 q6 -8 12 -2 q-6 0 -12 2z",fill:"#16a34a"}),a.jsx("path",{d:"M0 0 q-2 -10 6 -12 q-2 6 -6 12z",fill:"#15803d"}),a.jsx("circle",{cx:"1",cy:"-1",r:"2.4",fill:"#dc2626"}),a.jsx("circle",{cx:"4.5",cy:"1",r:"2.2",fill:"#ef4444"})]})]});case"new-year":case"birthday":return a.jsxs("g",{className:"dagwick-acc",transform:"rotate(-12 80 40)",children:[a.jsx("polygon",{points:"68,42 92,42 80,2",fill:e==="birthday"?"#ec4899":"#7c3aed"}),a.jsx("path",{d:"M71 34 L89 34 M74 24 L86 24 M77 14 L83 14",stroke:"#fde047",strokeWidth:"3"}),a.jsx("circle",{cx:"80",cy:"2",r:"4.5",fill:e==="birthday"?"#60a5fa":"#f472b6"})]});case"newroz":return a.jsxs("g",{className:"dagwick-acc",children:[a.jsx("path",{d:"M66 44 q4 -7 8 -2 M94 44 q-4 -7 -8 -2",stroke:"#22c55e",strokeWidth:"2",fill:"none"}),a.jsx("circle",{cx:"60",cy:"43",r:"5",fill:"#f9a8d4"}),a.jsx("circle",{cx:"60",cy:"43",r:"2",fill:"#fde047"}),a.jsx("circle",{cx:"80",cy:"37",r:"5.5",fill:"#fef08a"}),a.jsx("circle",{cx:"80",cy:"37",r:"2.2",fill:"#f97316"}),a.jsx("circle",{cx:"100",cy:"43",r:"5",fill:"#ffffff"}),a.jsx("circle",{cx:"100",cy:"43",r:"2",fill:"#fde047"})]});case"halloween":return a.jsxs("g",{className:"dagwick-acc dagwick-spider",children:[a.jsx("path",{d:"M104 58 L112 84",stroke:"#d8d0e8",strokeWidth:".8"}),a.jsx("circle",{cx:"112",cy:"87",r:"3.4",fill:"#1a1024"}),a.jsx("path",{d:"M108 85 l-4 -2 M108 88 l-4 1 M116 85 l4 -2 M116 88 l4 1",stroke:"#1a1024",strokeWidth:"1"})]});case"eid":return a.jsxs("g",{className:"dagwick-acc",children:[a.jsx("ellipse",{cx:"128",cy:"141",rx:"20",ry:"4",fill:"#e5e7eb"}),[[118,135],[130,133],[140,137]].map(([i,r],c)=>a.jsxs("g",{children:[a.jsx("circle",{cx:i,cy:r,r:"6.5",fill:"#c98b4a",stroke:"#8a5a2b",strokeWidth:"1"}),a.jsx("path",{d:`M${i-3.5} ${r} a3.5 3.5 0 1 1 7 0`,fill:"none",stroke:"#8a5a2b",strokeWidth:"1"}),a.jsx("circle",{cx:i,cy:r,r:"1.2",fill:"#8a5a2b"})]},c))]});case"language-day":return a.jsxs("g",{className:"dagwick-acc",children:[a.jsx("rect",{x:"114",y:"104",width:"30",height:"24",rx:"3",fill:"#fff7e6",stroke:"#c9a46b"}),a.jsx("rect",{x:"112",y:"102",width:"34",height:"5",rx:"2.5",fill:"#e9d3a7"}),a.jsx("rect",{x:"112",y:"125",width:"34",height:"5",rx:"2.5",fill:"#e9d3a7"}),a.jsx("text",{x:"129",y:"122",textAnchor:"middle",fontSize:"15",fill:"#7c2d12",fontWeight:"700",children:"ک"})]});default:return null}}const na=()=>window.matchMedia?.("(prefers-reduced-motion: reduce)").matches??!1;function Ua(e,i=900){const[r,c]=w.useState(na()?e:0),o=w.useRef(0);return w.useEffect(()=>{if(na())return c(e);const d=performance.now(),g=o.current;let n=0;const s=y=>{const h=Math.min(1,(y-d)/i);c(g+(e-g)*(1-Math.pow(1-h,3))),h<1?n=requestAnimationFrame(s):o.current=e};n=requestAnimationFrame(s);const b=setTimeout(()=>{cancelAnimationFrame(n),o.current=e,c(e)},i+100);return()=>{cancelAnimationFrame(n),clearTimeout(b)}},[e,i]),r}function la({score:e,grade:i}){const r=Ua(e),c=52,o=2*Math.PI*c;return a.jsxs("div",{className:`dagwick-ring dagwick-grade-${i}`,"aria-label":`Score ${e} out of 100, grade ${i}`,children:[a.jsxs("svg",{width:"132",height:"132",viewBox:"0 0 132 132",children:[a.jsx("circle",{cx:"66",cy:"66",r:c,className:"dagwick-ring-track"}),a.jsx("circle",{cx:"66",cy:"66",r:c,className:"dagwick-ring-fill",strokeDasharray:o,strokeDashoffset:o*(1-r/100),transform:"rotate(-90 66 66)"})]}),a.jsxs("div",{className:"dagwick-ring-label",children:[a.jsx("span",{className:"dagwick-grade",children:i}),a.jsx("span",{className:"dagwick-score",children:Math.floor(r)})]})]})}function Xa({code:e}){const[i,r]=w.useState(!1),c=async()=>{try{await navigator.clipboard.writeText(e),r(!0),setTimeout(()=>r(!1),1500)}catch{}};return a.jsxs("div",{className:"dagwick-code",children:[a.jsx("pre",{children:a.jsx("code",{children:e})}),a.jsx("button",{className:"dagwick-copy",onClick:c,"aria-label":"Copy code",children:i?"Copied ✓":"Copy"})]})}const Qa={A:"I'm glowing! ✨",B:"Nice and warm.",C:"A little more oil?",D:"I'm flickering…",F:"It's dark in here."};function ga({grade:e,size:i=150,season:r}){return a.jsxs("div",{className:"dagwick-mascot",children:[a.jsx("div",{className:"dagwick-bubble",children:Qa[e]}),a.jsx(X,{mood:Ya(e),size:i,season:r})]})}function H({title:e,body:i,action:r}){return a.jsxs("div",{className:"dagwick-empty",children:[a.jsx(X,{mood:"out",size:110}),a.jsx("h3",{children:e}),a.jsx("p",{className:"dagwick-muted",children:i}),r]})}function wa({label:e="Lighting the lamp…"}){return a.jsxs("div",{className:"dagwick-empty",children:[a.jsx(X,{mood:"calm",size:110}),a.jsx("p",{className:"dagwick-muted",children:e})]})}function pa({grade:e,size:i="md"}){return a.jsx("span",{className:`dagwick-badge dagwick-badge--${e} dagwick-badge--${i}`,children:e})}function Va({score:e,grade:i}){const c=2*Math.PI*18;return a.jsxs("div",{className:`dagwick-mini dagwick-grade-${i}`,"aria-label":`Score ${e}, grade ${i}`,children:[a.jsxs("svg",{width:"46",height:"46",viewBox:"0 0 46 46",children:[a.jsx("circle",{cx:"23",cy:"23",r:18,className:"dagwick-ring-track"}),a.jsx("circle",{cx:"23",cy:"23",r:18,className:"dagwick-ring-fill",strokeDasharray:c,strokeDashoffset:c*(1-e/100),transform:"rotate(-90 23 23)"})]}),a.jsx("span",{children:Math.floor(e)})]})}function Ka({dagId:e,children:i,className:r}){const c=globalThis.ReactRouterDOM?.Link,o=`/dags/${encodeURIComponent(e)}/plugin/${Ga}`;return c?a.jsx(c,{to:o,className:r,children:i}):a.jsx("a",{href:new URL(o.slice(1),document.baseURI).href,className:r,children:i})}const ka=e=>a.jsxs("div",{className:"dagwick-eyebrow",children:[a.jsx("span",{className:"dagwick-brand",children:O})," · ",e]});function Ja(e){if(e<60)return`${Math.round(e)} s`;if(e<3600)return`${Math.round(e/60)} min`;const i=Math.floor(e/3600),r=Math.round(e%3600/60);return r?`${i} h ${r} min`:`${i} h`}function ja(e,i=Date.now()){const r=Math.max(0,Math.round((i-Date.parse(e))/6e4));if(r<60)return`${r} min ago`;const c=Math.round(r/60);return c<48?`${c} h ago`:`${Math.round(c/24)} days ago`}function Ra(e){return e===null||Math.abs(e)<10?e===null?void 0:"steady":e>0?`${e}% slower than before`:`${-e}% faster than before`}function ae({dagId:e}){const{data:i,error:r}=q(c=>qa(e,c),[e]);return r||!i?null:a.jsx(ee,{health:i})}function ee({health:e,now:i}){const r=e;return a.jsxs("section",{className:"dagwick-health","aria-label":"Run health",children:[a.jsxs("div",{className:"dagwick-health-head",children:[a.jsx("span",{className:"dagwick-side-title",children:"Run health"}),a.jsxs("span",{className:"dagwick-muted",children:["last ",r.window_days," days · not part of the score"]})]}),r.runs===0?a.jsxs("p",{className:"dagwick-muted dagwick-health-empty",children:["No finished runs in the last ",r.window_days," days."]}):a.jsxs("div",{className:"dagwick-cats",children:[a.jsx(I,{label:"Runs succeeded",value:`${r.success_rate}%`,sub:`${r.succeeded} of ${r.runs}${r.truncated?"+":""} runs`,tone:r.success_rate!==null&&r.success_rate<90?"fail":"pass"}),a.jsx(I,{label:"Tasks retried",value:r.retry_rate===null?"–":`${r.retry_rate}%`,sub:`${r.tasks_retried} of ${r.tasks_finished} tasks`,tone:r.retry_rate!==null&&r.retry_rate>=10?"warn":void 0}),a.jsx(I,{label:"Typical run",value:r.median_seconds===null?"–":Ja(r.median_seconds),sub:Ra(r.duration_trend_pct)??"not enough runs for a trend",tone:r.duration_trend_pct!==null&&r.duration_trend_pct>=25?"warn":void 0}),a.jsx(I,{label:"Last run",value:r.last_state?r.last_state[0].toUpperCase()+r.last_state.slice(1):"–",sub:r.last_end?ja(r.last_end,i):"",tone:r.last_state==="failed"?"fail":r.last_state==="success"?"pass":void 0})]})]})}function I({label:e,value:i,sub:r,tone:c}){return a.jsxs("div",{className:`dagwick-cat dagwick-htile${c?` dagwick-htile--${c}`:""}`,children:[a.jsx("div",{className:"dagwick-cat-head",children:a.jsx("span",{children:e})}),a.jsx("div",{className:"dagwick-htile-value",children:i}),a.jsx("div",{className:"dagwick-muted dagwick-htile-sub",children:r})]})}const ie=5;function re(e){return e?new Date(e).toLocaleDateString(void 0,{day:"numeric",month:"short"}):""}function ha(e){const i=[];for(let r=e.length-1;r>0&&i.length<ie;r--){const c=e[r];(c.better.length||c.worse.length)&&i.push({point:c,from:e[r-1].score})}return i}function ce({dagId:e}){const{data:i}=q(r=>Ha(e,r),[e]);return i?a.jsx(oe,{history:i}):null}function oe({history:e}){const i=e.versions;return a.jsxs("section",{className:"dagwick-section","aria-label":"Score history",children:[a.jsxs("div",{className:"dagwick-section-head",children:[a.jsx("span",{className:"dagwick-side-title",children:"Score history"}),a.jsxs("span",{className:"dagwick-muted",children:[e.truncated?`last ${i.length} versions`:`${i.length} version${i.length===1?"":"s"}`," · code checks only"]})]}),i.length<2?a.jsx("p",{className:"dagwick-muted dagwick-section-empty",children:"Only one version so far. Each time the DAG's code changes, its new score appears here."}):a.jsxs("div",{className:"dagwick-history",children:[a.jsx(te,{versions:i}),a.jsxs("ul",{className:"dagwick-changes",children:[ha(i).map(({point:r,from:c})=>a.jsxs("li",{children:[a.jsxs("span",{className:"dagwick-change-head",children:[a.jsxs("strong",{children:["v",r.version]}),a.jsx("span",{className:"dagwick-muted",children:re(r.created_at)}),a.jsxs("span",{className:r.score>=c?"dagwick-up":"dagwick-down",children:[Math.round(c)," → ",Math.round(r.score)]})]}),r.better.length>0&&a.jsxs("span",{className:"dagwick-up",children:["Now passing: ",r.better.join(", ")]}),r.worse.length>0&&a.jsxs("span",{className:"dagwick-down",children:["Now failing: ",r.worse.join(", ")]})]},r.version)),ha(i).length===0&&a.jsx("li",{className:"dagwick-muted",children:"The code changed, but no check result did."})]})]})]})}function te({versions:e}){const o=n=>6+n*288/Math.max(e.length-1,1),d=n=>58-n/100*52,g=e.map((n,s)=>`${o(s)},${d(n.score)}`).join(" ");return a.jsxs("svg",{className:"dagwick-spark",viewBox:"0 0 300 64",preserveAspectRatio:"none",role:"img","aria-label":`Score by version, from ${Math.round(e[0].score)} to ${Math.round(e[e.length-1].score)}`,children:[a.jsx("polyline",{points:g,fill:"none",stroke:"var(--dagwick-accent)",strokeWidth:"2",vectorEffect:"non-scaling-stroke"}),e.map((n,s)=>a.jsx("circle",{cx:o(s),cy:d(n.score),r:"3",className:`dagwick-spark-dot dagwick-spark-dot--${n.grade}`,children:a.jsx("title",{children:`v${n.version}: ${n.grade} ${Math.round(n.score)}`})},n.version))]})}const k=(e,i=0)=>{const r=Math.sin(e*12.9898+i*78.233)*43758.5453;return r-Math.floor(r)},S=e=>Array.from({length:e},(i,r)=>r),$=e=>`${(e*100).toFixed(1)}%`,u=e=>`${e.toFixed(2)}s`,z=["#f472b6","#60a5fa","#fde047","#4ade80","#c084fc","#fb923c"],fa=["#ef4444","#f59e0b","#22c55e","#3b82f6","#ec4899","#a855f7","#14b8a6"],ba=["ڕ","ڵ","ڤ","ێ","ۆ","ژ","چ","گ","پ","ê","î","û","ş","ç","x","Kurdî","کوردی"];function se(){return a.jsxs(a.Fragment,{children:[S(28).map(e=>a.jsx("span",{className:"dagwick-flake",style:{left:$(k(e,1)),width:3+k(e,2)*5,height:3+k(e,2)*5,opacity:.5+k(e,3)*.5,animationDuration:`${u(6+k(e,4)*7)}, ${u(2.5+k(e,5)*2)}`,animationDelay:`${u(-k(e,6)*12)}, ${u(-k(e,7)*3)}`}},e)),a.jsx("svg",{className:"dagwick-snowbank",viewBox:"0 0 400 20",preserveAspectRatio:"none",children:a.jsx("path",{d:"M0 20 V10 Q20 2 45 9 T95 8 T150 10 T205 7 T260 10 T320 6 T400 9 V20 Z"})})]})}function de({style:e}){return a.jsx("span",{className:"dagwick-bat",style:e,children:a.jsx("span",{className:"dagwick-bat-bob",children:a.jsxs("svg",{viewBox:"0 0 40 20",width:"34",height:"17",children:[a.jsx("g",{className:"dagwick-wing-l",children:a.jsx("path",{d:"M20 9 C 14 2, 6 2, 0 6 C 5 7, 7 10, 6 13 C 10 10, 14 11, 20 12 Z"})}),a.jsx("g",{className:"dagwick-wing-r",children:a.jsx("path",{d:"M20 9 C 26 2, 34 2, 40 6 C 35 7, 33 10, 34 13 C 30 10, 26 11, 20 12 Z"})}),a.jsx("ellipse",{cx:"20",cy:"10.5",rx:"3",ry:"4"}),a.jsx("path",{d:"M18 7 l-1 -3 2 2 M22 7 l1 -3 -2 2"})]})})})}function ne(){return a.jsxs(a.Fragment,{children:[a.jsx("span",{className:"dagwick-moon"}),S(7).map(e=>a.jsx(de,{style:{top:$(.06+k(e,1)*.55),transform:`scale(${.6+k(e,2)*.7})`,animationDuration:u(9+k(e,3)*8),animationDelay:u(-k(e,4)*16)}},e))]})}function xa({n:e=30}){return a.jsx(a.Fragment,{children:S(e).map(i=>a.jsx("span",{className:"dagwick-confetti",style:{left:$(k(i,1)),background:z[i%z.length],animationDuration:`${u(4+k(i,2)*5)}, ${u(1+k(i,3)*2)}`,animationDelay:`${u(-k(i,4)*9)}, 0s`}},i))})}function le(){return a.jsx(a.Fragment,{children:[{left:"12%",top:"18%",color:"#f472b6",delay:0},{left:"82%",top:"14%",color:"#60a5fa",delay:1.1},{left:"64%",top:"30%",color:"#fde047",delay:2.2}].map((e,i)=>a.jsx("span",{className:"dagwick-firework",style:{left:e.left,top:e.top,animationDelay:u(e.delay)},children:S(12).map(r=>a.jsx("i",{style:{background:e.color,transform:`rotate(${r*30}deg) translateY(-26px)`}},r))},i))})}function ge(){return a.jsx(a.Fragment,{children:S(5).map(e=>a.jsx("span",{className:"dagwick-balloon",style:{left:$(.08+k(e,1)*.84),background:z[e%z.length],animationDuration:u(10+k(e,2)*6),animationDelay:u(-k(e,3)*14)}},e))})}function we(){return a.jsxs(a.Fragment,{children:[S(18).map(e=>a.jsx("span",{className:"dagwick-ember",style:{left:$(.05+k(e,1)*.9),animationDuration:u(4+k(e,2)*4),animationDelay:u(-k(e,3)*8)}},e)),a.jsxs("svg",{className:"dagwick-mountains",viewBox:"0 0 800 120",preserveAspectRatio:"none",children:[a.jsx("path",{className:"far",d:"M0 120 L0 70 L90 30 L170 66 L260 18 L360 64 L450 26 L560 70 L650 22 L740 60 L800 40 L800 120 Z"}),a.jsx("path",{className:"near",d:"M0 120 L0 92 L120 58 L220 90 L330 54 L440 92 L560 60 L690 94 L800 64 L800 120 Z"})]}),[[.325,.6],[.5625,.638],[.8125,.61]].map(([e,i],r)=>a.jsx("span",{className:"dagwick-fire",style:{left:$(e),top:$(i),animationDelay:u(r*.3)}},r)),a.jsx("div",{className:"dagwick-govend",children:S(9).map(e=>a.jsx("span",{className:"dagwick-dancer",style:{animationDelay:u(e*.18)},children:a.jsxs("svg",{viewBox:"0 0 20 36",width:"22",height:"40",children:[a.jsx("circle",{cx:"10",cy:"5",r:"4",fill:"#f1d3b3"}),a.jsx("path",{d:"M6 3 Q10 -1 14 3 L14 5 L6 5 Z",fill:e%2?"#1f2937":"#7c2d12"}),a.jsx("path",{d:"M10 9 L3 32 L17 32 Z",fill:fa[e%fa.length]}),a.jsx("path",{d:"M7 32 L7 35 M13 32 L13 35",stroke:"#1f2937",strokeWidth:"1.6"}),a.jsx("path",{d:"M-1 15 L21 15",stroke:"#f1d3b3",strokeWidth:"2",strokeLinecap:"round"}),e===0&&a.jsx("path",{d:"M-1 15 L-5 6 L1 9 Z",fill:"#facc15"})]})},e))})]})}function ma({n:e=22}){return a.jsx(a.Fragment,{children:S(e).map(i=>a.jsx("span",{className:"dagwick-star",style:{left:$(k(i,1)),top:$(k(i,2)*.7),animationDelay:u(-k(i,3)*3),animationDuration:u(2+k(i,4)*2.5)}},i))})}function pe(){return a.jsx("div",{className:"dagwick-hanging",children:[.2,.55,.85].map((e,i)=>a.jsx("span",{style:{left:$(e),height:26+i*14,animationDelay:u(i*.6)},children:a.jsxs("svg",{viewBox:"0 0 16 26",width:"16",height:"26",children:[a.jsx("path",{d:"M8 0 L8 4",stroke:"#e9c46a"}),a.jsx("path",{d:"M3 6 L13 6 L11 4 L5 4 Z",fill:"#e9c46a"}),a.jsx("path",{d:"M3 6 Q0 13 3 20 L13 20 Q16 13 13 6 Z",fill:"#fbbf24",opacity:".85"}),a.jsx("path",{d:"M4 20 L12 20 L10 23 L6 23 Z",fill:"#e9c46a"})]})},i))})}function ke(){return a.jsxs("svg",{className:"dagwick-bunting",viewBox:"0 0 800 40",preserveAspectRatio:"none",children:[a.jsx("path",{d:"M0 4 Q400 34 800 4",fill:"none",stroke:"#e9c46a",strokeWidth:"1.5"}),S(16).map(e=>{const i=25+e*48,r=4+30*(1-((i-400)/400)**2)*.95;return a.jsx("path",{d:`M${i-10} ${r} L${i+10} ${r} L${i} ${r+16} Z`,fill:z[e%z.length]},e)})]})}function he(){return a.jsx(a.Fragment,{children:S(16).map(e=>a.jsx("span",{className:"dagwick-letter",style:{left:$(.04+k(e,1)*.92),fontSize:13+k(e,2)*11,animationDuration:u(7+k(e,3)*6),animationDelay:u(-k(e,4)*12)},children:ba[e%ba.length]},e))})}const fe={christmas:()=>a.jsx(se,{}),halloween:()=>a.jsx(ne,{}),"new-year":()=>a.jsxs(a.Fragment,{children:[a.jsx(le,{}),a.jsx(xa,{})]}),birthday:()=>a.jsxs(a.Fragment,{children:[a.jsx(ge,{}),a.jsx(xa,{n:18})]}),newroz:()=>a.jsx(we,{}),ramadan:()=>a.jsxs(a.Fragment,{children:[a.jsx(ma,{}),a.jsx(pe,{})]}),eid:()=>a.jsxs(a.Fragment,{children:[a.jsx(ke,{}),a.jsx(ma,{n:14})]}),"language-day":()=>a.jsx(he,{})};function ua({season:e}){return e?a.jsx("div",{className:`dagwick-fx dagwick-fx--${e.id}`,"aria-hidden":"true",children:fe[e.id]()}):null}function va({state:e}){const{season:i,available:r,hidden:c,setHidden:o}=e;return i?a.jsxs("div",{className:"dagwick-greeting",children:[a.jsx("span",{"aria-hidden":"true",children:i.icon}),a.jsx("span",{children:i.greeting}),a.jsx("button",{className:"dagwick-greeting-hide",onClick:()=>o(!0),title:"Hide seasonal decorations",children:"Hide"})]}):r&&c?a.jsxs("button",{className:"dagwick-greeting-show",onClick:()=>o(!1),children:[r.icon," Show the ",r.name," mood"]}):null}const F=[["A",90],["B",75],["C",60],["D",40]];function be(e,i=F){return i.find(([,r])=>e>=r)?.[0]??"F"}function xe(e){if(!e||typeof e!="object")return F;const i=e,r=F.map(([c,o])=>[c,typeof i[c]=="number"?i[c]:o]);return r.every(([,c],o)=>o===0||r[o-1][1]>c)?r:F}function ya(){const[e,i]=w.useState(F);return w.useEffect(()=>{let r=!0;return da().then(c=>r&&i(xe(c.grades))).catch(()=>{}),()=>{r=!1}},[]),e}const Q={eid:{id:"eid",name:"Eid",greeting:"Eid Mubarak!",icon:"🍪"},newroz:{id:"newroz",name:"Newroz",greeting:"Happy Newroz!",icon:"🔥"},"language-day":{id:"language-day",name:"Kurdish Language Day",greeting:"Kurdish Language Day",icon:"✍️"},christmas:{id:"christmas",name:"Christmas",greeting:"Merry Christmas!",icon:"🎄"},"new-year":{id:"new-year",name:"New Year",greeting:"Happy New Year!",icon:"🎉"},halloween:{id:"halloween",name:"Halloween",greeting:"Happy Halloween!",icon:"🎃"},ramadan:{id:"ramadan",name:"Ramadan",greeting:"Ramadan Kareem",icon:"🌙"},birthday:{id:"birthday",name:"Dagwick's birthday",greeting:"Dagwick turns another year older!",icon:"🎂"}},Na=["newroz","eid","language-day","christmas","new-year","halloween","ramadan","birthday"],Y=(e,i,r,c)=>{const o=e*100+i,d=r[0]*100+r[1],g=c[0]*100+c[1];return d<=g?o>=d&&o<=g:o>=d||o<=g};function Ma(e){try{const i=new Intl.DateTimeFormat("en-US-u-ca-islamic-umalqura",{month:"numeric",day:"numeric"}).formatToParts(e),r=Number(i.find(o=>o.type==="month")?.value),c=Number(i.find(o=>o.type==="day")?.value);return r&&c?{month:r,day:c}:void 0}catch{return}}const me={eid:e=>{const i=Ma(e);return!!i&&(i.month===10&&i.day<=3||i.month===12&&i.day>=10&&i.day<=13)},newroz:e=>Y(e.getMonth()+1,e.getDate(),[3,19],[3,23]),"language-day":e=>e.getMonth()+1===5&&e.getDate()===15,christmas:e=>Y(e.getMonth()+1,e.getDate(),[12,18],[12,26]),"new-year":e=>Y(e.getMonth()+1,e.getDate(),[12,31],[1,2]),halloween:e=>Y(e.getMonth()+1,e.getDate(),[10,24],[11,1]),ramadan:e=>Ma(e)?.month===9,birthday:e=>e.getMonth()+1===11&&e.getDate()===8};function ue(e,i="auto"){if(i==="off")return;const c=(i==="auto"?Na:Na.filter(o=>i.includes(o))).find(o=>me[o](e));return c?Q[c]:void 0}function $a(e){return!!e&&e in Q}const V="dagwick.moods.hidden";function ve(){try{return window.localStorage.getItem(V)==="1"}catch{return!1}}function ye(e){try{e?window.localStorage.setItem(V,"1"):window.localStorage.removeItem(V)}catch{}}function Ne(){const e=new URLSearchParams(window.location.search).get("dagwick_mood");return e==="everyday"?null:$a(e)?Q[e]:void 0}function Ca(){const[e]=w.useState(Ne),[i,r]=w.useState(()=>e??void 0),[c,o]=w.useState(ve);return w.useEffect(()=>{if(e!==void 0)return;const g=new AbortController;return da().then(n=>{if(g.signal.aborted)return;const s=n.seasonal_moods==="auto"||n.seasonal_moods==="off"?n.seasonal_moods:n.seasonal_moods.filter($a);r(ue(new Date,s))}).catch(()=>{}),()=>g.abort()},[e]),{season:c?void 0:i,available:i,hidden:c,setHidden:g=>{ye(g),o(g)}}}const W={reliability:"Reliability",observability:"Observability",scheduling:"Scheduling",ownership:"Ownership",structure:"Structure",performance:"Performance",security:"Security"},Sa={fail:0,warn:1,pass:2,ack:3,skip:4},Me={A:"Shining bright. This DAG is in great shape.",B:"A steady flame. A few small things to polish.",C:"Burning, but dimly. Some important habits are missing.",D:"Flickering. This DAG needs attention soon.",F:"The lamp has gone out. Start with the red items below."},A=e=>e.weight-e.points,Da=(e,i)=>Sa[e.status]-Sa[i.status]||A(i)-A(e);function $e({dagId:e}){const{data:i,error:r,reload:c}=q(o=>Oa(e,o),[e]);return r?a.jsx(H,{title:"Couldn't check this DAG",body:r,action:a.jsx("button",{className:"dagwick-btn",onClick:c,children:"Try again"})}):i?a.jsx(Se,{report:i},i.dag_id):a.jsx(wa,{})}function Ce(e,i){const r=[...i].reverse().find(([,s])=>s>e.score);if(!r)return;const[c,o]=r;let d=o/100*e.max_points-e.points;const g=[],n=e.checks.filter(s=>s.status==="fail"||s.status==="warn").sort((s,b)=>A(b)-A(s));for(const s of n){if(d<=1e-9)break;g.push(s),d-=A(s)}return d<=1e-9?{grade:c,picks:g}:void 0}function Se({report:e}){const i=Ca(),r=i.season,c=e.counts.fail+e.counts.warn,[o,d]=w.useState(c?"attention":"all"),[g,n]=w.useState(()=>{const l=e.checks.filter(N=>N.fix).sort(Da),C=l.filter(N=>N.status==="fail");return new Set((C.length?C:l.slice(0,2)).map(N=>N.id))}),s=l=>n(C=>{const N=new Set(C);return N.delete(l)||N.add(l),N}),b=w.useMemo(()=>ze(e.checks),[e]),y=ya(),h=w.useMemo(()=>Ce(e,y),[e,y]),x=w.useMemo(()=>e.checks.filter(l=>o==="all"?!0:o==="passed"?l.status==="pass":l.status==="fail"||l.status==="warn").sort(Da),[e,o]),D=l=>{d("attention"),n(C=>new Set(C).add(l)),requestAnimationFrame(()=>document.getElementById(`dagwick-check-${l}`)?.scrollIntoView({behavior:"smooth",block:"center"}))};return a.jsxs(a.Fragment,{children:[a.jsxs("section",{className:`dagwick-hero dagwick-grade-${e.grade}${r?` dagwick-season dagwick-season-${r.id}`:""}`,children:[a.jsx(ua,{season:r}),a.jsx(ga,{grade:e.grade,season:r?.id}),a.jsxs("div",{className:"dagwick-hero-text",children:[a.jsx(va,{state:i}),ka("DAG health"),a.jsx("h2",{className:"dagwick-dag",children:e.dag_id}),a.jsx("p",{className:"dagwick-headline",children:Me[e.grade]}),a.jsxs("div",{className:"dagwick-chips",children:[a.jsx(P,{status:"pass",n:e.counts.pass,label:"passing"}),a.jsx(P,{status:"warn",n:e.counts.warn,label:"to improve"}),a.jsx(P,{status:"fail",n:e.counts.fail,label:"failing"}),e.counts.ack>0&&a.jsx(P,{status:"ack",n:e.counts.ack,label:"acknowledged"})]})]}),a.jsx("div",{className:"dagwick-hero-side",children:a.jsx(la,{score:e.score,grade:e.grade})})]}),h?a.jsxs("section",{className:"dagwick-goal",children:[a.jsxs("div",{className:"dagwick-goal-text",children:[a.jsx("span",{className:"dagwick-goal-step",children:"Next step"}),"Fix ",h.picks.length===1?"this check":`these ${h.picks.length} checks`," to reach"," ",a.jsx("span",{className:`dagwick-badge dagwick-badge--${h.grade}`,children:h.grade})]}),a.jsx("div",{className:"dagwick-goal-picks",children:h.picks.map(l=>a.jsxs("button",{className:"dagwick-pick",onClick:()=>D(l.id),children:[l.title," ",a.jsxs("span",{className:"dagwick-pick-gain",children:["+",A(l).toFixed(l.points%1?1:0)]})]},l.id))})]}):e.score<100?a.jsx("section",{className:"dagwick-goal dagwick-goal--top",children:a.jsxs("div",{className:"dagwick-goal-text",children:[a.jsx("span",{className:"dagwick-goal-step",children:"Top grade"})," Polish the last ",c," item",c===1?"":"s"," for a perfect 100."]})}):null,a.jsx("section",{className:"dagwick-cats","aria-label":"Score by category",children:b.map(l=>a.jsxs("div",{className:"dagwick-cat",children:[a.jsxs("div",{className:"dagwick-cat-head",children:[a.jsx("span",{children:W[l.id]??l.id}),a.jsxs("span",{className:"dagwick-muted",children:[Math.round(l.pct),"%"]})]}),a.jsx("div",{className:"dagwick-bar",children:a.jsx("div",{className:"dagwick-bar-fill",style:{width:`${l.pct}%`,background:Ae(l.pct)}})})]},l.id))}),a.jsx(ae,{dagId:e.dag_id}),a.jsx(ce,{dagId:e.dag_id}),a.jsxs("section",{className:"dagwick-list",children:[a.jsxs("div",{className:"dagwick-tabs",role:"tablist",children:[a.jsxs(J,{active:o==="attention",onClick:()=>d("attention"),children:["Needs attention ",a.jsx("span",{className:"dagwick-count",children:c})]}),a.jsxs(J,{active:o==="all",onClick:()=>d("all"),children:["All checks ",a.jsx("span",{className:"dagwick-count",children:e.checks.length})]}),a.jsxs(J,{active:o==="passed",onClick:()=>d("passed"),children:["Passed ",a.jsx("span",{className:"dagwick-count",children:e.counts.pass})]})]}),x.length===0?a.jsx("div",{className:"dagwick-clear",children:"Nothing here. Every check in this view is passing. ✨"}):a.jsx("ul",{className:"dagwick-checks",children:x.map(l=>a.jsx(Le,{check:l,open:g.has(l.id),onToggle:()=>s(l.id)},l.id))})]}),a.jsxs("footer",{className:"dagwick-foot dagwick-muted",children:[e.points," / ",e.max_points," points · scored automatically from the latest parsed version of this DAG · ",O," ",sa]})]})}const De={pass:"✓",warn:"!",fail:"✕",skip:"–",ack:"~"},K=8;function Le({check:e,open:i,onToggle:r}){const[c,o]=w.useState(!1),d=!!e.fix,g=c?e.items:e.items.slice(0,K);return a.jsxs("li",{id:`dagwick-check-${e.id}`,className:`dagwick-check dagwick-check--${e.status}${i&&d?" is-open":""}`,children:[a.jsx("span",{className:"dagwick-icon","aria-label":e.status,children:De[e.status]}),a.jsxs("div",{className:"dagwick-check-body",children:[a.jsxs("button",{className:"dagwick-check-head",onClick:d?r:void 0,disabled:!d,"aria-expanded":d?i:void 0,children:[a.jsx("span",{className:"dagwick-check-title",children:e.title}),a.jsx("span",{className:"dagwick-tag",children:W[e.category]??e.category}),e.pack&&e.pack!=="dagwick"&&a.jsx("span",{className:"dagwick-tag dagwick-tag--pack",title:`From the check pack ${e.pack}`,children:e.pack}),a.jsxs("span",{className:"dagwick-pts",children:[e.status==="skip"||e.status==="ack"?"n/a":`${e.points} / ${e.weight}`,d&&a.jsx("span",{className:"dagwick-caret",children:i?"▾":"▸"})]})]}),a.jsx("div",{className:"dagwick-check-msg",children:e.message}),e.ack_reason&&a.jsxs("div",{className:"dagwick-ack",children:[a.jsx("span",{className:"dagwick-ack-label",children:"Acknowledged"}),e.ack_reason]}),e.ack_note&&a.jsx("div",{className:"dagwick-ack-note",children:e.ack_note}),i&&d&&a.jsxs("div",{className:"dagwick-detail",children:[e.items.length>0&&a.jsxs("div",{className:"dagwick-items",children:[a.jsx("span",{className:"dagwick-items-label",children:"Affected"}),g.map(n=>a.jsx("code",{className:"dagwick-item",children:n},n)),e.items.length>K&&a.jsx("button",{className:"dagwick-more",onClick:()=>o(!c),children:c?"show less":`+${e.items.length-K} more`})]}),a.jsxs("div",{className:"dagwick-fix",children:[a.jsx("span",{className:"dagwick-fix-label",children:"How to fix"}),e.fix,e.example&&a.jsx(Xa,{code:e.example})]})]})]})]})}function P({status:e,n:i,label:r}){return a.jsxs("span",{className:`dagwick-chip dagwick-chip--${e}`,children:[a.jsx("strong",{children:i})," ",r]})}function J({active:e,onClick:i,children:r}){return a.jsx("button",{role:"tab","aria-selected":e,className:`dagwick-tab${e?" is-active":""}`,onClick:i,children:r})}function ze(e){const i=new Map;for(const r of e){if(r.status==="skip"||r.status==="ack")continue;const c=i.get(r.category)??{earned:0,possible:0};c.earned+=r.points,c.possible+=r.weight,i.set(r.category,c)}return Object.keys(W).filter(r=>i.has(r)).concat([...i.keys()].filter(r=>!(r in W))).map(r=>{const c=i.get(r);return{id:r,pct:c.possible?c.earned/c.possible*100:0}})}function Ae(e){return e>=90?"var(--dagwick-pass)":e>=60?"var(--dagwick-warn)":"var(--dagwick-fail)"}function j(e){return[...new Set(e.split(",").map(i=>i.trim()).filter(Boolean))]}function La(e){const i=new Map;for(const r of e)for(const c of new Set(r))i.set(c,(i.get(c)??0)+1);return[...i.entries()].map(([r,c])=>({name:r,count:c})).sort((r,c)=>c.count-r.count||r.name.localeCompare(c.name))}function _e(e,i,r=8){const c=i.trim().toLowerCase(),o=c?e.filter(d=>d.name.toLowerCase().includes(c)):e;return{shown:o.slice(0,r),more:Math.max(0,o.length-r)}}function R(e,i){return(!i.owner||j(e.owners).includes(i.owner))&&(!i.tag||(e.tags??[]).includes(i.tag))}function Fe(e){const i=[e.owner,e.tag&&`#${e.tag}`].filter(Boolean);return i.length?i.join(" · "):void 0}function Te(e){const i=new URLSearchParams(e);return{owner:i.get("owner")||void 0,tag:i.get("tag")||void 0}}function Ee(e,i){const r=new URLSearchParams(e);for(const o of["owner","tag"]){const d=i[o];d?r.set(o,d):r.delete(o)}const c=r.toString();return c?`?${c}`:""}function Be(e,i){return{owners:La(e.filter(r=>R(r,{tag:i.tag})).map(r=>j(r.owners))),tags:La(e.filter(r=>R(r,{owner:i.owner})).map(r=>r.tags??[]))}}const za={query:"",open:!1,editing:!1,active:0};function Ge(e,i){switch(i.type){case"focus":return{...e,open:!0,editing:!0,active:0};case"blur":case"picked":return za;case"type":return{query:i.query,open:!0,editing:!0,active:0};case"move":return i.count?{...e,open:!0,active:(e.active+i.by+i.count)%i.count}:{...e,open:!0};case"hover":return{...e,active:i.index};case"cleared":return{...e,query:"",active:0};case"close":return{...e,open:!1}}}function Oe(e,i){return e.editing?e.query:i??""}function Aa({label:e,noun:i,placeholder:r,options:c,value:o,onPick:d,onClear:g}){const n=w.useId(),[s,b]=w.useReducer(Ge,za),y=w.useRef(null),{shown:h,more:x}=w.useMemo(()=>_e(c,s.query),[c,s.query]),D=Math.min(s.active,Math.max(h.length-1,0)),l=`${n}-list`,C=f=>`${n}-opt-${f}`,N=!!(o||s.query),E=f=>{d(f),b({type:"picked"})},m=()=>{b({type:"cleared"}),o&&g(),y.current?.focus(),b({type:"focus"})},M=f=>{f.key==="ArrowDown"||f.key==="ArrowUp"?(f.preventDefault(),b({type:"move",by:f.key==="ArrowDown"?1:-1,count:h.length})):f.key==="Enter"&&s.open&&h[D]?(f.preventDefault(),E(h[D].name)):f.key==="Escape"&&(s.open?b({type:"close"}):m())};return a.jsxs("div",{className:"dagwick-scope-field",children:[a.jsx("label",{className:"dagwick-scope-label",htmlFor:`${n}-input`,children:e}),a.jsxs("div",{className:`dagwick-combo${N?" has-value":""}`,children:[a.jsxs("svg",{viewBox:"0 0 24 24",width:"16",height:"16","aria-hidden":"true",children:[a.jsx("circle",{cx:"11",cy:"11",r:"7",fill:"none",stroke:"currentColor",strokeWidth:"2"}),a.jsx("path",{d:"M20 20l-4-4",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round"})]}),a.jsx("input",{ref:y,id:`${n}-input`,className:"dagwick-search",type:"text",role:"combobox",autoComplete:"off","aria-autocomplete":"list","aria-expanded":s.open,"aria-controls":l,"aria-activedescendant":s.open&&h.length?C(D):void 0,placeholder:o??r,value:Oe(s,o),onFocus:()=>b({type:"focus"}),onClick:()=>!s.open&&b({type:"focus"}),onBlur:()=>b({type:"blur"}),onChange:f=>b({type:"type",query:f.target.value}),onKeyDown:M}),N&&a.jsx("button",{type:"button",className:"dagwick-combo-clear","aria-label":o?`Clear ${i} ${o}`:"Clear search",title:o?`Clear ${i}`:"Clear search",onMouseDown:f=>f.preventDefault(),onClick:m,children:"✕"}),s.open&&a.jsxs("ul",{className:"dagwick-listbox",id:l,role:"listbox","aria-label":e,children:[!s.query.trim()&&h.length>0&&a.jsx("li",{className:"dagwick-listbox-note",role:"presentation",children:"Most DAGs"}),h.map((f,L)=>a.jsxs("li",{id:C(L),role:"option","aria-selected":L===D,className:`dagwick-opt${L===D?" is-active":""}`,onMouseDown:ra=>{ra.preventDefault(),E(f.name)},onMouseEnter:()=>b({type:"hover",index:L}),children:[a.jsx("span",{className:"dagwick-opt-name",children:qe(f.name,s.query)}),a.jsxs("span",{className:"dagwick-muted",children:[f.name===o?"✓ ":"",f.count," DAG",f.count===1?"":"s"]})]},f.name)),h.length===0&&a.jsx("li",{className:"dagwick-listbox-note",role:"presentation",children:s.query.trim()?`No ${i} matches “${s.query.trim()}”.`:`No ${i}s here.`}),x>0&&a.jsxs("li",{className:"dagwick-listbox-note",role:"presentation",children:[x," more. Keep typing to narrow it down."]})]})]})]})}function qe(e,i){const r=i.trim().toLowerCase(),c=r?e.toLowerCase().indexOf(r):-1;return c<0?e:a.jsxs(a.Fragment,{children:[e.slice(0,c),a.jsx("mark",{children:e.slice(c,c+r.length)}),e.slice(c+r.length)]})}const _a=["A","B","C","D","F"],He={A:"Shining",B:"Steady",C:"Dim",D:"Flickering",F:"Out"},Ie={A:"The whole fleet is shining.",B:"The fleet burns steady.",C:"The fleet glows dimly.",D:"The fleet is flickering.",F:"The fleet has gone dark."},Ye={A:"is shining.",B:"burns steady.",C:"glows dimly.",D:"is flickering.",F:"has gone dark."},We=[{id:"worst",label:"Needs care"},{id:"best",label:"Healthiest"},{id:"name",label:"A–Z"}],aa=3,Pe=6;function Ze(){const{data:e,error:i,reload:r}=q(c=>Ia(c),[]);return i?a.jsx(H,{title:"Couldn't load the fleet",body:i,action:a.jsx("button",{className:"dagwick-btn",onClick:r,children:"Try again"})}):e?e.dags.length===0?a.jsx(H,{title:"No DAGs yet",body:"Once Airflow parses a DAG you can read, it shows up here."}):a.jsx(Ue,{dags:e.dags,truncated:e.truncated}):a.jsx(wa,{label:"Checking every DAG…"})}function Ue({dags:e,truncated:i}){const r=Ca(),c=r.season,[o,d]=w.useState(""),[g,n]=w.useState(),[s,b]=w.useState(),[y,h]=w.useState("worst"),[x,D]=w.useState(()=>Te(window.location.search)),l=t=>{D(t),n(void 0),b(void 0);const{pathname:p,search:v,hash:G}=window.location;window.history.replaceState(window.history.state,"",p+Ee(v,t)+G)},{owners:C,tags:N}=w.useMemo(()=>Be(e,x),[e,x]),E=w.useMemo(()=>new Set(e.flatMap(t=>j(t.owners))).size,[e]),m=w.useMemo(()=>e.filter(t=>R(t,x)),[e,x]),M=Fe(x),f=a.jsxs("section",{className:"dagwick-scope","aria-label":"Show DAGs for",children:[a.jsx(Aa,{label:"Owner",noun:"owner",placeholder:"Type a team or owner",options:C,value:x.owner,onPick:t=>l({...x,owner:t}),onClear:()=>l({...x,owner:void 0})}),(N.length>0||x.tag)&&a.jsx(Aa,{label:"Tag",noun:"tag",placeholder:"Type a tag",options:N,value:x.tag,onPick:t=>l({...x,tag:t}),onClear:()=>l({...x,tag:void 0})}),a.jsx("div",{className:"dagwick-scope-now","aria-live":"polite",children:M?a.jsxs(a.Fragment,{children:[a.jsxs("span",{children:["Viewing ",a.jsx("strong",{children:M})," · ",m.length," of ",e.length," DAGs"]}),a.jsx("button",{className:"dagwick-btn dagwick-btn--quiet",onClick:()=>l({}),children:"Show all DAGs"})]}):a.jsxs("span",{className:"dagwick-muted",children:["Viewing all ",e.length," DAGs from ",E," ",E===1?"owner":"owners"]})})]}),L=m.reduce((t,p)=>t+p.score,0)/m.length,ra=ya(),B=be(L,ra),ca=w.useMemo(()=>Object.fromEntries(_a.map(t=>[t,m.filter(p=>p.grade===t).length])),[m]),oa=ca.A+ca.B,Ta=m.reduce((t,p)=>t+(p.counts.ack??0),0),Z=m.length-oa,Ea=w.useMemo(()=>{const t=new Map;for(const p of m)for(const v of p.issues){const G=t.get(v.id)??{id:v.id,title:v.title,dags:0,fails:0};G.dags+=1,v.status==="fail"&&(G.fails+=1),t.set(v.id,G)}return[...t.values()].sort((p,v)=>v.dags-p.dags||v.fails-p.fails).slice(0,Pe)},[m]),ta=w.useMemo(()=>{const t=o.trim().toLowerCase();return m.filter(p=>(!g||p.grade===g)&&(!s||p.issues.some(v=>v.id===s.id))&&(!t||p.dag_id.toLowerCase().includes(t)||p.owners.toLowerCase().includes(t))).sort((p,v)=>y==="name"?p.dag_id.localeCompare(v.dag_id):y==="best"?v.score-p.score:p.score-v.score)},[m,o,g,s,y]),Ve=!!(g||s||o.trim());return m.length===0?a.jsxs(a.Fragment,{children:[f,a.jsx(H,{title:`No DAGs for ${M}`,body:"Nothing you can see matches this owner and tag. The link may be old, or the DAGs may have moved.",action:a.jsx("button",{className:"dagwick-btn",onClick:()=>l({}),children:"Show all DAGs"})})]}):a.jsxs(a.Fragment,{children:[f,a.jsxs("section",{className:`dagwick-hero dagwick-grade-${B}${c?` dagwick-season dagwick-season-${c.id}`:""}`,children:[a.jsx(ua,{season:c}),a.jsx(ga,{grade:B,season:c?.id}),a.jsxs("div",{className:"dagwick-hero-text",children:[a.jsx(va,{state:r}),ka("Fleet health"),a.jsx("h2",{className:"dagwick-dag",children:M??"All DAGs"}),a.jsxs("p",{className:"dagwick-headline",children:[M?`${M} ${Ye[B]}`:Ie[B]," ",Z===0?"Every DAG is healthy.":`${Z} of ${m.length} ${m.length===1?"DAG needs":"DAGs need"} care.`]}),a.jsxs("div",{className:"dagwick-stats",children:[a.jsx(T,{value:m.length,label:"DAGs"}),a.jsx(T,{value:(Math.floor(L*10)/10).toFixed(1),label:"average score"}),a.jsx(T,{value:Z,label:"need care (C–F)",tone:Z?"fail":void 0}),a.jsx(T,{value:oa,label:"healthy (A–B)",tone:oa?"pass":void 0}),Ta>0&&a.jsx(T,{value:Ta,label:"acknowledged"})]})]}),a.jsxs("div",{className:"dagwick-hero-side",children:[a.jsx(la,{score:L,grade:B}),a.jsx("span",{className:"dagwick-muted dagwick-ring-caption",children:M?"average":"fleet average"})]})]}),a.jsx("section",{className:"dagwick-grades","aria-label":"Filter by grade",children:_a.map(t=>{const p=ca[t],v=g===t;return a.jsxs("button",{className:`dagwick-gcard dagwick-gcard--${t}${v?" is-active":""}${g&&!v?" is-dim":""}`,disabled:p===0,onClick:()=>n(v?void 0:t),"aria-pressed":v,children:[a.jsx(pa,{grade:t,size:"lg"}),a.jsxs("div",{className:"dagwick-gcard-text",children:[a.jsx("span",{className:"dagwick-gcard-n",children:p}),a.jsx("span",{className:"dagwick-muted",children:He[t]})]}),a.jsx("div",{className:"dagwick-gcard-bar",children:a.jsx("div",{style:{width:`${p/m.length*100}%`}})})]},t)})}),a.jsxs("div",{className:"dagwick-fleet-grid",children:[a.jsxs("section",{className:"dagwick-list",children:[a.jsxs("div",{className:"dagwick-toolbar",children:[a.jsxs("div",{className:"dagwick-search-wrap",children:[a.jsxs("svg",{viewBox:"0 0 24 24",width:"16",height:"16","aria-hidden":"true",children:[a.jsx("circle",{cx:"11",cy:"11",r:"7",fill:"none",stroke:"currentColor",strokeWidth:"2"}),a.jsx("path",{d:"M20 20l-4-4",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round"})]}),a.jsx("input",{className:"dagwick-search",type:"search",placeholder:M?`Search ${M}'s DAGs`:"Search DAGs or owners",value:o,onChange:t=>d(t.target.value),"aria-label":"Search DAGs"})]}),a.jsx("div",{className:"dagwick-seg",role:"radiogroup","aria-label":"Sort",children:We.map(t=>a.jsx("button",{role:"radio","aria-checked":y===t.id,className:y===t.id?"is-active":"",onClick:()=>h(t.id),children:t.label},t.id))})]}),Ve&&a.jsxs("div",{className:"dagwick-filters",children:[a.jsxs("span",{className:"dagwick-muted",children:[ta.length," of ",m.length," DAGs"]}),g&&a.jsxs(ea,{onClear:()=>n(void 0),children:["Grade ",g]}),s&&a.jsx(ea,{onClear:()=>b(void 0),children:s.title}),o.trim()&&a.jsxs(ea,{onClear:()=>d(""),children:["“",o.trim(),"”"]})]}),ta.length===0?a.jsx("div",{className:"dagwick-clear",children:"No DAG matches."}):a.jsx("ul",{className:"dagwick-rows",children:ta.map(t=>a.jsx("li",{children:a.jsxs(Ka,{dagId:t.dag_id,className:`dagwick-row dagwick-row--${t.grade}`,children:[a.jsx(Va,{score:t.score,grade:t.grade}),a.jsxs("div",{className:"dagwick-row-main",children:[a.jsxs("div",{className:"dagwick-row-title",children:[a.jsx("span",{className:"dagwick-row-name",children:t.dag_id}),t.is_paused&&a.jsx("span",{className:"dagwick-tag",children:"paused"})]}),a.jsxs("div",{className:"dagwick-row-sub dagwick-muted",children:[t.owners&&a.jsx("span",{children:t.owners}),a.jsx("span",{children:t.counts.fail+t.counts.warn===0?"All checks passing":`${t.counts.fail} failing · ${t.counts.warn} to improve`}),t.counts.ack>0&&a.jsxs("span",{children:[t.counts.ack," acknowledged"]}),t.health&&t.health.runs>0&&t.health.success_rate!==null&&a.jsxs("span",{className:t.health.success_rate<90?"dagwick-health-low":void 0,children:[t.health.success_rate,"% of ",t.health.runs," runs succeeded"]})]}),t.issues.length>0&&a.jsxs("div",{className:"dagwick-row-issues",children:[t.issues.slice(0,aa).map(p=>a.jsx("span",{className:`dagwick-ichip dagwick-ichip--${p.status}`,children:p.title},p.id)),t.issues.length>aa&&a.jsxs("span",{className:"dagwick-ichip dagwick-ichip--more",children:["+",t.issues.length-aa]})]})]}),a.jsx(pa,{grade:t.grade}),a.jsx("span",{className:"dagwick-row-go","aria-hidden":"true",children:"›"})]})},t.dag_id))})]}),a.jsx("aside",{className:"dagwick-side",children:a.jsxs("div",{className:"dagwick-side-card",children:[a.jsxs("h3",{className:"dagwick-side-title",children:["Most common issues",M?` · ${M}`:""]}),Ea.length===0?a.jsx("p",{className:"dagwick-muted dagwick-side-empty",children:"No issues anywhere. ✨"}):a.jsx("ul",{className:"dagwick-common",children:Ea.map(t=>{const p=s?.id===t.id;return a.jsx("li",{children:a.jsxs("button",{className:`dagwick-common-item${p?" is-active":""}`,onClick:()=>b(p?void 0:{id:t.id,title:t.title}),"aria-pressed":p,children:[a.jsxs("div",{className:"dagwick-common-head",children:[a.jsx("span",{children:t.title}),a.jsxs("span",{className:"dagwick-muted",children:[t.dags,"/",m.length]})]}),a.jsx("div",{className:"dagwick-bar",children:a.jsx("div",{className:"dagwick-bar-fill",style:{width:`${t.dags/m.length*100}%`,background:t.fails>=t.dags/2?"var(--dagwick-fail)":"var(--dagwick-warn)"}})})]})},t.id)})}),a.jsx("p",{className:"dagwick-side-hint dagwick-muted",children:"Click an issue to see which DAGs have it."})]})})]}),a.jsxs("footer",{className:"dagwick-foot dagwick-muted",children:[i?`Showing the first ${e.length} DAGs. `:"","Scored automatically from the latest parsed version of each DAG. · ",O," ",sa]})]})}function T({value:e,label:i,tone:r}){return a.jsxs("div",{className:`dagwick-stat${r?` dagwick-stat--${r}`:""}`,children:[a.jsx("span",{className:"dagwick-stat-value",children:e}),a.jsx("span",{className:"dagwick-stat-label",children:i})]})}function ea({children:e,onClear:i}){return a.jsxs("button",{className:"dagwick-fchip",onClick:i,"aria-label":"Remove filter",children:[e," ",a.jsx("span",{"aria-hidden":"true",children:"✕"})]})}const Xe=`
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
.dagwick-cats { display: flex; flex-wrap: wrap; gap: 12px; margin: 16px 0; }
.dagwick-cat { flex: 1 1 160px; padding: 12px 14px; border: 1px solid var(--dagwick-border); border-radius: 12px; background: var(--dagwick-bg); }
.dagwick-cat-head { display: flex; justify-content: space-between; font-size: 13px; font-weight: 600; margin-bottom: 8px; }
.dagwick-bar { height: 6px; border-radius: 99px; background: var(--dagwick-border); overflow: hidden; }
.dagwick-bar-fill { height: 100%; border-radius: 99px; transition: width .9s cubic-bezier(.2,.8,.2,1); }

.dagwick-list { border: 1px solid var(--dagwick-border); border-radius: 16px; background: var(--dagwick-bg); overflow: hidden; }
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

.dagwick-scope { display: flex; flex-wrap: wrap; align-items: end; gap: 10px 16px; margin: 0 0 14px; }
.dagwick-scope-field { display: grid; gap: 4px; width: min(100%, 300px); }
.dagwick-scope-label { font-size: 11px; font-weight: 700; letter-spacing: .06em; text-transform: uppercase; color: var(--dagwick-muted); }
.dagwick-combo { position: relative; color: var(--dagwick-muted); }
.dagwick-combo > svg { position: absolute; left: 11px; top: 50%; transform: translateY(-50%); pointer-events: none; }
.dagwick-listbox {
  position: absolute; z-index: 20; top: calc(100% + 6px); left: 0; right: 0; max-height: 320px; overflow-y: auto;
  margin: 0; padding: 6px; list-style: none; color: var(--dagwick-text); background: var(--dagwick-bg);
  border: 1px solid var(--dagwick-border); border-radius: 12px; box-shadow: 0 10px 30px var(--dagwick-shadow);
}
.dagwick-opt { display: flex; justify-content: space-between; gap: 10px; padding: 7px 8px; border-radius: 8px; cursor: pointer; font-size: 13.5px; }
.dagwick-opt.is-active { background: var(--dagwick-surface); }
.dagwick-opt-name { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.dagwick-opt .dagwick-muted { white-space: nowrap; font-variant-numeric: tabular-nums; }
.dagwick-opt mark { background: transparent; color: var(--dagwick-accent); font-weight: 700; }
.dagwick-listbox-note { padding: 6px 8px; font-size: 12px; color: var(--dagwick-muted); }
.dagwick-combo.has-value .dagwick-search { padding-right: 34px; }
.dagwick-combo-clear {
  position: absolute; right: 6px; top: 50%; transform: translateY(-50%); width: 24px; height: 24px; display: grid; place-items: center;
  font: inherit; font-size: 12px; line-height: 1; border: 0; border-radius: 6px; cursor: pointer; color: var(--dagwick-muted); background: transparent;
}
.dagwick-combo-clear:hover { color: var(--dagwick-text); background: var(--dagwick-surface); }
.dagwick-combo-clear:focus-visible { outline: 2px solid var(--dagwick-accent); outline-offset: 1px; }
.dagwick-scope-now { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; min-height: 34px; font-size: 13px; }
.dagwick-btn--quiet { font-size: 12.5px; padding: 4px 12px; }
.dagwick-fleet-grid { display: grid; grid-template-columns: minmax(0, 1fr) 300px; gap: 16px; align-items: start; }
.dagwick-toolbar { display: flex; gap: 10px; align-items: center; padding: 10px; border-bottom: 1px solid var(--dagwick-border); background: var(--dagwick-surface); flex-wrap: wrap; }
.dagwick-search-wrap { position: relative; flex: 1; min-width: 200px; color: var(--dagwick-muted); }
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
`;function Qe({dagId:e}){return a.jsxs("div",{className:"dagwick",children:[a.jsx("style",{children:Xe}),e?a.jsx($e,{dagId:e},e):a.jsx(Ze,{})]})}function ia(e){return a.jsx(Qe,{...e})}const Fa=globalThis;return Fa[O]=ia,Fa.AirflowPlugin=ia,ia})(ReactJSXRuntime,React);
