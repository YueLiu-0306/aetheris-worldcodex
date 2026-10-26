
// progressive enhancement flag
if (typeof document!=='undefined') document.documentElement.classList.add('js');

// svg namespace (shared)
const NS='http://www.w3.org/2000/svg';

// aether particles
const cv=document.getElementById('particles'),ctx=cv.getContext('2d');
let W,H,ps=[];
function resize(){W=cv.width=innerWidth;H=cv.height=innerHeight}
resize();addEventListener('resize',resize);
for(let i=0;i<90;i++)ps.push({x:Math.random()*W,y:Math.random()*H,r:Math.random()*1.8+.4,
  vx:(Math.random()-.5)*.25,vy:-Math.random()*.35-.05,o:Math.random()*.5+.1,ph:Math.random()*6.28});
(function tick(){ctx.clearRect(0,0,W,H);
  for(const p of ps){p.x+=p.vx;p.y+=p.vy;p.ph+=.02;
    if(p.y<-10){p.y=H+10;p.x=Math.random()*W}
    if(p.x<-10)p.x=W+10;if(p.x>W+10)p.x=-10;
    const a=p.o*(.6+.4*Math.sin(p.ph));
    ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,6.28);
    ctx.fillStyle=`rgba(180,150,255,${a})`;
    ctx.shadowColor='rgba(157,123,255,.9)';ctx.shadowBlur=8;ctx.fill();ctx.shadowBlur=0;}
  requestAnimationFrame(tick)})();

// reading progress
const bar=document.getElementById('progress');
addEventListener('scroll',()=>{const h=document.documentElement;bar.style.width=(h.scrollTop/(h.scrollHeight-h.clientHeight)*100)+'%'},{passive:true});

