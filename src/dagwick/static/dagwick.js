var DagwickBundle=(function(a,p){"use strict";const S="Dagwick",j="0.2.0",Sa="/dagwick/api",Aa="dagwick";async function T(e,r,i){const c=new URL(`${Sa}${e}`,document.baseURI);for(const[d,t]of Object.entries(r))c.searchParams.set(d,t);const o=await fetch(c,{signal:i,credentials:"same-origin"});if(!o.ok){let d=`HTTP ${o.status}`;try{const t=await o.json();typeof t?.detail=="string"&&(d=t.detail)}catch{}throw new Error(d)}return o.json()}const Da=(e,r)=>T("/score",{dag_id:e},r),Fa=e=>T("/fleet",{},e),Wa=e=>T("/config",{},e);function R(e,r){const[i,c]=p.useState(),[o,d]=p.useState(),[t,n]=p.useState(!0),[f,y]=p.useState(0);p.useEffect(()=>{const b=new AbortController;return n(!0),d(void 0),e(b.signal).then(c).catch(C=>{b.signal.aborted||d(C instanceof Error?C.message:String(C))}).finally(()=>!b.signal.aborted&&n(!1)),()=>b.abort()},[...r,f]);const h=p.useCallback(()=>y(b=>b+1),[]);return{data:i,error:o,loading:t,reload:h}}const Ea={newroz:{dy:5,scale:1.1,out:17},ramadan:{dy:9.4,scale:.8}},Za={radiant:4,happy:3,calm:2,worried:1,out:0},aa=["#f472b6","#60a5fa","#fde047","#4ade80","#c084fc","#fb923c"],M=(e,r)=>a.jsx("path",{d:`M80 ${r} V${e}`,stroke:"var(--dagwick-wick)",strokeWidth:"2.6",strokeLinecap:"round"});function Y({paint:e,rx:r=41,cy:i=141}){return a.jsxs(a.Fragment,{children:[a.jsx("ellipse",{cx:"80",cy:i+3.6,rx:r,ry:"7",fill:"var(--dagwick-metal-dark)"}),a.jsx("ellipse",{cx:"80",cy:i,rx:r,ry:"7",fill:e("metal")}),a.jsx("ellipse",{cx:"80",cy:i+.4,rx:r-9,ry:"4.6",fill:"var(--dagwick-metal-dark)",opacity:"0.4"})]})}function A({body:e,top:r,pool:i,edge:c="none",w:o=17.5,y:d=114,bottom:t=140}){return a.jsxs(a.Fragment,{children:[a.jsx("path",{d:`M${80-o} ${d} V${t} A${o} 4.6 0 0 0 ${80+o} ${t} V${d} Z`,fill:e,stroke:c,strokeWidth:"1"}),a.jsx("ellipse",{cx:"80",cy:d,rx:o,ry:"4.6",fill:r,stroke:c,strokeWidth:"1"}),a.jsx("ellipse",{cx:"80",cy:d+.5,rx:o*.6,ry:"2.6",fill:i})]})}const B=(e,r)=>a.jsx("path",{d:"M90.5 115 V144 Q95.5 143 97.5 140 V114 Q94.5 115 90.5 115Z",fill:e,opacity:r});function ea(e,r,i,c=.3){const o=i*c,d=i-o;return`M${e} ${r-i} l${o} ${d} ${d} ${o} ${-d} ${o} ${-o} ${d} ${-o} ${-d} ${-d} ${-o} ${d} ${-o}z`}function O({x:e,y:r,r:i,fill:c}){return a.jsx("path",{d:ea(e,r,i),fill:c})}function Ta({mood:e,paint:r}){const i=Za[e],c=[[70.5,130.5],[80,125.5],[80,135.5],[89.5,130.5]];return a.jsxs("g",{children:[a.jsx("ellipse",{cx:"124.5",cy:"143.4",rx:"10.5",ry:"4.6",fill:"none",stroke:"var(--dagwick-metal-dark)",strokeWidth:"4"}),a.jsx("path",{d:"M118 140.4 a10.5 4.6 0 0 1 13.6 0.4",fill:"none",stroke:"var(--dagwick-metal)",strokeWidth:"1.5",strokeLinecap:"round"}),a.jsx(Y,{paint:r}),a.jsx(A,{body:r("wax"),top:"var(--dagwick-wax-top)",pool:"var(--dagwick-wax-pool)",edge:"var(--dagwick-wax-edge)"}),a.jsxs("g",{fill:"var(--dagwick-wax-top)",stroke:"var(--dagwick-wax-edge)",strokeWidth:"1",strokeLinejoin:"round",children:[a.jsx("path",{d:"M65.8 116.9 Q69 118.2 72.8 118.5 V124.4 A3.5 3.5 0 0 1 65.8 124.4Z"}),a.jsx("path",{d:"M88 118.4 Q91 118 93.8 117.2 V121 A2.9 2.9 0 0 1 88 121Z"})]}),a.jsx("path",{d:"M70.5 130.5 L80 125.5 L89.5 130.5 L80 135.5Z",fill:"none",stroke:"var(--dagwick-wax-shade)",strokeWidth:"1.3",strokeLinejoin:"round"}),c.map(([o,d],t)=>a.jsx("circle",{cx:o,cy:d,r:"2.7",fill:t<i?"var(--dagwick-flame)":"var(--dagwick-wax-shade)"},t)),M(105,114)]})}function Ya({uid:e}){const r="M63 114 V140 A17 4.6 0 0 0 97 140 V114 Z";return a.jsxs("g",{children:[a.jsx("ellipse",{cx:"80",cy:"142",rx:"42",ry:"8.5",fill:"#14532d"}),a.jsx("clipPath",{id:`${e}-stripe`,children:a.jsx("path",{d:r})}),a.jsx("path",{d:r,fill:"#dc2626"}),a.jsx("g",{clipPath:`url(#${e}-stripe)`,stroke:"#fff",strokeWidth:"5.4",children:a.jsx("path",{d:"M56 127 L104 109 M56 141 L104 123 M56 155 L104 137"})}),B("#7f1d1d",.25),a.jsx("path",{d:"M61.5 114 A18.5 5 0 0 1 98.5 114 C99 118 96 119.6 93.4 118.2 C93 121.4 88.6 122 86.8 119.2 C85 122.6 79.4 123 77.6 119.6 C75.4 122.6 70.4 122 69.4 118.8 C66.6 120.6 61.8 119 61.5 114Z",fill:"#fff"}),a.jsx("ellipse",{cx:"80",cy:"113.6",rx:"18.5",ry:"4.8",fill:"#fff"}),a.jsx("ellipse",{cx:"80",cy:"114",rx:"10",ry:"2.4",fill:"#dbe7f5"}),M(105,114)]})}function Ba({paint:e}){return a.jsxs("g",{children:[a.jsx(Y,{paint:e,rx:36}),a.jsx(A,{body:"#3730a3",top:"#6366f1",pool:"#4338ca",w:17}),B("#1e1b4b",.35),a.jsx("path",{d:"M65.5 118 V138",stroke:"#a5b4fc",strokeOpacity:"0.5",strokeWidth:"2.4",strokeLinecap:"round"}),a.jsx(O,{x:74,y:126.5,r:4.2,fill:"#fde047"}),a.jsx(O,{x:86.5,y:133.5,r:3.2,fill:"#fde047"}),a.jsx(O,{x:87,y:121.5,r:2.2,fill:"#fef9c3"}),a.jsx("circle",{cx:"72",cy:"136",r:"1.2",fill:"#fef9c3"}),a.jsx("path",{d:"M43 136 q-6 -7 0 -12 q6 -5 0 -11",fill:"none",stroke:"#f472b6",strokeWidth:"2.4",strokeLinecap:"round"}),a.jsx("path",{d:"M118 135 q6 -6 1 -11 q-5 -5 2 -10",fill:"none",stroke:"#60a5fa",strokeWidth:"2.4",strokeLinecap:"round"}),M(105,114)]})}function Oa({uid:e}){const r=[[61.5,132.5,30],[69.5,128,-40],[90.5,127.6,25],[98.5,132,-30],[80,133.6,80],[89.5,134.6,-10],[71,135,10]];return a.jsxs("g",{children:[a.jsx("path",{d:"M55.5 137 L104.5 137 L99.5 151 Q80 154.4 60.5 151Z",fill:"#38bdf8"}),a.jsx("path",{d:"M62.6 138 l3 14 M71.2 138 l1.7 15.4 M80 138 v15.8 M88.8 138 l-1.7 15.4 M97.4 138 l-3 14",stroke:"#0284c7",strokeWidth:"1.8",strokeLinecap:"round"}),a.jsx("path",{d:"M52.5 136 C50.5 130 58 126.5 64 127.2 C66 122.5 76 121.5 80 121.5 C84 121.5 94 122.5 96 127.2 C102 126.5 109.5 130 107.5 136 C106.2 140 100 139.6 96.5 137 C92.5 140.2 86 140.2 82.4 137.2 C78 140.6 71 140.2 67.6 137 C63 140 53.8 140.2 52.5 136Z",fill:"#f9a8d4"}),a.jsx("path",{d:"M61 129.4 C66 125 75 123.8 81 124",fill:"none",stroke:"#fdf2f8",strokeOpacity:"0.9",strokeWidth:"2.4",strokeLinecap:"round"}),r.map(([i,c,o],d)=>a.jsx("rect",{x:i-2.2,y:c-.9,width:"4.4",height:"1.8",rx:"0.9",fill:aa[d%aa.length],transform:`rotate(${o} ${i} ${c})`},d)),a.jsx("clipPath",{id:`${e}-bday`,children:a.jsx("path",{d:"M76.2 114.4 Q80 112.6 83.8 114.4 V124.6 Q80 126 76.2 124.6Z"})}),a.jsx("path",{d:"M76.2 114.4 Q80 112.6 83.8 114.4 V124.6 Q80 126 76.2 124.6Z",fill:"#fff"}),a.jsx("g",{clipPath:`url(#${e}-bday)`,stroke:"#3b82f6",strokeWidth:"2.3",children:a.jsx("path",{d:"M74 118.5 l12 -5 M74 123.5 l12 -5 M74 128.5 l12 -5"})}),M(105,114)]})}function _a({mood:e}){const r=e!=="out";return a.jsxs("g",{children:[r&&a.jsx("ellipse",{cx:"80",cy:"146",rx:"34",ry:"6",fill:"var(--dagwick-flame)",opacity:"0.28"}),a.jsx("path",{d:"M53 148 L104 126",stroke:"#6b3f1d",strokeWidth:"11.5",strokeLinecap:"round"}),a.jsx("path",{d:"M57 143.8 L100 125.4",stroke:"#8a5a2b",strokeWidth:"3",strokeLinecap:"round",opacity:"0.8"}),a.jsx("path",{d:"M107 148 L56 126",stroke:"#7c4a21",strokeWidth:"11.5",strokeLinecap:"round"}),a.jsx("path",{d:"M103 143.8 L60 125.4",stroke:"#a06a36",strokeWidth:"3",strokeLinecap:"round",opacity:"0.8"}),[[53,148],[107,148]].map(([i,c],o)=>a.jsxs("g",{children:[a.jsx("circle",{cx:i,cy:c,r:"5.2",fill:"#e2b77f"}),a.jsx("circle",{cx:i,cy:c,r:"2.8",fill:"none",stroke:"#b07d45",strokeWidth:"1.1"}),a.jsx("circle",{cx:i,cy:c,r:"0.9",fill:"#b07d45"})]},o)),a.jsxs("g",{fill:"var(--dagwick-flame-deep)",opacity:r?1:.55,children:[a.jsx("circle",{cx:"71.5",cy:"142",r:"1.6"}),a.jsx("circle",{cx:"88.5",cy:"143.5",r:"1.3"}),a.jsx("circle",{cx:"80",cy:"146.5",r:"1.8"})]})]})}function Ga({mood:e}){const i=e!=="out"?"var(--dagwick-flame-core)":"#431407";return a.jsxs("g",{children:[a.jsx("path",{d:"M52 121 C44 121 40 114 44.5 110 C48 107 52 111 49 114",fill:"none",stroke:"#16a34a",strokeWidth:"2",strokeLinecap:"round"}),a.jsx("path",{d:"M54 119.5 C56 113 63 112 66 114.5 C62 119 58 121 54 119.5Z",fill:"#22c55e"}),a.jsx("ellipse",{cx:"59.5",cy:"133",rx:"19.5",ry:"17.6",fill:"#ea580c"}),a.jsx("ellipse",{cx:"100.5",cy:"133",rx:"19.5",ry:"17.6",fill:"#ea580c"}),a.jsx("ellipse",{cx:"69",cy:"133",rx:"16",ry:"18.8",fill:"#f97316"}),a.jsx("ellipse",{cx:"91",cy:"133",rx:"16",ry:"18.8",fill:"#f97316"}),a.jsx("ellipse",{cx:"80",cy:"133",rx:"13.5",ry:"19.4",fill:"#fb923c"}),a.jsx("ellipse",{cx:"80",cy:"114.8",rx:"15",ry:"4.4",fill:"#431407"}),a.jsxs("g",{fill:i,children:[a.jsx("path",{d:"M60 131 L66.6 122.6 L71.4 132Z"}),a.jsx("path",{d:"M100 131 L93.4 122.6 L88.6 132Z"}),a.jsx("path",{d:"M62 137 l4.6 2.4 4.2 -2.8 4.6 3.4 4.6 -3.6 4.6 3.6 4.6 -3.4 4.2 2.8 4.6 -2.4 q-6.6 9.6 -18 9.6 q-11.4 0 -18 -9.6z"})]})]})}function qa({mood:e}){const r=e!=="out";return a.jsxs("g",{children:[a.jsx("path",{d:"M44.5 44 H115.5 V122 H44.5Z",fill:"#5eead4",opacity:r?.16:.07}),a.jsx("path",{d:"M71.5 122 h17 l-2.6 -4.8 h-11.8z",fill:"#a16207"}),M(113,117.4)]})}function Ia({paint:e}){return a.jsxs("g",{children:[a.jsx(Y,{paint:e,rx:30}),a.jsx(A,{body:"#047857",top:"#34d399",pool:"#10b981",w:17}),B("#022c22",.3),a.jsx("path",{d:"M65.5 118 V138",stroke:"#a7f3d0",strokeOpacity:"0.5",strokeWidth:"2.4",strokeLinecap:"round"}),a.jsx("path",{d:"M63 124.5 A17 4.6 0 0 0 97 124.5 V131.5 A17 4.6 0 0 1 63 131.5Z",fill:"#fbbf24"}),a.jsx("path",{d:"M70 131.4 l3 -3 3 3.4 -3 3z M80 132.6 l3 -3 3 3 -3 3.2z M89.4 131.2 l2.6 -2.8 2.6 2.4 -2.6 3z",fill:"#b45309"}),M(105,114)]})}function Ha({paint:e}){return a.jsxs("g",{children:[a.jsx("rect",{x:"43",y:"137",width:"74",height:"14.5",rx:"3",fill:"#9f1239"}),a.jsx("path",{d:"M52 137 v14.5 M108 137 v14.5",stroke:"#fbbf24",strokeWidth:"1.6"}),a.jsx("text",{x:"80",y:"148.6",textAnchor:"middle",fontSize:"11",fontWeight:"700",fill:"#fde68a",children:"ک"}),a.jsx("rect",{x:"49",y:"125",width:"64",height:"12",rx:"2.4",fill:"#1d4ed8"}),a.jsx("rect",{x:"52",y:"127.4",width:"61",height:"7.2",rx:"1",fill:"#fef3c7"}),a.jsx("path",{d:"M52 129.8 h61 M52 132.2 h61",stroke:"#e7d7a8",strokeWidth:"0.8"}),a.jsx(A,{body:e("wax"),top:"var(--dagwick-wax-top)",pool:"var(--dagwick-wax-pool)",edge:"var(--dagwick-wax-edge)",w:13,y:114.5,bottom:123.6}),M(105,114.5)]})}const Va={christmas:Ya,"new-year":Ba,birthday:Oa,newroz:_a,halloween:Ga,ramadan:qa,eid:Ia,"language-day":Ha};function Pa(e){const r=e.season?Va[e.season]:Ta;return a.jsx("g",{className:"dagwick-vessel",children:r(e)})}const ra=Array.from({length:11},(e,r)=>{const i=(8+r*16.4)*Math.PI/180;return[80-Math.cos(i)*41,143+Math.sin(i)*8.4]});function Qa({season:e,mood:r,paint:i}){const c=r!=="out";switch(e){case"christmas":return a.jsxs("g",{className:"dagwick-vessel",children:[ra.map(([o,d],t)=>a.jsx("circle",{cx:o.toFixed(1),cy:d.toFixed(1),r:"6.4",fill:t%2?"#15803d":"#166534"},t)),ra.map(([o,d],t)=>a.jsx("path",{d:`M${(o-3).toFixed(1)} ${(d-1.6).toFixed(1)} q3 -3.4 6 0`,fill:"none",stroke:"#4ade80",strokeOpacity:"0.55",strokeWidth:"1.3",strokeLinecap:"round"},t)),a.jsxs("g",{fill:"#ef4444",children:[a.jsx("circle",{cx:"54",cy:"149",r:"2.6"}),a.jsx("circle",{cx:"59.4",cy:"151.6",r:"2.2"}),a.jsx("circle",{cx:"104",cy:"149.6",r:"2.6"}),a.jsx("circle",{cx:"109.4",cy:"146.8",r:"2.2"})]}),a.jsx("path",{d:"M80 151 C74 144.6 66.5 145.4 67 151 C66.5 156.6 74 157.4 80 151Z M80 151 C86 144.6 93.5 145.4 93 151 C93.5 156.6 86 157.4 80 151Z",fill:"#ef4444"}),a.jsx("circle",{cx:"80",cy:"151",r:"2.9",fill:"#b91c1c"})]});case"newroz":return a.jsx("g",{className:"dagwick-vessel",children:c&&a.jsxs("g",{className:"dagwick-licks",fill:i("flame"),children:[a.jsx("path",{d:"M58 131 C52 123 55 114 60 108 C60 115 66 118 66 125 C66 131 61 134 58 131Z"}),a.jsx("path",{d:"M102 131 C108 124 106 116 101 111 C101 117 95 119 95 125 C95 131 99 134 102 131Z"})]})});case"halloween":return a.jsxs("g",{className:"dagwick-vessel",children:[a.jsx("path",{d:"M65 114.8 A15 4.4 0 0 0 95 114.8 L95 118.6 Q80 123 65 118.6Z",fill:"#fb923c"}),a.jsx("path",{d:"M65 114.8 A15 4.4 0 0 0 95 114.8",fill:"none",stroke:"#c2410c",strokeWidth:"1.2"}),a.jsxs("g",{className:"dagwick-spider",children:[a.jsx("path",{d:"M106.4 121.6 l-4.4 -3.4 M106 124.4 l-5.2 -0.6 M106.6 127 l-4.2 2.6 M113.6 121.6 l4.4 -3.4 M114 124.4 l5.2 -0.6 M113.4 127 l4.2 2.6",stroke:"#1a1024",strokeWidth:"1.2",strokeLinecap:"round"}),a.jsx("ellipse",{cx:"110",cy:"124.4",rx:"4.4",ry:"4",fill:"#1a1024"}),a.jsx("circle",{cx:"108.5",cy:"123.4",r:"0.9",fill:"#bef264"}),a.jsx("circle",{cx:"111.5",cy:"123.4",r:"0.9",fill:"#bef264"})]})]});case"ramadan":return a.jsxs("g",{className:"dagwick-vessel",children:[a.jsx("path",{d:"M44.5 43 V123 M115.5 43 V123",stroke:"#eab308",strokeWidth:"2.6"}),a.jsx("path",{d:"M44.5 57 Q44.5 46.6 56 46.6 M115.5 57 Q115.5 46.6 104 46.6",fill:"none",stroke:"#eab308",strokeWidth:"1.6"}),a.jsx("path",{d:"M46.5 39 C46.5 29.5 67 30 77 24.5 Q80 22.6 83 24.5 C93 30 113.5 29.5 113.5 39Z",fill:"#0f766e"}),a.jsx("path",{d:"M80 24 V39 M64.5 31 Q62.6 35 63 39 M95.5 31 Q97.4 35 97 39",fill:"none",stroke:"#fbbf24",strokeWidth:"1.3"}),a.jsx("rect",{x:"40.5",y:"38",width:"79",height:"6.4",rx:"2.4",fill:"#eab308"}),a.jsx("path",{d:"M80 24 V20.4",stroke:"#eab308",strokeWidth:"1.8"}),a.jsx("path",{d:"M82 11.4 a4.7 4.7 0 1 0 3.7 7.7 a3.7 3.7 0 1 1 -3.7 -7.7z",fill:"var(--dagwick-moon)"}),a.jsx("rect",{x:"40.5",y:"121.6",width:"79",height:"6.4",rx:"2.4",fill:"#eab308"}),a.jsx("path",{d:"M44 128 H116 L109.5 143 H50.5Z",fill:"#0f766e"}),a.jsx("path",{d:"M80 130.6 l4.4 4.9 -4.4 4.9 -4.4 -4.9z M62 132.4 l2.8 3.1 -2.8 3.1 -2.8 -3.1z M98 132.4 l2.8 3.1 -2.8 3.1 -2.8 -3.1z",fill:"#fbbf24"}),a.jsx("rect",{x:"47",y:"142.4",width:"66",height:"6",rx:"2.4",fill:"#ca8a04"})]});case"eid":return a.jsxs("g",{className:"dagwick-vessel",children:[a.jsx("ellipse",{cx:"129",cy:"148",rx:"19",ry:"4",fill:"#e5e7eb"}),a.jsx("ellipse",{cx:"129",cy:"147.4",rx:"14",ry:"2.4",fill:"#cbd5e1",opacity:"0.6"}),[[119,142],[131,140],[140,144]].map(([o,d],t)=>a.jsxs("g",{children:[a.jsx("circle",{cx:o,cy:d,r:"6.5",fill:"#c98b4a",stroke:"#8a5a2b",strokeWidth:"1"}),a.jsx("path",{d:`M${o-3.5} ${d} a3.5 3.5 0 1 1 7 0`,fill:"none",stroke:"#8a5a2b",strokeWidth:"1"}),a.jsx("circle",{cx:o,cy:d,r:"1.2",fill:"#8a5a2b"})]},t))]});case"language-day":return a.jsxs("g",{className:"dagwick-vessel",children:[a.jsx("path",{d:"M139 99 C128 106 122 120 123.5 135 C132 127 140 114 139 99Z",fill:"#f8fafc",stroke:"#cbd5e1",strokeWidth:"0.8"}),a.jsx("path",{d:"M138 102 L123 140",stroke:"#94a3b8",strokeWidth:"1.3",strokeLinecap:"round"}),a.jsx("path",{d:"M131 109 l-5.4 2.4 M133.6 115 l-7.6 3.6 M131 122.6 l-6 3",stroke:"#cbd5e1",strokeWidth:"0.9"}),a.jsx("path",{d:"M114.5 139.5 h16 l-1.8 11.5 h-12.4z",fill:"#1e293b"}),a.jsx("ellipse",{cx:"122.5",cy:"139.5",rx:"8",ry:"2.2",fill:"#334155"}),a.jsx("ellipse",{cx:"122.5",cy:"139.6",rx:"5.4",ry:"1.3",fill:"#1e3a8a"})]});default:return null}}function Ua({season:e}){return e==="eid"?a.jsxs("g",{fill:"var(--dagwick-moon)",children:[a.jsx("path",{d:"M131 6 a15 15 0 1 0 13 24 a12 12 0 1 1 -13 -24z"}),a.jsx("path",{d:"M150 42 l1.5 4 4.3 .2 -3.4 2.6 1.2 4.2 -3.6 -2.4 -3.6 2.4 1.2 -4.2 -3.4 -2.6 4.3 -.2z"})]}):null}const Xa={radiant:"translate(84 42) rotate(12)",happy:"translate(84 49) rotate(11)",calm:"translate(83.5 57.5) rotate(9)",worried:"translate(84 63.5) rotate(11) scale(.94)",out:"translate(80 58.5) rotate(-5) scale(.94)"},Ka={radiant:[69,91,77],happy:[69,91,78],calm:[69,91,79],worried:[69,91,80],out:[72.2,87.8,72.5]};function _({x:e,y:r,petal:i,centre:c,r:o=3}){return a.jsxs("g",{children:[[0,1,2,3,4].map(d=>{const t=(d*72-90)*(Math.PI/180);return a.jsx("circle",{cx:(e+Math.cos(t)*o*1.15).toFixed(2),cy:(r+Math.sin(t)*o*1.15).toFixed(2),r:o,fill:i},d)}),a.jsx("circle",{cx:e,cy:r,r:o*.75,fill:c})]})}function ia({cone:e,pom:r}){return a.jsxs(a.Fragment,{children:[a.jsx("path",{d:"M-14 1 L14 1 L2 -37Z",fill:e}),a.jsx("path",{d:"M-9.8 -9 L10.4 -9 M-5.6 -19 L7.2 -19 M-1.6 -28.4 L4.4 -28.4",stroke:"#fde047",strokeWidth:"3.2"}),a.jsx("ellipse",{cx:"0",cy:"1",rx:"14.5",ry:"2.8",fill:"#fde047"}),a.jsx("circle",{cx:"2",cy:"-38",r:"4.8",fill:r})]})}function D({season:e,mood:r,part:i}){if(i==="face"){if(e!=="language-day")return null;const[o,d,t]=Ka[r];return a.jsxs("g",{className:"dagwick-acc",fill:"#fff",fillOpacity:"0.2",stroke:"#92400e",strokeWidth:"1.8",children:[a.jsx("circle",{cx:o,cy:t,r:"8"}),a.jsx("circle",{cx:d,cy:t,r:"8"}),a.jsx("path",{d:`M${o+7.6} ${t-2} Q${(o+d)/2} ${t-5} ${d-7.6} ${t-2}`,fill:"none"})]})}const c=(()=>{switch(e){case"christmas":return a.jsxs(a.Fragment,{children:[a.jsx("path",{d:"M-15 -1 C-14 -22 0 -35 15 -31 C24 -28.5 30 -20 31.5 -9 C26 -18 18.5 -16 15 -1Z",fill:"#dc2626"}),a.jsx("path",{d:"M15 -1 C18.5 -16 26 -18 31.5 -9 C25 -13 20 -9 15 -1Z",fill:"#991b1b",opacity:"0.55"}),a.jsx("circle",{cx:"32",cy:"-6.6",r:"5.8",fill:"#fff"}),a.jsx("rect",{x:"-18.5",y:"-6.4",width:"37",height:"10.4",rx:"5.2",fill:"#fff"})]});case"new-year":return a.jsx(ia,{cone:"#7c3aed",pom:"#f472b6"});case"birthday":return a.jsx(ia,{cone:"#ec4899",pom:"#60a5fa"});case"halloween":return a.jsxs(a.Fragment,{children:[a.jsx("ellipse",{cx:"0",cy:"1.5",rx:"25.5",ry:"6.4",fill:"#2e1065"}),a.jsx("path",{d:"M-13.5 0 C-11 -16 -5 -28 7 -40 C6 -33 9 -30 15.5 -31 C10 -23 12 -12 13.5 0Z",fill:"#4c1d95"}),a.jsx("path",{d:"M-12.6 -4.4 C-12 -7 -11.4 -9 -10.6 -11.4 L11.8 -11.4 C12.2 -9 12.6 -7 13 -4.4Z",fill:"#f97316"}),a.jsx("rect",{x:"-4.4",y:"-12.2",width:"8.8",height:"8.6",rx:"1.3",fill:"none",stroke:"#fde047",strokeWidth:"1.9"})]});case"newroz":return a.jsxs(a.Fragment,{children:[a.jsx("path",{d:"M-18 2 Q0 -8 18 2",fill:"none",stroke:"#16a34a",strokeWidth:"2.4",strokeLinecap:"round"}),a.jsx("path",{d:"M-9 -3 q-2 -5 -6 -4 q1 4 6 4z M9 -3 q2 -5 6 -4 q-1 4 -6 4z",fill:"#22c55e"}),a.jsx(_,{x:-14,y:.5,petal:"#f9a8d4",centre:"#fde047"}),a.jsx(_,{x:14,y:.5,petal:"#c4b5fd",centre:"#fde047"}),a.jsx(_,{x:0,y:-4.6,petal:"#ffffff",centre:"#f59e0b",r:3.5})]});default:return null}})();return c?a.jsx("g",{className:"dagwick-acc",transform:Xa[r],children:c}):null}const Ja={A:"radiant",B:"happy",C:"calm",D:"worried",F:"out"};function ja(e){return Ja[e]}const Ra={radiant:"Wick is glowing",happy:"Wick is happy",calm:"Wick is burning low",worried:"Wick is flickering",out:"Wick has gone out"},ae=[[131,26,9],[27,38,6.8],[140,68,5.2],[21,82,4]],ee={eid:[0]},re=111,ca={radiant:{outer:"M80 106 C62 106 48 94 48 78 C48 60 64 50 72 36 C76 28 82 20 91 14 C90 24 92 34 99 44 C107 54 112 64 112 78 C112 94 98 106 80 106Z",core:"M80 101.5 C66 101.5 55 92 55 80 C55 69 64 63 71 54 C76 48 82 44 86 38 C86 46 91 51 96 58 C102 65 105 72 105 80 C105 92 94 101.5 80 101.5Z",shine:"M54.5 72 C55.5 64 61 58 66 52",faceY:0,glow:66},happy:{outer:"M80 106 C62 106 49 94 49 79 C49 64 63 56 71 45 C76 38 82 30 89 24 C88 32 91 40 98 48 C106 57 111 66 111 79 C111 94 98 106 80 106Z",core:"M80 101.5 C67 101.5 56 92 56 81 C56 71 65 65 72 58 C77 53 82 50 85 45 C85 51 90 55 95 61 C101 67 104 73 104 81 C104 92 93 101.5 80 101.5Z",shine:"M55.5 74 C56.5 67 61 62 66 57",faceY:0,glow:56},calm:{outer:"M80 106 C63 106 51 95 51 81 C51 68 63 61 71 53 C76 48 82 42 87 36 C86 43 90 49 97 56 C104 63 109 71 109 81 C109 95 97 106 80 106Z",core:"M80 101.5 C68 101.5 58 93 58 83 C58 74 66 69 73 64 C77 61 81 58 84 54 C84 59 88 62 93 66 C99 71 102 76 102 83 C102 93 92 101.5 80 101.5Z",shine:"M57.5 77 C58.5 71 62 67 66 63",faceY:2,glow:46},worried:{outer:"M80 106 C64 106 54 96 54 84 C54 72 63 67 71 61 C76 57 84 54 92 47 C90 54 93 59 98 64 C103 70 106 77 106 84 C106 96 96 106 80 106Z",core:"M80 101.5 C69 101.5 60 94 60 85 C60 77 67 73 73.5 69.5 C78 67 83 65 87 61 C86.5 65 89.5 68 93.5 71.5 C98.5 76 101 80 101 85 C101 94 92 101.5 80 101.5Z",shine:"M60 80 C61 75 64.5 72 68.5 69",faceY:5,glow:36}};function G({mood:e,size:r=150,season:i}){const c=`dagwick-${p.useId().replace(/[^a-zA-Z0-9]/g,"")}`,o=y=>`url(#${c}-${y})`,d=e!=="out",t=i&&Ea[i]||{dy:0,scale:1},n=re+t.dy+(d?0:t.out??0),f=`translate(80 ${n}) scale(${t.scale}) translate(-80 -106)`;return a.jsxs("svg",{className:`dagwick-wick dagwick-wick--${e}`,width:r,height:r,viewBox:"0 0 160 160",role:"img","aria-label":Ra[e],children:[a.jsxs("defs",{children:[a.jsxs("radialGradient",{id:`${c}-glow`,cx:"50%",cy:"50%",r:"50%",children:[a.jsx("stop",{offset:"0%",stopColor:"var(--dagwick-flame-core)",stopOpacity:"0.55"}),a.jsx("stop",{offset:"50%",stopColor:"var(--dagwick-flame)",stopOpacity:"0.2"}),a.jsx("stop",{offset:"100%",stopColor:"var(--dagwick-flame)",stopOpacity:"0"})]}),a.jsxs("linearGradient",{id:`${c}-flame`,x1:"0",y1:"1",x2:"0",y2:"0",children:[a.jsx("stop",{offset:"0%",stopColor:"var(--dagwick-flame-deep)"}),a.jsx("stop",{offset:"62%",stopColor:"var(--dagwick-flame)"}),a.jsx("stop",{offset:"100%",stopColor:"var(--dagwick-flame-tip)"})]}),a.jsxs("linearGradient",{id:`${c}-core`,x1:"0",y1:"1",x2:"0",y2:"0",children:[a.jsx("stop",{offset:"0%",stopColor:"var(--dagwick-flame-core)"}),a.jsx("stop",{offset:"100%",stopColor:"var(--dagwick-flame-heart)"})]}),a.jsxs("linearGradient",{id:`${c}-cool`,x1:"0",y1:"1",x2:"0",y2:"0",children:[a.jsx("stop",{offset:"0%",stopColor:"var(--dagwick-flame-cool)",stopOpacity:"0.85"}),a.jsx("stop",{offset:"38%",stopColor:"var(--dagwick-flame-cool)",stopOpacity:"0"})]}),a.jsxs("linearGradient",{id:`${c}-smoke`,x1:"0",y1:"0",x2:"0",y2:"1",children:[a.jsx("stop",{offset:"0%",stopColor:"var(--dagwick-smoke-hi)"}),a.jsx("stop",{offset:"100%",stopColor:"var(--dagwick-smoke-lo)"})]}),a.jsxs("linearGradient",{id:`${c}-metal`,x1:"0",y1:"0",x2:"1",y2:"0",children:[a.jsx("stop",{offset:"0%",stopColor:"var(--dagwick-metal-dark)"}),a.jsx("stop",{offset:"42%",stopColor:"var(--dagwick-metal)"}),a.jsx("stop",{offset:"100%",stopColor:"var(--dagwick-metal-dark)"})]}),a.jsxs("linearGradient",{id:`${c}-wax`,x1:"0",y1:"0",x2:"1",y2:"0",children:[a.jsx("stop",{offset:"0%",stopColor:"var(--dagwick-wax-top)"}),a.jsx("stop",{offset:"55%",stopColor:"var(--dagwick-wax)"}),a.jsx("stop",{offset:"100%",stopColor:"var(--dagwick-wax-shade)"})]})]}),a.jsx("ellipse",{cx:"80",cy:"152.5",rx:"43",ry:"4.5",fill:"var(--dagwick-shadow)"}),a.jsx(Ua,{season:i,mood:e,paint:o,uid:c}),d&&a.jsx("circle",{className:"dagwick-glow",cx:"80",cy:n-30*t.scale,r:ca[e].glow*t.scale,fill:o("glow")}),e==="radiant"&&a.jsx("g",{className:"dagwick-sparkles",fill:"var(--dagwick-spark)",children:ae.filter((y,h)=>!(i&&ee[i]?.includes(h))).map(([y,h,b])=>a.jsx("path",{d:ea(y,h,b,.24)},y))}),a.jsx(Pa,{season:i,mood:e,paint:o,uid:c}),a.jsx("g",{transform:f,children:a.jsx("g",{className:"dagwick-spirit",children:a.jsx("g",{className:"dagwick-hop",children:d?a.jsx(ie,{mood:e,season:i,paint:o}):a.jsx(ce,{season:i,paint:o})})})}),a.jsx(Qa,{season:i,mood:e,paint:o,uid:c})]})}function ie({mood:e,season:r,paint:i}){const c=ca[e];return a.jsxs("g",{className:"dagwick-flame",children:[e==="radiant"&&a.jsxs("g",{fill:i("flame"),children:[a.jsx("path",{className:"dagwick-arm",d:"M50 84 C42 78 36.5 66 39.5 53 C42.5 59.5 49 62.5 57 64Z"}),a.jsx("path",{className:"dagwick-arm",d:"M110 84 C118 78 123.5 66 120.5 53 C117.5 59.5 111 62.5 103 64Z"})]}),a.jsx("path",{d:c.outer,fill:i("flame")}),e==="worried"&&a.jsx("path",{d:c.outer,fill:i("cool")}),a.jsx("path",{className:"dagwick-core",d:c.core,fill:i("core")}),a.jsx("path",{d:c.shine,fill:"none",stroke:"#fff",strokeOpacity:"0.55",strokeWidth:"3.4",strokeLinecap:"round"}),a.jsxs("g",{transform:`translate(0 ${c.faceY})`,children:[a.jsx(oa,{mood:e}),a.jsx(D,{season:r,mood:e,part:"face"})]}),a.jsx(D,{season:r,mood:e,part:"head"})]})}function ce({season:e,paint:r}){return a.jsxs("g",{children:[a.jsx("circle",{className:"dagwick-ember-halo",cx:"80",cy:"100.5",r:"6.5",fill:"var(--dagwick-flame-deep)",opacity:"0.3"}),a.jsx("circle",{className:"dagwick-ember",cx:"80",cy:"100.5",r:"2.4",fill:"var(--dagwick-flame-deep)"}),a.jsxs("g",{fill:"var(--dagwick-smoke-lo)",children:[a.jsx("circle",{className:"dagwick-puff",cx:"100",cy:"45",r:"4.6",opacity:"0.55"}),a.jsx("circle",{className:"dagwick-puff",cx:"107",cy:"32",r:"3.2",opacity:"0.4"}),a.jsx("circle",{className:"dagwick-puff",cx:"62",cy:"42",r:"3.6",opacity:"0.45"})]}),a.jsxs("g",{className:"dagwick-ghost",children:[a.jsxs("g",{fill:r("smoke"),opacity:"0.95",children:[a.jsx("path",{d:"M80 99.5 C75 95 84 91 79.5 86.5 C77 84 73 84 70.5 81 L89.5 81 C88.5 84.5 86.5 86 84.5 89 C82 93 85 96 80 99.5Z"}),a.jsx("circle",{cx:"80",cy:"71",r:"17.5"}),a.jsx("circle",{cx:"66.5",cy:"77",r:"9.5"}),a.jsx("circle",{cx:"93.5",cy:"77",r:"9.5"}),a.jsx("circle",{cx:"71",cy:"59.5",r:"9"}),a.jsx("circle",{cx:"88",cy:"58.5",r:"10.5"})]}),a.jsx(oa,{mood:"out"}),a.jsx(D,{season:e,mood:"out",part:"face"}),a.jsx(D,{season:e,mood:"out",part:"head"})]})]})}function oa({mood:e}){const r=e==="out"?"var(--dagwick-smoke-ink)":"var(--dagwick-ink)",i={fill:"none",stroke:r,strokeLinecap:"round",strokeLinejoin:"round"};switch(e){case"radiant":return a.jsxs("g",{className:"dagwick-face",children:[a.jsx("path",{d:"M63.5 79.5 q5.5 -8 11 0",...i,strokeWidth:"3.2"}),a.jsx("path",{d:"M85.5 79.5 q5.5 -8 11 0",...i,strokeWidth:"3.2"}),a.jsx("path",{d:"M71.5 85 q8.5 2.6 17 0 q-0.6 9.8 -8.5 9.8 q-7.9 0 -8.5 -9.8z",fill:"var(--dagwick-mouth)"}),a.jsx("path",{d:"M75.2 92.4 q4.8 -3.2 9.6 0 q-1.8 2.4 -4.8 2.4 q-3 0 -4.8 -2.4z",fill:"var(--dagwick-tongue)"}),a.jsx(da,{})]});case"happy":return a.jsxs("g",{className:"dagwick-face",children:[a.jsxs("g",{className:"dagwick-eyes",children:[a.jsx("ellipse",{cx:"69",cy:"78",rx:"4.3",ry:"5.4",fill:r}),a.jsx("ellipse",{cx:"91",cy:"78",rx:"4.3",ry:"5.4",fill:r}),a.jsx("circle",{cx:"70.5",cy:"75.8",r:"1.6",fill:"#fff"}),a.jsx("circle",{cx:"92.5",cy:"75.8",r:"1.6",fill:"#fff"})]}),a.jsx("path",{d:"M72.5 87 q7.5 6.6 15 0",...i,strokeWidth:"3"}),a.jsx(da,{})]});case"calm":return a.jsxs("g",{className:"dagwick-face",children:[a.jsxs("g",{className:"dagwick-eyes",children:[a.jsx("circle",{cx:"69",cy:"79",r:"3.7",fill:r}),a.jsx("circle",{cx:"91",cy:"79",r:"3.7",fill:r}),a.jsx("circle",{cx:"70.2",cy:"77.6",r:"1.1",fill:"#fff"}),a.jsx("circle",{cx:"92.2",cy:"77.6",r:"1.1",fill:"#fff"})]}),a.jsx("path",{d:"M75 89 h10",...i,strokeWidth:"3"})]});case"worried":return a.jsxs("g",{className:"dagwick-face",children:[a.jsx("path",{d:"M62 72 l9.5 -3.4",...i,strokeWidth:"2.6"}),a.jsx("path",{d:"M98 72 l-9.5 -3.4",...i,strokeWidth:"2.6"}),a.jsxs("g",{className:"dagwick-eyes",children:[a.jsx("ellipse",{cx:"69",cy:"80",rx:"4.2",ry:"5",fill:r}),a.jsx("ellipse",{cx:"91",cy:"80",rx:"4.2",ry:"5",fill:r}),a.jsx("circle",{cx:"70.4",cy:"78",r:"1.8",fill:"#fff"}),a.jsx("circle",{cx:"92.4",cy:"78",r:"1.8",fill:"#fff"}),a.jsx("circle",{cx:"67.6",cy:"82.4",r:"0.9",fill:"#fff"}),a.jsx("circle",{cx:"89.6",cy:"82.4",r:"0.9",fill:"#fff"})]}),a.jsx("path",{d:"M73 91 q3.5 -4 7 0 t7 0",...i,strokeWidth:"2.8"}),a.jsxs("g",{className:"dagwick-sweat",children:[a.jsx("path",{d:"M105.5 56 q4.8 7 0 11 q-4.8 -4 0 -11z",fill:"var(--dagwick-tear)"}),a.jsx("circle",{cx:"104.4",cy:"63.6",r:"1",fill:"#fff",opacity:"0.8"})]})]});case"out":return a.jsxs("g",{className:"dagwick-face",children:[a.jsx("path",{d:"M66.5 66 l8 -2.2",...i,strokeWidth:"2.2"}),a.jsx("path",{d:"M93.5 66 l-8 -2.2",...i,strokeWidth:"2.2"}),a.jsx("path",{d:"M68 71.5 q4.2 3.8 8.4 0",...i,strokeWidth:"2.8"}),a.jsx("path",{d:"M83.6 71.5 q4.2 3.8 8.4 0",...i,strokeWidth:"2.8"}),a.jsx("path",{d:"M76 82.5 q4 -3.2 8 0",...i,strokeWidth:"2.6"}),a.jsx("path",{d:"M70 76 q2.6 3.8 0 5.8 q-2.6 -2 0 -5.8z",fill:"var(--dagwick-tear)"})]})}}function da(){return a.jsxs("g",{fill:"var(--dagwick-blush)",opacity:"0.75",children:[a.jsx("ellipse",{cx:"59.5",cy:"86.5",rx:"5.4",ry:"3.3"}),a.jsx("ellipse",{cx:"100.5",cy:"86.5",rx:"5.4",ry:"3.3"})]})}const ta=()=>window.matchMedia?.("(prefers-reduced-motion: reduce)").matches??!1;function oe(e,r=900){const[i,c]=p.useState(ta()?e:0),o=p.useRef(0);return p.useEffect(()=>{if(ta())return c(e);const d=performance.now(),t=o.current;let n=0;const f=h=>{const b=Math.min(1,(h-d)/r);c(t+(e-t)*(1-Math.pow(1-b,3))),b<1?n=requestAnimationFrame(f):o.current=e};n=requestAnimationFrame(f);const y=setTimeout(()=>{cancelAnimationFrame(n),o.current=e,c(e)},r+100);return()=>{cancelAnimationFrame(n),clearTimeout(y)}},[e,r]),i}function sa({score:e,grade:r}){const i=oe(e),c=52,o=2*Math.PI*c;return a.jsxs("div",{className:`dagwick-ring dagwick-grade-${r}`,"aria-label":`Score ${e} out of 100, grade ${r}`,children:[a.jsxs("svg",{width:"132",height:"132",viewBox:"0 0 132 132",children:[a.jsx("circle",{cx:"66",cy:"66",r:c,className:"dagwick-ring-track"}),a.jsx("circle",{cx:"66",cy:"66",r:c,className:"dagwick-ring-fill",strokeDasharray:o,strokeDashoffset:o*(1-i/100),transform:"rotate(-90 66 66)"})]}),a.jsxs("div",{className:"dagwick-ring-label",children:[a.jsx("span",{className:"dagwick-grade",children:r}),a.jsx("span",{className:"dagwick-score",children:Math.floor(i)})]})]})}function de({code:e}){const[r,i]=p.useState(!1),c=async()=>{try{await navigator.clipboard.writeText(e),i(!0),setTimeout(()=>i(!1),1500)}catch{}};return a.jsxs("div",{className:"dagwick-code",children:[a.jsx("pre",{children:a.jsx("code",{children:e})}),a.jsx("button",{className:"dagwick-copy",onClick:c,"aria-label":"Copy code",children:r?"Copied ✓":"Copy"})]})}const te={A:"I'm glowing! ✨",B:"Nice and warm.",C:"Trim my wick?",D:"I'm flickering…",F:"It's dark in here."};function la({grade:e,size:r=150,season:i}){return a.jsxs("div",{className:"dagwick-mascot",children:[a.jsx("div",{className:"dagwick-bubble",children:te[e]}),a.jsx(G,{mood:ja(e),size:r,season:i})]})}function q({title:e,body:r,action:i}){return a.jsxs("div",{className:"dagwick-empty",children:[a.jsx(G,{mood:"out",size:110}),a.jsx("h3",{children:e}),a.jsx("p",{className:"dagwick-muted",children:r}),i]})}function na({label:e="Lighting the wick…"}){return a.jsxs("div",{className:"dagwick-empty dagwick-loading",children:[a.jsx(G,{mood:"calm",size:110}),a.jsx("p",{className:"dagwick-muted",children:e})]})}function ga({grade:e,size:r="md"}){return a.jsx("span",{className:`dagwick-badge dagwick-badge--${e} dagwick-badge--${r}`,children:e})}function se({score:e,grade:r}){const c=2*Math.PI*18;return a.jsxs("div",{className:`dagwick-mini dagwick-grade-${r}`,"aria-label":`Score ${e}, grade ${r}`,children:[a.jsxs("svg",{width:"46",height:"46",viewBox:"0 0 46 46",children:[a.jsx("circle",{cx:"23",cy:"23",r:18,className:"dagwick-ring-track"}),a.jsx("circle",{cx:"23",cy:"23",r:18,className:"dagwick-ring-fill",strokeDasharray:c,strokeDashoffset:c*(1-e/100),transform:"rotate(-90 23 23)"})]}),a.jsx("span",{children:Math.floor(e)})]})}function le({dagId:e,children:r,className:i}){const c=globalThis.ReactRouterDOM?.Link,o=`/dags/${encodeURIComponent(e)}/plugin/${Aa}`;return c?a.jsx(c,{to:o,className:i,children:r}):a.jsx("a",{href:new URL(o.slice(1),document.baseURI).href,className:i,children:r})}const ka=e=>a.jsxs("div",{className:"dagwick-eyebrow",children:[a.jsx("span",{className:"dagwick-brand",children:S})," · ",e]}),k=(e,r=0)=>{const i=Math.sin(e*12.9898+r*78.233)*43758.5453;return i-Math.floor(i)},u=e=>Array.from({length:e},(r,i)=>i),v=e=>`${(e*100).toFixed(1)}%`,w=e=>`${e.toFixed(2)}s`,L=["#f472b6","#60a5fa","#fde047","#4ade80","#c084fc","#fb923c"],pa=["#ef4444","#f59e0b","#22c55e","#3b82f6","#ec4899","#a855f7","#14b8a6"],wa=["ڕ","ڵ","ڤ","ێ","ۆ","ژ","چ","گ","پ","ê","î","û","ş","ç","x","Kurdî","کوردی"];function ne(){return a.jsxs(a.Fragment,{children:[u(28).map(e=>a.jsx("span",{className:"dagwick-flake",style:{left:v(k(e,1)),width:3+k(e,2)*5,height:3+k(e,2)*5,opacity:.5+k(e,3)*.5,animationDuration:`${w(6+k(e,4)*7)}, ${w(2.5+k(e,5)*2)}`,animationDelay:`${w(-k(e,6)*12)}, ${w(-k(e,7)*3)}`}},e)),a.jsx("svg",{className:"dagwick-snowbank",viewBox:"0 0 400 20",preserveAspectRatio:"none",children:a.jsx("path",{d:"M0 20 V10 Q20 2 45 9 T95 8 T150 10 T205 7 T260 10 T320 6 T400 9 V20 Z"})})]})}function ge({style:e}){return a.jsx("span",{className:"dagwick-bat",style:e,children:a.jsx("span",{className:"dagwick-bat-bob",children:a.jsxs("svg",{viewBox:"0 0 40 20",width:"34",height:"17",children:[a.jsx("g",{className:"dagwick-wing-l",children:a.jsx("path",{d:"M20 9 C 14 2, 6 2, 0 6 C 5 7, 7 10, 6 13 C 10 10, 14 11, 20 12 Z"})}),a.jsx("g",{className:"dagwick-wing-r",children:a.jsx("path",{d:"M20 9 C 26 2, 34 2, 40 6 C 35 7, 33 10, 34 13 C 30 10, 26 11, 20 12 Z"})}),a.jsx("ellipse",{cx:"20",cy:"10.5",rx:"3",ry:"4"}),a.jsx("path",{d:"M18 7 l-1 -3 2 2 M22 7 l1 -3 -2 2"})]})})})}function ke(){return a.jsxs(a.Fragment,{children:[a.jsx("span",{className:"dagwick-moon"}),u(7).map(e=>a.jsx(ge,{style:{top:v(.06+k(e,1)*.55),transform:`scale(${.6+k(e,2)*.7})`,animationDuration:w(9+k(e,3)*8),animationDelay:w(-k(e,4)*16)}},e))]})}function fa({n:e=30}){return a.jsx(a.Fragment,{children:u(e).map(r=>a.jsx("span",{className:"dagwick-confetti",style:{left:v(k(r,1)),background:L[r%L.length],animationDuration:`${w(4+k(r,2)*5)}, ${w(1+k(r,3)*2)}`,animationDelay:`${w(-k(r,4)*9)}, 0s`}},r))})}function pe(){return a.jsx(a.Fragment,{children:[{left:"12%",top:"18%",color:"#f472b6",delay:0},{left:"82%",top:"14%",color:"#60a5fa",delay:1.1},{left:"64%",top:"30%",color:"#fde047",delay:2.2}].map((e,r)=>a.jsx("span",{className:"dagwick-firework",style:{left:e.left,top:e.top,animationDelay:w(e.delay)},children:u(12).map(i=>a.jsx("i",{style:{background:e.color,transform:`rotate(${i*30}deg) translateY(-26px)`}},i))},r))})}function we(){return a.jsx(a.Fragment,{children:u(5).map(e=>a.jsx("span",{className:"dagwick-balloon",style:{left:v(.08+k(e,1)*.84),background:L[e%L.length],animationDuration:w(10+k(e,2)*6),animationDelay:w(-k(e,3)*14)}},e))})}function fe(){return a.jsxs(a.Fragment,{children:[u(18).map(e=>a.jsx("span",{className:"dagwick-ember",style:{left:v(.05+k(e,1)*.9),animationDuration:w(4+k(e,2)*4),animationDelay:w(-k(e,3)*8)}},e)),a.jsxs("svg",{className:"dagwick-mountains",viewBox:"0 0 800 120",preserveAspectRatio:"none",children:[a.jsx("path",{className:"far",d:"M0 120 L0 70 L90 30 L170 66 L260 18 L360 64 L450 26 L560 70 L650 22 L740 60 L800 40 L800 120 Z"}),a.jsx("path",{className:"near",d:"M0 120 L0 92 L120 58 L220 90 L330 54 L440 92 L560 60 L690 94 L800 64 L800 120 Z"})]}),[[.325,.6],[.5625,.638],[.8125,.61]].map(([e,r],i)=>a.jsx("span",{className:"dagwick-fire",style:{left:v(e),top:v(r),animationDelay:w(i*.3)}},i)),a.jsx("div",{className:"dagwick-govend",children:u(9).map(e=>a.jsx("span",{className:"dagwick-dancer",style:{animationDelay:w(e*.18)},children:a.jsxs("svg",{viewBox:"0 0 20 36",width:"22",height:"40",children:[a.jsx("circle",{cx:"10",cy:"5",r:"4",fill:"#f1d3b3"}),a.jsx("path",{d:"M6 3 Q10 -1 14 3 L14 5 L6 5 Z",fill:e%2?"#1f2937":"#7c2d12"}),a.jsx("path",{d:"M10 9 L3 32 L17 32 Z",fill:pa[e%pa.length]}),a.jsx("path",{d:"M7 32 L7 35 M13 32 L13 35",stroke:"#1f2937",strokeWidth:"1.6"}),a.jsx("path",{d:"M-1 15 L21 15",stroke:"#f1d3b3",strokeWidth:"2",strokeLinecap:"round"}),e===0&&a.jsx("path",{d:"M-1 15 L-5 6 L1 9 Z",fill:"#facc15"})]})},e))})]})}function ha({n:e=22}){return a.jsx(a.Fragment,{children:u(e).map(r=>a.jsx("span",{className:"dagwick-star",style:{left:v(k(r,1)),top:v(k(r,2)*.7),animationDelay:w(-k(r,3)*3),animationDuration:w(2+k(r,4)*2.5)}},r))})}function he(){return a.jsx("div",{className:"dagwick-hanging",children:[.2,.55,.85].map((e,r)=>a.jsx("span",{style:{left:v(e),height:26+r*14,animationDelay:w(r*.6)},children:a.jsxs("svg",{viewBox:"0 0 16 26",width:"16",height:"26",children:[a.jsx("path",{d:"M8 0 L8 4",stroke:"#e9c46a"}),a.jsx("path",{d:"M3 6 L13 6 L11 4 L5 4 Z",fill:"#e9c46a"}),a.jsx("path",{d:"M3 6 Q0 13 3 20 L13 20 Q16 13 13 6 Z",fill:"#fbbf24",opacity:".85"}),a.jsx("path",{d:"M4 20 L12 20 L10 23 L6 23 Z",fill:"#e9c46a"})]})},r))})}function xe(){return a.jsxs("svg",{className:"dagwick-bunting",viewBox:"0 0 800 40",preserveAspectRatio:"none",children:[a.jsx("path",{d:"M0 4 Q400 34 800 4",fill:"none",stroke:"#e9c46a",strokeWidth:"1.5"}),u(16).map(e=>{const r=25+e*48,i=4+30*(1-((r-400)/400)**2)*.95;return a.jsx("path",{d:`M${r-10} ${i} L${r+10} ${i} L${r} ${i+16} Z`,fill:L[e%L.length]},e)})]})}function be(){return a.jsx(a.Fragment,{children:u(16).map(e=>a.jsx("span",{className:"dagwick-letter",style:{left:v(.04+k(e,1)*.92),fontSize:13+k(e,2)*11,animationDuration:w(7+k(e,3)*6),animationDelay:w(-k(e,4)*12)},children:wa[e%wa.length]},e))})}const ye={christmas:()=>a.jsx(ne,{}),halloween:()=>a.jsx(ke,{}),"new-year":()=>a.jsxs(a.Fragment,{children:[a.jsx(pe,{}),a.jsx(fa,{})]}),birthday:()=>a.jsxs(a.Fragment,{children:[a.jsx(we,{}),a.jsx(fa,{n:18})]}),newroz:()=>a.jsx(fe,{}),ramadan:()=>a.jsxs(a.Fragment,{children:[a.jsx(ha,{}),a.jsx(he,{})]}),eid:()=>a.jsxs(a.Fragment,{children:[a.jsx(xe,{}),a.jsx(ha,{n:14})]}),"language-day":()=>a.jsx(be,{})};function xa({season:e}){return e?a.jsx("div",{className:`dagwick-fx dagwick-fx--${e.id}`,"aria-hidden":"true",children:ye[e.id]()}):null}function ba({state:e}){const{season:r,available:i,hidden:c,setHidden:o}=e;return r?a.jsxs("div",{className:"dagwick-greeting",children:[a.jsx("span",{"aria-hidden":"true",children:r.icon}),a.jsx("span",{children:r.greeting}),a.jsx("button",{className:"dagwick-greeting-hide",onClick:()=>o(!0),title:"Hide seasonal decorations",children:"Hide"})]}):i&&c?a.jsxs("button",{className:"dagwick-greeting-show",onClick:()=>o(!1),children:[i.icon," Show the ",i.name," mood"]}):null}const I={eid:{id:"eid",name:"Eid",greeting:"Eid Mubarak!",icon:"🍪"},newroz:{id:"newroz",name:"Newroz",greeting:"Happy Newroz!",icon:"🔥"},"language-day":{id:"language-day",name:"Kurdish Language Day",greeting:"Kurdish Language Day",icon:"✍️"},christmas:{id:"christmas",name:"Christmas",greeting:"Merry Christmas!",icon:"🎄"},"new-year":{id:"new-year",name:"New Year",greeting:"Happy New Year!",icon:"🎉"},halloween:{id:"halloween",name:"Halloween",greeting:"Happy Halloween!",icon:"🎃"},ramadan:{id:"ramadan",name:"Ramadan",greeting:"Ramadan Kareem",icon:"🌙"},birthday:{id:"birthday",name:"Dagwick's birthday",greeting:"Dagwick turns another year older!",icon:"🎂"}},ya=["newroz","eid","language-day","christmas","new-year","halloween","ramadan","birthday"],F=(e,r,i,c)=>{const o=e*100+r,d=i[0]*100+i[1],t=c[0]*100+c[1];return d<=t?o>=d&&o<=t:o>=d||o<=t};function ma(e){try{const r=new Intl.DateTimeFormat("en-US-u-ca-islamic-umalqura",{month:"numeric",day:"numeric"}).formatToParts(e),i=Number(r.find(o=>o.type==="month")?.value),c=Number(r.find(o=>o.type==="day")?.value);return i&&c?{month:i,day:c}:void 0}catch{return}}const me={eid:e=>{const r=ma(e);return!!r&&(r.month===10&&r.day<=3||r.month===12&&r.day>=10&&r.day<=13)},newroz:e=>F(e.getMonth()+1,e.getDate(),[3,19],[3,23]),"language-day":e=>e.getMonth()+1===5&&e.getDate()===15,christmas:e=>F(e.getMonth()+1,e.getDate(),[12,18],[12,26]),"new-year":e=>F(e.getMonth()+1,e.getDate(),[12,31],[1,2]),halloween:e=>F(e.getMonth()+1,e.getDate(),[10,24],[11,1]),ramadan:e=>ma(e)?.month===9,birthday:e=>e.getMonth()+1===11&&e.getDate()===8};function ve(e,r="auto"){if(r==="off")return;const c=(r==="auto"?ya:ya.filter(o=>r.includes(o))).find(o=>me[o](e));return c?I[c]:void 0}function va(e){return!!e&&e in I}const H="dagwick.moods.hidden";function ue(){try{return window.localStorage.getItem(H)==="1"}catch{return!1}}function Ne(e){try{e?window.localStorage.setItem(H,"1"):window.localStorage.removeItem(H)}catch{}}function Ce(){const e=new URLSearchParams(window.location.search).get("dagwick_mood");return e==="everyday"?null:va(e)?I[e]:void 0}function ua(){const[e]=p.useState(Ce),[r,i]=p.useState(()=>e??void 0),[c,o]=p.useState(ue);return p.useEffect(()=>{if(e!==void 0)return;const t=new AbortController;return Wa(t.signal).then(n=>{const f=n.seasonal_moods==="auto"||n.seasonal_moods==="off"?n.seasonal_moods:n.seasonal_moods.filter(va);i(ve(new Date,f))}).catch(()=>{}),()=>t.abort()},[e]),{season:c?void 0:r,available:r,hidden:c,setHidden:t=>{Ne(t),o(t)}}}const W={reliability:"Reliability",observability:"Observability",scheduling:"Scheduling",ownership:"Ownership",structure:"Structure",performance:"Performance",security:"Security"},Na={fail:0,warn:1,pass:2,ack:3,skip:4},Me={A:"Shining bright. This DAG is in great shape.",B:"A steady flame. A few small things to polish.",C:"Burning, but dimly. Some important habits are missing.",D:"Flickering. This DAG needs attention soon.",F:"The flame has gone out. Start with the red items below."},Le=[["A",90],["B",75],["C",60],["D",40]],$=e=>e.weight-e.points,Ca=(e,r)=>Na[e.status]-Na[r.status]||$(r)-$(e);function $e({dagId:e}){const{data:r,error:i,reload:c}=R(o=>Da(e,o),[e]);return i?a.jsx(q,{title:"Couldn't check this DAG",body:i,action:a.jsx("button",{className:"dagwick-btn",onClick:c,children:"Try again"})}):r?a.jsx(Se,{report:r},r.dag_id):a.jsx(na,{})}function ze(e){const r=[...Le].reverse().find(([,n])=>n>e.score);if(!r)return;const[i,c]=r;let o=c/100*e.max_points-e.points;const d=[],t=e.checks.filter(n=>n.status==="fail"||n.status==="warn").sort((n,f)=>$(f)-$(n));for(const n of t){if(o<=1e-9)break;d.push(n),o-=$(n)}return o<=1e-9?{grade:i,picks:d}:void 0}function Se({report:e}){const r=ua(),i=r.season,c=e.counts.fail+e.counts.warn,[o,d]=p.useState(c?"attention":"all"),[t,n]=p.useState(()=>{const l=e.checks.filter(m=>m.fix).sort(Ca),N=l.filter(m=>m.status==="fail");return new Set((N.length?N:l.slice(0,2)).map(m=>m.id))}),f=l=>n(N=>{const m=new Set(N);return m.delete(l)||m.add(l),m}),y=p.useMemo(()=>Fe(e.checks),[e]),h=p.useMemo(()=>ze(e),[e]),b=p.useMemo(()=>e.checks.filter(l=>o==="all"?!0:o==="passed"?l.status==="pass":l.status==="fail"||l.status==="warn").sort(Ca),[e,o]),C=l=>{d("attention"),n(N=>new Set(N).add(l)),requestAnimationFrame(()=>document.getElementById(`dagwick-check-${l}`)?.scrollIntoView({behavior:"smooth",block:"center"}))};return a.jsxs(a.Fragment,{children:[a.jsxs("section",{className:`dagwick-hero dagwick-grade-${e.grade}${i?` dagwick-season dagwick-season-${i.id}`:""}`,children:[a.jsx(xa,{season:i}),a.jsx(la,{grade:e.grade,season:i?.id}),a.jsxs("div",{className:"dagwick-hero-text",children:[a.jsx(ba,{state:r}),ka("DAG health"),a.jsx("h2",{className:"dagwick-dag",children:e.dag_id}),a.jsx("p",{className:"dagwick-headline",children:Me[e.grade]}),a.jsxs("div",{className:"dagwick-chips",children:[a.jsx(E,{status:"pass",n:e.counts.pass,label:"passing"}),a.jsx(E,{status:"warn",n:e.counts.warn,label:"to improve"}),a.jsx(E,{status:"fail",n:e.counts.fail,label:"failing"}),e.counts.ack>0&&a.jsx(E,{status:"ack",n:e.counts.ack,label:"acknowledged"})]})]}),a.jsx("div",{className:"dagwick-hero-side",children:a.jsx(sa,{score:e.score,grade:e.grade})})]}),h?a.jsxs("section",{className:"dagwick-goal",children:[a.jsxs("div",{className:"dagwick-goal-text",children:[a.jsx("span",{className:"dagwick-goal-step",children:"Next step"}),"Fix ",h.picks.length===1?"this check":`these ${h.picks.length} checks`," to reach"," ",a.jsx("span",{className:`dagwick-badge dagwick-badge--${h.grade}`,children:h.grade})]}),a.jsx("div",{className:"dagwick-goal-picks",children:h.picks.map(l=>a.jsxs("button",{className:"dagwick-pick",onClick:()=>C(l.id),children:[l.title," ",a.jsxs("span",{className:"dagwick-pick-gain",children:["+",$(l).toFixed(l.points%1?1:0)]})]},l.id))})]}):e.score<100?a.jsx("section",{className:"dagwick-goal dagwick-goal--top",children:a.jsxs("div",{className:"dagwick-goal-text",children:[a.jsx("span",{className:"dagwick-goal-step",children:"Top grade"})," Polish the last ",c," item",c===1?"":"s"," for a perfect 100."]})}):null,a.jsx("section",{className:"dagwick-cats","aria-label":"Score by category",children:y.map(l=>a.jsxs("div",{className:"dagwick-cat",children:[a.jsxs("div",{className:"dagwick-cat-head",children:[a.jsx("span",{children:W[l.id]??l.id}),a.jsxs("span",{className:"dagwick-muted",children:[Math.round(l.pct),"%"]})]}),a.jsx("div",{className:"dagwick-bar",children:a.jsx("div",{className:"dagwick-bar-fill",style:{width:`${l.pct}%`,background:We(l.pct)}})})]},l.id))}),a.jsxs("section",{className:"dagwick-list",children:[a.jsxs("div",{className:"dagwick-tabs",role:"tablist",children:[a.jsxs(P,{active:o==="attention",onClick:()=>d("attention"),children:["Needs attention ",a.jsx("span",{className:"dagwick-count",children:c})]}),a.jsxs(P,{active:o==="all",onClick:()=>d("all"),children:["All checks ",a.jsx("span",{className:"dagwick-count",children:e.checks.length})]}),a.jsxs(P,{active:o==="passed",onClick:()=>d("passed"),children:["Passed ",a.jsx("span",{className:"dagwick-count",children:e.counts.pass})]})]}),b.length===0?a.jsx("div",{className:"dagwick-clear",children:"Nothing here. Every check in this view is passing. ✨"}):a.jsx("ul",{className:"dagwick-checks",children:b.map(l=>a.jsx(De,{check:l,open:t.has(l.id),onToggle:()=>f(l.id)},l.id))})]}),a.jsxs("footer",{className:"dagwick-foot dagwick-muted",children:[e.points," / ",e.max_points," points · scored automatically from the latest parsed version of this DAG · ",S," ",j]})]})}const Ae={pass:"✓",warn:"!",fail:"✕",skip:"–",ack:"~"},V=8;function De({check:e,open:r,onToggle:i}){const[c,o]=p.useState(!1),d=!!e.fix,t=c?e.items:e.items.slice(0,V);return a.jsxs("li",{id:`dagwick-check-${e.id}`,className:`dagwick-check dagwick-check--${e.status}${r&&d?" is-open":""}`,children:[a.jsx("span",{className:"dagwick-icon","aria-label":e.status,children:Ae[e.status]}),a.jsxs("div",{className:"dagwick-check-body",children:[a.jsxs("button",{className:"dagwick-check-head",onClick:d?i:void 0,disabled:!d,"aria-expanded":d?r:void 0,children:[a.jsx("span",{className:"dagwick-check-title",children:e.title}),a.jsx("span",{className:"dagwick-tag",children:W[e.category]??e.category}),a.jsxs("span",{className:"dagwick-pts",children:[e.status==="skip"||e.status==="ack"?"n/a":`${e.points} / ${e.weight}`,d&&a.jsx("span",{className:"dagwick-caret",children:r?"▾":"▸"})]})]}),a.jsx("div",{className:"dagwick-check-msg",children:e.message}),e.ack_reason&&a.jsxs("div",{className:"dagwick-ack",children:[a.jsx("span",{className:"dagwick-ack-label",children:"Acknowledged"}),e.ack_reason]}),e.ack_note&&a.jsx("div",{className:"dagwick-ack-note",children:e.ack_note}),r&&d&&a.jsxs("div",{className:"dagwick-detail",children:[e.items.length>0&&a.jsxs("div",{className:"dagwick-items",children:[a.jsx("span",{className:"dagwick-items-label",children:"Affected"}),t.map(n=>a.jsx("code",{className:"dagwick-item",children:n},n)),e.items.length>V&&a.jsx("button",{className:"dagwick-more",onClick:()=>o(!c),children:c?"show less":`+${e.items.length-V} more`})]}),a.jsxs("div",{className:"dagwick-fix",children:[a.jsx("span",{className:"dagwick-fix-label",children:"How to fix"}),e.fix,e.example&&a.jsx(de,{code:e.example})]})]})]})]})}function E({status:e,n:r,label:i}){return a.jsxs("span",{className:`dagwick-chip dagwick-chip--${e}`,children:[a.jsx("strong",{children:r})," ",i]})}function P({active:e,onClick:r,children:i}){return a.jsx("button",{role:"tab","aria-selected":e,className:`dagwick-tab${e?" is-active":""}`,onClick:r,children:i})}function Fe(e){const r=new Map;for(const i of e){if(i.status==="skip"||i.status==="ack")continue;const c=r.get(i.category)??{earned:0,possible:0};c.earned+=i.points,c.possible+=i.weight,r.set(i.category,c)}return Object.keys(W).filter(i=>r.has(i)).concat([...r.keys()].filter(i=>!(i in W))).map(i=>{const c=r.get(i);return{id:i,pct:c.possible?c.earned/c.possible*100:0}})}function We(e){return e>=90?"var(--dagwick-pass)":e>=60?"var(--dagwick-warn)":"var(--dagwick-fail)"}const Ma=["A","B","C","D","F"],Ee={A:"Shining",B:"Steady",C:"Dim",D:"Flickering",F:"Out"},Ze={A:"The whole fleet is shining.",B:"The fleet burns steady.",C:"The fleet glows dimly.",D:"The fleet is flickering.",F:"The fleet has gone dark."},Te=[{id:"worst",label:"Needs care"},{id:"best",label:"Healthiest"},{id:"name",label:"A–Z"}],Q=3,Ye=6;function Be(e){return e>=90?"A":e>=75?"B":e>=60?"C":e>=40?"D":"F"}function Oe(){const{data:e,error:r,reload:i}=R(c=>Fa(c),[]);return r?a.jsx(q,{title:"Couldn't load the fleet",body:r,action:a.jsx("button",{className:"dagwick-btn",onClick:i,children:"Try again"})}):e?e.dags.length===0?a.jsx(q,{title:"No DAGs yet",body:"Once Airflow parses a DAG you can read, it shows up here."}):a.jsx(_e,{dags:e.dags,truncated:e.truncated}):a.jsx(na,{label:"Checking every DAG…"})}function _e({dags:e,truncated:r}){const i=ua(),c=i.season,[o,d]=p.useState(""),[t,n]=p.useState(),[f,y]=p.useState(),[h,b]=p.useState("worst"),C=e.reduce((s,g)=>s+g.score,0)/e.length,l=Be(C),N=p.useMemo(()=>Object.fromEntries(Ma.map(s=>[s,e.filter(g=>g.grade===s).length])),[e]),m=N.A+N.B,$a=e.reduce((s,g)=>s+(g.counts.ack??0),0),Z=e.length-m,za=p.useMemo(()=>{const s=new Map;for(const g of e)for(const x of g.issues){const J=s.get(x.id)??{id:x.id,title:x.title,dags:0,fails:0};J.dags+=1,x.status==="fail"&&(J.fails+=1),s.set(x.id,J)}return[...s.values()].sort((g,x)=>x.dags-g.dags||x.fails-g.fails).slice(0,Ye)},[e]),K=p.useMemo(()=>{const s=o.trim().toLowerCase();return e.filter(g=>(!t||g.grade===t)&&(!f||g.issues.some(x=>x.id===f.id))&&(!s||g.dag_id.toLowerCase().includes(s)||g.owners.toLowerCase().includes(s))).sort((g,x)=>h==="name"?g.dag_id.localeCompare(x.dag_id):h==="best"?x.score-g.score:g.score-x.score)},[e,o,t,f,h]),Ie=!!(t||f||o.trim());return a.jsxs(a.Fragment,{children:[a.jsxs("section",{className:`dagwick-hero dagwick-grade-${l}${c?` dagwick-season dagwick-season-${c.id}`:""}`,children:[a.jsx(xa,{season:c}),a.jsx(la,{grade:l,season:c?.id}),a.jsxs("div",{className:"dagwick-hero-text",children:[a.jsx(ba,{state:i}),ka("Fleet health"),a.jsx("h2",{className:"dagwick-dag",children:"All DAGs"}),a.jsxs("p",{className:"dagwick-headline",children:[Ze[l]," ",Z===0?"Every DAG is healthy.":`${Z} of ${e.length} ${e.length===1?"DAG needs":"DAGs need"} care.`]}),a.jsxs("div",{className:"dagwick-stats",children:[a.jsx(z,{value:e.length,label:"DAGs"}),a.jsx(z,{value:(Math.floor(C*10)/10).toFixed(1),label:"average score"}),a.jsx(z,{value:Z,label:"need care (C–F)",tone:Z?"fail":void 0}),a.jsx(z,{value:m,label:"healthy (A–B)",tone:m?"pass":void 0}),$a>0&&a.jsx(z,{value:$a,label:"acknowledged"})]})]}),a.jsxs("div",{className:"dagwick-hero-side",children:[a.jsx(sa,{score:C,grade:l}),a.jsx("span",{className:"dagwick-muted dagwick-ring-caption",children:"fleet average"})]})]}),a.jsx("section",{className:"dagwick-grades","aria-label":"Filter by grade",children:Ma.map(s=>{const g=N[s],x=t===s;return a.jsxs("button",{className:`dagwick-gcard dagwick-gcard--${s}${x?" is-active":""}${t&&!x?" is-dim":""}`,disabled:g===0,onClick:()=>n(x?void 0:s),"aria-pressed":x,children:[a.jsx(ga,{grade:s,size:"lg"}),a.jsxs("div",{className:"dagwick-gcard-text",children:[a.jsx("span",{className:"dagwick-gcard-n",children:g}),a.jsx("span",{className:"dagwick-muted",children:Ee[s]})]}),a.jsx("div",{className:"dagwick-gcard-bar",children:a.jsx("div",{style:{width:`${g/e.length*100}%`}})})]},s)})}),a.jsxs("div",{className:"dagwick-fleet-grid",children:[a.jsxs("section",{className:"dagwick-list",children:[a.jsxs("div",{className:"dagwick-toolbar",children:[a.jsxs("div",{className:"dagwick-search-wrap",children:[a.jsxs("svg",{viewBox:"0 0 24 24",width:"16",height:"16","aria-hidden":"true",children:[a.jsx("circle",{cx:"11",cy:"11",r:"7",fill:"none",stroke:"currentColor",strokeWidth:"2"}),a.jsx("path",{d:"M20 20l-4-4",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round"})]}),a.jsx("input",{className:"dagwick-search",type:"search",placeholder:"Search DAGs or owners",value:o,onChange:s=>d(s.target.value),"aria-label":"Search DAGs"})]}),a.jsx("div",{className:"dagwick-seg",role:"radiogroup","aria-label":"Sort",children:Te.map(s=>a.jsx("button",{role:"radio","aria-checked":h===s.id,className:h===s.id?"is-active":"",onClick:()=>b(s.id),children:s.label},s.id))})]}),Ie&&a.jsxs("div",{className:"dagwick-filters",children:[a.jsxs("span",{className:"dagwick-muted",children:[K.length," of ",e.length," DAGs"]}),t&&a.jsxs(U,{onClear:()=>n(void 0),children:["Grade ",t]}),f&&a.jsx(U,{onClear:()=>y(void 0),children:f.title}),o.trim()&&a.jsxs(U,{onClear:()=>d(""),children:["“",o.trim(),"”"]})]}),K.length===0?a.jsx("div",{className:"dagwick-clear",children:"No DAG matches."}):a.jsx("ul",{className:"dagwick-rows",children:K.map(s=>a.jsx("li",{children:a.jsxs(le,{dagId:s.dag_id,className:`dagwick-row dagwick-row--${s.grade}`,children:[a.jsx(se,{score:s.score,grade:s.grade}),a.jsxs("div",{className:"dagwick-row-main",children:[a.jsxs("div",{className:"dagwick-row-title",children:[a.jsx("span",{className:"dagwick-row-name",children:s.dag_id}),s.is_paused&&a.jsx("span",{className:"dagwick-tag",children:"paused"})]}),a.jsxs("div",{className:"dagwick-row-sub dagwick-muted",children:[s.owners&&a.jsx("span",{children:s.owners}),a.jsx("span",{children:s.counts.fail+s.counts.warn===0?"All checks passing":`${s.counts.fail} failing · ${s.counts.warn} to improve`}),s.counts.ack>0&&a.jsxs("span",{children:[s.counts.ack," acknowledged"]})]}),s.issues.length>0&&a.jsxs("div",{className:"dagwick-row-issues",children:[s.issues.slice(0,Q).map(g=>a.jsx("span",{className:`dagwick-ichip dagwick-ichip--${g.status}`,children:g.title},g.id)),s.issues.length>Q&&a.jsxs("span",{className:"dagwick-ichip dagwick-ichip--more",children:["+",s.issues.length-Q]})]})]}),a.jsx(ga,{grade:s.grade}),a.jsx("span",{className:"dagwick-row-go","aria-hidden":"true",children:"›"})]})},s.dag_id))})]}),a.jsx("aside",{className:"dagwick-side",children:a.jsxs("div",{className:"dagwick-side-card",children:[a.jsx("h3",{className:"dagwick-side-title",children:"Most common issues"}),za.length===0?a.jsx("p",{className:"dagwick-muted dagwick-side-empty",children:"No issues anywhere. ✨"}):a.jsx("ul",{className:"dagwick-common",children:za.map(s=>{const g=f?.id===s.id;return a.jsx("li",{children:a.jsxs("button",{className:`dagwick-common-item${g?" is-active":""}`,onClick:()=>y(g?void 0:{id:s.id,title:s.title}),"aria-pressed":g,children:[a.jsxs("div",{className:"dagwick-common-head",children:[a.jsx("span",{children:s.title}),a.jsxs("span",{className:"dagwick-muted",children:[s.dags,"/",e.length]})]}),a.jsx("div",{className:"dagwick-bar",children:a.jsx("div",{className:"dagwick-bar-fill",style:{width:`${s.dags/e.length*100}%`,background:s.fails>=s.dags/2?"var(--dagwick-fail)":"var(--dagwick-warn)"}})})]})},s.id)})}),a.jsx("p",{className:"dagwick-side-hint dagwick-muted",children:"Click an issue to see which DAGs have it."})]})})]}),a.jsxs("footer",{className:"dagwick-foot dagwick-muted",children:[r?`Showing the first ${e.length} DAGs. `:"","Scored automatically from the latest parsed version of each DAG. · ",S," ",j]})]})}function z({value:e,label:r,tone:i}){return a.jsxs("div",{className:`dagwick-stat${i?` dagwick-stat--${i}`:""}`,children:[a.jsx("span",{className:"dagwick-stat-value",children:e}),a.jsx("span",{className:"dagwick-stat-label",children:r})]})}function U({children:e,onClear:r}){return a.jsxs("button",{className:"dagwick-fchip",onClick:r,"aria-label":"Remove filter",children:[e," ",a.jsx("span",{"aria-hidden":"true",children:"✕"})]})}const Ge=`
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
  --dagwick-flame-tip: #fbbf24;
  --dagwick-flame-core: #fde68a;
  --dagwick-flame-heart: #fffbe3;
  --dagwick-flame-cool: #60a5fa;
  --dagwick-spark: #f59e0b;
  --dagwick-moon: #f2b632;
  --dagwick-metal: #e0a040;
  --dagwick-metal-dark: #8a5a1c;
  --dagwick-wax: #f5e6cc;
  --dagwick-wax-top: #fff8ea;
  --dagwick-wax-pool: #f0d9ae;
  --dagwick-wax-shade: #d6bb91;
  --dagwick-wax-edge: #cfb48a;
  --dagwick-wick: #3f2a1d;
  --dagwick-ink: #3b1f12;
  --dagwick-mouth: #6b1d0e;
  --dagwick-tongue: #ff8f80;
  --dagwick-blush: #ff8a65;
  --dagwick-tear: #7cc0ff;
  --dagwick-smoke-hi: #cdd1dc;
  --dagwick-smoke-lo: #9ba0b3;
  --dagwick-smoke-ink: #394056;
  --dagwick-shadow: rgba(60, 40, 20, 0.12);
  color: var(--dagwick-text);
  font: inherit;
  padding: 8px 4px 24px;
  width: 100%;
  max-width: 1440px;
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
  --dagwick-spark: #fde68a;
  --dagwick-moon: #fde68a;
  --dagwick-wax-edge: transparent;
  --dagwick-smoke-hi: #d9dce8;
  --dagwick-smoke-lo: #a3a8bb;
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
.dagwick-hero.dagwick-grade-D, .dagwick-hero.dagwick-grade-F { background: var(--dagwick-bg); }
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
  position: relative; margin-bottom: -2px; padding: 5px 12px; border-radius: 12px; font-size: 13px; white-space: nowrap;
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
}

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
.dagwick-season-halloween { --dagwick-flame: #22c55e; --dagwick-flame-deep: #15803d; --dagwick-flame-tip: #4ade80; --dagwick-flame-core: #d9f99d; --dagwick-flame-heart: #f7fee7; --dagwick-spark: #a3e635; }
.dagwick-season-newroz { --dagwick-flame: #f97316; --dagwick-flame-deep: #dc2626; --dagwick-flame-tip: #fb923c; --dagwick-flame-core: #fde68a; }

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

/* The mascot: Wick, a little flame (keyframes are prefixed dagwick-m-) */
.dagwick-wick { flex: none; overflow: visible; }
.dagwick-spirit { transform-box: fill-box; transform-origin: 50% 100%; animation: dagwick-m-ignite .7s cubic-bezier(.2, 1.5, .4, 1) both; }
.dagwick-loading .dagwick-spirit { animation: dagwick-m-kindle 1.1s ease-in-out infinite alternate; }
.dagwick-hop { transform-box: fill-box; transform-origin: 50% 100%; }
.dagwick-wick:hover .dagwick-hop { animation: dagwick-m-hop .55s cubic-bezier(.3, 1.4, .5, 1); }
.dagwick-flame { transform-box: fill-box; transform-origin: 50% 100%; animation: dagwick-m-sway 2.8s ease-in-out infinite; }
.dagwick-core { transform-box: fill-box; transform-origin: 50% 100%; animation: dagwick-m-pulse 1.7s ease-in-out infinite; }
.dagwick-licks path { transform-box: fill-box; transform-origin: 50% 100%; animation: dagwick-m-lick 1.1s ease-in-out infinite alternate; }
.dagwick-arm { transform-box: fill-box; transform-origin: 85% 100%; animation: dagwick-m-cheer 1.5s ease-in-out infinite alternate; }
.dagwick-arm + .dagwick-arm { transform-origin: 15% 100%; animation-name: dagwick-m-cheer-r; }
.dagwick-licks path:nth-child(2) { animation-delay: -.5s; }
.dagwick-glow { transform-box: fill-box; transform-origin: center; animation: dagwick-m-breathe 3s ease-in-out infinite; }
.dagwick-sparkles path { transform-box: fill-box; transform-origin: center; animation: dagwick-m-twinkle 2.2s ease-in-out infinite; }
.dagwick-sparkles path:nth-child(2) { animation-delay: .55s; }
.dagwick-sparkles path:nth-child(3) { animation-delay: 1.1s; }
.dagwick-sparkles path:nth-child(4) { animation-delay: 1.65s; }
.dagwick-eyes { transform-box: fill-box; transform-origin: center; animation: dagwick-m-blink 4.2s infinite; }
.dagwick-wick--calm .dagwick-flame { animation-duration: 3.8s; }
.dagwick-wick--worried .dagwick-flame { animation: dagwick-m-shiver .9s ease-in-out infinite; }
.dagwick-wick--worried .dagwick-glow { animation: dagwick-m-gutter 1.3s steps(3) infinite; }
.dagwick-sweat { transform-box: fill-box; animation: dagwick-m-sweat 2.4s ease-in infinite; }
.dagwick-ghost { transform-box: fill-box; transform-origin: 50% 100%; animation: dagwick-m-drift 4s ease-in-out infinite; }
.dagwick-puff { transform-box: fill-box; transform-origin: center; animation: dagwick-m-puff 3.4s ease-out infinite; }
.dagwick-puff:nth-child(2) { animation-delay: 1.1s; }
.dagwick-puff:nth-child(3) { animation-delay: 2.2s; }
.dagwick-ember { transform-box: fill-box; transform-origin: center; animation: dagwick-m-ember 2s ease-in-out infinite; }
.dagwick-ember-halo { transform-box: fill-box; transform-origin: center; animation: dagwick-m-halo 2s ease-in-out infinite; }
.dagwick-spider { transform-box: fill-box; transform-origin: 50% 0; animation: dagwick-m-dangle 3.2s ease-in-out infinite; }
.dagwick-wick--out .dagwick-vessel { filter: brightness(.86) saturate(.85); }
@keyframes dagwick-m-ignite { from { opacity: 0; transform: scale(.2); } to { opacity: 1; transform: scale(1); } }
@keyframes dagwick-m-kindle { from { opacity: .7; transform: scale(.7); } to { opacity: 1; transform: scale(1); } }
@keyframes dagwick-m-hop { 0%,100% { transform: translateY(0) scale(1); } 35% { transform: translateY(-7px) scale(.97, 1.04); } 70% { transform: translateY(0) scale(1.03, .97); } }
@keyframes dagwick-m-sway { 0%,100% { transform: rotate(-2.2deg) scaleY(1); } 50% { transform: rotate(2.2deg) scaleY(1.035); } }
@keyframes dagwick-m-pulse { 0%,100% { transform: scale(1); } 50% { transform: scale(1.03, 1.045); } }
@keyframes dagwick-m-cheer { from { transform: rotate(7deg) scaleY(.94); } to { transform: rotate(-9deg) scaleY(1.06); } }
@keyframes dagwick-m-cheer-r { from { transform: rotate(-7deg) scaleY(.94); } to { transform: rotate(9deg) scaleY(1.06); } }
@keyframes dagwick-m-lick { from { transform: scaleY(.82) rotate(-4deg); } to { transform: scaleY(1.12) rotate(5deg); } }
@keyframes dagwick-m-breathe { 0%,100% { opacity: .85; transform: scale(1); } 50% { opacity: 1; transform: scale(1.06); } }
@keyframes dagwick-m-twinkle { 0%,100% { opacity: .15; transform: scale(.5); } 50% { opacity: 1; transform: scale(1) rotate(20deg); } }
@keyframes dagwick-m-blink { 0%,92%,100% { transform: scaleY(1); } 95% { transform: scaleY(.1); } }
@keyframes dagwick-m-shiver { 0%,100% { transform: rotate(-3deg) scale(1, .97); } 20% { transform: rotate(2deg) scale(.985, 1.02); } 40% { transform: rotate(-1.5deg) scale(1.01, .96); } 60% { transform: rotate(3.2deg) scale(.99, 1.03); } 80% { transform: rotate(-2.4deg) scale(1, .98); } }
@keyframes dagwick-m-gutter { 0%,100% { opacity: .9; } 50% { opacity: .45; } }
@keyframes dagwick-m-sweat { 0% { opacity: 0; transform: translateY(-3px); } 20% { opacity: 1; } 75% { opacity: 1; transform: translateY(9px); } 100% { opacity: 0; transform: translateY(12px); } }
@keyframes dagwick-m-drift { 0%,100% { transform: translate(0, 0) rotate(-1.5deg); } 50% { transform: translate(1px, -2.5px) rotate(1.5deg); } }
@keyframes dagwick-m-puff { 0% { opacity: 0; transform: translateY(8px) scale(.5); } 30% { opacity: .55; } 100% { opacity: 0; transform: translateY(-12px) scale(1.25); } }
@keyframes dagwick-m-ember { 0%,100% { opacity: .6; transform: scale(.85); } 50% { opacity: 1; transform: scale(1.15); } }
@keyframes dagwick-m-halo { 0%,100% { opacity: .15; transform: scale(.8); } 50% { opacity: .4; transform: scale(1.2); } }
@keyframes dagwick-m-dangle { 0%,100% { transform: translateY(0); } 50% { transform: translateY(5px); } }
@media (prefers-reduced-motion: reduce) { .dagwick * { animation: none !important; transition: none !important; } }

@container dagwick (max-width: 720px) {
  .dagwick-hero { grid-template-columns: auto auto; justify-content: center; justify-items: center; text-align: center; gap: 16px 32px; }
  .dagwick-hero-text { grid-column: 1 / -1; order: 1; }
  .dagwick-chips, .dagwick-stats { justify-content: center; }
}
`;function qe({dagId:e}){return a.jsxs("div",{className:"dagwick",children:[a.jsx("style",{children:Ge}),e?a.jsx($e,{dagId:e},e):a.jsx(Oe,{})]})}function X(e){return a.jsx(qe,{...e})}const La=globalThis;return La[S]=X,La.AirflowPlugin=X,X})(ReactJSXRuntime,React);