if (document.getElementById('pdetail')) {
  // clickable profile map
  const PD=[
   {t:'表面层 · SURFACE',s:'已定居 · S-0 ~ S-5',lv:'#9d7bff',p:'约 180 平方公里的可居住外壳，按以太密度分为六级。人类的一切生活、纷争与探索都发生在这里。',rows:[['分区','S-0 边缘带 → S-5 峰顶，越深入以太越浓'],['定居点','P-0 渡口镇至 P-5 静水哨站共 6 处'],['通行','S-0~S-2 持证自由；S-3 需审批；S-4+ 禁入'],['威胁','区域危险等级 Ⅰ ~ Ⅲ']]},
   {t:'中层 · MID',s:'AEC 授权探索区',lv:'#d4b06a',p:'需 AEC 授权方可进入的探索区域。镇压级异构体的领域，多处裂隙连接更深处的空间。潮母——已知最大的异构体——栖息于此。',rows:[['状态','仅 IAIS 授权探索行动可进入'],['已知威胁','镇压级异构体、潮母（灾变级）'],['记录','1995 年首次内部探索，裂隙入口位于 S-4'],['规则','个人不得擅自进入中层裂隙']]},
   {t:'深层 · DEEP',s:'未知 · 全部封控',lv:'#ff6b8a',p:'无人生还记录。所有已知入口均已封控。',rows:[['状态','全部入口封控'],['记录','无'],['目击','无'],['备注','唯一确定的事实是：没有人回来过']]},
   {t:'核心 · CORE',s:'观察记录：无',lv:'var(--glow)',p:'如果深层是未知，那么核心就是未知中的未知。连「它是否存在」都只是推测。信号假说的支持者认为，那道人类尚无法理解的「声音」正是从这里发出。',rows:[['状态','纯理论推测'],['证据','无'],['假说','积蓄 / 生长 / 信号']]}
  ];
  const pdBox=document.getElementById('pdetail');
  function renderPD(i){const d=PD[i];pdBox.innerHTML=`<h3 style="--lv:${d.lv};color:${d.lv==='var(--glow)'?'var(--glow)':d.lv}">${d.t}</h3><div class="pd-status" style="--lv:${d.lv};color:${d.lv==='var(--glow)'?'var(--gold)':d.lv};border-color:${d.lv==='var(--glow)'?'rgba(212,176,106,.4)':d.lv}">${d.s}</div><p>${d.p}</p>`+d.rows.map(r=>`<div class="pd-row"><b>${r[0]}</b>　${r[1]}</div>`).join('');
  document.querySelectorAll('.pzone').forEach(z=>z.classList.toggle('active',z.dataset.z==i));}
  renderPD(0);
  document.querySelectorAll('.pzone').forEach(z=>z.addEventListener('click',()=>renderPD(+z.dataset.z)));

}
if (document.getElementById('erFill')) {
  // erosion simulator
  let er=12;
  const erF=document.getElementById('erFill'),erV=document.getElementById('erVal'),erS=document.getElementById('erStage'),erL=document.getElementById('erLog');
  const LOGS={safe:'侵蚀值目前处于安全范围。',mid:'AMD 建议：尽快进行一次以太净化处理。',high:'⚠ 指端已出现结晶化征兆。不可逆损伤正在累积。',dead:'■ 侵蚀值已达上限。这位探索者的故事到此为止。'};
  function setER(n,note){er=Math.max(0,Math.min(100,n));erF.style.width=er+'%';erV.textContent=Math.round(er);
   let stage,col,bg;
   if(er<=30){stage='初期 · 偶发头痛耳鸣';col='var(--aether)';bg='linear-gradient(90deg,var(--aether),var(--aether-deep))';}
   else if(er<=60){stage='中期 · 需定期净化';col='var(--gold)';bg='linear-gradient(90deg,var(--gold),#8a6a2a)';}
   else{stage='后期 · 结晶化征兆';col='var(--danger)';bg='linear-gradient(90deg,var(--danger),#a03050)';}
   erS.textContent=stage;erS.style.color=col;erS.style.borderColor=col;erF.style.background=bg;erV.style.color=col;
   const prev=erL.dataset.prev||'';erL.dataset.prev=note||LOGS.safe;erL.textContent=note||LOGS[er<=30?'safe':er<=60?'mid':er<100?'high':'dead'];}
  setER(12);
  document.getElementById('erUse').onclick=()=>{const d=Math.round(8+Math.random()*7);setER(er+d,`◈ 异能使用 -${d}。干涉阶单次持续不超过 15 分钟——每一次都在透支你自己。`)};
  document.getElementById('erPurge').onclick=()=>{if(er<8){erL.textContent='侵蚀值过低，净化处理没有意义。';return}setER(er-15,'✦ AMD 以太净化完成（-15，约 800 国际货币/次）。初期可加速消退，后期无解。')};
  document.getElementById('erTouch').onclick=()=>{const d=Math.round(18+Math.random()*12);setER(er+d,`⚠ 与异构体接触 +${d}。以太灼伤与侵蚀同步累积——下次带齐 ECW 再进 S-2。`)};
  document.getElementById('erReset').onclick=()=>{setER(12,'你在 AM-001 上已居住三个月。侵蚀值目前处于安全范围。')};

}
if (document.getElementById('calGrid')) {
  // ---------- event calendar ----------
  // 滞夜 = 满月前后各1天；以 2000-01-06 18:14 新月为基准，朔望月 29.53059 天
  const SYN=29.53059, NM0=Date.UTC(2000,0,6,18,14);
  function fullMoons(y,m){const out=[];const first=Date.UTC(y,m,1),last=Date.UTC(y,m+1,1);
   let t=NM0;const step=SYN*864e5;let base=NM0+Math.floor((first-NM0)/step)*step;
   for(let t0=base-2*step;t0<last+2*step;t0+=step){const fm=t0+14.765*864e5;if(fm>=first&&fm<last)out.push(new Date(fm))}
   return out}
  function pulses(y,m){const n=((y*12+m)*2654435761>>>0)%3;const out=[];for(let i=0;i<n;i++){const h=((y*12+m)*40503+i*915488749>>>0)%28;out.push(1+h)}return out}
  let cy=2025,cm=9; // 2025-10 起始
  const WD=['日','一','二','三','四','五','六'];
  function drawCal(){const grid=document.getElementById('calGrid'),label=document.getElementById('calMonth');
   label.textContent=`${cy} 年 ${cm+1} 月`;
   const first=new Date(cy,cm,1),days=new Date(cy,cm+1,0).getDate(),shift=first.getDay();
   const stays=fullMoons(cy,cm).flatMap(d=>[d.getUTCDate()-1,d.getUTCDate(),d.getUTCDate()+1]);
   const pls=pulses(cy,cm);
   let html=WD.map(w=>`<div class="cal-wd">${w}</div>`).join('');
   for(let i=0;i<shift;i++)html+='<div class="cal-day out"></div>';
   for(let d=1;d<=days;d++){const isStay=stays.includes(d),isPl=pls.includes(d);
    const marks=(isStay?'<i class="m-stay"></i>':'')+(isPl?'<i class="m-pulse"></i>':'');
    html+=`<div class="cal-day" data-d="${d}" data-s="${isStay?1:0}" data-p="${isPl?1:0}">${d}<div class="mk">${marks}</div></div>`}
   grid.innerHTML=html;
   grid.querySelectorAll('.cal-day[data-d]').forEach(el=>el.addEventListener('mouseenter',()=>{
    const d=el.dataset.d,s=el.dataset.s==='1',p=el.dataset.p==='1';
    document.getElementById('calTip').textContent=(s||p)?`${cm+1} 月 ${d} 日 — `+(s?'【滞夜】满月前后，全表面以太波动爆发约 14 小时，异构体异常活跃，适格者异能可能不受控自动释放。':'')+(s&&p?' ':'')+(p?'【脉冲】不定期全表面异常增强约 3 分钟，异构体狂暴。滞夜期间遭遇脉冲是探索者最恶劣的噩梦。':''):`${cm+1} 月 ${d} 日 — 平静的一天。但 AM-001 上，「平静」从来只是暂时的。`}))}
  document.getElementById('calPrev').onclick=()=>{cm--;if(cm<0){cm=11;cy--}drawCal()};
  document.getElementById('calNext').onclick=()=>{cm++;if(cm>11){cm=0;cy++}drawCal()};
  drawCal();

}
if (document.getElementById('fgraph')) {
  // ---------- faction graph ----------
  const FN=[
   {id:'iais',n:'IAIS',x:400,y:64,c:'#9d7bff',d:'<b>IAIS</b>　名义上的「政府」，国际以太研究学会。学术派与行政派互相倾轧，决策经常前后矛盾；对各国基地只有名义管辖权。'},
   {id:'nations',n:'七国基地',x:150,y:180,c:'#8a9fd4',d:'<b>七国研究分部</b>　明面上隶属 IAIS，实际各自向本国汇报。研究优先权与区域影响力的博弈从未停止。'},
   {id:'eic',n:'EIC',x:650,y:180,c:'#d4b06a',d:'<b>EIC</b>　以太工业联合体。垄断 60% 物资进口，最大非官方雇主；近年资助绕过官方审批的独立探索行动。口碑两极。'},
   {id:'council',n:'定居者议会',x:250,y:330,c:'#c9b4ff',d:'<b>定居者议会</b>　没有法律地位，却是唯一真正代表定居者利益的组织。核心是三位「说话的人」。'},
   {id:'confluence',n:'汇流',x:430,y:230,c:'#e8dcff',d:'<b>汇流</b>　适格者联盟。认为 AM-001 是有意志的存在，探索应以倾听与共鸣为方式，不服从任何官方框架。'},
   {id:'tide',n:'潮汐帮',x:610,y:360,c:'#5b3fd4',d:'<b>潮汐帮</b>　地下网络。偷渡、走私、黑市、情报，以及为「不想被找到」的人提供藏身处。没有帮主，只有暗号与信任链。'},
   {id:'free',n:'自由探索者',x:390,y:400,c:'#b78aff',d:'<b>自由探索者</b>　不是组织，而是一个人群：3~5 人小队接受各方委托，从脊线营地走向 S-3 与更深处。最自由，也最脆弱。'}];
  const FE=[
   ['iais','nations','名义管辖 · 实际博弈','IAIS 对七国基地只有名义管辖权，各国实际各自向本国汇报。'],
   ['iais','eic','监管 · 摩擦','EIC 的采集与独立探索行动不断触碰 IAIS 的审批红线，但经济依赖让双方保持克制。'],
   ['iais','council','诉求 · 施压','议会没有法律地位，只能通过每月公开会议向 IAIS 施压，争取定居者权益。'],
   ['iais','confluence','不服从 · 默许','汇流不服从任何官方框架；IAIS 视其边缘化而未强力取缔。'],
   ['iais','tide','猫鼠','IAIS 的安保巡逻部（SPD）与潮汐帮的长期猫鼠游戏——抓不完，也灭不绝。'],
   ['eic','free','雇佣 · 委托','EIC 资助绕过官方审批的「独立探索行动」，自由探索者是主要执行者。'],
   ['eic','council','物价 · 矛盾','EIC 垄断 60% 物资进口并握有定价权，定居者不满但无可奈何；议会反复抗议收效甚微。'],
   ['tide','free','情报 · 黑市','在码头街市场说对暗号，自然会有人来找你——潮汐帮是自由探索者情报与违禁装备的重要来源。'],
   ['confluence','free','同行者','汇流尊重自由探索者的独立，部分成员以个人身份加入探索队，只为离 AM-001 更近一点。']];
  const svg=document.getElementById('fgraph');
  function fgInit(){
   FE.forEach((e,i)=>{const a=FN.find(f=>f.id===e[0]),b=FN.find(f=>f.id===e[1]);
    const ln=document.createElementNS(NS,'line');ln.setAttribute('x1',a.x);ln.setAttribute('y1',a.y);ln.setAttribute('x2',b.x);ln.setAttribute('y2',b.y);
    ln.setAttribute('class','fedge');ln.setAttribute('stroke','rgba(157,123,255,.3)');ln.setAttribute('stroke-width','1.4');
    ln.addEventListener('click',()=>{document.getElementById('fgDetail').innerHTML=`<b>${a.n} ⇄ ${b.n}</b>　${e[3]}`});
    const t=document.createElementNS(NS,'text');t.setAttribute('x',(a.x+b.x)/2);t.setAttribute('y',(a.y+b.y)/2-6);
    t.setAttribute('text-anchor','middle');t.setAttribute('font-size','11');t.setAttribute('fill','rgba(201,180,255,.55)');t.textContent=e[2];
    svg.appendChild(ln);svg.appendChild(t)});
   FN.forEach(f=>{const g=document.createElementNS(NS,'g');g.setAttribute('class','fnode');
    const c=document.createElementNS(NS,'circle');c.setAttribute('cx',f.x);c.setAttribute('cy',f.y);c.setAttribute('r',f.n.length>3?34:30);
    c.setAttribute('fill','rgba(13,11,26,.9)');c.setAttribute('stroke',f.c);c.setAttribute('stroke-width','2');
    const t=document.createElementNS(NS,'text');t.setAttribute('x',f.x);t.setAttribute('y',f.y+5);t.setAttribute('text-anchor','middle');
    t.setAttribute('font-size','13');t.setAttribute('fill','#e8dcff');t.textContent=f.n;
    g.appendChild(c);g.appendChild(t);
    g.addEventListener('click',()=>{document.querySelectorAll('.fnode').forEach(n=>n.classList.remove('active'));g.classList.add('active');document.getElementById('fgDetail').innerHTML=f.d});
    svg.appendChild(g)})}
  fgInit();

}
if (document.getElementById('smap')) {
  // ---------- surface overview map ----------
  const MZ=[
   {id:'S-0',lv:'#8a9fd4',rx:432,ry:222,t:[452,262],n:'边缘带',st:'已定居',p:'最外侧约一公里宽的环形带，以太密度最低，异常与异构体极少，是定居者的主要居住区。',r:[['通行','持证人员自由活动'],['配置','单人可行'],['威胁','日常级异常']]},
   {id:'S-1',lv:'#9d7bff',rx:362,ry:186,t:[452,262],n:'渡口区',st:'已开发',p:'港口码头与物资中转设施所在，AM-001 与外部世界的交通枢纽，异构体偶发。',r:[['通行','持证自由活动'],['配置','单人可行'],['定居点','P-0 渡口镇 · P-3 研究基地区']]},
   {id:'S-2',lv:'#b78aff',rx:292,ry:150,t:[452,262],n:'低洼地',st:'已测绘',p:'起伏的半固态丘陵，异构体活动中等，多处自然裂隙可观察中层。',r:[['通行','持证自由活动'],['配置','3~5 人小队'],['定居点','P-2 脊线营地 · P-4 汇流聚落']]},
   {id:'S-3',lv:'#d4b06a',rx:222,ry:114,t:[452,262],n:'静水原',st:'限入',p:'凹陷处积聚半透明紫色的「以太湖」，温热、水位异常波动。异构体活动频繁。',r:[['通行','需 S-3 额外审批'],['配置','正式小队 + 许可'],['定居点','P-5 静水哨站']]},
   {id:'S-4',lv:'#ff8f6b',rx:152,ry:78,t:[452,262],n:'高密度区',st:'限制进入',p:'肉眼可见空气中流动的光纹，久留致非适格者眩晕恶心。1995 年首次内部探索的裂隙入口在此。',r:[['通行','禁入，除 AEC 授权'],['配置','AEC 级队伍 + 全面装备'],['威胁','区域危险等级 Ⅲ+']]},
   {id:'S-5',lv:'#ff6b8a',rx:82,ry:42,t:[452,262],n:'峰顶',st:'禁入',p:'海拔约 1200 米的最高点。登顶者报告「能听到声音」——声源无法定位。',r:[['通行','禁入'],['配置','仅 AEC 特殊授权'],['传闻','「能听到声音」']]}];
  const MN=[
   {id:'P-0',x:612,y:398,n:'P-0 渡口镇',pop:'约 2000 人 · S-1',p:'最大定居点，商业与行政中心，物资和人员的集散地。酒馆「锚」每月一次的议会在此召开。',r:[['区域','S-1 渡口区'],['角色','商业与行政中心']]},
   {id:'P-1',x:704,y:312,n:'P-1 滞光公寓',pop:'约 30 人 · S-0/S-1 交界',p:'原 AERI 前沿观测站改建的小型居住点，以太觉醒概率异常地高。顶层住着一位从不露面的「说话的人」。',r:[['区域','S-0/S-1 交界'],['角色','原 AERI 观测站']]},
   {id:'P-2',x:286,y:362,n:'P-2 脊线营地',pop:'约 150 人 · S-2',p:'自由探索者基地，向 S-3 及更深出发的起点，不受任何单一势力管辖。',r:[['区域','S-2 低洼地'],['角色','探索者基地']]},
   {id:'P-3',x:560,y:196,n:'P-3 研究基地区',pop:'约 800 人 · S-1',p:'七国研究基地的集合区，各自独立、彼此竞争，共享渡口设施。',r:[['区域','S-1 渡口区'],['角色','七国基地集合区']]},
   {id:'P-4',x:258,y:252,n:'P-4 汇流聚落',pop:'约 80 人 · S-2 深处',p:'汇流组织的非官方聚落，适格者自发建立，不受官方管辖。',r:[['区域','S-2 深处'],['角色','汇流聚落']]},
   {id:'P-5',x:386,y:268,n:'P-5 静水哨站',pop:'约 20 人 · S-3 边缘',p:'IAIS 的观测哨站，科研轮驻，也是进入 S-3 的审批关口。',r:[['区域','S-3 边缘'],['角色','观测哨站 + 审批关口']]}];
  const smap=document.getElementById('smap');
  function mapInit(){
   MZ.forEach(z=>{const g=document.createElementNS(NS,'g');g.setAttribute('class','mzone');g.dataset.id=z.id;
    const e=document.createElementNS(NS,'ellipse');e.setAttribute('cx',452);e.setAttribute('cy',262);
    e.setAttribute('rx',z.rx);e.setAttribute('ry',z.ry);e.setAttribute('fill',z.lv);e.setAttribute('fill-opacity','0.07');
    e.setAttribute('stroke',z.lv);e.setAttribute('stroke-opacity','0.5');
    const t=document.createElementNS(NS,'text');t.setAttribute('x',452);t.setAttribute('y',262-z.ry+18);
    t.setAttribute('text-anchor','middle');t.setAttribute('font-size','13');t.setAttribute('fill',z.lv);t.textContent=z.id;
    g.appendChild(e);g.appendChild(t);
    g.addEventListener('click',()=>{smap.querySelectorAll('.active').forEach(x=>x.classList.remove('active'));g.classList.add('active');showMD(z)});
    smap.appendChild(g)});
   MN.forEach(m=>{const g=document.createElementNS(NS,'g');g.setAttribute('class','mnode');
    const ring=document.createElementNS(NS,'circle');ring.setAttribute('cx',m.x);ring.setAttribute('cy',m.y);ring.setAttribute('r',10);ring.setAttribute('fill','none');ring.setAttribute('stroke','var(--gold)');ring.setAttribute('stroke-width','1');
    const dot=document.createElementNS(NS,'circle');dot.setAttribute('class','mdot');dot.setAttribute('cx',m.x);dot.setAttribute('cy',m.y);dot.setAttribute('r',4.5);
    const t=document.createElementNS(NS,'text');t.setAttribute('x',m.x);t.setAttribute('y',m.y-16);t.setAttribute('text-anchor','middle');t.textContent=m.n;
    g.appendChild(ring);g.appendChild(dot);g.appendChild(t);
    g.addEventListener('click',()=>{smap.querySelectorAll('.active').forEach(x=>x.classList.remove('active'));g.classList.add('active');showMD(m)});
    smap.appendChild(g)});
   showMD({n:'巨构体 AM-001 · 表面总览',st:'点击区域或定居点查看详情',p:'地图按以太密度由外向内分为六级。越深入，以太越浓；越浓，越危险——但回报也越丰厚。',r:[['面积','约 180 km²'],['海拔','S-5 峰顶约 1200 米'],['状态','以太密度缓慢上升中']]})}
  function showMD(d){document.getElementById('mapDetail').innerHTML=`<h3>${d.n}</h3><div class="md-tag">${d.st||d.pop}</div><p>${d.p}</p>`+(d.r||[]).map(r=>`<div class="pd-row"><b>${r[0]}</b>　${r[1]}</div>`).join('')}
  mapInit();

}
// nav shrink
const nav=document.getElementById('nav');
addEventListener('scroll',()=>nav.classList.toggle('shrunk',scrollY>60));

// reveal on scroll
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('on');io.unobserve(e.target)}}),{threshold:.08});
document.querySelectorAll('.reveal').forEach(el=>io.observe(el));

// ---------- nav active state ----------
(function(){
  const here=(location.pathname.split('/').pop()||'index.html');
  const links=document.querySelectorAll('#nav .links a');
  if(here!=='index.html') return; // subpages keep their static .on
  links.forEach(a=>{if(a.getAttribute('href').startsWith('index.html#'))a.classList.remove('on')});
  const spy=new IntersectionObserver(es=>{
    es.forEach(e=>{if(e.isIntersecting){
      links.forEach(a=>a.classList.toggle('on',a.getAttribute('href')==='#'+e.target.id||a.getAttribute('href')==='index.html#'+e.target.id));
    }});
  },{rootMargin:'-35% 0px -55% 0px'});
  ['ether','history','am001'].forEach(id=>{const el=document.getElementById(id);if(el)spy.observe(el)});
})();
